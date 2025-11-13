/**
 * ==========================================================================
 * COMPOSABLE - FEATURE PERMISSIONS
 * ==========================================================================
 * Propósito: Gerenciar permissões de features baseadas no plano do usuário
 * Planos: FREE, PRO, PREMIUM
 * Efeitos: Controla acesso a funcionalidades exclusivas de planos superiores
 */

import { computed } from 'vue'
import { useAuthStore } from 'src/stores/auth'

/**
 * Definição de features e seus planos mínimos requeridos
 */
const FEATURE_REQUIREMENTS = {
  // Features do plano FREE (todos têm acesso)
  DASHBOARD: 'FREE',
  TRANSACTIONS_BASIC: 'FREE',
  CATEGORIES_BASIC: 'FREE',
  REPORTS_BASIC: 'FREE',
  PROFILE: 'FREE',
  
  // Features do plano PRO
  ADVANCED_REPORTS: 'PRO',
  MULTIPLE_ACCOUNTS_UP_TO_5: 'PRO',
  EXPORT_DATA: 'PRO',
  RECURRING_TRANSACTIONS: 'PRO',
  
  // Features EXCLUSIVAS do plano PREMIUM
  BANK_ACCOUNTS: 'PREMIUM',           // 🏦 Contas Bancárias
  UNLIMITED_ACCOUNTS: 'PREMIUM',
  BANK_RECONCILIATION: 'PREMIUM',
  ACCOUNT_STATEMENT: 'PREMIUM',
  ADVANCED_ANALYTICS: 'PREMIUM',
  PRIORITY_SUPPORT: 'PREMIUM',
  WHITE_LABEL: 'PREMIUM',
  API_ACCESS: 'PREMIUM'
}

/**
 * Hierarquia de planos (do menor ao maior)
 */
const PLAN_HIERARCHY = {
  'FREE': 0,
  'BASIC': 0,
  'GRATUITO': 0,
  'PRO': 1,
  'PROFESSIONAL': 1,
  'PREMIUM': 2,
  'ENTERPRISE': 2
}

export function useFeaturePermissions() {
  const authStore = useAuthStore()

  /**
   * Obtém o nível hierárquico do plano atual do usuário
   */
  const currentPlanLevel = computed(() => {
    const userPlan = authStore.userPlan || 'FREE'
    const planKey = String(userPlan).toUpperCase()
    return PLAN_HIERARCHY[planKey] ?? 0
  })

  /**
   * Nome normalizado do plano atual
   */
  const currentPlanName = computed(() => {
    const userPlan = authStore.userPlan || 'FREE'
    return String(userPlan).toUpperCase()
  })

  /**
   * Verifica se o usuário está em um plano específico
   */
  const isPlan = (planName) => {
    const plan = String(planName).toUpperCase()
    return currentPlanName.value === plan || PLAN_HIERARCHY[currentPlanName.value] === PLAN_HIERARCHY[plan]
  }

  /**
   * Verifica se o usuário está no plano gratuito
   */
  const isFreePlan = computed(() => {
    return currentPlanLevel.value === 0
  })

  /**
   * Verifica se o usuário está no plano PRO
   */
  const isProPlan = computed(() => {
    return currentPlanLevel.value === 1
  })

  /**
   * Verifica se o usuário está no plano PREMIUM
   */
  const isPremiumPlan = computed(() => {
    return currentPlanLevel.value === 2
  })

  /**
   * Verifica se o usuário tem acesso a uma feature específica
   * @param {string} featureName - Nome da feature (ex: 'BANK_ACCOUNTS')
   * @returns {boolean} True se tem acesso
   */
  const hasFeatureAccess = (featureName) => {
    const requiredPlan = FEATURE_REQUIREMENTS[featureName]
    
    // Se a feature não existe, nega acesso por segurança
    if (!requiredPlan) {
      console.warn(`Feature "${featureName}" não definida em FEATURE_REQUIREMENTS`)
      return false
    }
    
    const requiredLevel = PLAN_HIERARCHY[requiredPlan]
    return currentPlanLevel.value >= requiredLevel
  }

  /**
   * Verifica se pode acessar Contas Bancárias (PREMIUM apenas)
   */
  const canAccessBankAccounts = computed(() => {
    return hasFeatureAccess('BANK_ACCOUNTS')
  })

  /**
   * Verifica se pode acessar Relatórios Avançados (PRO ou superior)
   */
  const canAccessAdvancedReports = computed(() => {
    return hasFeatureAccess('ADVANCED_REPORTS')
  })

  /**
   * Obtém o plano mínimo necessário para uma feature
   * @param {string} featureName - Nome da feature
   * @returns {string} Nome do plano mínimo
   */
  const getRequiredPlan = (featureName) => {
    return FEATURE_REQUIREMENTS[featureName] || 'PREMIUM'
  }

  /**
   * Verifica se o usuário precisa fazer upgrade para acessar uma feature
   * @param {string} featureName - Nome da feature
   * @returns {Object} { needsUpgrade: boolean, requiredPlan: string, currentPlan: string }
   */
  const checkUpgradeRequired = (featureName) => {
    const hasAccess = hasFeatureAccess(featureName)
    const requiredPlan = getRequiredPlan(featureName)
    
    return {
      needsUpgrade: !hasAccess,
      requiredPlan: requiredPlan,
      currentPlan: currentPlanName.value,
      canAccess: hasAccess
    }
  }

  /**
   * Obtém mensagem amigável sobre bloqueio de feature
   * @param {string} featureName - Nome da feature
   * @returns {Object} { title: string, message: string, requiredPlan: string }
   */
  const getFeatureBlockMessage = (featureName) => {
    const requiredPlan = getRequiredPlan(featureName)
    
    const messages = {
      'BANK_ACCOUNTS': {
        title: 'Contas Bancárias - Feature Premium 🏦',
        message: 'A gestão de contas bancárias é uma funcionalidade exclusiva do plano Premium. Faça upgrade para desbloquear!',
        features: [
          'Gestão completa de contas bancárias',
          'Conciliação bancária automática',
          'Extratos detalhados por conta',
          'Múltiplas contas ilimitadas',
          'Sincronização em tempo real',
          'Relatórios por conta'
        ]
      },
      'ADVANCED_REPORTS': {
        title: 'Relatórios Avançados - Feature Pro ⚡',
        message: 'Relatórios avançados estão disponíveis a partir do plano Pro. Faça upgrade para análises mais profundas!',
        features: [
          'Relatórios personalizados',
          'Gráficos avançados',
          'Exportação em múltiplos formatos',
          'Comparativos entre períodos',
          'Análise de tendências'
        ]
      },
      'BANK_RECONCILIATION': {
        title: 'Conciliação Bancária - Feature Premium 💎',
        message: 'A conciliação bancária é exclusiva do plano Premium. Simplifique seu controle financeiro!',
        features: [
          'Conciliação automática',
          'Identificação de divergências',
          'Histórico de conciliações',
          'Relatórios de conciliação'
        ]
      }
    }
    
    return messages[featureName] || {
      title: `Feature ${requiredPlan} 🌟`,
      message: `Esta funcionalidade está disponível apenas no plano ${requiredPlan}. Faça upgrade para desbloquear!`,
      features: [
        'Acesso completo à funcionalidade',
        'Suporte prioritário',
        'Atualizações exclusivas'
      ]
    }
  }

  /**
   * Retorna a lista de features disponíveis no plano atual
   */
  const availableFeatures = computed(() => {
    return Object.entries(FEATURE_REQUIREMENTS)
      .filter(([_, requiredPlan]) => {
        const requiredLevel = PLAN_HIERARCHY[requiredPlan]
        return currentPlanLevel.value >= requiredLevel
      })
      .map(([featureName]) => featureName)
  })

  /**
   * Retorna a lista de features bloqueadas (que precisam upgrade)
   */
  const lockedFeatures = computed(() => {
    return Object.entries(FEATURE_REQUIREMENTS)
      .filter(([_, requiredPlan]) => {
        const requiredLevel = PLAN_HIERARCHY[requiredPlan]
        return currentPlanLevel.value < requiredLevel
      })
      .map(([featureName, requiredPlan]) => ({
        name: featureName,
        requiredPlan: requiredPlan
      }))
  })

  return {
    // Computed
    currentPlanLevel,
    currentPlanName,
    isFreePlan,
    isProPlan,
    isPremiumPlan,
    canAccessBankAccounts,
    canAccessAdvancedReports,
    availableFeatures,
    lockedFeatures,
    
    // Methods
    hasFeatureAccess,
    isPlan,
    getRequiredPlan,
    checkUpgradeRequired,
    getFeatureBlockMessage
  }
}
