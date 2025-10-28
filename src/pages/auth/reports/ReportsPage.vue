<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="col">
        <h4 class="text-h4 q-ma-none text-weight-bold">
          <q-icon name="assessment" class="q-mr-sm" color="primary" />
          Relatórios e Análises
        </h4>
        <p class="text-subtitle1 text-grey-6 q-ma-none q-mt-xs">
          Visualize insights detalhados das suas finanças e acompanhe tendências
        </p>
      </div>
      <div class="col-auto">
        <q-btn-dropdown
          color="primary"
          icon="file_download"
          label="Exportar"
          :disable="!hasData"
        >
          <q-list>
            <q-item clickable v-close-popup @click="exportReport('pdf')">
              <q-item-section avatar>
                <q-icon name="picture_as_pdf" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Exportar PDF</q-item-label>
                <q-item-label caption>Relatório completo</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item clickable v-close-popup @click="exportReport('excel')">
              <q-item-section avatar>
                <q-icon name="table_view" color="positive" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Exportar Excel</q-item-label>
                <q-item-label caption>Dados para análise</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item clickable v-close-popup @click="exportReport('csv')">
              <q-item-section avatar>
                <q-icon name="description" color="info" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Exportar CSV</q-item-label>
                <q-item-label caption>Dados brutos</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <!-- Filters -->
    <q-card class="shadow-2 q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="filter_list" class="q-mr-sm" />
          Filtros e Período
        </div>
        
        <div class="row q-col-gutter-md">
          <!-- Date Range -->
          <div class="col-12 col-md-4">
            <q-select
              v-model="filters.period"
              :options="periodOptions"
              label="Período"
              filled
              emit-value
              map-options
              @update:model-value="updateDateRange"
            >
              <template v-slot:prepend>
                <q-icon name="date_range" />
              </template>
            </q-select>
          </div>

          <!-- Start Date -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.startDate"
              label="Data Inicial"
              filled
              mask="##/##/####"
              @update:model-value="loadReports"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filters.startDate" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- End Date -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.endDate"
              label="Data Final"
              filled
              mask="##/##/####"
              @update:model-value="loadReports"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filters.endDate" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Summary Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="shadow-2 bg-positive text-white">
          <q-card-section>
            <div class="text-h6">
              <q-icon name="trending_up" class="q-mr-sm" />
              Total de Receitas
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">
              {{ formatCurrency(summary.totalIncome) }}
            </div>
            <div class="text-caption opacity-80">
              {{ summary.incomeCount }} transações
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="shadow-2 bg-negative text-white">
          <q-card-section>
            <div class="text-h6">
              <q-icon name="trending_down" class="q-mr-sm" />
              Total de Despesas
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">
              {{ formatCurrency(summary.totalExpense) }}
            </div>
            <div class="text-caption opacity-80">
              {{ summary.expenseCount }} transações
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="shadow-2" :class="summary.balance >= 0 ? 'bg-info' : 'bg-warning'" text-color="white">
          <q-card-section>
            <div class="text-h6">
              <q-icon name="account_balance" class="q-mr-sm" />
              Saldo Líquido
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">
              {{ formatCurrency(summary.balance) }}
            </div>
            <div class="text-caption opacity-80">
              {{ summary.balance >= 0 ? 'Positivo' : 'Negativo' }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="shadow-2 bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">
              <q-icon name="receipt_long" class="q-mr-sm" />
              Total de Transações
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">
              {{ summary.totalTransactions }}
            </div>
            <div class="text-caption opacity-80">
              No período selecionado
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <!-- Revenue vs Expenses Chart -->
      <div class="col-12 col-lg-8">
        <q-card class="shadow-2 full-height">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="show_chart" class="q-mr-sm" />
              Evolução Financeira
            </div>
            <div style="height: 400px;">
              <canvas ref="timelineChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Category Distribution -->
      <div class="col-12 col-lg-4">
        <q-card class="shadow-2 full-height">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="pie_chart" class="q-mr-sm" />
              Por Categoria
            </div>
            <div style="height: 400px;">
              <canvas ref="categoryChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Detailed Analysis -->
    <div class="row q-col-gutter-lg">
      <!-- Monthly Comparison -->
      <div class="col-12 col-lg-6">
        <q-card class="shadow-2">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="compare" class="q-mr-sm" />
              Comparação Mensal
            </div>

            <q-list separator>
              <q-item
                v-for="month in monthlyComparison"
                :key="month.month"
              >
                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{ month.month }}
                  </q-item-label>
                  <q-item-label caption>
                    Receitas: {{ formatCurrency(month.income) }} | 
                    Despesas: {{ formatCurrency(month.expenses) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="column items-end">
                    <div 
                      class="text-weight-bold"
                      :class="month.balance >= 0 ? 'text-positive' : 'text-negative'"
                    >
                      {{ formatCurrency(month.balance) }}
                    </div>
                    <q-icon 
                      :name="month.trend === 'up' ? 'trending_up' : month.trend === 'down' ? 'trending_down' : 'trending_flat'"
                      :color="month.trend === 'up' ? 'positive' : month.trend === 'down' ? 'negative' : 'grey'"
                      size="sm"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Category Analysis -->
      <div class="col-12 col-lg-6">
        <q-card class="shadow-2">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="category" class="q-mr-sm" />
              Análise por Categoria
            </div>

            <div class="q-gutter-md">
              <div
                v-for="category in categoryAnalysis"
                :key="category.name"
                class="row items-center q-py-sm"
              >
                <div class="col">
                  <div class="text-weight-medium">{{ category.name }}</div>
                  <div class="text-caption text-grey-6">
                    {{ category.count }} transações
                  </div>
                </div>
                <div class="col-auto">
                  <div class="text-weight-bold" :class="getAmountColor(category.total)">
                    {{ formatCurrency(category.total) }}
                  </div>
                </div>
                <div class="col-12 q-mt-xs">
                  <q-linear-progress
                    :value="category.percentage / 100"
                    :color="category.type === 'income' ? 'positive' : 'negative'"
                    size="8px"
                    rounded
                  />
                  <div class="text-caption text-right q-mt-xs">
                    {{ category.percentage.toFixed(1) }}% do total
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { transactionService } from '@/services/transactionService'
import { useCurrency } from '@/composables/useCurrency'
import { useDate } from '@/composables/useDate'
import { useNotifications } from '@/composables/useNotifications'

// Register Chart.js components
Chart.register(...registerables)

// Composables
const { formatCurrency } = useCurrency()
const { formatDate } = useDate()
const { showSuccess, showError } = useNotifications()

// Refs
const timelineChart = ref(null)
const categoryChart = ref(null)
const timelineChartInstance = ref(null)
const categoryChartInstance = ref(null)

// Data
const filters = ref({
  period: 'last30days',
  startDate: '',
  endDate: ''
})

const summary = ref({
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  incomeCount: 0,
  expenseCount: 0,
  totalTransactions: 0
})

const monthlyComparison = ref([])
const categoryAnalysis = ref([])
const timelineData = ref([])

// Options
const periodOptions = [
  { label: 'Últimos 7 dias', value: 'last7days' },
  { label: 'Últimos 30 dias', value: 'last30days' },
  { label: 'Últimos 3 meses', value: 'last3months' },
  { label: 'Últimos 6 meses', value: 'last6months' },
  { label: 'Último ano', value: 'last12months' },
  { label: 'Este mês', value: 'currentMonth' },
  { label: 'Este ano', value: 'currentYear' },
  { label: 'Período personalizado', value: 'custom' }
]

// Computed
const hasData = computed(() => {
  return summary.value.totalTransactions > 0
})

// Methods
const updateDateRange = (period) => {
  const now = new Date()
  let startDate = new Date()
  let endDate = new Date()

  switch (period) {
    case 'last7days':
      startDate.setDate(now.getDate() - 7)
      break
    case 'last30days':
      startDate.setDate(now.getDate() - 30)
      break
    case 'last3months':
      startDate.setMonth(now.getMonth() - 3)
      break
    case 'last6months':
      startDate.setMonth(now.getMonth() - 6)
      break
    case 'last12months':
      startDate.setFullYear(now.getFullYear() - 1)
      break
    case 'currentMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      break
    case 'currentYear':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31)
      break
    default:
      return // Custom period - user will set dates manually
  }

  filters.value.startDate = startDate.toLocaleDateString('pt-BR')
  filters.value.endDate = endDate.toLocaleDateString('pt-BR')
  
  loadReports()
}

const loadReports = async () => {
  if (!filters.value.startDate || !filters.value.endDate) {
    return
  }

  try {
    // Get reports data
    const reportsData = await transactionService.getReports({
      startDate: filters.value.startDate,
      endDate: filters.value.endDate
    })

    // Update summary
    summary.value = reportsData.summary

    // Update charts data
    timelineData.value = reportsData.timeline
    categoryAnalysis.value = reportsData.categoryAnalysis
    monthlyComparison.value = reportsData.monthlyComparison

    // Update charts
    await nextTick()
    updateCharts()

  } catch (error) {
    console.error('Erro ao carregar relatórios:', error)
    showError('Erro ao carregar relatórios. Tente novamente.')
  } finally {
  }
}

const updateCharts = () => {
  updateTimelineChart()
  updateCategoryChart()
}

const updateTimelineChart = () => {
  if (!timelineChart.value || !timelineData.value.length) return

  // Destroy existing chart
  if (timelineChartInstance.value) {
    timelineChartInstance.value.destroy()
  }

  const ctx = timelineChart.value.getContext('2d')
  
  timelineChartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timelineData.value.map(item => item.date),
      datasets: [
        {
          label: 'Receitas',
          data: timelineData.value.map(item => item.income),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Despesas',
          data: timelineData.value.map(item => item.expense),
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
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

const updateCategoryChart = () => {
  if (!categoryChart.value || !categoryAnalysis.value.length) return

  // Destroy existing chart
  if (categoryChartInstance.value) {
    categoryChartInstance.value.destroy()
  }

  const ctx = categoryChart.value.getContext('2d')
  
  categoryChartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categoryAnalysis.value.map(item => item.name),
      datasets: [{
        data: categoryAnalysis.value.map(item => Math.abs(item.total)),
        backgroundColor: [
          '#1976D2', '#26A69A', '#FFC107', '#FF7043',
          '#9C27B0', '#66BB6A', '#EF5350', '#42A5F5'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

const getAmountColor = (amount) => {
  return amount >= 0 ? 'text-positive' : 'text-negative'
}

const exportReport = (format) => {
  showSuccess(`Exportando relatório em ${format.toUpperCase()}...`)
  // In a real app, this would generate and download the report
  console.log(`Exporting report in ${format} format`)
}

// Watchers
watch([() => filters.value.startDate, () => filters.value.endDate], () => {
  if (filters.value.startDate && filters.value.endDate) {
    loadReports()
  }
})

// Lifecycle
onMounted(() => {
  // Set default date range (last 30 days)
  updateDateRange('last30days')
})
</script>

<style scoped>
.shadow-2 {
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
}

.opacity-80 {
  opacity: 0.8;
}

.full-height {
  height: 100%;
}

.fixed-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>