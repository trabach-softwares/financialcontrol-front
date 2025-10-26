// ==========================================================================
// I18N CONFIGURATION - INTERNACIONALIZAÇÃO
// ==========================================================================
// Propósito: Configuração do vue-i18n para suporte multi-idioma
// Idiomas: PT-BR (padrão), EN
// ==========================================================================

import { createI18n } from 'vue-i18n'
import ptBR from './locales/pt-BR.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false, // Composition API mode
  locale: 'pt-BR', // Default locale
  fallbackLocale: 'en',
  messages: {
    'pt-BR': ptBR,
    'en': en
  },
  // Configurações de formatação
  numberFormats: {
    'pt-BR': {
      currency: {
        style: 'currency',
        currency: 'BRL',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        useGrouping: false
      }
    },
    'en': {
      currency: {
        style: 'currency',
        currency: 'USD',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        useGrouping: false
      }
    }
  },
  datetimeFormats: {
    'pt-BR': {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        weekday: 'long'
      }
    },
    'en': {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        weekday: 'long'
      }
    }
  }
})

export default i18n
