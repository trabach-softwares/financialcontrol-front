<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Subscription Plans</h1>
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
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose the Perfect Plan for You
        </h2>
        <p class="mt-4 text-lg text-gray-600">
          Upgrade your financial control experience with our flexible pricing
        </p>
      </div>

      <!-- Plans Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="plan in subscriptionStore.plans"
          :key="plan.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden"
          :class="{ 'ring-2 ring-primary': subscriptionStore.currentPlan.id === plan.id }"
        >
          <!-- Plan Header -->
          <div class="px-6 py-8" :class="plan.id === 'premium' ? 'bg-gradient-to-br from-primary to-primary-dark' : 'bg-gray-50'">
            <h3 class="text-2xl font-bold" :class="plan.id === 'premium' ? 'text-white' : 'text-gray-900'">
              {{ plan.name }}
            </h3>
            <div class="mt-4 flex items-baseline" :class="plan.id === 'premium' ? 'text-white' : 'text-gray-900'">
              <span class="text-5xl font-extrabold">${{ plan.price }}</span>
              <span class="ml-1 text-xl font-medium">/month</span>
            </div>
            <div v-if="subscriptionStore.currentPlan.id === plan.id" class="mt-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Current Plan
              </span>
            </div>
          </div>

          <!-- Plan Features -->
          <div class="px-6 py-8">
            <ul class="space-y-4">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-700">{{ feature }}</span>
              </li>
            </ul>

            <div class="mt-8">
              <button
                v-if="subscriptionStore.currentPlan.id !== plan.id"
                @click="upgradePlan(plan.id)"
                :disabled="loading"
                class="w-full px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {{ loading ? 'Processing...' : plan.id === 'free' ? 'Downgrade' : 'Upgrade' }}
              </button>
              <button
                v-else
                disabled
                class="w-full px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-500 bg-gray-100 cursor-not-allowed"
              >
                Current Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="mt-8 max-w-3xl mx-auto bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="mt-8 max-w-3xl mx-auto bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {{ errorMessage }}
      </div>

      <!-- FAQ Section -->
      <div class="mt-16">
        <h3 class="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h3>
        <div class="max-w-3xl mx-auto space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-2">Can I change plans at any time?</h4>
            <p class="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
            <p class="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
            <p class="text-gray-600">Our Free plan is available forever with no credit card required. You can upgrade at any time.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSubscriptionStore } from '@/stores/subscription'
import type { PlanType } from '@/stores/subscription'

const subscriptionStore = useSubscriptionStore()

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const upgradePlan = async (planId: PlanType) => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  const result = await subscriptionStore.updateSubscription(planId)
  
  if (result.success) {
    successMessage.value = `Successfully ${planId === 'free' ? 'downgraded' : 'upgraded'} to ${planId.toUpperCase()} plan!`
  } else {
    errorMessage.value = result.error || 'Failed to update subscription'
  }

  loading.value = false
}

onMounted(async () => {
  await subscriptionStore.fetchSubscription()
})
</script>
