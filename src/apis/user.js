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
 * Busca perfil completo do usuário autenticado
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Dados completos do perfil
 */
export async function userProfileGet(config = {}) {
  try {
    const { data } = await api.get(FINANCIAL_ROUTES.userProfileGet, config);
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Atualiza perfil do usuário
 * @param {Object} payload - Dados atualizados
 * @param {string} [payload.name] - Nome
 * @param {string} [payload.phone] - Telefone
 * @param {string} [payload.birth_date] - Data de nascimento
 * @param {string} [payload.cpf] - CPF
 * @param {string} [payload.company] - Empresa
 * @param {string} [payload.position] - Cargo
 * @param {string} [payload.bio] - Biografia
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Perfil atualizado
 */
export async function userProfileUpdate(payload, config = {}) {
  try {
    const { data } = await api.put(
      FINANCIAL_ROUTES.userProfileUpdate,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Altera senha do usuário
 * @param {Object} payload - Dados da senha
 * @param {string} payload.currentPassword - Senha atual
 * @param {string} payload.newPassword - Nova senha
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Confirmação da alteração
 */
export async function userProfilePasswordChange(payload, config = {}) {
  try {
    const { data } = await api.put(
      FINANCIAL_ROUTES.userProfilePasswordChange,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Faz upload de avatar do usuário
 * @param {FormData} formData - FormData com o arquivo de imagem
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} URL do avatar
 */
export async function userProfileAvatarUpload(formData, config = {}) {
  try {
    const { data } = await api.post(
      FINANCIAL_ROUTES.userProfileAvatarUpload,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        ...config,
      }
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Remove avatar do usuário
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Confirmação da remoção
 */
export async function userProfileAvatarRemove(config = {}) {
  try {
    const { data } = await api.delete(
      FINANCIAL_ROUTES.userProfileAvatarRemove,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Busca configurações do usuário
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Configurações do usuário
 */
export async function userSettingsGet(config = {}) {
  try {
    const { data } = await api.get(FINANCIAL_ROUTES.userSettingsGet, config);
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Atualiza configurações do usuário
 * @param {Object} payload - Configurações atualizadas
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Configurações atualizadas
 */
export async function userSettingsUpdate(payload, config = {}) {
  try {
    const { data } = await api.put(
      FINANCIAL_ROUTES.userSettingsUpdate,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

/**
 * Deleta conta do usuário (soft delete)
 * @param {Object} payload - Confirmação
 * @param {string} payload.confirmation - Deve ser 'DELETE'
 * @param {Object} [config] - Configurações adicionais
 * @returns {Promise<Object>} Confirmação da exclusão
 */
export async function userAccountDelete(payload, config = {}) {
  try {
    const { data } = await api.delete(FINANCIAL_ROUTES.userAccountDelete, {
      data: payload,
      ...config,
    });
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}
