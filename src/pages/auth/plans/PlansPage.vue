<template>
  <q-page class="plans-page">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center" style="min-height: 60vh;">
      <div class="text-center">
        <q-spinner-dots color="primary" size="50px" />
        <div class="text-h6 q-mt-md text-grey-7">Carregando planos...</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center" style="min-height: 60vh;">
      <div class="text-center q-pa-lg">
        <q-icon name="error_outline" size="80px" color="negative" />
        <div class="text-h5 q-mt-md text-negative">Erro ao carregar planos</div>
        <div class="text-body1 q-mt-sm text-grey-7">{{ error }}</div>
        <q-btn 
          color="primary" 
          label="Tentar Novamente" 
          icon="refresh" 
          class="q-mt-md"
          @click="fetchPlans"
        />
      </div>
    </div>

    <!-- Content -->
    <div v-else class="plans-content">
      <!-- Hero Section -->
      <div class="hero-section text-center q-py-xl q-px-md">
        <div class="hero-content">
          <div class="hero-badge q-mb-md">
            <q-chip 
              color="primary" 
              text-color="white" 
              size="sm"
              class="hero-chip"
            >
              PLANOS E PREÇOS
            </q-chip>
          </div>
          <h1 class="text-h3 text-weight-bold q-mb-md hero-title">
            Escolha o plano perfeito para você
          </h1>
          <p class="text-subtitle1 text-grey-7 hero-subtitle">
            Recursos poderosos para controle financeiro completo
          </p>
        </div>
      </div>

      <!-- Current Plan Banner -->
      <div v-if="currentUserPlan" class="q-px-md q-pb-lg">
        <div class="current-plan-banner">
          <div class="row items-center q-col-gutter-md">
            <div class="col-auto">
              <q-icon name="check_circle" size="32px" color="positive" />
            </div>
            <div class="col">
              <div class="text-subtitle2 text-grey-7">Plano Atual</div>
              <div class="text-h6 text-weight-bold">{{ currentUserPlan.name }}</div>
            </div>
            <div class="col-auto">
              <q-chip 
                color="positive" 
                text-color="white" 
                icon="verified"
                size="md"
              >
                ATIVO
              </q-chip>
            </div>
          </div>
        </div>
      </div>



      <!-- Plans Grid -->
      <div class="row q-col-gutter-lg justify-center q-px-md q-pb-xl">
        <div 
          v-for="plan in sortedPlans" 
          :key="plan.id"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card 
            flat
            bordered
            class="plan-card"
            :class="{
              'plan-card-featured': plan.name === 'Pro',
              'plan-card-current': isCurrentPlan(plan)
            }"
          >
            <!-- Featured Badge -->
            <div v-if="plan.name === 'Pro'" class="featured-ribbon">
              <span>RECOMENDADO</span>
            </div>

            <!-- Current Badge -->
            <div v-if="isCurrentPlan(plan)" class="current-tag">
              <q-chip color="positive" text-color="white" icon="check_circle" size="sm" dense>
                Seu Plano
              </q-chip>
            </div>

            <!-- Header -->
            <q-card-section class="plan-header text-center q-pt-xl q-pb-lg">
              <div class="plan-icon-wrapper q-mb-md">
                <div class="plan-icon-circle" :class="`plan-icon-${getPlanColorName(plan)}`">
                  <q-icon :name="getPlanIcon(plan)" size="32px" />
                </div>
              </div>
              <div class="text-h5 text-weight-bold q-mb-xs text-grey-9">
                {{ plan.name }}
              </div>
              <div v-if="plan.description" class="text-body2 text-grey-7">
                {{ plan.description }}
              </div>
            </q-card-section>


            <!-- Price Section -->
            <q-card-section class="price-section text-center q-pb-lg">
              <div class="price-display">
                <div class="price-currency text-h6 text-grey-7">R$</div>
                <div class="price-value text-h2 text-weight-bold text-grey-9">
                  {{ plan.price === 0 ? '0' : plan.price.toFixed(2).replace('.', ',') }}
                </div>
                <div class="price-period text-body2 text-grey-6">/mês</div>
              </div>
            </q-card-section>

            <q-separator />

            <q-separator />

            <!-- Limits Section -->
            <q-card-section class="q-px-lg q-py-md">
              <div class="limit-highlight">
                <div class="limit-highlight-icon">
                  <q-icon name="receipt_long" size="20px" color="primary" />
                </div>
                <div>
                  <div class="text-caption text-grey-7">Transações por mês</div>
                  <div class="text-h6 text-weight-bold text-grey-9">
                    {{ formatLimit(plan.max_transactions) }}
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- Features Section -->
            <q-card-section class="features-section q-pa-lg">
              <div class="text-subtitle2 text-grey-7 text-uppercase q-mb-md" style="font-size: 0.7rem; letter-spacing: 1px;">
                O que está incluído
              </div>
              <div class="features-list-modern">
                <div 
                  v-for="(feature, index) in getDisplayFeatures(plan)" 
                  :key="index"
                  class="feature-item-modern"
                >
                  <div class="feature-check">
                    <q-icon 
                      name="check" 
                      :color="feature.included ? 'positive' : 'grey-4'"
                      size="16px"
                    />
                  </div>
                  <span class="feature-text" :class="{ 'text-grey-5': !feature.included }">
                    {{ feature.text }}
                  </span>
                </div>
              </div>
            </q-card-section>

            <!-- CTA Section -->
            <q-card-section class="q-pa-lg q-pt-md">
              <q-btn
                v-if="isCurrentPlan(plan)"
                outline
                color="grey-7"
                label="Plano Atual"
                icon-right="check"
                class="full-width cta-button-modern"
                size="lg"
                unelevated
                disable
              />
              <q-btn
                v-else
                :color="plan.name === 'Pro' ? 'primary' : 'grey-8'"
                :label="getActionLabel(plan)"
                class="full-width cta-button-modern"
                size="lg"
                unelevated
                @click="handlePlanSelection(plan)"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Comparison Table -->
      <div v-if="plans.length > 0" class="comparison-section q-px-md q-pb-xl">
        <div class="text-center q-mb-lg">
          <h4 class="text-h4 text-weight-bold q-mb-sm">
            Compare os Planos
          </h4>
          <p class="text-body1 text-grey-7">
            Veja todos os recursos lado a lado
          </p>
        </div>

        <q-card class="comparison-card shadow-4">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th class="text-left">Recursos</th>
                <th 
                  v-for="plan in sortedPlans" 
                  :key="`header-${plan.id}`"
                  class="text-center"
                >
                  <div class="text-h6 text-weight-bold">{{ plan.name }}</div>
                  <div class="text-caption text-grey-7">{{ formatPrice(plan) }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Transactions Row -->
              <tr>
                <td class="text-weight-medium">
                  <q-icon name="receipt_long" class="q-mr-sm" />
                  Transações por Mês
                </td>
                <td 
                  v-for="plan in sortedPlans" 
                  :key="`trans-${plan.id}`"
                  class="text-center"
                >
                  {{ formatLimit(plan.max_transactions) }}
                </td>
              </tr>
              <!-- Dynamic Features Rows -->
              <tr v-for="(featureRow, idx) in comparisonFeatures" :key="`feat-${idx}`">
                <td class="text-weight-medium">
                  <q-icon :name="featureRow.icon" class="q-mr-sm" />
                  {{ featureRow.name }}
                </td>
                <td 
                  v-for="plan in sortedPlans" 
                  :key="`${plan.id}-${idx}`"
                  class="text-center"
                >
                  <q-icon 
                    :name="featureRow.included[plan.id] ? 'check' : 'close'"
                    :color="featureRow.included[plan.id] ? 'positive' : 'grey-5'"
                    size="24px"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card>
      </div>
    </div>


    <!-- Upgrade Dialog -->
    <q-dialog v-model="showUpgradeDialog" persistent>
      <q-card style="min-width: 450px; max-width: 600px;">
        <q-card-section class="bg-gradient-primary text-white">
          <div class="text-h5 text-weight-bold">
            <q-icon name="upgrade" size="28px" class="q-mr-sm" />
            {{ getUpgradeTitle() }}
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <!-- Plan Change Visual -->
          <div class="plan-change-visual q-mb-lg">
            <div class="row items-center justify-center q-col-gutter-md">
              <div class="col-auto">
                <q-chip 
                  :color="getPlanColorName(currentUserPlan)" 
                  text-color="white"
                  size="lg"
                  icon="account_circle"
                >
                  {{ currentUserPlan?.name || 'Atual' }}
                </q-chip>
              </div>
              <div class="col-auto">
                <q-icon name="arrow_forward" size="32px" color="primary" />
              </div>
              <div class="col-auto">
                <q-chip 
                  :color="getPlanColorName(selectedPlanData)" 
                  text-color="white"
                  size="lg"
                  icon="workspace_premium"
                >
                  {{ selectedPlanData?.name }}
                </q-chip>
              </div>
            </div>
          </div>

          <!-- New Features -->
          <div v-if="selectedPlanData" class="new-features q-mb-md">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">
              <q-icon name="star" color="warning" />
              Novos Recursos:
            </div>
            <div class="features-preview">
              <div 
                v-for="(feature, idx) in getNewFeatures(selectedPlanData)" 
                :key="idx"
                class="feature-preview-item"
              >
                <q-icon name="check_circle" color="positive" size="18px" />
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Billing Details -->
          <div class="billing-details">
            <div class="text-subtitle1 text-weight-bold q-mb-md">
              Detalhes da Cobrança:
            </div>
            <div class="detail-row">
              <span class="detail-label">Valor:</span>
              <span class="detail-value text-h6 text-primary text-weight-bold">
                {{ selectedPlanData ? formatPrice(selectedPlanData) : 'R$ 0,00' }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Cobrança:</span>
              <span class="detail-value">Mensal</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Próxima cobrança:</span>
              <span class="detail-value">{{ getNextBillingDate() }}</span>
            </div>
          </div>

          <!-- Important Note -->
          <q-banner 
            v-if="isUpgradeAction()" 
            class="bg-blue-1 q-mt-md" 
            rounded
          >
            <template v-slot:avatar>
              <q-icon name="info" color="info" />
            </template>
            <div class="text-body2">
              O upgrade será aplicado imediatamente e você terá acesso instantâneo a todos os novos recursos.
            </div>
          </q-banner>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
          <q-btn 
            label="Cancelar" 
            color="grey-7" 
            flat 
            size="md"
            @click="closeUpgradeDialog"
          />
          <q-btn 
            :label="getUpgradeButtonLabel()"
            :color="getPlanColorName(selectedPlanData)"
            size="md"
            :loading="processing"
            @click="confirmUpgrade"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Payment Checkout Dialog (Asaas - PIX/Boleto/Cartão) -->
    <PaymentCheckoutDialog
      v-model="showPaymentDialog"
      :plan="selectedPlanData"
      @success="handlePaymentSuccess"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { plansList } from 'src/apis/plans'
import { userPlanUpdate } from 'src/apis/user'
import { useNotifications } from 'src/composables/useNotifications'
import PaymentCheckoutDialog from 'src/components/plans/PaymentCheckoutDialog.vue'

// Stores & Composables
const authStore = useAuthStore()
const { notifySuccess, notifyError, notifyWarning } = useNotifications()

// State
const plans = ref([])
const loading = ref(false)
const error = ref(null)
const billingCycle = ref('monthly')
const showUpgradeDialog = ref(false)
const showPaymentDialog = ref(false)
const selectedPlanData = ref(null)
const processing = ref(false)

// Computed
const user = computed(() => authStore.user)

const currentUserPlan = computed(() => {
  if (!user.value?.plan_id || !plans.value.length) return null
  return plans.value.find(p => p.id === user.value.plan_id)
})

const sortedPlans = computed(() => {
  if (!plans.value.length) return []
  
  // Sort by price ascending
  return [...plans.value].sort((a, b) => {
    const priceA = a.price || 0
    const priceB = b.price || 0
    return priceA - priceB
  })
})

const comparisonFeatures = computed(() => {
  if (!plans.value.length) return []
  
  // Collect all unique features from all plans
  const allFeatures = new Set()
  plans.value.forEach(plan => {
    if (plan.features && Array.isArray(plan.features)) {
      plan.features.forEach(f => {
        if (typeof f === 'string') {
          allFeatures.add(f)
        } else if (f && f.name) {
          allFeatures.add(f.name)
        }
      })
    }
  })
  
  // Create comparison rows
  const rows = []
  const featuresList = Array.from(allFeatures)
  
  featuresList.forEach((featureName, idx) => {
    const included = {}
    plans.value.forEach(plan => {
      const hasFeature = plan.features?.some(f => 
        (typeof f === 'string' && f === featureName) ||
        (f && f.name === featureName)
      )
      included[plan.id] = hasFeature
    })
    
    rows.push({
      name: featureName,
      icon: getFeatureIcon(featureName, idx),
      included
    })
  })
  
  return rows
})

// Methods
async function fetchPlans() {
  loading.value = true
  error.value = null
  
  try {
    // plansList já retorna data?.data || data || []
    const response = await plansList()
    
    // A resposta já deve ser um array direto graças ao tratamento em plans.js
    const allPlans = Array.isArray(response) ? response : []
    
    if (allPlans.length > 0) {
    }
    
    // Filtrar apenas excluindo ADMIN
    plans.value = allPlans.filter(plan => plan && plan.name !== 'ADMIN')
        
    if (!plans.value.length) {
      console.warn('⚠️ Nenhum plano disponível após filtro')
      error.value = 'Nenhum plano disponível no momento'
    }
  } catch (err) {
    console.error('❌ Erro ao carregar planos:', err)
    error.value = err.message || 'Erro ao carregar planos. Tente novamente mais tarde.'
  } finally {
    loading.value = false
  }
}

function isCurrentPlan(plan) {
  if (!user.value?.plan_id || !plan) return false
  return plan.id === user.value.plan_id
}

function getPlanColorName(plan) {
  if (!plan) return 'info'
  
  const name = (plan.name || plan.type || '').toLowerCase()
  
  const colorMap = {
    'free': 'info',
    'gratuito': 'info',
    'basic': 'info',
    'pro': 'warning',
    'professional': 'warning',
    'premium': 'positive',
    'enterprise': 'positive'
  }
  
  return colorMap[name] || 'primary'
}

function getPlanIcon(plan) {
  if (!plan) return 'workspace_premium'
  
  const name = (plan.name || plan.type || '').toLowerCase()
  
  const iconMap = {
    'free': 'free_breakfast',
    'gratuito': 'free_breakfast',
    'basic': 'free_breakfast',
    'pro': 'star',
    'professional': 'star',
    'premium': 'diamond',
    'enterprise': 'diamond'
  }
  
  return iconMap[name] || 'workspace_premium'
}

function formatPrice(plan) {
  if (!plan) return 'R$ 0,00'
  
  const price = plan.price || 0
  
  if (price === 0) return 'Gratuito'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

function formatLimit(value) {
  if (value === null || value === undefined) return 'ILIMITADAS'
  if (value === -1 || value === 999999 || value === Infinity) return 'Ilimitado'
  return value.toLocaleString('pt-BR')
}

function calculateSavings(plan) {
  // Como a API não retorna price_monthly e price_yearly separados,
  // vamos simular uma economia de 20% no plano anual
  if (billingCycle.value === 'yearly') {
    return 20
  }
  return 0
}

function getFeatureIcon(featureName, index) {
  const name = (featureName || '').toLowerCase()
  
  if (name.includes('dashboard')) return 'dashboard'
  if (name.includes('relatório') || name.includes('report')) return 'assessment'
  if (name.includes('gráfico') || name.includes('chart')) return 'bar_chart'
  if (name.includes('export')) return 'download'
  if (name.includes('integr')) return 'integration_instructions'
  if (name.includes('suporte') || name.includes('support')) return 'support_agent'
  if (name.includes('api')) return 'api'
  if (name.includes('multi') || name.includes('usuário')) return 'group'
  if (name.includes('ia') || name.includes('ai')) return 'smart_toy'
  if (name.includes('meta')) return 'flag'
  if (name.includes('categoria')) return 'category'
  
  return index % 2 === 0 ? 'check_circle' : 'verified'
}

function getDisplayFeatures(plan) {
  if (!plan) return []
  
  // If plan has features from API, use them
  if (plan.features && Array.isArray(plan.features) && plan.features.length > 0) {
    return plan.features.map(f => {
      if (typeof f === 'string') {
        return { text: f, included: true }
      }
      return {
        text: f.name || f.description || f,
        included: f.included !== false
      }
    })
  }
  
  // Fallback to default features based on limits
  const features = []
  
  if (plan.max_transactions !== undefined) {
    features.push({
      text: `${formatLimit(plan.max_transactions)} transações`,
      included: true
    })
  }
  
  if (plan.max_categories !== undefined) {
    features.push({
      text: `${formatLimit(plan.max_categories)} categorias`,
      included: true
    })
  }
  
  if (plan.max_accounts !== undefined) {
    features.push({
      text: `${formatLimit(plan.max_accounts)} contas bancárias`,
      included: true
    })
  }
  
  features.push({ text: 'Dashboard básico', included: true })
  features.push({ text: 'Relatórios simples', included: true })
  features.push({ text: 'Suporte por email', included: true })
  
  return features
}

function getActionLabel(plan) {
  if (!plan) return 'Selecionar Plano'
  
  if (!currentUserPlan.value) {
    return 'Escolher Este Plano'
  }
  
  const currentPrice = currentUserPlan.value.price || 0
  const newPrice = plan.price || 0
  
  if (newPrice > currentPrice) {
    return 'Fazer Upgrade'
  } else if (newPrice < currentPrice) {
    return 'Fazer Downgrade'
  }
  
  return 'Selecionar Plano'
}

function getActionIcon(plan) {
  if (!plan) return 'touch_app'
  
  if (!currentUserPlan.value) {
    return 'touch_app'
  }
  
  const currentPrice = currentUserPlan.value.price || 0
  const newPrice = plan.price || 0
  
  if (newPrice > currentPrice) {
    return 'upgrade'
  } else if (newPrice < currentPrice) {
    return 'downgrade'
  }
  
  return 'touch_app'
}

function handlePlanSelection(plan) {
  selectedPlanData.value = plan
  showUpgradeDialog.value = true
}

function closeUpgradeDialog() {
  showUpgradeDialog.value = false
  selectedPlanData.value = null
}

function getUpgradeTitle() {
  if (!selectedPlanData.value) return 'Alterar Plano'
  
  if (isUpgradeAction()) {
    return `Upgrade para ${selectedPlanData.value.name}`
  }
  
  return `Alterar para ${selectedPlanData.value.name}`
}

function isUpgradeAction() {
  if (!currentUserPlan.value || !selectedPlanData.value) return true
  
  const currentPrice = currentUserPlan.value.price || 0
  const newPrice = selectedPlanData.value.price || 0
  
  return newPrice > currentPrice
}

function getNewFeatures(plan) {
  if (!plan || !plan.features) return []
  
  const features = plan.features.slice(0, 5).map(f => {
    if (typeof f === 'string') return f
    return f.name || f.description || String(f)
  })
  
  return features
}

function getNextBillingDate() {
  const date = new Date()
  
  if (billingCycle.value === 'monthly') {
    date.setMonth(date.getMonth() + 1)
  } else {
    date.setFullYear(date.getFullYear() + 1)
  }
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function getUpgradeButtonLabel() {
  if (isUpgradeAction()) {
    return 'Confirmar Upgrade'
  }
  return 'Confirmar Alteração'
}

async function confirmUpgrade() {
  if (!selectedPlanData.value) {
    notifyWarning('Nenhum plano selecionado')
    return
  }
  
  // Previne alteração para o mesmo plano
  if (isCurrentPlan(selectedPlanData.value)) {
    notifyWarning('Este já é o seu plano atual')
    closeUpgradeDialog()
    return
  }
  
  // Fecha dialog de confirmação e abre dialog de pagamento
  closeUpgradeDialog()
  showPaymentDialog.value = true
}

// Callback quando pagamento é bem-sucedido
async function handlePaymentSuccess() {
  try {    
    // Chama API para atualizar o plano do usuário
    // Note: API usa "planId" (camelCase) conforme documentação do backend
    const response = await userPlanUpdate({
      planId: selectedPlanData.value.id
    })
        
    // Atualiza dados do usuário no store
    const updatedUser = response?.data?.user || response?.user || {
      ...user.value,
      plan_id: selectedPlanData.value.id
    }
    
    authStore.updateUser(updatedUser)
    
    // Feedback de sucesso
    const actionText = isUpgradeAction() ? 'atualizado' : 'alterado'
    notifySuccess(
      `Parabéns! Seu plano foi ${actionText} para ${selectedPlanData.value.name} com sucesso!`,
      {
        icon: 'celebration',
        position: 'top',
        timeout: 5000
      }
    )
    
    // Fecha dialogs
    showPaymentDialog.value = false
    selectedPlanData.value = null
    
    // Recarrega os planos para garantir dados atualizados
    await fetchPlans()
    
  } catch (err) {
    console.error('❌ Erro ao atualizar plano após pagamento:', err)
    
    const errorMessage = err?.message 
      || err?.response?.data?.message 
      || 'Erro ao ativar plano. Entre em contato com o suporte.'
    
    notifyError(errorMessage, {
      timeout: 5000
    })
  }
}

// Lifecycle
onMounted(() => {
  fetchPlans()
})
</script>

<style lang="scss" scoped>
.plans-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-grey-50) 0%, var(--color-grey-100) 100%);
}

// Hero Section
.hero-section {
  background: var(--bg-primary, #ffffff);
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.hero-badge {
  animation: fadeIn 0.6s ease-out;
}

.hero-chip {
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 0.7rem;
}

.hero-title {
  // color: var(--text-primary, #1a1a1a);
  color: #ffffff;
  font-weight: 700;
  line-height: 1.2;
  animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
  max-width: 500px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out 0.2s both;
  color: #9e9e9e;
}

// Current Plan Banner
.current-plan-banner {
  background: var(--bg-secondary, #f8f9fa);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--radius-lg, 12px);
  padding: 1.5rem;
  animation: slideInDown 0.6s ease-out;
}

.bg-gradient-info {
  background: linear-gradient(135deg, var(--q-info) 0%, var(--color-secondary) 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, var(--q-warning) 0%, var(--color-warning) 100%);
}

.bg-gradient-positive {
  background: linear-gradient(135deg, var(--q-positive) 0%, var(--color-positive) 100%);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
}

// Billing Toggle
.billing-toggle {
  border-radius: 50px;
  overflow: hidden;
  animation: fadeIn 0.6s ease-out 0.2s both;
}

.savings-badge {
  animation: bounce 1s ease infinite;
}

// Plan Cards
.plan-card {
  border-radius: var(--radius-lg, 12px);
  overflow: visible;
  transition: all 0.3s ease;
  background: var(--bg-primary, #ffffff);
  border: 2px solid var(--color-border, #e0e0e0);
  position: relative;
  height: 100%;
  animation: cardEnter 0.6s ease-out backwards;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--q-primary);
    box-shadow: 0 12px 24px -10px rgba(var(--q-primary-rgb), 0.2);
  }
}

.plan-card-featured {
  border-color: var(--q-primary);
  border-width: 2px;
  box-shadow: 0 4px 16px rgba(var(--q-primary-rgb), 0.15);
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px -12px rgba(var(--q-primary-rgb), 0.25);
  }
}

.plan-card-current {
  border-color: var(--q-positive);
  background: linear-gradient(to bottom, rgba(var(--q-positive-rgb), 0.02) 0%, var(--bg-primary) 100%);
}

.featured-ribbon {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--q-primary);
  color: white;
  padding: 6px 20px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 0 var(--radius-lg) 0 var(--radius-lg);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.current-tag {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}

.plan-header {
  padding: 32px 24px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--color-border);
  position: relative;
  text-align: center;
}

.plan-icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  
  .q-icon {
    font-size: 28px;
  }
  
  .plan-card:hover & {
    transform: scale(1.1) rotate(5deg);
  }
}

.plan-icon-circle-free {
  background: rgba(var(--q-grey-8-rgb), 0.1);
  color: var(--q-grey-8);
  
  .plan-card:hover & {
    background: var(--q-grey-8);
    color: white;
  }
}

.plan-icon-circle-pro {
  background: rgba(var(--q-primary-rgb), 0.15);
  color: var(--q-primary);
  
  .plan-card:hover & {
    background: var(--q-primary);
    color: white;
  }
}

.plan-icon-circle-premium {
  background: rgba(var(--q-warning-rgb), 0.15);
  color: var(--q-warning);
  
  .plan-card:hover & {
    background: var(--q-warning);
    color: white;
  }
}

.plan-subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

// Price Section
.price-section {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--color-border);
}

.price-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price-currency {
  font-size: 1.5rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.price-value {
  font-size: 3rem;
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1;
}

.price-period {
  margin-top: 4px;
}

.savings-tag {
  animation: shimmer 2s ease-in-out infinite;
}

// Limits Section
.limits-section {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--color-border);
}

.limit-highlight {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: rgba(var(--q-primary-rgb), 0.05);
  border: 1px solid rgba(var(--q-primary-rgb), 0.15);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  
  .q-icon {
    font-size: 24px;
    color: var(--q-primary);
  }
}

.limit-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--q-primary);
}

.limit-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-left: 4px;
}

// Features Section
.features-section {
  background: var(--bg-primary);
  padding: var(--spacing-6);
}

.features-list-modern {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-item-modern {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--text-secondary);
  
  .q-icon {
    font-size: 18px;
    color: var(--q-positive);
    flex-shrink: 0;
  }
}

// Legacy features (if still used)
.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
  font-size: 0.95rem;
  line-height: 1.5;
  transition: all 0.2s ease;
  
  i {
    margin-top: 2px;
  }
}

// CTA Button
.cta-button-modern {
  width: 100%;
  padding: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
}

// Legacy button (if still used)
.cta-button {
  border-radius: var(--radius-lg);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
}

// Comparison Section
.comparison-section {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.comparison-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  
  .q-markup-table {
    thead tr th {
      background: var(--q-primary);
      color: white;
      font-weight: 600;
      padding: var(--spacing-4);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    tbody tr {
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: rgba(var(--q-primary-rgb), 0.02);
      }
      
      td {
        padding: var(--spacing-4);
        font-size: 0.875rem;
        border-bottom: 1px solid var(--color-border);
      }
      
      td:first-child {
        font-weight: 600;
        background: rgba(var(--q-primary-rgb), 0.03);
        color: var(--text-primary);
      }
    }
  }
}

// Upgrade Dialog
.plan-change-visual {
  animation: fadeIn 0.6s ease-out;
}

.new-features {
  background: var(--color-grey-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
}

.features-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}

.feature-preview-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.billing-details {
  background: var(--color-grey-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2) 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-200);
  }
}

.detail-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.detail-value {
  font-weight: bold;
  color: var(--text-primary);
}

// Animations - Subtle & Modern
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive
@media (max-width: 599px) {
  .hero-section {
    padding: 48px 20px !important;
  }
  
  .hero-title {
    font-size: 2rem !important;
  }
  
  .plan-card {
    margin-bottom: 24px;
  }
  
  .plan-card-featured {
    border-width: 2px;
  }
  
  .price-value {
    font-size: 2.5rem;
  }
  
  .comparison-card .q-markup-table {
    font-size: 0.75rem;
  }
}
</style>