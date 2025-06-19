import { createApp } from 'vue';
import App from './App.vue';
import { store } from './store';

// Initialize store before app mounts
store.load().then(() => {
  const app = createApp(App);
  app.provide('store', store);
  app.mount('#app');
});