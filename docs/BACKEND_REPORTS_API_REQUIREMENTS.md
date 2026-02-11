# 📋 PROMPT PARA BACKEND - APIs de Relatórios Financeiros

## 🎯 CONTEXTO

Implementamos uma **página de relatórios dinâmicos** no frontend que precisa de APIs otimizadas para fornecer dados agregados e processados. O sistema tem **3 níveis de planos** (Gratuito, Pro, Premium) com diferentes limites de features.

---

## 🔌 APIs NECESSÁRIAS

### 1️⃣ **GET /api/reports/summary** ⭐ PRINCIPAL
**Objetivo:** Retornar dados agregados para relatórios financeiros

#### **Request**
```http
GET /api/reports/summary?start_date=2025-01-01&end_date=2025-12-31
Authorization: Bearer {token}
```

#### **Query Parameters**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `start_date` | string (YYYY-MM-DD) | Não | Data inicial do período |
| `end_date` | string (YYYY-MM-DD) | Não | Data final do período |
| `account_id` | integer | Não | Filtrar por conta específica (PREMIUM) |

#### **Response 200 OK**
```json
{
  "success": true,
  "data": {
    "period": {
      "start_date": "2025-01-01",
      "end_date": "2025-12-31"
    },
    "summary": {
      "total_income": 15000.00,
      "total_expense": 8500.00,
      "balance": 6500.00,
      "transaction_count": 124
    },
    "categories": [
      {
        "category_id": 1,
        "category_name": "Alimentação",
        "category_type": "expense",
        "total": 2500.00,
        "count": 45,
        "percentage": 29.41,
        "average_per_transaction": 55.56
      },
      {
        "category_id": 2,
        "category_name": "Transporte",
        "category_type": "expense",
        "total": 1200.00,
        "count": 30,
        "percentage": 14.12,
        "average_per_transaction": 40.00
      },
      {
        "category_id": null,
        "category_name": "Sem Categoria",
        "category_type": "expense",
        "total": 500.00,
        "count": 10,
        "percentage": 5.88,
        "average_per_transaction": 50.00
      }
    ],
    "monthly_data": [
      {
        "month": "2025-01",
        "income": 5000.00,
        "expense": 3000.00,
        "balance": 2000.00,
        "transaction_count": 35
      },
      {
        "month": "2025-02",
        "income": 5200.00,
        "expense": 2800.00,
        "balance": 2400.00,
        "transaction_count": 42
      }
    ]
  }
}
```

#### **Regras de Negócio**
1. **Filtrar por período:** Se `start_date` e `end_date` não forem informados, retornar últimos 12 meses
2. **Ordenação de categorias:** Sempre ordenar por `total` (maior para menor)
3. **Categoria nula:** Transações sem categoria devem aparecer como "Sem Categoria"
4. **Percentual:** Calcular baseado no total de despesas ou receitas (conforme o tipo)
5. **Agregação mensal:** Agrupar por ano-mês (YYYY-MM)
6. **Performance:** Usar agregação no banco de dados (GROUP BY), não processar no código

#### **SQL Sugerido (exemplo)**
```sql
-- Resumo geral
SELECT 
  COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
  COALESCE(SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END), 0) as total_expense,
  COUNT(*) as transaction_count
FROM transactions
WHERE user_id = ? 
  AND date BETWEEN ? AND ?;

-- Por categoria
SELECT 
  c.id as category_id,
  COALESCE(c.name, 'Sem Categoria') as category_name,
  t.type as category_type,
  SUM(ABS(t.amount)) as total,
  COUNT(*) as count,
  AVG(ABS(t.amount)) as average_per_transaction
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = ?
  AND t.date BETWEEN ? AND ?
  AND t.type = 'expense'  -- ou 'income'
GROUP BY c.id, c.name, t.type
ORDER BY total DESC;

-- Por mês
SELECT 
  DATE_FORMAT(date, '%Y-%m') as month,
  COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
  COALESCE(SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END), 0) as expense,
  COUNT(*) as transaction_count
FROM transactions
WHERE user_id = ?
  AND date BETWEEN ? AND ?
GROUP BY DATE_FORMAT(date, '%Y-%m')
ORDER BY month ASC;
```

---

### 2️⃣ **POST /api/reports/export** ⭐ FEATURE PRO
**Objetivo:** Exportar relatórios em diferentes formatos (PDF, Excel, CSV)

#### **Request**
```http
POST /api/reports/export
Authorization: Bearer {token}
Content-Type: application/json
```

#### **Request Body**
```json
{
  "format": "pdf",  // "pdf" | "excel" | "csv"
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "include_transactions": true,
  "include_categories": true,
  "include_monthly": true
}
```

#### **Response 200 OK**
```json
{
  "success": true,
  "data": {
    "file_url": "https://s3.bucket.com/reports/user_123_report_2025-11-13.pdf",
    "file_name": "relatorio_financeiro_2025-01-01_2025-12-31.pdf",
    "expires_at": "2025-11-14T10:00:00Z",
    "size_bytes": 145678
  }
}
```

#### **Regras de Negócio**
1. **Verificar plano:** Apenas PRO e PREMIUM podem exportar
2. **Limite de tamanho:** Máximo 5000 transações por exportação
3. **Formatos suportados:**
   - **PDF:** Usar biblioteca como wkhtmltopdf, Puppeteer ou similar
   - **Excel:** Usar biblioteca como ExcelJS, XLSX
   - **CSV:** Formato padrão com separador de vírgula
4. **Armazenamento:** Upload para S3/Cloud Storage
5. **Expiração:** Link expira em 24 horas
6. **Rate Limit:** Máximo 5 exportações por dia no plano PRO, ilimitado no PREMIUM

---

### 3️⃣ **GET /api/reports/category-details/:category_id** (OPCIONAL)
**Objetivo:** Obter transações detalhadas de uma categoria específica

#### **Request**
```http
GET /api/reports/category-details/5?start_date=2025-01-01&end_date=2025-12-31&limit=50&offset=0
Authorization: Bearer {token}
```

#### **Response 200 OK**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": 5,
      "name": "Alimentação",
      "type": "expense"
    },
    "summary": {
      "total": 2500.00,
      "count": 45,
      "average": 55.56
    },
    "transactions": [
      {
        "id": 123,
        "date": "2025-11-10",
        "description": "Supermercado XYZ",
        "amount": 250.00,
        "type": "expense"
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 50,
      "offset": 0,
      "has_more": false
    }
  }
}
```

---

## 🔐 CONTROLE DE PERMISSÕES POR PLANO

### **Plano GRATUITO (FREE)**
```javascript
✅ GET /api/reports/summary (limitado)
   - Máximo 3 categorias retornadas
   - Últimos 3 meses apenas
   - Sem drill-down de transações
🔒 POST /api/reports/export (bloqueado)
🔒 GET /api/reports/category-details (bloqueado)
```

### **Plano PRO**
```javascript
✅ GET /api/reports/summary (completo)
   - Todas as categorias
   - Período ilimitado
   - Drill-down permitido
✅ POST /api/reports/export (limitado)
   - PDF, Excel, CSV
   - Máximo 5 exportações/dia
   - Marca d'água opcional
✅ GET /api/reports/category-details (completo)
```

### **Plano PREMIUM**
```javascript
✅ Tudo do PRO +
✅ Exportações ilimitadas
✅ Sem marca d'água
✅ Relatórios agendados (futuro)
✅ Analytics com IA (futuro)
```

### **Implementação de Controle**
```javascript
// Middleware de validação de plano
function checkPlanFeature(requiredPlan) {
  return async (req, res, next) => {
    const user = req.user; // Do JWT
    
    const planHierarchy = {
      'FREE': 0,
      'BASIC': 0,
      'PRO': 1,
      'PROFESSIONAL': 1,
      'PREMIUM': 2,
      'ENTERPRISE': 2
    };
    
    const userPlanLevel = planHierarchy[user.plan?.toUpperCase()] || 0;
    const requiredLevel = planHierarchy[requiredPlan.toUpperCase()];
    
    if (userPlanLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PLAN_UPGRADE_REQUIRED',
          message: `Feature requer plano ${requiredPlan} ou superior`,
          current_plan: user.plan,
          required_plan: requiredPlan
        }
      });
    }
    
    next();
  };
}

// Uso nas rotas
app.get('/api/reports/summary', authenticate, async (req, res) => {
  // Aplicar limitações baseado no plano
  const maxCategories = getUserPlanLevel(req.user) === 0 ? 3 : null;
  // ...
});

app.post('/api/reports/export', 
  authenticate, 
  checkPlanFeature('PRO'), 
  async (req, res) => {
    // Lógica de exportação
  }
);
```

---

## 📊 OTIMIZAÇÕES DE PERFORMANCE

### **1. Índices no Banco**
```sql
-- Otimizar queries por usuário + data
CREATE INDEX idx_transactions_user_date 
ON transactions(user_id, date);

-- Otimizar agregações por categoria
CREATE INDEX idx_transactions_category 
ON transactions(user_id, category_id, type);

-- Otimizar agregações mensais
CREATE INDEX idx_transactions_month 
ON transactions(user_id, DATE_FORMAT(date, '%Y-%m'));
```

### **2. Cache**
```javascript
// Cache de 5 minutos para summary
const cacheKey = `reports:summary:${userId}:${startDate}:${endDate}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Processar e cachear
const data = await generateReportSummary(...);
await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 min
```

### **3. Paginação**
```javascript
// Para relatórios grandes
{
  "limit": 100,
  "offset": 0,
  "total": 1524,
  "has_more": true
}
```

---

## 🧪 TESTES NECESSÁRIOS

### **Casos de Teste**
1. ✅ Usuário FREE não consegue exportar
2. ✅ Usuário FREE vê apenas 3 categorias
3. ✅ Usuário PRO vê todas categorias
4. ✅ Usuário PRO pode exportar (com limite diário)
5. ✅ Período vazio retorna últimos 12 meses
6. ✅ Transações sem categoria aparecem como "Sem Categoria"
7. ✅ Valores negativos são convertidos para positivo
8. ✅ Cache funciona corretamente
9. ✅ Rate limit de exportação funciona

---

## 📝 FORMATO DE ERRO PADRÃO

```json
{
  "success": false,
  "error": {
    "code": "PLAN_UPGRADE_REQUIRED",
    "message": "Esta funcionalidade requer plano PRO ou superior",
    "details": {
      "current_plan": "FREE",
      "required_plan": "PRO",
      "feature": "export_reports"
    }
  }
}
```

### **Códigos de Erro**
- `PLAN_UPGRADE_REQUIRED` - Feature bloqueada pelo plano
- `EXPORT_LIMIT_REACHED` - Limite diário de exportações atingido
- `INVALID_DATE_RANGE` - Período inválido
- `NO_DATA_FOUND` - Sem transações no período
- `EXPORT_TOO_LARGE` - Mais de 5000 transações

---

## 🚀 IMPLEMENTAÇÃO SUGERIDA (Node.js/Express)

```javascript
// routes/reports.js
const express = require('express');
const router = express.Router();
const { authenticate, checkPlanFeature } = require('../middleware/auth');
const reportsController = require('../controllers/reportsController');

// Resumo de relatórios (todos os planos)
router.get('/summary', 
  authenticate, 
  reportsController.getSummary
);

// Exportação (PRO+)
router.post('/export', 
  authenticate,
  checkPlanFeature('PRO'),
  reportsController.exportReport
);

// Detalhes de categoria (PRO+)
router.get('/category-details/:categoryId',
  authenticate,
  checkPlanFeature('PRO'),
  reportsController.getCategoryDetails
);

module.exports = router;
```

```javascript
// controllers/reportsController.js
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date, account_id } = req.query;
    
    // Validar datas
    const period = validatePeriod(start_date, end_date);
    
    // Verificar limitações do plano
    const userPlan = req.user.plan?.toUpperCase() || 'FREE';
    const maxCategories = userPlan === 'FREE' ? 3 : null;
    
    // Buscar dados agregados
    const [summary, categories, monthlyData] = await Promise.all([
      getSummaryData(userId, period),
      getCategoriesData(userId, period, maxCategories),
      getMonthlyData(userId, period)
    ]);
    
    res.json({
      success: true,
      data: {
        period,
        summary,
        categories,
        monthly_data: monthlyData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
};
```

---

## ⏱️ PRIORIDADES DE IMPLEMENTAÇÃO

### **FASE 1 - Essencial** (MVP)
1. ✅ `GET /api/reports/summary` - Agregação básica
2. ✅ Controle de permissões por plano
3. ✅ Limitação de 3 categorias para FREE

### **FASE 2 - Importante** (PRO Features)
4. ✅ `POST /api/reports/export` - Exportação PDF/Excel/CSV
5. ✅ Rate limiting de exportação
6. ✅ Cache Redis

### **FASE 3 - Avançado** (PREMIUM)
7. ✅ Analytics avançados
8. ✅ Relatórios agendados
9. ✅ Webhooks de notificação

---

## 📦 BIBLIOTECAS SUGERIDAS

### **Node.js**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",           // PostgreSQL
    "redis": "^4.6.0",         // Cache
    "exceljs": "^4.3.0",       // Excel
    "pdfkit": "^0.13.0",       // PDF
    "csv-stringify": "^6.4.0", // CSV
    "aws-sdk": "^2.1400.0"     // S3 Upload
  }
}
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] API retorna dados agregados corretamente
- [ ] Plano FREE vê apenas 3 categorias
- [ ] Plano PRO vê todas categorias
- [ ] Exportação bloqueada para FREE
- [ ] Exportação funciona para PRO/PREMIUM
- [ ] Rate limit de exportação implementado
- [ ] Cache implementado (5 min)
- [ ] Índices de performance criados
- [ ] Testes unitários criados
- [ ] Documentação Swagger/OpenAPI criada

---

**Precisa de algo mais específico ou tem dúvidas sobre alguma parte?** 🚀
