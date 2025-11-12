/**
 * ==========================================================================
 * useResponsive - Composable para gerenciamento responsivo
 * ==========================================================================
 * 
 * Propósito:
 * - Detectar tamanho de tela e breakpoints
 * - Identificar tipo de dispositivo
 * - Detectar orientação
 * - Fornecer utilitários para layouts responsivos
 * - Otimizar para mobile-first
 * 
 * Uso:
 * ```js
 * const { isMobile, isTablet, isDesktop, orientation, breakpoint } = useResponsive()
 * ```
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

export function useResponsive() {
  const $q = useQuasar()
  
  // ==========================================================================
  // ESTADO REATIVO
  // ==========================================================================
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)
  
  // ==========================================================================
  // COMPUTED PROPERTIES
  // ==========================================================================
  
  /**
   * Breakpoint atual baseado na largura da tela
   */
  const breakpoint = computed(() => {
    if ($q.screen.xs) return 'xs'      // 0-599px
    if ($q.screen.sm) return 'sm'      // 600-1023px
    if ($q.screen.md) return 'md'      // 1024-1439px
    if ($q.screen.lg) return 'lg'      // 1440-1919px
    if ($q.screen.xl) return 'xl'      // 1920px+
    return 'xs'
  })
  
  /**
   * Verifica se é dispositivo móvel (xs ou sm)
   */
  const isMobile = computed(() => {
    return $q.screen.lt.md // Menor que 1024px
  })
  
  /**
   * Verifica se é tablet (sm ou md)
   */
  const isTablet = computed(() => {
    return $q.screen.sm || $q.screen.md
  })
  
  /**
   * Verifica se é desktop (md, lg ou xl)
   */
  const isDesktop = computed(() => {
    return $q.screen.gt.sm // Maior que 600px
  })
  
  /**
   * Verifica se é tela pequena (mobile portrait)
   */
  const isSmallScreen = computed(() => {
    return $q.screen.xs
  })
  
  /**
   * Verifica se é tela grande
   */
  const isLargeScreen = computed(() => {
    return $q.screen.gt.md
  })
  
  /**
   * Orientação do dispositivo
   */
  const orientation = computed(() => {
    return windowWidth.value > windowHeight.value ? 'landscape' : 'portrait'
  })
  
  /**
   * Verifica se é modo landscape
   */
  const isLandscape = computed(() => {
    return orientation.value === 'landscape'
  })
  
  /**
   * Verifica se é modo portrait
   */
  const isPortrait = computed(() => {
    return orientation.value === 'portrait'
  })
  
  /**
   * Detecta se é dispositivo touch
   */
  const isTouchDevice = computed(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })
  
  /**
   * Detecta se é iOS
   */
  const isIOS = computed(() => {
    return $q.platform.is.ios
  })
  
  /**
   * Detecta se é Android
   */
  const isAndroid = computed(() => {
    return $q.platform.is.android
  })
  
  /**
   * Detecta se é Safari
   */
  const isSafari = computed(() => {
    return $q.platform.is.safari
  })
  
  /**
   * Largura da tela
   */
  const screenWidth = computed(() => {
    return windowWidth.value
  })
  
  /**
   * Altura da tela
   */
  const screenHeight = computed(() => {
    return windowHeight.value
  })
  
  /**
   * Aspect ratio da tela
   */
  const aspectRatio = computed(() => {
    return windowWidth.value / windowHeight.value
  })
  
  /**
   * Verifica se tem notch (iPhone X+)
   */
  const hasNotch = computed(() => {
    // Detecta safe-area-inset
    const safeAreaInset = getComputedStyle(document.documentElement)
      .getPropertyValue('--sab') || 
      getComputedStyle(document.documentElement)
        .getPropertyValue('env(safe-area-inset-bottom)')
    
    return safeAreaInset && safeAreaInset !== '0px'
  })
  
  // ==========================================================================
  // MÉTODOS
  // ==========================================================================
  
  /**
   * Atualiza dimensões da janela
   */
  const updateDimensions = () => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }
  
  /**
   * Verifica se a largura está dentro de um range
   */
  const isWidthBetween = (min, max) => {
    return windowWidth.value >= min && windowWidth.value <= max
  }
  
  /**
   * Retorna número de colunas baseado no breakpoint
   * Útil para grids responsivos
   */
  const getGridColumns = (config = {}) => {
    const defaults = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5
    }
    
    const merged = { ...defaults, ...config }
    
    if ($q.screen.xs) return merged.xs
    if ($q.screen.sm) return merged.sm
    if ($q.screen.md) return merged.md
    if ($q.screen.lg) return merged.lg
    if ($q.screen.xl) return merged.xl
    
    return merged.xs
  }
  
  /**
   * Retorna tamanho baseado no breakpoint
   */
  const getResponsiveSize = (sizes = {}) => {
    const defaults = {
      xs: 'small',
      sm: 'medium',
      md: 'medium',
      lg: 'large',
      xl: 'large'
    }
    
    const merged = { ...defaults, ...sizes }
    
    if ($q.screen.xs) return merged.xs
    if ($q.screen.sm) return merged.sm
    if ($q.screen.md) return merged.md
    if ($q.screen.lg) return merged.lg
    if ($q.screen.xl) return merged.xl
    
    return merged.xs
  }
  
  /**
   * Retorna valor responsivo baseado no breakpoint
   */
  const getResponsiveValue = (values = {}) => {
    if ($q.screen.xs && values.xs !== undefined) return values.xs
    if ($q.screen.sm && values.sm !== undefined) return values.sm
    if ($q.screen.md && values.md !== undefined) return values.md
    if ($q.screen.lg && values.lg !== undefined) return values.lg
    if ($q.screen.xl && values.xl !== undefined) return values.xl
    
    // Fallback para o menor valor disponível
    return values.xs || values.sm || values.md || values.lg || values.xl || null
  }
  
  /**
   * Calcula padding responsivo
   */
  const getResponsivePadding = () => {
    if ($q.screen.xs) return '12px'
    if ($q.screen.sm) return '16px'
    if ($q.screen.md) return '24px'
    return '32px'
  }
  
  /**
   * Calcula gap responsivo para grids
   */
  const getResponsiveGap = () => {
    if ($q.screen.xs) return '8px'
    if ($q.screen.sm) return '12px'
    if ($q.screen.md) return '16px'
    return '24px'
  }
  
  /**
   * Retorna classes CSS responsivas
   */
  const getResponsiveClasses = () => {
    return {
      'is-mobile': isMobile.value,
      'is-tablet': isTablet.value,
      'is-desktop': isDesktop.value,
      'is-landscape': isLandscape.value,
      'is-portrait': isPortrait.value,
      'is-touch': isTouchDevice.value,
      'is-ios': isIOS.value,
      'is-android': isAndroid.value,
      [`breakpoint-${breakpoint.value}`]: true
    }
  }
  
  /**
   * Scroll para topo (útil em mobile)
   */
  const scrollToTop = (smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }
  
  /**
   * Bloqueia scroll do body (útil para modais)
   */
  const lockScroll = () => {
    document.body.style.overflow = 'hidden'
    
    // iOS fix
    if (isIOS.value) {
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    }
  }
  
  /**
   * Desbloqueia scroll do body
   */
  const unlockScroll = () => {
    document.body.style.overflow = ''
    
    // iOS fix
    if (isIOS.value) {
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }
  
  /**
   * Verifica se elemento está visível no viewport
   */
  const isElementVisible = (element) => {
    if (!element) return false
    
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight.value &&
      rect.right <= windowWidth.value
    )
  }
  
  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================
  onMounted(() => {
    window.addEventListener('resize', updateDimensions, { passive: true })
    window.addEventListener('orientationchange', updateDimensions, { passive: true })
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
    window.removeEventListener('orientationchange', updateDimensions)
  })
  
  // ==========================================================================
  // RETURN
  // ==========================================================================
  return {
    // Breakpoints
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,
    
    // Orientação
    orientation,
    isLandscape,
    isPortrait,
    
    // Dispositivo
    isTouchDevice,
    isIOS,
    isAndroid,
    isSafari,
    hasNotch,
    
    // Dimensões
    screenWidth,
    screenHeight,
    aspectRatio,
    
    // Métodos
    isWidthBetween,
    getGridColumns,
    getResponsiveSize,
    getResponsiveValue,
    getResponsivePadding,
    getResponsiveGap,
    getResponsiveClasses,
    scrollToTop,
    lockScroll,
    unlockScroll,
    isElementVisible,
    
    // Quasar screen
    $q
  }
}
