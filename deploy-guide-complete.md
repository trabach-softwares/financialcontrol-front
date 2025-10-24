# 🚀 Guia Completo de Deploy - Frontend e Backend

## 📊 Arquitetura Recomendada

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │   DATABASE      │
│   (Quasar Vue)  │────│   (Node.js API) │────│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│   Vercel        │    │    Render       │    │   Render DB     │
│   ou Netlify    │    │                 │    │   ou Railway    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 FRONTEND (Quasar Vue) - Deploy Recomendado

### Opção 1: Vercel (Recomendado) ⭐
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar variáveis de ambiente no dashboard
VITE_API_BASE_URL=https://seu-backend.onrender.com/api
```

### Opção 2: Netlify
```bash
# 1. Build local
npm run build

# 2. Upload da pasta dist/spa no Netlify
# 3. Configurar redirects para SPA
```

### ❌ Por que não Render para Frontend?
- Render é melhor para backends/APIs
- Vercel/Netlify são otimizados para SPAs
- CDN global automático
- Deploy mais rápido e confiável

## 🔧 BACKEND (Node.js API) - Render

### 1. Preparar API para Render
```javascript
// server.js
const express = require('express')
const cors = require('cors')
const app = express()

// CORS para o frontend
app.use(cors({
  origin: [
    'http://localhost:9000',
    'https://seu-frontend.vercel.app'
  ]
}))

// Usar porta do Render
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`)
})
```

### 2. Configurar no Render
- **Service Type**: Web Service
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node.js 18.x

### 3. Variáveis de Ambiente (Render)
```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...
JWT_SECRET=seu-jwt-secret
CORS_ORIGIN=https://seu-frontend.vercel.app
```

## 🗄️ DATABASE - Render PostgreSQL

### 1. Criar Database no Render
- New → PostgreSQL
- Copiar `DATABASE_URL`
- Adicionar nas variáveis da API

## 📝 Correção do Erro Atual

### Problema
Você está tentando deployar o FRONTEND no Render, mas:
1. Render é melhor para backends
2. Node.js 25.0.0 tem incompatibilidade com Quasar/Vite

### Solução Imediata
Se quiser continuar no Render para o frontend:

1. **Forçar Node.js 18.x** (já fiz isso no package.json)
2. **Atualizar dependências**:
```bash
npm update @quasar/app-vite
npm update vite
```

3. **Build command no Render**:
```bash
npm ci && npm run build
```

4. **Start command no Render**:
```bash
npx http-server dist/spa -p $PORT
```

5. **Adicionar http-server**:
```bash
npm install --save http-server
```

## ✅ Plano de Ação Recomendado

### Etapa 1: Deploy da API (Backend)
1. Criar novo Web Service no Render
2. Conectar repositório da API (não do frontend)
3. Configurar variáveis de ambiente
4. Testar endpoints

### Etapa 2: Deploy do Frontend
1. Parar deploy atual no Render
2. Usar Vercel ou Netlify
3. Configurar `VITE_API_BASE_URL` para apontar para API do Render
4. Testar integração

### Etapa 3: Banco de Dados
1. Criar PostgreSQL Database no Render
2. Conectar com a API
3. Executar migrations se necessário

## 🔍 Comandos para Debug

### Testar build local:
```bash
# No frontend
npm run build
npx http-server dist/spa -p 8080

# Verificar se funciona em http://localhost:8080
```

### Testar API:
```bash
curl https://sua-api.onrender.com/health
```

## 📂 Estrutura de Repositórios

Ideal ter repositórios separados:
```
financialcontrol-frontend/ (Vercel)
financialcontrol-backend/  (Render)
```

Ou monorepo:
```
financialcontrol/
├── frontend/     (Deploy no Vercel)
├── backend/      (Deploy no Render)
└── shared/
```