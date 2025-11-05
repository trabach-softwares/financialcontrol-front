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
 * Cria uma cobrança via Asaas (PIX, Boleto ou Cartão)
 * @param {Object} payload - Dados da cobrança
 * @param {string} payload.planId - ID do plano escolhido
 * @param {string} payload.paymentMethod - Método: 'PIX', 'BOLETO', 'CREDIT_CARD'
 * @param {Object} [payload.creditCard] - Dados do cartão (se método = CREDIT_CARD)
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados da cobrança criada
 */
export async function createPayment(payload, config = {}) {
  try {
    const { data } = await api.post(
      FINANCIAL_ROUTES.paymentsCreate,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Consulta status de um pagamento
 * @param {string} paymentId - ID do pagamento no Asaas
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Status do pagamento
 */
export async function getPaymentStatus(paymentId, config = {}) {
  try {
    const { data } = await api.get(
      `${FINANCIAL_ROUTES.paymentsStatus}/${paymentId}`,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Lista histórico de pagamentos do usuário
 * @param {Object} [params] - Parâmetros de filtro
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Array>} Lista de pagamentos
 */
export async function listPayments(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config };
    const { data } = await api.get(
      FINANCIAL_ROUTES.paymentsList,
      finalConfig
    );
    return data?.data || data || [];
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Cancela um pagamento pendente
 * @param {string} paymentId - ID do pagamento
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Confirmação do cancelamento
 */
export async function cancelPayment(paymentId, config = {}) {
  try {
    const { data } = await api.delete(
      `${FINANCIAL_ROUTES.paymentsCancel}/${paymentId}`,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Gera QR Code PIX para pagamento
 * @param {string} paymentId - ID do pagamento
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados do QR Code (payload e imagem)
 */
export async function getPixQrCode(paymentId, config = {}) {
  try {
    const { data } = await api.get(
      `${FINANCIAL_ROUTES.paymentsPixQrCode}/${paymentId}`,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Gera link de pagamento compartilhável
 * @param {string} paymentId - ID do pagamento
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Link de pagamento
 */
export async function getPaymentLink(paymentId, config = {}) {
  try {
    const { data } = await api.get(
      `${FINANCIAL_ROUTES.paymentsLink}/${paymentId}`,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}
