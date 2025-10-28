<template>
  <div id="q-app">
    <router-view />
    
    <!-- Loading Overlay Global - Disponível em TODA aplicação -->
    <LoadingOverlay 
      v-model="isLoading" 
      :message="loadingMessage"
      fullscreen
      spinner-color="primary"
      spinner-size="64px"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useTransactionStore } from 'src/stores/transactions'
import { useGlobalLoading } from 'src/composables/useGlobalLoading'
import LoadingOverlay from 'src/components/LoadingOverlay.vue'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const { isLoading, loadingMessage } = useGlobalLoading()

onMounted(async () => {
  
  try {
    await authStore.initialize()
    
    if (authStore.isAuthenticated) {
      
      transactionStore.loadCategories()
    }
    
  } catch (error) {
    
  }
})
</script>
