import { api } from 'boot/axios'
import { FINANCIAL_ROUTES } from './routes'
import { handleApiError, installInterceptors } from 'src/utils/apiUtils'

installInterceptors(api)

const baseUrl = FINANCIAL_ROUTES.accountsList
const statementPath = (accountId) => `${FINANCIAL_ROUTES.accountStatement}/${accountId}/statement`
const statementExportPath = (accountId) => `${FINANCIAL_ROUTES.accountStatementExport}/${accountId}/statement/export`

export async function getAccounts(params = {}, config = {}) {
  try {
    const response = await api.get(baseUrl, {
      params,
      ...config,
    })
    return response?.data?.data ?? response?.data ?? []
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function getAccountById(accountId, config = {}) {
  try {
    const response = await api.get(`${FINANCIAL_ROUTES.accountsGetById}/${accountId}`, config)
    return response?.data?.data ?? response?.data ?? null
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function createAccount(payload, config = {}) {
  try {
    const response = await api.post(FINANCIAL_ROUTES.accountsCreate, payload, config)
    return response?.data?.data ?? response?.data ?? null
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function updateAccount(accountId, payload, config = {}) {
  try {
    const response = await api.put(`${FINANCIAL_ROUTES.accountsUpdate}/${accountId}`, payload, config)
    return response?.data?.data ?? response?.data ?? null
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function archiveAccount(accountId, config = {}) {
  try {
    const response = await api.patch(`${FINANCIAL_ROUTES.accountsArchive}/${accountId}/archive`, null, config)
    return response?.data?.data ?? response?.data ?? null
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function deleteAccount(accountId, config = {}) {
  try {
    const response = await api.delete(`${FINANCIAL_ROUTES.accountsDelete}/${accountId}`, config)
    return response?.data?.data ?? response?.data ?? null
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function getAccountsSummary(config = {}) {
  try {
    const response = await api.get(FINANCIAL_ROUTES.accountsSummary, config)
    return response?.data?.data ?? response?.data ?? null
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function getAccountStatement(accountId, params = {}, config = {}) {
  try {
    const response = await api.get(statementPath(accountId), {
      params,
      ...config,
    })
    return response?.data?.data ?? response?.data ?? null
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function exportAccountStatement(accountId, params = {}, config = {}) {
  try {
    const response = await api.get(statementExportPath(accountId), {
      params,
      responseType: 'blob',
      ...config,
    })

    const disposition = response.headers?.['content-disposition'] || ''
    const match = /filename="?([^";]+)"?/i.exec(disposition)
    const filename = match ? decodeURIComponent(match[1]) : `statement-${accountId}.csv`

    return {
      blob: response.data,
      filename,
      contentType: response.headers?.['content-type'] || 'application/octet-stream',
    }
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}
