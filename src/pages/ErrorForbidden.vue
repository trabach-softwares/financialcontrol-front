<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="text-center">
      <!-- Illustration -->
      <div class="q-mb-lg">
        <q-icon 
          name="lock" 
          size="120px" 
          color="negative"
          class="animate-pulse"
        />
      </div>

      <!-- Error Code -->
      <div class="text-h1 text-weight-bold text-negative q-mb-md">
        403
      </div>

      <!-- Error Message -->
      <div class="text-h4 text-weight-medium-7 q-mb-sm">
        Acesso Negado
      </div>

      <div class="text-body1 q-mb-xl" style="max-width: 500px;">
        Você não tem permissão para acessar esta página. Verifique se está logado com a conta correta ou entre em contato com o administrador.
      </div>

      <!-- User Info -->
      <div v-if="user" class="q-mb-xl">
        <q-card class="shadow-2" style="max-width: 400px; margin: 0 auto;">
          <q-card-section class="text-center">
            <q-avatar size="60px" class="q-mb-md">
              <img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
              <q-icon v-else name="person" size="40px" color="grey-5" />
            </q-avatar>
            
            <div class="text-h6 text-weight-medium">{{ user.name }}</div>
            <div class="text-body2">{{ user.email }}</div>
            
            <q-chip 
              :color="getPlanColor(authStore.userPlan)" 
              text-color="white" 
              :label="authStore.userPlan"
              class="q-mt-sm"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Reasons -->
      <div class="q-mb-xl">
        <div class="text-h6-7 q-mb-md">Possíveis motivos:</div>
        
        <div class="row justify-center q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <q-card class="shadow-2">
              <q-card-section class="text-center q-pa-md">
                <q-icon name="admin_panel_settings" size="md" color="warning" class="q-mb-sm" />
                <div class="text-subtitle2 text-weight-medium">Área Administrativa</div>
                <div class="text-caption">Esta página é exclusiva para administradores</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-4">
            <q-card class="shadow-2">
              <q-card-section class="text-center q-pa-md">
                <q-icon name="upgrade" size="md" color="primary" class="q-mb-sm" />
                <div class="text-subtitle2 text-weight-medium">Plano Insuficiente</div>
                <div class="text-caption">Recurso disponível apenas para planos premium</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-4">
            <q-card class="shadow-2">
              <q-card-section class="text-center q-pa-md">
                <q-icon name="login" size="md" color="secondary" class="q-mb-sm" />
                <div class="text-subtitle2 text-weight-medium">Sessão Expirada</div>
                <div class="text-caption">Sua sessão pode ter expirado</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="q-gutter-md q-mb-xl">
        <q-btn 
          color="primary" 
          icon="home"
          label="Voltar ao Dashboard"
          @click="goToDashboard"
        />
        
        <q-btn 
          v-if="!isAdmin"
          color="warning" 
          icon="upgrade"
          label="Ver Planos"
          outline
          @click="goToPlans"
        />
        
        <q-btn 
          color="secondary" 
          icon="refresh"
          label="Tentar Novamente"
          outline
          @click="retry"
        />
      </div>

      <!-- Login/Logout Options -->
      <div class="q-mb-lg">
        <div class="text-subtitle2-7 q-mb-md">Opções de conta:</div>
        <div class="q-gutter-sm">
          <q-btn 
            v-if="user"
            color="negative" 
            icon="logout"
            label="Fazer Logout"
            flat
            size="sm"
            @click="handleLogout"
          />
          <q-btn 
            v-else
            color="positive" 
            icon="login"
            label="Fazer Login"
            flat
            size="sm"
            @click="$router.push('/login')"
          />
          <q-btn 
            color="info" 
            icon="person"
            label="Trocar de Conta"
            flat
            size="sm"
            @click="switchAccount"
          />
        </div>
      </div>

      <!-- Help -->
      <div class="text-center">
        <div class="text-body2 q-mb-md">
          Ainda com problemas para acessar?
        </div>
        <div class="q-gutter-sm">
          <q-btn 
            color="primary" 
            icon="help"
            label="Central de Ajuda"
            flat
            size="sm"
            @click="openHelp"
          />
          <q-btn 
            color="secondary" 
            icon="email"
            label="Contatar Suporte"
            flat
            size="sm"
            @click="contactSupport"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'

// Composables
const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showConfirm } = useNotifications()

// Computed
const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.isAdmin)

// Methods
const getPlanName = (plan) => {
  let planKey = plan
  
  if (typeof plan === 'object' && plan?.name) {
    planKey = plan.name.toLowerCase()
  } else if (typeof plan === 'string') {
    planKey = plan.toLowerCase()
  } else {
    planKey = 'free'
  }
  
  const names = {
    'free': 'Gratuito',
    'pro': 'Pro',
    'premium': 'Premium'
  }
  return names[planKey] || 'Gratuito'
}

const getPlanColor = (plan) => {
  let planKey = plan
  
  if (typeof plan === 'object' && plan?.name) {
    planKey = plan.name.toLowerCase()
  } else if (typeof plan === 'string') {
    planKey = plan.toLowerCase()
  } else {
    planKey = 'free'
  }
  
  const colors = {
    'free': 'info',
    'pro': 'warning',
    'premium': 'positive'
  }
  return colors[planKey] || 'grey'
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToPlans = () => {
  router.push('/plans')
}

const retry = () => {
  // Retry current route or go back
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const handleLogout = async () => {
  const confirmed = await showConfirm(
    'Confirmar Logout',
    'Tem certeza que deseja sair da sua conta?',
    'Sair',
    'Cancelar'
  )
  
  if (confirmed) {
    authStore.logout()
    router.push('/login')
    showSuccess('Logout realizado com sucesso!')
  }
}

const switchAccount = () => {
  authStore.logout()
  router.push('/login')
}

const openHelp = () => {
  // In a real app, this would open a help center or documentation
  window.open('https://help.financialcontrol.com', '_blank')
}

const contactSupport = () => {
  // In a real app, this would open a support ticket form or email client
  window.open('mailto:suporte@financialcontrol.com?subject=Problema de Acesso - Página 403', '_blank')
}
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.shadow-2 {
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
}
</style>