import { api } from "boot/axios";
import { FINANCIAL_ROUTES } from "./routes";
import {
  getAuthStoreSafe,
  installInterceptors,
  handleApiError,
} from "src/utils/apiUtils";

// Instala interceptors (se precisar de extras além do boot)
installInterceptors(api);

/**
 * Lista todos os planos disponíveis
 * @param {Object} [params] - Parâmetros de filtro
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Array>} Lista de planos
 */
export async function plansList(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config };
    const { data } = await api.get(FINANCIAL_ROUTES.plansList, finalConfig);
    return data?.data || data || [];
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Busca plano por ID
 * @param {string} id - ID do plano
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados do plano
 */
export async function plansGetById(id, config = {}) {
  try {
    const { data } = await api.get(
      `${FINANCIAL_ROUTES.plansGetById}/${id}`,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Cria novo plano (admin)
 * @param {Object} payload - Dados do plano
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Plano criado
 */
export async function plansCreate(payload, config = {}) {
  try {
    const { data } = await api.post(
      FINANCIAL_ROUTES.plansCreate,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Atualiza plano existente (admin)
 * @param {string} id - ID do plano
 * @param {Object} payload - Dados atualizados
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Plano atualizado
 */
export async function plansUpdate(id, payload, config = {}) {
  try {
    const { data } = await api.put(
      `${FINANCIAL_ROUTES.plansUpdate}/${id}`,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Deleta plano (admin)
 * @param {string} id - ID do plano
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object|true>} Confirmação da exclusão
 */
export async function plansDelete(id, config = {}) {
  try {
    const { data } = await api.delete(
      `${FINANCIAL_ROUTES.plansDelete}/${id}`,
      config
    );
    return typeof data === "undefined" ? true : data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}
