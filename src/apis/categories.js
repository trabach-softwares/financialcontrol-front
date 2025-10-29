import { api } from 'boot/axios'
import { installInterceptors, handleApiError } from 'src/utils/apiUtils'

installInterceptors(api)

const BASE = '/categories'

export async function categoriesList(config = {}) {
  try {
    const { data } = await api.get(BASE, config)
    // backend sendSuccess wraps payload as { success, data, message }
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function categoriesCreate(name, icon = 'category', color = 'blue-6', type = 'expense', config = {}) {
  try {
    const { data } = await api.post(BASE, { name, icon, color, type }, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function categoriesUpdate(id, payload, config = {}) {
  try {
    const { data } = await api.put(`${BASE}/${id}`, payload, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}

export async function categoriesDelete(id, config = {}) {
  try {
    const { data } = await api.delete(`${BASE}/${id}`, config)
    return data
  } catch (error) {
    return Promise.reject(handleApiError(error))
  }
}
