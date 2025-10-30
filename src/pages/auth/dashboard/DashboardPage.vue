<template>
  <q-page class="dashboard-page">
    <div class="q-pa-md">
      
      <!-- ==========================================================================
      CABEÇALHO DO DASHBOARD
      ========================================================================== -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12">
          <div class="welcome-section">
            <h1 class="text-h4 q-mb-xs">
              Olá, {{ authStore.userDisplayName }}!
            </h1>
            <p class="text-subtitle1">
              Aqui está um resumo das suas finanças
            </p>
          </div>
        </div>
      </div>

      <!-- ==========================================================================
      CARDS DE MÉTRICAS PRINCIPAIS
      ========================================================================== -->
      <div class="row q-col-gutter-md q-mb-lg">
        
        <!-- Card de Receitas -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="dashboard-metric-card income-card" flat bordered>
            <q-card-section class="flex items-center justify-between">
              <div v-if="!isLoadingStats">
                <div class="metric-label text-caption">
                  Receitas
                </div>
                <div class="metric-value text-h5 text-green-7 q-mb-xs">
                  {{ formatCurrency(transactionStats.totalIncome) }}
                </div>
                <div class="metric-trend text-green-6 text-caption">
                  <q-icon name="trending_up" size="xs" />
                  {{ transactionStats.incomeGrowth > 0 ? '+' : '' }}{{ transactionStats.incomeGrowth.toFixed(1) }}% este mês
                </div>
              </div>
              <div v-else class="full-width">
                <q-skeleton type="text" width="30%" />
                <q-skeleton type="text" width="60%" height="2rem" class="q-mt-xs" />
                <q-skeleton type="text" width="40%" />
              </div>
              <q-icon 
                name="trending_up" 
                size="2.5rem" 
                color="green-6" 
                class="metric-icon"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Card de Despesas -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="dashboard-metric-card expense-card" flat bordered>
            <q-card-section class="flex items-center justify-between">
              <div v-if="!isLoadingStats">
                <div class="metric-label text-caption">
                  Despesas
                </div>
                <div class="metric-value text-h5 text-red-7 q-mb-xs">
                  {{ formatCurrency(transactionStats.totalExpense) }}
                </div>
                <div class="metric-trend text-red-6 text-caption">
                  <q-icon name="trending_down" size="xs" />
                  {{ transactionStats.expenseGrowth > 0 ? '+' : '' }}{{ transactionStats.expenseGrowth.toFixed(1) }}% este mês
                </div>
              </div>
              <div v-else class="full-width">
                <q-skeleton type="text" width="30%" />
                <q-skeleton type="text" width="60%" height="2rem" class="q-mt-xs" />
                <q-skeleton type="text" width="40%" />
              </div>
              <q-icon 
                name="trending_down" 
                size="2.5rem" 
                color="red-6" 
                class="metric-icon"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Card de Saldo -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="dashboard-metric-card balance-card" flat bordered>
            <q-card-section class="flex items-center justify-between">
              <div v-if="!isLoadingStats">
                <div class="metric-label text-caption">
                  Saldo
                </div>
                <div class="metric-value text-h5 q-mb-xs" :class="balanceColor">
                  {{ formatCurrency(transactionStats.balance) }}
                </div>
                <div class="metric-trend text-caption">
                  <q-icon name="account_balance_wallet" size="xs" />
                  Posição atual
                </div>
              </div>
              <div v-else class="full-width">
                <q-skeleton type="text" width="30%" />
                <q-skeleton type="text" width="60%" height="2rem" class="q-mt-xs" />
                <q-skeleton type="text" width="40%" />
              </div>
              <q-icon 
                name="account_balance_wallet" 
                size="2.5rem" 
                :color="transactionStats.balance >= 0 ? 'blue-6' : 'orange-6'" 
                class="metric-icon"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Card de Transações -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="dashboard-metric-card transactions-card" flat bordered>
            <q-card-section class="flex items-center justify-between">
              <div v-if="!isLoadingStats">
                <div class="metric-label text-caption">
                  Transações
                </div>
                <div class="metric-value text-h5 text-purple-7 q-mb-xs">
                  {{ transactionStats.transactionCount }}
                </div>
                <div class="metric-trend text-purple-6 text-caption">
                  <q-icon name="receipt_long" size="xs" />
                  Este período
                </div>
              </div>
              <div v-else class="full-width">
                <q-skeleton type="text" width="30%" />
                <q-skeleton type="text" width="60%" height="2rem" class="q-mt-xs" />
                <q-skeleton type="text" width="40%" />
              </div>
              <q-icon 
                name="receipt_long" 
                size="2.5rem" 
                color="purple-6" 
                class="metric-icon"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- ==========================================================================
      GRÁFICOS E ANÁLISES
      ========================================================================== -->
      <div class="row q-col-gutter-md q-mb-lg">
        
        <!-- Gráfico de Evolução Financeira -->
        <div class="col-12 col-md-8">
          <q-card class="chart-card" flat bordered>
            <q-card-section class="flex items-center justify-between">
              <div>
                <h6 class="text-h6 q-ma-none">
                  Evolução Financeira
                </h6>
                <p class="text-caption q-ma-none">
                  Receitas vs Despesas nos últimos meses
                </p>
              </div>
              
              <!-- Filtros de período -->
              <q-btn-toggle
                v-model="chartPeriod"
                toggle-color="primary"
                :options="[
                  { label: '3M', value: '3months' },
                  { label: '6M', value: '6months' },
                  { label: '1A', value: '1year' }
                ]"
                no-caps
                flat
                dense
                @update:model-value="updateChartData"
              />
            </q-card-section>
            
            <q-card-section class="chart-container">
              <div v-if="isLoadingCharts" class="flex items-center justify-center full-height">
                <q-spinner-dots color="primary" size="2em" />
              </div>
              <canvas 
                v-else
                ref="lineChartRef" 
                id="lineChart"
                class="full-width"
              ></canvas>
            </q-card-section>
          </q-card>
        </div>

        <!-- Gráfico de Categorias -->
        <div class="col-12 col-md-4">
          <q-card class="chart-card" flat bordered>
            <q-card-section>
              <h6 class="text-h6 q-ma-none">
                Por Categoria
              </h6>
              <p class="text-caption q-ma-none">
                Distribuição das despesas
              </p>
            </q-card-section>
            
            <q-card-section class="chart-container">
              <div v-if="isLoadingCharts" class="flex items-center justify-center full-height">
                <q-spinner-dots color="primary" size="2em" />
              </div>
              <canvas 
                v-else
                ref="doughnutChartRef" 
                id="doughnutChart"
                class="full-width"
              ></canvas>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- ==========================================================================
      TRANSAÇÕES RECENTES E AÇÕES RÁPIDAS
      ========================================================================== -->
      <div class="row q-col-gutter-md">
        
        <!-- Lista de Transações Recentes -->
        <div class="col-12 col-md-8">
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

        <!-- Ações Rápidas -->
        <div class="col-12 col-md-4">
          <q-card class="quick-actions-card" flat bordered>
            <q-card-section>
              <h6 class="text-h6 q-ma-none">
                Ações Rápidas
              </h6>
              <p class="text-caption q-ma-none">
                Adicionar movimentações
              </p>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="q-gutter-md">
                
                <!-- Botão Adicionar Receita -->
                <q-btn
                  label="Nova Receita"
                  icon="add_circle"
                  color="green-6"
                  class="full-width"
                  size="md"
                  no-caps
                  @click="openTransactionDialog('income')"
                />

                <!-- Botão Adicionar Despesa -->
                <q-btn
                  label="Nova Despesa"
                  icon="remove_circle"
                  color="red-6"
                  class="full-width"
                  size="md"
                  no-caps
                  @click="openTransactionDialog('expense')"
                />

                <!-- Separador -->
                <q-separator class="q-my-md" />

                <!-- Links Úteis -->
                <div class="quick-links">
                  <q-btn
                    label="Relatórios"
                    icon="assessment"
                    flat
                    color="primary"
                    class="full-width"
                    no-caps
                    align="left"
                    @click="$router.push('/reports')"
                  />
                  
                  <q-btn
                    label="Configurações"
                    icon="settings"
                    flat
                    color="primary"
                    class="full-width"
                    no-caps
                    align="left"
                    @click="$router.push('/profile')"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- ==========================================================================
    DIALOG DE NOVA TRANSAÇÃO
    ========================================================================== -->
    <q-dialog 
      v-model="showAddTransactionDialog" 
      persistent 
      maximized 
      transition-show="slide-up" 
      transition-hide="slide-down"
    >
      <q-card class="transaction-dialog">
        <q-bar class="bg-primary text-white">
          <q-icon name="receipt_long" />
          <div class="text-weight-medium">
            {{ newTransactionType === 'income' ? 'Nova Receita' : 'Nova Despesa' }}
          </div>
          <q-space />
          <q-btn 
            dense 
            flat 
            icon="close" 
            @click="closeTransactionDialog"
          />
        </q-bar>

        <q-card-section class="q-pa-lg">
          <!-- Formulário será implementado no próximo componente -->
          <div class="text-center q-py-xl">
            <q-icon name="construction" size="4rem" color="grey-4" />
            <p class="text-h6 q-mt-md">
              Formulário de transação
            </p>
            <p class="text-caption">
              Será implementado na página de transações
            </p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useTransactionStore } from 'src/stores/transactions'
import { useDashboardStore } from 'src/stores/dashboard'
import { useCurrency } from 'src/composables/useCurrency'
import { useDate } from 'src/composables/useDate'
import { Chart, registerables } from 'chart.js'

// Registrar componentes do Chart.js
Chart.register(...registerables)

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================
const router = useRouter()
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
const chartPeriod = ref('6months')

// Referências dos gráficos
const lineChartRef = ref(null)
const doughnutChartRef = ref(null)
let lineChart = null
let doughnutChart = null

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================

/**
 * Estatísticas das transações
 */
const transactionStats = computed(() => {
  return dashboardStore.formattedStats
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

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Carrega dados iniciais do dashboard
 */
const loadDashboardData = async () => {
  console.log('📊 [DASHBOARD] Carregando dados iniciais')
  
  try {
    // Carrega todos os dados do dashboard usando a nova store
    await dashboardStore.loadDashboard({
      dateRange: {}, // Pode adicionar filtros aqui
      recentLimit: 5
    })
    
  } catch (error) {
    console.error('❌ [DASHBOARD] Erro ao carregar dados:', error.message)
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
 * Inicializa gráfico de linha (Evolução Financeira)
 */
const initLineChart = () => {
  if (!lineChartRef.value) return
  
  const ctx = lineChartRef.value.getContext('2d')
  
  // Usar dados reais da dashboard store
  const chartData = dashboardStore.monthlyEvolution

  const config = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
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
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6
        }
      }
    }
  }

  lineChart = new Chart(ctx, config)
}

/**
 * Inicializa gráfico de rosca (Categorias)
 */
const initDoughnutChart = () => {
  if (!doughnutChartRef.value) return
  
  const ctx = doughnutChartRef.value.getContext('2d')
  
  // Usar dados reais da dashboard store
  const chartData = dashboardStore.categoryAnalysis

  const config = {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  }

  doughnutChart = new Chart(ctx, config)
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
  
  // Carrega dados iniciais
  await loadDashboardData()
  
  // Inicializa gráficos após próximo tick
  await nextTick()
  initLineChart()
  initDoughnutChart()
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// SAGE ACCOUNTANT DESIGN SYSTEM - DASHBOARD PAGE
// ==========================================================================

.dashboard-page {
  background: var(--sage-app-gradient);
  min-height: 100vh;
  max-width: 100%;
  overflow-x: hidden;
  
  .q-pa-md {
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .row {
    margin-left: 0;
    margin-right: 0;
  }
}

.welcome-section {
  padding: 1.5rem 0;
  animation: fadeIn 0.6s ease;
  
  h1 {
    color: var(--sage-primary);
    text-shadow: 0 2px 4px rgba(44, 95, 45, 0.1);
  }
}

// Reconhecimento de tema dark no cabeçalho
:global(.body--dark) .welcome-section :deep(h1) {
  color: #fff !important;
}

:global(.body--dark) .welcome-section :deep(.text-subtitle1) {
  color: #cfcfcf !important;
}

// Cards de métricas do dashboard com gradientes Sage
.dashboard-metric-card {
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(44, 95, 45, 0.1);
  background: white;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    transition: width 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(44, 95, 45, 0.15);
    border-color: var(--sage-primary-light);
    
    &::before {
      width: 8px;
    }
    
    .metric-icon {
      transform: scale(1.1) rotate(5deg);
      opacity: 1;
    }
  }
  
  &.income-card {
    &::before {
      background: linear-gradient(180deg, #107C10 0%, #0f6e0f 100%);
    }
    
    &:hover {
      box-shadow: 0 12px 28px rgba(16, 124, 16, 0.2);
    }
  }
  
  &.expense-card {
    &::before {
      background: linear-gradient(180deg, #d32f2f 0%, #b71c1c 100%);
    }
    
    &:hover {
      box-shadow: 0 12px 28px rgba(211, 47, 47, 0.2);
    }
  }
  
  &.balance-card {
    &::before {
      background: var(--sage-gradient);
    }
    
    &:hover {
      box-shadow: 0 12px 28px rgba(44, 95, 45, 0.2);
    }
  }
  
  &.transactions-card {
    &::before {
      background: linear-gradient(180deg, #5F7C60 0%, #4a6350 100%);
    }
    
    &:hover {
      box-shadow: 0 12px 28px rgba(95, 124, 96, 0.2);
    }
  }
}

.metric-value {
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.metric-icon {
  opacity: 0.75;
  transition: all 0.3s ease;
}

// Cards de gráficos
.chart-card {
  border-radius: 16px;
  border: 1px solid rgba(44, 95, 45, 0.1);
  transition: all 0.3s ease;
  background: white;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(44, 95, 45, 0.12);
    transform: translateY(-2px);
  }
  
  .chart-container {
    height: 300px;
    position: relative;
    padding: 1rem;
  }
  
  .q-btn-toggle {
    border: 1px solid rgba(44, 95, 45, 0.2);
    border-radius: 8px;
    
    .q-btn {
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(44, 95, 45, 0.05);
      }
    }
  }
}

// Transações recentes
.recent-transactions-card {
  border-radius: 16px;
  border: 1px solid rgba(44, 95, 45, 0.1);
  background: white;
  transition: all 0.3s ease;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(44, 95, 45, 0.12);
  }
  
  .transaction-item {
    padding: 1rem;
    margin: 0 0.5rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--sage-positive);
      transform: scaleY(0);
      transition: transform 0.3s ease;
      border-radius: 0 4px 4px 0;
    }
    
    &:hover {
      background: linear-gradient(90deg, rgba(44, 95, 45, 0.04) 0%, rgba(44, 95, 45, 0.02) 100%);
      transform: translateX(4px);
      
      &::before {
        transform: scaleY(1);
      }
    }
    
    .q-avatar {
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }
    
    &:hover .q-avatar {
      border-color: var(--sage-primary-light);
      transform: scale(1.05);
    }
  }
}

// Ações rápidas
.quick-actions-card {
  border-radius: 16px;
  border: 1px solid rgba(44, 95, 45, 0.1);
  background: white;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(44, 95, 45, 0.12);
  }
  
  .q-btn {
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
  }
  
  .quick-links {
    .q-btn {
      margin-bottom: 0.5rem;
      
      &:hover {
        background: rgba(44, 95, 45, 0.05);
      }
    }
  }
}

// Dialog de transação
.transaction-dialog {
  .q-bar {
    background: var(--sage-gradient);
    border-radius: 0;
  }
}

// Animações
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsividade
@media (max-width: 768px) {
  .metric-value {
    font-size: 1.2rem;
  }
  
  .chart-container {
    height: 250px;
    padding: 0.5rem;
  }
  
  .dashboard-metric-card {
    &:hover {
      transform: translateY(-3px);
    }
  }
}
</style>