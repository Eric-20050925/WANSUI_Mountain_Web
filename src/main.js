import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//创建 Vue 根实例，作为整个应用的挂载入口。
const app = createApp(App)

//安装路由插件，让所有页面都能通过路由进行切换。
app.use(router)
//把应用挂载到页面上的 #app 容器中。
app.mount('#app')
