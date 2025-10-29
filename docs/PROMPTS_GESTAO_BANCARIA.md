# 🧠 Prompts de Implementação — Gestão Bancária

> 📌 **Como usar:** copie o prompt correspondente e forneça para a IA/pareamento técnico responsável. Todos os prompts já alinham contexto, padrões e entregáveis esperados para o ecossistema `financialcontrol`.

---

## 1️⃣ Prompt — Área Administrativa de Contas por Usuário

**Contexto resumido:** criar uma área para que cada usuário gerencie várias contas bancárias, incluindo saldo inicial, meta de saldo, status e metadados bancários. O fluxo precisa seguir os padrões atuais do projeto (`Quasar + Vue 3`, Pinia, `api-financial.js`, autenticação JWT, documentação Postman) e entregar backend + frontend completos.

**Prompt completo:**

```markdown
Você é um(a) tech lead especializado(a) em FinTech construindo funcionalidades no projeto Financial Control.

Contexto do projeto:
- Frontend: Quasar 2 + Vue 3 (Composition API), Pinia, vue-router, i18n em `src/i18n`, estilização com design tokens e componentes acessíveis.
- API calls centralizadas em `src/apis/api-financial.js` com helpers + `apiUtils.js` para tratamento de erros.
- Backend: Node.js + Express com módulos ES, PostgreSQL, JWT, validações celebrate/Joi, logging estruturado, limitação de rate (`apiLimiter`).
- Segurança: todas as rotas autenticadas usam `authenticateToken` e responses padronizadas `{ success, data, message }`.

Objetivo do prompt: Implementar a **Área Administrativa de Contas Bancárias por usuário** (CRUD completo + visão de listagem e detalhes).

Entregáveis obrigatórios:
1. **Banco de Dados**: migration para tabela `accounts` com campos `id`, `user_id (FK users)`, `name`, `bank_name`, `bank_code`, `branch`, `account_number`, `account_type` (enum: checking, savings, investment, digital), `currency` (default "BRL"), `opening_balance`, `current_balance`, `credit_limit`, `status` (active, archived), `icon`, `color`, `notes`, timestamps. Garantir unique `(user_id, name)` e triggers para atualizar `updated_at`.
2. **Seed/Data Fix**: opcionalmente criar comando seed que gere conta padrão "Conta Principal" para usuários novos.
3. **Backend**:
   - Criar `src/controllers/accountController.js` com métodos: `create`, `list`, `getById`, `update`, `archive`, `delete`, `getSummary` (agregados por usuário).
   - Criar `src/routes/accountRoutes.js` registrando:
     - `POST /api/accounts`
     - `GET /api/accounts`
     - `GET /api/accounts/summary`
     - `GET /api/accounts/:id`
     - `PUT /api/accounts/:id`
     - `PATCH /api/accounts/:id/archive`
     - `DELETE /api/accounts/:id`
   - Adicionar validação celebrate/Joi para payloads, garantir associação ao `req.user.id` e logs.
   - Registrar rota em `src/app.js` com `app.use('/api/accounts', accountRoutes);` e atualizar documentação Postman (`docs/financial-control.postman_collection.json`).
   - Criar testes automatizados (Jest/Supertest) cobrindo cenários de sucesso, validação, autorização e erros 404.
4. **Frontend**:
   - Adicionar helpers em `src/apis/api-financial.js`: `createAccount`, `getAccounts`, `getAccountById`, `updateAccount`, `archiveAccount`, `deleteAccount`, `getAccountSummary` seguindo padrão existente (uso de `API_ROUTES.accounts`).
   - Criar Pinia store `src/stores/accountStore.js` com estados reativos, loading/error pattern e uso de helpers acima.
   - Criar página `src/pages/private/accounts/AccountsAdminPage.vue` com layout responsivo, tabela ordenável, filtros por status, cards de resumo, botão CTA "Nova conta" e acessibilidade WCAG AA.
   - Criar modal/form `src/components/accounts/AccountFormDialog.vue` com validações (Quasar rules + `currency-input`), seleção de tipo de conta, cor e ícone (reutilizar design system), campo de saldo inicial com formatação monetária e conversão para número.
   - Criar rota no `src/router/routes.js`: `/app/accounts` (name: `accounts-admin`) protegida por guard de autenticação.
   - Integrar com i18n (`accounts.*`), estado vazio acessível, skeleton loaders e notificações padronizadas (`Notify.create`).
5. **UX/QA**: garantir acessibilidade de formulários (labels, aria-live em mensagens), confirmar contraste com tokens, adicionar testes unitários (Vitest) para store e componentes críticos, story/quasar-play se aplicável.

Checklist final antes de entregar:
- [ ] Migration executada e revertível.
- [ ] Rotas protegidas respondendo com 200/201/204 + mensagens padronizadas.
- [ ] `api-financial.js` atualizado com rotas em `API_ROUTES.accounts`.
- [ ] Página e componentes responsivos (mobile-first) com foco visível.
- [ ] Cobertura de testes > 80% nos módulos novos.
- [ ] Documentação Postman e README da feature atualizados.
```

---

## 2️⃣ Prompt — Tela de Extrato Consolidado

**Contexto resumido:** implementar uma tela de extrato para contas cadastradas, listando histórico de movimentações (receitas e despesas) em ordem cronológica, com filtros avançados e consulta otimizada.

**Prompt completo:**

```markdown
Você é responsável por criar a **Tela de Extrato Consolidado** no ecossistema Financial Control.

Reforce o contexto:
- Frontend: Quasar + Vue 3, design system acessível, stores Pinia, helpers centralizados em `api-financial.js`.
- Backend: Express modular (ESM), controllers organizados, middleware `authenticateToken`, limitação `apiLimiter`, respostas padronizadas.
- Banco: PostgreSQL com tabela `transactions` já existente contendo receitas/despesas vinculadas a usuários e categorias.

Objetivo: construir uma experiência de extrato multiforme para usuários autenticados consultarem o histórico de transações por conta, com filtros ricos e métricas de balanço em tempo real.

Entregáveis obrigatórios:
1. **Backend**:
   - Expandir `transactionController` adicionando métodos `getAccountStatement` e `exportAccountStatement`.
   - Criar rota dedicada em `src/routes/transactionRoutes.js`:
     - `GET /api/accounts/:accountId/statement` (query params: `startDate`, `endDate`, `type`, `category`, `search`, `page`, `pageSize`, `sort=asc|desc`).
     - `GET /api/accounts/:accountId/statement/export` (query params + `format=pdf|csv|xlsx` — reutilizar utilitário de exportação se já existir ou criar serviço dedicado em `src/services/reportService.js`).
   - Aplicar validação celebrate/Joi para query params e garantir que a conta pertence ao usuário (`JOIN accounts ON accounts.user_id = req.user.id`).
   - Resposta deve incluir: `transactions` (paginadas), `meta` (page, total, pageSize), `summary` (openingBalance, inflows, outflows, closingBalance).
   - Adicionar testes (Supertest) cobrindo filtros, paginação e export.
2. **Frontend**:
   - Atualizar `API_ROUTES` e helpers em `api-financial.js`: `getAccountStatement(accountId, params)` e `exportAccountStatement(accountId, params)` que acionam download via `responseType: 'blob'` quando export.
   - Criar página `src/pages/private/accounts/AccountStatementPage.vue` com estrutura:
     - Header com seletor de conta (combobox), intervalo de datas (DateRangePicker), filtros de tipo (income/expense), categorias (usar store/endpoint `getCategoriesByType`), busca textual e ações de export (PDF/CSV/XLSX).
     - Cards de resumo mostrando saldo inicial, total de entradas, total de saídas, saldo atual.
     - Tabela/Linha do tempo ordenada por data/hora (desc por padrão) com colunas: data/hora, descrição, categoria, rótulo de tipo, valor formatado (positivo/negativo), saldo acumulado.
     - Estados de carregamento e vazios padronizados (skeletons e `EmptyState`).
   - Usar Pinia store `accountStatementStore` para orquestrar filtros, paginação e caching local (mantendo estado ao navegar).
   - Implementar paginação infinita ou paginação tradicional (configurável) mantendo acessibilidade (ARIA nos botões de paginação).
   - Integrar com i18n (`statements.*`) e currency formatting (utilitário `formatCurrency`).
   - Incluir breadcrumbs/toolbar conforme padrão do app `/app/accounts` → `/app/accounts/:id/statement`.
3. **UX/Perf**:
   - Garantir lazy-loading e debounce em filtros.
   - Aplicar virtualização (QVirtualScroll) se dataset grande, sem quebrar acessibilidade.
   - Usar cores de tokens (positivo/negativo) com contraste AA.
4. **QA/Docs**:
   - Criar testes unitários (Vitest + Testing Library) para componentes de filtro e resumo.
   - Adicionar caso de uso no Postman, atualizar doc `API_CENTRALIZATION_SUMMARY.md` se necessário.
   - Documentar como exportar extrato em `docs/PROMPTS_GESTAO_BANCARIA.md` (este arquivo) e anexar screenshots/wireframes se disponíveis.

Checklist final:
- [ ] Rotas adicionadas no backend e registradas.
- [ ] Página responde a telas mobile/desktop com navegação por teclado.
- [ ] Exportações baixam arquivos com nomes padronizados (`statement-{account}-{YYYY-MM-DD}.pdf`).
- [ ] Estados vazios orientam usuário a cadastrar transações/contas.
- [ ] Cobertura de testes e documentação atualizadas.
```

---

## 3️⃣ Prompt — Tela de Conciliação Bancária (TXT, PDF, CSV)

**Contexto resumido:** permitir conciliação diária por conta, mostrando lançamentos previstos (receitas/despesas) e confrontando com arquivos importados (extratos bancários em TXT/PDF/CSV) para marcar itens conciliados, pendentes ou divergentes.

**Prompt completo:**

```markdown
Você é encarregado(a) de entregar a **Tela de Conciliação Bancária** do Financial Control, garantindo fluxo ponta-a-ponta (backend + frontend) com importação de arquivos e matching manual/automático.

Reforce o contexto técnico:
- Stack frontend: Quasar + Vue 3 (Composition API), Pinia, componentes reutilizáveis do design system, axios centralizado.
- Stack backend: Express (ESM), PostgreSQL, serviço de armazenamento local `uploads/`, middlewares existentes (`authenticateToken`, `apiLimiter`, `multer` para upload).
- Regras de negócios: cada usuário possui múltiplas contas (tabela `accounts`) e transações (`transactions`) ligadas por `account_id`.

Objetivo: implementar conciliação diária por conta, permitindo importar extratos em **TXT, PDF, CSV**, classificar entradas/saídas e conciliar com as transações cadastradas, gerando relatórios.

Entregáveis obrigatórios:
1. **Backend**:
   - Criar serviço `src/services/reconciliationService.js` responsável por parsing de arquivos (CSV via `csv-parse`, TXT com regex estruturada, PDF via lib apropriada como `pdf-parse`), matching heurístico (data aproximada ±1 dia, valor igual, descrição similar), e armazenamento de resultados.
   - Criar controlador `src/controllers/reconciliationController.js` com métodos: `listByDay`, `upload`, `match`, `bulkMatch`, `export`, `getHistory`.
   - Rotas em `src/routes/reconciliationRoutes.js`:
     - `GET /api/accounts/:accountId/reconciliation?date=YYYY-MM-DD`
     - `POST /api/accounts/:accountId/reconciliation/import` (upload multipart — aceitar `.txt`, `.csv`, `.pdf`)
     - `POST /api/accounts/:accountId/reconciliation/match` (payload com ids de transações internas vs itens importados)
     - `POST /api/accounts/:accountId/reconciliation/match/bulk`
     - `GET /api/accounts/:accountId/reconciliation/export?date=...&format=pdf|csv`
     - `GET /api/accounts/:accountId/reconciliation/history` (lista conciliações anteriores)
   - Adicionar validações Joi, checagem de ownership da conta, logging estruturado e tratamento de erros consistente (`handleServiceError`).
   - Armazenar arquivos importados em `uploads/reconciliation/` com limpeza agendada (cron ou job manual) e manter metadados da importação em tabela `account_reconciliations` (`id`, `account_id`, `reference_date`, `status`, `import_source`, `created_at`). Criar tabela auxiliar `account_reconciliation_items` para itens importados.
   - Tests (Jest) cobrindo parsing, rotas e fluxos de conciliação.
2. **Frontend**:
   - Atualizar `API_ROUTES` e helpers: `getReconciliationByDay`, `importReconciliationFile`, `matchReconciliationItems`, `matchReconciliationItemsBulk`, `exportReconciliation`, `getReconciliationHistory`.
   - Criar store `src/stores/reconciliationStore.js` orquestrando estado da conta selecionada, data, resultados importados, erros e status de conciliação.
   - Criar página `src/pages/private/accounts/BankReconciliationPage.vue` dividida em três áreas:
     1. **Seleção**: combobox de conta + DatePicker (apenas dias com movimento) + indicadores de status.
     2. **Comparação**: lista de lançamentos internos (receita/despesa) vs itens importados, com agrupamento por tipo, badges de status (conciliado, pendente, divergente), filtros por valor e categoria.
     3. **Ações**: upload drag-and-drop (validar extensões), botão "Conciliar selecionados", botão "Gerar relatório" (PDF/CSV), timeline de conciliações anteriores.
   - Permitir conciliação manual (selecionar transação e item importado) e automatizada (matching sugerido com base em heurística).
   - Usar componentes acessíveis (labels, aria-describedby, foco) e cores com contraste AA (`positive`, `negative`, `warning`).
   - Incluir notificações (`Notify`) informando resultados da conciliação, erros de parsing e resumo final (qtd conciliados vs pendentes).
   - Registrar rota `/app/accounts/:accountId/reconciliation` (name: `accounts-reconciliation`) no router protegido.
3. **Experiência & Governança**:
   - Indicar no UI a origem do arquivo, usuário que conciliou e timestamp.
   - Exibir log de auditoria (lista de conciliações anteriores) com opção de baixar arquivo importado.
   - Garantir que importações em PDF exibam preview textual (quando possível) e fallback de download.
   - Garantir acessibilidade de drag-and-drop (fallback input file) e navegação por teclado.
4. **Documentação & QA**:
   - Atualizar Postman com novos endpoints.
   - Criar testes e2e (Cypress/Playwright) simulando upload CSV e conciliação.
   - Documentar formato esperado de TXT/CSV no README da feature ou doc existente.

Checklist final:
- [ ] Migrações/tabelas de conciliação criadas e versionadas.
- [ ] Upload aceita .txt/.csv/.pdf com validação de tamanho (<5MB) e tipo MIME.
- [ ] Feedback visual em tempo real durante matching (loading, progresso, estados).
- [ ] Export gera relatório com itens conciliados, divergentes e pendentes.
- [ ] Logs/auditoria disponíveis para supervisão administrativa.
```

-
### ℹ️ Instruções atuais — Exportação do Extrato Consolidado

- **Endpoint backend:** `GET /api/accounts/:accountId/statement/export?format=csv|xlsx|pdf`
  - Resposta envia `Content-Disposition` com arquivo produzido pelo `reportService`.
- **Helpers frontend:** `exportAccountStatement(accountId, params)` em `src/apis/accounts.js` (usa `responseType: 'blob'`).
- **Página:** `AccountStatementPage.vue` disponibiliza botões CSV/XLSX/PDF que acionam o helper e baixam o arquivo com o filename retornado pelo backend.
- **Store Pinia:** `accountStatementStore.exportStatement(format)` centraliza filtros, controla `isExporting` e trata erros.
- **UX:** sucesso gera `Notify` positiva (`statements.feedback.exported`); falhas usam `statements.feedback.exportError`.
- **Checklist:** garantir que os filtros aplicados na UI sejam repassados na query string para manter consistência do relatório.

---

🔥 **Dica:** Ao adaptar qualquer prompt, mantenha a coerência com as convenções já documentadas em `API_CENTRALIZATION_SUMMARY.md`, `IMPLEMENTACAO_PERFIL_CATEGORIAS.md` e demais guias do repositório.
