<!-- ==========================================================================
STATUS BADGE - DESIGN SYSTEM
==========================================================================
Propósito: Badge de status com cores semânticas
Paleta: Sage Accountant
Acessibilidade: WCAG 2.1 AA
========================================================================== -->

<template>
  <span
    class="status-badge"
    :class="[
      `status-badge--${type}`,
      `status-badge--${size}`,
      {
        'status-badge--outlined': outlined,
        'status-badge--rounded': rounded,
        'status-badge--with-icon': icon
      }
    ]"
    :aria-label="`Status: ${label}`"
    role="status"
  >
    <!-- Ícone (opcional) -->
    <q-icon
      v-if="icon"
      :name="icon"
      :size="iconSize"
      class="status-badge__icon"
      aria-hidden="true"
    />
    
    <!-- Label -->
    <span class="status-badge__label">
      {{ label }}
    </span>
    
    <!-- Dot indicator (opcional) -->
    <span
      v-if="dot"
      class="status-badge__dot"
      aria-hidden="true"
    ></span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

// ==========================================================================
// PROPS
// ==========================================================================
const props = defineProps({
  // Texto do badge
  label: {
    type: String,
    required: true
  },
  
  // Tipo semântico
  type: {
    type: String,
    default: 'neutral',
    validator: (value) => [
      'success',
      'error',
      'warning',
      'info',
      'neutral',
      'primary',
      'secondary'
    ].includes(value)
  },
  
  // Tamanho
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  // Ícone (Material Icons)
  icon: {
    type: String,
    default: null
  },
  
  // Variante outlined
  outlined: {
    type: Boolean,
    default: false
  },
  
  // Bordas totalmente arredondadas (pill)
  rounded: {
    type: Boolean,
    default: true
  },
  
  // Mostrar dot indicator
  dot: {
    type: Boolean,
    default: false
  }
})

// ==========================================================================
// COMPUTED
// ==========================================================================
const iconSize = computed(() => {
  const sizes = {
    sm: '14px',
    md: '16px',
    lg: '18px'
  }
  return sizes[props.size] || sizes.md
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// STATUS BADGE - SAGE ACCOUNTANT THEME
// ==========================================================================

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font-weight: var(--font-semibold);
  line-height: 1;
  white-space: nowrap;
  transition: all var(--transition-fast) var(--ease-out);
  border: 1px solid transparent;
  
  // Tamanhos
  &--sm {
    padding: var(--spacing-1) var(--spacing-2);
    font-size: var(--text-xs);
    border-radius: var(--radius-sm);
    
    &.status-badge--rounded {
      border-radius: var(--radius-full);
    }
  }
  
  &--md {
    padding: calc(var(--spacing-1) + 2px) var(--spacing-3);
    font-size: var(--text-sm);
    border-radius: var(--radius-md);
    
    &.status-badge--rounded {
      border-radius: var(--radius-full);
    }
  }
  
  &--lg {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: var(--text-base);
    border-radius: var(--radius-md);
    
    &.status-badge--rounded {
      border-radius: var(--radius-full);
    }
  }
  
  // Tipos - Sólido
  &--success {
    background: var(--color-positive);
    color: white;
    
    &.status-badge--outlined {
      background: rgba(16, 124, 16, 0.1);
      color: var(--color-positive);
      border-color: var(--color-positive);
    }
  }
  
  &--error {
    background: var(--color-negative);
    color: white;
    
    &.status-badge--outlined {
      background: rgba(209, 52, 56, 0.1);
      color: var(--color-negative);
      border-color: var(--color-negative);
    }
  }
  
  &--warning {
    background: var(--color-warning);
    color: var(--color-dark);
    
    &.status-badge--outlined {
      background: rgba(255, 185, 0, 0.1);
      color: #CC9400; // Darker yellow for contrast
      border-color: #CC9400;
    }
  }
  
  &--info {
    background: var(--color-info);
    color: white;
    
    &.status-badge--outlined {
      background: rgba(74, 144, 226, 0.1);
      color: var(--color-info);
      border-color: var(--color-info);
    }
  }
  
  &--neutral {
    background: var(--color-grey-200);
    color: var(--text-primary);
    
    &.status-badge--outlined {
      background: white;
      color: var(--text-primary);
      border-color: var(--color-grey-300);
    }
  }
  
  &--primary {
    background: var(--color-primary);
    color: white;
    
    &.status-badge--outlined {
      background: rgba(44, 95, 45, 0.1);
      color: var(--color-primary);
      border-color: var(--color-primary);
    }
  }
  
  &--secondary {
    background: var(--color-secondary);
    color: white;
    
    &.status-badge--outlined {
      background: rgba(0, 120, 212, 0.1);
      color: var(--color-secondary);
      border-color: var(--color-secondary);
    }
  }
}

// Ícone
.status-badge__icon {
  flex-shrink: 0;
}

// Label
.status-badge__label {
  font-variant-numeric: tabular-nums;
}

// Dot indicator
.status-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse 2s infinite;
  
  .status-badge--success & {
    background: currentColor;
  }
  
  .status-badge--error & {
    background: currentColor;
  }
  
  .status-badge--warning & {
    background: currentColor;
  }
  
  .status-badge--info & {
    background: currentColor;
  }
  
  .status-badge--neutral & {
    background: currentColor;
  }
  
  .status-badge--primary & {
    background: currentColor;
  }
  
  .status-badge--secondary & {
    background: currentColor;
  }
}

// Animação do dot
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
