<template>
  <div class="page-wrapper">
    <AdminSidebar />
    <div class="main-content">
      <h4 class="fw-bold mb-1">Manage Users</h4>
      <p class="text-muted mb-4">View and manage all platform users</p>

      <div class="d-flex gap-2 mb-3 flex-wrap">
        <select v-model="filterRole" class="form-select form-select-sm" style="width:160px">
          <option value="">All Roles</option>
          <option>Attendee</option><option>Organizer</option><option>Admin</option>
        </select>
        <input v-model="search" type="text" class="form-control form-control-sm" style="width:220px" placeholder="Search by name or email..." />
        <button class="btn btn-outline-success btn-sm ms-auto" @click="exportCSV">
          <i class="bi bi-download me-1"></i>Export CSV
        </button>
      </div>

      <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

      <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <table class="table table-custom mb-0">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="5" class="text-center text-muted py-4">No users found.</td>
            </tr>
            <tr v-for="u in filtered" :key="u.userID">
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style="width:34px;height:34px;font-size:.8rem;background:linear-gradient(135deg,#4f46e5,#06b6d4);flex-shrink:0">
                    {{ initials(u.fullName) }}
                  </div>
                  <span class="fw-semibold small">{{ u.fullName }}</span>
                </div>
              </td>
              <td class="small text-muted">{{ u.email }}</td>
              <td>
                <span class="badge rounded-pill px-3" :class="roleClass(u.role)">{{ u.role }}</span>
              </td>
              <td class="small text-muted">{{ formatDate(u.createdAt) }}</td>
              <td>
                <button class="btn btn-sm btn-outline-danger" @click="deleteUser(u)"><i class="bi bi-trash"></i></button>
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
import { usersAPI } from '../../services/api'
import AdminSidebar from './AdminSidebar.vue'

const users = ref([])
const loading = ref(true)
const filterRole = ref('')
const search = ref('')

onMounted(async () => {
  try { const res = await usersAPI.getAll(); users.value = res.data }
  finally { loading.value = false }
})

const filtered = computed(() => users.value.filter(u => {
  const matchRole = !filterRole.value || u.role === filterRole.value
  const matchSearch = !search.value || u.fullName.toLowerCase().includes(search.value.toLowerCase()) || u.email.toLowerCase().includes(search.value.toLowerCase())
  return matchRole && matchSearch
}))

async function deleteUser(u) {
  if (!confirm(`Delete user "${u.fullName}"? This cannot be undone.`)) return
  await usersAPI.remove(u.userID)
  users.value = users.value.filter(x => x.userID !== u.userID)
}

function initials(name) { return (name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }
function roleClass(r) {
  return { 'bg-danger text-white': r === 'Admin', 'bg-primary text-white': r === 'Organizer', 'bg-light text-dark': r === 'Attendee' }
}
function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }

function exportCSV() {
  const rows = [['Name', 'Email', 'Role', 'Joined'], ...filtered.value.map(u => [u.fullName, u.email, u.role, u.createdAt])]
  const csv = rows.map(r => r.join(',')).join('\n')
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'users.csv'; a.click()
}
</script>
