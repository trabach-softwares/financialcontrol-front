<template>
  <div class="quick-actions-modern">
    <div class="actions-header">
      <div class="chart-icon-wrapper actions"><q-icon name="bolt" size="1.3rem" /></div>
      <div>
        <h6 class="chart-title-small">Ações Rápidas</h6>
        <p class="chart-subtitle-small">Gerencie suas finanças rapidamente</p>
      </div>
    </div>

    <div class="actions-grid">
      <div class="action-card" @click="$emit('open-transaction', 'income')">
        <div class="action-icon income"><q-icon name="add_circle" size="2rem" /></div>
        <div class="action-content"><h6 class="action-title">Nova Receita</h6><p class="action-description">Registrar entrada de dinheiro</p></div>
        <q-icon name="arrow_forward" class="action-arrow" />
      </div>

      <div class="action-card" @click="$emit('open-transaction', 'expense')">
        <div class="action-icon expense"><q-icon name="remove_circle" size="2rem" /></div>
        <div class="action-content"><h6 class="action-title">Nova Despesa</h6><p class="action-description">Registrar saída de dinheiro</p></div>
        <q-icon name="arrow_forward" class="action-arrow" />
      </div>

      <div class="action-card" @click="go('/transactions')">
        <div class="action-icon transactions"><q-icon name="list_alt" size="2rem" /></div>
        <div class="action-content"><h6 class="action-title">Ver Transações</h6><p class="action-description">Histórico completo</p></div>
        <q-icon name="arrow_forward" class="action-arrow" />
      </div>

      <div class="action-card" @click="go('/reports')">
        <div class="action-icon reports"><q-icon name="assessment" size="2rem" /></div>
        <div class="action-content"><h6 class="action-title">Relatórios</h6><p class="action-description">Análises detalhadas</p></div>
        <q-icon name="arrow_forward" class="action-arrow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const emit = defineEmits(['open-transaction'])
const router = useRouter()
function go(path) { router.push(path) }
</script>
