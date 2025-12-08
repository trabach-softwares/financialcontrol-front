<template>
  <q-page class="modern-dashboard" aria-labelledby="dashboard-title" :class="{ 'theme-dark': isDark }"
    :data-theme="isDark ? 'dark' : 'light'">
    <div class="dashboard-wrapper">

      <header class="dashboard-header" role="banner">
        <h1 id="dashboard-title" class="sr-only">Painel Financeiro</h1>
        <DashboardHero @open-transaction="openTransactionDialog" />
      </header>

      <!-- período + filtros -->
      <section class="period-filter-section q-mb-lg" aria-labelledby="filters-title">
        <h2 id="filters-title" class="sr-only">Período e filtros</h2>
        <div class="row q-col-gutter-md">
          <nav class="col-12 col-md-4" aria-label="Navegação por mês">
            <MonthNavigator @change="handleMonthChange" :loading="isLoadingStats" storage-key="dashboard-month" />
          </nav>
          <div class="col-12 col-md-8">
            <q-expansion-item icon="filter_alt" label="Filtros Avançados" caption="Períodos personalizados" dense-toggle
              expand-separator class="advanced-filter-expansion" header-class="advanced-filter-header"
              :class="{ 'theme-dark': isDark }" :dark="isDark">
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="40px">
                    <q-icon name="filter_alt" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">Filtros Avançados</q-item-label>
                  <q-item-label caption class="text-grey-7">Últimos 3/6/12 meses, personalizado...</q-item-label>
                </q-item-section>
              </template>

              <q-card flat bordered class="advanced-filter-card">
                <q-card-section class="q-pa-md">
                  <PeriodFilter @change="handleAdvancedPeriodChange" storage-key="dashboard-advanced-period" />
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </div>
      </section>

      <section aria-labelledby="metrics-title">
        <h2 id="metrics-title" class="sr-only">Métricas</h2>
        <DashboardMetrics />
      </section>

      <div class="row q-col-gutter-sm secondary-section" role="region"
        aria-label="Ações rápidas e gráficos de categoria">
        <aside class="col-12 col-md-5" aria-labelledby="category-chart-title">
          <figure class="category-chart-card">
            <figcaption class="chart-header-simple" id="category-chart-title">
              <div class="chart-icon-wrapper category"><q-icon name="pie_chart" size="1.3rem" /></div>
              <div>
                <h3 class="chart-title-small">Despesas por Categoria</h3>
                <p class="chart-subtitle-small">Onde seu dinheiro está sendo gasto</p>
              </div>
            </figcaption>

            <div class="category-chart-body">
              <div v-if="isLoadingCharts" class="chart-loading-small" role="status" aria-live="polite"><q-spinner-dots
                  color="primary" size="2em" />
              </div>
              <div v-else>
                <canvas id="doughnutChart" class="category-chart-canvas" role="img"
                  aria-label="Gráfico de pizza de despesas por categoria"></canvas>
              </div>
            </div>
          </figure>
        </aside>

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
import { computed, ref } from 'vue'

import CompleteProfileDialog from 'src/components/CompleteProfileDialog.vue'
import MonthNavigator from 'src/components/MonthNavigator.vue'
import PeriodFilter from 'src/components/PeriodFilter.vue'
import TransactionForm from 'src/components/TransactionForm.vue'
import DashboardHero from './components/DashboardHero.vue'
import DashboardMetrics from './components/DashboardMetrics.vue'
import DashboardQuickActions from './components/DashboardQuickActions.vue'
import DashboardRecentTransactions from './components/DashboardRecentTransactions.vue'

const $q = useQuasar()
const isDark = computed(() => $q.dark.isActive)
const dashboardStore = useDashboardStore()
const authStore = useAuthStore()
const { formatCurrency } = useCurrency()

const showAddTransactionDialog = ref(false)
const newTransactionType = ref('income')
const showCompleteProfileDialog = ref(false)
const chartPeriod = ref('current-month')

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