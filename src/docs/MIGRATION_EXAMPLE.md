# 📝 Exemplo Prático de Migração de Componente

## Componente: Página de Transações

Este exemplo mostra a migração completa de um componente Vue que lista, cria, atualiza e deleta transações.

---

## ❌ ANTES - Código Antigo

```vue
<template>
  <q-page padding>
    <!-- Lista de Transações -->
    <q-card>
      <q-card-section>
        <div class="text-h6">Transações</div>
      </q-card-section>
      
      <q-separator />
      
      <q-card-section>
        <!-- Filtros -->
        <div class="row q-gutter-md q-mb-md">
          <q-select
            v-model="filters.type"
            :options="typeOptions"
            label="Tipo"
            style="min-width: 200px"
            @update:model-value="loadTransactions"
          />
          
          <q-select
            v-model="filters.category"
            :options="categories"
            label="Categoria"
            style="min-width: 200px"
            @update:model-value="loadTransactions"
          />
        </div>
        
        <!-- Tabela -->
        <q-table
          :rows="transactions"
          :columns="columns"
          :loading="loading"
          row-key="id"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                icon="edit"
                @click="editTransaction(props.row)"
              />
              <q-btn
                flat
                round
                icon="delete"
                @click="deleteTransactionConfirm(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    
    <!-- Botão adicionar -->
    <q-btn
      fab
      icon="add"
      color="primary"
      @click="showCreateDialog = true"
      style="position: fixed; bottom: 20px; right: 20px;"
    />
    
    <!-- Dialog de criação/edição -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingTransaction ? 'Editar' : 'Nova' }} Transação
          </div>
        </q-card-section>
        
        <q-card-section>
          <q-form @submit="saveTransaction">
            <q-select
              v-model="form.type"
              :options="typeOptions"
              label="Tipo *"
              required
            />
            
            <q-input
              v-model.number="form.amount"
              type="number"
              label="Valor *"
              prefix="R$"
              required
            />
            
            <q-input
              v-model="form.description"
              label="Descrição *"
              required
            />
            
            <q-select
              v-model="form.category"
              :options="categories"
              label="Categoria *"
              required
            />
            
            <q-input
              v-model="form.date"
              type="date"
              label="Data *"
              required
            />
            
            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn label="Cancelar" flat @click="closeDialog" />
              <q-btn label="Salvar" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { transactionService } from '@/services/transactionService'
import { api } from 'boot/axios'

const $q = useQuasar()

// Estado
const transactions = ref([])
const loading = ref(false)
const showCreateDialog = ref(false)
const editingTransaction = ref(null)

// Filtros
const filters = ref({
  type: null,
  category: null
})

// Formulário
const form = ref({
  type: 'expense',
  amount: 0,
  description: '',
  category: '',
  date: new Date().toISOString().split('T')[0]
})

// Opções
const typeOptions = ['income', 'expense']
const categories = transactionService.getDefaultCategories()

// Colunas da tabela
const columns = [
  { name: 'date', label: 'Data', field: 'date', sortable: true },
  { name: 'description', label: 'Descrição', field: 'description' },
  { name: 'category', label: 'Categoria', field: 'category' },
  { name: 'type', label: 'Tipo', field: 'type' },
  { name: 'amount', label: 'Valor', field: 'amount', format: val => `R$ ${val}` },
  { name: 'actions', label: 'Ações', field: 'actions' }
]

// Carregar transações
async function loadTransactions() {
  try {
    loading.value = true
    
    const response = await transactionService.getTransactions({
      type: filters.value.type,
      category: filters.value.category
    })
    
    transactions.value = response
    
  } catch (error) {
    console.error('Erro ao carregar transações:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao carregar transações'
    })
  } finally {
    loading.value = false
  }
}

// Salvar transação (criar ou atualizar)
async function saveTransaction() {
  try {
    if (editingTransaction.value) {
      // Atualizar
      await transactionService.updateTransaction(
        editingTransaction.value.id,
        form.value
      )
      
      $q.notify({
        type: 'positive',
        message: 'Transação atualizada com sucesso'
      })
    } else {
      // Criar
      await transactionService.createTransaction(form.value)
      
      $q.notify({
        type: 'positive',
        message: 'Transação criada com sucesso'
      })
    }
    
    closeDialog()
    loadTransactions()
    
  } catch (error) {
    console.error('Erro ao salvar transação:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao salvar transação'
    })
  }
}

// Editar transação
function editTransaction(transaction) {
  editingTransaction.value = transaction
  form.value = { ...transaction }
  showCreateDialog.value = true
}

// Deletar transação
async function deleteTransactionConfirm(id) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: 'Deseja realmente excluir esta transação?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await transactionService.deleteTransaction(id)
      
      $q.notify({
        type: 'positive',
        message: 'Transação excluída com sucesso'
      })
      
      loadTransactions()
      
    } catch (error) {
      console.error('Erro ao deletar transação:', error)
      $q.notify({
        type: 'negative',
        message: error.message || 'Erro ao deletar transação'
      })
    }
  })
}

// Fechar dialog
function closeDialog() {
  showCreateDialog.value = false
  editingTransaction.value = null
  form.value = {
    type: 'expense',
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  }
}

// Inicialização
onMounted(() => {
  loadTransactions()
})
</script>
```

---

## ✅ DEPOIS - Código Migrado

```vue
<template>
  <!-- Template permanece EXATAMENTE o mesmo -->
  <q-page padding>
    <!-- ... mesmo conteúdo ... -->
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
// ✅ MUDANÇA: Importar helpers da API centralizada
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAllCategories
} from '@/apis/api-financial'

const $q = useQuasar()

// Estado - IGUAL
const transactions = ref([])
const loading = ref(false)
const showCreateDialog = ref(false)
const editingTransaction = ref(null)

// Filtros - IGUAL
const filters = ref({
  type: null,
  category: null
})

// Formulário - IGUAL
const form = ref({
  type: 'expense',
  amount: 0,
  description: '',
  category: '',
  date: new Date().toISOString().split('T')[0]
})

// Opções - IGUAL
const typeOptions = ['income', 'expense']
// ✅ MUDANÇA: Usar helper da API centralizada
const categories = getAllCategories()

// Colunas da tabela - IGUAL
const columns = [
  { name: 'date', label: 'Data', field: 'date', sortable: true },
  { name: 'description', label: 'Descrição', field: 'description' },
  { name: 'category', label: 'Categoria', field: 'category' },
  { name: 'type', label: 'Tipo', field: 'type' },
  { name: 'amount', label: 'Valor', field: 'amount', format: val => `R$ ${val}` },
  { name: 'actions', label: 'Ações', field: 'actions' }
]

// ✅ MUDANÇA: Função simplificada com helper centralizado
async function loadTransactions() {
  try {
    loading.value = true
    
    // Chamada direta ao helper
    transactions.value = await getTransactions({
      type: filters.value.type,
      category: filters.value.category
    })
    
  } catch (error) {
    // Erro já vem tratado do helper
    console.error('Erro ao carregar transações:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao carregar transações'
    })
  } finally {
    loading.value = false
  }
}

// ✅ MUDANÇA: Salvar simplificado com helpers
async function saveTransaction() {
  try {
    if (editingTransaction.value) {
      // Chamada direta ao helper de atualização
      await updateTransaction(
        editingTransaction.value.id,
        form.value
      )
      
      $q.notify({
        type: 'positive',
        message: 'Transação atualizada com sucesso'
      })
    } else {
      // Chamada direta ao helper de criação
      await createTransaction(form.value)
      
      $q.notify({
        type: 'positive',
        message: 'Transação criada com sucesso'
      })
    }
    
    closeDialog()
    loadTransactions()
    
  } catch (error) {
    console.error('Erro ao salvar transação:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao salvar transação'
    })
  }
}

// Editar transação - IGUAL
function editTransaction(transaction) {
  editingTransaction.value = transaction
  form.value = { ...transaction }
  showCreateDialog.value = true
}

// ✅ MUDANÇA: Deletar simplificado com helper
async function deleteTransactionConfirm(id) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: 'Deseja realmente excluir esta transação?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      // Chamada direta ao helper de exclusão
      await deleteTransaction(id)
      
      $q.notify({
        type: 'positive',
        message: 'Transação excluída com sucesso'
      })
      
      loadTransactions()
      
    } catch (error) {
      console.error('Erro ao deletar transação:', error)
      $q.notify({
        type: 'negative',
        message: error.message || 'Erro ao deletar transação'
      })
    }
  })
}

// Fechar dialog - IGUAL
function closeDialog() {
  showCreateDialog.value = false
  editingTransaction.value = null
  form.value = {
    type: 'expense',
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  }
}

// Inicialização - IGUAL
onMounted(() => {
  loadTransactions()
})
</script>
```

---

## 📊 Comparação das Mudanças

### Imports

| ANTES | DEPOIS |
|-------|--------|
| `import { transactionService } from '@/services/transactionService'` | `import { getTransactions, createTransaction, ... } from '@/apis/api-financial'` |
| `import { api } from 'boot/axios'` | ❌ Removido (não precisa mais) |

### Chamadas de API

| Operação | ANTES | DEPOIS |
|----------|-------|--------|
| Listar | `transactionService.getTransactions(filters)` | `getTransactions(filters)` |
| Criar | `transactionService.createTransaction(data)` | `createTransaction(data)` |
| Atualizar | `transactionService.updateTransaction(id, data)` | `updateTransaction(id, data)` |
| Deletar | `transactionService.deleteTransaction(id)` | `deleteTransaction(id)` |
| Categorias | `transactionService.getDefaultCategories()` | `getAllCategories()` |

---

## 🎯 Vantagens Observadas

### 1. **Menos Código**
- ✅ Removemos 1 import (`api` do axios)
- ✅ Chamadas mais diretas e semânticas
- ✅ Menos aninhamento de objetos

### 2. **Melhor Autocomplete**
- ✅ IDE sugere todos os helpers disponíveis
- ✅ Parâmetros documentados via JSDoc
- ✅ Tipos inferidos automaticamente

### 3. **Manutenção Facilitada**
- ✅ Mudança de rota? Altere apenas em `API_ROUTES`
- ✅ Mudança de lógica? Altere apenas o helper
- ✅ Componentes não precisam ser alterados

### 4. **Tratamento de Erros Consistente**
- ✅ Todos os erros passam por `handleApiError`
- ✅ Logs padronizados
- ✅ Estrutura de erro consistente

---

## 🧪 Testando a Migração

### 1. Teste de Funcionamento Básico

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse a página de transações
# Verifique se:
# - Lista carrega normalmente
# - Filtros funcionam
# - Criar transação funciona
# - Editar transação funciona
# - Deletar transação funciona
```

### 2. Teste de Erro

```bash
# Pare o backend
# Tente carregar a página
# Deve mostrar: "Servidor indisponível..."
# Logs no console devem estar claros
```

### 3. Teste de Performance

```bash
# Abra o DevTools
# Aba Network
# Verifique:
# - Requests estão corretos
# - Payload está correto
# - Response está sendo tratado
```

---

## 📝 Checklist de Migração Aplicado

- [x] ✅ Identificadas importações antigas
- [x] ✅ Substituídas por helpers centralizados
- [x] ✅ Removido import de `boot/axios`
- [x] ✅ Testado cenário de sucesso
- [x] ✅ Testado cenário de erro
- [x] ✅ Verificados logs no console
- [x] ✅ Template mantido intacto
- [x] ✅ Funcionalidade preservada
- [x] ✅ Código mais limpo e legível

---

## 🚀 Próximos Componentes a Migrar

1. ✅ **TransactionsPage.vue** (concluído neste exemplo)
2. ⏳ **LoginPage.vue** - Migrar autenticação
3. ⏳ **ProfilePage.vue** - Migrar perfil de usuário
4. ⏳ **DashboardPage.vue** - Migrar estatísticas
5. ⏳ **AdminPage.vue** - Migrar operações admin

---

## 💡 Dicas Finais

1. **Migre um componente por vez** - Não tente migrar tudo de uma vez
2. **Teste após cada migração** - Garanta que tudo funciona antes de seguir
3. **Commit após sucesso** - Faça commits pequenos e frequentes
4. **Documente problemas** - Se encontrar algo incomum, documente
5. **Peça revisão** - Outro desenvolvedor pode pegar detalhes que você perdeu

---

**Este exemplo serve como referência para todas as outras migrações do projeto.**
