<template>
  <span style="display:none" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { Dialog, Notify } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { authService } from 'src/services/authService'
import { useSessionActivity } from 'src/composables/useSessionActivity'
import { useRouter } from 'vue-router'
import { authGetMe } from 'src/apis/api-financial.js'

// ==========================================================================
// CONFIGURAÇÕES
// ==========================================================================

// const LOGOUT_MARGIN_SECONDS = 10  // Logout quando restar 10s
// const DIALOG_COUNTDOWN_SECONDS = 120  // Dialog ~2min
// const WARNING_MARGIN_SECONDS = 60  // Avisar quando restar 1 min

// Para testes (descomentar):
const LOGOUT_MARGIN_SECONDS = 5
const DIALOG_COUNTDOWN_SECONDS = 10
const WARNING_MARGIN_SECONDS = 15

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================

const authStore = useAuthStore()
const router = useRouter()
const { 
  activityRemaining, 
  tokenRemaining, 
  formatTime, 
  startTokenCountdown, 
  resetToken, 
  stopTokenCountdown,
  resetActivity
} = useSessionActivity()

// ==========================================================================
// ESTADO
// ==========================================================================

let expiryTimer = null
let warningTimer = null
let countdownInterval = null
let currentDialog = null
let warningTriggered = false
let tokenStartTime = 0
let logoutInProgress = false

// ==========================================================================
// FUNÇÕES AUXILIARES
// ==========================================================================

/**
 * Limpa todos os timers
 */
function clearAllTimers() {
  if (expiryTimer) {
    clearTimeout(expiryTimer)
    expiryTimer = null
  }
  if (warningTimer) {
    clearTimeout(warningTimer)
    warningTimer = null
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

/**
 * Tenta focar de forma segura no body
 */
function focusSafe() {
  try {
    const body = document.body
    if (body) {
      const hadTabindex = body.hasAttribute('tabindex')
      if (!hadTabindex) body.setAttribute('tabindex', '-1')
      body.focus({ preventScroll: true })
      if (!hadTabindex) body.removeAttribute('tabindex')
    }
  } catch (error) {
    // Silently fail
  }
}

/**
 * Faz logout e redireciona
 */
function performLogout() {
  if (logoutInProgress) return
  
  logoutInProgress = true
  clearAllTimers()
  
  
  // Fechar dialog se aberto
  try {
    currentDialog?.hide()
  } catch (error) {
    // Ignore
  }
  
  authStore.logout()
  
  // Redirecionar para login
  router.replace('/login').catch(() => {
    window.location.href = '/login'
  }).finally(() => {
    setTimeout(() => {
      logoutInProgress = false
    }, 1000)
  })
  
  Notify.create({
    type: 'warning',
    message: 'Sessão expirada. Faça login novamente.',
    position: 'top',
    timeout: 5000
  })
}

/**
 * Renova o token via API
 */
async function refreshToken() {
  try {
    // Chama a rota dedicada de refresh
    const data = await authService.refresh()

    if (data && data.token) {
      // Persistir novo token e (opcional) usuário
      sessionStorage.setItem('auth_token', data.token)
      if (data.user) {
        sessionStorage.setItem('auth_user', JSON.stringify(data.user))
      }

      // Atualizar store reativo
      authStore.token = data.token
      if (data.user) authStore.user = data.user

      // Resetar contadores
      resetToken()
      resetActivity()

      Notify.create({
        type: 'positive',
        message: 'Sessão estendida com sucesso!',
        position: 'bottom',
        timeout: 2000
      })

      return true
    }

    return false
  } catch (error) {
    // Falha ao renovar
    return false
  }
}

/**
 * Mostra dialog para estender sessão
 */
async function showExtendDialog() {
  // Parar contagem temporariamente
  stopTokenCountdown()
  
  // Fechar dialog anterior se existir
  try {
    currentDialog?.hide()
  } catch (error) {
    // Ignore
  }
  
  clearAllTimers()
  
  let remaining = DIALOG_COUNTDOWN_SECONDS
  focusSafe()
  
  // Criar dialog
  const dialog = Dialog.create({
    title: '⏱️ Sessão Expirando',
    message: `Sua sessão irá expirar em ${formatTime(remaining)}. Deseja estender?`,
    ok: {
      label: 'Estender Sessão',
      color: 'primary',
      autofocus: true,
      push: true,
      icon: 'refresh'
    },
    cancel: {
      label: 'Sair',
      color: 'negative',
      push: true,
      icon: 'logout'
    },
    persistent: true,
    class: 'session-dialog',
    html: true
  })
  
  currentDialog = dialog
  
  // Atualizar mensagem a cada segundo
  countdownInterval = setInterval(() => {
    remaining -= 1
    
    if (remaining <= 0) {
      clearInterval(countdownInterval)
      countdownInterval = null
      
      try {
        dialog.hide()
      } catch (error) {
        // Ignore
      }
      
      currentDialog = null
      performLogout()
    } else {
      dialog.update({
        message: `Sua sessão irá expirar em ${formatTime(remaining)}. Deseja estender?`
      })
    }
  }, 1000)
  
  // Aguardar resposta do usuário
  try {
    await new Promise((resolve, reject) => {
      dialog.onOk(() => resolve()).onDismiss(() => reject())
    })
    
    // Usuário clicou em "Estender"
    clearAllTimers()
    
    const success = await refreshToken()
    
    if (success) {
      // Sucesso - reiniciar contagem
      startTokenCountdown()
    } else {
      // Falhou - fazer logout
      Notify.create({
        type: 'negative',
        message: 'Não foi possível estender a sessão.',
        position: 'bottom',
        timeout: 3000
      })
      performLogout()
    }
  } catch (error) {
    // Usuário clicou em "Sair" ou fechou o dialog
    clearAllTimers()
    performLogout()
  }
  
  currentDialog = null
}

/**
 * Trata mudança no tokenRemaining
 */
function handleTokenChange() {
  // Só age se autenticado
  if (!authStore.isAuthenticated) {
    clearAllTimers()
    return
  }
  
  const secondsLeft = tokenRemaining.value
  
  // Proteção nos primeiros 3 segundos
  const elapsedSinceStart = Date.now() - tokenStartTime
  if (elapsedSinceStart < 3000) {
    return
  }
  
  // Reset flag quando token é renovado
  if (secondsLeft > WARNING_MARGIN_SECONDS) {
    warningTriggered = false
  }
  
  // Limpar timer anterior
  if (expiryTimer) {
    clearTimeout(expiryTimer)
    expiryTimer = null
  }
  
  // Agendar logout
  const msLogout = Math.max((secondsLeft - LOGOUT_MARGIN_SECONDS) * 1000, 0)
  expiryTimer = setTimeout(() => {
    try {
      currentDialog?.hide()
    } catch (error) {
      // Ignore
    }
    performLogout()
  }, msLogout)
  
  // Disparar aviso/ação em 1 minuto
  if (secondsLeft <= WARNING_MARGIN_SECONDS && secondsLeft > 0 && !warningTriggered) {
    warningTriggered = true
    handleWarning()
  }
}

/**
 * Trata aviso de sessão expirando
 */
async function handleWarning() {
  // Se há atividade recente, renovar automaticamente
  if (activityRemaining.value > 0) {
    
    
    const success = await refreshToken()
    
    if (success) {
      return // Sucesso - não precisa mostrar dialog
    }
    
    // Se falhou, continua para mostrar dialog
  }
  
  // Sem atividade ou falhou - mostrar dialog
  await showExtendDialog()
}

// ==========================================================================
// LIFECYCLE
// ==========================================================================

onMounted(() => {
  
  // Iniciar contagem se autenticado
  if (authStore.isAuthenticated) {
    tokenStartTime = Date.now()
    startTokenCountdown()
  }
  
  // Observar mudanças no estado de autenticação
  watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth) {
      tokenStartTime = Date.now()
      startTokenCountdown()
      
    } else {
      warningTriggered = false
      stopTokenCountdown()
      clearAllTimers()
      
    }
  })
  
  // Observar tokenRemaining
  watch(tokenRemaining, handleTokenChange, { immediate: false })
})

onBeforeUnmount(() => {
  
  clearAllTimers()
  
  try {
    currentDialog?.hide()
  } catch (error) {
    // Ignore
  }
  
  currentDialog = null
})
</script>

<style lang="scss" scoped>
/* Estilos inline no dialog via class */
:deep(.session-dialog) {
  .q-card {
    min-width: 400px;
    max-width: 500px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    border-radius: 12px;
  }
  
  .q-dialog__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--q-primary);
  }
  
  .q-dialog__message {
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .q-btn {
    min-width: 120px;
    font-weight: 500;
  }
}

/* Backdrop blur */
:deep(.q-dialog__backdrop) {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
