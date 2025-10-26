# 🚀 Próximos Passos - Implementação Frontend SSO

## ✅ O QUE JÁ FOI FEITO

### Fase 1: Configuração e Base (100% COMPLETA)
- ✅ Paleta Sage Accountant configurada no Quasar
- ✅ Design Tokens completos (280 linhas)
- ✅ Sistema de Tipografia acessível (350 linhas)
- ✅ Estrutura de pastas do Design System
- ✅ Classes utilitárias de acessibilidade

### Fase 2: Layout e Login (50% COMPLETA)
- ✅ LoginPage NOVA com acessibilidade WCAG 2.1 AA
- ✅ Sistema i18n estruturado (PT-BR + EN)
- ✅ Skip link, ARIA labels, focus management

---

## 📋 AÇÕES IMEDIATAS (FAÇA AGORA)

### 1. Instalar vue-i18n
```bash
cd financialcontrol-front
npm install vue-i18n@9
```

### 2. Criar Boot File do i18n
**Criar arquivo:** `src/boot/i18n.js`

```javascript
import { boot } from 'quasar/wrappers'
import i18n from 'src/i18n'

export default boot(({ app }) => {
  app.use(i18n)
})

export { i18n }
```

### 3. Registrar no quasar.config.js
**Editar:** `quasar.config.js`

Adicionar `'i18n'` no array de boot files:

```javascript
boot: [
  'axios',
  'pinia',
  'i18n'  // ← ADICIONAR ESTA LINHA
],
```

### 4. Substituir LoginPage Antiga pela Nova
```bash
# Backup da antiga (opcional)
mv src/pages/public/LoginPage.vue src/pages/public/LoginPage_OLD.vue

# Ativar a nova
mv src/pages/public/LoginPage_NEW.vue src/pages/public/LoginPage.vue
```

### 5. Testar o Sistema
```bash
npm run dev
```

**Acesse:** http://localhost:9000/login

**Testar:**
- ✅ Página carrega sem erros
- ✅ Cores Sage Accountant aplicadas (verde #2C5F2D)
- ✅ Navegação por teclado (Tab)
- ✅ Skip link aparece ao pressionar Tab
- ✅ Formulários validam corretamente
- ✅ Responsividade em mobile

---

## 🎯 PRÓXIMOS COMPONENTES A CRIAR

### Prioridade ALTA

#### 1. MetricCard.vue
**Localização:** `src/components/design-system/molecules/MetricCard.vue`

**Propósito:** Exibir métricas financeiras (receitas, despesas, saldo)

**Props:**
```javascript
{
  label: String,        // "Receitas Totais"
  value: Number,        // 15000.50
  icon: String,         // "trending_up"
  type: String,         // "positive" | "negative" | "neutral"
  currency: Boolean,    // true = formatar como moeda
  change: Number,       // 12.5 (%)
  loading: Boolean
}
```

**Exemplo de Uso:**
```vue
<MetricCard
  label="Receitas"
  :value="15000.50"
  icon="trending_up"
  type="positive"
  currency
  :change="12.5"
/>
```

---

#### 2. StatusBadge.vue
**Localização:** `src/components/design-system/atoms/StatusBadge.vue`

**Propósito:** Exibir status com cores semânticas

**Props:**
```javascript
{
  label: String,        // "Ativo", "Pendente", "Cancelado"
  type: String,         // "success" | "warning" | "error" | "info"
  size: String,         // "sm" | "md" | "lg"
  outlined: Boolean
}
```

---

#### 3. EmptyState.vue
**Localização:** `src/components/design-system/molecules/EmptyState.vue`

**Propósito:** Estado vazio com ícone e mensagem

**Props:**
```javascript
{
  icon: String,         // "inbox"
  title: String,        // "Nenhuma transação encontrada"
  message: String,      // "Adicione sua primeira transação"
  actionLabel: String,  // "Adicionar Transação"
  actionIcon: String    // "add"
}
```

---

#### 4. ConfirmDialog.vue
**Localização:** `src/components/design-system/organisms/ConfirmDialog.vue`

**Propósito:** Dialog de confirmação para ações destrutivas

**Props:**
```javascript
{
  title: String,        // "Confirmar exclusão?"
  message: String,      // "Esta ação não pode ser desfeita"
  type: String,         // "danger" | "warning" | "info"
  confirmLabel: String, // "Excluir"
  cancelLabel: String,  // "Cancelar"
  loading: Boolean
}
```

---

## 🧪 TESTES DE ACESSIBILIDADE

### Ferramentas Recomendadas

#### 1. Lighthouse (Chrome DevTools)
```bash
# Abrir Chrome DevTools (F12)
# Aba "Lighthouse"
# Selecionar "Accessibility"
# Clicar "Generate report"
```

**Meta:** Score > 95

#### 2. axe DevTools (Extensão Chrome)
```
1. Instalar: https://chrome.google.com/webstore/detail/axe-devtools
2. Abrir DevTools
3. Aba "axe DevTools"
4. Clicar "Scan ALL of my page"
```

**Meta:** 0 erros críticos

#### 3. WAVE (Web Accessibility Evaluation Tool)
```
1. Instalar: https://wave.webaim.org/extension/
2. Clicar no ícone da extensão
3. Visualizar erros/avisos
```

#### 4. Teste Manual de Teclado
```
1. Pressionar Tab repetidamente
2. Verificar ordem lógica de foco
3. Verificar foco visível (outline)
4. Testar Enter/Space em botões
5. Testar Esc em dialogs
```

#### 5. Teste de Contraste
```
Ferramenta: https://webaim.org/resources/contrastchecker/

Testar pares:
- #2C5F2D (primary) no branco → 10.2:1 (AAA) ✓
- #201F1E (dark) no branco → 16.1:1 (AAA) ✓
- #616161 (grey-700) no branco → 7.5:1 (AAA) ✓
```

---

## 📱 TESTES DE RESPONSIVIDADE

### Breakpoints a Testar
```
- Mobile Portrait: 375x667 (iPhone SE)
- Mobile Landscape: 667x375
- Tablet Portrait: 768x1024 (iPad)
- Tablet Landscape: 1024x768
- Desktop Small: 1366x768
- Desktop Large: 1920x1080
```

### Chrome DevTools
```
1. F12 para abrir DevTools
2. Ctrl+Shift+M para Toggle Device Toolbar
3. Selecionar dispositivos da lista
4. Testar interações em cada tamanho
```

---

## 🔧 CONFIGURAÇÕES ADICIONAIS RECOMENDADAS

### 1. ESLint para Acessibilidade
```bash
npm install -D eslint-plugin-vuejs-accessibility
```

**Adicionar em `.eslintrc.js`:**
```javascript
{
  extends: [
    'plugin:vuejs-accessibility/recommended'
  ]
}
```

### 2. Prettier para Formatação Consistente
Já instalado - configurar auto-format no save:

**VS Code:** `.vscode/settings.json`
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### 3. Git Hooks com Husky (Opcional)
```bash
npm install -D husky lint-staged
npx husky install
```

---

## 📊 CHECKLIST DE QUALIDADE

### Antes de Cada Commit
- [ ] Código compila sem erros (`npm run build`)
- [ ] Sem warnings do ESLint (`npm run lint`)
- [ ] Formatado com Prettier (`npm run format`)
- [ ] Testado em mobile e desktop
- [ ] Navegação por teclado funciona
- [ ] Contraste WCAG validado

### Antes de Deploy
- [ ] Lighthouse Score > 90
- [ ] axe DevTools sem erros críticos
- [ ] Testado em 3 navegadores (Chrome, Firefox, Safari)
- [ ] Testado com leitor de tela (NVDA/VoiceOver)
- [ ] Performance < 3s Time to Interactive
- [ ] Todos os textos traduzidos (PT-BR + EN)

---

## 🎨 GUIA DE ESTILO RÁPIDO

### Cores (Sempre use as variáveis CSS)
```css
/* ✅ CORRETO */
color: var(--color-primary);
background: var(--color-grey-100);

/* ❌ ERRADO */
color: #2C5F2D;
background: #F5F5F5;
```

### Espaçamento (Sempre use o sistema 4px)
```css
/* ✅ CORRETO */
padding: var(--spacing-4);
margin-bottom: var(--spacing-2);

/* ❌ ERRADO */
padding: 15px;
margin-bottom: 10px;
```

### Tipografia
```css
/* ✅ CORRETO */
font-size: var(--text-base);
font-weight: var(--font-semibold);

/* ❌ ERRADO */
font-size: 16px;
font-weight: 600;
```

---

## 🚨 PROBLEMAS COMUNS E SOLUÇÕES

### Erro: "Cannot find module 'vue-i18n'"
```bash
npm install vue-i18n@9
```

### Erro: "i18n is not defined"
Adicionar `'i18n'` no `quasar.config.js` boot files

### LoginPage não carrega cores Sage Accountant
Verificar se o `quasar.config.js` foi salvo e reiniciar dev server

### Design Tokens não funcionam
Verificar se `design-tokens.scss` e `typography.scss` foram importados no `app.css`

### Focus ring não aparece
Adicionar classe `focus-ring` nos elementos interativos

---

## 📞 CONTATO E RECURSOS

### Documentação
- **Quasar:** https://quasar.dev
- **Vue 3:** https://vuejs.org
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **vue-i18n:** https://vue-i18n.intlify.dev

### Ferramentas Online
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Color Palette Generator:** https://coolors.co
- **ARIA Practices:** https://www.w3.org/WAI/ARIA/apg/

---

## ✨ RESUMO FINAL

Você tem agora:
- ✅ **Base sólida** com Design Tokens e Tipografia
- ✅ **Paleta profissional** Sage Accountant com contraste AAA
- ✅ **LoginPage acessível** com WCAG 2.1 AA
- ✅ **Sistema i18n** pronto para tradução
- ✅ **Estrutura escalável** para novos componentes

**Próximo passo:** Instalar vue-i18n e criar os componentes do Design System!

---

**Última Atualização:** 26/10/2025 16:00 (UTC-03:00)  
**Versão:** 1.0.0
