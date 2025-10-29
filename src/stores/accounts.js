// ==========================================================================
// PINIA STORE - ACCOUNTS (BANK ACCOUNTS MANAGEMENT)
// ==========================================================================
// Propósito: Gerenciar o estado das contas bancárias do usuário
// Integrações: API helpers em src/apis/accounts.js
// Uso: Páginas administrativas, dashboards e componentes que exibem contas

import { defineStore } from 'pinia'
import {
  getAccounts,
  getAccountById,
  getAccountsSummary,
  createAccount,
  updateAccount,
  archiveAccount,
  deleteAccount
} from 'src/apis/accounts'

export const useAccountsStore = defineStore('accounts', {
  // ========================================================================
  // STATE
  // ========================================================================
  state: () => ({
    accounts: [],
    summary: {
      totalAccounts: 0,
      activeAccounts: 0,
      archivedAccounts: 0,
      totalBalance: 0,
      totalCreditLimit: 0
    },
    currentAccount: null,

    // flags de carregamento
    isLoading: false,
    isLoadingSummary: false,
    isSaving: false,
    isDeleting: false,

    // erros
    error: null,

    // filtros locais (p.ex. por status)
    filters: {
      status: 'active',
      search: ''
    }
  }),

  // ========================================================================
  // GETTERS
  // ========================================================================
  getters: {
    activeAccounts(state) {
      return state.accounts.filter(acc => acc.status === 'active')
    },
    archivedAccounts(state) {
      return state.accounts.filter(acc => acc.status === 'archived')
    },
    hasAccounts(state) {
      return state.accounts.length > 0
    },
    filteredAccounts(state) {
      const { status, search } = state.filters
      return state.accounts.filter((account) => {
        const matchesStatus = status ? account.status === status : true
        const matchesSearch = search
          ? (account.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (account.bankName || '').toLowerCase().includes(search.toLowerCase())
          : true
        return matchesStatus && matchesSearch
      })
    }
  },

  // ========================================================================
  // ACTIONS
  // ========================================================================
  actions: {
    setFilters(newFilters = {}) {
      this.filters = { ...this.filters, ...newFilters }
    },

    clearFilters() {
      this.filters = { status: 'active', search: '' }
    },

    async fetchAccounts(params = {}) {
      this.isLoading = true
      this.error = null
      try {
        const data = await getAccounts(params)
        const list = Array.isArray(data?.data) ? data.data : data
        this.accounts = Array.isArray(list) ? list : []
        return this.accounts
      } catch (error) {
        this.error = error?.message || 'Não foi possível carregar as contas'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchSummary() {
      this.isLoadingSummary = true
      this.error = null
      try {
        const data = await getAccountsSummary()
        this.summary = {
          totalAccounts: data?.totalAccounts ?? data?.total ?? 0,
          activeAccounts: data?.activeAccounts ?? data?.active ?? 0,
          archivedAccounts: data?.archivedAccounts ?? data?.archived ?? 0,
          totalBalance: data?.totalBalance ?? data?.balance ?? 0,
          totalCreditLimit: data?.totalCreditLimit ?? data?.creditLimit ?? 0
        }
        return this.summary
      } catch (error) {
        this.error = error?.message || 'Não foi possível carregar o resumo de contas'
        throw error
      } finally {
        this.isLoadingSummary = false
      }
    },

    async loadAccount(accountId) {
      this.error = null
      try {
        const data = await getAccountById(accountId)
        this.currentAccount = data
        return data
      } catch (error) {
        this.error = error?.message || 'Não foi possível carregar a conta selecionada'
        throw error
      }
    },

    clearCurrentAccount() {
      this.currentAccount = null
    },

    async createAccount(payload) {
      this.isSaving = true
      this.error = null
      try {
        const created = await createAccount(payload)
        if (created) {
          this.accounts.unshift(created)
        }
        await this.fetchSummary().catch(() => {})
        return created
      } catch (error) {
        this.error = error?.message || 'Não foi possível criar a conta'
        throw error
      } finally {
        this.isSaving = false
      }
    },

    async updateAccount(accountId, payload) {
      this.isSaving = true
      this.error = null
      try {
        const updated = await updateAccount(accountId, payload)
        const index = this.accounts.findIndex(acc => acc.id === accountId)
        if (index !== -1 && updated) {
          this.accounts[index] = { ...this.accounts[index], ...updated }
        }
        if (this.currentAccount?.id === accountId) {
          this.currentAccount = { ...this.currentAccount, ...updated }
        }
        await this.fetchSummary().catch(() => {})
        return updated
      } catch (error) {
        this.error = error?.message || 'Não foi possível atualizar a conta'
        throw error
      } finally {
        this.isSaving = false
      }
    },

    async archiveAccount(accountId) {
      this.isSaving = true
      this.error = null
      try {
        const archived = await archiveAccount(accountId)
        const index = this.accounts.findIndex(acc => acc.id === accountId)
        if (index !== -1) {
          this.accounts[index] = { ...this.accounts[index], status: 'archived', ...(archived || {}) }
        }
        await this.fetchSummary().catch(() => {})
        return archived
      } catch (error) {
        this.error = error?.message || 'Não foi possível arquivar a conta'
        throw error
      } finally {
        this.isSaving = false
      }
    },

    async deleteAccount(accountId) {
      this.isDeleting = true
      this.error = null
      try {
        await deleteAccount(accountId)
        this.accounts = this.accounts.filter(acc => acc.id !== accountId)
        if (this.currentAccount?.id === accountId) {
          this.currentAccount = null
        }
        await this.fetchSummary().catch(() => {})
        return true
      } catch (error) {
        this.error = error?.message || 'Não foi possível excluir a conta'
        throw error
      } finally {
        this.isDeleting = false
      }
    },

    resetStore() {
      this.accounts = []
      this.summary = {
        totalAccounts: 0,
        activeAccounts: 0,
        archivedAccounts: 0,
        totalBalance: 0,
        totalCreditLimit: 0
      }
      this.currentAccount = null
      this.error = null
      this.isLoading = false
      this.isLoadingSummary = false
      this.isSaving = false
      this.isDeleting = false
      this.filters = { status: 'active', search: '' }
    }
  }
})
