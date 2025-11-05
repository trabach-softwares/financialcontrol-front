<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Status do Pagamento</div>
    </q-card-section>

    <q-separator />

    <q-card-section v-if="payment">
      <!-- Status Badge -->
      <div class="text-center q-mb-lg">
        <q-icon 
          :name="getStatusIcon(payment.status)" 
          :color="getStatusColor(payment.status)"
          size="64px"
        />
        <div class="text-h6 q-mt-md">
          {{ getStatusLabel(payment.status) }}
        </div>
      </div>

      <!-- Detalhes do Pagamento -->
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label caption>ID do Pagamento</q-item-label>
            <q-item-label>{{ payment.id }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>Método</q-item-label>
            <q-item-label>
              <q-chip :icon="getPaymentMethodIcon(payment.payment_method)" size="sm">
                {{ getPaymentMethodLabel(payment.payment_method) }}
              </q-chip>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>Valor</q-item-label>
            <q-item-label class="text-h6 text-primary">
              {{ formatCurrency(payment.value) }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="payment.created_at">
          <q-item-section>
            <q-item-label caption>Criado em</q-item-label>
            <q-item-label>{{ formatDate(payment.created_at) }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="payment.paid_at">
          <q-item-section>
            <q-item-label caption>Pago em</q-item-label>
            <q-item-label>{{ formatDate(payment.paid_at) }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="payment.confirmed_at">
          <q-item-section>
            <q-item-label caption>Confirmado em</q-item-label>
            <q-item-label>{{ formatDate(payment.confirmed_at) }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="payment.due_date && payment.payment_method === 'BOLETO'">
          <q-item-section>
            <q-item-label caption>Vencimento</q-item-label>
            <q-item-label>{{ formatDate(payment.due_date) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator class="q-my-md" />

      <!-- Ações -->
      <div class="q-gutter-sm">
        <!-- Ver Detalhes -->
        <q-btn
          v-if="payment.invoice_url"
          label="Ver Fatura"
          icon="open_in_new"
          color="primary"
          outline
          no-caps
          class="full-width"
          :href="payment.invoice_url"
          target="_blank"
          rel="noopener noreferrer"
        />

        <!-- Baixar PDF (Boleto) -->
        <q-btn
          v-if="payment.boleto?.pdfUrl"
          label="Baixar Boleto"
          icon="download"
          color="primary"
          outline
          no-caps
          class="full-width"
          :href="payment.boleto.pdfUrl"
          target="_blank"
          rel="noopener noreferrer"
        />

        <!-- Verificar Status -->
        <q-btn
          v-if="payment.status === 'PENDING' || payment.status === 'RECEIVED'"
          label="Atualizar Status"
          icon="refresh"
          color="primary"
          flat
          no-caps
          class="full-width"
          :loading="checking"
          @click="checkStatus"
        />

        <!-- Cancelar -->
        <q-btn
          v-if="payment.status === 'PENDING' && showCancelButton"
          label="Cancelar Pagamento"
          icon="cancel"
          color="negative"
          flat
          no-caps
          class="full-width"
          @click="confirmCancel"
        />
      </div>
    </q-card-section>

    <q-card-section v-else>
      <div class="text-center text-grey-7">
        Nenhum pagamento selecionado
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { usePayment } from 'src/composables/usePayment';

const props = defineProps({
  payment: {
    type: Object,
    default: null,
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['updated', 'cancelled']);

const $q = useQuasar();
const { 
  checkStatus: checkPaymentStatus, 
  cancel: cancelPayment,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
  getPaymentMethodIcon,
} = usePayment();

const checking = ref(false);

const getStatusIcon = (status) => {
  const icons = {
    PENDING: 'schedule',
    RECEIVED: 'info',
    CONFIRMED: 'check_circle',
    OVERDUE: 'error',
    CANCELLED: 'cancel',
  };
  return icons[status] || 'help';
};

const getPaymentMethodLabel = (method) => {
  const labels = {
    PIX: 'PIX',
    BOLETO: 'Boleto',
    CREDIT_CARD: 'Cartão de Crédito',
  };
  return labels[method] || method;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const checkStatus = async () => {
  checking.value = true;
  
  try {
    const updated = await checkPaymentStatus(props.payment.id);
    
    $q.notify({
      type: updated.status === 'CONFIRMED' ? 'positive' : 'info',
      message: `Status: ${getStatusLabel(updated.status)}`,
      position: 'top',
    });

    emit('updated', updated);
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao verificar status',
      position: 'top',
    });
  } finally {
    checking.value = false;
  }
};

const confirmCancel = () => {
  $q.dialog({
    title: 'Cancelar Pagamento',
    message: 'Tem certeza que deseja cancelar este pagamento?',
    cancel: {
      label: 'Não',
      flat: true,
    },
    ok: {
      label: 'Sim, cancelar',
      color: 'negative',
    },
  }).onOk(async () => {
    try {
      await cancelPayment(props.payment.id);
      
      $q.notify({
        type: 'positive',
        message: 'Pagamento cancelado com sucesso',
        position: 'top',
      });

      emit('cancelled', props.payment.id);
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao cancelar pagamento',
        position: 'top',
      });
    }
  });
};
</script>
