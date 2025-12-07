// ==========================================================================
// ADMIN SERVICE - SERVIÇOS ADMINISTRATIVOS DO SISTEMA
// ==========================================================================
// Propósito: Encapsular operações administrativas e gerenciamento de usuários
// Origem: Páginas administrativas, dashboard admin, gestão de planos
// Destino: API REST http://localhost:3000/api/admin/*
// Efeitos: Gestão completa de usuários, planos e sistema

import { api } from 'boot/axios'

/**
 * Serviços administrativos que encapsulam operações de gestão do sistema
 * Inclui gerenciamento de usuários, planos e estatísticas globais
 */
export const adminService = {

  // ==========================================================================
  // GERENCIAMENTO DE USUÁRIOS
  // ==========================================================================
  
  /**
   * Lista todos os usuários do sistema com paginação e filtros
   * Origem: Dashboard admin, página de usuários
   * Destino: GET /admin/users?page&limit&search&plan&status
   * Retorna: { users: [], total, page, totalPages }
   * Efeitos: Lista paginada de usuários para administração
   */
  async getUsers(filters = {}) {
    
    const params = new URLSearchParams()
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.search) params.append('search', filters.search)
    if (filters.plan) params.append('plan', filters.plan)
    if (filters.status) params.append('status', filters.status)
    
    const queryString = params.toString()
    const url = `/admin/users${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url)
    
    return response.data
  },

  /**
   * Busca um usuário específico por ID
   * Origem: Página de detalhes do usuário, formulário de edição
   * Destino: GET /admin/users/:id
   * Retorna: Dados completos do usuário
   * Efeitos: Carregamento de dados para administração
   */
  async getUserById(id) {
    const response = await api.get(`/admin/users/${id}`)
        return response.data
  },

  /**
   * Atualiza dados de um usuário (apenas admin)
   * Origem: Formulário de edição de usuário admin
   * Destino: PUT /admin/users/:id
   * Retorna: Dados atualizados do usuário
   * Efeitos: Modificação de dados pelo administrador
   */
  async updateUser(id, userData) {

    
    const response = await api.put(`/admin/users/${id}`, {
      name: userData.name,
      email: userData.email,
      plan: userData.plan,
      status: userData.status,
      company: userData.company
    })
        return response.data
  },

  /**
   * Desativa/Ativa um usuário
   * Origem: Lista de usuários, ações administrativas
   * Destino: PATCH /admin/users/:id/status
   * Retorna: Status atualizado do usuário
   * Efeitos: Bloqueio/desbloqueio de acesso do usuário
   */
  async toggleUserStatus(id, status) {
    
    const response = await api.patch(`/admin/users/${id}/status`, {
      status: status // 'active' | 'inactive' | 'suspended'
    })
    
    return response.data
  },

  /**
   * Deleta um usuário permanentemente
   * Origem: Ação administrativa crítica
   * Destino: DELETE /admin/users/:id
   * Retorna: Confirmação da exclusão
   * Efeitos: Usuário removido permanentemente do sistema
   */
  async deleteUser(id) {
    
    const response = await api.delete(`/admin/users/${id}`)
    
    return response.data
  },

  // ==========================================================================
  // GERENCIAMENTO DE PLANOS
  // ==========================================================================
  
  /**
   * Lista todos os planos disponíveis
   * Origem: Dashboard admin, configuração de planos
   * Destino: GET /admin/plans
   * Retorna: Array de planos com detalhes completos
   * Efeitos: Lista de planos para administração
   */
  async getPlans() {
    
    const response = await api.get('/admin/plans')
    
    return response.data
  },

  /**
   * Cria um novo plano
   * Origem: Formulário de criação de plano
   * Destino: POST /admin/plans
   * Retorna: Dados do plano criado
   * Efeitos: Novo plano disponível no sistema
   */
  async createPlan(planData) {
    
    const response = await api.post('/admin/plans', {
      name: planData.name,
      description: planData.description,
      price: Number(planData.price),
      features: planData.features, // Array de strings
      transactionLimit: Number(planData.transactionLimit),
      isActive: planData.isActive
    })
    
    return response.data
  },

  /**
   * Atualiza um plano existente
   * Origem: Formulário de edição de plano
   * Destino: PUT /admin/plans/:id
   * Retorna: Dados do plano atualizado
   * Efeitos: Plano modificado no sistema
   */
  async updatePlan(id, planData) {
    
    const response = await api.put(`/admin/plans/${id}`, {
      name: planData.name,
      description: planData.description,
      price: Number(planData.price),
      features: planData.features,
      transactionLimit: Number(planData.transactionLimit),
      isActive: planData.isActive
    })
    
    return response.data
  },

  /**
   * Deleta um plano (se não tiver usuários associados)
   * Origem: Ação administrativa de remoção
   * Destino: DELETE /admin/plans/:id
   * Retorna: Confirmação da exclusão
   * Efeitos: Plano removido do sistema
   */
  async deletePlan(id) {
    
    const response = await api.delete(`/admin/plans/${id}`)
    
    return response.data
  },

  // ==========================================================================
  // ESTATÍSTICAS GLOBAIS DO SISTEMA
  // ==========================================================================
  
  /**
   * Busca estatísticas globais do sistema
   * Origem: Dashboard administrativo
   * Destino: GET /admin/stats
   * Retorna: Métricas completas do sistema
   * Efeitos: Dados para dashboard admin e relatórios
   */
  async getSystemStats() {
    
    const response = await api.get('/admin/stats')
    
    return response.data
  },

  /**
   * Busca estatísticas de uso por período
   * Origem: Relatórios administrativos, analytics
   * Destino: GET /admin/stats/usage?startDate&endDate
   * Retorna: Dados de uso detalhados por período
   * Efeitos: Análise de crescimento e engajamento
   */
  async getUsageStats(dateRange = {}) {
    
    const params = new URLSearchParams()
    if (dateRange.startDate) params.append('startDate', dateRange.startDate)
    if (dateRange.endDate) params.append('endDate', dateRange.endDate)
    
    const queryString = params.toString()
    const url = `/admin/stats/usage${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url)
    
    return response.data
  },

  // ==========================================================================
  // CONFIGURAÇÕES GLOBAIS DO SISTEMA
  // ==========================================================================
  
  /**
   * Busca configurações globais do sistema
   * Origem: Página de configurações administrativas
   * Destino: GET /admin/settings
   * Retorna: Configurações globais editáveis
   * Efeitos: Carregamento de configurações para edição
   */
  async getSystemSettings() {
    const response = await api.get('/admin/settings')
    return response.data
  },

  /**
   * Atualiza configurações globais do sistema
   * Origem: Formulário de configurações administrativas
   * Destino: PUT /admin/settings
   * Retorna: Configurações atualizadas
   * Efeitos: Modificação de comportamento global do sistema
   */
  async updateSystemSettings(settings) {
    const response = await api.put('/admin/settings', settings)
    
    return response.data
  }
}