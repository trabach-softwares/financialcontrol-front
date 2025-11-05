# 🏷️ Filtro de Categorias por Tipo

## 📋 Resumo das Mudanças

Implementado filtro de categorias por tipo de transação no `TransactionForm.vue`. Agora:
- **Despesas** mostram apenas categorias do tipo `expense`
- **Receitas** mostram apenas categorias do tipo `income`

---

## ✨ O Que Foi Alterado

### 1. **Função `buildGroupedOptions`**

Adicionado filtro por tipo da transação:

```javascript
// ANTES
const def = availableCategories.value.filter(c => 
  c.is_default === true && 
  c.name.toLowerCase().includes(needle)
)

// DEPOIS
const def = availableCategories.value.filter(c => 
  c.is_default === true && 
  c.type === currentType &&  // ← NOVO FILTRO
  c.name.toLowerCase().includes(needle)
)
```

### 2. **Função `loadCategories`**

Melhorada normalização e logs:

```javascript
// Normaliza mantendo type ('income' | 'expense')
availableCategories.value = (items || []).map(c => ({
  id: c.id,
  name: c.name || (typeof c === 'string' ? c : ''),
  icon: c.icon || 'category',
  color: c.color || 'blue-6',
  type: c.type || 'expense', // ← Mantém tipo correto
  is_default: c.is_default || false // ← Preserva flag
})).filter(c => !!c.name)
```

Adicionados logs para debug:
- `📂 Categorias carregadas:` - Dados brutos da API
- `✅ Categorias normalizadas:` - Dados processados
- `❌ Erro ao carregar categorias:` - Erros capturados

### 3. **Watcher do Tipo**

Criado watcher para refiltrar categorias quando tipo muda:

```javascript
watch(
  () => form.value.type,
  (newType, oldType) => {
    if (newType !== oldType) {
      // Refiltra as categorias disponíveis
      filteredCategories.value = buildGroupedOptions('')
      
      // Se a categoria atual não pertence ao novo tipo, limpa
      const currentCat = availableCategories.value.find(
        c => c.name === form.value.category
      )
      if (currentCat && currentCat.type !== newType) {
        form.value.category = ''
      }
    }
  }
)
```

---

## 🎯 Comportamento

### Cenário 1: Criando Nova Despesa
1. Usuário seleciona **"Despesa"**
2. Campo de categoria mostra apenas categorias com `type: 'expense'`
3. Exemplos: Alimentação, Transporte, Moradia, etc.

### Cenário 2: Criando Nova Receita
1. Usuário seleciona **"Receita"**
2. Campo de categoria mostra apenas categorias com `type: 'income'`
3. Exemplos: Salário, Freelance, Investimentos, etc.

### Cenário 3: Mudando Tipo de Transação
1. Usuário tem uma Despesa com categoria "Alimentação" selecionada
2. Usuário muda para **"Receita"**
3. Campo de categoria é **automaticamente limpo**
4. Lista mostra apenas categorias de `income`
5. Usuário precisa selecionar uma nova categoria apropriada

### Cenário 4: Editando Transação Existente
1. Transação carregada com tipo e categoria
2. Categorias filtradas de acordo com o tipo
3. Categoria atual permanece selecionada se for do tipo correto

---

## 🔧 Estrutura de Dados

### Categoria no Backend
```javascript
{
  id: "uuid",
  name: "Salário",
  icon: "payments",
  color: "green-6",
  type: "income",        // ← 'income' ou 'expense'
  is_default: true,      // ← Categoria padrão do sistema
  created_at: "2025-01-01",
  updated_at: "2025-01-01"
}
```

### Categoria Normalizada no Frontend
```javascript
{
  id: "uuid",
  name: "Salário",
  icon: "payments",
  color: "green-6",
  type: "income",        // ← Usado no filtro
  is_default: true       // ← Usado para agrupar (padrão vs minhas)
}
```

---

## 📊 Exemplos de Categorias

### Categorias de Receita (`type: 'income'`)
```javascript
[
  { name: "Salário", type: "income", is_default: true },
  { name: "Freelance", type: "income", is_default: true },
  { name: "Investimentos", type: "income", is_default: true },
  { name: "Aluguel Recebido", type: "income", is_default: true },
  { name: "Vendas", type: "income", is_default: false }, // criada pelo usuário
]
```

### Categorias de Despesa (`type: 'expense'`)
```javascript
[
  { name: "Alimentação", type: "expense", is_default: true },
  { name: "Transporte", type: "expense", is_default: true },
  { name: "Moradia", type: "expense", is_default: true },
  { name: "Saúde", type: "expense", is_default: true },
  { name: "Academia", type: "expense", is_default: false }, // criada pelo usuário
]
```

---

## 🐛 Debug

Para verificar se está funcionando, observe no console:

```
📂 Categorias carregadas: [Array com todas as categorias]
✅ Categorias normalizadas: [Array processado]
🔄 Tipo mudou de expense para income, refiltrando categorias...
⚠️ Categoria atual "Alimentação" não é do tipo income, limpando...
```

---

## ✅ Validação

### Como Testar

1. **Teste Básico - Despesa**
   ```
   1. Abrir formulário de nova transação
   2. Selecionar tipo "Despesa"
   3. Abrir dropdown de categorias
   4. ✓ Verificar que apenas categorias de expense aparecem
   ```

2. **Teste Básico - Receita**
   ```
   1. Abrir formulário de nova transação
   2. Selecionar tipo "Receita"
   3. Abrir dropdown de categorias
   4. ✓ Verificar que apenas categorias de income aparecem
   ```

3. **Teste de Mudança de Tipo**
   ```
   1. Selecionar "Despesa"
   2. Escolher categoria "Alimentação"
   3. Mudar para "Receita"
   4. ✓ Verificar que categoria foi limpa
   5. ✓ Verificar que dropdown mostra apenas categorias income
   ```

4. **Teste de Edição**
   ```
   1. Editar uma despesa existente
   2. ✓ Verificar que categoria atual permanece selecionada
   3. ✓ Verificar que dropdown mostra apenas expense
   ```

5. **Teste de Criação de Nova Categoria**
   ```
   1. Selecionar "Despesa"
   2. Digitar nova categoria e criar
   3. ✓ Verificar que foi criada com type: 'expense'
   4. Mudar para "Receita"
   5. ✓ Verificar que nova categoria não aparece
   ```

---

## 🔍 Troubleshooting

### Problema: Categorias não são filtradas
**Causa:** Backend não está retornando o campo `type`
**Solução:** Verificar resposta da API `/categories`

### Problema: Categoria não é limpa ao mudar tipo
**Causa:** Watcher não está sendo acionado
**Solução:** Verificar logs no console

### Problema: Todas categorias aparecem mesmo com filtro
**Causa:** Valores de `type` não batem (`income/expense` vs `user/default`)
**Solução:** Verificar normalização em `loadCategories`

---

## 📁 Arquivos Modificados

1. ✅ `src/components/TransactionForm.vue`
   - Função `buildGroupedOptions` - Filtro por tipo
   - Função `loadCategories` - Normalização melhorada + logs
   - Watcher `form.value.type` - Refiltro automático

---

## 🎉 Benefícios

✅ **Organização** - Usuários veem apenas categorias relevantes
✅ **Prevenção de Erros** - Impossível selecionar categoria errada
✅ **UX Melhorada** - Menos opções, mais foco
✅ **Consistência** - Dados sempre corretos no banco
✅ **Manutenibilidade** - Logs facilitam debug

---

## 📝 Notas

- O campo `type` deve ser `'income'` ou `'expense'` (lowercase)
- Categorias padrão (`is_default: true`) são separadas das personalizadas
- Ao criar nova categoria, o `type` é inferido do tipo da transação atual
- Filtro aplica-se tanto para busca quanto para listagem inicial

---

Desenvolvido com ❤️ por GitHub Copilot
Data: 2025-11-05
