// ==========================================================================
// COMPOSABLE - DATE FORMATTER
// ==========================================================================
// Propósito: Composable para formatação de datas
// Origem: Componentes que exibem datas e períodos
// Efeitos: Formatação consistente de datas em toda aplicação

import { ref, computed } from 'vue'

/**
 * Composable para formatação de datas
 * Suporta diferentes formatos e localizações
 */
export function useDate() {
  // Estado da configuração de data
  const locale = ref('pt-BR')
  const dateFormat = ref('DD/MM/YYYY')

  /**
   * Configurações de formatação por localização
   */
  const localeConfigs = {
    'pt-BR': {
      locale: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm',
      dateTimeFormat: 'DD/MM/YYYY HH:mm'
    },
    'en-US': {
      locale: 'en-US',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'hh:mm A',
      dateTimeFormat: 'MM/DD/YYYY hh:mm A'
    },
    'es-ES': {
      locale: 'es-ES',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm',
      dateTimeFormat: 'DD/MM/YYYY HH:mm'
    }
  }

  /**
   * Configuração atual
   */
  const currentConfig = computed(() => {
    return localeConfigs[locale.value] || localeConfigs['pt-BR']
  })

  /**
   * Formatar data
   * @param {Date|string} date - Data a ser formatada
   * @param {string} format - Formato desejado ('short', 'medium', 'long', 'full')
   * @returns {string} Data formatada
   */
  const formatDate = (date, format = 'short') => {
    if (!date) return ''

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      
      if (isNaN(dateObj.getTime())) {
        console.warn('Data inválida:', date)
        return ''
      }

      const options = getDateOptions(format)
      
      return new Intl.DateTimeFormat(currentConfig.value.locale, options).format(dateObj)
    } catch (error) {
      console.warn('Erro na formatação de data:', error)
      return ''
    }
  }

  /**
   * Formatar data e hora
   * @param {Date|string} date - Data a ser formatada
   * @param {string} format - Formato desejado
   * @returns {string} Data e hora formatadas
   */
  const formatDateTime = (date, format = 'short') => {
    if (!date) return ''

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      
      if (isNaN(dateObj.getTime())) {
        console.warn('Data inválida:', date)
        return ''
      }

      const options = {
        ...getDateOptions(format),
        hour: '2-digit',
        minute: '2-digit'
      }
      
      return new Intl.DateTimeFormat(currentConfig.value.locale, options).format(dateObj)
    } catch (error) {
      console.warn('Erro na formatação de data/hora:', error)
      return ''
    }
  }

  /**
   * Formatar apenas a hora
   * @param {Date|string} date - Data a ser formatada
   * @returns {string} Hora formatada
   */
  const formatTime = (date) => {
    if (!date) return ''

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      
      if (isNaN(dateObj.getTime())) {
        console.warn('Data inválida:', date)
        return ''
      }

      return new Intl.DateTimeFormat(currentConfig.value.locale, {
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj)
    } catch (error) {
      console.warn('Erro na formatação de hora:', error)
      return ''
    }
  }

  /**
   * Formatar data relativa (há X dias, em X dias)
   * @param {Date|string} date - Data a ser formatada
   * @returns {string} Data relativa
   */
  const formatRelativeDate = (date) => {
    if (!date) return ''

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      
      if (isNaN(dateObj.getTime())) {
        console.warn('Data inválida:', date)
        return ''
      }

      const now = new Date()
      const diffTime = dateObj.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      // Usar Intl.RelativeTimeFormat se disponível
      if (Intl.RelativeTimeFormat) {
        const rtf = new Intl.RelativeTimeFormat(currentConfig.value.locale, {
          numeric: 'auto'
        })

        if (Math.abs(diffDays) < 1) {
          return 'Hoje'
        } else if (Math.abs(diffDays) < 7) {
          return rtf.format(diffDays, 'day')
        } else if (Math.abs(diffDays) < 30) {
          return rtf.format(Math.floor(diffDays / 7), 'week')
        } else {
          return rtf.format(Math.floor(diffDays / 30), 'month')
        }
      }

      // Fallback manual
      if (diffDays === 0) return 'Hoje'
      if (diffDays === 1) return 'Amanhã'
      if (diffDays === -1) return 'Ontem'
      if (diffDays > 0) return `Em ${diffDays} dias`
      return `Há ${Math.abs(diffDays)} dias`

    } catch (error) {
      console.warn('Erro na formatação de data relativa:', error)
      return ''
    }
  }

  /**
   * Obter opções de formatação baseadas no formato solicitado
   */
  const getDateOptions = (format) => {
    switch (format) {
      case 'short':
        return {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }
      case 'medium':
        return {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      case 'long':
        return {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      case 'full':
        return {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      default:
        return {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }
    }
  }

  /**
   * Converter data para formato ISO (YYYY-MM-DD)
   * @param {Date|string} date - Data a ser convertida
   * @returns {string} Data em formato ISO
   */
  const toISODate = (date) => {
    if (!date) return ''

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      
      if (isNaN(dateObj.getTime())) {
        console.warn('Data inválida:', date)
        return ''
      }

      return dateObj.toISOString().split('T')[0]
    } catch (error) {
      console.warn('Erro na conversão para ISO:', error)
      return ''
    }
  }

  /**
   * Converter string de data do input para Date
   * @param {string} dateString - String da data (YYYY-MM-DD)
   * @returns {Date} Objeto Date
   */
  const fromISODate = (dateString) => {
    if (!dateString) return null

    try {
      const date = new Date(dateString + 'T00:00:00')
      return isNaN(date.getTime()) ? null : date
    } catch (error) {
      console.warn('Erro na conversão de ISO:', error)
      return null
    }
  }

  /**
   * Obter período padrão (últimos 30 dias)
   * @returns {Object} Objeto com startDate e endDate
   */
  const getDefaultPeriod = () => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    return {
      startDate: toISODate(startDate),
      endDate: toISODate(endDate)
    }
  }

  /**
   * Obter período do mês atual
   * @returns {Object} Objeto com startDate e endDate
   */
  const getCurrentMonthPeriod = () => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return {
      startDate: toISODate(startDate),
      endDate: toISODate(endDate)
    }
  }

  /**
   * Validar se uma string é uma data válida
   * @param {string} dateString - String da data
   * @returns {boolean} True se válida
   */
  const isValidDate = (dateString) => {
    if (!dateString) return false
    
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  }

  /**
   * Definir localização
   * @param {string} newLocale - Nova localização
   */
  const setLocale = (newLocale) => {
    if (localeConfigs[newLocale]) {
      locale.value = newLocale
      dateFormat.value = localeConfigs[newLocale].dateFormat
      console.log('📅 [DATE] Localização alterada para:', newLocale)
    }
  }

  return {
    // Estado
    locale,
    dateFormat,
    currentConfig,
    
    // Métodos de formatação
    formatDate,
    formatDateTime,
    formatTime,
    formatRelativeDate,
    
    // Conversões
    toISODate,
    fromISODate,
    
    // Utilitários
    getDefaultPeriod,
    getCurrentMonthPeriod,
    isValidDate,
    setLocale,
    
    // Configurações disponíveis
    availableLocales: Object.keys(localeConfigs)
  }
}