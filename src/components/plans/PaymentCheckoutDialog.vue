<template>
  <q-dialog 
    v-model="show" 
    persistent 
    transition-show="slide-up"
    transition-hide="slide-down"
    :maximized="$q.screen.lt.md"
  >
    <q-card class="payment-dialog-card">
      <!-- Header -->
      <q-card-section class="bg-primary text-white">
        <div class="row items-center">
          <q-icon name="payment" size="32px" class="q-mr-md" />
          <div class="col">
            <div class="text-h6">Finalizar Pagamento</div>
            <div class="text-caption">{{ plan?.name }} - {{ formatPrice(plan?.price) }}/mês</div>
          </div>
          <q-btn 
            flat 
            dense 
            round 
            icon="close" 
            color="white"
            @click="close"
          />
        </div>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="q-pa-lg">
        <!-- Seleção de Método de Pagamento -->
        <div v-if="!paymentCreated" class="payment-methods">
          <div class="text-subtitle1 text-weight-bold q-mb-md">
            Escolha a forma de pagamento:
          </div>

          <div class="payment-methods-grid q-mb-lg">
            <!-- PIX -->
            <q-card 
              flat
              bordered
              :class="selectedMethod === 'PIX' ? 'method-card-selected' : 'method-card'"
              class="cursor-pointer"
              @click="selectMethod('PIX')"
            >
              <q-card-section class="text-center q-pa-md">
                <q-icon name="pix" size="48px" :color="selectedMethod === 'PIX' ? 'primary' : 'grey-7'" />
                <div class="text-h6 q-mt-sm">PIX</div>
                <div class="text-caption text-grey-7">Aprovação instantânea</div>
                <q-chip 
                  color="positive" 
                  text-color="white" 
                  size="sm"
                  class="q-mt-sm"
                >
                  Taxa: 0.99%
                </q-chip>
              </q-card-section>
            </q-card>

            <!-- Boleto -->
            <q-card 
              flat
              bordered
              :class="selectedMethod === 'BOLETO' ? 'method-card-selected' : 'method-card'"
              class="cursor-pointer"
              @click="selectMethod('BOLETO')"
            >
              <q-card-section class="text-center q-pa-md">
                <q-icon name="receipt_long" size="48px" :color="selectedMethod === 'BOLETO' ? 'primary' : 'grey-7'" />
                <div class="text-h6 q-mt-sm">Boleto</div>
                <div class="text-caption text-grey-7">Vence em 3 dias úteis</div>
                <q-chip 
                  color="info" 
                  text-color="white" 
                  size="sm"
                  class="q-mt-sm"
                >
                  Taxa: R$ 3,49
                </q-chip>
              </q-card-section>
            </q-card>

            <!-- Cartão de Crédito -->
            <q-card 
              flat
              bordered
              :class="selectedMethod === 'CREDIT_CARD' ? 'method-card-selected' : 'method-card'"
              class="cursor-pointer"
              @click="selectMethod('CREDIT_CARD')"
            >
              <q-card-section class="text-center q-pa-md">
                <q-icon name="credit_card" size="48px" :color="selectedMethod === 'CREDIT_CARD' ? 'primary' : 'grey-7'" />
                <div class="text-h6 q-mt-sm">Cartão de Crédito</div>
                <div class="text-caption text-grey-7">Aprovação automática</div>
                <q-chip 
                  color="warning" 
                  text-color="white" 
                  size="sm"
                  class="q-mt-sm"
                >
                  Taxa: 3.99%
                </q-chip>
              </q-card-section>
            </q-card>
          </div>

          <!-- Resumo do Pedido -->
          <q-separator class="q-my-lg" />
          
          <div class="order-summary">
            <div class="text-subtitle1 text-weight-bold q-mb-md">
              Resumo do Pedido:
            </div>
            <div class="summary-row">
              <span>Plano {{ plan?.name }}</span>
              <span class="text-weight-bold">{{ formatPrice(plan?.price) }}</span>
            </div>
            <div class="summary-row" v-if="selectedMethod">
              <span class="text-caption text-grey-7">Taxa de processamento</span>
              <span class="text-caption text-grey-7">{{ getFeeText() }}</span>
            </div>
            <q-separator class="q-my-sm" />
            <div class="summary-row text-h6">
              <span class="text-weight-bold">Total</span>
              <span class="text-weight-bold text-primary">{{ formatPrice(plan?.price) }}</span>
            </div>
            <div class="text-caption text-grey-7 q-mt-xs text-right">
              Cobrança mensal recorrente
            </div>
          </div>
        </div>

        <!-- PIX QR Code -->
        <div v-else-if="selectedMethod === 'PIX'" class="pix-payment text-center">
          <q-spinner-dots v-if="loading" color="primary" size="50px" class="q-mb-md" />
          
          <template v-else>
            <div class="text-h6 text-weight-bold q-mb-md">
              <q-icon name="pix" size="32px" color="primary" class="q-mr-sm" />
              Pague com PIX
            </div>

            <!-- QR Code -->
            <div class="qr-code-container q-mb-md">
              <img 
                v-if="pixData?.qrCodeImage" 
                :src="pixData.qrCodeImage" 
                alt="QR Code PIX"
                class="qr-code-image"
              />
              <q-skeleton v-else type="rect" width="250px" height="250px" />
            </div>

            <!-- PIX Copy & Paste -->
            <div v-if="pixData?.payload" class="pix-payload-container q-mb-md">
              <q-input
                :model-value="pixData.payload"
                readonly
                filled
                dense
                class="q-mb-sm"
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    dense
                    icon="content_copy"
                    color="primary"
                    @click="copyPixPayload"
                  >
                    <q-tooltip>Copiar código PIX</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
              <div class="text-caption text-grey-7">
                Abra o app do seu banco e cole o código acima
              </div>
            </div>

            <!-- Instruções -->
            <q-banner class="bg-blue-1 text-left q-mb-md" rounded>
              <template v-slot:avatar>
                <q-icon name="info" color="info" />
              </template>
              <div class="text-body2">
                <strong>Como pagar:</strong>
                <ol class="q-my-sm q-pl-md">
                  <li>Abra o app do seu banco</li>
                  <li>Escolha "Pagar com PIX"</li>
                  <li>Escaneie o QR Code ou cole o código</li>
                  <li>Confirme o pagamento</li>
                </ol>
                <div class="text-caption">
                  Após a confirmação, seu plano será ativado automaticamente.
                </div>
              </div>
            </q-banner>

            <!-- Status Check -->
            <div class="status-check">
              <q-linear-progress 
                v-if="checkingStatus" 
                indeterminate 
                color="primary"
                class="q-mb-sm"
              />
              <div class="text-caption text-grey-7">
                {{ checkingStatus ? 'Aguardando confirmação do pagamento...' : 'Pagamento pendente' }}
              </div>
            </div>
          </template>
        </div>

        <!-- Boleto -->
        <div v-else-if="selectedMethod === 'BOLETO'" class="boleto-payment text-center">
          <q-spinner-dots v-if="loading" color="primary" size="50px" class="q-mb-md" />
          
          <template v-else>
            <div class="text-h6 text-weight-bold q-mb-md">
              <q-icon name="receipt_long" size="32px" color="primary" class="q-mr-sm" />
              Boleto Bancário Gerado
            </div>

            <q-banner class="bg-orange-1 text-left q-mb-md" rounded>
              <template v-slot:avatar>
                <q-icon name="schedule" color="warning" />
              </template>
              <div class="text-body2">
                <strong>Vencimento:</strong> {{ boletoData?.dueDate }}<br>
                O pagamento pode levar até 3 dias úteis para ser confirmado.
              </div>
            </q-banner>

            <q-btn
              unelevated
              color="primary"
              icon="download"
              label="Baixar Boleto PDF"
              size="lg"
              class="full-width q-mb-md"
              :href="boletoData?.pdfUrl"
              target="_blank"
            />

            <q-btn
              outline
              color="primary"
              icon="print"
              label="Imprimir Boleto"
              size="md"
              class="full-width q-mb-md"
              @click="printBoleto"
            />

            <!-- Linha Digitável -->
            <div v-if="boletoData?.barcode" class="barcode-container q-mt-md">
              <div class="text-subtitle2 text-weight-bold q-mb-sm">Linha Digitável:</div>
              <q-input
                :model-value="boletoData.barcode"
                readonly
                filled
                dense
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    dense
                    icon="content_copy"
                    color="primary"
                    @click="copyBarcode"
                  >
                    <q-tooltip>Copiar código de barras</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </div>
          </template>
        </div>

        <!-- Cartão de Crédito -->
        <div v-else-if="selectedMethod === 'CREDIT_CARD'" class="credit-card-payment">
          <div class="text-subtitle1 text-weight-bold q-mb-md">
            Dados do Cartão:
          </div>

          <q-form @submit="processCreditCard">
            <q-input
              v-model="creditCard.number"
              label="Número do Cartão"
              mask="#### #### #### ####"
              filled
              dense
              class="q-mb-md"
              :rules="[val => !!val || 'Campo obrigatório']"
            >
              <template v-slot:prepend>
                <q-icon name="credit_card" />
              </template>
            </q-input>

            <q-input
              v-model="creditCard.holderName"
              label="Nome no Cartão"
              filled
              dense
              class="q-mb-md"
              :rules="[val => !!val || 'Campo obrigatório']"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-6">
                <q-input
                  v-model="creditCard.expiryDate"
                  label="Validade"
                  mask="##/####"
                  placeholder="MM/AAAA"
                  filled
                  dense
                  :rules="[val => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="creditCard.cvv"
                  label="CVV"
                  mask="###"
                  filled
                  dense
                  :rules="[val => !!val || 'Campo obrigatório']"
                >
                  <template v-slot:append>
                    <q-icon name="help_outline" color="grey-7">
                      <q-tooltip>
                        Código de 3 dígitos no verso do cartão
                      </q-tooltip>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <q-banner class="bg-blue-1 q-mb-md" rounded>
              <template v-slot:avatar>
                <q-icon name="security" color="info" />
              </template>
              <div class="text-caption">
                Seus dados estão seguros. Utilizamos criptografia SSL.
              </div>
            </q-banner>
          </q-form>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="q-pa-lg bg-grey-1">
        <q-btn 
          v-if="!paymentCreated"
          label="Cancelar" 
          color="grey-7" 
          flat 
          @click="close"
        />
        <q-btn
          v-if="!paymentCreated"
          :label="getActionLabel()"
          color="primary"
          unelevated
          :loading="loading"
          :disable="!selectedMethod"
          @click="processPayment"
        />
        <q-btn
          v-else-if="selectedMethod !== 'CREDIT_CARD'"
          label="Fechar"
          color="grey-7"
          flat
          @click="close"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { createPayment, getPixQrCode } from 'src/apis/payments'
import { useNotifications } from 'src/composables/useNotifications'
import { useAuthStore } from 'src/stores/auth'
import { copyToClipboard } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  plan: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const { notifySuccess, notifyError, notifyWarning } = useNotifications()
const authStore = useAuthStore()

// State
const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const selectedMethod = ref(null)
const paymentCreated = ref(false)
const loading = ref(false)
const checkingStatus = ref(false)

const pixData = ref(null)
const boletoData = ref(null)
const creditCard = ref({
  number: '',
  holderName: '',
  expiryDate: '',
  cvv: ''
})

const paymentId = ref(null)
let statusCheckInterval = null

// Methods
function selectMethod(method) {
  selectedMethod.value = method
}

function formatPrice(price) {
  if (!price && price !== 0) return 'R$ 0,00'
  if (price === 0) return 'Gratuito'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

function getFeeText() {
  if (!selectedMethod.value) return '-'
  
  const fees = {
    'PIX': '0.99% (já incluída)',
    'BOLETO': 'R$ 3,49 (já incluída)',
    'CREDIT_CARD': '3.99% (já incluída)'
  }
  
  return fees[selectedMethod.value]
}

function getActionLabel() {
  const labels = {
    'PIX': 'Gerar QR Code PIX',
    'BOLETO': 'Gerar Boleto',
    'CREDIT_CARD': 'Pagar com Cartão'
  }
  
  return labels[selectedMethod.value] || 'Selecione o método'
}

async function processPayment() {
  if (!selectedMethod.value) {
    notifyWarning('Selecione um método de pagamento')
    return
  }

  loading.value = true

  try {
    console.log('🔄 Criando pagamento...')
    console.log('💳 Método:', selectedMethod.value)
    console.log('📦 Plano:', props.plan.name, '| Valor:', props.plan.price)

    // Cria pagamento na API
    const response = await createPayment({
      planId: props.plan.id,
      paymentMethod: selectedMethod.value,
      ...(selectedMethod.value === 'CREDIT_CARD' && { creditCard: creditCard.value })
    })

    console.log('✅ Pagamento criado:', response)

    paymentId.value = response.data?.payment?.id || response.payment?.id
    paymentCreated.value = true

    // Processar baseado no método
    if (selectedMethod.value === 'PIX') {
      await loadPixData()
      startStatusCheck()
    } else if (selectedMethod.value === 'BOLETO') {
      boletoData.value = response.data?.payment || response.payment
      notifySuccess('Boleto gerado com sucesso!')
    } else if (selectedMethod.value === 'CREDIT_CARD') {
      // Cartão já foi processado
      notifySuccess('Pagamento aprovado!')
      emit('success')
      close()
    }

  } catch (error) {
    console.error('❌ Erro ao criar pagamento:', error)
    notifyError(error?.message || 'Erro ao processar pagamento')
  } finally {
    loading.value = false
  }
}

async function loadPixData() {
  try {
    const response = await getPixQrCode(paymentId.value)
    pixData.value = response.data || response
    console.log('✅ QR Code PIX carregado:', pixData.value)
  } catch (error) {
    console.error('❌ Erro ao carregar QR Code PIX:', error)
    notifyError('Erro ao gerar QR Code PIX')
  }
}

function startStatusCheck() {
  checkingStatus.value = true
  
  // Simula checagem de status a cada 5 segundos
  statusCheckInterval = setInterval(async () => {
    try {
      // TODO: Implementar checagem real de status
      // const status = await getPaymentStatus(paymentId.value)
      // if (status.paid) {
      //   notifySuccess('Pagamento confirmado!')
      //   emit('success')
      //   close()
      // }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
    }
  }, 5000)
}

function copyPixPayload() {
  if (pixData.value?.payload) {
    copyToClipboard(pixData.value.payload)
      .then(() => {
        notifySuccess('Código PIX copiado!')
      })
      .catch(() => {
        notifyError('Erro ao copiar código')
      })
  }
}

function copyBarcode() {
  if (boletoData.value?.barcode) {
    copyToClipboard(boletoData.value.barcode)
      .then(() => {
        notifySuccess('Código de barras copiado!')
      })
      .catch(() => {
        notifyError('Erro ao copiar código')
      })
  }
}

function printBoleto() {
  if (boletoData.value?.pdfUrl) {
    window.open(boletoData.value.pdfUrl, '_blank')
  }
}

function processCreditCard() {
  processPayment()
}

function close() {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval)
    statusCheckInterval = null
  }
  
  selectedMethod.value = null
  paymentCreated.value = false
  pixData.value = null
  boletoData.value = null
  paymentId.value = null
  checkingStatus.value = false
  
  show.value = false
}

// Cleanup on unmount
watch(() => show.value, (newVal) => {
  if (!newVal) {
    close()
  }
})
</script>

<style lang="scss" scoped>
.payment-dialog-card {
  min-width: 500px;
  max-width: 1000px;
  width: 100%;
  
  @media (min-width: 600px) {
    min-width: 920px;
  }
  
  @media (max-width: 599px) {
    min-width: 100%;
  }
}

// CSS GRID para 3 colunas fixas
.payment-methods-grid {
  display: grid;
  gap: 1rem;
  
  // Mobile: 1 coluna
  grid-template-columns: 1fr;
  
  // Desktop/Tablet: 3 colunas SEMPRE
  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.method-card {
  transition: all 0.3s ease;
  border: 2px solid var(--color-border, #e0e0e0);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .q-card-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 200px;
  }
  
  &:hover {
    border-color: var(--q-primary);
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(var(--q-primary-rgb), 0.2);
  }
}

.method-card-selected {
  border: 2px solid var(--q-primary);
  background: rgba(var(--q-primary-rgb), 0.05);
  box-shadow: 0 4px 12px rgba(var(--q-primary-rgb), 0.2);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .q-card-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 200px;
  }
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.qr-code-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 2px dashed var(--q-primary);
}

.qr-code-image {
  max-width: 250px;
  height: auto;
}

.pix-payload-container {
  max-width: 100%;
}

.status-check {
  margin-top: 20px;
  padding: 16px;
  background: var(--color-grey-50);
  border-radius: 8px;
}
</style>
