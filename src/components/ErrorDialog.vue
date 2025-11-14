<!-- ==========================================================================
ERROR DIALOG - DIALOG DE ERROS
==========================================================================
Propósito: Exibir erros de forma elegante em dialog ao invés de notificações
Usado para: Erros 403 (acesso negado), limite de transações, etc. -->

<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="error-dialog-card" style="min-width: 400px; max-width: 500px;">
      
      <!-- HEADER com ícone de erro -->
      <q-card-section class="row items-center q-pb-none">
        <div class="col">
          <div class="error-header">
            <q-icon 
              :name="getIcon()" 
              :color="getColor()" 
              size="3rem" 
              class="q-mr-md"
            />
            <div>
              <div class="text-h6 text-weight-bold">{{ getTitle() }}</div>
              <div class="text-caption text-grey-7">{{ getSubtitle() }}</div>
            </div>
          </div>
        </div>
        <q-btn 
          icon="close" 
          flat 
          round 
          dense 
          @click="close"
        />
      </q-card-section>

      <!-- CONTEÚDO -->
      <q-card-section class="q-pt-md">
        <div class="error-message">
          {{ message }}
        </div>

        <!-- Estatísticas de Limite (para type='limit') -->
        <div v-if="type === 'limit' && (limit || current)" class="limit-stats q-mt-md">
          <div class="stats-container">
            <div class="stat-item">
              <div class="stat-label">Limite do Plano</div>
              <div class="stat-value primary">{{ limit || '?' }}</div>
            </div>
            <div class="stat-divider">
              <q-icon name="arrow_forward" size="1.5rem" color="grey-5" />
            </div>
            <div class="stat-item">
              <div class="stat-label">Você Já Usou</div>
              <div class="stat-value accent">{{ current || '?' }}</div>
            </div>
          </div>
          
          <!-- Progress bar visual -->
          <q-linear-progress
            v-if="limit && current"
            :value="current / limit"
            size="22px"
            rounded
            color="primary"
            track-color="grey-3"
            class="q-mt-md"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="white"
                text-color="primary"
                :label="`${Math.round((current / limit) * 100)}%`"
                class="text-weight-bold"
              />
            </div>
          </q-linear-progress>
        </div>

        <!-- Informações adicionais (opcional) -->
        <div v-if="details" class="error-details q-mt-md">
          <q-separator class="q-mb-md" />
          <div class="text-caption text-grey-7">
            {{ details }}
          </div>
        </div>

        <!-- Ação recomendada (opcional) -->
        <div v-if="action" class="error-action q-mt-md">
          <q-card flat bordered class="action-card">
            <q-card-section class="q-pa-md">
              <div class="row items-start q-gutter-sm">
                <q-icon name="workspace_premium" color="primary" size="1.8rem" />
                <div class="col text-body2" style="line-height: 1.8; white-space: pre-line;">
                  {{ action }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>

      <!-- FOOTER com botões -->
      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn
          v-if="showSecondaryButton"
          flat
          :label="secondaryButtonLabel"
          color="grey-7"
          @click="handleSecondaryAction"
        />
        <q-btn
          unelevated
          :label="primaryButtonLabel"
          :color="getColor()"
          @click="handlePrimaryAction"
        />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    default: 'error', // 'error', 'warning', 'forbidden', 'limit'
    validator: (value) => ['error', 'warning', 'forbidden', 'limit'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  action: {
    type: String,
    default: ''
  },
  primaryButtonLabel: {
    type: String,
    default: 'Entendi'
  },
  showSecondaryButton: {
    type: Boolean,
    default: false
  },
  secondaryButtonLabel: {
    type: String,
    default: 'Cancelar'
  },
  redirectTo: {
    type: String,
    default: ''
  },
  limit: {
    type: [Number, String],
    default: null
  },
  current: {
    type: [Number, String],
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'primary-action', 'secondary-action'])

// Composables
const router = useRouter()

// Methods
const close = () => {
  emit('update:modelValue', false)
}

const getIcon = () => {
  const icons = {
    error: 'error',
    warning: 'warning',
    forbidden: 'block',
    limit: 'show_chart'
  }
  return icons[props.type] || 'error'
}

const getColor = () => {
  const colors = {
    error: 'negative',
    warning: 'warning',
    forbidden: 'accent',
    limit: 'primary'  // Verde contábil da paleta SAGE
  }
  return colors[props.type] || 'negative'
}

const getTitle = () => {
  if (props.title) return props.title
  
  const defaultTitles = {
    error: 'Erro',
    warning: 'Atenção',
    forbidden: 'Acesso Negado',
    limit: 'Limite Atingido'
  }
  return defaultTitles[props.type] || 'Erro'
}

const getSubtitle = () => {
  if (props.subtitle) return props.subtitle
  
  const defaultSubtitles = {
    error: 'Ocorreu um problema',
    warning: 'Verifique as informações',
    forbidden: 'Permissão necessária',
    limit: 'Limite de uso excedido'
  }
  return defaultSubtitles[props.type] || ''
}

const handlePrimaryAction = () => {
  emit('primary-action')
  
  // Se tem redirect, navegar
  if (props.redirectTo) {
    router.push(props.redirectTo)
  }
  
  close()
}

const handleSecondaryAction = () => {
  emit('secondary-action')
  close()
}
</script>

<style scoped lang="scss">
.error-dialog-card {
  border-radius: 12px;
}

.error-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.error-message {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--q-text-primary);
}

.error-details {
  padding: 1rem;
  background: var(--q-bg-secondary, #f5f5f5);
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
}

.error-action {
  .action-card {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border: 2px solid #2C5F2D;
    border-left-width: 4px;
  }
}

.limit-stats {
  .stats-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 1.5rem;
    background: var(--q-bg-secondary, #f5f5f5);
    border-radius: 12px;
    gap: 1rem;
  }

  .stat-item {
    flex: 1;
    text-align: center;
  }

  .stat-label {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--q-text-secondary, #666);
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    
    &.primary {
      color: var(--q-primary);
    }
    
    &.accent {
      color: var(--q-secondary);
    }
  }

  .stat-divider {
    display: flex;
    align-items: center;
    opacity: 0.5;
  }
}

// Dark mode
body.body--dark {
  .error-details {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .error-action .action-card {
    background: linear-gradient(135deg, rgba(44, 95, 45, 0.2) 0%, rgba(44, 95, 45, 0.15) 100%);
    border-color: rgba(44, 95, 45, 0.5);
  }

  .limit-stats .stats-container {
    background: rgba(255, 255, 255, 0.05);
  }
}

// Responsivo mobile
@media (max-width: 600px) {
  .error-dialog-card {
    min-width: auto !important;
    max-width: 95vw !important;
  }
}
</style>
