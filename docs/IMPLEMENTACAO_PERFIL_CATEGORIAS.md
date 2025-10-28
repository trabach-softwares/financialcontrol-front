# 📋 Guia de Implementação - Perfil de Usuário e Categorias

## 🎯 Objetivo

Implementar funcionalidades de edição de perfil do usuário e sistema de categorias para transações.

---

## 1️⃣ BANCO DE DADOS

### Passo 1: Executar Migration Principal

Execute o arquivo SQL no seu PostgreSQL:

```bash
psql -U seu_usuario -d seu_banco < database_migration_categories_users.sql
```

**Ou execute manualmente no pgAdmin/DBeaver:**
- Abra o arquivo `database_migration_categories_users.sql`
- Execute todo o conteúdo

### O que será criado:

✅ **Tabela `categories`**
- 17 categorias pré-cadastradas (7 receitas + 10 despesas)
- Campos: id, name, type, color, icon, description, is_default, is_active

✅ **Campos adicionados em `users`**
- `phone` - Telefone
- `birth_date` - Data de nascimento
- `cpf` - CPF formatado
- `company` - Empresa
- `position` - Cargo
- `bio` - Biografia
- `avatar` - URL do avatar
- `last_login` - Último login

✅ **Campo adicionado em `transactions`**
- `category_id` - Referência para tabela categories (UUID)

✅ **Triggers automáticos**
- Atualização automática de `updated_at`

---

## 2️⃣ BACKEND (API)

### Passo 1: Instalar dependência

```bash
cd financialcontrol-api
npm install multer
```

### Passo 2: Criar pasta de uploads

```bash
mkdir -p uploads/avatars
```

### Passo 3: Arquivos criados

✅ **`src/routes/userProfileRoutes.js`** - Rotas de perfil
✅ **`src/controllers/userProfileController.js`** - Controlador

### Passo 4: Registrar rotas no app principal

No arquivo `src/app.js` ou `src/server.js`, adicione:

```javascript
const userProfileRoutes = require('./routes/userProfileRoutes');

// ... outras rotas

app.use('/api/users', userProfileRoutes);
```

### Passo 5: Servir arquivos estáticos (avatars)

No arquivo `src/app.js` ou `src/server.js`, adicione:

```javascript
const path = require('path');

// Servir arquivos de upload
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

---

## 3️⃣ ROTAS DA API CRIADAS

### Perfil do Usuário

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/users/profile` | Buscar perfil do usuário logado |
| PUT | `/api/users/profile` | Atualizar perfil |
| PUT | `/api/users/profile/password` | Alterar senha |
| POST | `/api/users/profile/avatar` | Upload de avatar |
| DELETE | `/api/users/profile/avatar` | Remover avatar |
| GET | `/api/users/settings` | Buscar configurações |
| PUT | `/api/users/settings` | Atualizar configurações |
| DELETE | `/api/users/account` | Deletar conta |

### Exemplos de Requisições

#### 1. Buscar Perfil
```http
GET /api/users/profile
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "phone": "(11) 98765-4321",
    "birth_date": "1990-01-01",
    "cpf": "123.456.789-00",
    "company": "Minha Empresa",
    "position": "Desenvolvedor",
    "bio": "Sobre mim...",
    "avatar": "/uploads/avatars/avatar.jpg",
    "plan": {
      "id": "uuid",
      "name": "Pro",
      "price": "99.90"
    }
  }
}
```

#### 2. Atualizar Perfil
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva",
  "phone": "(11) 98765-4321",
  "birth_date": "1990-01-15",
  "cpf": "123.456.789-00",
  "company": "Tech Solutions",
  "position": "Desenvolvedor Full Stack",
  "bio": "Desenvolvedor apaixonado por tecnologia"
}
```

#### 3. Alterar Senha
```http
PUT /api/users/profile/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "senha123",
  "newPassword": "novaSenha456"
}
```

#### 4. Upload de Avatar
```http
POST /api/users/profile/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  avatar: [arquivo de imagem]
```

---

## 4️⃣ FRONTEND

### Os imports já estão corretos!

Todos os arquivos Vue já foram corrigidos para usar `@/`:
- ✅ PlansPage.vue
- ✅ SettingsPage.vue
- ✅ ProfilePage.vue
- ✅ ReportsPage.vue
- ✅ ErrorForbidden.vue
- ✅ ErrorNotFound.vue

### ProfilePage.vue - Já está pronto!

O arquivo `ProfilePage.vue` já possui:
- ✅ Formulário completo de edição
- ✅ Upload de avatar
- ✅ Alteração de senha
- ✅ Todos os campos necessários

**Os imports já usam a API centralizada:**
```javascript
import { userService } from '@/services/userService'
```

---

## 5️⃣ CATEGORIAS

### Backend - Criar rotas de categorias (PRÓXIMO PASSO)

Você precisará criar:

**`src/routes/categoryRoutes.js`**
```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// GET /api/categories - Listar todas
router.get('/', authenticateToken, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM categories WHERE is_active = true ORDER BY type, name'
  );
  res.json({ success: true, data: result.rows });
});

// GET /api/categories/income - Apenas receitas
router.get('/income', authenticateToken, async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM categories 
     WHERE is_active = true AND type = 'income' 
     ORDER BY name`
  );
  res.json({ success: true, data: result.rows });
});

// GET /api/categories/expense - Apenas despesas
router.get('/expense', authenticateToken, async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM categories 
     WHERE is_active = true AND type = 'expense' 
     ORDER BY name`
  );
  res.json({ success: true, data: result.rows });
});

module.exports = router;
```

**Registrar no app.js:**
```javascript
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);
```

### Frontend - Usar categorias

No componente de transações, busque as categorias:

```javascript
import { api } from 'boot/axios'

async function loadCategories() {
  const response = await api.get('/api/categories')
  categories.value = response.data.data
}

// Ou filtrado por tipo
async function loadIncomeCategories() {
  const response = await api.get('/api/categories/income')
  incomeCategories.value = response.data.data
}
```

---

## 6️⃣ VERIFICAÇÃO

### Checklist Backend

- [ ] Migration executada no banco
- [ ] Tabela `categories` criada com 17 registros
- [ ] Tabela `users` com novos campos
- [ ] Dependência `multer` instalada
- [ ] Pasta `uploads/avatars` criada
- [ ] Rotas de perfil registradas no app
- [ ] Arquivos estáticos servidos

### Checklist Frontend

- [ ] Servidor reiniciado após ajuste do `quasar.config.js`
- [ ] Imports com `@/` funcionando
- [ ] ProfilePage abrindo sem erros
- [ ] Formulário de edição funcional

### Testar Endpoints

```bash
# 1. Buscar perfil (substitua {token} pelo token real)
curl -H "Authorization: Bearer {token}" http://localhost:3000/api/users/profile

# 2. Atualizar perfil
curl -X PUT \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste Update","phone":"(11) 98765-4321"}' \
  http://localhost:3000/api/users/profile

# 3. Listar categorias
curl -H "Authorization: Bearer {token}" http://localhost:3000/api/categories
```

---

## 7️⃣ PRÓXIMAS MELHORIAS (OPCIONAL)

### Criar tabela de configurações do usuário

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language VARCHAR(10) DEFAULT 'pt-BR',
  currency VARCHAR(3) DEFAULT 'BRL',
  theme VARCHAR(20) DEFAULT 'light',
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  notifications JSONB DEFAULT '{"email":true,"push":false,"sms":false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);
```

### Adicionar validação de CPF no backend

```javascript
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) 
    soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) 
    soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
}
```

---

## 📞 SUPORTE

Se encontrar problemas:

1. **Erro de imports** - Certifique-se de que reiniciou o servidor após alterar `quasar.config.js`
2. **Erro 404 nas rotas** - Verifique se registrou as rotas no `app.js`
3. **Erro de upload** - Verifique se a pasta `uploads/avatars` existe
4. **Erro de permissão** - Verifique permissões da pasta de uploads

---

**Documentação criada em:** 2025-10-28  
**Versão:** 1.0.0
