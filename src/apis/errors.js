/**
 * Uniform API error handler
 */
export function handleApiError(error) {
  const message =
    error?.response?.data?.message || error?.message || "Erro desconhecido";
  const status = error?.response?.status || 500;
  const enhancedError = new Error(message);
  enhancedError.status = status;
  enhancedError.originalError = error;
  return enhancedError;
}
