<!-- ==========================================================================
CONFIRM DIALOG - DESIGN SYSTEM
==========================================================================
Propósito: Dialog de confirmação para ações destrutivas
Paleta: Sage Accountant
Acessibilidade: WCAG 2.1 AA, ARIA roles, focus trap
========================================================================== -->

<template>
  <q-dialog
    v-model="isOpen"
    persistent
    :maximized="maximized"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="confirm-dialog"
      :class="`confirm-dialog--${type}`"
      role="alertdialog"
      :aria-labelledby="dialogTitleId"
      :aria-describedby="dialogMessageId"
    >
      <!-- Header -->
      <q-card-section class="confirm-dialog__header">
        <div class="confirm-dialog__icon-container" :class="`bg-${type}`">
          <q-icon
            :name="iconName"
            size="32px"
            color="white"
            aria-hidden="true"
          />
        </div>
        
        <h2
          :id="dialogTitleId"
          class="confirm-dialog__title"
        >
          {{ title }}
        </h2>
      </q-card-section>

      <!-- Message -->
      <q-card-section class="confirm-dialog__content">
        <p
          :id="dialogMessageId"
          class="confirm-dialog__message"
        >
          {{ message }}
        </p>

        <!-- Slot para conteúdo adicional -->
        <div v-if="$slots.default" class="confirm-dialog__extra">
          <slot></slot>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions
        class="confirm-dialog__actions"
        :align="actionsAlign"
      >
        <!-- Botão Cancelar -->
        <q-btn
          flat
          :label="cancelLabel"
          :color="cancelColor"
          @click="handleCancel"
          :disabled="loading"
          no-caps
          :aria-label="cancelAriaLabel || cancelLabel"
          ref="cancelButton"
        />

        <!-- Botão Confirmar -->
        <q-btn
          unelevated
          :label="confirmLabel"
          :color="confirmColor"
          @click="handleConfirm"
          :loading="loading"
          :disabled="loading"
          no-caps
          :aria-label="confirmAriaLabel || confirmLabel"
          class="confirm-dialog__confirm-btn"
        >
          <template v-slot:loading>
            <q-spinner-dots color="white" />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

// ==========================================================================
// PROPS
// ==========================================================================
const props = defineProps({
  // Controle de visibilidade
  modelValue: {
    type: Boolean,
    default: false
  },
  
  // Título do dialog
  title: {
    type: String,
    required: true
  },
  
  // Mensagem descritiva
  message: {
    type: String,
    required: true
  },
  
  // Tipo semântico (define ícone e cor)
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['danger', 'warning', 'info', 'success'].includes(value)
  },
  
  // Label do botão de confirmação
  confirmLabel: {
    type: String,
    default: 'Confirmar'
  },
  
  // Label do botão de cancelamento
  cancelLabel: {
    type: String,
    default: 'Cancelar'
  },
  
  // Cor do botão de confirmação (sobrescreve padrão do type)
  confirmColor: {
    type: String,
    default: null
  },
  
  // Cor do botão de cancelamento
  cancelColor: {
    type: String,
    default: 'grey-7'
  },
  
  // Estado de loading
  loading: {
    type: Boolean,
    default: false
  },
  
  // Maximizar em mobile
  maximized: {
    type: Boolean,
    default: false
  },
  
  // Alinhamento dos botões
  actionsAlign: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'center', 'right', 'between', 'around'].includes(value)
  },
  
  // ARIA label customizado para botão confirmar
  confirmAriaLabel: {
    type: String,
    default: null
  },
  
  // ARIA label customizado para botão cancelar
  cancelAriaLabel: {
    type: String,
    default: null
  }
})

// ==========================================================================
// EMITS
// ==========================================================================
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// ==========================================================================
// STATE
// ==========================================================================
const isOpen = ref(props.modelValue)
const cancelButton = ref(null)
const dialogTitleId = `confirm-dialog-title-${Math.random().toString(36).substr(2, 9)}`
const dialogMessageId = `confirm-dialog-message-${Math.random().toString(36).substr(2, 9)}`

// ==========================================================================
// COMPUTED
// ==========================================================================

/**
 * Ícone baseado no tipo
 */
const iconName = computed(() => {
  const icons = {
    danger: 'error',
    warning: 'warning',
    info: 'info',
    success: 'check_circle'
  }
  return icons[props.type] || icons.warning
})

/**
 * Cor do botão confirmar baseado no tipo
 */
const confirmButtonColor = computed(() => {
  if (props.confirmColor) return props.confirmColor
  
  const colors = {
    danger: 'negative',
    warning: 'warning',
    info: 'info',
    success: 'positive'
  }
  return colors[props.type] || 'primary'
})

// ==========================================================================
// WATCHERS
// ==========================================================================
watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
  
  // Focus no botão cancelar quando abrir
  if (newValue) {
    nextTick(() => {
      cancelButton.value?.$el?.focus()
    })
  }
})

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

// ==========================================================================
// METHODS
// ==========================================================================
const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  isOpen.value = false
  emit('cancel')
}
</script>

<style lang="scss" scoped>
// ==========================================================================
// CONFIRM DIALOG - SAGE ACCOUNTANT THEME
// ==========================================================================

.confirm-dialog {
  min-width: 400px;
  max-width: 500px;
  border-radius: var(--radius-lg);
  
  @media (max-width: 599px) {
    min-width: auto;
    width: 100%;
    max-width: 100%;
  }
}

// Header
.confirm-dialog__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-6) var(--spacing-6) var(--spacing-4);
  border-bottom: 1px solid var(--color-grey-200);
}

.confirm-dialog__icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: var(--spacing-4);
  animation: scaleIn 0.3s ease-out;
  
  // Cores por tipo
  &.bg-danger {
    background: var(--color-negative);
  }
  
  &.bg-warning {
    background: var(--color-warning);
  }
  
  &.bg-info {
    background: var(--color-info);
  }
  
  &.bg-success {
    background: var(--color-positive);
  }
}

.confirm-dialog__title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

// Content
.confirm-dialog__content {
  padding: var(--spacing-5) var(--spacing-6);
  text-align: center;
}

.confirm-dialog__message {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.confirm-dialog__extra {
  margin-top: var(--spacing-4);
}

// Actions
.confirm-dialog__actions {
  padding: var(--spacing-4) var(--spacing-6) var(--spacing-6);
  gap: var(--spacing-3);
  
  @media (max-width: 599px) {
    flex-direction: column-reverse;
    
    :deep(.q-btn) {
      width: 100%;
    }
  }
}

.confirm-dialog__confirm-btn {
  font-weight: var(--font-semibold);
  
  &:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
    opacity: 0.9;
  }
}

// Variantes por tipo
.confirm-dialog--danger {
  .confirm-dialog__title {
    color: var(--color-negative);
  }
}

.confirm-dialog--warning {
  .confirm-dialog__title {
    color: #CC9400; // Darker yellow for contrast
  }
}

.confirm-dialog--info {
  .confirm-dialog__title {
    color: var(--color-info);
  }
}

.confirm-dialog--success {
  .confirm-dialog__title {
    color: var(--color-positive);
  }
}

// Animações
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
