# 🛠️ Configuração do Vue DevTools

## ✅ Status da Instalação

O projeto está configurado para suportar o **Vue DevTools através da extensão do navegador**.

## 📥 Como Instalar a Extensão

### **Google Chrome / Microsoft Edge**
1. Acesse a [Chrome Web Store](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
2. Clique em "Adicionar ao Chrome" ou "Adicionar ao Edge"
3. Confirme a instalação

### **Mozilla Firefox**
1. Acesse o [Firefox Add-ons](https://addons.mozilla.org/pt-BR/firefox/addon/vue-js-devtools/)
2. Clique em "Adicionar ao Firefox"
3. Confirme a instalação

### **Versão Standalone (Desktop App)**
```bash
npm install -g @vue/devtools
vue-devtools
```

## 🚀 Como Usar

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Abra o navegador** na URL indicada (geralmente `http://localhost:9002`)

3. **Abra as Ferramentas do Desenvolvedor:**
   - **Windows/Linux:** Pressione `F12` ou `Ctrl + Shift + I`
   - **Mac:** Pressione `Cmd + Option + I`

4. **Navegue até a aba "Vue"** nas ferramentas do desenvolvedor

## 🔍 Recursos do Vue DevTools

- ✅ Inspeção da árvore de componentes
- ✅ Visualização do estado (Pinia stores)
- ✅ Tracking de eventos
- ✅ Inspeção de rotas (Vue Router)
- ✅ Performance profiling
- ✅ Timeline de ações

## ⚙️ Configuração Atual

O projeto está configurado com:
- **Vue:** 3.4.15
- **Quasar:** 2.14.2
- **Modo:** Extensão do navegador (recomendado para apps web)

## ℹ️ Por que não usar o DevTools standalone?

O Vue DevTools standalone (aplicativo Electron) foi desabilitado porque:
1. Causa problemas com espaços no caminho do projeto no Windows
2. A extensão do navegador é mais estável e integrada
3. Melhor performance e experiência de desenvolvimento
4. Atualização automática através das lojas de extensões

## 📚 Documentação Oficial

- [Vue DevTools - Documentação](https://devtools.vuejs.org/)
- [Quasar - Vue DevTools](https://quasar.dev/quasar-cli-vite/developing-spa/vue-devtools)
