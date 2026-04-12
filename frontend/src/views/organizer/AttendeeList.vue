<template>
  <div class="page-wrapper">
    <OrganizerSidebar />
    <div class="main-content">
      <router-link to="/organizer" class="text-decoration-none text-muted small mb-3 d-inline-block">
        <i class="bi bi-arrow-left me-1"></i>Back to Dashboard
      </router-link>
      <h4 class="fw-bold mb-1">Attendee List</h4>
      <p class="text-muted mb-4">People registered for this event</p>

      <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

      <div v-else>
        <div class="d-flex gap-3 mb-3">
          <div class="stat-card px-4 py-3" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:12px">
            <div class="small opacity-75">Total Registered</div>
            <div class="fw-bold fs-4">{{ attendees.length }}</div>
          </div>
          <div class="stat-card px-4 py-3" style="background:linear-gradient(135deg,#10b981,#06b6d4);border-radius:12px">
            <div class="small opacity-75">Confirmed</div>
            <div class="fw-bold fs-4">{{ attendees.filter(a => a.status === 'Confirmed').length }}</div>
          </div>
        </div>

        <!-- Export button -->
        <div class="d-flex justify-content-end mb-3">
          <button class="btn btn-outline-success btn-sm" @click="exportCSV">
            <i class="bi bi-download me-1"></i>Export CSV
          </button>
        </div>

        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <table class="table table-custom mb-0">
            <thead>
              <tr><th>#</th><th>Name</th><th>Email</th><th>Registered At</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-if="attendees.length === 0">
                <td colspan="5" class="text-center text-muted py-4">No attendees yet.</td>
              </tr>
              <tr v-for="(a, i) in attendees" :key="a.registrationID">
                <td class="text-muted small">{{ i + 1 }}</td>
                <td class="fw-semibold">{{ a.userName }}</td>
                <td class="small text-muted">{{ a.userEmail }}</td>
                <td class="small text-muted">{{ formatDate(a.registeredAt) }}</td>
                <td><span class="badge rounded-pill" :class="a.status === 'Confirmed' ? 'badge-active' : 'badge-cancelled'">{{ a.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { registrationsAPI } from '../../services/api'
import OrganizerSidebar from './OrganizerSidebar.vue'

const route = useRoute()
const attendees = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await registrationsAPI.byEvent(route.params.id)
    attendees.value = res.data
  } finally { loading.value = false }
})

function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }

function exportCSV() {
  const rows = [['Name', 'Email', 'Registered At', 'Status'], ...attendees.value.map(a => [a.userName, a.userEmail, a.registeredAt, a.status])]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'attendees.csv'; a.click()
}
</script>
