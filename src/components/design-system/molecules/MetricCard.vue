<!-- ==========================================================================
METRIC CARD - DESIGN SYSTEM
==========================================================================
Propósito: Exibir métricas financeiras com ícone, valor e variação
Paleta: Sage Accountant
Acessibilidade: WCAG 2.1 AA
========================================================================== -->

<template>
  <q-card
    class="metric-card"
    :class="[
      `metric-card--${type}`,
      { 'metric-card--loading': loading }
    ]"
    flat
    bordered
  >
    <q-card-section class="metric-card__content">
      
      <!-- Ícone -->
      <div class="metric-card__icon-container" :class="`bg-${type}`">
        <q-icon
          :name="icon"
          size="32px"
          color="white"
          :aria-hidden="true"
        />
      </div>

      <!-- Informações -->
      <div class="metric-card__info">
        <!-- Label -->
        <div class="metric-card__label">
          {{ label }}
        </div>

        <!-- Valor -->
        <div 
          class="metric-card__value"
          :aria-label="`${label}: ${formattedValue}`"
        >
          <template v-if="!loading">
            {{ formattedValue }}
          </template>
          <q-skeleton v-else type="text" width="120px" height="32px" />
        </div>

        <!-- Variação (opcional) -->
        <div 
          v-if="change !== null && !loading"
          class="metric-card__change"
          :class="changeClass"
          :aria-label="`Variação: ${change > 0 ? 'aumento' : 'diminuição'} de ${Math.abs(change)}%`"
        >
          <q-icon
            :name="change >= 0 ? 'trending_up' : 'trending_down'"
            size="16px"
            class="q-mr-xs"
          />
          <span>{{ Math.abs(change) }}%</span>
        </div>
      </div>
    </q-card-section>

    <!-- Loading Overlay -->
    <q-inner-loading :showing="loading" color="primary">
      <q-spinner-dots size="40px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

// ==========================================================================
// PROPS
// ==========================================================================
const props = defineProps({
  // Label do card (ex: "Receitas Totais")
  label: {
    type: String,
    required: true
  },
  
  // Valor numérico
  value: {
    type: [Number, String],
    default: 0
  },
  
  // Ícone (Material Icons)
  icon: {
    type: String,
    default: 'payments'
  },
  
  // Tipo semântico (define cor)
  type: {
    type: String,
    default: 'neutral',
    validator: (value) => ['positive', 'negative', 'neutral', 'info', 'warning'].includes(value)
  },
  
  // Formatar como moeda
  currency: {
    type: Boolean,
    default: false
  },
  
  // Variação percentual (ex: 12.5 para +12.5%)
  change: {
    type: Number,
    default: null
  },
  
  // Estado de loading
  loading: {
    type: Boolean,
    default: false
  },
  
  // Locale para formatação (pt-BR, en-US)
  locale: {
    type: String,
    default: 'pt-BR'
  },
  
  // Código da moeda (BRL, USD, EUR)
  currencyCode: {
    type: String,
    default: 'BRL'
  }
})

// ==========================================================================
// COMPUTED
// ==========================================================================

/**
 * Formata o valor conforme configurações
 */
const formattedValue = computed(() => {
  const numValue = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  
  if (isNaN(numValue)) return '—'
  
  if (props.currency) {
    return new Intl.NumberFormat(props.locale, {
      style: 'currency',
      currency: props.currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue)
  }
  
  return new Intl.NumberFormat(props.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numValue)
})

/**
 * Classe CSS para variação (positivo/negativo)
 */
const changeClass = computed(() => {
  if (props.change === null || props.change === 0) return 'metric-card__change--neutral'
  return props.change > 0 ? 'metric-card__change--positive' : 'metric-card__change--negative'
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// METRIC CARD - SAGE ACCOUNTANT THEME
// ==========================================================================

.metric-card {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-grey-300);
  transition: all var(--transition-base) var(--ease-out);
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  
  &--loading {
    opacity: 0.7;
  }
}

.metric-card__content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
  padding: var(--spacing-5);
  
  @media (max-width: 599px) {
    padding: var(--spacing-4);
    gap: var(--spacing-3);
  }
}

// Ícone Container
.metric-card__icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
  transition: all var(--transition-base) var(--ease-out);
  
  @media (max-width: 599px) {
    width: 48px;
    height: 48px;
    
    .q-icon {
      font-size: 24px !important;
    }
  }
  
  // Cores por tipo
  &.bg-positive {
    background: var(--color-positive);
  }
  
  &.bg-negative {
    background: var(--color-negative);
  }
  
  &.bg-neutral {
    background: var(--color-primary);
  }
  
  &.bg-info {
    background: var(--color-info);
  }
  
  &.bg-warning {
    background: var(--color-warning);
  }
}

// Informações
.metric-card__info {
  flex: 1;
  min-width: 0; // Para truncate funcionar
}

.metric-card__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-card__value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  line-height: var(--leading-tight);
  margin-bottom: var(--spacing-2);
  font-variant-numeric: tabular-nums;
  
  @media (max-width: 599px) {
    font-size: var(--text-2xl);
  }
}

// Variação
.metric-card__change {
  display: inline-flex;
  align-items: center;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  font-variant-numeric: tabular-nums;
  
  &--positive {
    color: var(--color-positive);
    background: rgba(16, 124, 16, 0.1);
  }
  
  &--negative {
    color: var(--color-negative);
    background: rgba(209, 52, 56, 0.1);
  }
  
  &--neutral {
    color: var(--text-secondary);
    background: var(--color-grey-100);
  }
}

// Variantes de card por tipo
.metric-card--positive {
  &:hover {
    border-color: var(--color-positive);
  }
}

.metric-card--negative {
  &:hover {
    border-color: var(--color-negative);
  }
}

.metric-card--neutral {
  &:hover {
    border-color: var(--color-primary);
  }
}

.metric-card--info {
  &:hover {
    border-color: var(--color-info);
  }
}

.metric-card--warning {
  &:hover {
    border-color: var(--color-warning);
  }
}
</style>
