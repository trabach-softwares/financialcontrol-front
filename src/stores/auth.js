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
    user: null,                    // Objeto com dados completos do usuário
    token: localStorage.getItem('auth_token') || null, // JWT token
    
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
      console.log('🔐 [AUTH STORE] Iniciando login para:', credentials.email)
      
      this.isLoggingIn = true
      this.loginError = null

      try {
        // Chama o serviço de autenticação
        const response = await authService.login(credentials)
        
        console.log('🔍 [AUTH STORE] Resposta do authService:', response)
        
        // authService já retorna a estrutura correta (data.user + data.token)
        const { token, user: userData } = response
        
        console.log('🔍 [AUTH STORE] Token extraído:', token)
        console.log('🔍 [AUTH STORE] User data extraído:', userData)
        
        if (!token) {
          throw new Error('Token não encontrado na resposta da API')
        }
        
        if (!userData || !userData.email) {
          throw new Error('Dados do usuário não encontrados na resposta da API')
        }
        
        // Armazena o token
        this.token = token
        localStorage.setItem('auth_token', token)
        
        // Usar dados do usuário da resposta do login
        this.user = userData
        console.log('✅ [AUTH STORE] Dados do usuário obtidos do login:', userData.email)
        
        console.log('✅ [AUTH STORE] Login realizado com sucesso')
        
        // Retorna sucesso para a página de login
        return { success: true, user: this.user }
        
      } catch (error) {
        console.error('❌ [AUTH STORE] Erro no login:', error.message)
        
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
      console.log('📝 [AUTH STORE] Iniciando registro para:', userData.email)
      
      this.isRegistering = true
      this.registerError = null

      try {
        // Chama o serviço de registro
        const response = await authService.register(userData)
        
        // Armazena o token (login automático após registro)
        this.token = response.token
        localStorage.setItem('auth_token', response.token)
        
        // Carrega dados do usuário
        await this.fetchUser()
        
        console.log('✅ [AUTH STORE] Registro e login automático realizados')
        
        return { success: true, user: this.user }
        
      } catch (error) {
        console.error('❌ [AUTH STORE] Erro no registro:', error.message)
        
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
      if (!this.token) {
        console.log('⚠️ [AUTH STORE] Sem token para buscar usuário')
        return
      }

      console.log('👤 [AUTH STORE] Carregando dados do usuário')
      
      try {
        const userData = await authService.getMe()
        
        console.log('🔍 [AUTH STORE] Resposta getMe:', userData)
        
        // authService já retorna os dados corretos do usuário
        this.user = userData
        
        console.log('✅ [AUTH STORE] Dados do usuário carregados:', {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          plan_id: userData.plan_id
        })

        // Busca detalhes do plano se o usuário tiver um plan_id
        await this.enrichUserPlan()
        
      } catch (error) {
        console.error('❌ [AUTH STORE] Erro ao carregar usuário:', error.message)
        
        // Tratamento específico para recursão infinita
        if (error.message && error.message.includes('infinite recursion')) {
          console.error('🔥 [AUTH STORE] Erro de recursão infinita no fetchUser')
          this.clearAuth()
          throw new Error('Erro de configuração no servidor - RLS com recursão infinita')
        }
        
        // Se o token é inválido, limpa a autenticação
        if (error.response?.status === 401) {
          console.log('🔄 [AUTH STORE] Token inválido, fazendo logout')
          this.logout()
        }
        
        throw error
      }
    },

    /**
     * Enriquece os dados do usuário com informações do plano
     * Busca detalhes do plano através do plan_id
     */
    async enrichUserPlan() {
      if (!this.user?.plan_id) {
        console.log('ℹ️ [AUTH STORE] Usuário sem plan_id, assumindo plano FREE')
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
          
          console.log('✅ [AUTH STORE] Plano do usuário enriquecido:', {
            plan_name: userPlan.name,
            plan_type: userPlan.type
          })
        } else {
          console.warn('⚠️ [AUTH STORE] Plano não encontrado para plan_id:', this.user.plan_id)
        }
        
      } catch (error) {
        console.error('❌ [AUTH STORE] Erro ao buscar plano do usuário:', error.message)
        // Não falha se não conseguir buscar o plano
      }
    },

    /**
     * Realiza logout do usuário
     * Origem: Botão de logout, expiração de token
     * Efeitos: Limpa estado e localStorage, redireciona para login
     */
    async logout() {
      console.log('🚪 [AUTH STORE] Realizando logout')
      
      try {
        // Chama o serviço de logout se há token
        if (this.token) {
          await authService.logout()
        }
      } catch (error) {
        console.warn('⚠️ [AUTH STORE] Erro no logout (continuando):', error.message)
      } finally {
        // Sempre limpa o estado local
        this.clearAuth()
        console.log('✅ [AUTH STORE] Logout concluído')
      }
    },

    /**
     * Limpa todos os dados de autenticação
     * Origem: Logout, erro de token, reset de sessão
     * Efeitos: Estado limpo, localStorage limpo
     */
    clearAuth() {
      console.log('🧹 [AUTH STORE] Limpando dados de autenticação')
      
      this.user = null
      this.token = null
      this.loginError = null
      this.registerError = null
      
      // Remove do localStorage
      localStorage.removeItem('auth_token')
      
      console.log('✅ [AUTH STORE] Dados limpos')
    },

    /**
     * Inicializa o store verificando token existente
     * Origem: Inicialização do app (main.js ou App.vue)
     * Efeitos: Restaura sessão se token válido
     */
    async initialize() {
      if (this.isInitialized) {
        console.log('⚠️ [AUTH STORE] Já foi inicializado')
        return
      }

      console.log('🚀 [AUTH STORE] Inicializando autenticação')
      this.isLoading = true

      try {
        // Se há token no localStorage, tenta restaurar sessão
        if (this.token) {
          console.log('🔍 [AUTH STORE] Token encontrado, verificando validade')
          await this.fetchUser()
        } else {
          console.log('ℹ️ [AUTH STORE] Nenhum token encontrado')
        }
        
      } catch (error) {
        console.warn('⚠️ [AUTH STORE] Erro na inicialização:', error.message)
        
        // Se for erro de recursão infinita, não tentar novamente
        if (error.message && error.message.includes('infinite recursion')) {
          console.error('🔥 [AUTH STORE] Erro de recursão infinita detectado - limpando auth')
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
        console.log('✅ [AUTH STORE] Inicialização concluída')
      }
    },

    /**
     * Atualiza dados do usuário no estado
     * Origem: Página de perfil, após atualização
     * Efeitos: Estado sincronizado com dados atualizados
     */
    updateUser(userData) {
      console.log('🔄 [AUTH STORE] Atualizando dados do usuário no estado')
      
      if (this.user) {
        // Mescla dados novos com existentes
        this.user = { ...this.user, ...userData }
        console.log('✅ [AUTH STORE] Dados do usuário atualizados')
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