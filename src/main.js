import { createApp } from 'vue'
import { createStore } from 'vuex'
import holoStore from './stores/holo'

import App from './App.vue'

const app = createApp(App)

app.use(
  createStore({
    modules: {
      holo: holoStore
    }
  })
)

app.mount('#app')
