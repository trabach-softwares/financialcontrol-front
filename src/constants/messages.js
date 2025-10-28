// ==========================================================================
// MENSAGENS DA APLICAÇÃO
// ==========================================================================
// Centralização de todas as mensagens do sistema para facilitar manutenção
// e padronização das mensagens exibidas ao usuário

export const MESSAGES = {
  // Mensagens de sucesso
  SUCCESS: {
    LOGIN: 'Login realizado com sucesso!',
    REGISTER: 'Conta criada com sucesso!',
    PASSWORD_RESET: 'E-mail de recuperação enviado com sucesso!',
    PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
    PASSWORD_CHANGED: 'Senha alterada com sucesso!',
    LOGOUT: 'Você saiu do sistema com sucesso!'
  },
  
  // Mensagens de erro
  ERROR: {
    REQUIRED_FIELDS: 'Preencha todos os campos obrigatórios',
    INVALID_EMAIL: 'Por favor, insira um e-mail válido',
    PASSWORD_TOO_SHORT: 'A senha deve ter no mínimo 6 caracteres',
    PASSWORD_MISMATCH: 'As senhas não conferem',
    INVALID_CREDENTIALS: 'E-mail ou senha inválidos',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente',
    SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde',
    UNAUTHORIZED: 'Sessão expirada. Faça login novamente',
    FORBIDDEN: 'Você não tem permissão para acessar este recurso',
    NOT_FOUND: 'Recurso não encontrado',
    ACCOUNT_EXISTS: 'Já existe uma conta com este e-mail',
    INVALID_TOKEN: 'Token inválido ou expirado',
    UNEXPECTED: 'Ocorreu um erro inesperado. Tente novamente',
    
    // Mensagens específicas de formulário
    FORM: {
      INVALID_EMAIL: 'Digite um e-mail válido',
      PASSWORD_REQUIREMENTS: 'A senha deve conter pelo menos 6 caracteres, incluindo letras e números',
      TERMS_NOT_ACCEPTED: 'Você deve aceitar os termos de uso',
      INVALID_DATE: 'Data inválida',
      INVALID_PHONE: 'Telefone inválido'
    }
  },
  
  // Mensagens de validação
  VALIDATION: {
    REQUIRED: 'Campo obrigatório',
    EMAIL: 'Digite um e-mail válido',
    MIN_LENGTH: (min) => `Mínimo de ${min} caracteres`,
    MAX_LENGTH: (max) => `Máximo de ${max} caracteres`,
    PASSWORD_MATCH: 'As senhas devem ser iguais'
  },
  
  // Mensagens de confirmação
  CONFIRM: {
    DELETE_ACCOUNT: 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
    LOGOUT: 'Tem certeza que deseja sair do sistema?',
    DISCARD_CHANGES: 'Tem certeza que deseja descartar as alterações?'
  }
}

// Funções auxiliares para mensagens dinâmicas
export const getErrorMessage = (error) => {
  if (!error) return MESSAGES.ERROR.UNEXPECTED
  
  // Se for um erro de resposta HTTP
  if (error.response) {
    const { status, data } = error.response
    
    switch (status) {
      case 400: return data.message || MESSAGES.ERROR.UNEXPECTED
      case 401: return MESSAGES.ERROR.INVALID_CREDENTIALS
      case 403: return MESSAGES.ERROR.FORBIDDEN
      case 404: return MESSAGES.ERROR.NOT_FOUND
      case 409: return MESSAGES.ERROR.ACCOUNT_EXISTS
      case 422: return data.message || MESSAGES.ERROR.VALIDATION
      case 500: return MESSAGES.ERROR.SERVER_ERROR
      default: return MESSAGES.ERROR.UNEXPECTED
    }
  }
  
  // Se for um erro de rede
  if (error.message === 'Network Error') {
    return MESSAGES.ERROR.NETWORK_ERROR
  }
  
  // Se for uma string, retorna direto
  if (typeof error === 'string') return error
  
  // Se for um objeto com mensagem
  if (error.message) return error.message
  
  // Caso padrão
  return MESSAGES.ERROR.UNEXPECTED
}

// Exporta as mensagens como padrão para facilitar a importação
export default MESSAGES
