# 💳 Integração Asaas - PIX, Boleto e Cartão

## 📋 Visão Geral

Implementação completa de **gateway de pagamento Asaas** no sistema, permitindo pagamentos via **PIX** (mais barato), **Boleto Bancário** e **Cartão de Crédito** para assinatura de planos.

**Data:** Janeiro 2025  
**Gateway:** Asaas (https://asaas.com)  
**Métodos:** PIX (0.99%) | Boleto (R$ 3.49) | Cartão (3.99%)

---

## 💰 Por que Asaas?

### **Comparação de Taxas:**

| Método de Pagamento | Asaas | Mercado Pago | Stripe |
|---------------------|-------|--------------|--------|
| **PIX** | 🟢 **0.99%** | 🟡 4.99% | ❌ Não tem |
| **Boleto** | 🟢 **R$ 3.49** fixo | 🟡 4.99% | ❌ Não tem |
| **Cartão à vista** | 🟡 **3.99%** | 🔴 4.99% + R$0.49 | 🔴 4.99% + R$0.50 |
| **Cartão parcelado** | 🟡 **4.49%** | 🔴 4.99% + R$0.49 | 🔴 4.99% + R$0.50 |

### **Economia Real (Plano Pro R$ 99,90):**

| Gateway | Método | Taxa | Você Recebe | Diferença |
|---------|--------|------|-------------|-----------|
| **Asaas** | PIX | R$ 0.99 | **R$ 98.91** | - |
| **Asaas** | Cartão | R$ 3.99 | **R$ 95.91** | - |
| Mercado Pago | PIX | R$ 4.99 | R$ 94.91 | -R$ 4.00 |
| Mercado Pago | Cartão | R$ 5.48 | R$ 94.42 | -R$ 1.49 |
| Stripe | Cartão | R$ 5.49 | R$ 94.41 | -R$ 1.50 |

**💵 Economia anual com Asaas PIX:** R$ 48,00 por cliente! 🤑

---

## 🚀 Arquivos Criados

### **1. API de Pagamentos** (`/src/apis/payments.js`)

```javascript
// Funções implementadas:
✅ createPayment(payload)      // Criar cobrança
✅ getPaymentStatus(paymentId)  // Consultar status
✅ listPayments(params)         // Histórico
✅ cancelPayment(paymentId)     // Cancelar
✅ getPixQrCode(paymentId)      // QR Code PIX
✅ getPaymentLink(paymentId)    // Link compartilhável
```

### **2. Rotas da API** (`/src/apis/routes.js`)

```javascript
// Novas rotas adicionadas:
paymentsCreate: "/payments"
paymentsStatus: "/payments/:id"
paymentsList: "/payments"
paymentsCancel: "/payments/:id"
paymentsPixQrCode: "/payments/:id/pix"
paymentsLink: "/payments/:id/link"
```

### **3. Componente de Checkout** (`/src/components/plans/PaymentCheckoutDialog.vue`)

**Funcionalidades:**
- ✅ Seleção de método (PIX, Boleto, Cartão)
- ✅ QR Code PIX com cópia automática
- ✅ Download/impressão de boleto
- ✅ Formulário de cartão de crédito
- ✅ Checagem automática de status
- ✅ UI/UX moderna e responsiva

### **4. Integração na PlansPage** (`/src/pages/auth/plans/PlansPage.vue`)

**Fluxo atualizado:**
```
Usuário clica "Fazer Upgrade"
   ↓
Dialog de confirmação (resumo do plano)
   ↓
Usuário confirma
   ↓
Dialog de pagamento abre (Asaas)
   ↓
Usuário escolhe método (PIX/Boleto/Cartão)
   ↓
Processa pagamento
   ↓
Webhook confirma pagamento
   ↓
Backend atualiza plan_id
   ↓
Frontend atualiza authStore
   ↓
Notificação de sucesso
```

---

## 🎨 Interface do Usuário

### **Dialog de Checkout:**

```
┌──────────────────────────────────────────┐
│ 💳 Finalizar Pagamento                   │
│ Pro - R$ 99,90/mês                    [X]│
├──────────────────────────────────────────┤
│                                          │
│ Escolha a forma de pagamento:            │
│                                          │
│ ┌─────────────┐  ┌─────────────┐       │
│ │     PIX     │  │   BOLETO    │       │
│ │             │  │             │       │
│ │ Aprovação   │  │ Vence em 3  │       │
│ │ instantânea │  │ dias úteis  │       │
│ │             │  │             │       │
│ │ Taxa: 0.99% │  │ R$ 3,49     │       │
│ └─────────────┘  └─────────────┘       │
│                                          │
│ ┌───────────────────────────────────┐   │
│ │     CARTÃO DE CRÉDITO             │   │
│ │                                   │   │
│ │ Aprovação automática              │   │
│ │                                   │   │
│ │ Taxa: 3.99%                       │   │
│ └───────────────────────────────────┘   │
│                                          │
│ ────────────────────────────────────    │
│                                          │
│ Resumo do Pedido:                        │
│ Plano Pro           R$ 99,90            │
│ Taxa processamento  incluída            │
│ ────────────────────────────────────    │
│ Total               R$ 99,90            │
│                                          │
├──────────────────────────────────────────┤
│             [Cancelar] [Gerar QR Code PIX]│
└──────────────────────────────────────────┘
```

### **Tela de PIX (após gerar):**

```
┌──────────────────────────────────────────┐
│ Pague com PIX                            │
│                                          │
│     ┌───────────────────────┐           │
│     │                       │           │
│     │   [QR CODE IMAGE]     │           │
│     │                       │           │
│     └───────────────────────┘           │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ 00020126...codigo...pix           📋│  │
│ └────────────────────────────────────┘  │
│ Abra o app do seu banco e cole o        │
│ código acima                             │
│                                          │
│ ℹ️ Como pagar:                           │
│ 1. Abra o app do seu banco              │
│ 2. Escolha "Pagar com PIX"              │
│ 3. Escaneie o QR Code ou cole o código │
│ 4. Confirme o pagamento                 │
│                                          │
│ Após confirmação, seu plano será        │
│ ativado automaticamente.                 │
│                                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━              │
│ Aguardando confirmação do pagamento...   │
│                                          │
├──────────────────────────────────────────┤
│                              [Fechar]     │
└──────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Pagamento Detalhado

### **1. Pagamento via PIX:**

```
1. Usuário clica "Fazer Upgrade para Pro"
   ↓
2. Dialog de confirmação mostra resumo
   ↓
3. Usuário confirma
   ↓
4. Dialog de pagamento abre
   ↓
5. Usuário seleciona "PIX"
   ↓
6. Clica "Gerar QR Code PIX"
   ↓
7. Frontend: POST /api/payments
   {
     planId: "uuid-pro",
     paymentMethod: "PIX"
   }
   ↓
8. Backend cria cobrança no Asaas
   ↓
9. Frontend recebe QR Code e payload
   ↓
10. Exibe QR Code + botão copiar
   ↓
11. Usuário paga via app do banco
   ↓
12. Asaas detecta pagamento
   ↓
13. Asaas envia Webhook para backend
   ↓
14. Backend atualiza user.plan_id
   ↓
15. Frontend checa status a cada 5s
   ↓
16. Detecta pagamento confirmado
   ↓
17. Chama PUT /api/users/plan
   ↓
18. Atualiza authStore.user
   ↓
19. Mostra notificação de sucesso
   ↓
20. Fecha dialog e atualiza UI
```

### **2. Pagamento via Boleto:**

```
Similar ao PIX, mas:
- Gera PDF do boleto
- Mostra botões: Baixar PDF | Imprimir
- Exibe linha digitável copiável
- Vencimento em 3 dias úteis
- Confirmação pode levar até 3 dias
```

### **3. Pagamento via Cartão:**

```
- Mostra formulário de cartão
- Campos: Número, Nome, Validade, CVV
- Validação client-side
- Envia dados para backend
- Backend processa com Asaas
- Resposta instantânea (aprovado/negado)
- Se aprovado, ativa plano imediatamente
```

---

## 🔧 Estruturas de Dados

### **Payload: Criar Pagamento (Frontend → Backend)**

```typescript
// POST /api/payments
{
  planId: string           // UUID do plano
  paymentMethod: 'PIX' | 'BOLETO' | 'CREDIT_CARD'
  creditCard?: {           // Apenas se método = CREDIT_CARD
    number: string         // "1234 5678 9012 3456"
    holderName: string     // "João Silva"
    expiryDate: string     // "12/2025"
    cvv: string            // "123"
  }
}
```

### **Resposta: PIX**

```typescript
{
  success: true,
  data: {
    payment: {
      id: string             // ID do pagamento Asaas
      status: 'PENDING'
      value: number          // 99.90
      dueDate: string        // "2025-01-10"
      invoiceUrl: string     // Link da fatura
    },
    pix: {
      qrCodeImage: string    // Base64 do QR Code
      payload: string        // Código PIX para copiar/colar
      expiresAt: string      // Quando expira
    }
  }
}
```

### **Resposta: Boleto**

```typescript
{
  success: true,
  data: {
    payment: {
      id: string
      status: 'PENDING'
      value: number
      dueDate: string         // Vencimento
      invoiceUrl: string      // Link da fatura
    },
    boleto: {
      pdfUrl: string          // URL do PDF
      barcode: string         // Linha digitável
      identificationField: string
      bankSlipUrl: string
    }
  }
}
```

### **Resposta: Cartão Aprovado**

```typescript
{
  success: true,
  data: {
    payment: {
      id: string
      status: 'RECEIVED'       // Já pago!
      value: number
      confirmedDate: string
      transactionReceiptUrl: string
    }
  }
}
```

### **Webhook do Asaas (Backend)**

```typescript
// POST /api/webhooks/asaas
{
  event: 'PAYMENT_RECEIVED' | 'PAYMENT_CONFIRMED' | 'PAYMENT_OVERDUE'
  payment: {
    id: string
    customer: string
    value: number
    netValue: number       // Valor líquido (descontando taxa)
    status: string
    description: string
    externalReference: string  // ID do usuário
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD'
    confirmedDate: string
  }
}
```

---

## 🛠️ Backend Requirements

### **Endpoints a Implementar:**

#### **1. Criar Pagamento**
```javascript
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "planId": "uuid-plano",
  "paymentMethod": "PIX"
}

Response:
{
  "success": true,
  "data": {
    "payment": { ... },
    "pix": {
      "qrCodeImage": "data:image/png;base64,...",
      "payload": "00020126...",
      "expiresAt": "2025-01-05T12:00:00Z"
    }
  }
}
```

#### **2. Consultar Status**
```javascript
GET /api/payments/:paymentId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "payment": {
      "id": "pay_...",
      "status": "RECEIVED",  // PENDING | RECEIVED | CONFIRMED | OVERDUE
      "value": 99.90,
      "paidAt": "2025-01-04T10:30:00Z"
    }
  }
}
```

#### **3. Webhook Asaas**
```javascript
POST /api/webhooks/asaas
X-Asaas-Signature: <signature>

Body:
{
  "event": "PAYMENT_RECEIVED",
  "payment": { ... }
}

// Backend deve:
1. Validar signature
2. Buscar user pelo externalReference
3. Atualizar user.plan_id no banco
4. (Opcional) Enviar email de confirmação
5. Retornar 200 OK
```

---

## 🔐 Configuração do Asaas

### **1. Criar Conta:**
```
1. Acesse: https://www.asaas.com
2. Crie conta gratuita
3. Ative conta (envio de documentos)
4. Acesse Dashboard
```

### **2. Obter API Key:**
```
Dashboard → Integrações → API Key
Ambiente: Sandbox (testes) ou Produção

Sandbox: $aact_YTU5YTE0M2M2N2I4MTlkNmMw...
Produção: $aact_PROD_...
```

### **3. Configurar Webhooks:**
```
Dashboard → Integrações → Webhooks
URL: https://seudominio.com/api/webhooks/asaas

Eventos:
☑ PAYMENT_CREATED
☑ PAYMENT_RECEIVED
☑ PAYMENT_CONFIRMED
☑ PAYMENT_OVERDUE
☑ PAYMENT_DELETED

Chave de autenticação: Gerar nova chave
Copiar chave para variável de ambiente
```

### **4. Variáveis de Ambiente (Backend):**
```env
# .env
ASAAS_API_KEY=your-api-key-here
ASAAS_ENVIRONMENT=sandbox  # ou 'production'
ASAAS_WEBHOOK_SECRET=your-webhook-secret
```

---

## 💻 Exemplo de Implementação Backend (Node.js)

### **1. Criar Pagamento:**

```javascript
const axios = require('axios')

const ASAAS_API_URL = process.env.ASAAS_ENVIRONMENT === 'production'
  ? 'https://www.asaas.com/api/v3'
  : 'https://sandbox.asaas.com/api/v3'

async function createPayment(req, res) {
  const { planId, paymentMethod } = req.body
  const userId = req.user.id
  
  try {
    // Buscar plano
    const plan = await Plan.findById(planId)
    
    // Criar cliente no Asaas (se não existe)
    let asaasCustomerId = req.user.asaas_customer_id
    
    if (!asaasCustomerId) {
      const customerResponse = await axios.post(
        `${ASAAS_API_URL}/customers`,
        {
          name: req.user.name,
          email: req.user.email,
          cpfCnpj: req.user.cpf,
          phone: req.user.phone
        },
        {
          headers: {
            'access_token': process.env.ASAAS_API_KEY
          }
        }
      )
      
      asaasCustomerId = customerResponse.data.id
      
      // Salvar no banco
      await User.update(userId, { asaas_customer_id: asaasCustomerId })
    }
    
    // Criar cobrança
    const paymentData = {
      customer: asaasCustomerId,
      billingType: paymentMethod,  // PIX | BOLETO | CREDIT_CARD
      value: plan.price,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 dias
      description: `Assinatura ${plan.name}`,
      externalReference: userId,  // Para identificar no webhook
      postalService: false
    }
    
    const paymentResponse = await axios.post(
      `${ASAAS_API_URL}/payments`,
      paymentData,
      {
        headers: {
          'access_token': process.env.ASAAS_API_KEY
        }
      }
    )
    
    const payment = paymentResponse.data
    
    // Se PIX, buscar QR Code
    let pixData = null
    if (paymentMethod === 'PIX') {
      const pixResponse = await axios.get(
        `${ASAAS_API_URL}/payments/${payment.id}/pixQrCode`,
        {
          headers: {
            'access_token': process.env.ASAAS_API_KEY
          }
        }
      )
      pixData = pixResponse.data
    }
    
    res.json({
      success: true,
      data: {
        payment,
        pix: pixData
      }
    })
    
  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    res.status(400).json({
      success: false,
      message: error.response?.data?.errors?.[0]?.description || 'Erro ao criar pagamento'
    })
  }
}
```

### **2. Webhook Handler:**

```javascript
const crypto = require('crypto')

function validateWebhookSignature(payload, signature) {
  const hash = crypto
    .createHmac('sha256', process.env.ASAAS_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex')
  
  return hash === signature
}

async function handleAsaasWebhook(req, res) {
  const signature = req.headers['x-asaas-signature']
  
  // Validar signature
  if (!validateWebhookSignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' })
  }
  
  const { event, payment } = req.body
  
  try {
    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED':
        // Pagamento confirmado - ativar plano
        const userId = payment.externalReference
        const planId = payment.description.match(/Plano: (.*)/)?.[1]
        
        await User.update(userId, {
          plan_id: planId,
          plan_status: 'active',
          plan_activated_at: new Date()
        })
        
        // Enviar email de confirmação
        await sendEmail(userId, 'payment_confirmed', { payment })
        
        console.log(`✅ Plano ativado para usuário ${userId}`)
        break
        
      case 'PAYMENT_OVERDUE':
        // Pagamento vencido - notificar usuário
        await sendEmail(payment.externalReference, 'payment_overdue', { payment })
        break
        
      default:
        console.log(`Evento não tratado: ${event}`)
    }
    
    res.status(200).json({ received: true })
    
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    res.status(500).json({ error: 'Internal error' })
  }
}
```

---

## 🧪 Testes

### **Ambiente Sandbox (Testes):**

**Cartões de Teste:**
```
Aprovado:
  Número: 5162 3062 3170 0366
  Validade: qualquer (futura)
  CVV: qualquer

Negado:
  Número: 5162 3062 3170 0357
  Validade: qualquer
  CVV: qualquer
```

**PIX de Teste:**
- No sandbox, PIX é aprovado automaticamente após 10 segundos
- Não precisa pagar de verdade

**Boleto de Teste:**
- Gerado normalmente
- Para simular pagamento, acessar Dashboard Asaas → Cobranças → Marcar como Pago

---

## 📊 Monitoramento

### **Dashboard Asaas:**
- Todas transações
- Status em tempo real
- Relatórios financeiros
- Taxa efetiva cobrada
- Repasses programados

### **Logs do Sistema:**
```javascript
console.log('💳 Pagamento criado:', paymentId)
console.log('🔔 Webhook recebido:', event)
console.log('✅ Plano ativado:', userId)
```

---

## ✅ Checklist de Implementação

### **Frontend:**
- [x] API de pagamentos (`payments.js`)
- [x] Rotas de pagamento (`routes.js`)
- [x] Componente de checkout (`PaymentCheckoutDialog.vue`)
- [x] Integração na PlansPage
- [x] Callback de sucesso
- [ ] Tratamento de erros avançado
- [ ] Loading states refinados

### **Backend:**
- [ ] Endpoint POST /payments
- [ ] Endpoint GET /payments/:id
- [ ] Webhook /webhooks/asaas
- [ ] Validação de signature
- [ ] Atualização de user.plan_id
- [ ] Email de confirmação
- [ ] Logs estruturados

### **Configuração:**
- [ ] Criar conta Asaas
- [ ] Obter API Key
- [ ] Configurar webhooks
- [ ] Variáveis de ambiente
- [ ] Testar em sandbox

---

## 🚀 Próximos Passos

1. **Backend:** Implementar endpoints de pagamento
2. **Testes:** Validar fluxo completo em sandbox
3. **Webhooks:** Configurar e testar webhooks
4. **Emails:** Templates de confirmação/cobrança
5. **Produção:** Migrar para ambiente real
6. **Monitoramento:** Dashboard de transações

---

**Status:** ✅ **Frontend Completo - Aguardando Backend**  
**Documentação:** Asaas API Docs: https://docs.asaas.com  
**Suporte:** suporte@asaas.com | (16) 3025-3022  
**Autor:** GitHub Copilot  
**Última Atualização:** Janeiro 2025
