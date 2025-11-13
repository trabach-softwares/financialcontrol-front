# 📅 MonthNavigator - Navegação Mensal com Lançamentos Futuros

## 🎯 Visão Geral

Componente alternativo ao `PeriodFilter` com navegação simplificada por mês, incluindo suporte para **lançamentos futuros**.

Baseado no padrão visual moderno (como mostrado na imagem de referência).

---

## 🎨 Visual

```
┌──────────────────────────────────┐
│  ◀  NOV DE 2025 • ATUAL  ▶      │
└──────────────────────────────────┘
```

**Estados:**
- **ATUAL** (badge azul) - Mês corrente
- **FUTURO** (badge info) - Meses futuros
- Sem badge - Meses passados

---

## 📦 Como Usar

### **Uso Básico:**

```vue
<template>
  <MonthNavigator 
    @change="handleMonthChange"
    storage-key="dashboard-month"
  />
</template>

<script setup>
import MonthNavigator from 'src/components/MonthNavigator.vue';

const handleMonthChange = (range) => {
  console.log('Mês alterado:', range);
  // { startDate: '2025-11-01', endDate: '2025-11-30' }
  
  // Recarregar dados com o novo período
  loadData(range);
};
</script>
```

---

## 🔧 Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `loading` | Boolean | `false` | Desabilita botões durante carregamento |
| `storageKey` | String | `'month-navigator-date'` | Chave do localStorage para persistência |

---

## 🎯 Eventos

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `@change` | `{ startDate, endDate }` | Emitido quando o mês muda |

---

## ✨ Funcionalidades

### **1. Navegação por Setas**
- **← Anterior**: Vai para o mês anterior
- **→ Próximo**: Vai para o próximo mês

### **2. Seletor de Mês/Ano**
- Clique no mês atual abre um dialog
- Escolha qualquer mês/ano
- Botão "Hoje" volta para mês atual

### **3. Badges Automáticos**
- **ATUAL**: Mês corrente (Nov 2025)
- **FUTURO**: Meses à frente (Dez 2025, Jan 2026...)
- Sem badge: Meses passados

### **4. Persistência**
- Salva último mês visualizado
- Restaura ao reabrir a página

### **5. Lançamentos Futuros** 🔮
- Navega para meses futuros
- Badge "FUTURO" destaca claramente
- Perfeito para ver contas a pagar/receber

---

## 📱 Exemplo Completo: Dashboard

```vue
<template>
  <q-page class="dashboard">
    
    <!-- Navegador de Mês -->
    <div class="row q-mb-lg">
      <div class="col-12 col-md-6 col-lg-4">
        <MonthNavigator 
          @change="handleMonthChange"
          :loading="isLoading"
          storage-key="dashboard-month"
        />
      </div>
    </div>

    <!-- Cards de Métricas (filtrados pelo mês) -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Receitas</div>
            <div class="text-h4">{{ formatCurrency(stats.income) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Mais cards... -->
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import MonthNavigator from 'src/components/MonthNavigator.vue';
import { useDashboardStore } from 'src/stores/dashboard';

const dashboardStore = useDashboardStore();
const isLoading = ref(false);

const handleMonthChange = async (range) => {
  isLoading.value = true;
  
  try {
    await dashboardStore.loadStats({
      start_date: range.startDate,
      end_date: range.endDate,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
```

---

## 📱 Exemplo: Transações

```vue
<template>
  <q-page class="transactions">
    
    <!-- Navegador de Mês + Filtros -->
    <div class="row q-col-gutter-md q-mb-lg">
      
      <!-- Navegador de Mês -->
      <div class="col-12 col-md-4">
        <MonthNavigator 
          @change="handleMonthChange"
          storage-key="transactions-month"
        />
      </div>

      <!-- Filtros Adicionais -->
      <div class="col-12 col-md-8">
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-select 
              v-model="filters.type" 
              label="Tipo"
              :options="['Receita', 'Despesa']"
            />
          </div>
          <div class="col-6">
            <q-select 
              v-model="filters.status" 
              label="Status"
              :options="['Pago', 'Pendente']"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Transações -->
    <TransactionList :transactions="filteredTransactions" />

  </q-page>
</template>
```

---

## 🔮 Casos de Uso: Lançamentos Futuros

### **1. Contas a Pagar**
```
Nov 2025 (ATUAL)
  - Aluguel: R$ 1.200 (Pago)
  - Luz: R$ 150 (Pendente)

→ Clica próximo mês →

Dez 2025 (FUTURO)
  - Aluguel: R$ 1.200 (Pendente)
  - Escola: R$ 800 (Pendente)
  - IPTU: R$ 500 (Pendente)
```

### **2. Receitas Futuras**
```
Nov 2025 (ATUAL)
  - Salário: R$ 5.000 (Pago)

→ Clica próximo mês →

Dez 2025 (FUTURO)
  - Salário: R$ 5.000 (Pendente)
  - 13º Salário: R$ 2.500 (Pendente)
```

### **3. Planejamento**
```
Usuário está em Nov 2025
↓
Quer saber quanto vai gastar em Jan 2026
↓
Clica 2x no botão → (Dez → Jan)
↓
Vê: "JAN DE 2026 • FUTURO"
↓
Lista mostra contas já lançadas:
  - Matrícula Escola: R$ 1.500
  - IPTU: R$ 600
  - Seguro Carro: R$ 1.200
```

---

## 🎨 Customização

### **Cores dos Badges:**

```scss
// Badge "ATUAL"
.month-badge.bg-primary {
  background: #2C5F2D !important; // Verde
}

// Badge "FUTURO"
.month-badge.bg-info {
  background: #0288D1 !important; // Azul
}
```

### **Tamanho Mobile:**

O componente já é responsivo, mas você pode ajustar:

```scss
@media (max-width: 599px) {
  .month-navigator {
    .current-month {
      min-width: 140px;
      
      .month-label {
        font-size: 12px;
      }
    }
  }
}
```

---

## 🆚 MonthNavigator vs PeriodFilter

| Característica | MonthNavigator | PeriodFilter |
|----------------|----------------|--------------|
| **Visual** | Botões de navegação | Dropdown |
| **Foco** | Navegação mês a mês | Períodos variados |
| **Lançamentos Futuros** | ✅ Sim (badge FUTURO) | ❌ Não |
| **Períodos** | Apenas mês completo | 9 opções (3 meses, 6 meses, etc) |
| **Complexidade** | Simples | Mais opções |
| **Mobile** | Muito amigável | Bom |
| **Uso recomendado** | Dashboard, Transações diárias | Relatórios, Análises |

---

## 💡 Quando Usar Cada Um?

### **Use MonthNavigator quando:**
- ✅ Usuário quer navegar cronologicamente
- ✅ Lançamentos futuros são importantes
- ✅ Interface mais simples é melhor
- ✅ Foco em mês atual/anterior/próximo

### **Use PeriodFilter quando:**
- ✅ Precisa de análises de períodos variados
- ✅ Comparação de trimestres/semestres
- ✅ Range personalizado é necessário
- ✅ Foco em análise histórica

---

## 🔄 Usar os Dois Juntos?

**Sim! Você pode:**

```vue
<template>
  <!-- Navegação rápida -->
  <MonthNavigator 
    @change="handleQuickNav"
    storage-key="quick-nav"
  />

  <!-- Filtro avançado (colapsável) -->
  <q-expansion-item label="Filtros Avançados">
    <PeriodFilter 
      @change="handleAdvancedFilter"
      storage-key="advanced-filter"
    />
  </q-expansion-item>
</template>
```

---

## ✅ Checklist de Implementação

- [ ] Importar `MonthNavigator`
- [ ] Adicionar no template
- [ ] Criar handler `handleMonthChange`
- [ ] Atualizar `loadData` com range de datas
- [ ] Testar navegação (anterior/próximo)
- [ ] Testar seletor de mês/ano
- [ ] Testar badge "ATUAL" e "FUTURO"
- [ ] Testar persistência no localStorage
- [ ] Validar lançamentos futuros funcionando

---

## 🎯 Exemplo Backend: Lançamentos Futuros

Para lançamentos futuros funcionarem, o backend precisa:

```javascript
// Ao criar transação
POST /api/transactions
{
  "type": "expense",
  "amount": 1200,
  "description": "Aluguel",
  "date": "2025-12-05", // Data futura!
  "paid": false,        // Pendente
  "category": "Moradia"
}

// Ao buscar transações
GET /api/transactions?start_date=2025-12-01&end_date=2025-12-31

// Retorna transações futuras também:
[
  {
    "id": 123,
    "date": "2025-12-05",
    "description": "Aluguel",
    "amount": 1200,
    "paid": false,
    "is_future": true // Campo útil!
  }
]
```

---

## 📝 Exemplo de Uso Real

```vue
<template>
  <q-page class="dashboard-page">
    
    <!-- Cabeçalho -->
    <div class="page-header q-mb-lg">
      <h1>Dashboard Financeiro</h1>
      <p>Acompanhe suas finanças mês a mês</p>
    </div>

    <!-- Navegador de Mês -->
    <div class="row q-mb-lg">
      <div class="col-12 col-md-6 col-lg-4">
        <MonthNavigator 
          @change="handleMonthChange"
          :loading="isLoading"
          storage-key="dashboard-month"
        />
      </div>
      
      <!-- Info se é mês futuro -->
      <div v-if="isFutureMonth" class="col-12 q-mt-sm">
        <q-banner class="bg-info text-white">
          <template v-slot:avatar>
            <q-icon name="info" />
          </template>
          Você está visualizando lançamentos futuros. 
          As transações marcadas como "Pendente" ainda não foram pagas.
        </q-banner>
      </div>
    </div>

    <!-- Resto do dashboard... -->

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { isAfter } from 'date-fns';
import MonthNavigator from 'src/components/MonthNavigator.vue';

const isLoading = ref(false);
const currentRange = ref(null);

const isFutureMonth = computed(() => {
  if (!currentRange.value) return false;
  return isAfter(new Date(currentRange.value.startDate), new Date());
});

const handleMonthChange = async (range) => {
  currentRange.value = range;
  isLoading.value = true;
  
  try {
    // Carregar dados...
  } finally {
    isLoading.value = false;
  }
};
</script>
```

---

**Criado em:** 13 de novembro de 2025  
**Versão:** 1.0.0  
**Componente:** `src/components/MonthNavigator.vue`
