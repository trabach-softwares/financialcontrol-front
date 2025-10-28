// ==========================================================================
// API UTILS - UTILITÁRIOS PARA TRATAMENTO DE API
// ==========================================================================
// Propósito: Centralizar lógica de tratamento de erros, interceptors e helpers
// Padrão: Seguindo arquitetura de APIs centralizadas com ROUTES_MAP
// Uso: Importar em arquivos de API (apis/*)

/**
 * Trata erros de API de forma uniforme
 * @param {Error} error - Erro capturado do axios
 * @param {Object} options - Opções de tratamento
 * @param {string} options.uiMessageOverride - Mensagem customizada para usuário
 * @param {boolean} options.suppressUiError - Suprimir notificação de erro
 * @returns {Error} - Erro processado
 */
export function handleApiError(error, options = {}) {
  const { uiMessageOverride, suppressUiError = false } = options

  // Estrutura padronizada do erro
  const errorData = {
    message: error.message || 'Erro desconhecido',
    status: error.response?.status,
    data: error.response?.data,
    originalError: error
  }

  // Se tem resposta da API com estrutura padrão
  if (error.response?.data?.message) {
    errorData.message = error.response.data.message
  } else if (error.response?.data) {
    errorData.message = `Erro na API: ${error.response.status}`
  }

  // Aplicar mensagem customizada se fornecida
  if (uiMessageOverride) {
    errorData.message = uiMessageOverride
  }

  // Log detalhado do erro
  console.error('❌ [API Error]', {
    status: errorData.status,
    message: errorData.message,
    url: error.config?.url,
    method: error.config?.method,
    data: errorData.data
  })

  // Criar erro com informações estruturadas
  const processedError = new Error(errorData.message)
  processedError.status = errorData.status
  processedError.data = errorData.data
  processedError.suppressUiError = suppressUiError

  return processedError
}

/**
 * Instala interceptors personalizados em uma instância do axios
 * @param {AxiosInstance} axiosInstance - Instância do axios
 * @param {Object} options - Opções de configuração
 */
export function installInterceptors(axiosInstance, options = {}) {
  // Request interceptor já está configurado em boot/axios.js
  // Response interceptor já está configurado em boot/axios.js
  
  // Esta função pode ser usada para interceptors adicionais específicos
  // de cada API se necessário
  
  console.log('🔧 Interceptors instalados na instância da API')
}

/**
 * Normaliza resposta da API para padrão consistente
 * @param {Object} response - Resposta do axios
 * @returns {Object} - Resposta normalizada
 */
export function normalizeApiResponse(response) {
  // Verificar estrutura padrão { success, data, message }
  if (response.data && typeof response.data === 'object') {
    if (response.data.success !== undefined) {
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
        status: response.status
      }
    }
  }
  
  // Fallback para resposta direta
  return {
    success: true,
    data: response.data,
    message: null,
    status: response.status
  }
}

/**
 * Constrói query string a partir de objeto de parâmetros
 * @param {Object} params - Objeto com parâmetros
 * @returns {string} - Query string formatada
 */
export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Valida estrutura de resposta da API
 * @param {Object} response - Resposta da API
 * @param {string} context - Contexto da validação
 * @throws {Error} - Se estrutura for inválida
 */
export function validateApiResponse(response, context = 'API') {
  if (!response || typeof response !== 'object') {
    throw new Error(`[${context}] Resposta inválida da API`)
  }
  
  if (response.success === false) {
    throw new Error(response.message || `[${context}] Operação falhou`)
  }
  
  return true
}
