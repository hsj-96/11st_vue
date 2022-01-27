import { createApp } from 'vue'
import App from '~/App.vue'
import router from '~/routes'
import store from '~/store'
import fetch from '~/plugins/fetch'
import search from '~/plugins/search'

const app = createApp(App)
app.use(fetch)
app.use(search)
app.use(router)
app.use(store)
app.mount('#app')
