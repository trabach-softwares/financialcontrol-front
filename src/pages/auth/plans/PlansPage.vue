<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="text-center q-mb-xl">
      <h3 class="text-h3 q-ma-none text-weight-bold">
        <q-icon name="upgrade" class="q-mr-sm" color="primary" />
        Planos e Assinaturas
      </h3>
      <p class="text-h6 q-mt-sm q-mb-none">
        Escolha o plano ideal para suas necessidades financeiras
      </p>
      <p class="text-body1-7 q-mt-xs">
        Desbloquear recursos avançados e potencializar seu Financial Control
      </p>
    </div>

    <!-- Current Plan Alert -->
    <div v-if="authStore.userPlan" class="q-mb-lg">
      <q-banner 
        :class="`bg-${getPlanColor(authStore.userPlan)}`" 
        text-color="white" 
        icon="info"
      >
        <template v-slot:avatar>
          <q-icon name="verified" />
        </template>
        <div class="text-subtitle1">
          <strong>Plano Atual:</strong> {{ authStore.userPlan }}
        </div>
        <div class="text-body2 opacity-80">
          Você está aproveitando todos os recursos do seu plano atual
        </div>
      </q-banner>
    </div>

    <!-- Billing Toggle -->
    <div class="text-center q-mb-lg">
      <div class="inline-block">
        <q-btn-toggle
          v-model="billingCycle"
          toggle-color="primary"
          :options="[
            {label: 'Mensal', value: 'monthly'},
            {label: 'Anual', value: 'yearly'}
          ]"
          class="shadow-2"
        />
        <div v-if="billingCycle === 'yearly'" class="text-positive text-weight-bold q-mt-xs">
          <q-icon name="savings" />
          Economize até 20% pagando anualmente!
        </div>
      </div>
    </div>

    <!-- Plans Grid -->
    <div class="row q-col-gutter-lg justify-center">
      <!-- Free Plan -->
      <div class="col-12 col-md-4">
        <q-card 
          class="plan-card shadow-4 relative-position"
          :class="{ 'current-plan': user?.plan === 'free' }"
        >
          <!-- Current Plan Badge -->
          <div 
            v-if="user?.plan === 'free'" 
            class="current-plan-badge bg-info text-white text-center absolute-top-right"
          >
            <q-icon name="star" class="q-mr-xs" />
            ATUAL
          </div>

          <q-card-section class="text-center bg-info text-white">
            <div class="text-h4 text-weight-bold">
              <q-icon name="free_breakfast" size="md" class="q-mr-sm" />
              Gratuito
            </div>
            <div class="text-h2 text-weight-bold q-mt-md">
              R$ 0
              <span class="text-h6">/mês</span>
            </div>
            <div class="text-subtitle1 opacity-80">
              Perfeito para começar
            </div>
          </q-card-section>

          <q-card-section class="q-pa-lg">
            <div class="q-gutter-sm">
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Até 50 transações/mês</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Dashboard básico</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>3 categorias personalizadas</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Relatórios básicos</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Suporte por email</span>
              </div>
              <div class="feature-item-5">
                <q-icon name="cancel" color="grey-5" class="q-mr-sm" />
                <span>Sem gráficos avançados</span>
              </div>
              <div class="feature-item-5">
                <q-icon name="cancel" color="grey-5" class="q-mr-sm" />
                <span>Sem exportação</span>
              </div>
              <div class="feature-item-5">
                <q-icon name="cancel" color="grey-5" class="q-mr-sm" />
                <span>Sem integração bancária</span>
              </div>
            </div>
          </q-card-section>

          <q-card-actions class="q-pa-lg">
            <q-btn
              v-if="user?.plan !== 'free'"
              color="info"
              label="Downgrade para Gratuito"
              class="full-width"
              icon="downgrade"
              outline
              @click="handlePlanChange('free')"
            />
            <q-btn
              v-else
              color="grey-5"
              label="Plano Atual"
              class="full-width"
              icon="verified"
              disable
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Pro Plan -->
      <div class="col-12 col-md-4">
        <q-card 
          class="plan-card shadow-4 relative-position"
          :class="{ 'current-plan': user?.plan === 'pro', 'popular-plan': true }"
        >
          <!-- Popular Badge -->
          <div class="popular-badge bg-warning text-white text-center absolute-top">
            <q-icon name="star" class="q-mr-xs" />
            MAIS POPULAR
          </div>

          <!-- Current Plan Badge -->
          <div 
            v-if="user?.plan === 'pro'" 
            class="current-plan-badge bg-warning text-white text-center absolute-top-right"
          >
            <q-icon name="star" class="q-mr-xs" />
            ATUAL
          </div>

          <q-card-section class="text-center bg-warning text-white">
            <div class="text-h4 text-weight-bold">
              <q-icon name="star" size="md" class="q-mr-sm" />
              Pro
            </div>
            <div class="text-h2 text-weight-bold q-mt-md">
              R$ {{ billingCycle === 'monthly' ? '29' : '24' }}
              <span class="text-h6">/mês</span>
            </div>
            <div class="text-subtitle1 opacity-80">
              Para profissionais
            </div>
            <div v-if="billingCycle === 'yearly'" class="text-body2 q-mt-xs">
              <s>R$ 29/mês</s> - Economize R$ 60/ano
            </div>
          </q-card-section>

          <q-card-section class="q-pa-lg">
            <div class="q-gutter-sm">
              <div class="feature-item text-weight-bold text-warning">
                <q-icon name="upgrade" color="warning" class="q-mr-sm" />
                <span>Tudo do Gratuito, mais:</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Transações ilimitadas</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Dashboard avançado</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Categorias ilimitadas</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Gráficos avançados</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Exportação PDF/Excel</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Metas financeiras</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Suporte prioritário</span>
              </div>
              <div class="feature-item-5">
                <q-icon name="cancel" color="grey-5" class="q-mr-sm" />
                <span>Sem integração bancária</span>
              </div>
            </div>
          </q-card-section>

          <q-card-actions class="q-pa-lg">
            <q-btn
              v-if="user?.plan !== 'pro'"
              color="warning"
              :label="user?.plan === 'premium' ? 'Downgrade para Pro' : 'Upgrade para Pro'"
              class="full-width text-weight-bold"
              icon="upgrade"
              @click="handlePlanChange('pro')"
            />
            <q-btn
              v-else
              color="grey-5"
              label="Plano Atual"
              class="full-width"
              icon="verified"
              disable
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Premium Plan -->
      <div class="col-12 col-md-4">
        <q-card 
          class="plan-card shadow-4 relative-position"
          :class="{ 'current-plan': user?.plan === 'premium' }"
        >
          <!-- Current Plan Badge -->
          <div 
            v-if="user?.plan === 'premium'" 
            class="current-plan-badge bg-positive text-white text-center absolute-top-right"
          >
            <q-icon name="star" class="q-mr-xs" />
            ATUAL
          </div>

          <q-card-section class="text-center bg-positive text-white">
            <div class="text-h4 text-weight-bold">
              <q-icon name="diamond" size="md" class="q-mr-sm" />
              Premium
            </div>
            <div class="text-h2 text-weight-bold q-mt-md">
              R$ {{ billingCycle === 'monthly' ? '59' : '49' }}
              <span class="text-h6">/mês</span>
            </div>
            <div class="text-subtitle1 opacity-80">
              Solução completa
            </div>
            <div v-if="billingCycle === 'yearly'" class="text-body2 q-mt-xs">
              <s>R$ 59/mês</s> - Economize R$ 120/ano
            </div>
          </q-card-section>

          <q-card-section class="q-pa-lg">
            <div class="q-gutter-sm">
              <div class="feature-item text-weight-bold text-positive">
                <q-icon name="upgrade" color="positive" class="q-mr-sm" />
                <span>Tudo do Pro, mais:</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Integração bancária</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Importação automática</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>IA para categorização</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Relatórios personalizados</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>API para integrações</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Multi-usuários (5 contas)</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Suporte 24/7</span>
              </div>
              <div class="feature-item">
                <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                <span>Manager dedicado</span>
              </div>
            </div>
          </q-card-section>

          <q-card-actions class="q-pa-lg">
            <q-btn
              v-if="user?.plan !== 'premium'"
              color="positive"
              label="Upgrade para Premium"
              class="full-width text-weight-bold"
              icon="diamond"
              @click="handlePlanChange('premium')"
            />
            <q-btn
              v-else
              color="grey-5"
              label="Plano Atual"
              class="full-width"
              icon="verified"
              disable
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="q-mt-xl">
      <div class="text-center q-mb-lg">
        <h5 class="text-h5 q-ma-none text-weight-bold">
          <q-icon name="help" class="q-mr-sm" color="primary" />
          Perguntas Frequentes
        </h5>
      </div>

      <div class="row justify-center">
        <div class="col-12 col-md-8">
          <q-list bordered separator>
            <q-expansion-item
              v-for="faq in faqs"
              :key="faq.id"
              :label="faq.question"
              :icon="faq.icon"
              header-class="text-h6 text-weight-medium"
            >
              <q-card>
                <q-card-section class="text-body1">
                  {{ faq.answer }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
    </div>

    <!-- Payment Dialog -->
    <q-dialog v-model="showPaymentDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon name="payment" class="q-mr-sm" />
            Confirmar Alteração de Plano
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-center q-mb-md">
            <q-icon :name="getPaymentIcon()" size="80px" :color="getPaymentColor()" />
            <div class="text-h6 q-mt-md">
              {{ getPaymentTitle() }}
            </div>
            <div class="text-body1-7 q-mt-sm">
              {{ getPaymentDescription() }}
            </div>
          </div>

          <!-- Plan Comparison -->
          <div class="q-mb-md">
            <div class="row q-col-gutter-sm text-center">
              <div class="col">
                <q-chip :color="getPlanColor(user?.plan)" text-color="white">
                  {{ getPlanName(user?.plan) }}
                </q-chip>
                <div class="text-caption">Plano Atual</div>
              </div>
              <div class="col-auto self-center">
                <q-icon name="arrow_forward" size="sm" />
              </div>
              <div class="col">
                <q-chip :color="getPlanColor(selectedPlan)" text-color="white">
                  {{ getPlanName(selectedPlan) }}
                </q-chip>
                <div class="text-caption">Novo Plano</div>
              </div>
            </div>
          </div>

          <!-- Billing Info -->
          <q-separator class="q-my-md" />
          <div class="text-body2">
            <div class="row items-center q-mb-sm">
              <div class="col-7">Ciclo de cobrança:</div>
              <div class="col-auto text-weight-bold">
                {{ billingCycle === 'monthly' ? 'Mensal' : 'Anual' }}
              </div>
            </div>
            <div class="row items-center q-mb-sm">
              <div class="col-7">Valor:</div>
              <div class="col-auto text-weight-bold text-h6">
                {{ getPaymentAmount() }}
              </div>
            </div>
            <div class="row items-center">
              <div class="col-7">Próxima cobrança:</div>
              <div class="col-auto text-weight-bold">
                {{ getNextBillingDate() }}
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            label="Cancelar" 
            color="grey" 
            flat 
            @click="showPaymentDialog = false"
          />
          <q-btn 
            :label="getPaymentButtonLabel()"
            :color="getPaymentColor()"
            @click="processPayment"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'
import { useNotifications } from '@/composables/useNotifications'

// Composables
const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showError, showConfirm } = useNotifications()

// Refs
const billingCycle = ref('monthly')
const showPaymentDialog = ref(false)
const selectedPlan = ref('')

// Computed
const user = computed(() => authStore.user)

// Data
const faqs = ref([
  {
    id: 1,
    icon: 'help_outline',
    question: 'Posso cancelar minha assinatura a qualquer momento?',
    answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento. O acesso aos recursos premium será mantido até o final do período já pago.'
  },
  {
    id: 2,
    icon: 'payment',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), Pix, boleto bancário e PayPal. Para planos anuais, também oferecemos desconto por transferência bancária.'
  },
  {
    id: 3,
    icon: 'upgrade',
    question: 'Posso fazer upgrade ou downgrade do meu plano?',
    answer: 'Sim! Você pode alterar seu plano a qualquer momento. Upgrades são aplicados imediatamente, enquanto downgrades entram em vigor no próximo ciclo de cobrança.'
  },
  {
    id: 4,
    icon: 'security',
    question: 'Meus dados estão seguros?',
    answer: 'Absolutamente! Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança. Seus dados financeiros são protegidos com o mesmo nível de segurança dos bancos.'
  },
  {
    id: 5,
    icon: 'cloud_sync',
    question: 'Posso acessar meus dados em qualquer dispositivo?',
    answer: 'Sim! Seus dados são sincronizados automaticamente na nuvem e você pode acessá-los de qualquer dispositivo com internet.'
  },
  {
    id: 6,
    icon: 'support',
    question: 'Que tipo de suporte está disponível?',
    answer: 'Oferecemos suporte por email para todos os planos, chat ao vivo para planos Pro e Premium, e suporte telefônico 24/7 exclusivo para clientes Premium.'
  }
])

// Methods
const getPlanName = (plan) => {
  const names = {
    'free': 'Gratuito',
    'pro': 'Pro',
    'premium': 'Premium'
  }
  return names[plan] || 'Desconhecido'
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

const getPlanPrice = (plan, cycle) => {
  const prices = {
    'free': { monthly: 0, yearly: 0 },
    'pro': { monthly: 29, yearly: 24 },
    'premium': { monthly: 59, yearly: 49 }
  }
  return prices[plan]?.[cycle] || 0
}

const handlePlanChange = async (newPlan) => {
  if (newPlan === user.value?.plan) {
    return
  }

  selectedPlan.value = newPlan
  
  // For downgrades, show confirmation
  if (isDowngrade(newPlan)) {
    const confirmed = await showConfirm(
      'Confirmação de Downgrade',
      'Tem certeza que deseja fazer downgrade? Você pode perder acesso a alguns recursos premium.',
      'Confirmar Downgrade',
      'Cancelar'
    )
    
    if (!confirmed) {
      return
    }
  }

  showPaymentDialog.value = true
}

const isDowngrade = (newPlan) => {
  const planLevels = { 'free': 0, 'pro': 1, 'premium': 2 }
  const currentLevel = planLevels[user.value?.plan] || 0
  const newLevel = planLevels[newPlan] || 0
  return newLevel < currentLevel
}

const isUpgrade = (newPlan) => {
  const planLevels = { 'free': 0, 'pro': 1, 'premium': 2 }
  const currentLevel = planLevels[user.value?.plan] || 0
  const newLevel = planLevels[newPlan] || 0
  return newLevel > currentLevel
}

const getPaymentIcon = () => {
  if (selectedPlan.value === 'free') return 'free_breakfast'
  return isUpgrade(selectedPlan.value) ? 'upgrade' : 'downgrade'
}

const getPaymentColor = () => {
  if (selectedPlan.value === 'free') return 'info'
  return isUpgrade(selectedPlan.value) ? 'positive' : 'warning'
}

const getPaymentTitle = () => {
  if (selectedPlan.value === 'free') {
    return 'Downgrade para Gratuito'
  }
  return isUpgrade(selectedPlan.value) 
    ? `Upgrade para ${getPlanName(selectedPlan.value)}`
    : `Downgrade para ${getPlanName(selectedPlan.value)}`
}

const getPaymentDescription = () => {
  if (selectedPlan.value === 'free') {
    return 'Você terá acesso limitado a 50 transações mensais e recursos básicos.'
  }
  
  if (isUpgrade(selectedPlan.value)) {
    return 'Você terá acesso imediato a todos os recursos do novo plano.'
  }
  
  return 'As alterações entrarão em vigor no próximo ciclo de cobrança.'
}

const getPaymentAmount = () => {
  const price = getPlanPrice(selectedPlan.value, billingCycle.value)
  if (price === 0) return 'Gratuito'
  
  const period = billingCycle.value === 'monthly' ? '/mês' : '/ano'
  return `R$ ${price}${period}`
}

const getNextBillingDate = () => {
  const date = new Date()
  if (billingCycle.value === 'monthly') {
    date.setMonth(date.getMonth() + 1)
  } else {
    date.setFullYear(date.getFullYear() + 1)
  }
  return date.toLocaleDateString('pt-BR')
}

const getPaymentButtonLabel = () => {
  if (selectedPlan.value === 'free') return 'Confirmar Downgrade'
  return isUpgrade(selectedPlan.value) ? 'Confirmar Upgrade' : 'Confirmar Downgrade'
}

const processPayment = async () => {
  try {
    // For free plan (downgrade)
    if (selectedPlan.value === 'free') {
      await userService.changePlan({
        plan: selectedPlan.value,
        billingCycle: billingCycle.value
      })
      
      authStore.updateUser({ ...user.value, plan: selectedPlan.value })
      showPaymentDialog.value = false
      showSuccess('Plano alterado com sucesso!')
      return
    }

    // For paid plans, redirect to payment
    const paymentData = {
      plan: selectedPlan.value,
      billingCycle: billingCycle.value,
      amount: getPlanPrice(selectedPlan.value, billingCycle.value),
      isUpgrade: isUpgrade(selectedPlan.value)
    }

    // In a real app, this would redirect to a payment processor
    // For now, we'll simulate the process
    await simulatePayment(paymentData)

  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    showError('Erro ao processar pagamento. Tente novamente.')
  }
}

const simulatePayment = async (paymentData) => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Update user plan
  await userService.changePlan({
    plan: paymentData.plan,
    billingCycle: paymentData.billingCycle
  })

  authStore.updateUser({ ...user.value, plan: paymentData.plan })
  showPaymentDialog.value = false
  
  showSuccess(
    paymentData.isUpgrade 
      ? 'Upgrade realizado com sucesso! Bem-vindo ao seu novo plano!' 
      : 'Plano alterado com sucesso!'
  )
}
</script>

<style scoped>
.plan-card {
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.popular-plan {
  transform: scale(1.05);
  border: 2px solid #f9a825;
}

.popular-plan:hover {
  transform: scale(1.05) translateY(-8px);
}

.current-plan {
  border: 2px solid var(--color-primary);
}

.popular-badge {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  z-index: 1;
  padding: 8px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 14px 14px 0 0;
}

.current-plan-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: bold;
  border-radius: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
  line-height: 1.4;
}

.shadow-4 {
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12);
}

.opacity-80 {
  opacity: 0.8;
}
</style>