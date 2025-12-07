// ==========================================================================
// AUTH SERVICE - SERVIÇOS DE AUTENTICAÇÃO
// ==========================================================================
// Propósito: Encapsular todas as chamadas de autenticação à API REST
// Origem: Componentes Vue e Stores Pinia
// Destino: API REST http://localhost:3000/api/auth/*
// Efeitos: Login/logout, validação de token, gerenciamento de sessão

import { api } from 'boot/axios'
import { handleApiResponse } from 'src/utils/apiResponse'

/**
 * Serviços de autenticação que encapsulam as chamadas à API
 * Todos os métodos retornam Promises para uso com async/await
 */
export const authService = {
  
  // ==========================================================================
  // LOGIN - POST /auth/login
  // ==========================================================================
  /**
   * Realiza login do usuário na API
   * Origem: Formulário de login (email, password)
   * Destino: POST /auth/login
   * Retorna: { token, user } em caso de sucesso
   * Efeitos: Token é armazenado automaticamente pelo interceptor
   */
  async login(credentials) {
    
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    })
    
    const apiData = handleApiResponse(response, 'login')
    
    if (apiData && apiData.user && apiData.user.email) {
    } else {
      throw new Error('Estrutura de resposta inválida: user não encontrado')
    }
    
    return apiData
  },

  // ==========================================================================
  // REGISTRO - POST /auth/register  
  // ==========================================================================
  /**
   * Registra novo usuário na API
   * Origem: Formulário de cadastro (name, email, password)
   * Destino: POST /auth/register
   * Retorna: { token, user } em caso de sucesso
   * Efeitos: Usuário criado e logado automaticamente
   */
  async register(userData) {
    
    const response = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password
    })
    
    const apiData = handleApiResponse(response, 'register')

    return apiData
  },

  // ==========================================================================
  // OBTER USUÁRIO ATUAL - GET /auth/me
  // ==========================================================================
  /**
   * Busca dados do usuário autenticado
   * Origem: Store de auth para validar sessão
   * Destino: GET /auth/me (requer token JWT)
   * Retorna: Dados completos do usuário
   * Efeitos: Valida se o token ainda é válido
   */
  async getMe() {
    
    const response = await api.get('/auth/me')
    
    const apiData = handleApiResponse(response, 'getMe')
    const userData = apiData.user
    
    if (userData && userData.email) {
    } else {
      throw new Error('Estrutura de resposta inválida: user não encontrado')
    }
    
    return userData
  },

  // ==========================================================================
  // REFRESH - POST /auth/refresh
  // ==========================================================================
  /**
   * Renova o token JWT na API e retorna { token, user }
   */
  async refresh() {
    const response = await api.post('/auth/refresh')
    const apiData = handleApiResponse(response, 'refresh')
    if (!apiData?.token) {
      throw new Error('Falha ao renovar sessão: token ausente')
    }
    return apiData
  },

  // ==========================================================================
  // LOGOUT - POST /auth/logout
  // ==========================================================================
  /**
   * Efetua logout na API (stateless) para fins de auditoria/telemetria
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (_) {
      // Ignora erros de logout
    }
  }
}