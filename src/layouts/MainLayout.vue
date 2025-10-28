<!-- ==========================================================================
MAIN LAYOUT - LAYOUT PRINCIPAL DA APLICAÇÃO
==========================================================================
Propósito: Layout com sidebar, header e área principal para usuários autenticados
Origem: Páginas protegidas da aplicação
Destino: Dashboard, transações, relatórios, perfil
Efeitos: Navegação completa e interface responsiva -->

<template>
  <q-layout view="lHh LpR lff" class="main-layout">
    
    <!-- ==========================================================================
    SIDEBAR DE NAVEGAÇÃO
    ========================================================================== -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="280"
      :breakpoint="1024"
      bordered
      class="main-sidebar"
    >
      <!-- Logo e título -->
      <div class="sidebar-header q-pa-lg text-center">
        <q-avatar size="80px" square class="q-mb-md">
          <img src="/ControleFinanceiro.png" alt="Financial Control" class="logo"/>
        </q-avatar>
        <div class="text-h6 text-weight-bold">
          Financial Control
        </div>
        <div class="text-caption">
          {{ authStore.userPlan }}
        </div>
      </div>

      <q-separator />

      <!-- Navegação principal -->
      <q-list class="sidebar-menu">
        <q-item-label header class="text-weight-medium q-px-lg">
          MENU PRINCIPAL
        </q-item-label>

        <q-item
          v-for="route in filteredMainMenuRoutes"
          :key="route.name"
          :to="route.path"
          clickable
          v-ripple
          class="sidebar-item"
          active-class="sidebar-item-active"
          v-if="!(authStore.isAdmin && route.path === '/plans')"
        >
          <q-item-section avatar>
            <q-icon :name="route.icon" />
          </q-item-section>
          
          <q-item-section>
            <q-item-label>{{ route.title }}</q-item-label>
            <q-item-label caption>{{ route.description }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Separador para área administrativa -->
        <template v-if="authStore.isAdmin">
          <q-separator class="q-my-md" />
          
          <q-item-label header class="text-weight-medium q-px-lg">
            ADMINISTRAÇÃO
          </q-item-label>

          <q-item
            v-for="route in adminMenuRoutes"
            :key="route.name"
            :to="route.path"
            clickable
            v-ripple
            class="sidebar-item"
            active-class="sidebar-item-active"
          >
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
              <q-btn
                label="Upgrade"
                color="white"
                text-color="primary"
                no-caps
                rounded
                size="sm"
                @click="$router.push('/plans')"
              />
            </q-card-section>
          </q-card>
        </template>

        <!-- Ações fixas do usuário no rodapé -->
        <SidebarFooter
          :notification-count="notificationCount"
          @open-notifications="showNotifications = true"
          @logout="handleLogout"
        />
      </div>
    </q-drawer>


    <q-page-container class="main-content">
      <router-view />
    </q-page-container>

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
            <q-item
              v-for="notification in notifications"
              :key="notification.id"
              clickable
            >
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

    <!-- Session Manager - Gerenciamento de Timeout de Sessão -->
    <SessionManager />
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useNotifications } from 'src/composables/useNotifications'
import SidebarFooter from 'src/components/SidebarFooter.vue'
import { getMainMenuRoutes, getAdminMenuRoutes, getUserMenuRoutes } from 'src/router/routes'
import SessionManager from 'src/components/SessionManager.vue'

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { notifySuccess } = useNotifications()

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const leftDrawerOpen = ref(false)
const showNotifications = ref(false)

// Rotas do menu
const mainMenuRoutes = getMainMenuRoutes()
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
  // Sidebar
  .main-sidebar {
    border-right: 1px solid rgba(44, 95, 45, 0.1);
    
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
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: shine 3s ease-in-out infinite;
      }
      
      /* Forçar avatar quadrado para o logo (evita corte circular) */
      .q-avatar {
        border-radius: 8px !important;
      }

      .text-h6, .text-caption {
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
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      
      .upgrade-card {
        background: var(--sage-gradient);
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(44, 95, 45, 0.25);
        position: relative;
        overflow: hidden;
        
        &::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          animation: rotate 8s linear infinite;
        }
        
        .q-btn {
          background: white;
          color: var(--sage-primary);
          font-weight: 600;
          transition: all 0.3s ease;
          
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
      }
      
      .q-avatar {
        border: 2px solid var(--sage-primary-light);
        transition: all 0.3s ease;
        
        &:hover {
          border-color: var(--sage-positive);
        }
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
      position: relative;
      margin-top: 2rem;
    }
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
</style>