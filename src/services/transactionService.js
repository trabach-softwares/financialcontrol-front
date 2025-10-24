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
export const transactionService = {

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
    
    const queryString = params.toString()
    const url = `/transactions${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url)
    
    // Validar estrutura da API conforme documentação
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to get transactions')
    }
    
    const transactions = response.data.data
    
    console.log('✅ Transações obtidas:', {
      count: Array.isArray(transactions) ? transactions.length : 0,
      filters: filters
    })
    
    return transactions
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
    console.log('➕ Criando nova transação:', {
      type: transactionData.type,
      amount: transactionData.amount,
      category: transactionData.category
    })
    
    const response = await api.post('/transactions', {
      type: transactionData.type,           // 'income' | 'expense'
      amount: Number(transactionData.amount),
      description: transactionData.description,
      category: transactionData.category,
      date: transactionData.date
    })
    
    console.log('✅ Transação criada com sucesso:', response.data.id)
    return response.data
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
    
    const params = new URLSearchParams()
    if (dateRange.startDate) params.append('startDate', dateRange.startDate)
    if (dateRange.endDate) params.append('endDate', dateRange.endDate)
    
    const queryString = params.toString()
    const url = `/transactions/stats${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url)
    
    console.log('✅ Estatísticas obtidas:', {
      receitas: response.data.totalIncome,
      despesas: response.data.totalExpense,
      saldo: response.data.balance,
      total: response.data.transactionCount
    })
    
    return response.data
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