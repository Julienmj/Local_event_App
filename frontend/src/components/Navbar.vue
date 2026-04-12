<template>
  <nav class="navbar navbar-expand-lg navbar-custom sticky-top">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <i class="bi bi-calendar-event me-2"></i>EventHub
      </router-link>
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><router-link class="nav-link" to="/events">Browse Events</router-link></li>
        </ul>
        <ul class="navbar-nav align-items-center gap-2">
          <!-- Notifications (logged in) -->
          <li class="nav-item" v-if="auth.isLoggedIn">
            <router-link class="nav-link position-relative" to="#">
              <i class="bi bi-bell fs-5"></i>
              <span v-if="unreadCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size:.6rem">{{ unreadCount }}</span>
            </router-link>
          </li>
          <!-- Role links -->
          <li class="nav-item" v-if="auth.isOrganizer || auth.isAdmin">
            <router-link class="nav-link" to="/organizer"><i class="bi bi-grid me-1"></i>Dashboard</router-link>
          </li>
          <li class="nav-item" v-if="auth.isAdmin">
            <router-link class="nav-link" to="/admin"><i class="bi bi-shield-check me-1"></i>Admin</router-link>
          </li>
          <li class="nav-item" v-if="auth.isAttendee">
            <router-link class="nav-link" to="/my-registrations"><i class="bi bi-ticket me-1"></i>My Events</router-link>
          </li>
          <!-- Auth buttons -->
          <li class="nav-item" v-if="!auth.isLoggedIn">
            <router-link class="btn btn-outline-light btn-sm" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="!auth.isLoggedIn">
            <router-link class="btn btn-primary-custom btn-sm" to="/register">Sign Up</router-link>
          </li>
          <li class="nav-item dropdown" v-if="auth.isLoggedIn">
            <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" data-bs-toggle="dropdown">
              <div class="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center" style="width:32px;height:32px;font-weight:700;font-size:.85rem">
                {{ initials }}
              </div>
              {{ auth.user?.fullName?.split(' ')[0] }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><span class="dropdown-item-text text-muted small">{{ auth.user?.email }}</span></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" @click.prevent="logout"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const unreadCount = 0 // will be wired to notifications store

const initials = computed(() => {
  const name = auth.user?.fullName || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
