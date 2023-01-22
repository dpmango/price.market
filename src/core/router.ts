import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@/pages/Homepage.page.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Homepage,
    },
    {
      path: '/create/:id',
      name: 'description',
      component: () => import('@/pages/Description.page.vue'),
    },
    {
      path: '/ui',
      name: 'ui',
      component: () => import('@/pages/Ui.page.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'PageNotFound',
      component: () => import('@/pages/NotFound.page.vue'),
    },
  ],
})

export default router
