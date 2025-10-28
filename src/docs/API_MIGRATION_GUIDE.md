# 🔄 Guia de Migração para APIs Centralizadas

## 📋 Visão Geral

Este guia explica como migrar do padrão antigo de chamadas HTTP diretas e services para o novo padrão de **APIs centralizadas** com `ROUTES_MAP` e helpers.

## 🎯 Objetivos da Migração

- ✅ **Eliminar** chamadas HTTP soltas nos componentes
- ✅ **Centralizar** todas as rotas em um único mapa (`API_ROUTES`)
- ✅ **Padronizar** tratamento de erros e respostas
- ✅ **Facilitar** manutenção e descoberta de endpoints
- ✅ **Melhorar** tree-shaking e performance

## 📁 Nova Estrutura

```
src/
  apis/
    api-financial.js    ← Arquivo central com TODAS as rotas e helpers
  utils/
    apiUtils.js         ← Utilitários (handleApiError, buildQueryString, etc.)
  services/             ← [DEPRECADO] Manter apenas para referência
    authService.js
    transactionService.js
    userService.js
```

---

## 🔄 Padrão de Migração

### ❌ ANTES (Service com chamadas diretas)

```js
// services/authService.js
import { api } from 'boot/axios'

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    })
    return response.data
  }
}

// No componente Vue
import { authService } from '@/services/authService'

async function doLogin() {
  try {
    const data = await authService.login({ email, password })
    // ...
  } catch (error) {
    // Tratamento manual de erro
  }
}
```

### ✅ DEPOIS (API centralizada com helper)

```js
// apis/api-financial.js
export const API_ROUTES = {
  auth: {
    login: '/auth/login'
  }
}

export async function login(credentials, options = {}) {
  try {
    const response = await api.post(API_ROUTES.auth.login, {
      email: credentials.email,
      password: credentials.password
    }, options)
    
    const normalized = normalizeApiResponse(response)
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

// No componente Vue
import { login } from '@/apis/api-financial'

async function doLogin() {
  try {
    const data = await login({ email, password })
    // ...
  } catch (error) {
    // Erro já tratado pelo helper
    this.$q.notify({ type: 'negative', message: error.message })
  }
}
```

---

## 📝 Exemplos de Migração por Domínio

### 1️⃣ Autenticação

#### ❌ ANTES

```js
// services/authService.js
import { api } from 'boot/axios'
import { handleApiResponse } from 'src/utils/apiResponse'

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    })
    const apiData = handleApiResponse(response, 'login')
    return apiData
  },
  
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return handleApiResponse(response, 'register')
  },
  
  async getMe() {
    const response = await api.get('/auth/me')
    return handleApiResponse(response, 'getMe')
  }
}
```

#### ✅ DEPOIS

```js
// Nos componentes, apenas importe e use diretamente
import { login, register, getMe } from '@/apis/api-financial'

// Login
const userData = await login({ email, password })

// Registro
const newUser = await register({ name, email, password })

// Buscar usuário atual
const currentUser = await getMe()
```

---

### 2️⃣ Transações

#### ❌ ANTES

```js
// services/transactionService.js
export const transactionService = {
  async getTransactions(filters = {}) {
    const params = new URLSearchParams()
    if (filters.type) params.append('type', filters.type)
    if (filters.category) params.append('category', filters.category)
    // ... mais filtros
    
    const url = `/transactions${params.toString() ? `?${params}` : ''}`
    const response = await api.get(url)
    return response.data.data
  },
  
  async createTransaction(data) {
    const response = await api.post('/transactions', data)
    return response.data
  },
  
  async updateTransaction(id, data) {
    const response = await api.put(`/transactions/${id}`, data)
    return response.data
  }
}
```

#### ✅ DEPOIS

```js
// Nos componentes
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} from '@/apis/api-financial'

// Listar com filtros
const transactions = await getTransactions({
  type: 'expense',
  category: 'Aluguel',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  page: 1,
  limit: 20
})

// Criar
const newTransaction = await createTransaction({
  type: 'income',
  amount: 5000,
  description: 'Venda de produto',
  category: 'Vendas',
  date: '2024-01-15'
})

// Atualizar
const updated = await updateTransaction(transactionId, {
  amount: 5500,
  description: 'Venda de produto - atualizada'
})

// Deletar
await deleteTransaction(transactionId)

// Estatísticas
const stats = await getTransactionStats({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
})
```

---

### 3️⃣ Usuário / Perfil

#### ❌ ANTES

```js
// services/userService.js
export const userService = {
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData)
    return response.data
  },
  
  async changePassword(passwordData) {
    const response = await api.put('/users/password', passwordData)
    return response.data
  },
  
  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.avatarUrl
  }
}
```

#### ✅ DEPOIS

```js
// Nos componentes
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadAvatar,
  removeAvatar,
  getUserSettings,
  updateUserSettings
} from '@/apis/api-financial'

// Buscar perfil
const profile = await getUserProfile()

// Atualizar perfil
const updated = await updateUserProfile({
  name: 'João Silva',
  email: 'joao@example.com',
  company: 'Minha Empresa',
  phone: '11999999999'
})

// Alterar senha
await changePassword({
  currentPassword: 'senha123',
  newPassword: 'novaSenha456'
})

// Upload de avatar
const avatarUrl = await uploadAvatar(fileObject)

// Remover avatar
await removeAvatar()

// Configurações
const settings = await getUserSettings()
await updateUserSettings({
  theme: 'dark',
  currency: 'BRL',
  language: 'pt-BR'
})
```

---

## 🔧 Recursos Avançados

### 1. Supressão de Erros de UI

```js
// Suprimir notificação automática de erro
const data = await getTransactions(filters, {
  suppressUiError: true
})

// Tratar erro manualmente
try {
  const data = await createTransaction(payload)
} catch (error) {
  if (!error.suppressUiError) {
    // Erro não foi suprimido, tratamento customizado
  }
}
```

### 2. Mensagem de Erro Customizada

```js
// Substituir mensagem de erro padrão
const data = await login(credentials, {
  uiMessageOverride: 'Credenciais inválidas. Tente novamente.'
})
```

### 3. Timeout Customizado

```js
// Alterar timeout da requisição
const data = await getTransactionReports(filters, {
  timeout: 30000 // 30 segundos
})
```

### 4. Headers Customizados

```js
// Adicionar headers extras
const data = await createTransaction(payload, {
  headers: {
    'X-Custom-Header': 'valor'
  }
})
```

---

## 📊 Checklist de Migração

### Por Componente/Página

- [ ] **Identificar** todas as importações de services antigos
- [ ] **Substituir** por imports dos helpers centralizados
- [ ] **Remover** imports desnecessários (`api` de `boot/axios`)
- [ ] **Testar** todos os cenários (sucesso, erro, loading)
- [ ] **Validar** tratamento de erros
- [ ] **Verificar** logs no console

### Exemplo de Checklist

```js
// ❌ ANTES
import { authService } from '@/services/authService'
import { transactionService } from '@/services/transactionService'
import { api } from 'boot/axios'

// ✅ DEPOIS
import { 
  login, 
  getTransactions, 
  createTransaction 
} from '@/apis/api-financial'
```

---

## 🔍 Descoberta de Rotas

### Como encontrar a rota que preciso?

1. **Abra** `src/apis/api-financial.js`
2. **Procure** no objeto `API_ROUTES` por domínio
3. **Veja** os helpers disponíveis abaixo do mapa de rotas

### Exemplo:

```js
// Preciso criar uma transação
// 1. Busco em API_ROUTES.transactions
// 2. Vejo: create: '/transactions'
// 3. Procuro helper: createTransaction()
// 4. Importo e uso:

import { createTransaction } from '@/apis/api-financial'

const newTransaction = await createTransaction({
  type: 'income',
  amount: 1000,
  description: 'Pagamento recebido',
  category: 'Vendas',
  date: '2024-01-15'
})
```

---

## 🧪 Padrão de Testes

### Antes da Migração

```js
// Componente antigo com service
import { transactionService } from '@/services/transactionService'

async mounted() {
  this.transactions = await transactionService.getTransactions()
}
```

### Depois da Migração

```js
// Componente novo com API centralizada
import { getTransactions } from '@/apis/api-financial'

async mounted() {
  this.transactions = await getTransactions()
}
```

### Teste Manual

1. ✅ Verifique se a página carrega sem erros
2. ✅ Teste operação de criação
3. ✅ Teste operação de atualização
4. ✅ Teste operação de exclusão
5. ✅ Teste com API offline (deve mostrar erro adequado)
6. ✅ Verifique logs no console (devem estar claros)

---

## 📌 Benefícios da Nova Arquitetura

### 1. **Manutenibilidade**
- Todas as rotas em um único lugar
- Fácil adicionar/modificar endpoints
- Menos duplicação de código

### 2. **Descoberta**
- Autocomplete do IDE funciona melhor
- Imports diretos e semânticos
- Documentação inline (JSDoc)

### 3. **Tratamento de Erros**
- Centralizado e consistente
- Suporte a customizações (suppressUiError, uiMessageOverride)
- Logs padronizados

### 4. **Performance**
- Tree-shaking mais eficiente
- Imports apenas do necessário
- Menos código no bundle final

### 5. **Testabilidade**
- Fácil mockar helpers individuais
- Não precisa mockar axios diretamente
- Funções puras e isoladas

---

## 🚀 Próximos Passos

1. **Migre** um componente por vez
2. **Teste** cada componente após migração
3. **Documente** casos especiais encontrados
4. **Remova** services antigos quando não houver mais uso
5. **Atualize** documentação do projeto

---

## ❓ FAQ

### P: Preciso mudar o boot/axios.js?
**R:** Não. O boot/axios.js continua sendo usado pelos helpers. Apenas mude os componentes.

### P: Posso usar services antigos e novos ao mesmo tempo?
**R:** Sim, durante a migração. Mas evite misturar no mesmo componente.

### P: Como adicionar um novo endpoint?
**R:** 
1. Adicione a rota em `API_ROUTES`
2. Crie um helper seguindo o padrão
3. Exporte o helper
4. Use nos componentes

### P: E se o endpoint retornar estrutura diferente?
**R:** Normalize dentro do helper antes de retornar, não nos componentes.

### P: Como fazer chamadas em paralelo?
**R:**
```js
const [transactions, stats, profile] = await Promise.all([
  getTransactions(),
  getTransactionStats(),
  getUserProfile()
])
```

---

## 📚 Referências

- 📄 `src/apis/api-financial.js` - Arquivo central de APIs
- 📄 `src/utils/apiUtils.js` - Utilitários de API
- 📄 `src/boot/axios.js` - Configuração do Axios
- 📄 `src/docs/API_INTEGRATION.md` - Integração com backend

---

**Última atualização:** 2024-01-15  
**Versão:** 1.0.0
