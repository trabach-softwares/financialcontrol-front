import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/lib/api'

export type PlanType = 'free' | 'pro' | 'premium'

export interface Plan {
  id: PlanType
  name: string
  price: number
  features: string[]
  maxTransactions: number
  maxReports: number
}

export interface UserSubscription {
  id?: string
  user_id?: string
  plan: PlanType
  status: 'active' | 'cancelled' | 'expired'
  start_date: string
  end_date?: string
}

export const useSubscriptionStore = defineStore('subscription', () => {
  // State
  const currentSubscription = ref<UserSubscription>({
    plan: 'free',
    status: 'active',
    start_date: new Date().toISOString()
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Available plans
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Up to 50 transactions per month',
        'Basic reports',
        'Mobile access',
        'Email support'
      ],
      maxTransactions: 50,
      maxReports: 3
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29.99,
      features: [
        'Unlimited transactions',
        'Advanced reports and analytics',
        'Priority email support',
        'Export to CSV/PDF',
        'Custom categories',
        'Multi-currency support'
      ],
      maxTransactions: -1,
      maxReports: -1
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 79.99,
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'API access',
        'Advanced forecasting',
        'Team collaboration (up to 5 users)',
        'Phone support'
      ],
      maxTransactions: -1,
      maxReports: -1
    }
  ]

  // Getters
  const currentPlan = computed((): Plan => {
    const found = plans.find((p) => p.id === currentSubscription.value.plan)
    return found ?? plans[0]!
  })

  const canUpgrade = computed(() => {
    return currentSubscription.value.plan !== 'premium'
  })

  const isActive = computed(() => {
    return currentSubscription.value.status === 'active'
  })

  // Actions
  async function fetchSubscription() {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/users/profile')
      if (response.success && response.data.plan_id) {
        // Mapear plan_id para o formato local
        const planMap: Record<string, PlanType> = {
          'free': 'free',
          'pro': 'pro', 
          'premium': 'premium'
        }
        
        currentSubscription.value = {
          plan: planMap[response.data.plan_id] || 'free',
          status: 'active',
          start_date: new Date().toISOString()
        }
      }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      console.log('Using default free plan')
    } finally {
      loading.value = false
    }
  }

  async function updateSubscription(planId: PlanType) {
    loading.value = true
    error.value = null
    try {
      // Buscar o plano correto da API
      const plansResponse = await apiClient.get('/plans')
      if (!plansResponse.success) {
        throw new Error('Failed to fetch plans')
      }
      
      const apiPlan = plansResponse.data.find((p: any) => p.name.toLowerCase() === planId)
      if (!apiPlan) {
        throw new Error('Plan not found')
      }

      const response = await apiClient.put('/users/plan', {
        planId: apiPlan.id
      })
      
      if (response.success) {
        currentSubscription.value = {
          ...currentSubscription.value,
          plan: planId,
          status: 'active',
          start_date: new Date().toISOString()
        }
        return { success: true }
      } else {
        throw new Error(response.message)
      }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function cancelSubscription() {
    loading.value = true
    error.value = null
    try {
      // Para cancelar, mudamos para o plano free
      const response = await updateSubscription('free')
      if (response.success) {
        currentSubscription.value.status = 'cancelled'
      }
      return response
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function getPlanById(planId: PlanType): Plan | undefined {
    return plans.find((p) => p.id === planId)
  }

  return {
    currentSubscription,
    loading,
    error,
    plans,
    currentPlan,
    canUpgrade,
    isActive,
    fetchSubscription,
    updateSubscription,
    cancelSubscription,
    getPlanById
  }
})