# ✅ Checklist de Migração - APIs Centralizadas

## 📋 Visão Geral

Use este checklist para acompanhar a migração de cada arquivo/componente do padrão antigo (services) para o novo padrão (APIs centralizadas).

---

## 🎯 Preparação Inicial

- [x] ✅ Criar `src/utils/apiUtils.js` com utilitários
- [x] ✅ Criar `src/apis/api-financial.js` com rotas e helpers
- [x] ✅ Documentar padrão de migração
- [x] ✅ Criar exemplos práticos
- [ ] ⏳ Comunicar equipe sobre nova arquitetura
- [ ] ⏳ Revisar e aprovar estrutura proposta

---

## 📁 Services Existentes (Para Deprecar)

### src/services/authService.js
- [ ] ⏳ Identificar todos os componentes que usam
- [ ] ⏳ Migrar componentes para helpers centralizados
- [ ] ⏳ Testar fluxo completo (login, logout, getMe)
- [ ] ⏳ Marcar como `@deprecated` no código
- [ ] ⏳ Remover quando não houver mais uso

**Helpers Equivalentes:**
- `authService.login()` → `login()`
- `authService.register()` → `register()`
- `authService.getMe()` → `getMe()`

---

### src/services/transactionService.js
- [ ] ⏳ Identificar todos os componentes que usam
- [ ] ⏳ Migrar componentes para helpers centralizados
- [ ] ⏳ Testar CRUD completo
- [ ] ⏳ Testar filtros e paginação
- [ ] ⏳ Testar estatísticas e relatórios
- [ ] ⏳ Marcar como `@deprecated` no código
- [ ] ⏳ Remover quando não houver mais uso

**Helpers Equivalentes:**
- `transactionService.getTransactions()` → `getTransactions()`
- `transactionService.createTransaction()` → `createTransaction()`
- `transactionService.updateTransaction()` → `updateTransaction()`
- `transactionService.deleteTransaction()` → `deleteTransaction()`
- `transactionService.getTransactionById()` → `getTransactionById()`
- `transactionService.getTransactionStats()` → `getTransactionStats()`
- `transactionService.getReports()` → `getTransactionReports()`
- `transactionService.getDefaultCategories()` → `getAllCategories()`

---

### src/services/userService.js
- [ ] ⏳ Identificar todos os componentes que usam
- [ ] ⏳ Migrar componentes para helpers centralizados
- [ ] ⏳ Testar atualização de perfil
- [ ] ⏳ Testar mudança de senha
- [ ] ⏳ Testar upload/remoção de avatar
- [ ] ⏳ Testar configurações
- [ ] ⏳ Marcar como `@deprecated` no código
- [ ] ⏳ Remover quando não houver mais uso

**Helpers Equivalentes:**
- `userService.getCurrentProfile()` → `getUserProfile()`
- `userService.updateProfile()` → `updateUserProfile()`
- `userService.changePassword()` → `changePassword()`
- `userService.uploadAvatar()` → `uploadAvatar()`
- `userService.removeAvatar()` → `removeAvatar()`
- `userService.getUserSettings()` → `getUserSettings()`
- `userService.updateUserSettings()` → `updateUserSettings()`
- `userService.changePlan()` → `changeUserPlan()`
- `userService.getUserStats()` → `getUserStats()`
- `userService.deleteAccount()` → `deleteUserAccount()`

---

### src/services/adminService.js
- [ ] ⏳ Identificar todos os componentes que usam
- [ ] ⏳ Migrar componentes para helpers centralizados
- [ ] ⏳ Testar funcionalidades admin
- [ ] ⏳ Marcar como `@deprecated` no código
- [ ] ⏳ Remover quando não houver mais uso

**Helpers Equivalentes:**
- Verificar endpoints específicos do admin e criar helpers correspondentes

---

### src/services/dashboardService.js
- [ ] ⏳ Identificar todos os componentes que usam
- [ ] ⏳ Migrar componentes para helpers centralizados
- [ ] ⏳ Testar carregamento de estatísticas
- [ ] ⏳ Marcar como `@deprecated` no código
- [ ] ⏳ Remover quando não houver mais uso

**Helpers Equivalentes:**
- Criar helpers específicos para dashboard se necessário

---

### src/services/planService.js
- [ ] ⏳ Identificar todos os componentes que usam
- [ ] ⏳ Migrar componentes para helpers centralizados
- [ ] ⏳ Testar listagem de planos
- [ ] ⏳ Marcar como `@deprecated` no código
- [ ] ⏳ Remover quando não houver mais uso

**Helpers Equivalentes:**
- Criar `getPlans()`, `getPlanById()` em api-financial.js

---

## 📄 Componentes/Páginas a Migrar

### Páginas de Autenticação

#### src/pages/LoginPage.vue
- [ ] ⏳ Identificar imports antigos
- [ ] ⏳ Substituir por `import { login } from '@/apis/api-financial'`
- [ ] ⏳ Atualizar chamadas de função
- [ ] ⏳ Testar fluxo de login
- [ ] ⏳ Testar tratamento de erro
- [ ] ⏳ Verificar logs no console

#### src/pages/RegisterPage.vue
- [ ] ⏳ Identificar imports antigos
- [ ] ⏳ Substituir por `import { register } from '@/apis/api-financial'`
- [ ] ⏳ Atualizar chamadas de função
- [ ] ⏳ Testar fluxo de registro
- [ ] ⏳ Testar tratamento de erro
- [ ] ⏳ Verificar logs no console

---

### Páginas de Transações

#### src/pages/TransactionsPage.vue
- [ ] ⏳ Identificar imports antigos
- [ ] ⏳ Substituir por helpers de transações
- [ ] ⏳ Atualizar chamadas de função
- [ ] ⏳ Testar listagem com filtros
- [ ] ⏳ Testar criação
- [ ] ⏳ Testar edição
- [ ] ⏳ Testar exclusão
- [ ] ⏳ Verificar logs no console

#### src/pages/TransactionDetailPage.vue (se existir)
- [ ] ⏳ Migrar para `getTransactionById()`
- [ ] ⏳ Testar carregamento de detalhes
- [ ] ⏳ Testar edição inline
- [ ] ⏳ Verificar logs no console

---

### Páginas de Dashboard

#### src/pages/DashboardPage.vue
- [ ] ⏳ Identificar imports antigos
- [ ] ⏳ Substituir por helpers de dashboard
- [ ] ⏳ Atualizar chamadas de função
- [ ] ⏳ Testar carregamento de estatísticas
- [ ] ⏳ Testar gráficos
- [ ] ⏳ Testar resumos
- [ ] ⏳ Verificar logs no console

---

### Páginas de Perfil/Usuário

#### src/pages/ProfilePage.vue
- [ ] ⏳ Identificar imports antigos
- [ ] ⏳ Substituir por helpers de usuário
- [ ] ⏳ Testar buscar perfil
- [ ] ⏳ Testar atualizar perfil
- [ ] ⏳ Testar upload de avatar
- [ ] ⏳ Verificar logs no console

#### src/pages/SettingsPage.vue
- [ ] ⏳ Migrar para helpers de settings
- [ ] ⏳ Testar buscar configurações
- [ ] ⏳ Testar atualizar configurações
- [ ] ⏳ Testar mudança de senha
- [ ] ⏳ Verificar logs no console

---

### Páginas de Admin

#### src/pages/AdminPage.vue (se existir)
- [ ] ⏳ Migrar para helpers de admin
- [ ] ⏳ Testar listagem de usuários
- [ ] ⏳ Testar estatísticas do sistema
- [ ] ⏳ Testar gerenciamento de usuários
- [ ] ⏳ Verificar logs no console

---

### Páginas de Planos

#### src/pages/PlansPage.vue (se existir)
- [ ] ⏳ Migrar para helpers de planos
- [ ] ⏳ Testar listagem de planos
- [ ] ⏳ Testar seleção de plano
- [ ] ⏳ Verificar logs no console

---

## 🧩 Componentes a Migrar

### Componentes de Transação

#### src/components/TransactionForm.vue
- [ ] ⏳ Migrar para helpers centralizados
- [ ] ⏳ Testar criação
- [ ] ⏳ Testar edição
- [ ] ⏳ Verificar validações

#### src/components/TransactionList.vue
- [ ] ⏳ Migrar para `getTransactions()`
- [ ] ⏳ Testar listagem
- [ ] ⏳ Testar filtros
- [ ] ⏳ Testar paginação

#### src/components/TransactionCard.vue
- [ ] ⏳ Verificar se há chamadas diretas
- [ ] ⏳ Migrar se necessário

---

### Componentes de Dashboard

#### src/components/DashboardStats.vue
- [ ] ⏳ Migrar para helpers de dashboard
- [ ] ⏳ Testar carregamento de stats

#### src/components/DashboardCharts.vue
- [ ] ⏳ Migrar para helpers de charts
- [ ] ⏳ Testar renderização de gráficos

---

### Componentes de Usuário

#### src/components/UserAvatar.vue
- [ ] ⏳ Verificar se há upload/remoção
- [ ] ⏳ Migrar para helpers correspondentes

#### src/components/UserMenu.vue
- [ ] ⏳ Verificar se há chamadas à API
- [ ] ⏳ Migrar se necessário

---

## 🏪 Stores Pinia a Revisar

### src/stores/authStore.js
- [ ] ⏳ Substituir `authService` por helpers
- [ ] ⏳ Atualizar actions (login, logout, getMe)
- [ ] ⏳ Testar fluxo completo de auth
- [ ] ⏳ Verificar persistência de token

### src/stores/transactionStore.js
- [ ] ⏳ Substituir `transactionService` por helpers
- [ ] ⏳ Atualizar todas as actions
- [ ] ⏳ Testar getters
- [ ] ⏳ Verificar cache de dados

### src/stores/userStore.js
- [ ] ⏳ Substituir `userService` por helpers
- [ ] ⏳ Atualizar actions de perfil
- [ ] ⏳ Atualizar actions de settings
- [ ] ⏳ Testar sincronização

---

## 🧪 Testes

### Testes Unitários
- [ ] ⏳ Criar testes para helpers principais
- [ ] ⏳ Testar `handleApiError`
- [ ] ⏳ Testar `normalizeApiResponse`
- [ ] ⏳ Testar `buildQueryString`

### Testes de Integração
- [ ] ⏳ Testar fluxo completo de login
- [ ] ⏳ Testar CRUD de transações
- [ ] ⏳ Testar carregamento de dashboard
- [ ] ⏳ Testar atualização de perfil

### Testes E2E
- [ ] ⏳ Validar jornada do usuário completa
- [ ] ⏳ Testar com API real
- [ ] ⏳ Testar com API offline (tratamento de erro)

---

## 📊 Validação Final

### Qualidade de Código
- [ ] ⏳ Executar ESLint sem erros
- [ ] ⏳ Verificar warnings no build
- [ ] ⏳ Remover imports não utilizados
- [ ] ⏳ Remover código comentado

### Performance
- [ ] ⏳ Verificar tamanho do bundle
- [ ] ⏳ Confirmar tree-shaking funcionando
- [ ] ⏳ Verificar lazy loading de rotas

### Documentação
- [ ] ⏳ Atualizar README.md principal
- [ ] ⏳ Documentar novos endpoints adicionados
- [ ] ⏳ Atualizar diagramas de arquitetura
- [ ] ⏳ Criar guia de troubleshooting

### Deploy
- [ ] ⏳ Testar em ambiente de staging
- [ ] ⏳ Validar com QA
- [ ] ⏳ Criar backup antes do deploy
- [ ] ⏳ Deploy em produção
- [ ] ⏳ Monitorar logs após deploy

---

## 🗑️ Limpeza Final

### Remover Código Legado
- [ ] ⏳ Deletar `src/services/authService.js`
- [ ] ⏳ Deletar `src/services/transactionService.js`
- [ ] ⏳ Deletar `src/services/userService.js`
- [ ] ⏳ Deletar `src/services/adminService.js`
- [ ] ⏳ Deletar `src/services/dashboardService.js`
- [ ] ⏳ Deletar `src/services/planService.js`

### Atualizar Imports
- [ ] ⏳ Buscar imports antigos no projeto: `from '@/services/`
- [ ] ⏳ Buscar imports diretos do axios: `from 'boot/axios'`
- [ ] ⏳ Confirmar que todos foram substituídos

---

## 📈 Métricas de Sucesso

- [ ] ⏳ Todos os services antigos removidos
- [ ] ⏳ Todos os componentes migrádos
- [ ] ⏳ Todos os testes passando
- [ ] ⏳ Zero erros em produção relacionados à migração
- [ ] ⏳ Feedback positivo da equipe
- [ ] ⏳ Documentação completa e atualizada

---

## 📝 Notas e Observações

### Problemas Encontrados
_Documente aqui qualquer problema ou edge case encontrado durante a migração_

```
- 
- 
- 
```

### Melhorias Identificadas
_Anote sugestões de melhoria para iterações futuras_

```
- 
- 
- 
```

### Dúvidas/Questões
_Liste dúvidas que surgiram e precisam ser esclarecidas_

```
- 
- 
- 
```

---

## 👥 Responsáveis

| Tarefa | Responsável | Data Prevista | Status |
|--------|-------------|---------------|--------|
| Criação da estrutura | - | - | ✅ Concluído |
| Migração de Auth | - | - | ⏳ Pendente |
| Migração de Transactions | - | - | ⏳ Pendente |
| Migração de User | - | - | ⏳ Pendente |
| Testes | - | - | ⏳ Pendente |
| Deploy | - | - | ⏳ Pendente |

---

**Legenda:**
- ✅ Concluído
- ⏳ Pendente
- 🔄 Em progresso
- ❌ Bloqueado

---

**Última atualização:** 2024-01-15  
**Progresso geral:** 10% (estrutura criada)
