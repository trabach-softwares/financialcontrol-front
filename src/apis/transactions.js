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
 * Lista transações do usuário
 * @param {Object} [params] - Parâmetros de filtro
 * @param {string} [params.type] - Tipo (income|expense)
 * @param {string} [params.category] - Categoria
 * @param {string} [params.startDate] - Data inicial
 * @param {string} [params.endDate] - Data final
 * @param {number} [params.limit] - Limite de resultados
 * @param {string} [params.sort] - Ordenação (ex: 'date:desc')
 * @param {number} [params.page] - Página
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Array>} Lista de transações
 */
export async function transactionsList(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config };
    const { data } = await api.get(
      FINANCIAL_ROUTES.transactionsList,
      finalConfig
    );
    return data?.data || data || [];
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Cria nova transação
 * @param {Object} payload - Dados da transação
 * @param {string} payload.type - Tipo (income|expense)
 * @param {number} payload.amount - Valor
 * @param {string} payload.description - Descrição
 * @param {string} [payload.category] - Categoria
 * @param {string} [payload.date] - Data
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Transação criada
 */
export async function transactionsCreate(payload, config = {}) {
  try {
    const { data } = await api.post(
      FINANCIAL_ROUTES.transactionsCreate,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Busca transação por ID
 * @param {string} id - ID da transação
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados da transação
 */
export async function transactionsGetById(id, config = {}) {
  try {
    const { data } = await api.get(
      `${FINANCIAL_ROUTES.transactionsGetById}/${id}`,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Atualiza transação existente
 * @param {string} id - ID da transação
 * @param {Object} payload - Dados atualizados
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Transação atualizada
 */
export async function transactionsUpdate(id, payload, config = {}) {
  try {
    const { data } = await api.put(
      `${FINANCIAL_ROUTES.transactionsUpdate}/${id}`,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Deleta transação
 * @param {string} id - ID da transação
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object|true>} Confirmação da exclusão
 */
export async function transactionsDelete(id, config = {}) {
  try {
    const { data } = await api.delete(
      `${FINANCIAL_ROUTES.transactionsDelete}/${id}`,
      config
    );
    return typeof data === "undefined" ? true : data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Busca estatísticas das transações
 * @param {Object} [params] - Parâmetros de filtro
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Estatísticas (income, expense, balance)
 */
export async function transactionsStats(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config };
    const { data } = await api.get(
      FINANCIAL_ROUTES.transactionsStats,
      finalConfig
    );
    return data?.data || data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Busca evolução temporal das transações
 * @param {Object} [params] - Parâmetros
 * @param {string} [params.period] - Período (1month, 3months, 6months, 1year)
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Array>} Timeline por mês
 */
export async function transactionsTimeline(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config };
    const { data } = await api.get(
      FINANCIAL_ROUTES.transactionsTimeline,
      finalConfig
    );
    return data?.data || data || [];
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}
