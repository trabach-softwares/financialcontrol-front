<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Profile</h1>
          <router-link
            to="/dashboard"
            class="text-primary hover:text-primary-dark"
          >
            Back to Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
              {{ authStore.userEmail }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              v-model="fullName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                {{ authStore.userRole }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <button
            @click="updateProfile"
            :disabled="loading"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {{ loading ? 'Updating...' : 'Update Profile' }}
          </button>
        </div>

        <div v-if="successMessage" class="mt-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Subscription Info -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Current Plan</label>
            <div class="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
              <span class="text-gray-900 font-medium">{{ subscriptionStore.currentPlan.name }}</span>
              <span class="text-gray-600">${{ subscriptionStore.currentPlan.price }}/month</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Features</label>
            <ul class="space-y-2">
              <li v-for="feature in subscriptionStore.currentPlan.features" :key="feature" class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-700 text-sm">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <div class="mt-4">
            <router-link
              to="/plans"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark inline-block"
            >
              Upgrade Plan
            </router-link>
          </div>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              v-model="newPassword"
              type="password"
              minlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              minlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            :disabled="loadingPassword"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {{ loadingPassword ? 'Updating...' : 'Change Password' }}
          </button>
        </form>

        <div v-if="passwordSuccess" class="mt-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {{ passwordSuccess }}
        </div>
        <div v-if="passwordError" class="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {{ passwordError }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import { supabase } from '@/lib/supabase'

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
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.value }
    })

    if (error) throw error
    successMessage.value = 'Profile updated successfully!'
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
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    })

    if (error) throw error
    passwordSuccess.value = 'Password changed successfully!'
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err: unknown) {
    passwordError.value = (err instanceof Error ? err.message : String(err)) || 'Failed to change password'
  } finally {
    loadingPassword.value = false
  }
}

onMounted(async () => {
  // Load user data
  if (authStore.user?.user_metadata?.full_name) {
    fullName.value = authStore.user.user_metadata.full_name
  }

  // Load subscription
  await subscriptionStore.fetchSubscription()
})
</script>
