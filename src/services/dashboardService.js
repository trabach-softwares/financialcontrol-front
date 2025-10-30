// ==========================================================================
// DASHBOARD SERVICE - SERVIÇOS ESPECÍFICOS PARA O DASHBOARD
// ==========================================================================
// Propósito: Buscar dados específicos para gráficos e métricas do dashboard
// Origem: DashboardPage.vue, stores relacionadas
// Destino: API REST endpoints para dados agregados
// Efeitos: Dados reais para gráficos e estatísticas

import { api } from 'boot/axios'
import { FINANCIAL_ROUTES } from 'src/apis/routes'

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
    try {
      const params = new URLSearchParams()
      if (dateRange.startDate) params.append('startDate', dateRange.startDate)
      if (dateRange.endDate) params.append('endDate', dateRange.endDate)

      const queryString = params.toString()
      const url = `${FINANCIAL_ROUTES.transactionsStats}${queryString ? `?${queryString}` : ''}`

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
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      // Retornar dados mock em caso de erro
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0
      }
    }
  },

  // ==========================================================================
  // EVOLUÇÃO MENSAL - GET /transactions/timeline
  // ==========================================================================
  /**
   * Busca evolução mensal (gráfico de linha temporal)
   * Origem: ChartJS no dashboard
   * Destino: GET /transactions/timeline?period=monthly&year=2024
   * Retorna: Array de { month, income, expense, balance }
   */
  async getMonthlyEvolution(year = new Date().getFullYear()) {
    try {
      const response = await api.get(FINANCIAL_ROUTES.transactionsTimeline, {
        params: {
          period: 'monthly',
          year
        }
      })

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get monthly evolution')
      }

      return response.data.data || []
    } catch (error) {
      console.error('Erro ao buscar evolução mensal:', error)
      // Retornar dados mock em caso de erro
      const currentDate = new Date()
      return Array.from({ length: 12 }, (_, i) => ({
        month: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(year, i)),
        income: 0,
        expense: 0,
        balance: 0
      }))
    }
  },

  // ==========================================================================
  // ANÁLISE POR CATEGORIAS - GET /transactions/categories
  // ==========================================================================
  /**
   * Busca distribuição de despesas por categoria para gráfico de rosca
   * Origem: Gráfico "Por Categoria" no dashboard
   * Destino: GET /transactions (agrupado por categoria)
   * Retorna: { categories: [], values: [], colors: [] }
   */
  async getCategoryAnalysis(filters = {}) {

    const params = new URLSearchParams()
    params.append('type', 'expense') // Foco em despesas para o gráfico
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)

    const queryString = params.toString()
    const url = `${FINANCIAL_ROUTES.transactionsList}${queryString ? `?${queryString}` : ''}`

    const response = await api.get(url)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to get category analysis')
    }

    const transactions = response.data.data

    // Agrupar transações por categoria
    const categoryMap = {}
    transactions.forEach(transaction => {
      const category = transaction.category || 'Sem categoria'
      if (!categoryMap[category]) {
        categoryMap[category] = 0
      }
      categoryMap[category] += transaction.amount || 0
    })

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

    Object.entries(categoryMap).forEach(([category, total], index) => {
      labels.push(category)
      data.push(total)
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
   * Busca transações recentes (lista limitada para dashboard)
   * Origem: Tabela do dashboard
   * Destino: GET /transactions?limit=5&orderBy=date&sort=desc
   * Retorna: Array de transações recentes formatadas
   */
  async getRecentTransactions(limit = 5) {
    try {
      const response = await api.get(FINANCIAL_ROUTES.transactionsList, {
        params: {
          limit
          // Removido orderBy e sort que estavam causando erro no backend
        }
      })

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get recent transactions')
      }

      const transactions = response.data.data || []
      
      // Ordenar no frontend se necessário (pelo campo correto)
      return transactions.sort((a, b) => {
        const dateA = new Date(a.date || a.created_at)
        const dateB = new Date(b.date || b.created_at)
        return dateB - dateA // Desc (mais recentes primeiro)
      })
      
    } catch (error) {
      console.error('Erro ao buscar transações recentes:', error)
      // Retornar array vazio em caso de erro
      return []
    }
  },

  // ==========================================================================
  // MÉTRICAS DE CRESCIMENTO - GET /transactions/growth
  // ==========================================================================
  /**
   * Busca métricas de crescimento mensal (percentuais)
   * Origem: Indicadores de tendência nos cards do dashboard
   * Destino: Calculado baseado em /transactions/stats
   * Retorna: { incomeGrowth, expenseGrowth, balanceGrowth }
   */
  async getGrowthMetrics() {

    try {
      // Por enquanto, retorna valores simulados até o endpoint estar disponível
      return {
        incomeGrowth: 0,
        expenseGrowth: 0,
        balanceGrowth: 0
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