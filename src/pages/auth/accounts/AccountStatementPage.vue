<template>
  <q-page class="account-statement-page bg-grey-1">
    <div class="q-pa-md q-pb-none">
      <div class="row items-center q-col-gutter-sm">
        <div class="col-auto">
          <q-btn flat round icon="arrow_back" @click="goBack" :aria-label="t('common.back')" />
        </div>
        <div class="col">
          <div class="text-h5 text-weight-bold">{{ t('statements.page.title') }}</div>
          <div class="text-subtitle2 text-grey-7">{{ t('statements.page.subtitle') }}</div>
        </div>
        <div class="col-auto row q-gutter-sm">
          <q-btn
            flat
            icon="download"
            :label="t('statements.actions.exportCsv')"
            :loading="statementStore.isExporting && exportFormat === 'csv'"
            @click="exportStatement('csv')"
          />
          <q-btn
            flat
            icon="sim_card_download"
            :label="t('statements.actions.exportXlsx')"
            :loading="statementStore.isExporting && exportFormat === 'xlsx'"
            @click="exportStatement('xlsx')"
          />
          <q-btn
            color="primary"
            icon="picture_as_pdf"
            :label="t('statements.actions.exportPdf')"
            :loading="statementStore.isExporting && exportFormat === 'pdf'"
            @click="exportStatement('pdf')"
          />
        </div>
      </div>
    </div>

    <div class="q-pa-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle2 text-grey-7">{{ t('statements.account.title') }}</div>
          <div class="text-h6">{{ statementStore.account?.name || t('statements.account.unknown') }}</div>
          <div class="text-body2 text-grey-7">
            {{ statementStore.account?.bankName || t('statements.account.noBank') }}
            <span v-if="statementStore.account?.bankCode">• {{ statementStore.account.bankCode }}</span>
            <span v-if="statementStore.account?.branch">• {{ t('statements.account.branch', { branch: statementStore.account.branch }) }}</span>
            <span v-if="statementStore.account?.accountNumber">• {{ t('statements.account.number', { number: statementStore.account.accountNumber }) }}</span>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-lg">
          <SummaryBox
            icon="account_balance_wallet"
            :label="t('statements.summary.opening')"
            :value="formatCurrency(statementStore.summary.openingBalance)"
            color="primary"
          />
          <SummaryBox
            icon="trending_up"
            :label="t('statements.summary.inflows')"
            :value="formatCurrency(statementStore.summary.inflows)"
            color="positive"
          />
          <SummaryBox
            icon="trending_down"
            :label="t('statements.summary.outflows')"
            :value="formatCurrency(statementStore.summary.outflows)"
            color="negative"
          />
          <SummaryBox
            icon="account_balance"
            :label="t('statements.summary.closing')"
            :value="formatCurrency(statementStore.summary.closingBalance)"
            color="purple"
          />
          <SummaryBox
            icon="calculate"
            :label="t('statements.summary.count')"
            :value="statementStore.summary.totalTransactions"
            color="grey"
          />
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md q-pt-none">
      <q-card flat bordered>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-input
                v-model="filters.startDate"
                type="date"
                :label="t('statements.filters.startDate')"
                outlined
                dense
                @blur="applyFilters"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="filters.endDate"
                type="date"
                :label="t('statements.filters.endDate')"
                outlined
                dense
                @blur="applyFilters"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.type"
                :options="typeOptions"
                emit-value
                map-options
                outlined
                dense
                :label="t('statements.filters.type')"
                @update:model-value="applyFilters"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.category"
                :options="categoryOptions"
                outlined
                dense
                clearable
                use-input
                input-debounce="300"
                emit-value
                map-options
                :label="t('statements.filters.category')"
                @filter="filterCategories"
                @update:model-value="applyFilters"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="filters.search"
                :label="t('statements.filters.search')"
                outlined
                dense
                clearable
                debounce="500"
                @update:model-value="applyFilters"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="filters.sort"
                :options="sortOptions"
                emit-value
                map-options
                outlined
                dense
                :label="t('statements.filters.sort')"
                @update:model-value="applyFilters"
              />
            </div>
            <div class="col-auto self-end">
              <q-btn flat color="primary" icon="refresh" @click="refresh" :loading="statementStore.isLoading" />
            </div>
            <div class="col-auto self-end">
              <q-btn flat icon="clear_all" @click="clearFilters" :label="t('statements.actions.clearFilters')" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none">
          <q-table
            :rows="statementStore.transactions"
            :columns="columns"
            row-key="id"
            flat
            :loading="statementStore.isLoading"
            :pagination="pagination"
            :rows-per-page-options="[25, 50, 100]"
            :no-data-label="t('statements.empty.title')"
          >
            <template #no-data>
              <EmptyState />
            </template>

            <template #body-cell-date="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ formatDate(props.row.date) }}</div>
                <div class="text-caption text-grey-6">{{ props.row.category || t('statements.labels.noCategory') }}</div>
              </q-td>
            </template>

            <template #body-cell-description="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ props.row.description || t('statements.labels.noDescription') }}</div>
                <div class="text-caption text-grey-6">ID: {{ props.row.id }}</div>
              </q-td>
            </template>

            <template #body-cell-type="props">
              <q-td :props="props">
                <q-chip
                  dense
                  square
                  :color="props.row.type === 'income' ? 'positive' : 'negative'"
                  text-color="white"
                  :label="typeLabels[props.row.type] || props.row.type"
                />
              </q-td>
            </template>

            <template #body-cell-amount="props">
              <q-td :props="props">
                <div :class="props.row.type === 'income' ? 'text-positive' : 'text-negative'">
                  {{ formatCurrency(props.row.amount) }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <q-btn
            outline
            color="primary"
            icon="navigate_next"
            :label="t('statements.actions.loadMore')"
            :disable="!statementStore.meta.hasMore"
            :loading="statementStore.isLoading"
            @click="loadMore"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { categoriesList } from 'src/apis/categories'
import { useAccountStatementStore } from 'src/stores/accountStatement'
import { useDate } from 'src/composables/useDate'
import SummaryBox from 'src/components/summary/SummaryBox.vue'
import EmptyState from 'src/components/design-system/molecules/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const { t, n } = useI18n({ useScope: 'global' })
const $q = useQuasar()
const { formatDate } = useDate()

const statementStore = useAccountStatementStore()
const accountId = computed(() => route.params.accountId)

const filters = reactive({ ...statementStore.filters })
const pagination = ref({ rowsPerPage: 25 })
const exportFormat = ref(null)

const typeOptions = [
  { label: t('statements.filters.allTypes'), value: '' },
  { label: t('statements.filters.income'), value: 'income' },
  { label: t('statements.filters.expense'), value: 'expense' }
]

const typeLabels = {
  income: t('statements.filters.income'),
  expense: t('statements.filters.expense')
}

const sortOptions = [
  { label: t('statements.filters.sortNewest'), value: 'desc' },
  { label: t('statements.filters.sortOldest'), value: 'asc' }
]

const categoryOptions = ref([])

async function loadCategoriesOptions(search = '') {
  try {
    const response = await categoriesList()
    const items = Array.isArray(response?.data) ? response.data : response
    const mapped = (items || []).map((item) => ({
      label: item.name || item,
      value: item.name || item
    }))
    if (search) {
      const needle = search.toLowerCase()
      categoryOptions.value = mapped.filter((opt) => opt.label.toLowerCase().includes(needle))
    } else {
      categoryOptions.value = mapped
    }
  } catch (error) {
    categoryOptions.value = []
  }
}

function filterCategories(val, update) {
  update(async () => {
    await loadCategoriesOptions(val || '')
  })
}

function formatCurrency(value) {
  return n(value || 0, 'currency')
}

function goBack() {
  router.push('/accounts')
}

async function refresh() {
  try {
    await statementStore.fetchStatement(accountId.value)
  } catch (error) {
    $q.notify({ type: 'negative', message: error?.message || t('statements.feedback.loadError') })
  }
}

async function applyFilters() {
  statementStore.setFilters({ ...filters, page: 1 })
  await refresh()
}

function clearFilters() {
  Object.assign(filters, {
    startDate: '',
    endDate: '',
    type: '',
    category: '',
    search: '',
    sort: 'desc'
  })
  statementStore.resetFilters()
  refresh()
}

async function loadMore() {
  await statementStore.loadNextPage()
}

async function exportStatement(format) {
  exportFormat.value = format
  try {
    const { blob, filename, contentType } = await statementStore.exportStatement(format)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.type = contentType
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    $q.notify({ type: 'positive', message: t('statements.feedback.exported') })
  } catch (error) {
    $q.notify({ type: 'negative', message: error?.message || t('statements.feedback.exportError') })
  } finally {
    exportFormat.value = null
  }
}

watch(accountId, async (newId) => {
  if (!newId) return
  statementStore.resetFilters()
  Object.assign(filters, statementStore.filters)
  await refresh()
})

onMounted(async () => {
  await loadCategoriesOptions()
  if (!statementStore.accountId || statementStore.accountId !== accountId.value) {
    statementStore.resetFilters()
    Object.assign(filters, statementStore.filters)
  }
  await refresh()
})
</script>
