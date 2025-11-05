<template>
  <q-page class="checkout-page">
    <div class="container q-py-xl">
      <!-- Header -->
      <div class="text-center q-mb-xl">
        <q-btn
          icon="arrow_back"
          label="Voltar"
          flat
          no-caps
          color="primary"
          @click="goBack"
          class="q-mb-md"
        />
        <h1 class="text-h4 text-bold">
          Finalizar Assinatura
        </h1>
      </div>

      <!-- Loading Plan -->
      <div v-if="loadingPlan" class="text-center q-py-xl">
        <q-spinner-dots size="64px" color="primary" />
        <div class="text-body1 text-grey-7 q-mt-md">
          Carregando informações do plano...
        </div>
      </div>

      <!-- Error Loading Plan -->
      <div v-else-if="planError" class="text-center q-py-xl">
        <q-icon name="error_outline" size="64px" color="negative" />
        <div class="text-body1 text-negative q-mt-md">
          {{ planError }}
        </div>
        <q-btn
          label="Voltar para Planos"
          color="primary"
          outline
          class="q-mt-md"
          @click="router.push({ name: 'plans' })"
        />
      </div>

      <!-- Checkout Content -->
      <template v-else-if="currentPlan">
        <!-- Step 1: Escolher Método de Pagamento -->
        <div v-if="step === 1">
          <!-- Resumo do Plano -->
          <q-card flat bordered class="q-mb-lg">
            <q-card-section>
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h6 text-bold">{{ currentPlan.name }}</div>
                  <div class="text-body2 text-grey-7">
                    {{ currentPlan.description }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-h5 text-primary text-bold">
                    {{ formatPrice(currentPlan.price) }}
                  </div>
                  <div class="text-caption text-grey-6">
                    /{{ getBillingCycleLabel(currentPlan.billing_cycle) }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Seletor de Método -->
          <PaymentMethodSelector
            v-model="selectedMethod"
            @continue="goToPaymentForm"
          />
        </div>

        <!-- Step 2: Formulário de Pagamento -->
        <div v-else-if="step === 2">
          <q-card flat bordered>
            <!-- PIX -->
            <template v-if="selectedMethod === 'PIX'">
              <!-- Loading -->
              <q-card-section v-if="creatingPayment" class="text-center q-py-xl">
                <q-spinner-dots size="64px" color="primary" />
                <div class="text-h6 q-mt-md">Gerando QR Code PIX...</div>
                <div class="text-body2 text-grey-7 q-mt-sm">
                  Aguarde um momento
                </div>
              </q-card-section>

              <!-- QR Code -->
              <PixPayment
                v-else-if="paymentCreated && currentPayment"
                :payment="currentPayment"
                @confirmed="handlePaymentConfirmed"
              />

              <!-- Fallback -->
              <q-card-section v-else class="text-center q-py-xl">
                <q-icon name="error_outline" size="64px" color="warning" />
                <div class="text-h6 q-mt-md">Erro ao gerar PIX</div>
                <q-btn 
                  label="Tentar Novamente" 
                  color="primary" 
                  class="q-mt-md"
                  @click="createPixPayment"
                />
              </q-card-section>
            </template>

            <!-- Boleto -->
            <template v-else-if="selectedMethod === 'BOLETO'">
              <!-- Loading -->
              <q-card-section v-if="creatingPayment" class="text-center q-py-xl">
                <q-spinner-dots size="64px" color="primary" />
                <div class="text-h6 q-mt-md">Gerando Boleto...</div>
                <div class="text-body2 text-grey-7 q-mt-sm">
                  Aguarde um momento
                </div>
              </q-card-section>

              <!-- Boleto -->
              <BoletoPayment
                v-else-if="paymentCreated && currentPayment"
                :payment="currentPayment"
                @confirmed="handlePaymentConfirmed"
              />

              <!-- Fallback -->
              <q-card-section v-else class="text-center q-py-xl">
                <q-icon name="error_outline" size="64px" color="warning" />
                <div class="text-h6 q-mt-md">Erro ao gerar Boleto</div>
                <q-btn 
                  label="Tentar Novamente" 
                  color="primary" 
                  class="q-mt-md"
                  @click="createBoletoPayment"
                />
              </q-card-section>
            </template>

            <!-- Cartão de Crédito -->
            <template v-else-if="selectedMethod === 'CREDIT_CARD'">
              <CreditCardForm
                :amount="currentPlan.price"
                :loading="creatingPayment"
                @submit="createCreditCardPayment"
              />
            </template>
          </q-card>

          <!-- Botão Voltar -->
          <div class="text-center q-mt-md">
            <q-btn
              label="Escolher Outro Método"
              flat
              color="primary"
              @click="backToMethodSelection"
            />
          </div>
        </div>

        <!-- Step 3: Sucesso -->
        <div v-else-if="step === 3" class="text-center q-py-xl">
          <q-icon name="check_circle" size="128px" color="positive" />
          <h2 class="text-h4 text-bold q-mt-lg">
            🎉 Pagamento Confirmado!
          </h2>
          <p class="text-h6 text-grey-7 q-mt-md">
            Seu plano <strong>{{ currentPlan.name }}</strong> foi ativado com sucesso!
          </p>
          <p class="text-body1 text-grey-7 q-mt-md">
            Você será redirecionado para o dashboard em {{ countdown }} segundos...
          </p>
          <q-btn
            label="Ir para Dashboard Agora"
            color="primary"
            size="lg"
            unelevated
            no-caps
            class="q-mt-lg"
            @click="goToDashboard"
          />
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { usePlans } from 'src/composables/usePlans';
import { usePayment } from 'src/composables/usePayment';
import { useAuthStore } from 'src/stores/auth';
import PaymentMethodSelector from 'src/components/payments/PaymentMethodSelector.vue';
import PixPayment from 'src/components/payments/PixPayment.vue';
import BoletoPayment from 'src/components/payments/BoletoPayment.vue';
import CreditCardForm from 'src/components/payments/CreditCardForm.vue';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const authStore = useAuthStore();

const {
  loading: loadingPlan,
  error: planError,
  currentPlan,
  getById: getPlan,
  formatPrice,
  getBillingCycleLabel,
} = usePlans();

const {
  loading: creatingPayment,
  currentPayment,
  create: createPayment,
} = usePayment();

const step = ref(1); // 1: método, 2: formulário, 3: sucesso
const selectedMethod = ref(null);
const paymentCreated = ref(false);
const countdown = ref(5);
let countdownInterval = null;

const goBack = () => {
  if (step.value > 1) {
    step.value--;
  } else {
    router.push({ name: 'plans' });
  }
};

const goToPaymentForm = async () => {
  if (!selectedMethod.value) {
    $q.notify({
      type: 'warning',
      message: 'Selecione um método de pagamento',
      position: 'top',
    });
    return;
  }
  
  step.value = 2;
  
  // Gerar pagamento automaticamente para PIX e Boleto
  if (selectedMethod.value === 'PIX') {
    await createPixPayment();
  } else if (selectedMethod.value === 'BOLETO') {
    await createBoletoPayment();
  }
};

const backToMethodSelection = () => {
  step.value = 1;
  paymentCreated.value = false;
  selectedMethod.value = null;
};

const createPixPayment = async () => {
  console.log('🔵 Iniciando criação de pagamento PIX...');
  console.log('Plan ID:', currentPlan.value?.id);
  
  try {
    const payment = await createPayment({
      planId: currentPlan.value.id,
      paymentMethod: 'PIX',
    });
    
    console.log('✅ Pagamento PIX criado:', payment);
    console.log('currentPayment.value:', currentPayment.value);
    
    paymentCreated.value = true;
    console.log('paymentCreated.value agora é:', paymentCreated.value);
  } catch (err) {
    console.error('❌ Erro ao criar pagamento PIX:', err);
    $q.notify({
      type: 'negative',
      message: 'Erro ao gerar PIX: ' + (err.message || 'Erro desconhecido'),
      position: 'top',
    });
  }
};

const createBoletoPayment = async () => {
  console.log('🔵 Iniciando criação de pagamento Boleto...');
  console.log('Plan ID:', currentPlan.value?.id);
  
  try {
    const payment = await createPayment({
      planId: currentPlan.value.id,
      paymentMethod: 'BOLETO',
    });
    
    console.log('✅ Pagamento Boleto criado:', payment);
    console.log('currentPayment.value:', currentPayment.value);
    
    paymentCreated.value = true;
    console.log('paymentCreated.value agora é:', paymentCreated.value);
  } catch (err) {
    console.error('❌ Erro ao criar pagamento Boleto:', err);
    $q.notify({
      type: 'negative',
      message: 'Erro ao gerar Boleto: ' + (err.message || 'Erro desconhecido'),
      position: 'top',
    });
  }
};

const createCreditCardPayment = async (cardData) => {
  try {
    const payment = await createPayment({
      planId: currentPlan.value.id,
      paymentMethod: 'CREDIT_CARD',
      creditCard: cardData,
    });

    // Cartão pode ser aprovado instantaneamente
    if (payment.status === 'CONFIRMED') {
      handlePaymentConfirmed(payment);
    } else {
      $q.notify({
        type: 'negative',
        message: 'Pagamento recusado. Tente outro cartão.',
        position: 'top',
      });
    }
  } catch (err) {
    console.error('Erro ao processar cartão:', err);
  }
};

const handlePaymentConfirmed = async (payment) => {
  // Atualiza informações do usuário
  await authStore.fetchProfile();
  
  // Vai para tela de sucesso
  step.value = 3;
  
  // Inicia contagem regressiva
  startCountdown();
};

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      goToDashboard();
    }
  }, 1000);
};

const goToDashboard = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  router.push({ name: 'dashboard' });
};

onMounted(async () => {
  const planId = route.params.planId;
  
  if (!planId) {
    router.push({ name: 'plans' });
    return;
  }

  try {
    await getPlan(planId);
  } catch (err) {
    console.error('Erro ao carregar plano:', err);
  }
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, transparent 100%);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}
</style>
