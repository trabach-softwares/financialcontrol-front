<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import { apiClient } from '@/lib/api'

const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

const fullName = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const newPassword = ref('')
const confirmPassword = ref('')
const loadingPassword = ref(false)
const passwordSuccess = ref('')
const passwordError = ref('')

const updateProfile = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await apiClient.put('/users/profile', {
      name: fullName.value
    })

    if (response.success) {
      successMessage.value = 'Profile updated successfully!'
      // Atualizar dados locais
      if (authStore.user) {
        authStore.user.name = fullName.value
      }
    } else {
      throw new Error(response.message)
    }
  } catch (err: unknown) {
    errorMessage.value = (err instanceof Error ? err.message : String(err)) || 'Failed to update profile'
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  loadingPassword.value = true
  passwordSuccess.value = ''
  passwordError.value = ''

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match'
    loadingPassword.value = false
    return
  }

  try {
    const response = await apiClient.put('/users/password', {
      newPassword: newPassword.value
    })

    if (response.success) {
      passwordSuccess.value = 'Password changed successfully!'
      newPassword.value = ''
      confirmPassword.value = ''
    } else {
      throw new Error(response.message)
    }
  } catch (err: unknown) {
    passwordError.value = (err instanceof Error ? err.message : String(err)) || 'Failed to change password'
  } finally {
    loadingPassword.value = false
  }
}

onMounted(async () => {
  // Load user data
  if (authStore.user?.name) {
    fullName.value = authStore.user.name
  }

  // Load subscription
  await subscriptionStore.fetchSubscription()
})
</script>