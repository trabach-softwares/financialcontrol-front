<template>
  <div class="month-navigator">
    <div class="navigator-wrapper">
      
      <!-- Botão Anterior -->
      <q-btn
        icon="chevron_left"
        round
        flat
        dense
        color="primary"
        @click="previousMonth"
        :disable="loading"
      >
        <q-tooltip>Mês anterior</q-tooltip>
      </q-btn>

      <!-- Mês/Ano Atual com Badge -->
      <div class="current-month" @click="showMonthPicker = true">
        <div class="month-label">
          {{ currentMonthLabel }}
        </div>
        <q-badge 
          v-if="isCurrentMonth" 
          color="primary" 
          class="month-badge"
        >
          ATUAL
        </q-badge>
        <q-badge 
          v-else-if="isFutureMonth" 
          color="info" 
          class="month-badge"
        >
          FUTURO
        </q-badge>
      </div>

      <!-- Botão Próximo -->
      <q-btn
        icon="chevron_right"
        round
        flat
        dense
        color="primary"
        @click="nextMonth"
        :disable="loading"
      >
        <q-tooltip>Próximo mês</q-tooltip>
      </q-btn>

    </div>

    <!-- Dialog para selecionar mês/ano específico -->
    <q-dialog v-model="showMonthPicker">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Selecionar Período</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-md">
            <div class="col-7">
              <q-select
                v-model="selectedMonth"
                :options="monthOptions"
                label="Mês"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col-5">
              <q-select
                v-model="selectedYear"
                :options="yearOptions"
                label="Ano"
                outlined
                dense
              />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn
              label="Hoje"
              color="grey-7"
              flat
              dense
              size="sm"
              @click="goToCurrentMonth"
              class="q-mr-sm"
            />
            <q-btn
              label="Aplicar"
              color="primary"
              unelevated
              @click="applyMonthSelection"
              class="float-right"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { startOfMonth, endOfMonth, addMonths, subMonths, format, isSameMonth, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  storageKey: {
    type: String,
    default: 'month-navigator-date',
  },
});

const emit = defineEmits(['change']);

// Estado
const currentDate = ref(new Date());
const showMonthPicker = ref(false);
const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());

// Opções de meses
const monthOptions = [
  { label: 'Janeiro', value: 0 },
  { label: 'Fevereiro', value: 1 },
  { label: 'Março', value: 2 },
  { label: 'Abril', value: 3 },
  { label: 'Maio', value: 4 },
  { label: 'Junho', value: 5 },
  { label: 'Julho', value: 6 },
  { label: 'Agosto', value: 7 },
  { label: 'Setembro', value: 8 },
  { label: 'Outubro', value: 9 },
  { label: 'Novembro', value: 10 },
  { label: 'Dezembro', value: 11 },
];

// Opções de anos (últimos 5 anos + próximos 2)
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push(i);
  }
  return years;
});

// Label do mês atual
const currentMonthLabel = computed(() => {
  return format(currentDate.value, "MMM 'de' yyyy", { locale: ptBR }).toUpperCase();
});

// Verifica se é o mês atual
const isCurrentMonth = computed(() => {
  return isSameMonth(currentDate.value, new Date());
});

// Verifica se é mês futuro
const isFutureMonth = computed(() => {
  return isAfter(currentDate.value, new Date()) && !isCurrentMonth.value;
});

// Range de datas do mês
const dateRange = computed(() => {
  return {
    startDate: format(startOfMonth(currentDate.value), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(currentDate.value), 'yyyy-MM-dd'),
  };
});

/**
 * Navega para o mês anterior
 */
const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1);
  savePreference();
  emitChange();
};

/**
 * Navega para o próximo mês
 */
const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1);
  savePreference();
  emitChange();
};

/**
 * Vai para o mês atual
 */
const goToCurrentMonth = () => {
  currentDate.value = new Date();
  selectedMonth.value = currentDate.value.getMonth();
  selectedYear.value = currentDate.value.getFullYear();
  showMonthPicker.value = false;
  savePreference();
  emitChange();
};

/**
 * Aplica seleção do mês/ano
 */
const applyMonthSelection = () => {
  currentDate.value = new Date(selectedYear.value, selectedMonth.value, 1);
  showMonthPicker.value = false;
  savePreference();
  emitChange();
};

/**
 * Emite evento de mudança
 */
const emitChange = () => {
  emit('change', dateRange.value);
};

/**
 * Salva preferência no localStorage
 */
const savePreference = () => {
  try {
    localStorage.setItem(props.storageKey, format(currentDate.value, 'yyyy-MM-dd'));
  } catch (error) {
    console.error('Erro ao salvar preferência de mês:', error);
  }
};

/**
 * Carrega preferência do localStorage
 * IMPORTANTE: Sempre inicializa com mês atual ao montar o componente
 */
const loadPreference = () => {
  try {
    // SEMPRE inicializa com o mês atual
    currentDate.value = new Date();
    selectedMonth.value = currentDate.value.getMonth();
    selectedYear.value = currentDate.value.getFullYear();
    console.log('📅 [MONTH-NAVIGATOR] Inicializando com mês atual')
    
    // Limpa qualquer preferência antiga
    localStorage.removeItem(props.storageKey);
  } catch (error) {
    console.error('Erro ao inicializar mês:', error);
  }
};

// Atualiza selectedMonth e selectedYear quando currentDate mudar
watch(currentDate, (newDate) => {
  selectedMonth.value = newDate.getMonth();
  selectedYear.value = newDate.getFullYear();
});

// Carrega preferência e emite evento inicial
loadPreference();
emitChange();
</script>

<style lang="scss" scoped>
.month-navigator {
  width: 100%;
}

.navigator-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(25, 118, 210, 0.3);
    box-shadow: 0 4px 20px rgba(25, 118, 210, 0.12);
    transform: translateY(-1px);
  }
  
  .q-btn {
    border-radius: 12px;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(25, 118, 210, 0.08);
      transform: scale(1.1);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

.current-month {
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  min-width: 160px;
  position: relative;

  &:hover {
    background: linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.08) 100%);
  }
  
  &:active {
    transform: scale(0.98);
  }

  .month-label {
    font-size: 14px;
    font-weight: 700;
    color: #1976D2;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .month-badge {
    font-size: 9px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: inline-block;
    margin-top: 2px;
  }
}

// Mobile
@media (max-width: 599px) {
  .navigator-wrapper {
    gap: 12px;
    padding: 12px 14px;
  }
  
  .current-month {
    min-width: 150px;
    padding: 8px 12px;
    
    .month-label {
      font-size: 13px;
    }
    
    .month-badge {
      font-size: 9px;
      padding: 3px 8px;
    }
  }
}
</style>
