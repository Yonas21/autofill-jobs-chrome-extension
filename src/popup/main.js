import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'

const app = createApp(App)
app.provide('store', store) // Make available to all components
app.mount('#app')