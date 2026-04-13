import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../pages/HomePage.vue') },
  { path: '/login', component: () => import('../pages/LoginPage.vue') },
  { path: '/register', component: () => import('../pages/RegisterPage.vue') },
  { path: '/events', component: () => import('../pages/EventsPage.vue') },
  { path: '/events/:id', component: () => import('../pages/EventDetailPage.vue') },
  { path: '/organizer', component: () => import('../pages/OrganizerDashboard.vue') },
  { path: '/admin', component: () => import('../pages/AdminDashboard.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
