import { createApp } from 'vue'
import { Quasar, Notify, Dialog, Loading, LoadingBar, LocalStorage, SessionStorage } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading,
    LoadingBar,
    LocalStorage,
    SessionStorage
  }
})

// Create Pinia instance
const pinia = createPinia()
myApp.use(pinia)

// Install router
myApp.use(router)

// Mount to DOM
myApp.mount('#q-app')