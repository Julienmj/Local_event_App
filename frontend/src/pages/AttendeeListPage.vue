<template>
  <AppLayout>
    <div class="page-header">
      <div>
        <router-link to="/organizer" class="back-link">← Back to Dashboard</router-link>
        <h1>Attendee List</h1>
        <p class="sub" v-if="eventTitle">{{ eventTitle }}</p>
      </div>
      <button class="btn-primary" @click="exportCSV">⬇ Export CSV</button>
    </div>

    <div v-if="loading" class="loading">Loading attendees...</div>

    <div v-else>
      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-num">{{ attendees.length }}</span>
          <span class="stat-label">Total Registered</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ confirmed.length }}</span>
          <span class="stat-label">Confirmed</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ waitlisted.length }}</span>
          <span class="stat-label">Waitlisted</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ cancelledCount.length }}</span>
          <span class="stat-label">Cancelled</span>
        </div>
      </div>

      <!-- Search -->
      <div class="table-card">
        <div class="table-header">
          <h3>Registered Attendees</h3>
          <input v-model="search" class="search-input" placeholder="Search by name or email..." />
        </div>

        <div v-if="filtered.length === 0" class="empty-state">No attendees found.</div>

        <table v-else class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Registered At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, i) in filtered" :key="a.registrationID">
              <td class="muted-cell">{{ i + 1 }}</td>
              <td>
                <div class="user-cell">
                  <div class="avatar">{{ a.userName?.charAt(0).toUpperCase() }}</div>
                  <span class="username">{{ a.userName }}</span>
                </div>
              </td>
              <td class="muted-cell">{{ a.userEmail }}</td>
              <td class="muted-cell">{{ formatDate(a.registeredAt) }}</td>
              <td>
                <span :class="['status-badge', a.status.toLowerCase()]">{{ a.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import api from '../api'

const route = useRoute()
const attendees = ref([])
const loading = ref(true)
const search = ref('')
const eventTitle = ref('')

const confirmed = computed(() => attendees.value.filter(a => a.status === 'Confirmed'))
const waitlisted = computed(() => attendees.value.filter(a => a.status === 'Waitlisted'))
const cancelledCount = computed(() => attendees.value.filter(a => a.status === 'Cancelled'))

const filtered = computed(() =>
  attendees.value.filter(a =>
    a.userName?.toLowerCase().includes(search.value.toLowerCase()) ||
    a.userEmail?.toLowerCase().includes(search.value.toLowerCase())
  )
)

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function exportCSV() {
  const rows = [
    ['Name', 'Email', 'Registered At', 'Status'],
    ...filtered.value.map(a => [a.userName, a.userEmail, a.registeredAt, a.status])
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `attendees-event-${route.params.id}.csv`
  a.click()
}

onMounted(async () => {
  try {
    const [regRes, evRes] = await Promise.all([
      api.get(`/registrations/event/${route.params.id}`),
      api.get(`/events/${route.params.id}`)
    ])
    attendees.value = regRes.data
    eventTitle.value = evRes.data?.title
  } catch {
    eventTitle.value = 'Tech Startup Meetup'
    attendees.value = [
      { registrationID: 1, userName: 'Alice K', userEmail: 'alice@example.com', registeredAt: '2026-04-10', status: 'Confirmed' },
      { registrationID: 2, userName: 'Bob R', userEmail: 'bob@example.com', registeredAt: '2026-04-11', status: 'Confirmed' },
      { registrationID: 3, userName: 'Claire N', userEmail: 'claire@example.com', registeredAt: '2026-04-12', status: 'Waitlisted' },
    ]
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; margin-top: 4px; }
.sub { font-size: 13px; color: var(--muted); margin-top: 4px; }
.back-link { font-size: 13px; color: var(--blue); font-weight: 500; display: inline-block; margin-bottom: 6px; }

.loading { text-align: center; color: var(--muted); padding: 60px 0; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.stat-card { background: var(--white); border-radius: var(--card-radius); box-shadow: var(--shadow); padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-num { font-size: 26px; font-weight: 700; color: var(--blue); }
.stat-label { font-size: 12px; color: var(--muted); }

.table-card { background: var(--white); border-radius: var(--card-radius); box-shadow: var(--shadow); padding: 20px; }
.table-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.table-header h3 { font-size: 16px; font-weight: 700; }

.search-input { padding: 8px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-family: 'Inter', sans-serif; outline: none; width: 260px; }
.search-input:focus { border-color: var(--blue); }

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; border-bottom: 1px solid var(--border); }
.data-table td { padding: 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: var(--bg); }

.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--blue); color: white; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.username { font-weight: 600; }
.muted-cell { color: var(--muted); }

.status-badge { padding: 3px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.status-badge.confirmed { background: #d1fae5; color: #065f46; }
.status-badge.cancelled { background: #fee2e2; color: #991b1b; }
.status-badge.waitlisted { background: #fef3c7; color: #92400e; }

.empty-state { text-align: center; color: var(--muted); padding: 40px 0; font-size: 14px; }

@media (max-width: 768px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
</style>
