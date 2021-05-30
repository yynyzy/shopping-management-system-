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
app.config.globalProperties.$axios = axios


//全局注册时间过滤器
app.config.globalProperties.$filters = {
    dataFormat(originVal) {
        let dt = new Date(originVal)
        let y = (dt.getFullYear() + "").padStart(2, "0")
        let m = (dt.getMonth() + 1 + "").padStart(2, "0")
        let d = (dt.getDate() + "").padStart(2, "0")
        let h = (dt.getHours() + "").padStart(2, "0")
        let mm = (dt.getMinutes() + "").padStart(2, "0")
        let s = (dt.getSeconds() + "").padStart(2, "0")

        return `${y}-${m}-${d} ${h}:${mm}:${s}`
    }
}


app.use(store).use(router).mount('#app')


