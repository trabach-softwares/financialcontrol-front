/**
 * ========================================
 * API FINANCIAL CONTROL - Módulo Centralizado
 * ========================================
 * 
 * Stack: Vue 3 + Quasar + Pinia + Axios
 * 
 * Objetivo: Centralizar TODAS as chamadas de API em um único arquivo
 * - Elimina chamadas HTTP soltas em componentes
 * - ROUTES_MAP: todas as rotas centralizadas
 * - Helpers assíncronos para cada endpoint
 * - Tratamento uniforme de erros
 * - JSDoc completo para cada função
 */

import { api } from 'boot/axios'

// ==========================================================================
// TRATAMENTO DE ERROS
// ==========================================================================

/**
 * Trata erros de API de forma uniforme
 * @param {Error} error - Erro capturado
 * @returns {Error} Erro tratado com mensagem amigável
 */
function handleApiError(error) {
  const message = error.response?.data?.message || error.message || 'Erro desconhecido'
  const status = error.response?.status || 500
  
  const enhancedError = new Error(message)
  enhancedError.status = status
  enhancedError.originalError = error
  
  return enhancedError
}

// ==========================================================================
// 1) MAPA CENTRALIZADO DE ROTAS
// ==========================================================================

/**
 * Mapa centralizado com TODAS as rotas da API Financial Control
 * Organizado por domínio/recurso semanticamente
 */
export const FINANCIAL_ROUTES = {
  // ========== AUTENTICAÇÃO ==========
  authLogin: '/auth/login',
  authRegister: '/auth/register',
  authMe: '/auth/me',
  authLogout: '/auth/logout',
  authRefreshToken: '/auth/refresh',

  // ========== USUÁRIO - Perfil ==========
  userProfileGet: '/users/profile',
  userProfileUpdate: '/users/profile',
  userProfilePasswordChange: '/users/profile/password',
  userProfileAvatarUpload: '/users/profile/avatar',
  userProfileAvatarRemove: '/users/profile/avatar',
  userSettingsGet: '/users/settings',
  userSettingsUpdate: '/users/settings',
  userAccountDelete: '/users/account',

  // ========== TRANSAÇÕES ==========
  transactionsList: '/transactions',
  transactionsCreate: '/transactions',
  transactionsGetById: '/transactions', // + /:id
  transactionsUpdate: '/transactions', // + /:id
  transactionsDelete: '/transactions', // + /:id
  transactionsStats: '/transactions/stats',
  transactionsTimeline: '/transactions/timeline',

  // ========== PLANOS ==========
  plansList: '/plans',
  plansGetById: '/plans', // + /:id
  plansCreate: '/plans',
  plansUpdate: '/plans', // + /:id
  plansDelete: '/plans', // + /:id

  // ========== DASHBOARD ==========
  dashboardStats: '/dashboard/stats',
  dashboardCharts: '/dashboard/charts',
  dashboardRecentTransactions: '/dashboard/recent',

  // ========== ADMIN ==========
  adminUsersList: '/admin/users',
  adminUsersGetById: '/admin/users', // + /:id
  adminUsersUpdate: '/admin/users', // + /:id
  adminUsersDelete: '/admin/users', // + /:id
  adminStatistics: '/admin/statistics',
}

// ==========================================================================
// 2) HELPERS - AUTENTICAÇÃO
// ==========================================================================

/**
 * Realiza login do usuário
 * @param {Object} payload - Credenciais de login
 * @param {string} payload.email - Email do usuário
 * @param {string} payload.password - Senha do usuário
 * @param {Object} [config] - Configurações adicionais do axios
 * @returns {Promise<Object>} Dados do usuário e token
 */
export async function authLogin(payload, config = {}) {
  try {
    const { data } = await api.post(FINANCIAL_ROUTES.authLogin, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Registra novo usuário
 * @param {Object} payload - Dados do novo usuário
 * @param {string} payload.name - Nome completo
 * @param {string} payload.email - Email
 * @param {string} payload.password - Senha
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados do usuário criado
 */
export async function authRegister(payload, config = {}) {
  try {
    const { data } = await api.post(FINANCIAL_ROUTES.authRegister, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Busca dados do usuário autenticado
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados do usuário
 */
export async function authGetMe(config = {}) {
  try {
    const { data } = await api.get(FINANCIAL_ROUTES.authMe, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Realiza logout do usuário
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Confirmação de logout
 */
export async function authLogout(config = {}) {
  try {
    const { data } = await api.post(FINANCIAL_ROUTES.authLogout, {}, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

// ==========================================================================
// 3) HELPERS - PERFIL DO USUÁRIO
// ==========================================================================

/**
 * Busca perfil completo do usuário autenticado
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados completos do perfil
 */
export async function userProfileGet(config = {}) {
  try {
    const { data } = await api.get(FINANCIAL_ROUTES.userProfileGet, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Atualiza perfil do usuário
 * @param {Object} payload - Dados atualizados
 * @param {string} [payload.name] - Nome
 * @param {string} [payload.phone] - Telefone
 * @param {string} [payload.birth_date] - Data de nascimento
 * @param {string} [payload.cpf] - CPF
 * @param {string} [payload.company] - Empresa
 * @param {string} [payload.position] - Cargo
 * @param {string} [payload.bio] - Biografia
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Perfil atualizado
 */
export async function userProfileUpdate(payload, config = {}) {
  try {
    const { data } = await api.put(FINANCIAL_ROUTES.userProfileUpdate, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Altera senha do usuário
 * @param {Object} payload - Dados da senha
 * @param {string} payload.currentPassword - Senha atual
 * @param {string} payload.newPassword - Nova senha
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Confirmação da alteração
 */
export async function userProfilePasswordChange(payload, config = {}) {
  try {
    const { data } = await api.put(FINANCIAL_ROUTES.userProfilePasswordChange, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Faz upload de avatar do usuário
 * @param {FormData} formData - FormData com o arquivo de imagem
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} URL do avatar
 */
export async function userProfileAvatarUpload(formData, config = {}) {
  try {
    const { data } = await api.post(
      FINANCIAL_ROUTES.userProfileAvatarUpload,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        ...config
      }
    )
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Remove avatar do usuário
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Confirmação da remoção
 */
export async function userProfileAvatarRemove(config = {}) {
  try {
    const { data } = await api.delete(FINANCIAL_ROUTES.userProfileAvatarRemove, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Busca configurações do usuário
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Configurações do usuário
 */
export async function userSettingsGet(config = {}) {
  try {
    const { data} = await api.get(FINANCIAL_ROUTES.userSettingsGet, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Atualiza configurações do usuário
 * @param {Object} payload - Configurações atualizadas
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Configurações atualizadas
 */
export async function userSettingsUpdate(payload, config = {}) {
  try {
    const { data } = await api.put(FINANCIAL_ROUTES.userSettingsUpdate, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Deleta conta do usuário (soft delete)
 * @param {Object} payload - Confirmação
 * @param {string} payload.confirmation - Deve ser 'DELETE'
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Confirmação da exclusão
 */
export async function userAccountDelete(payload, config = {}) {
  try {
    const { data } = await api.delete(FINANCIAL_ROUTES.userAccountDelete, { data: payload, ...config })
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

// ==========================================================================
// 4) HELPERS - TRANSAÇÕES
// ==========================================================================

/**
 * Lista transações do usuário
 * @param {Object} [params] - Parâmetros de filtro
 * @param {string} [params.type] - Tipo (income|expense)
 * @param {string} [params.category] - Categoria
 * @param {string} [params.startDate] - Data inicial
 * @param {string} [params.endDate] - Data final
 * @param {number} [params.limit] - Limite de resultados
 * @param {string} [params.sort] - Ordenação (ex: 'date:desc')
 * @param {number} [params.page] - Página
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Array>} Lista de transações
 */
export async function transactionsList(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config }
    const { data } = await api.get(FINANCIAL_ROUTES.transactionsList, finalConfig)
    return data?.data || data || []
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Cria nova transação
 * @param {Object} payload - Dados da transação
 * @param {string} payload.type - Tipo (income|expense)
 * @param {number} payload.amount - Valor
 * @param {string} payload.description - Descrição
 * @param {string} [payload.category] - Categoria
 * @param {string} [payload.date] - Data
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Transação criada
 */
export async function transactionsCreate(payload, config = {}) {
  try {
    const { data } = await api.post(FINANCIAL_ROUTES.transactionsCreate, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Busca transação por ID
 * @param {string} id - ID da transação
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados da transação
 */
export async function transactionsGetById(id, config = {}) {
  try {
    const { data } = await api.get(`${FINANCIAL_ROUTES.transactionsGetById}/${id}`, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Atualiza transação existente
 * @param {string} id - ID da transação
 * @param {Object} payload - Dados atualizados
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Transação atualizada
 */
export async function transactionsUpdate(id, payload, config = {}) {
  try {
    const { data } = await api.put(`${FINANCIAL_ROUTES.transactionsUpdate}/${id}`, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Deleta transação
 * @param {string} id - ID da transação
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object|true>} Confirmação da exclusão
 */
export async function transactionsDelete(id, config = {}) {
  try {
    const { data } = await api.delete(`${FINANCIAL_ROUTES.transactionsDelete}/${id}`, config)
    return typeof data === 'undefined' ? true : data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Busca estatísticas das transações
 * @param {Object} [params] - Parâmetros de filtro
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Estatísticas (income, expense, balance)
 */
export async function transactionsStats(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config }
    const { data } = await api.get(FINANCIAL_ROUTES.transactionsStats, finalConfig)
    return data?.data || data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Busca evolução temporal das transações
 * @param {Object} [params] - Parâmetros
 * @param {string} [params.period] - Período (1month, 3months, 6months, 1year)
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Array>} Timeline por mês
 */
export async function transactionsTimeline(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config }
    const { data } = await api.get(FINANCIAL_ROUTES.transactionsTimeline, finalConfig)
    return data?.data || data || []
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

// ==========================================================================
// 5) HELPERS - PLANOS
// ==========================================================================

/**
 * Lista todos os planos disponíveis
 * @param {Object} [params] - Parâmetros de filtro
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Array>} Lista de planos
 */
export async function plansList(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config }
    const { data } = await api.get(FINANCIAL_ROUTES.plansList, finalConfig)
    return data?.data || data || []
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Busca plano por ID
 * @param {string} id - ID do plano
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados do plano
 */
export async function plansGetById(id, config = {}) {
  try {
    const { data } = await api.get(`${FINANCIAL_ROUTES.plansGetById}/${id}`, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Cria novo plano (admin)
 * @param {Object} payload - Dados do plano
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Plano criado
 */
export async function plansCreate(payload, config = {}) {
  try {
    const { data } = await api.post(FINANCIAL_ROUTES.plansCreate, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Atualiza plano existente (admin)
 * @param {string} id - ID do plano
 * @param {Object} payload - Dados atualizados
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Plano atualizado
 */
export async function plansUpdate(id, payload, config = {}) {
  try {
    const { data } = await api.put(`${FINANCIAL_ROUTES.plansUpdate}/${id}`, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Deleta plano (admin)
 * @param {string} id - ID do plano
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object|true>} Confirmação da exclusão
 */
export async function plansDelete(id, config = {}) {
  try {
    const { data } = await api.delete(`${FINANCIAL_ROUTES.plansDelete}/${id}`, config)
    return typeof data === 'undefined' ? true : data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

// ==========================================================================
// 6) HELPERS - DASHBOARD
// ==========================================================================

/**
 * Busca estatísticas do dashboard
 * @param {Object} [params] - Parâmetros de filtro
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Estatísticas do dashboard
 */
export async function dashboardStats(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config }
    const { data } = await api.get(FINANCIAL_ROUTES.dashboardStats, finalConfig)
    return data?.data || data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Busca dados dos gráficos do dashboard
 * @param {Object} [params] - Parâmetros
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados dos gráficos
 */
export async function dashboardCharts(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config }
    const { data } = await api.get(FINANCIAL_ROUTES.dashboardCharts, finalConfig)
    return data?.data || data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Busca transações recentes do dashboard
 * @param {Object} [params] - Parâmetros
 * @param {number} [params.limit] - Limite de resultados
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Array>} Transações recentes
 */
export async function dashboardRecentTransactions(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config }
    const { data } = await api.get(FINANCIAL_ROUTES.dashboardRecentTransactions, finalConfig)
    return data?.data || data || []
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

// ==========================================================================
// 7) HELPERS - ADMIN
// ==========================================================================

/**
 * Lista todos os usuários (admin)
 * @param {Object} [params] - Parâmetros de filtro
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Array>} Lista de usuários
 */
export async function adminUsersList(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config }
    const { data } = await api.get(FINANCIAL_ROUTES.adminUsersList, finalConfig)
    return data?.data || data || []
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Busca usuário por ID (admin)
 * @param {string} id - ID do usuário
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados do usuário
 */
export async function adminUsersGetById(id, config = {}) {
  try {
    const { data } = await api.get(`${FINANCIAL_ROUTES.adminUsersGetById}/${id}`, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Atualiza usuário (admin)
 * @param {string} id - ID do usuário
 * @param {Object} payload - Dados atualizados
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Usuário atualizado
 */
export async function adminUsersUpdate(id, payload, config = {}) {
  try {
    const { data } = await api.put(`${FINANCIAL_ROUTES.adminUsersUpdate}/${id}`, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Deleta usuário (admin)
 * @param {string} id - ID do usuário
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object|true>} Confirmação da exclusão
 */
export async function adminUsersDelete(id, config = {}) {
  try {
    const { data } = await api.delete(`${FINANCIAL_ROUTES.adminUsersDelete}/${id}`, config)
    return typeof data === 'undefined' ? true : data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

/**
 * Busca estatísticas gerais do sistema (admin)
 * @param {Object} [params] - Parâmetros
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Estatísticas do sistema
 */
export async function adminStatistics(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config }
    const { data } = await api.get(FINANCIAL_ROUTES.adminStatistics, finalConfig)
    return data?.data || data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

// ==========================================================================
// EXPORTAÇÕES ADICIONAIS
// ==========================================================================

/**
 * Exporta todas as funções para fácil importação
 */
export default {
  // Auth
  authLogin,
  authRegister,
  authGetMe,
  authLogout,
  
  // User Profile
  userProfileGet,
  userProfileUpdate,
  userProfilePasswordChange,
  userProfileAvatarUpload,
  userProfileAvatarRemove,
  userSettingsGet,
  userSettingsUpdate,
  userAccountDelete,
  
  // Transactions
  transactionsList,
  transactionsCreate,
  transactionsGetById,
  transactionsUpdate,
  transactionsDelete,
  transactionsStats,
  transactionsTimeline,
  
  // Plans
  plansList,
  plansGetById,
  plansCreate,
  plansUpdate,
  plansDelete,
  
  // Dashboard
  dashboardStats,
  dashboardCharts,
  dashboardRecentTransactions,
  
  // Admin
  adminUsersList,
  adminUsersGetById,
  adminUsersUpdate,
  adminUsersDelete,
  adminStatistics,
  
  // Routes Map
  FINANCIAL_ROUTES,
}
