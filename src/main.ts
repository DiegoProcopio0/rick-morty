import { createApp } from 'vue'

import './style.css'

import App from './App.vue'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'

import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    cssLayer: {
      name: 'primevue',
      order: 'tailwind-base, primevue, tailwind-utilities',
    },
  },
})
app.use(ToastService)
app.use(pinia)
app.mount('#app')
