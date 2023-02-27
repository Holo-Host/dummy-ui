import { createApp } from 'vue'
import App from './App.vue'
import { createStore } from 'vuex'
import holoStore from './stores/holo'

import './assets/main.css'

const app = createApp(App)

app.use(
  createStore({
    modules: {
      holo: holoStore
    }
  })
)

app.mount('#app')