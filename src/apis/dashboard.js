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
 * Busca estatísticas do dashboard
 * @param {Object} [params] - Parâmetros de filtro
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Estatísticas do dashboard
 */
export async function dashboardStats(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config };
    const { data } = await api.get(
      FINANCIAL_ROUTES.dashboardStats,
      finalConfig
    );
    return data?.data || data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Busca dados dos gráficos do dashboard
 * @param {Object} [params] - Parâmetros
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados dos gráficos
 */
export async function dashboardCharts(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config };
    const { data } = await api.get(
      FINANCIAL_ROUTES.dashboardCharts,
      finalConfig
    );
    return data?.data || data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Busca transações recentes do dashboard
 * @param {Object} [params] - Parâmetros
 * @param {number} [params.limit] - Limite de resultados
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Array>} Transações recentes
 */
export async function dashboardRecentTransactions(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config };
    const { data } = await api.get(
      FINANCIAL_ROUTES.dashboardRecentTransactions,
      finalConfig
    );
    return data?.data || data || [];
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}
