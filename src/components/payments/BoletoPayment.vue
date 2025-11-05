<template>
  <div class="boleto-payment">
    <div class="text-center">
      <q-icon name="receipt" size="48px" color="primary" />
      <div class="text-h5 q-mt-md">Boleto Bancário</div>
      <div class="text-body2 text-grey-7 q-mt-sm">
        Pague em qualquer banco, lotérica ou internet banking
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Código de Barras -->
    <div class="boleto-payment__barcode">
      <div class="text-subtitle2 text-bold q-mb-md">
        Código de Barras:
      </div>
      
      <q-input
        v-model="payment.boleto.barcode"
        readonly
        outlined
        dense
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-btn
            icon="content_copy"
            flat
            round
            dense
            color="primary"
            @click="copyBarcode"
          >
            <q-tooltip>Copiar código</q-tooltip>
          </q-btn>
        </template>
      </q-input>

      <q-btn
        :label="copied ? 'Código Copiado!' : 'Copiar Código de Barras'"
        :icon="copied ? 'check' : 'content_copy'"
        :color="copied ? 'positive' : 'primary'"
        unelevated
        no-caps
        class="full-width"
        @click="copyBarcode"
      />
    </div>

    <q-separator class="q-my-lg" />

    <!-- Instruções -->
    <div class="boleto-payment__instructions">
      <div class="text-subtitle2 text-bold q-mb-md">Como pagar:</div>
      <q-list dense>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="32px">1</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Acesse seu internet banking ou app do banco</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="32px">2</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Escolha pagar com código de barras</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="32px">3</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Cole o código de barras acima</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="32px">4</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Confirme o pagamento</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Ações do Boleto -->
    <div class="boleto-payment__actions">
      <div class="text-subtitle2 text-bold q-mb-md">
        Opções de pagamento:
      </div>

      <div class="q-gutter-md">
        <!-- Baixar PDF -->
        <q-btn
          label="Baixar Boleto PDF"
          icon="download"
          color="primary"
          unelevated
          no-caps
          class="full-width"
          :href="payment.boleto.pdfUrl"
          target="_blank"
          rel="noopener noreferrer"
        />

        <!-- Abrir no navegador -->
        <q-btn
          label="Visualizar Boleto"
          icon="open_in_new"
          color="primary"
          outline
          no-caps
          class="full-width"
          :href="payment.invoice_url"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Informações importantes -->
    <q-card flat bordered class="bg-warning text-white q-pa-md">
      <div class="text-subtitle2 text-bold q-mb-sm">
        ⚠️ Informações Importantes:
      </div>
      <ul class="q-pl-md q-mb-none">
        <li>O pagamento pode levar até 3 dias úteis para ser confirmado</li>
        <li>Após o pagamento, aguarde a confirmação bancária</li>
        <li>Você receberá um email quando o pagamento for confirmado</li>
        <li>Guarde o comprovante de pagamento</li>
      </ul>
    </q-card>

    <!-- Data de Vencimento -->
    <div class="text-center q-mt-md">
      <q-chip color="info" text-color="white">
        <q-icon name="event" class="q-mr-xs" />
        Vencimento: {{ formatDueDate(payment.due_date) }}
      </q-chip>
    </div>

    <!-- Status -->
    <div class="boleto-payment__status text-center q-mt-lg">
      <div v-if="status === 'PENDING'" class="text-warning">
        <q-icon name="schedule" size="48px" color="warning" />
        <div class="text-body1 q-mt-sm">
          Aguardando pagamento
        </div>
        <div class="text-caption text-grey-6">
          Pague o boleto para ativar seu plano
        </div>
      </div>

      <div v-else-if="status === 'RECEIVED'" class="text-info">
        <q-icon name="info" size="48px" color="info" />
        <div class="text-body1 q-mt-sm">
          Pagamento detectado!
        </div>
        <div class="text-caption text-grey-6">
          Aguardando confirmação bancária...
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

    <!-- Botão "Já Paguei" -->
    <div v-if="status === 'PENDING'" class="text-center q-mt-lg">
      <q-btn
        label="Já Paguei o Boleto"
        color="positive"
        outline
        no-caps
        @click="checkPaymentStatus"
        :loading="checking"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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
const checking = ref(false);

const copyBarcode = async () => {
  try {
    await navigator.clipboard.writeText(props.payment.boleto.barcode);
    copied.value = true;
    
    $q.notify({
      type: 'positive',
      message: 'Código de barras copiado!',
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

const formatDueDate = (dueDate) => {
  return new Date(dueDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const checkPaymentStatus = async () => {
  checking.value = true;
  
  try {
    const payment = await checkStatus(props.payment.id);
    status.value = payment.status;
    
    if (payment.status === 'CONFIRMED' || payment.status === 'RECEIVED') {
      $q.notify({
        type: 'positive',
        message: 'Pagamento confirmado!',
        position: 'top',
      });
      emit('confirmed', payment);
    } else {
      $q.notify({
        type: 'info',
        message: 'Ainda não detectamos o pagamento. Pode levar até 3 dias úteis.',
        position: 'top',
        timeout: 4000,
      });
    }
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao verificar status do pagamento',
      position: 'top',
    });
  } finally {
    checking.value = false;
  }
};
</script>

<style lang="scss" scoped>
.boleto-payment {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;

  &__barcode {
    background: rgba(0, 0, 0, 0.02);
    padding: 16px;
    border-radius: 8px;
  }

  &__instructions {
    background: rgba(0, 0, 0, 0.02);
    padding: 16px;
    border-radius: 8px;
  }

  &__actions {
    background: rgba(0, 0, 0, 0.02);
    padding: 16px;
    border-radius: 8px;
  }

  &__status {
    padding: 24px;
  }
}
</style>
