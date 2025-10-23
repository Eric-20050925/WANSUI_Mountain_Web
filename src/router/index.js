import { createRouter, createWebHistory } from 'vue-router'

//统一在这里集中管理应用的所有路由配置。
const routes = [
  {
    path: '/',
    redirect: '/loading' //默认跳转到加载页，后面再改
  },
  {
    path: '/loading',
    name: 'Loading',
    component: () => import('../views/LoadingPage.vue') //按需加载（但是她们想要的是加载页一次性加载好，这个后面再改吧）
  }
]

//创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
