<template>
  <q-page class="modern-dashboard" aria-labelledby="dashboard-title" :class="{ 'theme-dark': isDark }"
    :data-theme="isDark ? 'dark' : 'light'">
    <div class="dashboard-wrapper">

      <!-- ==========================================================================
      HEADER HERO - MANTÉM DESIGN ORIGINAL
      ========================================================================== -->
      <header class="dashboard-header" role="banner">
        <h1 id="dashboard-title" class="sr-only">Painel Financeiro</h1>
        <DashboardHero @open-transaction="openTransactionDialog" />
      </header>

      <!-- ==========================================================================
      NAVEGAÇÃO E FILTROS - DESIGN MODERNO E LIMPO
      ========================================================================== -->
      <section class="filters-container-modern q-mb-lg" aria-labelledby="filters-title">
        <h2 id="filters-title" class="sr-only">Período e filtros</h2>
        <div class="row q-col-gutter-md">
          
          <!-- Navegador de Mês - Design Limpo -->
          <nav class="col-12 col-md-6" aria-label="Navegação por mês">
            <MonthNavigator 
              @change="handleMonthChange" 
              :loading="isLoadingStats" 
              storage-key="dashboard-month" 
            />
          </nav>
          
          <!-- Filtros Avançados - Design Compacto e Moderno -->
          <div class="col-12 col-md-6">
            <q-expansion-item
              dense-toggle
              expand-separator
              class="advanced-filters-modern"
              header-class="filters-header"
            >
              <template v-slot:header>
                <q-item-section avatar style="min-width: 40px;">
                  <div class="filter-icon-wrapper">
                    <q-icon name="tune" size="20px" />
                  </div>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="filter-label">
                    Filtros Avançados
                  </q-item-label>
                  <q-item-label caption class="filter-caption">
                    Últimos 3/6/12 meses, personalizado
                  </q-item-label>
                </q-item-section>
                
                <q-item-section side>
                  <q-icon name="expand_more" size="20px" color="grey-6" />
                </q-item-section>
              </template>

              <q-card flat class="filters-content">
                <q-card-section class="q-pa-md">
                  <div class="filter-group">
                    <div class="filter-group-label q-mb-sm">
                      <q-icon name="event_note" size="16px" class="q-mr-xs" />
                      Selecione o Período
                    </div>
                    <PeriodFilter 
                      @change="handleAdvancedPeriodChange" 
                      storage-key="dashboard-advanced-period" 
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
      MÉTRICAS FINANCEIRAS - MANTÉM DESIGN ORIGINAL
      ========================================================================== -->
      <section aria-labelledby="metrics-title">
        <h2 id="metrics-title" class="sr-only">Métricas</h2>
        <DashboardMetrics />
      </section>

      <!-- ==========================================================================
      GRÁFICO DE CATEGORIA E AÇÕES RÁPIDAS - DESIGN MODERNO
      ========================================================================== -->
      <div class="row q-col-gutter-md secondary-section-modern q-mb-lg" role="region"
        aria-label="Ações rápidas e gráficos de categoria">
        
        <!-- Gráfico de Despesas por Categoria -->
        <aside class="col-12 col-md-5" aria-labelledby="category-chart-title">
          <q-card class="category-chart-card-modern" flat bordered>
            
            <!-- Header do Card -->
            <q-card-section class="chart-header-modern">
              <div class="row items-center no-wrap">
                <div class="col-auto q-mr-sm">
                  <div class="chart-icon-modern">
                    <q-icon name="pie_chart" size="20px" />
                  </div>
                </div>
                <div class="col">
                  <h3 class="chart-title-modern" id="category-chart-title">
                    Despesas por Categoria
                  </h3>
                  <p class="chart-subtitle-modern">
                    Onde seu dinheiro está sendo gasto
                  </p>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- Corpo do Gráfico -->
            <q-card-section class="chart-body-modern">
              <div v-if="isLoadingCharts" class="chart-loading-modern" role="status" aria-live="polite">
                <q-spinner-dots color="primary" size="2.5rem" />
                <p class="text-caption text-grey-7 q-mt-sm">Carregando dados...</p>
              </div>
              <div v-else class="chart-canvas-wrapper">
                <canvas 
                  id="doughnutChart" 
                  class="category-chart-canvas" 
                  role="img"
                  aria-label="Gráfico de pizza de despesas por categoria"
                ></canvas>
              </div>
            </q-card-section>
          </q-card>
        </aside>

        <!-- Ações Rápidas -->
        <div class="col-12 col-md-7" role="region" aria-label="Ações rápidas">
          <DashboardQuickActions @open-transaction="openTransactionDialog" />
        </div>
      </div>

      <section class="transactions-section" aria-labelledby="transactions-title">
        <h2 id="transactions-title" class="sr-only">Transações Recentes</h2>
        <div class="row">
          <div class="col-12">
            <DashboardRecentTransactions @open-transaction="openTransactionDialog" />
          </div>
        </div>
      </section>

      <q-dialog v-model="showAddTransactionDialog" maximized transition-show="slide-up" transition-hide="slide-down"
        class="transaction-dialog-mobile">
        <TransactionForm mode="create" :initialType="newTransactionType" @cancelled="closeTransactionDialog"
          @saved="handleTransactionSuccess" />
      </q-dialog>

      <CompleteProfileDialog v-model="showCompleteProfileDialog" @completed="handleProfileCompleted"
        @skipped="handleProfileSkipped" />

    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useCurrency } from 'src/composables/useCurrency'
import { useAuthStore } from 'src/stores/auth'
import { useDashboardStore } from 'src/stores/dashboard'
import { computed, ref, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  DoughnutController
} from 'chart.js'

import CompleteProfileDialog from 'src/components/CompleteProfileDialog.vue'
import MonthNavigator from 'src/components/MonthNavigator.vue'
import PeriodFilter from 'src/components/PeriodFilter.vue'
import TransactionForm from 'src/components/TransactionForm.vue'
import DashboardHero from './components/DashboardHero.vue'
import DashboardMetrics from './components/DashboardMetrics.vue'
import DashboardQuickActions from './components/DashboardQuickActions.vue'
import DashboardRecentTransactions from './components/DashboardRecentTransactions.vue'

// Registrar componentes do Chart.js (IMPORTANTE: incluir DoughnutController)
ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController)

const $q = useQuasar()
const isDark = computed(() => $q.dark.isActive)
const dashboardStore = useDashboardStore()
const authStore = useAuthStore()
const { formatCurrency } = useCurrency()

const showAddTransactionDialog = ref(false)
const newTransactionType = ref('income')
const showCompleteProfileDialog = ref(false)
const chartPeriod = ref('current-month')
let categoryChartInstance = null

const isLoadingStats = computed(() => dashboardStore.isLoadingStats)
const isLoadingCharts = computed(() => dashboardStore.isLoadingCharts)
const categoryCount = computed(() => dashboardStore.categoryAnalysis?.labels?.length || 0)

const topCategory = computed(() => {
  const data = dashboardStore.categoryAnalysis
  if (!data || !data.datasets || !data.datasets[0] || !data.datasets[0].data) return '-'
  const values = data.datasets[0].data
  const max = Math.max(...values)
  const idx = values.indexOf(max)
  return data.labels?.[idx] || '-'
})

const chartPeriodTotals = computed(() => {
  const chart = dashboardStore.monthlyEvolution || { datasets: [] }
  const income = chart.datasets?.[0]?.data?.reduce((s, v) => s + (v || 0), 0) || 0
  const expense = chart.datasets?.[1]?.data?.reduce((s, v) => s + (v || 0), 0) || 0
  const balance = chart.datasets?.[2]?.data?.slice(-1)[0] || 0
  return { income, expense, balance }
})

// ==========================================================================
// RENDERIZAÇÃO DO GRÁFICO DE CATEGORIA
// ==========================================================================
function renderCategoryChart() {
  const canvas = document.getElementById('doughnutChart')
  if (!canvas) {
    console.warn('⚠️ Canvas do gráfico de categoria não encontrado')
    return
  }

  const categoryData = dashboardStore.categoryAnalysis
  
  console.log('📊 [CHART] Tentando renderizar gráfico com dados:', categoryData)
  
  // Validar se há dados
  if (!categoryData || !categoryData.labels || categoryData.labels.length === 0) {
    console.log('⚠️ [CHART] Sem dados de categoria para renderizar')
    // Destruir gráfico existente se não houver dados
    if (categoryChartInstance) {
      console.log('🗑️ [CHART] Destruindo gráfico anterior (sem dados)')
      categoryChartInstance.destroy()
      categoryChartInstance = null
    }
    return
  }

  console.log('✅ [CHART] Dados válidos encontrados:', {
    labels: categoryData.labels,
    dataLength: categoryData.datasets[0]?.data?.length
  })

  // IMPORTANTE: Destruir gráfico anterior ANTES de criar novo
  if (categoryChartInstance) {
    console.log('🗑️ [CHART] Destruindo gráfico anterior antes de recriar')
    try {
      categoryChartInstance.destroy()
      categoryChartInstance = null
    } catch (error) {
      console.error('❌ [CHART] Erro ao destruir gráfico:', error)
    }
  }

  const ctx = canvas.getContext('2d')

  // Destruir gráfico anterior se existir
  if (categoryChartInstance) {
    categoryChartInstance.destroy()
  }

  // Cores para o gráfico
  const colors = [
    'rgba(236, 72, 153, 0.8)',   // Rosa
    'rgba(249, 115, 22, 0.8)',   // Laranja
    'rgba(139, 92, 246, 0.8)',   // Roxo
    'rgba(34, 197, 94, 0.8)',    // Verde
    'rgba(59, 130, 246, 0.8)',   // Azul
    'rgba(251, 146, 60, 0.8)',   // Laranja claro
    'rgba(168, 85, 247, 0.8)',   // Roxo claro
    'rgba(14, 165, 233, 0.8)',   // Azul claro
  ]

  const borderColors = [
    'rgba(236, 72, 153, 1)',
    'rgba(249, 115, 22, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(251, 146, 60, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(14, 165, 233, 1)',
  ]

  // Criar novo gráfico
  categoryChartInstance = new ChartJS(ctx, {
    type: 'doughnut',
    data: {
      labels: categoryData.labels,
      datasets: [{
        data: categoryData.datasets[0]?.data || [],
        backgroundColor: colors.slice(0, categoryData.labels.length),
        borderColor: borderColors.slice(0, categoryData.labels.length),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            },
            generateLabels: (chart) => {
              const data = chart.data
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i]
                  return {
                    text: `${label}: ${formatCurrency(value)}`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    strokeStyle: data.datasets[0].borderColor[i],
                    lineWidth: 2,
                    hidden: false,
                    index: i
                  }
                })
              }
              return []
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed || 0
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: ${formatCurrency(value)} (${percentage}%)`
            }
          }
        }
      }
    }
  })
  
  console.log('🎉 [CHART] Gráfico criado com sucesso!', categoryChartInstance)
}

// ==========================================================================
// WATCHERS
// ==========================================================================
watch(() => dashboardStore.categoryAnalysis, () => {
  nextTick(() => {
    renderCategoryChart()
  })
}, { deep: true })

watch(isDark, () => {
  nextTick(() => {
    renderCategoryChart()
  })
})

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(() => {
  nextTick(() => {
    renderCategoryChart()
  })
})

onBeforeUnmount(() => {
  // Destruir gráfico ao desmontar componente
  if (categoryChartInstance) {
    console.log('🧹 [CHART] Limpando gráfico no onBeforeUnmount')
    try {
      categoryChartInstance.destroy()
      categoryChartInstance = null
    } catch (error) {
      console.error('❌ [CHART] Erro ao destruir gráfico no unmount:', error)
    }
  }
})

// ==========================================================================
// METHODS
// ==========================================================================
function openTransactionDialog(type) {
  newTransactionType.value = type || 'income'
  showAddTransactionDialog.value = true
}

function closeTransactionDialog() {
  showAddTransactionDialog.value = false
}

async function handleMonthChange(range) {
  await dashboardStore.loadDashboard({ period: chartPeriod.value, dateRange: range })
}

async function handleAdvancedPeriodChange(range) {
  await dashboardStore.loadDashboard({ period: chartPeriod.value, dateRange: range })
}

function handleTransactionSuccess() {
  closeTransactionDialog()
  // reload minimal data
  dashboardStore.loadDashboard({ period: chartPeriod.value })
}

function handleProfileCompleted() { authStore.fetchUser() }
function handleProfileSkipped() { /* noop */ }
</script>

<style lang="scss">
@import '../../../css/index.scss';
</style>