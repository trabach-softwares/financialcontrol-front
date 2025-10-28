import { api } from "boot/axios";
import { FINANCIAL_ROUTES } from "./routes";
import { handleApiError } from "./errors";

export async function adminUsersList(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config };
    const { data } = await api.get(
      FINANCIAL_ROUTES.adminUsersList,
      finalConfig
    );
    return data?.data || data || [];
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

export async function adminUsersGetById(id, config = {}) {
  try {
    const { data } = await api.get(
      `${FINANCIAL_ROUTES.adminUsersGetById}/${id}`,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

export async function adminUsersUpdate(id, payload, config = {}) {
  try {
    const { data } = await api.put(
      `${FINANCIAL_ROUTES.adminUsersUpdate}/${id}`,
      payload,
      config
    );
    return data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

export async function adminUsersDelete(id, config = {}) {
  try {
    const { data } = await api.delete(
      `${FINANCIAL_ROUTES.adminUsersDelete}/${id}`,
      config
    );
    return typeof data === "undefined" ? true : data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}

export async function adminStatistics(params = {}, config = {}) {
  try {
    const finalConfig = { params, ...config };
    const { data } = await api.get(
      FINANCIAL_ROUTES.adminStatistics,
      finalConfig
    );
    return data?.data || data;
  } catch (error) {
    return Promise.reject(handleApiError(error));
  }
}
