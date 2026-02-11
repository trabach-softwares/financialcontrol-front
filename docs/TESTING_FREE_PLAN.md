# 🧪 Guia de Teste - Plano GRATUITO

## 🎯 Objetivo
Validar que a página de relatórios **limita corretamente** os recursos para usuários do plano GRATUITO.

---

## ✅ Pré-requisitos

### 1. Backend Configurado
- ✅ API `GET /api/reports/summary` implementada
- ✅ Retorna apenas **3 categorias** para plano FREE
- ✅ API `POST /api/reports/export` retorna **403 Forbidden**

### 2. Usuário FREE no Sistema
```javascript
// Certifique-se que o usuário logado tem:
{
  "plan": "FREE",  // ou "BASIC" ou "GRATUITO"
  "plan_id": 1
}
```

---

## 🧪 TESTES PARA PLANO GRATUITO

### ✅ Teste 1: Limitação de Categorias

**Ação:** Acesse `/reports`

**Resultado Esperado:**
- ✅ Ver **apenas 3 categorias** no gráfico de pizza
- ✅ Ver badge **"Top 3 Categorias"** no card
- ✅ Ver mensagem: **"+ X categoria(s) não exibida(s) no plano gratuito"**
- ✅ As 3 categorias devem ser as **maiores por valor total**

**Exemplo Visual:**
```
┌─────────────────────────────────┐
│ 🥧 Despesas por Categoria       │
│                          [Top 3] │
├─────────────────────────────────┤
│                                 │
│     [Gráfico de Pizza]          │
│                                 │
├─────────────────────────────────┤
│ 🟦 Alimentação      R$ 1.200,00 │
│ 🟧 Transporte       R$ 800,00   │
│ 🟪 Lazer            R$ 500,00   │
│                                 │
│ ℹ️ + 7 categoria(s) não         │
│    exibida(s) no plano gratuito │
└─────────────────────────────────┘
```

---

### ✅ Teste 2: Banner de Upgrade

**Ação:** Rolar a página para baixo

**Resultado Esperado:**
- ✅ Ver **banner de upgrade** inline
- ✅ Título: "Relatórios Avançados - Feature Pro ⚡"
- ✅ Lista de benefícios do plano PRO
- ✅ Botão **"Fazer Upgrade Agora"**

**Exemplo Visual:**
```
┌────────────────────────────────────────┐
│ ⚡ Relatórios Avançados - Feature Pro  │
│                                   [PRO]│
├────────────────────────────────────────┤
│ Relatórios avançados estão             │
│ disponíveis a partir do plano Pro.     │
│                                        │
│ ⭐ O que você ganha com o upgrade:     │
│ ✅ Gráficos ilimitados de categorias   │
│ ✅ Evolução mensal completa            │
│ ✅ Exportação em PDF, Excel e CSV      │
│ ✅ Comparativos entre períodos         │
│ ✅ Análise de tendências               │
│ ✅ Relatórios detalhados               │
│                                        │
│           [Fazer Upgrade Agora →]      │
└────────────────────────────────────────┘
```

---

### ✅ Teste 3: Preview Bloqueado

**Ação:** Verificar se há cards de features bloqueadas

**Resultado Esperado:**
- ✅ Ver cards **desfocados (blur)**
- ✅ Ícone de **cadeado** grande no centro
- ✅ Texto: "Gráficos Avançados"
- ✅ Subtexto: "Disponível no plano PRO"

**Exemplo Visual:**
```
┌────────────────────────────────┐
│ [Conteúdo desfocado/blur]      │
│                                │
│          🔒                    │
│                                │
│    Gráficos Avançados          │
│  Disponível no plano PRO       │
└────────────────────────────────┘
```

---

### ✅ Teste 4: Exportação Bloqueada

**Ação:** Clicar em qualquer botão de exportação (PDF/Excel/CSV)

**Resultado Esperado:**
- ✅ **NÃO** deve haver botões de exportação visíveis
- ✅ OU botões devem estar desabilitados
- ✅ OU ao clicar, mostrar notificação:
  - Tipo: **warning**
  - Mensagem: "Exportação requer plano PRO ou superior"
  - Ação: "Ver Planos"

**Console Log Esperado:**
```javascript
❌ [ReportsPage] Erro ao exportar:
{
  code: 'PLAN_UPGRADE_REQUIRED',
  message: 'Feature requer plano PRO ou superior',
  requiredPlan: 'PRO',
  currentPlan: 'FREE'
}
```

---

### ✅ Teste 5: Métricas Básicas Funcionam

**Ação:** Verificar cards de resumo

**Resultado Esperado:**
- ✅ Ver **4 cards de métricas:**
  1. Receitas (verde)
  2. Despesas (vermelho)
  3. Saldo (azul/laranja)
  4. Transações (azul)
- ✅ Valores devem estar corretos
- ✅ Formatação de moeda: `R$ X.XXX,XX`

**Exemplo:**
```
┌──────────┬──────────┬──────────┬──────────┐
│ Receitas │ Despesas │  Saldo   │Transações│
│ R$ 5.000 │ R$ 3.500 │ R$ 1.500 │    45    │
│    📈    │    📉    │    💰    │    📄    │
└──────────┴──────────┴──────────┴──────────┘
```

---

### ✅ Teste 6: Filtro de Período

**Ação:** 
1. Selecionar data inicial: `2025-01-01`
2. Selecionar data final: `2025-11-13`
3. Clicar em **"Aplicar Filtros"**

**Resultado Esperado:**
- ✅ Loading spinner aparece
- ✅ API é chamada: `GET /api/reports/summary?start_date=2025-01-01&end_date=2025-11-13`
- ✅ Dados são atualizados
- ✅ Ainda mostra apenas 3 categorias

**Console Log Esperado:**
```javascript
📊 [ReportsPage] Carregando dados do relatório...
📊 [ReportService] Buscando resumo de relatórios: {
  start_date: '2025-01-01',
  end_date: '2025-11-13'
}
✅ [ReportService] Resposta da API: { ... }
✅ [ReportsPage] Dados recebidos: { ... }
```

---

### ✅ Teste 7: Botão "Limpar Filtros"

**Ação:** Clicar em **"Limpar"**

**Resultado Esperado:**
- ✅ Campos de data ficam vazios
- ✅ API é chamada sem parâmetros: `GET /api/reports/summary`
- ✅ Dados retornam para período padrão (últimos 12 meses)

---

## 🚫 RECURSOS QUE NÃO DEVEM APARECER

### ❌ NÃO deve aparecer para plano FREE:
- ❌ Botões de exportação (PDF/Excel/CSV)
- ❌ Gráfico de evolução mensal
- ❌ Tabela de comparativo de períodos
- ❌ Relatório detalhado por categoria (expansível)
- ❌ Mais de 3 categorias no gráfico
- ❌ Gráfico de barras de categorias

---

## 🎨 Checklist Visual

### Elementos que DEVEM estar visíveis:
- [x] Header da página com título "Relatórios Financeiros"
- [x] Badge do plano atual (ex: "FREE")
- [x] Filtros de período (data inicial, data final, botões)
- [x] 4 cards de métricas (receitas, despesas, saldo, transações)
- [x] Gráfico de pizza com TOP 3 categorias
- [x] Lista de categorias com valores
- [x] Indicador "+ X categorias não exibidas"
- [x] Banner de upgrade inline
- [x] Preview bloqueado (opcional)

### Elementos que NÃO devem estar visíveis:
- [ ] Botões de exportação
- [ ] Gráfico de evolução mensal
- [ ] Tabela comparativa
- [ ] Relatórios expansíveis

---

## 📱 Teste Responsivo

### Desktop
- ✅ Grid 4 colunas para métricas
- ✅ Gráfico centralizado (max-width: 400px)
- ✅ Banner de upgrade com 2 colunas

### Tablet
- ✅ Grid 2 colunas para métricas
- ✅ Gráfico responsivo

### Mobile
- ✅ Grid 1 coluna para métricas
- ✅ Gráfico adaptativo
- ✅ Banner stack vertical

---

## 🔧 Como Forçar Plano FREE (Desenvolvimento)

### Opção 1: Modificar localStorage
```javascript
// No console do browser:
const user = JSON.parse(localStorage.getItem('auth_user'))
user.plan = 'FREE'
user.plan_name = 'Gratuito'
localStorage.setItem('auth_user', JSON.stringify(user))
location.reload()
```

### Opção 2: Modificar authStore
```javascript
// Em src/stores/auth.js temporariamente:
userPlan: (state) => {
  return 'FREE' // Forçar sempre FREE para teste
}
```

---

## ✅ Checklist de Validação Final

- [ ] Página carrega sem erros
- [ ] Mostra apenas 3 categorias
- [ ] Banner de upgrade aparece
- [ ] Exportação está bloqueada
- [ ] Métricas básicas funcionam
- [ ] Filtro de período funciona
- [ ] Responsivo mobile/tablet/desktop
- [ ] Mensagens de erro adequadas
- [ ] Loading states aparecem
- [ ] Navegação para /plans funciona

---

## 🐛 Problemas Comuns

### Problema: Mostra mais de 3 categorias
**Causa:** Backend não está limitando  
**Solução:** Verificar SQL com `LIMIT 3` no backend

### Problema: Botões de exportação aparecem
**Causa:** Lógica de `v-if` errada  
**Solução:** Verificar `v-if="isProPlan || isPremiumPlan"`

### Problema: API retorna 500
**Causa:** Backend não está pronto  
**Solução:** Verificar logs do backend

### Problema: Nenhum dado aparece
**Causa:** Sem transações no banco  
**Solução:** Criar transações de teste

---

**Status**: 🟢 Pronto para testar!  
**Próximo passo**: Testar plano PRO após validação do FREE
