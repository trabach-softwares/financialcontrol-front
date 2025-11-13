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
   * Busca evolução financeira detalhada (gráfico de linha temporal)
   * Busca transações individuais e agrupa inteligentemente baseado no período
   * Períodos curtos (7 dias) = agrupamento diário
   * Períodos longos (1 ano) = agrupamento mensal
   * @param {string} period - Período predefinido (current-month, 7days, etc)
   * @param {Object} customDateRange - Range customizado { startDate, endDate }
   */
  async getMonthlyEvolution(period = 'current-month', customDateRange = null) {
    try {
      console.log('📊 [SERVICE] Buscando evolução para período:', period)
      console.log('🎯 [SERVICE] Custom dateRange recebido:', customDateRange)
      
      // Usar dateRange customizado se fornecido, senão calcular baseado no período
      const dateRange = customDateRange && customDateRange.startDate && customDateRange.endDate
        ? customDateRange
        : this.calculateDateRange(period)
      
      console.log('📅 [SERVICE] Range de datas FINAL:', dateRange)
      
      // Buscar todas as transações do período
      const response = await api.get(FINANCIAL_ROUTES.transactionsList, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          limit: 1000 // Buscar todas as transações do período
        }
      })

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get transactions')
      }

      const transactions = response.data.data || []
      console.log(`📦 [SERVICE] ${transactions.length} transações recebidas`)
      
      // Determinar tipo de agrupamento baseado no período
      const groupingType = this.determineGroupingType(period)
      console.log('📋 [SERVICE] Tipo de agrupamento:', groupingType)
      
      // Agrupar transações e transformar para formato Chart.js
      return this.groupAndTransformData(transactions, dateRange, groupingType, period)
      
    } catch (error) {
      console.error('❌ [SERVICE] Erro ao buscar evolução:', error)
      
      // Retornar estrutura vazia mas válida para Chart.js
      return this.getEmptyChartStructure()
    }
  },
  
  /**
   * Calcula range de datas baseado no período selecionado
   */
  calculateDateRange(period) {
    const now = new Date()
    const endDate = now.toISOString().split('T')[0]
    let startDate
    
    switch (period) {
      case 'current-month':
        // Primeiro dia do mês atual
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        break
      case '7days':
        const date7 = new Date(now)
        date7.setDate(date7.getDate() - 6) // 6 dias atrás + hoje = 7 dias
        startDate = date7.toISOString().split('T')[0]
        break
      case '30days':
        const date30 = new Date(now)
        date30.setDate(date30.getDate() - 29) // 29 dias atrás + hoje = 30 dias
        startDate = date30.toISOString().split('T')[0]
        break
      case '3months':
        const date3m = new Date(now)
        date3m.setMonth(date3m.getMonth() - 3)
        startDate = date3m.toISOString().split('T')[0]
        break
      case '6months':
        const date6m = new Date(now)
        date6m.setMonth(date6m.getMonth() - 6)
        startDate = date6m.toISOString().split('T')[0]
        break
      case '1year':
        const date1y = new Date(now)
        date1y.setFullYear(date1y.getFullYear() - 1)
        startDate = date1y.toISOString().split('T')[0]
        break
      default:
        // Default: mês atual
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    }
    
    return { startDate, endDate }
  },
  
  /**
   * Determina o tipo de agrupamento baseado no período
   */
  determineGroupingType(period) {
    switch (period) {
      case '7days':
      case 'current-month':
      case '30days':
        return 'daily' // Agrupamento diário para períodos curtos
      case '3months':
        return 'weekly' // Agrupamento semanal para trimestre
      case '6months':
      case '1year':
        return 'monthly' // Agrupamento mensal para períodos longos
      default:
        return 'daily'
    }
  },
  
  /**
   * Agrupa transações e transforma para formato Chart.js
   */
  groupAndTransformData(transactions, dateRange, groupingType, period) {
    console.log(`🔄 [SERVICE] Agrupando ${transactions.length} transações (tipo: ${groupingType})`)
    
    // Gerar todos os períodos (dias/semanas/meses) no range
    const periods = this.generatePeriods(dateRange, groupingType, period)
    console.log(`📅 [SERVICE] ${periods.length} períodos gerados:`, periods.map(p => p.label))
    
    // Inicializar acumuladores para cada período
    const periodData = periods.map(period => ({
      label: period.label,
      date: period.date,
      income: 0,
      expense: 0,
      balance: 0
    }))
    
    // Agrupar transações nos períodos corretos
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date || transaction.created_at)
      const periodIndex = this.findPeriodIndex(transactionDate, periods, groupingType)
      
      if (periodIndex !== -1) {
        const amount = Math.abs(transaction.amount || 0)
        
        if (transaction.type === 'income') {
          periodData[periodIndex].income += amount
          periodData[periodIndex].balance += amount
        } else if (transaction.type === 'expense') {
          periodData[periodIndex].expense += amount
          periodData[periodIndex].balance -= amount
        }
      }
    })
    
    // Calcular saldo acumulado
    let accumulatedBalance = 0
    periodData.forEach(period => {
      accumulatedBalance += period.balance
      period.balance = accumulatedBalance
    })
    
    console.log('📊 [SERVICE] Dados agrupados:', periodData)
    
    // Transformar para formato Chart.js
    return {
      labels: periodData.map(p => p.label),
      datasets: [
        {
          label: 'Receitas',
          data: periodData.map(p => p.income),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Despesas',
          data: periodData.map(p => p.expense),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Saldo',
          data: periodData.map(p => p.balance),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    }
  },
  
  /**
   * Gera todos os períodos (dias/semanas/meses) no range
   */
  generatePeriods(dateRange, groupingType, period) {
    const periods = []
    const start = new Date(dateRange.startDate)
    const end = new Date(dateRange.endDate)
    
    if (groupingType === 'daily') {
      // Gerar todos os dias no range
      const current = new Date(start)
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0]
        
        // Formato do label varia com o período
        let label
        if (period === '7days') {
          // Para 7 dias: Seg, Ter, Qua...
          label = current.toLocaleDateString('pt-BR', { weekday: 'short' })
          label = label.charAt(0).toUpperCase() + label.slice(1)
        } else {
          // Para outros: 01, 02, 03...
          label = current.getDate().toString().padStart(2, '0')
        }
        
        periods.push({
          label,
          date: dateStr,
          start: new Date(current),
          end: new Date(current)
        })
        
        current.setDate(current.getDate() + 1)
      }
    } else if (groupingType === 'weekly') {
      // Gerar semanas
      const current = new Date(start)
      let weekNumber = 1
      
      while (current <= end) {
        const weekStart = new Date(current)
        const weekEnd = new Date(current)
        weekEnd.setDate(weekEnd.getDate() + 6)
        
        periods.push({
          label: `Sem ${weekNumber}`,
          date: current.toISOString().split('T')[0],
          start: weekStart,
          end: weekEnd > end ? end : weekEnd
        })
        
        current.setDate(current.getDate() + 7)
        weekNumber++
      }
    } else if (groupingType === 'monthly') {
      // Gerar meses
      const current = new Date(start)
      
      while (current <= end) {
        const monthLabel = current.toLocaleDateString('pt-BR', { month: 'short' })
        const capitalizedLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)
        
        const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
        
        periods.push({
          label: capitalizedLabel,
          date: current.toISOString().split('T')[0],
          start: monthStart,
          end: monthEnd > end ? end : monthEnd
        })
        
        current.setMonth(current.getMonth() + 1)
      }
    }
    
    return periods
  },
  
  /**
   * Encontra o índice do período que contém a data da transação
   */
  findPeriodIndex(transactionDate, periods, groupingType) {
    if (groupingType === 'daily') {
      // Para diário, comparar apenas a data (sem hora)
      const txDateStr = transactionDate.toISOString().split('T')[0]
      return periods.findIndex(p => p.date === txDateStr)
    } else {
      // Para semanal/mensal, verificar se está no range
      return periods.findIndex(p => 
        transactionDate >= p.start && transactionDate <= p.end
      )
    }
  },
  
  /**
   * Retorna estrutura vazia do gráfico
   */
  getEmptyChartStructure() {
    return {
      labels: [],
      datasets: [
        {
          label: 'Receitas',
          data: [],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Despesas',
          data: [],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Saldo',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
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