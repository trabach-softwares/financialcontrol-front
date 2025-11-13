import { ref, computed, watch } from 'vue';
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears, format } from 'date-fns';

/**
 * Composable para gerenciar filtros de período
 * Fornece opções predefinidas e range personalizado
 * Persiste a preferência do usuário no localStorage
 */
export function usePeriodFilter(storageKey = 'period-filter-preference') {
  
  // Estado do período selecionado
  const selectedPeriod = ref(null);
  const customStartDate = ref(null);
  const customEndDate = ref(null);

  // Opções de período predefinidas
  const periodOptions = [
    {
      label: 'Mês atual',
      value: 'current_month',
      icon: 'event',
      description: 'Novembro 2025',
    },
    {
      label: 'Mês anterior',
      value: 'last_month',
      icon: 'event',
      description: 'Outubro 2025',
    },
    {
      label: 'Últimos 3 meses',
      value: 'last_3_months',
      icon: 'date_range',
      description: 'Set - Nov 2025',
    },
    {
      label: 'Últimos 6 meses',
      value: 'last_6_months',
      icon: 'date_range',
      description: 'Jun - Nov 2025',
    },
    {
      label: 'Últimos 12 meses',
      value: 'last_12_months',
      icon: 'date_range',
      description: 'Nov 2024 - Nov 2025',
    },
    {
      label: 'Ano atual',
      value: 'current_year',
      icon: 'calendar_today',
      description: '2025',
    },
    {
      label: 'Ano anterior',
      value: 'last_year',
      icon: 'calendar_today',
      description: '2024',
    },
    {
      label: 'Personalizado',
      value: 'custom',
      icon: 'tune',
      description: 'Escolha as datas',
    },
    {
      label: 'Tudo',
      value: 'all',
      icon: 'all_inclusive',
      description: 'Sem limite de data',
    },
  ];

  /**
   * Calcula o range de datas com base no período selecionado
   */
  const dateRange = computed(() => {
    const now = new Date();
    
    if (!selectedPeriod.value) {
      // Padrão: mês atual
      return {
        startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
      };
    }

    switch (selectedPeriod.value) {
      case 'current_month':
        return {
          startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
        };

      case 'last_month': {
        const lastMonth = subMonths(now, 1);
        return {
          startDate: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(lastMonth), 'yyyy-MM-dd'),
        };
      }

      case 'last_3_months': {
        const threeMonthsAgo = subMonths(now, 2);
        return {
          startDate: format(startOfMonth(threeMonthsAgo), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
        };
      }

      case 'last_6_months': {
        const sixMonthsAgo = subMonths(now, 5);
        return {
          startDate: format(startOfMonth(sixMonthsAgo), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
        };
      }

      case 'last_12_months': {
        const twelveMonthsAgo = subMonths(now, 11);
        return {
          startDate: format(startOfMonth(twelveMonthsAgo), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
        };
      }

      case 'current_year':
        return {
          startDate: format(startOfYear(now), 'yyyy-MM-dd'),
          endDate: format(endOfYear(now), 'yyyy-MM-dd'),
        };

      case 'last_year': {
        const lastYear = subYears(now, 1);
        return {
          startDate: format(startOfYear(lastYear), 'yyyy-MM-dd'),
          endDate: format(endOfYear(lastYear), 'yyyy-MM-dd'),
        };
      }

      case 'custom':
        return {
          startDate: customStartDate.value,
          endDate: customEndDate.value,
        };

      case 'all':
        return {
          startDate: null,
          endDate: null,
        };

      default:
        return {
          startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
        };
    }
  });

  /**
   * Label do período selecionado para exibição
   */
  const periodLabel = computed(() => {
    const option = periodOptions.find(opt => opt.value === selectedPeriod.value);
    return option ? option.label : 'Mês atual';
  });

  /**
   * Descrição do período selecionado
   */
  const periodDescription = computed(() => {
    const option = periodOptions.find(opt => opt.value === selectedPeriod.value);
    return option ? option.description : '';
  });

  /**
   * Carrega a preferência salva do localStorage
   */
  const loadPreference = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        selectedPeriod.value = data.period || 'current_month';
        if (data.customStartDate) customStartDate.value = data.customStartDate;
        if (data.customEndDate) customEndDate.value = data.customEndDate;
      } else {
        // Padrão: mês atual
        selectedPeriod.value = 'current_month';
      }
    } catch (error) {
      console.error('Erro ao carregar preferência de período:', error);
      selectedPeriod.value = 'current_month';
    }
  };

  /**
   * Salva a preferência no localStorage
   */
  const savePreference = () => {
    try {
      const data = {
        period: selectedPeriod.value,
        customStartDate: customStartDate.value,
        customEndDate: customEndDate.value,
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar preferência de período:', error);
    }
  };

  /**
   * Define o período selecionado
   */
  const setPeriod = (period) => {
    selectedPeriod.value = period;
    savePreference();
  };

  /**
   * Define datas personalizadas
   */
  const setCustomDates = (startDate, endDate) => {
    customStartDate.value = startDate;
    customEndDate.value = endDate;
    selectedPeriod.value = 'custom';
    savePreference();
  };

  /**
   * Reseta para o período padrão (mês atual)
   */
  const resetToDefault = () => {
    selectedPeriod.value = 'current_month';
    customStartDate.value = null;
    customEndDate.value = null;
    savePreference();
  };

  // Watch para salvar automaticamente quando mudar
  watch([selectedPeriod, customStartDate, customEndDate], () => {
    savePreference();
  });

  // Carrega a preferência ao inicializar
  loadPreference();

  return {
    // Estado
    selectedPeriod,
    customStartDate,
    customEndDate,

    // Computed
    dateRange,
    periodLabel,
    periodDescription,
    periodOptions,

    // Métodos
    setPeriod,
    setCustomDates,
    resetToDefault,
    loadPreference,
  };
}
