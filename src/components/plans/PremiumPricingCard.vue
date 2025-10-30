<template>
  <q-card 
    class="premium-pricing-card" 
    :class="{
      'most-popular': plan.isMostPopular,
      'current-plan': isCurrentPlan,
      'recommended': plan.isRecommended
    }"
    flat
    @mouseover="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
    
    <!-- Badge Superior (Popular/Recomendado) -->
    <div v-if="plan.isMostPopular || plan.isRecommended" class="plan-badge">
      <div class="badge-content">
        <q-icon 
          :name="plan.isMostPopular ? 'trending_up' : 'recommend'" 
          size="xs" 
          class="q-mr-xs"
        />
        {{ plan.isMostPopular ? 'MAIS POPULAR' : 'RECOMENDADO' }}
      </div>
    </div>

    <!-- Cabeçalho do Plano -->
    <q-card-section class="plan-header" :class="`bg-${planColorClass}`">
      <div class="plan-icon-wrapper">
        <q-icon :name="planIcon" size="2.5rem" class="plan-main-icon" />
      </div>
      
      <div class="plan-title-section">
        <h4 class="plan-name">{{ plan.name }}</h4>
        <p class="plan-subtitle">{{ plan.description }}</p>
      </div>

      <!-- Preço Principal -->
      <div class="pricing-section">
        <div v-if="plan.price === 0" class="price-free">
          <span class="price-label">GRATUITO</span>
        </div>
        <div v-else class="price-wrapper">
          <div class="currency-symbol">R$</div>
          <div class="price-main">
            {{ getPriceForCycle(plan.price, billingCycle) }}
          </div>
          <div class="price-period">/{{ billingCycle === 'monthly' ? 'mês' : 'ano' }}</div>
        </div>
        
        <!-- Desconto Anual -->
        <div v-if="billingCycle === 'yearly' && plan.price > 0" class="discount-info">
          <div class="original-price">
            <s>R$ {{ plan.price }}/mês</s>
          </div>
          <div class="savings">
            <q-icon name="savings" size="xs" />
            Economize {{ getSavingsPercent(plan.price) }}%
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Lista de Recursos -->
    <q-card-section class="features-section">
      <div class="features-title">
        <q-icon name="verified_user" class="q-mr-sm" />
        O que está incluso:
      </div>
      
      <div class="features-list">
        <div 
          v-for="(feature, index) in processedFeatures" 
          :key="index" 
          class="feature-item"
          :class="{ 'feature-highlighted': feature.highlighted }"
        >
          <q-icon 
            :name="feature.included ? 'check_circle' : 'cancel'"
            :color="feature.included ? 'positive' : 'grey-5'"
            class="feature-icon"
          />
          <span 
            class="feature-text"
            :class="{ 'feature-disabled': !feature.included }"
          >
            {{ feature.text }}
          </span>
          <q-icon 
            v-if="feature.highlighted" 
            name="new_releases" 
            color="orange" 
            size="xs"
            class="feature-highlight-icon"
          />
        </div>
      </div>

      <!-- Limitações -->
      <div v-if="plan.limitations && plan.limitations.length > 0" class="limitations-section">
        <div class="limitations-title">
          <q-icon name="info" class="q-mr-sm" />
          Limitações:
        </div>
        <div 
          v-for="(limitation, index) in plan.limitations" 
          :key="index"
          class="limitation-item"
        >
          <q-icon name="info_outline" color="orange-6" size="xs" class="q-mr-sm" />
          {{ limitation }}
        </div>
      </div>
    </q-card-section>

    <!-- Ação Principal -->
    <q-card-actions class="action-section">
      <!-- Plano Atual -->
      <q-btn
        v-if="isCurrentPlan"
        class="action-btn current-plan-btn"
        flat
        no-caps
        disable
      >
        <q-icon name="verified" class="q-mr-sm" />
        Plano Atual
      </q-btn>

      <!-- Upgrade -->
      <q-btn
        v-else-if="isUpgrade"
        class="action-btn upgrade-btn"
        :color="planColorClass"
        unelevated
        no-caps
        :loading="loading"
        @click="handlePlanSelection"
      >
        <q-icon name="upgrade" class="q-mr-sm" />
        Fazer Upgrade
        <q-tooltip class="bg-dark">
          Upgrade imediato com acesso a novos recursos
        </q-tooltip>
      </q-btn>

      <!-- Downgrade -->
      <q-btn
        v-else-if="isDowngrade"
        class="action-btn downgrade-btn"
        :color="planColorClass"
        outline
        no-caps
        :loading="loading"
        @click="handlePlanSelection"
      >
        <q-icon name="trending_down" class="q-mr-sm" />
        Alterar Plano
        <q-tooltip class="bg-dark">
          Alteração aplicada no próximo ciclo de cobrança
        </q-tooltip>
      </q-btn>

      <!-- Começar Agora (para usuários sem plano) -->
      <q-btn
        v-else
        class="action-btn start-btn"
        :color="planColorClass"
        unelevated
        no-caps
        :loading="loading"
        @click="handlePlanSelection"
      >
        <q-icon name="rocket_launch" class="q-mr-sm" />
        {{ plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora' }}
      </q-btn>

      <!-- Trial Info -->
      <div v-if="plan.trial && plan.price > 0" class="trial-info">
        <q-icon name="schedule" size="xs" class="q-mr-xs" />
        {{ plan.trial }} dias grátis
      </div>
    </q-card-actions>

    <!-- Garantia -->
    <div v-if="plan.price > 0" class="guarantee-section">
      <div class="guarantee-content">
        <q-icon name="shield" size="sm" class="guarantee-icon" />
        <span class="guarantee-text">Garantia de 30 dias ou seu dinheiro de volta</span>
      </div>
    </div>

  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'

// ==========================================================================
// PROPS & EMITS
// ==========================================================================
const props = defineProps({
  plan: {
    type: Object,
    required: true,
    validator: (plan) => {
      return plan && 
             typeof plan.name === 'string' && 
             typeof plan.price === 'number'
    }
  },
  billingCycle: {
    type: String,
    default: 'monthly',
    validator: (value) => ['monthly', 'yearly'].includes(value)
  },
  currentPlan: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select-plan'])

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const isHovered = ref(false)

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================

/**
 * Cor principal do plano baseada no tipo
 */
const planColorClass = computed(() => {
  const name = props.plan.name.toLowerCase()
  
  if (name.includes('free') || name.includes('gratuito')) return 'primary'
  if (name.includes('pro') || name.includes('professional')) return 'warning'
  if (name.includes('premium') || name.includes('enterprise')) return 'positive'
  
  return 'primary'
})

/**
 * Ícone do plano baseado no tipo
 */
const planIcon = computed(() => {
  const name = props.plan.name.toLowerCase()
  
  if (name.includes('free') || name.includes('gratuito')) return 'bolt'
  if (name.includes('pro') || name.includes('professional')) return 'star'
  if (name.includes('premium') || name.includes('enterprise')) return 'diamond'
  
  return 'workspace_premium'
})

/**
 * Verifica se é o plano atual do usuário
 */
const isCurrentPlan = computed(() => {
  return props.currentPlan && 
         props.currentPlan.toLowerCase() === props.plan.name.toLowerCase()
})

/**
 * Verifica se é um upgrade
 */
const isUpgrade = computed(() => {
  if (!props.currentPlan) return false
  
  const planHierarchy = ['free', 'pro', 'premium']
  const currentIndex = planHierarchy.indexOf(props.currentPlan.toLowerCase())
  const targetIndex = planHierarchy.indexOf(props.plan.name.toLowerCase())
  
  return targetIndex > currentIndex
})

/**
 * Verifica se é um downgrade
 */
const isDowngrade = computed(() => {
  if (!props.currentPlan) return false
  
  const planHierarchy = ['free', 'pro', 'premium']
  const currentIndex = planHierarchy.indexOf(props.currentPlan.toLowerCase())
  const targetIndex = planHierarchy.indexOf(props.plan.name.toLowerCase())
  
  return targetIndex < currentIndex && targetIndex !== -1
})

/**
 * Processa os features do plano para renderização
 */
const processedFeatures = computed(() => {
  if (!props.plan.features || !Array.isArray(props.plan.features)) {
    return []
  }
  
  return props.plan.features.map(feature => {
    // Se o feature já é um objeto, usa ele diretamente
    if (typeof feature === 'object' && feature !== null) {
      return {
        text: feature.text || feature.name || String(feature),
        included: feature.included !== false, // Por padrão true, a menos que explicitamente false
        highlighted: feature.highlighted || false
      }
    }
    
    // Se é uma string, cria objeto padrão
    if (typeof feature === 'string') {
      return {
        text: feature,
        included: true,
        highlighted: false
      }
    }
    
    // Fallback para outros tipos
    return {
      text: String(feature),
      included: true,
      highlighted: false
    }
  })
})

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Calcula o preço baseado no ciclo de cobrança
 */
const getPriceForCycle = (monthlyPrice, cycle) => {
  if (monthlyPrice === 0) return '0'
  
  if (cycle === 'yearly') {
    // 20% de desconto para pagamento anual
    const yearlyPrice = monthlyPrice * 12 * 0.8
    return Math.floor(yearlyPrice).toString()
  }
  
  return monthlyPrice.toString()
}

/**
 * Calcula a porcentagem de economia no plano anual
 */
const getSavingsPercent = (monthlyPrice) => {
  return 20 // Fixo: 20% de desconto
}

/**
 * Manipula hover do card
 */
const handleHover = (hovered) => {
  isHovered.value = hovered
}

/**
 * Manipula seleção do plano
 */
const handlePlanSelection = () => {
  emit('select-plan', {
    plan: props.plan,
    billingCycle: props.billingCycle,
    action: isUpgrade.value ? 'upgrade' : isDowngrade.value ? 'downgrade' : 'subscribe'
  })
}
</script>

<style lang="scss" scoped>
.premium-pricing-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  background: white;
  
  // Gradiente sutil de fundo
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.02) 100%);
    pointer-events: none;
    z-index: 0;
  }
  
  // Estados especiais
  &.most-popular {
    border-color: #f57c00;
    transform: scale(1.05);
    box-shadow: 0 20px 40px rgba(245, 124, 0, 0.2);
  }
  
  &.recommended {
    border-color: var(--color-primary);
    box-shadow: 0 15px 30px rgba(44, 95, 45, 0.15);
  }
  
  &.current-plan {
    border-color: #1976d2;
    box-shadow: 0 10px 25px rgba(25, 118, 210, 0.15);
  }
  
  // Hover effect
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    
    &.most-popular {
      transform: translateY(-8px) scale(1.05);
    }
  }
}

// Badge superior
.plan-badge {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  z-index: 10;
  
  .badge-content {
    background: linear-gradient(135deg, #ff6b35 0%, #f7941e 100%);
    color: white;
    padding: 8px 0;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    border-radius: 18px 18px 0 0;
  }
}

// Cabeçalho do plano
.plan-header {
  position: relative;
  padding: 2rem 1.5rem;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, var(--color-primary) 0%, #225a24 100%);
  z-index: 1;
  
  &.bg-primary {
    background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
  }
  
  &.bg-warning {
    background: linear-gradient(135deg, #f57c00 0%, #e65100 100%);
  }
  
  &.bg-positive {
    background: linear-gradient(135deg, var(--color-primary) 0%, #225a24 100%);
  }
  
  .plan-icon-wrapper {
    margin-bottom: 1rem;
    
    .plan-main-icon {
      opacity: 0.9;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
  }
  
  .plan-title-section {
    margin-bottom: 1.5rem;
    
    .plan-name {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }
    
    .plan-subtitle {
      font-size: 1rem;
      margin: 0;
      opacity: 0.9;
    }
  }
}

// Seção de preços
.pricing-section {
  .price-free {
    .price-label {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: 2px;
    }
  }
  
  .price-wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
    
    .currency-symbol {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .price-main {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1;
    }
    
    .price-period {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      opacity: 0.9;
    }
  }
  
  .discount-info {
    .original-price {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 0.25rem;
    }
    
    .savings {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      font-weight: 600;
      background: rgba(255,255,255,0.2);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      margin: 0 auto;
      max-width: fit-content;
    }
  }
}

// Seção de recursos
.features-section {
  padding: 1.5rem;
  background: white;
  position: relative;
  z-index: 1;
  
  .features-title {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #37474f;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }
  
  .features-list {
    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      transition: all 0.2s ease;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.feature-highlighted {
        background: linear-gradient(135deg, rgba(44, 95, 45, 0.08) 0%, rgba(255, 255, 255, 1) 100%);
        border-radius: 8px;
        padding: 0.6rem 0.75rem;
        margin: 0.25rem 0;
        border: 1px solid rgba(44, 95, 45, 0.2);
      }
      
      .feature-icon {
        flex-shrink: 0;
      }
      
      .feature-text {
        flex: 1;
        font-size: 0.9rem;
        line-height: 1.4;
        
        &.feature-disabled {
          color: #9e9e9e;
          text-decoration: line-through;
        }
      }
      
      .feature-highlight-icon {
        flex-shrink: 0;
        animation: pulse 2s infinite;
      }
    }
  }
  
  .limitations-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0,0,0,0.1);
    
    .limitations-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      color: #ff9800;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
    }
    
    .limitation-item {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.3rem 0;
      font-size: 0.85rem;
      color: #666;
      line-height: 1.4;
    }
  }
}

// Seção de ação
.action-section {
  padding: 1.5rem;
  background: #f8f9fa;
  
  .action-btn {
    width: 100%;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease;
    
    &.current-plan-btn {
      background: rgba(44, 95, 45, 0.08);
      color: var(--color-primary);
      border: 2px solid rgba(44, 95, 45, 0.2);
    }
    
    &.upgrade-btn {
      transform: scale(1);
      
      &:hover {
        transform: scale(1.02);
      }
    }
    
    &.downgrade-btn {
      &:hover {
        background: rgba(0,0,0,0.05);
      }
    }
    
    &.start-btn {
      background: linear-gradient(135deg, #2C5F2D 0%, #1B5E20 100%);
      color: white;
      
      &:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 20px rgba(44, 95, 45, 0.4);
      }
    }
  }
  
  .trial-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    margin-top: 0.75rem;
    font-size: 0.8rem;
    color: #666;
  }
}

// Seção de garantia
.guarantee-section {
  padding: 1rem;
  background: rgba(44, 95, 45, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 12px 12px;
  
  .guarantee-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
    .guarantee-icon {
      color: var(--color-primary);
      flex-shrink: 0;
    }
    
    .guarantee-text {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-primary);
      line-height: 1.2;
      text-align: center;
    }
  }
}

// Animações
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

// Responsividade
@media (max-width: 768px) {
  .plan-header {
    padding: 1.5rem 1rem;
    
    .plan-name {
      font-size: 1.5rem;
    }
    
    .pricing-section .price-main {
      font-size: 2.5rem;
    }
  }
  
  .features-section {
    padding: 1rem;
  }
  
  .action-section {
    padding: 1rem;
  }
}
</style>