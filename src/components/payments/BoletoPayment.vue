<template>
  <div class="boleto-payment">
    <!-- Header -->
    <div class="boleto-payment__header">
      <div class="boleto-icon-container">
        <q-icon name="receipt_long" size="56px" color="info" />
      </div>
      <div class="text-h4 text-bold q-mt-md">💳 Boleto Bancário</div>
      <div class="text-body1 text-grey-7 q-mt-sm">
        Pague em qualquer banco, lotérica ou internet banking
      </div>
      <q-chip 
        v-if="payment.boleto?.dueDate" 
        color="orange" 
        text-color="white" 
        size="md"
        class="q-mt-md"
      >
        <q-icon name="event" class="q-mr-xs" />
        Vencimento: {{ formatDate(payment.boleto.dueDate) }}
      </q-chip>
    </div>

    <q-separator class="q-my-xl" />

    <!-- Código de Barras -->
    <div class="boleto-payment__barcode-section">
      <div class="text-center q-mb-md">
        <div class="text-h6 text-bold">Código de Barras</div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          Use este código para realizar o pagamento
        </div>
      </div>
      
      <q-card flat bordered class="barcode-card">
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">Código:</div>
          <div class="barcode-container">
            <code class="barcode-code">{{ payment.boleto.barcode }}</code>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-btn
            :label="copied ? '✓ Código Copiado!' : 'Copiar Código de Barras'"
            :icon="copied ? 'check' : 'content_copy'"
            :color="copied ? 'positive' : 'info'"
            unelevated
            no-caps
            size="lg"
            class="full-width"
            @click="copyBarcode"
          />
        </q-card-section>
      </q-card>
    </div>

    <q-separator class="q-my-xl" />

    <!-- Instruções -->
    <div class="boleto-payment__instructions">
      <div class="text-center q-mb-lg">
        <div class="text-h6 text-bold">Como pagar</div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          Siga os passos abaixo
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="instruction-card">
            <q-card-section class="text-center">
              <q-avatar color="info" text-color="white" size="56px" class="q-mb-md">
                <div class="text-h5 text-bold">1</div>
              </q-avatar>
              <div class="text-subtitle1 text-bold">Acesse seu banco</div>
              <div class="text-body2 text-grey-7 q-mt-sm">
                Internet banking ou app 📱
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="instruction-card">
            <q-card-section class="text-center">
              <q-avatar color="info" text-color="white" size="56px" class="q-mb-md">
                <div class="text-h5 text-bold">2</div>
              </q-avatar>
              <div class="text-subtitle1 text-bold">Escolha pagamento</div>
              <div class="text-body2 text-grey-7 q-mt-sm">
                Código de barras 🔢
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="instruction-card">
            <q-card-section class="text-center">
              <q-avatar color="info" text-color="white" size="56px" class="q-mb-md">
                <div class="text-h5 text-bold">3</div>
              </q-avatar>
              <div class="text-subtitle1 text-bold">Cole o código</div>
              <div class="text-body2 text-grey-7 q-mt-sm">
                Use o código acima 📋
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="instruction-card">
            <q-card-section class="text-center">
              <q-avatar color="info" text-color="white" size="56px" class="q-mb-md">
                <div class="text-h5 text-bold">4</div>
              </q-avatar>
              <div class="text-subtitle1 text-bold">Confirme</div>
              <div class="text-body2 text-grey-7 q-mt-sm">
                Revise e pague ✅
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <q-separator class="q-my-xl" />

    <!-- Ações do Boleto -->
    <div class="boleto-payment__actions">
      <div class="text-center q-mb-md">
        <div class="text-h6 text-bold">Baixe ou visualize seu boleto</div>
      </div>

      <div class="row q-col-gutter-md">
        <!-- Baixar PDF -->
        <div class="col-12 col-md-6">
          <q-btn
            label="📄 Baixar Boleto PDF"
            icon="download"
            color="info"
            unelevated
            no-caps
            size="lg"
            class="full-width"
            :href="payment.boleto.pdfUrl"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>

        <!-- Abrir no navegador -->
        <div class="col-12 col-md-6">
          <q-btn
            label="👁️ Visualizar Boleto"
            icon="open_in_new"
            color="info"
            outline
            no-caps
            size="lg"
            class="full-width"
            :href="payment.invoice_url"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </div>
    </div>

    <q-separator class="q-my-xl" />

    <!-- Informações importantes -->
    <q-banner class="info-banner" rounded>
      <template v-slot:avatar>
        <q-icon name="info" color="warning" size="42px" />
      </template>
      <div class="text-subtitle1 text-bold q-mb-sm">
        ⚠️ Informações Importantes
      </div>
      <div class="info-list">
        <div class="info-item">
          <q-icon name="schedule" color="warning" />
          <span>O pagamento pode levar até <strong>3 dias úteis</strong> para ser confirmado</span>
        </div>
        <div class="info-item">
          <q-icon name="notifications_active" color="warning" />
          <span>Você receberá um <strong>email</strong> quando o pagamento for confirmado</span>
        </div>
        <div class="info-item">
          <q-icon name="save" color="warning" />
          <span>Guarde o <strong>comprovante</strong> de pagamento</span>
        </div>
      </div>
    </q-banner>

    <!-- Status -->
    <div class="boleto-payment__status q-mt-lg">
      <!-- Aguardando Pagamento -->
      <q-banner v-if="status === 'PENDING'" 
                class="status-banner status-banner--pending"
                rounded>
        <template v-slot:avatar>
          <q-spinner-dots size="56px" color="warning" />
        </template>
        <div class="text-h6 text-bold">Aguardando pagamento...</div>
        <div class="text-body2 q-mt-xs text-grey-7">
          🕐 Pague até o vencimento para ativar seu plano
        </div>
      </q-banner>

      <!-- Pagamento Confirmado -->
      <q-banner v-else-if="status === 'CONFIRMED'" 
                class="status-banner status-banner--confirmed"
                rounded>
        <template v-slot:avatar>
          <q-icon name="check_circle" size="64px" color="positive" class="confirmed-icon" />
        </template>
        <div class="text-h5 text-bold">🎉 Pagamento Confirmado!</div>
        <div class="text-body1 q-mt-sm">
          Seu plano foi ativado com sucesso
        </div>
        <q-btn
          label="Ver Meu Plano"
          icon="arrow_forward"
          color="positive"
          unelevated
          no-caps
          class="q-mt-md"
          @click="$router.push('/profile')"
        />
      </q-banner>

    </div>

    <!-- Verificação Manual -->
    <div class="text-center q-mt-md">
      <q-btn
        label="Verificar Status Manualmente"
        icon="refresh"
        color="info"
        outline
        no-caps
        size="md"
        class="full-width"
        :loading="checkingStatus"
        @click="checkPaymentStatus"
      >
        <q-tooltip>Atualizar status do pagamento</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { usePayment } from 'src/composables/usePayment';

const props = defineProps({
  payment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['confirmed']);

const $q = useQuasar();
const { checkStatus } = usePayment();

const copied = ref(false);
const status = ref(props.payment.status);
const checkingStatus = ref(false);

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR');
};

const copyBarcode = async () => {
  try {
    await navigator.clipboard.writeText(props.payment.boleto.barcode);
    copied.value = true;
    $q.notify({
      type: 'positive',
      message: 'Código de barras copiado!',
      position: 'top',
    });
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao copiar código',
      position: 'top',
    });
  }
};

const checkPaymentStatus = async () => {
  checkingStatus.value = true;
  try {
    const response = await checkStatus(props.payment.id);
    status.value = response.status;
    
    if (response.status === 'CONFIRMED') {
      $q.notify({
        type: 'positive',
        message: 'Pagamento confirmado!',
        position: 'top',
      });
      emit('confirmed', response);
    } else {
      $q.notify({
        type: 'info',
        message: 'Pagamento ainda pendente',
        position: 'top',
      });
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao verificar status',
      position: 'top',
    });
  } finally {
    checkingStatus.value = false;
  }
};

onMounted(() => {
  // Verificar status inicial
  if (props.payment.status === 'PENDING') {
    checkPaymentStatus();
  }
});
</script>

<style lang="scss" scoped>
.boleto-payment {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;

  // Header com animação
  &__header {
    text-align: center;
    margin-bottom: 32px;
  }
}

.boleto-icon-container {
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

// Seção do código de barras
.boleto-payment__barcode-section {
  margin-bottom: 32px;
}

.barcode-card {
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--q-info);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

.barcode-container {
  background: #f5f5f5;
  border: 1px dashed #bdbdbd;
  border-radius: 8px;
  padding: 16px;
  max-height: 80px;
  overflow-y: auto;
}

.barcode-code {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.4;
  color: #424242;
  word-break: break-all;
  display: block;
}

// Cards de instrução
.instruction-card {
  transition: all 0.3s ease;
  border: 2px solid #e0e0e0;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--q-info);
  }
}

// Banner de informações
.info-banner {
  background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%);
  border: 2px solid #ffd54f;
  padding: 20px;
}

.info-list {
  margin-top: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  i {
    flex-shrink: 0;
  }
  
  span {
    line-height: 1.5;
  }
}

// Banners de status
.status-banner {
  padding: 24px;
  border: 2px solid;
  
  &--pending {
    background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%);
    border-color: #ffd54f;
  }
  
  &--confirmed {
    background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
    border-color: #81c784;
    text-align: center;
  }
}

.confirmed-icon {
  animation: checkmark 0.6s ease-in-out;
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

// Responsividade
@media (max-width: 768px) {
  .boleto-payment {
    padding: 16px;
  }
  
  .instruction-card {
    margin-bottom: 12px;
  }
}
</style>
