<template>
  <q-card 
    class="plan-card" 
    :class="{ 
      'plan-card--popular': plan.is_popular,
      'plan-card--current': isCurrentPlan,
      'plan-card--coming-soon': comingSoon
    }"
  >
    <!-- Badge de em breve -->
    <div v-if="comingSoon" class="plan-card__badge">
      <q-badge color="orange" class="text-bold">
        🚀 Em Breve
      </q-badge>
    </div>

    <!-- Badge de plano popular -->
    <div v-else-if="plan.is_popular" class="plan-card__badge">
      <q-badge color="primary" class="text-bold">
        ⭐ Mais Popular
      </q-badge>
    </div>

    <!-- Badge de plano atual -->
    <div v-else-if="isCurrentPlan" class="plan-card__badge">
      <q-badge color="positive" class="text-bold">
        ✓ Plano Atual
      </q-badge>
    </div>

    <q-card-section class="text-center">
      <!-- Nome do plano -->
      <div class="text-h5 text-bold q-mb-sm">
        {{ plan.name }}
      </div>

      <!-- Descrição -->
      <div class="text-body2 text-grey-7 q-mb-md">
        {{ plan.description }}
      </div>

      <!-- Preço -->
      <div class="plan-card__price">
        <span class="text-h3 text-bold text-primary">
          {{ formatPrice(plan.price) }}
        </span>
        <span class="text-body2 text-grey-6">
          /{{ getBillingCycleLabel(plan.billing_cycle) }}
        </span>
      </div>

      <!-- Desconto anual -->
      <div v-if="plan.billing_cycle === 'yearly' && plan.monthly_price" class="q-mt-sm">
        <q-chip color="positive" text-color="white" size="sm">
          Economize {{ calculateDiscount(plan.price, plan.monthly_price) }}%
        </q-chip>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Features -->
    <q-card-section>
      <div class="text-body2 text-bold q-mb-md">
        O que está incluído:
      </div>
      <q-list dense>
        <q-item 
          v-for="(feature, index) in plan.features" 
          :key="index"
          class="q-px-none"
        >
          <q-item-section avatar class="min-width-auto">
            <q-icon name="check_circle" color="positive" size="20px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body2">
              {{ feature }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator />

    <!-- Botão de ação -->
    <q-card-section>
      <q-btn
        v-if="comingSoon"
        label="Em Breve"
        color="orange"
        outline
        rounded
        no-caps
        class="full-width"
        size="md"
        disable
      />
      <q-btn
        v-else-if="!isCurrentPlan"
        :label="buttonLabel"
        color="primary"
        unelevated
        rounded
        no-caps
        class="full-width"
        size="md"
        :loading="loading"
        @click="$emit('select', plan)"
      />
      <q-btn
        v-else
        label="Plano Ativo"
        color="positive"
        outline
        rounded
        no-caps
        class="full-width"
        size="md"
        disable
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';
import { usePlans } from 'src/composables/usePlans';

const props = defineProps({
  plan: {
    type: Object,
    required: true,
  },
  isCurrentPlan: {
    type: Boolean,
    default: false,
  },
  buttonLabel: {
    type: String,
    default: 'Assinar Plano',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  comingSoon: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['select']);

const { formatPrice, getBillingCycleLabel, calculateDiscount } = usePlans();
</script>

<style lang="scss" scoped>
.plan-card {
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &--popular {
    border: 2px solid var(--q-primary);
  }

  &--current {
    border: 2px solid var(--q-positive);
  }

  &--coming-soon {
    opacity: 0.85;
    border: 2px solid var(--q-orange);
  }

  &__badge {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1;
  }

  &__price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    margin-top: 16px;
  }
}

.min-width-auto {
  min-width: auto !important;
}
</style>
