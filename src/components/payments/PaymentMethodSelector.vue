<template>
  <div class="payment-method-selector">
    <div class="text-h6 text-center q-mb-lg">
      Escolha a forma de pagamento
    </div>

    <div class="payment-methods-grid">
      <!-- PIX - DESTAQUE -->
      <q-card 
        class="payment-method-card payment-method-card--highlight cursor-pointer"
        :class="{ 'payment-method-card--selected': modelValue === 'PIX' }"
        @click="selectMethod('PIX')"
        flat
        bordered
      >
        <q-card-section class="text-center q-pa-lg">
          <div class="pix-icon-wrapper">
            <q-icon name="pix" size="80px" :color="modelValue === 'PIX' ? 'positive' : 'primary'" />
          </div>
          
          <div class="text-h5 text-bold q-mt-md">PIX</div>
          
          <q-chip color="positive" text-color="white" size="md" class="q-mt-sm">
            ⚡ Instantâneo e Seguro
          </q-chip>
          
          <div class="text-body1 text-grey-8 q-mt-lg">
            Pagamento aprovado em segundos
          </div>
          
          <div class="text-body2 text-grey-7 q-mt-sm">
            📱 Escaneie o QR Code ou use Copia e Cola
          </div>

          <q-separator class="q-my-md" />

          <div class="text-caption text-grey-6">
            ✓ Disponível 24/7<br>
            ✓ Confirmação instantânea<br>
            ✓ Sem taxas adicionais
          </div>
        </q-card-section>

        <q-card-section v-if="modelValue === 'PIX'" class="bg-positive text-white text-center">
          <q-icon name="check_circle" size="28px" />
          <span class="q-ml-sm text-h6">Selecionado</span>
        </q-card-section>
      </q-card>

      <!-- Boleto - DESABILITADO TEMPORARIAMENTE -->
      <q-card 
        class="payment-method-card payment-method-card--disabled"
        flat
        bordered
      >
        <q-card-section class="text-center">
          <q-icon name="receipt" size="64px" color="grey-4" />
          
          <div class="text-h6 q-mt-md text-grey-5">Boleto</div>
          
          <q-chip color="grey-4" text-color="grey-7" size="sm" class="q-mt-sm">
            � Em breve
          </q-chip>
          
          <div class="text-body2 text-grey-5 q-mt-md">
            Pague em qualquer banco ou lotérica
          </div>
          
          <div class="text-caption text-grey-5 q-mt-sm">
            Código de barras ou PDF
          </div>
        </q-card-section>
      </q-card>

      <!-- Cartão de Crédito - DESABILITADO TEMPORARIAMENTE -->
      <q-card 
        class="payment-method-card payment-method-card--disabled"
        flat
        bordered
      >
        <q-card-section class="text-center">
          <q-icon name="credit_card" size="64px" color="grey-4" />
          
          <div class="text-h6 q-mt-md text-grey-5">Cartão de Crédito</div>
          
          <q-chip color="grey-4" text-color="grey-7" size="sm" class="q-mt-sm">
            🚧 Em breve
          </q-chip>
          
          <div class="text-body2 text-grey-5 q-mt-md">
            Liberação imediata após aprovação
          </div>
          
          <div class="text-caption text-grey-5 q-mt-sm">
            Visa, Mastercard, Elo
          </div>
        </q-card-section>
      </q-card>
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
import { onMounted } from 'vue';

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

// Seleciona PIX automaticamente por ser a única opção ativa
onMounted(() => {
  if (!props.modelValue) {
    selectMethod('PIX');
  }
});
</script>

<style lang="scss" scoped>
.payment-method-selector {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

// CSS GRID para garantir 3 colunas em linha
.payment-methods-grid {
  display: grid;
  gap: 1rem;
  
  // Mobile: 1 coluna
  grid-template-columns: 1fr;
  
  // Desktop: 3 colunas SEMPRE
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.payment-method-card {
  transition: all 0.3s;
  height: 100%;

  &:hover:not(&--disabled) {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &--selected {
    border: 2px solid var(--q-primary);
    box-shadow: 0 8px 24px rgba(var(--q-primary-rgb), 0.3);
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
    background: #fafafa;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  &--highlight {
    border: 3px solid #e0e0e0;
    
    &:hover {
      border-color: var(--q-positive);
    }
    
    &.payment-method-card--selected {
      border-color: var(--q-positive);
      background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
    }
  }
}

.pix-icon-wrapper {
  display: inline-block;
  animation: pulse-pix 2s ease-in-out infinite;
}

@keyframes pulse-pix {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}
</style>
