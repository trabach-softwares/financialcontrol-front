// ==========================================================================
// ROUTER CONFIGURATION - CONFIGURAÇÃO DE ROTAS
// ==========================================================================
// Propósito: Sistema de navegação e roteamento da aplicação
// Origem: Navegação do usuário, redirecionamentos automáticos
// Destino: Páginas e componentes da aplicação
// Efeitos: Controle de acesso, layouts, guards de autenticação

import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

/*
 * Se não estiver executando em SSR mode, você pode
 * configurar diretamente o histórico aqui e deixar o Quasar CLI
 * lidar com isso para você em seu lugar.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Deixar isso como está e fazer alterações no arquivo de rotas 
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // ==========================================================================
  // NAVIGATION GUARDS - GUARDAS DE NAVEGAÇÃO
  // ==========================================================================
  
  /**
   * Guard global de autenticação
   * Verifica se o usuário está autenticado antes de acessar rotas protegidas
   */
  Router.beforeEach(async (to, from, next) => {
    console.log('🔄 [ROUTER] Navegando para:', to.path)
    
    // Importa store dinamicamente para evitar problemas de dependência circular
    const { useAuthStore } = await import('src/stores/auth')
    const { useFeaturePermissions } = await import('src/composables/useFeaturePermissions')
    const authStore = useAuthStore()
    const { isPremiumPlan } = useFeaturePermissions()
    
    // Inicializa auth store se necessário
    if (!authStore.isInitialized) {
      console.log('🔄 [ROUTER] Inicializando store de autenticação...')
      try {
        await authStore.initialize()
      } catch (error) {
        console.error('❌ [ROUTER] Erro ao inicializar auth store:', error)
        
        // ✅ TRATAMENTO ESPECÍFICO PARA TOKEN EXPIRADO (401 ou 403)
        const status = error.response?.status
        const message = error.response?.data?.message || error.message || ''
        
        if (status === 401 || status === 403) {
          const isTokenError = status === 401 || 
                               message.toLowerCase().includes('expired') ||
                               message.toLowerCase().includes('expirado') ||
                               message.toLowerCase().includes('invalid token') ||
                               message.toLowerCase().includes('token inválido')
          
          if (isTokenError) {
            console.log('🔴 [ROUTER] Token expirado (status ' + status + ') - redirecionando para login')
            next({
              path: '/login',
              query: { expired: 'true', redirect: to.fullPath }
            })
            return
          }
        }
      }
    }
    
    // Verifica se a rota requer autenticação
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthenticated = authStore.isAuthenticated
    
    console.log('🔐 [ROUTER] Autenticado:', isAuthenticated, '| Requer auth:', requiresAuth)
    
    // Redireciona para login se necessário
    if (requiresAuth && !isAuthenticated) {
      console.log('🔴 [ROUTER] Acesso negado - redirecionando para login')
      next({
        path: '/login',
        query: { redirect: to.fullPath } // Salva página de destino
      })
      return
    }
    
    // Redireciona usuário autenticado que tenta acessar login
    if (to.path === '/login' && isAuthenticated) {
      const redirectPath = to.query.redirect || '/dashboard'
      console.log('✅ [ROUTER] Usuário já autenticado - redirecionando para:', redirectPath)
      next(redirectPath)
      return
    }
    
    // Verifica permissões de admin
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      console.warn('🔒 [ROUTER] Acesso negado: Requer permissão de admin')
      next('/dashboard')
      return
    }
    
    // 🔒 VERIFICAÇÃO DE PLANO PREMIUM
    // Bloqueia acesso a features que requerem plano Premium
    const requiresPremium = to.matched.some(record => record.meta.requiresPremium)
    if (requiresPremium && !isPremiumPlan.value) {
      console.warn('🔒 [ROUTER] Acesso negado: Feature requer plano Premium')
      
      // Redireciona para erro de permissão com informação da feature
      next({
        path: '/forbidden',
        query: { 
          feature: 'bank-accounts',
          requiredPlan: 'PREMIUM',
          redirect: to.fullPath
        }
      })
      return
    }
    
    // Permite navegação
    console.log('✅ [ROUTER] Navegação permitida para:', to.path)
    next()
  })

  /**
   * Guard após navegação
   * Executa ações após a navegação ser confirmada
   */
  Router.afterEach((to, from) => {
    
    // Título da página sempre fixo
    document.title = 'Financial Control'
    
    // Analytics ou tracking (implementar se necessário)
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: gtag('config', 'GA_MEASUREMENT_ID', { page_path: to.path })
    }
  })

  return Router
})