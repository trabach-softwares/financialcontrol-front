<!--
  ==========================================================================
  COMPONENTE - METRIC CARD (PLANO PRO)
  ==========================================================================
  Propósito: Card de métrica individual com ícone e formatação
-->

<template>
  <q-card flat bordered class="metric-card">
    <q-card-section>
      <div class="row items-center q-gutter-md">
        <div class="col-auto">
          <q-avatar 
            :color="color" 
            text-color="white" 
            size="56px"
          >
            <q-icon :name="icon" size="32px" />
          </q-avatar>
        </div>
        
        <div class="col">
          <div class="text-caption text-grey-7 text-uppercase">
            {{ title }}
          </div>
          <div :class="['text-h5 text-weight-bold', `text-${color}`]">
            {{ displayValue }}
          </div>
          
          <!-- Tendência opcional -->
          <div v-if="trend" class="row items-center q-gutter-xs q-mt-xs">
            <q-icon 
              :name="trend > 0 ? 'trending_up' : 'trending_down'" 
              :color="trend > 0 ? 'positive' : 'negative'"
              size="16px"
            />
            <span 
              :class="['text-caption text-weight-medium', trend > 0 ? 'text-positive' : 'text-negative']"
            >
              {{ Math.abs(trend) }}%
            </span>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrency } from 'src/composables/useCurrency'

// ==========================================================================
// PROPS
// ==========================================================================
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  currency: {
    type: Boolean,
    default: false
  },
  trend: {
    type: Number,
    default: null
  }
})

// ==========================================================================
// COMPOSABLES
// ==========================================================================
const { formatCurrency } = useCurrency()

// ==========================================================================
// COMPUTED
// ==========================================================================
const displayValue = computed(() => {
  if (props.currency) {
    return formatCurrency(props.value)
  }
  return props.value.toLocaleString('pt-BR')
})
</script>

<style scoped lang="scss">
.metric-card {
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
