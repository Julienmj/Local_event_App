import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Landing from '../views/Landing.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Events from '../views/events/Events.vue'
import EventDetail from '../views/events/EventDetail.vue'
import MyRegistrations from '../views/attendee/MyRegistrations.vue'
import OrganizerDashboard from '../views/organizer/Dashboard.vue'
import CreateEvent from '../views/organizer/CreateEvent.vue'
import EditEvent from '../views/organizer/EditEvent.vue'
import AttendeeList from '../views/organizer/AttendeeList.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminUsers from '../views/admin/Users.vue'
import AdminCategories from '../views/admin/Categories.vue'
import AdminEvents from '../views/admin/Events.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/events', component: Events },
  { path: '/events/:id', component: EventDetail },
  {
    path: '/my-registrations',
    component: MyRegistrations,
    meta: { requiresAuth: true, role: 'Attendee' }
  },
  {
    path: '/organizer',
    component: OrganizerDashboard,
    meta: { requiresAuth: true, role: 'Organizer' }
  },
  {
    path: '/organizer/events/create',
    component: CreateEvent,
    meta: { requiresAuth: true, role: 'Organizer' }
  },
  {
    path: '/organizer/events/:id/edit',
    component: EditEvent,
    meta: { requiresAuth: true, role: 'Organizer' }
  },
  {
    path: '/organizer/events/:id/attendees',
    component: AttendeeList,
    meta: { requiresAuth: true, role: 'Organizer' }
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/admin/users',
    component: AdminUsers,
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/admin/categories',
    component: AdminCategories,
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/admin/events',
    component: AdminEvents,
    meta: { requiresAuth: true, role: 'Admin' }
  },
  { path: '/:pathMatch(.*)*', component: NotFound }
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
  if (to.meta.role && auth.user?.role !== to.meta.role && auth.user?.role !== 'Admin') {
    return next('/')
  }
  next()
})

export default router
