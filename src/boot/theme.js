// ==========================================================================
// THEME BOOT FILE - SAGE ACCOUNTANT
// ==========================================================================
// Inicializa o sistema de temas Dark/Light/Auto
// Carrega preferência salva e aplica ao iniciar a aplicação
// ==========================================================================

import { useTheme } from 'src/composables/useTheme'

export default ({ app }) => {
  // Inicializa o sistema de temas
  const theme = useTheme()
  theme.initTheme()
  
  console.log('🎨 [BOOT] Sistema de temas Sage Accountant inicializado')
  console.log(`📋 [BOOT] Tema atual: ${theme.currentTheme.value}`)
  console.log(`✨ [BOOT] Tema efetivo: ${theme.effectiveTheme.value}`)
  
  // Disponibiliza globalmente (opcional)
  app.config.globalProperties.$theme = theme
}
