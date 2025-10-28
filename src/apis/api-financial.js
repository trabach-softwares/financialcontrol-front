// ==========================================================================
// API FINANCIAL - CENTRALIZAÇÃO DE ROTAS E HELPERS
// ==========================================================================
// Propósito: Centralizar TODAS as rotas da API em um único arquivo
// Padrão: ROUTES_MAP + helpers assíncronos para cada endpoint
// Arquitetura: Elimina chamadas HTTP soltas nos componentes
// Uso: import { login, getTransactions, ... } from '@/apis/api-financial.js'

import { api } from 'boot/axios'
import { 
  handleApiError, 
  buildQueryString, 
  normalizeApiResponse 
} from '@/utils/apiUtils'

// ==========================================================================
// 1) MAPA CENTRALIZADO DE ROTAS
// ==========================================================================

/**
 * Mapa centralizado com TODAS as rotas da API
 * Organizado por domínio/recurso para fácil manutenção
 */
export const API_ROUTES = {
  // ========== AUTENTICAÇÃO ==========
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    logout: '/auth/logout',
  },

  // ========== TRANSAÇÕES ==========
  transactions: {
    list: '/transactions',
    create: '/transactions',
    update: (id) => `/transactions/${id}`,
    delete: (id) => `/transactions/${id}`,
    getById: (id) => `/transactions/${id}`,
    stats: '/transactions/stats',
    reports: '/transactions/reports',
  },

  // ========== USUÁRIO ==========
  users: {
    profile: '/users/profile',
    password: '/users/password',
    settings: '/users/settings',
    avatar: '/users/avatar',
    plan: '/users/plan',
    stats: '/users/stats',
    account: '/users/account',
  },

  // ========== ADMIN ==========
  admin: {
    users: '/admin/users',
    stats: '/admin/stats',
    userById: (id) => `/admin/users/${id}`,
  },

  // ========== DASHBOARD ==========
  dashboard: {
    stats: '/dashboard/stats',
    summary: '/dashboard/summary',
    charts: '/dashboard/charts',
  },

  // ========== PLANOS ==========
  plans: {
    list: '/plans',
    getById: (id) => `/plans/${id}`,
  }
}

// ==========================================================================
// 2) HELPERS DE AUTENTICAÇÃO
// ==========================================================================

/**
 * Realiza login do usuário
 * @param {Object} credentials - { email, password }
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - { token, user }
 */
export async function login(credentials, options = {}) {
  try {
    console.log('🔐 [API] Login:', credentials.email)

    const response = await api.post(API_ROUTES.auth.login, {
      email: credentials.email,
      password: credentials.password
    }, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Login bem-sucedido')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Registra novo usuário
 * @param {Object} userData - { name, email, password }
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - { token, user }
 */
export async function register(userData, options = {}) {
  try {
    console.log('📝 [API] Registro:', userData.email)

    const response = await api.post(API_ROUTES.auth.register, {
      name: userData.name,
      email: userData.email,
      password: userData.password
    }, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Registro bem-sucedido')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca dados do usuário autenticado
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Dados do usuário
 */
export async function getMe(options = {}) {
  try {
    console.log('👤 [API] Buscando usuário atual')

    const response = await api.get(API_ROUTES.auth.me, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Usuário obtido')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

// ==========================================================================
// 3) HELPERS DE TRANSAÇÕES
// ==========================================================================

/**
 * Lista transações com filtros e paginação
 * @param {Object} filters - { type, category, startDate, endDate, page, limit }
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Array>} - Lista de transações
 */
export async function getTransactions(filters = {}, options = {}) {
  try {
    console.log('💰 [API] Listando transações:', filters)

    const queryString = buildQueryString(filters)
    const url = `${API_ROUTES.transactions.list}${queryString}`

    const response = await api.get(url, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Transações obtidas:', normalized.data?.length || 0)
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Cria nova transação
 * @param {Object} transactionData - Dados da transação
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Transação criada
 */
export async function createTransaction(transactionData, options = {}) {
  try {
    console.log('➕ [API] Criando transação:', transactionData.type)

    const response = await api.post(API_ROUTES.transactions.create, {
      type: transactionData.type,
      amount: Number(transactionData.amount),
      description: transactionData.description,
      category: transactionData.category,
      date: transactionData.date
    }, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Transação criada')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Atualiza transação existente
 * @param {string|number} id - ID da transação
 * @param {Object} transactionData - Dados atualizados
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Transação atualizada
 */
export async function updateTransaction(id, transactionData, options = {}) {
  try {
    console.log('✏️ [API] Atualizando transação:', id)

    const response = await api.put(API_ROUTES.transactions.update(id), {
      type: transactionData.type,
      amount: Number(transactionData.amount),
      description: transactionData.description,
      category: transactionData.category,
      date: transactionData.date
    }, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Transação atualizada')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Deleta transação
 * @param {string|number} id - ID da transação
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Confirmação
 */
export async function deleteTransaction(id, options = {}) {
  try {
    console.log('🗑️ [API] Deletando transação:', id)

    const response = await api.delete(API_ROUTES.transactions.delete(id), options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Transação deletada')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca transação por ID
 * @param {string|number} id - ID da transação
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Dados da transação
 */
export async function getTransactionById(id, options = {}) {
  try {
    console.log('🔍 [API] Buscando transação:', id)

    const response = await api.get(API_ROUTES.transactions.getById(id), options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Transação encontrada')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca estatísticas financeiras
 * @param {Object} dateRange - { startDate, endDate }
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Estatísticas
 */
export async function getTransactionStats(dateRange = {}, options = {}) {
  try {
    console.log('📊 [API] Buscando estatísticas:', dateRange)

    const queryString = buildQueryString(dateRange)
    const url = `${API_ROUTES.transactions.stats}${queryString}`

    const response = await api.get(url, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Estatísticas obtidas')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca relatórios financeiros
 * @param {Object} filters - { startDate, endDate }
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Dados de relatórios
 */
export async function getTransactionReports(filters = {}, options = {}) {
  try {
    console.log('📊 [API] Buscando relatórios:', filters)

    const queryString = buildQueryString(filters)
    const url = `${API_ROUTES.transactions.reports}${queryString}`

    const response = await api.get(url, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Relatórios obtidos')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

// ==========================================================================
// 4) HELPERS DE USUÁRIO
// ==========================================================================

/**
 * Busca perfil atual do usuário
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Dados do perfil
 */
export async function getUserProfile(options = {}) {
  try {
    console.log('📋 [API] Buscando perfil')

    const response = await api.get(API_ROUTES.users.profile, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Perfil obtido')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Atualiza perfil do usuário
 * @param {Object} profileData - { name, email, company, phone }
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Perfil atualizado
 */
export async function updateUserProfile(profileData, options = {}) {
  try {
    console.log('👤 [API] Atualizando perfil')

    const response = await api.put(API_ROUTES.users.profile, {
      name: profileData.name,
      email: profileData.email,
      company: profileData.company || null,
      phone: profileData.phone || null
    }, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Perfil atualizado')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Altera senha do usuário
 * @param {Object} passwordData - { currentPassword, newPassword }
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Confirmação
 */
export async function changePassword(passwordData, options = {}) {
  try {
    console.log('🔒 [API] Alterando senha')

    const response = await api.put(API_ROUTES.users.password, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Senha alterada')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Upload de avatar do usuário
 * @param {File} file - Arquivo de imagem
 * @param {Object} options - Opções adicionais
 * @returns {Promise<string>} - URL do avatar
 */
export async function uploadAvatar(file, options = {}) {
  try {
    console.log('📷 [API] Upload de avatar:', file.name)

    const formData = new FormData()
    formData.append('avatar', file)

    const response = await api.post(API_ROUTES.users.avatar, formData, {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options.headers
      }
    })

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Avatar atualizado')
    return normalized.data.avatarUrl || normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Remove avatar do usuário
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Confirmação
 */
export async function removeAvatar(options = {}) {
  try {
    console.log('🗑️ [API] Removendo avatar')

    const response = await api.delete(API_ROUTES.users.avatar, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Avatar removido')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca configurações do usuário
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Configurações
 */
export async function getUserSettings(options = {}) {
  try {
    console.log('⚙️ [API] Buscando configurações')

    const response = await api.get(API_ROUTES.users.settings, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Configurações obtidas')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Atualiza configurações do usuário
 * @param {Object} settings - Configurações a atualizar
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Configurações atualizadas
 */
export async function updateUserSettings(settings, options = {}) {
  try {
    console.log('⚙️ [API] Atualizando configurações')

    const response = await api.put(API_ROUTES.users.settings, settings, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Configurações atualizadas')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Altera plano do usuário
 * @param {string|number} planId - ID do novo plano
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Dados do novo plano
 */
export async function changeUserPlan(planId, options = {}) {
  try {
    console.log('💳 [API] Alterando plano:', planId)

    const response = await api.put(API_ROUTES.users.plan, { planId }, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Plano alterado')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca estatísticas do usuário
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Estatísticas
 */
export async function getUserStats(options = {}) {
  try {
    console.log('📈 [API] Buscando estatísticas do usuário')

    const response = await api.get(API_ROUTES.users.stats, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Estatísticas obtidas')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Deleta conta do usuário
 * @param {string} confirmation - Texto de confirmação
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Confirmação
 */
export async function deleteUserAccount(confirmation, options = {}) {
  try {
    console.log('⚠️ [API] Deletando conta - IRREVERSÍVEL')

    const response = await api.delete(API_ROUTES.users.account, {
      ...options,
      data: { confirmation }
    })

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Conta deletada')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

// ==========================================================================
// 5) HELPERS DE ADMIN
// ==========================================================================

/**
 * Lista usuários (admin)
 * @param {Object} filters - Filtros de busca
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Array>} - Lista de usuários
 */
export async function getAdminUsers(filters = {}, options = {}) {
  try {
    console.log('👥 [API] Listando usuários (admin)')

    const queryString = buildQueryString(filters)
    const url = `${API_ROUTES.admin.users}${queryString}`

    const response = await api.get(url, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Usuários obtidos')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca estatísticas do sistema (admin)
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Estatísticas do sistema
 */
export async function getAdminStats(options = {}) {
  try {
    console.log('📊 [API] Buscando estatísticas do sistema (admin)')

    const response = await api.get(API_ROUTES.admin.stats, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Estatísticas do sistema obtidas')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Atualiza usuário (admin)
 * @param {string|number} userId - ID do usuário
 * @param {Object} userData - Dados a atualizar
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Usuário atualizado
 */
export async function updateAdminUser(userId, userData, options = {}) {
  try {
    console.log('✏️ [API] Atualizando usuário (admin):', userId)

    const response = await api.put(API_ROUTES.admin.userById(userId), userData, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Usuário atualizado')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

// ==========================================================================
// 6) HELPERS DE DASHBOARD
// ==========================================================================

/**
 * Busca estatísticas do dashboard
 * @param {Object} filters - Filtros de data
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Dados do dashboard
 */
export async function getDashboardStats(filters = {}, options = {}) {
  try {
    console.log('📊 [API] Buscando estatísticas do dashboard')

    const queryString = buildQueryString(filters)
    const url = `${API_ROUTES.dashboard.stats}${queryString}`

    const response = await api.get(url, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Estatísticas do dashboard obtidas')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca resumo do dashboard
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Resumo do dashboard
 */
export async function getDashboardSummary(options = {}) {
  try {
    console.log('📋 [API] Buscando resumo do dashboard')

    const response = await api.get(API_ROUTES.dashboard.summary, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Resumo do dashboard obtido')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca dados para gráficos do dashboard
 * @param {Object} filters - Filtros de data
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Dados dos gráficos
 */
export async function getDashboardCharts(filters = {}, options = {}) {
  try {
    console.log('📈 [API] Buscando dados de gráficos')

    const queryString = buildQueryString(filters)
    const url = `${API_ROUTES.dashboard.charts}${queryString}`

    const response = await api.get(url, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Dados de gráficos obtidos')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

// ==========================================================================
// 7) HELPERS DE PLANOS
// ==========================================================================

/**
 * Lista planos disponíveis
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Array>} - Lista de planos
 */
export async function getPlans(options = {}) {
  try {
    console.log('💳 [API] Listando planos')

    const response = await api.get(API_ROUTES.plans.list, options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Planos obtidos')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca plano por ID
 * @param {string|number} planId - ID do plano
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Dados do plano
 */
export async function getPlanById(planId, options = {}) {
  try {
    console.log('🔍 [API] Buscando plano:', planId)

    const response = await api.get(API_ROUTES.plans.getById(planId), options)

    const normalized = normalizeApiResponse(response)

    console.log('✅ [API] Plano encontrado')
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

// ==========================================================================
// 8) CONSTANTES E HELPERS UTILITÁRIOS
// ==========================================================================

/**
 * Categorias padrão do sistema
 */
export const DEFAULT_CATEGORIES = {
  income: [
    'Vendas',
    'Serviços',
    'Produtos',
    'Consultoria',
    'Comissões',
    'Investimentos',
    'Outras Receitas'
  ],
  expense: [
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
}

/**
 * Retorna todas as categorias (receitas + despesas)
 * @returns {Array<string>} - Lista de categorias
 */
export function getAllCategories() {
  return [...DEFAULT_CATEGORIES.income, ...DEFAULT_CATEGORIES.expense]
}

/**
 * Retorna categorias por tipo
 * @param {string} type - 'income' ou 'expense'
 * @returns {Array<string>} - Lista de categorias do tipo
 */
export function getCategoriesByType(type) {
  return DEFAULT_CATEGORIES[type] || []
}
