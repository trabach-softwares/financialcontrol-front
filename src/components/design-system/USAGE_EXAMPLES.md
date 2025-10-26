# 📚 Exemplos de Uso - Design System Components

Componentes criados com a paleta **Sage Accountant** e acessibilidade **WCAG 2.1 AA**.

---

## 1. 📊 MetricCard

**Localização:** `src/components/design-system/molecules/MetricCard.vue`

### Uso Básico

```vue
<script setup>
import MetricCard from 'src/components/design-system/molecules/MetricCard.vue'
</script>

<template>
  <div class="row q-gutter-md">
    <!-- Receitas -->
    <MetricCard
      class="col"
      label="Receitas Totais"
      :value="15250.50"
      icon="trending_up"
      type="positive"
      currency
      :change="12.5"
    />

    <!-- Despesas -->
    <MetricCard
      class="col"
      label="Despesas Totais"
      :value="8430.00"
      icon="trending_down"
      type="negative"
      currency
      :change="-5.2"
    />

    <!-- Saldo -->
    <MetricCard
      class="col"
      label="Saldo Atual"
      :value="6820.50"
      icon="account_balance_wallet"
      type="neutral"
      currency
    />
  </div>
</template>
```

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `label` | String | - | **Obrigatório.** Label do card |
| `value` | Number/String | 0 | Valor numérico a ser exibido |
| `icon` | String | 'payments' | Ícone Material Icons |
| `type` | String | 'neutral' | Tipo: 'positive', 'negative', 'neutral', 'info', 'warning' |
| `currency` | Boolean | false | Formatar como moeda |
| `change` | Number | null | Variação percentual (ex: 12.5) |
| `loading` | Boolean | false | Estado de carregamento |
| `locale` | String | 'pt-BR' | Locale para formatação |
| `currencyCode` | String | 'BRL' | Código da moeda |

### Exemplos Avançados

```vue
<!-- Com loading -->
<MetricCard
  label="Carregando..."
  :value="0"
  type="info"
  :loading="true"
/>

<!-- Sem variação -->
<MetricCard
  label="Total de Transações"
  :value="247"
  icon="receipt_long"
  type="info"
/>

<!-- Moeda diferente -->
<MetricCard
  label="Revenue (USD)"
  :value="5000"
  icon="attach_money"
  type="positive"
  currency
  locale="en-US"
  currency-code="USD"
/>
```

---

## 2. 🏷️ StatusBadge

**Localização:** `src/components/design-system/atoms/StatusBadge.vue`

### Uso Básico

```vue
<script setup>
import StatusBadge from 'src/components/design-system/atoms/StatusBadge.vue'
</script>

<template>
  <div class="q-gutter-sm">
    <StatusBadge label="Ativo" type="success" />
    <StatusBadge label="Pendente" type="warning" />
    <StatusBadge label="Cancelado" type="error" />
    <StatusBadge label="Em Análise" type="info" />
  </div>
</template>
```

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `label` | String | - | **Obrigatório.** Texto do badge |
| `type` | String | 'neutral' | Tipo: 'success', 'error', 'warning', 'info', 'neutral', 'primary', 'secondary' |
| `size` | String | 'md' | Tamanho: 'sm', 'md', 'lg' |
| `icon` | String | null | Ícone Material Icons |
| `outlined` | Boolean | false | Variante outlined |
| `rounded` | Boolean | true | Bordas arredondadas (pill) |
| `dot` | Boolean | false | Mostrar dot indicator animado |

### Exemplos Avançados

```vue
<!-- Com ícone -->
<StatusBadge 
  label="Pago" 
  type="success" 
  icon="check_circle" 
/>

<!-- Outlined -->
<StatusBadge 
  label="Rascunho" 
  type="neutral" 
  outlined 
/>

<!-- Tamanhos diferentes -->
<StatusBadge label="Pequeno" size="sm" type="info" />
<StatusBadge label="Médio" size="md" type="info" />
<StatusBadge label="Grande" size="lg" type="info" />

<!-- Com dot animado -->
<StatusBadge 
  label="Online" 
  type="success" 
  dot 
/>

<!-- Sem arredondamento -->
<StatusBadge 
  label="Tag" 
  type="primary" 
  :rounded="false" 
/>
```

---

## 3. 📭 EmptyState

**Localização:** `src/components/design-system/molecules/EmptyState.vue`

### Uso Básico

```vue
<script setup>
import EmptyState from 'src/components/design-system/molecules/EmptyState.vue'

const handleAddTransaction = () => {
  console.log('Adicionar transação')
}
</script>

<template>
  <EmptyState
    icon="inbox"
    title="Nenhuma transação encontrada"
    message="Adicione sua primeira transação para começar a controlar suas finanças."
    action-label="Adicionar Transação"
    action-icon="add"
    @action="handleAddTransaction"
  />
</template>
```

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `icon` | String | 'inbox' | Ícone Material Icons |
| `iconColor` | String | 'grey-5' | Cor do ícone |
| `title` | String | - | **Obrigatório.** Título |
| `message` | String | null | Mensagem descritiva |
| `actionLabel` | String | null | Label do botão principal |
| `actionIcon` | String | null | Ícone do botão principal |
| `actionColor` | String | 'primary' | Cor do botão principal |
| `secondaryActionLabel` | String | null | Label do botão secundário |
| `secondaryActionIcon` | String | null | Ícone do botão secundário |
| `size` | String | 'md' | Tamanho: 'sm', 'md', 'lg' |
| `centered` | Boolean | false | Centralizar verticalmente |

### Eventos

- `@action` - Emitido ao clicar no botão principal
- `@secondary-action` - Emitido ao clicar no botão secundário

### Exemplos Avançados

```vue
<!-- Com duas ações -->
<EmptyState
  icon="folder_open"
  title="Nenhum relatório gerado"
  message="Gere seu primeiro relatório para visualizar insights financeiros."
  action-label="Gerar Relatório"
  action-icon="assessment"
  secondary-action-label="Ver Tutorial"
  secondary-action-icon="help"
  @action="generateReport"
  @secondary-action="showTutorial"
/>

<!-- Centralizado verticalmente -->
<EmptyState
  icon="search_off"
  title="Nenhum resultado encontrado"
  message="Tente ajustar os filtros ou usar outros termos de busca."
  centered
/>

<!-- Com slot customizado -->
<EmptyState
  icon="error_outline"
  title="Erro ao carregar dados"
  size="lg"
>
  <template #default>
    <q-banner class="bg-negative text-white">
      <template v-slot:avatar>
        <q-icon name="error" />
      </template>
      Detalhes do erro: Conexão perdida
    </q-banner>
  </template>
</EmptyState>

<!-- Tamanhos diferentes -->
<EmptyState
  icon="info"
  title="Dica"
  message="Mensagem pequena"
  size="sm"
/>
```

---

## 4. ⚠️ ConfirmDialog

**Localização:** `src/components/design-system/organisms/ConfirmDialog.vue`

### Uso Básico

```vue
<script setup>
import { ref } from 'vue'
import ConfirmDialog from 'src/components/design-system/organisms/ConfirmDialog.vue'

const showDialog = ref(false)
const isDeleting = ref(false)

const handleDelete = async () => {
  isDeleting.value = true
  
  try {
    await deleteTransaction()
    showDialog.value = false
    notifySuccess('Transação excluída')
  } catch (error) {
    notifyError('Erro ao excluir')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <!-- Botão que abre o dialog -->
  <q-btn 
    label="Excluir" 
    color="negative" 
    @click="showDialog = true" 
  />

  <!-- Dialog -->
  <ConfirmDialog
    v-model="showDialog"
    type="danger"
    title="Confirmar exclusão?"
    message="Esta ação não pode ser desfeita. A transação será excluída permanentemente."
    confirm-label="Excluir"
    cancel-label="Cancelar"
    :loading="isDeleting"
    @confirm="handleDelete"
    @cancel="showDialog = false"
  />
</template>
```

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `v-model` | Boolean | false | Controla visibilidade |
| `title` | String | - | **Obrigatório.** Título do dialog |
| `message` | String | - | **Obrigatório.** Mensagem descritiva |
| `type` | String | 'warning' | Tipo: 'danger', 'warning', 'info', 'success' |
| `confirmLabel` | String | 'Confirmar' | Label do botão confirmar |
| `cancelLabel` | String | 'Cancelar' | Label do botão cancelar |
| `confirmColor` | String | null | Cor do botão confirmar (sobrescreve padrão) |
| `cancelColor` | String | 'grey-7' | Cor do botão cancelar |
| `loading` | Boolean | false | Estado de loading |
| `maximized` | Boolean | false | Maximizar em mobile |
| `actionsAlign` | String | 'right' | Alinhamento: 'left', 'center', 'right', 'between', 'around' |

### Eventos

- `@confirm` - Emitido ao confirmar
- `@cancel` - Emitido ao cancelar

### Exemplos Avançados

```vue
<!-- Tipo Warning (padrão) -->
<ConfirmDialog
  v-model="showWarning"
  type="warning"
  title="Tem certeza?"
  message="Você está prestes a modificar dados importantes."
  @confirm="handleWarning"
/>

<!-- Tipo Info -->
<ConfirmDialog
  v-model="showInfo"
  type="info"
  title="Informação"
  message="Esta ação irá enviar um email de confirmação."
  confirm-label="Enviar"
  @confirm="sendEmail"
/>

<!-- Tipo Success -->
<ConfirmDialog
  v-model="showSuccess"
  type="success"
  title="Operação concluída"
  message="Os dados foram salvos com sucesso!"
  confirm-label="OK"
  :cancel-label="null"
  @confirm="showSuccess = false"
/>

<!-- Com conteúdo customizado -->
<ConfirmDialog
  v-model="showCustom"
  type="danger"
  title="Excluir múltiplos itens?"
  message="Você está prestes a excluir os seguintes itens:"
  @confirm="deleteMultiple"
>
  <template #default>
    <q-list dense bordered>
      <q-item v-for="item in selectedItems" :key="item.id">
        <q-item-section>{{ item.name }}</q-item-section>
      </q-item>
    </q-list>
  </template>
</ConfirmDialog>

<!-- Botões centralizados -->
<ConfirmDialog
  v-model="showCentered"
  title="Sair do sistema?"
  message="Você será desconectado."
  actions-align="center"
  @confirm="logout"
/>
```

---

## 🎨 Combinando Componentes

### Dashboard com Métricas

```vue
<template>
  <div class="dashboard">
    <!-- Métricas -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <MetricCard
          label="Receitas"
          :value="totalIncome"
          icon="trending_up"
          type="positive"
          currency
          :change="12.5"
        />
      </div>
      
      <div class="col-12 col-sm-6 col-md-3">
        <MetricCard
          label="Despesas"
          :value="totalExpense"
          icon="trending_down"
          type="negative"
          currency
          :change="-3.2"
        />
      </div>
    </div>

    <!-- Tabela com Status Badges -->
    <q-table :rows="transactions">
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <StatusBadge
            :label="props.value"
            :type="getStatusType(props.value)"
            size="sm"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Empty State quando não há dados -->
    <EmptyState
      v-if="transactions.length === 0"
      icon="receipt_long"
      title="Nenhuma transação"
      message="Comece adicionando sua primeira transação."
      action-label="Adicionar"
      @action="showAddDialog = true"
    />
  </div>
</template>
```

---

## 🎯 Boas Práticas

### 1. Acessibilidade
```vue
<!-- ✅ BOM: Com ARIA labels -->
<ConfirmDialog
  title="Excluir conta?"
  message="Esta ação é irreversível"
  confirm-aria-label="Confirmar exclusão da conta"
  cancel-aria-label="Cancelar e voltar"
/>

<!-- ❌ EVITAR: Sem contexto -->
<ConfirmDialog
  title="Confirmar?"
  message="Tem certeza?"
/>
```

### 2. Consistência Visual
```vue
<!-- ✅ BOM: Usar tipos consistentes -->
<StatusBadge label="Pago" type="success" />
<MetricCard type="positive" /> <!-- Mesma cor -->

<!-- ❌ EVITAR: Misturar cores sem padrão -->
<StatusBadge label="Pago" type="info" />
<MetricCard type="positive" />
```

### 3. Loading States
```vue
<!-- ✅ BOM: Mostrar loading -->
<MetricCard
  label="Receitas"
  :value="income"
  :loading="isLoadingData"
/>

<!-- ✅ BOM: Loading em ações -->
<ConfirmDialog
  @confirm="deleteItem"
  :loading="isDeleting"
/>
```

---

## 📱 Responsividade

Todos os componentes são responsivos por padrão:

```vue
<!-- Grid responsivo com MetricCards -->
<div class="row q-col-gutter-md">
  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
    <MetricCard ... />
  </div>
</div>

<!-- EmptyState adapta tamanho automaticamente -->
<EmptyState size="md" /> <!-- Reduz em mobile -->
```

---

## 🎨 Personalização de Cores

Sempre use as cores da paleta Sage Accountant:

```vue
<!-- MetricCard -->
<MetricCard type="positive" /> <!-- Verde #107C10 -->
<MetricCard type="negative" /> <!-- Vermelho #D13438 -->
<MetricCard type="neutral" />  <!-- Verde contábil #2C5F2D -->

<!-- StatusBadge -->
<StatusBadge type="success" /> <!-- Verde #107C10 -->
<StatusBadge type="error" />   <!-- Vermelho #D13438 -->
<StatusBadge type="primary" /> <!-- Verde contábil #2C5F2D -->
```

---

**Última Atualização:** 26/10/2025  
**Versão:** 1.0.0
