// ==========================================================================
// REPORT SERVICE - SERVIÇOS DE RELATÓRIOS FINANCEIROS
// ==========================================================================
// Propósito: Encapsular operações de relatórios e analytics
// Origem: Página de relatórios, Dashboard
// Destino: API REST /api/reports/*
// Efeitos: Agregações, exportações e análises financeiras

import { api } from 'boot/axios'

/**
 * Serviços de relatórios financeiros
 * Inclui agregações, categorias, evolução mensal e exportação
 */
const reportService = {

  // ==========================================================================
  // BUSCAR RESUMO DE RELATÓRIOS - GET /reports/summary
  // ==========================================================================
  /**
   * Busca dados agregados para relatórios
   * @param {Object} params - Parâmetros de filtro
   * @param {string} params.start_date - Data inicial (YYYY-MM-DD)
   * @param {string} params.end_date - Data final (YYYY-MM-DD)
   * @param {number} params.account_id - ID da conta (opcional, PREMIUM)
   * @returns {Promise<Object>} Dados agregados do relatório
   */
  async getSummary(params = {}) {
    console.log('📊 [ReportService] Buscando resumo de relatórios:', params)

    try {
      const queryParams = new URLSearchParams()
      
      if (params.start_date) queryParams.append('start_date', params.start_date)
      if (params.end_date) queryParams.append('end_date', params.end_date)
      if (params.account_id) queryParams.append('account_id', params.account_id)

      const queryString = queryParams.toString()
      const url = `/reports/summary${queryString ? `?${queryString}` : ''}`

      const response = await api.get(url)
      
      console.log('✅ [ReportService] Resposta da API:', response.data)

      // Normalizar resposta
      const data = response.data?.data || response.data
      
      return {
        period: data.period || {
          start_date: params.start_date || null,
          end_date: params.end_date || null
        },
        summary: data.summary || {
          total_income: 0,
          total_expense: 0,
          balance: 0,
          transaction_count: 0
        },
        categories: data.categories || [],
        monthly_data: data.monthly_data || []
      }
    } catch (error) {
      console.error('❌ [ReportService] Erro ao buscar resumo:', error)
      
      // Se for erro de permissão (plano insuficiente)
      if (error.response?.status === 403) {
        const errorData = error.response?.data?.error
        throw {
          code: errorData?.code || 'PLAN_UPGRADE_REQUIRED',
          message: errorData?.message || 'Recurso requer upgrade de plano',
          requiredPlan: errorData?.details?.required_plan,
          currentPlan: errorData?.details?.current_plan
        }
      }
      
      // Se for erro 404 ou erro de rede, retornar estrutura vazia
      // (não dados mockados - isso fica no componente)
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK' || !error.response) {
        console.warn('⚠️ [ReportService] API não disponível, retornando estrutura vazia')
        return {
          period: {
            start_date: params.start_date || null,
            end_date: params.end_date || null
          },
          summary: {
            total_income: 0,
            total_expense: 0,
            balance: 0,
            transaction_count: 0
          },
          categories: [],
          monthly_data: []
        }
      }
      
      throw error
    }
  },

  // ==========================================================================
  // EXPORTAR RELATÓRIO - POST /reports/export
  // ==========================================================================
  /**
   * Exporta relatório em formato específico (PRO+)
   * @param {Object} params - Parâmetros de exportação
   * @param {string} params.format - Formato: 'pdf' | 'excel' | 'csv'
   * @param {string} params.start_date - Data inicial (YYYY-MM-DD)
   * @param {string} params.end_date - Data final (YYYY-MM-DD)
   * @param {boolean} params.include_transactions - Incluir transações detalhadas
   * @param {boolean} params.include_categories - Incluir breakdown por categoria
   * @param {boolean} params.include_monthly - Incluir evolução mensal
   * @returns {Promise<Object>} URL do arquivo gerado
   */
  async exportReport(params) {
    console.log('📤 [ReportService] Exportando relatório:', params)

    try {
      const response = await api.post('/reports/export', {
        format: params.format || 'pdf',
        start_date: params.start_date,
        end_date: params.end_date,
        include_transactions: params.include_transactions ?? true,
        include_categories: params.include_categories ?? true,
        include_monthly: params.include_monthly ?? true
      })

      console.log('✅ [ReportService] Relatório exportado:', response.data)

      const data = response.data?.data || response.data
      
      return {
        file_url: data.file_url,
        file_name: data.file_name,
        expires_at: data.expires_at,
        size_bytes: data.size_bytes
      }
    } catch (error) {
      console.error('❌ [ReportService] Erro ao exportar:', error)
      
      // Erro de permissão (plano FREE)
      if (error.response?.status === 403) {
        const errorData = error.response?.data?.error
        throw {
          code: errorData?.code || 'PLAN_UPGRADE_REQUIRED',
          message: errorData?.message || 'Exportação requer plano PRO ou superior',
          requiredPlan: errorData?.details?.required_plan || 'PRO',
          currentPlan: errorData?.details?.current_plan,
          feature: 'export_reports'
        }
      }
      
      // Limite de exportações atingido
      if (error.response?.status === 429) {
        throw {
          code: 'EXPORT_LIMIT_REACHED',
          message: 'Limite diário de exportações atingido',
          retryAfter: error.response?.headers?.['retry-after']
        }
      }
      
      throw error
    }
  },

  // ==========================================================================
  // DETALHES DE CATEGORIA - GET /reports/category-details/:id (PRO+)
  // ==========================================================================
  /**
   * Busca transações detalhadas de uma categoria
   * @param {number} categoryId - ID da categoria
   * @param {Object} params - Parâmetros de filtro
   * @returns {Promise<Object>} Detalhes da categoria com transações
   */
  async getCategoryDetails(categoryId, params = {}) {
    console.log('🔍 [ReportService] Buscando detalhes da categoria:', categoryId, params)

    try {
      const queryParams = new URLSearchParams()
      
      if (params.start_date) queryParams.append('start_date', params.start_date)
      if (params.end_date) queryParams.append('end_date', params.end_date)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.offset) queryParams.append('offset', params.offset)

      const queryString = queryParams.toString()
      const url = `/reports/category-details/${categoryId}${queryString ? `?${queryString}` : ''}`

      const response = await api.get(url)
      
      const data = response.data?.data || response.data
      
      return {
        category: data.category,
        summary: data.summary,
        transactions: data.transactions || [],
        pagination: data.pagination
      }
    } catch (error) {
      console.error('❌ [ReportService] Erro ao buscar detalhes:', error)
      
      if (error.response?.status === 403) {
        throw {
          code: 'PLAN_UPGRADE_REQUIRED',
          message: 'Detalhes de categoria requerem plano PRO ou superior'
        }
      }
      
      throw error
    }
  }
}

export default reportService
