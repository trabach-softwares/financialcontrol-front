# 🔐 Sistema de Gerenciamento de Sessão

Sistema completo de timeout e extensão de sessão com limite de **40 minutos** de autenticação.

---

## ⏱️ Configuração

### Backend (JWT)
- **Expiração do Token**: 40 minutos
- **Localização**: `financialcontrol-api/src/config/jwt.js`

```javascript
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '40m' // 40 minutos
}
```

### Frontend (Sessão)
- **Timeout de Atividade**: 40 minutos (reseta com interação do usuário)
- **Timeout do Token**: 40 minutos (contagem regressiva fixa)
- **Aviso**: 5 minutos antes de expirar
- **Dialog**: Fica aberto por 4min 15s
- **Logout**: Quando restar 10 segundos

---

## 🎯 Como Funciona

### 1️⃣ **Monitoramento Duplo**

#### A) Atividade do Usuário
- Monitora interações (clicks, teclas, scroll, movimentos)
- **Reseta automaticamente** quando há atividade
- Se chegar a 0 → Sessão inativa

#### B) Token JWT
- Contagem regressiva fixa (não reseta com atividade)
- Baseado na expiração real do JWT
- Se chegar a 0 → Token expirado

---

### 2️⃣ **Fluxo de Renovação**

```
TOKEN COM 5 MIN RESTANTES
         ↓
TEM ATIVIDADE RECENTE?
    ↙        ↘
  SIM        NÃO
   ↓          ↓
RENOVAR    MOSTRAR
AUTO       DIALOG
   ↓          ↓
✅         USUÁRIO
SUCESSO   ESCOLHE
   ↓      ↙    ↘
RESETA  ESTENDER  SAIR
TOKEN     ↓       ↓
       RENOVA  LOGOUT
         ↓
       ✅
     SUCESSO
```

---

## 🔄 Eventos e Timers

### **Eventos de Atividade Monitorados:**
- `keydown` - Tecla pressionada
- `scroll` - Rolagem da página
- `touchstart` - Toque na tela (mobile)
- `click` - Click do mouse
- `mousemove` - Movimento do mouse

### **Timers Ativos:**
- **activityTick**: Decrementa contador de atividade (1s)
- **tokenTick**: Decrementa contador de token (1s)
- **expiryTimer**: Agenda logout quando faltar 10s
- **warningTimer**: Agenda aviso quando faltar 5min
- **countdownInterval**: Atualiza mensagem do dialog (1s)

---

## 📁 Arquivos do Sistema

### Backend
```
financialcontrol-api/
└── src/
    └── config/
        └── jwt.js                 # Configuração JWT (40min)
```

### Frontend
```
financialcontrol-front/
└── src/
    ├── composables/
    │   └── useSessionActivity.js  # Composable de sessão
    ├── components/
    │   └── SessionManager.vue     # Componente gerenciador
    └── layouts/
        └── MainLayout.vue         # Integração (linha 290)
```

---

## 🚀 Como Usar

### ✅ Já Está Funcionando!

O sistema **já está ativo automaticamente** em toda a aplicação!

**Não precisa fazer nada nos componentes.**

---

## 🎨 Customização

### ⏱️ **Alterar Tempos**

#### Backend (Token JWT):
```javascript
// financialcontrol-api/src/config/jwt.js
expiresIn: '30m' // Alterar para 30 minutos
```

#### Frontend (Composable):
```javascript
// src/composables/useSessionActivity.js
const ACTIVITY_TIMEOUT_SECONDS = 30 * 60 // 30 minutos
const TOKEN_EXPIRY_SECONDS = 30 * 60 // 30 minutos
```

#### Frontend (Componente):
```javascript
// src/components/SessionManager.vue
const LOGOUT_MARGIN_SECONDS = 10  // Logout aos 10s
const DIALOG_COUNTDOWN_SECONDS = 255  // Dialog 4min 15s
const WARNING_MARGIN_SECONDS = 300  // Avisar aos 5 min
```

---

## 🧪 Modo de Teste

Para testar rapidamente (1 minuto em vez de 40):

### Backend:
```javascript
// jwt.js
expiresIn: '1m' // 1 minuto
```

### Frontend Composable:
```javascript
// useSessionActivity.js
const ACTIVITY_TIMEOUT_SECONDS = 60 // 1 minuto
const TOKEN_EXPIRY_SECONDS = 60 // 1 minuto
```

### Frontend Componente:
```javascript
// SessionManager.vue
const LOGOUT_MARGIN_SECONDS = 5 // 5 segundos
const DIALOG_COUNTDOWN_SECONDS = 10 // 10 segundos
const WARNING_MARGIN_SECONDS = 15 // 15 segundos
```

---

## 🐛 Debugging

### Ver Logs no Console:

```javascript
// Logs do Composable:
🚀 [SESSION] Sistema de sessão iniciado
⏱️ [SESSION] Contagem de token iniciada: 2400 segundos
🔄 [SESSION] Atividade resetada
👂 [SESSION] Listeners registrados

// Logs do Componente:
🚀 [SESSION MANAGER] Componente montado
✅ [SESSION MANAGER] Contagem iniciada
🔄 [SESSION] Tentando renovar token...
✅ [SESSION] Token renovado com sucesso
🚪 [SESSION] Fazendo logout por timeout
```

### Verificar Estado:

```vue
<script setup>
import { useSessionActivity } from '@/composables/useSessionActivity'

const { 
  activityRemaining,
  tokenRemaining,
  activityRemainingFormatted,
  tokenRemainingFormatted
} = useSessionActivity()

// Exibir no template
console.log('Atividade restante:', activityRemaining.value, 'segundos')
console.log('Token restante:', tokenRemaining.value, 'segundos')
console.log('Atividade formatada:', activityRemainingFormatted.value)
console.log('Token formatado:', tokenRemainingFormatted.value)
</script>
```

---

## 📊 Fluxograma Completo

```
USUÁRIO FAZ LOGIN
        ↓
  TOKEN CRIADO (40min)
        ↓
  INICIA CONTADORES
   ├─ Atividade: 40min
   └─ Token: 40min
        ↓
   USUÁRIO INTERAGE
        ↓
 ATIVIDADE RESETA ✅
   (Token continua)
        ↓
  FALTAM 5 MINUTOS
        ↓
   TEM ATIVIDADE?
    ↙        ↘
  SIM        NÃO
   ↓          ↓
RENOVAR    DIALOG
  AUTO       ↓
   ↓      USUÁRIO
  ✅      ESCOLHE
        ↙    ↘
   ESTENDER  SAIR
       ↓       ↓
    RENOVAR LOGOUT
       ↓       ↓
      ✅      🚪
```

---

## ⚙️ Funcionalidades

### ✅ O Que o Sistema Faz:

1. **Monitora Atividade**: Detecta interações do usuário automaticamente
2. **Monitora Token**: Conta regressiva do JWT
3. **Renovação Automática**: Se há atividade recente, renova silenciosamente
4. **Dialog de Aviso**: Mostra aviso 5 minutos antes de expirar
5. **Countdown Visual**: Atualiza tempo restante a cada segundo
6. **Logout Automático**: Desloga quando tempo acaba ou dialog é ignorado
7. **Proteção de Múltiplos Logins**: Previne chamadas simultâneas
8. **Pausa em Background**: Para contadores quando aba está oculta
9. **Notificações**: Informa usuário sobre renovações e expiração

---

## 🛡️ Segurança

- ✅ **Token JWT no Backend**: Expiração real em 40 minutos
- ✅ **Renovação via API**: Verifica validade antes de renovar
- ✅ **Logout Forçado**: Quando token realmente expira
- ✅ **Sem localStorage Sensível**: Apenas token JWT armazenado
- ✅ **Proteção CSRF**: Implementada no backend
- ✅ **Rate Limiting**: Limite de requisições por IP

---

## 📱 Responsividade

- ✅ **Desktop**: Funciona perfeitamente
- ✅ **Mobile**: Detecta toques e gestos
- ✅ **Tablet**: Compatível com touch events
- ✅ **PWA**: Funciona mesmo quando app está instalado

---

## ❓ FAQ

### **1. O que acontece se eu deixar a aba aberta sem usar?**
Após 5 minutos de inatividade, aparece um dialog perguntando se quer estender. Se não responder em 4min 15s, faz logout automático.

### **2. Se eu estiver usando, preciso clicar em "Estender"?**
Não! Se houver atividade recente (últimos 5 minutos), o sistema renova automaticamente sem mostrar dialog.

### **3. Posso usar múltiplas abas?**
Sim, mas cada aba tem sua própria contagem. Se uma aba expirar, não afeta as outras.

### **4. O tempo reseta quando eu navego entre páginas?**
Sim, qualquer interação (navegação, cliques, scroll) reseta o contador de atividade.

### **5. Como sei quanto tempo falta?**
Você pode ver no console do navegador ou importar o composable para exibir no UI.

---

## ✅ Checklist de Implementação

- [x] ✅ Backend JWT configurado (40 minutos)
- [x] ✅ Composable `useSessionActivity` criado
- [x] ✅ Componente `SessionManager` criado
- [x] ✅ Integrado no `MainLayout`
- [x] ✅ Listeners de atividade funcionando
- [x] ✅ Contadores independentes (atividade + token)
- [x] ✅ Dialog de extensão com countdown
- [x] ✅ Renovação automática se há atividade
- [x] ✅ Logout automático ao expirar
- [x] ✅ Logs de debug no console
- [x] ✅ Notificações ao usuário
- [x] ✅ Pausa quando página oculta
- [x] ✅ Documentação completa

---

## 🎉 Pronto!

Seu sistema de gerenciamento de sessão está **100% funcional**!

**Teste agora:**
1. Faça login
2. Aguarde 35 minutos (ou use modo de teste)
3. Veja o dialog aparecer
4. Clique em "Estender" ou aguarde para testar logout

**Tudo funciona automaticamente!** 🚀
