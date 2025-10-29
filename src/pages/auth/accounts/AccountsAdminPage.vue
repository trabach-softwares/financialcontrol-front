<template>
  <q-page class="accounts-admin-page bg-grey-1">
    <div class="q-pa-md q-pb-none">
      <div class="row items-center q-col-gutter-sm">
        <div class="col-auto">
          <q-btn flat round icon="arrow_back" @click="goBack" aria-label="{{ t('accounts.actions.back', 'Voltar') }}" />
        </div>
        <div class="col">
          <div class="text-h5 text-weight-bold">{{ t('accounts.page.title', 'Contas bancárias') }}</div>
          <div class="text-subtitle2 text-grey-7">{{ t('accounts.page.subtitle', 'Gerencie contas, saldos e limites') }}</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="add"
            class="q-ml-sm"
            :label="t('accounts.actions.newAccount', 'Nova conta')"
            @click="openCreateDialog"
          />
        </div>
      </div>
    </div>

    <div class="q-pa-md">
      <q-card flat bordered class="summary-card">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <SummaryStat
              icon="account_balance"
              :label="t('accounts.summary.total', 'Total de contas')"
              :value="summary.totalAccounts"
              color="primary"
            />
            <SummaryStat
              icon="check_circle"
              :label="t('accounts.summary.active', 'Contas ativas')"
              :value="summary.activeAccounts"
              color="positive"
            />
            <SummaryStat
              icon="inventory_2"
              :label="t('accounts.summary.archived', 'Arquivadas')"
              :value="summary.archivedAccounts"
              color="grey"
            />
            <SummaryStat
              icon="savings"
              :label="t('accounts.summary.totalBalance', 'Saldo total')"
              :value="formatCurrency(summary.totalBalance)"
              color="teal"
            />
            <SummaryStat
              icon="credit_card"
              :label="t('accounts.summary.creditLimit', 'Limite total')"
              :value="formatCurrency(summary.totalCreditLimit)"
              color="orange"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md q-pt-none">
      <q-card flat bordered>
        <q-card-section class="q-gutter-md">
          <div class="row items-center q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="filters.search"
                :label="t('accounts.filters.search', 'Pesquisar por nome ou banco')"
                outlined
                dense
                clearable
                debounce="300"
                @update:model-value="applyFilters"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.status"
                :options="statusOptions"
                emit-value
                map-options
                outlined
                dense
                :label="t('accounts.filters.status', 'Status')"
                @update:model-value="applyFilters"
              />
            </div>
            <div class="col-auto">
              <q-btn flat color="primary" icon="refresh" @click="refresh" :loading="accountsStore.isLoading" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <div class="q-pa-md">
          <q-table
            flat
            :rows="accountsStore.filteredAccounts"
            :columns="columns"
            row-key="id"
            :loading="accountsStore.isLoading"
            :pagination="pagination"
            binary-state-sort
            no-data-label=""
            :rows-per-page-options="[10, 25, 50]"
          >
            <template #no-data>
              <div class="full-width flex flex-center column text-grey-6 q-my-xl">
                <q-icon name="account_balance" size="42px" color="grey-5" />
                <div class="text-subtitle1 q-mt-md">{{ t('accounts.empty.title', 'Nenhuma conta encontrada') }}</div>
                <div class="text-body2 text-center">{{ t('accounts.empty.description', 'Cadastre contas para acompanhar saldos e limites bancários.') }}</div>
                <q-btn
                  color="primary"
                  class="q-mt-md"
                  icon="add"
                  :label="t('accounts.actions.newAccount', 'Nova conta')"
                  @click="openCreateDialog"
                />
              </div>
            </template>

            <template #body-cell-name="props">
              <q-td :props="props">
                <div class="row items-center no-wrap q-gutter-sm">
                  <q-icon :name="props.row.icon || 'account_balance'" :color="props.row.color || 'primary'" />
                  <div>
                    <div class="text-weight-medium">{{ props.row.name }}</div>
                    <div class="text-caption text-grey-6">
                      {{ props.row.bankName || t('accounts.labels.noBank', 'Banco não informado') }}
                    </div>
                  </div>
                </div>
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  dense
                  square
                  :color="props.row.status === 'active' ? 'positive' : 'grey'
                    "
                  text-color="white"
                  :label="statusLabels[props.row.status] || props.row.status"
                />
              </q-td>
            </template>

            <template #body-cell-currentBalance="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ formatCurrency(props.row.currentBalance) }}</div>
                <div class="text-caption text-grey-6">{{ formatCurrency(props.row.creditLimit) }} {{ t('accounts.labels.creditLimit', 'Limite') }}</div>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <q-btn
                  flat
                  round
                  dense
                  icon="visibility"
                  color="primary"
                  @click="viewAccount(props.row)"
                  :aria-label="t('accounts.actions.view', 'Visualizar detalhes')"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="primary"
                  @click="openEditDialog(props.row)"
                  :aria-label="t('accounts.actions.edit', 'Editar conta')"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="inventory_2"
                  color="grey"
                  @click="archiveAccount(props.row)"
                  :disable="props.row.status === 'archived'"
                  :aria-label="t('accounts.actions.archive', 'Arquivar conta')"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  @click="confirmDelete(props.row)"
                  :aria-label="t('accounts.actions.delete', 'Excluir conta')"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </q-card>
    </div>

    <AccountFormDialog
      v-model="dialog.visible"
      :mode="dialog.mode"
      :account="dialog.account"
      @saved="onDialogSaved"
    />

    <q-dialog v-model="deleteDialog.visible" persistent>
      <q-card style="min-width: 320px">
        <q-card-section>
          <div class="text-h6">{{ t('accounts.delete.title', 'Excluir conta') }}</div>
          <div class="text-body2 text-grey-7">
            {{ t('accounts.delete.message', 'Tem certeza que deseja excluir esta conta? Esta ação não poderá ser desfeita.') }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="grey-7" :label="t('common.cancel', 'Cancelar')" @click="deleteDialog.visible = false" />
          <q-btn
            unelevated
            color="negative"
            :label="t('common.delete', 'Excluir')"
            :loading="accountsStore.isDeleting"
            @click="performDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAccountsStore } from 'src/stores/accounts'
import AccountFormDialog from 'src/components/accounts/AccountFormDialog.vue'

const router = useRouter()
const $q = useQuasar()
const { t, n } = useI18n({ useScope: 'global' })
const accountsStore = useAccountsStore()

const pagination = ref({ rowsPerPage: 10, sortBy: 'name', descending: false })

const filters = reactive({ ...accountsStore.filters })

const columns = [
  { name: 'name', label: t('accounts.table.account', 'Conta'), field: 'name', align: 'left', sortable: true },
  { name: 'type', label: t('accounts.table.type', 'Tipo'), field: 'accountType', align: 'left', sortable: true },
  { name: 'status', label: t('accounts.table.status', 'Status'), field: 'status', align: 'center', sortable: true },
  { name: 'currentBalance', label: t('accounts.table.balance', 'Saldo atual'), field: 'currentBalance', align: 'right', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const statusOptions = [
  { label: t('accounts.filters.all', 'Todas'), value: '' },
  { label: t('accounts.status.active', 'Ativas'), value: 'active' },
  { label: t('accounts.status.archived', 'Arquivadas'), value: 'archived' }
]

const statusLabels = {
  active: t('accounts.status.active', 'Ativa'),
  archived: t('accounts.status.archived', 'Arquivada')
}

const summary = computed(() => accountsStore.summary)

const dialog = reactive({
  visible: false,
  mode: 'create',
  account: null
})

const deleteDialog = reactive({
  visible: false,
  account: null
})

function formatCurrency(value) {
  return n(value || 0, 'currency')
}

function goBack() {
  router.push('/dashboard')
}

async function refresh() {
  try {
    await Promise.all([accountsStore.fetchAccounts(), accountsStore.fetchSummary()])
  } catch (error) {
    $q.notify({ type: 'negative', message: error?.message || t('accounts.feedback.loadError', 'Não foi possível carregar as contas') })
  }
}

function applyFilters() {
  accountsStore.setFilters(filters)
}

function openCreateDialog() {
  dialog.mode = 'create'
  dialog.account = null
  dialog.visible = true
}

function openEditDialog(account) {
  dialog.mode = 'edit'
  dialog.account = account
  dialog.visible = true
}

function viewAccount(account) {
  router.push(`/accounts/${account.id}/statement`)
}

function archiveAccount(account) {
  $q.dialog({
    title: t('accounts.archive.title', 'Arquivar conta'),
    message: t('accounts.archive.message', 'Confirmar arquivamento desta conta? Ela poderá ser reativada via suporte.'),
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await accountsStore.archiveAccount(account.id)
      $q.notify({ type: 'positive', message: t('accounts.feedback.archived', 'Conta arquivada com sucesso') })
    } catch (error) {
      $q.notify({ type: 'negative', message: error?.message || t('accounts.feedback.error', 'Falha ao atualizar a conta') })
    }
  })
}

function confirmDelete(account) {
  deleteDialog.account = account
  deleteDialog.visible = true
}

async function performDelete() {
  if (!deleteDialog.account) return

  try {
    await accountsStore.deleteAccount(deleteDialog.account.id)
    $q.notify({ type: 'positive', message: t('accounts.feedback.deleted', 'Conta excluída com sucesso') })
    deleteDialog.visible = false
  } catch (error) {
    $q.notify({ type: 'negative', message: error?.message || t('accounts.feedback.error', 'Falha ao excluir conta') })
  }
}

async function onDialogSaved() {
  await accountsStore.fetchAccounts().catch(() => {})
}

onMounted(async () => {
  if (!accountsStore.hasAccounts) {
    await refresh()
  } else {
    accountsStore.fetchSummary().catch(() => {})
  }
})
</script>

<style scoped>
.accounts-admin-page {
  min-height: 100vh;
}
.summary-card {
  background: white;
}
</style>
