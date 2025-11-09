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
  },
  {
    path: '/visitor-experience',
    name: 'VisitorExperience',
    component: () => import('../views/InExhibition/VisitorExperience.vue')
  },
  {
    path: '/visitor-journey',
    name: 'VisitorJourney',
    component: () => import('../views/InExhibition/VisitorJourney.vue')
  },
  {
    path: '/staff-experience',
    name: 'StaffExperience',
    component: () => import('../views/InExhibition/StaffExperience.vue')
  },
  {
    path: '/staff-journey',
    name: 'StaffJourney',
    component: () => import('../views/InExhibition/StaffJourney.vue')
  },
  {
    path: '/ceo-experience',
    name: 'CEOExperience',
    component: () => import('../views/CEO/CEOExperience.vue')
  },
  {
    path: '/culture-experience',
    name: 'CultureExperience',
    component: () => import('../views/InExhibition/CultureExperience.vue')
  },
  {
    path: '/media-experience',
    name: 'MediaExperience',
    component: () => import('../views/InExhibition/MediaExperience.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
