<template>
  <div class="pix-payment">
    <div class="text-center">
      <q-icon name="pix" size="48px" color="primary" />
      <div class="text-h5 q-mt-md">Pague com PIX</div>
      <div class="text-body2 text-grey-7 q-mt-sm">
        Escaneie o QR Code ou use o código Copia e Cola
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- QR Code -->
    <div class="pix-payment__qrcode-container">
      <div v-if="payment.pix?.payload" class="pix-payment__qrcode">
        <qrcode-vue 
          :value="payment.pix.payload" 
          :size="256" 
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

    <!-- Instruções -->
    <div class="pix-payment__instructions q-mt-lg">
      <div class="text-subtitle2 text-bold q-mb-md">Como pagar:</div>
      <q-list dense>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="32px">1</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Abra o app do seu banco</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="32px">2</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Escolha pagar com PIX</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="32px">3</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Escaneie o QR Code acima</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Código Copia e Cola -->
    <div class="pix-payment__copy-paste">
      <div class="text-subtitle2 text-bold q-mb-md">
        Ou use o código Copia e Cola:
      </div>
      
      <q-input
        v-model="payment.pix.payload"
        readonly
        outlined
        dense
        type="textarea"
        rows="3"
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-btn
            icon="content_copy"
            flat
            round
            dense
            color="primary"
            @click="copyToClipboard"
          >
            <q-tooltip>Copiar código</q-tooltip>
          </q-btn>
        </template>
      </q-input>

      <q-btn
        :label="copied ? 'Código Copiado!' : 'Copiar Código PIX'"
        :icon="copied ? 'check' : 'content_copy'"
        :color="copied ? 'positive' : 'primary'"
        unelevated
        no-caps
        class="full-width"
        @click="copyToClipboard"
      />
    </div>

    <q-separator class="q-my-lg" />

    <!-- Status -->
    <div class="pix-payment__status text-center">
      <div v-if="status === 'PENDING'" class="text-warning">
        <q-spinner-dots size="32px" color="warning" />
        <div class="text-body1 q-mt-sm">
          Aguardando pagamento...
        </div>
        <div class="text-caption text-grey-6">
          Atualizaremos automaticamente quando detectarmos o pagamento
        </div>
      </div>

      <div v-else-if="status === 'RECEIVED'" class="text-info">
        <q-icon name="info" size="48px" color="info" />
        <div class="text-body1 q-mt-sm">
          Pagamento detectado!
        </div>
        <div class="text-caption text-grey-6">
          Aguardando confirmação...
        </div>
      </div>

      <div v-else-if="status === 'CONFIRMED'" class="text-positive">
        <q-icon name="check_circle" size="64px" color="positive" />
        <div class="text-h6 q-mt-sm">
          🎉 Pagamento Confirmado!
        </div>
        <div class="text-body2 q-mt-sm">
          Seu plano foi ativado com sucesso
        </div>
      </div>
    </div>

    <!-- Timer de expiração -->
    <div v-if="payment.pix?.expiresAt && status === 'PENDING'" class="text-center q-mt-md">
      <q-chip color="warning" text-color="white" size="sm">
        <q-icon name="schedule" class="q-mr-xs" />
        Expira em: {{ formatExpirationTime(payment.pix.expiresAt) }}
      </q-chip>
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
  // Inicia polling para verificar pagamento
  startPolling(
    props.payment.id,
    (payment) => {
      status.value = payment.status;
      emit('confirmed', payment);
    }
  );
});

onUnmounted(() => {
  stopPolling();
});
</script>

<style lang="scss" scoped>
.pix-payment {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;

  &__qrcode-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  &__qrcode {
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__qrcode-placeholder {
    text-align: center;
  }

  &__instructions {
    background: rgba(0, 0, 0, 0.02);
    padding: 16px;
    border-radius: 8px;
  }

  &__copy-paste {
    background: rgba(0, 0, 0, 0.02);
    padding: 16px;
    border-radius: 8px;
  }

  &__status {
    padding: 24px;
  }
}
</style>
