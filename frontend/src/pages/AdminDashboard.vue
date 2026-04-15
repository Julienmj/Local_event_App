<template>
  <AppLayout>
    <div class="page-header">
      <div>
        <h1>Admin Dashboard</h1>
        <p class="sub">Manage users and events</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-num">{{ users.length }}</span>
        <span class="stat-label">Total Users</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ events.length }}</span>
        <span class="stat-label">Total Events</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ organizerCount }}</span>
        <span class="stat-label">Organizers</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ totalAttendees }}</span>
        <span class="stat-label">Total Attendees</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button :class="['tab', { active: tab === 'users' }]" @click="tab = 'users'">👥 Users</button>
      <button :class="['tab', { active: tab === 'events' }]" @click="tab = 'events'">📅 Events</button>
    </div>

    <!-- Users Tab -->
    <div v-if="tab === 'users'" class="table-card">
      <div class="table-header">
        <h3>All Users</h3>
        <input v-model="userSearch" class="search-input" placeholder="Search users..." />
      </div>
      <div v-if="loadingUsers" class="loading">Loading users...</div>
      <table v-else-if="filteredUsers.length" class="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-cell">
                <div class="avatar">{{ user.username?.charAt(0).toUpperCase() }}</div>
                <span class="username">{{ user.username }}</span>
              </div>
            </td>
            <td class="muted-cell">{{ user.email }}</td>
            <td>
              <select
                :value="user.role"
                @change="changeRole(user, $event.target.value)"
                :class="['role-select', user.role.toLowerCase()]"
              >
                <option value="Attendee">Attendee</option>
                <option value="Organizer">Organizer</option>
                <option value="Admin">Admin</option>
              </select>
            </td>
            <td>
              <button class="icon-btn delete" @click="confirmDeleteUser(user)" title="Delete user">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">No users found.</div>
    </div>

    <!-- Events Tab -->
    <div v-if="tab === 'events'" class="table-card">
      <div class="table-header">
        <h3>All Events</h3>
        <input v-model="eventSearch" class="search-input" placeholder="Search events..." />
      </div>
      <div v-if="loadingEvents" class="loading">Loading events...</div>
      <table v-else-if="filteredEvents.length" class="data-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Organizer</th>
            <th>Date</th>
            <th>Category</th>
            <th>Attendees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in filteredEvents" :key="event.id">
            <td>
              <div class="event-cell">
                <img :src="event.imageUrl || fallback" class="event-thumb" />
                <span class="event-name">{{ event.title }}</span>
              </div>
            </td>
            <td class="muted-cell">{{ event.organizer || '—' }}</td>
            <td class="muted-cell" style="white-space:nowrap">{{ formatDate(event.date) }}</td>
            <td><span class="badge">{{ event.category }}</span></td>
            <td class="muted-cell">{{ event.attendeeCount ?? 0 }}</td>
            <td>
              <button class="icon-btn delete" @click="confirmDeleteEvent(event)" title="Delete event">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">No events found.</div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal">
        <h3>Confirm Delete</h3>
        <p class="delete-msg">
          Are you sure you want to delete
          <strong>{{ deleteTarget.username || deleteTarget.title }}</strong>?
          This cannot be undone.
        </p>
        <div class="modal-actions">
          <button class="btn-ghost" @click="deleteTarget = null">Cancel</button>
          <button class="btn-danger" @click="executeDelete" :disabled="submitting">
            {{ submitting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import api from '../api'

const tab = ref('users')
const users = ref([])
const events = ref([])
const loadingUsers = ref(true)
const loadingEvents = ref(true)
const userSearch = ref('')
const eventSearch = ref('')
const deleteTarget = ref(null)
const deleteType = ref('')
const submitting = ref(false)
const fallback = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=60'

const filteredUsers = computed(() =>
  users.value.filter(u => u.username?.toLowerCase().includes(userSearch.value.toLowerCase()))
)
const filteredEvents = computed(() =>
  events.value.filter(e => e.title?.toLowerCase().includes(eventSearch.value.toLowerCase()))
)
const organizerCount = computed(() => users.value.filter(u => u.role === 'Organizer').length)
const totalAttendees = computed(() => events.value.reduce((s, e) => s + (e.attendeeCount ?? 0), 0))

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function changeRole(user, newRole) {
  try {
    await api.put(`/users/${user.id}/role`, { role: newRole })
    user.role = newRole
  } catch {
    // revert handled by v-model binding
  }
}

function confirmDeleteUser(user) { deleteTarget.value = user; deleteType.value = 'user' }
function confirmDeleteEvent(event) { deleteTarget.value = event; deleteType.value = 'event' }

async function executeDelete() {
  submitting.value = true
  try {
    if (deleteType.value === 'user') {
      await api.delete(`/users/${deleteTarget.value.id}`)
      users.value = users.value.filter(u => u.id !== deleteTarget.value.id)
    } else {
      await api.delete(`/events/${deleteTarget.value.id}`)
      events.value = events.value.filter(e => e.id !== deleteTarget.value.id)
    }
    deleteTarget.value = null
  } catch {
    deleteTarget.value = null
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const res = await api.get('/users')
    users.value = res.data
  } catch {
    users.value = [
      { id: 1, username: 'julien_m', email: 'julien@example.com', role: 'Admin' },
      { id: 2, username: 'fiacre_n', email: 'fiacre@example.com', role: 'Organizer' },
      { id: 3, username: 'claire_k', email: 'claire@example.com', role: 'Attendee' },
      { id: 4, username: 'bienfait_d', email: 'bienfait@example.com', role: 'Attendee' },
      { id: 5, username: 'alice_rw', email: 'alice@example.com', role: 'Organizer' },
    ]
  } finally {
    loadingUsers.value = false
  }

  try {
    const res = await api.get('/events')
    events.value = res.data
  } catch {
    events.value = [
      { id: 1, title: 'Kigali Jazz Night', date: '2026-04-12', location: 'Kigali', category: 'Music & Art', attendeeCount: 142, organizer: 'fiacre_n', imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=200&q=60' },
      { id: 2, title: 'Community Football Tournament', date: '2026-04-13', location: 'Amahoro Stadium', category: 'Sports', attendeeCount: 320, organizer: 'alice_rw', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&q=60' },
      { id: 3, title: 'Tech Startup Meetup', date: '2026-04-15', location: 'Norrsken House', category: 'Tech', attendeeCount: 87, organizer: 'fiacre_n', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=60' },
      { id: 4, title: 'Art Exhibition: Colors of Africa', date: '2026-04-19', location: 'Inema Arts Center', category: 'Music & Art', attendeeCount: 65, organizer: 'alice_rw', imageUrl: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=200&q=60' },
    ]
  } finally {
    loadingEvents.value = false
  }
})
</script>

<style scoped>
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; }
.sub { font-size: 13px; color: var(--muted); margin-top: 4px; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.stat-card { background: var(--white); border-radius: var(--card-radius); box-shadow: var(--shadow); padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-num { font-size: 26px; font-weight: 700; color: var(--blue); }
.stat-label { font-size: 12px; color: var(--muted); }

.tabs { display: flex; gap: 4px; margin-bottom: 16px; background: var(--white); border-radius: 10px; padding: 4px; box-shadow: var(--shadow); width: fit-content; }
.tab { padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; background: transparent; color: var(--muted); cursor: pointer; transition: all 0.2s; }
.tab.active { background: var(--blue); color: white; }

.table-card { background: var(--white); border-radius: var(--card-radius); box-shadow: var(--shadow); padding: 20px; }
.table-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.table-header h3 { font-size: 16px; font-weight: 700; }

.search-input { padding: 8px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-family: 'Inter', sans-serif; outline: none; width: 220px; }
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

.role-select { padding: 5px 10px; border: 1px solid var(--border); border-radius: 999px; font-size: 12px; font-weight: 600; font-family: 'Inter', sans-serif; outline: none; cursor: pointer; transition: all 0.2s; }
.role-select.admin { background: #fef3c7; color: #d97706; border-color: #fcd34d; }
.role-select.organizer { background: #e8f4fd; color: var(--blue); border-color: #bfdbfe; }
.role-select.attendee { background: var(--bg); color: var(--muted); }

.event-cell { display: flex; align-items: center; gap: 10px; }
.event-thumb { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; }
.event-name { font-weight: 600; color: var(--text); }

.badge { background: #e8f4fd; color: var(--blue); border-radius: 999px; padding: 3px 10px; font-size: 11px; font-weight: 600; white-space: nowrap; }

.icon-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--border); background: var(--white); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.icon-btn.delete:hover { border-color: #e0245e; background: #fff0f0; }

.loading, .empty-state { text-align: center; color: var(--muted); padding: 40px 0; font-size: 14px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: var(--white); border-radius: var(--card-radius); padding: 28px; width: 100%; max-width: 400px; }
.modal h3 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.delete-msg { font-size: 14px; color: var(--muted); margin: 12px 0 20px; line-height: 1.5; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
.btn-danger { background: #e0245e; color: white; padding: 10px 20px; border-radius: 999px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; transition: background 0.2s; }
.btn-danger:hover { background: #c01e52; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 768px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
</style>
