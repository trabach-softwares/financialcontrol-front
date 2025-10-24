<!-- ==========================================================================
APP.VUE - COMPONENTE RAIZ DA APLICAÇÃO
==========================================================================
Propósito: Ponto de entrada principal da aplicação Vue.js
Origem: Inicialização do sistema
Destino: Layouts e páginas via router
Efeitos: Configuração global, inicialização de stores -->

<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useTransactionStore } from 'src/stores/transactions'

// ==========================================================================
// STORES
// ==========================================================================
const authStore = useAuthStore()
const transactionStore = useTransactionStore()

// ==========================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================================================
onMounted(async () => {
  console.log('🚀 [APP] Inicializando aplicação Controle Financeiro')
  
  try {
    // Inicializa autenticação
    console.log('🔐 [APP] Inicializando sistema de autenticação')
    await authStore.initialize()
    
    // Se usuário autenticado, inicializa dados básicos
    if (authStore.isAuthenticated) {
      console.log('✅ [APP] Usuário autenticado, carregando dados iniciais')
      
      // Carrega categorias de transação
      transactionStore.loadCategories()
    }
    
    console.log('✅ [APP] Aplicação inicializada com sucesso')
    
  } catch (error) {
    console.error('❌ [APP] Erro na inicialização:', error.message)
  }
})
</script>

<style lang="scss">
// ==========================================================================
// ESTILOS GLOBAIS DA APLICAÇÃO
// ==========================================================================

// Importações do Quasar (se necessário customizar)
// @import '~quasar/src/css/index.sass';

// Variáveis globais
:root {
  // Cores principais
  --primary: #1976D2;
  --secondary: #26A69A;
  --accent: #9C27B0;
  --dark: #1D1D1D;
  --positive: #21BA45;
  --negative: #C10015;
  --info: #31CCEC;
  --warning: #F2C037;

  // Cores personalizadas
  --success: #4CAF50;
  --error: #F44336;
  --income: #4CAF50;
  --expense: #F44336;
  --balance-positive: #2196F3;
  --balance-negative: #FF9800;

  // Espaçamentos
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  // Bordas
  --border-radius: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;

  // Sombras
  --shadow-1: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-2: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --shadow-3: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

// Reset e normalização
* {
  box-sizing: border-box;
}

html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background-color: #f5f5f5;
}

#q-app {
  height: 100%;
}

// Classes utilitárias globais
.full-width {
  width: 100% !important;
}

.full-height {
  height: 100% !important;
}

.text-center {
  text-align: center !important;
}

.text-right {
  text-align: right !important;
}

.text-left {
  text-align: left !important;
}

// Gradientes personalizados
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
}

.bg-gradient-error {
  background: linear-gradient(135deg, #F44336 0%, #D32F2F 100%);
}

// Animações globais
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

// Customizações do Quasar
.q-card {
  border-radius: var(--border-radius-lg) !important;
  
  &.shadow-custom {
    box-shadow: var(--shadow-2) !important;
  }
}

.q-btn {
  text-transform: none !important;
  
  &.btn-gradient {
    background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%) !important;
    color: white !important;
    
    &:hover {
      background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%) !important;
    }
  }
}

.q-input,
.q-select {
  .q-field__control {
    border-radius: var(--border-radius) !important;
  }
}

// Estados de loading
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .loading-content {
    text-align: center;
    
    .loading-spinner {
      margin-bottom: 1rem;
    }
    
    .loading-text {
      color: #666;
      font-size: 1.1rem;
    }
  }
}

// Estados de erro
.error-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  
  .error-icon {
    font-size: 3rem;
    color: #ccc;
    margin-bottom: 1rem;
  }
  
  .error-title {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .error-message {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
}

// Estados vazios
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
  
  .empty-icon {
    font-size: 4rem;
    color: #ddd;
    margin-bottom: 1rem;
  }
  
  .empty-title {
    font-size: 1.3rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .empty-message {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
}

// Responsividade
@media (max-width: 768px) {
  .hide-on-mobile {
    display: none !important;
  }
  
  .q-card {
    margin: 0.5rem !important;
    border-radius: var(--border-radius) !important;
  }
}

@media (min-width: 769px) {
  .show-only-mobile {
    display: none !important;
  }
}

// Dark mode (preparação futura)
@media (prefers-color-scheme: dark) {
  .auto-dark {
    // Estilos para modo escuro automático
    background-color: #121212;
    color: #ffffff;
  }
}

// Print styles
@media print {
  .no-print {
    display: none !important;
  }
  
  .q-page {
    padding: 0 !important;
  }
}

// Scrollbar personalizada
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  
  &:hover {
    background: #a8a8a8;
  }
}

// Seleção de texto
::selection {
  background-color: rgba(25, 118, 210, 0.2);
}

::-moz-selection {
  background-color: rgba(25, 118, 210, 0.2);
}
</style>