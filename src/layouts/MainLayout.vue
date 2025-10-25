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
        <q-avatar size="60px" class="q-mb-md">
          <img src="/favicon.svg" alt="Controle Financeiro" style="width: 100%; height: 100%;" />
        </q-avatar>
        <div class="text-h6 text-grey-8 text-weight-bold">
          Controle Financeiro
        </div>
        <div class="text-caption text-grey-6">
          {{ authStore.userPlan.toUpperCase() }}
        </div>
      </div>

      <q-separator />

      <!-- Navegação principal -->
      <q-list class="sidebar-menu">
        <q-item-label header class="text-grey-6 text-weight-medium q-px-lg">
          MENU PRINCIPAL
        </q-item-label>

        <q-item
          v-for="route in mainMenuRoutes"
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

        <!-- Separador para área administrativa -->
        <template v-if="authStore.isAdmin">
          <q-separator class="q-my-md" />
          
          <q-item-label header class="text-grey-6 text-weight-medium q-px-lg">
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

      <!-- Upgrade para plano superior (se não for premium e não for admin) -->
      <div v-if="authStore.userPlan !== 'premium' && !authStore.isAdmin" class="sidebar-footer q-pa-lg">
        <q-card class="upgrade-card bg-gradient text-white" flat>
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
      </div>
    </q-drawer>

    <!-- ==========================================================================
    HEADER SUPERIOR
    ========================================================================== -->
    <q-header elevated class="main-header bg-white text-grey-8">
      <q-toolbar class="q-px-lg">
        
        <!-- Botão do menu (mobile) -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="lt-lg"
        />

        <!-- Breadcrumbs -->
        <q-breadcrumbs
          class="text-grey-6 q-ml-md"
          active-color="primary"
        >
          <q-breadcrumbs-el 
            :label="getCurrentPageTitle()" 
            :icon="getCurrentPageIcon()"
          />
        </q-breadcrumbs>

        <q-space />

        <!-- Notificações -->
        <q-btn
          flat
          round
          dense
          icon="notifications"
          class="q-mr-sm"
          @click="showNotifications = true"
        >
          <q-badge v-if="notificationCount > 0" color="red" floating>
            {{ notificationCount }}
          </q-badge>
          <q-tooltip>Notificações</q-tooltip>
        </q-btn>

        <!-- Menu do usuário -->
        <q-btn-dropdown
          flat
          no-caps
          class="user-menu-btn"
        >
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-avatar size="32px" color="primary" text-color="white">
                <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
                <q-icon v-else name="person" />
              </q-avatar>
              <div class="text-weight-medium q-ml-sm gt-xs">
                {{ authStore.userDisplayName }}
              </div>
            </div>
          </template>

          <q-list>
            <!-- Informações do usuário -->
            <q-item class="user-info-item">
              <q-item-section avatar>
                <q-avatar size="40px" color="primary" text-color="white">
                  <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
                  <q-icon v-else name="person" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ authStore.userDisplayName }}
                </q-item-label>
                <q-item-label caption>
                  {{ authStore.user?.email }}
                </q-item-label>
                <q-item-label caption>
                  Plano {{ authStore.userPlan }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <!-- Links do menu -->
            <q-item
              v-for="route in userMenuRoutes"
              :key="route.name"
              :to="route.path"
              clickable
              v-close-popup
            >
              <q-item-section avatar>
                <q-icon :name="route.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ route.title }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <!-- Logout -->
            <q-item clickable @click="handleLogout" v-close-popup>
              <q-item-section avatar>
                <q-icon name="logout" color="red-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-red-6">Sair</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
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
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useNotifications } from 'src/composables/useNotifications'
import { getMainMenuRoutes, getAdminMenuRoutes, getUserMenuRoutes } from 'src/router/routes'

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
  console.log('🚪 [MAIN LAYOUT] Processando logout')
  
  try {
    await authStore.logout()
    notifySuccess('Logout realizado com sucesso!')
    router.push('/login')
    
  } catch (error) {
    console.error('❌ [MAIN LAYOUT] Erro no logout:', error.message)
  }
}

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(() => {
  console.log('🚀 [MAIN LAYOUT] Layout principal montado')
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// ESTILOS DO LAYOUT PRINCIPAL
// ==========================================================================

.main-layout {
  // Sidebar
  .main-sidebar {
    background: #fafafa;
    
    .sidebar-header {
      background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
      border-bottom: 1px solid #e0e0e0;
    }
    
    .sidebar-menu {
      .sidebar-item {
        margin: 0 0.5rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: rgba(25, 118, 210, 0.08);
        }
        
        &.sidebar-item-active {
          background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
          color: white;
          
          .q-icon {
            color: white;
          }
        }
      }
    }
    
    .sidebar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      
      .upgrade-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
      }
    }
  }
  
  // Header
  .main-header {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .user-menu-btn {
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
    
    .user-info-item {
      padding: 1rem;
      background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
    }
  }
  
  // Conteúdo principal
  .main-content {
    background-color: #f5f5f5;
  }
}

// Animações
.sidebar-item {
  animation: slideInLeft 0.3s ease;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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