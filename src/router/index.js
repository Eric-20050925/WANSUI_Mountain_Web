import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/loading'
  },
  {
    path: '/loading',
    name: 'Loading',
    component: () => import('../views/LoadingPage.vue')
  },
  {
    path: '/intro',
    name: 'IntroVideo',
    component: () => import('../views/IntroVideoPage.vue')
  },
  {
    path: '/beforeexhibition',
    name: 'BoforeExhibition',
    component: () => import('../views/BeforeExhibition.vue')
  },
  {
    path: '/exhibition',
    name: 'Exhibition',
    component: () => import('../views/Exhibition.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
