// ==========================================================================
// ROUTES CONFIGURATION - DEFINIÇÃO DAS ROTAS
// ==========================================================================
// Propósito: Mapeamento de URLs para componentes da aplicação
// Estrutura: Layout principal + páginas específicas
// Controle: Autenticação, permissões, metadados

const routes = [
  // ==========================================================================
  // ROTA RAIZ - REDIRECIONAMENTO
  // ==========================================================================
  {
    path: '/',
    redirect: '/dashboard'
  },

  // ==========================================================================
  // PÁGINAS PÚBLICAS (SEM AUTENTICAÇÃO)
  // ==========================================================================
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/public/LoginPage.vue'),
        meta: {
          title: 'Login',
          requiresAuth: false,
          description: 'Página de autenticação e registro'
        }
      }
    ]
  },

  // ==========================================================================
  // PÁGINA DE PLANOS (ACESSO PÚBLICO)
  // ==========================================================================
  {
    path: '/plans',
    name: 'plans',
    component: () => import('pages/auth/plans/PlansPage.vue'),
    meta: {
      title: 'Planos',
      requiresAuth: false,
      icon: 'card_membership',
      description: 'Planos e assinaturas premium'
    }
  },

  // ==========================================================================
  // ÁREA PRINCIPAL DA APLICAÇÃO (REQUER AUTENTICAÇÃO)
  // ==========================================================================
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      // Dashboard Principal
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('pages/auth/dashboard/DashboardPage.vue'),
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
          icon: 'dashboard',
          description: 'Visão geral das finanças'
        }
      },

      // Gestão de Transações
      {
        path: '/transactions',
        name: 'transactions',
        component: () => import('pages/auth/transactions/TransactionsPage.vue'),
        meta: {
          title: 'Transações',
          requiresAuth: true,
          icon: 'receipt_long',
          description: 'Gerenciamento de transações financeiras'
        }
      },

      // Gestão de Contas Bancárias
      {
        path: '/accounts',
        name: 'accounts-admin',
        component: () => import('pages/auth/accounts/AccountsAdminPage.vue'),
        meta: {
          title: 'Contas bancárias',
          requiresAuth: true,
          requiresPremium: true, // 🔒 REQUER PLANO PREMIUM
          icon: 'account_balance',
          description: 'Administrar contas cadastradas e saldos'
        }
      },

      // Extrato Consolidado por Conta
      {
        path: '/accounts/:accountId/statement',
        name: 'account-statement',
        component: () => import('pages/auth/accounts/AccountStatementPage.vue'),
        meta: {
          title: 'Extrato da conta',
          requiresAuth: true,
          requiresPremium: true, // 🔒 REQUER PLANO PREMIUM
          icon: 'summarize',
          description: 'Histórico consolidado de movimentações da conta'
        }
      },

      // Conciliação Bancária
      {
        path: '/accounts/:accountId/reconciliation',
        name: 'account-reconciliation',
        component: () => import('pages/auth/accounts/BankReconciliationPage.vue'),
        meta: {
          title: 'Conciliação bancária',
          requiresAuth: true,
          requiresPremium: true, // 🔒 REQUER PLANO PREMIUM
          icon: 'compare_arrows',
          description: 'Importar extratos e conciliar lançamentos da conta'
        }
      },

      // Relatórios e Análises
      {
        path: '/reports',
        name: 'reports',
        component: () => import('pages/auth/reports/ReportsPage.vue'),
        meta: {
          title: 'Relatórios',
          requiresAuth: true,
          icon: 'assessment',
          description: 'Relatórios e análises financeiras'
        }
      },

      // Perfil do Usuário
      {
        path: '/profile',
        name: 'profile',
        component: () => import('pages/auth/profile/ProfilePage.vue'),
        meta: {
          title: 'Perfil',
          requiresAuth: true,
          icon: 'person',
          description: 'Configurações do perfil'
        }
      },

      // Planos e Assinaturas
      {
        path: '/plans',
        name: 'plans',
        component: () => import('pages/PlansPage.vue'),
        meta: {
          title: 'Planos',
          requiresAuth: false, // Permitir acesso sem login para visualizar planos
          icon: 'card_membership',
          description: 'Planos e assinaturas premium'
        }
      },

      // Checkout de Planos
      {
        path: '/checkout/:planId',
        name: 'checkout',
        component: () => import('pages/CheckoutPage.vue'),
        meta: {
          title: 'Finalizar Assinatura',
          requiresAuth: true,
          icon: 'shopping_cart',
          description: 'Finalizar assinatura de plano'
        }
      },

      // Histórico de Pagamentos
      {
        path: '/payments',
        name: 'payments-history',
        component: () => import('pages/PaymentsHistoryPage.vue'),
        meta: {
          title: 'Histórico de Pagamentos',
          requiresAuth: true,
          icon: 'payment',
          description: 'Visualizar histórico de pagamentos'
        }
      },

      // Configurações
      {
        path: '/settings',
        name: 'settings',
        component: () => import('pages/auth/settings/SettingsPage.vue'),
        meta: {
          title: 'Configurações',
          requiresAuth: true,
          icon: 'settings',
          description: 'Configurações da conta'
        }
      },

      // 🔒 Página de Feature Bloqueada (Plano Insuficiente)
      {
        path: '/forbidden',
        name: 'feature-forbidden',
        component: () => import('pages/auth/FeatureForbiddenPage.vue'),
        meta: {
          title: 'Feature Bloqueada',
          requiresAuth: true,
          description: 'Acesso a feature requer plano superior'
        }
      }
    ]
  },

  // ==========================================================================
  // ÁREA ADMINISTRATIVA (REQUER PERMISSÕES DE ADMIN)
  // ==========================================================================
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true 
    },
    children: [
      // Dashboard Admin
      {
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        component: () => import('pages/auth/admin/AdminDashboardPage.vue'),
        meta: {
          title: 'Admin Dashboard',
          requiresAuth: true,
          requiresAdmin: true,
          icon: 'admin_panel_settings',
          description: 'Painel administrativo'
        }
      },

      // Gerenciamento de Usuários
      {
        path: '/admin/users',
        name: 'admin-users',
        component: () => import('pages/auth/admin/AdminUsersPage.vue'),
        meta: {
          title: 'Usuários',
          requiresAuth: true,
          requiresAdmin: true,
          icon: 'people',
          description: 'Gerenciamento de usuários'
        }
      },

      // Gerenciamento de Planos
      {
        path: '/admin/plans',
        name: 'admin-plans',
        component: () => import('pages/auth/admin/AdminPlansPage.vue'),
        meta: {
          title: 'Gestão de Planos',
          requiresAuth: true,
          requiresAdmin: true,
          icon: 'card_membership',
          description: 'Gerenciamento de planos'
        }
      },

      // Configurações do Sistema
      {
        path: '/admin/system',
        name: 'admin-system',
        component: () => import('pages/auth/admin/AdminSystemPage.vue'),
        meta: {
          title: 'Sistema',
          requiresAuth: true,
          requiresAdmin: true,
          icon: 'settings_applications',
          description: 'Configurações do sistema'
        }
      }
    ]
  },

  // ==========================================================================
  // PÁGINAS DE ERRO
  // ==========================================================================
  
  // Acesso Negado
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('pages/ErrorForbidden.vue'),
    meta: {
      title: 'Acesso Negado',
      requiresAuth: false,
      description: 'Página de acesso negado'
    }
  },

  // Página Não Encontrada (sempre por último)
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: {
      title: 'Página Não Encontrada',
      requiresAuth: false,
      description: 'Página de erro 404'
    }
  }
]

export default routes

// ==========================================================================
// UTILITÁRIOS DE ROTA
// ==========================================================================

/**
 * Obtém rotas do menu principal (autenticadas, não admin)
 * Usado para gerar navegação sidebar
 */
/**
 * Obtém rotas do menu principal (SIDEBAR DESKTOP)
 * Para mobile, usar getDrawerMenuRoutes() para itens secundários
 * Bottom Nav mobile usa: Dashboard, Transações, Adicionar, Relatórios, Perfil
 */
export const getMainMenuRoutes = () => {
  return [
    {
      path: '/dashboard',
      name: 'dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      description: 'Visão geral das finanças',
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      title: 'Transações',
      icon: 'receipt_long',
      description: 'Gerenciar transações',
      meta: { requiresAuth: true }
    },
    {
      path: '/accounts',
      name: 'accounts-admin',
      title: 'Contas bancárias',
      icon: 'account_balance',
      description: 'Gerenciar contas bancárias e saldos',
      meta: { requiresAuth: true, requiresPremium: true }
    },
    {
      path: '/reports',
      name: 'reports',
      title: 'Relatórios',
      icon: 'assessment',
      description: 'Análises e relatórios',
      meta: { requiresAuth: true }
    },
    {
      path: '/payment-methods',
      name: 'payment-methods',
      title: 'Métodos de Pagamento',
      icon: 'credit_card',
      description: 'Gerenciar métodos de pagamento',
      meta: { requiresAuth: true }
    },
    {
      path: '/categories',
      name: 'categories',
      title: 'Categorias',
      icon: 'label',
      description: 'Gerenciar categorias',
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      title: 'Perfil',
      icon: 'person',
      description: 'Meu perfil e configurações',
      meta: { requiresAuth: true }
    },
    {
      path: '/plans',
      name: 'plans',
      title: 'Planos',
      icon: 'card_membership',
      description: 'Planos e assinaturas',
      meta: { requiresAuth: false }
    }
  ]
}

/**
 * Obtém rotas do DRAWER MOBILE (itens secundários/avançados)
 * Usado apenas no mobile quando usuário clica no hamburguer
 * Não inclui itens já presentes no Bottom Navigation
 */
export const getDrawerMenuRoutes = () => {
  return [
    {
      path: '/accounts',
      name: 'accounts-admin',
      title: 'Contas bancárias',
      icon: 'account_balance',
      description: 'Gerenciar contas bancárias e saldos',
      meta: { requiresAuth: true, requiresPremium: true }
    },
    {
      path: '/payment-methods',
      name: 'payment-methods',
      title: 'Métodos de Pagamento',
      icon: 'credit_card',
      description: 'Gerenciar métodos de pagamento',
      meta: { requiresAuth: true }
    },
    {
      path: '/categories',
      name: 'categories',
      title: 'Categorias',
      icon: 'label',
      description: 'Gerenciar categorias',
      meta: { requiresAuth: true }
    },
    {
      path: '/plans',
      name: 'plans',
      title: 'Planos',
      icon: 'card_membership',
      description: 'Planos e assinaturas',
      meta: { requiresAuth: false }
    }
  ]
}

/**
 * Obtém rotas do menu administrativo
 * Usado para gerar navegação admin
 */
export const getAdminMenuRoutes = () => {
  return [
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      title: 'Dashboard',
      icon: 'admin_panel_settings',
      description: 'Painel administrativo'
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      title: 'Usuários',
      icon: 'people',
      description: 'Gerenciar usuários'
    },
    {
      path: '/admin/plans',
      name: 'admin-plans',
      title: 'Planos',
      icon: 'card_membership',
      description: 'Gerenciar planos'
    },
    {
      path: '/admin/system',
      name: 'admin-system',
      title: 'Sistema',
      icon: 'settings_applications',
      description: 'Configurações globais'
    }
  ]
}

/**
 * Obtém rotas de configurações do usuário
 * Usado para menu de perfil
 */
export const getUserMenuRoutes = () => {
  return [
    {
      path: '/profile',
      name: 'profile',
      title: 'Meu Perfil',
      icon: 'person',
      description: 'Dados pessoais'
    },
    {
      path: '/settings',
      name: 'settings',
      title: 'Configurações',
      icon: 'settings',
      description: 'Preferências do sistema'
    }
  ]
}