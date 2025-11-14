/**
 * ==========================================================================
 * ERROR DIALOG SERVICE - SERVIÇO GLOBAL DE DIALOGS DE ERRO
 * ==========================================================================
 * Propósito: Gerenciar exibição de dialogs de erro de forma centralizada
 * Substituir notificações por dialogs elegantes
 * ATUALIZADO: Busca valores dos planos dinamicamente do banco de dados
 */

import { ref } from 'vue'
import { usePlansStore } from 'src/stores/plans'

// Estado reativo global
const errorDialogState = ref({
  show: false,
  type: 'error',
  title: '',
  subtitle: '',
  message: '',
  details: '',
  action: '',
  primaryButtonLabel: 'Entendi',
  showSecondaryButton: false,
  secondaryButtonLabel: 'Cancelar',
  redirectTo: '',
  limit: null,
  current: null,
  onPrimaryAction: null,
  onSecondaryAction: null
})

// Cache dos planos para evitar múltiplas chamadas
let plansCache = null
let plansCacheTime = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

/**
 * Busca os planos do banco de dados (com cache)
 */
async function getPlans() {
  const now = Date.now()
  
  // Retornar cache se válido
  if (plansCache && plansCacheTime && (now - plansCacheTime < CACHE_DURATION)) {
    return plansCache
  }
  
  try {
    const plansStore = usePlansStore()
    await plansStore.fetchPlans()
    
    plansCache = plansStore.paidPlans
    plansCacheTime = now
    
    return plansCache
  } catch (error) {
    console.error('Erro ao buscar planos:', error)
    // Retorna valores fallback se falhar
    return [
      { 
        name: 'PRO', 
        price: '29.90', 
        transaction_limit: 500,
        features: [
          '500 transações mensais',
          'Relatórios avançados',
          'Suporte prioritário'
        ]
      },
      { 
        name: 'PREMIUM', 
        price: '79.90', 
        transaction_limit: -1,
        features: [
          'Transações ILIMITADAS',
          'Gestão de contas bancárias',
          'Conciliação automática',
          'Análises preditivas'
        ]
      }
    ]
  }
}

/**
 * Formata preço para exibição
 */
function formatPrice(price) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Formata features do plano para exibição
 */
function formatFeatures(features) {
  if (!features || !Array.isArray(features) || features.length === 0) {
    return []
  }
  
  return features.map(feature => {
    // Se feature é string simples
    if (typeof feature === 'string') {
      return `→ ${feature}`
    }
    
    // Se feature é objeto com nome e descrição
    if (feature.name) {
      return `→ ${feature.name}`
    }
    
    return `→ ${feature}`
  })
}

/**
 * Gera o texto de features formatado
 */
function getFeaturesText(plan) {
  const features = formatFeatures(plan.features)
  
  // Se não tem features, usar fallback baseado no nome do plano
  if (features.length === 0) {
    if (plan.name?.toUpperCase() === 'PRO') {
      return [
        '→ 500 transações mensais',
        '→ Relatórios avançados',
        '→ Suporte prioritário'
      ].join('\n')
    } else if (plan.name?.toUpperCase() === 'PREMIUM') {
      return [
        '→ Transações ILIMITADAS',
        '→ Gestão de contas bancárias',
        '→ Conciliação automática',
        '→ Análises preditivas'
      ].join('\n')
    }
    return ''
  }
  
  return features.join('\n')
}

/**
 * Mostra dialog de erro
 * @param {Object} options - Configurações do dialog
 */
export function showErrorDialog(options) {
  errorDialogState.value = {
    show: true,
    type: options.type || 'error',
    title: options.title || '',
    subtitle: options.subtitle || '',
    message: options.message || 'Ocorreu um erro',
    details: options.details || '',
    action: options.action || '',
    primaryButtonLabel: options.primaryButtonLabel || 'Entendi',
    showSecondaryButton: options.showSecondaryButton || false,
    secondaryButtonLabel: options.secondaryButtonLabel || 'Cancelar',
    redirectTo: options.redirectTo || '',
    limit: options.limit || null,
    current: options.current || null,
    onPrimaryAction: options.onPrimaryAction || null,
    onSecondaryAction: options.onSecondaryAction || null
  }
}

/**
 * Fecha o dialog de erro
 */
export function closeErrorDialog() {
  errorDialogState.value.show = false
}

/**
 * Dialog de acesso negado (403) com copy persuasivo (ASYNC - busca preços e features do BD)
 */
export async function showForbiddenDialog(message = 'Você não tem permissão para esta ação.') {
  // Detectar tipo de recurso bloqueado para personalizar copy
  const isBankAccount = message.toLowerCase().includes('conta') || message.toLowerCase().includes('bancá')
  const isReport = message.toLowerCase().includes('relatório')
  
  // Buscar planos do banco de dados
  const plans = await getPlans()
  const proPlan = plans.find(p => p.name?.toUpperCase() === 'PRO') || { 
    price: '29.90',
    features: ['Relatórios avançados', 'Gráficos personalizados', 'Análises profundas']
  }
  const premiumPlan = plans.find(p => p.name?.toUpperCase() === 'PREMIUM') || { 
    price: '79.90',
    features: ['Gestão ilimitada de contas', 'Conciliação automática', 'Extratos detalhados']
  }
  
  const proPrice = formatPrice(proPlan.price)
  const premiumPrice = formatPrice(premiumPlan.price)
  const premiumFeatures = getFeaturesText(premiumPlan)
  const proFeatures = getFeaturesText(proPlan)
  
  let customTitle = '🔒 Recurso Premium'
  let customAction = `💎 Desbloqueie agora!\n\nPlano PREMIUM (R$ ${premiumPrice}/mês):\n${premiumFeatures}`
  
  if (isBankAccount) {
    customTitle = '🏦 Gestão Bancária Premium'
    customAction = `💰 Gerencie suas contas bancárias como um profissional!\n\nPlano PREMIUM (R$ ${premiumPrice}/mês):\n${premiumFeatures}`
  } else if (isReport) {
    customTitle = '📊 Relatórios Avançados'
    customAction = `📈 Tome decisões mais inteligentes!\n\nPlano PRO (R$ ${proPrice}/mês):\n${proFeatures}\n\nPlano PREMIUM (R$ ${premiumPrice}/mês):\n${premiumFeatures}`
  }
  
  showErrorDialog({
    type: 'forbidden',
    title: customTitle,
    subtitle: 'Funcionalidade exclusiva',
    message: message,
    action: customAction,
    primaryButtonLabel: '🚀 Fazer Upgrade',
    showSecondaryButton: true,
    secondaryButtonLabel: 'Voltar',
    redirectTo: '/plans'
  })
}

/**
 * Dialog de limite atingido com copy persuasivo (ASYNC - busca preços e features do BD)
 */
export async function showLimitDialog(options = {}) {
  // Extrair informações do limite da API ou dos detalhes
  const limit = options.limit || extractLimitFromDetails(options.details)
  const current = options.current || extractCurrentFromDetails(options.details)
  const plan = options.plan || 'FREE'
  
  // Buscar planos do banco de dados
  const plans = await getPlans()
  const proPlan = plans.find(p => p.name?.toUpperCase() === 'PRO') || { 
    price: '29.90', 
    transaction_limit: 500,
    features: ['500 transações mensais', 'Relatórios avançados', 'Suporte prioritário']
  }
  const premiumPlan = plans.find(p => p.name?.toUpperCase() === 'PREMIUM') || { 
    price: '79.90', 
    transaction_limit: -1,
    features: ['Transações ILIMITADAS', 'Gestão de contas bancárias', 'Conciliação automática', 'Análises preditivas']
  }
  
  const proPrice = formatPrice(proPlan.price)
  const premiumPrice = formatPrice(premiumPlan.price)
  const proLimit = proPlan.transaction_limit || 500
  
  // Formatar features dos planos
  const proFeatures = getFeaturesText(proPlan)
  const premiumFeatures = getFeaturesText(premiumPlan)
  
  // Copy baseado no plano
  const copyByPlan = {
    FREE: {
      title: '🚀 Você está crescendo!',
      message: 'Parabéns! Você já registrou todas as transações do plano gratuito este mês.',
      action: `✨ Desbloqueie todo o potencial do seu negócio:\n\n💼 Plano PRO (R$ ${proPrice}/mês)\n${proFeatures}\n\n🏆 Plano PREMIUM (R$ ${premiumPrice}/mês)\n${premiumFeatures}`
    },
    PRO: {
      title: '📈 Seu negócio está em alta!',
      message: 'Incrível! Você está usando todo o potencial do plano PRO.',
      action: `🏆 Evolua para o próximo nível!\n\nCom o Plano PREMIUM você terá:\n${premiumFeatures}\n\nPor apenas R$ ${premiumPrice}/mês`
    }
  }
  
  const copy = copyByPlan[plan] || copyByPlan.FREE
  
  showErrorDialog({
    type: 'limit',
    title: copy.title,
    subtitle: copy.subtitle,
    message: copy.message,
    details: '', // Removemos detalhes técnicos
    action: copy.action,
    primaryButtonLabel: '✨ Conhecer Planos',
    showSecondaryButton: true,
    secondaryButtonLabel: 'Voltar',
    redirectTo: '/plans',
    limit: limit,
    current: current,
    ...options
  })
}

// Helper para extrair limite dos detalhes
function extractLimitFromDetails(details) {
  if (!details) return null
  const match = details.match(/Limite:\s*(\d+)/)
  return match ? match[1] : null
}

// Helper para extrair atual dos detalhes
function extractCurrentFromDetails(details) {
  if (!details) return null
  const match = details.match(/Atual:\s*(\d+)/)
  return match ? match[1] : null
}

/**
 * Dialog de erro genérico
 */
export function showGenericErrorDialog(message = 'Ocorreu um erro inesperado.') {
  showErrorDialog({
    type: 'error',
    message: message,
    action: 'Tente novamente mais tarde ou entre em contato com o suporte.',
    primaryButtonLabel: 'Entendi'
  })
}

/**
 * Dialog de aviso
 */
export function showWarningDialog(message, options = {}) {
  showErrorDialog({
    type: 'warning',
    message: message,
    primaryButtonLabel: 'Entendi',
    ...options
  })
}

/**
 * Hook composable para usar o error dialog
 */
export function useErrorDialog() {
  return {
    errorDialogState,
    showErrorDialog,
    closeErrorDialog,
    showForbiddenDialog,
    showLimitDialog,
    showGenericErrorDialog,
    showWarningDialog
  }
}
