<template>
  <AppLayout>
    <div class="page-header">
      <div>
        <h1>Organizer Dashboard</h1>
        <p class="sub">Manage your events</p>
      </div>
      <button class="btn-primary" @click="openModal()">+ Create Event</button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-num">{{ events.length }}</span>
        <span class="stat-label">Total Events</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ totalAttendees }}</span>
        <span class="stat-label">Total Attendees</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ upcomingCount }}</span>
        <span class="stat-label">Upcoming</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{{ pastCount }}</span>
        <span class="stat-label">Past Events</span>
      </div>
    </div>

    <!-- Events Table -->
    <div class="table-card">
      <div class="table-header">
        <h3>Your Events</h3>
        <input v-model="search" class="search-input" placeholder="Search events..." />
      </div>

      <div v-if="loading" class="loading">Loading...</div>

      <table v-else-if="filteredEvents.length" class="events-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Location</th>
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
            <td class="date-cell">{{ formatDate(event.date) }}</td>
            <td class="muted-cell">{{ event.location }}</td>
            <td><span class="badge">{{ event.category }}</span></td>
            <td class="muted-cell">{{ event.attendeeCount ?? 0 }}</td>
            <td>
              <div class="action-btns">
                <button class="icon-btn edit" @click="openModal(event)" title="Edit">✏️</button>
                <button class="icon-btn delete" @click="confirmDelete(event)" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">No events yet. Create your first event!</div>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editing ? 'Edit Event' : 'Create New Event' }}</h3>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="submitEvent" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Title</label>
              <input v-model="form.title" type="text" placeholder="Event title" required />
            </div>
            <div class="form-group">
              <label>Category</label>
              <select v-model="form.category" required>
                <option value="">Select category</option>
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date</label>
              <input v-model="form.date" type="datetime-local" required />
            </div>
            <div class="form-group">
              <label>Location</label>
              <input v-model="form.location" type="text" placeholder="Event location" required />
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" placeholder="Describe your event..." rows="3" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Image URL</label>
              <input v-model="form.imageUrl" type="url" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>Price ($)</label>
              <input v-model="form.price" type="number" min="0" placeholder="0 for free" />
            </div>
          </div>

          <div v-if="formError" class="error-msg">{{ formError }}</div>

          <div class="modal-actions">
            <button type="button" class="btn-ghost" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? 'Saving...' : editing ? 'Save Changes' : 'Create Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal modal-sm">
        <h3>Delete Event</h3>
        <p class="delete-msg">Are you sure you want to delete <strong>{{ deleteTarget.title }}</strong>? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn-ghost" @click="deleteTarget = null">Cancel</button>
          <button class="btn-danger" @click="deleteEvent" :disabled="submitting">
            {{ submitting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import api from '../api'

const events = ref([])
const loading = ref(true)
const search = ref('')
const showModal = ref(false)
const editing = ref(null)
const deleteTarget = ref(null)
const submitting = ref(false)
const formError = ref('')
const fallback = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=60'

const categories = ['Music & Art', 'Sports', 'Food & Drink', 'Tech', 'Community', 'Education']

const form = reactive({ title: '', category: '', date: '', location: '', description: '', imageUrl: '', price: 0 })

const filteredEvents = computed(() =>
  events.value.filter(e => e.title.toLowerCase().includes(search.value.toLowerCase()))
)
const totalAttendees = computed(() => events.value.reduce((s, e) => s + (e.attendeeCount ?? 0), 0))
const upcomingCount = computed(() => events.value.filter(e => new Date(e.date) >= new Date()).length)
const pastCount = computed(() => events.value.filter(e => new Date(e.date) < new Date()).length)

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function openModal(event = null) {
  formError.value = ''
  if (event) {
    editing.value = event
    Object.assign(form, { ...event, date: event.date?.slice(0, 16) })
  } else {
    editing.value = null
    Object.assign(form, { title: '', category: '', date: '', location: '', description: '', imageUrl: '', price: 0 })
  }
  showModal.value = true
}

function closeModal() { showModal.value = false; editing.value = null }

function confirmDelete(event) { deleteTarget.value = event }

async function submitEvent() {
  submitting.value = true
  formError.value = ''
  try {
    if (editing.value) {
      await api.put(`/events/${editing.value.id}`, form)
      const idx = events.value.findIndex(e => e.id === editing.value.id)
      events.value[idx] = { ...events.value[idx], ...form }
    } else {
      const res = await api.post('/events', form)
      events.value.unshift(res.data)
    }
    closeModal()
  } catch (e) {
    formError.value = e.response?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}

async function deleteEvent() {
  submitting.value = true
  try {
    await api.delete(`/events/${deleteTarget.value.id}`)
    events.value = events.value.filter(e => e.id !== deleteTarget.value.id)
    deleteTarget.value = null
  } catch {
    deleteTarget.value = null
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const res = await api.get('/events/my')
    events.value = res.data
  } catch {
    events.value = [
      { id: 1, title: 'Kigali Jazz Night', date: '2026-04-12', location: 'Kigali, Rwanda', category: 'Music & Art', attendeeCount: 142, imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=200&q=60' },
      { id: 2, title: 'Community Football Tournament', date: '2026-04-13', location: 'Amahoro Stadium', category: 'Sports', attendeeCount: 320, imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&q=60' },
      { id: 3, title: 'Tech Startup Meetup', date: '2026-04-15', location: 'Norrsken House', category: 'Tech', attendeeCount: 87, imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=60' },
    ]
  } finally {
    loading.value = false
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

.table-card { background: var(--white); border-radius: var(--card-radius); box-shadow: var(--shadow); padding: 20px; }
.table-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.table-header h3 { font-size: 16px; font-weight: 700; }

.search-input { padding: 8px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-family: 'Inter', sans-serif; outline: none; width: 220px; }
.search-input:focus { border-color: var(--blue); }

.events-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.events-table th { text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; border-bottom: 1px solid var(--border); }
.events-table td { padding: 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.events-table tr:last-child td { border-bottom: none; }
.events-table tr:hover td { background: var(--bg); }

.event-cell { display: flex; align-items: center; gap: 10px; }
.event-thumb { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; }
.event-name { font-weight: 600; color: var(--text); }
.date-cell { font-weight: 500; color: var(--text); white-space: nowrap; }
.muted-cell { color: var(--muted); }

.badge { background: #e8f4fd; color: var(--blue); border-radius: 999px; padding: 3px 10px; font-size: 11px; font-weight: 600; white-space: nowrap; }

.action-btns { display: flex; gap: 6px; }
.icon-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--border); background: var(--white); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.icon-btn.edit:hover { border-color: var(--blue); background: #e8f4fd; }
.icon-btn.delete:hover { border-color: #e0245e; background: #fff0f0; }

.loading, .empty-state { text-align: center; color: var(--muted); padding: 40px 0; font-size: 14px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: var(--white); border-radius: var(--card-radius); padding: 28px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
.modal-sm { max-width: 400px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.modal-header h3 { font-size: 18px; font-weight: 700; }
.close-btn { background: none; border: none; font-size: 16px; cursor: pointer; color: var(--muted); padding: 4px; }

.modal-form { display: flex; flex-direction: column; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 12px; font-weight: 600; color: var(--text); }
.form-group input, .form-group select, .form-group textarea { padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-family: 'Inter', sans-serif; outline: none; transition: border 0.2s; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--blue); }
.form-group textarea { resize: vertical; }

.error-msg { background: #fff0f0; color: #e0245e; border-radius: 8px; padding: 10px 14px; font-size: 13px; }
.delete-msg { font-size: 14px; color: var(--muted); margin: 12px 0 20px; line-height: 1.5; }

.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px; }
.btn-danger { background: #e0245e; color: white; padding: 10px 20px; border-radius: 999px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; transition: background 0.2s; }
.btn-danger:hover { background: #c01e52; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 768px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .form-row { grid-template-columns: 1fr; }
}
</style>
