import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@/pages/Homepage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Homepage,
    },
    {
      path: '/:id',
      name: 'description',
      component: () => import('@/pages/Description.vue'),
    },
  ],
})

export default router
