// ==========================================================================
// PINIA STORE - ACCOUNT STATEMENT
// ==========================================================================
// Propósito: Gerenciar o extrato consolidado de uma conta bancária específica
// Integra backend /api/accounts/:accountId/statement e exportações
// Fornece filtros, paginação, resumo e controle de exportações

import { defineStore } from 'pinia'
import {
  getAccountStatement,
  exportAccountStatement
} from 'src/apis/accounts'

const DEFAULT_FILTERS = {
  startDate: '',
  endDate: '',
  type: '',
  category: '',
  search: '',
  sort: 'desc',
  page: 1,
  pageSize: 25
}

const DEFAULT_SUMMARY = {
  openingBalance: 0,
  inflows: 0,
  outflows: 0,
  net: 0,
  closingBalance: 0,
  currency: 'BRL',
  totalTransactions: 0
}

const DEFAULT_META = {
  page: 1,
  pageSize: 25,
  total: 0,
  totalPages: 0,
  hasMore: false,
  range: null
}

export const useAccountStatementStore = defineStore('accountStatement', {
  state: () => ({
    accountId: null,
    account: null,
    transactions: [],
    filters: { ...DEFAULT_FILTERS },
    summary: { ...DEFAULT_SUMMARY },
    meta: { ...DEFAULT_META },
    isLoading: false,
    isExporting: false,
    error: null
  }),

  getters: {
    hasTransactions: (state) => state.transactions.length > 0,
    dateRangeLabel: (state) => {
      const { startDate, endDate } = state.filters
      return startDate && endDate ? `${startDate} – ${endDate}` : ''
    }
  },

  actions: {
    setAccountId(accountId) {
      this.accountId = accountId
    },

    setFilters(newFilters = {}) {
      this.filters = { ...this.filters, ...newFilters }
    },

    resetFilters() {
      this.filters = { ...DEFAULT_FILTERS }
    },

    resetState() {
      this.accountId = null
      this.account = null
      this.transactions = []
      this.filters = { ...DEFAULT_FILTERS }
      this.summary = { ...DEFAULT_SUMMARY }
      this.meta = { ...DEFAULT_META }
      this.error = null
      this.isLoading = false
      this.isExporting = false
    },

    async fetchStatement(accountId, overrideFilters = {}) {
      this.isLoading = true
      this.error = null

      if (accountId) {
        this.accountId = accountId
      }

      if (!this.accountId) {
        this.isLoading = false
        throw new Error('Account ID is required to fetch statement')
      }

      const query = {
        ...this.filters,
        ...overrideFilters
      }

      try {
        const response = await getAccountStatement(this.accountId, query)
        if (!response) {
          this.transactions = []
          this.summary = { ...DEFAULT_SUMMARY }
          this.meta = { ...DEFAULT_META }
          return null
        }

        this.account = response.account || this.account
        this.transactions = Array.isArray(response.transactions) ? response.transactions : []
        this.summary = {
          ...DEFAULT_SUMMARY,
          ...(response.summary || {})
        }
        this.meta = {
          ...DEFAULT_META,
          ...(response.meta || {})
        }

        if (response.filters) {
          this.filters = {
            ...this.filters,
            ...response.filters,
            ...overrideFilters
          }
        } else {
          this.filters = { ...query }
        }

        return response
      } catch (error) {
        this.error = error?.message || 'Não foi possível carregar o extrato'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loadNextPage() {
      if (!this.meta?.hasMore) return
      const nextPage = (this.meta.page || 1) + 1
      this.filters.page = nextPage
      await this.fetchStatement(this.accountId, { page: nextPage })
    },

    async exportStatement(format = 'csv') {
      if (!this.accountId) {
        throw new Error('Account ID is required to export statement')
      }

      this.isExporting = true
      this.error = null
      try {
        const exportPayload = await exportAccountStatement(this.accountId, {
          ...this.filters,
          format
        })
        return exportPayload
      } catch (error) {
        this.error = error?.message || 'Não foi possível exportar o extrato'
        throw error
      } finally {
        this.isExporting = false
      }
    }
  }
})
