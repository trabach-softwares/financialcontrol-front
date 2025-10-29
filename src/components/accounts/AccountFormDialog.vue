<template>
  <q-dialog
    v-model="internalVisible"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-pa-md account-form-dialog">
      <q-card-section class="row items-center q-gutter-sm">
        <q-icon :name="form.icon || 'account_balance'" :color="form.color || 'primary'" size="md" />
        <div class="text-h6">{{ dialogTitle }}</div>
        <q-space />
        <q-chip
          dense
          square
          outline
          :icon="form.icon || 'account_balance'"
          :color="form.color || 'primary'"
          text-color="white"
          :label="form.name || t('accounts.preview', 'Pré-visualização')"
        />
      </q-card-section>

      <q-separator spaced />

      <q-card-section class="q-gutter-md column">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.name"
              :label="t('accounts.fields.name', 'Nome da conta')"
              outlined
              dense
              autofocus
              :rules="[val => !!val || t('accounts.validation.required', 'Obrigatório')]"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="form.accountType"
              :options="accountTypeOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              outlined
              dense
              :label="t('accounts.fields.type', 'Tipo de conta')"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.bankName"
              :label="t('accounts.fields.bankName', 'Banco')"
              outlined
              dense
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model="form.bankCode"
              :label="t('accounts.fields.bankCode', 'Código')"
              outlined
              dense
              maxlength="10"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model="form.branch"
              :label="t('accounts.fields.branch', 'Agência')"
              outlined
              dense
              maxlength="10"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.accountNumber"
              :label="t('accounts.fields.accountNumber', 'Número da conta')"
              outlined
              dense
            />
          </div>
          <div class="col-6 col-md-3">
            <q-select
              v-model="form.currency"
              :options="currencyOptions"
              emit-value
              map-options
              outlined
              dense
              :label="t('accounts.fields.currency', 'Moeda')"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model.number="form.creditLimit"
              :label="t('accounts.fields.creditLimit', 'Limite de crédito')"
              outlined
              dense
              type="number"
              min="0"
              step="0.01"
              input-class="text-right"
              :hint="t('accounts.hints.currency', 'Valores em moeda corrente')"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-6 col-md-3">
            <q-input
              v-model.number="form.openingBalance"
              :label="t('accounts.fields.openingBalance', 'Saldo inicial')"
              outlined
              dense
              type="number"
              step="0.01"
              input-class="text-right"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model.number="form.currentBalance"
              :label="t('accounts.fields.currentBalance', 'Saldo atual')"
              outlined
              dense
              type="number"
              step="0.01"
              input-class="text-right"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-select
              v-model="form.status"
              :options="statusOptions"
              emit-value
              map-options
              outlined
              dense
              :label="t('accounts.fields.status', 'Status')"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-select
              v-model="form.icon"
              :options="iconOptions"
              outlined
              dense
              use-input
              hide-dropdown-icon
              input-debounce="0"
              :label="t('accounts.fields.icon', 'Ícone')"
              @filter="filterIcons"
            >
              <template #prepend>
                <q-icon :name="form.icon || 'account_balance'" />
              </template>
              <template #option="{ opt, itemProps }">
                <q-item v-bind="itemProps">
                  <q-item-section avatar>
                    <q-icon :name="opt" />
                  </q-item-section>
                  <q-item-section>{{ opt }}</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.color"
              :label="t('accounts.fields.color', 'Cor (token ou hex)')"
              outlined
              dense
            >
              <template #prepend>
                <q-avatar size="md" :style="{ backgroundColor: form.color || 'var(--q-primary)' }" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.notes"
              type="textarea"
              autogrow
              :label="t('accounts.fields.notes', 'Notas internas')"
              outlined
              dense
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          round
          icon="arrow_back"
          @click="closeDialog"
          :aria-label="t('accounts.actions.back', 'Voltar')"
        />
        <q-btn
          unelevated
          color="primary"
          :label="submitLabel"
          :loading="accountsStore.isSaving"
          :disable="!canSubmit"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAccountsStore } from 'src/stores/accounts'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'create' }, // 'create' | 'edit'
  account: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const $q = useQuasar()
const { t } = useI18n({ useScope: 'global' })
const accountsStore = useAccountsStore()

const internalVisible = ref(false)

watch(
  () => props.modelValue,
  (value) => {
    internalVisible.value = value
    if (value) {
      initializeForm()
    }
  }
)

watch(internalVisible, (value) => {
  if (!value) emit('update:modelValue', false)
})

const accountTypeOptions = [
  { label: t('accounts.types.checking', 'Conta corrente'), value: 'checking' },
  { label: t('accounts.types.savings', 'Conta poupança'), value: 'savings' },
  { label: t('accounts.types.investment', 'Investimento'), value: 'investment' },
  { label: t('accounts.types.digital', 'Conta digital'), value: 'digital' }
]

const statusOptions = [
  { label: t('accounts.status.active', 'Ativa'), value: 'active' },
  { label: t('accounts.status.archived', 'Arquivada'), value: 'archived' }
]

const currencyOptions = [
  { label: 'BRL - Real brasileiro', value: 'BRL' },
  { label: 'USD - Dólar americano', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' }
]

const allIcons = [
  'account_balance',
  'savings',
  'credit_card',
  'paid',
  'wallet',
  'payments',
  'attach_money',
  'currency_exchange',
  'business',
  'apartment'
]

const iconOptions = ref([...allIcons])

const form = reactive({
  name: '',
  bankName: '',
  bankCode: '',
  branch: '',
  accountNumber: '',
  accountType: 'checking',
  currency: 'BRL',
  openingBalance: 0,
  currentBalance: 0,
  creditLimit: 0,
  status: 'active',
  icon: 'account_balance',
  color: 'primary',
  notes: ''
})

const dialogTitle = computed(() =>
  props.mode === 'edit'
    ? t('accounts.dialog.editTitle', 'Editar conta bancária')
    : t('accounts.dialog.createTitle', 'Nova conta bancária')
)

const submitLabel = computed(() =>
  props.mode === 'edit'
    ? t('accounts.actions.save', 'Salvar alterações')
    : t('accounts.actions.create', 'Criar conta')
)

const canSubmit = computed(() => !!form.name && !!form.accountType)

function initializeForm() {
  const data = props.account || {}
  form.name = data.name || ''
  form.bankName = data.bankName || ''
  form.bankCode = data.bankCode || ''
  form.branch = data.branch || ''
  form.accountNumber = data.accountNumber || ''
  form.accountType = data.accountType || 'checking'
  form.currency = data.currency || 'BRL'
  form.openingBalance = Number(data.openingBalance ?? 0)
  form.currentBalance = Number(data.currentBalance ?? data.openingBalance ?? 0)
  form.creditLimit = Number(data.creditLimit ?? 0)
  form.status = data.status || 'active'
  form.icon = data.icon || 'account_balance'
  form.color = data.color || 'primary'
  form.notes = data.notes || ''
}

function closeDialog() {
  internalVisible.value = false
}

function filterIcons(val, update) {
  update(() => {
    const needle = (val || '').toLowerCase()
    iconOptions.value = iconOptions.value.filter((icon) => icon.toLowerCase().includes(needle))
    if (!iconOptions.value.length) {
      iconOptions.value = ['account_balance']
    }
  })
}

async function onSubmit() {
  if (!canSubmit.value) return

  try {
    if (props.mode === 'edit' && props.account?.id) {
      const updated = await accountsStore.updateAccount(props.account.id, { ...form })
      $q.notify({
        type: 'positive',
        message: t('accounts.feedback.updated', 'Conta atualizada com sucesso')
      })
      emit('saved', { mode: 'edit', account: updated })
    } else {
      const created = await accountsStore.createAccount({ ...form })
      $q.notify({
        type: 'positive',
        message: t('accounts.feedback.created', 'Conta criada com sucesso')
      })
      emit('saved', { mode: 'create', account: created })
    }
    internalVisible.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error?.message || t('accounts.feedback.error', 'Não foi possível salvar a conta')
    })
  }
}
</script>
