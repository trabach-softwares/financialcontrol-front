<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="text-center">
      <!-- Illustration -->
      <div class="q-mb-lg">
        <q-icon 
          name="sentiment_very_dissatisfied" 
          size="120px" 
          color="grey-4"
          class="animate-bounce"
        />
      </div>

      <!-- Error Code -->
      <div class="text-h1 text-weight-bold text-grey-6 q-mb-md">
        404
      </div>

      <!-- Error Message -->
      <div class="text-h4 text-weight-medium text-grey-7 q-mb-sm">
        Página Não Encontrada
      </div>

      <div class="text-body1 text-grey-6 q-mb-xl" style="max-width: 400px;">
        Oops! A página que você está procurando não existe ou foi movida para outro local.
      </div>

      <!-- Suggestions -->
      <div class="q-mb-xl">
        <div class="text-h6 text-grey-7 q-mb-md">O que você pode fazer:</div>
        
        <div class="row justify-center q-col-gutter-md">
          <div class="col-12 col-sm-auto">
            <q-card class="shadow-2 cursor-pointer hover-card" @click="goHome">
              <q-card-section class="text-center q-pa-md">
                <q-icon name="home" size="md" color="primary" class="q-mb-sm" />
                <div class="text-subtitle2 text-weight-medium">Ir para o Dashboard</div>
                <div class="text-caption text-grey-6">Voltar à página inicial</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-auto">
            <q-card class="shadow-2 cursor-pointer hover-card" @click="goBack">
              <q-card-section class="text-center q-pa-md">
                <q-icon name="arrow_back" size="md" color="secondary" class="q-mb-sm" />
                <div class="text-subtitle2 text-weight-medium">Página Anterior</div>
                <div class="text-caption text-grey-6">Voltar aonde estava</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-auto">
            <q-card class="shadow-2 cursor-pointer hover-card" @click="goToTransactions">
              <q-card-section class="text-center q-pa-md">
                <q-icon name="receipt_long" size="md" color="positive" class="q-mb-sm" />
                <div class="text-subtitle2 text-weight-medium">Transações</div>
                <div class="text-caption text-grey-6">Ver suas transações</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="q-mb-lg" style="max-width: 400px;">
        <q-input
          v-model="searchTerm"
          placeholder="Pesquisar página..."
          filled
          @keydown.enter="handleSearch"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-btn 
              color="primary" 
              icon="search" 
              flat
              @click="handleSearch"
            />
          </template>
        </q-input>
      </div>

      <!-- Popular Links -->
      <div class="text-center">
        <div class="text-subtitle2 text-grey-7 q-mb-md">Páginas Populares:</div>
        <div class="q-gutter-sm">
          <q-btn 
            color="primary" 
            label="Dashboard"
            icon="dashboard" 
            outline 
            size="sm"
            @click="$router.push('/dashboard')"
          />
          <q-btn 
            color="secondary" 
            label="Transações"
            icon="receipt_long" 
            outline 
            size="sm"
            @click="$router.push('/transactions')"
          />
          <q-btn 
            color="positive" 
            label="Relatórios"
            icon="assessment" 
            outline 
            size="sm"
            @click="$router.push('/reports')"
          />
          <q-btn 
            color="info" 
            label="Perfil"
            icon="person" 
            outline 
            size="sm"
            @click="$router.push('/profile')"
          />
        </div>
      </div>

      <!-- Contact Support -->
      <div class="q-mt-xl">
        <div class="text-body2 text-grey-6">
          Ainda precisa de ajuda? 
          <a 
            href="mailto:suporte@financialcontrol.com" 
            class="text-primary text-decoration-none"
          >
            Entre em contato conosco
          </a>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

// Composables
const router = useRouter()
const { showInfo } = useNotifications()

// Refs
const searchTerm = ref('')

// Methods
const goHome = () => {
  router.push('/dashboard')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const goToTransactions = () => {
  router.push('/transactions')
}

const handleSearch = () => {
  if (!searchTerm.value.trim()) {
    showInfo('Digite algo para pesquisar')
    return
  }

  // Simple search logic - redirect to most relevant page
  const term = searchTerm.value.toLowerCase()
  
  if (term.includes('dashboard') || term.includes('inicio') || term.includes('painel')) {
    router.push('/dashboard')
  } else if (term.includes('transac') || term.includes('movimento') || term.includes('lancament')) {
    router.push('/transactions')
  } else if (term.includes('relatorio') || term.includes('grafico') || term.includes('analise')) {
    router.push('/reports')
  } else if (term.includes('perfil') || term.includes('conta') || term.includes('usuario')) {
    router.push('/profile')
  } else if (term.includes('plano') || term.includes('assinatura') || term.includes('premium')) {
    router.push('/plans')
  } else if (term.includes('config') || term.includes('prefer')) {
    router.push('/settings')
  } else {
    showInfo('Nenhuma página encontrada para esta pesquisa')
  }
}
</script>

<style scoped>
.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.shadow-2 {
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
}
</style>