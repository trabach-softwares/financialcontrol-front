import { ref, computed } from 'vue';
import { plansList, plansGetById } from 'src/apis/plans';
import { useNotifications } from './useNotifications';

/**
 * Composable para gerenciar planos de assinatura
 * Fornece funcionalidades para listar e consultar planos
 */
export function usePlans() {
  const { showError } = useNotifications();
  
  const loading = ref(false);
  const error = ref(null);
  const plans = ref([]);
  const currentPlan = ref(null);

  /**
   * Lista todos os planos disponíveis
   * @param {Object} filters - Filtros opcionais
   * @returns {Promise<Array>} Lista de planos
   */
  const list = async (filters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await plansList(filters);
      plans.value = response.data || response;
      return plans.value;
    } catch (err) {
      error.value = err.message || 'Erro ao carregar planos';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca um plano específico por ID
   * @param {string} planId - ID do plano
   * @returns {Promise<Object>} Dados do plano
   */
  const getById = async (planId) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await plansGetById(planId);
      currentPlan.value = response.data || response;
      return currentPlan.value;
    } catch (err) {
      error.value = err.message || 'Erro ao carregar plano';
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Formata o valor do plano em moeda brasileira
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  /**
   * Retorna o label do ciclo de cobrança
   */
  const getBillingCycleLabel = (cycle) => {
    const labels = {
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      semiannually: 'Semestral',
      yearly: 'Anual',
    };
    return labels[cycle] || cycle;
  };

  /**
   * Calcula desconto em relação ao plano mensal
   */
  const calculateDiscount = (yearlyPrice, monthlyPrice) => {
    const totalMonthly = monthlyPrice * 12;
    const discount = ((totalMonthly - yearlyPrice) / totalMonthly) * 100;
    return Math.round(discount);
  };

  /**
   * Filtra apenas planos ativos
   */
  const activePlans = computed(() => {
    return plans.value.filter(plan => plan.is_active);
  });

  /**
   * Retorna o plano mais popular (pode ser definido por flag ou lógica)
   */
  const popularPlan = computed(() => {
    return plans.value.find(plan => plan.is_popular) || plans.value[1];
  });

  /**
   * Ordena planos por preço
   */
  const sortedByPrice = computed(() => {
    return [...plans.value].sort((a, b) => a.price - b.price);
  });

  return {
    // State
    loading,
    error,
    plans,
    currentPlan,
    activePlans,
    popularPlan,
    sortedByPrice,

    // Actions
    list,
    getById,

    // Helpers
    formatPrice,
    getBillingCycleLabel,
    calculateDiscount,
  };
}
