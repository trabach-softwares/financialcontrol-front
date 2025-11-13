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
    // 🔐 Usando localStorage para persistir mesmo após fechar o navegador
    user: JSON.parse(localStorage.getItem('auth_user') || 'null'),  // Objeto com dados completos do usuário (persistido)
    token: localStorage.getItem('auth_token') || null, // JWT token (persistido)
    
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
    },

    /**
     * Verifica se o perfil do usuário está incompleto
     * Considera incompleto quando QUALQUER campo obrigatório está vazio
     * Campos obrigatórios: nome, telefone, CPF, data de nascimento
     * @returns {boolean} True se o perfil precisa ser completado
     */
    isProfileIncomplete: (state) => {
      if (!state.user) return false
      
      const user = state.user
      
      // Verifica campos obrigatórios
      const hasName = !!user.name && user.name.trim() !== ''
      const hasPhone = !!user.phone && user.phone.trim() !== ''
      const hasCpf = !!user.cpf && user.cpf.trim() !== ''
      const hasBirthDate = !!user.birth_date && user.birth_date.trim() !== ''
      
      // Perfil incompleto = QUALQUER campo obrigatório vazio
      const isIncomplete = !hasName || !hasPhone || !hasCpf || !hasBirthDate
      
      console.log('🔍 [AUTH] Verificação de perfil incompleto:')
      console.log('  - hasName:', hasName, '(', user.name, ')')
      console.log('  - hasPhone:', hasPhone, '(', user.phone, ')')
      console.log('  - hasCpf:', hasCpf, '(', user.cpf, ')')
      console.log('  - hasBirthDate:', hasBirthDate, '(', user.birth_date, ')')
      console.log('  - isIncomplete:', isIncomplete)
      
      return isIncomplete
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
        
        // Armazena o token no localStorage (persiste após fechar navegador)
        this.token = token
        localStorage.setItem('auth_token', token)
        
        // Persistir usuário retornado pelo login no localStorage e no estado
        this.user = userData
        localStorage.setItem('auth_user', JSON.stringify(this.user))
        
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
            localStorage.setItem('auth_user', JSON.stringify(this.user))
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
        // Adiciona plano FREE como padrão ao payload de registro
        const registerPayload = {
          ...userData,
          // O backend deve aceitar plan_id ou plan_type
          // Se o backend criar automaticamente com plano FREE, não é necessário enviar
          // Mas garantimos aqui no frontend também
        }
        
        // Chama o serviço de registro
        const response = await authService.register(registerPayload)
        
        // Armazena o token no localStorage (login automático após registro)
        this.token = response.token
        localStorage.setItem('auth_token', response.token)
        
        // Carrega dados do usuário
        await this.fetchUser()
        
        // Garantir que o usuário tem um plano (fallback para FREE)
        if (!this.user.plan_id && !this.user.plan_name) {
          console.log('⚠️ [AUTH] Usuário sem plano definido, tentando atribuir plano FREE')
          try {
            await this.assignFreePlan()
          } catch (error) {
            console.warn('[AUTH] Não foi possível atribuir plano FREE automaticamente:', error)
            // Não bloqueia o registro se falhar
          }
        }
        
        
        
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
     * Atribui o plano FREE ao usuário atual
     * Usado como fallback se o backend não definir plano automaticamente
     */
    async assignFreePlan() {
      try {
        const { usePlansStore } = await import('src/stores/plans')
        const plansStore = usePlansStore()
        
        // Buscar planos se ainda não foram carregados
        if (plansStore.plans.length === 0) {
          await plansStore.fetchPlans()
        }
        
        // Encontrar o plano FREE
        const freePlan = plansStore.freePlans[0]
        
        if (freePlan) {
          // Aqui você pode fazer uma chamada à API para atualizar o plano do usuário
          // Por enquanto, apenas atualiza localmente
          this.user = {
            ...this.user,
            plan_id: freePlan.id,
            plan_name: freePlan.name,
            plan_type: freePlan.type || 'FREE'
          }
          localStorage.setItem('auth_user', JSON.stringify(this.user))
          console.log('✅ [AUTH] Plano FREE atribuído com sucesso')
        } else {
          console.warn('[AUTH] Nenhum plano FREE encontrado na base de dados')
        }
      } catch (error) {
        console.error('[AUTH] Erro ao atribuir plano FREE:', error)
        throw error
      }
    },

    /**
     * Carrega dados do usuário atual
     * Origem: Inicialização do app, refresh de dados
     * Efeitos: Atualiza dados do usuário no estado
     */
    async fetchUser() {
      if (!this.token) return
      
      try {
        console.log('🔄 [AUTH] Buscando dados atualizados do usuário do backend...')
        
        // Buscar dados do backend (sempre pegar dados frescos)
        const me = await authService.getMe()
        
        if (me) {
          // Mesclar com dados existentes se houver
          const currentUser = this.user || {}
          
          const updatedUser = {
            ...currentUser,
            ...me,
            ...(me.plan ? {
              plan_name: me.plan.name,
              plan_type: me.plan.type || me.plan.name
            } : {})
          }
          
          this.user = updatedUser
          localStorage.setItem('auth_user', JSON.stringify(this.user))
          
          console.log('✅ [AUTH] Dados do usuário atualizados:', this.user)
        } else {
          // Fallback: tentar ler do localStorage
          const raw = localStorage.getItem('auth_user')
          this.user = raw ? JSON.parse(raw) : null
          
          // Se temos plan_id mas faltam plan_name/plan_type, enriquecer
          if (this.user?.plan_id && (!this.user.plan_name || !this.user.plan_type)) {
            try {
              await this.enrichUserPlan()
            } catch (_) {
              // Ignora erro silenciosamente
            }
          }
        }
      } catch (error) {
        console.error('❌ [AUTH] Erro ao buscar dados do usuário:', error)
        
        // Fallback: tentar ler do localStorage
        const raw = localStorage.getItem('auth_user')
        if (raw) {
          this.user = JSON.parse(raw)
        } else {
          this.user = null
        }
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
          // Persistir dados atualizados no localStorage
          localStorage.setItem('auth_user', JSON.stringify(this.user))
          
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
      
      // Remove do localStorage (persistência permanente)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      
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
        // Se há token no localStorage, tenta restaurar sessão
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
        // Persistir dados atualizados no localStorage
        localStorage.setItem('auth_user', JSON.stringify(this.user))
        
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