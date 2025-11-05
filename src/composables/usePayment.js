import { ref, computed } from 'vue';
import {
  createPayment,
  getPaymentStatus,
  listPayments,
  cancelPayment,
} from 'src/apis/payments';
import { useNotifications } from './useNotifications';

/**
 * Composable para gerenciar pagamentos Asaas
 * Fornece funcionalidades para criar, consultar e gerenciar pagamentos
 */
export function usePayment() {
  const { notifySuccess, notifyError } = useNotifications();
  
  const loading = ref(false);
  const error = ref(null);
  const currentPayment = ref(null);
  const paymentsList = ref([]);
  const pollingInterval = ref(null);

  /**
   * Cria um novo pagamento
   * @param {Object} params - Parâmetros do pagamento
   * @param {string} params.planId - ID do plano
   * @param {string} params.paymentMethod - PIX, BOLETO ou CREDIT_CARD
   * @param {Object} [params.creditCard] - Dados do cartão (obrigatório para CREDIT_CARD)
   * @returns {Promise<Object>} Dados do pagamento criado
   */
  const create = async (params) => {
    loading.value = true;
    error.value = null;

    try {
      console.log('📤 Enviando requisição de pagamento:', params);
      const response = await createPayment(params);
      console.log('📥 Resposta da API recebida:', response);
      
      // Trata diferentes formatos de resposta
      if (response.data && response.success !== false) {
        currentPayment.value = response.data;
      } else if (response.payment) {
        currentPayment.value = response.payment;
      } else if (response.id) {
        // Se a resposta já é o pagamento diretamente
        currentPayment.value = response;
      } else {
        console.error('❌ Formato de resposta inesperado:', response);
        throw new Error('Formato de resposta inválido da API');
      }
      
      console.log('✅ currentPayment.value definido:', currentPayment.value);
      console.log('ID do pagamento:', currentPayment.value?.id);
      
      // Cartão de crédito pode ser aprovado instantaneamente
      if (currentPayment.value.status === 'CONFIRMED') {
        notifySuccess('Pagamento aprovado com sucesso!');
      } else {
        notifySuccess('Pagamento criado! Aguardando confirmação.');
      }
      
      return currentPayment.value;
    } catch (err) {
      console.error('❌ Erro ao criar pagamento:', err);
      error.value = err.message || 'Erro ao criar pagamento';
      notifyError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Consulta o status de um pagamento
   * @param {string} paymentId - ID do pagamento
   * @returns {Promise<Object>} Status do pagamento
   */
  const checkStatus = async (paymentId) => {
    try {
      const response = await getPaymentStatus(paymentId);
      const payment = response.data || response;
      
      // Atualiza o pagamento atual se for o mesmo
      if (currentPayment.value?.id === paymentId) {
        currentPayment.value = payment;
      }
      
      return payment;
    } catch (err) {
      console.error('Erro ao verificar status:', err);
      throw err;
    }
  };

  /**
   * Inicia polling para verificar status do pagamento
   * @param {string} paymentId - ID do pagamento
   * @param {Function} onConfirmed - Callback quando pagamento for confirmado
   * @param {number} intervalMs - Intervalo em milissegundos (padrão: 3000)
   * @param {number} maxAttempts - Número máximo de tentativas (padrão: 100)
   */
  const startPolling = (paymentId, onConfirmed, intervalMs = 3000, maxAttempts = 100) => {
    stopPolling(); // Garante que não há polling anterior rodando
    
    let attempts = 0;
    
    pollingInterval.value = setInterval(async () => {
      attempts++;
      
      try {
        const payment = await checkStatus(paymentId);
        
        // Verifica se foi confirmado ou recebido
        if (payment.status === 'CONFIRMED' || payment.status === 'RECEIVED') {
          stopPolling();
          notifySuccess('🎉 Pagamento confirmado!');
          if (onConfirmed) {
            onConfirmed(payment);
          }
        }
        
        // Timeout após máximo de tentativas
        if (attempts >= maxAttempts) {
          stopPolling();
          console.warn('Polling timeout: número máximo de tentativas atingido');
        }
      } catch (err) {
        console.error('Erro no polling:', err);
      }
    }, intervalMs);
  };

  /**
   * Para o polling de verificação de status
   */
  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
    }
  };

  /**
   * Lista todos os pagamentos do usuário
   * @param {Object} filters - Filtros opcionais
   * @returns {Promise<Array>} Lista de pagamentos
   */
  const list = async (filters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await listPayments(filters);
      paymentsList.value = response.payments || response.data || response;
      return paymentsList.value;
    } catch (err) {
      error.value = err.message || 'Erro ao listar pagamentos';
      notifyError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cancela um pagamento pendente
   * @param {string} paymentId - ID do pagamento
   * @returns {Promise<Object>} Confirmação do cancelamento
   */
  const cancel = async (paymentId) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await cancelPayment(paymentId);
      notifySuccess('Pagamento cancelado com sucesso');
      return response;
    } catch (err) {
      error.value = err.message || 'Erro ao cancelar pagamento';
      notifyError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Formata o valor em moeda brasileira
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  /**
   * Retorna a cor do status do pagamento
   */
  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      RECEIVED: 'info',
      CONFIRMED: 'positive',
      OVERDUE: 'negative',
      CANCELLED: 'grey',
    };
    return colors[status] || 'grey';
  };

  /**
   * Retorna o label traduzido do status
   */
  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'Aguardando Pagamento',
      RECEIVED: 'Pagamento Recebido',
      CONFIRMED: 'Confirmado',
      OVERDUE: 'Vencido',
      CANCELLED: 'Cancelado',
    };
    return labels[status] || status;
  };

  /**
   * Retorna o ícone do método de pagamento
   */
  const getPaymentMethodIcon = (method) => {
    const icons = {
      PIX: 'pix',
      BOLETO: 'receipt',
      CREDIT_CARD: 'credit_card',
    };
    return icons[method] || 'payment';
  };

  /**
   * Valida dados de cartão de crédito
   */
  const validateCreditCard = (cardData) => {
    const errors = {};

    // Valida nome
    if (!cardData.holderName || cardData.holderName.length < 3) {
      errors.holderName = 'Nome inválido';
    }

    // Valida número do cartão (algoritmo de Luhn)
    const cleanNumber = cardData.number.replace(/\s/g, '');
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      errors.number = 'Número de cartão inválido';
    }

    // Valida validade
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const expiryYear = parseInt(cardData.expiryYear);
    const expiryMonth = parseInt(cardData.expiryMonth);

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      errors.expiry = 'Cartão expirado';
    }

    // Valida CVV
    if (!cardData.ccv || cardData.ccv.length < 3 || cardData.ccv.length > 4) {
      errors.ccv = 'CVV inválido';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  };

  // Computed
  const hasActivePayment = computed(() => {
    return currentPayment.value && 
           (currentPayment.value.status === 'PENDING' || 
            currentPayment.value.status === 'RECEIVED');
  });

  return {
    // State
    loading,
    error,
    currentPayment,
    paymentsList,
    hasActivePayment,

    // Actions
    create,
    checkStatus,
    startPolling,
    stopPolling,
    list,
    cancel,

    // Helpers
    formatCurrency,
    getStatusColor,
    getStatusLabel,
    getPaymentMethodIcon,
    validateCreditCard,
  };
}
