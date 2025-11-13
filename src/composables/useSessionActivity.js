/**
 * ====================================================
 * useSessionActivity - Composable de Gerenciamento de Sessão
 * ====================================================
 * 
 * Propósito: Gerenciar timeout de sessão baseado em:
 * 1. Atividade do usuário (movimentos, cliques, teclas)
 * 2. Expiração do token JWT (40 minutos)
 * 
 * Funcionalidades:
 * - Contagem regressiva de atividade (reseta com interação)
 * - Contagem regressiva do token JWT
 * - Dialog automático antes da sessão expirar
 * - Renovação de token via refresh
 */

import { ref, computed } from 'vue'

const isBrowser = typeof window !== 'undefined'
const INTERVAL_MS = 1000 // 1 segundo

// ===== CONFIGURAÇÕES =====
const ACTIVITY_TIMEOUT_SECONDS = 40 * 60 // 40 minutos de atividade
const TOKEN_EXPIRY_SECONDS = 30 * 60 // 30 minutos de sessão (token)

// Para testes rápidos (descomentar):
// const ACTIVITY_TIMEOUT_SECONDS = 60 // 1 minuto
// const TOKEN_EXPIRY_SECONDS = 60 // 1 minuto

// ===== ESTADO =====
const activityRemaining = ref(ACTIVITY_TIMEOUT_SECONDS)
const tokenRemaining = ref(TOKEN_EXPIRY_SECONDS)
let tokenExpiresAtMs = null

// ===== TIMERS =====
let started = false
let activityTick = null
let tokenTick = null
let listenersBound = false

// ===== EVENTOS PARA DETECTAR ATIVIDADE =====
const ACTIVITY_EVENTS = [
  'keydown',
  'scroll',
  'touchstart',
  'click',
  'mousemove'
]

/**
 * Formata segundos em formato legível
 * @param {number} seconds 
 * @returns {string} Ex: "5min 30s" ou "45s"
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins > 0) {
    return `${mins}min ${secs}s`
  }
  return `${secs}s`
}

/**
 * Formata tempo em hh:mm:ss
 * @param {number} seconds 
 * @returns {string} Ex: "00:05:30"
 */
function formatTimeHMS(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Reseta contador de atividade
 * @param {number} seconds - Opcional, padrão é ACTIVITY_TIMEOUT_SECONDS
 */
function resetActivity(seconds = ACTIVITY_TIMEOUT_SECONDS) {
  activityRemaining.value = seconds
  
}

/**
 * Handler para eventos de atividade do usuário
 */
function activityHandler() {
  resetActivity()
}

/**
 * Handler para mudança de visibilidade da página
 */
function visibilityHandler() {
  // Apenas continuar contagem quando página voltar a ficar visível
  // O loop já verifica document.hidden
}

/**
 * Inicia contagem regressiva do token JWT
 */
function startTokenCountdown() {
  if (tokenTick) {
    clearInterval(tokenTick)
  }
  
  // Define quando o token vai expirar: prioriza exp do JWT se existir
  try {
    const key = 'auth_token'
    const token = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem(key) : null
    if (token && token.split('.').length === 3) {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const payloadJson = atob(base64)
      const payload = JSON.parse(payloadJson)
      if (payload && payload.exp) {
        tokenExpiresAtMs = payload.exp * 1000
      } else {
        tokenExpiresAtMs = Date.now() + (TOKEN_EXPIRY_SECONDS * 1000)
      }
    } else {
      tokenExpiresAtMs = Date.now() + (TOKEN_EXPIRY_SECONDS * 1000)
    }
  } catch (_) {
    tokenExpiresAtMs = Date.now() + (TOKEN_EXPIRY_SECONDS * 1000)
  }
  
  
  if (isBrowser) {
    tokenTick = setInterval(() => {
      // Pausa se página está oculta
      if (document?.hidden) return
      
      const now = Date.now()
      const secondsLeft = Math.max(0, Math.floor((tokenExpiresAtMs - now) / 1000))
      tokenRemaining.value = secondsLeft
      
      // Para quando expirar
      if (secondsLeft <= 0) {
        stopTokenCountdown()
      }
    }, INTERVAL_MS)
    
    // Define valor inicial após microtask (evita disparo imediato do watcher)
    setTimeout(() => {
      const now = Date.now()
      tokenRemaining.value = Math.max(0, Math.floor((tokenExpiresAtMs - now) / 1000))
    }, 0)
  }
}

/**
 * Reseta o token (chamado após refresh bem-sucedido)
 */
function resetToken() {
  
  startTokenCountdown()
}

/**
 * Para contagem do token
 */
function stopTokenCountdown() {
  if (tokenTick) {
    clearInterval(tokenTick)
    tokenTick = null
    
  }
}

/**
 * Inicia o sistema de monitoramento de sessão
 */
function start() {
  if (started) return
  started = true
  
  
  // Inicia contagem de atividade
  if (isBrowser && !activityTick) {
    activityTick = setInterval(() => {
      // Pausa se página está oculta
      if (document?.hidden) return
      
      if (activityRemaining.value > 0) {
        activityRemaining.value -= 1
      }
    }, INTERVAL_MS)
  }
  
  // Bind listeners de atividade
  bindListeners()
}

/**
 * Para todo o sistema
 */
function stop() {
  if (activityTick) {
    clearInterval(activityTick)
    activityTick = null
  }
  
  stopTokenCountdown()
  unbindListeners()
  
  started = false
  
}

/**
 * Pausa apenas a contagem (mantém listeners)
 */
function pause() {
  if (activityTick) {
    clearInterval(activityTick)
    activityTick = null
  }
  
}

/**
 * Resume a contagem
 */
function resume() {
  if (!activityTick && isBrowser) {
    activityTick = setInterval(() => {
      if (document?.hidden) return
      if (activityRemaining.value > 0) {
        activityRemaining.value -= 1
      }
    }, INTERVAL_MS)
    
  }
}

/**
 * Registra listeners de atividade
 */
function bindListeners() {
  if (!isBrowser || listenersBound) return
  
  ACTIVITY_EVENTS.forEach((event) => {
    window.addEventListener(event, activityHandler, { passive: true })
  })
  
  document.addEventListener('visibilitychange', visibilityHandler)
  
  listenersBound = true
  
}

/**
 * Remove listeners de atividade
 */
function unbindListeners() {
  if (!isBrowser || !listenersBound) return
  
  ACTIVITY_EVENTS.forEach((event) => {
    window.removeEventListener(event, activityHandler)
  })
  
  document.removeEventListener('visibilitychange', visibilityHandler)
  
  listenersBound = false
  
}

/**
 * Hook principal para usar em componentes
 */
export function useSessionActivity() {
  // Garante que o sistema foi iniciado
  start()
  
  // Computed properties para exibição
  const activityRemainingFormatted = computed(() => formatTime(activityRemaining.value))
  const activityRemainingHMS = computed(() => formatTimeHMS(activityRemaining.value))
  const tokenRemainingFormatted = computed(() => formatTime(tokenRemaining.value))
  const tokenRemainingHMS = computed(() => formatTimeHMS(tokenRemaining.value))
  
  return {
    // Estado
    activityRemaining,
    tokenRemaining,
    
    // Formatado
    activityRemainingFormatted,
    activityRemainingHMS,
    tokenRemainingFormatted,
    tokenRemainingHMS,
    
    // Controles de atividade
    resetActivity,
    
    // Controles de token
    startTokenCountdown,
    resetToken,
    stopTokenCountdown,
    
    // Controles gerais
    start,
    stop,
    pause,
    resume,
    
    // Utilidades
    formatTime,
    formatTimeHMS,
    
    // Constantes
    ACTIVITY_TIMEOUT_SECONDS,
    TOKEN_EXPIRY_SECONDS
  }
}
