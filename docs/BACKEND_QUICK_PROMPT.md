# 🎯 RESUMO EXECUTIVO - APIs para Relatórios Financeiros

## ⚡ O QUE PRECISO (TL;DR)

Implementamos uma **página de relatórios no frontend** que precisa de **1 API principal** e **1 API de exportação** com controle de permissões por plano.

---

## 📌 API PRINCIPAL NECESSÁRIA

### **GET /api/reports/summary**

**O que faz:** Retorna dados agregados de transações para relatórios

**Query Params:**
- `start_date` (opcional): Data inicial YYYY-MM-DD
- `end_date` (opcional): Data final YYYY-MM-DD

**Response esperado:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_income": 15000.00,
      "total_expense": 8500.00,
      "balance": 6500.00,
      "transaction_count": 124
    },
    "categories": [
      {
        "category_name": "Alimentação",
        "category_type": "expense",
        "total": 2500.00,
        "count": 45
      }
    ],
    "monthly_data": [
      {
        "month": "2025-01",
        "income": 5000.00,
        "expense": 3000.00,
        "balance": 2000.00
      }
    ]
  }
}
```

**Regras importantes:**
1. ✅ **Plano GRATUITO**: Retornar apenas **3 categorias** (top 3 por valor)
2. ✅ **Plano PRO/PREMIUM**: Retornar **todas as categorias**
3. ✅ Ordenar categorias por `total` (maior → menor)
4. ✅ Usar **agregação no SQL** (performance)
5. ✅ Transações sem categoria = "Sem Categoria"

---

## 📤 API DE EXPORTAÇÃO (Feature PRO)

### **POST /api/reports/export**

**O que faz:** Gera arquivo PDF/Excel/CSV do relatório

**Request Body:**
```json
{
  "format": "pdf",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file_url": "https://...",
    "file_name": "relatorio_2025.pdf",
    "expires_at": "2025-11-14T10:00:00Z"
  }
}
```

**Regras:**
1. 🔒 **Plano GRATUITO**: Bloqueado (retornar 403)
2. ✅ **Plano PRO**: Permitido (máx 5 exportações/dia)
3. ✅ **Plano PREMIUM**: Ilimitado
4. ✅ Formatos: PDF, Excel, CSV
5. ✅ Link expira em 24h

---

## 🔐 CONTROLE DE PERMISSÕES

### **Verificar plano do usuário:**
```javascript
// Plano vem do JWT ou session
const user = req.user;

// Hierarquia
const plans = { 'FREE': 0, 'PRO': 1, 'PREMIUM': 2 };

// Exemplo: Limitar categorias
if (plans[user.plan] === 0) {
  // Plano FREE: apenas 3 categorias
  categories = categories.slice(0, 3);
}
```

### **Bloquear exportação:**
```javascript
// Na rota de exportação
if (user.plan === 'FREE') {
  return res.status(403).json({
    success: false,
    error: {
      code: 'PLAN_UPGRADE_REQUIRED',
      message: 'Feature requer plano PRO'
    }
  });
}
```

---

## 📊 SQL SUGERIDO (Exemplo)

### **Resumo:**
```sql
SELECT 
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END) as total_expense,
  COUNT(*) as transaction_count
FROM transactions
WHERE user_id = ? AND date BETWEEN ? AND ?;
```

### **Por Categoria:**
```sql
SELECT 
  COALESCE(c.name, 'Sem Categoria') as category_name,
  t.type as category_type,
  SUM(ABS(t.amount)) as total,
  COUNT(*) as count
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = ? AND t.date BETWEEN ? AND ?
GROUP BY c.name, t.type
ORDER BY total DESC
LIMIT ?;  -- 3 para FREE, NULL para PRO/PREMIUM
```

### **Por Mês:**
```sql
SELECT 
  DATE_FORMAT(date, '%Y-%m') as month,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
  SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END) as expense
FROM transactions
WHERE user_id = ? AND date BETWEEN ? AND ?
GROUP BY DATE_FORMAT(date, '%Y-%m')
ORDER BY month ASC;
```

---

## ⚡ OTIMIZAÇÕES IMPORTANTES

### **1. Índices no banco:**
```sql
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX idx_transactions_category ON transactions(user_id, category_id);
```

### **2. Cache (opcional mas recomendado):**
```javascript
// Cache de 5 minutos
const cacheKey = `reports:${userId}:${startDate}:${endDate}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
// ... processar e cachear por 300 segundos
```

---

## 🎯 PRIORIDADES

### ✅ **FASE 1 - FAZER AGORA** (Essencial)
1. `GET /api/reports/summary` com agregações
2. Controle de 3 categorias para plano FREE
3. Retornar erro 403 se FREE tentar exportar

### ⏳ **FASE 2 - DEPOIS** (Importante)
4. `POST /api/reports/export` (PDF/Excel/CSV)
5. Rate limit de 5 exportações/dia para PRO
6. Upload para S3 e link temporário

---

## 📝 CHECKLIST RÁPIDO

- [ ] API summary retorna dados agregados
- [ ] Plano FREE vê apenas 3 categorias
- [ ] Plano PRO vê todas categorias
- [ ] Exportação bloqueada para FREE (403)
- [ ] Exportação funciona para PRO
- [ ] Índices criados no banco
- [ ] (Opcional) Cache implementado

---

## 💬 DÚVIDAS FREQUENTES

**P: Como saber o plano do usuário?**  
R: Pegar do JWT token ou da sessão: `req.user.plan`

**P: O que retornar se não houver dados?**  
R: Arrays vazios com totais zerados

**P: Precisa de paginação?**  
R: Não para summary. Só se quiser drill-down de transações no futuro

**P: Como gerar PDF/Excel?**  
R: Use bibliotecas: `pdfkit`, `exceljs`, `csv-stringify`

---

## 📄 DOCUMENTAÇÃO COMPLETA

Para detalhes técnicos completos, consulte:
`docs/BACKEND_REPORTS_API_REQUIREMENTS.md`

---

## 🚀 PRONTO PARA IMPLEMENTAR!

Com essas 2 APIs, o frontend de relatórios estará **100% funcional**.

**Tempo estimado:** 4-6 horas de desenvolvimento

**Dificuldade:** Média (agregações SQL + controle de planos)

---

**Alguma dúvida? Só me chamar! 🎯**
