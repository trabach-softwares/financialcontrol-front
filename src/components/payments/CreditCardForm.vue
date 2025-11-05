<template>
  <div class="credit-card-form">
    <div class="text-center q-mb-lg">
      <q-icon name="credit_card" size="48px" color="primary" />
      <div class="text-h5 q-mt-md">Cartão de Crédito</div>
      <div class="text-body2 text-grey-7 q-mt-sm">
        Aprovação instantânea
      </div>
    </div>

    <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
      <!-- Número do Cartão -->
      <q-input
        v-model="cardData.number"
        label="Número do Cartão *"
        outlined
        mask="#### #### #### ####"
        placeholder="0000 0000 0000 0000"
        :rules="[val => !!val || 'Campo obrigatório', validateCardNumber]"
        lazy-rules
        @update:model-value="detectCardBrand"
      >
        <template v-slot:prepend>
          <q-icon name="credit_card" />
        </template>
        <template v-slot:append v-if="cardBrand">
          <q-avatar size="24px">
            <img :src="getCardBrandIcon(cardBrand)" :alt="cardBrand" />
          </q-avatar>
        </template>
      </q-input>

      <!-- Nome no Cartão -->
      <q-input
        v-model="cardData.holderName"
        label="Nome no Cartão *"
        outlined
        placeholder="JOÃO DA SILVA"
        :rules="[
          val => !!val || 'Campo obrigatório',
          val => val.length >= 3 || 'Nome muito curto'
        ]"
        lazy-rules
        @update:model-value="val => cardData.holderName = val.toUpperCase()"
      >
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
      </q-input>

      <!-- Validade e CVV -->
      <div class="row q-col-gutter-md">
        <!-- Mês -->
        <div class="col-4">
          <q-input
            v-model="cardData.expiryMonth"
            label="Mês *"
            outlined
            mask="##"
            placeholder="MM"
            :rules="[
              val => !!val || 'Obrigatório',
              val => val >= 1 && val <= 12 || 'Mês inválido'
            ]"
            lazy-rules
          />
        </div>

        <!-- Ano -->
        <div class="col-4">
          <q-input
            v-model="cardData.expiryYear"
            label="Ano *"
            outlined
            mask="####"
            placeholder="AAAA"
            :rules="[
              val => !!val || 'Obrigatório',
              validateExpiry
            ]"
            lazy-rules
          />
        </div>

        <!-- CVV -->
        <div class="col-4">
          <q-input
            v-model="cardData.ccv"
            label="CVV *"
            outlined
            mask="###"
            placeholder="123"
            type="password"
            :rules="[
              val => !!val || 'Obrigatório',
              val => val.length >= 3 || 'CVV inválido'
            ]"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon name="help_outline">
                <q-tooltip>
                  Código de segurança de 3 dígitos no verso do cartão
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <!-- Informação de Segurança -->
      <q-card flat bordered class="bg-blue-1 q-pa-md">
        <div class="row items-center">
          <q-icon name="lock" size="24px" color="primary" class="q-mr-sm" />
          <div class="text-body2">
            <strong>Seus dados são seguros.</strong> Utilizamos criptografia SSL e não armazenamos dados do cartão.
          </div>
        </div>
      </q-card>

      <!-- Resumo do Pagamento -->
      <q-card flat bordered class="q-pa-md">
        <div class="text-subtitle2 text-bold q-mb-sm">Resumo do Pagamento</div>
        <div class="row justify-between items-center">
          <div class="text-body2 text-grey-7">Total a pagar:</div>
          <div class="text-h6 text-primary text-bold">{{ formatPrice(amount) }}</div>
        </div>
      </q-card>

      <!-- Botão Submit -->
      <q-btn
        type="submit"
        :label="`Pagar ${formatPrice(amount)}`"
        color="positive"
        unelevated
        no-caps
        size="lg"
        class="full-width"
        :loading="loading"
        :disable="loading"
      >
        <template v-slot:loading>
          <q-spinner-dots />
        </template>
      </q-btn>

      <!-- Link de Termos -->
      <div class="text-center text-caption text-grey-6">
        Ao pagar, você concorda com nossos
        <a href="#" class="text-primary">Termos de Serviço</a>
      </div>
    </q-form>

    <!-- Cartões de Teste (apenas em desenvolvimento) -->
    <q-card v-if="isDevelopment" flat bordered class="q-mt-lg q-pa-md bg-orange-1">
      <div class="text-subtitle2 text-bold q-mb-sm">
        🧪 Cartões de Teste (Sandbox)
      </div>
      <div class="text-caption q-mb-sm">
        <strong>Aprovado:</strong> 5162306219378829 | CVV: 318
      </div>
      <div class="text-caption">
        <strong>Recusado:</strong> 5600510960358877 | CVV: 438
      </div>
      <q-btn
        label="Preencher Cartão Teste"
        size="sm"
        color="orange"
        flat
        dense
        class="q-mt-sm"
        @click="fillTestCard"
      />
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  amount: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit']);

const cardData = ref({
  holderName: '',
  number: '',
  expiryMonth: '',
  expiryYear: '',
  ccv: '',
});

const cardBrand = ref(null);

const isDevelopment = computed(() => {
  return process.env.NODE_ENV === 'development';
});

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const validateCardNumber = (val) => {
  const cleanNumber = val.replace(/\s/g, '');
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return 'Número de cartão inválido';
  }
  return true;
};

const validateExpiry = (year) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const expiryYear = parseInt(year);
  const expiryMonth = parseInt(cardData.value.expiryMonth);

  if (expiryYear < currentYear) {
    return 'Cartão expirado';
  }

  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return 'Cartão expirado';
  }

  return true;
};

const detectCardBrand = (number) => {
  const cleanNumber = number.replace(/\s/g, '');
  
  // Visa
  if (/^4/.test(cleanNumber)) {
    cardBrand.value = 'visa';
  }
  // Mastercard
  else if (/^5[1-5]/.test(cleanNumber)) {
    cardBrand.value = 'mastercard';
  }
  // Elo
  else if (/^(4011|4312|4389|4514|4576|5041|5066|5067|6277|6362|6363|6504|6505|6516)/.test(cleanNumber)) {
    cardBrand.value = 'elo';
  }
  else {
    cardBrand.value = null;
  }
};

const getCardBrandIcon = (brand) => {
  const icons = {
    visa: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg',
    mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    elo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Elo_card_association_logo.svg',
  };
  return icons[brand] || '';
};

const fillTestCard = () => {
  cardData.value = {
    holderName: 'JOAO DA SILVA',
    number: '5162 3062 1937 8829',
    expiryMonth: '12',
    expiryYear: '2028',
    ccv: '318',
  };
  detectCardBrand(cardData.value.number);
};

const handleSubmit = () => {
  // Remove espaços do número do cartão
  const cleanCardData = {
    ...cardData.value,
    number: cardData.value.number.replace(/\s/g, ''),
  };

  emit('submit', cleanCardData);
};
</script>

<style lang="scss" scoped>
.credit-card-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}
</style>
