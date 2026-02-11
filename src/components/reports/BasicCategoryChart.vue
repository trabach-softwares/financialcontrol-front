<!--
  ==========================================================================
  COMPONENTE - GRÁFICO BÁSICO POR CATEGORIA (PLANO GRATUITO)
  ==========================================================================
  Propósito: Gráfico de pizza simples limitado a 3 categorias
-->

<template>
  <q-card flat bordered class="basic-category-chart">
    <q-card-section>
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6">
          <q-icon name="pie_chart" class="q-mr-sm" />
          Despesas por Categoria
        </div>
        
        <!-- Badge de limitação para plano gratuito -->
        <q-badge color="grey-7" label="Top 3 Categorias" />
      </div>

      <!-- Gráfico -->
      <div v-if="hasData" class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center q-pa-xl text-grey-6">
        <q-icon name="folder_open" size="64px" class="q-mb-md" />
        <div class="text-subtitle1">Sem dados para exibir</div>
        <div class="text-caption">
          Adicione transações para visualizar o gráfico
        </div>
      </div>

      <!-- Lista de categorias -->
      <div v-if="hasData" class="category-list q-mt-md">
        <q-separator class="q-mb-md" />
        <div 
          v-for="(category, index) in limitedCategories" 
          :key="index"
          class="category-item q-mb-sm"
        >
          <div class="row items-center justify-between">
            <div class="col-auto row items-center q-gutter-sm">
              <div 
                class="color-indicator"
                :style="{ backgroundColor: chartColors[index] }"
              ></div>
              <span class="text-weight-medium">{{ category.name }}</span>
            </div>
            <div class="col-auto text-right">
              <div class="text-weight-bold">{{ formatCurrency(category.total) }}</div>
              <div class="text-caption text-grey-6">
                {{ category.count }} transaç{{ category.count === 1 ? 'ão' : 'ões' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Indicador de mais categorias -->
        <div v-if="hasMoreCategories" class="q-mt-md text-center text-grey-6">
          <q-icon name="info" class="q-mr-xs" />
          <span class="text-caption">
            + {{ remainingCategoriesCount }} categoria(s) não exibida(s) no plano gratuito
          </span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useCurrency } from 'src/composables/useCurrency'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

// Registrar componentes do Chart.js
Chart.register(ArcElement, Tooltip, Legend)

// ==========================================================================
// PROPS
// ==========================================================================
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      categories: []
    })
  },
  maxCategories: {
    type: Number,
    default: 3
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

const chartColors = [
  '#1976D2', // Azul
  '#F57C00', // Laranja
  '#7B1FA2', // Roxo
]

// ==========================================================================
// COMPUTED
// ==========================================================================
const limitedCategories = computed(() => {
  const expenseCategories = props.data.categories
    ?.filter(cat => cat.type === 'expense') || []
  
  return expenseCategories.slice(0, props.maxCategories)
})

const hasData = computed(() => {
  return limitedCategories.value.length > 0
})

const hasMoreCategories = computed(() => {
  const totalCategories = props.data.categories
    ?.filter(cat => cat.type === 'expense')?.length || 0
  return totalCategories > props.maxCategories
})

const remainingCategoriesCount = computed(() => {
  const totalCategories = props.data.categories
    ?.filter(cat => cat.type === 'expense')?.length || 0
  return totalCategories - props.maxCategories
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
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: limitedCategories.value.map(cat => cat.name),
      datasets: [{
        data: limitedCategories.value.map(cat => cat.total),
        backgroundColor: chartColors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed || 0
              return `${label}: ${formatCurrency(value)}`
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
.basic-category-chart {
  .chart-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem 0;
  }

  .category-list {
    .category-item {
      padding: 8px 0;
      transition: background-color 0.2s;
      border-radius: 4px;
      padding: 8px 12px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }

    .color-indicator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
  }
}
</style>
