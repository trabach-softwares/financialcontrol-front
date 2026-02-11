<!--
  ==========================================================================
  COMPONENTE - RESUMO BÁSICO DE RELATÓRIO (PLANO GRATUITO)
  ==========================================================================
  Propósito: Exibir resumo financeiro simples com cards de métricas
-->

<template>
  <q-card flat bordered class="basic-summary-report">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="summarize" class="q-mr-sm" />
        Resumo Financeiro
      </div>

      <div class="row q-col-gutter-md">
        <!-- Receitas -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="metric-card bg-positive-gradient">
            <q-card-section class="text-white">
              <div class="row items-center">
                <div class="col">
                  <div class="text-caption text-weight-light">Receitas</div>
                  <div class="text-h5 text-weight-bold">
                    {{ formatCurrency(data.totalIncome) }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-icon name="trending_up" size="32px" style="opacity: 0.8" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Despesas -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="metric-card bg-negative-gradient">
            <q-card-section class="text-white">
              <div class="row items-center">
                <div class="col">
                  <div class="text-caption text-weight-light">Despesas</div>
                  <div class="text-h5 text-weight-bold">
                    {{ formatCurrency(data.totalExpense) }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-icon name="trending_down" size="32px" style="opacity: 0.8" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Saldo -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card 
            flat 
            :class="[
              'metric-card',
              data.balance >= 0 ? 'bg-primary-gradient' : 'bg-warning-gradient'
            ]"
          >
            <q-card-section class="text-white">
              <div class="row items-center">
                <div class="col">
                  <div class="text-caption text-weight-light">Saldo</div>
                  <div class="text-h5 text-weight-bold">
                    {{ formatCurrency(data.balance) }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-icon name="account_balance_wallet" size="32px" style="opacity: 0.8" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Transações -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="metric-card bg-info-gradient">
            <q-card-section class="text-white">
              <div class="row items-center">
                <div class="col">
                  <div class="text-caption text-weight-light">Transações</div>
                  <div class="text-h5 text-weight-bold">
                    {{ data.transactionCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-icon name="receipt_long" size="32px" style="opacity: 0.8" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useCurrency } from 'src/composables/useCurrency'

// ==========================================================================
// PROPS
// ==========================================================================
defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: 0
    })
  }
})

// ==========================================================================
// COMPOSABLES
// ==========================================================================
const { formatCurrency } = useCurrency()
</script>

<style scoped lang="scss">
.basic-summary-report {
  .metric-card {
    border-radius: 12px;
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
  }
}

.bg-positive-gradient {
  background: linear-gradient(135deg, #21BA45 0%, #2DD55B 100%);
}

.bg-negative-gradient {
  background: linear-gradient(135deg, #C10015 0%, #F04438 100%);
}

.bg-primary-gradient {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
}

.bg-warning-gradient {
  background: linear-gradient(135deg, #F57C00 0%, #FFA726 100%);
}

.bg-info-gradient {
  background: linear-gradient(135deg, #0288D1 0%, #29B6F6 100%);
}
</style>
