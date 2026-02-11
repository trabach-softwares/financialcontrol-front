<!--
  ==========================================================================
  COMPONENTE - RELATÓRIO DETALHADO POR CATEGORIA (PLANO PRO)
  ==========================================================================
  Propósito: Lista detalhada de todas as categorias com expansão de transações
-->

<template>
  <q-card flat bordered class="detailed-category-report">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="category" class="q-mr-sm" />
        Relatório Detalhado por Categoria
      </div>

      <q-list v-if="hasData" bordered separator>
        <q-expansion-item
          v-for="category in categoriesWithTransactions"
          :key="category.name"
          :icon="category.type === 'income' ? 'trending_up' : 'trending_down'"
          :label="category.name"
          :caption="`${category.count} transação(ões)`"
          expand-separator
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon 
                :name="category.type === 'income' ? 'trending_up' : 'trending_down'"
                :color="category.type === 'income' ? 'positive' : 'negative'"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">
                {{ category.name }}
              </q-item-label>
              <q-item-label caption>
                {{ category.count }} transação(ões)
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label 
                :class="[
                  'text-h6 text-weight-bold',
                  category.type === 'income' ? 'text-positive' : 'text-negative'
                ]"
              >
                {{ formatCurrency(category.total) }}
              </q-item-label>
            </q-item-section>
          </template>

          <q-card>
            <q-card-section>
              <q-table
                :rows="category.transactions"
                :columns="transactionColumns"
                row-key="id"
                flat
                dense
                :rows-per-page-options="[5, 10, 20]"
                :pagination="{ rowsPerPage: 5 }"
              >
                <template v-slot:body-cell-date="props">
                  <q-td :props="props">
                    {{ formatDate(props.row.date) }}
                  </q-td>
                </template>

                <template v-slot:body-cell-amount="props">
                  <q-td :props="props">
                    <span 
                      :class="[
                        'text-weight-medium',
                        props.row.type === 'income' ? 'text-positive' : 'text-negative'
                      ]"
                    >
                      {{ formatCurrency(Math.abs(props.row.amount)) }}
                    </span>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <!-- Empty State -->
      <div v-else class="text-center q-pa-xl text-grey-6">
        <q-icon name="folder_open" size="64px" class="q-mb-md" />
        <div class="text-subtitle1">Sem transações para exibir</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrency } from 'src/composables/useCurrency'

// ==========================================================================
// PROPS
// ==========================================================================
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

// ==========================================================================
// COMPOSABLES
// ==========================================================================
const { formatCurrency } = useCurrency()

// ==========================================================================
// COMPUTED
// ==========================================================================
const hasData = computed(() => {
  return props.data.categories?.length > 0
})

const categoriesWithTransactions = computed(() => {
  if (!props.data.categories || !props.data.transactions) return []
  
  return props.data.categories.map(category => {
    const transactions = props.data.transactions.filter(
      t => (t.category_name || 'Sem Categoria') === category.name
    )
    
    return {
      ...category,
      transactions
    }
  })
})

// ==========================================================================
// DATA
// ==========================================================================
const transactionColumns = [
  {
    name: 'date',
    label: 'Data',
    field: 'date',
    align: 'left',
    sortable: true
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
    sortable: true
  },
  {
    name: 'amount',
    label: 'Valor',
    field: 'amount',
    align: 'right',
    sortable: true
  }
]

// ==========================================================================
// METHODS
// ==========================================================================
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('pt-BR')
}
</script>

<style scoped lang="scss">
.detailed-category-report {
  :deep(.q-expansion-item__container) {
    .q-item {
      min-height: 60px;
    }
  }
}
</style>
