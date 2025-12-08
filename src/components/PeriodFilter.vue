<template>
  <q-card flat bordered class="period-filter-card" :class="{ 'theme-dark': isDark }" :dark="isDark">
    <q-card-section class="q-pb-sm">

      <!-- Cabeçalho com ícone e título -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-subtitle2 text-weight-medium flex items-center">
            <q-icon name="date_range" size="20px" class="q-mr-xs" color="primary" />
            Período
          </div>
          <div class="text-caption text-grey-7">
            {{ periodDescription }}
          </div>
        </div>
      </div>

      <!-- Seletor de período predefinido -->
      <q-select :model-value="selectedPeriod" :options="periodOptions" outlined dense emit-value map-options
        option-value="value" option-label="label" @update:model-value="handlePeriodChange" class="q-mb-sm">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-icon :name="scope.opt.icon" color="primary" size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- Datas personalizadas (exibido apenas quando "Personalizado" está selecionado) -->
      <div v-if="selectedPeriod === 'custom'" class="custom-dates-wrapper">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-6">
            <q-input v-model="localCustomStartDate" type="date" label="Data inicial" outlined dense
              @update:model-value="handleCustomDatesChange">
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6">
            <q-input v-model="localCustomEndDate" type="date" label="Data final" outlined dense
              @update:model-value="handleCustomDatesChange">
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <!-- Informação do range de datas atual -->
      <div v-if="dateRange.startDate && dateRange.endDate" class="date-range-info q-mt-sm">
        <q-chip size="sm" color="primary" text-color="white" dense>
          <q-icon name="calendar_today" size="16px" class="q-mr-xs" />
          {{ formatDateRange(dateRange.startDate, dateRange.endDate) }}
        </q-chip>
      </div>

      <!-- Botão de reset -->
      <div v-if="selectedPeriod !== 'current_month'" class="q-mt-sm text-right">
        <q-btn label="Voltar ao padrão" icon="refresh" size="sm" flat dense color="grey-7" @click="handleReset" />
      </div>

    </q-card-section>
  </q-card>
</template>

<script setup>
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuasar } from 'quasar';
import { usePeriodFilter } from 'src/composables/usePeriodFilter';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  storageKey: {
    type: String,
    default: 'period-filter-preference',
  },
});

const emit = defineEmits(['change']);

const $q = useQuasar()
const isDark = computed(() => $q.dark.isActive)

// Usar o composable
const {
  selectedPeriod,
  customStartDate,
  customEndDate,
  dateRange,
  periodLabel,
  periodDescription,
  periodOptions,
  setPeriod,
  setCustomDates,
  resetToDefault,
} = usePeriodFilter(props.storageKey);

// Datas personalizadas locais (para controle do input)
const localCustomStartDate = ref(customStartDate.value);
const localCustomEndDate = ref(customEndDate.value);

/**
 * Quando o período mudar, emite evento para o componente pai
 */
watch(dateRange, (newRange) => {
  emit('change', newRange);
}, { immediate: true });

/**
 * Handler para mudança de período
 */
const handlePeriodChange = (newPeriod) => {
  setPeriod(newPeriod);
};

/**
 * Handler para mudança de datas personalizadas
 */
const handleCustomDatesChange = () => {
  if (localCustomStartDate.value && localCustomEndDate.value) {
    setCustomDates(localCustomStartDate.value, localCustomEndDate.value);
  }
};

/**
 * Handler para reset
 */
const handleReset = () => {
  resetToDefault();
  localCustomStartDate.value = null;
  localCustomEndDate.value = null;
};

/**
 * Formata o range de datas para exibição
 */
const formatDateRange = (start, end) => {
  try {
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    const startFormatted = format(startDate, "dd 'de' MMM", { locale: ptBR });
    const endFormatted = format(endDate, "dd 'de' MMM 'de' yyyy", { locale: ptBR });

    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    return 'Data inválida';
  }
};
</script>

<style lang="scss">
@import '../css/index.scss';
</style>