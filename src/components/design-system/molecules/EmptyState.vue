<!-- ==========================================================================
EMPTY STATE - DESIGN SYSTEM
==========================================================================
Propósito: Estado vazio com ícone, mensagem e ação opcional
Paleta: Sage Accountant
Acessibilidade: WCAG 2.1 AA
========================================================================== -->

<template>
  <div
    class="empty-state"
    :class="[
      `empty-state--${size}`,
      { 'empty-state--centered': centered }
    ]"
    role="region"
    :aria-label="title"
  >
    <!-- Ícone -->
    <div class="empty-state__icon-container">
      <q-icon
        :name="icon"
        :size="iconSize"
        :color="iconColor"
        class="empty-state__icon"
        aria-hidden="true"
      />
    </div>

    <!-- Título -->
    <h3 class="empty-state__title">
      {{ title }}
    </h3>

    <!-- Mensagem -->
    <p
      v-if="message"
      class="empty-state__message"
    >
      {{ message }}
    </p>

    <!-- Slot para conteúdo customizado -->
    <div v-if="$slots.default" class="empty-state__content">
      <slot></slot>
    </div>

    <!-- Ação (botão) -->
    <div
      v-if="actionLabel"
      class="empty-state__action"
    >
      <q-btn
        :label="actionLabel"
        :icon="actionIcon"
        :color="actionColor"
        :size="actionSize"
        unelevated
        no-caps
        @click="handleAction"
        :aria-label="actionAriaLabel || actionLabel"
      />
    </div>

    <!-- Ação secundária (opcional) -->
    <div
      v-if="secondaryActionLabel"
      class="empty-state__secondary-action"
    >
      <q-btn
        :label="secondaryActionLabel"
        :icon="secondaryActionIcon"
        flat
        no-caps
        color="grey-7"
        :size="actionSize"
        @click="handleSecondaryAction"
        :aria-label="secondaryActionAriaLabel || secondaryActionLabel"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// ==========================================================================
// PROPS
// ==========================================================================
const props = defineProps({
  // Ícone (Material Icons)
  icon: {
    type: String,
    default: 'inbox'
  },
  
  // Cor do ícone
  iconColor: {
    type: String,
    default: 'grey-5'
  },
  
  // Título
  title: {
    type: String,
    required: true
  },
  
  // Mensagem descritiva
  message: {
    type: String,
    default: null
  },
  
  // Label do botão de ação
  actionLabel: {
    type: String,
    default: null
  },
  
  // Ícone do botão de ação
  actionIcon: {
    type: String,
    default: null
  },
  
  // Cor do botão de ação
  actionColor: {
    type: String,
    default: 'primary'
  },
  
  // Label da ação secundária
  secondaryActionLabel: {
    type: String,
    default: null
  },
  
  // Ícone da ação secundária
  secondaryActionIcon: {
    type: String,
    default: null
  },
  
  // Tamanho do componente
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  // Centralizar verticalmente
  centered: {
    type: Boolean,
    default: false
  },
  
  // ARIA label customizado para ação
  actionAriaLabel: {
    type: String,
    default: null
  },
  
  // ARIA label customizado para ação secundária
  secondaryActionAriaLabel: {
    type: String,
    default: null
  }
})

// ==========================================================================
// EMITS
// ==========================================================================
const emit = defineEmits(['action', 'secondary-action'])

// ==========================================================================
// COMPUTED
// ==========================================================================
const iconSize = computed(() => {
  const sizes = {
    sm: '48px',
    md: '64px',
    lg: '80px'
  }
  return sizes[props.size] || sizes.md
})

const actionSize = computed(() => {
  const sizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  }
  return sizes[props.size] || sizes.md
})

// ==========================================================================
// METHODS
// ==========================================================================
const handleAction = () => {
  emit('action')
}

const handleSecondaryAction = () => {
  emit('secondary-action')
}
</script>

<style lang="scss" scoped>
// ==========================================================================
// EMPTY STATE - SAGE ACCOUNTANT THEME
// ==========================================================================

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-8) var(--spacing-4);
  
  &--centered {
    min-height: 400px;
    justify-content: center;
  }
  
  // Tamanhos
  &--sm {
    padding: var(--spacing-6) var(--spacing-4);
    
    .empty-state__title {
      font-size: var(--text-lg);
    }
    
    .empty-state__message {
      font-size: var(--text-sm);
    }
  }
  
  &--md {
    padding: var(--spacing-8) var(--spacing-4);
  }
  
  &--lg {
    padding: var(--spacing-12) var(--spacing-4);
    
    .empty-state__title {
      font-size: var(--text-3xl);
    }
    
    .empty-state__message {
      font-size: var(--text-lg);
    }
  }
}

// Ícone Container
.empty-state__icon-container {
  margin-bottom: var(--spacing-4);
  animation: fadeInScale 0.5s ease-out;
}

.empty-state__icon {
  opacity: 0.6;
  transition: all var(--transition-base) var(--ease-out);
  
  .empty-state:hover & {
    opacity: 0.8;
  }
}

// Título
.empty-state__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-2) 0;
  max-width: 500px;
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

// Mensagem
.empty-state__message {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-6) 0;
  max-width: 400px;
  line-height: var(--leading-relaxed);
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

// Conteúdo customizado
.empty-state__content {
  margin-bottom: var(--spacing-6);
  animation: fadeInUp 0.5s ease-out 0.3s both;
}

// Ação
.empty-state__action {
  margin-bottom: var(--spacing-3);
  animation: fadeInUp 0.5s ease-out 0.4s both;
}

// Ação secundária
.empty-state__secondary-action {
  animation: fadeInUp 0.5s ease-out 0.5s both;
}

// Animações
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsividade
@media (max-width: 599px) {
  .empty-state {
    padding: var(--spacing-6) var(--spacing-3);
  }
  
  .empty-state__title {
    font-size: var(--text-xl);
  }
  
  .empty-state__message {
    font-size: var(--text-sm);
  }
}
</style>
