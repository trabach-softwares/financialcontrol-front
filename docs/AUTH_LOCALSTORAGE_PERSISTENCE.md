# 🔐 Persistência de Autenticação - localStorage

## 🎯 Objetivo
Manter o usuário logado mesmo após fechar o navegador, utilizando `localStorage` ao invés de `sessionStorage`.

---

## 🐛 Problema Anterior

### sessionStorage (Antes):
```javascript
// ❌ Expira ao fechar o navegador/aba
sessionStorage.setItem('auth_token', token)
sessionStorage.setItem('auth_user', JSON.stringify(user))
```

**Comportamento:**
- ✅ Token armazenado na **sessão do navegador**
- ❌ **Expira** quando o usuário fecha a aba/navegador
- ❌ Usuário precisa **fazer login toda vez** que abre o site
- ❌ **Inconveniente** para usuários frequentes

---

## ✅ Solução Implementada

### localStorage (Agora):
```javascript
// ✅ Persiste mesmo após fechar o navegador
localStorage.setItem('auth_token', token)
localStorage.setItem('auth_user', JSON.stringify(user))
```

**Comportamento:**
- ✅ Token armazenado **permanentemente** no navegador
- ✅ **Persiste** mesmo fechando navegador/aba
- ✅ Usuário fica **logado por dias/semanas**
- ✅ Expira apenas quando:
  - Token do backend expira (configurável no backend)
  - Usuário faz logout manual
  - localStorage é limpo manualmente

---

## 📊 Comparação

| Aspecto | sessionStorage | localStorage |
|---------|----------------|--------------|
| **Duração** | Até fechar aba | Permanente |
| **Persistência** | Apenas sessão | Cross-session |
| **Expiração** | Ao fechar navegador | Apenas logout manual ou expiração do token |
| **UX** | ❌ Login toda vez | ✅ Lembrar usuário |
| **Segurança** | 🟡 Mais restrito | 🟡 Mesma origem |

---

## 🔧 Arquivos Modificados

### 1. **src/stores/auth.js**
```javascript
// Estado inicial (linha ~17)
state: () => ({
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  token: localStorage.getItem('auth_token') || null,
  // ...
})

// Login (linha ~155)
localStorage.setItem('auth_token', token)
localStorage.setItem('auth_user', JSON.stringify(user))

// Registro (linha ~226)
localStorage.setItem('auth_token', response.token)

// fetchUser (linha ~323)
localStorage.setItem('auth_user', JSON.stringify(this.user))

// enrichUserPlan (linha ~391)
localStorage.setItem('auth_user', JSON.stringify(this.user))

// clearAuth (linha ~431)
localStorage.removeItem('auth_token')
localStorage.removeItem('auth_user')
```

### 2. **src/components/SessionManager.vue**
```javascript
// refreshToken (linha ~140)
localStorage.setItem('auth_token', data.token)
localStorage.setItem('auth_user', JSON.stringify(mergedMin))
localStorage.setItem('auth_user', JSON.stringify(normalized))
```

---

## ⏱️ Duração do Token

### Controle Backend:
A duração do token é definida **no backend**. Configurações comuns:

```javascript
// Exemplo de configuração backend (JWT)
{
  expiresIn: '7d',    // Token expira em 7 dias
  // ou
  expiresIn: '30d',   // Token expira em 30 dias
  // ou
  expiresIn: '90d',   // Token expira em 90 dias
}
```

### Recomendações:
- **Desenvolvimento**: 7-30 dias
- **Produção**: 30-90 dias (com refresh token)
- **Alta segurança**: 1-7 dias (com refresh token obrigatório)

---

## 🔄 Fluxo de Autenticação

### 1️⃣ **Login Inicial:**
```mermaid
User → Login Form
  → API /auth/login
  → Backend valida credenciais
  → Backend retorna token (válido por X dias)
  → Frontend salva em localStorage
  → Usuário logado ✅
```

### 2️⃣ **Retorno ao Site (mesmo navegador):**
```mermaid
User abre site
  → Frontend lê localStorage
  → Token existe? ✅
  → Token válido? ✅
  → Usuário logado automaticamente ✅
```

### 3️⃣ **Token Expirado:**
```mermaid
User abre site
  → Frontend lê localStorage
  → Token existe? ✅
  → API GET /auth/me (valida token)
  → Token expirado? ❌
  → clearAuth()
  → Redireciona para login
```

### 4️⃣ **Logout Manual:**
```mermaid
User clica em "Sair"
  → API POST /auth/logout
  → Frontend limpa localStorage
  → Token removido
  → Usuário deslogado ✅
```

---

## 🔒 Segurança

### ✅ **Medidas de Segurança Mantidas:**

1. **HTTPS**: Comunicação criptografada
2. **Same-Origin Policy**: localStorage isolado por domínio
3. **JWT Expiration**: Token expira automaticamente
4. **Logout Manual**: Usuário pode sair quando quiser
5. **Refresh Token**: Renova token antes de expirar (SessionManager)

### ⚠️ **Considerações:**

1. **XSS**: localStorage é vulnerável a XSS
   - ✅ Mitigação: Content Security Policy (CSP)
   - ✅ Mitigação: Sanitização de inputs
   - ✅ Mitigação: HttpOnly cookies (alternativa futura)

2. **Computador Compartilhado**:
   - ⚠️ Token persiste entre usuários
   - ✅ Solução: Usuário deve fazer logout

3. **Roubo de Token**:
   - ⚠️ Se token vazar, pode ser usado até expirar
   - ✅ Mitigação: Expiração curta (7-30 dias)
   - ✅ Mitigação: Refresh token rotation

---

## 🧪 Testando a Mudança

### Cenário 1: Login e Fechamento do Navegador
```bash
1. Fazer login no sistema
2. Verificar localStorage:
   - localStorage.getItem('auth_token')
   - localStorage.getItem('auth_user')
3. Fechar COMPLETAMENTE o navegador
4. Reabrir navegador
5. Acessar o site
✅ Esperado: Usuário deve estar logado
```

### Cenário 2: Logout Manual
```bash
1. Estar logado
2. Clicar em "Sair"
3. Verificar localStorage:
   - localStorage.getItem('auth_token') // null
   - localStorage.getItem('auth_user')  // null
✅ Esperado: Dados limpos
```

### Cenário 3: Token Expirado
```bash
1. Estar logado
2. Aguardar token expirar (ou manipular data)
3. Tentar acessar rota protegida
✅ Esperado: Redirecionar para login
```

---

## 📝 Notas Importantes

### 🔄 **Migração de Usuários Existentes:**

Usuários que já estavam usando `sessionStorage` precisarão fazer login novamente após esta atualização:

```javascript
// Primeira vez após atualização:
// sessionStorage tem token antigo ❌
// localStorage está vazio ❌
// → Usuário precisa fazer login
// → Novo token salvo em localStorage ✅
// → Próximas visitas: logado automaticamente ✅
```

### 🚀 **Deploy:**

1. Fazer commit das mudanças
2. Fazer deploy no servidor
3. Avisar usuários que precisarão fazer login **uma vez**
4. Após re-login, permanecerão logados

---

## 🔮 Melhorias Futuras

### 1. **Refresh Token Automático:**
```javascript
// Implementado em SessionManager.vue
// ✅ Renova token antes de expirar
// ✅ Notifica usuário
```

### 2. **HttpOnly Cookies (Mais Seguro):**
```javascript
// Token em cookie HttpOnly (não acessível via JS)
// Mais seguro contra XSS
// Requer mudanças no backend
```

### 3. **Remember Me Checkbox:**
```vue
<!-- Opção para usuário escolher -->
<q-checkbox v-model="rememberMe">
  Manter-me conectado
</q-checkbox>

// Se true: localStorage
// Se false: sessionStorage
```

### 4. **Device Fingerprinting:**
```javascript
// Vincular token ao dispositivo
// Invalidar se detectar mudança suspeita
```

---

## ✅ Conclusão

### **Antes:**
- ❌ Login **toda vez** que abre o navegador
- ❌ sessionStorage expira ao fechar aba
- ❌ Experiência ruim para usuários

### **Depois:**
- ✅ Login **persiste** por dias/semanas
- ✅ localStorage **permanente**
- ✅ Usuário **permanece logado**
- ✅ Logout **manual** quando quiser

---

**Status**: ✅ Implementado  
**Data**: Novembro 2024  
**Versão**: 1.0  
**Impacto**: Todos os usuários (re-login necessário uma vez)
