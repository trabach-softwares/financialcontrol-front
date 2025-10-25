# 📐 WIREFRAMES TEXTUAIS - TELAS PRINCIPAIS

## 🏠 TELA 1: DASHBOARD

**Layout:** Sidebar esquerda (240px) + Content área  
**Componentes principais:**
- Header: Logo + Search + User menu + Notifications
- Sidebar: Menu navegação (Dashboard, Transações, Relatórios, Perfil, Planos, Admin)
- Content: 
  - Welcome banner (Olá, [Nome]!)
  - 4 Cards métricas (Receitas, Despesas, Saldo, Transações)
  - Gráfico principal (Chart.js - linha/barra)
  - Tabela últimas 5 transações
  - Botão FAB flutuante (+)

**Hierarquia visual:**
1. Métricas (mais destaque) - Cards grandes com ícones
2. Gráfico (60% da largura)
3. Tabela (compacta, 5 linhas)

**Estados:** Loading (skeletons), Empty (call-to-action), Error (banner)

---

## 💳 TELA 2: TRANSAÇÕES

**Layout:** Mesma estrutura (Sidebar + Content)  
**Content:**
- Header: Título + Botão "Nova Transação"
- Filtros row: [Período ▼] [Tipo ▼] [Categoria ▼] [Busca...]
- Tabela completa: Data | Descrição | Categoria | Tipo | Valor | Ações
- Paginação: 20 itens/página
- Modal form para criar/editar

**Componentes Quasar:** q-table (pagination, selection), q-select (filtros), q-dialog (form modal)

---

## 💎 TELA 3: PLANOS

**Layout:** Centralizado (sem sidebar cheia, versão simplificada)  
**Content:**
- Hero: "Escolha o plano ideal"
- 3 Cards lado a lado (Free, Pro, Premium)
- Cada card: Nome | Preço | Features lista | CTA button
- Badge "Recomendado" no Pro
- FAQ accordion abaixo
- Footer com suporte

**Efeitos:** Hover scale(1.05) no card, Active plan com badge "Ativo"
