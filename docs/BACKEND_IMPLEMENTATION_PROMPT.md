# 🚀 Prompt para Implementação Backend - Integração Asaas (PIX/Boleto/Cartão)

## 📋 Contexto

Estou desenvolvendo um **sistema de controle financeiro SaaS** com planos de assinatura. O **frontend já está 100% implementado** e aguardando a API backend para processar pagamentos via **Asaas** (gateway brasileiro com PIX, Boleto e Cartão).

---

## 🎯 O que preciso que você implemente:

### **Gateway de Pagamento: Asaas**
- **Site:** https://www.asaas.com
- **Docs:** https://docs.asaas.com
- **Por quê:** Taxas mais baixas (PIX 0.99%, Boleto R$ 3.49, Cartão 3.99%)
- **Métodos:** PIX, Boleto Bancário, Cartão de Crédito

---

## 📡 Endpoints que o Frontend está Chamando

### **1. Criar Pagamento**
```http
POST /api/payments
Authorization: Bearer <jwt-token>
Content-Type: application/json

Body:
{
  "planId": "uuid-do-plano",
  "paymentMethod": "PIX"  // ou "BOLETO" ou "CREDIT_CARD"
}

// Se método = CREDIT_CARD:
{
  "planId": "uuid-do-plano",
  "paymentMethod": "CREDIT_CARD",
  "creditCard": {
    "number": "1234 5678 9012 3456",
    "holderName": "João Silva",
    "expiryDate": "12/2025",
    "cvv": "123"
  }
}
```

**Resposta Esperada (PIX):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "pay_abc123",
      "status": "PENDING",
      "value": 99.90,
      "dueDate": "2025-01-10T23:59:59Z",
      "invoiceUrl": "https://www.asaas.com/i/abc123"
    },
    "pix": {
      "qrCodeImage": "data:image/png;base64,iVBORw0KG...",
      "payload": "00020126580014br.gov.bcb.pix...",
      "expiresAt": "2025-01-05T12:00:00Z"
    }
  }
}
```

**Resposta Esperada (Boleto):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "pay_abc123",
      "status": "PENDING",
      "value": 99.90,
      "dueDate": "2025-01-10T23:59:59Z"
    },
    "boleto": {
      "pdfUrl": "https://www.asaas.com/b/pdf/abc123",
      "barcode": "34191.79001 01043.510047 91020.150008 1 84430000002000",
      "bankSlipUrl": "https://www.asaas.com/b/abc123"
    }
  }
}
```

**Resposta Esperada (Cartão Aprovado):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "pay_abc123",
      "status": "RECEIVED",  // Já confirmado!
      "value": 99.90,
      "confirmedDate": "2025-01-04T10:30:00Z",
      "transactionReceiptUrl": "https://www.asaas.com/r/abc123"
    }
  }
}
```

---

### **2. Consultar Status do Pagamento**
```http
GET /api/payments/:paymentId
Authorization: Bearer <jwt-token>

Resposta:
{
  "success": true,
  "data": {
    "payment": {
      "id": "pay_abc123",
      "status": "RECEIVED",  // PENDING | RECEIVED | CONFIRMED | OVERDUE
      "value": 99.90,
      "paidAt": "2025-01-04T10:30:00Z",
      "confirmedDate": "2025-01-04T10:30:00Z"
    }
  }
}
```

---

### **3. Obter QR Code PIX**
```http
GET /api/payments/:paymentId/pix
Authorization: Bearer <jwt-token>

Resposta:
{
  "success": true,
  "data": {
    "qrCodeImage": "data:image/png;base64,iVBORw0KG...",
    "payload": "00020126580014br.gov.bcb.pix...",
    "expiresAt": "2025-01-05T12:00:00Z"
  }
}
```

---

### **4. Listar Pagamentos do Usuário**
```http
GET /api/payments
Authorization: Bearer <jwt-token>

Query params (opcionais):
?status=PENDING
?limit=20
?offset=0

Resposta:
{
  "success": true,
  "data": [
    {
      "id": "pay_abc123",
      "planName": "Pro",
      "value": 99.90,
      "status": "RECEIVED",
      "paymentMethod": "PIX",
      "createdAt": "2025-01-04T09:00:00Z",
      "paidAt": "2025-01-04T10:30:00Z"
    }
  ]
}
```

---

### **5. Cancelar Pagamento Pendente**
```http
DELETE /api/payments/:paymentId
Authorization: Bearer <jwt-token>

Resposta:
{
  "success": true,
  "message": "Pagamento cancelado com sucesso"
}
```

---

### **6. Webhook do Asaas (Receber Notificações)**
```http
POST /api/webhooks/asaas
X-Asaas-Signature: <signature-para-validar>
Content-Type: application/json

Body enviado pelo Asaas:
{
  "event": "PAYMENT_RECEIVED",  // ou PAYMENT_CONFIRMED, PAYMENT_OVERDUE
  "payment": {
    "id": "pay_abc123",
    "customer": "cus_xyz789",
    "value": 99.90,
    "netValue": 98.91,  // Descontando taxa Asaas
    "status": "RECEIVED",
    "billingType": "PIX",
    "confirmedDate": "2025-01-04T10:30:00.000Z",
    "externalReference": "user-uuid-here"  // ID do usuário
  }
}

Resposta esperada:
{
  "received": true
}
```

**Ações ao receber webhook:**
1. ✅ Validar signature do Asaas
2. ✅ Buscar usuário pelo `externalReference`
3. ✅ Atualizar `users.plan_id` no banco de dados
4. ✅ Atualizar status do pagamento na tabela `payments`
5. ✅ (Opcional) Enviar email de confirmação
6. ✅ Retornar 200 OK

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `users` (já existe)**
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS asaas_customer_id VARCHAR(255);
-- ID do cliente no Asaas (criado uma vez)
```

### **Tabela: `payments` (criar nova)**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  
  -- Asaas
  asaas_payment_id VARCHAR(255) NOT NULL UNIQUE,
  asaas_customer_id VARCHAR(255) NOT NULL,
  
  -- Dados do pagamento
  value DECIMAL(10, 2) NOT NULL,
  net_value DECIMAL(10, 2),  -- Valor líquido após taxas
  payment_method VARCHAR(50) NOT NULL,  -- PIX, BOLETO, CREDIT_CARD
  status VARCHAR(50) NOT NULL,  -- PENDING, RECEIVED, CONFIRMED, OVERDUE, CANCELLED
  
  -- Datas
  due_date TIMESTAMP,
  paid_at TIMESTAMP,
  confirmed_at TIMESTAMP,
  
  -- URLs
  invoice_url TEXT,
  pix_payload TEXT,
  pix_qr_code_image TEXT,  -- Base64 da imagem
  boleto_barcode TEXT,
  boleto_pdf_url TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_asaas_payment_id (asaas_payment_id),
  INDEX idx_status (status)
);
```

---

## 🔧 Fluxo de Implementação Backend

### **1. Configurar Asaas**

**Variáveis de Ambiente:**
```env
ASAAS_API_KEY=your-api-key-here
ASAAS_ENVIRONMENT=sandbox  # ou 'production'
ASAAS_WEBHOOK_SECRET=your-webhook-secret
```

**Obter credenciais:**
1. Criar conta em https://www.asaas.com
2. Dashboard → Integrações → API Key
3. Copiar API Key de **Sandbox** para testes
4. Dashboard → Webhooks → Configurar URL do webhook
5. Gerar e copiar chave do webhook

**URLs da API:**
- Sandbox: `https://sandbox.asaas.com/api/v3`
- Produção: `https://www.asaas.com/api/v3`

---

### **2. Criar Cliente no Asaas (primeira vez)**

Quando usuário fizer o primeiro pagamento, criar cliente no Asaas:

```javascript
// Exemplo em Node.js
const axios = require('axios')

const ASAAS_API_URL = process.env.ASAAS_ENVIRONMENT === 'production'
  ? 'https://www.asaas.com/api/v3'
  : 'https://sandbox.asaas.com/api/v3'

async function getOrCreateAsaasCustomer(user) {
  // Verificar se já existe
  if (user.asaas_customer_id) {
    return user.asaas_customer_id
  }
  
  // Criar novo cliente
  const response = await axios.post(
    `${ASAAS_API_URL}/customers`,
    {
      name: user.name,
      email: user.email,
      cpfCnpj: user.cpf,  // Remover pontos/traços
      phone: user.phone,
      mobilePhone: user.phone,
      postalCode: user.postal_code,
      address: user.address,
      addressNumber: user.address_number,
      complement: user.complement,
      province: user.province,  // Bairro
      notificationDisabled: false
    },
    {
      headers: {
        'access_token': process.env.ASAAS_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  )
  
  const customerId = response.data.id
  
  // Salvar no banco
  await db.query(
    'UPDATE users SET asaas_customer_id = $1 WHERE id = $2',
    [customerId, user.id]
  )
  
  return customerId
}
```

---

### **3. Criar Cobrança no Asaas**

```javascript
async function createPayment(req, res) {
  const { planId, paymentMethod, creditCard } = req.body
  const userId = req.user.id  // Do JWT token
  
  try {
    // 1. Buscar plano
    const plan = await db.query(
      'SELECT * FROM plans WHERE id = $1 AND is_active = true',
      [planId]
    )
    
    if (!plan.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Plano não encontrado'
      })
    }
    
    const planData = plan.rows[0]
    
    // 2. Buscar usuário
    const user = await db.query('SELECT * FROM users WHERE id = $1', [userId])
    const userData = user.rows[0]
    
    // 3. Obter/Criar cliente Asaas
    const customerId = await getOrCreateAsaasCustomer(userData)
    
    // 4. Criar cobrança no Asaas
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 3)  // +3 dias
    
    const paymentPayload = {
      customer: customerId,
      billingType: paymentMethod,  // PIX | BOLETO | CREDIT_CARD
      value: planData.price,
      dueDate: dueDate.toISOString().split('T')[0],  // YYYY-MM-DD
      description: `Assinatura ${planData.name}`,
      externalReference: userId,  // IMPORTANTE: Para identificar no webhook
      postalService: false
    }
    
    // Se cartão de crédito, adicionar dados
    if (paymentMethod === 'CREDIT_CARD' && creditCard) {
      paymentPayload.creditCard = {
        holderName: creditCard.holderName,
        number: creditCard.number.replace(/\s/g, ''),
        expiryMonth: creditCard.expiryDate.split('/')[0],
        expiryYear: creditCard.expiryDate.split('/')[1],
        ccv: creditCard.cvv
      }
      paymentPayload.creditCardHolderInfo = {
        name: userData.name,
        email: userData.email,
        cpfCnpj: userData.cpf,
        postalCode: userData.postal_code,
        addressNumber: userData.address_number,
        phone: userData.phone
      }
    }
    
    const asaasResponse = await axios.post(
      `${ASAAS_API_URL}/payments`,
      paymentPayload,
      {
        headers: {
          'access_token': process.env.ASAAS_API_KEY
        }
      }
    )
    
    const payment = asaasResponse.data
    
    // 5. Salvar no banco local
    await db.query(`
      INSERT INTO payments (
        user_id, plan_id, asaas_payment_id, asaas_customer_id,
        value, payment_method, status, due_date, invoice_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      userId,
      planId,
      payment.id,
      customerId,
      payment.value,
      paymentMethod,
      payment.status,
      payment.dueDate,
      payment.invoiceUrl
    ])
    
    // 6. Se PIX, buscar QR Code
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
      
      pixData = {
        qrCodeImage: `data:image/png;base64,${pixResponse.data.encodedImage}`,
        payload: pixResponse.data.payload,
        expiresAt: pixResponse.data.expirationDate
      }
      
      // Salvar no banco
      await db.query(`
        UPDATE payments 
        SET pix_payload = $1, pix_qr_code_image = $2
        WHERE asaas_payment_id = $3
      `, [pixData.payload, pixData.qrCodeImage, payment.id])
    }
    
    // 7. Se Boleto, extrair dados
    let boletoData = null
    if (paymentMethod === 'BOLETO') {
      boletoData = {
        pdfUrl: payment.bankSlipUrl,
        barcode: payment.identificationField,
        bankSlipUrl: payment.bankSlipUrl
      }
      
      await db.query(`
        UPDATE payments 
        SET boleto_barcode = $1, boleto_pdf_url = $2
        WHERE asaas_payment_id = $3
      `, [boletoData.barcode, boletoData.pdfUrl, payment.id])
    }
    
    // 8. Retornar resposta
    res.json({
      success: true,
      data: {
        payment: {
          id: payment.id,
          status: payment.status,
          value: payment.value,
          dueDate: payment.dueDate,
          invoiceUrl: payment.invoiceUrl
        },
        ...(pixData && { pix: pixData }),
        ...(boletoData && { boleto: boletoData })
      }
    })
    
  } catch (error) {
    console.error('Erro ao criar pagamento:', error.response?.data || error)
    res.status(400).json({
      success: false,
      message: error.response?.data?.errors?.[0]?.description || 'Erro ao criar pagamento'
    })
  }
}
```

---

### **4. Webhook Handler**

```javascript
const crypto = require('crypto')

function validateAsaasSignature(payload, signature) {
  const hash = crypto
    .createHmac('sha256', process.env.ASAAS_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex')
  
  return hash === signature
}

async function handleAsaasWebhook(req, res) {
  const signature = req.headers['asaas-access-token'] || req.headers['x-asaas-signature']
  
  // 1. Validar signature
  if (!validateAsaasSignature(req.body, signature)) {
    console.error('❌ Webhook signature inválida')
    return res.status(401).json({ error: 'Invalid signature' })
  }
  
  const { event, payment } = req.body
  
  console.log(`🔔 Webhook recebido: ${event}`, payment.id)
  
  try {
    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED':
        // Pagamento confirmado!
        const userId = payment.externalReference
        
        // Atualizar tabela payments
        await db.query(`
          UPDATE payments 
          SET 
            status = $1,
            net_value = $2,
            paid_at = $3,
            confirmed_at = $4,
            updated_at = NOW()
          WHERE asaas_payment_id = $5
        `, [
          payment.status,
          payment.netValue,
          payment.paymentDate,
          payment.confirmedDate,
          payment.id
        ])
        
        // Buscar plan_id do pagamento
        const paymentData = await db.query(
          'SELECT plan_id FROM payments WHERE asaas_payment_id = $1',
          [payment.id]
        )
        
        if (paymentData.rows.length) {
          const planId = paymentData.rows[0].plan_id
          
          // Atualizar plano do usuário
          await db.query(`
            UPDATE users 
            SET 
              plan_id = $1,
              plan_status = 'active',
              plan_activated_at = NOW(),
              updated_at = NOW()
            WHERE id = $2
          `, [planId, userId])
          
          console.log(`✅ Plano ativado para usuário ${userId}`)
          
          // Enviar email de confirmação (opcional)
          // await sendEmail(userId, 'payment_confirmed', { payment })
        }
        break
        
      case 'PAYMENT_OVERDUE':
        // Pagamento vencido
        await db.query(
          'UPDATE payments SET status = $1, updated_at = NOW() WHERE asaas_payment_id = $2',
          ['OVERDUE', payment.id]
        )
        
        // Notificar usuário (opcional)
        // await sendEmail(payment.externalReference, 'payment_overdue', { payment })
        break
        
      case 'PAYMENT_DELETED':
        // Pagamento cancelado
        await db.query(
          'UPDATE payments SET status = $1, updated_at = NOW() WHERE asaas_payment_id = $2',
          ['CANCELLED', payment.id]
        )
        break
        
      default:
        console.log(`ℹ️ Evento não tratado: ${event}`)
    }
    
    res.status(200).json({ received: true })
    
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error)
    res.status(500).json({ error: 'Internal error' })
  }
}
```

---

### **5. Outros Endpoints (Simples)**

```javascript
// GET /api/payments/:paymentId
async function getPaymentStatus(req, res) {
  const { paymentId } = req.params
  const userId = req.user.id
  
  const result = await db.query(
    'SELECT * FROM payments WHERE asaas_payment_id = $1 AND user_id = $2',
    [paymentId, userId]
  )
  
  if (!result.rows.length) {
    return res.status(404).json({ success: false, message: 'Pagamento não encontrado' })
  }
  
  res.json({ success: true, data: { payment: result.rows[0] } })
}

// GET /api/payments/:paymentId/pix
async function getPixQrCode(req, res) {
  const { paymentId } = req.params
  
  const result = await db.query(
    'SELECT pix_qr_code_image, pix_payload FROM payments WHERE asaas_payment_id = $1',
    [paymentId]
  )
  
  if (!result.rows.length) {
    return res.status(404).json({ success: false, message: 'Pagamento não encontrado' })
  }
  
  res.json({
    success: true,
    data: {
      qrCodeImage: result.rows[0].pix_qr_code_image,
      payload: result.rows[0].pix_payload
    }
  })
}

// GET /api/payments
async function listPayments(req, res) {
  const userId = req.user.id
  const { status, limit = 20, offset = 0 } = req.query
  
  let query = 'SELECT p.*, pl.name as plan_name FROM payments p JOIN plans pl ON p.plan_id = pl.id WHERE p.user_id = $1'
  const params = [userId]
  
  if (status) {
    query += ' AND p.status = $2'
    params.push(status)
  }
  
  query += ' ORDER BY p.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
  params.push(limit, offset)
  
  const result = await db.query(query, params)
  
  res.json({ success: true, data: result.rows })
}

// DELETE /api/payments/:paymentId
async function cancelPayment(req, res) {
  const { paymentId } = req.params
  
  try {
    // Cancelar no Asaas
    await axios.delete(
      `${ASAAS_API_URL}/payments/${paymentId}`,
      {
        headers: {
          'access_token': process.env.ASAAS_API_KEY
        }
      }
    )
    
    // Atualizar no banco
    await db.query(
      'UPDATE payments SET status = $1, updated_at = NOW() WHERE asaas_payment_id = $2',
      ['CANCELLED', paymentId]
    )
    
    res.json({ success: true, message: 'Pagamento cancelado com sucesso' })
    
  } catch (error) {
    res.status(400).json({ success: false, message: 'Erro ao cancelar pagamento' })
  }
}
```

---

## 🧪 Testes no Sandbox

### **Cartões de Teste:**
```
✅ Aprovado:
Número: 5162306260253648
Validade: qualquer data futura
CVV: qualquer (3 dígitos)

❌ Recusado:
Número: 5162306260253621
Validade: qualquer
CVV: qualquer
```

### **PIX Sandbox:**
- PIX é aprovado automaticamente após 10 segundos
- Não precisa fazer pagamento real

### **Boleto Sandbox:**
- Gera PDF normalmente
- Para simular pagamento: Dashboard Asaas → Cobranças → Marcar como Pago

---

## 📦 Dependências Node.js

```bash
npm install axios  # Para chamar API Asaas
```

---

## 🔒 Segurança

1. ✅ **Validar JWT** em todos endpoints
2. ✅ **Validar signature** do webhook
3. ✅ **Validar se usuário** pode acessar pagamento
4. ✅ **Sanitizar inputs** (cartão, valores)
5. ✅ **Logs estruturados** de todas transações
6. ✅ **Rate limiting** nos endpoints de pagamento

---

## ✅ Checklist de Implementação

- [ ] Criar tabela `payments` no banco
- [ ] Adicionar coluna `asaas_customer_id` na tabela `users`
- [ ] Configurar variáveis de ambiente
- [ ] Implementar `POST /api/payments`
- [ ] Implementar `GET /api/payments/:id`
- [ ] Implementar `GET /api/payments/:id/pix`
- [ ] Implementar `GET /api/payments`
- [ ] Implementar `DELETE /api/payments/:id`
- [ ] Implementar `POST /api/webhooks/asaas`
- [ ] Configurar webhook no Dashboard Asaas
- [ ] Testar com cartão de teste
- [ ] Testar PIX no sandbox
- [ ] Testar Boleto no sandbox
- [ ] Validar webhook funcionando
- [ ] (Opcional) Implementar emails de notificação

---

## 📚 Recursos

- **Docs Asaas:** https://docs.asaas.com
- **Dashboard:** https://www.asaas.com (sandbox: https://sandbox.asaas.com)
- **Suporte:** suporte@asaas.com | (16) 3025-3022
- **Status:** https://status.asaas.com

---

## 🎯 Resultado Esperado

Após implementar tudo, o fluxo deve funcionar assim:

1. ✅ Frontend chama `POST /api/payments` com `planId` e `paymentMethod: "PIX"`
2. ✅ Backend cria cobrança no Asaas e retorna QR Code
3. ✅ Frontend exibe QR Code para usuário
4. ✅ Usuário paga via app do banco
5. ✅ Asaas envia webhook `PAYMENT_RECEIVED`
6. ✅ Backend atualiza `users.plan_id` no banco
7. ✅ Frontend detecta sucesso e exibe notificação
8. ✅ Usuário tem acesso ao novo plano! 🎉

---

**Prioridade:** ALTA  
**Estimativa:** 4-6 horas de desenvolvimento  
**Ambiente:** Começar com Sandbox, migrar para Produção depois

Qualquer dúvida, me avise! 🚀
