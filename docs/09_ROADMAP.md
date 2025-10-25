# 🗺️ ROADMAP TRIMESTRAL - Q1 2026

## 📊 MATRIZ DE PRIORIZAÇÃO

Critérios:
- **Impacto:** Quanto aumenta conversão/retenção/receita
- **Esforço:** Horas de desenvolvimento
- **Risco:** Complexidade técnica/dependências

---

## ✅ MÊS 1 (JANEIRO 2026) - FUNDAÇÃO VISUAL

### 1. Design System e Paleta Customizada
**Prioridade:** P0 (Crítico)  
**Esforço:** Alto (60h)  
**Impacto:** Alto  
**Owner:** Design + Frontend Lead

**Tarefas:**
- [ ] Implementar Paleta 1 (Finance Trust) no quasar.config.js
- [ ] Criar arquivo design-tokens.css
- [ ] Atualizar componentes principais (Dashboard cards, botões)
- [ ] Criar Storybook com 10 componentes base
- [ ] Documentar guidelines de uso

**Entregáveis:**
- `quasar.config.js` atualizado
- `/docs/design-system/` com tokens e componentes
- Storybook publicado

---

### 2. Onboarding Interativo (3 Passos)
**Prioridade:** P0 (Crítico)  
**Esforço:** Médio (32h)  
**Impacto:** Alto (reduz bounce 40%)  
**Owner:** Frontend + Product

**Tarefas:**
- [ ] Criar componente OnboardingWizard.vue
- [ ] Passo 1: Adicionar primeira transação (income)
- [ ] Passo 2: Adicionar primeira despesa
- [ ] Passo 3: Ver gráfico gerado
- [ ] Salvar estado no LocalStorage (não repetir)
- [ ] Analytics: track completion rate

**Métrica de sucesso:** 70% dos novos usuários completam onboarding

---

### 3. Exportação de Relatórios (CSV/PDF)
**Prioridade:** P0 (Crítico)  
**Esforço:** Médio (28h)  
**Impacto:** Alto (feature blocker para contadores)  
**Owner:** Backend + Frontend

**Tarefas:**
- [ ] Backend: Endpoint GET /api/reports/export?format=csv|pdf
- [ ] Frontend: Botão "Exportar" em Relatórios
- [ ] Library jsPDF para geração PDF
- [ ] Template DRE padrão contábil
- [ ] Exportação em lote (multi-empresa) - fase 2

**Métrica de sucesso:** 60% dos pagantes usam export mensalmente

---

## ✅ MÊS 2 (FEVEREIRO 2026) - INTELIGÊNCIA E AUTOMAÇÃO

### 4. IA de Categorização Automática
**Prioridade:** P1 (Alta)  
**Esforço:** Alto (48h)  
**Impacto:** Alto (reduz atrito 50%)  
**Owner:** Backend + Data Science

**Tarefas:**
- [ ] Algoritmo: Naive Bayes para classificação de texto
- [ ] Training set: 500 transações exemplo
- [ ] API: POST /api/transactions/categorize-suggest
- [ ] Frontend: Mostrar sugestão em tempo real
- [ ] Opção "Aplicar a todos similares"

**Métrica de sucesso:** 80% de acurácia na categorização

---

### 5. Filtros Salvos (Favoritos)
**Prioridade:** P1 (Alta)  
**Esforço:** Baixo (16h)  
**Impacto:** Médio  
**Owner:** Frontend

**Tarefas:**
- [ ] Componente SavedFilters.vue
- [ ] Store Pinia para salvar/carregar filtros
- [ ] UI: Dropdown "Meus Filtros" + "Salvar Atual"
- [ ] Persistência: LocalStorage ou tabela user_filters

**Métrica de sucesso:** 40% dos power users criam filtro salvo

---

### 6. Forecast Simples (Média Móvel 3 meses)
**Prioridade:** P1 (Alta)  
**Esforço:** Médio (24h)  
**Impacto:** Alto (diferencial competitivo)  
**Owner:** Backend

**Tarefas:**
- [ ] Algoritmo: Média móvel simples (SMA)
- [ ] Endpoint: GET /api/forecast?months=3
- [ ] Frontend: Card "Previsão próximo mês"
- [ ] Gráfico com linha tracejada (forecast)

**Métrica de sucesso:** 50% dos usuários visualizam forecast

---

## ✅ MÊS 3 (MARÇO 2026) - ESCALA E RETENÇÃO

### 7. Integração Open Banking (Pluggy/Belvo)
**Prioridade:** P1 (Alta)  
**Esforço:** Alto (56h)  
**Impacto:** Altíssimo (automação crítica)  
**Owner:** Backend + DevOps

**Tarefas:**
- [ ] Avaliar Pluggy vs Belvo (custo, cobertura bancos)
- [ ] Integração API: OAuth flow
- [ ] Importação automática de transações
- [ ] Reconciliação com transações manuais
- [ ] Security: encrypt tokens

**Métrica de sucesso:** 30% dos Pro users conectam banco

---

### 8. PWA e Modo Offline
**Prioridade:** P2 (Média)  
**Esforço:** Médio (32h)  
**Impacto:** Médio (melhora UX mobile)  
**Owner:** Frontend

**Tarefas:**
- [ ] Service Worker para cache
- [ ] Manifest.json completo
- [ ] Cache estratégia: Network-first para dados, Cache-first para assets
- [ ] Sync offline → online quando reconecta

**Métrica de sucesso:** 20% dos mobile users usam offline

---

## 📈 IMPACTO ESTIMADO (Q1)

| **Métrica** | **Antes** | **Após Q1** | **Δ** |
|-------------|-----------|------------|-------|
| Trial→Paid conversion | 18% | 27% | **+50%** |
| Onboarding completion | 30% | 70% | **+133%** |
| Monthly churn | 8% | 5% | **-37.5%** |
| Feature adoption (export) | 0% | 60% | **+60pp** |
| Time-to-first-value | 15min | 5min | **-67%** |

**ROI estimado Q1:** R$ 85k ARR adicional

---

## 🔮 BACKLOG (Q2-Q4 2026)

**Q2:**
- Relatórios customizados (query builder)
- Multi-empresa (para contadores)
- Dark mode premium

**Q3:**
- White-label (logo customizado)
- API pública (webhooks)
- Integração contábil (eSocial, Sefaz)

**Q4:**
- Mobile app nativo (React Native)
- Forecasting avançado (ARIMA, ML)
- Marketplace de integrações
