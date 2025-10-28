# 🔄 Loading Overlay Global

Sistema de loading automático que exibe um overlay durante chamadas de API.

---

## ✨ Funcionalidades

- ✅ **Automático**: Exibe loading em TODAS as chamadas de API
- ✅ **Global**: Um único overlay para toda aplicação
- ✅ **Inteligente**: Tempo mínimo de exibição (300ms) para evitar flickering
- ✅ **Bonito**: Spinner animado com backdrop blur
- ✅ **Acessível**: Role, aria-live, e bloqueio de scroll
- ✅ **Múltiplas requisições**: Controla contador de requisições simultâneas

---

## 📦 Arquivos Criados

### 1. **`src/components/LoadingOverlay.vue`**
Componente visual do overlay com:
- Spinner animado (Quasar q-spinner-gears)
- Mensagem customizável
- Backdrop com blur
- Fullscreen ou inline
- Transições suaves

### 2. **`src/composables/useGlobalLoading.js`**
Composable que gerencia o estado global:
- `isLoading` - Estado do loading (true/false)
- `loadingMessage` - Mensagem exibida
- `startLoading(message)` - Inicia loading
- `stopLoading()` - Para loading
- `forceStopLoading()` - Força parada (emergência)

### 3. **`src/boot/axios.js` (modificado)**
Integração automática nos interceptors:
- **Request Interceptor**: Inicia loading antes da requisição
- **Response Interceptor**: Para loading após resposta (sucesso ou erro)

### 4. **`src/layouts/MainLayout.vue` (modificado)**
Loading overlay adicionado no layout principal

---

## 🚀 Como Funciona

### Fluxo Automático (API Calls)

```
1. Usuário faz ação (ex: salvar perfil)
2. Componente chama API (ex: userService.updateProfile())
3. Axios Request Interceptor detecta requisição
4. startLoading() é chamado automaticamente ⚡
5. Overlay aparece na tela 🎭
6. API processa e responde
7. Axios Response Interceptor detecta resposta
8. stopLoading() é chamado automaticamente ⚡
9. Overlay desaparece 🎭
```

### Múltiplas Requisições Simultâneas

```javascript
// Sistema conta requisições pendentes:

Requisição 1 inicia → contador: 1 → EXIBE loading
Requisição 2 inicia → contador: 2 → loading continua
Requisição 1 termina → contador: 1 → loading continua
Requisição 2 termina → contador: 0 → ESCONDE loading
```

---

## 💻 Uso Manual (Opcional)

Se precisar controlar manualmente em algum componente:

```vue
<script setup>
import { useGlobalLoading } from '@/composables/useGlobalLoading'

const { startLoading, stopLoading, isLoading, loadingMessage } = useGlobalLoading()

// Iniciar loading
const fazerAlgo = async () => {
  startLoading('Processando dados...')
  
  try {
    // Seu código aqui
    await minhaFuncao()
  } finally {
    stopLoading()
  }
}

// Verificar se está loading
console.log('Carregando?', isLoading.value)
console.log('Mensagem:', loadingMessage.value)
</script>
```

---

## 🎨 Customização

### Alterar Mensagem no Axios

Edite `src/boot/axios.js`:

```javascript
// Linha 86
startLoading('Sua mensagem personalizada')
```

### Alterar Spinner

Edite `src/components/LoadingOverlay.vue`:

```vue
<!-- Trocar q-spinner-gears por outro -->
<q-spinner-dots :color="spinnerColor" :size="spinnerSize" />
<q-spinner-hourglass :color="spinnerColor" :size="spinnerSize" />
<q-spinner-rings :color="spinnerColor" :size="spinnerSize" />
```

### Alterar Cores

```vue
<LoadingOverlay 
  v-model="isLoading"
  spinner-color="warning"  <!-- Verde, warning, negative, etc -->
  spinner-size="80px"
/>
```

### Alterar Tempo Mínimo

Edite `src/composables/useGlobalLoading.js`:

```javascript
const minShowTime = 500 // 500ms em vez de 300ms
```

---

## 🐛 Debugging

### Ver logs no console:

```
🔄 [LOADING] Iniciado: Carregando...
✅ [LOADING] Finalizado
⚠️ [LOADING] Forçado a parar
```

### Verificar estado:

```javascript
import { useGlobalLoading } from '@/composables/useGlobalLoading'

const { isLoading, pendingRequests } = useGlobalLoading()

console.log('Loading ativo?', isLoading.value)
console.log('Requisições pendentes:', pendingRequests.value)
```

### Forçar parada (emergência):

```javascript
const { forceStopLoading } = useGlobalLoading()
forceStopLoading() // Para imediatamente
```

---

## 📱 Responsividade

O overlay é **100% responsivo**:

- ✅ Fullscreen em desktop
- ✅ Ajusta para mobile (100dvh)
- ✅ Respeita safe-areas (notch do iPhone)
- ✅ Bloqueia scroll durante loading

---

## ♿ Acessibilidade

- ✅ `role="status"` - Define como região de status
- ✅ `aria-live="polite"` - Anuncia mudanças para leitores de tela
- ✅ `aria-atomic="true"` - Lê conteúdo completo
- ✅ Bloqueio de scroll opcional
- ✅ Transições suaves

---

## 🎯 Exemplos de Uso Real

### 1. **Login**
```javascript
// Automático via axios
await authService.login({ email, password })
// Loading já aparece e desaparece automaticamente!
```

### 2. **Salvar Perfil**
```javascript
// Automático via axios
await userService.updateProfile({ name, phone })
// Loading já funciona!
```

### 3. **Upload de Arquivo** (manual se necessário)
```javascript
const { startLoading, stopLoading } = useGlobalLoading()

const uploadFile = async (file) => {
  startLoading('Enviando arquivo...')
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    await api.post('/upload', formData)
  } finally {
    stopLoading()
  }
}
```

---

## 🔧 Troubleshooting

### Loading não aparece?
1. Verifique se o axios está importando o composable
2. Confirme que MainLayout tem o componente
3. Veja logs no console

### Loading não some?
1. Verifique se há erro na API sem tratamento
2. Use `forceStopLoading()` como emergência
3. Verifique contador: `pendingRequests.value`

### Loading pisca muito rápido?
- Aumente `minShowTime` no composable
- Padrão: 300ms (bom para UX)

---

## 📝 Notas Importantes

- ⚠️ Não use `startLoading()` manual em loops
- ⚠️ Sempre use `try/finally` com loading manual
- ✅ Loading automático funciona em 99% dos casos
- ✅ Múltiplas requisições são tratadas automaticamente

---

## 🎉 Pronto!

Agora **TODAS as chamadas de API** exibirão automaticamente o loading overlay! 🚀

Não precisa fazer nada nos componentes, tudo funciona automaticamente através dos interceptors do Axios!
