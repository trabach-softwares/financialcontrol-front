// ==========================================================================
// AXIOS BOOT FILE - CONFIGURAÇÃO CENTRALIZADA DA API
// ==========================================================================
// Propósito: Configurar instância global do Axios com interceptors JWT
// Origem: Boot file do Quasar Framework
// Destino: Disponibilizar $api globalmente em todos os componentes Vue
// Efeitos: Intercepta requests/responses para injetar token e tratar erros

import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify, LocalStorage } from 'quasar'
import { useGlobalLoading } from 'src/composables/useGlobalLoading'

// Instanciar loading global
const { startLoading, stopLoading } = useGlobalLoading()

// ==========================================================================
// CONFIGURAÇÃO DA INSTÂNCIA AXIOS
// ==========================================================================

/**
 * Instância principal do Axios para comunicação com a API
 * Base URL: http://localhost:3000/api (configurada via env)
 */

// Configuração de URL base com fallbacks
const getBaseURL = () => {
  // Sempre usar a VITE_API_BASE_URL se estiver definida
  if (process.env.VITE_API_BASE_URL) {
    return process.env.VITE_API_BASE_URL
  }
  
  // Fallback para desenvolvimento (caso não tenha VITE_API_BASE_URL)
  if (process.env.NODE_ENV === 'development') {
    return '/api'
  }
  
  // Em produção, verificar se VITE_API_BASE_URL está definida
  if (process.env.VITE_API_BASE_URL) {
    return process.env.VITE_API_BASE_URL
  }
  
  // Fallback temporário para produção específica
  if (typeof window !== 'undefined' && window.location?.hostname === 'app.financialcontrol.com.br') {
    const fallbackURL = 'https://api.financialcontrol.com.br/api'
    return fallbackURL
  }
  
  // Fallback de emergência - erro se chegar aqui
  throw new Error('API Base URL não configurada. Configure VITE_API_BASE_URL nas environment variables do Render.')
}

const baseURL = getBaseURL()

const api = axios.create({ 
  baseURL,
  timeout: parseInt(process.env.VITE_API_TIMEOUT) || 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ==========================================================================
// INTERCEPTOR DE REQUEST - INJEÇÃO AUTOMÁTICA DO TOKEN JWT
// ==========================================================================

/**
 * Interceptor que adiciona automaticamente o token JWT no header Authorization
 * Origem: LocalStorage do browser (chave 'auth_token')
 * Destino: Header Authorization de todas as requisições
 * Efeito: Autenticação automática em rotas protegidas
 */
api.interceptors.request.use(
  (config) => {
    // Iniciar loading global
    startLoading('Carregando...')
    
    // Buscar token do localStorage
    const tokenKey = process.env.VITE_TOKEN_STORAGE_KEY || 'auth_token'
    const token = LocalStorage.getItem(tokenKey)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    // Parar loading em caso de erro
    stopLoading()
    return Promise.reject(error)
  }
)

// ==========================================================================
// INTERCEPTOR DE RESPONSE - TRATAMENTO GLOBAL DE ERROS
// ==========================================================================

/**
 * Interceptor que trata respostas da API e erros globalmente
 * Origem: Responses da API REST
 * Destino: Notificações para o usuário + logs console
 * Efeitos: Logout automático em 401, notificações de erro, logs detalhados
 */
api.interceptors.response.use(
  (response) => {
    // Parar loading após resposta bem-sucedida
    stopLoading()
    
    return response
  },
  (error) => {
    // Parar loading em caso de erro
    stopLoading()
    // Verificar se é erro de recursão infinita
    const errorMessage = error.message || error.response?.data?.message || ''
    if (errorMessage.includes('infinite recursion detected') || 
        errorMessage.includes('recursão infinita detectada')) {
      Notify.create({
        type: 'negative',
        message: 'Erro de configuração no servidor. Contate o administrador.',
        position: 'top',
        timeout: 8000,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => {} }
        ]
      })
    }

    // Tratamento específico por código de status
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401: {
          // Token expirado ou inválido - fazer logout
          const tokenKey = process.env.VITE_TOKEN_STORAGE_KEY || 'auth_token'
          LocalStorage.remove(tokenKey)
          LocalStorage.remove('auth_user')

          // Notificar usuário
          Notify.create({
            type: 'negative',
            message: 'Sessão expirada. Faça login novamente.',
            position: 'top',
            timeout: 5000
          })

          // Redirecionar para login se não estiver já lá
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        }
        case 403:
          Notify.create({
            type: 'negative',
            message: 'Acesso negado. Você não tem permissão para esta ação.',
            position: 'top',
            timeout: 4000
          })
          break
        case 404:
          Notify.create({
            type: 'negative',
            message: 'Recurso não encontrado.',
            position: 'top',
            timeout: 3000
          })
          break
        case 422: {
          // Erro de validação - mostrar erros específicos
          const validationErrors = data.errors || data.message
          Notify.create({
            type: 'negative',
            message: `Erro de validação: ${validationErrors}`,
            position: 'top',
            timeout: 5000
          })
          break
        }
        case 500:
          Notify.create({
            type: 'negative',
            message: 'Erro interno do servidor. Tente novamente mais tarde.',
            position: 'top',
            timeout: 5000
          })
          break
        default: {
          // Erro genérico
          const genericMessage = data?.message || 'Erro na comunicação com o servidor'
          Notify.create({
            type: 'negative',
            message: genericMessage,
            position: 'top',
            timeout: 4000
          })
        }
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout específico
      Notify.create({
        type: 'negative',
        message: 'Tempo limite excedido. Tente novamente.',
        position: 'top',
        timeout: 5000
      })
    } else if (error.code === 'ERR_NETWORK') {
      // Erro de rede - API possivelmente offline
      Notify.create({
        type: 'negative',
        message: 'Servidor indisponível. Verifique se a API está rodando.',
        position: 'top',
        timeout: 6000
      })
    } else {
      // Outros erros de rede
      Notify.create({
        type: 'negative',
        message: 'Erro de conexão. Verifique sua internet e tente novamente.',
        position: 'top',
        timeout: 5000
      })
    }

    return Promise.reject(error)
  }
)

// ==========================================================================
// BOOT FUNCTION - DISPONIBILIZAÇÃO GLOBAL
// ==========================================================================

/**
 * Função de boot do Quasar que disponibiliza a instância do Axios globalmente
 * Propósito: Tornar $api acessível em todos os componentes Vue via this.$api
 * Efeito: Permite uso de this.$api.get(), this.$api.post(), etc. nos componentes
 */
export default boot(({ app }) => {
  // Disponibilizar globalmente como $api
  app.config.globalProperties.$api = api
})

// ==========================================================================
// EXPORT PARA USO DIRETO
// ==========================================================================

/**
 * Export da instância para uso direto via import
 * Uso: import { api } from 'boot/axios'
 */
export { api }