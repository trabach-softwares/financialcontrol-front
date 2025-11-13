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
    
    // Importa store dinamicamente para evitar problemas de dependência circular
    const { useAuthStore } = await import('src/stores/auth')
    const authStore = useAuthStore()
    
    // Inicializa auth store se necessário
    if (!authStore.isInitialized) {
      await authStore.initialize()
    }
    
    // Verifica se a rota requer autenticação
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthenticated = authStore.isAuthenticated
    
    
    // Redireciona para login se necessário
    if (requiresAuth && !isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // Salva página de destino
      })
      return
    }
    
    // Redireciona usuário autenticado que tenta acessar login
    if (to.path === '/login' && isAuthenticated) {
      const redirectPath = to.query.redirect || '/dashboard'
      next(redirectPath)
      return
    }
    
    // Verifica permissões de admin
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      next('/dashboard')
      return
    }
    
    // Permite navegação
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