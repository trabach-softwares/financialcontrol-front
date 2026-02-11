<!--
  ==========================================================================
  PÁGINA - RELATÓRIOS FINANCEIROS
  ==========================================================================
  Propósito: Visualização de relatórios dinâmicos baseados no plano do usuário
  Planos:
    - GRATUITO: Relatórios básicos, resumo mensal, até 3 categorias
    - PRO: Relatórios avançados, gráficos, exportação, categorias ilimitadas
    - PREMIUM: Tudo do PRO + analytics avançados (futuro)
-->

<template>
  <q-page class="reports-page q-pa-md">
    <!-- Header -->
    <div class="page-header q-mb-lg">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <h1 class="text-h4 text-weight-bold q-ma-none">
            <q-icon name="assessment" class="q-mr-sm" />
            {{ $t('reports.title') }}
          </h1>
          <p class="text-subtitle1 text-grey-7 q-mt-sm q-mb-none">
            {{ $t('reports.subtitle') }}
          </p>
        </div>
        
        <!-- Badge do plano atual -->
        <div class="col-auto">
          <q-badge 
            :color="planBadgeColor" 
            :label="currentPlanName"
            class="text-bold q-px-md q-py-sm"
            style="font-size: 0.85rem;"
          >
            <q-icon 
              :name="planIcon" 
              size="18px" 
              class="q-ml-xs"
            />
          </q-badge>
        </div>
      </div>
    </div>

    <!-- Filtros de Período -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-auto">
            <div class="text-subtitle2 text-grey-7">Período:</div>
          </div>
          
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.startDate"
              type="date"
              outlined
              dense
              label="Data Inicial"
              :max="filters.endDate || undefined"
            />
          </div>
          
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.endDate"
              type="date"
              outlined
              dense
              label="Data Final"
              :min="filters.startDate || undefined"
            />
          </div>
          
          <div class="col-12 col-md-auto">
            <q-btn
              outline
              color="primary"
              label="Aplicar Filtros"
              icon="filter_list"
              @click="applyFilters"
              :loading="isLoadingData"
            />
          </div>
          
          <div class="col-12 col-md-auto" v-if="filters.startDate || filters.endDate">
            <q-btn
              flat
              color="grey-7"
              label="Limpar"
              icon="clear"
              @click="clearFilters"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Conteúdo baseado no plano -->
    <div v-if="!isLoadingData">
      <!-- ====================================================================== -->
      <!-- PLANO GRATUITO - Relatórios Básicos -->
      <!-- ====================================================================== -->
      <div v-if="isFreePlan">
        <!-- Resumo Básico -->
        <BasicSummaryReport 
          :data="reportData"
          class="q-mb-md"
        />

        <!-- Gráfico de Pizza por Categoria (limitado) -->
        <BasicCategoryChart
          :data="reportData"
          :max-categories="3"
          class="q-mb-md"
        />

        <!-- Banner de upgrade para recursos PRO -->
        <UpgradeFeatureBanner
          feature-name="ADVANCED_REPORTS"
          variant="inline"
          :show-comparison="false"
          class="q-mb-md"
        />

        <!-- Preview bloqueado de recursos PRO -->
        <div class="locked-features q-mt-lg">
          <q-card flat bordered class="locked-card">
            <q-card-section class="text-center q-pa-xl relative-position">
              <div class="blur-content">
                <q-icon name="bar_chart" size="64px" color="grey-4" class="q-mb-md" />
                <div class="text-h6 text-grey-6">Gráficos Avançados</div>
                <div class="text-caption text-grey-5">Disponível no plano PRO</div>
              </div>
              <div class="lock-overlay">
                <q-icon name="lock" size="48px" color="primary" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- ====================================================================== -->
      <!-- PLANO PRO - Relatórios Avançados -->
      <!-- ====================================================================== -->
      <div v-else-if="isProPlan">
        <!-- Grid de Métricas -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-3">
            <MetricCard
              title="Receitas"
              :value="reportData.totalIncome"
              icon="trending_up"
              color="positive"
              :currency="true"
            />
          </div>
          <div class="col-12 col-md-3">
            <MetricCard
              title="Despesas"
              :value="reportData.totalExpense"
              icon="trending_down"
              color="negative"
              :currency="true"
            />
          </div>
          <div class="col-12 col-md-3">
            <MetricCard
              title="Saldo"
              :value="reportData.balance"
              icon="account_balance"
              :color="reportData.balance >= 0 ? 'positive' : 'negative'"
              :currency="true"
            />
          </div>
          <div class="col-12 col-md-3">
            <MetricCard
              title="Transações"
              :value="reportData.transactionCount"
              icon="receipt_long"
              color="primary"
            />
          </div>
        </div>

        <!-- Gráficos Avançados -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <AdvancedCategoryChart
              :data="reportData"
              type="bar"
              title="Despesas por Categoria"
            />
          </div>
          <div class="col-12 col-md-6">
            <MonthlyTrendChart
              :data="reportData"
              title="Evolução Mensal"
            />
          </div>
        </div>

        <!-- Comparativo de Períodos -->
        <PeriodComparisonReport
          :data="reportData"
          class="q-mb-md"
        />

        <!-- Ações de Exportação -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="col-auto">
                <div class="text-h6">Exportar Relatórios</div>
                <div class="text-caption text-grey-7">
                  Baixe seus dados em diferentes formatos
                </div>
              </div>
              <div class="col-auto">
                <q-btn-group outline>
                  <q-btn
                    outline
                    color="primary"
                    label="PDF"
                    icon="picture_as_pdf"
                    @click="exportReport('pdf')"
                    :loading="isExporting"
                  />
                  <q-btn
                    outline
                    color="primary"
                    label="Excel"
                    icon="table_chart"
                    @click="exportReport('excel')"
                    :loading="isExporting"
                  />
                  <q-btn
                    outline
                    color="primary"
                    label="CSV"
                    icon="description"
                    @click="exportReport('csv')"
                    :loading="isExporting"
                  />
                </q-btn-group>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Relatório Detalhado por Categoria -->
        <DetailedCategoryReport
          :data="reportData"
        />
      </div>

      <!-- ====================================================================== -->
      <!-- PLANO PREMIUM - Tudo + Analytics Avançados (futuro) -->
      <!-- ====================================================================== -->
      <div v-else-if="isPremiumPlan">
        <!-- Inclui tudo do PRO -->
        <div class="premium-badge q-mb-md text-center">
          <q-banner class="bg-deep-purple text-white" rounded>
            <template v-slot:avatar>
              <q-icon name="workspace_premium" size="32px" />
            </template>
            <div class="text-h6">Plano Premium Ativo</div>
            <div class="text-caption">
              Em breve: Analytics com IA, Previsões Financeiras e muito mais!
            </div>
          </q-banner>
        </div>

        <!-- Todo conteúdo do PRO -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-3">
            <MetricCard
              title="Receitas"
              :value="reportData.totalIncome"
              icon="trending_up"
              color="positive"
              :currency="true"
            />
          </div>
          <div class="col-12 col-md-3">
            <MetricCard
              title="Despesas"
              :value="reportData.totalExpense"
              icon="trending_down"
              color="negative"
              :currency="true"
            />
          </div>
          <div class="col-12 col-md-3">
            <MetricCard
              title="Saldo"
              :value="reportData.balance"
              icon="account_balance"
              :color="reportData.balance >= 0 ? 'positive' : 'negative'"
              :currency="true"
            />
          </div>
          <div class="col-12 col-md-3">
            <MetricCard
              title="Transações"
              :value="reportData.transactionCount"
              icon="receipt_long"
              color="primary"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <AdvancedCategoryChart
              :data="reportData"
              type="bar"
              title="Despesas por Categoria"
            />
          </div>
          <div class="col-12 col-md-6">
            <MonthlyTrendChart
              :data="reportData"
              title="Evolução Mensal"
            />
          </div>
        </div>

        <PeriodComparisonReport
          :data="reportData"
          class="q-mb-md"
        />

        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="col-auto">
                <div class="text-h6">Exportar Relatórios</div>
                <div class="text-caption text-grey-7">
                  Baixe seus dados em diferentes formatos
                </div>
              </div>
              <div class="col-auto">
                <q-btn-group outline>
                  <q-btn
                    outline
                    color="primary"
                    label="PDF"
                    icon="picture_as_pdf"
                    @click="exportReport('pdf')"
                    :loading="isExporting"
                  />
                  <q-btn
                    outline
                    color="primary"
                    label="Excel"
                    icon="table_chart"
                    @click="exportReport('excel')"
                    :loading="isExporting"
                  />
                  <q-btn
                    outline
                    color="primary"
                    label="CSV"
                    icon="description"
                    @click="exportReport('csv')"
                    :loading="isExporting"
                  />
                </q-btn-group>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <DetailedCategoryReport
          :data="reportData"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="q-pa-xl text-center">
      <q-spinner-dots color="primary" size="50px" />
      <div class="text-grey-7 q-mt-md">Carregando relatórios...</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useFeaturePermissions } from 'src/composables/useFeaturePermissions'
import { useTransactionStore } from 'src/stores/transactions'
import reportService from 'src/services/reportService'
import UpgradeFeatureBanner from 'src/components/UpgradeFeatureBanner.vue'
import BasicSummaryReport from 'src/components/reports/BasicSummaryReport.vue'
import BasicCategoryChart from 'src/components/reports/BasicCategoryChart.vue'
import MetricCard from 'src/components/reports/MetricCard.vue'
import AdvancedCategoryChart from 'src/components/reports/AdvancedCategoryChart.vue'
import MonthlyTrendChart from 'src/components/reports/MonthlyTrendChart.vue'
import PeriodComparisonReport from 'src/components/reports/PeriodComparisonReport.vue'
import DetailedCategoryReport from 'src/components/reports/DetailedCategoryReport.vue'

// ==========================================================================
// COMPOSABLES & STORES
// ==========================================================================
const $q = useQuasar()
const { t } = useI18n()
const transactionStore = useTransactionStore()
const {
  isFreePlan,
  isProPlan,
  isPremiumPlan,
  currentPlanName
} = useFeaturePermissions()

// ==========================================================================
// STATE
// ==========================================================================
const isLoadingData = ref(false)
const isExporting = ref(false)

const filters = ref({
  startDate: '',
  endDate: ''
})

const reportData = ref({
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  transactionCount: 0,
  categories: [],
  monthlyData: [],
  transactions: []
})

// ==========================================================================
// COMPUTED
// ==========================================================================
const planBadgeColor = computed(() => {
  if (isPremiumPlan.value) return 'deep-purple'
  if (isProPlan.value) return 'primary'
  return 'grey-7'
})

const planIcon = computed(() => {
  if (isPremiumPlan.value) return 'workspace_premium'
  if (isProPlan.value) return 'bolt'
  return 'person'
})

// ==========================================================================
// METHODS
// ==========================================================================
const loadReportData = async () => {
  isLoadingData.value = true
  
  try {
    console.log('📊 [ReportsPage] Carregando dados do relatório...')
    
    // Buscar dados do relatório via API
    const data = await reportService.getSummary({
      start_date: filters.value.startDate || undefined,
      end_date: filters.value.endDate || undefined
    })

    console.log('✅ [ReportsPage] Dados recebidos:', data)

    // Processar dados para o formato esperado pelos componentes
    reportData.value = {
      totalIncome: data.summary.total_income || 0,
      totalExpense: data.summary.total_expense || 0,
      balance: data.summary.balance || 0,
      transactionCount: data.summary.transaction_count || 0,
      categories: (data.categories || []).map(cat => ({
        name: cat.category_name,
        total: cat.total,
        count: cat.count,
        type: cat.category_type,
        percentage: cat.percentage,
        average: cat.average_per_transaction
      })),
      monthlyData: (data.monthly_data || []).map(month => ({
        month: month.month,
        income: month.income,
        expense: month.expense,
        balance: month.balance,
        transactionCount: month.transaction_count
      })),
      transactions: [] // Será preenchido quando implementar drill-down
    }

    console.log('✅ [ReportsPage] Dados processados:', reportData.value)
    
    // Alertar se não há dados
    if (reportData.value.transactionCount === 0) {
      $q.notify({
        type: 'info',
        message: 'Nenhuma transação encontrada',
        caption: 'Tente outro período ou adicione transações',
        icon: 'event_busy',
        position: 'top',
        timeout: 3000
      })
    }
  } catch (error) {
    console.error('❌ [ReportsPage] Erro ao carregar dados:', error)
    
    // Tratamento de erro de permissão
    if (error.code === 'PLAN_UPGRADE_REQUIRED') {
      $q.notify({
        type: 'warning',
        message: error.message,
        caption: `Faça upgrade para o plano ${error.requiredPlan}`,
        icon: 'lock',
        position: 'top',
        actions: [
          {
            label: 'Ver Planos',
            color: 'white',
            handler: () => {
              window.location.href = '/plans'
            }
          }
        ]
      })
      
      // Retornar dados vazios
      reportData.value = {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0,
        categories: [],
        monthlyData: [],
        transactions: []
      }
    } else {
      // FALLBACK: Processar transações locais
      console.warn('⚠️ [ReportsPage] API não disponível, processando transações locais')
      
      try {
        // Buscar transações da store
        await transactionStore.fetchTransactions({ limit: 1000 })
        
        const transactions = transactionStore.transactions || []
        
        console.log('📊 [ReportsPage] Transações carregadas:', transactions.length)
        
        // Filtrar por período se especificado
        let filteredTransactions = transactions
        if (filters.value.startDate || filters.value.endDate) {
          filteredTransactions = transactions.filter(t => {
            const transDate = new Date(t.date)
            const startOk = !filters.value.startDate || transDate >= new Date(filters.value.startDate)
            const endOk = !filters.value.endDate || transDate <= new Date(filters.value.endDate)
            return startOk && endOk
          })
        }
        
        console.log('📊 [ReportsPage] Transações após filtro:', filteredTransactions.length)
        
        // Agregar dados
        const totalIncome = filteredTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
        
        const totalExpense = filteredTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
        
        console.log('💰 [ReportsPage] Receitas:', totalIncome, 'Despesas:', totalExpense)
        
        // Agrupar por categoria
        const categoryMap = {}
        filteredTransactions.forEach(t => {
          if (!t.category) return
          
          const catName = typeof t.category === 'object' ? t.category.name : String(t.category)
          const catType = t.type
          
          if (!categoryMap[catName]) {
            categoryMap[catName] = {
              name: catName,
              total: 0,
              count: 0,
              type: catType
            }
          }
          categoryMap[catName].total += parseFloat(t.amount) || 0
          categoryMap[catName].count += 1
        })
        
        const categories = Object.values(categoryMap).sort((a, b) => b.total - a.total)
        
        console.log('📊 [ReportsPage] Categorias processadas:', categories)
        
        reportData.value = {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          transactionCount: filteredTransactions.length,
          categories,
          monthlyData: [],
          transactions: filteredTransactions
        }
        
        console.log('✅ [ReportsPage] Dados finais:', reportData.value)
        
        $q.notify({
          type: 'info',
          message: 'Usando transações locais',
          caption: `${filteredTransactions.length} transações processadas`,
          icon: 'offline_bolt',
          position: 'top',
          timeout: 3000
        })
        
      } catch (fallbackError) {
        console.error('❌ [ReportsPage] Erro no fallback:', fallbackError)
        
        $q.notify({
          type: 'negative',
          message: t('reports.feedback.loadError'),
          caption: error.message || 'Erro desconhecido',
          icon: 'error',
          position: 'top'
        })
        
        // Dados vazios como último recurso
        reportData.value = {
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          transactionCount: 0,
          categories: [],
          monthlyData: [],
          transactions: []
        }
      }
    }
  } finally {
    isLoadingData.value = false
  }
}

const applyFilters = () => {
  loadReportData()
}

const clearFilters = () => {
  filters.value = {
    startDate: '',
    endDate: ''
  }
  loadReportData()
}

const exportReport = async (format) => {
  isExporting.value = true
  
  try {
    console.log(`📤 [ReportsPage] Exportando relatório em ${format}...`)
    
    const result = await reportService.exportReport({
      format: format,
      start_date: filters.value.startDate || undefined,
      end_date: filters.value.endDate || undefined,
      include_transactions: true,
      include_categories: true,
      include_monthly: true
    })

    console.log('✅ [ReportsPage] Relatório exportado:', result)
    
    // Notificar sucesso
    $q.notify({
      type: 'positive',
      message: t('reports.feedback.exportSuccess', { format: format.toUpperCase() }),
      caption: result.file_name,
      icon: 'download_done',
      position: 'top',
      actions: [
        {
          label: 'Baixar',
          color: 'white',
          handler: () => {
            window.open(result.file_url, '_blank')
          }
        }
      ],
      timeout: 10000
    })
    
    // Abrir automaticamente o download
    window.open(result.file_url, '_blank')
  } catch (error) {
    console.error('❌ [ReportsPage] Erro ao exportar:', error)
    
    // Tratamento de erro de permissão (plano FREE)
    if (error.code === 'PLAN_UPGRADE_REQUIRED') {
      $q.notify({
        type: 'warning',
        message: error.message,
        caption: `Exportação requer plano ${error.requiredPlan || 'PRO'}`,
        icon: 'lock',
        position: 'top',
        actions: [
          {
            label: 'Ver Planos',
            color: 'white',
            handler: () => {
              window.location.href = '/plans'
            }
          }
        ],
        timeout: 8000
      })
    }
    // Limite de exportações atingido
    else if (error.code === 'EXPORT_LIMIT_REACHED') {
      $q.notify({
        type: 'warning',
        message: error.message,
        caption: 'Aguarde ou faça upgrade para PREMIUM',
        icon: 'timer',
        position: 'top',
        timeout: 5000
      })
    }
    // Erro genérico
    else {
      $q.notify({
        type: 'negative',
        message: t('reports.feedback.exportError'),
        caption: error.message || 'Erro desconhecido',
        icon: 'error',
        position: 'top'
      })
    }
  } finally {
    isExporting.value = false
  }
}

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(() => {
  loadReportData()
})
</script>

<style scoped lang="scss">
.reports-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  h1 {
    display: flex;
    align-items: center;
  }
}

.locked-features {
  .locked-card {
    position: relative;
    overflow: hidden;
    
    .blur-content {
      filter: blur(4px);
      opacity: 0.4;
    }
    
    .lock-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    }
  }
}
</style>
