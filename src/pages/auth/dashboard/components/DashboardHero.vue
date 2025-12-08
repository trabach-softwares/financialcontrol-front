<template>
  <div class="hero-header">
    <div class="hero-content">
      <div class="hero-top-row">
        <h1 class="hero-title">Olá, <span class="name-highlight">{{ userName }}</span>! 👋</h1>
        <div class="greeting-badge">
          <q-icon name="wb_sunny" size="1.2rem" class="q-mr-xs" />
          {{ greeting }}
        </div>
      </div>

      <div class="hero-bottom-row">
        <p class="hero-subtitle">{{ currentDate }} • Seu controle financeiro em tempo real</p>
      </div>

      <div class="hero-actions">
        <q-btn
          icon="add_circle_outline"
          label="Receita"
          unelevated
          no-caps
          size="md"
          class="hero-btn income-hero-btn"
          @click="$emit('open-transaction', 'income')"
        >
          <q-icon name="arrow_upward" size="1rem" class="q-ml-xs" />
        </q-btn>

        <q-btn
          icon="remove_circle_outline"
          label="Despesa"
          unelevated
          no-caps
          size="md"
          class="hero-btn expense-hero-btn"
          @click="$emit('open-transaction', 'expense')"
        >
          <q-icon name="arrow_downward" size="1rem" class="q-ml-xs" />
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
import { computed } from 'vue'

const props = defineProps([])
const emit = defineEmits(['open-transaction'])

const authStore = useAuthStore()

const userName = computed(() => authStore.userDisplayName || 'Usuário')

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Bom dia'
  if (hour >= 12 && hour < 18) return 'Boa tarde'
  return 'Boa noite'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})
</script>

<style lang="scss">
@import '../../../../css/index.scss';
</style>