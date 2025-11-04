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
      <div class="hero-section text-center q-pa-xl">
        <div class="hero-content">
          <h1 class="text-h2 text-weight-bold q-mb-md hero-title">
            <q-icon name="diamond" class="q-mr-sm" />
            Escolha Seu Plano Ideal
          </h1>
          <p class="text-h6 q-mb-sm text-grey-8">
            Transforme sua gestão financeira com as ferramentas certas
          </p>
          <p class="text-body1 text-grey-7">
            Planos flexíveis que crescem com você
          </p>
        </div>
      </div>

      <!-- Current Plan Banner -->
      <div v-if="currentUserPlan" class="q-px-md q-pb-lg">
        <q-banner 
          rounded
          class="current-plan-banner shadow-2"
          :class="`bg-gradient-${getPlanColorName(currentUserPlan)}`"
        >
          <template v-slot:avatar>
            <q-icon name="verified" size="32px" />
          </template>
          <div class="text-white">
                      <div class="text-h6 text-weight-bold">
            Seu Plano Atual: {{ currentUserPlan.name }}
          </div>
            <div class="text-body2 q-mt-xs">
              Você está aproveitando todos os recursos do seu plano
            </div>
          </div>
        </q-banner>
      </div>



      <!-- Plans Grid -->
      <div class="row q-col-gutter-lg justify-center q-px-md q-pb-xl">
        <div 
          v-for="plan in sortedPlans" 
          :key="plan.id"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card 
            class="plan-card shadow-6"
            :class="{
              'popular-card': plan.is_recommended || plan.is_featured,
              'current-card': isCurrentPlan(plan)
            }"
          >
            <!-- Badge -->
            <div v-if="plan.badge_text || plan.is_recommended" class="plan-badge">
              <q-chip 
                :color="plan.is_recommended ? 'warning' : 'primary'"
                text-color="white"
                icon="star"
                class="badge-chip"
              >
                {{ plan.badge_text || 'POPULAR' }}
              </q-chip>
            </div>

            <!-- Current Plan Badge -->
            <div v-if="isCurrentPlan(plan)" class="current-badge">
              <q-chip color="positive" text-color="white" icon="verified" size="sm">
                SEU PLANO
              </q-chip>
            </div>

            <!-- Header -->
            <q-card-section class="plan-header text-center text-white" :class="`bg-gradient-${getPlanColorName(plan)}`">
              <div class="plan-icon q-mb-md">
                <q-icon :name="getPlanIcon(plan)" size="48px" />
              </div>
              <div class="text-h4 text-weight-bold q-mb-xs">
                {{ plan.name }}
              </div>
              <div v-if="plan.description" class="text-body2 plan-subtitle">
                {{ plan.description }}
              </div>
            </q-card-section>


            <!-- Price Section -->
            <q-card-section class="price-section text-center q-py-lg">
              <div class="price-wrapper">
                <div class="price-amount text-h2 text-weight-bold text-primary">
                  {{ formatPrice(plan) }}
                </div>
                <div class="price-period text-body1 text-grey-7">
                  por mês
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- Limits Section -->
            <q-card-section class="limits-section q-pa-lg">
              <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">
                <q-icon name="trending_up" class="q-mr-xs" />
                Limites e Recursos
              </div>
              <div class="limits-grid">
                <div class="limit-item">
                  <div class="limit-icon">
                    <q-icon name="receipt_long" color="primary" size="24px" />
                  </div>
                  <div class="limit-info">
                    <div class="limit-value">{{ formatLimit(plan.max_transactions) }}</div>
                    <div class="limit-label">Transações</div>
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- Features Section -->
            <q-card-section class="features-section q-pa-lg">
              <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">
                <q-icon name="check_circle" class="q-mr-xs" />
                Recursos Incluídos
              </div>
              <div class="features-list">
                <div 
                  v-for="(feature, index) in getDisplayFeatures(plan)" 
                  :key="index"
                  class="feature-item"
                >
                  <q-icon 
                    :name="feature.included ? 'check_circle' : 'cancel'" 
                    :color="feature.included ? 'positive' : 'grey-5'"
                    size="20px"
                  />
                  <span :class="{ 'text-grey-6': !feature.included }">
                    {{ feature.text }}
                  </span>
                </div>
              </div>
            </q-card-section>

            <!-- CTA Section -->
            <q-card-section class="q-pa-lg">
              <q-btn
                v-if="isCurrentPlan(plan)"
                color="grey-6"
                label="Seu Plano Atual"
                icon="verified"
                class="full-width cta-button"
                size="lg"
                disable
              />
              <q-btn
                v-else
                :color="getPlanColorName(plan)"
                :label="getActionLabel(plan)"
                :icon="getActionIcon(plan)"
                class="full-width cta-button"
                size="lg"
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
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { plansList } from 'src/apis/plans'
import { useNotifications } from 'src/composables/useNotifications'

// Stores & Composables
const authStore = useAuthStore()
const { notifySuccess, notifyError, notifyWarning } = useNotifications()

// State
const plans = ref([])
const loading = ref(false)
const error = ref(null)
const billingCycle = ref('monthly')
const showUpgradeDialog = ref(false)
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
    console.log('📊 Resposta da API (já processada):', response)
    console.log('📊 Tipo da resposta:', Array.isArray(response) ? 'Array' : typeof response)
    
    // A resposta já deve ser um array direto graças ao tratamento em plans.js
    const allPlans = Array.isArray(response) ? response : []
    
    console.log(`📋 Total de planos recebidos: ${allPlans.length}`)
    if (allPlans.length > 0) {
      console.log('📋 Planos:', allPlans.map(p => `${p.name} (R$ ${p.price})`).join(', '))
    }
    
    // Filtrar apenas excluindo ADMIN
    plans.value = allPlans.filter(plan => plan && plan.name !== 'ADMIN')
    
    console.log(`✅ Planos disponíveis após filtro: ${plans.value.length}`)
    
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
  if (!selectedPlanData.value) return
  
  processing.value = true
  
  try {
    // TODO: Implement actual payment/upgrade logic here
    // For now, just simulate
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update user plan_id in store
    authStore.updateUser({
      ...user.value,
      plan_id: selectedPlanData.value.id
    })
    
    notifySuccess(
      `Parabéns! Seu plano foi ${isUpgradeAction() ? 'atualizado' : 'alterado'} com sucesso!`
    )
    
    closeUpgradeDialog()
  } catch (err) {
    console.error('Erro ao processar upgrade:', err)
    notifyError('Erro ao processar alteração de plano. Tente novamente.')
  } finally {
    processing.value = false
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
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
    background-size: cover;
    opacity: 0.3;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  color: var(--text-on-primary);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.8s ease-out;
}

// Current Plan Banner
.current-plan-banner {
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
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: var(--bg-primary);
  position: relative;
  animation: cardEnter 0.6s ease-out backwards;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2) !important;
  }
}

.popular-card {
  border: 3px solid var(--q-warning);
  transform: scale(1.05);
  
  &:hover {
    transform: translateY(-12px) scale(1.07);
  }
}

.current-card {
  border: 3px solid var(--q-positive);
}

.plan-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  animation: iconPulse 2s ease-in-out infinite;
}

.badge-chip {
  font-weight: bold;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.current-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  animation: slideInLeft 0.6s ease-out;
}

.plan-header {
  padding: 32px 24px;
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }
}

.plan-icon {
  animation: iconPulse 3s ease-in-out infinite;
}

.plan-subtitle {
  opacity: 0.9;
}

// Price Section
.price-section {
  background: linear-gradient(to bottom, var(--color-grey-50) 0%, var(--bg-primary) 100%);
}

.price-wrapper {
  animation: fadeIn 0.8s ease-out;
}

.price-amount {
  font-size: 3rem;
  line-height: 1;
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.price-period {
  margin-top: 4px;
}

.savings-tag {
  animation: shimmer 2s ease-in-out infinite;
}

// Limits Section
.limits-section {
  background: var(--color-grey-50);
}

.limits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.limit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.limit-icon {
  flex-shrink: 0;
}

.limit-info {
  flex: 1;
}

.limit-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--q-primary);
  line-height: 1.2;
}

.limit-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

// Features Section
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
  
  &:hover {
    transform: translateX(4px);
  }
  
  i {
    margin-top: 2px;
  }
}

// CTA Button
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
  border-radius: var(--radius-xl);
  overflow: hidden;
  
  .q-markup-table {
    thead tr th {
      background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
      color: var(--text-on-primary);
      font-weight: bold;
      padding: var(--spacing-5) var(--spacing-4);
      font-size: 1rem;
    }
    
    tbody tr {
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: var(--color-grey-50);
      }
      
      td {
        padding: var(--spacing-4);
        font-size: 0.95rem;
      }
      
      td:first-child {
        font-weight: 500;
        background: var(--color-grey-50);
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

// Animations
@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
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
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
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
  
  .popular-card {
    transform: scale(1);
  }
  
  .price-amount {
    font-size: 2.5rem;
  }
  
  .limits-grid {
    grid-template-columns: 1fr;
  }
}
</style>