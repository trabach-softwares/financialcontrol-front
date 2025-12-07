import { Dialog, Loading, LoadingBar, LocalStorage, Notify, Quasar, SessionStorage } from 'quasar'
import { createApp } from 'vue'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

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

// Expose Quasar runtime `$q` to the window in development only (for debugging in console)
if (import.meta.env && import.meta.env.DEV) {
  // eslint-disable-next-line no-undef
  window.$q = myApp.config.globalProperties.$q
}