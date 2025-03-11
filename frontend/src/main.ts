import './assets/main.css'
import '../src/components/oculus-thumbstick-controls.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'aframe'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
