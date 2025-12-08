<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
    transition-show="scale"
    transition-hide="scale"
    maximized
    class="premium-dialog-wrapper"
  >
    <q-card class="premium-feature-dialog" :style="cardStyle">
      <!-- Background decorativo com gradiente premium -->
      <div class="premium-background"></div>
      
      <!-- Conteúdo do Dialog com SCROLL -->
      <q-card-section class="relative-position text-center q-pa-xl scroll-section">
        <!-- Ícone principal com crown -->
        <div class="premium-icon-wrapper q-mb-lg">
          <q-icon 
            name="workspace_premium" 
            size="120px" 
            class="premium-icon"
          />
          <div class="icon-crown">
            <q-icon name="military_tech" size="40px" color="amber" />
          </div>
          <div class="icon-glow-premium"></div>
        </div>

        <!-- Título e subtítulo -->
        <div class="premium-title-section q-mb-lg">
          <h4 class="text-h4 text-weight-bold q-mb-sm premium-title">
            {{ title }}
          </h4>
          <p class="text-h6 text-grey-7 premium-subtitle">
            {{ subtitle }}
          </p>
        </div>

        <!-- Badge do plano requerido -->
        <div class="required-plan-badge q-mb-lg">
          <q-chip 
            :color="requiredPlanColor" 
            text-color="white" 
            icon="shield"
            size="lg"
            class="plan-chip"
          >
            <span class="text-weight-bold">REQUER PLANO {{ requiredPlan }}</span>
          </q-chip>
        </div>

        <!-- Mensagem principal -->
        <div class="premium-message-box q-pa-md q-mb-lg">
          <div class="row items-start q-gutter-sm">
            <q-icon name="lock" size="28px" color="amber" />
            <div class="col text-left">
              <div class="text-weight-medium q-mb-xs">Feature Bloqueada</div>
              <div class="text-body2">{{ message }}</div>
            </div>
          </div>
        </div>

        <!-- Features desta funcionalidade -->
        <div class="premium-features q-mb-xl">
          <div class="text-subtitle1 text-weight-bold q-mb-md text-left">
            🌟 O que você terá com o plano {{ requiredPlan }}:
          </div>
          <div class="features-list">
            <div 
              v-for="(feature, index) in features" 
              :key="index"
              class="feature-item"
            >
              <q-icon name="check_circle" color="positive" size="20px" />
              <span class="q-ml-sm">{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Badge de benefício -->
        <div class="benefit-badge q-mb-lg">
          <q-chip 
            color="deep-purple" 
            text-color="white" 
            icon="auto_awesome"
            size="lg"
            class="benefit-chip-premium"
          >
            <span class="text-weight-bold">{{ benefitText }}</span>
          </q-chip>
        </div>

        <!-- Informação adicional de suporte -->
        <div class="support-info q-mt-md q-mb-xl">
          <q-icon name="support_agent" size="20px" color="primary" class="q-mr-xs" />
          <span class="text-caption text-grey-7">Suporte prioritário incluído em planos premium</span>
        </div>
      </q-card-section>

      <!-- Botões de ação -->
      <q-card-actions class="q-pa-lg q-pt-none">
        <div class="full-width column q-gutter-md">
          <!-- Botão principal - Upgrade -->
          <q-btn
            unelevated
            size="lg"
            class="upgrade-btn-premium full-width"
            no-caps
            @click="handleUpgrade"
          >
            <q-icon name="rocket_launch" size="24px" class="q-mr-sm" />
            <span class="text-h6 text-weight-bold">{{ upgradeButtonText }}</span>
          </q-btn>

          <!-- Botão secundário - Ver comparação de planos -->
          <q-btn
            outline
            size="md"
            color="primary"
            class="full-width"
            no-caps
            @click="handleComparePlans"
          >
            <q-icon name="compare_arrows" size="20px" class="q-mr-xs" />
            Comparar Planos
          </q-btn>

          <!-- Botão terciário - Voltar -->
          <q-btn
            flat
            size="md"
            color="grey-7"
            class="full-width"
            no-caps
            @click="handleClose"
          >
            {{ closeButtonText }}
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Feature Premium 💎'
  },
  subtitle: {
    type: String,
    default: 'Esta funcionalidade é exclusiva de planos superiores'
  },
  message: {
    type: String,
    default: 'Para acessar esta funcionalidade, faça upgrade para um plano superior.'
  },
  features: {
    type: Array,
    default: () => [
      'Acesso completo à funcionalidade',
      'Suporte prioritário',
      'Atualizações exclusivas'
    ]
  },
  requiredPlan: {
    type: String,
    default: 'PREMIUM'
  },
  currentPlan: {
    type: String,
    default: 'FREE'
  },
  upgradeButtonText: {
    type: String,
    default: 'Fazer Upgrade para Premium'
  },
  closeButtonText: {
    type: String,
    default: 'Voltar'
  },
  benefitText: {
    type: String,
    default: 'Desbloqueie todo o potencial! 🚀'
  }
})

const emit = defineEmits(['update:modelValue', 'upgrade', 'compare-plans', 'close'])

const router = useRouter()
const $q = useQuasar()

// Cores por plano
const planColors = {
  'FREE': 'grey-6',
  'BASIC': 'grey-6',
  'GRATUITO': 'grey-6',
  'PRO': 'deep-orange-6',
  'PROFESSIONAL': 'deep-orange-6',
  'PREMIUM': 'deep-purple-6',
  'ENTERPRISE': 'deep-purple-6'
}

// Cor do plano requerido
const requiredPlanColor = computed(() => {
  return planColors[props.requiredPlan] || 'deep-purple-6'
})

// Cor do plano atual
const currentPlanColor = computed(() => {
  return planColors[props.currentPlan] || 'grey-6'
})

// Estilo dinâmico do card
const cardStyle = computed(() => {
  return {
    minWidth: $q.screen.lt.sm ? '90vw' : '650px',
    maxWidth: $q.screen.lt.sm ? '95vw' : '750px',
    borderRadius: '24px',
    overflow: 'hidden'
  }
})

// Handler de upgrade
const handleUpgrade = () => {
  emit('upgrade')
  emit('update:modelValue', false)
  
  // Notificação de redirecionamento
  $q.notify({
    type: 'info',
    message: 'Redirecionando para planos premium...',
    position: 'top',
    timeout: 1500,
    icon: 'workspace_premium'
  })
  
  // Redirecionar para página de planos
  setTimeout(() => {
    router.push('/plans')
  }, 300)
}

// Handler de comparar planos
const handleComparePlans = () => {
  emit('compare-plans')
  emit('update:modelValue', false)
  
  // Redirecionar para página de planos
  router.push('/plans')
}

// Handler de fechar
const handleClose = () => {
  emit('close')
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
@import '../css/index.scss';
// ==========================================================================
// DIALOG WRAPPER - Permite scroll em mobile
// ==========================================================================
:deep(.premium-dialog-wrapper) {
  .q-dialog__inner {
    padding: 0 !important;
    
    @media (max-width: 600px) {
      padding: 0 !important;
    }
  }
}

.premium-feature-dialog {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  
  // Mobile: permite scroll
  @media (max-width: 600px) {
    max-height: 100vh;
    height: 100vh;
    margin: 0;
    border-radius: 0 !important;
  }
}

// Seção com scroll
.scroll-section {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 200px);
  
  // Scroll suave
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 600px) {
    max-height: calc(100vh - 180px);
    padding: 1.5rem !important;
  }
  
  // Customiza scrollbar
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    
    &:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
  }
}

// Dark mode support
.body--dark .premium-feature-dialog {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

// Background decorativo premium
.premium-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  opacity: 0.12;
  z-index: 0;
}

// Ícone principal
.premium-icon-wrapper {
  position: relative;
  display: inline-block;
  z-index: 1;
}

.premium-icon {
  color: #764ba2;
  filter: drop-shadow(0 6px 16px rgba(118, 75, 162, 0.4));
  position: relative;
  z-index: 2;
}

.icon-crown {
  position: absolute;
  top: -10px;
  right: -5px;
  z-index: 3;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.icon-glow-premium {
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
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

// Títulos
.premium-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  position: relative;
  z-index: 1;
}

.premium-subtitle {
  position: relative;
  z-index: 1;
}

// Badge do plano requerido
.required-plan-badge {
  position: relative;
  z-index: 1;
}

.plan-chip {
  padding: 10px 24px;
  font-size: 1.05rem;
  box-shadow: 0 6px 20px rgba(118, 75, 162, 0.3);
}

// Message box
.premium-message-box {
  background: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
  border-radius: 12px;
  position: relative;
  z-index: 1;
}

// Features list
.premium-features {
  position: relative;
  z-index: 1;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 550px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  text-align: left;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.body--dark .feature-item {
  background: rgba(255, 255, 255, 0.05);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

// Benefit badge
.benefit-badge {
  position: relative;
  z-index: 1;
}

.benefit-chip-premium {
  padding: 10px 24px;
  font-size: 1.05rem;
  box-shadow: 0 6px 20px rgba(103, 58, 183, 0.4);
  animation: shimmer-premium 3s ease-in-out infinite;
}

@keyframes shimmer-premium {
  0%, 100% {
    box-shadow: 0 6px 20px rgba(103, 58, 183, 0.4);
  }
  50% {
    box-shadow: 0 8px 28px rgba(103, 58, 183, 0.6);
  }
}

// Support info
.support-info {
  position: relative;
  z-index: 1;
  opacity: 0.8;
}

// Botões
.upgrade-btn-premium {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 16px 32px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
  }
  
  &:active {
    transform: translateY(-1px);
  }
}

// ==========================================================================
// RESPONSIVIDADE MOBILE
// ==========================================================================
@media (max-width: 600px) {
  .premium-title {
    font-size: 1.5rem !important;
  }
  
  .premium-subtitle {
    font-size: 1rem !important;
  }
  
  .premium-icon {
    font-size: 80px !important;
  }
  
  .icon-crown {
    top: -5px;
    right: 0;
    
    :deep(.q-icon) {
      font-size: 28px !important;
    }
  }
  
  .premium-icon-wrapper {
    margin-bottom: 1rem !important;
  }
  
  .features-list {
    gap: 8px;
  }
  
  .feature-item {
    padding: 10px;
    font-size: 0.9rem;
  }
  
  .plan-chip {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  .benefit-chip-premium {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  // Botões mobile
  :deep(.q-card-actions) {
    padding: 1rem !important;
    position: sticky;
    bottom: 0;
    background: linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 50%, transparent 100%);
    backdrop-filter: blur(10px);
    z-index: 10;
  }
  
  .body--dark :deep(.q-card-actions) {
    background: linear-gradient(to top, rgba(26,26,26,0.98) 0%, rgba(26,26,26,0.95) 50%, transparent 100%);
  }
}
</style>
