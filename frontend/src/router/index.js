import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: () => import('../pages/HomePage.vue') },
  { path: '/login', component: () => import('../pages/LoginPage.vue') },
  { path: '/register', component: () => import('../pages/RegisterPage.vue') },
  { path: '/events', component: () => import('../pages/EventsPage.vue'), meta: { requiresAuth: true } },
  { path: '/events/:id', component: () => import('../pages/EventDetailPage.vue'), meta: { requiresAuth: true } },
  { path: '/organizer', component: () => import('../pages/OrganizerDashboard.vue'), meta: { requiresAuth: true, role: 'Organizer' } },
  { path: '/admin', component: () => import('../pages/AdminDashboard.vue'), meta: { requiresAuth: true, role: 'Admin' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) return next('/login')
  if (to.meta.role && auth.user?.role !== to.meta.role) return next('/')
  next()
})

export default router
