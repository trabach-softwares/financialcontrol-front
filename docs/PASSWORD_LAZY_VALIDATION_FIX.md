# 🔧 Correção: Validação de Senha com Lazy Validation

## 📋 Resumo

Corrigida a validação de senha para **não mostrar erro enquanto o usuário está digitando**. A mensagem de erro agora aparece apenas quando o usuário **sai do campo** (blur) ou ao **tentar submeter o formulário**.

## 🎯 Problema Identificado

### Comportamento Anterior ❌

```
Usuário digita: "1" → Erro: "A senha deve ter no mínimo 6 caracteres"
Usuário digita: "12" → Erro: "A senha deve ter no mínimo 6 caracteres"
Usuário digita: "123" → Erro: "A senha deve ter no mínimo 6 caracteres"
Usuário digita: "1234" → Erro: "A senha deve ter no mínimo 6 caracteres"
Usuário digita: "12345" → Erro: "A senha deve ter no mínimo 6 caracteres"
Usuário digita: "123456" → ✅ Válido
```

**Problema:** Notificação aparecia **a cada tecla digitada** enquanto a senha tinha menos de 6 caracteres, irritando o usuário.

### Causa Raiz

```vue
<!-- ❌ ANTES: Rules validavam em tempo real -->
<q-input
  v-model="loginForm.password"
  :rules="[val => {
    if (!val) {
      notifyError('ERROR.REQUIRED_FIELDS')  ← Notificação imediata
      return false
    }
    if (val.length < 6) {
      notifyError('ERROR.PASSWORD_TOO_SHORT')  ← Notificação a cada tecla
      return false
    }
    return true
  }]"
/>
```

---

## ✅ Solução Implementada

### 1. Adicionado `lazy-rules` no q-input

```vue
<!-- ✅ DEPOIS: lazy-rules + validação no blur -->
<q-input
  v-model="loginForm.password"
  lazy-rules
  @blur="validatePasswordOnBlur"
  :rules="[val => {
    if (!val) return 'Senha obrigatória'
    if (val.length < 6) return 'Mínimo 6 caracteres'
    return true
  }]"
/>
```

**Mudanças:**
- ✅ Adicionado `lazy-rules` - valida apenas no blur ou submit
- ✅ Removido `notifyError()` das rules - rules apenas retornam mensagem
- ✅ Adicionado `@blur="validatePasswordOnBlur"` - validação ao sair do campo

### 2. Criada função `validatePasswordOnBlur()`

```javascript
/**
 * Valida senha ao sair do campo (blur)
 * Mostra notificação apenas se houver erro
 */
const validatePasswordOnBlur = () => {
  const password = loginForm.value.password
  
  // Não validar se campo estiver vazio (será validado no submit)
  if (!password) {
    passwordValidationStatus.value = ''
    return
  }
  
  // Validar tamanho mínimo
  if (password.length < 6) {
    notifyError('ERROR.PASSWORD_TOO_SHORT')
  }
}
```

**Funcionalidade:**
- ✅ Chamada apenas no `@blur` (quando usuário sai do campo)
- ✅ Não valida campo vazio (evita notificação desnecessária)
- ✅ Mostra notificação apenas se senha < 6 caracteres

### 3. Aplicado no campo de registro também

```javascript
/**
 * Valida senha de registro ao sair do campo (blur)
 * Mostra notificação apenas se houver erro
 */
const validateRegisterPasswordOnBlur = () => {
  const password = registerForm.value.password
  
  // Não validar se campo estiver vazio (será validado no submit)
  if (!password) return
  
  // Validar tamanho mínimo
  if (password.length < 6) {
    notifyError('ERROR.PASSWORD_TOO_SHORT')
  }
}
```

---

## 🔄 Novo Fluxo de Validação

### Cenário 1: Usuário digita senha

```
Usuário digita: "1" → (nada acontece)
Usuário digita: "12" → (nada acontece)
Usuário digita: "123" → (nada acontece)
Usuário digita: "1234" → (nada acontece)
Usuário digita: "12345" → (nada acontece)
Usuário SAI DO CAMPO (blur) → ❌ Notificação: "A senha deve ter no mínimo 6 caracteres"
```

### Cenário 2: Usuário digita senha válida

```
Usuário digita: "123456" → (nada acontece)
Usuário SAI DO CAMPO (blur) → ✅ Validação visual (ícone check verde)
```

### Cenário 3: Tentativa de submit

```
Usuário clica em "Entrar" com senha curta
  ↓
Validação do formulário detecta erro
  ↓
Notificação: "A senha deve ter no mínimo 6 caracteres"
  ↓
Campo fica com borda vermelha
```

---

## 🎨 Validação Visual

### Indicadores Visuais (mantidos)

Enquanto o usuário digita:
- ✅ **Ícone de cadeado** muda de cor (cinza → verde) quando senha >= 6
- ✅ **Ícone de check** aparece quando senha válida
- ✅ **Barra de força** mostra nível de segurança da senha

Esses indicadores são **visuais e silenciosos** - não mostram notificações.

---

## 📝 Arquivo Modificado

**`src/pages/public/LoginPage.vue`**

### Mudanças no Campo de Login

```vue
<!-- Campo de Senha - Login -->
<q-input
  id="login-password"
  v-model="loginForm.password"
  :type="showPassword ? 'text' : 'password'"
  outlined
  dense
  class="full-width focus-ring modern-input"
  lazy-rules                              ← ADICIONADO
  @blur="validatePasswordOnBlur"          ← ADICIONADO
  :rules="[val => {
    if (!val) return 'Senha obrigatória'  ← MODIFICADO (sem notifyError)
    if (val.length < 6) return 'Mínimo 6 caracteres'  ← MODIFICADO
    return true
  }]"
>
```

### Mudanças no Campo de Registro

```vue
<!-- Campo de Senha - Registro -->
<q-input
  id="register-password"
  v-model="registerForm.password"
  :type="showPasswordRegister ? 'text' : 'password'"
  outlined
  dense
  class="full-width focus-ring"
  lazy-rules                                      ← ADICIONADO
  @blur="validateRegisterPasswordOnBlur"          ← ADICIONADO
  :rules="[val => {
    if (!val) return 'Senha obrigatória'          ← ADICIONADO
    if (val.length < 6) return 'Mínimo 6 caracteres'  ← ADICIONADO
    return true
  }]"
>
```

### Funções Adicionadas no Script

```javascript
// ==========================================================================
// VALIDAÇÃO DE SENHA NO BLUR
// ==========================================================================

/**
 * Valida senha ao sair do campo (blur)
 * Mostra notificação apenas se houver erro
 */
const validatePasswordOnBlur = () => {
  const password = loginForm.value.password
  if (!password) {
    passwordValidationStatus.value = ''
    return
  }
  if (password.length < 6) {
    notifyError('ERROR.PASSWORD_TOO_SHORT')
  }
}

/**
 * Valida senha de registro ao sair do campo (blur)
 * Mostra notificação apenas se houver erro
 */
const validateRegisterPasswordOnBlur = () => {
  const password = registerForm.value.password
  if (!password) return
  if (password.length < 6) {
    notifyError('ERROR.PASSWORD_TOO_SHORT')
  }
}
```

---

## 🧪 Testes Manuais

### Teste 1: Digitação sem erro

1. Abrir página de login
2. Clicar no campo de senha
3. Digitar "123" (menos de 6 caracteres)
4. **Resultado esperado:**
   - ✅ Nenhuma notificação aparece
   - ✅ Campo não fica vermelho
   - ✅ Ícone de cadeado permanece cinza

### Teste 2: Blur com senha curta

1. Abrir página de login
2. Clicar no campo de senha
3. Digitar "123" (menos de 6 caracteres)
4. Clicar fora do campo (blur)
5. **Resultado esperado:**
   - ✅ Notificação aparece: "A senha deve ter no mínimo 6 caracteres"
   - ✅ Campo fica com borda vermelha (se aplicável)
   - ✅ Mensagem de validação aparece abaixo do campo

### Teste 3: Blur com senha válida

1. Abrir página de login
2. Clicar no campo de senha
3. Digitar "123456" (6 caracteres)
4. Clicar fora do campo (blur)
5. **Resultado esperado:**
   - ✅ Nenhuma notificação de erro
   - ✅ Ícone de check verde aparece
   - ✅ Ícone de cadeado fica verde

### Teste 4: Submit com senha curta

1. Abrir página de login
2. Preencher email
3. Digitar "123" no campo senha
4. Clicar em "Entrar"
5. **Resultado esperado:**
   - ✅ Notificação aparece: "A senha deve ter no mínimo 6 caracteres"
   - ✅ Formulário não é submetido
   - ✅ Campo senha fica destacado

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes ❌ | Depois ✅ |
|---------|----------|-----------|
| **Validação durante digitação** | Sim (a cada tecla) | Não (silenciosa) |
| **Notificação imediata** | Sim (irritante) | Não |
| **Validação no blur** | Não | Sim |
| **Validação no submit** | Sim | Sim |
| **Indicadores visuais** | Sim | Sim (mantidos) |
| **UX** | ❌ Ruim (muito invasivo) | ✅ Bom (feedback adequado) |

---

## 🎯 Benefícios

1. **✅ Melhor UX:** Usuário não é interrompido enquanto digita
2. **✅ Feedback adequado:** Validação acontece no momento certo (blur ou submit)
3. **✅ Menos irritação:** Não mostra erro antes do usuário terminar de digitar
4. **✅ Consistência:** Padrão aplicado em login E registro
5. **✅ Acessibilidade:** Mantém indicadores visuais para usuários que preferem feedback visual

---

## 📝 Padrão de Validação

### Quando Validar

| Momento | Ação |
|---------|------|
| **Durante digitação** | Apenas validação visual silenciosa (cores, ícones) |
| **Ao sair do campo (blur)** | Validação com notificação se houver erro |
| **Ao submeter formulário** | Validação completa com notificações |

### Como Implementar em Novos Campos

```vue
<q-input
  v-model="form.campo"
  lazy-rules                    ← Sempre adicionar
  @blur="validateCampoOnBlur"   ← Função de validação no blur
  :rules="[val => {
    if (!val) return 'Mensagem de erro'  ← Sem notifyError()
    return true
  }]"
/>
```

```javascript
const validateCampoOnBlur = () => {
  const valor = form.campo
  if (!valor) return  // Não validar se vazio
  
  // Validações específicas
  if (/* condição de erro */) {
    notifyError('MENSAGEM_DE_ERRO')
  }
}
```

---

## 📚 Documentação Quasar

**`lazy-rules`** - [Documentação oficial](https://quasar.dev/vue-components/input#lazy-rules)

> Lazy rules validation means that the rules will only be triggered when the component is blurred or when the component is trying to submit a form.

---

## 📝 Commit

```bash
git add src/pages/public/LoginPage.vue
git commit -m "fix: validação de senha agora usa lazy-rules

Corrige validação de senha para não mostrar erro enquanto usuário digita.

Mudanças:

1. Adicionado lazy-rules nos campos de senha (login e registro)
2. Criadas funções validatePasswordOnBlur() e validateRegisterPasswordOnBlur()
3. Removido notifyError() das rules do q-input
4. Validação agora acontece apenas no blur ou submit

Benefícios:
- ✅ Melhor UX (não interrompe digitação)
- ✅ Feedback adequado (valida no momento certo)
- ✅ Menos notificações irritantes

Seguindo padrões do .github/copilot-instructions.md"
```

---

**Data:** 10 de fevereiro de 2026  
**Status:** ✅ CORRIGIDO  
**Arquivo:** `src/pages/public/LoginPage.vue`
