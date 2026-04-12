<template>
  <div class="page-wrapper">
    <AdminSidebar />
    <div class="main-content">
      <h4 class="fw-bold mb-1">Manage Events</h4>
      <p class="text-muted mb-4">Approve, reject, or delete any event on the platform</p>

      <!-- Filter -->
      <div class="d-flex gap-2 mb-3 flex-wrap">
        <select v-model="filterStatus" class="form-select form-select-sm" style="width:160px">
          <option value="">All Statuses</option>
          <option>Pending</option><option>Active</option><option>Cancelled</option><option>Completed</option>
        </select>
        <input v-model="search" type="text" class="form-control form-control-sm" style="width:220px" placeholder="Search by title..." />
        <button class="btn btn-outline-success btn-sm ms-auto" @click="exportCSV">
          <i class="bi bi-download me-1"></i>Export CSV
        </button>
      </div>

      <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

      <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <table class="table table-custom mb-0">
          <thead>
            <tr><th>Title</th><th>Organizer</th><th>Date</th><th>Category</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="6" class="text-center text-muted py-4">No events found.</td>
            </tr>
            <tr v-for="e in filtered" :key="e.eventID">
              <td class="fw-semibold">{{ e.title }}</td>
              <td class="small text-muted">{{ e.organizerName }}</td>
              <td class="small text-muted">{{ formatDate(e.eventDate) }}</td>
              <td><span class="badge bg-light text-dark">{{ e.categoryName }}</span></td>
              <td><span class="badge rounded-pill" :class="statusClass(e.status)">{{ e.status }}</span></td>
              <td>
                <div class="d-flex gap-1">
                  <button v-if="e.status === 'Pending'" class="btn btn-sm btn-success" @click="setStatus(e, 'Active')">Approve</button>
                  <button v-if="e.status === 'Pending'" class="btn btn-sm btn-outline-danger" @click="setStatus(e, 'Cancelled')">Reject</button>
                  <button v-if="e.status === 'Active'" class="btn btn-sm btn-outline-warning" @click="setStatus(e, 'Cancelled')">Cancel</button>
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
import { eventsAPI } from '../../services/api'
import AdminSidebar from './AdminSidebar.vue'

const events = ref([])
const loading = ref(true)
const filterStatus = ref('')
const search = ref('')

onMounted(async () => {
  try { const res = await eventsAPI.getAll(); events.value = res.data }
  finally { loading.value = false }
})

const filtered = computed(() => events.value.filter(e => {
  const matchStatus = !filterStatus.value || e.status === filterStatus.value
  const matchSearch = !search.value || e.title.toLowerCase().includes(search.value.toLowerCase())
  return matchStatus && matchSearch
}))

async function setStatus(e, status) {
  await eventsAPI.update(e.eventID, { ...e, status })
  e.status = status
}
async function deleteEvent(e) {
  if (!confirm(`Delete "${e.title}"?`)) return
  await eventsAPI.remove(e.eventID)
  events.value = events.value.filter(ev => ev.eventID !== e.eventID)
}

function statusClass(s) {
  return { 'badge-pending': s === 'Pending', 'badge-active': s === 'Active', 'badge-cancelled': s === 'Cancelled', 'badge-completed': s === 'Completed' }
}
function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }

function exportCSV() {
  const rows = [['Title', 'Organizer', 'Date', 'Category', 'Status'], ...filtered.value.map(e => [e.title, e.organizerName, e.eventDate, e.categoryName, e.status])]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'events.csv'; a.click()
}
</script>
