// ==========================================================================
// API RESPONSE HANDLER - UTILITÁRIO PARA RESPOSTAS PADRONIZADAS
// ==========================================================================
// Propósito: Centralizar tratamento de respostas da API conforme documentação
// Estrutura: { success: boolean, data: any, message: string }
// Efeitos: Validação consistente e extração dos dados corretos

/**
 * Processa resposta da API conforme estrutura padronizada
 * @param {Object} response - Resposta do axios
 * @param {string} context - Contexto para logs (ex: 'login', 'transactions')
 * @returns {any} - Dados extraídos do campo 'data' da resposta
 * @throws {Error} - Se success for false ou estrutura inválida
 */
export function handleApiResponse(response, context = 'API') {

  // Verificar se é erro de recursão infinita
  if (response.data && typeof response.data === 'string' && 
      response.data.includes('infinite recursion detected')) {
    console.error(`🔥 [${context.toUpperCase()}] ERRO DE RECURSÃO INFINITA DETECTADO!`)
    throw new Error(`Erro de recursão infinita na política RLS: ${context}`)
  }
  
  // Validar se tem a estrutura padrão
  if (typeof response.data !== 'object' || response.data === null) {
    console.error(`❌ [${context.toUpperCase()}] Estrutura inválida:`, typeof response.data)
    throw new Error(`Resposta inválida da API: ${context}`)
  }
  
  const { success, data, message } = response.data
  
  // Validar flag de sucesso
  if (success !== true) {
    const errorMessage = message || `Erro na operação: ${context}`
    console.error(`❌ [${context.toUpperCase()}] API retornou erro:`, errorMessage)
    throw new Error(errorMessage)
  }
  
  // Validar se tem dados
  if (data === undefined) {
    console.warn(`⚠️ [${context.toUpperCase()}] Resposta sem campo 'data'`)
    return null
  }
  return data
}

/**
 * Processa erro de resposta da API
 * @param {Error} error - Erro do axios
 * @param {string} context - Contexto para logs
 * @returns {Error} - Erro processado com mensagem adequada
 */
export function handleApiError(error, context = 'API') {
  console.error(`❌ [${context.toUpperCase()}] Erro na API:`, error)
  
  // Se tem resposta da API com estrutura padrão
  if (error.response?.data?.message) {
    return new Error(error.response.data.message)
  }
  
  // Se tem resposta mas sem estrutura padrão
  if (error.response?.data) {
    return new Error(`Erro na API: ${error.response.status}`)
  }
  
  // Erro de rede ou outro
  return new Error(error.message || `Erro de comunicação: ${context}`)
}