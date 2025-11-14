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

    <!-- Error Dialog Global - Disponível em TODA aplicação -->
    <ErrorDialog
      v-model="errorDialogState.show"
      :type="errorDialogState.type"
      :title="errorDialogState.title"
      :subtitle="errorDialogState.subtitle"
      :message="errorDialogState.message"
      :details="errorDialogState.details"
      :action="errorDialogState.action"
      :primary-button-label="errorDialogState.primaryButtonLabel"
      :show-secondary-button="errorDialogState.showSecondaryButton"
      :secondary-button-label="errorDialogState.secondaryButtonLabel"
      :redirect-to="errorDialogState.redirectTo"
      :limit="errorDialogState.limit"
      :current="errorDialogState.current"
      @primary-action="handlePrimaryAction"
      @secondary-action="handleSecondaryAction"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useTransactionStore } from 'src/stores/transactions'
import { useGlobalLoading } from 'src/composables/useGlobalLoading'
import { useErrorDialog } from 'src/services/errorDialogService'
import LoadingOverlay from 'src/components/LoadingOverlay.vue'
import ErrorDialog from 'src/components/ErrorDialog.vue'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const { isLoading, loadingMessage } = useGlobalLoading()
const { errorDialogState } = useErrorDialog()

// Handlers para ações do dialog
const handlePrimaryAction = () => {
  if (errorDialogState.value.onPrimaryAction) {
    errorDialogState.value.onPrimaryAction()
  }
}

const handleSecondaryAction = () => {
  if (errorDialogState.value.onSecondaryAction) {
    errorDialogState.value.onSecondaryAction()
  }
}

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
