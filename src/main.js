import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Create app instance first
const app = createApp(App)

// Create pinia instance
const pinia = createPinia()

// Define the click-outside directive
const clickOutside = {
    mounted(el, binding) {
      el.clickOutsideEvent = function(event) {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event);
        }
      };
      document.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) {
      document.removeEventListener('click', el.clickOutsideEvent);
    },
};

// Register directive and plugins
app.directive('click-outside', clickOutside)
app.use(pinia)
app.use(router)

// Mount the app
app.mount('#app')