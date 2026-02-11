# 🤖 GitHub Copilot Instructions - Financial Control Frontend

## 📋 Contexto do Projeto

**Nome do projeto:** Financial Control - Sistema de Controle Financeiro para PMEs  
**Linguagem principal:** JavaScript (ES6+)  
**Framework principal:** Vue.js 3 (Composition API) + Quasar Framework v2  
**Gerenciador de dependências:** npm  
**Estado:** Pinia Stores  
**Roteamento:** Vue Router 4  
**Banco de dados:** Supabase (PostgreSQL)  
**Backend:** API REST Node.js (http://localhost:3000)  
**Cloud provider:** Render (deploy frontend e backend)  
**Build tool:** Vite 6  
**Idioma do código:** Inglês (variáveis, funções, componentes)  
**Idioma dos comentários:** Português brasileiro  
**Idioma das mensagens ao usuário:** Português brasileiro  
**Idioma dos commits:** Português brasileiro (modo imperativo)

### Tecnologias Adicionais
- **Axios** - Cliente HTTP para chamadas à API
- **Chart.js + vue-chartjs** - Gráficos e visualizações
- **date-fns** - Manipulação de datas
- **vue-i18n** - Internacionalização
- **jsPDF + jspdf-autotable** - Geração de relatórios PDF
- **xlsx** - Exportação para Excel
- **qrcode-vue3** - Geração de QR codes para pagamentos
- **ESLint 9** - Linting de código
- **Prettier** - Formatação de código
- **Sass** - Pré-processador CSS

---

## 🗂️ Estrutura de Pastas do Projeto

```
financialcontrol-front/
├── .github/                  # Configurações do GitHub
│   └── copilot-instructions.md
├── docs/                     # Documentação completa do projeto
│   ├── 00_INDICE_COMPLETO.md
│   ├── 01_RESUMO_EXECUTIVO.md
│   ├── 02_ANALISE_PRODUTO.md
│   ├── 03_PERSONAS_JORNADAS.md
│   ├── 04_PALETAS_CORES.md
│   ├── 05_DESIGN_SYSTEM.md
│   └── ... (outros docs)
├── public/                   # Assets estáticos
│   ├── _redirects           # Configuração de redirects do Render
│   ├── ControleFinanceiro.png
│   └── ... (ícones e manifests)
├── scripts/                  # Scripts utilitários
├── src/                      # Código fonte principal
│   ├── apis/                # Centralizador de rotas de API
│   │   ├── README.md
│   │   ├── api-financial.js
│   │   ├── accounts.js
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── dashboard.js
│   │   ├── errors.js
│   │   ├── payments.js
│   │   ├── plans.js
│   │   ├── routes.js
│   │   ├── transactions.js
│   │   └── user.js
│   ├── boot/                # Configurações iniciais do Quasar
│   │   ├── axios.js         # Configuração e interceptors do Axios
│   │   ├── pinia.js         # Inicialização do Pinia
│   │   ├── i18n.js          # Configuração de internacionalização
│   │   └── theme.js         # Configuração de tema
│   ├── components/          # Componentes Vue reutilizáveis
│   │   ├── BottomNavigation.vue
│   │   ├── CategoryDialog.vue
│   │   ├── CompleteProfileDialog.vue
│   │   ├── EmptyState.vue
│   │   ├── ErrorDialog.vue
│   │   ├── LoadingOverlay.vue
│   │   ├── MonthNavigator.vue
│   │   ├── PeriodFilter.vue
│   │   ├── SessionManager.vue
│   │   ├── ThemeSwitcher.vue
│   │   ├── TransactionForm.vue
│   │   ├── accounts/        # Componentes de contas
│   │   ├── dashboard/       # Componentes do dashboard
│   │   ├── design-system/   # Componentes do design system
│   │   ├── payments/        # Componentes de pagamentos
│   │   ├── plans/           # Componentes de planos
│   │   ├── reports/         # Componentes de relatórios
│   │   └── summary/         # Componentes de resumo
│   ├── composables/         # Composables Vue (lógica reutilizável)
│   │   ├── useCurrency.js
│   │   ├── useDate.js
│   │   ├── useFeaturePermissions.js
│   │   ├── useGlobalLoading.js
│   │   ├── useNotifications.js
│   │   ├── usePayment.js
│   │   ├── usePeriodFilter.js
│   │   ├── usePlans.js
│   │   ├── useResponsive.js
│   │   ├── useSessionActivity.js
│   │   └── useTheme.js
│   ├── constants/           # Constantes e configurações
│   │   └── messages.js      # Mensagens padronizadas
│   ├── css/                 # Estilos globais
│   │   └── app.css
│   ├── i18n/                # Arquivos de tradução
│   │   ├── pt-BR/
│   │   └── en-US/
│   ├── layouts/             # Layouts do Quasar
│   │   └── MainLayout.vue
│   ├── pages/               # Páginas/Views da aplicação
│   │   ├── CheckoutPage.vue
│   │   ├── PlansPage.vue
│   │   ├── ReportsPage.vue
│   │   ├── auth/            # Páginas de autenticação
│   │   ├── dashboard/       # Páginas do dashboard
│   │   ├── profile/         # Páginas de perfil
│   │   └── transactions/    # Páginas de transações
│   ├── router/              # Configuração de rotas
│   │   └── index.js
│   ├── services/            # Camada de serviços (API calls)
│   │   ├── adminService.js
│   │   ├── authService.js
│   │   ├── dashboardService.js
│   │   ├── errorDialogService.js
│   │   ├── planService.js
│   │   ├── reportService.js
│   │   ├── transactionService.js
│   │   └── userService.js
│   ├── stores/              # Pinia Stores (estado global)
│   │   ├── accountStatement.js
│   │   ├── accounts.js
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── plans.js
│   │   └── transactions.js
│   ├── utils/               # Utilitários e helpers
│   │   ├── apiResponse.js   # Tratamento de respostas da API
│   │   └── apiUtils.js      # Utilidades para API
│   ├── App.vue              # Componente raiz
│   └── main.js              # Entry point da aplicação
├── .env                      # Variáveis de ambiente (não commitado)
├── .env.example              # Exemplo de variáveis de ambiente
├── .eslintrc.js              # Configuração do ESLint
├── .prettierrc               # Configuração do Prettier
├── index.html                # HTML raiz
├── jsconfig.json             # Configuração de paths do JavaScript
├── package.json              # Dependências e scripts
├── postcss.config.js         # Configuração do PostCSS
├── quasar.config.js          # Configuração do Quasar Framework
├── vite.config.js            # Configuração do Vite
└── README.md                 # Documentação principal
```

---

## 📦 Estrutura de Pacotes (src/)

### 📂 apis/
Centralização de todas as rotas e chamadas à API REST.
- **Padrão:** Cada domínio tem seu arquivo (ex: `auth.js`, `transactions.js`)
- **Estrutura:** Contém `API_ROUTES` (mapa de rotas) e helpers assíncronos
- **Normalização:** Todas as respostas são normalizadas pela estrutura `{ success, data, message }`

### 📂 boot/
Arquivos de inicialização do Quasar (executados antes do Vue ser montado).
- `axios.js` - Configuração do cliente HTTP com interceptors
- `pinia.js` - Inicialização do Pinia
- `i18n.js` - Configuração de internacionalização
- `theme.js` - Configuração de tema claro/escuro

### 📂 components/
Componentes Vue reutilizáveis organizados por contexto.
- **Nível raiz:** Componentes globais (LoadingOverlay, ErrorDialog, etc)
- **Subpastas:** Componentes específicos de domínio (dashboard/, payments/, etc)

### 📂 composables/
Funções composables do Vue 3 (lógica reutilizável com Composition API).
- **Padrão:** Prefixo `use` (ex: `useNotifications`, `useCurrency`)
- **Retorno:** Objetos reativos, funções e computed properties

### 📂 constants/
Constantes e configurações estáticas.
- `messages.js` - Todas as mensagens da aplicação (SUCCESS, ERROR, INFO, WARNING)

### 📂 layouts/
Layouts do Quasar (estrutura de páginas).
- `MainLayout.vue` - Layout principal com menu lateral e top bar

### 📂 pages/
Páginas/Views da aplicação organizadas por contexto.
- **Padrão:** Sufixo `Page.vue` (ex: `DashboardPage.vue`)
- **Organização:** Por feature/domínio em subpastas

### 📂 router/
Configuração de rotas do Vue Router.
- `index.js` - Definição de rotas, guards e meta informações

### 📂 services/
Camada de serviços para encapsular chamadas à API.
- **Padrão:** Sufixo `Service.js` (ex: `authService.js`)
- **Responsabilidade:** Chamadas HTTP, tratamento de erros, transformação de dados

### 📂 stores/
Pinia Stores para gerenciamento de estado global.
- **Padrão:** Nome do domínio sem sufixo (ex: `auth.js`, `transactions.js`)
- **Estrutura:** `state`, `getters`, `actions`

### 📂 utils/
Utilitários e helpers genéricos.
- `apiResponse.js` - Normalização de respostas da API
- `apiUtils.js` - Utilitários para chamadas HTTP

---

## 🏗️ Principais Módulos/Aplicações

### 1. Autenticação (Auth)
- **Store:** `src/stores/auth.js`
- **Service:** `src/services/authService.js`
- **API:** `src/apis/auth.js`
- **Páginas:** `src/pages/auth/`
- **Funcionalidades:**
  - Login/Logout
  - Registro de usuários
  - Recuperação de senha
  - Persistência de sessão (localStorage)
  - Renovação automática de token

### 2. Dashboard
- **Store:** `src/stores/dashboard.js`
- **Service:** `src/services/dashboardService.js`
- **API:** `src/apis/dashboard.js`
- **Páginas:** `src/pages/dashboard/`
- **Componentes:** `src/components/dashboard/`
- **Funcionalidades:**
  - Resumo financeiro (receitas, despesas, saldo)
  - Gráficos de análise por categoria
  - Filtros por período (mês, trimestre, ano, personalizado)
  - Transações recentes

### 3. Transações
- **Store:** `src/stores/transactions.js`
- **Service:** `src/services/transactionService.js`
- **API:** `src/apis/transactions.js`
- **Páginas:** `src/pages/transactions/`
- **Componentes:** `TransactionForm.vue`
- **Funcionalidades:**
  - CRUD de transações (criar, editar, deletar, visualizar)
  - Filtros por tipo (receita/despesa), categoria, status, período
  - Marcação de recebido/pago
  - Agrupamento por mês

### 4. Planos e Pagamentos
- **Store:** `src/stores/plans.js`
- **Service:** `src/services/planService.js`
- **API:** `src/apis/plans.js`, `src/apis/payments.js`
- **Páginas:** `PlansPage.vue`, `CheckoutPage.vue`
- **Composable:** `usePayment.js`
- **Funcionalidades:**
  - Gerenciamento de planos (Free, Pro, Premium)
  - Checkout via PIX (integração com gateway)
  - Geração de QR Code PIX
  - Histórico de pagamentos
  - Controle de permissões por plano

### 5. Relatórios
- **Service:** `src/services/reportService.js`
- **API:** `src/apis/dashboard.js`
- **Páginas:** `ReportsPage.vue`
- **Componentes:** `src/components/reports/`
- **Funcionalidades:**
  - Relatórios analíticos por categoria
  - Exportação para PDF e Excel
  - Filtros avançados por período

### 6. Administração
- **Store:** `src/stores/admin.js`
- **Service:** `src/services/adminService.js`
- **API:** `src/apis/admin.js`
- **Páginas:** `src/pages/auth/admin/`
- **Funcionalidades:**
  - Gerenciamento de usuários
  - Dashboard administrativo
  - Estatísticas do sistema

---

## ⚠️ Exceções Customizadas

Este projeto não utiliza classes de exceção customizadas. Os erros são tratados com `throw new Error(message)` e capturados nos interceptors do Axios e nas actions das stores.

### Estrutura de Erro Padrão da API

```javascript
{
  success: false,
  message: "Mensagem de erro descritiva",
  data: null
}
```

### Principais Mensagens de Erro (src/constants/messages.js)

| Chave | Mensagem | Uso |
|-------|----------|-----|
| `ERROR.REQUIRED_FIELDS` | "Preencha todos os campos obrigatórios" | Validação de formulários |
| `ERROR.INVALID_EMAIL` | "Por favor, insira um e-mail válido" | Validação de email |
| `ERROR.PASSWORD_TOO_SHORT` | "A senha deve ter no mínimo 6 caracteres" | Validação de senha |
| `ERROR.INVALID_CREDENTIALS` | "E-mail ou senha inválidos" | Login falhou |
| `ERROR.NETWORK_ERROR` | "Erro de conexão. Verifique sua internet" | Erro de rede |
| `ERROR.SERVER_ERROR` | "Erro no servidor. Tente novamente mais tarde" | Erro 500 |
| `ERROR.UNAUTHORIZED` | "Sessão expirada. Faça login novamente" | Erro 401 |
| `ERROR.FORBIDDEN` | "Você não tem permissão para acessar" | Erro 403 |
| `ERROR.NOT_FOUND` | "Recurso não encontrado" | Erro 404 |

---

## 🧩 Padrões por Tipo de Componente

### 1. 📄 Página Vue (Page)

**Nomenclatura:** `*Page.vue` (ex: `DashboardPage.vue`, `PlansPage.vue`)

**Propósito:** Componentes de nível de rota que representam telas completas da aplicação.

**Template Completo:**

```vue
<!-- ==========================================================================
PÁGINA [NOME DA PÁGINA]
==========================================================================
Propósito: [Descreva o propósito da página]
Origem: [De onde o usuário chega aqui]
Destino: [Para onde os dados vão]
Efeitos: [O que esta página faz] -->

<template>
  <q-page padding class="page-container">
    
    <!-- ==========================================================================
    CABEÇALHO DA PÁGINA
    ========================================================================== -->
    <div class="page-header q-mb-lg">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <h1 class="text-h4 text-weight-bold q-ma-none">
            {{ pageTitle }}
          </h1>
          <p class="text-subtitle1 text-grey-7 q-ma-none q-mt-xs">
            {{ pageSubtitle }}
          </p>
        </div>
        
        <div class="col-auto">
          <!-- Botões de ação -->
          <q-btn
            color="primary"
            icon="add"
            label="Nova Ação"
            @click="handleAction"
          />
        </div>
      </div>
    </div>

    <!-- ==========================================================================
    CONTEÚDO PRINCIPAL
    ========================================================================== -->
    <div class="page-content">
      
      <!-- Estado de Loading -->
      <div v-if="isLoading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <!-- Estado de Erro -->
      <div v-else-if="error" class="q-pa-lg">
        <q-banner class="bg-negative text-white" rounded>
          <template #avatar>
            <q-icon name="error" />
          </template>
          {{ error }}
        </q-banner>
      </div>

      <!-- Estado Vazio -->
      <EmptyState
        v-else-if="isEmpty"
        icon="inbox"
        title="Nenhum item encontrado"
        subtitle="Comece criando seu primeiro item"
        action-label="Criar Item"
        @action="handleAction"
      />

      <!-- Conteúdo Normal -->
      <div v-else class="content-grid">
        <!-- Seu conteúdo aqui -->
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useNotifications } from 'src/composables/useNotifications'
import EmptyState from 'src/components/EmptyState.vue'

// ==========================================================================
// COMPOSABLES
// ==========================================================================
const $q = useQuasar()
const router = useRouter()
const { notifySuccess, notifyError } = useNotifications()

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const isLoading = ref(false)
const error = ref(null)
const items = ref([])

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================
const pageTitle = computed(() => 'Título da Página')
const pageSubtitle = computed(() => 'Subtítulo descritivo')
const isEmpty = computed(() => items.value.length === 0)

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Carrega os dados iniciais da página
 */
async function loadData() {
  isLoading.value = true
  error.value = null
  
  try {
    // Chamar service ou store
    // items.value = await someService.fetchItems()
    
    console.log('✅ Dados carregados com sucesso')
  } catch (err) {
    console.error('❌ Erro ao carregar dados:', err)
    error.value = err.message || 'Erro ao carregar dados'
    notifyError('Erro ao carregar dados')
  } finally {
    isLoading.value = false
  }
}

/**
 * Manipula ação principal da página
 */
function handleAction() {
  console.log('🔄 Ação executada')
  // Implementar lógica
}

// ==========================================================================
// LIFECYCLE HOOKS
// ==========================================================================
onMounted(() => {
  console.log('🚀 Página montada:', 'NomeDaPagina')
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.content-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
```

**Instruções para Criar Nova Página:**
1. Criar arquivo em `src/pages/[contexto]/NomeDaPagina.vue`
2. Copiar template acima e ajustar nome, propósito e comentários
3. Implementar lógica de carregamento de dados
4. Adicionar rota no `src/router/index.js`
5. Criar testes unitários (se aplicável)

---

### 2. 🧱 Componente Vue (Component)

**Nomenclatura:** `PascalCase.vue` (ex: `TransactionForm.vue`, `LoadingOverlay.vue`)

**Propósito:** Componentes reutilizáveis que encapsulam UI e lógica específica.

**Template Completo:**

```vue
<!-- ==========================================================================
COMPONENTE [NOME DO COMPONENTE]
==========================================================================
Propósito: [Descreva o propósito do componente]
Props: [Liste as props principais]
Emits: [Liste os eventos emitidos]
Uso: <ComponentName :prop="value" @event="handler" /> -->

<template>
  <div class="component-wrapper">
    
    <!-- Conteúdo do componente -->
    <div class="component-content">
      <slot name="default">
        <!-- Conteúdo padrão -->
      </slot>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// ==========================================================================
// PROPS
// ==========================================================================
const props = defineProps({
  /**
   * Título do componente
   */
  title: {
    type: String,
    required: true
  },
  
  /**
   * Se o componente está visível
   */
  visible: {
    type: Boolean,
    default: false
  },
  
  /**
   * Dados a serem exibidos
   */
  data: {
    type: [Array, Object],
    default: () => ([])
  }
})

// ==========================================================================
// EMITS
// ==========================================================================
const emit = defineEmits([
  'update:visible',  // Para v-model:visible
  'submit',          // Ao submeter
  'cancel',          // Ao cancelar
  'change'           // Ao mudar
])

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const internalValue = ref(null)
const isProcessing = ref(false)

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================
const computedTitle = computed(() => props.title || 'Título Padrão')

// ==========================================================================
// WATCHERS
// ==========================================================================
watch(() => props.visible, (newVal) => {
  if (newVal) {
    console.log('✅ Componente aberto')
  }
})

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Manipula o submit do componente
 */
function handleSubmit() {
  if (!validate()) {
    return
  }
  
  isProcessing.value = true
  
  try {
    emit('submit', internalValue.value)
    console.log('✅ Submit executado')
  } catch (error) {
    console.error('❌ Erro no submit:', error)
  } finally {
    isProcessing.value = false
  }
}

/**
 * Valida os dados do componente
 * @returns {boolean} True se válido
 */
function validate() {
  // Implementar validação
  return true
}

/**
 * Reseta o estado do componente
 */
function reset() {
  internalValue.value = null
  isProcessing.value = false
}

/**
 * Fecha o componente
 */
function close() {
  emit('update:visible', false)
  reset()
}

// ==========================================================================
// EXPOSE (métodos públicos)
// ==========================================================================
defineExpose({
  reset,
  close
})
</script>

<style lang="scss" scoped>
.component-wrapper {
  // Estilos do wrapper
}

.component-content {
  // Estilos do conteúdo
}
</style>
```

**Instruções para Criar Novo Componente:**
1. Criar arquivo em `src/components/[contexto]/ComponentName.vue`
2. Copiar template acima e ajustar nome, propósito e comentários
3. Definir props com validação e valores padrão
4. Definir emits com nomes descritivos
5. Implementar lógica e métodos necessários
6. Documentar props e emits no comentário do topo

---

### 3. 🏪 Pinia Store

**Nomenclatura:** `[dominio].js` (ex: `auth.js`, `transactions.js`, `dashboard.js`)

**Propósito:** Gerenciar estado global da aplicação de forma reativa.

**Template Completo:**

```javascript
// ==========================================================================
// PINIA STORE - [NOME DO DOMÍNIO]
// ==========================================================================
// Propósito: Gerenciar estado global de [descreva o domínio]
// Origem: [De onde vem os dados]
// Efeitos: [O que este store afeta]

import { defineStore } from 'pinia'
import { serviceName } from 'src/services/serviceNameService'

export const useStoreNameStore = defineStore('storeName', {
  
  // ==========================================================================
  // ESTADO (STATE)
  // ==========================================================================
  state: () => ({
    // Dados principais
    items: [],                    // Lista de itens
    currentItem: null,            // Item atualmente selecionado
    
    // Estados de loading
    isLoading: false,             // Loading geral
    isLoadingItem: false,         // Loading de item específico
    
    // Estados de erro
    error: null,                  // Erro geral
    validationErrors: {},         // Erros de validação por campo
    
    // Filtros e paginação
    filters: {
      search: '',
      status: 'all',
      dateFrom: null,
      dateTo: null
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0
    }
  }),

  // ==========================================================================
  // GETTERS (COMPUTED)
  // ==========================================================================
  getters: {
    /**
     * Retorna items filtrados
     * @param {Object} state - Estado da store
     * @returns {Array} Items filtrados
     */
    filteredItems: (state) => {
      let result = [...state.items]
      
      // Aplicar filtro de busca
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        result = result.filter(item => 
          item.name?.toLowerCase().includes(search)
        )
      }
      
      // Aplicar filtro de status
      if (state.filters.status !== 'all') {
        result = result.filter(item => item.status === state.filters.status)
      }
      
      return result
    },

    /**
     * Verifica se há items
     * @param {Object} state - Estado da store
     * @returns {boolean} True se há items
     */
    hasItems: (state) => state.items.length > 0,

    /**
     * Retorna total de items
     * @param {Object} state - Estado da store
     * @returns {number} Total de items
     */
    totalItems: (state) => state.items.length,

    /**
     * Verifica se há erro
     * @param {Object} state - Estado da store
     * @returns {boolean} True se há erro
     */
    hasError: (state) => !!state.error
  },

  // ==========================================================================
  // ACTIONS
  // ==========================================================================
  actions: {
    
    /**
     * Carrega lista de items da API
     * @returns {Promise<void>}
     */
    async fetchItems() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('🔄 Carregando items...')
        
        const response = await serviceName.getItems(this.filters)
        
        this.items = response.items || []
        this.pagination.total = response.total || 0
        
        console.log(`✅ ${this.items.length} items carregados`)
      } catch (error) {
        console.error('❌ Erro ao carregar items:', error)
        this.error = error.message || 'Erro ao carregar items'
        this.items = []
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Carrega um item específico por ID
     * @param {string|number} id - ID do item
     * @returns {Promise<Object>}
     */
    async fetchItemById(id) {
      this.isLoadingItem = true
      this.error = null
      
      try {
        console.log(`🔄 Carregando item #${id}...`)
        
        const item = await serviceName.getItemById(id)
        
        this.currentItem = item
        
        console.log('✅ Item carregado:', item)
        return item
      } catch (error) {
        console.error(`❌ Erro ao carregar item #${id}:`, error)
        this.error = error.message || 'Erro ao carregar item'
        throw error
      } finally {
        this.isLoadingItem = false
      }
    },

    /**
     * Cria novo item
     * @param {Object} itemData - Dados do item a criar
     * @returns {Promise<Object>}
     */
    async createItem(itemData) {
      this.isLoading = true
      this.error = null
      this.validationErrors = {}
      
      try {
        console.log('🔄 Criando novo item...')
        
        const newItem = await serviceName.createItem(itemData)
        
        // Adiciona item à lista local
        this.items.unshift(newItem)
        this.pagination.total++
        
        console.log('✅ Item criado com sucesso:', newItem)
        return newItem
      } catch (error) {
        console.error('❌ Erro ao criar item:', error)
        this.error = error.message || 'Erro ao criar item'
        
        // Se for erro de validação, armazena os erros
        if (error.validationErrors) {
          this.validationErrors = error.validationErrors
        }
        
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Atualiza item existente
     * @param {string|number} id - ID do item
     * @param {Object} itemData - Dados atualizados
     * @returns {Promise<Object>}
     */
    async updateItem(id, itemData) {
      this.isLoading = true
      this.error = null
      this.validationErrors = {}
      
      try {
        console.log(`🔄 Atualizando item #${id}...`)
        
        const updatedItem = await serviceName.updateItem(id, itemData)
        
        // Atualiza item na lista local
        const index = this.items.findIndex(item => item.id === id)
        if (index !== -1) {
          this.items[index] = updatedItem
        }
        
        // Atualiza currentItem se for o mesmo
        if (this.currentItem?.id === id) {
          this.currentItem = updatedItem
        }
        
        console.log('✅ Item atualizado com sucesso:', updatedItem)
        return updatedItem
      } catch (error) {
        console.error(`❌ Erro ao atualizar item #${id}:`, error)
        this.error = error.message || 'Erro ao atualizar item'
        
        if (error.validationErrors) {
          this.validationErrors = error.validationErrors
        }
        
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Deleta item
     * @param {string|number} id - ID do item a deletar
     * @returns {Promise<void>}
     */
    async deleteItem(id) {
      this.isLoading = true
      this.error = null
      
      try {
        console.log(`🔄 Deletando item #${id}...`)
        
        await serviceName.deleteItem(id)
        
        // Remove item da lista local
        this.items = this.items.filter(item => item.id !== id)
        this.pagination.total--
        
        // Limpa currentItem se for o mesmo
        if (this.currentItem?.id === id) {
          this.currentItem = null
        }
        
        console.log(`✅ Item #${id} deletado com sucesso`)
      } catch (error) {
        console.error(`❌ Erro ao deletar item #${id}:`, error)
        this.error = error.message || 'Erro ao deletar item'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Atualiza filtros
     * @param {Object} newFilters - Novos filtros
     */
    updateFilters(newFilters) {
      this.filters = {
        ...this.filters,
        ...newFilters
      }
      
      // Reset pagination ao mudar filtros
      this.pagination.page = 1
      
      console.log('🔄 Filtros atualizados:', this.filters)
    },

    /**
     * Reseta filtros para valores padrão
     */
    resetFilters() {
      this.filters = {
        search: '',
        status: 'all',
        dateFrom: null,
        dateTo: null
      }
      this.pagination.page = 1
      
      console.log('🔄 Filtros resetados')
    },

    /**
     * Limpa estado da store
     */
    clearState() {
      this.items = []
      this.currentItem = null
      this.error = null
      this.validationErrors = {}
      this.isLoading = false
      this.isLoadingItem = false
      
      console.log('🧹 Estado da store limpo')
    }
  }
})
```

**Instruções para Criar Nova Store:**
1. Criar arquivo em `src/stores/[dominio].js`
2. Copiar template acima e ajustar nome do store
3. Definir state com dados do domínio
4. Criar getters para computed properties úteis
5. Implementar actions assíncronas para operações CRUD
6. Sempre usar try/catch e logging detalhado
7. Importar e usar em componentes com `const store = useStoreNameStore()`

---

### 4. 🔧 Service (API Service)

**Nomenclatura:** `*Service.js` (ex: `authService.js`, `transactionService.js`)

**Propósito:** Encapsular todas as chamadas HTTP à API REST, tratando erros e normalizando respostas.

**Template Completo:**

```javascript
// ==========================================================================
// SERVICE - [NOME DO SERVIÇO]
// ==========================================================================
// Propósito: Encapsular chamadas de [domínio] à API REST
// Origem: Componentes Vue e Stores Pinia
// Destino: API REST http://localhost:3000/api/[domínio]/*
// Efeitos: [Descreva os efeitos principais]

import { api } from 'boot/axios'
import { handleApiResponse } from 'src/utils/apiResponse'

/**
 * Serviço para [domínio] que encapsula chamadas à API
 * Todos os métodos retornam Promises para uso com async/await
 */
export const serviceNameService = {
  
  // ==========================================================================
  // GET - Buscar lista de items
  // ==========================================================================
  /**
   * Busca lista de items da API
   * @param {Object} filters - Filtros opcionais
   * @param {string} filters.search - Termo de busca
   * @param {string} filters.status - Status do item
   * @param {string} filters.dateFrom - Data inicial (YYYY-MM-DD)
   * @param {string} filters.dateTo - Data final (YYYY-MM-DD)
   * @returns {Promise<Object>} { items: Array, total: number }
   */
  async getItems(filters = {}) {
    console.log('🔄 [SERVICE] Buscando items...', filters)
    
    try {
      const response = await api.get('/items', {
        params: {
          search: filters.search || undefined,
          status: filters.status !== 'all' ? filters.status : undefined,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          page: filters.page || 1,
          limit: filters.limit || 20
        }
      })
      
      const data = handleApiResponse(response, 'getItems')
      
      console.log(`✅ [SERVICE] ${data.items?.length || 0} items retornados`)
      
      return {
        items: data.items || [],
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 20
      }
    } catch (error) {
      console.error('❌ [SERVICE] Erro ao buscar items:', error)
      throw error
    }
  },

  // ==========================================================================
  // GET - Buscar item por ID
  // ==========================================================================
  /**
   * Busca um item específico por ID
   * @param {string|number} id - ID do item
   * @returns {Promise<Object>} Dados do item
   */
  async getItemById(id) {
    console.log(`🔄 [SERVICE] Buscando item #${id}...`)
    
    try {
      const response = await api.get(`/items/${id}`)
      
      const data = handleApiResponse(response, 'getItemById')
      
      console.log(`✅ [SERVICE] Item #${id} retornado`)
      
      return data.item || data
    } catch (error) {
      console.error(`❌ [SERVICE] Erro ao buscar item #${id}:`, error)
      throw error
    }
  },

  // ==========================================================================
  // POST - Criar novo item
  // ==========================================================================
  /**
   * Cria um novo item
   * @param {Object} itemData - Dados do item a criar
   * @param {string} itemData.name - Nome do item (obrigatório)
   * @param {string} itemData.description - Descrição do item
   * @param {string} itemData.status - Status do item
   * @returns {Promise<Object>} Item criado
   */
  async createItem(itemData) {
    console.log('🔄 [SERVICE] Criando novo item...', itemData)
    
    try {
      const response = await api.post('/items', {
        name: itemData.name,
        description: itemData.description,
        status: itemData.status || 'active'
      })
      
      const data = handleApiResponse(response, 'createItem')
      
      console.log('✅ [SERVICE] Item criado com sucesso:', data.item)
      
      return data.item || data
    } catch (error) {
      console.error('❌ [SERVICE] Erro ao criar item:', error)
      throw error
    }
  },

  // ==========================================================================
  // PUT - Atualizar item existente
  // ==========================================================================
  /**
   * Atualiza um item existente
   * @param {string|number} id - ID do item
   * @param {Object} itemData - Dados atualizados
   * @returns {Promise<Object>} Item atualizado
   */
  async updateItem(id, itemData) {
    console.log(`🔄 [SERVICE] Atualizando item #${id}...`, itemData)
    
    try {
      const response = await api.put(`/items/${id}`, itemData)
      
      const data = handleApiResponse(response, 'updateItem')
      
      console.log(`✅ [SERVICE] Item #${id} atualizado com sucesso`)
      
      return data.item || data
    } catch (error) {
      console.error(`❌ [SERVICE] Erro ao atualizar item #${id}:`, error)
      throw error
    }
  },

  // ==========================================================================
  // PATCH - Atualizar parcialmente
  // ==========================================================================
  /**
   * Atualiza parcialmente um item (apenas campos enviados)
   * @param {string|number} id - ID do item
   * @param {Object} partialData - Dados parciais a atualizar
   * @returns {Promise<Object>} Item atualizado
   */
  async patchItem(id, partialData) {
    console.log(`🔄 [SERVICE] Atualizando parcialmente item #${id}...`)
    
    try {
      const response = await api.patch(`/items/${id}`, partialData)
      
      const data = handleApiResponse(response, 'patchItem')
      
      console.log(`✅ [SERVICE] Item #${id} atualizado parcialmente`)
      
      return data.item || data
    } catch (error) {
      console.error(`❌ [SERVICE] Erro ao atualizar item #${id}:`, error)
      throw error
    }
  },

  // ==========================================================================
  // DELETE - Deletar item
  // ==========================================================================
  /**
   * Deleta um item
   * @param {string|number} id - ID do item a deletar
   * @returns {Promise<void>}
   */
  async deleteItem(id) {
    console.log(`🔄 [SERVICE] Deletando item #${id}...`)
    
    try {
      const response = await api.delete(`/items/${id}`)
      
      handleApiResponse(response, 'deleteItem')
      
      console.log(`✅ [SERVICE] Item #${id} deletado com sucesso`)
    } catch (error) {
      console.error(`❌ [SERVICE] Erro ao deletar item #${id}:`, error)
      throw error
    }
  },

  // ==========================================================================
  // GET - Buscar estatísticas
  // ==========================================================================
  /**
   * Busca estatísticas agregadas
   * @param {Object} filters - Filtros de período
   * @returns {Promise<Object>} Estatísticas
   */
  async getStatistics(filters = {}) {
    console.log('🔄 [SERVICE] Buscando estatísticas...')
    
    try {
      const response = await api.get('/items/statistics', {
        params: filters
      })
      
      const data = handleApiResponse(response, 'getStatistics')
      
      console.log('✅ [SERVICE] Estatísticas retornadas')
      
      return data.statistics || data
    } catch (error) {
      console.error('❌ [SERVICE] Erro ao buscar estatísticas:', error)
      throw error
    }
  }
}

/**
 * Exportação default do serviço
 */
export default serviceNameService
```

**Instruções para Criar Novo Service:**
1. Criar arquivo em `src/services/[dominio]Service.js`
2. Copiar template acima e ajustar nome e endpoints
3. Importar `api` do boot/axios e `handleApiResponse` do utils
4. Criar um método para cada endpoint da API (GET, POST, PUT, PATCH, DELETE)
5. Sempre usar logging detalhado (console.log/error) com emojis
6. Documentar parâmetros e retorno com JSDoc
7. Usar try/catch em todos os métodos assíncronos
8. Normalizar respostas com `handleApiResponse`

---

### 5. 🎣 Composable

**Nomenclatura:** `use*.js` (ex: `useNotifications.js`, `useCurrency.js`)

**Propósito:** Encapsular lógica reutilizável com reatividade do Vue 3.

**Template Completo:**

```javascript
// ==========================================================================
// COMPOSABLE - [NOME DO COMPOSABLE]
// ==========================================================================
// Propósito: [Descreva o propósito]
// Uso: const { method1, computed1 } = useComposableName()
// Efeitos: [O que este composable faz]

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

/**
 * Composable para [descrever funcionalidade]
 * @param {Object} options - Opções de configuração (opcional)
 * @param {boolean} options.autoInit - Se deve inicializar automaticamente
 * @returns {Object} Métodos e propriedades reativas
 */
export function useComposableName(options = {}) {
  
  // ==========================================================================
  // COMPOSABLES EXTERNOS
  // ==========================================================================
  const $q = useQuasar()

  // ==========================================================================
  // ESTADO REATIVO
  // ==========================================================================
  const internalState = ref(null)
  const isActive = ref(false)
  const count = ref(0)

  // ==========================================================================
  // COMPUTED PROPERTIES
  // ==========================================================================
  
  /**
   * Retorna se está ativo
   */
  const active = computed(() => isActive.value)

  /**
   * Retorna contagem formatada
   */
  const formattedCount = computed(() => {
    return count.value.toString().padStart(2, '0')
  })

  // ==========================================================================
  // WATCHERS
  // ==========================================================================
  
  watch(isActive, (newVal) => {
    if (newVal) {
      console.log('✅ Composable ativado')
      // Lógica ao ativar
    } else {
      console.log('⏹️ Composable desativado')
      // Lógica ao desativar
    }
  })

  // ==========================================================================
  // MÉTODOS
  // ==========================================================================
  
  /**
   * Inicializa o composable
   */
  function initialize() {
    console.log('🔄 Inicializando composable...')
    
    try {
      isActive.value = true
      count.value = 0
      
      console.log('✅ Composable inicializado')
    } catch (error) {
      console.error('❌ Erro ao inicializar:', error)
      throw error
    }
  }

  /**
   * Incrementa contador
   * @param {number} value - Valor a incrementar (padrão: 1)
   */
  function increment(value = 1) {
    count.value += value
    console.log(`➕ Contador incrementado para ${count.value}`)
  }

  /**
   * Decrementa contador
   * @param {number} value - Valor a decrementar (padrão: 1)
   */
  function decrement(value = 1) {
    count.value = Math.max(0, count.value - value)
    console.log(`➖ Contador decrementado para ${count.value}`)
  }

  /**
   * Reseta o composable
   */
  function reset() {
    count.value = 0
    isActive.value = false
    internalState.value = null
    
    console.log('🔄 Composable resetado')
  }

  /**
   * Executa ação assíncrona
   * @param {Object} data - Dados para processar
   * @returns {Promise<void>}
   */
  async function performAction(data) {
    console.log('🔄 Executando ação...', data)
    
    try {
      // Simular operação assíncrona
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      internalState.value = data
      
      console.log('✅ Ação executada com sucesso')
    } catch (error) {
      console.error('❌ Erro ao executar ação:', error)
      throw error
    }
  }

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================
  
  // Auto-inicializar se configurado
  if (options.autoInit) {
    onMounted(() => {
      initialize()
    })
  }

  // Cleanup ao desmontar
  onUnmounted(() => {
    console.log('🧹 Limpando composable')
    reset()
  })

  // ==========================================================================
  // RETORNO PÚBLICO
  // ==========================================================================
  return {
    // Estado reativo
    isActive,
    count,
    
    // Computed properties
    active,
    formattedCount,
    
    // Métodos
    initialize,
    increment,
    decrement,
    reset,
    performAction
  }
}

/**
 * Exportação default
 */
export default useComposableName
```

**Instruções para Criar Novo Composable:**
1. Criar arquivo em `src/composables/use[Nome].js`
2. Copiar template acima e ajustar nome e funcionalidade
3. Definir estado reativo necessário com `ref()`
4. Criar computed properties com `computed()`
5. Implementar métodos de manipulação
6. Retornar apenas o que precisa ser público
7. Documentar parâmetros e retorno com JSDoc
8. Importar em componentes com `import { useComposableName } from 'src/composables/useComposableName'`

---

### 6. 📡 API Centralizador

**Nomenclatura:** `[dominio].js` (ex: `auth.js`, `transactions.js`)

**Localização:** `src/apis/`

**Propósito:** Centralizar todas as rotas e helpers de chamadas à API, eliminando código HTTP espalhado.

**Template Completo:**

```javascript
// ==========================================================================
// API - [NOME DO DOMÍNIO]
// ==========================================================================
// Propósito: Centralizar rotas e helpers de API para [domínio]
// Origem: Services e Stores
// Destino: Backend API
// Padrão: { success, data, message }

import { api } from 'boot/axios'

// ==========================================================================
// MAPA DE ROTAS - [DOMÍNIO]
// ==========================================================================
export const API_ROUTES = {
  // Listar
  list: '/items',
  
  // CRUD por ID
  getById: (id) => `/items/${id}`,
  create: '/items',
  update: (id) => `/items/${id}`,
  patch: (id) => `/items/${id}`,
  delete: (id) => `/items/${id}`,
  
  // Ações especiais
  statistics: '/items/statistics',
  export: '/items/export',
  import: '/items/import'
}

// ==========================================================================
// HELPERS DE API
// ==========================================================================

/**
 * Busca lista de items
 * @param {Object} params - Query params
 * @returns {Promise<Object>} { success, data: { items, total }, message }
 */
export async function fetchItems(params = {}) {
  const response = await api.get(API_ROUTES.list, { params })
  return response.data
}

/**
 * Busca item por ID
 * @param {string|number} id - ID do item
 * @returns {Promise<Object>} { success, data: { item }, message }
 */
export async function fetchItemById(id) {
  const response = await api.get(API_ROUTES.getById(id))
  return response.data
}

/**
 * Cria novo item
 * @param {Object} itemData - Dados do item
 * @returns {Promise<Object>} { success, data: { item }, message }
 */
export async function createItem(itemData) {
  const response = await api.post(API_ROUTES.create, itemData)
  return response.data
}

/**
 * Atualiza item completo
 * @param {string|number} id - ID do item
 * @param {Object} itemData - Dados atualizados
 * @returns {Promise<Object>} { success, data: { item }, message }
 */
export async function updateItem(id, itemData) {
  const response = await api.put(API_ROUTES.update(id), itemData)
  return response.data
}

/**
 * Atualiza item parcialmente
 * @param {string|number} id - ID do item
 * @param {Object} partialData - Dados parciais
 * @returns {Promise<Object>} { success, data: { item }, message }
 */
export async function patchItem(id, partialData) {
  const response = await api.patch(API_ROUTES.patch(id), partialData)
  return response.data
}

/**
 * Deleta item
 * @param {string|number} id - ID do item
 * @returns {Promise<Object>} { success, data: null, message }
 */
export async function deleteItem(id) {
  const response = await api.delete(API_ROUTES.delete(id))
  return response.data
}

/**
 * Busca estatísticas
 * @param {Object} params - Filtros
 * @returns {Promise<Object>} { success, data: { statistics }, message }
 */
export async function fetchStatistics(params = {}) {
  const response = await api.get(API_ROUTES.statistics, { params })
  return response.data
}

/**
 * Exporta dados
 * @param {Object} params - Filtros e formato
 * @returns {Promise<Blob>} Arquivo para download
 */
export async function exportData(params = {}) {
  const response = await api.get(API_ROUTES.export, {
    params,
    responseType: 'blob'
  })
  return response.data
}

/**
 * Importa dados
 * @param {FormData} formData - Arquivo e metadados
 * @returns {Promise<Object>} { success, data: { imported, errors }, message }
 */
export async function importData(formData) {
  const response = await api.post(API_ROUTES.import, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}
```

**Instruções para Criar Novo Centralizador de API:**
1. Criar arquivo em `src/apis/[dominio].js`
2. Copiar template acima e ajustar rotas
3. Exportar `API_ROUTES` com todas as rotas
4. Criar helper assíncrono para cada endpoint
5. Sempre retornar `response.data` (estrutura padronizada)
6. Documentar parâmetros e retorno com JSDoc
7. Importar em services: `import { fetchItems } from 'src/apis/[dominio]'`

---

## 🧪 Testes

### Template de Teste para Componente Vue

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { Quasar } from 'quasar'
import ComponentName from 'src/components/ComponentName.vue'

describe('ComponentName.vue', () => {
  
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  /**
   * Cria wrapper do componente com props padrão
   */
  function createWrapper(props = {}, options = {}) {
    return mount(ComponentName, {
      props: {
        title: 'Título Teste',
        visible: true,
        ...props
      },
      global: {
        plugins: [Quasar],
        ...options.global
      }
    })
  }

  it('deve renderizar o componente corretamente', () => {
    const wrapper = createWrapper()
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.component-wrapper').exists()).toBe(true)
  })

  it('deve exibir o título correto', () => {
    const wrapper = createWrapper({ title: 'Título Personalizado' })
    
    expect(wrapper.text()).toContain('Título Personalizado')
  })

  it('deve emitir evento submit ao submeter', async () => {
    const wrapper = createWrapper()
    
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0]).toEqual([expect.any(Object)])
  })

  it('deve validar dados antes de submeter', async () => {
    const wrapper = createWrapper()
    
    // Deixar campo vazio
    await wrapper.find('input').setValue('')
    await wrapper.find('form').trigger('submit')
    
    // Não deve emitir submit se inválido
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('deve fechar ao clicar em cancelar', async () => {
    const wrapper = createWrapper()
    
    await wrapper.find('[data-test="cancel-btn"]').trigger('click')
    
    expect(wrapper.emitted('update:visible')).toBeTruthy()
    expect(wrapper.emitted('update:visible')[0]).toEqual([false])
  })

  it('deve resetar estado ao chamar método reset', async () => {
    const wrapper = createWrapper()
    
    wrapper.vm.reset()
    
    expect(wrapper.vm.internalValue).toBeNull()
    expect(wrapper.vm.isProcessing).toBe(false)
  })
})
```

### Template de Teste para Store Pinia

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useStoreNameStore } from 'src/stores/storeName'
import * as serviceNameService from 'src/services/serviceNameService'

vi.mock('src/services/serviceNameService')

describe('Store - storeName', () => {
  
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useStoreNameStore()
    vi.clearAllMocks()
  })

  describe('Estado Inicial', () => {
    it('deve inicializar com estado vazio', () => {
      expect(store.items).toEqual([])
      expect(store.currentItem).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('Getters', () => {
    it('hasItems deve retornar false quando vazio', () => {
      expect(store.hasItems).toBe(false)
    })

    it('hasItems deve retornar true quando tem items', () => {
      store.items = [{ id: 1, name: 'Item 1' }]
      expect(store.hasItems).toBe(true)
    })

    it('totalItems deve retornar contagem correta', () => {
      store.items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]
      expect(store.totalItems).toBe(2)
    })
  })

  describe('Actions - fetchItems', () => {
    it('deve carregar items com sucesso', async () => {
      const mockItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]
      
      serviceNameService.getItems.mockResolvedValue({
        items: mockItems,
        total: 2
      })

      await store.fetchItems()

      expect(store.items).toEqual(mockItems)
      expect(store.pagination.total).toBe(2)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('deve tratar erro ao carregar items', async () => {
      const errorMessage = 'Erro de rede'
      serviceNameService.getItems.mockRejectedValue(new Error(errorMessage))

      await expect(store.fetchItems()).rejects.toThrow(errorMessage)

      expect(store.items).toEqual([])
      expect(store.error).toBe(errorMessage)
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Actions - createItem', () => {
    it('deve criar item com sucesso', async () => {
      const newItem = { id: 1, name: 'Novo Item' }
      serviceNameService.createItem.mockResolvedValue(newItem)

      const result = await store.createItem({ name: 'Novo Item' })

      expect(result).toEqual(newItem)
      expect(store.items).toContain(newItem)
      expect(store.pagination.total).toBe(1)
    })

    it('deve tratar erro de validação', async () => {
      const validationError = {
        message: 'Erro de validação',
        validationErrors: { name: 'Nome obrigatório' }
      }
      
      serviceNameService.createItem.mockRejectedValue(validationError)

      await expect(store.createItem({})).rejects.toThrow()

      expect(store.validationErrors).toEqual(validationError.validationErrors)
    })
  })

  describe('Actions - updateItem', () => {
    it('deve atualizar item com sucesso', async () => {
      store.items = [{ id: 1, name: 'Item Original' }]
      
      const updatedItem = { id: 1, name: 'Item Atualizado' }
      serviceNameService.updateItem.mockResolvedValue(updatedItem)

      await store.updateItem(1, { name: 'Item Atualizado' })

      expect(store.items[0]).toEqual(updatedItem)
    })
  })

  describe('Actions - deleteItem', () => {
    it('deve deletar item com sucesso', async () => {
      store.items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]
      store.pagination.total = 2

      serviceNameService.deleteItem.mockResolvedValue()

      await store.deleteItem(1)

      expect(store.items).toHaveLength(1)
      expect(store.items.find(i => i.id === 1)).toBeUndefined()
      expect(store.pagination.total).toBe(1)
    })
  })

  describe('Filtros', () => {
    it('deve atualizar filtros corretamente', () => {
      store.updateFilters({ search: 'teste', status: 'active' })

      expect(store.filters.search).toBe('teste')
      expect(store.filters.status).toBe('active')
      expect(store.pagination.page).toBe(1)
    })

    it('deve resetar filtros', () => {
      store.filters.search = 'teste'
      store.filters.status = 'active'

      store.resetFilters()

      expect(store.filters.search).toBe('')
      expect(store.filters.status).toBe('all')
    })
  })
})
```

### Template de Teste para Composable

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { useComposableName } from 'src/composables/useComposableName'

describe('useComposableName', () => {
  
  let composable

  beforeEach(() => {
    composable = useComposableName()
  })

  it('deve inicializar com valores padrão', () => {
    expect(composable.isActive.value).toBe(false)
    expect(composable.count.value).toBe(0)
  })

  it('deve ativar corretamente', () => {
    composable.initialize()
    
    expect(composable.isActive.value).toBe(true)
  })

  it('deve incrementar contador', () => {
    composable.increment()
    expect(composable.count.value).toBe(1)
    
    composable.increment(5)
    expect(composable.count.value).toBe(6)
  })

  it('deve decrementar contador', () => {
    composable.count.value = 10
    
    composable.decrement()
    expect(composable.count.value).toBe(9)
    
    composable.decrement(5)
    expect(composable.count.value).toBe(4)
  })

  it('não deve permitir contador negativo', () => {
    composable.count.value = 2
    
    composable.decrement(5)
    
    expect(composable.count.value).toBe(0)
  })

  it('deve resetar estado', () => {
    composable.count.value = 10
    composable.isActive.value = true
    
    composable.reset()
    
    expect(composable.count.value).toBe(0)
    expect(composable.isActive.value).toBe(false)
  })

  it('deve executar ação assíncrona', async () => {
    const data = { test: 'value' }
    
    await composable.performAction(data)
    
    expect(composable.internalState.value).toEqual(data)
  })

  it('computed formattedCount deve formatar corretamente', () => {
    composable.count.value = 5
    expect(composable.formattedCount.value).toBe('05')
    
    composable.count.value = 15
    expect(composable.formattedCount.value).toBe('15')
  })
})
```

---

## 📋 Tabela de Nomenclatura

| Tipo | Padrão | Exemplos |
|------|--------|----------|
| **Páginas Vue** | `*Page.vue` | `DashboardPage.vue`, `PlansPage.vue`, `ReportsPage.vue` |
| **Componentes Vue** | `PascalCase.vue` | `TransactionForm.vue`, `LoadingOverlay.vue`, `EmptyState.vue` |
| **Stores Pinia** | `[dominio].js` | `auth.js`, `transactions.js`, `dashboard.js` |
| **Services** | `*Service.js` | `authService.js`, `transactionService.js`, `planService.js` |
| **Composables** | `use*.js` | `useNotifications.js`, `useCurrency.js`, `useTheme.js` |
| **APIs** | `[dominio].js` | `auth.js`, `transactions.js`, `dashboard.js` |
| **Utilitários** | `camelCase.js` | `apiResponse.js`, `apiUtils.js` |
| **Constantes** | `camelCase.js` | `messages.js` |
| **Variáveis** | `camelCase` | `userName`, `isLoading`, `itemData` |
| **Funções** | `camelCase` | `fetchItems()`, `handleSubmit()`, `validateForm()` |
| **Constantes** | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRY_COUNT` |
| **Props/Emits** | `kebab-case` (template), `camelCase` (script) | `:user-name`, `@update-value` |
| **Rotas** | `kebab-case` | `/dashboard`, `/plans`, `/auth/login` |
| **CSS Classes** | `kebab-case` | `.page-container`, `.btn-primary` |

---

## 📜 Instruções Gerais

### 1. Estrutura de Comentários

Sempre incluir cabeçalho de seção com:
```javascript
// ==========================================================================
// TÍTULO DA SEÇÃO
// ==========================================================================
// Propósito: [O que faz]
// Origem: [De onde vem]
// Destino: [Para onde vai]
// Efeitos: [O que afeta]
```

### 2. Logging

Usar emojis nos logs para facilitar identificação:
- `🔄` - Início de operação
- `✅` - Sucesso
- `❌` - Erro
- `⚠️` - Aviso
- `🔥` - Erro crítico
- `🧹` - Limpeza
- `🚀` - Inicialização
- `➕` - Incremento
- `➖` - Decremento

Exemplo:
```javascript
console.log('🔄 Carregando dados...')
console.log('✅ Dados carregados com sucesso')
console.error('❌ Erro ao carregar:', error)
```

### 3. Tratamento de Erros

Sempre usar try/catch em operações assíncronas:
```javascript
async function fetchData() {
  try {
    const data = await api.get('/data')
    return data
  } catch (error) {
    console.error('❌ Erro:', error)
    throw error
  }
}
```

### 4. Validação de Dados

Validar entrada antes de processar:
```javascript
function processItem(item) {
  if (!item || !item.id) {
    console.error('❌ Item inválido:', item)
    throw new Error('Item inválido')
  }
  // processar...
}
```

### 5. Estrutura Padrão da API

Toda resposta da API segue:
```javascript
{
  success: true|false,
  data: { /* dados */ },
  message: "Mensagem descritiva"
}
```

Usar `handleApiResponse()` para normalizar:
```javascript
import { handleApiResponse } from 'src/utils/apiResponse'

const response = await api.get('/items')
const data = handleApiResponse(response, 'fetchItems')
```

### 6. Notificações ao Usuário

Usar composable `useNotifications`:
```javascript
import { useNotifications } from 'src/composables/useNotifications'

const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotifications()

notifySuccess('Operação realizada com sucesso!')
notifyError('Erro ao realizar operação')
```

### 7. Mensagens Centralizadas

Usar constantes de `src/constants/messages.js`:
```javascript
import { MESSAGES } from 'src/constants/messages'

notifyError(MESSAGES.ERROR.NETWORK_ERROR)
notifySuccess(MESSAGES.SUCCESS.LOGIN)
```

### 8. Formatação de Dados

Usar composables para formatação:
```javascript
import { useCurrency } from 'src/composables/useCurrency'
import { useDate } from 'src/composables/useDate'

const { formatCurrency } = useCurrency()
const { formatDate } = useDate()

const priceFormatted = formatCurrency(1500.50) // R$ 1.500,50
const dateFormatted = formatDate('2024-01-15') // 15/01/2024
```

### 9. Estados de Loading

Sempre mostrar feedback visual:
```vue
<template>
  <div v-if="isLoading" class="flex flex-center">
    <q-spinner color="primary" size="3em" />
  </div>
  <div v-else>
    <!-- conteúdo -->
  </div>
</template>
```

### 10. Estado Vazio

Usar componente `EmptyState`:
```vue
<EmptyState
  v-if="items.length === 0"
  icon="inbox"
  title="Nenhum item encontrado"
  subtitle="Comece criando seu primeiro item"
  action-label="Criar Item"
  @action="handleCreate"
/>
```

### 11. Permissões e Planos

Verificar permissões com composable:
```javascript
import { useFeaturePermissions } from 'src/composables/useFeaturePermissions'

const { canAccessFeature } = useFeaturePermissions()

if (!canAccessFeature('reports')) {
  // Mostrar upgrade banner
}
```

### 12. Responsividade

Usar composable `useResponsive`:
```javascript
import { useResponsive } from 'src/composables/useResponsive'

const { isMobile, isTablet, isDesktop } = useResponsive()

if (isMobile.value) {
  // Layout mobile
}
```

### 13. Tema Escuro

Usar `$q.dark.isActive` do Quasar:
```vue
<q-card :dark="$q.dark.isActive">
  <!-- conteúdo -->
</q-card>
```

### 14. Internacionalização

Usar `$t()` do vue-i18n:
```vue
<template>
  <h1>{{ $t('dashboard.title') }}</h1>
</template>
```

### 15. Navegação

Usar Vue Router composable:
```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

function goToPlans() {
  router.push('/plans')
}
```

---

## 🧪 Criação Automática de Testes

### Quando Criar Testes Automaticamente

Ao criar novos componentes, stores ou composables, SEMPRE criar arquivo de teste correspondente:

- `ComponentName.vue` → `ComponentName.spec.js`
- `storeName.js` → `storeName.spec.js`
- `useComposable.js` → `useComposable.spec.js`

### Estrutura de Testes

```javascript
describe('Nome do Arquivo', () => {
  
  describe('Cenário/Feature 1', () => {
    it('deve fazer X com sucesso', () => {
      // Arrange (preparar)
      // Act (executar)
      // Assert (verificar)
    })
    
    it('deve tratar erro quando Y', () => {
      // Arrange
      // Act
      // Assert
    })
  })
  
  describe('Cenário/Feature 2', () => {
    it('deve validar Z', () => {
      // ...
    })
  })
})
```

### Cobertura Mínima de Testes

- **Componentes:** Renderização, props, eventos, validação
- **Stores:** Estado inicial, getters, actions (sucesso e erro)
- **Composables:** Inicialização, métodos principais, computed properties
- **Services:** Chamadas HTTP (sucesso, erro, validação)

---

## 📝 Estrutura de Commits

### Formato Padrão

```
<tipo>: <descrição curta>

<descrição detalhada opcional>

<footer opcional>
```

### Tipos de Commit

| Tipo | Uso |
|------|-----|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Mudanças na documentação |
| `style` | Formatação, ponto e vírgula, etc (sem mudança de código) |
| `refactor` | Refatoração de código |
| `perf` | Melhoria de performance |
| `test` | Adição ou correção de testes |
| `chore` | Tarefas de build, configs, etc |
| `ci` | Mudanças em CI/CD |
| `revert` | Reverter commit anterior |

### Exemplos de Commits

```
feat: adiciona filtro por categoria no dashboard

Implementa novo filtro de categoria nas transações do dashboard,
permitindo ao usuário visualizar apenas receitas ou despesas de
categorias específicas.

- Adiciona componente CategoryFilter
- Integra filtro com store de transações
- Atualiza testes unitários

Closes #123
```

```
fix: corrige cálculo de saldo mensal

O saldo estava considerando transações futuras. Agora filtra
apenas transações do mês atual.

Fixes #456
```

```
refactor: migra authService para usar API centralizada

Move chamadas HTTP diretas para src/apis/auth.js, seguindo
padrão de centralização de APIs do projeto.
```

```
docs: atualiza README com instruções de deploy

Adiciona seção sobre deploy no Render e variáveis de ambiente
necessárias.
```

### Regras de Commit

1. **Primeira linha:**
   - Máximo 72 caracteres
   - Começar com verbo no imperativo
   - Minúscula (exceto nomes próprios)
   - Sem ponto final

2. **Corpo do commit:**
   - Linha em branco após título
   - Explicar "o que" e "por que", não "como"
   - Quebrar linhas em 72 caracteres

3. **Idioma:**
   - Português brasileiro
   - Modo imperativo ("adiciona", não "adicionado" ou "adicionando")

4. **Referências:**
   - Usar `Closes #123` para fechar issues
   - Usar `Fixes #456` para indicar correções
   - Usar `Refs #789` para referencias

---

## 🔒 Segurança

### 1. Autenticação

- **Token JWT:** Armazenado em `localStorage` (`auth_token`)
- **Renovação:** Automática via interceptor do Axios
- **Expiração:** Redireciona para login ao detectar token inválido
- **Interceptors:** Adiciona token automaticamente em todas as requests

### 2. Proteção de Rotas

Usar meta `requiresAuth` nas rotas:
```javascript
{
  path: '/dashboard',
  component: DashboardPage,
  meta: { requiresAuth: true }
}
```

Guard global no router:
```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } else {
    next()
  }
})
```

### 3. Variáveis de Ambiente

**NUNCA** commitar arquivos `.env` com dados sensíveis.

Usar `.env.example` como template:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME="Financial Control"
```

### 4. Sanitização de Inputs

Validar e sanitizar todos os inputs do usuário:
```javascript
function sanitizeInput(value) {
  return value.trim().replace(/<script>/gi, '')
}
```

### 5. XSS Protection

- Sempre usar `v-text` ou `{{ }}` para exibir dados do usuário
- Evitar `v-html` com dados não confiáveis
- Validar dados no backend

### 6. CSRF Protection

- Token CSRF enviado automaticamente pelo backend
- Interceptor do Axios adiciona token em requests mutantes (POST, PUT, DELETE)

### 7. Permissões por Plano

Verificar permissões antes de exibir features:
```javascript
const { canAccessFeature, showUpgradeDialog } = useFeaturePermissions()

if (!canAccessFeature('reports')) {
  showUpgradeDialog('reports')
  return
}
```

### 8. Logs Sensíveis

**NUNCA** logar dados sensíveis:
- ❌ Senhas
- ❌ Tokens completos
- ❌ Dados de cartão
- ❌ CPF/CNPJ completos

```javascript
// ❌ ERRADO
console.log('Senha:', password)

// ✅ CORRETO
console.log('Login realizado com sucesso')
```

### 9. Tratamento de Erros

Não expor detalhes técnicos ao usuário:
```javascript
catch (error) {
  console.error('❌ Erro técnico:', error) // Log para dev
  notifyError('Erro ao processar operação') // Mensagem para usuário
}
```

### 10. Sessão Expirada

Detectar e tratar sessão expirada:
```javascript
// boot/axios.js
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/auth/login')
    }
    return Promise.reject(error)
  }
)
```

---

## 🎯 Diretrizes para GitHub Copilot

### Ao Sugerir Código

1. **Seguir sempre os templates acima**
2. **Incluir comentários descritivos em português**
3. **Usar logging com emojis**
4. **Adicionar JSDoc em funções públicas**
5. **Validar inputs e tratar erros**
6. **Usar composables existentes quando possível**
7. **Seguir padrões de nomenclatura**
8. **Incluir estados de loading e erro**
9. **Considerar responsividade (mobile-first)**
10. **Respeitar estrutura de pastas**

### Ao Criar Novos Arquivos

1. **Verificar se já existe similar**
2. **Usar template correspondente ao tipo**
3. **Adicionar cabeçalho descritivo**
4. **Criar teste correspondente**
5. **Atualizar imports necessários**
6. **Documentar no README se relevante**

### Ao Modificar Código Existente

1. **Manter consistência de estilo**
2. **Não remover comentários úteis**
3. **Preservar logging existente**
4. **Atualizar testes se necessário**
5. **Verificar impacto em outros arquivos**

### Ao Usar APIs/Services

1. **Sempre usar centralizadores de `src/apis/`**
2. **Normalizar respostas com `handleApiResponse`**
3. **Tratar erros com try/catch**
4. **Logar operações importantes**
5. **Notificar usuário sobre resultado**

### Ao Trabalhar com Estado Global

1. **Preferir Pinia stores a props drilling**
2. **Usar getters para computed properties**
3. **Não mutar estado diretamente (usar actions)**
4. **Limpar estado ao deslogar**

### Boas Práticas Quasar

1. **Usar componentes Quasar quando possível** (`q-btn`, `q-card`, etc)
2. **Aproveitar `useQuasar()` para dialogs, notify, loading**
3. **Usar classes utilitárias do Quasar** (`q-pa-md`, `q-mb-lg`)
4. **Respeitar tema dark com `:dark="$q.dark.isActive"`**

---

## 📚 Referências

- [Vue 3 Docs](https://vuejs.org/)
- [Quasar Framework](https://quasar.dev/)
- [Pinia Store](https://pinia.vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Axios](https://axios-http.com/)

---

**Última atualização:** Fevereiro 2026  
**Versão:** 1.0.0  
**Projeto:** Financial Control - Frontend
