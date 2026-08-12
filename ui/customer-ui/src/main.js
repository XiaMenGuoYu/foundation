import { createApp } from 'vue'

import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'

import './permission' // permission control

const app = createApp(App)

app.use(store)
app.use(router)
app.component('SvgIcon', SvgIcon)

app.mount('#app')
