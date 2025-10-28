// ==========================================================================
// DASHBOARD SERVICE - SERVIÇOS ESPECÍFICOS PARA O DASHBOARD
// ==========================================================================
// Propósito: Buscar dados específicos para gráficos e métricas do dashboard
// Origem: DashboardPage.vue, stores relacionadas
// Destino: API REST endpoints para dados agregados
// Efeitos: Dados reais para gráficos e estatísticas

import { api } from 'boot/axios'

/**
 * Serviços específicos do dashboard que complementam o transactionService
 * Foco em dados agregados para gráficos e análises visuais
 */
export const dashboardService = {

  // ==========================================================================
  // ESTATÍSTICAS GERAIS - GET /transactions/stats
  // ==========================================================================
  /**
   * Busca estatísticas gerais (receitas, despesas, saldo, contadores)
   * Origem: Cards principais do dashboard
   * Destino: GET /transactions/stats?startDate&endDate
   * Retorna: { income, expense, balance, totalTransactions }
   */
  async getStats(dateRange = {}) {

    const params = new URLSearchParams()
    if (dateRange.startDate) params.append('startDate', dateRange.startDate)
    if (dateRange.endDate) params.append('endDate', dateRange.endDate)

    const queryString = params.toString()
    const url = `/transactions/stats${queryString ? `?${queryString}` : ''}`

    const response = await api.get(url)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to get statistics')
    }

    const stats = response.data.data

    return {
      totalIncome: stats.income || 0,
      totalExpense: stats.expense || 0,
      balance: stats.balance || 0,
      transactionCount: stats.totalTransactions || 0
    }
  },

  // ==========================================================================
  // EVOLUÇÃO MENSAL - GET /transactions/timeline
  // ==========================================================================
  /**
   * Busca dados de evolução mensal para gráfico de linha
   * Origem: Gráfico "Evolução Financeira" no dashboard
   * Destino: GET /transactions/timeline?period=6months
   * Retorna: { labels: [], income: [], expense: [] }
   */
  async getMonthlyEvolution(period = '6months') {

    const response = await api.get(`/transactions/timeline?period=${period}`)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to get monthly evolution')
    }

    const timeline = response.data.data

    // Transformar dados da API para formato do Chart.js
    const labels = []
    const incomeData = []
    const expenseData = []

    timeline.forEach(item => {
      labels.push(item.month)
      incomeData.push(item.income || 0)
      expenseData.push(item.expense || 0)
    })

    return {
      labels,
      datasets: [
        {
          label: 'Receitas',
          data: incomeData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Despesas',
          data: expenseData,
          borderColor: '#f44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    }
  },

  // ==========================================================================
  // ANÁLISE POR CATEGORIAS - GET /transactions/categories
  // ==========================================================================
  /**
   * Busca distribuição de despesas por categoria para gráfico de rosca
   * Origem: Gráfico "Por Categoria" no dashboard
   * Destino: GET /transactions/categories?type=expense&startDate&endDate
   * Retorna: { categories: [], values: [], colors: [] }
   */
  async getCategoryAnalysis(filters = {}) {

    const params = new URLSearchParams()
    params.append('type', 'expense') // Foco em despesas para o gráfico
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)

    const queryString = params.toString()
    const url = `/transactions/categories?${queryString}`

    const response = await api.get(url)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to get category analysis')
    }

    const categories = response.data.data

    // Cores predefinidas para as categorias
    const colors = [
      '#FF6384',  // Rosa
      '#36A2EB',  // Azul
      '#FFCE56',  // Amarelo
      '#4BC0C0',  // Turquesa
      '#9966FF',  // Roxo
      '#FF9F40',  // Laranja
      '#FF6384CC', // Rosa transparente
      '#36A2EBCC', // Azul transparente
      '#FFCE56CC', // Amarelo transparente
      '#4BC0C0CC'  // Turquesa transparente
    ]

    const labels = []
    const data = []
    const backgroundColors = []
    const hoverBackgroundColors = []

    categories.forEach((category, index) => {
      labels.push(category.name || 'Sem categoria')
      data.push(category.total || 0)
      backgroundColors.push(colors[index % colors.length])
      hoverBackgroundColors.push(colors[index % colors.length] + 'CC') // Adiciona transparência
    })

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverBackgroundColors
      }]
    }
  },

  // ==========================================================================
  // TRANSAÇÕES RECENTES - GET /transactions?limit=5
  // ==========================================================================
  /**
   * Busca transações mais recentes para exibir no dashboard
   * Origem: Seção "Transações Recentes" no dashboard
   * Destino: GET /transactions?limit=5&sort=date:desc
   * Retorna: Array de transações ordenadas por data
   */
  async getRecentTransactions(limit = 5) {

    const response = await api.get(`/transactions?limit=${limit}&sort=date:desc`)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to get recent transactions')
    }

    const transactions = response.data.data || []


    return transactions
  },

  // ==========================================================================
  // MÉTRICAS DE CRESCIMENTO - GET /transactions/growth
  // ==========================================================================
  /**
   * Busca métricas de crescimento mensal (percentuais)
   * Origem: Indicadores de tendência nos cards do dashboard
   * Destino: GET /transactions/growth
   * Retorna: { incomeGrowth, expenseGrowth, balanceGrowth }
   */
  async getGrowthMetrics() {

    try {
      const response = await api.get('/transactions/growth')

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get growth metrics')
      }

      const growth = response.data.data

      return {
        incomeGrowth: growth.incomeGrowth || 0,
        expenseGrowth: growth.expenseGrowth || 0,
        balanceGrowth: growth.balanceGrowth || 0
      }
    } catch (error) {
      // Se o endpoint não existir, retorna valores padrão
      return {
        incomeGrowth: 0,
        expenseGrowth: 0,
        balanceGrowth: 0
      }
    }
  }
}