# 🔌 APIs Centralizadas

Esta pasta contém a **centralização de todas as rotas e helpers de API** do projeto, seguindo o padrão de arquitetura limpa e manutenível.

## 📁 Estrutura

```
src/apis/
  api-financial.js    ← API principal do sistema financeiro
  README.md          ← Este arquivo
```

## 🎯 Objetivo

Eliminar chamadas HTTP espalhadas nos componentes, centralizando:
- ✅ Todas as rotas em um `ROUTES_MAP`
- ✅ Helpers assíncronos para cada endpoint
- ✅ Tratamento de erros padronizado
- ✅ Normalização de respostas

## 📋 Padrão de Organização

### 1. Mapa de Rotas (API_ROUTES)

```js
export const API_ROUTES = {
  // Agrupado por domínio/recurso
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  
  transactions: {
    list: '/transactions',
    create: '/transactions',
    update: (id) => `/transactions/${id}`,  // Função para rotas dinâmicas
    delete: (id) => `/transactions/${id}`,
    getById: (id) => `/transactions/${id}`,
  }
}
```

### 2. Helper por Endpoint

```js
/**
 * Descrição clara do que faz
 * @param {Object} params - Parâmetros necessários
 * @param {Object} options - Opções adicionais (optional)
 * @returns {Promise<Object>} - O que retorna
 */
export async function nomeDoHelper(params, options = {}) {
  try {
    console.log('🔧 [API] Ação:', params)
    
    const response = await api.post(
      API_ROUTES.dominio.acao,
      params,
      options
    )
    
    const normalized = normalizeApiResponse(response)
    
    console.log('✅ [API] Sucesso')
    return normalized.data
    
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}
```

## 🔧 Como Adicionar Novo Endpoint

### Passo 1: Adicionar Rota no Mapa

```js
export const API_ROUTES = {
  // ... rotas existentes
  
  // Novo domínio
  invoices: {
    list: '/invoices',
    create: '/invoices',
    getById: (id) => `/invoices/${id}`,
    download: (id) => `/invoices/${id}/download`,
  }
}
```

### Passo 2: Criar Helper

```js
/**
 * Lista faturas com filtros
 * @param {Object} filters - { status, startDate, endDate }
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Array>} - Lista de faturas
 */
export async function getInvoices(filters = {}, options = {}) {
  try {
    console.log('📄 [API] Listando faturas:', filters)
    
    const queryString = buildQueryString(filters)
    const url = `${API_ROUTES.invoices.list}${queryString}`
    
    const response = await api.get(url, options)
    const normalized = normalizeApiResponse(response)
    
    console.log('✅ [API] Faturas obtidas:', normalized.data?.length || 0)
    return normalized.data
    
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Cria nova fatura
 * @param {Object} invoiceData - Dados da fatura
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Fatura criada
 */
export async function createInvoice(invoiceData, options = {}) {
  try {
    console.log('➕ [API] Criando fatura')
    
    const response = await api.post(
      API_ROUTES.invoices.create,
      invoiceData,
      options
    )
    
    const normalized = normalizeApiResponse(response)
    
    console.log('✅ [API] Fatura criada')
    return normalized.data
    
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Busca fatura por ID
 * @param {string|number} id - ID da fatura
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} - Dados da fatura
 */
export async function getInvoiceById(id, options = {}) {
  try {
    console.log('🔍 [API] Buscando fatura:', id)
    
    const response = await api.get(API_ROUTES.invoices.getById(id), options)
    const normalized = normalizeApiResponse(response)
    
    console.log('✅ [API] Fatura encontrada')
    return normalized.data
    
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}

/**
 * Faz download de fatura em PDF
 * @param {string|number} id - ID da fatura
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Blob>} - Arquivo PDF
 */
export async function downloadInvoice(id, options = {}) {
  try {
    console.log('📥 [API] Baixando fatura:', id)
    
    const response = await api.get(
      API_ROUTES.invoices.download(id),
      {
        ...options,
        responseType: 'blob'  // Para arquivos
      }
    )
    
    console.log('✅ [API] Fatura baixada')
    return response.data
    
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}
```

### Passo 3: Usar no Componente

```vue
<script setup>
import { ref } from 'vue'
import {
  getInvoices,
  createInvoice,
  getInvoiceById,
  downloadInvoice
} from '@/apis/api-financial'

const invoices = ref([])

async function loadInvoices() {
  invoices.value = await getInvoices({
    status: 'paid',
    startDate: '2024-01-01'
  })
}

async function download(invoiceId) {
  const blob = await downloadInvoice(invoiceId)
  
  // Criar link de download
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fatura-${invoiceId}.pdf`
  a.click()
  window.URL.revokeObjectURL(url)
}
</script>
```

## 🔍 Tipos de Requisições

### GET (Listar/Buscar)

```js
export async function getNome(filters = {}, options = {}) {
  try {
    const queryString = buildQueryString(filters)
    const url = `${API_ROUTES.dominio.list}${queryString}`
    
    const response = await api.get(url, options)
    const normalized = normalizeApiResponse(response)
    
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}
```

### POST (Criar)

```js
export async function createNome(data, options = {}) {
  try {
    const response = await api.post(
      API_ROUTES.dominio.create,
      data,
      options
    )
    
    const normalized = normalizeApiResponse(response)
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}
```

### PUT (Atualizar)

```js
export async function updateNome(id, data, options = {}) {
  try {
    const response = await api.put(
      API_ROUTES.dominio.update(id),
      data,
      options
    )
    
    const normalized = normalizeApiResponse(response)
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}
```

### DELETE (Excluir)

```js
export async function deleteNome(id, options = {}) {
  try {
    const response = await api.delete(
      API_ROUTES.dominio.delete(id),
      options
    )
    
    const normalized = normalizeApiResponse(response)
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}
```

### POST com FormData (Upload)

```js
export async function uploadNome(file, options = {}) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', 'Descrição do arquivo')
    
    const response = await api.post(
      API_ROUTES.dominio.upload,
      formData,
      {
        ...options,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...options.headers
        }
      }
    )
    
    const normalized = normalizeApiResponse(response)
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}
```

## ⚙️ Opções Disponíveis

Todos os helpers aceitam um objeto `options` com:

### Supressão de Erro de UI

```js
const data = await getNome(params, {
  suppressUiError: true  // Não mostra notificação automática
})
```

### Mensagem Customizada

```js
const data = await createNome(params, {
  uiMessageOverride: 'Mensagem customizada de erro'
})
```

### Timeout Customizado

```js
const data = await getNome(params, {
  timeout: 30000  // 30 segundos
})
```

### Headers Extras

```js
const data = await createNome(params, {
  headers: {
    'X-Custom-Header': 'valor',
    'X-Request-ID': uuid()
  }
})
```

### Combinação de Opções

```js
const data = await updateNome(id, params, {
  timeout: 15000,
  suppressUiError: true,
  headers: {
    'X-Idempotency-Key': uuid()
  }
})
```

## 📊 Utilitários Disponíveis

### buildQueryString

Constrói query string a partir de objeto:

```js
import { buildQueryString } from '@/utils/apiUtils'

const qs = buildQueryString({
  page: 1,
  limit: 20,
  status: 'active',
  search: 'termo'
})
// Resultado: "?page=1&limit=20&status=active&search=termo"
```

### handleApiError

Trata erros de forma padronizada:

```js
import { handleApiError } from '@/utils/apiUtils'

try {
  const response = await api.get('/endpoint')
} catch (error) {
  return Promise.reject(handleApiError(error, {
    uiMessageOverride: 'Erro customizado',
    suppressUiError: false
  }))
}
```

### normalizeApiResponse

Normaliza estrutura de resposta:

```js
import { normalizeApiResponse } from '@/utils/apiUtils'

const response = await api.get('/endpoint')
const normalized = normalizeApiResponse(response)

// normalized = {
//   success: true,
//   data: { ... },
//   message: null,
//   status: 200
// }
```

## 🧪 Testando Helpers

### Teste Manual

```js
// No console do navegador ou em um componente de teste
import { getNome } from '@/apis/api-financial'

// Testar sucesso
const result = await getNome()
console.log('Resultado:', result)

// Testar com filtros
const filtered = await getNome({ status: 'active' })
console.log('Filtrado:', filtered)

// Testar erro (com API offline)
try {
  await getNome()
} catch (error) {
  console.error('Erro capturado:', error.message)
}
```

### Teste com Jest/Vitest

```js
import { describe, it, expect, vi } from 'vitest'
import { getNome } from '@/apis/api-financial'
import { api } from 'boot/axios'

vi.mock('boot/axios')

describe('getNome', () => {
  it('deve retornar lista de itens', async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: [{ id: 1, name: 'Item 1' }]
      }
    })
    
    const result = await getNome()
    
    expect(result).toEqual([{ id: 1, name: 'Item 1' }])
    expect(api.get).toHaveBeenCalledWith('/nome')
  })
  
  it('deve tratar erro', async () => {
    api.get.mockRejectedValue(new Error('Erro de rede'))
    
    await expect(getNome()).rejects.toThrow()
  })
})
```

## 📝 Convenções de Nomenclatura

### Rotas no Mapa

```js
// ✅ BOM - Semântico e agrupado
API_ROUTES = {
  users: {
    list: '/users',
    create: '/users',
    getById: (id) => `/users/${id}`,
    updateById: (id) => `/users/${id}`,
  }
}

// ❌ RUIM - Genérico e confuso
API_ROUTES = {
  user1: '/users',
  user2: '/users',
  user3: (id) => `/users/${id}`,
}
```

### Helpers

```js
// ✅ BOM - Verbo + Substantivo (camelCase)
getUsers()
createUser()
updateUserById()
deleteUser()
getUserProfile()

// ❌ RUIM - Verboso ou confuso
getUsersFromAPI()
user_create()
UpdateUser()
```

### Parâmetros

```js
// ✅ BOM - Descritivos e tipados
async function getUsers(filters = {}, options = {})
async function updateUser(userId, userData, options = {})

// ❌ RUIM - Genéricos
async function getUsers(params, opts)
async function updateUser(id, data)
```

## 🚨 Erros Comuns

### 1. Esquecer try/catch

```js
// ❌ ERRADO
export async function getNome() {
  const response = await api.get('/endpoint')
  return response.data
}

// ✅ CORRETO
export async function getNome(options = {}) {
  try {
    const response = await api.get('/endpoint', options)
    const normalized = normalizeApiResponse(response)
    return normalized.data
  } catch (error) {
    return Promise.reject(handleApiError(error, options))
  }
}
```

### 2. Não normalizar resposta

```js
// ❌ ERRADO
const response = await api.get('/endpoint')
return response.data  // Estrutura pode variar

// ✅ CORRETO
const response = await api.get('/endpoint')
const normalized = normalizeApiResponse(response)
return normalized.data  // Estrutura consistente
```

### 3. Tratar erro no componente E no helper

```js
// ❌ ERRADO - Tratamento duplicado
// No helper
try {
  const response = await api.get('/endpoint')
  return response.data
} catch (error) {
  console.error(error)  // ❌ Não trate aqui
  throw error
}

// ✅ CORRETO - Tratar apenas no helper
try {
  const response = await api.get('/endpoint')
  const normalized = normalizeApiResponse(response)
  return normalized.data
} catch (error) {
  return Promise.reject(handleApiError(error, options))
}
```

## 📚 Referências

- 📄 [API_MIGRATION_GUIDE.md](../docs/API_MIGRATION_GUIDE.md) - Guia completo de migração
- 📄 [MIGRATION_EXAMPLE.md](../docs/MIGRATION_EXAMPLE.md) - Exemplo prático
- 📄 [apiUtils.js](../utils/apiUtils.js) - Utilitários de API
- 📄 [axios.js](../boot/axios.js) - Configuração do Axios

---

**Mantenha este padrão para garantir consistência e manutenibilidade do código!**
