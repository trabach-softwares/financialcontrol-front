<!-- ==========================================================================
BOTTOM NAVIGATION - Menu de Navegação Inferior Mobile
==========================================================================
Propósito: Navegação principal para dispositivos móveis com menu fixo na parte inferior
Características:
- Sempre visível em mobile (< 1024px)
- Ícones grandes otimizados para toque (min 44px)
- Feedback visual e animações suaves
- Indicador de página ativa
- Máximo 5 itens principais
========================================================================== -->

<template>
  <div v-if="isMobile">
    <!-- ==========================================================================
    BOTTOM NAVIGATION
    ========================================================================== -->
    <div 
      class="bottom-navigation"
      :class="{ 
        'bottom-nav-hidden': hideOnScroll && isScrollingDown
      }"
    >
      <nav class="bottom-nav-container">
        <button
          v-for="item in navigationItems"
          :key="item.name"
          class="nav-item"
          :class="{ 'nav-item-active': isActive(item.path) }"
          @click="navigateTo(item.path)"
        >
          <!-- Indicador visual de ativo -->
          <div class="active-indicator" v-if="isActive(item.path)"></div>
          
          <!-- Ícone -->
          <div class="nav-icon">
            <q-icon :name="item.icon" size="1.5rem" />
            
            <!-- Badge de notificação (opcional) -->
            <q-badge 
              v-if="item.badge && item.badge > 0"
              color="red-6"
              floating
              rounded
              :label="item.badge > 99 ? '99+' : item.badge"
              class="nav-badge"
            />
          </div>
          
          <!-- Label -->
          <span class="nav-label">{{ item.label }}</span>
          
          <!-- Ripple effect -->
          <q-ripple />
        </button>
      </nav>
      
      <!-- Safe area para iPhones com notch -->
      <div class="safe-area-spacer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const $q = useQuasar()

// ==========================================================================
// PROPS E EMITS
// ==========================================================================
const props = defineProps({
  hideOnScroll: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['open-transaction-dialog'])

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const lastScrollY = ref(0)
const isScrollingDown = ref(false)

// ==========================================================================
// COMPUTED
// ==========================================================================

/**
 * Verifica se está em dispositivo mobile
 */
const isMobile = computed(() => {
  return $q.screen.lt.lg // Menor que 1024px
})

/**
 * Itens de navegação baseados no perfil do usuário
 */
const navigationItems = computed(() => {
  const baseItems = [
    {
      name: 'dashboard',
      path: '/dashboard',
      icon: 'dashboard',
      label: 'Início',
      badge: 0
    },
    {
      name: 'transactions',
      path: '/transactions',
      icon: 'receipt_long',
      label: 'Transações',
      badge: 0
    },
    {
      name: 'add',
      path: '/add-transaction',
      icon: 'add_circle',
      label: 'Adicionar',
      badge: 0,
      special: true // Item central especial
    },
    {
      name: 'reports',
      path: '/reports',
      icon: 'assessment',
      label: 'Relatórios',
      badge: 0
    },
    {
      name: 'profile',
      path: '/profile',
      icon: 'person',
      label: 'Perfil',
      badge: 0
    }
  ]
  
  // Se for admin, adiciona acesso à administração no menu de perfil
  // ou substitui relatórios por admin
  if (authStore.isAdmin) {
    // Podemos substituir 'reports' por 'admin' ou manter como está
    // Por enquanto vamos manter os 5 itens principais
  }
  
  return baseItems
})

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Verifica se a rota está ativa
 */
const isActive = (path) => {
  if (path === '/add-transaction') {
    return false // Item especial não tem estado ativo visual
  }
  return route.path === path || route.path.startsWith(path + '/')
}

/**
 * Navega para a rota
 */
const navigateTo = (path) => {
  // Haptic feedback em dispositivos que suportam
  if (navigator.vibrate) {
    navigator.vibrate(10)
  }
  
  // Se for "adicionar", emite evento para abrir dialog de transação
  if (path === '/add-transaction') {
    emit('open-transaction-dialog')
    return
  }
  
  router.push(path)
}

/**
 * Detecta direção do scroll
 */
const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    isScrollingDown.value = true
  } else {
    isScrollingDown.value = false
  }
  
  lastScrollY.value = currentScrollY
}

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(() => {
  if (props.hideOnScroll) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (props.hideOnScroll) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// BOTTOM NAVIGATION
// ==========================================================================
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  background: var(--q-background);
  border-top: 1px solid var(--q-border-color, rgba(0, 0, 0, 0.12));
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  // Suporte para safe area (notch de iPhone)
  padding-bottom: env(safe-area-inset-bottom);
  
  // Efeito de blur no fundo (iOS style)
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  
  &.bottom-nav-hidden {
    transform: translateY(100%);
  }
}

.bottom-nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  max-width: 100%;
  margin: 0 auto;
  min-height: 56px; /* Altura mínima para toque confortável */
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  flex: 1;
  max-width: 100px;
  
  // Área de toque mínima (44px x 44px para acessibilidade)
  min-height: 56px;
  min-width: 44px;
  
  // Remove estilos padrão de botão
  -webkit-tap-highlight-color: transparent;
  outline: none;
  user-select: none;
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: scale(0.95);
  }
}

.active-indicator {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: var(--sage-primary, var(--q-primary));
  border-radius: 0 0 3px 3px;
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  .q-icon {
    color: var(--q-text-secondary, rgba(0, 0, 0, 0.6));
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.nav-item-active {
  .nav-icon {
    background: linear-gradient(135deg, 
      rgba(44, 95, 45, 0.15) 0%, 
      rgba(44, 95, 45, 0.08) 100%
    );
    
    .q-icon {
      color: var(--sage-primary, var(--q-primary));
      transform: scale(1.1);
    }
  }
  
  .nav-label {
    color: var(--sage-primary, var(--q-primary));
    font-weight: 600;
  }
}

.nav-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 0.65rem;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--q-text-secondary, rgba(0, 0, 0, 0.6));
  text-align: center;
  line-height: 1.2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Safe area para dispositivos com notch (iPhone X+)
.safe-area-spacer {
  height: env(safe-area-inset-bottom);
  background: var(--q-background);
}

// Animações
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

// Dark mode
.body--dark {
  .bottom-navigation {
    border-top-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.3);
  }
  
  .nav-icon .q-icon {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .nav-label {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .nav-item-active {
    .nav-icon .q-icon {
      color: var(--sage-primary, var(--q-primary));
    }
    
    .nav-label {
      color: var(--sage-primary, var(--q-primary));
    }
  }
}

// Landscape mode - ajusta altura
@media (max-height: 500px) and (orientation: landscape) {
  .nav-item {
    flex-direction: row;
    gap: 8px;
    min-height: 48px;
  }
  
  .nav-label {
    font-size: 0.75rem;
  }
  
  .active-indicator {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 40px;
    border-radius: 0 3px 3px 0;
  }
  
  // Banner mais compacto em landscape
  .upgrade-banner-content {
    padding: 0.5rem 0.75rem;
  }
  
  .upgrade-icon {
    width: 32px;
    height: 32px;
  }
  
  .upgrade-title {
    font-size: 0.8rem;
  }
  
  .upgrade-subtitle {
    display: none; // Esconde subtitle em landscape
  }
}

// Muito pequeno - esconde labels e ajusta banner
@media (max-width: 360px) {
  .nav-label {
    font-size: 0.65rem;
  }
  
  .nav-item {
    padding: 8px 8px;
    gap: 2px;
  }
  
  // Banner compacto em telas muito pequenas
  .upgrade-banner-body {
    gap: 0.5rem;
  }
  
  .upgrade-icon {
    width: 36px;
    height: 36px;
  }
  
  .upgrade-title {
    font-size: 0.8rem;
  }
  
  .upgrade-subtitle {
    font-size: 0.65rem;
  }
  
  .upgrade-btn {
    font-size: 0.7rem;
    padding: 0.4rem 0.65rem;
    
    :deep(.q-btn__content) {
      .q-icon {
        display: none; // Esconde ícone do botão em telas muito pequenas
      }
    }
  }
}
</style>

