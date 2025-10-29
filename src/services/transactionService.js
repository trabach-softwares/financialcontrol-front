// ==========================================================================
// TRANSACTION SERVICE - SERVIÇOS DE TRANSAÇÕES FINANCEIRAS
// ==========================================================================
// Propósito: Encapsular CRUD completo de transações e estatísticas
// Origem: Componentes Vue, Stores Pinia, Páginas de transações
// Destino: API REST http://localhost:3000/api/transactions/*
// Efeitos: Gerenciamento completo do fluxo financeiro

import { api } from 'boot/axios'

/**
 * Serviços de transações que encapsulam todas as operações CRUD
 * Inclui filtros, paginação, estatísticas e categorias
 */
const transactionService = {

  // ==========================================================================
  // LISTAR TRANSAÇÕES - GET /transactions
  // ==========================================================================
  /**
   * Busca transações com filtros e paginação
   * Origem: Página de transações, dashboard, relatórios
   * Destino: GET /transactions?type&category&startDate&endDate&page&limit
   * Retorna: { transactions: [], total, page, totalPages }
   * Efeitos: Lista paginada com filtros aplicados
   */
  async getTransactions(filters = {}) {
    console.log('💰 Buscando transações com filtros:', filters)

    // Construir query parameters
    const params = new URLSearchParams()
    if (filters.type) params.append('type', filters.type)
    if (filters.category) params.append('category', filters.category)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.paid !== undefined && filters.paid !== '' && filters.paid !== null) {
      params.append('paid', String(filters.paid))
    }

    const queryString = params.toString()
    const url = `/transactions${queryString ? `?${queryString}` : ''}`

    const response = await api.get(url)

    // Algumas APIs respondem com { success, data, page, ... }
    // Outras respondem com { transactions, pagination } ou um array direto
    const raw = response?.data
    const success = typeof raw?.success === 'boolean' ? raw.success : true
    if (!success) {
      throw new Error(raw?.message || 'Failed to get transactions')
    }

    let transactions = []
    let page = Number(raw?.page || raw?.pagination?.page || 1)
    let limit = Number(raw?.limit || raw?.pagination?.limit || 20)
    let total = Number(raw?.total || raw?.pagination?.total || 0)
    let totalPages = Number(raw?.totalPages || raw?.pagination?.totalPages || 0)

    const payload = raw?.data ?? raw
    if (Array.isArray(payload)) {
      transactions = payload
      // se backend não manda total/paginação, inferimos
      total = typeof total === 'number' && total > 0 ? total : transactions.length
      totalPages = typeof totalPages === 'number' && totalPages > 0 ? totalPages : 1
    } else if (payload && typeof payload === 'object') {
      transactions = payload.transactions || payload.items || []
      page = Number(payload.page || payload.currentPage || page)
      limit = Number(payload.limit || payload.perPage || limit)
      total = Number(payload.total || total)
      totalPages = Number(payload.totalPages || payload.pages || totalPages)
    }

    console.log('✅ Transações obtidas:', {
      count: Array.isArray(transactions) ? transactions.length : 0,
      page, limit, total, totalPages,
      filters
    })

    return { transactions, page, limit, total, totalPages }
  },

  // ==========================================================================
  // CRIAÇÃO EM MASSA (SÉRIE) - POST /transactions/series
  // ==========================================================================
  async createTransactionsBulk(transactionsArray) {
    console.log('➕ [POST /transactions/series] criando em massa:', transactionsArray)
    try {
      const response = await api.post('/transactions/series', transactionsArray)
      console.log('✅ [POST /transactions/series] response:', response?.data)
      return response.data
    } catch (error) {
      const status = error?.response?.status
      const data = error?.response?.data
      console.error('❌ [POST /transactions/series] failed:', { status, data })
      throw error
    }
  },

  // ==========================================================================
  // CRIAR TRANSAÇÃO - POST /transactions
  // ==========================================================================
  /**
   * Cria nova transação financeira
   * Origem: Formulário de nova transação
   * Destino: POST /transactions
   * Retorna: Dados da transação criada
   * Efeitos: Nova transação adicionada ao sistema
   */
  async createTransaction(transactionData) {
    const payload = {
      type: transactionData.type,
      amount: Number(transactionData.amount),
      description: transactionData.description,
      category: transactionData.category,
      date: transactionData.date
    }
    const baseURL = api?.defaults?.baseURL || '(no baseURL)'
    const url = '/transactions'
    console.log('➕ [POST /transactions] baseURL:', baseURL, 'url:', url, 'payload:', JSON.stringify(payload))

    try {
      const response = await api.post(url, payload)
      console.log('✅ [POST /transactions] response:', response?.status, response?.data)
      return response.data
    } catch (error) {
      const status = error?.response?.status
      const data = error?.response?.data
      const message = error?.message
      const respText = error?.request?.responseText
      const reqUrl = error?.config?.baseURL ? (error.config.baseURL + (error.config.url || '')) : (error?.config?.url || '(no url)')
      let serialized = null
      try { serialized = typeof error?.toJSON === 'function' ? error.toJSON() : null } catch (_) { }
      console.error('❌ [POST /transactions] failed:', { status, data, message, reqUrl, respText, payload, serialized })
      throw error
    }
  },

  // ==========================================================================
  // ATUALIZAR TRANSAÇÃO - PUT /transactions/:id
  // ==========================================================================
  /**
   * Atualiza transação existente
   * Origem: Formulário de edição de transação
   * Destino: PUT /transactions/:id
   * Retorna: Dados da transação atualizada
   * Efeitos: Transação modificada no sistema
   */
  async updateTransaction(id, transactionData) {
    console.log('✏️ Atualizando transação:', id, {
      type: transactionData.type,
      amount: transactionData.amount
    })

    const response = await api.put(`/transactions/${id}`, {
      type: transactionData.type,
      amount: Number(transactionData.amount),
      description: transactionData.description,
      category: transactionData.category,
      date: transactionData.date
    })

    console.log('✅ Transação atualizada com sucesso:', id)
    return response.data
  },

  // ==========================================================================
  // DELETAR TRANSAÇÃO - DELETE /transactions/:id
  // ==========================================================================
  /**
   * Remove transação do sistema
   * Origem: Lista de transações, ação de deletar
   * Destino: DELETE /transactions/:id
   * Retorna: Confirmação da exclusão
   * Efeitos: Transação removida permanentemente
   */
  async deleteTransaction(id) {
    console.log('🗑️ Deletando transação:', id)

    const response = await api.delete(`/transactions/${id}`)

    console.log('✅ Transação deletada com sucesso:', id)
    return response.data
  },

  /**
   * Deleta uma série de parcelas a partir de uma data
   */
  async deleteSeriesForward(seriesId, fromDate) {
    console.log('🗑️ Deletando série a partir de', { seriesId, fromDate })
    try {
      const params = new URLSearchParams()
      if (fromDate) params.append('fromDate', fromDate)
      const url = `/transactions/series/${seriesId}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await api.delete(url)
      console.log('✅ Série deletada:', response?.data)
      return response.data
    } catch (error) {
      const status = error?.response?.status
      const data = error?.response?.data
      console.error('❌ [DELETE /transactions/series/:seriesId] failed:', { status, data, seriesId, fromDate })
      throw error
    }
  },

  // ==========================================================================
  // MARCAR COMO PAGA - PATCH /transactions/:id/paid
  // ==========================================================================
  /**
   * Marca uma transação como paga/não paga
   */
  async markTransactionPaid(id, paid, paidAt) {
    console.log('✅ Marcando transação como paga:', { id, paid, paidAt })
    try {
      const response = await api.patch(`/transactions/${id}/paid`, { paid: !!paid, paidAt })
      console.log('✅ Paid status atualizado:', response?.data)
      return response.data
    } catch (error) {
      const status = error?.response?.status
      const data = error?.response?.data
      console.error('❌ [PATCH /transactions/:id/paid] failed:', { status, data, id, paid, paidAt })
      throw error
    }
  },

  // ==========================================================================
  // ESTATÍSTICAS FINANCEIRAS - GET /transactions/stats
  // ==========================================================================
  /**
   * Busca estatísticas financeiras consolidadas
   * Origem: Dashboard, página de relatórios
   * Destino: GET /transactions/stats?startDate&endDate
   * Retorna: { totalIncome, totalExpense, balance, transactionCount }
   * Efeitos: Dados para gráficos e resumo financeiro
   */
  async getTransactionStats(dateRange = {}) {
    console.log('📊 Buscando estatísticas financeiras:', dateRange)

    try {
      const params = new URLSearchParams()
      if (dateRange.startDate) params.append('startDate', dateRange.startDate)
      if (dateRange.endDate) params.append('endDate', dateRange.endDate)
      const qs = params.toString()
      const url = `/transactions/stats${qs ? `?${qs}` : ''}`
      const response = await api.get(url)

      const raw = response?.data
      const payload = raw?.data ?? raw

      // Backend retorna { income, expense, balance, totalTransactions }
      const stats = {
        totalIncome: Number(payload?.income || 0),
        totalExpense: Number(payload?.expense || 0),
        balance: Number(payload?.balance || 0),
        transactionCount: Number(payload?.totalTransactions || 0)
      }

      console.log('✅ Estatísticas obtidas:', stats)

      return stats
    } catch (error) {
      const status = error?.response?.status
      const data = error?.response?.data
      console.warn('⚠️ [GET /transactions/stats] failed, usando zeros:', { status, data })
      return { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0 }
    }
  },

  // ==========================================================================
  // BUSCAR TRANSAÇÃO POR ID - GET /transactions/:id
  // ==========================================================================
  /**
   * Busca uma transação específica por ID
   * Origem: Formulário de edição, visualização de detalhes
   * Destino: GET /transactions/:id
   * Retorna: Dados completos da transação
   * Efeitos: Carregamento de dados para edição/visualização
   */
  async getTransactionById(id) {
    console.log('🔍 Buscando transação por ID:', id)

    const response = await api.get(`/transactions/${id}`)

    console.log('✅ Transação encontrada:', response.data.id)
    return response.data
  },

  // ==========================================================================
  // CATEGORIAS PADRÃO
  // ==========================================================================
  /**
   * Retorna lista de categorias padrão do sistema
   * Propósito: Fornecer opções para formulários de transação
   * Origem: Componentes de formulário, filtros
   * Retorna: Array de strings com nomes das categorias
   */
  getDefaultCategories() {
    return [
      // Receitas
      'Vendas',
      'Serviços',
      'Produtos',
      'Consultoria',
      'Comissões',
      'Investimentos',
      'Outras Receitas',

      // Despesas
      'Fornecedores',
      'Salários',
      'Aluguel',
      'Marketing',
      'Escritório',
      'Impostos',
      'Manutenção',
      'Combustível',
      'Telefone/Internet',
      'Outras Despesas'
    ]
  },

  // ==========================================================================
  // RELATÓRIOS E ANÁLISES - GET /transactions/reports
  // ==========================================================================
  /**
   * Busca dados para relatórios e análises financeiras
   * Origem: Página de relatórios, dashboard avançado
   * Destino: GET /transactions/reports?startDate&endDate
   * Retorna: Dados agregados para gráficos e análises
   * Efeitos: Relatórios detalhados com insights
   */
  async getReports(filters = {}) {
    console.log('📊 Buscando dados para relatórios:', filters)

    const params = new URLSearchParams()
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)

    const queryString = params.toString()
    const url = `/transactions/reports${queryString ? `?${queryString}` : ''}`

    const response = await api.get(url)

    console.log('✅ Dados de relatórios obtidos:', {
      totalTransactions: response.data.summary?.totalTransactions || 0,
      categoriesCount: response.data.categoryAnalysis?.length || 0,
      timelinePoints: response.data.timeline?.length || 0
    })

    return response.data
  }
}

// Exports
export default transactionService
export { transactionService }