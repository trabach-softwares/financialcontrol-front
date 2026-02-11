<!--
  ==========================================================================
  COMPONENTE - GRÁFICO AVANÇADO DE CATEGORIAS (PLANO PRO)
  ==========================================================================
  Propósito: Gráfico de barras/pizza com todas as categorias
-->

<template>
  <q-card flat bordered class="advanced-category-chart">
    <q-card-section>
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6">
          <q-icon :name="chartIcon" class="q-mr-sm" />
          {{ title }}
        </div>
        
        <q-btn-toggle
          v-model="chartType"
          toggle-color="primary"
          :options="[
            { label: 'Barras', value: 'bar', icon: 'bar_chart' },
            { label: 'Pizza', value: 'pie', icon: 'pie_chart' }
          ]"
          dense
          unelevated
        />
      </div>

      <!-- Gráfico -->
      <div v-if="hasData" class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center q-pa-xl text-grey-6">
        <q-icon name="folder_open" size="64px" class="q-mb-md" />
        <div class="text-subtitle1">Sem dados para exibir</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useCurrency } from 'src/composables/useCurrency'
import { 
  Chart, 
  BarElement, 
  CategoryScale,
  LinearScale,
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js'

// Registrar componentes do Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend)

// ==========================================================================
// PROPS
// ==========================================================================
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'bar',
    validator: (value) => ['bar', 'pie'].includes(value)
  },
  title: {
    type: String,
    default: 'Despesas por Categoria'
  }
})

// ==========================================================================
// COMPOSABLES
// ==========================================================================
const { formatCurrency } = useCurrency()

// ==========================================================================
// STATE
// ==========================================================================
const chartCanvas = ref(null)
const chartType = ref(props.type)
let chartInstance = null

const chartColors = [
  '#1976D2', '#F57C00', '#7B1FA2', '#388E3C', '#D32F2F',
  '#0288D1', '#FFA000', '#512DA8', '#689F38', '#C2185B',
  '#0097A7', '#F57F17', '#5E35B1', '#AFB42B', '#E64A19'
]

// ==========================================================================
// COMPUTED
// ==========================================================================
const expenseCategories = computed(() => {
  return props.data.categories
    ?.filter(cat => cat.type === 'expense') || []
})

const hasData = computed(() => {
  return expenseCategories.value.length > 0
})

const chartIcon = computed(() => {
  return chartType.value === 'bar' ? 'bar_chart' : 'pie_chart'
})

// ==========================================================================
// METHODS
// ==========================================================================
const createChart = async () => {
  await nextTick()
  
  if (!chartCanvas.value || !hasData.value) return

  // Destruir gráfico anterior se existir
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  
  const config = {
    type: chartType.value === 'pie' ? 'doughnut' : 'bar',
    data: {
      labels: expenseCategories.value.map(cat => cat.name),
      datasets: [{
        label: 'Valor',
        data: expenseCategories.value.map(cat => cat.total),
        backgroundColor: chartColors,
        borderWidth: chartType.value === 'pie' ? 2 : 0,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: chartType.value === 'pie',
          position: 'right'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed.y || context.parsed || 0
              return `${label}: ${formatCurrency(value)}`
            }
          }
        }
      },
      scales: chartType.value === 'bar' ? {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value)
            }
          }
        }
      } : undefined
    }
  }
  
  chartInstance = new Chart(ctx, config)
}

// ==========================================================================
// WATCHERS
// ==========================================================================
watch(() => props.data, () => {
  createChart()
}, { deep: true })

watch(chartType, () => {
  createChart()
})

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(() => {
  createChart()
})
</script>

<style scoped lang="scss">
.advanced-category-chart {
  .chart-container {
    padding: 1rem 0;
    min-height: 300px;
  }
}
</style>
