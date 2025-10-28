// ==========================================================================
// PINIA STORE - AUTHENTICATION (AUTH STORE)
// ==========================================================================
// Propósito: Gerenciar estado global de autenticação e usuário
// Origem: Login, registro, verificação de sessão, logout
// Efeitos: Estado reativo de auth em toda aplicação

import { defineStore } from 'pinia'
import { authService } from 'src/services/authService'

export const useAuthStore = defineStore('auth', {
  // ==========================================================================
  // ESTADO (STATE)
  // ==========================================================================
  state: () => ({
    // Dados do usuário logado
    user: JSON.parse(sessionStorage.getItem('auth_user') || 'null'),  // Objeto com dados completos do usuário (persistido na sessão)
    token: sessionStorage.getItem('auth_token') || null, // JWT token
    
    // Estados de loading
    isLoading: false,              // Loading geral de auth
    isLoggingIn: false,            // Loading específico do login
    isRegistering: false,          // Loading específico do registro
    
    // Estados de erro
    loginError: null,              // Erro do último login
    registerError: null,           // Erro do último registro
    
    // Estado de inicialização
    isInitialized: false,          // Se já verificou token inicial
  }),

  // ==========================================================================
  // GETTERS (COMPUTED)
  // ==========================================================================
  getters: {
    /**
     * Verifica se o usuário está autenticado
     * @returns {boolean} True se há token e usuário válidos
     */
    isAuthenticated: (state) => {
      return !!(state.token && state.user)
    },

    /**
     * Retorna o nome do usuário priorizando empresa > pessoa > email
     * @returns {string} Nome para exibição
     */
    userDisplayName: (state) => {
      if (!state.user) return ''
      
      // Prioridade: nome da empresa > nome da pessoa > email > 'Usuário'
      return state.user.company_name || 
             state.user.name || 
             state.user.email || 
             'Usuário'
    },

    /**
     * Verifica se o usuário é administrador
     * @returns {boolean} True se o usuário tem role admin
     */
    isAdmin: (state) => {
      return state.user?.role === 'admin'
    },

    /**
     * Retorna o plano atual do usuário
     * @returns {string} Nome do plano (FREE, BASIC, PREMIUM, etc)
     */
    userPlan: (state) => {
      // Se não há usuário, retorna FREE
      if (!state.user) return 'FREE'
      
      // Se há um plan_name no usuário, usa ele
      if (state.user.plan_name) return state.user.plan_name.toUpperCase()
      
      // Se há plan_id, podemos tentar buscar da store de plans
      // Por enquanto, vamos assumir que plan_id null = FREE
      if (!state.user.plan_id) return 'FREE'
      
      // Caso tenha plan_id mas não temos o nome, retorna um padrão
      return state.user.plan_type?.toUpperCase() || 'BASIC'
    },

    /**
     * Verifica se há algum processo de autenticação em andamento
     * @returns {boolean} True se algum loading está ativo
     */
    isProcessing: (state) => {
      return state.isLoading || state.isLoggingIn || state.isRegistering
    }
  },

  // ==========================================================================
  // ACTIONS (METHODS)
  // ==========================================================================
  actions: {
    /**
     * Realiza login do usuário
     * Origem: Página de login, formulário de login
     * Efeitos: Define token, carrega dados do usuário, redireciona
     */
    async login(credentials) {
      this.isLoggingIn = true
      this.loginError = null

      try {
        // Chama o serviço de autenticação
        const response = await authService.login(credentials)
        
        // authService já retorna a estrutura correta (data.user + data.token)
        const { token, user: userData } = response
        
        if (!token) {
          throw new Error('Token não encontrado na resposta da API')
        }
        
        if (!userData || !userData.email) {
          throw new Error('Dados do usuário não encontrados na resposta da API')
        }
        
        // Armazena o token
        this.token = token
        sessionStorage.setItem('auth_token', token)
        
        // Persistir usuário retornado pelo login na sessão e no estado
        this.user = userData
        sessionStorage.setItem('auth_user', JSON.stringify(this.user))
        
        // Buscar dados completos (inclui plano) e normalizar plan_name/plan_type
        try {
          const me = await authService.getMe()
          if (me) {
            const normalized = {
              ...this.user,
              ...me,
              ...(me.plan ? { 
                plan_name: me.plan.name,
                plan_type: me.plan.type || me.plan.name
              } : {})
            }
            this.user = normalized
            sessionStorage.setItem('auth_user', JSON.stringify(this.user))
          } else {
            await this.enrichUserPlan()
          }
        } catch (_) {
          // fallback: tenta enriquecer via plans store
          try { await this.enrichUserPlan() } catch (_) {}
        }
        
        
        // Retorna sucesso para a página de login
        return { success: true, user: this.user }
        
      } catch (error) {
        
        
        // Armazena erro para exibição
        this.loginError = error.response?.data?.message || 'Erro ao fazer login'
        
        // Limpa dados em caso de erro
        this.clearAuth()
        
        throw error
        
      } finally {
        this.isLoggingIn = false
      }
    },

    /**
     * Realiza registro de novo usuário
     * Origem: Página de registro, formulário de cadastro
     * Efeitos: Cria conta e faz login automático
     */
    async register(userData) {
      this.isRegistering = true
      this.registerError = null

      try {
        // Chama o serviço de registro
        const response = await authService.register(userData)
        
        // Armazena o token (login automático após registro)
        this.token = response.token
        sessionStorage.setItem('auth_token', response.token)
        
        // Carrega dados do usuário
        await this.fetchUser()
        
        
        
        return { success: true, user: this.user }
        
      } catch (error) {
        
        
        // Armazena erro para exibição
        this.registerError = error.response?.data?.message || 'Erro ao criar conta'
        
        throw error
        
      } finally {
        this.isRegistering = false
      }
    },

    /**
     * Carrega dados do usuário atual
     * Origem: Inicialização do app, refresh de dados
     * Efeitos: Atualiza dados do usuário no estado
     */
    async fetchUser() {
      if (!this.token) return
      // Recarrega usuário a partir da sessão (fonte única de leitura)
      try {
        const raw = sessionStorage.getItem('auth_user')
        this.user = raw ? JSON.parse(raw) : null
        // Se temos plan_id mas faltam plan_name/plan_type, sincroniza com backend
        if (this.user?.plan_id && (!this.user.plan_name || !this.user.plan_type)) {
          try {
            const me = await authService.getMe()
            if (me) {
              const merged = {
                ...this.user,
                ...me,
                ...(me.plan ? {
                  plan_name: me.plan.name,
                  plan_type: me.plan.type || me.plan.name
                } : {})
              }
              this.user = merged
              sessionStorage.setItem('auth_user', JSON.stringify(this.user))
            } else {
              await this.enrichUserPlan()
            }
          } catch (_) {
            // fallback: enriquecer via store de planos
            try { await this.enrichUserPlan() } catch (_) {}
          }
        }
      } catch (_) {
        this.user = null
      }
    },

    /**
     * Enriquece os dados do usuário com informações do plano
     * Busca detalhes do plano através do plan_id
     */
    async enrichUserPlan() {
      if (!this.user?.plan_id) {
        return
      }

      try {
        // Importa dinamicamente a store de planos para evitar dependência circular
        const { usePlansStore } = await import('src/stores/plans')
        const plansStore = usePlansStore()
        
        // Busca os planos se ainda não foram carregados
        if (plansStore.plans.length === 0) {
          await plansStore.fetchPlans()
        }
        
        // Encontra o plano do usuário
        const userPlan = plansStore.getPlanById(this.user.plan_id)
        
        if (userPlan) {
          // Adiciona informações do plano ao usuário
          this.user = {
            ...this.user,
            plan_name: userPlan.name,
            plan_type: userPlan.type || 'basic',
            plan_price: userPlan.price,
            plan_features: userPlan.features
          }
          // Persistir dados atualizados
          sessionStorage.setItem('auth_user', JSON.stringify(this.user))
          
        } else {
          
        }
        
      } catch (error) {
        
        // Não falha se não conseguir buscar o plano
      }
    },

    /**
     * Realiza logout do usuário
     * Origem: Botão de logout, expiração de token
     * Efeitos: Limpa estado e localStorage, redireciona para login
     */
    async logout() {
      try {
        // Chama o serviço de logout se há token
        if (this.token) {
          await authService.logout()
        }
      } catch (error) {
        
      } finally {
        // Sempre limpa o estado local
        this.clearAuth()
        
      }
    },

    /**
     * Limpa todos os dados de autenticação
     * Origem: Logout, erro de token, reset de sessão
     * Efeitos: Estado limpo, localStorage limpo
     */
    clearAuth() {
      this.user = null
      this.token = null
      this.loginError = null
      this.registerError = null
      
      // Remove da sessionStorage
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_user')
      
    },

    /**
     * Inicializa o store verificando token existente
     * Origem: Inicialização do app (main.js ou App.vue)
     * Efeitos: Restaura sessão se token válido
     */
    async initialize() {
      if (this.isInitialized) {
        return
      }

      this.isLoading = true

      try {
        // Se há token na sessionStorage, tenta restaurar sessão
        if (this.token) {
          await this.fetchUser()
        } else {
          
        }
        
      } catch (error) {
        
        // Se for erro de recursão infinita, não tentar novamente
        if (error.message && error.message.includes('infinite recursion')) {
          this.clearAuth()
          
          // Notificar usuário sobre problema no servidor
          if (window.Quasar && window.Quasar.Notify) {
            window.Quasar.Notify.create({
              type: 'negative',
              message: 'Problema de configuração no servidor. Você foi deslogado.',
              position: 'top',
              timeout: 8000
            })
          }
        } else {
          this.clearAuth()
        }
        
      } finally {
        this.isInitialized = true
        this.isLoading = false
        
      }
    },

    /**
     * Atualiza dados do usuário no estado
     * Origem: Página de perfil, após atualização
     * Efeitos: Estado sincronizado com dados atualizados
     */
    updateUser(userData) {
      if (this.user) {
        // Mescla dados novos com existentes
        const merged = { ...this.user, ...userData }
        // Normaliza plano quando vier como objeto `plan` do backend
        if (merged.plan && (merged.plan.name || merged.plan.type)) {
          merged.plan_name = merged.plan.name || merged.plan_name
          merged.plan_type = merged.plan.type || merged.plan_name || merged.plan_type
        }
        this.user = merged
        // Persistir dados atualizados na sessão
        sessionStorage.setItem('auth_user', JSON.stringify(this.user))
        
      }
    },

    /**
     * Limpa erros de autenticação
     * Origem: Formulários de login/registro
     * Efeitos: Erros resetados para nova tentativa
     */
    clearErrors() {
      this.loginError = null
      this.registerError = null
    }
  }
})