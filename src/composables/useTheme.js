// ==========================================================================
// USE THEME COMPOSABLE - SAGE ACCOUNTANT
// ==========================================================================
// Propósito: Gerenciar temas Light/Dark/Auto com paleta Sage Accountant
// Features: Auto-detecção, persistência localStorage, WCAG AA compliance
// ==========================================================================

import { ref, watch, computed, onMounted } from 'vue'
import { Dark } from 'quasar'

// Estado global do tema (compartilhado entre componentes)
const currentTheme = ref('auto') // 'light' | 'dark' | 'auto'
const systemPrefersDark = ref(false)

export function useTheme() {
  // ==========================================================================
  // COMPUTED PROPERTIES
  // ==========================================================================
  
  /**
   * Tema efetivo aplicado (resolve 'auto' para light ou dark)
   */
  const effectiveTheme = computed(() => {
    if (currentTheme.value === 'auto') {
      return systemPrefersDark.value ? 'dark' : 'light'
    }
    return currentTheme.value
  })

  /**
   * Verifica se o tema dark está ativo
   */
  const isDark = computed(() => {
    return effectiveTheme.value === 'dark'
  })

  // ==========================================================================
  // METHODS
  // ==========================================================================

  /**
   * Detecta preferência do sistema
   */
  const detectSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPrefersDark.value = mediaQuery.matches
    
    // Listener para mudanças na preferência do sistema
    mediaQuery.addEventListener('change', (e) => {
      systemPrefersDark.value = e.matches
      if (currentTheme.value === 'auto') {
        applyTheme(effectiveTheme.value)
      }
    })
  }

  /**
   * Aplica o tema no Quasar e no DOM
   */
  const applyTheme = (theme) => {
    const isDarkMode = theme === 'dark'
    
    // Aplica no Quasar Dark mode
    Dark.set(isDarkMode)
    
    // Aplica classe no body para CSS customizado
    if (isDarkMode) {
      document.body.classList.add('sage-dark-theme')
      document.body.classList.remove('sage-light-theme')
    } else {
      document.body.classList.add('sage-light-theme')
      document.body.classList.remove('sage-dark-theme')
    }
    
    // Aplica no HTML para variáveis CSS globais
    document.documentElement.setAttribute('data-theme', theme)
  }

  /**
   * Muda o tema
   */
  const setTheme = (theme) => {
    if (!['light', 'dark', 'auto'].includes(theme)) {
      return
    }
    
    currentTheme.value = theme
    
    // Salva no localStorage
    localStorage.setItem('sage-theme', theme)
    
    // Aplica o tema efetivo
    applyTheme(effectiveTheme.value)
    
  }

  /**
   * Carrega tema do localStorage
   */
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('sage-theme')
    
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      currentTheme.value = savedTheme
    } else {
      currentTheme.value = 'light' // Default
    }
  }

  /**
   * Inicializa o sistema de temas
   */
  const initTheme = () => {
    // Detecta preferência do sistema
    detectSystemTheme()
    
    // Carrega tema salvo
    loadTheme()
    
    // Aplica tema inicial
    applyTheme(effectiveTheme.value)
  }

  /**
   * Toggle entre light e dark (não afeta auto)
   */
  const toggleTheme = () => {
    if (currentTheme.value === 'auto') {
      // Se está em auto, muda para o oposto do sistema
      setTheme(systemPrefersDark.value ? 'light' : 'dark')
    } else {
      // Toggle entre light e dark
      setTheme(currentTheme.value === 'light' ? 'dark' : 'light')
    }
  }

  // ==========================================================================
  // WATCHERS
  // ==========================================================================
  
  // Watch para mudanças no tema efetivo
  watch(effectiveTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  // ==========================================================================
  // RETURN
  // ==========================================================================
  
  return {
    // State
    currentTheme,
    effectiveTheme,
    isDark,
    systemPrefersDark,
    
    // Methods
    setTheme,
    toggleTheme,
    initTheme,
    loadTheme
  }
}

// ==========================================================================
// SAGE ACCOUNTANT COLOR PALETTE
// ==========================================================================
// Variáveis CSS aplicadas no app.scss baseadas no tema
// ==========================================================================

export const SAGE_COLORS = {
  light: {
    // Primary Colors
    '--sage-primary': '#2C5F2D',
    '--sage-primary-light': '#97B498',
    '--sage-primary-dark': '#1a3a1b',
    '--sage-accent': '#5F7C60',
    '--sage-positive': '#107C10',
    
    // Background Colors
    '--sage-bg-primary': '#ffffff',
    '--sage-bg-secondary': '#f8faf8',
    '--sage-bg-tertiary': '#f0f4f0',
    
    // Text Colors
    '--sage-text-primary': '#1a1a1a',
    '--sage-text-secondary': '#4a4a4a',
    '--sage-text-tertiary': '#6b6b6b',
    
    // Border Colors
    '--sage-border': 'rgba(44, 95, 45, 0.1)',
    '--sage-border-light': 'rgba(44, 95, 45, 0.05)',
    
    // Shadow
    '--sage-shadow': 'rgba(44, 95, 45, 0.15)',
    
    // Gradient
    '--sage-gradient': 'linear-gradient(135deg, #2C5F2D 0%, #3d7a3e 50%, #107C10 100%)'
  },
  
  dark: {
    // Primary Colors (mais claros para contraste)
    '--sage-primary': '#97B498',
    '--sage-primary-light': '#b8d4b9',
    '--sage-primary-dark': '#6b8f6c',
    '--sage-accent': '#8fa890',
    '--sage-positive': '#4CAF50',
    
    // Background Colors (tons escuros com verde sage sutil)
    '--sage-bg-primary': '#121212',
    '--sage-bg-secondary': '#1a1f1a',
    '--sage-bg-tertiary': '#232b23',
    
    // Text Colors (clarps para contraste)
    '--sage-text-primary': '#e8e8e8',
    '--sage-text-secondary': '#b8b8b8',
    '--sage-text-tertiary': '#888888',
    
    // Border Colors
    '--sage-border': 'rgba(151, 180, 152, 0.15)',
    '--sage-border-light': 'rgba(151, 180, 152, 0.08)',
    
    // Shadow
    '--sage-shadow': 'rgba(0, 0, 0, 0.4)',
    
    // Gradient (invertido e suavizado)
    '--sage-gradient': 'linear-gradient(135deg, #97B498 0%, #8fa890 50%, #4CAF50 100%)'
  }
}
