# 📊 KPIS E EXPERIMENTOS A/B

## 🎯 KPIs PRINCIPAIS DO PRODUTO

### Categoria 1: Aquisição

#### 1. Trial Sign-up Rate
**Definição:** % de visitantes que criam conta trial  
**Fórmula:** (Cadastros trial / Visitantes únicos) × 100  
**Fonte:** Analytics (GA4, Mixpanel)  
**Meta inicial:** 8-12%  
**Benchmark:** 5-10% (SaaS B2B médio)

#### 2. Cost Per Acquisition (CPA)
**Definição:** Custo médio para adquirir um novo trial  
**Fórmula:** Gasto total em marketing / Novos trials  
**Fonte:** Ads Manager + CRM  
**Meta inicial:** < R$ 50  
**Benchmark:** R$ 30-80 (SaaS brasileiro)

---

### Categoria 2: Ativação

#### 3. Time-to-First-Transaction (TTFT)
**Definição:** Tempo desde cadastro até primeira transação criada  
**Fórmula:** Timestamp primeira transaction - timestamp cadastro  
**Fonte:** Database (users.created_at vs transactions.created_at)  
**Meta inicial:** < 2 minutos  
**Benchmark:** < 3 minutos (melhor classe)  
**Impacto:** Reduzir TTFT em 50% aumenta conversão trial→paid em 30%

#### 4. Onboarding Completion Rate
**Definição:** % de novos usuários que completam wizard de 3 passos  
**Fórmula:** (Completaram step 3 / Total iniciaram) × 100  
**Fonte:** Analytics (evento onboarding_completed)  
**Meta inicial:** 70%  
**Benchmark:** 40-60% (SaaS typical)

#### 5. Activation Rate (7 dias)
**Definição:** % de novos usuários que executam ação-chave em 7 dias  
**Ação-chave:** Adicionar 5+ transações OU gerar 1 relatório  
**Fórmula:** (Usuários ativos 7d / Total cadastros) × 100  
**Meta inicial:** 50%  
**Benchmark:** 30-40%

---

### Categoria 3: Conversão

#### 6. Trial-to-Paid Conversion Rate
**Definição:** % de trials que convertem para plano pago  
**Fórmula:** (Assinaturas ativas / Total trials expirados) × 100  
**Fonte:** CRM/Subscriptions table  
**Meta inicial:** 25%  
**Benchmark:** 15-20% (SaaS B2B)  
**Análise por coorte:** Segmentar por fonte (organic, paid, referral)

#### 7. Average Revenue Per User (ARPU)
**Definição:** Receita média mensal por usuário pagante  
**Fórmula:** MRR total / Total assinantes ativos  
**Fonte:** Billing system  
**Meta inicial:** R$ 85  
**Benchmark:** R$ 50-150 (depende do plano mix)

---

### Categoria 4: Engajamento

#### 8. Monthly Active Users (MAU)
**Definição:** Usuários únicos que fizeram login em 30 dias  
**Fórmula:** COUNT(DISTINCT user_id WHERE last_login >= NOW() - 30 days)  
**Meta inicial:** 80% dos pagantes  
**Benchmark:** 60-70%  
**Alerta:** Se < 50%, risco alto de churn

#### 9. Feature Adoption Rate - Export
**Definição:** % de pagantes que usaram export ao menos 1x no mês  
**Fórmula:** (Usuários que exportaram / Total pagantes) × 100  
**Meta inicial:** 60%  
**Justificativa:** Export é feature premium critical (principalmente para contadores)

#### 10. Average Session Duration
**Definição:** Tempo médio de sessão ativa no app  
**Fórmula:** SUM(session_end - session_start) / Total sessões  
**Meta inicial:** > 8 minutos  
**Benchmark:** 5-10 min (dashboard financeiro)

---

### Categoria 5: Retenção

#### 11. Monthly Churn Rate
**Definição:** % de assinantes que cancelam no mês  
**Fórmula:** (Cancelamentos no mês / Assinantes início mês) × 100  
**Meta inicial:** < 5%  
**Benchmark:** 3-7% (SaaS B2B maduro)  
**Impacto:** 1% redução de churn = +15% LTV

#### 12. Net Revenue Retention (NRR)
**Definição:** Receita retida + expansão - downgrades - churn  
**Fórmula:** [(MRR fim - MRR novos clientes) / MRR início] × 100  
**Meta inicial:** > 100% (expansão > churn)  
**Benchmark:** > 110% (SaaS excelente)

---

### Categoria 6: Satisfação

#### 13. Net Promoter Score (NPS)
**Definição:** % promotores (9-10) - % detratores (0-6)  
**Coleta:** Survey in-app trimestral ("Recomendaria para amigo? 0-10")  
**Meta inicial:** NPS > 50  
**Benchmark:** 30-50 (SaaS médio), >70 (world-class)

#### 14. Customer Satisfaction (CSAT)
**Definição:** Satisfação média pós-interação  
**Coleta:** "Como foi sua experiência? ⭐⭐⭐⭐⭐" (após export, suporte)  
**Meta inicial:** 4.2/5  
**Benchmark:** 4.0-4.5

---

### Categoria 7: Suporte

#### 15. First Response Time (FRT)
**Definição:** Tempo médio até primeira resposta de suporte  
**Meta inicial:** < 2 horas (horário comercial)  
**Benchmark:** < 1 hora (premium), < 4 horas (standard)

#### 16. Support Ticket Volume
**Definição:** Tickets abertos / MAU  
**Meta inicial:** < 5% (ou seja, 95% dos usuários não precisam suporte)  
**Análise:** Identificar bugs recorrentes, melhorar UX

---

## 🧪 5 EXPERIMENTOS A/B PRIORITÁRIOS

### Experimento 1: Onboarding Linear vs Gamificado

**Hipótese:**  
Onboarding gamificado (com progress bar e celebrações) aumenta completion rate de 40% para 65%+.

**Variantes:**
- **A (Controle):** Wizard simples de 3 passos (texto puro)
- **B (Teste):** Wizard com:
  - Progress bar visual (1/3, 2/3, 3/3)
  - Confetti animation ao completar cada passo
  - Badge "Primeiro passo completo! 🎉"

**Métrica primária:** Onboarding completion rate  
**Métricas secundárias:** Time-to-complete, bounce rate após step 1

**Tamanho da amostra:** 200 usuários/variante (400 total)  
**Duração:** 2 semanas  
**Critério de sucesso:** Aumento > 20% (p < 0.05)

**Implementação:**
```javascript
// Feature flag
const variant = useABTest('onboarding_gamified', {
  A: 'control',
  B: 'gamified'
})

// Analytics
trackEvent('onboarding_step_completed', {
  step: 1,
  variant: variant,
  timestamp: Date.now()
})
```

---

### Experimento 2: CTA do Plano Free vs Pro no Trial

**Hipótese:**  
Mostrar CTA "Upgrade para Pro" após usuário adicionar 40+ transações (perto do limite de 50) aumenta conversão em 25%.

**Variantes:**
- **A (Controle):** Banner genérico "Upgrade para Pro" sempre visível no topo
- **B (Teste):** Banner contextual aparece apenas quando:
  - Usuário tem 40-49 transações (perto do limite)
  - Mensagem: "Você está quase no limite! Upgrade e adicione transações ilimitadas 🚀"

**Métrica primária:** Trial-to-paid conversion rate  
**Métricas secundárias:** Click-through rate do banner, tempo até upgrade

**Tamanho da amostra:** 300 usuários/variante  
**Duração:** 3 semanas (ciclo de trial completo)  
**Critério de sucesso:** Aumento > 15%

---

### Experimento 3: Dashboard com Comparação vs Sem Comparação

**Hipótese:**  
Adicionar comparação "vs mês anterior" nos cards de métricas aumenta engajamento (sessions/user) em 20%.

**Variantes:**
- **A (Controle):** Cards mostram apenas valor absoluto ("R$ 15.000")
- **B (Teste):** Cards mostram valor + comparação:
  - "R$ 15.000"
  - "+12% vs mês anterior" (com seta ↑)
  - Badge verde "Melhor mês!" se recorde

**Métrica primária:** Average sessions per user (30 dias)  
**Métricas secundárias:** Time on dashboard page, bounce rate

**Tamanho da amostra:** 400 usuários/variante  
**Duração:** 4 semanas  
**Critério de sucesso:** Aumento > 15%

---

### Experimento 4: Exportação Grátis vs Paywall

**Hipótese:**  
Permitir 1 export grátis/mês (teaser) aumenta conversão trial→paid em 30% vs paywall total.

**Variantes:**
- **A (Controle):** Export bloqueado para usuários free (paywall imediato)
- **B (Teste):** Export permitido 1x/mês, depois paywall com mensagem:
  - "Você usou seu export gratuito deste mês. Upgrade para Pro e exporte ilimitado!"

**Métrica primária:** Trial-to-paid conversion rate  
**Métricas secundárias:** % de users que tentam exportar, NPS

**Tamanho da amostra:** 300 usuários/variante  
**Duração:** 3 semanas  
**Critério de sucesso:** Aumento > 20%

**Risco:** Usuários podem abusar criando múltiplas contas. Mitigação: Rate limit por IP.

---

### Experimento 5: Email de Reativação - Educacional vs Desconto

**Hipótese:**  
Email mostrando "insight perdido" (ex: "Você perdeu R$ 3k em despesas não categorizadas") tem 2x mais reativação que email com desconto genérico.

**Contexto:** Usuários que não logam há 7+ dias.

**Variantes:**
- **A (Controle):** Email com desconto:
  - Subject: "20% OFF no plano Pro - Oferta exclusiva"
  - Corpo: Pitch + código promocional
  
- **B (Teste):** Email educacional:
  - Subject: "Você pode estar perdendo dinheiro 💸"
  - Corpo: "Detectamos R$ 3.200 em despesas não categorizadas nos últimos 30 dias. Volte ao app e descubra para onde seu dinheiro está indo."
  - CTA: "Ver minhas despesas"

**Métrica primária:** Reactivation rate (login 7 dias após email)  
**Métricas secundárias:** Open rate, click rate, conversão pós-reativação

**Tamanho da amostra:** 500 usuários/variante  
**Duração:** 2 semanas  
**Critério de sucesso:** Aumento > 50% em reativação

---

## 📈 FRAMEWORK DE EXPERIMENTAÇÃO

### Processo de A/B Testing

**1. Ideação (Backlog)**
- Coletar ideias de: usuários, analytics, benchmarks
- Priorizar por ICE Score: (Impact × Confidence × Ease) / 3

**2. Hipótese (Estruturada)**
```
Se [MUDANÇA],
então [MÉTRICA] vai [AUMENTAR/DIMINUIR] em [X%],
porque [RAZÃO/INSIGHT].
```

**3. Desenho do Experimento**
- Definir variantes (A/B ou A/B/C)
- Calcular sample size (power analysis)
- Escolher ferramenta (Google Optimize, VWO, custom)

**4. Implementação**
- Feature flags (LaunchDarkly, Unleash, ou custom)
- Instrumentação analytics (eventos tracking)
- QA de ambas variantes

**5. Análise**
- Aguardar significância estatística (p < 0.05)
- Verificar métricas secundárias (não piorar nada)
- Análise por segmento (desktop vs mobile, free vs paid)

**6. Decisão**
- **Winner:** Deploy para 100%
- **No winner:** Iterar hipótese ou descartar
- **Surpresa negativa:** Rollback imediato

---

## 🛠️ FERRAMENTAS RECOMENDADAS

### Analytics
- **Mixpanel** (R$ 300-800/mês) - Eventos, funnels, cohorts
- **PostHog** (Open-source) - Self-hosted, feature flags integrados
- **Google Analytics 4** (Grátis) - Básico, mas suficiente para início

### A/B Testing
- **Google Optimize** (Grátis, mas descontinuado 2023) - Migrar para VWO
- **VWO** (R$ 600/mês) - Visual editor + stats engine
- **LaunchDarkly** (R$ 800/mês) - Feature flags profissional

### Qualitativo
- **Hotjar** (R$ 150/mês) - Heatmaps, session recordings
- **Maze** (R$ 300/mês) - User testing remoto
- **Typeform** (R$ 100/mês) - Surveys (NPS, CSAT)

---

## 📊 DASHBOARD DE MÉTRICAS (RECOMENDAÇÃO)

**Estrutura:**

```
┌─────────────────────────────────────────┐
│ MÉTRICAS NORTH STAR (1 semana)         │
│ • MRR: R$ 45.000 (↑ 8% vs semana ant.) │
│ • Trial→Paid: 22% (↓ 3pp - ALERTA)     │
│ • Churn: 4.2% (✓ Meta < 5%)            │
└─────────────────────────────────────────┘

┌────────────────┬────────────────┬────────────────┐
│ AQUISIÇÃO      │ ATIVAÇÃO       │ RETENÇÃO       │
│ • Trials: 120  │ • TTFT: 1.8min │ • MAU: 850     │
│ • CPA: R$ 45   │ • Onboard: 68% │ • NPS: 52      │
└────────────────┴────────────────┴────────────────┘

┌─────────────────────────────────────────┐
│ EXPERIMENTOS ATIVOS                     │
│ • [A/B] Onboarding Gamified - 45% comp. │
│ • [A/B] Dashboard Comparison - analisando│
└─────────────────────────────────────────┘
```

**Ferramenta:** Metabase (open-source) ou Looker Studio (grátis)

---

## ✅ PRÓXIMOS PASSOS

1. **Semana 1:** Implementar tracking de eventos críticos (Analytics)
2. **Semana 2:** Criar dashboard básico no Metabase
3. **Semana 3:** Executar Experimento 1 (Onboarding)
4. **Mês 2:** Executar Experimentos 2-5 (pipeline de testes)
5. **Trimestre:** Estabelecer cultura de data-driven decisions
