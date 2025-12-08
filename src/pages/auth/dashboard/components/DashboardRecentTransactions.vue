<template>
  <q-card class="recent-transactions-card" flat bordered>
    <q-card-section class="flex items-center justify-between">
      <div>
        <h6 class="text-h6 q-ma-none">Transações Recentes</h6>
        <p class="text-caption q-ma-none">Últimas movimentações financeiras</p>
      </div>
      <q-btn label="Ver todas" color="primary" flat no-caps icon-right="arrow_forward" @click="go('/transactions')" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div v-if="dashboardStore.isLoadingRecent" class="text-center q-py-lg">
        <q-spinner color="primary" size="2rem" />
        <p class="text-caption q-mt-md">Carregando transações...</p>
      </div>

      <div v-else-if="recentTransactions.length === 0" class="text-center q-py-lg">
        <q-icon name="receipt_long" size="3rem" color="grey-4" />
        <p class="text-subtitle2 q-mt-md">Nenhuma transação encontrada</p>
        <q-btn label="Adicionar primeira transação" color="primary" outline no-caps @click="$emit('open-transaction','income')" />
      </div>

      <div v-else class="transactions-list">
        <q-list separator>
          <q-item v-for="transaction in recentTransactions" :key="transaction.id" class="transaction-item q-px-none">
            <q-item-section avatar>
              <q-avatar :color="transaction.type === 'income' ? 'green-1' : 'red-1'" :text-color="transaction.type === 'income' ? 'green-7' : 'red-7'">
                <q-icon :name="transaction.type === 'income' ? 'add' : 'remove'" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">{{ transaction.description }}</q-item-label>
              <q-item-label caption>{{ transaction.category }} • {{ formatDate(transaction.date) }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label class="text-weight-bold" :class="transaction.type === 'income' ? 'text-green-7' : 'text-red-7'">{{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useCurrency } from 'src/composables/useCurrency'
import { useDate } from 'src/composables/useDate'
import { useDashboardStore } from 'src/stores/dashboard'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dashboardStore = useDashboardStore()
const { formatCurrency } = useCurrency()
const { formatDate } = useDate()

const recentTransactions = computed(() => dashboardStore.recentTransactions)

function go(path) { router.push(path) }
</script>

<style lang="scss">
@import '../../../../css/index.scss';
</style>