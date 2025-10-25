# ♿ ACESSIBILIDADE E INTERNACIONALIZAÇÃO

## 🎯 CHECKLIST ACESSIBILIDADE (WCAG 2.1 AA)

### 1. Contraste de Cores
**Critério:** Razão mínima 4.5:1 para texto normal, 3:1 para texto grande (18px+)

**Ações:**
- [ ] Testar todos pares texto/fundo com WebAIM Contrast Checker
- [ ] Substituir `text-grey-6` por `text-grey-8` onde contraste falha
- [ ] Garantir botões desabilitados ainda legíveis (mínimo 3:1)
- [ ] Testar dark mode (se implementado)

**Ferramentas:**
- WebAIM: https://webaim.org/resources/contrastchecker/
- Chrome DevTools: Lighthouse Audit

---

### 2. Navegação por Teclado
**Critério:** Todas funcionalidades acessíveis sem mouse

**Ações:**
- [ ] Testar Tab order lógico em todas páginas
- [ ] Implementar focus trap em modals
- [ ] Adicionar skip links: "Pular para conteúdo principal"
- [ ] Garantir focus visível (outline ou alternativa)
- [ ] Suportar Esc para fechar modals/dropdowns

**Exemplo:**
```vue
<!-- Skip link -->
<a href="#main-content" class="skip-link">
  Pular para conteúdo principal
</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 8px;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
</style>
```

---

### 3. ARIA Labels e Roles
**Critério:** Elementos semânticos ou ARIA corretos

**Ações:**
- [ ] Todos `q-btn` icon-only têm `aria-label`
- [ ] Modals têm `aria-labelledby` e `aria-describedby`
- [ ] Forms têm `<label>` associados a inputs
- [ ] Tabelas têm `<caption>` ou `aria-label`
- [ ] Gráficos têm `role="img"` e `aria-label` descritivo

**Exemplo:**
```vue
<!-- Botão sem texto -->
<q-btn 
  icon="delete" 
  flat 
  round
  aria-label="Deletar transação"
/>

<!-- Modal -->
<q-dialog>
  <q-card role="dialog" aria-labelledby="modal-title" aria-describedby="modal-desc">
    <q-card-section>
      <h2 id="modal-title">Confirmar exclusão</h2>
      <p id="modal-desc">Esta ação não pode ser desfeita.</p>
    </q-card-section>
  </q-card>
</q-dialog>

<!-- Gráfico -->
<div role="img" aria-label="Gráfico de evolução mensal de receitas e despesas">
  <BarChart :data="chartData" />
</div>
```

---

### 4. Formulários Acessíveis
**Critério:** Labels visíveis, erros descritivos, validação clara

**Ações:**
- [ ] Todos inputs têm `<label>` ou `aria-label`
- [ ] Mensagens de erro associadas via `aria-describedby`
- [ ] Campos obrigatórios indicados (não apenas asterisco)
- [ ] Validação inline com feedback visual e textual

**Exemplo:**
```vue
<q-input
  v-model="amount"
  label="Valor *"
  type="number"
  :error="errors.amount"
  :error-message="errors.amount"
  aria-required="true"
  aria-describedby="amount-error"
/>
<div v-if="errors.amount" id="amount-error" role="alert">
  {{ errors.amount }}
</div>
```

---

### 5. Imagens e Ícones
**Critério:** Alt text descritivo ou decorativo marcado

**Ações:**
- [ ] Imagens funcionais têm `alt` descritivo
- [ ] Imagens decorativas: `alt=""` ou `role="presentation"`
- [ ] Ícones informativos têm `aria-label`
- [ ] Logos têm alt com nome da empresa

---

### 6. Estrutura Semântica
**Critério:** HTML5 semântico, hierarquia de headings

**Ações:**
- [ ] Usar `<main>`, `<nav>`, `<aside>`, `<footer>`
- [ ] Hierarquia de headings (`h1` → `h2` → `h3`, sem pulos)
- [ ] Listas reais (`<ul>`, `<ol>`) para itens relacionados
- [ ] Não usar `<div>` quando elemento semântico existe

**Exemplo:**
```vue
<template>
  <q-layout>
    <q-header>
      <nav aria-label="Menu principal">
        <!-- ... -->
      </nav>
    </q-header>

    <q-page-container>
      <main id="main-content">
        <h1>Dashboard</h1>
        
        <section aria-labelledby="metrics-title">
          <h2 id="metrics-title">Métricas do mês</h2>
          <!-- cards -->
        </section>

        <section aria-labelledby="transactions-title">
          <h2 id="transactions-title">Últimas transações</h2>
          <!-- tabela -->
        </section>
      </main>
    </q-page-container>
  </q-layout>
</template>
```

---

### 7. Testes com Tecnologias Assistivas
**Ferramentas:**
- **NVDA** (Windows, grátis)
- **JAWS** (Windows, pago)
- **VoiceOver** (macOS/iOS, nativo)
- **TalkBack** (Android, nativo)

**Checklist de teste:**
- [ ] Login completo apenas com teclado
- [ ] Criar transação com screen reader
- [ ] Navegar dashboard com Tab
- [ ] Escutar leitura de métricas (valores formatados corretamente)

---

## 🌍 INTERNACIONALIZAÇÃO (i18n)

### Estratégia
**Idiomas prioritários:** PT-BR (lançamento), EN (Q2)

**Library recomendada:** `vue-i18n`

### Implementação

**1. Instalar vue-i18n:**
```bash
npm install vue-i18n@9
```

**2. Configurar:**
```javascript
// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import ptBR from './locales/pt-BR.json'
import en from './locales/en.json'

export default createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'en',
  messages: {
    'pt-BR': ptBR,
    'en': en
  }
})
```

**3. Arquivos de tradução:**
```json
// src/i18n/locales/pt-BR.json
{
  "dashboard": {
    "title": "Dashboard",
    "greeting": "Olá, {name}!",
    "metrics": {
      "income": "Receitas",
      "expense": "Despesas",
      "balance": "Saldo"
    }
  },
  "transactions": {
    "add": "Adicionar Transação",
    "empty": "Nenhuma transação encontrada"
  }
}
```

```json
// src/i18n/locales/en.json
{
  "dashboard": {
    "title": "Dashboard",
    "greeting": "Hello, {name}!",
    "metrics": {
      "income": "Income",
      "expense": "Expenses",
      "balance": "Balance"
    }
  },
  "transactions": {
    "add": "Add Transaction",
    "empty": "No transactions found"
  }
}
```

**4. Usar nos componentes:**
```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <h1>{{ t('dashboard.title') }}</h1>
  <p>{{ t('dashboard.greeting', { name: userName }) }}</p>
</template>
```

---

### Formatação de Dados

**Moedas:**
```javascript
// Usar Intl.NumberFormat (nativo)
const formatCurrency = (value, locale = 'pt-BR', currency = 'BRL') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value)
}

// Uso: formatCurrency(1500) → "R$ 1.500,00"
// Uso: formatCurrency(1500, 'en-US', 'USD') → "$1,500.00"
```

**Datas:**
```javascript
// Usar date-fns com locale
import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'

const formatDate = (date, locale = 'pt-BR') => {
  const localeMap = { 'pt-BR': ptBR, 'en': enUS }
  return format(date, 'PPP', { locale: localeMap[locale] })
}

// pt-BR: "25 de outubro de 2025"
// en: "October 25, 2025"
```

**Números:**
```javascript
const formatNumber = (value, locale = 'pt-BR') => {
  return new Intl.NumberFormat(locale).format(value)
}

// pt-BR: "1.500,50"
// en-US: "1,500.50"
```

---

### Seletor de Idioma

```vue
<!-- src/components/LanguageSelector.vue -->
<template>
  <q-select
    v-model="currentLocale"
    :options="localeOptions"
    option-value="value"
    option-label="label"
    dense
    borderless
    @update:model-value="changeLocale"
  >
    <template v-slot:prepend>
      <q-icon name="language" />
    </template>
  </q-select>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const localeOptions = [
  { label: 'Português', value: 'pt-BR', flag: '🇧🇷' },
  { label: 'English', value: 'en', flag: '🇺🇸' }
]

const currentLocale = ref(locale.value)

const changeLocale = (newLocale) => {
  locale.value = newLocale.value
  localStorage.setItem('locale', newLocale.value)
  
  // Atualizar Quasar lang se necessário
  // import { Quasar } from 'quasar'
  // import langPtBR from 'quasar/lang/pt-BR'
  // Quasar.lang.set(langPtBR)
}
</script>
```

---

## ✅ FERRAMENTAS DE AUDITORIA

### Lighthouse (Chrome DevTools)
```bash
# Executar audit
1. Abrir DevTools (F12)
2. Tab "Lighthouse"
3. Selecionar "Accessibility"
4. "Generate report"

# Meta: Score > 90
```

### axe DevTools
```bash
# Instalar extensão
https://chrome.google.com/webstore (buscar "axe DevTools")

# Executar scan automático
# Corrigir todos erros críticos
```

### WAVE (WebAIM)
```bash
https://wave.webaim.org/extension/
# Scan visual de problemas A11Y
```

---

## 📊 MÉTRICAS DE SUCESSO

| **Métrica** | **Meta** | **Como Medir** |
|-------------|----------|---------------|
| Lighthouse Accessibility Score | > 90 | Chrome DevTools |
| Navegação por teclado | 100% funcional | Teste manual |
| ARIA labels completos | 0 warnings | axe DevTools |
| Contraste WCAG AA | 100% dos textos | Contrast Checker |
| Screen reader friendly | Aprovado | Teste com NVDA |

---

## 🚀 PRÓXIMOS PASSOS

1. **Sprint 1:** Auditoria inicial + correção de contrastes
2. **Sprint 2:** ARIA labels + navegação teclado
3. **Sprint 3:** Implementar i18n (PT-BR + EN)
4. **Sprint 4:** Testes com usuários reais (pessoas com deficiências)
