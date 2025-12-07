// ==========================================================================
// PINIA STORE - ADMIN (ADMINISTRATIVE STORE)
// ==========================================================================
// Propósito: Gerenciar estado administrativo do sistema
// Origem: Páginas administrativas, dashboard admin
// Efeitos: Estado reativo dos dados administrativos

import { defineStore } from 'pinia'
import { adminService } from 'src/services/adminService'

export const useAdminStore = defineStore('admin', {
  // ==========================================================================
  // ESTADO (STATE)
  // ==========================================================================
  state: () => ({
    // Gerenciamento de usuários
    users: [],                     // Lista de usuários do sistema
    currentUser: null,             // Usuário selecionado para edição
    usersPagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    },
    usersFilters: {
      search: '',                  // Busca por nome/email
      plan: '',                    // Filtro por plano
      status: ''                   // Filtro por status
    },
    
    // Gerenciamento de planos
    plans: [],                     // Lista de planos disponíveis
    currentPlan: null,             // Plano selecionado para edição
    
    // Estatísticas do sistema
    systemStats: {
      totalUsers: 0,               // Total de usuários
      activeUsers: 0,              // Usuários ativos
      totalTransactions: 0,        // Total de transações
      totalRevenue: 0,             // Receita total
      newUsersToday: 0,            // Novos usuários hoje
      newUsersWeek: 0,             // Novos usuários na semana
      newUsersMonth: 0,            // Novos usuários no mês
      lastUpdated: null            // Data da última atualização
    },
    
    // Estatísticas de uso
    usageStats: {
      dailyActiveUsers: [],        // Array com dados diários
      monthlyGrowth: [],           // Array com crescimento mensal
      planDistribution: [],        // Distribuição por planos
      lastUpdated: null
    },
    
    // Configurações globais
    systemSettings: {
      maintenanceMode: false,      // Modo de manutenção
      registrationEnabled: true,   // Registro habilitado
      maxUsersPerPlan: {},         // Limites por plano
      emailNotifications: true,    // Notificações por email
      lastUpdated: null
    },
    
    // Estados de loading
    isLoadingUsers: false,         // Loading da lista de usuários
    isLoadingPlans: false,         // Loading da lista de planos
    isLoadingStats: false,         // Loading das estatísticas
    isCreating: false,             // Loading de criação
    isUpdating: false,             // Loading de atualização
    isDeleting: false,             // Loading de exclusão
    
    // Estados de erro
    error: null,                   // Último erro ocorrido
    usersError: null,              // Erro específico de usuários
    plansError: null,              // Erro específico de planos
  }),

  // ==========================================================================
  // GETTERS (COMPUTED)
  // ==========================================================================
  getters: {
    /**
     * Retorna usuários filtrados por status
     */
    activeUsers: (state) => {
      return state.users.filter(u => u.status === 'active')
    },

    inactiveUsers: (state) => {
      return state.users.filter(u => u.status === 'inactive')
    },

    suspendedUsers: (state) => {
      return state.users.filter(u => u.status === 'suspended')
    },

    /**
     * Retorna planos ativos
     */
    activePlans: (state) => {
      return state.plans.filter(p => p.isActive)
    },

    /**
     * Verifica se há filtros de usuário ativos
     */
    hasActiveUserFilters: (state) => {
      return !!(
        state.usersFilters.search ||
        state.usersFilters.plan ||
        state.usersFilters.status
      )
    },

    /**
     * Verifica se há algum processo em andamento
     */
    isProcessing: (state) => {
      return state.isLoadingUsers || state.isLoadingPlans || 
             state.isLoadingStats || state.isCreating || 
             state.isUpdating || state.isDeleting
    },

    /**
     * Retorna resumo das estatísticas para dashboard
     */
    dashboardStats: (state) => {
      return {
        users: {
          total: state.systemStats.totalUsers,
          active: state.systemStats.activeUsers,
          newToday: state.systemStats.newUsersToday,
          newWeek: state.systemStats.newUsersWeek,
          newMonth: state.systemStats.newUsersMonth
        },
        business: {
          transactions: state.systemStats.totalTransactions,
          revenue: state.systemStats.totalRevenue
        },
        growth: state.usageStats.monthlyGrowth
      }
    }
  },

  // ==========================================================================
  // ACTIONS (METHODS)
  // ==========================================================================
  actions: {
    // ==========================================================================
    // GERENCIAMENTO DE USUÁRIOS
    // ==========================================================================

    /**
     * Carrega lista de usuários com filtros e paginação
     */
    async fetchUsers(options = {}) {      
      this.isLoadingUsers = true
      this.usersError = null
      
      try {
        const requestFilters = {
          ...this.usersFilters,
          page: options.page || this.usersPagination.page,
          limit: options.limit || this.usersPagination.limit,
          ...options.filters
        }
        
        const response = await adminService.getUsers(requestFilters)
        
        this.users = response.users || []
        this.usersPagination = {
          page: response.page || 1,
          limit: response.limit || 20,
          total: response.total || 0,
          totalPages: response.totalPages || 0
        }

      } catch (error) {
        console.error('❌ [ADMIN STORE] Erro ao carregar usuários:', error.message)
        this.usersError = error.response?.data?.message || 'Erro ao carregar usuários'
        this.users = []
      } finally {
        this.isLoadingUsers = false
      }
    },

    /**
     * Atualiza usuário
     */
    async updateUser(id, userData) {
      
      this.isUpdating = true
      this.error = null
      
      try {
        const updatedUser = await adminService.updateUser(id, userData)
        
        // Atualiza na lista local
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index] = updatedUser
        }

        return updatedUser
        
      } catch (error) {
        console.error('❌ [ADMIN STORE] Erro ao atualizar usuário:', error.message)
        this.error = error.response?.data?.message || 'Erro ao atualizar usuário'
        throw error
      } finally {
        this.isUpdating = false
      }
    },

    /**
     * Altera status do usuário
     */
    async toggleUserStatus(id, status) {
      
      this.isUpdating = true
      this.error = null
      
      try {
        const updatedUser = await adminService.toggleUserStatus(id, status)
        
        // Atualiza na lista local
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index].status = updatedUser.status
        }

        return updatedUser
        
      } catch (error) {
        console.error('❌ [ADMIN STORE] Erro ao alterar status:', error.message)
        this.error = error.response?.data?.message || 'Erro ao alterar status'
        throw error
      } finally {
        this.isUpdating = false
      }
    },

    /**
     * Deleta usuário
     */
    async deleteUser(id) {
      
      this.isDeleting = true
      this.error = null
      
      try {
        await adminService.deleteUser(id)
        
        // Remove da lista local
        this.users = this.users.filter(u => u.id !== id)

        
      } catch (error) {
        console.error('❌ [ADMIN STORE] Erro ao deletar usuário:', error.message)
        this.error = error.response?.data?.message || 'Erro ao deletar usuário'
        throw error
      } finally {
        this.isDeleting = false
      }
    },

    // ==========================================================================
    // GERENCIAMENTO DE PLANOS
    // ==========================================================================

    /**
     * Carrega lista de planos
     */
    async fetchPlans() {
      
      this.isLoadingPlans = true
      this.plansError = null
      
      try {
        const plans = await adminService.getPlans()
        this.plans = plans || []

        
      } catch (error) {
        console.error('❌ [ADMIN STORE] Erro ao carregar planos:', error.message)
        this.plansError = error.response?.data?.message || 'Erro ao carregar planos'
        this.plans = []
      } finally {
        this.isLoadingPlans = false
      }
    },

    /**
     * Cria novo plano
     */
    async createPlan(planData) {      
      this.isCreating = true
      this.error = null
      
      try {
        const newPlan = await adminService.createPlan(planData)
        
        // Adiciona à lista local
        this.plans.push(newPlan)

        return newPlan
        
      } catch (error) {
        console.error('❌ [ADMIN STORE] Erro ao criar plano:', error.message)
        this.error = error.response?.data?.message || 'Erro ao criar plano'
        throw error
      } finally {
        this.isCreating = false
      }
    },

    /**
     * Atualiza plano
     */
    async updatePlan(id, planData) {
      
      this.isUpdating = true
      this.error = null
      
      try {
        const updatedPlan = await adminService.updatePlan(id, planData)
        
        // Atualiza na lista local
        const index = this.plans.findIndex(p => p.id === id)
        if (index !== -1) {
          this.plans[index] = updatedPlan
        }

        return updatedPlan
        
      } catch (error) {
        console.error('❌ [ADMIN STORE] Erro ao atualizar plano:', error.message)
        this.error = error.response?.data?.message || 'Erro ao atualizar plano'
        throw error
      } finally {
        this.isUpdating = false
      }
    },

    /**
     * Deleta plano
     */
    async deletePlan(id) {      
      this.isDeleting = true
      this.error = null
      
      try {
        await adminService.deletePlan(id)
        
        // Remove da lista local
        this.plans = this.plans.filter(p => p.id !== id)

      } catch (error) {
        console.error('❌ [ADMIN STORE] Erro ao deletar plano:', error.message)
        this.error = error.response?.data?.message || 'Erro ao deletar plano'
        throw error
      } finally {
        this.isDeleting = false
      }
    },

    // ==========================================================================
    // ESTATÍSTICAS E RELATÓRIOS
    // ==========================================================================

    /**
     * Carrega estatísticas do sistema
     */
    async fetchSystemStats() {
      
      this.isLoadingStats = true
      
      try {
        const stats = await adminService.getSystemStats()
        
        this.systemStats = {
          ...stats,
          lastUpdated: new Date()
        }

      } catch (error) {
        console.error('❌ [ADMIN STORE] Erro ao carregar estatísticas:', error.message)
        this.error = error.response?.data?.message || 'Erro ao carregar estatísticas'
      } finally {
        this.isLoadingStats = false
      }
    },

    /**
     * Carrega estatísticas de uso
     */
    async fetchUsageStats(dateRange = {}) {
      
      try {
        const stats = await adminService.getUsageStats(dateRange)
        
        this.usageStats = {
          ...stats,
          lastUpdated: new Date()
        }

      } catch (error) {
        console.error('❌ [ADMIN STORE] Erro ao carregar estatísticas de uso:', error.message)
        this.error = error.response?.data?.message || 'Erro ao carregar estatísticas de uso'
      }
    },

    // ==========================================================================
    // UTILIDADES
    // ==========================================================================

    /**
     * Aplica filtros de usuários
     */
    async applyUserFilters(newFilters) {
      
      this.usersFilters = { ...this.usersFilters, ...newFilters }
      this.usersPagination.page = 1
      
      await this.fetchUsers()
    },

    /**
     * Limpa filtros de usuários
     */
    async clearUserFilters() {
      
      this.usersFilters = { search: '', plan: '', status: '' }
      this.usersPagination.page = 1
      
      await this.fetchUsers()
    },

    /**
     * Limpa erros
     */
    clearError() {
      this.error = null
      this.usersError = null
      this.plansError = null
    },

    /**
     * Reseta o store
     */
    reset() {
      
      this.users = []
      this.currentUser = null
      this.plans = []
      this.currentPlan = null
      this.error = null
      this.usersError = null
      this.plansError = null
    }
  }
})