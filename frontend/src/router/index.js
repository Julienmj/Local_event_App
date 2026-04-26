import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
{ path: '/', component: () => import('@/views/Landing.vue') },
  {
    path: '/attendee',
    component: () => import('@/views/attendee/AttendeeShell.vue'),
    meta: { requiresAuth: true, role: 'attendee' },
    children: [
      { path: '', redirect: '/attendee/dashboard' },
      { path: 'dashboard', component: () => import('@/views/attendee/Dashboard.vue') },
      { path: 'events', component: () => import('@/views/attendee/BrowseEvents.vue') },
      { path: 'saved', component: () => import('@/views/attendee/SavedEvents.vue') },
      { path: 'ai-assistant', component: () => import('@/views/attendee/AiAssistant.vue') },
      { path: 'notifications', component: () => import('@/views/attendee/Notifications.vue') },
      { path: 'profile', component: () => import('@/views/attendee/Profile.vue') },
    ],
  },
  {
    path: '/organizer',
    component: () => import('@/views/organizer/OrganizerShell.vue'),
    meta: { requiresAuth: true, role: 'organizer' },
    children: [
      { path: '', redirect: '/organizer/dashboard' },
      { path: 'dashboard', component: () => import('@/views/organizer/Dashboard.vue') },
      { path: 'events', component: () => import('@/views/organizer/MyEvents.vue') },
      { path: 'create', component: () => import('@/views/organizer/CreateEvent.vue') },
      { path: 'analytics', component: () => import('@/views/organizer/Analytics.vue') },
      { path: 'venues', component: () => import('@/views/organizer/Venues.vue') },
      { path: 'categories', component: () => import('@/views/organizer/Categories.vue') },
      { path: 'notifications', component: () => import('@/views/organizer/Notifications.vue') },
      { path: 'profile', component: () => import('@/views/organizer/Profile.vue') },
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
  if (auth.isLoggedIn && (to.path === '/' || to.path === '/auth')) {
    // Redirect based on user role
    if (auth.isOrganizer) return '/organizer/dashboard'
    return '/attendee/dashboard'
  }
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/auth'
  if (to.meta.role === 'organizer' && !auth.isOrganizer) return '/attendee/dashboard'
  if (to.meta.role === 'attendee' && auth.isOrganizer) return '/organizer/dashboard'
})

export default router
