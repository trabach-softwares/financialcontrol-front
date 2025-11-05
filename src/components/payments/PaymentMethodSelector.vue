<template>
  <div class="payment-method-selector">
    <div class="text-h6 text-center q-mb-lg">
      Escolha a forma de pagamento
    </div>

    <div class="row q-col-gutter-md">
      <!-- PIX -->
      <div class="col-12 col-md-4">
        <q-card 
          class="payment-method-card cursor-pointer"
          :class="{ 'payment-method-card--selected': modelValue === 'PIX' }"
          @click="selectMethod('PIX')"
        >
          <q-card-section class="text-center">
            <q-icon name="pix" size="64px" :color="modelValue === 'PIX' ? 'primary' : 'grey-6'" />
            
            <div class="text-h6 q-mt-md">PIX</div>
            
            <q-chip color="positive" text-color="white" size="sm" class="q-mt-sm">
              ⚡ Instantâneo
            </q-chip>
            
            <div class="text-body2 text-grey-7 q-mt-md">
              Pagamento aprovado em segundos
            </div>
            
            <div class="text-caption text-grey-6 q-mt-sm">
              Escaneie o QR Code ou use Copia e Cola
            </div>
          </q-card-section>

          <q-card-section v-if="modelValue === 'PIX'" class="bg-primary text-white text-center">
            <q-icon name="check_circle" size="24px" />
            <span class="q-ml-sm">Selecionado</span>
          </q-card-section>
        </q-card>
      </div>

      <!-- Boleto -->
      <div class="col-12 col-md-4">
        <q-card 
          class="payment-method-card cursor-pointer"
          :class="{ 'payment-method-card--selected': modelValue === 'BOLETO' }"
          @click="selectMethod('BOLETO')"
        >
          <q-card-section class="text-center">
            <q-icon name="receipt" size="64px" :color="modelValue === 'BOLETO' ? 'primary' : 'grey-6'" />
            
            <div class="text-h6 q-mt-md">Boleto</div>
            
            <q-chip color="info" text-color="white" size="sm" class="q-mt-sm">
              📅 Até 3 dias úteis
            </q-chip>
            
            <div class="text-body2 text-grey-7 q-mt-md">
              Pague em qualquer banco ou lotérica
            </div>
            
            <div class="text-caption text-grey-6 q-mt-sm">
              Código de barras ou PDF
            </div>
          </q-card-section>

          <q-card-section v-if="modelValue === 'BOLETO'" class="bg-primary text-white text-center">
            <q-icon name="check_circle" size="24px" />
            <span class="q-ml-sm">Selecionado</span>
          </q-card-section>
        </q-card>
      </div>

      <!-- Cartão de Crédito -->
      <div class="col-12 col-md-4">
        <q-card 
          class="payment-method-card cursor-pointer"
          :class="{ 'payment-method-card--selected': modelValue === 'CREDIT_CARD' }"
          @click="selectMethod('CREDIT_CARD')"
        >
          <q-card-section class="text-center">
            <q-icon name="credit_card" size="64px" :color="modelValue === 'CREDIT_CARD' ? 'primary' : 'grey-6'" />
            
            <div class="text-h6 q-mt-md">Cartão de Crédito</div>
            
            <q-chip color="positive" text-color="white" size="sm" class="q-mt-sm">
              ✅ Aprovação instantânea
            </q-chip>
            
            <div class="text-body2 text-grey-7 q-mt-md">
              Liberação imediata após aprovação
            </div>
            
            <div class="text-caption text-grey-6 q-mt-sm">
              Visa, Mastercard, Elo
            </div>
          </q-card-section>

          <q-card-section v-if="modelValue === 'CREDIT_CARD'" class="bg-primary text-white text-center">
            <q-icon name="check_circle" size="24px" />
            <span class="q-ml-sm">Selecionado</span>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Botão de continuar -->
    <div class="text-center q-mt-xl">
      <q-btn
        label="Continuar"
        color="primary"
        unelevated
        rounded
        no-caps
        size="lg"
        padding="12px 48px"
        :disable="!modelValue"
        @click="$emit('continue')"
      />
    </div>

    <!-- Informação de segurança -->
    <div class="text-center q-mt-md">
      <div class="text-caption text-grey-6">
        <q-icon name="lock" size="16px" />
        Pagamento 100% seguro e criptografado
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'continue']);

const selectMethod = (method) => {
  emit('update:modelValue', method);
};
</script>

<style lang="scss" scoped>
.payment-method-selector {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.payment-method-card {
  transition: all 0.3s;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &--selected {
    border: 2px solid var(--q-primary);
    box-shadow: 0 8px 24px rgba(var(--q-primary-rgb), 0.3);
  }
}
</style>
