<template>
  <q-page class="transactions-page">
    <div class="q-pa-md">
      
      <!-- ==========================================================================
      CABEÇALHO E FILTROS
      ========================================================================== -->
      <div class="page-header q-mb-lg">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-6">
            <h1 class="text-h4 q-mb-xs">
              Transações
            </h1>
            <p class="text-subtitle1 q-ma-none">
              Gerencie suas movimentações financeiras
            </p>
          </div>
          
          <div class="col-12 col-md-6 text-right">
            <q-btn
              label="Nova Transação"
              icon="add"
              color="primary"
              size="md"
              no-caps
              @click="openTransactionForm()"
            />
          </div>
        </div>
      </div>

      <!-- ==========================================================================
      NAVEGAÇÃO DE PERÍODO - OPÇÃO HÍBRIDA (MonthNavigator + Filtros Avançados)
      ========================================================================== -->
      <div class="period-filter-section row q-col-gutter-md q-mb-lg">
        
        <!-- Navegador de Mês (sempre visível) -->
        <div class="col-12 col-md-4">
          <MonthNavigator 
            @change="handleMonthChange"
            :loading="isLoadingTransactions"
            storage-key="transactions-month"
          />
        </div>

        <!-- Filtros Avançados (colapsável melhorado) -->
        <div class="col-12 col-md-8">
          <q-expansion-item
            icon="filter_alt"
            label="Filtros Avançados"
            caption="Períodos personalizados"
            dense-toggle
            expand-separator
            class="advanced-filter-expansion"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" size="40px">
                  <q-icon name="filter_alt" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">
                  Filtros Avançados
                </q-item-label>
                <q-item-label caption class="text-grey-7">
                  Últimos 3/6/12 meses, personalizado...
                </q-item-label>
              </q-item-section>
            </template>

            <q-card flat bordered class="advanced-filter-card">
              <q-card-section class="q-pa-md">
                <PeriodFilter 
                  @change="handleAdvancedPeriodChange"
                  storage-key="transactions-advanced-period"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>

      <!-- Banner informativo se estiver em mês futuro -->
      <div v-if="isFutureMonth" class="row q-mb-lg">
        <div class="col-12">
          <q-banner class="future-month-banner" rounded>
            <template v-slot:avatar>
              <q-avatar color="orange" text-color="white" size="48px">
                <q-icon name="schedule" size="24px" />
              </q-avatar>
            </template>
            <div class="text-weight-medium text-h6">
              🔮 Visualizando lançamentos futuros
            </div>
            <div class="text-body2 q-mt-xs opacity-80">
              As transações marcadas como "Pendente" ainda não foram pagas ou recebidas.
            </div>
          </q-banner>
        </div>
      </div>

      <!-- ==========================================================================
      OUTROS FILTROS (Busca, Tipo, Categoria, Status)
      ========================================================================== -->
      <div class="row q-mb-lg">
        <div class="col-12">
          <q-card class="filters-card" flat bordered>
            <q-card-section>
              <div class="row q-col-gutter-md items-end">
                
                <!-- Buscar por descrição -->
                <div class="col-12 col-sm-6 col-md-4">
                  <q-input
                    v-model="filters.search"
                    label="Buscar transação"
                    outlined
                    dense
                    clearable
                    debounce="500"
                    @update:model-value="applyFilters"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>

                <!-- Filtro por tipo -->
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    v-model="filters.type"
                    label="Tipo"
                    :options="typeOptions"
                    outlined
                    dense
                    clearable
                    emit-value
                    map-options
                    @update:model-value="applyFilters"
                  />
                </div>

                <!-- Filtro por categoria -->
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    v-model="filters.category"
                    label="Categoria"
                    :options="categoryOptions"
                    outlined
                    dense
                    clearable
                    @update:model-value="applyFilters"
                  />
                </div>

                <!-- Pago -->
                <div class="col-12 col-sm-6 col-md-2">
                  <q-select
                    v-model="filters.paid"
                    label="Status"
                    :options="paidOptions"
                    outlined
                    dense
                    clearable
                    emit-value
                    map-options
                    @update:model-value="applyFilters"
                  />
                </div>

                <!-- Botão limpar filtros -->
                <div class="col-12 col-sm-6 col-md-12 col-lg-auto div-clear-filters">
                  <q-btn
                    icon="clear"
                    label="Limpar"
                    color="grey-6"
                    outline
                    dense
                    @click="clearAllFilters"
                    class="btn-clear-filters full-width"
                  >
                    <q-tooltip>Limpar filtros</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- ==========================================================================
      ESTATÍSTICAS RESUMIDAS
      ========================================================================== -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-4">
          <q-card class="stat-card" flat bordered>
            <q-card-section class="text-center">
              <div class="stat-value text-h5 text-green-7">
                {{ formatCurrency(transactionStore.stats.totalIncome) }}
              </div>
              <div class="stat-label text-caption">
                Total de Receitas
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-4">
          <q-card class="stat-card" flat bordered>
            <q-card-section class="text-center">
              <div class="stat-value text-h5 text-red-7">
                {{ formatCurrency(transactionStore.stats.totalExpense) }}
              </div>
              <div class="stat-label text-caption">
                Total de Despesas
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-4">
          <q-card class="stat-card" flat bordered>
            <q-card-section class="text-center">
              <div class="stat-value text-h5" :class="balanceColor">
                {{ formatCurrency(transactionStore.stats.balance) }}
              </div>
              <div class="stat-label text-caption">
                Saldo Atual
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- ==========================================================================
      LISTA DE TRANSAÇÕES
      ========================================================================== -->
      <q-card class="transactions-card" flat bordered>
        
        <!-- Loading State -->
        <div v-if="transactionStore.isLoading" class="text-center q-py-xl">
          <q-spinner color="primary" size="3rem" />
          <p class="text-h6 q-mt-md">
            Carregando transações...
          </p>
        </div>

        <!-- Empty State -->
        <div v-else-if="transactionStore.transactions.length === 0" class="text-center q-py-xl">
          <q-icon name="receipt_long" size="4rem" color="grey-4" />
          <h6 class="text-h6 q-mt-md">
            {{ hasActiveFilters ? 'Nenhuma transação encontrada' : 'Nenhuma transação cadastrada' }}
          </h6>
          <p class="text-caption q-mb-lg">
            {{ hasActiveFilters ? 'Tente alterar os filtros de busca' : 'Comece adicionando sua primeira transação' }}
          </p>
          <q-btn
            v-if="!hasActiveFilters"
            label="Adicionar Transação"
            color="primary"
            outline
            no-caps
            @click="openTransactionForm()"
          />
          <q-btn
            v-else
            label="Limpar Filtros"
            color="grey-6"
            outline
            no-caps
            @click="clearAllFilters"
          />
        </div>

        <!-- Lista de Transações -->
        <div v-else>
          <q-list separator>
            <q-item
              v-for="transaction in transactionStore.transactions"
              :key="transaction.id"
              class="transaction-item"
              clickable
              @click="viewTransaction(transaction)"
            >
              <!-- Avatar com ícone do tipo -->
              <q-item-section avatar>
                <q-avatar 
                  :color="transaction.type === 'income' ? 'green-1' : 'red-1'" 
                  :text-color="transaction.type === 'income' ? 'green-7' : 'red-7'"
                  size="md"
                >
                  <q-icon 
                    :name="transaction.type === 'income' ? 'trending_up' : 'trending_down'"
                    size="sm"
                  />
                </q-avatar>
              </q-item-section>

              <!-- Informações principais -->
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ transaction.description }}
                </q-item-label>
                <q-item-label caption class="row items-center q-gutter-xs">
                  <q-chip
                    :label="transaction.category"
                    size="sm"
                    color="blue-1"
                    text-color="blue-9"
                    dense
                  />
                  <q-chip
                    :label="transaction.type === 'income' ? (transaction.paid ? 'Recebido' : 'A receber') : (transaction.paid ? 'Pago' : 'Em aberto')"
                    size="sm"
                    :color="transaction.paid ? 'teal-1' : 'grey-2'"
                    :text-color="transaction.paid ? 'teal-8' : 'grey-8'"
                    dense
                  />
                  <span class="">
                    • {{ formatBRDateSafe(transaction.date) }}
                  </span>
                  <span v-if="transaction.paid && transaction.paid_at" class="">
                    • {{ transaction.type === 'income' ? 'Recebido em' : 'Pago em' }} {{ formatBRDate(transaction.paid_at) }}
                  </span>
                </q-item-label>
              </q-item-section>

              <!-- Valor -->
              <q-item-section side>
                <div class="text-right">
                  <div 
                    class="text-h6 text-weight-bold"
                    :class="transaction.type === 'income' ? 'text-green-7' : 'text-red-7'"
                  >
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                  </div>
                  <div class="text-caption">
                    {{ getTypeLabel(transaction.type) }}
                  </div>
                  <div class="q-mt-xs">
                    <q-toggle
                      v-model="transaction.paid"
                      color="teal-6"
                      dense
                      :label="transaction.type === 'income' ? 'Recebido' : 'Pago'"
                      @update:model-value="val => onTogglePaid(transaction, val)"
                    />
                  </div>
                </div>
              </q-item-section>

              <!-- Menu de ações -->
              <q-item-section side>
                <q-btn
                  icon="more_vert"
                  flat
                  round
                  dense
                  color="grey-6"
                  @click.stop
                >
                  <q-menu>
                    <q-list dense>
                      <q-item clickable v-close-popup @click="editTransaction(transaction)">
                        <q-item-section avatar>
                          <q-icon name="edit" color="blue-6" />
                        </q-item-section>
                        <q-item-section>Editar</q-item-section>
                      </q-item>
                      
                      <q-item clickable v-close-popup @click="duplicateTransaction(transaction)">
                        <q-item-section avatar>
                          <q-icon name="content_copy" color="green-6" />
                        </q-item-section>
                        <q-item-section>Duplicar</q-item-section>
                      </q-item>
                      
                      <q-separator />
                      
                      <q-item clickable v-close-popup @click="confirmDeleteTransaction(transaction)">
                        <q-item-section avatar>
                          <q-icon name="delete" color="red-6" />
                        </q-item-section>
                        <q-item-section class="text-red-6">Excluir</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- ==========================================================================
          PAGINAÇÃO
          ========================================================================== -->
          <q-card-section v-if="transactionStore.pagination.totalPages > 1">
            <div class="row items-center justify-between">
              <div class="col-auto">
                <p class="text-caption">
                  {{ getPaginationLabel() }}
                </p>
              </div>
              
              <div class="col-auto">
                <q-pagination
                  v-model="currentPage"
                  :max="transactionStore.pagination.totalPages"
                  :max-pages="5"
                  direction-links
                  boundary-links
                  color="primary"
                  @update:model-value="changePage"
                />
              </div>
            </div>
          </q-card-section>
        </div>
      </q-card>
    </div>

    <!-- ==========================================================================
    DIALOG DE TRANSAÇÃO (CRIAR/EDITAR)
    ========================================================================== -->
    <q-dialog 
      v-model="showTransactionDialog" 
      persistent 
      transition-show="slide-up" 
      transition-hide="slide-down"
    >
      <TransactionForm
        :transaction="selectedTransaction"
        :mode="dialogMode"
        @saved="handleTransactionSaved"
        @cancelled="closeTransactionDialog"
        @switch-edit="switchToEditFromView"
      />
    </q-dialog>

    <!-- ==========================================================================
    DIALOG DE CONFIRMAÇÃO DE EXCLUSÃO
    ========================================================================== -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-6" text-color="white" />
          <span class="q-ml-sm text-h6">Confirmar Exclusão</span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Tem certeza que deseja excluir esta transação?</p>
          <p class="text-weight-medium">
            {{ transactionToDelete?.description }}
          </p>
          <p class="text-caption">
            Esta ação não pode ser desfeita.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="grey-6"
            v-close-popup
          />
          <q-btn
            color="negative"
            label="Excluir"
            icon="delete"
            @click="deleteTransaction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { endOfMonth, format, isAfter, startOfMonth } from 'date-fns'
import { useQuasar } from 'quasar'
import MonthNavigator from 'src/components/MonthNavigator.vue'
import PeriodFilter from 'src/components/PeriodFilter.vue'
import TransactionForm from 'src/components/TransactionForm.vue'
import { useCurrency } from 'src/composables/useCurrency'
import { useDate } from 'src/composables/useDate'
import { useNotifications } from 'src/composables/useNotifications'
import { useTransactionStore } from 'src/stores/transactions'
import { computed, onMounted, ref, watch } from 'vue'

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================
const transactionStore = useTransactionStore()
const $q = useQuasar()
const { formatCurrency } = useCurrency()
const { formatDate, toISODate } = useDate()
const { notifySuccess, notifyError } = useNotifications()

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const showTransactionDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedTransaction = ref(null)
const transactionToDelete = ref(null)
const dialogMode = ref('create') // 'create' | 'edit' | 'view'
const currentPage = ref(1)
const currentMonth = ref(new Date()) // Mês atual sendo visualizado no MonthNavigator
const isUsingAdvancedFilter = ref(false) // Flag para indicar se está usando filtro avançado

// Filtros
const filters = ref({
  search: '',
  type: '',
  category: '',
  startDate: '',
  endDate: '',
  paid: '' // '' | true | false (emit-value)
})

// Opções para selects
const typeOptions = [
  { label: 'Receita', value: 'income' },
  { label: 'Despesa', value: 'expense' }
]

const categoryOptions = ref([])
const paidOptions = [
  { label: 'Todos', value: '' },
  { label: 'Pago', value: true },
  { label: 'Em aberto', value: false }
]

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================

/**
 * Verifica se o mês atual sendo visualizado é futuro
 */
const isFutureMonth = computed(() => {
  if (!currentMonth.value) return false
  const now = new Date()
  const currentStart = startOfMonth(currentMonth.value)
  const nowStart = startOfMonth(now)
  return isAfter(currentStart, nowStart)
})

/**
 * Verifica se há filtros ativos
 */
const hasActiveFilters = computed(() => {
  return transactionStore.hasActiveFilters
})

/**
 * Cor do saldo baseada no valor
 */
const balanceColor = computed(() => {
  const balance = transactionStore.stats.balance
  if (balance > 0) return 'text-green-7'
  if (balance < 0) return 'text-red-7'
  return 'text-grey-7'
})

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Carrega dados iniciais
 */
const loadInitialData = async () => {
  
  try {
    // Carrega categorias
    transactionStore.loadCategories()
    categoryOptions.value = transactionStore.categories
    
    // SEMPRE inicializa com o mês atual ao entrar na tela
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    
    // Define período para o mês atual
    if (!filters.value.startDate && !filters.value.endDate) {
      filters.value.startDate = format(monthStart, 'yyyy-MM-dd')
      filters.value.endDate = format(monthEnd, 'yyyy-MM-dd')
      
      // Atualiza currentMonth para sincronizar com MonthNavigator
      currentMonth.value = now
      
      // Limpa preferência anterior para garantir que sempre inicie no mês atual
      try {
        localStorage.removeItem('transactions-month')
      } catch (error) {
        console.error('Erro ao limpar localStorage:', error)
      }
    }

    // Carrega transações já com o filtro de mês aplicado
    await applyFilters()
    
    // Carrega estatísticas
    await transactionStore.fetchStats({
      startDate: filters.value.startDate,
      endDate: filters.value.endDate
    })
    
  } catch (error) {
    notifyError('Erro ao carregar transações')
  }
}

/**
 * Aplica filtros
 */
const applyFilters = async () => {
  
  try {
    await transactionStore.applyFilters({
      search: filters.value.search,
      type: filters.value.type,
      category: filters.value.category,
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
      paid: filters.value.paid
    })
    
    // Atualiza estatísticas com os filtros
    await transactionStore.fetchStats({
      startDate: filters.value.startDate,
      endDate: filters.value.endDate
    })
    
  } catch (error) {
    notifyError('Erro ao filtrar transações')
  }
}

/**
 * Limpa todos os filtros
 */
const clearAllFilters = async () => {
  
  const { start, end } = getCurrentMonthRange()
  filters.value = {
    search: '',
    type: '',
    category: '',
    startDate: start,
    endDate: end,
    paid: ''
  }
  
  await transactionStore.applyFilters({
    search: '', type: '', category: '', startDate: start, endDate: end, paid: ''
  })
  await transactionStore.fetchStats({ startDate: start, endDate: end })
}

/**
 * Handler para mudança de mês no MonthNavigator
 */
const handleMonthChange = async (range) => {
  
  // Desativa filtro avançado quando usa navegação simples
  isUsingAdvancedFilter.value = false
  
  // Atualiza o mês atual
  currentMonth.value = new Date(range.startDate)
  
  // Atualiza os filtros de data
  filters.value.startDate = range.startDate || ''
  filters.value.endDate = range.endDate || ''
  
  // Aplica os filtros com o novo período
  await applyFilters()
}

/**
 * Handler para mudança de período no filtro avançado
 */
const handleAdvancedPeriodChange = async (range) => {
  
  // Ativa flag de filtro avançado
  isUsingAdvancedFilter.value = true
  
  // Atualiza os filtros de data
  filters.value.startDate = range.startDate || ''
  filters.value.endDate = range.endDate || ''
  
  // Aplica os filtros com o novo período
  await applyFilters()
}

/**
 * Abre formulário de transação
 */
const openTransactionForm = (transaction = null) => {
  
  selectedTransaction.value = transaction
  dialogMode.value = transaction ? 'edit' : 'create'
  showTransactionDialog.value = true
}

/**
 * Visualiza transação
 */
const viewTransaction = (transaction) => {
  
  selectedTransaction.value = transaction
  dialogMode.value = 'view'
  showTransactionDialog.value = true
}

/**
 * Edita transação
 */
const editTransaction = (transaction) => {
  
  selectedTransaction.value = transaction
  dialogMode.value = 'edit'
  showTransactionDialog.value = true
}

/**
 * Duplica transação
 */
const duplicateTransaction = (transaction) => {
  
  // Cria cópia sem ID para nova transação
  const duplicated = { ...transaction }
  delete duplicated.id
  duplicated.description = `${duplicated.description} (Cópia)`
  
  selectedTransaction.value = duplicated
  dialogMode.value = 'create'
  showTransactionDialog.value = true
}

/**
 * Marca transação como paga/não paga
 */
const onTogglePaid = async (transaction, val) => {
  try {
    let paidAt = null
    if (val) {
      const decision = await new Promise((resolve) => {
        $q.dialog({
          title: transaction.type === 'income' ? 'Confirmar recebimento' : 'Confirmar pagamento',
          message: transaction.type === 'income' ? 'Deseja registrar como recebido com a data de hoje?' : 'Deseja registrar como pago com a data de hoje?',
          ok: 'Hoje',
          cancel: 'Outro dia'
        }).onOk(() => resolve({ today: true }))
          .onCancel(() => resolve({ today: false }))
          .onDismiss(() => resolve(null))
      })
      if (!decision) { transaction.paid = !val; return }
      if (decision.today) {
        // Mesmo formato usado no modal: YYYY-MM-DD
        paidAt = toISODate(new Date())
      } else {
        const res = await new Promise((resolve) => {
          $q.dialog({
            title: transaction.type === 'income' ? 'Data de recebimento' : 'Data de pagamento',
            message: 'Informe a data (DD/MM/AAAA):',
            prompt: { model: formatBRDate(new Date()), type: 'text' },
            cancel: true,
            ok: 'Registrar'
          }).onOk((v) => resolve(v))
            .onCancel(() => resolve(null))
            .onDismiss(() => resolve(null))
        })
        if (!res) { transaction.paid = !val; return }
        // Mesmo formato do modal: YYYY-MM-DD
        paidAt = toISOFromBR(res)
      }
    }
    await transactionStore.markPaid(transaction.id, !!val, paidAt)
    notifySuccess(
      val
        ? (transaction.type === 'income' ? 'Transação marcada como recebida' : 'Transação marcada como paga')
        : (transaction.type === 'income' ? 'Recebimento desmarcado' : 'Pagamento desmarcado')
    )
  } catch (e) {
    const status = e?.response?.status
    const data = e?.response?.data
    console.error('[UI] onTogglePaid failed', { status, data, id: transaction?.id, val })
    notifyError('Falha ao atualizar status de pagamento')
    transaction.paid = !val
  }
}

/**
 * Confirma exclusão de transação
 */
const confirmDeleteTransaction = (transaction) => {
  // Detecta se é parcela: series_id, campos de total ou padrão na descrição (n/total)
  const isInstallment = !!(
    transaction.series_id ||
    transaction.installment_total > 1 ||
    transaction.installmentTotal > 1 ||
    (/\(\d+\/\d+\)\s*$/.test(transaction.description || ''))
  )

  if (isInstallment) {
    $q.dialog({
      title: 'Excluir transação parcelada',
      message: 'Deseja excluir apenas esta parcela ou todas as próximas parcelas desta série?',
      options: {
        type: 'radio',
        model: 'single',
        items: [
          { label: 'Apenas esta parcela', value: 'single' },
          { label: 'Todas as próximas (a partir desta)', value: 'forward' }
        ]
      },
      cancel: true,
      ok: 'Continuar'
    }).onOk(async (choice) => {
      try {
        if (choice === 'forward') {
          if (transaction.series_id) {
            await transactionStore.deleteSeriesForward(transaction.series_id, transaction.date)
            notifySuccess('Parcelas futuras excluídas com sucesso')
          } else {
            // Sem series_id: tenta excluir futuras com base no padrão da descrição
            const base = (transaction.description || '').replace(/\s*\(\d+\/\d+\)\s*$/, '').trim()
            const totalMatch = /\((\d+)\/(\d+)\)\s*$/.exec(transaction.description || '')
            const total = totalMatch ? Number(totalMatch[2]) : null
            const expr = total
              ? new RegExp('^' + escapeRegex(base) + ' \\((?:\\d+)\/' + total + '\\)\\s*$')
              : new RegExp('^' + escapeRegex(base) + ' \\((?:\\d+)\/\\d+\\)\\s*$')
            const targets = (transactionStore.transactions || [])
              .filter(t => expr.test(t.description || '') && (t.date >= transaction.date))
              .map(t => t.id)
            for (const id of targets) {
              await transactionStore.deleteTransaction(id)
            }
            notifySuccess('Parcelas futuras excluídas com sucesso')
          }
        } else {
          await transactionStore.deleteTransaction(transaction.id)
          notifySuccess('Transação excluída com sucesso')
        }
        // Atualiza lista/estatísticas
        await transactionStore.fetchTransactions()
        await transactionStore.fetchStats()
      } catch (e) {
        notifyError('Erro ao excluir transação')
      }
    })
  } else {
    // Fluxo normal
    transactionToDelete.value = transaction
    showDeleteDialog.value = true
  }
}

function escapeRegex(s) {
  return (s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Deleta transação
 */
const deleteTransaction = async () => {
  if (!transactionToDelete.value) return
  
  try {
    await transactionStore.deleteTransaction(transactionToDelete.value.id)
    
    notifySuccess('Transação excluída com sucesso')
    showDeleteDialog.value = false
    transactionToDelete.value = null
    
    // Atualiza estatísticas
    await transactionStore.fetchStats()
    
  } catch (error) {
    notifyError('Erro ao excluir transação')
  }
}

/**
 * Fecha dialog de transação
 */
const closeTransactionDialog = () => {
  showTransactionDialog.value = false
  selectedTransaction.value = null
  dialogMode.value = 'create'
}

/**
 * Troca para modo edição dentro do modal (emitido pelo TransactionForm)
 */
const switchToEditFromView = () => {
  dialogMode.value = 'edit'
}

/**
 * Manipula transação salva
 */
const handleTransactionSaved = async () => {
  
  closeTransactionDialog()
  
  // Recarrega dados
  await transactionStore.fetchTransactions()
  await transactionStore.fetchStats()
}

/**
 * Muda página
 */
const changePage = async (page) => {
  
  currentPage.value = page
  
  await transactionStore.fetchTransactions({ page })
}

/**
 * Obter label do tipo
 */
const getTypeLabel = (type) => {
  const option = typeOptions.find(opt => opt.value === type)
  return option ? option.label : type
}

/**
 * Obter label do período de datas
 */
const getDateRangeLabel = () => {
  const { startDate, endDate } = filters.value
  
  if (startDate && endDate) {
    return `${formatDate(startDate, 'short')} - ${formatDate(endDate, 'short')}`
  } else if (startDate) {
    return `A partir de ${formatDate(startDate, 'short')}`
  } else if (endDate) {
    return `Até ${formatDate(endDate, 'short')}`
  }
  
  return ''
}

/**
 * Obter label da paginação
 */
const getPaginationLabel = () => {
  const { page, limit, total } = transactionStore.pagination
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)
  
  return `${start}-${end} de ${total} transações`
}

function toISOFromBR(s) {
  if (!s) return ''
  const parts = s.replace(/\s/g,'').split('/')
  if (parts.length !== 3) return s
  const [dd,mm,yyyy] = parts
  return `${yyyy}-${mm}-${dd}`
}

// Helpers para exibição e prompt em BR
function pad2(n) { return String(n).padStart(2,'0') }
// Formata data sem aplicar timezone quando vier como 'YYYY-MM-DD'
function formatBRDateSafe(input) {
  if (!input) return ''
  if (typeof input === 'string') {
    // 'YYYY-MM-DD' ou 'YYYY-MM-DDTHH:MM:SSZ'
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (m) {
      const [, y, mth, d] = m
      return `${d}/${mth}/${y}`
    }
  }
  const dt = (input instanceof Date) ? input : new Date(input)
  if (isNaN(dt)) return ''
  return `${pad2(dt.getDate())}/${pad2(dt.getMonth()+1)}/${dt.getFullYear()}`
}
// manter compat com usos antigos
const formatBRDate = formatBRDateSafe

// (Sem uso: mantemos somente BR <-> ISO (YYYY-MM-DD) para alinhar com o modal)

/**
 * Retorna o primeiro e último dia do mês atual em YYYY-MM-DD
 */
function getCurrentMonthRange() {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { start: toISODate(startDate), end: toISODate(endDate) }
}

// ==========================================================================
// WATCHERS
// ==========================================================================
watch(
  () => transactionStore.pagination.page,
  (newPage) => {
    currentPage.value = newPage
  }
)

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(() => {
  loadInitialData()
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// ESTILOS DA PÁGINA DE TRANSAÇÕES - MOBILE FIRST
// ==========================================================================

.transactions-page {
  /* Mobile-first: padding ULTRA reduzido */
  padding: 0.375rem; /* Muito menor */
  min-height: 100vh;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

.page-header {
  padding: 0.5rem 0.125rem; /* Padding menor */
  margin-bottom: 0.5rem;
  
  h1 {
    font-size: 1.25rem; /* Título menor */
    margin: 0;
  }
  
  p {
    font-size: 0.75rem;
    margin-top: 0.125rem;
  }
  
  /* Em mobile, botão ocupa largura total */
  .q-btn {
    width: 100%;
    min-height: var(--touch-target-ideal);
  }
}

// Cards ultra compactos
.filters-card,
.stat-card,
.transactions-card {
  border-radius: 8px; /* Border menor */
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04); /* Sombra menor */
  margin-bottom: 0.5rem; /* Margem menor entre cards */
  
  :deep(.q-card__section) {
    padding: 0.5rem; /* Padding muito reduzido */
  }
}

/* Filtros em mobile - Design colapsável */
.filters-card {
  margin-bottom: 1rem;
  
  .q-card-section {
    padding: 0.875rem;
  }
  
  /* Inputs com altura adequada para toque */
  :deep(.q-field) {
    margin-bottom: 0.5rem;
    
    .q-field__control {
      min-height: var(--touch-target-ideal);
    }
    
    input, .q-field__native {
      font-size: 0.9375rem; /* 15px - ideal para mobile */
    }
  }
}

/* Cards de Estatísticas */
.stat-card {
  transition: all 0.3s ease;
  padding: 1rem;
  
  .stat-value {
    font-size: 1.375rem;
    font-weight: 600;
    line-height: 1.2;
  }
  
  .stat-label {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    opacity: 0.7;
  }
  
  /* Remover hover em mobile */
  &:hover {
    transform: none;
  }
}

/* Lista de transações - Otimizada para mobile */
.transactions-card {
  .q-card-section {
    padding: 1rem 0.875rem;
    
    h6 {
      font-size: 1rem;
      margin: 0;
    }
    
    .q-btn {
      font-size: 0.75rem;
      padding: 0.375rem 0.75rem;
    }
  }
}

.transaction-item {
  padding: 0.875rem;
  margin: 0.375rem 0;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  min-height: var(--touch-target-ideal);
  
  /* Avatar menor em mobile */
  .q-avatar {
    width: 40px;
    height: 40px;
    
    .q-icon {
      font-size: 1.25rem;
    }
  }
  
  .q-item-label {
    font-size: 0.875rem;
    
    &.caption {
      font-size: 0.75rem;
    }
  }
  
  /* Chips menores */
  :deep(.q-chip) {
    font-size: 0.65rem;
    height: 20px;
    padding: 0 6px;
  }
  
  /* Valor em destaque */
  .q-item-section.side {
    .text-h6 {
      font-size: 1rem;
    }
    
    .text-caption {
      font-size: 0.7rem;
    }
  }
  
  /* Toggle mais fácil de tocar */
  :deep(.q-toggle) {
    min-width: var(--touch-target-min);
    
    .q-toggle__label {
      font-size: 0.75rem;
    }
  }
  
  /* Botão de ações com área de toque adequada */
  .q-btn {
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }
  
  /* Remover hover em touch devices */
  &:hover {
    background-color: rgba(25, 118, 210, 0.02);
  }
  
  /* Active state para feedback tátil */
  &:active {
    background-color: rgba(25, 118, 210, 0.05);
  }
}

/* Paginação mobile */
.q-pagination {
  :deep(.q-btn) {
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
    font-size: 0.875rem;
  }
}

/* Empty States */
.text-center {
  .q-icon {
    opacity: 0.4;
  }
  
  h6 {
    font-size: 1rem;
  }
  
  .q-btn {
    min-height: var(--touch-target-ideal);
    padding: 0.75rem 1.5rem;
  }
}

/* Botão de limpar filtros */
.div-clear-filters {
  display: flex;
  align-items: flex-end;
  
  .btn-clear-filters {
    width: 100%;
    min-height: var(--touch-target-ideal);
  }
}

// ==========================================================================
// TABLET PORTRAIT (600px - 1023px)
// ==========================================================================
@media (min-width: 600px) {
  .transactions-page {
    padding: 1rem;
  }
  
  .page-header {
    .q-btn {
      width: auto;
      min-width: 180px;
    }
  }
  
  .filters-card {
    .q-card-section {
      padding: 1.25rem;
    }
  }
  
  .stat-card {
    padding: 1.25rem;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
  }
  
  .transaction-item {
    padding: 1rem;
    
    .q-avatar {
      width: 48px;
      height: 48px;
    }
    
    .q-item-label {
      font-size: 0.9375rem;
    }
    
    .q-item-section.side {
      .text-h6 {
        font-size: 1.125rem;
      }
    }
  }
}

// ==========================================================================
// TABLET LANDSCAPE / DESKTOP (1024px+)
// ==========================================================================
@media (min-width: 1024px) {
  .transactions-page {
    padding: 1.5rem;
  }
  
  .page-header {
    padding: 1.5rem 0;
    
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  .filters-card {
    .q-card-section {
      padding: 1.5rem;
    }
    
    :deep(.q-field) {
      margin-bottom: 0;
    }
  }
  
  .stat-card {
    padding: 1.5rem;
    
    .stat-value {
      font-size: 1.5rem;
    }
  }
  
  .transaction-item {
    padding: 1.25rem;
    
    &:hover {
      transform: translateX(4px);
    }
    
    .q-avatar {
      width: 56px;
      height: 56px;
    }
    
    .q-item-label {
      font-size: 1rem;
      
      &.caption {
        font-size: 0.875rem;
      }
    }
    
    :deep(.q-chip) {
      font-size: 0.75rem;
      height: 24px;
    }
    
    .q-item-section.side {
      .text-h6 {
        font-size: 1.25rem;
      }
    }
  }
  
  .div-clear-filters {
    .btn-clear-filters {
      width: auto;
    }
  }
}

// ==========================================================================
// LANDSCAPE MODE (altura baixa)
// ==========================================================================
@media (max-height: 600px) and (orientation: landscape) {
  .page-header {
    padding: 0.5rem 0;
    margin-bottom: 0.5rem;
    
    h1 {
      font-size: 1.25rem;
    }
  }
  
  .filters-card,
  .stat-card {
    margin-bottom: 0.5rem;
  }
  
  .transaction-item {
    padding: 0.625rem;
  }
}

// ==========================================================================
// DARK MODE SUPPORT
// ==========================================================================
:global(.body--dark) {
  .filters-card,
  .stat-card,
  .transactions-card {
    background: #1e1e2e;
    border-color: rgba(255, 255, 255, 0.05);
  }
  
  .transaction-item {
    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
    
    &:active {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}

// ==========================================================================
// MOBILE OPTIMIZATIONS - LAYOUT ULTRA COMPACTO
// ==========================================================================
@media (max-width: 599px) {
  .transaction-item {
    /* Layout ultra compacto */
    padding: 0.5rem 0.5rem !important;
    margin: 0 !important;
    min-height: unset !important;
    
    /* LINHA 1: Avatar + Descrição + Menu (tudo junto) */
    display: grid !important;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto auto;
    gap: 0.375rem 0.5rem;
    align-items: start;
    
    /* Avatar (grid: linha 1, coluna 1) */
    .q-item-section.avatar {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      padding: 0 !important;
      min-width: unset !important;
      
      .q-avatar {
        width: 36px !important;
        height: 36px !important;
        
        .q-icon {
          font-size: 1rem !important;
        }
      }
    }
    
    /* Descrição + Chips (grid: linha 1-2, coluna 2) */
    .q-item-section:not(.avatar):not(.side) {
      grid-row: 1 / 3;
      grid-column: 2 / 3;
      padding: 0 !important;
      min-width: 0;
      
      .q-item-label {
        font-size: 0.875rem !important;
        line-height: 1.3;
        font-weight: 600;
        margin-bottom: 0.25rem;
        
        &.caption {
          font-size: 0.6875rem !important;
          opacity: 0.75;
          margin-top: 0.125rem;
          line-height: 1.2;
          
          .row {
            flex-wrap: wrap;
            gap: 0.25rem;
            margin: 0 !important;
            
            .q-chip {
              font-size: 0.5625rem !important; /* 9px */
              height: 16px !important;
              padding: 0 5px !important;
              margin: 0 !important;
            }
            
            span {
              font-size: 0.6875rem !important;
            }
          }
        }
      }
    }
    
    /* Valor + Tipo (grid: linha 3, coluna 1-2) */
    .q-item-section.side:first-of-type {
      grid-row: 3 / 4;
      grid-column: 1 / 3;
      padding: 0.375rem 0 0 0 !important;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      margin-left: 0 !important;
      
      > div {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
        
        /* Container do valor */
        > div:first-child {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          gap: 0.375rem;
          
          /* Valor */
          div:first-child {
            font-size: 1rem !important; /* 16px */
            font-weight: 700 !important;
            line-height: 1;
          }
          
          /* Tipo (Receita/Despesa) */
          .text-caption {
            font-size: 0.6875rem !important;
            opacity: 0.7;
            line-height: 1;
          }
        }
        
        /* Toggle compacto */
        > div:last-child {
          .q-toggle {
            margin: 0 !important;
            
            :deep(.q-toggle__label) {
              font-size: 0.6875rem !important;
              padding-left: 0.25rem;
            }
            
            :deep(.q-toggle__inner) {
              font-size: 0.75rem;
              width: 32px;
              min-width: 32px;
            }
          }
        }
      }
    }
    
    /* Menu (grid: linha 1, coluna 3) */
    .q-item-section.side:last-of-type {
      grid-row: 1 / 2;
      grid-column: 3 / 4;
      padding: 0 !important;
      align-self: start;
      
      .q-btn {
        min-width: 36px !important;
        min-height: 36px !important;
        padding: 0.25rem !important;
      }
    }
    
    /* Remove hover em mobile */
    &:hover {
      transform: none !important;
      box-shadow: none !important;
      background-color: transparent !important;
    }
    
    &:active {
      background-color: rgba(25, 118, 210, 0.04) !important;
    }
  }
  
  /* Card e lista ultra compactos */
  .transactions-card {
    padding: 0 !important;
    
    :deep(.q-card__section) {
      padding: 0.5rem !important;
    }
  }
  
  .q-list {
    padding: 0 !important;
    
    .q-separator {
      margin: 0 !important;
    }
  }
}

// ==========================================================================
// PERIOD FILTER SECTION - DESIGN MELHORADO
// ==========================================================================
.period-filter-section {
  animation: fadeInUp 0.6s ease;
  
  .advanced-filter-expansion {
    background: white;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      border-color: rgba(25, 118, 210, 0.3);
      box-shadow: 0 4px 16px rgba(25, 118, 210, 0.08);
    }
    
    :deep(.q-item) {
      padding: 12px 16px;
    }
    
    :deep(.q-item__label) {
      font-size: 0.95rem;
      color: #1f2937;
    }
    
    :deep(.q-item__label--caption) {
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 2px;
    }
  }
  
  .advanced-filter-card {
    background: #f9fafb;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
}

.future-month-banner {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 2px solid #fed7aa;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 12px rgba(251, 146, 60, 0.15);
  
  .text-h6 {
    color: #ea580c;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
  
  .text-body2 {
    color: #9a3412;
    line-height: 1.5;
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

// ==========================================================================
// PRINT STYLES
// ==========================================================================
@media print {
  .page-header .q-btn,
  .filters-card,
  .q-item-section.side .q-btn,
  .q-pagination {
    display: none !important;
  }
  
  .transaction-item {
    break-inside: avoid;
  }
}
</style>