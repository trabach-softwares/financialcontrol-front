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
  // Disponibiliza globalmente (opcional)
  app.config.globalProperties.$theme = theme
}
