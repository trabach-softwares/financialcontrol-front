// ==========================================================================
// USER SERVICE - SERVIÇOS DE GERENCIAMENTO DE USUÁRIO
// ==========================================================================
// Propósito: Encapsular operações de perfil e configurações do usuário
// Origem: Páginas de perfil, configurações, componentes de usuário
// Destino: API REST http://localhost:3000/api/users/*
// Efeitos: Gerenciamento completo do perfil do usuário

import { api } from 'boot/axios'
import { handleApiResponse } from 'src/utils/apiResponse'

/**
 * Serviços de usuário que encapsulam operações de perfil e configurações
 * Inclui atualização de dados, mudança de senha e configurações
 */
export const userService = {

  // ==========================================================================
  // ATUALIZAR PERFIL - PUT /users/profile
  // ==========================================================================
  /**
   * Atualiza dados do perfil do usuário
   * Origem: Página de perfil, formulário de edição
   * Destino: PUT /users/profile
   * Retorna: Dados atualizados do usuário
   * Efeitos: Perfil modificado, possível atualização do token
   */
  async updateProfile(profileData) {
    console.log('👤 Atualizando perfil do usuário:', {
      name: profileData.name,
      email: profileData.email,
      company: profileData.company
    })
    
    const response = await api.put('/users/profile', {
      name: profileData.name,
      email: profileData.email,
      company: profileData.company || null,
      phone: profileData.phone || null
    })
    
    console.log('✅ Perfil atualizado com sucesso')
    return response.data
  },

  // ==========================================================================
  // ALTERAR SENHA - PUT /users/password
  // ==========================================================================
  /**
   * Altera a senha do usuário
   * Origem: Página de configurações, formulário de senha
   * Destino: PUT /users/password
   * Retorna: Confirmação da alteração
   * Efeitos: Nova senha definida, possível logout forçado
   */
  async changePassword(passwordData) {
    console.log('🔒 Alterando senha do usuário')
    
    const response = await api.put('/users/password', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })
    
    console.log('✅ Senha alterada com sucesso')
    return response.data
  },

  // ==========================================================================
  // BUSCAR PERFIL ATUAL - GET /users/profile
  // ==========================================================================
  /**
   * Busca dados completos do perfil atual
   * Origem: Carregamento da página de perfil, refresh de dados
   * Destino: GET /users/profile
   * Retorna: Dados completos do usuário atual
   * Efeitos: Dados atualizados para formulários e exibição
   */
  async getCurrentProfile() {
    console.log('📋 Buscando perfil atual do usuário')
    
    const response = await api.get('/users/profile')
    
    console.log('✅ Perfil obtido:', {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      plan: response.data.plan
    })
    
    return response.data
  },

  // ==========================================================================
  // DELETAR CONTA - DELETE /users/account
  // ==========================================================================
  /**
   * Deleta permanentemente a conta do usuário
   * Origem: Página de configurações, confirmação de exclusão
   * Destino: DELETE /users/account
   * Retorna: Confirmação da exclusão
   * Efeitos: Conta removida, logout automático, dados apagados
   */
  async deleteAccount(confirmation) {
    console.log('⚠️ Deletando conta do usuário - AÇÃO IRREVERSÍVEL')
    
    const response = await api.delete('/users/account', {
      data: { confirmation: confirmation }
    })
    
    console.log('✅ Conta deletada permanentemente')
    return response.data
  },

  // ==========================================================================
  // CONFIGURAÇÕES DO SISTEMA - GET/PUT /users/settings
  // ==========================================================================
  /**
   * Busca configurações personalizadas do usuário
   * Origem: Página de configurações, inicialização do app
   * Destino: GET /users/settings
   * Retorna: Objeto com configurações do usuário
   * Efeitos: Aplicação de configurações personalizadas
   */
  async getUserSettings() {
    console.log('⚙️ Buscando configurações do usuário')
    
    const response = await api.get('/users/settings')
    
    console.log('✅ Configurações obtidas:', {
      theme: response.data.theme,
      currency: response.data.currency,
      notifications: response.data.notifications
    })
    
    return response.data
  },

  /**
   * Atualiza configurações personalizadas do usuário
   * Origem: Página de configurações, formulário de preferências
   * Destino: PUT /users/settings
   * Retorna: Configurações atualizadas
   * Efeitos: Preferências salvas e aplicadas
   */
  async updateUserSettings(settings) {
    console.log('⚙️ Atualizando configurações do usuário:', settings)
    
    const response = await api.put('/users/settings', {
      theme: settings.theme,           // 'light' | 'dark' | 'auto'
      currency: settings.currency,     // 'BRL' | 'USD' | 'EUR'
      language: settings.language,     // 'pt-BR' | 'en-US' | 'es-ES'
      notifications: {
        email: settings.notifications?.email || false,
        push: settings.notifications?.push || false,
        reports: settings.notifications?.reports || false
      },
      dateFormat: settings.dateFormat, // 'DD/MM/YYYY' | 'MM/DD/YYYY'
      numberFormat: settings.numberFormat // 'pt-BR' | 'en-US'
    })
    
    console.log('✅ Configurações atualizadas com sucesso')
    return response.data
  },

  // ==========================================================================
  // UPLOAD DE AVATAR - POST /users/avatar
  // ==========================================================================
  /**
   * Faz upload da foto de perfil do usuário
   * Origem: Página de perfil, componente de upload de imagem
   * Destino: POST /users/avatar
   * Retorna: URL da nova imagem de perfil
   * Efeitos: Avatar atualizado no perfil
   */
  async uploadAvatar(file) {
    console.log('📷 Fazendo upload do avatar:', file.name)
    
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    console.log('✅ Avatar atualizado:', response.data.avatarUrl)
    return response.data.avatarUrl
  },

  // ==========================================================================
  // REMOVER AVATAR - DELETE /users/avatar
  // ==========================================================================
  /**
   * Remove a foto de perfil do usuário
   * Origem: Página de perfil, ação de remoção
   * Destino: DELETE /users/avatar
   * Retorna: Confirmação da remoção
   * Efeitos: Avatar removido, volta ao padrão
   */
  async removeAvatar() {
    console.log('🗑️ Removendo avatar do usuário')
    
    const response = await api.delete('/users/avatar')
    
    console.log('✅ Avatar removido com sucesso')
    return response.data
  },

  // ==========================================================================
  // ALTERAR PLANO - PUT /users/plan
  // ==========================================================================
  /**
   * Altera o plano de assinatura do usuário
   * Origem: Página de planos, processo de upgrade/downgrade
   * Destino: PUT /users/plan
   * Retorna: Dados do novo plano
   * Efeitos: Plano alterado, recursos atualizados
   */
  async changePlan(planId) {
    console.log('💳 Alterando plano do usuário:', {
      planId: planId
    })
    
    const response = await api.put('/users/plan', {
      planId: planId
    })
    
    const apiData = handleApiResponse(response, 'changePlan')
    
    console.log('✅ Plano alterado com sucesso')
    return apiData
  },

  // ==========================================================================
  // ESTATÍSTICAS DO USUÁRIO - GET /users/stats
  // ==========================================================================
  /**
   * Busca estatísticas de uso da plataforma pelo usuário
   * Origem: Dashboard, página de perfil
   * Destino: GET /users/stats
   * Retorna: Dados de uso e estatísticas pessoais
   * Efeitos: Exibição de métricas de atividade
   */
  async getUserStats() {
    console.log('📈 Buscando estatísticas do usuário')
    
    const response = await api.get('/users/stats')
    
    console.log('✅ Estatísticas obtidas:', {
      transactionsCount: response.data.transactionsCount,
      joinDate: response.data.joinDate,
      lastActivity: response.data.lastActivity
    })
    
    return response.data
  }
}