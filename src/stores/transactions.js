// ==========================================================================
// PINIA STORE - TRANSACTIONS (TRANSACTION STORE)
// ==========================================================================
// Propósito: Gerenciar estado global das transações financeiras
// Origem: Páginas de transações, dashboard, relatórios
// Efeitos: Estado reativo das transações em toda aplicação

import { defineStore } from 'pinia'
import transactionService from 'src/services/transactionService'

export const useTransactionStore = defineStore('transactions', {
  // ==========================================================================
  // ESTADO (STATE)
  // ==========================================================================
  state: () => ({
    // Lista de transações
    transactions: [],              // Array com transações carregadas
    currentTransaction: null,      // Transação selecionada para edição
    
    // Paginação
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    },

    /**
     * Cria múltiplas transações (parcelas) em massa
     */
    async createTransactionsBulk(transactionsArray) {
      this.isCreating = true
      this.error = null
      try {
        console.log(' [Store] createTransactionsBulk input:', transactionsArray)
        const created = await transactionService.createTransactionsBulk(transactionsArray)
        const items = Array.isArray(created?.data) ? created.data : (created || [])
        // adiciona ao topo preservando ordem
        this.transactions = [...items, ...this.transactions]
        await this.fetchStats()
        return items
      } catch (error) {
        const status = error?.response?.status
        const data = error?.response?.data
        console.error(' [Store] createTransactionsBulk failed:', { status, data })
        this.error = data?.message || 'Erro ao criar parcelas'
        throw error
      } finally {
        this.isCreating = false
      }
    },

    /**
     * Deleta parcelas de uma série a partir de uma data
     */
    async deleteSeriesForward(seriesId, fromDate) {
      this.isDeleting = true
      this.error = null
      try {
        const resp = await transactionService.deleteSeriesForward(seriesId, fromDate)
        // Remover localmente transações dessa série com date >= fromDate
        this.transactions = this.transactions.filter(t => {
          const sameSeries = t.series_id === seriesId
          const isForward = !fromDate || (t.date >= fromDate)
          return !(sameSeries && isForward)
        })
        await this.fetchStats()
        return resp
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao excluir parcelas da série'
        throw error
      } finally {
        this.isDeleting = false
      }
    },
    
    // Filtros ativos
    filters: {
      type: '',                    // 'income' | 'expense' | ''
      category: '',                // Categoria específica ou ''
      startDate: '',               // Data de início YYYY-MM-DD
      endDate: '',                 // Data de fim YYYY-MM-DD
      search: ''                   // Busca por descrição
    },
    
    // Estatísticas financeiras
    stats: {
      totalIncome: 0,              // Total de receitas
      totalExpense: 0,             // Total de despesas
      balance: 0,                  // Saldo (receitas - despesas)
      transactionCount: 0,         // Número total de transações
      lastUpdated: null            // Data da última atualização
    },
    
    // Estados de loading
    isLoading: false,              // Loading da lista
    isCreating: false,             // Loading da criação
    isUpdating: false,             // Loading da atualização
    isDeleting: false,             // Loading da exclusão
    isLoadingStats: false,         // Loading das estatísticas
    
    // Estados de erro
    error: null,                   // Último erro ocorrido
    
    // Configurações
    categories: [],                // Lista de categorias disponíveis
  }),

  // ==========================================================================
  // GETTERS (COMPUTED)
  // ==========================================================================
  getters: {
    /**
     * Retorna transações filtradas por tipo
     */
    incomeTransactions: (state) => {
      return state.transactions.filter(t => t.type === 'income')
    },

    expenseTransactions: (state) => {
      return state.transactions.filter(t => t.type === 'expense')
    },

    /**
     * Verifica se há filtros ativos
     */
    hasActiveFilters: (state) => {
      return !!(
        state.filters.type ||
        state.filters.category ||
        state.filters.startDate ||
        state.filters.endDate ||
        state.filters.search
      )
    },

    /**
     * Retorna resumo das estatísticas para exibição
     */
    statsummary: (state) => {
      return {
        income: state.stats.totalIncome,
        expense: state.stats.totalExpense,
        balance: state.stats.balance,
        count: state.stats.transactionCount
      }
    },

    /**
     * Verifica se há algum processo em andamento
     */
    isProcessing: (state) => {
      return state.isLoading || state.isCreating || 
             state.isUpdating || state.isDeleting
    },

    /**
     * Retorna transações agrupadas por categoria (para gráficos)
     */
    transactionsByCategory: (state) => {
      const grouped = {}
      
      state.transactions.forEach(transaction => {
        const category = transaction.category || 'Sem categoria'
        if (!grouped[category]) {
          grouped[category] = {
            category,
            total: 0,
            count: 0,
            transactions: []
          }
        }
        
        grouped[category].total += transaction.amount
        grouped[category].count += 1
        grouped[category].transactions.push(transaction)
      })
      
      return Object.values(grouped)
    }
  },

  // ==========================================================================
  // ACTIONS (METHODS)
  // ==========================================================================
  actions: {
    /**
     * Carrega lista de transações com filtros e paginação
     */
    async fetchTransactions(options = {}) {
      
      this.isLoading = true
      this.error = null
      
      try {
        // Mescla filtros atuais com opções passadas
        const requestFilters = {
          ...this.filters,
          page: options.page || this.pagination.page,
          limit: options.limit || this.pagination.limit,
          ...options.filters
        }
        
        const response = await transactionService.getTransactions(requestFilters)
        
        // Atualiza estado
        this.transactions = response.transactions || []
        this.pagination = {
          page: response.page || 1,
          limit: response.limit || 20,
          total: response.total || 0,
          totalPages: response.totalPages || 0
        } 
        
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar transações'
        this.transactions = []
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Cria nova transação
     */
    async createTransaction(transactionData) {
      
      this.isCreating = true
      this.error = null
      
      try {
        console.log(' [Store] createTransaction input:', JSON.stringify(transactionData))
        const newTransaction = await transactionService.createTransaction(transactionData)
        
        // Adiciona à lista local
        this.transactions.unshift(newTransaction)
        
        // Atualiza estatísticas
        await this.fetchStats()
        
        return newTransaction
        
      } catch (error) {
        const status = error?.response?.status
        const data = error?.response?.data
        console.error(' [Store] createTransaction failed:', { status, data, input: transactionData })
        this.error = data?.message || 'Erro ao criar transação'
        throw error
      } finally {
        this.isCreating = false
      }
    },

    /**
     * Atualiza transação existente
     */
    async updateTransaction(id, transactionData) {
      
      this.isUpdating = true
      this.error = null
      
      try {
        const updatedTransaction = await transactionService.updateTransaction(id, transactionData)
        
        // Atualiza na lista local
        const index = this.transactions.findIndex(t => t.id === id)
        if (index !== -1) {
          this.transactions[index] = updatedTransaction
        }
        
        // Atualiza estatísticas
        await this.fetchStats()
        
        return updatedTransaction
        
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao atualizar transação'
        throw error
      } finally {
        this.isUpdating = false
      }
    },

    /**
     * Deleta transação
     */
    async deleteTransaction(id) {
      
      this.isDeleting = true
      this.error = null
      
      try {
        await transactionService.deleteTransaction(id)
        
        // Remove da lista local
        this.transactions = this.transactions.filter(t => t.id !== id)
        
        // Atualiza estatísticas
        await this.fetchStats()
        
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar transação'
        throw error
      } finally {
        this.isDeleting = false
      }
    },

    /**
     * Marca transação como paga/não paga
     */
    async markPaid(id, paid, paidAt) {
      this.error = null
      try {
        console.log(' [Store] markPaid:', { id, paid, paidAt })
        const updated = await transactionService.markTransactionPaid(id, paid, paidAt)
        const index = this.transactions.findIndex(t => t.id === id)
        if (index !== -1) {
          this.transactions[index] = { ...this.transactions[index], ...updated }
        }
        await this.fetchStats()
        return updated
      } catch (error) {
        const status = error?.response?.status
        const data = error?.response?.data
        console.error(' [Store] markPaid failed:', { status, data, id, paid, paidAt })
        this.error = data?.message || 'Erro ao alterar status de pagamento'
        throw error
      }
    },

    /**
     * Carrega estatísticas financeiras
     */
    async fetchStats(dateRange = {}) {
      
      this.isLoadingStats = true
      
      try {
        const stats = await transactionService.getTransactionStats(dateRange)
        
        this.stats = {
          totalIncome: stats.totalIncome || 0,
          totalExpense: stats.totalExpense || 0,
          balance: stats.balance || 0,
          transactionCount: stats.transactionCount || 0,
          lastUpdated: new Date()
        }
        
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar estatísticas'
      } finally {
        this.isLoadingStats = false
      }
    },

    /**
     * Aplica filtros e recarrega transações
     */
    async applyFilters(newFilters) {
      
      // Atualiza filtros
      this.filters = { ...this.filters, ...newFilters }
      
      // Reseta para primeira página
      this.pagination.page = 1
      
      // Recarrega com novos filtros
      await this.fetchTransactions()
    },

    /**
     * Limpa filtros e recarrega
     */
    async clearFilters() {
      
      this.filters = {
        type: '',
        category: '',
        startDate: '',
        endDate: '',
        search: ''
      }
      
      this.pagination.page = 1
      await this.fetchTransactions()
    },

    /**
     * Carrega próxima página
     */
    async loadNextPage() {
      if (this.pagination.page < this.pagination.totalPages) {
        this.pagination.page += 1
        await this.fetchTransactions()
      }
    },

    /**
     * Carrega página anterior
     */
    async loadPreviousPage() {
      if (this.pagination.page > 1) {
        this.pagination.page -= 1
        await this.fetchTransactions()
      }
    },

    /**
     * Define transação atual para edição
     */
    async setCurrentTransaction(id) {
      
      try {
        const transaction = await transactionService.getTransactionById(id)
        this.currentTransaction = transaction
        
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar transação'
      }
    },

    /**
     * Limpa transação atual
     */
    clearCurrentTransaction() {
      this.currentTransaction = null
    },

    /**
     * Carrega categorias disponíveis
     */
    loadCategories() {
      this.categories = transactionService.getDefaultCategories()
    },

    /**
     * Limpa erros
     */
    clearError() {
      this.error = null
    },

    /**
     * Reseta o store para estado inicial
     */
    reset() {
      this.transactions = []
      this.currentTransaction = null
      this.pagination = { page: 1, limit: 20, total: 0, totalPages: 0 }
      this.filters = { type: '', category: '', startDate: '', endDate: '', search: '' }
      this.stats = { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0, lastUpdated: null }
      this.error = null
    }
  }
})