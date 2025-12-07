// ==========================================================================
// COMPOSABLE - CURRENCY FORMAT
// ==========================================================================
// Propósito: Composable para formatação de valores monetários
// Origem: Componentes que exibem valores financeiros
// Efeitos: Formatação consistente de moeda em toda aplicação

import { ref, computed } from 'vue'

/**
 * Composable para formatação de valores monetários
 * Suporta diferentes moedas e configurações regionais
 */
export function useCurrency() {
  // Estado da configuração de moeda
  const currency = ref('BRL')
  const locale = ref('pt-BR')

  /**
   * Configurações de formatação por moeda
   */
  const currencyConfigs = {
    BRL: {
      currency: 'BRL',
      locale: 'pt-BR',
      symbol: 'R$',
      decimals: 2
    },
    USD: {
      currency: 'USD',
      locale: 'en-US',
      symbol: '$',
      decimals: 2
    },
    EUR: {
      currency: 'EUR',
      locale: 'de-DE',
      symbol: '€',
      decimals: 2
    }
  }

  /**
   * Configuração atual baseada na moeda selecionada
   */
  const currentConfig = computed(() => {
    return currencyConfigs[currency.value] || currencyConfigs.BRL
  })

  /**
   * Formatar valor como moeda completa
   * @param {number} value - Valor a ser formatado
   * @param {Object} options - Opções de formatação
   * @returns {string} Valor formatado
   */
  const formatCurrency = (value, options = {}) => {
    if (value === null || value === undefined || isNaN(value)) {
      return formatCurrency(0, options)
    }

    const config = options.currency ? 
      currencyConfigs[options.currency] || currentConfig.value : 
      currentConfig.value

    try {
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        minimumFractionDigits: options.decimals ?? config.decimals,
        maximumFractionDigits: options.decimals ?? config.decimals
      }).format(Number(value))
    } catch (error) {
      console.warn('Erro na formatação de moeda:', error)
      return `${config.symbol} ${Number(value).toFixed(config.decimals)}`
    }
  }

  /**
   * Formatar valor sem símbolo de moeda
   * @param {number} value - Valor a ser formatado
   * @param {Object} options - Opções de formatação
   * @returns {string} Valor formatado sem símbolo
   */
  const formatNumber = (value, options = {}) => {
    if (value === null || value === undefined || isNaN(value)) {
      return formatNumber(0, options)
    }

    const config = currentConfig.value
    const decimals = options.decimals ?? config.decimals

    try {
      return new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(Number(value))
    } catch (error) {
      console.warn('Erro na formatação de número:', error)
      return Number(value).toFixed(decimals)
    }
  }

  /**
   * Formatar valor compacto (K, M, B)
   * @param {number} value - Valor a ser formatado
   * @param {Object} options - Opções de formatação
   * @returns {string} Valor formatado compacto
   */
  const formatCompact = (value, options = {}) => {
    if (value === null || value === undefined || isNaN(value)) {
      return formatCompact(0, options)
    }

    const config = currentConfig.value
    
    try {
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(Number(value))
    } catch (error) {
      // Fallback manual se não suportar compact
      const absValue = Math.abs(Number(value))
      const sign = Number(value) < 0 ? '-' : ''
      
      if (absValue >= 1e9) {
        return `${sign}${config.symbol} ${(absValue / 1e9).toFixed(1)}B`
      } else if (absValue >= 1e6) {
        return `${sign}${config.symbol} ${(absValue / 1e6).toFixed(1)}M`
      } else if (absValue >= 1e3) {
        return `${sign}${config.symbol} ${(absValue / 1e3).toFixed(1)}K`
      } else {
        return formatCurrency(value, options)
      }
    }
  }

  /**
   * Converter string formatada para número
   * @param {string} formattedValue - Valor formatado
   * @returns {number} Valor numérico
   */
  const parseCurrency = (formattedValue) => {
    if (!formattedValue || typeof formattedValue !== 'string') {
      return 0
    }

    // Remove símbolos de moeda e espaços
    const cleaned = formattedValue
      .replace(/[R$€$\s]/g, '')
      .replace(/\./g, '') // Remove pontos de milhares
      .replace(',', '.') // Converte vírgula decimal para ponto

    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }

  /**
   * Definir moeda global
   * @param {string} newCurrency - Nova moeda (BRL, USD, EUR)
   */
  const setCurrency = (newCurrency) => {
    if (currencyConfigs[newCurrency]) {
      currency.value = newCurrency
      locale.value = currencyConfigs[newCurrency].locale
    }
  }

  /**
   * Obter símbolo da moeda atual
   * @returns {string} Símbolo da moeda
   */
  const getCurrencySymbol = () => {
    return currentConfig.value.symbol
  }

  /**
   * Validar se uma string é um valor monetário válido
   * @param {string} value - Valor a ser validado
   * @returns {boolean} True se válido
   */
  const isValidCurrency = (value) => {
    if (!value || typeof value !== 'string') return false
    
    const parsed = parseCurrency(value)
    return !isNaN(parsed) && parsed >= 0
  }

  /**
   * Formatar entrada de usuário em tempo real
   * @param {string} input - Input do usuário
   * @returns {string} Valor formatado para input
   */
  const formatInput = (input) => {
    if (!input) return ''
    
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleaned = input.replace(/[^\d,.-]/g, '')
    const number = parseCurrency(cleaned)
    
    return formatNumber(number)
  }

  return {
    // Estado
    currency,
    locale,
    currentConfig,
    
    // Métodos de formatação
    formatCurrency,
    formatNumber,
    formatCompact,
    formatInput,
    
    // Utilitários
    parseCurrency,
    setCurrency,
    getCurrencySymbol,
    isValidCurrency,
    
    // Configurações disponíveis
    availableCurrencies: Object.keys(currencyConfigs)
  }
}