// ==========================================================================
// COMPOSABLE - NOTIFICATIONS
// ==========================================================================
// Propósito: Composable para notificações usando Quasar Notify
// Origem: Qualquer componente que precise mostrar feedback
// Efeitos: Notificações consistentes em toda a aplicação

import { useQuasar } from 'quasar'

/**
 * Composable para gerenciar notificações de forma consistente
 * Abstrai a API do Quasar Notify com configurações padronizadas
 */
export function useNotifications() {
  const $q = useQuasar()

  /**
   * Exibe notificação de sucesso
   */
  const notifySuccess = (message, options = {}) => {
    $q.notify({
      type: 'positive',
      message: message,
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
    
    console.log('✅ [NOTIFICATION] Sucesso:', message)
  }

  /**
   * Exibe notificação de erro
   */
  const notifyError = (message, options = {}) => {
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
    
    console.log('❌ [NOTIFICATION] Erro:', message)
  }

  /**
   * Exibe notificação de aviso
   */
  const notifyWarning = (message, options = {}) => {
    $q.notify({
      type: 'warning',
      message: message,
      color: 'orange-6',
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
    
    console.log('⚠️ [NOTIFICATION] Aviso:', message)
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
    
    console.log('ℹ️ [NOTIFICATION] Info:', message)
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