<template>
  <q-card class="plan-comparison" flat bordered>
    <q-card-section class="comparison-header">
      <div class="flex items-center justify-between">
        <div>
          <h5 class="text-h5 q-mb-xs">Compare os Planos</h5>
          <p class="text-caption text-grey-6 q-ma-none">
            Veja as diferenças entre nossos planos de forma detalhada
          </p>
        </div>
        <q-btn 
          icon="close" 
          flat 
          round 
          @click="$emit('close')"
          v-if="showCloseButton"
        />
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <div class="comparison-table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th class="feature-header">Recursos</th>
              <th 
                v-for="plan in plans" 
                :key="plan.id"
                class="plan-header"
                :class="{
                  'current-plan': isCurrentPlan(plan),
                  'most-popular': plan.isMostPopular
                }"
              >
                <div class="plan-info">
                  <q-icon :name="getPlanIcon(plan)" size="md" class="q-mb-sm" />
                  <div class="plan-name">{{ plan.name }}</div>
                  <div class="plan-price">
                    <span v-if="plan.price === 0" class="price-free">GRATUITO</span>
                    <span v-else class="price-paid">
                      R$ {{ formatPrice(plan.price) }}/mês
                    </span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="feature in comparisonFeatures" :key="feature.key">
              <td class="feature-name">
                <div class="feature-info">
                  <q-icon :name="feature.icon" class="q-mr-sm" />
                  <div>
                    <div class="feature-title">{{ feature.name }}</div>
                    <div v-if="feature.description" class="feature-desc">
                      {{ feature.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td 
                v-for="plan in plans" 
                :key="`${feature.key}-${plan.id}`"
                class="feature-value"
                :class="{ 'highlighted': plan.isMostPopular }"
              >
                <div class="value-content">
                  <!-- Check/X para recursos booleanos -->
                  <div v-if="typeof getFeatureValue(plan, feature.key) === 'boolean'">
                    <q-icon 
                      :name="getFeatureValue(plan, feature.key) ? 'check_circle' : 'cancel'"
                      :color="getFeatureValue(plan, feature.key) ? 'positive' : 'grey-4'"
                      size="sm"
                    />
                  </div>
                  <!-- Valor customizado -->
                  <div v-else class="feature-text">
                    {{ getFeatureValue(plan, feature.key) }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </q-card-section>

    <q-card-actions class="comparison-actions q-pa-lg">
      <div class="row q-gutter-md full-width">
        <div 
          v-for="plan in plans" 
          :key="`action-${plan.id}`"
          class="col"
        >
          <q-btn
            :label="getActionLabel(plan)"
            :color="getPlanColorClass(plan)"
            :outline="isCurrentPlan(plan)"
            :unelevated="!isCurrentPlan(plan)"
            class="full-width"
            size="md"
            no-caps
            @click="handlePlanSelection(plan)"
            :loading="loadingPlan === plan.id"
          >
            <q-icon 
              :name="getActionIcon(plan)" 
              class="q-mr-sm" 
            />
          </q-btn>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'

// ==========================================================================
// PROPS & EMITS
// ==========================================================================
const props = defineProps({
  plans: {
    type: Array,
    required: true
  },
  currentPlanId: {
    type: String,
    default: null
  },
  showCloseButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'plan-selected'])

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const loadingPlan = ref(null)

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================
const comparisonFeatures = computed(() => [
  {
    key: 'transactionLimit',
    name: 'Transações por mês',
    description: 'Limite de transações que você pode cadastrar',
    icon: 'receipt_long'
  },
  {
    key: 'categories',
    name: 'Categorias personalizadas',
    description: 'Crie suas próprias categorias de receitas e despesas',
    icon: 'category'
  },
  {
    key: 'reports',
    name: 'Relatórios avançados',
    description: 'Gráficos e análises detalhadas das suas finanças',
    icon: 'analytics'
  },
  {
    key: 'budgetAlerts',
    name: 'Alertas de orçamento',
    description: 'Notificações quando você exceder seus limites',
    icon: 'notifications'
  },
  {
    key: 'multiAccount',
    name: 'Múltiplas contas',
    description: 'Gerencie várias contas bancárias simultaneamente',
    icon: 'account_balance'
  },
  {
    key: 'exportData',
    name: 'Exportar dados',
    description: 'Exporte seus dados em PDF, Excel e outros formatos',
    icon: 'file_download'
  },
  {
    key: 'support',
    name: 'Suporte técnico',
    description: 'Tipo de suporte disponível',
    icon: 'support_agent'
  },
  {
    key: 'mobileApp',
    name: 'Aplicativo móvel',
    description: 'Acesso completo via smartphone',
    icon: 'phone_android'
  }
])

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Verifica se é o plano atual do usuário
 */
const isCurrentPlan = (plan) => {
  return props.currentPlanId === plan.id
}

/**
 * Obtém o ícone do plano
 */
const getPlanIcon = (plan) => {
  const icons = {
    'gratuito': 'star',
    'pro': 'workspace_premium',
    'premium': 'diamond'
  }
  return icons[plan.name.toLowerCase()] || 'circle'
}

/**
 * Obtém a classe de cor do plano
 */
const getPlanColorClass = (plan) => {
  if (plan.name.toLowerCase() === 'gratuito') return 'primary'
  if (plan.name.toLowerCase() === 'pro') return 'warning'
  return 'positive'
}

/**
 * Formata o preço
 */
const formatPrice = (price) => {
  return price.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * Obtém o valor de uma feature para um plano específico
 */
const getFeatureValue = (plan, featureKey) => {
  const featureMap = {
    transactionLimit: plan.features?.transactionLimit || '50',
    categories: plan.features?.categories || false,
    reports: plan.features?.reports || false,
    budgetAlerts: plan.features?.budgetAlerts || false,
    multiAccount: plan.features?.multiAccount || false,
    exportData: plan.features?.exportData || false,
    support: plan.features?.support || 'Email',
    mobileApp: plan.features?.mobileApp || false
  }
  
  return featureMap[featureKey]
}

/**
 * Obtém o label do botão de ação
 */
const getActionLabel = (plan) => {
  if (isCurrentPlan(plan)) return 'Plano Atual'
  if (plan.price === 0) return 'Começar Grátis'
  return 'Assinar Agora'
}

/**
 * Obtém o ícone do botão de ação
 */
const getActionIcon = (plan) => {
  if (isCurrentPlan(plan)) return 'check_circle'
  if (plan.price === 0) return 'play_arrow'
  return 'credit_card'
}

/**
 * Manipula a seleção do plano
 */
const handlePlanSelection = async (plan) => {
  if (isCurrentPlan(plan)) return
  
  loadingPlan.value = plan.id
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simula API call
    emit('plan-selected', plan)
  } catch (error) {
    console.error('Erro ao selecionar plano:', error)
  } finally {
    loadingPlan.value = null
  }
}
</script>

<style lang="scss" scoped>
.plan-comparison {
  border-radius: 12px;
  overflow: hidden;
}

.comparison-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, #225a24 100%);
  color: white;
  
  .text-grey-6 {
    color: rgba(255,255,255,0.8) !important;
  }
}

.comparison-table-wrapper {
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  
  .feature-header {
    background: #f8f9fa;
    text-align: left;
    font-weight: 600;
    color: #37474f;
    width: 300px;
  }
  
  .plan-header {
    background: white;
    border-left: 1px solid rgba(0,0,0,0.1);
    
    &.current-plan {
      background: rgba(44, 95, 45, 0.05);
      border-left: 3px solid var(--color-primary);
    }
    
    &.most-popular {
      background: rgba(245, 124, 0, 0.05);
      border-left: 3px solid #f57c00;
    }
    
    .plan-info {
      .plan-name {
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
      }
      
      .price-free {
        color: var(--color-primary);
        font-weight: 600;
        font-size: 0.9rem;
      }
      
      .price-paid {
        color: #37474f;
        font-weight: 600;
        font-size: 0.9rem;
      }
    }
  }
  
  .feature-name {
    text-align: left;
    background: #fafafa;
    
    .feature-info {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      
      .feature-title {
        font-weight: 500;
        color: #37474f;
      }
      
      .feature-desc {
        font-size: 0.8rem;
        color: #757575;
        margin-top: 0.25rem;
      }
    }
  }
  
  .feature-value {
    border-left: 1px solid rgba(0,0,0,0.1);
    
    &.highlighted {
      background: rgba(245, 124, 0, 0.02);
    }
    
    .value-content {
      display: flex;
      align-items: center;
      justify-content: center;
      
      .feature-text {
        font-weight: 500;
        color: #37474f;
      }
    }
  }
}

.comparison-actions {
  background: #f8f9fa;
  border-top: 1px solid rgba(0,0,0,0.1);
}

// Responsividade
@media (max-width: 768px) {
  .comparison-table {
    font-size: 0.85rem;
    
    th, td {
      padding: 0.75rem 0.5rem;
    }
    
    .feature-header {
      width: 200px;
    }
  }
}
</style>