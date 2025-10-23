import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

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
      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .single()

      if (fetchError) throw fetchError
      if (data) {
        currentSubscription.value = data
      }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      // Use default free plan if not configured
      console.log('Using default free plan')
    } finally {
      loading.value = false
    }
  }

  async function updateSubscription(planId: PlanType) {
    loading.value = true
    error.value = null
    try {
      const newSubscription: UserSubscription = {
        ...currentSubscription.value,
        plan: planId,
        status: 'active',
        start_date: new Date().toISOString()
      }

      const { data, error: updateError } = await supabase
        .from('subscriptions')
        .upsert([newSubscription])
        .select()
        .single()

      if (updateError) throw updateError
      currentSubscription.value = data || newSubscription
      return { success: true }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      // Update local state if Supabase is not configured
      if ((err instanceof Error ? err.message : String(err)).includes('relation') || (err instanceof Error ? err.message : String(err)).includes('does not exist')) {
        currentSubscription.value.plan = planId
        return { success: true }
      }
      return { success: false, error: (err instanceof Error ? err.message : String(err)) }
    } finally {
      loading.value = false
    }
  }

  async function cancelSubscription() {
    loading.value = true
    error.value = null
    try {
      const { error: cancelError } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', currentSubscription.value.id)

      if (cancelError) throw cancelError
      currentSubscription.value.status = 'cancelled'
      return { success: true }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      // Update local state if Supabase is not configured
      if ((err instanceof Error ? err.message : String(err)).includes('relation') || (err instanceof Error ? err.message : String(err)).includes('does not exist')) {
        currentSubscription.value.status = 'cancelled'
        return { success: true }
      }
      return { success: false, error: (err instanceof Error ? err.message : String(err)) }
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
