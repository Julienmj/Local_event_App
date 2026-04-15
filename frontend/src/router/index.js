import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: () => import('../pages/HomePage.vue') },
  { path: '/login', component: () => import('../pages/LoginPage.vue') },
  { path: '/register', component: () => import('../pages/RegisterPage.vue') },
  { path: '/events', component: () => import('../pages/EventsPage.vue') },
  { path: '/events/:id', component: () => import('../pages/EventDetailPage.vue') },

  // Attendee
  {
    path: '/my-registrations',
    component: () => import('../pages/MyRegistrationsPage.vue'),
    meta: { requiresAuth: true }
  },

  // Organizer
  {
    path: '/organizer',
    component: () => import('../pages/OrganizerDashboard.vue'),
    meta: { requiresAuth: true, role: 'Organizer' }
  },
  {
    path: '/organizer/events/:id/attendees',
    component: () => import('../pages/AttendeeListPage.vue'),
    meta: { requiresAuth: true, role: 'Organizer' }
  },

  // Admin
  {
    path: '/admin',
    component: () => import('../pages/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'Admin' }
  },

  // 404
  { path: '/:pathMatch(.*)*', component: () => import('../pages/NotFoundPage.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/login')
  }

  // Admins can access everything
  if (to.meta.role && auth.user?.role !== to.meta.role && auth.user?.role !== 'Admin') {
    return next('/')
  }

  next()
})

export default router
