import { defineStore } from 'pinia'
import { planService } from 'src/services/planService'

export const usePlansStore = defineStore('plans', {
  state: () => ({
    plans: [],
    loading: false,
    error: null,
    selectedPlan: null
  }),

  getters: {
    availablePlans: (state) => state.plans.filter(plan => plan.is_active),
    freePlans: (state) => state.plans.filter(plan => plan.is_active && parseFloat(plan.price) === 0),
    paidPlans: (state) => state.plans.filter(plan => plan.is_active && parseFloat(plan.price) > 0),
    getPlanById: (state) => (id) => state.plans.find(plan => plan.id === id)
  },

  actions: {
    async fetchPlans() {
      this.loading = true
      this.error = null
      
      try {
        const data = await planService.getPlans()
        this.plans = data || []
      } catch (error) {
        this.error = 'Erro ao carregar planos'
        console.error('Error fetching plans:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPlanById(id) {
      this.loading = true
      this.error = null
      
      try {
        const data = await planService.getPlanById(id)
        
        // Atualiza o plano na lista se já existir
        const existingIndex = this.plans.findIndex(plan => plan.id === id)
        if (existingIndex >= 0) {
          this.plans[existingIndex] = data
        } else {
          this.plans.push(data)
        }
        
        return data
      } catch (error) {
        this.error = 'Erro ao carregar plano'
        console.error(`Error fetching plan ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedPlan(plan) {
      this.selectedPlan = plan
    },

    clearSelectedPlan() {
      this.selectedPlan = null
    },

    clearError() {
      this.error = null
    }
  }
})