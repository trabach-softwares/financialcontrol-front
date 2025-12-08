<template>
  <q-page class="modern-dashboard">
    <div class="dashboard-wrapper">

      <DashboardHero @open-transaction="openTransactionDialog" />

      <!-- period + filters -->
      <div class="period-filter-section q-mb-lg q-px-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <MonthNavigator @change="handleMonthChange" :loading="isLoadingStats" storage-key="dashboard-month" />
          </div>
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
      </div>

      <DashboardMetrics />

      <div class="row q-col-gutter-sm secondary-section">
        <div class="col-12 col-md-5">
          <div class="category-chart-card">
            <div class="chart-header-simple">
              <div class="chart-icon-wrapper category"><q-icon name="pie_chart" size="1.3rem" /></div>
              <div>
                <h6 class="chart-title-small">Despesas por Categoria</h6>
                <p class="chart-subtitle-small">Onde seu dinheiro está sendo gasto</p>
              </div>
            </div>

            <div class="category-chart-body">
              <div v-if="isLoadingCharts" class="chart-loading-small"><q-spinner-dots color="primary" size="2em" />
              </div>
              <div v-else>
                <canvas id="doughnutChart" class="category-chart-canvas"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-7">
          <DashboardQuickActions @open-transaction="openTransactionDialog" />
        </div>
      </div>

      <div class="row transactions-section">
        <div class="col-12">
          <DashboardRecentTransactions @open-transaction="openTransactionDialog" />
        </div>
      </div>

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
@import '../../styles/dashboard.scss';
</style>
