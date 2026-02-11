# 🔥 CORREÇÃO CRÍTICA: Token Expirado Retorna 403

## 🚨 Problema Crítico Identificado

### O Que Estava Acontecendo

```bash
# Logs do backend mostrando o PROBLEMA REAL:
[auth] token verify failed jwt expired
GET /api/auth/me 403 2.714 ms - 66        ← ❌ 403, não 401!
GET /api/transactions/stats 403 0.744 ms
GET /api/transactions 403 0.536 ms
# Requisições continuavam infinitamente...
```

**PROBLEMA:** Backend retorna **403 (Forbidden)** quando token expira, mas o frontend só tratava **401 (Unauthorized)**.

**RESULTADO:**
- ❌ Sistema não detectava token expirado
- ❌ Continuava fazendo requisições infinitamente
- ❌ Modal "Recurso Premium" aparecia incorretamente
- ❌ Usuario ficava preso sem conseguir fazer nada

---

## ✅ Solução Implementada

### 1. Detectar 403 como Token Expirado

O backend envia:
```json
{
  "status": 403,
  "message": "Invalid or expired token"
}
```

O frontend agora verifica:
- ✅ Status code **401 OU 403**
- ✅ Mensagem contém: "expired", "expirado", "invalid token", "token inválido"
- ✅ Error code: `TOKEN_EXPIRED`, `INVALID_TOKEN`

### 2. Ordem de Prioridade no 403

```javascript
case 403: {
  // ✅ PRIORIDADE 1: Token expirado?
  if (message.includes('expired') || message.includes('invalid token')) {
    → authStore.clearAuth()
    → Notify: "Sessão expirada"
    → Redireciona para /login
  }
  
  // ✅ PRIORIDADE 2: Limite de transações?
  else if (errorCode === 'TRANSACTION_LIMIT_EXCEEDED') {
    → showLimitDialog()
  }
  
  // ✅ PRIORIDADE 3: Erro genérico de permissão
  else {
    → showForbiddenDialog()
  }
}
```

---

## 📝 Arquivos Modificados

### 1. `src/boot/axios.js`

**Mudança:** Caso 403 agora verifica se é token expirado PRIMEIRO

```javascript
// ❌ ANTES:
case 403: {
  // Assumia que era erro de permissão/limite
  showForbiddenDialog(errorMessage)
}

// ✅ DEPOIS:
case 403: {
  // Verifica PRIMEIRO se é token expirado
  if (message.includes('expired') || message.includes('invalid token')) {
    authStore.clearAuth()
    router.push('/login?expired=true')
  }
  // DEPOIS verifica se é limite/permissão
  else if (errorCode === 'TRANSACTION_LIMIT_EXCEEDED') {
    showLimitDialog()
  }
  else {
    showForbiddenDialog()
  }
}
```

### 2. `src/stores/auth.js`

**Mudança:** `initialize()` trata 401 E 403

```javascript
// ❌ ANTES:
if (error.response?.status === 401) {
  this.clearAuth()
}

// ✅ DEPOIS:
const status = error.response?.status
const message = error.response?.data?.message || ''

if (status === 401 || status === 403) {
  const isTokenError = status === 401 || 
                       message.includes('expired') ||
                       message.includes('invalid token')
  
  if (isTokenError) {
    this.clearAuth()
    Notify('Sessão expirada...')
  }
}
```

### 3. `src/router/index.js`

**Mudança:** Router guard trata 401 E 403

```javascript
// ❌ ANTES:
if (error.response?.status === 401) {
  next('/login?expired=true')
}

// ✅ DEPOIS:
const status = error.response?.status
const message = error.response?.data?.message || ''

if (status === 401 || status === 403) {
  const isTokenError = status === 401 || 
                       message.includes('expired') ||
                       message.includes('invalid token')
  
  if (isTokenError) {
    next('/login?expired=true')
  }
}
```

---

## 🔄 Fluxo Corrigido

### Cenário: Token expira durante uso

```
1. Usuário faz ação → Requisição com token expirado
                    ↓
2. Backend valida   → Token expirado
                    ↓
3. Backend retorna  → 403 Forbidden + "Invalid or expired token"
                    ↓
4. Axios interceptor → Detecta 403 + verifica mensagem
                    ↓
5. É token expirado? → SIM! (message.includes('expired'))
                    ↓
6. authStore.clearAuth() → Limpa state + localStorage
                    ↓
7. Notify ao usuário → "Sessão expirada. Faça login novamente."
                    ↓
8. Router.push() → /login?expired=true
                    ↓
9. Página de login → Usuário pode fazer login
                    ↓
10. ✅ PARA DE FAZER REQUISIÇÕES INFINITAS
```

---

## 🧪 Teste Manual

### Passo a Passo

1. **Fazer login no sistema**
2. **No backend, ver o token expirar** (ou invalidar manualmente)
3. **Fazer qualquer ação** (clicar em dashboard, transações, etc)

### Resultado Esperado ✅

- ✅ Uma única notificação: "Sessão expirada. Faça login novamente."
- ✅ Redirecionamento imediato para `/login?expired=true`
- ✅ localStorage limpo (`auth_token` e `auth_user` removidos)
- ✅ State da store resetado
- ✅ **Não faz mais requisições** (ciclo infinito foi interrompido)
- ✅ Console mostra: `🔴 [AXIOS] Token expirado (403) - executando logout...`

### Resultado Anterior ❌

- ❌ Modal "Recurso Premium" aparecia
- ❌ Requisições continuavam infinitamente (403 403 403...)
- ❌ Token permanecia no localStorage
- ❌ Usuário não era redirecionado
- ❌ Console mostrava erro genérico

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Status tratado** | ❌ Apenas 401 | ✅ 401 e 403 |
| **Verificação de mensagem** | ❌ Não | ✅ Sim ('expired', 'invalid token') |
| **Prioridade no 403** | ❌ Assume erro de permissão | ✅ Verifica token PRIMEIRO |
| **Requisições infinitas** | ❌ Sim | ✅ Não (para no primeiro erro) |
| **Modal incorreto** | ❌ "Recurso Premium" | ✅ Notificação correta |
| **Cleanup** | ⚠️ Parcial | ✅ Completo (store + localStorage) |
| **Redirecionamento** | ❌ Não acontecia | ✅ Imediato para /login |

---

## 🎯 Por Que 403 e Não 401?

### Resposta do Backend

O middleware de autenticação do backend provavelmente está configurado assim:

```javascript
// Backend retorna 403 (Forbidden) para token expirado
if (tokenExpired) {
  return res.status(403).json({ 
    message: 'Invalid or expired token' 
  })
}
```

### Padrão HTTP

Tecnicamente:
- **401 Unauthorized:** "Você não está autenticado" (sem token ou token ausente)
- **403 Forbidden:** "Você está autenticado, mas não tem permissão" (token presente mas inválido/expirado)

Alguns backends usam 403 para token expirado porque o token ESTÁ presente, apenas não é mais válido.

### Solução

Frontend agora trata **ambos** corretamente, verificando também a **mensagem de erro**.

---

## 🔒 Segurança

### Melhorias de Segurança

1. ✅ **Token expirado é detectado imediatamente**
2. ✅ **Não permite requisições com token expirado**
3. ✅ **Limpa completamente dados sensíveis do localStorage**
4. ✅ **Força re-autenticação**
5. ✅ **Logs detalhados para auditoria**

---

## 📝 Commit

```bash
git add src/boot/axios.js src/stores/auth.js src/router/index.js
git commit -m "fix: trata 403 como token expirado além de 401

PROBLEMA CRÍTICO: Backend retorna 403 (não 401) quando token expira,
causando requisições infinitas e modal incorreto.

Correções implementadas:

1. Interceptor Axios (boot/axios.js):
   - Caso 403 agora verifica mensagem PRIMEIRO
   - Detecta 'expired', 'expirado', 'invalid token'
   - Prioriza token expirado sobre limite/permissão

2. Store Auth (stores/auth.js):
   - Trata status 401 E 403
   - Verifica mensagem para confirmar token expirado
   - Evita falsos positivos (403 de permissão)

3. Router Guard (router/index.js):
   - Try/catch trata 401 E 403
   - Redireciona apenas se for token expirado

RESULTADO:
- ✅ Para requisições infinitas
- ✅ Logout imediato quando token expira
- ✅ Notificação correta ao usuário
- ✅ Redirecionamento para /login

Logs do problema:
[auth] token verify failed jwt expired
GET /api/auth/me 403 2.714 ms - 66

Seguindo padrões do .github/copilot-instructions.md

Fixes #[número-da-issue]"
```

---

## ✅ Checklist Final

- [x] Axios interceptor detecta 403 + mensagem de token expirado
- [x] Store auth trata 401 E 403 verificando mensagem
- [x] Router guard trata 401 E 403 verificando mensagem
- [x] Ordem de prioridade no 403: token > limite > permissão
- [x] Logging detalhado com emojis
- [x] Notificação clara ao usuário
- [x] Limpeza completa (store + localStorage)
- [x] Redirecionamento para /login
- [x] Para requisições infinitas
- [x] Documentação atualizada
- [x] Segue padrões do .github/copilot-instructions.md

---

**Data:** 10 de fevereiro de 2026  
**Status:** ✅ CORRIGIDO  
**Prioridade:** 🔥 CRÍTICA
