<template>
  <div class="page-wrapper">
    <AdminSidebar />
    <div class="main-content">
      <h4 class="fw-bold mb-1">Admin Dashboard</h4>
      <p class="text-muted mb-4">Platform overview and statistics</p>

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

      <!-- Charts row -->
      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 p-4">
            <h6 class="fw-bold mb-3">Events by Status</h6>
            <canvas id="statusChart" height="200"></canvas>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 p-4">
            <h6 class="fw-bold mb-3">Events by Category</h6>
            <canvas id="categoryChart" height="200"></canvas>
          </div>
        </div>
      </div>

      <!-- Pending events -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 class="fw-bold mb-0">Pending Approval</h6>
          <span class="badge bg-warning text-dark">{{ pendingEvents.length }}</span>
        </div>
        <table class="table table-custom mb-0">
          <thead><tr><th>Title</th><th>Organizer</th><th>Date</th><th>Category</th><th>Actions</th></tr></thead>
          <tbody>
            <tr v-if="pendingEvents.length === 0">
              <td colspan="5" class="text-center text-muted py-4">No pending events.</td>
            </tr>
            <tr v-for="e in pendingEvents" :key="e.eventID">
              <td class="fw-semibold">{{ e.title }}</td>
              <td class="small text-muted">{{ e.organizerName }}</td>
              <td class="small text-muted">{{ formatDate(e.eventDate) }}</td>
              <td><span class="badge bg-light text-dark">{{ e.categoryName }}</span></td>
              <td>
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-success" @click="approve(e)"><i class="bi bi-check-lg me-1"></i>Approve</button>
                  <button class="btn btn-sm btn-outline-danger" @click="reject(e)"><i class="bi bi-x-lg me-1"></i>Reject</button>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { eventsAPI } from '../../services/api'
import AdminSidebar from './AdminSidebar.vue'

const allEvents = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await eventsAPI.getAll()
    allEvents.value = res.data
  } finally {
    loading.value = false
    await nextTick()
    renderCharts()
  }
})

const pendingEvents = computed(() => allEvents.value.filter(e => e.status === 'Pending'))

const stats = computed(() => [
  { label: 'Total Events', value: allEvents.value.length, icon: 'bi bi-calendar-event', bg: 'linear-gradient(135deg,#4f46e5,#7c3aed)' },
  { label: 'Active Events', value: allEvents.value.filter(e => e.status === 'Active').length, icon: 'bi bi-check-circle', bg: 'linear-gradient(135deg,#10b981,#06b6d4)' },
  { label: 'Pending Review', value: pendingEvents.value.length, icon: 'bi bi-clock-history', bg: 'linear-gradient(135deg,#f59e0b,#f97316)' },
  { label: 'Completed', value: allEvents.value.filter(e => e.status === 'Completed').length, icon: 'bi bi-trophy', bg: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }
])

async function approve(e) {
  await eventsAPI.update(e.eventID, { ...e, status: 'Active' })
  e.status = 'Active'
}
async function reject(e) {
  await eventsAPI.update(e.eventID, { ...e, status: 'Cancelled' })
  e.status = 'Cancelled'
}

function renderCharts() {
  if (typeof Chart === 'undefined') return
  const statusCounts = ['Pending', 'Active', 'Cancelled', 'Completed'].map(s => allEvents.value.filter(e => e.status === s).length)
  new Chart(document.getElementById('statusChart'), {
    type: 'doughnut',
    data: {
      labels: ['Pending', 'Active', 'Cancelled', 'Completed'],
      datasets: [{ data: statusCounts, backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#8b5cf6'], borderWidth: 0 }]
    },
    options: { plugins: { legend: { position: 'bottom' } }, cutout: '65%' }
  })

  const catMap = {}
  allEvents.value.forEach(e => { catMap[e.categoryName] = (catMap[e.categoryName] || 0) + 1 })
  new Chart(document.getElementById('categoryChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(catMap),
      datasets: [{ data: Object.values(catMap), backgroundColor: '#4f46e5', borderRadius: 6 }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
  })
}

function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
</script>
