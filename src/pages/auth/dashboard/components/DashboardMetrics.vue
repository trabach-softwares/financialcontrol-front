<template>
  <div class="row q-col-gutter-sm metrics-row">
    <div class="col-12 col-sm-6 col-lg-3" @click="go('/transactions?type=income')">
      <div class="metric-card income-metric">
        <div class="metric-icon-wrapper income-icon"><q-icon name="arrow_upward" size="2rem" /></div>
        <div class="metric-content">
          <div class="metric-label">Receitas</div>
          <div v-if="!isLoadingStats" class="metric-value">{{ formatCurrency(transactionStats.totalIncome) }}</div>
          <q-skeleton v-else type="text" width="70%" height="2rem" />
          <div v-if="!isLoadingStats" class="metric-badge positive">
            <q-icon name="trending_up" size="0.9rem" />
            <span>+{{ transactionStats.incomeGrowth.toFixed(1) }}%</span>
          </div>
        </div>
        <div class="metric-bg-icon"><q-icon name="arrow_upward" /></div>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-lg-3" @click="go('/transactions?type=expense')">
      <div class="metric-card expense-metric">
        <div class="metric-icon-wrapper expense-icon"><q-icon name="arrow_downward" size="2rem" /></div>
        <div class="metric-content">
          <div class="metric-label">Despesas</div>
          <div v-if="!isLoadingStats" class="metric-value">{{ formatCurrency(transactionStats.totalExpense) }}</div>
          <q-skeleton v-else type="text" width="70%" height="2rem" />
          <div v-if="!isLoadingStats" class="metric-badge negative">
            <q-icon name="trending_down" size="0.9rem" />
            <span>{{ transactionStats.expenseGrowth.toFixed(1) }}%</span>
          </div>
        </div>
        <div class="metric-bg-icon"><q-icon name="arrow_downward" /></div>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-lg-3" @click="go('/transactions')">
      <div class="metric-card balance-metric">
        <div class="metric-icon-wrapper balance-icon"><q-icon name="account_balance_wallet" size="2rem" /></div>
        <div class="metric-content">
          <div class="metric-label">Saldo Total</div>
          <div v-if="!isLoadingStats" class="metric-value" :class="balanceColor">{{ formatCurrency(transactionStats.balance) }}</div>
          <q-skeleton v-else type="text" width="70%" height="2rem" />
          <div v-if="!isLoadingStats" class="metric-badge neutral">
            <q-icon name="savings" size="0.9rem" />
            <span>Posição Atual</span>
          </div>
        </div>
        <div class="metric-bg-icon"><q-icon name="account_balance_wallet" /></div>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-lg-3" @click="go('/transactions')">
      <div class="metric-card transactions-metric">
        <div class="metric-icon-wrapper transactions-icon"><q-icon name="receipt_long" size="2rem" /></div>
        <div class="metric-content">
          <div class="metric-label">Transações</div>
          <div v-if="!isLoadingStats" class="metric-value">{{ transactionStats.transactionCount }}</div>
          <q-skeleton v-else type="text" width="70%" height="2rem" />
          <div v-if="!isLoadingStats" class="metric-badge info">
            <q-icon name="history" size="0.9rem" />
            <span>Este mês</span>
          </div>
        </div>
        <div class="metric-bg-icon"><q-icon name="receipt_long" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCurrency } from 'src/composables/useCurrency'
import { useDashboardStore } from 'src/stores/dashboard'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dashboardStore = useDashboardStore()
const { formatCurrency } = useCurrency()

const transactionStats = computed(() => dashboardStore.formattedStats || { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0, incomeGrowth: 0, expenseGrowth: 0 })
const isLoadingStats = computed(() => dashboardStore.isLoadingStats)
const balanceColor = computed(() => dashboardStore.balanceColor)

function go(path) {
  router.push(path)
}
</script>
