import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import 'virtual:svg-icons-register'

import App from '@/App.vue'
import router from '@/core/router'
import '@/assets/styles/app.scss'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(head)
app.use(router)

app.mount('#app')
