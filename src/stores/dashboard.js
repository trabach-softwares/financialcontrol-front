// ==========================================================================
// PINIA STORE - DASHBOARD (DASHBOARD STORE)
// ==========================================================================
// Propósito: Gerenciar estado global dos dados do dashboard
// Origem: DashboardPage.vue e componentes relacionados
// Efeitos: Estado reativo dos gráficos e métricas do dashboard

import { defineStore } from 'pinia'
import { dashboardService } from 'src/services/dashboardService'

export const useDashboardStore = defineStore('dashboard', {
  // ==========================================================================
  // ESTADO (STATE)
  // ==========================================================================
  state: () => ({
    // Estatísticas principais
    stats: {
      totalIncome: 0,           // Total de receitas
      totalExpense: 0,          // Total de despesas  
      balance: 0,               // Saldo atual
      transactionCount: 0,      // Número de transações
      lastUpdated: null         // Última atualização
    },

    // Métricas de crescimento
    growth: {
      incomeGrowth: 0,          // % crescimento receitas
      expenseGrowth: 0,         // % crescimento despesas  
      balanceGrowth: 0,         // % crescimento saldo
      period: 'month'           // Período da comparação
    },

    // Dados do gráfico de evolução mensal
    monthlyEvolution: {
      labels: [],               // Meses/períodos
      datasets: []              // Dados de receitas e despesas
    },

    // Dados do gráfico de categorias
    categoryAnalysis: {
      labels: [],               // Nomes das categorias
      datasets: []              // Valores por categoria
    },

    // Transações recentes
    recentTransactions: [],     // Lista das últimas transações

    // Configurações dos gráficos
    chartConfig: {
      period: '6months',        // Período do gráfico de evolução
      categoryType: 'expense',  // Tipo para análise de categorias
      showAnimations: true      // Animações nos gráficos
    },

    // Estados de loading
    isLoadingStats: false,      // Loading das estatísticas
    isLoadingCharts: false,     // Loading dos gráficos
    isLoadingRecent: false,     // Loading das transações recentes
    
    // Estados de erro
    error: null,                // Último erro ocorrido
    chartsError: null,          // Erro específico dos gráficos
  }),

  // ==========================================================================
  // GETTERS (COMPUTED)
  // ==========================================================================
  getters: {
    /**
     * Verifica se algum loading está ativo
     */
    isLoading: (state) => {
      return state.isLoadingStats || state.isLoadingCharts || state.isLoadingRecent
    },

    /**
     * Formata estatísticas para exibição
     */
    formattedStats: (state) => {
      return {
        income: state.stats.totalIncome,
        expense: state.stats.totalExpense,
        balance: state.stats.balance,
        transactionCount: state.stats.transactionCount,
        incomeGrowth: state.growth.incomeGrowth,
        expenseGrowth: state.growth.expenseGrowth
      }
    },

    /**
     * Verifica se há dados dos gráficos carregados
     */
    hasChartData: (state) => {
      return (
        state.monthlyEvolution.labels.length > 0 ||
        state.categoryAnalysis.labels.length > 0
      )
    },

    /**
     * Retorna cor do saldo baseado no valor
     */
    balanceColor: (state) => {
      if (state.stats.balance > 0) return 'text-blue-6'
      if (state.stats.balance < 0) return 'text-red-6'
      return 'text-grey-6'
    },

    /**
     * Retorna resumo para debug/logs
     */
    summary: (state) => {
      return {
        statsLoaded: state.stats.lastUpdated !== null,
        chartsLoaded: state.hasChartData,
        recentCount: state.recentTransactions.length,
        hasErrors: !!(state.error || state.chartsError)
      }
    }
  },

  // ==========================================================================
  // ACTIONS (METHODS)
  // ==========================================================================
  actions: {
    /**
     * Carrega todas as estatísticas principais do dashboard
     */
    async fetchStats(dateRange = {}) {
      console.log('📊 [DASHBOARD STORE] Carregando estatísticas')
      
      this.isLoadingStats = true
      this.error = null
      
      try {
        // Busca estatísticas básicas
        const stats = await dashboardService.getStats(dateRange)
        this.stats = {
          ...stats,
          lastUpdated: new Date().toISOString()
        }

        // Busca métricas de crescimento
        const growth = await dashboardService.getGrowthMetrics()
        this.growth = {
          ...this.growth,
          ...growth
        }

        console.log('✅ [DASHBOARD STORE] Estatísticas carregadas:', {
          receitas: this.stats.totalIncome,
          despesas: this.stats.totalExpense,
          saldo: this.stats.balance,
          crescimentoReceitas: this.growth.incomeGrowth
        })

      } catch (error) {
        console.error('❌ [DASHBOARD STORE] Erro ao carregar estatísticas:', error.message)
        this.error = error.message
      } finally {
        this.isLoadingStats = false
      }
    },

    /**
     * Carrega dados dos gráficos (evolução e categorias)
     */
    async fetchChartData(options = {}) {
      console.log('📈 [DASHBOARD STORE] Carregando dados dos gráficos')
      
      this.isLoadingCharts = true
      this.chartsError = null
      
      try {
        // Carrega evolução mensal
        const period = options.period || this.chartConfig.period
        const evolutionData = await dashboardService.getMonthlyEvolution(period)
        this.monthlyEvolution = evolutionData

        // Carrega análise de categorias  
        const categoryData = await dashboardService.getCategoryAnalysis(options.dateRange)
        this.categoryAnalysis = categoryData

        // Atualiza configuração
        this.chartConfig.period = period

        console.log('✅ [DASHBOARD STORE] Dados dos gráficos carregados:', {
          periodos: this.monthlyEvolution.labels.length,
          categorias: this.categoryAnalysis.labels.length
        })

      } catch (error) {
        console.error('❌ [DASHBOARD STORE] Erro ao carregar gráficos:', error.message)
        this.chartsError = error.message
        
        // Define dados vazios em caso de erro
        this.monthlyEvolution = { labels: [], datasets: [] }
        this.categoryAnalysis = { labels: [], datasets: [] }
      } finally {
        this.isLoadingCharts = false
      }
    },

    /**
     * Carrega transações recentes
     */
    async fetchRecentTransactions(limit = 5) {
      console.log('🕒 [DASHBOARD STORE] Carregando transações recentes')
      
      this.isLoadingRecent = true
      
      try {
        const transactions = await dashboardService.getRecentTransactions(limit)
        this.recentTransactions = transactions

        console.log('✅ [DASHBOARD STORE] Transações recentes carregadas:', transactions.length)

      } catch (error) {
        console.error('❌ [DASHBOARD STORE] Erro ao carregar transações recentes:', error.message)
        this.recentTransactions = []
      } finally {
        this.isLoadingRecent = false
      }
    },

    /**
     * Carrega todos os dados do dashboard
     */
    async loadDashboard(options = {}) {
      console.log('🚀 [DASHBOARD STORE] Carregando dashboard completo')
      
      const promises = [
        this.fetchStats(options.dateRange),
        this.fetchChartData(options),
        this.fetchRecentTransactions(options.recentLimit)
      ]

      await Promise.allSettled(promises)
      
      console.log('✅ [DASHBOARD STORE] Dashboard carregado:', this.summary)
    },

    /**
     * Atualiza período dos gráficos
     */
    async updateChartPeriod(period) {
      console.log('📅 [DASHBOARD STORE] Atualizando período dos gráficos:', period)
      
      this.chartConfig.period = period
      await this.fetchChartData({ period })
    },

    /**
     * Recarrega apenas as estatísticas
     */
    async refreshStats() {
      console.log('🔄 [DASHBOARD STORE] Atualizando estatísticas')
      await this.fetchStats()
    },

    /**
     * Limpa todos os dados do dashboard
     */
    clearDashboard() {
      console.log('🧹 [DASHBOARD STORE] Limpando dados do dashboard')
      
      this.stats = {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0,
        lastUpdated: null
      }
      
      this.growth = {
        incomeGrowth: 0,
        expenseGrowth: 0,
        balanceGrowth: 0,
        period: 'month'
      }
      
      this.monthlyEvolution = { labels: [], datasets: [] }
      this.categoryAnalysis = { labels: [], datasets: [] }
      this.recentTransactions = []
      
      this.error = null
      this.chartsError = null
    },

    /**
     * Atualiza configurações dos gráficos
     */
    updateChartConfig(config) {
      console.log('⚙️ [DASHBOARD STORE] Atualizando configurações:', config)
      this.chartConfig = { ...this.chartConfig, ...config }
    }
  }
})