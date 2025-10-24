import { api } from 'boot/axios'
import { handleApiResponse } from 'src/utils/apiResponse'

export const planService = {
  // Buscar todos os planos disponíveis
  async getPlans() {
    try {
      const response = await api.get('/plans')
      return handleApiResponse(response)
    } catch (error) {
      console.error('Error fetching plans:', error)
      throw error
    }
  },

  // Buscar um plano específico por ID
  async getPlanById(id) {
    try {
      const response = await api.get(`/plans/${id}`)
      return handleApiResponse(response)
    } catch (error) {
      console.error(`Error fetching plan ${id}:`, error)
      throw error
    }
  }
}