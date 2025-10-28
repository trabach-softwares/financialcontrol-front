# 🔧 Como Corrigir "Infinite Recursion" no Supabase

O erro **"infinite recursion detected in policy"** acontece quando as políticas RLS criam um loop infinito!

---

## 🎯 SOLUÇÃO RÁPIDA (2 minutos)

### 1️⃣ **Abra o Supabase Dashboard**
```
https://app.supabase.com
```

### 2️⃣ **Vá para SQL Editor**
```
Dashboard → SQL Editor (ícone de código na barra lateral)
```

### 3️⃣ **Copie e Cole o Script**

Abra o arquivo: **`SUPABASE_FIX_ALL_RLS.sql`**

Copie **TODO** o conteúdo e cole no SQL Editor do Supabase.

### 4️⃣ **Execute o Script**

Clique em **"Run"** (ou pressione `Ctrl+Enter`)

### 5️⃣ **Verifique se Funcionou**

Se aparecer "Success. No rows returned", está **correto**! ✅

---

## 🔍 O QUE CAUSA O ERRO?

### ❌ **Política COM Recursão (ERRADA)**
```sql
-- PROBLEMA: Consulta a própria tabela users dentro da política!
CREATE POLICY "bad_policy" ON users
  FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'user'
    -- ↑ ERRO: Isso cria um loop infinito!
  );
```

### ✅ **Política SEM Recursão (CORRETA)**
```sql
-- CORRETO: Usa apenas auth.uid() diretamente
CREATE POLICY "good_policy" ON users
  FOR SELECT
  USING (auth.uid() = id);
  -- ↑ CORRETO: Sem subquery na mesma tabela
```

---

## 🛠️ POLÍTICAS CORRIGIDAS

### **TABELA: users**
```sql
-- ✅ Ver próprio perfil
CREATE POLICY "users_select_policy" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- ✅ Atualizar próprio perfil
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### **TABELA: transactions**
```sql
-- ✅ Ver próprias transações
CREATE POLICY "transactions_select_policy" ON transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- ✅ Criar transação
CREATE POLICY "transactions_insert_policy" ON transactions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

### **TABELA: plans**
```sql
-- ✅ Opção 1: Desabilitar RLS (mais simples)
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;

-- ✅ Opção 2: Permitir leitura pública
CREATE POLICY "plans_select_policy" ON plans
  FOR SELECT TO authenticated
  USING (true);
```

---

## 🚨 SOLUÇÃO ALTERNATIVA (Emergência)

Se ainda der erro, **desabilite RLS temporariamente**:

```sql
-- ⚠️ APENAS PARA DESENVOLVIMENTO!
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
```

**ATENÇÃO:** Em produção, **sempre use RLS ativado**!

---

## ✅ VERIFICAR SE FUNCIONOU

### No Supabase SQL Editor:

```sql
-- Ver políticas ativas
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename IN ('users', 'transactions', 'plans')
ORDER BY tablename;
```

**Resultado esperado:**
```
users          | users_select_policy    | SELECT
users          | users_update_policy    | UPDATE
transactions   | transactions_select... | SELECT
transactions   | transactions_insert... | INSERT
```

---

## 🐛 TESTE NO CÓDIGO

Depois de executar o script SQL, **reinicie o backend**:

```bash
cd financialcontrol-api
npm run dev
```

E teste no frontend:
- ✅ Login deve funcionar
- ✅ Perfil deve carregar
- ✅ Transações devem aparecer
- ✅ **SEM mais erros de recursão!**

---

## 📊 CHECKLIST

- [ ] ✅ Abri Supabase Dashboard
- [ ] ✅ Fui para SQL Editor
- [ ] ✅ Copiei script `SUPABASE_FIX_ALL_RLS.sql`
- [ ] ✅ Executei o script (Run)
- [ ] ✅ Vi "Success" na resposta
- [ ] ✅ Reiniciei backend (npm run dev)
- [ ] ✅ Testei login/perfil/transações
- [ ] ✅ **ZERO erros de recursão!**

---

## 🎯 POR QUE ISSO FUNCIONA?

### **Antes (COM recursão):**
```
Política: "Para ver user, consulte users e verifique role"
   ↓
Para consultar users, precisa verificar política
   ↓
Para verificar política, consulta users
   ↓
LOOP INFINITO! ❌
```

### **Depois (SEM recursão):**
```
Política: "Para ver user, compare auth.uid() com id"
   ↓
auth.uid() vem do JWT (já disponível)
   ↓
Comparação direta, sem consulta
   ↓
FUNCIONA! ✅
```

---

## 💡 DICAS IMPORTANTES

### 1. **auth.uid() é Mágico**
```sql
auth.uid() -- Retorna ID do usuário do JWT
           -- NÃO consulta banco de dados
           -- É super rápido e seguro
```

### 2. **NUNCA Faça Isso:**
```sql
-- ❌ ERRADO
USING (
  (SELECT algo FROM users WHERE id = auth.uid())
)
```

### 3. **SEMPRE Faça Isso:**
```sql
-- ✅ CORRETO
USING (auth.uid() = user_id)
USING (auth.uid() = id)
```

---

## 🆘 AINDA COM ERRO?

### **Opção 1: Reset Completo**

```sql
-- Remover TODAS as políticas
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN 
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE tablename IN ('users', 'transactions', 'plans')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
  END LOOP;
END $$;

-- Depois execute o script SUPABASE_FIX_ALL_RLS.sql novamente
```

### **Opção 2: Modo Desenvolvimento (sem RLS)**

```sql
-- Desabilitar RLS em tudo
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
```

---

## 📞 SUPORTE

Se o erro persistir após executar o script:

1. ✅ Verifique se o script foi executado com sucesso
2. ✅ Confirme que não há erros vermelhos no SQL Editor
3. ✅ Reinicie o backend
4. ✅ Limpe cache do navegador (Ctrl+Shift+Del)
5. ✅ Faça logout e login novamente

---

## ✅ PRONTO!

Após executar o script, o erro **"infinite recursion"** deve **desaparecer completamente**! 🎉

**Arquivos criados:**
- ✅ `SUPABASE_FIX_ALL_RLS.sql` - Script completo
- ✅ `SUPABASE_FIX_RLS_USERS.sql` - Apenas users
- ✅ `COMO_CORRIGIR_RLS_SUPABASE.md` - Este guia

**Execute o script e seja feliz!** 🚀
