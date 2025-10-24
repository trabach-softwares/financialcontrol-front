<template>
  <AppLayout>
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
      class="space-y-8"
    >
      <!-- Welcome Section -->
      <div
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 500, delay: 200 } }"
        class="space-y-2"
      >
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {{ authStore.user?.name }}! 👋
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          Here's your financial overview for today
        </p>
      </div>

      <!-- Stats Cards -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ 
          opacity: 1,
          transition: { 
            duration: 600,
            delay: 400,
            staggerChildren: 100,
            delayChildren: 100
          }
        }"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <!-- Balance Card -->
        <BaseCard
          v-motion
          :initial="{ opacity: 0, y: 20, scale: 0.9 }"
          :enter="{ opacity: 1, y: 0, scale: 1 }"
          :hover="{ y: -4, transition: { duration: 200 } }"
          variant="glass"
          class="group cursor-default"
        >
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Balance</p>
              <p class="text-2xl font-bold text-gradient">
                ${{ balance.toLocaleString() }}
              </p>
              <div class="flex items-center text-xs">
                <TrendingUp :size="12" class="mr-1 text-green-500" />
                <span class="text-green-600 dark:text-green-400">+2.5% from last month</span>
              </div>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Wallet :size="24" class="text-white" />
            </div>
          </div>
        </BaseCard>

        <!-- Income Card -->
        <BaseCard
          v-motion
          :initial="{ opacity: 0, y: 20, scale: 0.9 }"
          :enter="{ opacity: 1, y: 0, scale: 1 }"
          :hover="{ y: -4, transition: { duration: 200 } }"
          variant="glass"
          class="group cursor-default"
        >
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                +${{ totalIncome.toLocaleString() }}
              </p>
              <div class="flex items-center text-xs">
                <ArrowUp :size="12" class="mr-1 text-green-500" />
                <span class="text-green-600 dark:text-green-400">+8.2% from last month</span>
              </div>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <TrendingUp :size="24" class="text-white" />
            </div>
          </div>
        </BaseCard>

        <!-- Expenses Card -->
        <BaseCard
          v-motion
          :initial="{ opacity: 0, y: 20, scale: 0.9 }"
          :enter="{ opacity: 1, y: 0, scale: 1 }"
          :hover="{ y: -4, transition: { duration: 200 } }"
          variant="glass"
          class="group cursor-default"
        >
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">
                -${{ totalExpenses.toLocaleString() }}
              </p>
              <div class="flex items-center text-xs">
                <ArrowDown :size="12" class="mr-1 text-red-500" />
                <span class="text-red-600 dark:text-red-400">-3.1% from last month</span>
              </div>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <TrendingDown :size="24" class="text-white" />
            </div>
          </div>
        </BaseCard>

        <!-- Transactions Card -->
        <BaseCard
          v-motion
          :initial="{ opacity: 0, y: 20, scale: 0.9 }"
          :enter="{ opacity: 1, y: 0, scale: 1 }"
          :hover="{ y: -4, transition: { duration: 200 } }"
          variant="glass"
          class="group cursor-default"
        >
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Transactions</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ filteredTransactions.length }}
              </p>
              <div class="flex items-center text-xs">
                <Activity :size="12" class="mr-1 text-blue-500" />
                <span class="text-blue-600 dark:text-blue-400">{{ recentTransactions.length }} this week</span>
              </div>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <BarChart3 :size="24" class="text-white" />
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Quick Actions -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 600 } }"
        class="flex flex-wrap gap-3"
      >
        <BaseButton
          variant="primary"
          size="lg"
          :icon-left="Plus"
          class="shadow-lg hover:shadow-xl"
          @click="showTransactionModal = true"
        >
          Add Transaction
        </BaseButton>
        
        <BaseButton
          variant="outline"
          size="lg"
          :icon-left="Download"
          class="shadow-sm hover:shadow-md"
        >
          Export Data
        </BaseButton>
        
        <BaseButton
          variant="ghost"
          size="lg"
          :icon-left="PieChart"
          class="hover:bg-primary-50 dark:hover:bg-primary-900/20"
        >
          View Reports
        </BaseButton>
      </div>

      <!-- Charts and Analytics -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 800 } }"
        class="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <!-- Expenses Chart -->
        <BaseCard
          variant="elevated"
          class="lg:col-span-2"
          title="Expenses by Category"
        >
          <template #headerActions>
            <BaseButton
              variant="ghost"
              size="sm"
              :icon-right="ExternalLink"
            >
              View Details
            </BaseButton>
          </template>
          
          <div class="h-80 flex items-center justify-center">
            <PieChart
              v-if="Object.keys(expensesByCategory).length > 0"
              :data="chartData"
            />
            <div
              v-else
              class="text-center space-y-4"
            >
              <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <PieChart :size="24" class="text-gray-400" />
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">No expense data</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Add some transactions to see your spending breakdown</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Recent Activity -->
        <BaseCard
          variant="elevated"
          title="Recent Activity"
        >
          <template #headerActions>
            <BaseButton
              variant="ghost"
              size="sm"
              :icon-right="ArrowRight"
            >
              View All
            </BaseButton>
          </template>
          
          <div class="space-y-4 max-h-80 overflow-y-auto">
            <div
              v-for="(transaction, index) in recentTransactions.slice(0, 6)"
              :key="transaction.id"
              v-motion
              :initial="{ opacity: 0, x: -20 }"
              :enter="{ 
                opacity: 1, 
                x: 0,
                transition: { 
                  duration: 300,
                  delay: 100 * index
                }
              }"
              class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
            >
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                :class="{
                  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400': transaction.type === 'income',
                  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400': transaction.type === 'expense'
                }"
              >
                <ArrowUp v-if="transaction.type === 'income'" :size="16" />
                <ArrowDown v-else :size="16" />
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 dark:text-white truncate">
                  {{ transaction.description }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ transaction.category }}
                </p>
              </div>
              
              <div class="text-right">
                <p
                  class="font-semibold"
                  :class="{
                    'text-green-600 dark:text-green-400': transaction.type === 'income',
                    'text-red-600 dark:text-red-400': transaction.type === 'expense'
                  }"
                >
                  {{ transaction.type === 'income' ? '+' : '-' }}${{ transaction.amount.toLocaleString() }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(transaction.date) }}
                </p>
              </div>
            </div>
            
            <div
              v-if="recentTransactions.length === 0"
              class="text-center py-12 space-y-4"
            >
              <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Activity :size="24" class="text-gray-400" />
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">No transactions yet</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Start tracking your finances by adding your first transaction
                </p>
                <BaseButton
                  variant="primary"
                  size="sm"
                  :icon-left="Plus"
                  @click="showTransactionModal = true"
                >
                  Add Transaction
                </BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Transaction Modal -->
    <TransactionModal
      v-if="showTransactionModal"
      @close="showTransactionModal = false"
      @save="handleTransactionAdded"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, 
  Download, 
  PieChart, 
  ExternalLink, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Activity,
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useTransactionsStore } from '@/stores/transactions'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import PieChart from '@/components/PieChart.vue'
import TransactionModal from '@/components/TransactionModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const transactionsStore = useTransactionsStore()

const showTransactionModal = ref(false)

// Computed values
const filteredTransactions = computed(() => transactionsStore.filteredTransactions)
const totalIncome = computed(() => transactionsStore.totalIncome)
const totalExpenses = computed(() => transactionsStore.totalExpenses)
const balance = computed(() => transactionsStore.balance)
const expensesByCategory = computed(() => transactionsStore.expensesByCategory)

const recentTransactions = computed(() => {
  return filteredTransactions.value.slice(0, 10)
})

const chartData = computed(() => {
  const categories = Object.keys(expensesByCategory.value)
  const amounts = Object.values(expensesByCategory.value)
  
  return {
    labels: categories,
    datasets: [{
      data: amounts,
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF'
      ]
    }]
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const handleTransactionAdded = async (transaction: any) => {
  showTransactionModal.value = false
  await transactionsStore.addTransaction(transaction)
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  await transactionsStore.fetchTransactions()
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #4f46e5, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>