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
 * Realiza login do usuário
 * @param {Object} payload - Credenciais de login
 * @param {string} payload.email - Email do usuário
 * @param {string} payload.password - Senha do usuário
 * @param {Object} [config] - Configurações adicionais do axios
 * @returns {Promise<Object>} Dados do usuário e token
 */
export async function authLogin(payload, config = {}) {
  try {
    const { data } = await api.post(
      FINANCIAL_ROUTES.authLogin,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Registra novo usuário
 * @param {Object} payload - Dados do novo usuário
 * @param {string} payload.name - Nome completo
 * @param {string} payload.email - Email
 * @param {string} payload.password - Senha
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados do usuário criado
 */
export async function authRegister(payload, config = {}) {
  try {
    const { data } = await api.post(
      FINANCIAL_ROUTES.authRegister,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Busca dados do usuário autenticado
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados do usuário
 */
export async function authGetMe(config = {}) {
  try {
    const { data } = await api.get(FINANCIAL_ROUTES.authMe, config);
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Realiza logout do usuário
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Confirmação de logout
 */
export async function authLogout(config = {}) {
  try {
    const { data } = await api.post(FINANCIAL_ROUTES.authLogout, {}, config);
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}
