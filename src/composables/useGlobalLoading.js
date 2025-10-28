/**
 * Composable para gerenciar Loading Global
 * Controla overlay de loading durante chamadas de API
 */

import { ref } from 'vue'

// Estado global compartilhado entre todas as instâncias
const isLoading = ref(false)
const loadingMessage = ref('Carregando...')
const pendingRequests = ref(0)
const minShowTime = 300 // ms mínimo para exibir loading

let loadingStartTime = 0

export function useGlobalLoading() {
  /**
   * Inicia o loading
   */
  const startLoading = (message = 'Carregando...') => {
    pendingRequests.value++
    
    if (pendingRequests.value === 1) {
      loadingMessage.value = message
      loadingStartTime = Date.now()
      isLoading.value = true
    }
  }

  /**
   * Para o loading (com tempo mínimo de exibição)
   */
  const stopLoading = () => {
    if (pendingRequests.value > 0) {
      pendingRequests.value--
    }

    if (pendingRequests.value === 0) {
      const elapsed = Date.now() - loadingStartTime
      const remaining = minShowTime - elapsed

      if (remaining > 0) {
        setTimeout(() => {
          isLoading.value = false
        }, remaining)
      } else {
        isLoading.value = false
      }
    }
  }

  /**
   * Atualiza mensagem do loading
   */
  const setLoadingMessage = (message) => {
    loadingMessage.value = message
  }

  /**
   * Força parada do loading (emergência)
   */
  const forceStopLoading = () => {
    pendingRequests.value = 0
    isLoading.value = false
  }

  return {
    isLoading,
    loadingMessage,
    pendingRequests,
    startLoading,
    stopLoading,
    setLoadingMessage,
    forceStopLoading
  }
}
