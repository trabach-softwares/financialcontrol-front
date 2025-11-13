<template>
  <q-page class="modern-dashboard">
    <div class="dashboard-wrapper">
      
      <!-- ==========================================================================
      CABEÇALHO ULTRA-MODERNO
      ========================================================================== -->
      <div class="hero-header">
        <div class="hero-content">
          <!-- Linha superior: Olá à esquerda, Boa noite à direita -->
          <div class="hero-top-row">
            <h1 class="hero-title">
              Olá, <span class="name-highlight">{{ authStore.userDisplayName }}</span>! 👋
            </h1>
            
            <div class="greeting-badge">
              <q-icon name="wb_sunny" size="1.2rem" class="q-mr-xs" />
              {{ getCurrentGreeting() }}
            </div>
          </div>
          
          <!-- Linha inferior: Data/Subtítulo -->
          <div class="hero-bottom-row">
            <p class="hero-subtitle">
              {{ getCurrentDate() }} • Seu controle financeiro em tempo real
            </p>
          </div>
          
          <!-- Botões de ação -->
          <div class="hero-actions">
            <q-btn
              icon="add_circle_outline"
              label="Receita"
              unelevated
              no-caps
              size="md"
              class="hero-btn income-hero-btn"
              @click="openTransactionDialog('income')"
            >
              <q-icon name="arrow_upward" size="1rem" class="q-ml-xs" />
            </q-btn>
            
            <q-btn
              icon="remove_circle_outline"
              label="Despesa"
              unelevated
              no-caps
              size="md"
              class="hero-btn expense-hero-btn"
              @click="openTransactionDialog('expense')"
            >
              <q-icon name="arrow_downward" size="1rem" class="q-ml-xs" />
            </q-btn>
          </div>
        </div>
      </div>

      <!-- ==========================================================================
      NAVEGAÇÃO DE PERÍODO - DESIGN MELHORADO
      ========================================================================== -->
      <div class="period-filter-section q-mb-lg q-px-md">
        <div class="row q-col-gutter-md">
          
          <!-- Navegador de Mês (sempre visível) -->
          <div class="col-12 col-md-4">
            <MonthNavigator 
              @change="handleMonthChange"
              :loading="isLoadingStats"
              storage-key="dashboard-month"
            />
          </div>

          <!-- Filtros Avançados (colapsável melhorado) -->
          <div class="col-12 col-md-8">
            <q-expansion-item
              icon="filter_alt"
              label="Filtros Avançados"
              caption="Períodos personalizados"
              dense-toggle
              expand-separator
              class="advanced-filter-expansion"
              header-class="advanced-filter-header"
            >
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="40px">
                    <q-icon name="filter_alt" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">Filtros Avançados</q-item-label>
                  <q-item-label caption class="text-grey-7">
                    Últimos 3/6/12 meses, personalizado...
                  </q-item-label>
                </q-item-section>
              </template>

              <q-card flat bordered class="advanced-filter-card">
                <q-card-section class="q-pa-md">
                  <PeriodFilter 
                    @change="handleAdvancedPeriodChange"
                    storage-key="dashboard-advanced-period"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </div>
      </div>

      <!-- Banner informativo se estiver em mês futuro -->
      <div v-if="isFutureMonth" class="row q-mb-lg q-px-md">
        <div class="col-12">
          <q-banner class="future-month-banner" rounded>
            <template v-slot:avatar>
              <q-avatar color="orange" text-color="white" size="48px">
                <q-icon name="schedule" size="24px" />
              </q-avatar>
            </template>
            <div class="text-weight-medium text-h6">
              🔮 Visualizando lançamentos futuros
            </div>
            <div class="text-body2 q-mt-xs opacity-80">
              As transações marcadas como "Pendente" ainda não foram pagas ou recebidas.
            </div>
          </q-banner>
        </div>
      </div>

      <!-- ==========================================================================
      CARDS DE MÉTRICAS PREMIUM
      ========================================================================== -->
      <div class="row q-col-gutter-sm metrics-row">
        
        <!-- Card de Receitas Premium -->
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="metric-card income-metric" @click="$router.push('/transactions?type=income')">
            <div class="metric-icon-wrapper income-icon">
              <q-icon name="arrow_upward" size="2rem" />
            </div>
            <div class="metric-content">
              <div class="metric-label">Receitas</div>
              <div v-if="!isLoadingStats" class="metric-value">
                {{ formatCurrency(transactionStats.totalIncome) }}
              </div>
              <q-skeleton v-else type="text" width="70%" height="2rem" />
              <div v-if="!isLoadingStats" class="metric-badge positive">
                <q-icon name="trending_up" size="0.9rem" />
                <span>+{{ transactionStats.incomeGrowth.toFixed(1) }}%</span>
              </div>
            </div>
            <div class="metric-bg-icon">
              <q-icon name="arrow_upward" />
            </div>
          </div>
        </div>

        <!-- Card de Despesas Premium -->
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="metric-card expense-metric" @click="$router.push('/transactions?type=expense')">
            <div class="metric-icon-wrapper expense-icon">
              <q-icon name="arrow_downward" size="2rem" />
            </div>
            <div class="metric-content">
              <div class="metric-label">Despesas</div>
              <div v-if="!isLoadingStats" class="metric-value">
                {{ formatCurrency(transactionStats.totalExpense) }}
              </div>
              <q-skeleton v-else type="text" width="70%" height="2rem" />
              <div v-if="!isLoadingStats" class="metric-badge negative">
                <q-icon name="trending_down" size="0.9rem" />
                <span>{{ transactionStats.expenseGrowth.toFixed(1) }}%</span>
              </div>
            </div>
            <div class="metric-bg-icon">
              <q-icon name="arrow_downward" />
            </div>
          </div>
        </div>

        <!-- Card de Saldo Premium -->
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="metric-card balance-metric" @click="$router.push('/transactions')">
            <div class="metric-icon-wrapper balance-icon">
              <q-icon name="account_balance_wallet" size="2rem" />
            </div>
            <div class="metric-content">
              <div class="metric-label">Saldo Total</div>
              <div v-if="!isLoadingStats" class="metric-value" :class="balanceColor">
                {{ formatCurrency(transactionStats.balance) }}
              </div>
              <q-skeleton v-else type="text" width="70%" height="2rem" />
              <div v-if="!isLoadingStats" class="metric-badge neutral">
                <q-icon name="savings" size="0.9rem" />
                <span>Posição Atual</span>
              </div>
            </div>
            <div class="metric-bg-icon">
              <q-icon name="account_balance_wallet" />
            </div>
          </div>
        </div>

        <!-- Card de Transações Premium -->
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="metric-card transactions-metric" @click="$router.push('/transactions')">
            <div class="metric-icon-wrapper transactions-icon">
              <q-icon name="receipt_long" size="2rem" />
            </div>
            <div class="metric-content">
              <div class="metric-label">Transações</div>
              <div v-if="!isLoadingStats" class="metric-value">
                {{ transactionStats.transactionCount }}
              </div>
              <q-skeleton v-else type="text" width="70%" height="2rem" />
              <div v-if="!isLoadingStats" class="metric-badge info">
                <q-icon name="history" size="0.9rem" />
                <span>Este mês</span>
              </div>
            </div>
            <div class="metric-bg-icon">
              <q-icon name="receipt_long" />
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================================================
      SEÇÃO SECUNDÁRIA - ANÁLISES E AÇÕES
      ========================================================================== -->
      <div class="row q-col-gutter-sm secondary-section">
        
        <!-- Gráfico de Categorias Melhorado -->
        <div class="col-12 col-md-5">
          <div class="category-chart-card">
            <div class="chart-header-simple">
              <div class="chart-icon-wrapper category">
                <q-icon name="pie_chart" size="1.3rem" />
              </div>
              <div>
                <h6 class="chart-title-small">Despesas por Categoria</h6>
                <p class="chart-subtitle-small">Onde seu dinheiro está sendo gasto</p>
              </div>
            </div>
            
            <div class="category-chart-body">
              <div v-if="isLoadingCharts" class="chart-loading-small">
                <q-spinner-dots color="primary" size="2em" />
              </div>
              
              <!-- Estado Vazio: Sem dados de categorias -->
              <div 
                v-else-if="!dashboardStore.categoryAnalysis.labels || dashboardStore.categoryAnalysis.labels.length === 0"
                class="category-empty-state"
              >
                <div class="empty-icon-wrapper">
                  <q-icon name="donut_large" size="3.5rem" color="grey-5" />
                </div>
                <h6 class="empty-title">Nenhuma despesa registrada</h6>
                <p class="empty-subtitle">
                  Adicione despesas para visualizar<br>
                  como seu dinheiro está sendo gasto
                </p>
                <q-btn
                  unelevated
                  color="primary"
                  label="Adicionar Despesa"
                  icon="add"
                  size="sm"
                  class="q-mt-md"
                  @click="openTransactionDialog('expense')"
                />
              </div>
              
              <!-- Gráfico com dados -->
              <div v-else class="category-chart-wrapper">
                <canvas 
                  ref="doughnutChartRef" 
                  id="doughnutChart"
                  class="category-chart-canvas"
                ></canvas>
                
                <!-- Informações Adicionais -->
                <div class="category-insights">
                  <div class="insight-item">
                    <q-icon name="category" size="1rem" color="primary" />
                    <span class="insight-label">{{ categoryCount }} categorias</span>
                  </div>
                  <div class="insight-item">
                    <q-icon name="trending_up" size="1rem" color="orange" />
                    <span class="insight-label">Maior: {{ topCategory }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ações Rápidas Melhoradas -->
        <div class="col-12 col-md-7">
          <div class="quick-actions-modern">
            <div class="actions-header">
              <div class="chart-icon-wrapper actions">
                <q-icon name="bolt" size="1.3rem" />
              </div>
              <div>
                <h6 class="chart-title-small">Ações Rápidas</h6>
                <p class="chart-subtitle-small">Gerencie suas finanças rapidamente</p>
              </div>
            </div>
            
            <div class="actions-grid">
              <div class="action-card" @click="openTransactionDialog('income')">
                <div class="action-icon income">
                  <q-icon name="add_circle" size="2rem" />
                </div>
                <div class="action-content">
                  <h6 class="action-title">Nova Receita</h6>
                  <p class="action-description">Registrar entrada de dinheiro</p>
                </div>
                <q-icon name="arrow_forward" class="action-arrow" />
              </div>
              
              <div class="action-card" @click="openTransactionDialog('expense')">
                <div class="action-icon expense">
                  <q-icon name="remove_circle" size="2rem" />
                </div>
                <div class="action-content">
                  <h6 class="action-title">Nova Despesa</h6>
                  <p class="action-description">Registrar saída de dinheiro</p>
                </div>
                <q-icon name="arrow_forward" class="action-arrow" />
              </div>
              
              <div class="action-card" @click="$router.push('/transactions')">
                <div class="action-icon transactions">
                  <q-icon name="list_alt" size="2rem" />
                </div>
                <div class="action-content">
                  <h6 class="action-title">Ver Transações</h6>
                  <p class="action-description">Histórico completo</p>
                </div>
                <q-icon name="arrow_forward" class="action-arrow" />
              </div>
              
              <div class="action-card" @click="$router.push('/reports')">
                <div class="action-icon reports">
                  <q-icon name="assessment" size="2rem" />
                </div>
                <div class="action-content">
                  <h6 class="action-title">Relatórios</h6>
                  <p class="action-description">Análises detalhadas</p>
                </div>
                <q-icon name="arrow_forward" class="action-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================================================
      TRANSAÇÕES RECENTES
      ========================================================================== -->
      <div class="row transactions-section">
        
        <!-- Lista de Transações Recentes -->
        <div class="col-12">
          <q-card class="recent-transactions-card" flat bordered>
            <q-card-section class="flex items-center justify-between">
              <div>
                <h6 class="text-h6 q-ma-none">
                  Transações Recentes
                </h6>
                <p class="text-caption q-ma-none">
                  Últimas movimentações financeiras
                </p>
              </div>
              
              <q-btn
                label="Ver todas"
                color="primary"
                flat
                no-caps
                icon-right="arrow_forward"
                @click="$router.push('/transactions')"
              />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div v-if="dashboardStore.isLoadingRecent" class="text-center q-py-lg">
                <q-spinner color="primary" size="2rem" />
                <p class="text-caption q-mt-md">
                  Carregando transações...
                </p>
              </div>

              <div v-else-if="recentTransactions.length === 0" class="text-center q-py-lg">
                <q-icon name="receipt_long" size="3rem" color="grey-4" />
                <p class="text-subtitle2 q-mt-md">
                  Nenhuma transação encontrada
                </p>
                <q-btn
                  label="Adicionar primeira transação"
                  color="primary"
                  outline
                  no-caps
                  @click="showAddTransactionDialog = true"
                />
              </div>

              <div v-else class="transactions-list">
                <q-list separator>
                  <q-item
                    v-for="transaction in recentTransactions"
                    :key="transaction.id"
                    class="transaction-item q-px-none"
                  >
                    <q-item-section avatar>
                      <q-avatar 
                        :color="transaction.type === 'income' ? 'green-1' : 'red-1'" 
                        :text-color="transaction.type === 'income' ? 'green-7' : 'red-7'"
                      >
                        <q-icon 
                          :name="transaction.type === 'income' ? 'add' : 'remove'"
                        />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-medium">
                        {{ transaction.description }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ transaction.category }} • {{ formatDate(transaction.date) }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label 
                        class="text-weight-bold"
                        :class="transaction.type === 'income' ? 'text-green-7' : 'text-red-7'"
                      >
                        {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- ==========================================================================
      GRÁFICO DE EVOLUÇÃO FINANCEIRA - ANÁLISE DETALHADA
      ========================================================================== -->
      <div class="row chart-evolution-section">
        <div class="col-12">
          <div class="main-chart-card">
            <div class="chart-header">
              <div class="chart-header-left">
                <div class="chart-icon-wrapper">
                  <q-icon name="trending_up" size="1.5rem" />
                </div>
                <div>
                  <h5 class="chart-title">Evolução Financeira</h5>
                  <p class="chart-subtitle">Acompanhe suas receitas e despesas ao longo do tempo</p>
                </div>
              </div>
              
              <div class="chart-period-selector">
                <q-btn-toggle
                  v-model="chartPeriod"
                  :options="[
                    { label: 'Este mês', value: 'current-month', icon: 'today' },
                    { label: '7 dias', value: '7days', icon: 'event_note' },
                    { label: '30 dias', value: '30days', icon: 'calendar_view_week' },
                    { label: '3 meses', value: '3months', icon: 'calendar_view_month' },
                    { label: '6 meses', value: '6months', icon: 'date_range' },
                    { label: '1 ano', value: '1year', icon: 'calendar_today' }
                  ]"
                  no-caps
                  unelevated
                  class="period-toggle"
                  @update:model-value="updateChartData"
                />
              </div>
            </div>
            
            <div class="chart-body">
              <div v-if="isLoadingCharts" class="chart-loading">
                <q-spinner-dots color="primary" size="3em" />
                <p>Carregando dados...</p>
              </div>
              
              <!-- Estado Vazio: Sem dados de evolução -->
              <div 
                v-else-if="!dashboardStore.monthlyEvolution.labels || dashboardStore.monthlyEvolution.labels.length === 0"
                class="evolution-empty-state"
              >
                <div class="empty-icon-wrapper-large">
                  <q-icon name="show_chart" size="4rem" color="grey-5" />
                </div>
                <h5 class="empty-title-large">Nenhuma transação no período</h5>
                <p class="empty-subtitle-large">
                  Comece adicionando receitas e despesas<br>
                  para visualizar a evolução das suas finanças
                </p>
                <div class="empty-actions">
                  <q-btn
                    unelevated
                    color="positive"
                    label="Adicionar Receita"
                    icon="add_circle"
                    @click="openTransactionDialog('income')"
                  />
                  <q-btn
                    unelevated
                    color="negative"
                    label="Adicionar Despesa"
                    icon="remove_circle"
                    @click="openTransactionDialog('expense')"
                  />
                </div>
              </div>
              
              <canvas 
                v-else
                ref="lineChartRef" 
                id="lineChart"
                class="main-chart-canvas"
              ></canvas>
            </div>
            
            <!-- Legenda personalizada com totais -->
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-dot income"></span>
                <div class="legend-content">
                  <span class="legend-label">Receitas</span>
                  <span class="legend-value">{{ formatCurrency(chartPeriodTotals.income) }}</span>
                </div>
              </div>
              <div class="legend-item">
                <span class="legend-dot expense"></span>
                <div class="legend-content">
                  <span class="legend-label">Despesas</span>
                  <span class="legend-value">{{ formatCurrency(chartPeriodTotals.expense) }}</span>
                </div>
              </div>
              <div class="legend-item">
                <span class="legend-dot balance"></span>
                <div class="legend-content">
                  <span class="legend-label">Saldo Final</span>
                  <span class="legend-value" :class="chartPeriodTotals.balance >= 0 ? 'positive' : 'negative'">
                    {{ formatCurrency(chartPeriodTotals.balance) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==========================================================================
    DIALOG DE NOVA TRANSAÇÃO
    ========================================================================== -->
    <q-dialog 
      v-model="showAddTransactionDialog"
      maximized 
      transition-show="slide-up" 
      transition-hide="slide-down"
      class="transaction-dialog-mobile"
    >
      <TransactionForm
        mode="create"
        :initialType="newTransactionType"
        @cancelled="closeTransactionDialog"
        @saved="handleTransactionSuccess"
      />
    </q-dialog>

    <!-- ==========================================================================
    DIALOG DE COMPLETAR PERFIL
    ========================================================================== -->
    <CompleteProfileDialog
      v-model="showCompleteProfileDialog"
      @completed="handleProfileCompleted"
      @skipped="handleProfileSkipped"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useTransactionStore } from 'src/stores/transactions'
import { useDashboardStore } from 'src/stores/dashboard'
import { useCurrency } from 'src/composables/useCurrency'
import { useDate } from 'src/composables/useDate'
import { Chart, registerables } from 'chart.js'
import { startOfMonth, endOfMonth, isAfter, format as formatDateFns } from 'date-fns'
import TransactionForm from 'src/components/TransactionForm.vue'
import CompleteProfileDialog from 'src/components/CompleteProfileDialog.vue'
import PeriodFilter from 'src/components/PeriodFilter.vue'
import MonthNavigator from 'src/components/MonthNavigator.vue'

// Registrar componentes do Chart.js
Chart.register(...registerables)

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const dashboardStore = useDashboardStore()
const { formatCurrency } = useCurrency()
const { formatDate } = useDate()

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const showAddTransactionDialog = ref(false)
const newTransactionType = ref('income')
const chartPeriod = ref('current-month') // Inicia com o mês atual
const showCompleteProfileDialog = ref(false)
const currentPeriodRange = ref({ startDate: null, endDate: null })
const currentMonth = ref(new Date()) // Mês atual sendo visualizado no MonthNavigator
const isUsingAdvancedFilter = ref(false) // Flag para indicar se está usando filtro avançado

// Referências dos gráficos
const lineChartRef = ref(null)
const doughnutChartRef = ref(null)
let lineChart = null
let doughnutChart = null

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================

/**
 * Verifica se o mês atual sendo visualizado é futuro
 */
const isFutureMonth = computed(() => {
  if (!currentMonth.value) return false
  const now = new Date()
  const currentStart = startOfMonth(currentMonth.value)
  const nowStart = startOfMonth(now)
  return isAfter(currentStart, nowStart)
})

/**
 * Estatísticas das transações com valores padrão seguros
 */
const transactionStats = computed(() => {
  const stats = dashboardStore.formattedStats || {}
  
  const result = {
    totalIncome: stats.totalIncome || 0,
    totalExpense: stats.totalExpense || 0,
    balance: stats.balance || 0,
    transactionCount: stats.transactionCount || 0,
    incomeGrowth: stats.incomeGrowth || 0,
    expenseGrowth: stats.expenseGrowth || 0
  }
  
  console.log('📊 [DASHBOARD] Stats computados:', result)
  
  return result
})

/**
 * Cor do saldo baseada no valor
 */
const balanceColor = computed(() => {
  return dashboardStore.balanceColor
})

/**
 * Transações recentes (últimas 5)
 */
const recentTransactions = computed(() => {
  return dashboardStore.recentTransactions
})

/**
 * Estados de loading
 */
const isLoadingStats = computed(() => {
  return dashboardStore.isLoadingStats
})

const isLoadingCharts = computed(() => {
  return dashboardStore.isLoadingCharts
})

/**
 * Totais do período selecionado no gráfico
 */
const chartPeriodTotals = computed(() => {
  const chartData = dashboardStore.monthlyEvolution
  
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return {
      income: 0,
      expense: 0,
      balance: 0
    }
  }
  
  // Datasets: [0] = Receitas, [1] = Despesas, [2] = Saldo
  const incomeData = chartData.datasets[0]?.data || []
  const expenseData = chartData.datasets[1]?.data || []
  const balanceData = chartData.datasets[2]?.data || []
  
  // Somar todos os valores do período
  const totalIncome = incomeData.reduce((sum, val) => sum + (val || 0), 0)
  const totalExpense = expenseData.reduce((sum, val) => sum + (val || 0), 0)
  const finalBalance = balanceData.length > 0 ? balanceData[balanceData.length - 1] : 0
  
  return {
    income: totalIncome,
    expense: totalExpense,
    balance: finalBalance
  }
})

/**
 * Número de categorias com despesas
 */
const categoryCount = computed(() => {
  const categoryData = dashboardStore.categoryAnalysis
  return categoryData?.labels?.length || 0
})

/**
 * Categoria com maior gasto
 */
const topCategory = computed(() => {
  const categoryData = dashboardStore.categoryAnalysis
  
  if (!categoryData?.labels?.length || !categoryData?.datasets?.[0]?.data?.length) {
    return '-'
  }
  
  const values = categoryData.datasets[0].data
  const maxValue = Math.max(...values)
  const maxIndex = values.indexOf(maxValue)
  
  return categoryData.labels[maxIndex] || '-'
})

/**
 * Percentual da categoria principal
 */
const topCategoryPercentage = computed(() => {
  const categoryData = dashboardStore.categoryAnalysis
  
  if (!categoryData?.datasets?.[0]?.data?.length) {
    return 0
  }
  
  const values = categoryData.datasets[0].data
  const total = values.reduce((sum, val) => sum + (val || 0), 0)
  const maxValue = Math.max(...values)
  
  return total > 0 ? ((maxValue / total) * 100).toFixed(1) : 0
})

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Carrega dados iniciais do dashboard
 */
const loadDashboardData = async (periodRange = null) => {
  console.log('📊 [DASHBOARD] Carregando dados iniciais', periodRange)
  
  try {
    // Prepara o dateRange com os filtros de período
    const dateRange = {};
    if (periodRange && periodRange.startDate) {
      dateRange.startDate = periodRange.startDate;
    }
    if (periodRange && periodRange.endDate) {
      dateRange.endDate = periodRange.endDate;
    }
    
    console.log('🔍 [DASHBOARD] dateRange preparado:', dateRange)
    
    // Carrega todos os dados do dashboard usando a nova store
    await dashboardStore.loadDashboard({
      period: chartPeriod.value, // Inclui o período atual dos gráficos
      dateRange, 
      recentLimit: 5
    })
    
    console.log('✅ [DASHBOARD] Dados carregados:', {
      stats: dashboardStore.stats,
      formattedStats: dashboardStore.formattedStats,
      chartData: dashboardStore.monthlyEvolution
    })
    
  } catch (error) {
    console.error('❌ [DASHBOARD] Erro ao carregar dados:', error.message)
    console.error('Stack:', error.stack)
  }
}

/**
 * Retorna saudação baseada no horário
 */
const getCurrentGreeting = () => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return 'Bom dia'
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde'
  } else {
    return 'Boa noite'
  }
}

/**
 * Retorna data formatada atual
 */
const getCurrentDate = () => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  
  return new Date().toLocaleDateString('pt-BR', options)
}

/**
 * Handler para mudança de mês no MonthNavigator
 */
const handleMonthChange = async (range) => {
  console.log('🗓️ [DASHBOARD] Mês alterado (MonthNavigator):', range)
  
  // Desativa filtro avançado quando usa navegação simples
  isUsingAdvancedFilter.value = false
  
  // Atualiza o mês atual
  currentMonth.value = new Date(range.startDate)
  
  // Atualiza o range do período
  currentPeriodRange.value = range
  
  // Recarrega os dados do dashboard com o novo período
  await loadDashboardData(range)
  
  // Atualiza os gráficos
  await nextTick()
  if (lineChart) {
    updateLineChart()
  }
  if (doughnutChart) {
    updateDoughnutChart()
  }
}

/**
 * Handler para mudança de período no filtro avançado
 */
const handleAdvancedPeriodChange = async (range) => {
  console.log('🎯 [DASHBOARD] Período avançado alterado:', range)
  
  // Ativa flag de filtro avançado
  isUsingAdvancedFilter.value = true
  
  // Atualiza o range do período
  currentPeriodRange.value = range
  
  // Recarrega os dados do dashboard com o novo período
  await loadDashboardData(range)
  
  // Atualiza os gráficos
  await nextTick()
  if (lineChart) {
    updateLineChart()
  }
  if (doughnutChart) {
    updateDoughnutChart()
  }
}

/**
 * Abre dialog de nova transação
 */
const openTransactionDialog = (type) => {
  console.log('➕ [DASHBOARD] Abrindo dialog de transação:', type)
  newTransactionType.value = type
  showAddTransactionDialog.value = true
}

/**
 * Fecha dialog de transação
 */
const closeTransactionDialog = () => {
  showAddTransactionDialog.value = false
  newTransactionType.value = 'income'
}

/**
 * Manipula sucesso ao criar transação
 */
const handleTransactionSuccess = async (transaction) => {
  console.log('✅ [DASHBOARD] Transação criada com sucesso:', transaction)
  
  try {
    // Fechar dialog
    closeTransactionDialog()
    
    // Mostrar notificação
    $q.notify({
      type: 'positive',
      message: transaction?.type === 'income' 
        ? 'Receita adicionada com sucesso!' 
        : 'Despesa adicionada com sucesso!',
      position: 'top',
      timeout: 2500,
      icon: transaction?.type === 'income' ? 'trending_up' : 'trending_down'
    })
    
    // Aguardar um momento para garantir que a transação foi salva
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Recarregar TODOS os dados do dashboard
    console.log('🔄 [DASHBOARD] Recarregando dados...')
    await loadDashboardData()
    
    // Aguardar o DOM atualizar
    await nextTick()
    
    // Destruir e reinicializar gráficos com novos dados
    console.log('📊 [DASHBOARD] Reinicializando gráficos...')
    if (lineChart) {
      lineChart.destroy()
      lineChart = null
    }
    if (doughnutChart) {
      doughnutChart.destroy()
      doughnutChart = null
    }
    
    // Aguardar mais um tick
    await nextTick()
    
    initLineChart()
    initDoughnutChart()
    
    console.log('✅ [DASHBOARD] Dashboard atualizado com sucesso!')
  } catch (error) {
    console.error('❌ [DASHBOARD] Erro ao atualizar dashboard:', error)
    $q.notify({
      type: 'warning',
      message: 'Transação salva, mas houve erro ao atualizar a tela. Recarregue a página.',
      position: 'top',
      timeout: 3000
    })
  }
}

/**
 * Manipula quando o usuário completa o perfil
 */
const handleProfileCompleted = async () => {
  console.log('✅ [DASHBOARD] Perfil completado pelo usuário')
  
  // Recarregar dados do usuário para atualizar o estado
  try {
    await authStore.fetchUser()
    
    $q.notify({
      type: 'positive',
      message: '🎉 Perfil completado com sucesso!',
      position: 'top',
      timeout: 3000
    })
  } catch (error) {
    console.error('Erro ao recarregar dados do usuário:', error)
  }
}

/**
 * Manipula quando o usuário pula completar o perfil
 */
const handleProfileSkipped = () => {
  console.log('⏭️ [DASHBOARD] Usuário optou por pular completar perfil')
  
  $q.notify({
    type: 'info',
    message: 'Você pode completar seu perfil depois nas Configurações',
    position: 'top',
    timeout: 3000
  })
}

/**
 * Inicializa gráfico de linha (Evolução Financeira)
 */
const initLineChart = () => {
  if (!lineChartRef.value) {
    console.warn('⚠️ [CHART] Referência do canvas não encontrada')
    return
  }
  
  const ctx = lineChartRef.value.getContext('2d')
  
  // Usar dados reais da dashboard store
  const chartData = dashboardStore.monthlyEvolution
  
  console.log('📊 [CHART] Inicializando gráfico de linha com dados:', chartData)

  const config = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false  // Desabilitar legenda padrão (usando customizada)
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          titleColor: '#1e293b',
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyColor: '#475569',
          bodyFont: {
            size: 13
          },
          borderColor: '#e2e8f0',
          borderWidth: 2,
          padding: 16,
          displayColors: true,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            title: function(tooltipItems) {
              // Mostrar o label do período
              return tooltipItems[0].label
            },
            label: function(context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              label += formatCurrency(context.parsed.y)
              return label
            },
            footer: function(tooltipItems) {
              // Calcular o total do dia
              let total = 0
              tooltipItems.forEach(item => {
                if (item.dataset.label === 'Receitas') {
                  total += item.parsed.y
                } else if (item.dataset.label === 'Despesas') {
                  total -= item.parsed.y
                }
              })
              return 'Total: ' + formatCurrency(total)
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(226, 232, 240, 0.5)',
            drawBorder: false,
            drawTicks: false
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 11,
              weight: '600'
            },
            padding: 8
          },
          border: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(226, 232, 240, 0.8)',
            drawBorder: false,
            drawTicks: false
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 11,
              weight: '600'
            },
            padding: 12,
            callback: function(value) {
              // Formato compacto: 1k, 10k, 100k
              if (value >= 1000000) {
                return 'R$ ' + (value / 1000000).toFixed(1) + 'M'
              } else if (value >= 1000) {
                return 'R$ ' + (value / 1000).toFixed(0) + 'k'
              }
              return formatCurrency(value)
            }
          },
          border: {
            display: false
          }
        }
      },
      elements: {
        line: {
          borderWidth: 3
        },
        point: {
          radius: 5,
          hoverRadius: 7,
          borderWidth: 2,
          hoverBorderWidth: 3
        }
      }
    }
  }

  lineChart = new Chart(ctx, config)
  console.log('✅ [CHART] Gráfico de linha inicializado com sucesso')
}

/**
 * Inicializa gráfico de rosca (Categorias)
 */
const initDoughnutChart = () => {
  if (!doughnutChartRef.value) {
    console.warn('⚠️ [CHART] Referência do canvas (doughnut) não encontrada')
    return
  }
  
  const ctx = doughnutChartRef.value.getContext('2d')
  
  // Usar dados reais da dashboard store
  const chartData = dashboardStore.categoryAnalysis
  
  console.log('🍩 [CHART] Inicializando gráfico de categorias com dados:', chartData)

  const config = {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#475569',
            font: {
              size: 12
            },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1e293b',
          bodyColor: '#475569',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = formatCurrency(context.parsed)
              
              // Calcular percentual
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              
              return `${label}: ${value} (${percentage}%)`
            }
          }
        }
      },
      cutout: '65%'  // Tamanho do buraco interno (mais moderno)
    }
  }

  doughnutChart = new Chart(ctx, config)
  console.log('✅ [CHART] Gráfico de categorias inicializado com sucesso')
}

/**
 * Atualiza dados dos gráficos baseado no período
 */
const updateChartData = async () => {
  console.log('📈 [DASHBOARD] Atualizando dados dos gráficos para:', chartPeriod.value)
  
  try {
    // Atualiza período na store e recarrega dados
    await dashboardStore.updateChartPeriod(chartPeriod.value)
    
    // Destroi gráficos existentes
    if (lineChart) {
      lineChart.destroy()
      lineChart = null
    }
    if (doughnutChart) {
      doughnutChart.destroy()
      doughnutChart = null
    }
    
    // Reinicializa gráficos com novos dados
    await nextTick()
    initLineChart()
    initDoughnutChart()
    
  } catch (error) {
    console.error('❌ [DASHBOARD] Erro ao atualizar gráficos:', error.message)
  }
}

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(async () => {
  console.log('🚀 [DASHBOARD] Dashboard montado')
  
  // SEMPRE inicializa com o mês atual ao entrar na tela
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  
  const initialRange = {
    startDate: formatDateFns(monthStart, 'yyyy-MM-dd'),
    endDate: formatDateFns(monthEnd, 'yyyy-MM-dd')
  }
  
  console.log('📅 [DASHBOARD] Inicializando com mês atual:', initialRange)
  
  // Atualiza estado
  currentMonth.value = now
  currentPeriodRange.value = initialRange
  
  // Limpa preferência anterior para garantir que sempre inicie no mês atual
  try {
    localStorage.removeItem('dashboard-month')
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error)
  }
  
  // Carrega dados do mês atual
  await loadDashboardData(initialRange)
  
  // Inicializa gráficos após próximo tick
  await nextTick()
  initLineChart()
  initDoughnutChart()
  
  // Exibe notificação de upgrade para usuários do plano gratuito
  const freePlans = ['free', 'gratuito', 'gratis', 'trial']
  const userPlan = authStore.userPlan?.toLowerCase() || ''
  
  if (freePlans.includes(userPlan)) {
    setTimeout(() => {
      $q.notify({
        type: 'info',
        message: 'Upgrade para Premium',
        caption: 'Desbloqueie recursos ilimitados e tenha acesso completo ao sistema!',
        icon: 'star',
        position: 'top',
        timeout: 5000,
        actions: [
          {
            label: 'Ver Planos',
            color: 'white',
            handler: () => {
              router.push('/plans')
            }
          },
          {
            label: 'Fechar',
            color: 'white'
          }
        ]
      })
    }, 1500)
  }
  
  // Verifica se o perfil está incompleto e solicita completar
  if (authStore.isProfileIncomplete) {
    console.log('📝 [DASHBOARD] Perfil incompleto detectado, solicitando completar dados')
    // Pequeno delay para garantir que o dashboard carregou visualmente
    setTimeout(() => {
      showCompleteProfileDialog.value = true
    }, 2500) // Aumentado de 1000 para 2500 para dar tempo da notificação aparecer primeiro
  }
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// ULTRA-MODERN DASHBOARD DESIGN SYSTEM
// ==========================================================================

.modern-dashboard {
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  min-height: 100vh;
  // Padding bottom padrão - será sobrescrito em mobile
  padding-bottom: 4rem;
}

.dashboard-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  /* Mobile: sem padding lateral, usa padding nas seções */
  padding: 0;
}

/* Seções com padding controlado */
.hero-header,
.metrics-row,
.secondary-section,
.transactions-section,
.chart-evolution-section {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.hero-header {
  margin-bottom: 0.75rem;
}

.metrics-row {
  margin-bottom: 0.75rem;
}

.secondary-section {
  margin-bottom: 0.75rem;
}

.transactions-section {
  margin-bottom: 0.75rem;
}

.chart-evolution-section {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

// ==========================================================================
// HERO HEADER - Design Sofisticado e Limpo
// ==========================================================================
.hero-header {
  background: linear-gradient(135deg, #2c5f2d 0%, #3a7541 50%, #2c5f2d 100%);
  border-radius: 20px;
  padding: 1.5rem 2.5rem; // Reduzido de 2rem para trazer conteúdo mais para cima
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(44, 95, 45, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  // Padrão geométrico sutil de fundo
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: 400px;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
  }
  
  // Detalhe de brilho suave
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at top right, rgba(255,255,255,0.08) 0%, transparent 50%);
    pointer-events: none;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; // Reduzido de 1rem para trazer conteúdo mais junto
}

.hero-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; // Mudado de center para flex-start
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem; // Pequeno espaço entre top row e bottom row
}

.hero-bottom-row {
  margin-bottom: 0.5rem;
  margin-top: 0; // Remove margem superior extra
}

.greeting-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideInRight 0.6s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  animation: slideInLeft 0.7s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 0;
  
  // Permite quebra de linha se nome for muito grande
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  
  .name-highlight {
    color: #fff;
    font-weight: 800;
    position: relative;
    display: inline;
    
    // Permite quebra de linha no nome
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.4) 100%);
      border-radius: 2px;
    }
  }
}

.hero-subtitle {
  font-size: 0.95rem;
  opacity: 0.85;
  margin: 0;
  animation: slideInLeft 0.8s ease;
  font-weight: 400;
  letter-spacing: 0.2px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  animation: slideInUp 0.8s ease;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 0.875rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.3px;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.income-hero-btn {
  background: rgba(255, 255, 255, 0.95);
  color: #059669;
  
  &:hover {
    background: white;
    color: #047857;
  }
  
  .q-icon {
    color: #059669;
  }
}

.expense-hero-btn {
  background: rgba(255, 255, 255, 0.95);
  color: #dc2626;
  
  &:hover {
    background: white;
    color: #b91c1c;
  }
  
  .q-icon {
    color: #dc2626;
  }
}

// ==========================================================================
// PERIOD FILTER SECTION - Design Melhorado
// ==========================================================================
.period-filter-section {
  animation: fadeInUp 0.6s ease;
  
  .advanced-filter-expansion {
    background: white;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      border-color: rgba(25, 118, 210, 0.3);
      box-shadow: 0 4px 16px rgba(25, 118, 210, 0.08);
    }
  }
  
  .advanced-filter-header {
    padding: 12px 16px;
    
    .q-item__section--avatar {
      min-width: auto;
      padding-right: 12px;
    }
    
    .q-item-label {
      font-size: 0.95rem;
      color: #1f2937;
    }
    
    .q-item-label--caption {
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 2px;
    }
  }
  
  .advanced-filter-card {
    background: #f9fafb;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    margin-top: 0;
  }
}

.future-month-banner {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 2px solid #fed7aa;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 12px rgba(251, 146, 60, 0.15);
  
  .text-h6 {
    color: #ea580c;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
  
  .text-body2 {
    color: #9a3412;
    line-height: 1.5;
  }
  
  .opacity-80 {
    opacity: 0.85;
  }
}

// ==========================================================================
// METRIC CARDS - Premium Design
// ==========================================================================
.metric-card {
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  height: 100%;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    
    .metric-icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }
    
    .metric-bg-icon {
      transform: scale(1.1) rotate(-5deg);
      opacity: 0.15;
    }
  }
  
  &:active {
    transform: translateY(-4px) scale(1);
  }
}

.metric-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.income-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.expense-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.balance-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.transactions-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.metric-content {
  position: relative;
  z-index: 2;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.metric-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  
  &.positive {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
  }
  
  &.negative {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
  
  &.neutral {
    background: rgba(59, 130, 246, 0.1);
    color: #2563eb;
  }
  
  &.info {
    background: rgba(139, 92, 246, 0.1);
    color: #7c3aed;
  }
}

.metric-bg-icon {
  position: absolute;
  right: -20px;
  bottom: -20px;
  font-size: 140px;
  color: #f1f5f9;
  opacity: 0.1;
  transition: all 0.4s ease;
  z-index: 1;
}

// ==========================================================================
// MAIN CHART - Gráfico Principal de Evolução (Posição Final)
// ==========================================================================
.main-chart-card {
  background: linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  // Efeito de brilho sutil no topo
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      #10b981 25%, 
      #3b82f6 50%, 
      #ef4444 75%, 
      transparent 100%
    );
  }
  
  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chart-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c5f2d 0%, #3d7c3e 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(44, 95, 45, 0.3);
  
  &.category {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
  
  &.actions {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }
}

.chart-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
}

.chart-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

.chart-period-selector {
  .period-toggle {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    padding: 4px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    
    :deep(.q-btn) {
      border-radius: 10px;
      padding: 0.625rem 1rem;
      font-weight: 600;
      font-size: 0.8rem;
      transition: all 0.2s ease;
      min-width: fit-content;
      
      &:hover {
        background: #e2e8f0;
      }
      
      &.q-btn--active {
        background: linear-gradient(135deg, #2c5f2d 0%, #3d7c3e 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(44, 95, 45, 0.3);
      }
      
      // Ícones menores para economizar espaço
      .q-icon {
        font-size: 1rem;
        margin-right: 0.25rem;
      }
    }
  }
}

.chart-body {
  min-height: 380px;
  position: relative;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.main-chart-canvas {
  max-height: 380px;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 380px;
  gap: 1rem;
  
  p {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0;
  }
}

// Estado vazio do gráfico de evolução
.evolution-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  min-height: 380px;
  
  .empty-icon-wrapper-large {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .empty-title-large {
    font-size: 1.25rem;
    font-weight: 700;
    color: #475569;
    margin: 0 0 0.75rem 0;
  }
  
  .empty-subtitle-large {
    font-size: 1rem;
    color: #94a3b8;
    margin: 0 0 2rem 0;
    line-height: 1.6;
  }
  
  .empty-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 3rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  flex-wrap: wrap;
  border: 2px solid #e2e8f0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.legend-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  
  &.income {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  &.expense {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  &.balance {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
}

.legend-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.legend-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.legend-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  
  &.positive {
    color: #10b981;
  }
  
  &.negative {
    color: #ef4444;
  }
}

// ==========================================================================
// CATEGORY CHART - Gráfico de Categorias
// ==========================================================================
.category-chart-card {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.chart-header-simple {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.chart-title-small {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.chart-subtitle-small {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.category-chart-body {
  /* Mobile: altura maior para melhor visualização */
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  position: relative;
}

.category-chart-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-chart-canvas {
  max-height: 280px;
}

.chart-loading-small {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

// Estado vazio do gráfico de categorias
.category-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  
  .empty-icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .empty-title {
    font-size: 1rem;
    font-weight: 600;
    color: #475569;
    margin: 0 0 0.5rem 0;
  }
  
  .empty-subtitle {
    font-size: 0.875rem;
    color: #94a3b8;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }
}

// Informações adicionais do gráfico
.category-insights {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-top: 0.5rem;
  
  .insight-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .insight-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// ==========================================================================
// QUICK ACTIONS - Ações Rápidas Modernizadas
// ==========================================================================
.quick-actions-modern {
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
}

.actions-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f8fafc;
  border: 2px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: white;
    border-color: #e2e8f0;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    .action-arrow {
      transform: translateX(4px);
      opacity: 1;
    }
    
    .action-icon {
      transform: scale(1.1);
    }
  }
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  &.income {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  &.expense {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
  
  &.transactions {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  &.reports {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.action-description {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.action-arrow {
  color: #cbd5e1;
  transition: all 0.3s ease;
  opacity: 0;
}

// ==========================================================================
// RECENT TRANSACTIONS - Modern Design
// ==========================================================================
.recent-transactions-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
  
  h6 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .text-caption {
    color: #64748b;
  }
  
  .transaction-item {
    padding: 1.25rem;
    margin: 0.5rem 0;
    border-radius: 16px;
    background: #f8fafc;
    border: 2px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, #10b981 0%, #059669 100%);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      background: white;
      border-color: #e2e8f0;
      transform: translateX(8px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      
      &::before {
        transform: scaleX(1);
      }
      
      .q-avatar {
        transform: scale(1.1) rotate(5deg);
      }
    }
    
    .q-avatar {
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

// ==========================================================================
// ANIMATIONS
// ==========================================================================
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(-5deg);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ==========================================================================
// DARK MODE SUPPORT
// ==========================================================================
:global(.body--dark) {
  .modern-dashboard {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
  }
  
  .hero-header {
    background: linear-gradient(135deg, #1f3a20 0%, #2a4a2b 100%);
  }
  
  .metric-card,
  .chart-card,
  .recent-transactions-card,
  .quick-actions-card {
    background: #1e1e2e;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    
    h6 {
      color: #e2e8f0;
    }
    
    .metric-label {
      color: #94a3b8;
    }
    
    .metric-value {
      color: #f1f5f9;
    }
  }
  
  .transaction-item {
    background: #252535;
    
    &:hover {
      background: #2a2a3a;
      border-color: #3a3a4a;
    }
  }
  
  .quick-links .q-btn {
    background: #252535;
    color: #cbd5e1;
    
    &:hover {
      background: #2a2a3a;
      color: #f1f5f9;
    }
  }
}

// ==========================================================================
// RESPONSIVE DESIGN - MOBILE FIRST - MÁXIMO USO DA TELA
// ==========================================================================

/* Mobile Portrait (320px - 599px) - MÁXIMO APROVEITAMENTO */
@media (max-width: 599px) {
  .modern-dashboard {
    // Espaço para bottom nav (56px) + safe area + margem
    padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important;
    min-height: 100vh;
  }
  
  .dashboard-wrapper {
    padding: 0; /* Remove padding wrapper */
  }
  
  /* Seções com padding mínimo */
  .hero-header,
  .metrics-row,
  .secondary-section,
  .transactions-section,
  .chart-evolution-section {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  
  .hero-header {
    padding: 0.875rem !important; // Padding uniforme reduzido
    border-radius: 10px;
    margin-bottom: 0.625rem !important;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  
  /* Layout mobile para hero top row */
  .hero-top-row {
    flex-direction: row; // Mantém em linha horizontal
    align-items: center; // Centraliza verticalmente
    justify-content: space-between; // Nome à esquerda, badge à direita
    gap: 0.5rem;
    margin-bottom: 0.5rem; // Espaço antes da subtitle
    flex-wrap: wrap; // Permite quebra se nome for muito grande
  }
  
  .greeting-badge {
    font-size: 0.75rem;
    padding: 0.375rem 0.875rem;
    flex-shrink: 0; // Não encolhe
    white-space: nowrap; // Não quebra o texto do badge
    order: 2; // Move para a direita (depois do título)
  }
  
  .hero-title {
    font-size: 1.375rem; // Aumentado de 1.25rem
    line-height: 1.3;
    order: 1; // Mantém à esquerda (antes do badge)
    margin-bottom: 0.25rem; // Pequeno espaço abaixo do título
    flex: 1; // Ocupa espaço disponível
    
    // Garante quebra de linha em nomes longos
    max-width: 100%;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  
  .hero-bottom-row {
    margin-bottom: 0.5rem;
    margin-top: 0;
  }
  
  .hero-subtitle {
    font-size: 0.75rem;
  }
  
  .hero-actions {
    width: 100%;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
  
  .hero-btn {
    flex: 1;
    padding: 0.75rem 0.875rem;
    font-size: 0.8125rem;
    
    .q-icon {
      font-size: 1rem;
    }
  }
  
  .metrics-row,
  .secondary-section,
  .transactions-section,
  .chart-evolution-section {
    margin-bottom: 0.625rem !important;
  }
  
  /* Cards de Métricas - Compactos e empilhados */
  .metric-card {
    padding: 0.875rem;
    margin-bottom: 0.5rem;
    border-radius: 10px;
    
    .metric-icon-wrapper {
      width: 40px;
      height: 40px;
      
      .q-icon {
        font-size: 1.375rem;
      }
    }
    
    .metric-value {
      font-size: 1.25rem;
      margin-top: 0.375rem;
    }
    
    .metric-label {
      font-size: 0.7rem;
    }
    
    .metric-badge {
      font-size: 0.625rem;
      padding: 0.1875rem 0.4375rem;
    }
    
    /* Remover hover effects em mobile (melhor performance) */
    &:hover {
      transform: none;
    }
  }
  
  /* Gráficos otimizados para mobile - ALTURA MAIOR */
  .category-chart-card,
  .quick-actions-modern {
    margin-bottom: 0.625rem;
    padding: 0.875rem;
    border-radius: 12px;
  }
  
  .chart-header-simple {
    padding: 0.625rem 0;
    margin-bottom: 0.75rem;
    
    .chart-title-small {
      font-size: 0.875rem;
    }
    
    .chart-subtitle-small {
      font-size: 0.6875rem;
    }
    
    .chart-icon-wrapper {
      width: 32px;
      height: 32px;
      
      .q-icon {
        font-size: 0.875rem;
      }
    }
  }
  
  /* GRÁFICO DE CATEGORIAS - MAIOR EM MOBILE */
  .category-chart-body {
    min-height: 340px !important;
    padding: 0.375rem;
  }
  
  .category-chart-canvas {
    max-height: 340px !important;
  }
  
  /* Ações Rápidas - Mobile */
  .actions-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .action-card {
    padding: 0.75rem;
    border-radius: 10px;
    
    .action-icon {
      width: 40px;
      height: 40px;
      
      .q-icon {
        font-size: 1.375rem;
      }
    }
    
    .action-title {
      font-size: 0.8125rem;
    }
    
    .action-description {
      font-size: 0.6875rem;
    }
  }
  
  /* Gráfico Principal Mobile - ALTURA MUITO MAIOR */
  .main-chart-card {
    padding: 0.875rem;
    border-radius: 12px;
    
    .chart-header {
      padding: 0.5rem 0;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    
    .chart-title {
      font-size: 0.9375rem;
    }
    
    .chart-subtitle {
      font-size: 0.6875rem;
    }
    
    .chart-period-selector {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin-top: 0.625rem;
      
      .period-toggle {
        flex-wrap: nowrap;
        padding: 2px;
        
        :deep(.q-btn) {
          min-width: 52px;
          padding: 0.4375rem 0.5rem;
          font-size: 0.625rem;
          white-space: nowrap;
          
          .q-icon {
            display: none; /* Esconde ícones em telas muito pequenas */
          }
        }
      }
    }
  }
  
  /* GRÁFICO DE EVOLUÇÃO - MUITO MAIOR EM MOBILE */
  .chart-body {
    min-height: 380px !important;
    padding: 0.375rem;
    margin-bottom: 0.75rem;
    border-radius: 10px;
  }
  
  .main-chart-canvas {
    max-height: 380px !important;
  }
  
  .chart-legend {
    flex-direction: column;
    padding: 0.625rem;
    gap: 0.5rem;
    
    .legend-item {
      width: 100%;
      justify-content: space-between;
    }
    
    .legend-value {
      font-size: 0.8125rem;
      font-weight: 600;
    }
    
    .legend-label {
      font-size: 0.6875rem;
    }
  }
  
  /* Transações Recentes Mobile */
  .recent-transactions-card {
    border-radius: 12px;
    
    .q-card-section {
      padding: 0.875rem;
      
      h6 {
        font-size: 0.875rem;
      }
      
      .text-caption {
        font-size: 0.6875rem;
      }
      
      .q-btn {
        font-size: 0.6875rem;
        padding: 0.3125rem 0.625rem;
      }
    }
    
    /* Otimização da lista de transações */
    .q-list {
      padding: 0;
    }
    
    .transaction-item {
      padding: 1rem 0.75rem !important;
      min-height: unset;
      
      /* Layout em coluna para mobile */
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.625rem;
      
      /* Avatar e descrição na primeira linha */
      .q-item-section.avatar {
        align-self: flex-start;
        width: 100%;
        flex-direction: row !important;
        align-items: center;
        gap: 0.75rem;
        padding: 0 !important;
        
        .q-avatar {
          width: 40px;
          height: 40px;
          font-size: 1.125rem;
          flex-shrink: 0;
        }
      }
      
      /* Seção principal (descrição e categoria) */
      .q-item-section:not(.avatar):not(.side) {
        width: 100%;
        padding: 0 !important;
        margin-left: 52px; /* Alinha com texto acima (40px avatar + 12px gap) */
        
        .q-item-label {
          font-size: 0.9375rem;
          line-height: 1.4;
          font-weight: 500;
          
          &:not(.caption) {
            margin-bottom: 0.25rem;
          }
          
          &.caption {
            font-size: 0.75rem;
            opacity: 0.7;
            margin-top: 0.125rem;
          }
        }
      }
      
      /* Valor - Destaque em linha separada */
      .q-item-section.side {
        width: 100%;
        align-items: flex-start !important;
        margin-left: 52px; /* Alinha com descrição */
        padding: 0.5rem 0 0 0 !important;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        
        .q-item-label {
          font-size: 1.125rem !important; /* 18px - BEM maior */
          font-weight: 700;
          letter-spacing: -0.01em;
        }
      }
      
      /* Hover desativado em mobile */
      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }
  
  /* Row gutters menores */
  .row {
    margin: -0.25rem;
    
    > div {
      padding: 0.25rem;
    }
  }
}

/* Mobile Landscape e Small Tablets (600px - 1023px) */
@media (min-width: 600px) and (max-width: 1023px) {
  .dashboard-wrapper {
    padding: 0.5rem;
  }
  
  .hero-header {
    padding: 1.25rem;
    border-radius: 14px;
  }
  
  /* Cards de Métricas - 2 colunas em tablets */
  .metric-card {
    padding: 1.125rem;
  }
  
  /* Gráficos otimizados para tablet */
  .category-chart-card,
  .quick-actions-modern {
    margin-bottom: 1rem;
  }
  
  .category-chart-body {
    min-height: 280px;
    padding: 0.875rem;
  }
  
  /* Ações Rápidas - 2 colunas em tablet */
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  /* Gráfico Principal Tablet */
  .main-chart-card {
    .chart-header {
      flex-direction: row;
      align-items: center;
    }
  }
  
  .chart-body {
    min-height: 320px;
    padding: 0.875rem;
  }
  
  /* Row gutters médios */
  .row {
    margin: -0.375rem;
    
    > div {
      padding: 0.375rem;
    }
  }
}

/* Tablets Médios (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .dashboard-wrapper {
    padding: 1rem;
  }
  
  /* 3 colunas para métricas em tablets médios */
  .metrics-row {
    .row > div {
      max-width: 33.333%;
    }
  }
  
  /* 2 colunas para ações */
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

/* Desktops Grandes (1440px - 1919px) */
@media (min-width: 1440px) and (max-width: 1919px) {
  .dashboard-wrapper {
    padding: 1.5rem;
  }
  
  /* 4 colunas para métricas */
  .metrics-row {
    .row > div {
      max-width: 25%;
    }
  }
  
  /* 3 colunas para ações */
  .actions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Ultra Wide (1920px+) */
@media (min-width: 1920px) {
  .dashboard-wrapper {
    max-width: 1920px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  /* 4 colunas para métricas */
  .metrics-row {
    .row > div {
      max-width: 25%;
    }
  }
  
  /* 3 colunas para ações */
  .actions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  /* Limitar altura dos gráficos em telas muito grandes */
  .category-chart-body {
    max-height: 400px;
  }
  
  .chart-body {
    max-height: 500px;
  }
}

// ==========================================================================
// ACESSIBILIDADE & INTERAÇÕES
// ==========================================================================

/* Reduzir animações para usuários com preferência */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Modo de Alto Contraste */
@media (prefers-contrast: high) {
  .metric-card,
  .category-chart-card,
  .quick-actions-modern,
  .main-chart-card,
  .recent-transactions-card {
    border-width: 2px;
  }
  
  .hero-btn,
  .action-card,
  .transaction-item {
    border: 2px solid currentColor;
  }
}

/* Orientação Landscape em Mobile */
@media (max-width: 899px) and (orientation: landscape) {
  .hero-header {
    padding: 0.75rem;
  }
  
  .metrics-row {
    .row > div {
      max-width: 50%; /* 2 colunas em landscape */
    }
  }
  
  .chart-body {
    min-height: 240px; /* Reduz altura em landscape */
  }
}

// ==========================================================================
// DIALOG DE TRANSAÇÃO - MOBILE SCROLL FIX
// ==========================================================================
:deep(.transaction-dialog-mobile) {
  @media (max-width: 599px) {
    // Remove backdrop para melhor performance
    .q-dialog__backdrop {
      background: rgba(0, 0, 0, 0.7) !important;
    }
    
    .q-dialog__inner {
      padding: 0 !important;
      // Garante scroll no mobile mesmo com teclado
      overflow-y: auto !important;
      overflow-x: hidden !important;
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior: contain !important;
      
      // Fix para iOS - permite scroll quando teclado está aberto
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      height: 100vh !important;
      width: 100vw !important;
      max-height: 100vh !important;
      
      // Força área scrollável
      > * {
        height: auto !important;
        min-height: 150vh !important;
      }
      
      .transaction-form-card {
        margin: 0 !important;
        border-radius: 0 !important;
        max-height: none !important;
        height: auto !important;
        min-height: 150vh !important;
        overflow: visible !important;
        
        .q-card-section {
          // Extra padding quando teclado abre
          padding-bottom: calc(400px + env(safe-area-inset-bottom)) !important;
          min-height: 100vh !important;
        }
      }
    }
  }
}
</style>