import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export interface Transaction {
  id?: string
  user_id?: string
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

    // Filter by type
    if (filterType.value !== 'all') {
      filtered = filtered.filter((t) => t.type === filterType.value)
    }

    // Filter by category
    if (filterCategory.value) {
      filtered = filtered.filter((t) => 
        t.category.toLowerCase().includes(filterCategory.value.toLowerCase())
      )
    }

    // Filter by date range
    if (filterDateRange.value.start) {
      filtered = filtered.filter((t) => t.date >= filterDateRange.value.start)
    }
    if (filterDateRange.value.end) {
      filtered = filtered.filter((t) => t.date <= filterDateRange.value.end)
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
    const cats = new Set(transactions.value.map((t) => t.category))
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
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (fetchError) throw fetchError
      transactions.value = data || []
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      // Use mock data for development if Supabase is not configured
      if ((err instanceof Error ? err.message : String(err)).includes('relation') || (err instanceof Error ? err.message : String(err)).includes('does not exist')) {
        useMockData()
      }
    } finally {
      loading.value = false
    }
  }

  async function addTransaction(transaction: Transaction) {
    loading.value = true
    error.value = null
    try {
      const { data, error: addError } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single()

      if (addError) throw addError
      transactions.value.unshift(data)
      return { success: true }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      // Add to local state if Supabase is not configured
      if ((err instanceof Error ? err.message : String(err)).includes('relation') || (err instanceof Error ? err.message : String(err)).includes('does not exist')) {
        const newTransaction = {
          ...transaction,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString()
        }
        transactions.value.unshift(newTransaction)
        return { success: true }
      }
      return { success: false, error: (err instanceof Error ? err.message : String(err)) }
    } finally {
      loading.value = false
    }
  }

  async function updateTransaction(id: string, updates: Partial<Transaction>) {
    loading.value = true
    error.value = null
    try {
      const { data, error: updateError } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      const index = transactions.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        transactions.value[index] = data
      }
      return { success: true }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      // Update local state if Supabase is not configured
      if ((err instanceof Error ? err.message : String(err)).includes('relation') || (err instanceof Error ? err.message : String(err)).includes('does not exist')) {
        const index = transactions.value.findIndex((t) => t.id === id)
        if (index !== -1) {
          transactions.value[index] = { ...transactions.value[index], ...updates } as Transaction
        }
        return { success: true }
      }
      return { success: false, error: (err instanceof Error ? err.message : String(err)) }
    } finally {
      loading.value = false
    }
  }

  async function deleteTransaction(id: string) {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      transactions.value = transactions.value.filter((t) => t.id !== id)
      return { success: true }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      // Delete from local state if Supabase is not configured
      if ((err instanceof Error ? err.message : String(err)).includes('relation') || (err instanceof Error ? err.message : String(err)).includes('does not exist')) {
        transactions.value = transactions.value.filter((t) => t.id !== id)
        return { success: true }
      }
      return { success: false, error: (err instanceof Error ? err.message : String(err)) }
    } finally {
      loading.value = false
    }
  }

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

  function useMockData() {
    // Mock data for development
    transactions.value = [
      {
        id: '1',
        type: 'income',
        amount: 5000,
        category: 'Salary',
        description: 'Monthly salary',
        date: '2025-10-01',
        created_at: '2025-10-01T00:00:00Z'
      },
      {
        id: '2',
        type: 'expense',
        amount: 1200,
        category: 'Rent',
        description: 'Monthly rent payment',
        date: '2025-10-05',
        created_at: '2025-10-05T00:00:00Z'
      },
      {
        id: '3',
        type: 'expense',
        amount: 300,
        category: 'Groceries',
        description: 'Weekly groceries',
        date: '2025-10-10',
        created_at: '2025-10-10T00:00:00Z'
      },
      {
        id: '4',
        type: 'income',
        amount: 800,
        category: 'Freelance',
        description: 'Project payment',
        date: '2025-10-15',
        created_at: '2025-10-15T00:00:00Z'
      },
      {
        id: '5',
        type: 'expense',
        amount: 150,
        category: 'Utilities',
        description: 'Electric and water bills',
        date: '2025-10-18',
        created_at: '2025-10-18T00:00:00Z'
      }
    ]
  }

  return {
    transactions,
    loading,
    error,
    filterType,
    filterCategory,
    filterDateRange,
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
    clearFilters,
    useMockData
  }
})
