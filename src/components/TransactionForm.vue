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
      <q-icon :name="getHeaderIcon()" class="q-mr-sm" />
      <div class="text-weight-medium">
        {{ getHeaderTitle() }}
      </div>
      <q-space />

      <!-- Botão fechar apenas se não for modo view -->
      <q-btn v-if="mode !== 'view'" dense flat icon="close" @click="handleCancel" />
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
                <q-icon :name="form.type === 'income' ? 'trending_up' : 'trending_down'"
                  :color="form.type === 'income' ? 'green-6' : 'red-6'" size="3rem" class="q-mb-md" />
                <div class="text-h4 text-weight-bold q-mb-sm"
                  :class="form.type === 'income' ? 'text-green-7' : 'text-red-7'">
                  {{ form.type === 'income' ? '+' : '-' }}{{ formatCurrency(form.amount) }}
                </div>
                <q-chip :label="form.type === 'income' ? 'Receita' : 'Despesa'"
                  :color="form.type === 'income' ? 'green-1' : 'red-1'"
                  :text-color="form.type === 'income' ? 'green-8' : 'red-8'" size="md" />
                <q-chip class="q-ml-sm"
                  :label="form.type === 'income' ? (form.paid ? 'Recebido' : 'A receber') : (form.paid ? 'Pago' : 'Em aberto')"
                  :color="form.paid ? 'teal-1' : 'grey-2'" :text-color="form.paid ? 'teal-8' : 'grey-8'" size="md" />
                <q-chip v-if="form.paid && props.transaction?.paid_at" class="q-ml-sm"
                  :label="(form.type === 'income' ? 'Recebido em ' : 'Pago em ') + formatBRDate(props.transaction.paid_at)"
                  color="teal-1" text-color="teal-8" size="md" />
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
                  <q-chip :label="form.category" color="blue-1" text-color="blue-9" size="md" />
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

        <!-- Pago -->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-6">
            <q-toggle :model-value="form.paid" :label="form.type === 'income' ? 'Recebido' : 'Pago'" color="teal-6"
              dense name="paid" id="transaction-paid" @update:model-value="onTogglePaidView"
              :disable="!props.transaction?.id" />
            <div v-if="form.paid && props.transaction?.paid_at" class="text-caption q-mt-xs">
              {{ form.type === 'income' ? 'Recebido em' : 'Pago em' }} {{ formatBRDate(props.transaction.paid_at) }}
            </div>
          </div>
        </div>

        <!-- Botões do modo visualização -->
        <div class="row q-col-gutter-md q-mt-lg">
          <div class="col-6">
            <q-btn label="Editar" icon="edit" color="primary" outline class="full-width" no-caps
              @click="switchToEditMode" />
          </div>
          <div class="col-6">
            <q-btn label="Fechar" icon="close" color="grey-6" outline class="full-width" no-caps
              @click="handleCancel" />
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
              <div class="q-mb-md">
                Tipo da Transação *
              </div>
              <q-btn-toggle v-model="form.type" :options="[
                {
                  label: 'Receita',
                  value: 'income',
                  icon: 'trending_up'
                },
                {
                  label: 'Despesa',
                  value: 'expense',
                  icon: 'trending_down'
                }
              ]" no-caps class="type-selector q-mb-md"
                :class="{ 'income-selected': form.type === 'income', 'expense-selected': form.type === 'expense' }" />
            </div>
          </div>

          <div class="row q-col-gutter-md">

            <!-- Valor -->
            <div class="col-12 col-sm-6 col-md-6">
              <q-input v-model="form.amount" label="Valor *" outlined dense :prefix="getCurrencySymbol()" :rules="[
                val => !!val || 'Valor é obrigatório',
                val => parseCurrency(String(val)) > 0 || 'Valor deve ser maior que zero'
              ]" @update:model-value="onAmountInput" input-class="text-right" class="amount-input" name="amount"
                id="transaction-amount" placeholder="0,00">
                <template v-slot:prepend>
                  <q-icon :name="form.type === 'income' ? 'add_circle' : 'remove_circle'"
                    :color="form.type === 'income' ? 'green-6' : 'red-6'" />
                </template>
              </q-input>
            </div>

            <!-- Data -->
            <div class="col-12 col-sm-6 col-md-6">
              <q-input v-model="form.date" label="Data *" type="date" outlined dense :rules="[
                val => !form.isInstallment || (!!val) || 'Data é obrigatória'
              ]" :disable="form.isInstallment" name="date" id="transaction-date" placeholder="YYYY-MM-DD">
                <template v-slot:prepend>
                  <q-icon name="event" color="grey-6" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Parcelamento / Lançamento recorrente -->
          <q-expansion-item expand-separator icon="schedule" label="Lançamento Recorrente / Parcelado (opcional)"
            :caption="form.isInstallment ? `${form.installmentsCount} parcelas mensais` : 'Desativado'" dense>
            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-12 col-sm-4">
                <q-toggle v-model="form.isInstallment" label="Ativar parcelamento" name="is_installment"
                  id="transaction-is-installment" />
              </div>

              <div class="col-12 col-sm-4">
                <q-input v-model.number="form.installmentsCount" label="Quantidade de parcelas" type="number" outlined
                  dense :disable="!form.isInstallment" :min="2" :max="60" name="installments_count"
                  id="transaction-installments-count" placeholder="2" :rules="[
                    v => !form.isInstallment || (v && v >= 2) || 'Mínimo 2 parcelas'
                  ]" />
              </div>

              <div class="col-12 col-sm-4">
                <q-input v-model="form.firstDueDate" label="1ª parcela em" type="date" outlined dense
                  :disable="!form.isInstallment" name="first_due_date" id="transaction-first-due-date"
                  placeholder="YYYY-MM-DD">
                  <template v-slot:prepend>
                    <q-icon name="event" color="grey-6" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="text-caption text-grey q-mt-xs">
              Ao salvar, serão criadas <b>{{ form.installmentsCount }}</b> transações, uma por mês, com descrição no
              formato "{{
                form.description || 'Descrição' }} (n/{{ form.installmentsCount || 0 }})".
            </div>
          </q-expansion-item>

          <!-- Descrição -->
          <q-input v-model="form.description" label="Descrição *" outlined dense maxlength="100" counter :rules="[
            val => !!val || 'Descrição é obrigatória',
            val => val.length <= 100 || 'Máximo 100 caracteres'
          ]" hint="Descreva brevemente esta transação" name="description" id="transaction-description"
            placeholder="Ex.: Salário, Conta de luz, etc.">
            <template v-slot:prepend>
              <q-icon name="description" color="grey-6" />
            </template>
          </q-input>

          <!-- Categoria -->
          <q-select v-model="form.category" label="Categoria *" :options="filteredCategories" outlined dense use-input
            hide-selected fill-input input-debounce="0" new-value-mode="add-unique" option-label="name"
            option-value="name" emit-value map-options :rules="[
              val => !!val || 'Categoria é obrigatória'
            ]" @filter="filterCategories" @new-value="handleNewCategory" hint="Selecione ou digite uma nova categoria"
            name="category" id="transaction-category" placeholder="Selecione uma categoria">
            <template v-slot:prepend>
              <q-icon name="category" color="grey-6" />
            </template>
            <template v-slot:append>
              <q-btn round dense flat icon="add" @click.stop="openCreateCategoryDialog" />
            </template>
            <!-- Selected display (when a value is chosen) -->
            <template v-slot:selected="scope">
              <div class="row items-center no-wrap">
                <q-icon :name="(availableCategories.find(c => c.name === scope.opt) || {}).icon || 'category'"
                  :color="(availableCategories.find(c => c.name === scope.opt) || {}).color || 'blue-6'"
                  class="q-mr-sm" />
                <span>{{ scope.opt }}</span>
              </div>
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
                    <q-btn size="sm" flat round icon="delete" color="negative"
                      @click.stop.prevent="deleteCategory(opt)" />
                  </div>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Observações (opcional) -->
          <q-input v-model="form.notes" label="Observações (opcional)" type="textarea" outlined rows="3" maxlength="500"
            counter hint="Informações adicionais sobre esta transação" name="notes" id="transaction-notes"
            placeholder="Detalhes adicionais (opcional)">
            <template v-slot:prepend>
              <q-icon name="note" color="grey-6" />
            </template>
          </q-input>

          <!-- ==========================================================================
          BOTÕES DE AÇÃO
          ========================================================================== -->
          <div class="row q-col-gutter-md q-mt-lg">
            <div class="col-6">
              <q-btn label="Cancelar" color="grey-6" outline class="full-width" no-caps @click="handleCancel" />
            </div>
            <div class="col-6">
              <q-btn type="submit" :label="mode === 'edit' ? 'Salvar Alterações' : 'Criar Transação'"
                :color="form.type === 'income' ? 'green-6' : (form.type === 'expense' ? 'red-6' : 'primary')"
                class="full-width" no-caps :disable="!isFormValid" />
            </div>
          </div>
        </q-form>
      </div>
    </q-card-section>
  </q-card>

  <!-- Dialogo de categoria (reutilizável) -->
  <CategoryDialog :show="categoryDialog.show" :mode="categoryDialog.mode" :initial-name="categoryDialog.initial?.name"
    :initial-icon="categoryDialog.initial?.icon" :initial-color="categoryDialog.initial?.color"
    :initial-type="categoryDialog.initial?.type || form.type" :existing-names="availableCategories.map(c => c.name)"
    :submit-fn="categoryDialog.submitFn || null" @close="categoryDialog.show = false" @created="onCategoryCreated"
    @saved="onCategorySaved" />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { categoriesDelete, categoriesList, categoriesUpdate } from 'src/apis/categories'
import { useCurrency } from 'src/composables/useCurrency'
import { useDate } from 'src/composables/useDate'
import { useNotifications } from 'src/composables/useNotifications'
import { useTransactionStore } from 'src/stores/transactions'
import { computed, onMounted, ref, watch } from 'vue'
import CategoryDialog from './CategoryDialog.vue'
// UUID helper (browser-native)
const uuidv4 = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`)

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
  },
  initialType: {
    type: String,
    default: 'income',
    validator: (value) => ['income', 'expense'].includes(value)
  }
})

const emit = defineEmits(['saved', 'cancelled', 'switch-edit'])

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
  paid: false,
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
  const amountOk = parseCurrency(String(form.value.amount)) > 0
  const baseOk = !!(form.value.type && form.value.description && form.value.category && amountOk)
  const installmentOk = !form.value.isInstallment || (
    (Number(form.value.installmentsCount) >= 2) && !!form.value.firstDueDate
  )
  return baseOk && installmentOk
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
      notes: props.transaction.notes || '',
      paid: !!props.transaction.paid
    }
  } else {
    // Modo criação: usa initialType prop
    form.value = {
      type: props.initialType || 'income',
      amount: '',
      description: '',
      category: '',
      date: toISODate(new Date()),
      notes: '',
      paid: false
    }
  }
}

// Helpers: BR <-> ISO date
function pad2(n) { return String(n).padStart(2, '0') }
function formatBRDate(d) {
  const dt = (d instanceof Date) ? d : new Date(d)
  return `${pad2(dt.getDate())}/${pad2(dt.getMonth() + 1)}/${dt.getFullYear()}`
}
function toISOFromBR(s) {
  if (!s) return ''
  const parts = s.replace(/\s/g, '').split('/')
  if (parts.length !== 3) return s
  const [dd, mm, yyyy] = parts
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Carrega categorias disponíveis
 */
const loadCategories = async () => {
  try {
    const resp = await categoriesList()
    const items = Array.isArray(resp?.data) ? resp.data : resp

    // normaliza mantendo type ('income' | 'expense')
    availableCategories.value = (items || []).map(c => ({
      id: c.id,
      name: c.name || (typeof c === 'string' ? c : ''),
      icon: c.icon || 'category',
      color: c.color || 'blue-6',
      type: c.type || 'expense', // 'income' ou 'expense'
      is_default: c.is_default || false
    })).filter(c => !!c.name)

    filteredCategories.value = buildGroupedOptions('')
  } catch (err) {
    console.error('❌ Erro ao carregar categorias:', err)
    // fallback para store local se API indisponível
    if (transactionStore.categories?.length) {
      availableCategories.value = transactionStore.categories.map(name => ({
        name,
        icon: 'category',
        color: 'blue-6',
        type: 'expense', // default para expense
        is_default: false
      }))
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
  const currentType = form.value.type // 'income' ou 'expense'

  // Filtra categorias pelo tipo da transação E pelo texto de busca
  const def = availableCategories.value.filter(c =>
    c.is_default === true &&
    c.type === currentType &&
    c.name.toLowerCase().includes(needle)
  )
  const usr = availableCategories.value.filter(c =>
    c.is_default !== true &&
    c.type === currentType &&
    c.name.toLowerCase().includes(needle)
  )

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
      amount: parseCurrency(form.value.amount),
      description: form.value.description.trim(),
      category: form.value.category.trim(),
      notes: form.value.notes?.trim() || null,
      paid: !!form.value.paid
    }

    if (props.mode === 'edit' && props.transaction?.id) {
      // Atualizar transação única
      const payload = { ...baseData, date: form.value.date }
      const updated = await transactionStore.updateTransaction(props.transaction.id, payload)
      notifySuccess('Transação atualizada com sucesso!')

    } else {
      // Criação (única ou parcelada)
      if (form.value.isInstallment && form.value.installmentsCount >= 2) {
        const count = Math.min(Math.max(parseInt(form.value.installmentsCount) || 2, 2), 60)
        const startDate = new Date(form.value.firstDueDate || form.value.date)
        const seriesId = uuidv4()
        const batch = []
        for (let i = 1; i <= count; i++) {
          const due = addMonths(startDate, i - 1)
          const desc = `${baseData.description} (${i}/${count})`
          batch.push({
            ...baseData,
            description: desc,
            date: toISODate(due),
            paid: false,
            seriesId,
            installmentNumber: i,
            installmentTotal: count
          })
        }
        const bulkResp = await transactionStore.createTransactionsBulk(batch)
        notifySuccess(`${count} parcelas lançadas com sucesso!`)
      } else {
        const payload = { ...baseData, date: form.value.date }
        const created = await transactionStore.createTransaction(payload)
        notifySuccess('Transação criada com sucesso!')
      }
    }

    emit('saved')

  } catch (error) {
    const status = error?.response?.status
    const data = error?.response?.data
    const messageRaw = error?.message
    const stack = error?.stack
    console.error('❌ [Form] Submission failed:', { status, data, messageRaw, stack, error })
    const message = data?.message || `Erro ao ${props.mode === 'edit' ? 'atualizar' : 'criar'} transação`
    notifyError(message)
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
 * Formata entrada do valor deslocando para centavos
 * 1 -> 0,01; 11 -> 0,11; 111 -> 1,11
 */
function onAmountInput(val) {
  try {
    const digits = String(val || '')
      .replace(/\D/g, '')
    const cents = digits ? parseInt(digits, 10) : 0
    const number = cents / 100
    const formatted = number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    form.value.amount = formatted
  } catch (e) {
    form.value.amount = '0,00'
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
  emit('switch-edit')
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
 * Observa mudanças no tipo para refiltrar categorias
 */
watch(
  () => form.value.type,
  (newType, oldType) => {
    if (newType !== oldType) {

      // Refiltra as categorias disponíveis
      filteredCategories.value = buildGroupedOptions('')

      // Se a categoria atual não pertence ao novo tipo, limpa
      const currentCat = availableCategories.value.find(c => c.name === form.value.category)
      if (currentCat && currentCat.type !== newType) {
        form.value.category = ''
      }
    }
  }
)

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(() => {
  loadCategories()
  initializeForm()

  // Fix para scroll mobile quando teclado abre
  if (window.innerWidth <= 768) {
    setupMobileScrollFix()
  }
})

/**
 * Configura scroll automático quando campo recebe foco em mobile
 */
const setupMobileScrollFix = () => {
  // Aguarda próximo tick para garantir que DOM está montado
  setTimeout(() => {
    const inputs = document.querySelectorAll('.transaction-form-card input, .transaction-form-card textarea, .transaction-form-card select')

    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        // Aguarda teclado abrir (300ms)
        setTimeout(() => {
          // Scroll suave até o campo
          e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          })
        }, 300)
      })
    })
  }, 100)
}

/**
 * Marca como pago no modo visualização, perguntando data
 */
const onTogglePaidView = async (val) => {
  if (!props.transaction?.id) return
  try {
    // Pergunta: hoje ou outro dia?
    const decision = await new Promise((resolve) => {
      $q.dialog({
        title: form.value.type === 'income' ? 'Confirmar recebimento' : 'Confirmar pagamento',
        message: form.value.type === 'income' ? 'Deseja registrar como recebido com a data de hoje?' : 'Deseja registrar como pago com a data de hoje?',
        ok: 'Hoje',
        cancel: 'Outro dia'
      }).onOk(() => resolve({ today: true }))
        .onCancel(() => resolve({ today: false }))
        .onDismiss(() => resolve(null))
    })
    if (!decision) return // sem mudança

    let paidAt = null
    if (val) {
      if (decision.today) {
        paidAt = toISODate(new Date())
      } else {
        // Solicita data
        const res = await new Promise((resolve) => {
          $q.dialog({
            title: form.value.type === 'income' ? 'Data de recebimento' : 'Data de pagamento',
            message: 'Informe a data (DD/MM/AAAA):',
            prompt: {
              model: formatBRDate(new Date()),
              type: 'text'
            },
            cancel: true,
            ok: 'Registrar'
          }).onOk((val) => resolve(val))
            .onCancel(() => resolve(null))
            .onDismiss(() => resolve(null))
        })
        if (!res) { return }
        paidAt = toISOFromBR(res)
      }
    }

    await transactionStore.markPaid(props.transaction.id, !!val, paidAt)
    form.value.paid = !!val
    notifySuccess(
      val
        ? (form.value.type === 'income' ? 'Recebimento registrado' : 'Pagamento registrado')
        : (form.value.type === 'income' ? 'Recebimento desmarcado' : 'Pagamento desmarcado')
    )
  } catch (e) {
    notifyError('Falha ao alterar pagamento')
  }
}

</script>

<style lang="scss" scoped>

@import '../css/index.scss';





// ==========================================================================
// ESTILOS DO FORMULÁRIO
// ==========================================================================

.transaction-form-card {
  width: 100%;
  max-width: 800px;
  margin: 2% auto; // top & bottom spacing as requested
  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;

  .q-bar {
    border-radius: 16px 16px 0 0;
  }
}

// Keep layout inside section bounds, avoid gutter bleed
:deep(.transaction-form-card .q-card-section) {
  padding-left: 24px;
  padding-right: 24px;
}

:deep(.transaction-form-card .q-card-section > .row.q-col-gutter-md) {
  margin-left: 0;
  margin-right: 0;
}

:deep(.transaction-form-card .q-card-section > .row.q-col-gutter-md > [class^='col-'],
  .transaction-form-card .q-card-section > .row.q-col-gutter-md > [class*=' col-']) {
  padding-left: 8px;
  padding-right: 8px;
}

// Ensure inputs/selects never overflow
:deep(.transaction-form-card .q-input,
  .transaction-form-card .q-select,
  .transaction-form-card .q-expansion-item,
  .transaction-form-card .q-btn) {
  max-width: 100%;
}

// Harmonize vertical gaps using existing utilities
:deep(.transaction-form-card .q-gutter-md) {
  gap: 16px;
}

:deep(.transaction-form-card .q-mb-md) {
  margin-bottom: 16px !important;
}

// Seletor de tipo
.type-selector {
  .q-btn {
    flex: 1;
    font-weight: 600;
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  // Inactive (pastel) states - base
  .q-btn:not(.q-btn--active) {
    background: #f6f7f9 !important;
    color: #546e7a !important;
  }

  // Map buttons by position: 1 = Receita (income), 2 = Despesa (expense)
  .q-btn:nth-child(1):not(.q-btn--active) {
    background: #E8F5E9 !important; // pastel green
    color: #2e7d32 !important; // dark green text
  }

  .q-btn:nth-child(2):not(.q-btn--active) {
    background: #FFEBEE !important; // pastel red
    color: #c62828 !important; // dark red text
  }

  // Active states (strong colors) - INCOME
  // Ultra-specific to beat theme's .sage-dark-theme .q-btn:not(.q-btn--outline).bg-primary
  &.income-selected .q-btn:nth-child(1).q-btn--active,
  &.income-selected .q-btn:nth-child(1).bg-primary,
  &.income-selected .q-btn:nth-child(1) {
    background: #2e7d32 !important; // strong green
    color: #ffffff !important;
    box-shadow: 0 2px 8px rgba(46, 125, 50, 0.35) !important;
  }

  // Active states (strong colors) - EXPENSE
  // Ultra-specific to beat theme's .sage-dark-theme .q-btn:not(.q-btn--outline).bg-primary
  &.expense-selected .q-btn:nth-child(2).q-btn--active,
  &.expense-selected .q-btn:nth-child(2).bg-primary,
  &.expense-selected .q-btn:nth-child(2) {
    background: #c62828 !important; // strong red
    color: #ffffff !important;
    box-shadow: 0 2px 8px rgba(198, 40, 40, 0.35) !important;
  }

  // Force override any bg-primary that leaks through (nuclear option)
  .q-btn.bg-primary {
    background: transparent !important;
  }

  &.income-selected .q-btn:nth-child(1).bg-primary {
    background: #2e7d32 !important;
  }

  &.expense-selected .q-btn:nth-child(2).bg-primary {
    background: #c62828 !important;
  }
}

// Global override for this component's toggle buttons (outside scoped to increase specificity)
.transaction-form-card .type-selector.expense-selected .q-btn:nth-child(2).bg-primary {
  background: #c62828 !important;
  color: #ffffff !important;
}

.transaction-form-card .type-selector.income-selected .q-btn:nth-child(1).bg-primary {
  background: #2e7d32 !important;
  color: #ffffff !important;
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
    margin: 0 !important;
    border-radius: 0 !important;
    height: 100vh !important;
    max-height: 100vh !important;
    min-height: 100vh !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;

    .q-bar {
      border-radius: 0 !important;
      flex-shrink: 0 !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 100 !important;
      background: var(--q-primary) !important;
    }

    .q-card-section {
      flex: 1 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      -webkit-overflow-scrolling: touch !important;
      padding: 1rem !important;
      // ESPAÇO GIGANTE para garantir que campos fiquem visíveis com teclado
      padding-bottom: calc(400px + env(safe-area-inset-bottom)) !important;

      // Força scroll mesmo com teclado aberto
      overscroll-behavior: contain !important;
      touch-action: pan-y !important;

      // Garante altura mínima para scroll
      min-height: 150vh !important;
    }

    .q-card-actions {
      flex-shrink: 0 !important;
      position: sticky !important;
      bottom: 0 !important;
      background: var(--q-background, white) !important;
      border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
      padding: 1rem !important;
      padding-bottom: calc(1rem + env(safe-area-inset-bottom)) !important;
      z-index: 100 !important;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1) !important;
    }
  }

  // Dark mode fix para card-actions
  body.body--dark .transaction-form-card .q-card-actions {
    background: var(--q-dark, #1e1e1e) !important;
    border-top-color: rgba(255, 255, 255, 0.12) !important;
  }
}
</style>

<style lang="scss">
/* Global styles (non-scoped) to override theme's bg-primary with maximum specificity */

/* Override dark theme gradient for expense button */
.sage-dark-theme .transaction-form-card .type-selector.expense-selected .q-btn:nth-child(2).bg-primary,
body.body--dark .transaction-form-card .type-selector.expense-selected .q-btn:nth-child(2).bg-primary,
.transaction-form-card .type-selector.expense-selected .q-btn:nth-child(2).bg-primary {
  background: #c62828 !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(198, 40, 40, 0.35) !important;
}

/* Override dark theme gradient for income button */
.sage-dark-theme .transaction-form-card .type-selector.income-selected .q-btn:nth-child(1).bg-primary,
body.body--dark .transaction-form-card .type-selector.income-selected .q-btn:nth-child(1).bg-primary,
.transaction-form-card .type-selector.income-selected .q-btn:nth-child(1).bg-primary {
  background: #2e7d32 !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.35) !important;
}

/* Ensure inactive buttons keep pastel colors even with bg-* classes */
.transaction-form-card .type-selector .q-btn:nth-child(1):not(.q-btn--active) {
  background: #d1ffd4 !important;
  color: #2e7d32 !important;
}

.transaction-form-card .type-selector .q-btn:nth-child(2):not(.q-btn--active) {
  background: #ffc1ca !important;
  color: #c62828 !important;
}

/* Field label color adaptation for dark theme */
body.body--dark .transaction-form-card .field-label,
.sage-dark-theme .transaction-form-card .field-label {
  color: rgba(255, 255, 255, 0.72) !important;
}
</style>