<template>
  <div class="content-main">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:26px">
      <div>
        <h1 class="page-title">My Events</h1>
        <p class="page-sub">Events you've created and manage</p>
      </div>
      <RouterLink to="/app/create" class="btn btn-amber">+ Create Event</RouterLink>
    </div>

    <div v-if="myEvents.length" class="data-table">
      <div class="table-head events-table-cols">
        <span>Event</span><span>Date</span><span>Attendees</span><span>Status</span><span>Actions</span>
      </div>
      <div
        v-for="ev in myEvents"
        :key="ev.id || ev.eventID"
        class="table-row-el events-table-cols"
      >
        <div>
          <div style="font-weight:500;font-size:13.5px;color:var(--ink)">{{ ev.title }}</div>
          <div style="font-size:11.5px;color:var(--ink3)">{{ ev.venue?.name || ev.venueName }}</div>
        </div>
        <div style="font-size:13px;color:var(--ink2)">{{ formatDate(ev.eventDate) }}</div>
        <div style="font-size:13px;color:var(--ink2)">{{ ev.attendeesCount || 0 }} / {{ ev.maxAttendees || ev.capacity }}</div>
        <span class="pill" :class="statusClass(ev.status)">{{ ev.status }}</span>
        <div class="table-actions">
          <button class="row-btn" @click="selectedEvent = ev">View</button>
          <button class="row-btn" @click="openEdit(ev)">Edit</button>
          <button class="row-btn danger" @click="confirmDelete(ev)">Delete</button>
        </div>
      </div>
    </div>
    <div v-else class="empty">
      <h3>No events yet</h3>
      <p>Create your first event to get started.</p>
      <RouterLink to="/app/create" class="btn btn-amber">Create Event</RouterLink>
    </div>

    <!-- Edit Modal -->
    <div v-if="editModal.show" class="modal-overlay" @click.self="editModal.show = false">
      <div class="modal-box" style="padding:28px;max-width:560px">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:700;margin-bottom:20px">Edit Event</div>
        <div class="form-group">
          <label class="form-label">Title</label>
          <input v-model="editModal.form.title" class="form-input" type="text"/>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input v-model="editModal.form.date" class="form-input" type="date"/>
          </div>
          <div class="form-group">
            <label class="form-label">Time</label>
            <input v-model="editModal.form.time" class="form-input" type="time"/>
          </div>
          <div class="form-group">
            <label class="form-label">Price (RWF)</label>
            <input v-model.number="editModal.form.price" class="form-input" type="number" min="0"/>
          </div>
          <div class="form-group">
            <label class="form-label">Capacity</label>
            <input v-model.number="editModal.form.capacity" class="form-input" type="number" min="1"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea v-model="editModal.form.description" class="form-input textarea"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select v-model="editModal.form.status" class="form-input">
            <option value="Pending">Pending</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="past">Past</option>
          </select>
        </div>
        <div v-if="editError" class="error-msg">{{ editError }}</div>
        <div style="display:flex;gap:10px;margin-top:8px">
          <button class="btn btn-amber" :disabled="editLoading" @click="saveEdit">
            <span v-if="editLoading" class="loading-spinner"></span>
            <span v-else>Save Changes</span>
          </button>
          <button class="btn btn-ghost" @click="editModal.show = false">Cancel</button>
        </div>
      </div>
    </div>

    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      :is-saved="eventsStore.isSaved(selectedEvent.id)"
      @close="selectedEvent = null"
      @save="eventsStore.toggleSave($event)"
      @registered="() => {}"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import EventModal from '@/components/EventModal.vue'

const eventsStore = useEventsStore()
const auth = useAuthStore()
const { show } = useToast()
const selectedEvent = ref(null)
const editLoading = ref(false)
const editError = ref('')

const editModal = reactive({
  show: false,
  eventId: null,
  form: { title: '', date: '', time: '', price: 0, capacity: 100, description: '', status: 'upcoming' }
})

function openEdit(ev) {
  const d = ev.eventDate ? new Date(ev.eventDate) : null
  editModal.eventId = ev.id || ev.eventID
  editModal.form = {
    title: ev.title || '',
    date: d ? d.toISOString().slice(0, 10) : '',
    time: ev.eventTime || (d ? d.toTimeString().slice(0, 5) : ''),
    price: ev.price || 0,
    capacity: ev.maxAttendees || ev.capacity || 100,
    description: ev.description || '',
    status: ev.status || 'upcoming'
  }
  editError.value = ''
  editModal.show = true
}

async function saveEdit() {
  editError.value = ''
  editLoading.value = true
  try {
    await eventsStore.updateEvent(editModal.eventId, {
      title: editModal.form.title,
      description: editModal.form.description,
      eventDate: new Date(`${editModal.form.date}T${editModal.form.time}`).toISOString(),
      price: editModal.form.price,
      maxAttendees: editModal.form.capacity,
      status: editModal.form.status
    })
    show('Event updated!', '✅')
    editModal.show = false
  } catch (e) {
    editError.value = e.message || 'Failed to update event.'
  } finally {
    editLoading.value = false
  }
}

const myEvents = computed(() => {
  const uid = auth.user?.id || auth.user?.userID
  return eventsStore.events.filter(e => e.organizerID === uid)
})

function formatDate(d) {
  if (!d) return 'TBA'
  return new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusClass(s) {
  return { live: 'pill-live', upcoming: 'pill-upcoming', draft: 'pill-draft', past: 'pill-past' }[s] || 'pill-draft'
}

async function confirmDelete(ev) {
  const id = ev.id || ev.eventID
  if (confirm(`Delete "${ev.title}"?`)) {
    try {
      await eventsStore.deleteEvent(id)
      show('Event deleted.', '🗑️')
    } catch (e) {
      show(e.message || 'Failed to delete event.', '⚠️')
    }
  }
}
</script>

<style scoped>
.content-main { padding: 28px 30px; overflow-y: auto; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.page-sub { font-size: 13px; color: var(--ink3); font-weight: 300; }
.data-table { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; margin-bottom: 22px; }
.table-head { background: var(--cream2); border-bottom: 1px solid var(--border); padding: 9px 16px; font-size: 11px; font-weight: 600; color: var(--ink4); letter-spacing: .07em; text-transform: uppercase; display: grid; }
.table-row-el { padding: 13px 16px; border-bottom: 1px solid var(--border); align-items: center; transition: background .15s; cursor: pointer; display: grid; }
.table-row-el:last-child { border-bottom: none; }
.table-row-el:hover { background: var(--a50); }
.events-table-cols { grid-template-columns: 2.2fr 1fr 1fr 1fr 120px; }
.table-actions { display: flex; gap: 5px; }
.row-btn { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 500; cursor: pointer; border: 1.5px solid var(--border2); background: transparent; color: var(--ink2); font-family: 'Plus Jakarta Sans', sans-serif; transition: all .15s; }
.row-btn:hover { background: var(--cream2); }
.row-btn.danger { color: var(--red); }
.row-btn.danger:hover { background: var(--red-pale); border-color: var(--red); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
</style>
