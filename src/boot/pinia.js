// ==========================================================================
// PINIA BOOT FILE - CONFIGURAÇÃO DO STORE GLOBAL
// ==========================================================================
// Propósito: Inicializar Pinia como gerenciador de estado global
// Origem: Boot file do Quasar Framework  
// Destino: Disponibilizar stores em toda a aplicação
// Efeitos: Permite uso de stores para auth, transactions, etc.

import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'

/**
 * Boot function que configura o Pinia
 * Propósito: Criar instância do Pinia e registrar na app Vue
 * Efeito: Habilita uso de stores em todos os componentes
 */
export default boot(({ app }) => {
  const pinia = createPinia()
  app.use(pinia)
})