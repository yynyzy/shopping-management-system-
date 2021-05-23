import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from './plugins/element'

import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
const app = createApp(App)
ElementPlus(app)
// 全局注册axios
app.config.globalProperties.$axios=axios 

app.use(store).use(router).mount('#app')



