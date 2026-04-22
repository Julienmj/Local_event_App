import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
{ path: '/', component: () => import('@/views/Landing.vue') },
  {
    path: '/app',
    component: () => import('@/views/app/AppShell.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/app/dashboard' },
      { path: 'dashboard', component: () => import('@/views/app/Dashboard.vue') },
      { path: 'events', component: () => import('@/views/app/BrowseEvents.vue') },
      { path: 'saved', component: () => import('@/views/app/SavedEvents.vue') },
      { path: 'myevents', component: () => import('@/views/app/MyEvents.vue') },
      { path: 'create', component: () => import('@/views/app/CreateEvent.vue') },
      { path: 'analytics', component: () => import('@/views/app/Analytics.vue') },
      { path: 'venues', component: () => import('@/views/app/Venues.vue') },
      { path: 'categories', component: () => import('@/views/app/Categories.vue') },
      { path: 'notifications', component: () => import('@/views/app/Notifications.vue') },
      { path: 'profile', component: () => import('@/views/app/Profile.vue') },
    ],
  },
  { path: '/auth', component: () => import('@/views/Auth.vue') },
  { path: '/reset-password', component: () => import('@/views/Auth.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (auth.isLoggedIn && to.path === '/') return '/app'
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/auth'
})

export default router
