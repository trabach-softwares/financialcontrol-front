<template>
  <q-page class="flex flex-center feature-forbidden-page">
    <div class="text-center q-pa-lg" style="max-width: 700px;">
      
      <!-- Ícone de cadeado premium -->
      <div class="lock-icon-wrapper q-mb-lg">
        <q-icon name="lock" size="120px" class="lock-icon" />
        <div class="lock-glow"></div>
      </div>

      <!-- Título e mensagem -->
      <h1 class="text-h3 text-weight-bold q-mb-md premium-gradient-text">
        {{ featureTitle }}
      </h1>
      
      <p class="text-h6 text-grey-7 q-mb-lg">
        {{ featureMessage }}
      </p>

      <!-- Badge de plano requerido -->
      <div class="q-mb-xl">
        <q-chip 
          color="deep-purple" 
          text-color="white" 
          icon="workspace_premium"
          size="lg"
          class="premium-chip"
        >
          <span class="text-weight-bold">REQUER PLANO {{ requiredPlan }}</span>
        </q-chip>
      </div>

      <!-- Botões de ação -->
      <div class="row q-col-gutter-md justify-center">
        <div class="col-12 col-sm-6 col-md-4">
          <q-btn
            unelevated
            color="primary"
            label="Ver Planos"
            icon="rocket_launch"
            size="lg"
            class="full-width"
            no-caps
            @click="goToPlans"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-btn
            outline
            color="grey-7"
            label="Voltar ao Início"
            icon="home"
            size="lg"
            class="full-width"
            no-caps
            @click="goToDashboard"
          />
        </div>
      </div>

      <!-- Informação adicional -->
      <div class="q-mt-xl text-caption text-grey-6">
        Seu plano atual: <strong>{{ currentPlan }}</strong>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useFeaturePermissions } from 'src/composables/useFeaturePermissions'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { getFeatureBlockMessage, currentPlanName } = useFeaturePermissions()

// Obtém informações da feature bloqueada via query params
const featureName = computed(() => route.query.feature || 'bank-accounts')
const requiredPlan = computed(() => route.query.requiredPlan || 'PREMIUM')
const redirectPath = computed(() => route.query.redirect || '/dashboard')

// Obtém mensagens personalizadas para a feature
const featureInfo = computed(() => {
  const featureKey = featureName.value.toUpperCase().replace(/-/g, '_')
  return getFeatureBlockMessage(featureKey)
})

const featureTitle = computed(() => featureInfo.value.title)
const featureMessage = computed(() => featureInfo.value.message)
const currentPlan = computed(() => currentPlanName.value)

// Navega para planos
const goToPlans = () => {
  router.push('/plans')
}

// Volta ao dashboard
const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style lang="scss" scoped>
.feature-forbidden-page {
  min-height: calc(100vh - 100px);
}

.lock-icon-wrapper {
  position: relative;
  display: inline-block;
}

.lock-icon {
  color: #764ba2;
  filter: drop-shadow(0 8px 20px rgba(118, 75, 162, 0.4));
  position: relative;
  z-index: 2;
}

.lock-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 0.8;
  }
}

.premium-gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.premium-chip {
  padding: 12px 28px;
  font-size: 1.1rem;
  box-shadow: 0 6px 20px rgba(103, 58, 183, 0.4);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% {
    box-shadow: 0 6px 20px rgba(103, 58, 183, 0.4);
  }
  50% {
    box-shadow: 0 8px 28px rgba(103, 58, 183, 0.6);
  }
}
</style>
