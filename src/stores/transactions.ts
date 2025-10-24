import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/lib/api'

export interface Transaction {
  id?: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  created_at?: string
}

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filterType = ref<'all' | 'income' | 'expense'>('all')
  const filterCategory = ref<string>('')
  const filterDateRange = ref<{ start: string; end: string }>({ start: '', end: '' })

  // Getters
  const filteredTransactions = computed(() => {
    let filtered = [...transactions.value]

    if (filterType.value !== 'all') {
      filtered = filtered.filter((t) => t.type === filterType.value)
    }

    if (filterCategory.value) {
      filtered = filtered.filter((t) => 
        t.category.toLowerCase().includes(filterCategory.value.toLowerCase())
      )
    }

    if (filterDateRange.value.start || filterDateRange.value.end) {
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date)
        const start = filterDateRange.value.start ? new Date(filterDateRange.value.start) : null
        const end = filterDateRange.value.end ? new Date(filterDateRange.value.end) : null
        
        if (start && transactionDate < start) return false
        if (end && transactionDate > end) return false
        return true
      })
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  const totalIncome = computed(() => {
    return filteredTransactions.value
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const totalExpenses = computed(() => {
    return filteredTransactions.value
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const balance = computed(() => totalIncome.value - totalExpenses.value)

  const categories = computed(() => {
    const cats = new Set(filteredTransactions.value.map((t) => t.category))
    return Array.from(cats).sort()
  })

  const expensesByCategory = computed(() => {
    const expenses = filteredTransactions.value.filter((t) => t.type === 'expense')
    const grouped: Record<string, number> = {}
    expenses.forEach((t) => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount
    })
    return grouped
  })

  const incomeByCategory = computed(() => {
    const incomes = filteredTransactions.value.filter((t) => t.type === 'income')
    const grouped: Record<string, number> = {}
    incomes.forEach((t) => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount
    })
    return grouped
  })

  // Actions
  async function fetchTransactions() {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (filterType.value !== 'all') params.append('type', filterType.value)
      if (filterCategory.value) params.append('category', filterCategory.value)
      if (filterDateRange.value.start) params.append('startDate', filterDateRange.value.start)
      if (filterDateRange.value.end) params.append('endDate', filterDateRange.value.end)
      
      const queryString = params.toString()
      const endpoint = queryString ? `/transactions?${queryString}` : '/transactions'
      
      const response = await apiClient.get<Transaction[]>(endpoint)
      if (response.success) {
        transactions.value = response.data || []
      } else {
        throw new Error(response.message)
      }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
    } finally {
      loading.value = false
    }
  }

  async function addTransaction(transaction: Transaction) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post<Transaction>('/transactions', transaction)
      if (response.success) {
        transactions.value.unshift(response.data)
        return { success: true }
      } else {
        throw new Error(response.message)
      }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateTransaction(id: string, updates: Partial<Transaction>) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.put<Transaction>(`/transactions/${id}`, updates)
      if (response.success) {
        const index = transactions.value.findIndex((t) => t.id === id)
        if (index !== -1) {
          transactions.value[index] = response.data
        }
        return { success: true }
      } else {
        throw new Error(response.message)
      }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteTransaction(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.delete(`/transactions/${id}`)
      if (response.success) {
        transactions.value = transactions.value.filter((t) => t.id !== id)
        return { success: true }
      } else {
        throw new Error(response.message)
      }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Filter actions
  function setFilterType(type: 'all' | 'income' | 'expense') {
    filterType.value = type
  }

  function setFilterCategory(category: string) {
    filterCategory.value = category
  }

  function setFilterDateRange(range: { start: string; end: string }) {
    filterDateRange.value = range
  }

  function clearFilters() {
    filterType.value = 'all'
    filterCategory.value = ''
    filterDateRange.value = { start: '', end: '' }
  }

  return {
    transactions,
    loading,
    error,
    filteredTransactions,
    totalIncome,
    totalExpenses,
    balance,
    categories,
    expensesByCategory,
    incomeByCategory,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilterType,
    setFilterCategory,
    setFilterDateRange,
    clearFilters
  }
})