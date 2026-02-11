<!--
  ==========================================================================
  COMPONENTE - COMPARAÇÃO DE PERÍODOS (PLANO PRO)
  ==========================================================================
  Propósito: Tabela comparativa entre meses
-->

<template>
  <q-card flat bordered class="period-comparison-report">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="compare_arrows" class="q-mr-sm" />
        Comparativo de Períodos
      </div>

      <q-table
        v-if="hasData"
        :rows="comparisonData"
        :columns="columns"
        row-key="month"
        flat
        bordered
        :rows-per-page-options="[6, 12, 24]"
        class="comparison-table"
      >
        <template v-slot:body-cell-income="props">
          <q-td :props="props">
            <span class="text-positive text-weight-medium">
              {{ formatCurrency(props.row.income) }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-expense="props">
          <q-td :props="props">
            <span class="text-negative text-weight-medium">
              {{ formatCurrency(props.row.expense) }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-balance="props">
          <q-td :props="props">
            <q-badge 
              :color="props.row.balance >= 0 ? 'positive' : 'negative'"
              :label="formatCurrency(props.row.balance)"
              class="text-bold"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-variation="props">
          <q-td :props="props">
            <div 
              v-if="props.row.variation !== null"
              class="row items-center q-gutter-xs"
            >
              <q-icon
                :name="props.row.variation >= 0 ? 'trending_up' : 'trending_down'"
                :color="props.row.variation >= 0 ? 'positive' : 'negative'"
                size="20px"
              />
              <span 
                :class="[
                  'text-weight-medium',
                  props.row.variation >= 0 ? 'text-positive' : 'text-negative'
                ]"
              >
                {{ Math.abs(props.row.variation).toFixed(1) }}%
              </span>
            </div>
            <span v-else class="text-grey-6">-</span>
          </q-td>
        </template>
      </q-table>

      <!-- Empty State -->
      <div v-else class="text-center q-pa-xl text-grey-6">
        <q-icon name="calendar_today" size="64px" class="q-mb-md" />
        <div class="text-subtitle1">Sem dados para comparar</div>
        <div class="text-caption">Adicione transações em diferentes meses</div>
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
const monthlyData = computed(() => {
  return props.data.monthlyData || []
})

const hasData = computed(() => {
  return monthlyData.value.length > 0
})

const comparisonData = computed(() => {
  return monthlyData.value.map((item, index) => {
    let variation = null
    
    // Calcula variação em relação ao mês anterior
    if (index > 0) {
      const previousBalance = monthlyData.value[index - 1].balance
      if (previousBalance !== 0) {
        variation = ((item.balance - previousBalance) / Math.abs(previousBalance)) * 100
      }
    }
    
    return {
      ...item,
      monthLabel: formatMonthLabel(item.month),
      variation
    }
  })
})

// ==========================================================================
// DATA
// ==========================================================================
const columns = [
  {
    name: 'monthLabel',
    label: 'Mês',
    field: 'monthLabel',
    align: 'left',
    sortable: true
  },
  {
    name: 'income',
    label: 'Receitas',
    field: 'income',
    align: 'right',
    sortable: true
  },
  {
    name: 'expense',
    label: 'Despesas',
    field: 'expense',
    align: 'right',
    sortable: true
  },
  {
    name: 'balance',
    label: 'Saldo',
    field: 'balance',
    align: 'center',
    sortable: true
  },
  {
    name: 'variation',
    label: 'Variação',
    field: 'variation',
    align: 'center',
    sortable: true
  }
]

// ==========================================================================
// METHODS
// ==========================================================================
const formatMonthLabel = (monthString) => {
  if (!monthString) return ''
  const [year, month] = monthString.split('-')
  const date = new Date(year, parseInt(month) - 1)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}
</script>

<style scoped lang="scss">
.period-comparison-report {
  .comparison-table {
    :deep(.q-table__top) {
      padding: 0;
    }
  }
}
</style>
