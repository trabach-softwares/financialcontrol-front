<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-negative text-white">
      <q-toolbar>
        <!-- Menu Toggle -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- Logo/Title -->
        <q-toolbar-title class="text-weight-bold">
          <q-icon name="admin_panel_settings" class="q-mr-sm" />
          Painel Administrativo
        </q-toolbar-title>

        <!-- Search (Admin) -->
        <q-input
          v-model="searchQuery"
          dense
          standout
          placeholder="Pesquisar usuários, planos..."
          class="q-mx-md"
          style="max-width: 300px;"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Admin Actions -->
        <div class="q-gutter-sm">
          <!-- Notifications -->
          <q-btn flat round icon="notifications" @click="showNotifications">
            <q-badge v-if="adminNotifications > 0" color="warning" floating>
              {{ adminNotifications }}
            </q-badge>
          </q-btn>

          <!-- System Status -->
          <q-btn flat round icon="health_and_safety" @click="showSystemStatus">
            <q-tooltip>Status do Sistema</q-tooltip>
          </q-btn>

          <!-- User Menu -->
          <q-btn-dropdown flat round icon="account_circle">
            <q-list>
              <!-- User Info -->
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="40px">
                    <img v-if="user?.avatar" :src="user.avatar" alt="Avatar" />
                    <q-icon v-else name="admin_panel_settings" color="negative" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ user?.name }}</q-item-label>
                  <q-item-label caption>{{ user?.email }}</q-item-label>
                  <q-chip color="negative" text-color="white" size="sm" class="q-mt-xs">
                    ADMINISTRADOR
                  </q-chip>
                </q-item-section>
              </q-item>

              <q-separator />

              <!-- Menu Items -->
              <q-item clickable @click="$router.push('/profile')">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Meu Perfil</q-item-section>
              </q-item>

              <q-item clickable @click="$router.push('/dashboard')">
                <q-item-section avatar>
                  <q-icon name="dashboard" />
                </q-item-section>
                <q-item-section>Área do Usuário</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section>Sair</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
      :width="280"
    >
      <!-- Drawer Header -->
      <q-item class="bg-negative text-white">
        <q-item-section avatar>
          <q-icon name="shield" size="md" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6 text-weight-bold">Admin Panel</q-item-label>
          <q-item-label caption class="text-white">Sistema de Gestão</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Navigation Menu -->
      <q-list padding>
        <!-- Dashboard Admin -->
        <q-item
          clickable
          :active="$route.name === 'admin-dashboard'"
          active-class="bg-negative text-white"
          @click="$router.push('/admin/dashboard')"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
            <q-item-label caption>Visão geral do sistema</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Users Management -->
        <q-item
          clickable
          :active="$route.name === 'admin-users'"
          active-class="bg-negative text-white"
          @click="$router.push('/admin/users')"
        >
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Usuários</q-item-label>
            <q-item-label caption>Gerenciar usuários</q-item-label>
          </q-item-section>
          <q-item-section side v-if="userStats.total">
            <q-badge color="info">{{ userStats.total }}</q-badge>
          </q-item-section>
        </q-item>

        <!-- Plans Management -->
        <q-item
          clickable
          :active="$route.name === 'admin-plans'"
          active-class="bg-negative text-white"
          @click="$router.push('/admin/plans')"
        >
          <q-item-section avatar>
            <q-icon name="card_membership" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Planos</q-item-label>
            <q-item-label caption>Gestão de assinaturas</q-item-label>
          </q-item-section>
        </q-item>

        <!-- System Settings -->
        <q-item
          clickable
          :active="$route.name === 'admin-system'"
          active-class="bg-negative text-white"
          @click="$router.push('/admin/system')"
        >
          <q-item-section avatar>
            <q-icon name="settings_applications" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sistema</q-item-label>
            <q-item-label caption>Configurações globais</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Analytics -->
        <q-expansion-item
          icon="analytics"
          label="Análises"
          caption="Relatórios e estatísticas"
        >
          <q-item clickable class="q-pl-lg">
            <q-item-section avatar>
              <q-icon name="trending_up" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Crescimento</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="q-pl-lg">
            <q-item-section avatar>
              <q-icon name="pie_chart" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Distribuição</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="q-pl-lg">
            <q-item-section avatar>
              <q-icon name="assessment" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Relatórios</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <!-- Tools -->
        <q-expansion-item
          icon="build"
          label="Ferramentas"
          caption="Utilitários do sistema"
        >
          <q-item clickable class="q-pl-lg" @click="showDatabaseManager">
            <q-item-section avatar>
              <q-icon name="storage" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Banco de Dados</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="q-pl-lg" @click="showBackupManager">
            <q-item-section avatar>
              <q-icon name="backup" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Backups</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="q-pl-lg" @click="showLogViewer">
            <q-item-section avatar>
              <q-icon name="description" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Logs do Sistema</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-separator class="q-my-md" />

        <!-- Back to User Area -->
        <q-item
          clickable
          class="text-primary"
          @click="$router.push('/dashboard')"
        >
          <q-item-section avatar>
            <q-icon name="arrow_back" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Voltar ao Sistema</q-item-label>
            <q-item-label caption>Área do usuário</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- System Status Footer -->
      <div class="absolute-bottom q-pa-md">
        <q-card class="bg-grey-3">
          <q-card-section class="q-pa-sm">
            <div class="text-caption text-weight-bold text-center">
              Status do Sistema
            </div>
            <div class="row items-center q-mt-xs">
              <div class="col">
                <q-icon name="circle" :color="systemStatus.status === 'online' ? 'positive' : 'negative'" size="xs" />
                <span class="q-ml-xs text-caption">{{ systemStatus.status === 'online' ? 'Online' : 'Offline' }}</span>
              </div>
              <div class="col-auto">
                <span class="text-caption">{{ systemStatus.uptime }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <div class="full-width row items-center justify-between">
          <div class="text-caption">
            © {{ currentYear }} Controle Financeiro - Painel Administrativo
          </div>
          <div class="text-caption">
            Versão {{ appVersion }} | Ambiente: {{ environment }}
          </div>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotifications } from '../composables/useNotifications'

// Composables
const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showInfo } = useNotifications()

// Refs
const leftDrawerOpen = ref(true)
const searchQuery = ref('')
const adminNotifications = ref(3)

// Stats
const userStats = ref({
  total: 1250,
  active: 1180,
  new: 45
})

const systemStatus = ref({
  status: 'online',
  uptime: '99.9%'
})

// Computed
const user = computed(() => authStore.user)
const currentYear = computed(() => new Date().getFullYear())
const appVersion = computed(() => '2.1.0')
const environment = computed(() => 'production')

// Methods
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const showNotifications = () => {
  showInfo('Você tem 3 notificações administrativas pendentes')
}

const showSystemStatus = () => {
  showInfo('Sistema funcionando normalmente - Uptime: 99.9%')
}

const showDatabaseManager = () => {
  showInfo('Abrindo gerenciador de banco de dados...')
}

const showBackupManager = () => {
  showInfo('Abrindo gerenciador de backups...')
}

const showLogViewer = () => {
  showInfo('Abrindo visualizador de logs...')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  showSuccess('Logout do painel administrativo realizado com sucesso!')
}

// Lifecycle
onMounted(() => {
  // Load admin-specific data
  console.log('Admin layout loaded')
})
</script>

<style scoped>
.bg-negative {
  background-color: #f44336;
}
</style>