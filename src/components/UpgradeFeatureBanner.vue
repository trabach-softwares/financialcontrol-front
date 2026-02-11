<!--
  ==========================================================================
  COMPONENTE - UPGRADE FEATURE BANNER
  ==========================================================================
  Propósito: Banner promocional para incentivar upgrade de plano
  Uso: Exibido quando usuário tenta acessar feature bloqueada
  Props: 
    - featureName: Nome da feature bloqueada
    - variant: 'inline' | 'modal' | 'card'
-->

<template>
  <q-card 
    :class="[
      'upgrade-feature-banner',
      `variant-${variant}`,
      { 'q-mb-md': variant === 'inline' }
    ]"
    :flat="variant === 'inline'"
    :bordered="variant !== 'modal'"
  >
    <!-- Header com ícone e badge do plano -->
    <q-card-section class="bg-gradient-primary text-white">
      <div class="row items-center q-gutter-md">
        <q-icon 
          :name="planConfig.icon" 
          size="48px" 
          class="feature-icon"
        />
        <div class="col">
          <div class="text-h6 q-mb-xs">
            {{ planConfig.title }}
          </div>
          <div class="text-subtitle2 text-weight-light">
            {{ planConfig.message }}
          </div>
        </div>
        <q-badge 
          :color="planConfig.badgeColor" 
          :label="planConfig.requiredPlan"
          class="text-bold q-px-md q-py-xs"
          style="font-size: 0.9rem;"
        />
      </div>
    </q-card-section>

    <!-- Lista de features incluídas -->
    <q-card-section v-if="showFeatureList">
      <div class="text-subtitle1 text-weight-medium q-mb-md">
        <q-icon name="star" color="amber" class="q-mr-xs" />
        O que você ganha com o upgrade:
      </div>
      
      <q-list dense class="features-list">
        <q-item 
          v-for="(feature, index) in planConfig.features" 
          :key="index"
          class="q-px-none"
        >
          <q-item-section avatar>
            <q-icon 
              name="check_circle" 
              :color="planConfig.badgeColor" 
              size="20px"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ feature }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- Comparação de planos -->
    <q-card-section v-if="showComparison && variant !== 'inline'" class="bg-grey-1">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section class="text-center">
              <div class="text-grey-6 text-caption">Seu plano atual</div>
              <div class="text-h6 text-weight-bold q-mt-xs">
                {{ currentPlan }}
              </div>
              <q-icon name="trending_flat" size="24px" color="grey-5" class="q-my-sm" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card flat bordered class="bg-primary text-white">
            <q-card-section class="text-center">
              <div class="text-weight-light text-caption">Upgrade para</div>
              <div class="text-h6 text-weight-bold q-mt-xs">
                {{ planConfig.requiredPlan }}
              </div>
              <q-icon name="star" size="24px" class="q-my-sm" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <!-- Ações -->
    <q-card-actions :align="variant === 'modal' ? 'center' : 'right'" class="q-pa-md">
      <q-btn
        v-if="variant === 'modal'"
        flat
        label="Agora não"
        color="grey-7"
        @click="$emit('close')"
        class="q-mr-sm"
      />
      
      <q-btn
        :label="ctaText"
        :color="planConfig.badgeColor"
        unelevated
        :icon-right="variant !== 'inline' ? 'arrow_forward' : undefined"
        :size="variant === 'modal' ? 'lg' : 'md'"
        :class="{ 'q-px-xl': variant === 'modal' }"
        @click="handleUpgrade"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFeaturePermissions } from 'src/composables/useFeaturePermissions'
import { useQuasar } from 'quasar'

// ==========================================================================
// PROPS & EMITS
// ==========================================================================
const props = defineProps({
  featureName: {
    type: String,
    required: true,
    validator: (value) => {
      const validFeatures = [
        'ADVANCED_REPORTS',
        'EXPORT_DATA',
        'BANK_ACCOUNTS',
        'BANK_RECONCILIATION',
        'UNLIMITED_ACCOUNTS',
        'ADVANCED_ANALYTICS'
      ]
      return validFeatures.includes(value)
    }
  },
  variant: {
    type: String,
    default: 'card',
    validator: (value) => ['inline', 'modal', 'card'].includes(value)
  },
  showFeatureList: {
    type: Boolean,
    default: true
  },
  showComparison: {
    type: Boolean,
    default: false
  },
  ctaText: {
    type: String,
    default: 'Fazer Upgrade Agora'
  }
})

const emit = defineEmits(['close', 'upgrade'])

// ==========================================================================
// COMPOSABLES
// ==========================================================================
const router = useRouter()
const $q = useQuasar()
const { getFeatureBlockMessage, currentPlanName } = useFeaturePermissions()

// ==========================================================================
// COMPUTED
// ==========================================================================
const planConfig = computed(() => {
  const blockInfo = getFeatureBlockMessage(props.featureName)
  
  // Determina a cor do badge baseado no plano
  const badgeColor = blockInfo.requiredPlan === 'PREMIUM' ? 'deep-purple' : 'primary'
  const icon = blockInfo.requiredPlan === 'PREMIUM' ? 'workspace_premium' : 'bolt'
  
  return {
    ...blockInfo,
    badgeColor,
    icon
  }
})

const currentPlan = computed(() => currentPlanName.value)

// ==========================================================================
// METHODS
// ==========================================================================
const handleUpgrade = () => {
  emit('upgrade')
  
  // Redireciona para página de planos
  router.push('/plans')
  
  // Feedback visual
  $q.notify({
    message: 'Confira nossos planos e escolha o melhor para você!',
    color: 'primary',
    icon: 'rocket_launch',
    position: 'top'
  })
}
</script>

<style scoped lang="scss">
.upgrade-feature-banner {
  border-radius: 12px;
  overflow: hidden;
  
  &.variant-inline {
    border-left: 4px solid var(--q-primary);
  }
  
  &.variant-modal {
    max-width: 600px;
  }
}

.bg-gradient-primary {
  background: linear-gradient(135deg, var(--q-primary) 0%, #667eea 100%);
}

.feature-icon {
  opacity: 0.9;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.features-list {
  .q-item {
    transition: transform 0.2s;
    
    &:hover {
      transform: translateX(4px);
    }
  }
}
</style>
