# 🔥 ERRO CRÍTICO: Recursão Infinita em Políticas RLS

## 🚨 **Problema Identificado**

O erro "infinite recursion detected in policy for relation 'users'" está acontecendo em **todas as telas e refreshs** do frontend. Isso indica um problema crítico nas **políticas de Row Level Security (RLS)** do seu backend.

## 🔍 **Onde Está Acontecendo**

O erro ocorre quando:
- Usuário faz login → Chama `GET /auth/me` 
- Aplicação carrega → Verifica token válido
- Qualquer tela → Busca dados do usuário atual

## ⚡ **SOLUÇÃO IMEDIATA NECESSÁRIA**

### **1. Verificar Políticas RLS Problemáticas**

Execute no seu banco de dados PostgreSQL/Supabase:

```sql
-- Ver todas as políticas da tabela users
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';
```

### **2. Procurar Por Estas Políticas Problemáticas**

```sql
-- ❌ POLÍTICAS QUE CAUSAM RECURSÃO
-- Qualquer política que faça SELECT na tabela 'users' dentro da própria política

-- Exemplo de política problemática:
CREATE POLICY "users_policy" ON users
    FOR SELECT USING (
        id = (SELECT id FROM users WHERE email = current_user_email())
        --    ↑ PROBLEMA: Consulta 'users' dentro de política de 'users'
    );
```

### **3. CORREÇÃO IMEDIATA - Desabilitar RLS**

**TEMPORARIAMENTE**, para resolver o problema agora:

```sql
-- Desabilitar RLS na tabela users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

⚠️ **ATENÇÃO**: Isso remove toda a segurança da tabela! Use apenas para testes.

### **4. CORREÇÃO DEFINITIVA - Políticas Corretas**

Depois de desabilitar RLS, recrie as políticas corretamente:

```sql
-- Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ✅ POLÍTICA CORRETA - Usa auth.uid() diretamente
CREATE POLICY "users_can_read_own_profile" ON users
    FOR SELECT USING (
        id = auth.uid()  -- Função que NÃO consulta tabelas
    );

CREATE POLICY "users_can_update_own_profile" ON users  
    FOR UPDATE USING (
        id = auth.uid()
    );

CREATE POLICY "users_can_insert_own_profile" ON users
    FOR INSERT WITH CHECK (
        id = auth.uid()
    );
```

### **5. Se Usar Supabase - Verificar auth.users**

```sql
-- Para Supabase, usar a relação correta com auth.users
CREATE POLICY "users_can_read_own_profile" ON users
    FOR SELECT USING (
        auth.uid() = id
    );
```

## 🔧 **Funções Seguras para Usar**

```sql
-- ✅ SEGURAS (não causam recursão)
auth.uid()                    -- ID do usuário autenticado
auth.jwt()                    -- JWT completo  
auth.email()                  -- Email do usuário
current_setting('...')        -- Configurações de sessão

-- ❌ PERIGOSAS (podem causar recursão)
SELECT ... FROM users         -- Qualquer consulta na própria tabela
SELECT ... FROM public.users  -- Mesma coisa
get_user_by_email(...)       -- Funções que consultam users
```

## 🧪 **Como Testar a Correção**

1. **Desabilite RLS**: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`
2. **Teste o frontend**: Deve parar de dar erro
3. **Recrie políticas corretas**: Use os exemplos acima
4. **Reabilite RLS**: `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`
5. **Teste novamente**: Deve funcionar sem erros

## 🚀 **Logs Melhorados no Frontend**

O frontend agora tem logs melhorados que mostrarão:
- ✅ URL exata que está causando erro
- ✅ Detecção automática de recursão infinita  
- ✅ Notificações específicas para o usuário
- ✅ Limpeza automática de auth em caso de erro

## 📞 **Próximos Passos**

1. **URGENTE**: Execute a correção imediata (desabilitar RLS)
2. **TESTE**: Verifique se o frontend para de dar erro
3. **CORRIJA**: Implemente as políticas corretas
4. **VALIDE**: Teste todas as funcionalidades

**Me informe quando executar estas correções para continuarmos com os testes!** 🚀