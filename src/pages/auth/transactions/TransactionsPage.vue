<template>
  <q-page class="transactions-page">
    <div class="q-pa-md">
      
      <!-- ==========================================================================
      CABEÇALHO E FILTROS
      ========================================================================== -->
      <div class="page-header q-mb-lg">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-6">
            <h1 class="text-h4 text-grey-8 q-mb-xs">
              Transações
            </h1>
            <p class="text-subtitle1 text-grey-6 q-ma-none">
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
      BARRA DE FILTROS
      ========================================================================== -->
      <q-card class="filters-card q-mb-lg" flat bordered>
        <q-card-section>
          <div class="row q-col-gutter-md items-end">
            
            <!-- Buscar por descrição -->
            <div class="col-12 col-sm-6 col-md-3">
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
            <div class="col-12 col-sm-6 col-md-2">
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
            <div class="col-12 col-sm-6 col-md-2">
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

            <!-- Data inicial -->
            <div class="col-12 col-sm-6 col-md-2">
              <q-input
                v-model="filters.startDate"
                label="Data inicial"
                type="date"
                outlined
                dense
                clearable
                @update:model-value="applyFilters"
              />
            </div>

            <!-- Data final -->
            <div class="col-12 col-sm-6 col-md-2">
              <q-input
                v-model="filters.endDate"
                label="Data final"
                type="date"
                outlined
                dense
                clearable
                @update:model-value="applyFilters"
              />
            </div>

            <!-- Botão limpar filtros -->
            <div class="col-12 col-sm-6 col-md-1">
              <q-btn
                icon="clear"
                color="grey-6"
                outline
                dense
                @click="clearAllFilters"
                class="full-width"
              >
                <q-tooltip>Limpar filtros</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Resumo dos filtros aplicados -->
          <div v-if="hasActiveFilters" class="q-mt-md">
            <q-chip
              v-if="filters.search"
              :label="`Busca: ${filters.search}`"
              removable
              color="blue-1"
              text-color="blue-9"
              @remove="filters.search = ''; applyFilters()"
            />
            <q-chip
              v-if="filters.type"
              :label="`Tipo: ${getTypeLabel(filters.type)}`"
              removable
              color="green-1"
              text-color="green-9"
              @remove="filters.type = ''; applyFilters()"
            />
            <q-chip
              v-if="filters.category"
              :label="`Categoria: ${filters.category}`"
              removable
              color="purple-1"
              text-color="purple-9"
              @remove="filters.category = ''; applyFilters()"
            />
            <q-chip
              v-if="filters.startDate || filters.endDate"
              :label="`Período: ${getDateRangeLabel()}`"
              removable
              color="orange-1"
              text-color="orange-9"
              @remove="filters.startDate = ''; filters.endDate = ''; applyFilters()"
            />
          </div>
        </q-card-section>
      </q-card>

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
              <div class="stat-label text-caption text-grey-6">
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
              <div class="stat-label text-caption text-grey-6">
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
              <div class="stat-label text-caption text-grey-6">
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
          <p class="text-h6 text-grey-6 q-mt-md">
            Carregando transações...
          </p>
        </div>

        <!-- Empty State -->
        <div v-else-if="transactionStore.transactions.length === 0" class="text-center q-py-xl">
          <q-icon name="receipt_long" size="4rem" color="grey-4" />
          <h6 class="text-h6 text-grey-6 q-mt-md">
            {{ hasActiveFilters ? 'Nenhuma transação encontrada' : 'Nenhuma transação cadastrada' }}
          </h6>
          <p class="text-caption text-grey-6 q-mb-lg">
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
                <q-item-label class="text-grey-8 text-weight-medium">
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
                  <span class="text-grey-6">
                    • {{ formatDate(transaction.date, 'medium') }}
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
                  <div class="text-caption text-grey-6">
                    {{ getTypeLabel(transaction.type) }}
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
                <p class="text-caption text-grey-6">
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
      maximized 
      transition-show="slide-up" 
      transition-hide="slide-down"
    >
      <TransactionForm
        :transaction="selectedTransaction"
        :mode="dialogMode"
        @saved="handleTransactionSaved"
        @cancelled="closeTransactionDialog"
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
          <p class="text-weight-medium text-grey-8">
            {{ transactionToDelete?.description }}
          </p>
          <p class="text-caption text-grey-6">
            Esta ação não pode ser desfeita.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            @click="showDeleteDialog = false"
          />
          <q-btn
            label="Excluir"
            color="red-6"
            @click="deleteTransaction"
            :loading="transactionStore.isDeleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTransactionStore } from 'src/stores/transactions'
import { useCurrency } from 'src/composables/useCurrency'
import { useDate } from 'src/composables/useDate'
import { useNotifications } from 'src/composables/useNotifications'
import TransactionForm from 'src/components/TransactionForm.vue'

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================
const transactionStore = useTransactionStore()
const { formatCurrency } = useCurrency()
const { formatDate } = useDate()
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

// Filtros
const filters = ref({
  search: '',
  type: '',
  category: '',
  startDate: '',
  endDate: ''
})

// Opções para selects
const typeOptions = [
  { label: 'Receita', value: 'income' },
  { label: 'Despesa', value: 'expense' }
]

const categoryOptions = ref([])

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================

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
  console.log('📊 [TRANSACTIONS] Carregando dados iniciais')
  
  try {
    // Carrega categorias
    transactionStore.loadCategories()
    categoryOptions.value = transactionStore.categories
    
    // Carrega transações
    await transactionStore.fetchTransactions()
    
    // Carrega estatísticas
    await transactionStore.fetchStats()
    
  } catch (error) {
    console.error('❌ [TRANSACTIONS] Erro ao carregar dados:', error.message)
    notifyError('Erro ao carregar transações')
  }
}

/**
 * Aplica filtros
 */
const applyFilters = async () => {
  console.log('🔍 [TRANSACTIONS] Aplicando filtros:', filters.value)
  
  try {
    await transactionStore.applyFilters({
      search: filters.value.search,
      type: filters.value.type,
      category: filters.value.category,
      startDate: filters.value.startDate,
      endDate: filters.value.endDate
    })
    
    // Atualiza estatísticas com os filtros
    await transactionStore.fetchStats({
      startDate: filters.value.startDate,
      endDate: filters.value.endDate
    })
    
  } catch (error) {
    console.error('❌ [TRANSACTIONS] Erro ao aplicar filtros:', error.message)
    notifyError('Erro ao filtrar transações')
  }
}

/**
 * Limpa todos os filtros
 */
const clearAllFilters = async () => {
  console.log('🧹 [TRANSACTIONS] Limpando filtros')
  
  filters.value = {
    search: '',
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  }
  
  await transactionStore.clearFilters()
  await transactionStore.fetchStats()
}

/**
 * Abre formulário de transação
 */
const openTransactionForm = (transaction = null) => {
  console.log('📝 [TRANSACTIONS] Abrindo formulário:', transaction?.id || 'nova transação')
  
  selectedTransaction.value = transaction
  dialogMode.value = transaction ? 'edit' : 'create'
  showTransactionDialog.value = true
}

/**
 * Visualiza transação
 */
const viewTransaction = (transaction) => {
  console.log('👁️ [TRANSACTIONS] Visualizando transação:', transaction.id)
  
  selectedTransaction.value = transaction
  dialogMode.value = 'view'
  showTransactionDialog.value = true
}

/**
 * Edita transação
 */
const editTransaction = (transaction) => {
  console.log('✏️ [TRANSACTIONS] Editando transação:', transaction.id)
  
  selectedTransaction.value = transaction
  dialogMode.value = 'edit'
  showTransactionDialog.value = true
}

/**
 * Duplica transação
 */
const duplicateTransaction = (transaction) => {
  console.log('📋 [TRANSACTIONS] Duplicando transação:', transaction.id)
  
  // Cria cópia sem ID para nova transação
  const duplicated = { ...transaction }
  delete duplicated.id
  duplicated.description = `${duplicated.description} (Cópia)`
  
  selectedTransaction.value = duplicated
  dialogMode.value = 'create'
  showTransactionDialog.value = true
}

/**
 * Confirma exclusão de transação
 */
const confirmDeleteTransaction = (transaction) => {
  console.log('⚠️ [TRANSACTIONS] Confirmando exclusão:', transaction.id)
  
  transactionToDelete.value = transaction
  showDeleteDialog.value = true
}

/**
 * Deleta transação
 */
const deleteTransaction = async () => {
  if (!transactionToDelete.value) return
  
  console.log('🗑️ [TRANSACTIONS] Deletando transação:', transactionToDelete.value.id)
  
  try {
    await transactionStore.deleteTransaction(transactionToDelete.value.id)
    
    notifySuccess('Transação excluída com sucesso')
    showDeleteDialog.value = false
    transactionToDelete.value = null
    
    // Atualiza estatísticas
    await transactionStore.fetchStats()
    
  } catch (error) {
    console.error('❌ [TRANSACTIONS] Erro ao deletar:', error.message)
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
 * Manipula transação salva
 */
const handleTransactionSaved = async () => {
  console.log('✅ [TRANSACTIONS] Transação salva')
  
  closeTransactionDialog()
  
  // Recarrega dados
  await transactionStore.fetchTransactions()
  await transactionStore.fetchStats()
}

/**
 * Muda página
 */
const changePage = async (page) => {
  console.log('📄 [TRANSACTIONS] Mudando para página:', page)
  
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
  console.log('🚀 [TRANSACTIONS] Página de transações montada')
  loadInitialData()
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// ESTILOS DA PÁGINA DE TRANSAÇÕES
// ==========================================================================

.transactions-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  padding: 1rem 0;
}

// Cards
.filters-card,
.stat-card,
.transactions-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
}

.stat-value {
  font-weight: 600;
  line-height: 1.2;
}

// Lista de transações
.transaction-item {
  padding: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(25, 118, 210, 0.02);
    transform: translateX(4px);
  }
}

// Responsividade
@media (max-width: 768px) {
  .page-header .text-right {
    text-align: left;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
}
</style>