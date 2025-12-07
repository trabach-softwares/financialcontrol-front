<!-- ==========================================================================
MAIN LAYOUT - LAYOUT PRINCIPAL DA APLICAÇÃO
==========================================================================
Propósito: Layout com sidebar, header e área principal para usuários autenticados
Origem: Páginas protegidas da aplicação
Destino: Dashboard, transações, relatórios, perfil
Efeitos: Navegação completa e interface responsiva -->

<template>
  <q-layout view="lHh LpR lff" class="main-layout" :class="{ 'mobile-layout': $q.screen.lt.lg }">

    <!-- ==========================================================================
    HEADER MOBILE - Mobile Only (com botão hamburguer)
    ========================================================================== -->
    <q-header v-if="$q.screen.lt.lg" elevated class="mobile-header bg-primary text-white">
      <q-toolbar>
        <!-- Botão Menu Hamburguer -->
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" aria-label="Abrir menu" />

        <!-- Título da Página -->
        <q-toolbar-title class="text-center">
          {{ getCurrentPageTitle() }}
        </q-toolbar-title>

        <!-- Botão de Notificações -->
        <q-btn flat dense round icon="notifications" @click="showNotifications = true" aria-label="Notificações">
          <q-badge v-if="notificationCount > 0" color="red" floating>
            {{ notificationCount > 99 ? '99+' : notificationCount }}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- ==========================================================================
    SIDEBAR DE NAVEGAÇÃO - Desktop + Mobile
    ========================================================================== -->
    <q-drawer v-model="leftDrawerOpen" :show-if-above="$q.screen.gt.md" :width="280" :breakpoint="1024" bordered
      :overlay="$q.screen.lt.lg" class="main-sidebar">
      <!-- Logo e título -->
      <div class="sidebar-header q-pa-lg text-center">
        <q-avatar size="80px" square class="q-mb-md">
          <img src="/ControleFinanceiro.png" alt="Financial Control" class="logo" />
        </q-avatar>
        <div class="text-h6 text-weight-bold">
          Financial Control
        </div>
        <div class="text-caption">
          {{ authStore.userPlan }}
        </div>
      </div>

      <q-separator />

      <!-- ==========================================================================
      NAVEGAÇÃO - Desktop: Menu completo | Mobile: Apenas secundários
      Área central com scroll vertical
      ========================================================================== -->
      <div class="sidebar-menu-wrapper">
        <q-list class="sidebar-menu">
          <!-- DESKTOP: Menu Principal Completo -->
          <template v-if="$q.screen.gt.md">
            <q-item-label header class="text-weight-medium q-px-lg">
              MENU PRINCIPAL
            </q-item-label>

            <q-item v-for="route in filteredMainMenuRoutes" :key="route.name"
              :to="canAccessRoute(route) ? route.path : null" @click="handleRouteClick(route, $event)" clickable
              v-ripple class="sidebar-item" :class="{ 'route-locked': isRouteLocked(route) }"
              active-class="sidebar-item-active" v-if="!(authStore.isAdmin && route.path === '/plans')">
              <q-item-section avatar>
                <q-icon :name="route.icon" />
                <!-- Ícone de cadeado para rotas bloqueadas -->
                <q-icon v-if="isRouteLocked(route)" name="lock" size="xs" class="lock-badge" color="amber" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  {{ route.title }}
                  <!-- Badge Premium -->
                  <q-chip v-if="isRouteLocked(route)" dense color="deep-purple" text-color="white" size="sm"
                    class="q-ml-xs">
                    PREMIUM
                  </q-chip>
                </q-item-label>
                <q-item-label caption>{{ route.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <!-- MOBILE: Apenas Recursos Avançados (não duplica bottom nav) -->
          <template v-else>
            <q-item-label header class="text-weight-medium q-px-lg">
              RECURSOS AVANÇADOS
            </q-item-label>

            <q-item v-for="route in drawerMenuRoutes" :key="route.name" :to="canAccessRoute(route) ? route.path : null"
              @click="handleRouteClick(route, $event)" clickable v-ripple class="sidebar-item"
              :class="{ 'route-locked': isRouteLocked(route) }" active-class="sidebar-item-active"
              v-if="!(authStore.isAdmin && route.path === '/plans')">
              <q-item-section avatar>
                <q-icon :name="route.icon" />
                <!-- Ícone de cadeado para rotas bloqueadas -->
                <q-icon v-if="isRouteLocked(route)" name="lock" size="xs" class="lock-badge" color="amber" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  {{ route.title }}
                  <!-- Badge Premium -->
                  <q-chip v-if="isRouteLocked(route)" dense color="deep-purple" text-color="white" size="sm"
                    class="q-ml-xs">
                    PREMIUM
                  </q-chip>
                </q-item-label>
                <q-item-label caption>{{ route.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <!-- Separador para área administrativa -->
          <template v-if="authStore.isAdmin">
            <q-separator class="q-my-md" />

            <q-item-label header class="text-weight-medium q-px-lg">
              ADMINISTRAÇÃO
            </q-item-label>

            <q-item v-for="route in adminMenuRoutes" :key="route.name" :to="route.path" clickable v-ripple
              class="sidebar-item" active-class="sidebar-item-active">
              <q-item-section avatar>
                <q-icon :name="route.icon" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ route.title }}</q-item-label>
                <q-item-label caption>{{ route.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>

      <!-- Rodapé do Sidebar -->
      <div class="sidebar-footer q-pa-lg">
        <!-- Upgrade para plano superior (se não for premium e não for admin) -->
        <template v-if="authStore.userPlan !== 'premium' && !authStore.isAdmin">
          <q-card class="upgrade-card bg-gradient text-white q-mb-md" flat>
            <q-card-section class="text-center q-py-lg">
              <q-icon name="star" size="2rem" class="q-mb-md" />
              <div class="text-subtitle2 q-mb-xs">
                Upgrade para Premium
              </div>
              <div class="text-caption q-mb-md">
                Recursos ilimitados e suporte prioritário
              </div>
              <q-btn label="Upgrade" color="white" text-color="primary" no-caps rounded size="sm"
                @click="navigateToPlans" />
            </q-card-section>
          </q-card>
        </template>

        <!-- Ações fixas do usuário no rodapé -->
        <SidebarFooter :notification-count="notificationCount" @open-notifications="showNotifications = true"
          @logout="handleLogout" />
      </div>
    </q-drawer>

    <q-page-container class="main-content" :class="{ 'has-bottom-nav': $q.screen.lt.lg }">
      <router-view />
    </q-page-container>

    <!-- ==========================================================================
    BOTTOM NAVIGATION - Mobile Only
    ========================================================================== -->
    <BottomNavigation v-if="$q.screen.lt.lg" @open-transaction-dialog="openTransactionDialog" />

    <!-- ==========================================================================
    DIALOG DE NOVA TRANSAÇÃO - Mobile
    ========================================================================== -->
    <q-dialog v-model="showAddTransactionDialog" maximized transition-show="slide-up" transition-hide="slide-down"
      class="transaction-dialog-mobile">
      <TransactionForm mode="create" @cancelled="closeTransactionDialog" @saved="handleTransactionSuccess" />
    </q-dialog>

    <!-- Dialog de Notificações -->
    <q-dialog v-model="showNotifications" position="right">
      <q-card style="width: 400px; max-width: 90vw;">
        <q-bar class="bg-primary text-white">
          <q-icon name="notifications" />
          <div class="text-weight-medium q-ml-sm">Notificações</div>
          <q-space />
          <q-btn dense flat icon="close" @click="showNotifications = false" />
        </q-bar>

        <q-card-section>
          <div v-if="notifications.length === 0" class="text-center q-py-lg">
            <q-icon name="notifications_none" size="3rem" color="grey-4" />
            <p class="text-grey-6 q-mt-md">
              Nenhuma notificação
            </p>
          </div>

          <q-list v-else separator>
            <q-item v-for="notification in notifications" :key="notification.id" clickable>
              <q-item-section avatar>
                <q-avatar :color="notification.color" text-color="white">
                  <q-icon :name="notification.icon" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ notification.title }}</q-item-label>
                <q-item-label caption>{{ notification.message }}</q-item-label>
                <q-item-label caption>{{ notification.time }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- ==========================================================================
    DIALOG DE UPGRADE PREMIUM - Bloqueio de Features
    ========================================================================== -->
    <PremiumFeatureDialog v-model="showPremiumDialog" title=" Contas Bancárias" subtitle="Recurso Exclusivo Premium"
      message="Gerencie todas as suas contas bancárias, cartões de crédito e investimentos em um só lugar." :features="[
        'Gestão completa de contas bancárias',
        'Conciliação bancária automática',
        'Extratos detalhados por conta',
        'Múltiplas contas ilimitadas',
        'Relatórios consolidados'
      ]" required-plan="PREMIUM" :current-plan="authStore.userPlan" />

    <!-- Session Manager - Gerenciamento de Timeout de Sessão -->
    <SessionManager />
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import BottomNavigation from 'src/components/BottomNavigation.vue'
import PremiumFeatureDialog from 'src/components/PremiumFeatureDialog.vue'
import SessionManager from 'src/components/SessionManager.vue'
import SidebarFooter from 'src/components/SidebarFooter.vue'
import TransactionForm from 'src/components/TransactionForm.vue'
import { useFeaturePermissions } from 'src/composables/useFeaturePermissions'
import { useNotifications } from 'src/composables/useNotifications'
import { getAdminMenuRoutes, getDrawerMenuRoutes, getMainMenuRoutes, getUserMenuRoutes } from 'src/router/routes'
import { useAuthStore } from 'src/stores/auth'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { notifySuccess } = useNotifications()
const { canAccessBankAccounts } = useFeaturePermissions()
const $q = useQuasar()

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const leftDrawerOpen = ref(false)
const showNotifications = ref(false)
const showAddTransactionDialog = ref(false)
const showPremiumDialog = ref(false)

// Rotas do menu (Desktop: completo | Mobile drawer: apenas secundários)
const mainMenuRoutes = getMainMenuRoutes()
const drawerMenuRoutes = getDrawerMenuRoutes()
const adminMenuRoutes = getAdminMenuRoutes()
const userMenuRoutes = getUserMenuRoutes()

// Rotas visíveis no menu principal (esconde "/plans" para admin)
const filteredMainMenuRoutes = computed(() => {
  if (authStore.isAdmin) {
    return mainMenuRoutes.filter(r => r.path !== '/plans')
  }
  return mainMenuRoutes
})

// Notificações simuladas
const notifications = ref([
  {
    id: 1,
    title: 'Nova transação',
    message: 'Transação de R$ 1.500,00 adicionada',
    time: 'há 2 horas',
    icon: 'receipt_long',
    color: 'green-6'
  },
  {
    id: 2,
    title: 'Relatório mensal',
    message: 'Relatório de dezembro disponível',
    time: 'há 1 dia',
    icon: 'assessment',
    color: 'blue-6'
  }
])

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================

/**
 * Contador de notificações
 */
const notificationCount = computed(() => {
  return notifications.value.length
})

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Alterna sidebar
 */
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

/**
 * Navega para a página de planos
 */
const navigateToPlans = () => {
  router.push('/plans').then(() => {
  }).catch(error => {
    console.error(' [NAVIGATION] Erro na navegação:', error)
  })
}

/**
 * Verifica se o usuário pode acessar uma rota
 */
const canAccessRoute = (routeItem) => {
  // Se a rota requer plano premium, verifica permissão
  if (routeItem.meta?.requiresPremium) {
    return canAccessBankAccounts.value
  }
  return true
}

/**
 * Verifica se uma rota está bloqueada (requer premium mas usuário não tem)
 */
const isRouteLocked = (routeItem) => {
  return routeItem.meta?.requiresPremium && !canAccessBankAccounts.value
}

/**
 * Intercepta clique em rotas premium bloqueadas
 */
const handleRouteClick = (routeItem, event) => {
  if (isRouteLocked(routeItem)) {
    event.preventDefault()
    event.stopPropagation()
    showPremiumDialog.value = true
    return
  }

  // Fecha drawer no mobile após navegação bem-sucedida
  if ($q.screen.lt.lg) {
    // Pequeno delay para melhor UX (animação de clique)
    setTimeout(() => {
      leftDrawerOpen.value = false
    }, 150)
  }
}

/**
 * Obtém título da página atual
 */
const getCurrentPageTitle = () => {
  return route.meta.title || 'Página'
}

/**
 * Obtém ícone da página atual
 */
const getCurrentPageIcon = () => {
  return route.meta.icon || 'page_info'
}

/**
 * Processa logout
 */
const handleLogout = async () => {

  try {
    await authStore.logout()
    notifySuccess('Logout realizado com sucesso!')
    router.push('/login')

  } catch (error) {
  }
}

/**
 * Abre dialog de adicionar transação
 */
const openTransactionDialog = () => {
  showAddTransactionDialog.value = true
}

/**
 * Fecha dialog de transação
 */
const closeTransactionDialog = () => {
  showAddTransactionDialog.value = false
}

/**
 * Handler de sucesso ao salvar transação
 */
const handleTransactionSuccess = () => {
  closeTransactionDialog()
  notifySuccess('Transação criada com sucesso!')

  // Se estiver na página de dashboard ou transações, pode recarregar os dados
  // Aqui você pode emitir um evento ou usar um event bus
}

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(async () => {
  // Garante que o nome/tipo do plano esteja resolvido a partir do plan_id
  if (authStore.user && !authStore.user.plan_name && authStore.user.plan_id) {
    await authStore.enrichUserPlan()
  }
})
</script>

<style lang="scss" scoped>
.main-layout {

  // ==========================================================================
  // MOBILE HEADER
  // ==========================================================================
  .mobile-header {
    .q-toolbar {
      min-height: 56px;
      padding: 0 8px;

      .q-btn {
        color: white;

        .q-badge {
          font-size: 10px;
          font-weight: 600;
          min-width: 18px;
          min-height: 18px;
        }
      }

      .q-toolbar-title {
        font-size: 1.1rem;
        font-weight: 600;
        letter-spacing: 0.3px;
      }
    }
  }

  // ==========================================================================
  // SIDEBAR
  // ==========================================================================
  .main-sidebar {
    border-right: 1px solid rgba(44, 95, 45, 0.1);
    z-index: 100;
    display: flex;
    flex-direction: column;

    .sidebar-header {
      background: var(--sage-gradient);
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      padding: 1.5rem 1rem;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        animation: shine 3s ease-in-out infinite;
        pointer-events: none;
        z-index: 0;
      }

      /* Forçar avatar quadrado para o logo (evita corte circular) */
      .q-avatar {
        border-radius: 8px !important;
      }

      .text-h6,
      .text-caption {
        color: white !important;
      }

      /* Override Quasar avatar img inherited sizing only for the logo */
      .q-avatar .logo {
        width: auto !important;
        height: auto !important;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 0 !important;
      }
    }

    .sidebar-menu-wrapper {
      flex: 1;
      overflow-y: auto;
    }

    .sidebar-menu {
      padding: 1rem 0.5rem;

      .sidebar-item {
        margin: 0.25rem 0;
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--sage-positive);
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        &:hover {
          background: linear-gradient(90deg, rgba(44, 95, 45, 0.08) 0%, rgba(44, 95, 45, 0.04) 100%);
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(44, 95, 45, 0.1);

          &::before {
            transform: scaleY(1);
          }

          .q-icon {
            color: var(--sage-primary);
            transform: scale(1.1);
          }
        }

        &.sidebar-item-active {
          background: var(--sage-gradient);
          color: white;
          box-shadow: 0 4px 12px rgba(44, 95, 45, 0.3);
          transform: translateX(4px);

          &::before {
            transform: scaleY(1);
            background: white;
          }

          .q-icon {
            color: white;
            transform: scale(1.1);
          }

          .q-item-label {
            font-weight: 600;
          }
        }

        .q-icon {
          transition: all 0.3s ease;
        }
      }
    }

    .sidebar-footer {
      position: relative;
      padding: 1rem;
      margin-top: auto;

      .upgrade-card {
        background: var(--sage-gradient);
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(44, 95, 45, 0.25);
        position: relative;
        overflow: hidden;
        z-index: 1;

        &::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
          animation: rotate 8s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        .q-card-section {
          position: relative;
          z-index: 2;
        }

        .q-btn {
          background: white;
          color: var(--sage-primary);
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          z-index: 3;

          &:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
  }

  // Header
  .main-header {
    background: white;
    box-shadow: 0 2px 12px rgba(44, 95, 45, 0.08);
    border-bottom: 1px solid rgba(44, 95, 45, 0.1);

    .q-breadcrumbs {
      .q-breadcrumbs-el {
        color: var(--sage-primary);
      }
    }

    .user-menu-btn {
      padding: 0.5rem 0.75rem;
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, rgba(44, 95, 45, 0.05) 0%, rgba(44, 95, 45, 0.08) 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(44, 95, 45, 0.12);

        .q-avatar {
          border-color: var(--sage-positive);
        }
      }
      
      .q-avatar {
        border: 2px solid var(--sage-primary-light);
        transition: all 0.3s ease;
      }
    }
    
    .user-info-item {
      padding: 1.25rem;
      background: linear-gradient(135deg, #f8faf8 0%, #ecf2ec 100%);
      border-bottom: 2px solid var(--sage-primary-light);
      
      .q-avatar {
        border: 2px solid var(--sage-primary);
      }
    }
    
    .q-btn {
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
    }
  }
  
  // Conteúdo principal
  .main-content {
    background: var(--sage-bg-primary);
    position: relative;
    z-index: 1;
    overflow-x: hidden;
    
    // Espaçamento para bottom navigation (mobile)
    &.has-bottom-nav {
      padding-bottom: 70px;
    }
    // Garante que o conteúdo não vaze sobre o sidebar
    :deep(.q-page) {
      max-width: 100%;
      overflow-x: hidden;
    }
    
    // Espaçamento para bottom navigation em mobile
    &.has-bottom-nav {
      // Adiciona espaço para o menu (56px) + safe area + margem
      padding-bottom: calc(80px + env(safe-area-inset-bottom));
      min-height: 100vh;
      
      :deep(.q-page) {
        // Padding adicional no conteúdo da página
        padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important;
        min-height: calc(100vh - 56px);
      }
    }
  }
}

// ==========================================================================
// MOBILE LAYOUT
// ==========================================================================
.main-layout.mobile-layout {
  // Remove a condição de esconder o sidebar - agora ele abre via hamburguer
  // .main-sidebar é controlado por v-model="leftDrawerOpen"
  
  .main-content {
    // Adiciona espaço para o header mobile (56px)
    padding-top: 56px;
  }
}

// Animações
.sidebar-item {
  animation: slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shine {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Responsividade
@media (max-width: 1024px) {
  .main-sidebar {
    .sidebar-footer {
      margin-top: auto;
    }
  }
}

// ==========================================================================
// PREMIUM FEATURE INDICATORS - Rotas Bloqueadas
// ==========================================================================
.route-locked {
  opacity: 0.7;
  position: relative;
  cursor: not-allowed !important;
  
  &:hover {
    background-color: rgba(255, 193, 7, 0.05) !important;
  }
  
  .lock-badge {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #ffc107;
    animation: pulse 2s ease-in-out infinite;
  }
  
  .premium-chip {
    margin-left: auto;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    padding: 2px 8px;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .main-header {
    .q-toolbar {
      padding: 0 1rem;
    }
  }
  
  .sidebar-header {
    padding: 1rem !important;
    
    .q-avatar {
      width: 50px !important;
      height: 50px !important;
    }
  }
}

// ==========================================================================
// DIALOG DE TRANSAÇÃO - MOBILE SCROLL FIX
// ==========================================================================
:deep(.transaction-dialog-mobile) {
  @media (max-width: 599px) {
    .q-dialog__backdrop {
      background: rgba(0, 0, 0, 0.7) !important;
    }
    
    .q-dialog__inner {
      padding: 0 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior: contain !important;
      
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      height: 100vh !important;
      width: 100vw !important;
      max-height: 100vh !important;
      
      > * {
        height: auto !important;
        min-height: 150vh !important;
      }
      
      .transaction-form-card {
        margin: 0 !important;
        border-radius: 0 !important;
        max-height: none !important;
        height: auto !important;
        min-height: 150vh !important;
        overflow: visible !important;
        
        .q-card-section {
          padding-bottom: calc(400px + env(safe-area-inset-bottom)) !important;
          min-height: 100vh !important;
        }
      }
    }
  }
}
</style>