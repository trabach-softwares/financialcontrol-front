# 🎨 DESIGN SYSTEM E COMPONENTES

## 📐 DESIGN TOKENS

### Spacing (Sistema 4px)
```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
}
```

### Border Radius
```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

### Typography
```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Shadows
```css
:root {
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
}
```

---

## 🧩 KIT MÍNIMO DE COMPONENTES

### 1. MetricCard.vue
**Propósito:** Card reutilizável para métricas do dashboard

```vue
<template>
  <q-card flat bordered class="metric-card">
    <q-card-section>
      <div class="row items-center justify-between">
        <div v-if="!loading" class="col">
          <div class="text-caption text-grey-6">{{ label }}</div>
          <div :class="`text-h5 q-mt-xs text-${color}`">{{ formattedValue }}</div>
          <div v-if="trend" :class="`text-caption text-${trendColor}`">
            <q-icon :name="trendIcon" size="xs" />
            {{ trend }}
          </div>
        </div>
        <q-skeleton v-else type="rect" width="100%" height="80px" />
        <q-icon :name="icon" :color="color" size="2.5rem" class="col-auto" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: [Number, String],
  icon: String,
  color: { type: String, default: 'primary' },
  trend: String,
  loading: Boolean,
  formatter: Function
})

const formattedValue = computed(() => {
  return props.formatter ? props.formatter(props.value) : props.value
})

const trendColor = computed(() => {
  if (!props.trend) return ''
  return props.trend.startsWith('+') ? 'positive' : 'negative'
})

const trendIcon = computed(() => {
  if (!props.trend) return ''
  return props.trend.startsWith('+') ? 'trending_up' : 'trending_down'
})
</script>

<style scoped>
.metric-card {
  transition: all 0.3s ease;
}
.metric-card:hover {
  box-shadow: var(--shadow-md);
}
</style>
```

**Uso:**
```vue
<MetricCard
  label="Receitas"
  :value="15000"
  icon="trending_up"
  color="positive"
  trend="+12%"
  :formatter="v => `R$ ${v.toLocaleString()}`"
/>
```

---

### 2. StatusBadge.vue
**Propósito:** Badge semântico para status

```vue
<template>
  <q-badge 
    :color="variantColor" 
    :label="label"
    :class="`status-badge status-badge--${size}`"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    validator: v => ['success', 'error', 'warning', 'info'].includes(v),
    default: 'info'
  },
  label: String,
  size: {
    type: String,
    validator: v => ['sm', 'md', 'lg'].includes(v),
    default: 'md'
  }
})

const variantColor = computed(() => {
  const map = {
    success: 'positive',
    error: 'negative',
    warning: 'warning',
    info: 'info'
  }
  return map[props.variant]
})
</script>

<style scoped>
.status-badge--sm { font-size: 0.75rem; }
.status-badge--md { font-size: 0.875rem; }
.status-badge--lg { font-size: 1rem; }
</style>
```

**Uso:**
```vue
<StatusBadge variant="success" label="Pago" />
<StatusBadge variant="error" label="Atrasado" size="sm" />
```

---

### 3. EmptyState.vue
**Propósito:** Estado vazio com CTA

```vue
<template>
  <div class="empty-state text-center q-pa-xl">
    <div class="empty-state__illustration q-mb-md">
      <q-icon :name="icon" size="6rem" color="grey-5" />
    </div>
    <h3 class="text-h5 text-grey-8 q-mb-sm">{{ title }}</h3>
    <p class="text-body2 text-grey-6 q-mb-lg">{{ description }}</p>
    <slot name="action">
      <q-btn 
        v-if="ctaLabel"
        color="primary" 
        :label="ctaLabel"
        size="lg"
        @click="$emit('action')"
      />
    </slot>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'inbox' },
  title: String,
  description: String,
  ctaLabel: String
})

defineEmits(['action'])
</script>
```

**Uso:**
```vue
<EmptyState
  icon="receipt_long"
  title="Nenhuma transação encontrada"
  description="Comece adicionando sua primeira receita ou despesa"
  cta-label="+ Adicionar Transação"
  @action="openTransactionForm"
/>
```

---

### 4. ConfirmDialog.vue
**Propósito:** Modal de confirmação reutilizável

```vue
<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center">
        <q-icon :name="icon" :color="variant" size="2rem" class="q-mr-md" />
        <div class="text-h6">{{ title }}</div>
      </q-card-section>
      
      <q-card-section>
        {{ message }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="cancel" />
        <q-btn 
          :color="variant" 
          :label="confirmLabel"
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: String,
  message: String,
  confirmLabel: { type: String, default: 'Confirmar' },
  variant: { type: String, default: 'primary' },
  icon: { type: String, default: 'help_outline' }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const show = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const confirm = () => {
  emit('confirm')
  show.value = false
}

const cancel = () => {
  emit('cancel')
  show.value = false
}
</script>
```

---

## 📚 DIRETRIZES DE USO

### Cores Semânticas

| **Contexto** | **Cor** | **Quando Usar** |
|--------------|---------|-----------------|
| Receitas/Lucro | `positive` (verde) | Valores positivos, crescimento |
| Despesas/Perdas | `negative` (vermelho) | Valores negativos, alertas críticos |
| Ações primárias | `primary` (azul) | CTAs principais, botões de submit |
| Informações neutras | `info` (azul claro) | Tooltips, mensagens informativas |
| Avisos | `warning` (amarelo) | Alertas não críticos, validações |

### Estados de Botão

```vue
<!-- Normal -->
<q-btn color="primary" label="Salvar" />

<!-- Desabilitado -->
<q-btn color="primary" label="Salvar" disable />

<!-- Loading -->
<q-btn color="primary" label="Salvando..." loading />

<!-- Com ícone -->
<q-btn color="primary" icon="add" label="Adicionar" />

<!-- Icon only -->
<q-btn flat round icon="edit" aria-label="Editar" />
```

### Hierarquia de Botões

1. **Primary:** Ação principal (1 por tela)
2. **Secondary:** Ações alternativas
3. **Flat:** Ações terciárias, menos destaque
4. **Outline:** Ações destrutivas (deletar, cancelar)

---

## 🎨 EXEMPLO DE APLICAÇÃO

### Dashboard Page Refatorado

```vue
<template>
  <q-page class="dashboard-page q-pa-md">
    <!-- Header -->
    <div class="q-mb-lg">
      <h1 class="text-h4 text-grey-8">Olá, {{ userName }}! 👋</h1>
      <p class="text-subtitle1 text-grey-6">Resumo das suas finanças</p>
    </div>

    <!-- Métricas -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <MetricCard
          label="Receitas"
          :value="stats.income"
          icon="trending_up"
          color="positive"
          :trend="stats.incomeGrowth"
          :loading="loading"
          :formatter="formatCurrency"
        />
      </div>
      <!-- Repetir para despesas, saldo, etc -->
    </div>

    <!-- Gráfico -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <h2 class="text-h6">Evolução Mensal</h2>
        <BarChart v-if="!loading" :data="chartData" />
        <q-skeleton v-else type="rect" height="300px" />
      </q-card-section>
    </q-card>

    <!-- Transações -->
    <q-card flat bordered>
      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <h2 class="text-h6">Últimas Transações</h2>
          <q-btn flat label="Ver todas" @click="goToTransactions" />
        </div>
        
        <q-table v-if="transactions.length" :rows="transactions" />
        <EmptyState
          v-else
          icon="receipt_long"
          title="Nenhuma transação ainda"
          description="Adicione sua primeira receita ou despesa"
          cta-label="+ Adicionar"
          @action="openForm"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>
```

---

## 📦 IMPLEMENTAÇÃO

**Passo 1:** Criar pasta de componentes
```bash
mkdir -p src/components/design-system
touch src/components/design-system/MetricCard.vue
touch src/components/design-system/StatusBadge.vue
touch src/components/design-system/EmptyState.vue
```

**Passo 2:** Criar index para exports
```javascript
// src/components/design-system/index.js
export { default as MetricCard } from './MetricCard.vue'
export { default as StatusBadge } from './StatusBadge.vue'
export { default as EmptyState } from './EmptyState.vue'
export { default as ConfirmDialog } from './ConfirmDialog.vue'
```

**Passo 3:** Usar nos componentes
```vue
<script setup>
import { MetricCard, EmptyState } from 'components/design-system'
</script>
```

---

## ✅ PRÓXIMOS PASSOS

1. Criar Storybook para documentação visual
2. Adicionar testes unitários (Vitest)
3. Expandir para 20+ componentes
4. Versionar design system separado (npm package)
