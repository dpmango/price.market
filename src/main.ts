import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import ToastPlugin from 'vue-toast-notification'
import 'virtual:svg-icons-register'

import App from '@/App.vue'
import router from '@/core/router'
import * as components from '@c/Ui'

import '@/assets/styles/app.scss'

const app = createApp(App)
const head = createHead()

for (const name in components) {
  // @ts-ignore
  app.component(name, components[name])
}

app.use(createPinia())
app.use(head)
app.use(router)
app.use(ToastPlugin, {})

app.mount('#app')
