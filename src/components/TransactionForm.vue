<!-- ==========================================================================
TRANSACTION FORM - FORMULÁRIO DE TRANSAÇÃO
==========================================================================
Propósito: Componente reutilizável para criar/editar transações
Origem: Dashboard, página de transações
Destino: API de transações via store
Efeitos: CRUD de transações com validação -->

<template>
  <q-card class="transaction-form-card" :dark="$q.dark.isActive">
    
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
                <div class="field-label text-caption">
                  Descrição
                </div>
                <div class="field-value text-h6">
                  {{ form.description }}
                </div>
              </div>

              <!-- Categoria -->
              <div class="field-view">
                <div class="field-label text-caption">
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
                <div class="field-label text-caption">
                  Data
                </div>
                <div class="field-value text-body1">
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
            <div class="col-12 col-sm-6 col-md-6">
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
                name="amount"
                id="transaction-amount"
                placeholder="0,00"
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
            <div class="col-12 col-sm-6 col-md-6">
              <q-input
                v-model="form.date"
                label="Data *"
                type="date"
                outlined
                dense
                :rules="[
                  val => !!val || 'Data é obrigatória'
                ]"
                name="date"
                id="transaction-date"
                placeholder="YYYY-MM-DD"
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="grey-6" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Parcelamento / Lançamento recorrente -->
          <q-expansion-item
            expand-separator
            icon="schedule"
            label="Lançamento Recorrente / Parcelado (opcional)"
            :caption="form.isInstallment ? `${form.installmentsCount} parcelas mensais` : 'Desativado'"
            dense
          >
            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-12 col-sm-4">
                <q-toggle
                  v-model="form.isInstallment"
                  label="Ativar parcelamento"
                  name="is_installment"
                  id="transaction-is-installment"
                />
              </div>

              <div class="col-12 col-sm-4">
                <q-input
                  v-model.number="form.installmentsCount"
                  label="Quantidade de parcelas"
                  type="number"
                  outlined
                  dense
                  :disable="!form.isInstallment"
                  :min="2"
                  :max="60"
                  name="installments_count"
                  id="transaction-installments-count"
                  placeholder="2"
                  :rules="[
                    v => !form.isInstallment || (v && v >= 2) || 'Mínimo 2 parcelas'
                  ]"
                />
              </div>

              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.firstDueDate"
                  label="1ª parcela em"
                  type="date"
                  outlined
                  dense
                  :disable="!form.isInstallment"
                  name="first_due_date"
                  id="transaction-first-due-date"
                  placeholder="YYYY-MM-DD"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" color="grey-6" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="text-caption text-grey q-mt-xs">
              Ao salvar, serão criadas <b>{{ form.installmentsCount }}</b> transações, uma por mês, com descrição no formato "{{ form.description || 'Descrição' }} (n/{{ form.installmentsCount || 0 }})".
            </div>
          </q-expansion-item>

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
            name="description"
            id="transaction-description"
            placeholder="Ex.: Salário, Conta de luz, etc."
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
            @new-value="handleNewCategory"
            hint="Selecione ou digite uma nova categoria"
            name="category"
            id="transaction-category"
            placeholder="Selecione uma categoria"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="grey-6" />
            </template>
            <template v-slot:append>
              <q-btn round dense flat icon="add" @click.stop="openCreateCategoryDialog" />
            </template>
            <template v-slot:option="{ itemProps, opt }">
              <q-item v-if="opt.header" dense class="bg-grey-2 text-grey-8">
                <q-item-section>
                  <q-item-label class="text-caption">{{ opt.header }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator v-else-if="opt.separator" />
              <q-item v-else v-bind="itemProps">
                <q-item-section avatar>
                  <q-icon :name="opt.icon || 'category'" :color="opt.color || 'blue-6'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ opt.name }}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="opt.is_default !== true">
                  <div class="row items-center no-wrap q-gutter-xs">
                    <q-btn size="sm" flat round icon="edit" @click.stop.prevent="openEditCategoryDialog(opt)" />
                    <q-btn size="sm" flat round icon="delete" color="negative" @click.stop.prevent="deleteCategory(opt)" />
                  </div>
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
            name="notes"
            id="transaction-notes"
            placeholder="Detalhes adicionais (opcional)"
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

  <!-- Dialogo de categoria (reutilizável) -->
  <CategoryDialog
    :show="categoryDialog.show"
    :mode="categoryDialog.mode"
    :initial-name="categoryDialog.initial?.name"
    :initial-icon="categoryDialog.initial?.icon"
    :initial-color="categoryDialog.initial?.color"
    :initial-type="categoryDialog.initial?.type || form.type"
    :existing-names="availableCategories.map(c => c.name)"
    :submit-fn="categoryDialog.submitFn || null"
    @close="categoryDialog.show = false"
    @created="onCategoryCreated"
    @saved="onCategorySaved"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useTransactionStore } from 'src/stores/transactions'
import { categoriesList, categoriesCreate, categoriesUpdate, categoriesDelete } from 'src/apis/categories'
import CategoryDialog from './CategoryDialog.vue'
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
const $q = useQuasar()
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
  notes: '',
  // Recorrência / Parcelado
  isInstallment: false,
  installmentsCount: 2,
  firstDueDate: toISODate(new Date())
})

const filteredCategories = ref([]) // array para o QSelect (com headers/separators)
const availableCategories = ref([]) // [{ id?, name, icon, color, type }]

// Dialog de categoria (reutilizável)
const categoryDialog = ref({
  show: false,
  mode: 'create', // 'create' | 'edit'
  initial: null, // { name, icon, color }
  submitFn: null
})
let pendingNewValueDone = null // callback do @new-value do QSelect

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
const loadCategories = async () => {
  try {
    const resp = await categoriesList()
    const items = Array.isArray(resp?.data) ? resp.data : resp
    // normaliza mantendo type ('default' | 'user')
    availableCategories.value = (items || []).map(c => ({
      id: c.id,
      name: c.name || (typeof c === 'string' ? c : ''),
      icon: c.icon || 'category',
      color: c.color || 'blue-6',
      type: c.type || 'user'
    })).filter(c => !!c.name)
    filteredCategories.value = buildGroupedOptions('')
  } catch (_) {
    // fallback para store local se API indisponível
    if (transactionStore.categories?.length) {
      availableCategories.value = transactionStore.categories.map(name => ({ name, icon: 'category', color: 'blue-6', type: 'user' }))
      filteredCategories.value = buildGroupedOptions('')
    } else {
      availableCategories.value = []
      filteredCategories.value = []
    }
  }
}

/**
 * Filtra categorias conforme input do usuário
 */
const filterCategories = (val, update) => {
  update(() => {
    filteredCategories.value = buildGroupedOptions(val || '')
  })
}

/**
 * Cria nova categoria no backend e seleciona
 */
const handleNewCategory = (val, done) => {
  const name = (val || '').trim()
  if (!name) { done(); return }
  pendingNewValueDone = done
  categoryDialog.value = {
    show: true,
    mode: 'create',
    initial: { name, icon: 'category', color: 'blue-6', type: form.value.type },
    submitFn: null
  }
}

const onCategoryCreated = (created) => {
  const item = {
    id: created.id,
    name: created.name,
    icon: created.icon,
    color: created.color,
    type: 'user'
  }
  if (!availableCategories.value.some(c => c.name.toLowerCase() === item.name.toLowerCase())) {
    availableCategories.value.push(item)
  }
  filteredCategories.value = buildGroupedOptions('')
  form.value.category = item.name
  if (pendingNewValueDone) pendingNewValueDone(item)
  pendingNewValueDone = null
}

const onCategorySaved = (saved) => {
  const idx = availableCategories.value.findIndex(c => c.id === saved.id)
  if (idx !== -1) {
    availableCategories.value[idx] = { ...availableCategories.value[idx], ...saved }
  }
  filteredCategories.value = buildGroupedOptions('')
}

const openCreateCategoryDialog = () => {
  pendingNewValueDone = null
  categoryDialog.value = { show: true, mode: 'create', initial: { name: '', icon: 'category', color: 'blue-6', type: form.value.type }, submitFn: null }
}

const openEditCategoryDialog = (opt) => {
  categoryDialog.value = {
    show: true,
    mode: 'edit',
    initial: { name: opt.name, icon: opt.icon, color: opt.color, type: opt.type },
    submitFn: async ({ name, icon, color, type }) => {
      const resp = await categoriesUpdate(opt.id, { name, icon, color, type })
      return resp?.data || { id: opt.id, name, icon, color, type }
    }
  }
}

const deleteCategory = async (opt) => {
  $q.dialog({ title: 'Excluir categoria', message: `Deseja excluir "${opt.name}"?`, cancel: true, ok: 'Excluir' })
    .onOk(async () => {
      try {
        await categoriesDelete(opt.id)
        availableCategories.value = availableCategories.value.filter(c => c.id !== opt.id)
        filteredCategories.value = buildGroupedOptions('')
        if (form.value.category === opt.name) form.value.category = ''
        notifySuccess('Categoria excluída')
      } catch (e) {
        notifyError('Falha ao excluir categoria')
      }
    })
}

function buildGroupedOptions(filterText) {
  const needle = (filterText || '').toLowerCase()
  const def = availableCategories.value.filter(c => c.is_default === true && c.name.toLowerCase().includes(needle))
  const usr = availableCategories.value.filter(c => c.is_default !== true && c.name.toLowerCase().includes(needle))
  const out = []
  if (def.length) {
    out.push({ header: 'Categorias padrão' })
    out.push(...def)
  }
  if (def.length && usr.length) out.push({ separator: true })
  if (usr.length) {
    out.push({ header: 'Minhas categorias' })
    out.push(...usr)
  }
  return out
}

// Categoria selecionada (metadados para chip no modo view)
const currentCategoryMeta = computed(() => {
  return availableCategories.value.find(c => c.name === form.value.category) || null
})

/**
 * Processa o envio do formulário
 */
const handleSubmit = async () => {
  
  try {
    const baseData = {
      type: form.value.type,
      amount: parseFloat(form.value.amount),
      description: form.value.description.trim(),
      category: form.value.category.trim(),
      notes: form.value.notes?.trim() || null
    }
    
    if (props.mode === 'edit' && props.transaction?.id) {
      // Atualizar transação única
      await transactionStore.updateTransaction(props.transaction.id, { ...baseData, date: form.value.date })
      notifySuccess('Transação atualizada com sucesso!')
      
    } else {
      // Criação (única ou parcelada)
      if (form.value.isInstallment && form.value.installmentsCount >= 2) {
        const count = Math.min(Math.max(parseInt(form.value.installmentsCount) || 2, 2), 60)
        const startDate = new Date(form.value.firstDueDate || form.value.date)
        for (let i = 1; i <= count; i++) {
          const due = addMonths(startDate, i - 1)
          const desc = `${baseData.description} (${i}/${count})`
          await transactionStore.createTransaction({ ...baseData, description: desc, date: toISODate(due) })
        }
        notifySuccess(`${count} parcelas lançadas com sucesso!`)
      } else {
        await transactionStore.createTransaction({ ...baseData, date: form.value.date })
        notifySuccess('Transação criada com sucesso!')
      }
    }
    
    emit('saved')
    
  } catch (error) {
    notifyError(`Erro ao ${props.mode === 'edit' ? 'atualizar' : 'criar'} transação`)
  }
}

/**
 * Soma meses tratando virada de mês (mantém dia quando possível)
 */
function addMonths(date, months) {
  const d = new Date(date)
  const day = d.getDate()
  d.setMonth(d.getMonth() + months)
  // Ajuste quando o mês alvo não tem o mesmo dia (ex.: 31)
  if (d.getDate() < day) {
    d.setDate(0) // último dia do mês anterior
  }
  return d
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