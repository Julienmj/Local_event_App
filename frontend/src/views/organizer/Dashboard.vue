<template>
  <div class="page-wrapper">
    <OrganizerSidebar />
    <div class="main-content">
      <h4 class="fw-bold mb-1">Organizer Dashboard</h4>
      <p class="text-muted mb-4">Manage your events and track attendance</p>

      <!-- Stats -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3" v-for="s in stats" :key="s.label">
          <div class="stat-card" :style="{ background: s.bg }">
            <i :class="s.icon" style="font-size:1.8rem"></i>
            <h4 class="fw-bold mt-2 mb-0">{{ s.value }}</h4>
            <p class="mb-0 opacity-75 small">{{ s.label }}</p>
          </div>
        </div>
      </div>

      <!-- My Events -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">My Events</h5>
        <router-link to="/organizer/events/create" class="btn btn-primary-custom btn-sm">
          <i class="bi bi-plus-lg me-1"></i>New Event
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>

      <div v-else-if="events.length === 0" class="text-center py-5">
        <i class="bi bi-calendar-plus" style="font-size:3rem;color:#cbd5e1"></i>
        <p class="text-muted mt-2">No events yet. Create your first one!</p>
      </div>

      <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <table class="table table-custom mb-0">
          <thead>
            <tr>
              <th>Event</th><th>Date</th><th>Category</th><th>Status</th><th>Attendees</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in events" :key="e.eventID">
              <td class="fw-semibold">{{ e.title }}</td>
              <td class="small text-muted">{{ formatDate(e.eventDate) }}</td>
              <td><span class="badge bg-light text-dark">{{ e.categoryName }}</span></td>
              <td><span class="badge rounded-pill" :class="statusClass(e.status)">{{ e.status }}</span></td>
              <td><router-link :to="`/organizer/events/${e.eventID}/attendees`" class="text-primary-custom small"><i class="bi bi-people me-1"></i>View</router-link></td>
              <td>
                <div class="d-flex gap-1">
                  <router-link :to="`/organizer/events/${e.eventID}/edit`" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></router-link>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteEvent(e)"><i class="bi bi-trash"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { eventsAPI } from '../../services/api'
import OrganizerSidebar from './OrganizerSidebar.vue'

const auth = useAuthStore()
const events = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await eventsAPI.byOrganizer(auth.user.userID)
    events.value = res.data
  } finally { loading.value = false }
})

const stats = computed(() => [
  { label: 'Total Events', value: events.value.length, icon: 'bi bi-calendar-event', bg: 'linear-gradient(135deg,#4f46e5,#7c3aed)' },
  { label: 'Active', value: events.value.filter(e => e.status === 'Active').length, icon: 'bi bi-check-circle', bg: 'linear-gradient(135deg,#10b981,#06b6d4)' },
  { label: 'Pending', value: events.value.filter(e => e.status === 'Pending').length, icon: 'bi bi-clock', bg: 'linear-gradient(135deg,#f59e0b,#f97316)' },
  { label: 'Completed', value: events.value.filter(e => e.status === 'Completed').length, icon: 'bi bi-trophy', bg: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }
])

async function deleteEvent(e) {
  if (!confirm(`Delete "${e.title}"?`)) return
  await eventsAPI.remove(e.eventID)
  events.value = events.value.filter(ev => ev.eventID !== e.eventID)
}

function statusClass(s) {
  return { 'badge-pending': s === 'Pending', 'badge-active': s === 'Active', 'badge-cancelled': s === 'Cancelled', 'badge-completed': s === 'Completed' }
}
function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
</script>
