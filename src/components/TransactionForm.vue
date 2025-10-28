<!-- ==========================================================================
TRANSACTION FORM - FORMULÁRIO DE TRANSAÇÃO
==========================================================================
Propósito: Componente reutilizável para criar/editar transações
Origem: Dashboard, página de transações
Destino: API de transações via store
Efeitos: CRUD de transações com validação -->

<template>
  <q-card class="transaction-form-card">
    
    <!-- ==========================================================================
    CABEÇALHO DO FORMULÁRIO
    ========================================================================== -->
    <q-bar class="bg-primary text-white">
      <q-icon 
        :name="getHeaderIcon()" 
        class="q-mr-sm" 
      />
      <div class="text-weight-medium">
        {{ getHeaderTitle() }}
      </div>
      <q-space />
      
      <!-- Botão fechar apenas se não for modo view -->
      <q-btn 
        v-if="mode !== 'view'"
        dense 
        flat 
        icon="close" 
        @click="handleCancel"
      />
    </q-bar>

    <!-- ==========================================================================
    CONTEÚDO DO FORMULÁRIO
    ========================================================================== -->
    <q-card-section class="q-pa-lg">
      
      <!-- Modo Visualização -->
      <div v-if="mode === 'view'" class="view-mode">
        <div class="row q-col-gutter-md">
          
          <!-- Tipo e Valor -->
          <div class="col-12 col-md-6">
            <q-card class="summary-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon 
                  :name="form.type === 'income' ? 'trending_up' : 'trending_down'"
                  :color="form.type === 'income' ? 'green-6' : 'red-6'"
                  size="3rem"
                  class="q-mb-md"
                />
                <div 
                  class="text-h4 text-weight-bold q-mb-sm"
                  :class="form.type === 'income' ? 'text-green-7' : 'text-red-7'"
                >
                  {{ form.type === 'income' ? '+' : '-' }}{{ formatCurrency(form.amount) }}
                </div>
                <q-chip 
                  :label="form.type === 'income' ? 'Receita' : 'Despesa'"
                  :color="form.type === 'income' ? 'green-1' : 'red-1'"
                  :text-color="form.type === 'income' ? 'green-8' : 'red-8'"
                  size="md"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- Informações Detalhadas -->
          <div class="col-12 col-md-6">
            <div class="q-gutter-md">
              
              <!-- Descrição -->
              <div class="field-view">
                <div class="field-label text-grey-6 text-caption">
                  Descrição
                </div>
                <div class="field-value text-h6 text-grey-8">
                  {{ form.description }}
                </div>
              </div>

              <!-- Categoria -->
              <div class="field-view">
                <div class="field-label text-grey-6 text-caption">
                  Categoria
                </div>
                <div class="field-value">
                  <q-chip
                    :label="form.category"
                    color="blue-1"
                    text-color="blue-9"
                    size="md"
                  />
                </div>
              </div>

              <!-- Data -->
              <div class="field-view">
                <div class="field-label text-grey-6 text-caption">
                  Data
                </div>
                <div class="field-value text-body1 text-grey-8">
                  {{ formatDate(form.date, 'full') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botões do modo visualização -->
        <div class="row q-col-gutter-md q-mt-lg">
          <div class="col-6">
            <q-btn
              label="Editar"
              icon="edit"
              color="primary"
              outline
              class="full-width"
              no-caps
              @click="switchToEditMode"
            />
          </div>
          <div class="col-6">
            <q-btn
              label="Fechar"
              icon="close"
              color="grey-6"
              outline
              class="full-width"
              no-caps
              @click="handleCancel"
            />
          </div>
        </div>
      </div>

      <!-- ==========================================================================
      MODO CRIAÇÃO/EDIÇÃO
      ========================================================================== -->
      <div v-else>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          
          <!-- Seletor de Tipo -->
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="field-label q-mb-sm">
                Tipo da Transação *
              </div>
              <q-btn-toggle
                v-model="form.type"
                :options="[
                  { 
                    label: 'Receita', 
                    value: 'income', 
                    icon: 'trending_up',
                    color: 'green-6'
                  },
                  { 
                    label: 'Despesa', 
                    value: 'expense', 
                    icon: 'trending_down',
                    color: 'red-6'
                  }
                ]"
                toggle-color="primary"
                no-caps
                class="full-width type-selector"
                :class="{ 'income-selected': form.type === 'income', 'expense-selected': form.type === 'expense' }"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            
            <!-- Valor -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.amount"
                label="Valor *"
                outlined
                dense
                :prefix="getCurrencySymbol()"
                :rules="[
                  val => !!val || 'Valor é obrigatório',
                  val => val > 0 || 'Valor deve ser maior que zero'
                ]"
                mask="#.##"
                reverse-fill-mask
                input-class="text-right"
                class="amount-input"
              >
                <template v-slot:prepend>
                  <q-icon 
                    :name="form.type === 'income' ? 'add_circle' : 'remove_circle'"
                    :color="form.type === 'income' ? 'green-6' : 'red-6'"
                  />
                </template>
              </q-input>
            </div>

            <!-- Data -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.date"
                label="Data *"
                type="date"
                outlined
                dense
                :rules="[
                  val => !!val || 'Data é obrigatória'
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="grey-6" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Descrição -->
          <q-input
            v-model="form.description"
            label="Descrição *"
            outlined
            dense
            maxlength="100"
            counter
            :rules="[
              val => !!val || 'Descrição é obrigatória',
              val => val.length <= 100 || 'Máximo 100 caracteres'
            ]"
            hint="Descreva brevemente esta transação"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="grey-6" />
            </template>
          </q-input>

          <!-- Categoria -->
          <q-select
            v-model="form.category"
            label="Categoria *"
            :options="filteredCategories"
            outlined
            dense
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            new-value-mode="add-unique"
            :rules="[
              val => !!val || 'Categoria é obrigatória'
            ]"
            @filter="filterCategories"
            hint="Selecione ou digite uma nova categoria"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="grey-6" />
            </template>
            
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey-6">
                  Digite para criar uma nova categoria
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Observações (opcional) -->
          <q-input
            v-model="form.notes"
            label="Observações (opcional)"
            type="textarea"
            outlined
            rows="3"
            maxlength="500"
            counter
            hint="Informações adicionais sobre esta transação"
          >
            <template v-slot:prepend>
              <q-icon name="note" color="grey-6" />
            </template>
          </q-input>

          <!-- ==========================================================================
          BOTÕES DE AÇÃO
          ========================================================================== -->
          <div class="row q-col-gutter-md q-mt-lg">
            <div class="col-6">
              <q-btn
                label="Cancelar"
                color="grey-6"
                outline
                class="full-width"
                no-caps
                @click="handleCancel"
              />
            </div>
            <div class="col-6">
              <q-btn
                type="submit"
                :label="mode === 'edit' ? 'Salvar Alterações' : 'Criar Transação'"
                :color="form.type === 'income' ? 'green-6' : (form.type === 'expense' ? 'red-6' : 'primary')"
                class="full-width"
                no-caps
                :disable="!isFormValid"
              />
            </div>
          </div>
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTransactionStore } from 'src/stores/transactions'
import { useCurrency } from 'src/composables/useCurrency'
import { useDate } from 'src/composables/useDate'
import { useNotifications } from 'src/composables/useNotifications'

// ==========================================================================
// PROPS E EMITS
// ==========================================================================
const props = defineProps({
  transaction: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create', // 'create' | 'edit' | 'view'
    validator: (value) => ['create', 'edit', 'view'].includes(value)
  }
})

const emit = defineEmits(['saved', 'cancelled'])

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================
const transactionStore = useTransactionStore()
const { formatCurrency, getCurrencySymbol, parseCurrency } = useCurrency()
const { formatDate, toISODate } = useDate()
const { notifySuccess, notifyError } = useNotifications()

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const form = ref({
  type: 'income',
  amount: '',
  description: '',
  category: '',
  date: toISODate(new Date()),
  notes: ''
})

const filteredCategories = ref([])
const availableCategories = ref([])

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================

/**
 * Verifica se o formulário é válido
 */
const isFormValid = computed(() => {
  return form.value.type &&
         form.value.amount &&
         form.value.description &&
         form.value.category &&
         form.value.date &&
         parseFloat(form.value.amount) > 0
})

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Inicializa o formulário
 */
const initializeForm = () => {
  if (props.transaction) {
    
    form.value = {
      type: props.transaction.type || 'income',
      amount: props.transaction.amount?.toString() || '',
      description: props.transaction.description || '',
      category: props.transaction.category || '',
      date: toISODate(props.transaction.date) || toISODate(new Date()),
      notes: props.transaction.notes || ''
    }
  } else {
    
    form.value = {
      type: 'income',
      amount: '',
      description: '',
      category: '',
      date: toISODate(new Date()),
      notes: ''
    }
  }
}

/**
 * Carrega categorias disponíveis
 */
const loadCategories = () => {
  if (transactionStore.categories.length === 0) {
    transactionStore.loadCategories()
  }
  
  availableCategories.value = [...transactionStore.categories]
  filteredCategories.value = [...availableCategories.value]
  
  
}

/**
 * Filtra categorias conforme input do usuário
 */
const filterCategories = (val, update) => {
  update(() => {
    if (val === '') {
      filteredCategories.value = [...availableCategories.value]
    } else {
      const needle = val.toLowerCase()
      filteredCategories.value = availableCategories.value.filter(
        category => category.toLowerCase().includes(needle)
      )
    }
  })
}

/**
 * Processa o envio do formulário
 */
const handleSubmit = async () => {
  
  try {
    const transactionData = {
      type: form.value.type,
      amount: parseFloat(form.value.amount),
      description: form.value.description.trim(),
      category: form.value.category.trim(),
      date: form.value.date,
      notes: form.value.notes?.trim() || null
    }
    
    if (props.mode === 'edit' && props.transaction?.id) {
      // Atualizar transação existente
      await transactionStore.updateTransaction(props.transaction.id, transactionData)
      notifySuccess('Transação atualizada com sucesso!')
      
    } else {
      // Criar nova transação
      await transactionStore.createTransaction(transactionData)
      notifySuccess('Transação criada com sucesso!')
    }
    
    emit('saved')
    
  } catch (error) {
    notifyError(`Erro ao ${props.mode === 'edit' ? 'atualizar' : 'criar'} transação`)
  }
}

/**
 * Cancela a operação
 */
const handleCancel = () => {
  emit('cancelled')
}

/**
 * Muda para modo de edição (apenas do modo view)
 */
const switchToEditMode = () => {
  emit('cancelled') // Fecha e reabre em modo edit
  // O componente pai deve lidar com a mudança de modo
}

/**
 * Obtém ícone do cabeçalho
 */
const getHeaderIcon = () => {
  if (props.mode === 'view') return 'visibility'
  if (props.mode === 'edit') return 'edit'
  return 'add'
}

/**
 * Obtém título do cabeçalho
 */
const getHeaderTitle = () => {
  if (props.mode === 'view') {
    return `Visualizar ${form.value.type === 'income' ? 'Receita' : 'Despesa'}`
  }
  if (props.mode === 'edit') {
    return `Editar ${form.value.type === 'income' ? 'Receita' : 'Despesa'}`
  }
  return `Nova ${form.value.type === 'income' ? 'Receita' : 'Despesa'}`
}

// ==========================================================================
// WATCHERS
// ==========================================================================

/**
 * Observa mudanças na prop transaction
 */
watch(
  () => props.transaction,
  () => {
    initializeForm()
  },
  { immediate: true }
)

/**
 * Observa mudanças no tipo para atualizar título
 */
watch(
  () => form.value.type,
  () => {}
)

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(() => {
  loadCategories()
  initializeForm()
})

</script>

<style lang="scss" scoped>
// ==========================================================================
// ESTILOS DO FORMULÁRIO
// ==========================================================================

.transaction-form-card {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 16px;
  
  .q-bar {
    border-radius: 16px 16px 0 0;
  }
}

// Seletor de tipo
.type-selector {
  .q-btn {
    flex: 1;
    
    &.q-btn--active {
      transform: scale(1.05);
    }
  }
  
  &.income-selected .q-btn--active {
    background-color: rgba(76, 175, 80, 0.1) !important;
    color: #4CAF50 !important;
  }
  
  &.expense-selected .q-btn--active {
    background-color: rgba(244, 67, 54, 0.1) !important;
    color: #f44336 !important;
  }
}

// Input de valor
.amount-input {
  .q-field__native {
    font-size: 1.2rem;
    font-weight: 600;
  }
}

// Modo visualização
.view-mode {
  .summary-card {
    border-radius: 12px;
    border: 2px solid rgba(0, 0, 0, 0.05);
  }
  
  .field-view {
    margin-bottom: 1rem;
    
    .field-label {
      font-weight: 500;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .field-value {
      margin-top: 0.25rem;
    }
  }
}

// Labels customizados
.field-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.875rem;
}

// Animações
.q-btn {
  transition: all 0.3s ease;
  
  &:hover:not(.q-btn--disable) {
    transform: translateY(-1px);
  }
}

// Responsividade
@media (max-width: 768px) {
  .transaction-form-card {
    margin: 0;
    border-radius: 0;
    height: 100vh;
    
    .q-bar {
      border-radius: 0;
    }
  }
}
</style>