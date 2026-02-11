<!--
  ==========================================================================
  COMPONENTE - GRÁFICO DE TENDÊNCIA MENSAL (PLANO PRO)
  ==========================================================================
  Propósito: Gráfico de linha mostrando evolução receitas/despesas ao longo do tempo
-->

<template>
  <q-card flat bordered class="monthly-trend-chart">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="show_chart" class="q-mr-sm" />
        {{ title }}
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
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Registrar componentes do Chart.js
Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler)

// ==========================================================================
// PROPS
// ==========================================================================
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: 'Evolução Mensal'
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
let chartInstance = null

// ==========================================================================
// COMPUTED
// ==========================================================================
const monthlyData = computed(() => {
  return props.data.monthlyData || []
})

const hasData = computed(() => {
  return monthlyData.value.length > 0
})

// ==========================================================================
// METHODS
// ==========================================================================
const formatMonthLabel = (monthString) => {
  if (!monthString) return ''
  const [year, month] = monthString.split('-')
  const date = new Date(year, parseInt(month) - 1)
  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}

const createChart = async () => {
  await nextTick()
  
  if (!chartCanvas.value || !hasData.value) return

  // Destruir gráfico anterior se existir
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthlyData.value.map(item => formatMonthLabel(item.month)),
      datasets: [
        {
          label: 'Receitas',
          data: monthlyData.value.map(item => item.income),
          borderColor: '#21BA45',
          backgroundColor: 'rgba(33, 186, 69, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Despesas',
          data: monthlyData.value.map(item => item.expense),
          borderColor: '#C10015',
          backgroundColor: 'rgba(193, 0, 21, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Saldo',
          data: monthlyData.value.map(item => item.balance),
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.4,
          fill: true,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || ''
              const value = context.parsed.y || 0
              return `${label}: ${formatCurrency(value)}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value)
            }
          }
        }
      }
    }
  })
}

// ==========================================================================
// WATCHERS
// ==========================================================================
watch(() => props.data, () => {
  createChart()
}, { deep: true })

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(() => {
  createChart()
})
</script>

<style scoped lang="scss">
.monthly-trend-chart {
  .chart-container {
    padding: 1rem 0;
    min-height: 300px;
  }
}
</style>
