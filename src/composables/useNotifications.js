// ==========================================================================
// COMPOSABLE - NOTIFICATIONS
// ==========================================================================
// Propósito: Composable para notificações usando Quasar Notify
// Origem: Qualquer componente que precise mostrar feedback
// Efeitos: Notificações consistentes em toda a aplicação

import { useQuasar } from 'quasar'
import { getErrorMessage } from 'src/constants/messages'
import MESSAGES from 'src/constants/messages'

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV === true
const shouldLog = isDev && String(import.meta.env?.VITE_LOG_NOTIFICATIONS) === 'true'

/**
 * Composable para gerenciar notificações de forma consistente
 * Abstrai a API do Quasar Notify com configurações padronizadas
 */
export function useNotifications() {
  const $q = useQuasar()

  /**
   * Exibe notificação de sucesso
   * @param {string|object} message - Mensagem de sucesso ou chave do objeto MESSAGES.SUCCESS
   * @param {object} options - Opções adicionais para o Quasar Notify
   */
  const notifySuccess = (message, options = {}) => {
    // Se for uma chave do objeto MESSAGES.SUCCESS
    const messageText = typeof message === 'string' && message.startsWith('SUCCESS.')
      ? message.split('.').reduce((obj, key) => obj?.[key], MESSAGES) || message
      : message

    $q.notify({
      type: 'positive',
      message: messageText,
      color: 'green-6',
      icon: 'check_circle',
      position: 'top',
      timeout: 3000,
      actions: [
        { 
          icon: 'close', 
          color: 'white', 
          round: true, 
          handler: () => {} 
        }
      ],
      ...options
    })
    
    if (shouldLog) console.log(' [NOTIFICATION] Sucesso:', messageText)
  }

  /**
   * Exibe notificação de erro
   * @param {Error|string|object} error - Objeto de erro, mensagem ou chave do objeto MESSAGES.ERROR
   * @param {object} options - Opções adicionais para o Quasar Notify
   */
  const notifyError = (error, options = {}) => {
    // Se for uma chave do objeto MESSAGES.ERROR
    let message = ''
    
    if (typeof error === 'string' && error.startsWith('ERROR.')) {
      // Tenta encontrar a mensagem no objeto MESSAGES
      const messagePath = error.split('.').slice(1) // Remove o 'ERROR.' do início
      message = messagePath.reduce((obj, key) => obj?.[key], MESSAGES.ERROR) || error
    } else {
      // Usa a função getErrorMessage para processar o erro
      message = getErrorMessage(error)
    }

    $q.notify({
      type: 'negative',
      message: message,
      color: 'red-6',
      icon: 'error',
      position: 'top',
      timeout: 5000,
      actions: [
        { 
          icon: 'close', 
          color: 'white', 
          round: true, 
          handler: () => {} 
        }
      ],
      ...options
    })
    
    if (shouldLog) console.error(' [NOTIFICATION] Erro:', message)
  }

  /**
   * Exibe notificação de aviso
   * @param {string|object} message - Mensagem de aviso ou chave do objeto MESSAGES.WARNING
   * @param {object} options - Opções adicionais para o Quasar Notify
   */
  const notifyWarning = (message, options = {}) => {
    $q.notify({
      type: 'warning',
      message: typeof message === 'string' && message.startsWith('WARNING.') 
        ? message.split('.').reduce((obj, key) => obj?.[key], MESSAGES) || message 
        : message,
      color: 'orange',
      icon: 'warning',
      position: 'top',
      timeout: 4000,
      actions: [
        { 
          icon: 'close', 
          color: 'white', 
          round: true, 
          handler: () => {} 
        }
      ],
      ...options
    })
    
    if (shouldLog) console.log('⚠️ [NOTIFICATION] Aviso:', message)
  }

  /**
   * Exibe notificação informativa
   */
  const notifyInfo = (message, options = {}) => {
    $q.notify({
      type: 'info',
      message: message,
      color: 'blue-6',
      icon: 'info',
      position: 'top',
      timeout: 3000,
      actions: [
        { 
          icon: 'close', 
          color: 'white', 
          round: true, 
          handler: () => {} 
        }
      ],
      ...options
    })
    
    if (shouldLog) console.log('ℹ️ [NOTIFICATION] Info:', message)
  }

  /**
   * Exibe notificação de loading
   */
  const notifyLoading = (message, options = {}) => {
    return $q.notify({
      type: 'ongoing',
      message: message,
      color: 'blue-grey-6',
      icon: 'hourglass_empty',
      position: 'top',
      timeout: 0, // Não remove automaticamente
      spinner: true,
      ...options
    })
  }

  /**
   * Exibe notificação personalizada
   */
  const notify = (config) => {
    $q.notify(config)
  }

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyLoading,
    notify
  }
}