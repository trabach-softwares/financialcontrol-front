<template>
  <q-page class="payments-history-page">
    <div class="container q-py-xl">
      <!-- Header -->
      <div class="q-mb-xl">
        <h1 class="text-h4 text-bold">Histórico de Pagamentos</h1>
        <p class="text-body1 text-grey-7">
          Acompanhe todos os seus pagamentos e assinaturas
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-dots size="64px" color="primary" />
        <div class="text-body1 text-grey-7 q-mt-md">
          Carregando pagamentos...
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center q-py-xl">
        <q-icon name="error_outline" size="64px" color="negative" />
        <div class="text-body1 text-negative q-mt-md">
          {{ error }}
        </div>
        <q-btn
          label="Tentar Novamente"
          color="primary"
          outline
          class="q-mt-md"
          @click="loadPayments"
        />
      </div>

      <!-- Payments List -->
      <template v-else>
        <!-- Filters -->
        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="filterStatus"
                  :options="statusOptions"
                  label="Status"
                  outlined
                  dense
                  emit-value
                  map-options
                  @update:model-value="loadPayments"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="filterMethod"
                  :options="methodOptions"
                  label="Método de Pagamento"
                  outlined
                  dense
                  emit-value
                  map-options
                  @update:model-value="loadPayments"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-btn
                  label="Limpar Filtros"
                  icon="clear"
                  flat
                  color="primary"
                  @click="clearFilters"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Empty State -->
        <div v-if="paymentsList.length === 0" class="text-center q-py-xl">
          <q-icon name="inbox" size="64px" color="grey-5" />
          <div class="text-body1 text-grey-7 q-mt-md">
            Nenhum pagamento encontrado
          </div>
          <q-btn
            label="Ver Planos"
            color="primary"
            outline
            class="q-mt-md"
            @click="router.push({ name: 'plans' })"
          />
        </div>

        <!-- Payments Grid -->
        <div v-else class="row q-col-gutter-md">
          <div
            v-for="payment in paymentsList"
            :key="payment.id"
            class="col-12 col-md-6 col-lg-4"
          >
            <q-card class="payment-card cursor-pointer" @click="selectPayment(payment)">
              <q-card-section>
                <!-- Status Badge -->
                <div class="row items-center justify-between q-mb-md">
                  <q-chip
                    :color="getStatusColor(payment.status)"
                    text-color="white"
                    size="sm"
                  >
                    {{ getStatusLabel(payment.status) }}
                  </q-chip>
                  <q-icon
                    :name="getPaymentMethodIcon(payment.payment_method)"
                    size="24px"
                    color="grey-7"
                  />
                </div>

                <!-- Valor -->
                <div class="text-h5 text-primary text-bold q-mb-sm">
                  {{ formatCurrency(payment.value) }}
                </div>

                <!-- Método -->
                <div class="text-body2 text-grey-7 q-mb-sm">
                  {{ getPaymentMethodLabel(payment.payment_method) }}
                </div>

                <!-- Data -->
                <div class="text-caption text-grey-6">
                  {{ formatDate(payment.created_at) }}
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions>
                <q-btn
                  label="Ver Detalhes"
                  flat
                  dense
                  color="primary"
                  no-caps
                  @click.stop="selectPayment(payment)"
                />
                
                <q-space />

                <q-btn
                  v-if="payment.invoice_url"
                  icon="open_in_new"
                  flat
                  dense
                  round
                  color="primary"
                  :href="payment.invoice_url"
                  target="_blank"
                  @click.stop
                >
                  <q-tooltip>Ver fatura</q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </template>
    </div>

    <!-- Payment Details Dialog -->
    <q-dialog v-model="showDetailsDialog">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Detalhes do Pagamento</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <PaymentStatus
          :payment="selectedPayment"
          @updated="handlePaymentUpdated"
          @cancelled="handlePaymentCancelled"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePayment } from 'src/composables/usePayment';
import PaymentStatus from 'src/components/payments/PaymentStatus.vue';

const router = useRouter();

const {
  loading,
  error,
  paymentsList,
  list: loadPaymentsList,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
  getPaymentMethodIcon,
} = usePayment();

const filterStatus = ref(null);
const filterMethod = ref(null);
const selectedPayment = ref(null);
const showDetailsDialog = ref(false);

const statusOptions = [
  { label: 'Todos', value: null },
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Recebido', value: 'RECEIVED' },
  { label: 'Confirmado', value: 'CONFIRMED' },
  { label: 'Vencido', value: 'OVERDUE' },
  { label: 'Cancelado', value: 'CANCELLED' },
];

const methodOptions = [
  { label: 'Todos', value: null },
  { label: 'PIX', value: 'PIX' },
  { label: 'Boleto', value: 'BOLETO' },
  { label: 'Cartão de Crédito', value: 'CREDIT_CARD' },
];

const getPaymentMethodLabel = (method) => {
  const labels = {
    PIX: 'PIX',
    BOLETO: 'Boleto Bancário',
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

const loadPayments = async () => {
  const filters = {};
  
  if (filterStatus.value) {
    filters.status = filterStatus.value;
  }
  
  if (filterMethod.value) {
    filters.payment_method = filterMethod.value;
  }

  await loadPaymentsList(filters);
};

const clearFilters = () => {
  filterStatus.value = null;
  filterMethod.value = null;
  loadPayments();
};

const selectPayment = (payment) => {
  selectedPayment.value = payment;
  showDetailsDialog.value = true;
};

const handlePaymentUpdated = async (updatedPayment) => {
  // Atualiza o pagamento na lista
  const index = paymentsList.value.findIndex(p => p.id === updatedPayment.id);
  if (index !== -1) {
    paymentsList.value[index] = updatedPayment;
  }
  selectedPayment.value = updatedPayment;
};

const handlePaymentCancelled = async (paymentId) => {
  showDetailsDialog.value = false;
  await loadPayments();
};

onMounted(() => {
  loadPayments();
});
</script>

<style lang="scss" scoped>
.payments-history-page {
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

.payment-card {
  transition: all 0.2s;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}
</style>
