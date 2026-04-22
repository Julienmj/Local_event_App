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
          <button class="row-btn danger" @click="confirmDelete(ev)">Delete</button>
        </div>
      </div>
    </div>
    <div v-else class="empty">
      <h3>No events yet</h3>
      <p>Create your first event to get started.</p>
      <RouterLink to="/app/create" class="btn btn-amber">Create Event</RouterLink>
    </div>

    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      :is-saved="eventsStore.isSaved(selectedEvent.id)"
      :reviews="[]"
      @close="selectedEvent = null"
      @save="eventsStore.toggleSave($event)"
      @registered="() => {}"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import EventModal from '@/components/EventModal.vue'

const eventsStore = useEventsStore()
const auth = useAuthStore()
const { show } = useToast()
const selectedEvent = ref(null)

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
.events-table-cols { grid-template-columns: 2.2fr 1fr 1fr 1fr 90px; }
.table-actions { display: flex; gap: 5px; }
.row-btn { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 500; cursor: pointer; border: 1.5px solid var(--border2); background: transparent; color: var(--ink2); font-family: 'Plus Jakarta Sans', sans-serif; transition: all .15s; }
.row-btn:hover { background: var(--cream2); }
.row-btn.danger { color: var(--red); }
.row-btn.danger:hover { background: var(--red-pale); border-color: var(--red); }
</style>
