<template>
  <div class="sidebar d-none d-lg-block">
    <div class="mb-4">
      <div class="fw-bold fs-5 text-white"><i class="bi bi-calendar-event me-2"></i>EventHub</div>
      <div class="small opacity-50 mt-1">Organizer Panel</div>
    </div>
    <nav>
      <router-link class="nav-link" to="/organizer" exact-active-class="active"><i class="bi bi-grid"></i>Dashboard</router-link>
      <router-link class="nav-link" to="/organizer/events/create" active-class="active"><i class="bi bi-plus-circle"></i>Create Event</router-link>
      <router-link class="nav-link" to="/events" active-class="active"><i class="bi bi-search"></i>Browse Events</router-link>
    </nav>
    <div class="mt-auto pt-4" style="position:absolute;bottom:1.5rem;left:1rem;right:1rem">
      <div class="d-flex align-items-center gap-2 p-2 rounded-3" style="background:rgba(255,255,255,.1)">
        <div class="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center fw-bold" style="width:36px;height:36px;font-size:.85rem;flex-shrink:0">
          {{ initials }}
        </div>
        <div class="overflow-hidden">
          <div class="small fw-semibold text-white text-truncate">{{ auth.user?.fullName }}</div>
          <div class="small opacity-50 text-truncate">{{ auth.user?.role }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
const auth = useAuthStore()
const initials = computed(() => (auth.user?.fullName || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2))
</script>
