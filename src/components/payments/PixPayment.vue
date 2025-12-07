<template>
  <div class="pix-payment">
    <!-- Header com ícone animado -->
    <div class="text-center pix-payment__header">
      <div class="pix-icon-container">
        <q-icon name="pix" size="56px" color="positive" class="pix-icon" />
      </div>
      <div class="text-h4 text-bold q-mt-md">Pague com PIX</div>
      <div class="text-h6 text-grey-7 q-mt-sm">
        Pagamento aprovado em segundos ⚡
      </div>
    </div>

    <q-separator class="q-my-xl" />

    <!-- QR Code - Destaque Principal -->
    <div class="pix-payment__qrcode-section">
      <div class="text-center q-mb-lg">
        <div class="text-h5 text-bold">Escaneie o QR Code</div>
        <div class="text-body1 text-grey-7 q-mt-xs">
          Use a câmera do seu celular ou app do banco
        </div>
      </div>
      
      <div class="pix-payment__qrcode-container">
        <div v-if="payment.pix?.payload" class="pix-payment__qrcode">
          <qrcode-vue 
            :value="payment.pix.payload" 
            :size="280" 
            level="H"
            render-as="svg"
          />
        </div>
        <div v-else class="pix-payment__qrcode-placeholder">
          <q-spinner-dots size="48px" color="primary" />
          <div class="text-body2 text-grey-7 q-mt-md">
            Gerando QR Code...
          </div>
        </div>
      </div>
      
      <!-- Timer de expiração destacado -->
      <div v-if="payment.pix?.expiresAt && status === 'PENDING'" class="text-center q-mt-md">
        <q-chip color="orange" text-color="white" size="md" class="text-bold">
          <q-icon name="schedule" class="q-mr-xs" size="20px" />
          Expira em: {{ formatExpirationTime(payment.pix.expiresAt) }}
        </q-chip>
      </div>
    </div>

    <q-separator class="q-my-xl" />

    <!-- Instruções Visuais -->
    <div class="pix-payment__instructions">
      <div class="text-h6 text-bold text-center q-mb-lg">Como pagar em 3 passos:</div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-card flat bordered class="instruction-card">
            <q-card-section class="text-center">
              <q-avatar color="primary" text-color="white" size="56px" class="q-mb-md">
                <div class="text-h5 text-bold">1</div>
              </q-avatar>
              <div class="text-subtitle1 text-bold">Abra seu app</div>
              <div class="text-body2 text-grey-7 q-mt-sm">
                Abra o aplicativo do seu banco ou carteira digital
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card flat bordered class="instruction-card">
            <q-card-section class="text-center">
              <q-avatar color="primary" text-color="white" size="56px" class="q-mb-md">
                <div class="text-h5 text-bold">2</div>
              </q-avatar>
              <div class="text-subtitle1 text-bold">Escaneie o código</div>
              <div class="text-body2 text-grey-7 q-mt-sm">
                Use a opção "Pagar com PIX" e escaneie o QR Code
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card flat bordered class="instruction-card">
            <q-card-section class="text-center">
              <q-avatar color="primary" text-color="white" size="56px" class="q-mb-md">
                <div class="text-h5 text-bold">3</div>
              </q-avatar>
              <div class="text-subtitle1 text-bold">Confirme o pagamento</div>
              <div class="text-body2 text-grey-7 q-mt-sm">
                Revise os dados e confirme. Pronto! ✅
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <q-separator class="q-my-xl" />

    <!-- Código Copia e Cola - Alternativa -->
    <div class="pix-payment__copy-paste">
      <div class="text-center q-mb-md">
        <div class="text-h6 text-bold">Não consegue escanear?</div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          Use o código Copia e Cola abaixo
        </div>
      </div>
      
      <q-card flat bordered class="copy-card">
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">Código PIX:</div>
          <div class="code-container">
            <code class="pix-code">{{ payment.pix.payload }}</code>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-btn
            :label="copied ? '✓ Código Copiado!' : 'Copiar Código PIX'"
            :icon="copied ? 'check' : 'content_copy'"
            :color="copied ? 'positive' : 'primary'"
            unelevated
            no-caps
            size="lg"
            class="full-width"
            @click="copyToClipboard"
          />
        </q-card-section>
      </q-card>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Status -->
    <div class="pix-payment__status">
      <!-- Aguardando Pagamento -->
      <q-banner v-if="status === 'PENDING'" 
                class="status-banner status-banner--pending"
                rounded>
        <template v-slot:avatar>
          <q-spinner-dots size="56px" color="warning" />
        </template>
        <div class="text-h6 text-bold">Aguardando pagamento...</div>
        <div class="text-body2 q-mt-xs text-grey-7">
          🔄 Verificamos automaticamente a cada 3 segundos
        </div>
      </q-banner>

      <!-- Pagamento Detectado -->
      <q-banner v-else-if="status === 'RECEIVED'" 
                class="status-banner status-banner--received"
                rounded>
        <template v-slot:avatar>
          <q-icon name="hourglass_top" size="56px" color="info" />
        </template>
        <div class="text-h6 text-bold">Pagamento detectado!</div>
        <div class="text-body2 q-mt-xs text-grey-7">
          ⏳ Aguardando confirmação da instituição financeira...
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { usePayment } from 'src/composables/usePayment';
import QrcodeVue from 'qrcode-vue3';

const props = defineProps({
  payment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['confirmed']);

const $q = useQuasar();
const { startPolling, stopPolling } = usePayment();

const copied = ref(false);
const status = ref(props.payment.status);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.payment.pix.payload);
    copied.value = true;
    
    $q.notify({
      type: 'positive',
      message: 'Código PIX copiado!',
      position: 'top',
      timeout: 2000,
    });

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao copiar código',
      position: 'top',
    });
  }
};

const formatExpirationTime = (expiresAt) => {
  const now = new Date();
  const expiration = new Date(expiresAt);
  const diff = expiration - now;
  
  if (diff <= 0) return 'Expirado';
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

onMounted(() => {
  
  // Só inicia polling se tiver ID válido
  if (props.payment?.id && status.value === 'PENDING') {
    startPolling(
      props.payment.id,
      (payment) => {
        status.value = payment.status;
        emit('confirmed', payment);
      }
    );
  } else {
    console.warn('⚠️ Não foi possível iniciar polling:', {
      hasId: !!props.payment?.id,
      id: props.payment?.id,
      status: status.value
    });
  }
});

onUnmounted(() => {
  stopPolling();
});
</script>

<style lang="scss" scoped>
.pix-payment {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;

  // Header com animação
  &__header {
    text-align: center;
    margin-bottom: 32px;
  }
}

.pix-icon-container {
  display: inline-block;
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

// Seção do QR Code
.pix-payment__qrcode-section {
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  .qrcode-wrapper {
    background: white;
    padding: 20px;
    border-radius: 12px;
    display: inline-block;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

// Cards de instrução
.instruction-card {
  transition: all 0.3s ease;
  border: 2px solid #e0e0e0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--q-primary);
  }
}

// Seção Copia e Cola
.copy-card {
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--q-primary);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

.code-container {
  background: #f5f5f5;
  border: 1px dashed #bdbdbd;
  border-radius: 8px;
  padding: 16px;
  max-height: 120px;
  overflow-y: auto;
}

.pix-code {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.4;
  color: #424242;
  word-break: break-all;
  display: block;
}

// Banners de status
.status-banner {
  padding: 24px;
  margin-top: 24px;
  border: 2px solid;
  
  &--pending {
    background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%);
    border-color: #ffd54f;
  }
  
  &--received {
    background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
    border-color: #64b5f6;
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
  .pix-payment {
    padding: 16px;
  }
  
  .pix-payment__qrcode-section {
    padding: 20px;
  }
  
  .instruction-card {
    margin-bottom: 12px;
  }
}
</style>
