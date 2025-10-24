// ==========================================================================
// PINIA STORE - TRANSACTIONS (TRANSACTION STORE)
// ==========================================================================
// Propósito: Gerenciar estado global das transações financeiras
// Origem: Páginas de transações, dashboard, relatórios
// Efeitos: Estado reativo das transações em toda aplicação

import { defineStore } from 'pinia'
import { transactionService } from 'src/services/transactionService'

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
      console.log('💰 [TRANSACTION STORE] Carregando transações')
      
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
        
        console.log('✅ [TRANSACTION STORE] Transações carregadas:', {
          count: this.transactions.length,
          total: this.pagination.total
        })
        
      } catch (error) {
        console.error('❌ [TRANSACTION STORE] Erro ao carregar transações:', error.message)
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
      console.log('➕ [TRANSACTION STORE] Criando transação:', transactionData.type)
      
      this.isCreating = true
      this.error = null
      
      try {
        const newTransaction = await transactionService.createTransaction(transactionData)
        
        // Adiciona à lista local
        this.transactions.unshift(newTransaction)
        
        // Atualiza estatísticas
        await this.fetchStats()
        
        console.log('✅ [TRANSACTION STORE] Transação criada:', newTransaction.id)
        return newTransaction
        
      } catch (error) {
        console.error('❌ [TRANSACTION STORE] Erro ao criar transação:', error.message)
        this.error = error.response?.data?.message || 'Erro ao criar transação'
        throw error
      } finally {
        this.isCreating = false
      }
    },

    /**
     * Atualiza transação existente
     */
    async updateTransaction(id, transactionData) {
      console.log('✏️ [TRANSACTION STORE] Atualizando transação:', id)
      
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
        
        console.log('✅ [TRANSACTION STORE] Transação atualizada:', id)
        return updatedTransaction
        
      } catch (error) {
        console.error('❌ [TRANSACTION STORE] Erro ao atualizar transação:', error.message)
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
      console.log('🗑️ [TRANSACTION STORE] Deletando transação:', id)
      
      this.isDeleting = true
      this.error = null
      
      try {
        await transactionService.deleteTransaction(id)
        
        // Remove da lista local
        this.transactions = this.transactions.filter(t => t.id !== id)
        
        // Atualiza estatísticas
        await this.fetchStats()
        
        console.log('✅ [TRANSACTION STORE] Transação deletada:', id)
        
      } catch (error) {
        console.error('❌ [TRANSACTION STORE] Erro ao deletar transação:', error.message)
        this.error = error.response?.data?.message || 'Erro ao deletar transação'
        throw error
      } finally {
        this.isDeleting = false
      }
    },

    /**
     * Carrega estatísticas financeiras
     */
    async fetchStats(dateRange = {}) {
      console.log('📊 [TRANSACTION STORE] Carregando estatísticas')
      
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
        
        console.log('✅ [TRANSACTION STORE] Estatísticas carregadas:', {
          receitas: this.stats.totalIncome,
          despesas: this.stats.totalExpense,
          saldo: this.stats.balance
        })
        
      } catch (error) {
        console.error('❌ [TRANSACTION STORE] Erro ao carregar estatísticas:', error.message)
        this.error = error.response?.data?.message || 'Erro ao carregar estatísticas'
      } finally {
        this.isLoadingStats = false
      }
    },

    /**
     * Aplica filtros e recarrega transações
     */
    async applyFilters(newFilters) {
      console.log('🔍 [TRANSACTION STORE] Aplicando filtros:', newFilters)
      
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
      console.log('🧹 [TRANSACTION STORE] Limpando filtros')
      
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
      console.log('🔍 [TRANSACTION STORE] Carregando transação para edição:', id)
      
      try {
        const transaction = await transactionService.getTransactionById(id)
        this.currentTransaction = transaction
        
      } catch (error) {
        console.error('❌ [TRANSACTION STORE] Erro ao carregar transação:', error.message)
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
      console.log('📋 [TRANSACTION STORE] Categorias carregadas:', this.categories.length)
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
      console.log('🔄 [TRANSACTION STORE] Resetando store')
      
      this.transactions = []
      this.currentTransaction = null
      this.pagination = { page: 1, limit: 20, total: 0, totalPages: 0 }
      this.filters = { type: '', category: '', startDate: '', endDate: '', search: '' }
      this.stats = { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0, lastUpdated: null }
      this.error = null
    }
  }
})