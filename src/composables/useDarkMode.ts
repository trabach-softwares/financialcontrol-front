import { ref, computed, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

type Theme = 'light' | 'dark' | 'system'

const isDark = ref(false)
const theme = useLocalStorage<Theme>('theme', 'system')

export function useDarkMode() {
  // System preference detection
  const systemPrefersDark = computed(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Computed dark mode state
  const computedDark = computed(() => {
    switch (theme.value) {
      case 'dark':
        return true
      case 'light':
        return false
      case 'system':
      default:
        return systemPrefersDark.value
    }
  })

  // Apply theme to document
  const applyTheme = (dark: boolean) => {
    isDark.value = dark
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // Watch for changes
  watch(
    computedDark,
    (dark) => applyTheme(dark),
    { immediate: true }
  )

  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme(computedDark.value)
      }
    })
  }

  // Theme setters
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const toggleDark = () => {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  const setLight = () => setTheme('light')
  const setDark = () => setTheme('dark')
  const setSystem = () => setTheme('system')

  return {
    isDark: computed(() => isDark.value),
    theme: computed(() => theme.value),
    systemPrefersDark,
    toggleDark,
    setTheme,
    setLight,
    setDark,
    setSystem,
  }
}