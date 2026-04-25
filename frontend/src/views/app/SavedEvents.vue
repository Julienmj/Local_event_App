<template>
  <div class="content-main">
    <div class="page-header">
      <h1 class="page-title">My Events</h1>
      <p class="page-sub">Your bookings and saved events</p>
    </div>

    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'bookings' }" @click="tab = 'bookings'">
        <i class="ph ph-ticket"></i> My Bookings
        <span v-if="bookedEvents.length" class="tab-badge">{{ bookedEvents.length }}</span>
      </button>
      <button class="tab" :class="{ active: tab === 'saved' }" @click="tab = 'saved'">
        <i class="ph ph-bookmark-simple"></i> Saved
        <span v-if="saved.length" class="tab-badge">{{ saved.length }}</span>
      </button>
    </div>

    <div v-if="tab === 'bookings'">
      <div v-if="bookedEvents.length" class="bookings-list">
        <div v-for="item in bookedEvents" :key="item.reg.id" class="booking-card" @click="selectedEvent = item.event">
          <div class="booking-img" :style="item.event?.imageUrl ? {} : { background: item.event?.color }">
            <img v-if="item.event?.imageUrl" :src="item.event.imageUrl" alt=""/>
            <i v-else class="ph ph-calendar-star" style="font-size:1.6rem;color:var(--accent)"></i>
          </div>
          <div class="booking-info">
            <div class="booking-title">{{ item.event?.title || 'Event' }}</div>
            <div class="booking-meta">
              <i class="ph ph-calendar-blank"></i> {{ formatDate(item.event?.eventDate) }}
              &nbsp;·&nbsp;
              <i class="ph ph-map-pin"></i> {{ item.event?.venue?.name || item.event?.venueName || 'TBD' }}
            </div>
            <div class="booking-meta">
              <i class="ph ph-ticket"></i> {{ item.event?.price ? 'RWF ' + Number(item.event.price).toLocaleString() : 'Free' }}
            </div>
          </div>
          <div class="booking-status">
            <span class="pill pill-live"><i class="ph ph-check-circle"></i> Confirmed</span>
            <button class="btn btn-ghost cancel-btn" @click.stop="cancelBooking(item.reg)">Cancel</button>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <h3>No bookings yet</h3>
        <p>Browse events and click "Book Now" to register.</p>
        <RouterLink to="/app/events" class="btn btn-amber">Browse Events</RouterLink>
      </div>
    </div>

    <div v-if="tab === 'saved'">
      <div v-if="saved.length" class="events-grid">
        <EventCard
          v-for="ev in saved"
          :key="ev.id"
          :event="ev"
          :is-saved="true"
          @open="selectedEvent = $event"
          @save="eventsStore.toggleSave($event)"
        />
      </div>
      <div v-else class="empty">
        <h3>No saved events yet</h3>
        <p>Browse events and tap the bookmark icon to save them here.</p>
        <RouterLink to="/app/events" class="btn btn-amber">Browse Events</RouterLink>
      </div>
    </div>

    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      :is-saved="eventsStore.isSaved(selectedEvent.id)"
      @close="selectedEvent = null"
      @save="eventsStore.toggleSave($event)"
      @registered="eventsStore.addNotification('Registration confirmed for ' + selectedEvent?.title)"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import EventCard from '@/components/EventCard.vue'
import EventModal from '@/components/EventModal.vue'

const eventsStore = useEventsStore()
const auth = useAuthStore()
const { show } = useToast()
const selectedEvent = ref(null)
const tab = ref('bookings')

const saved = computed(() => eventsStore.events.filter(e => eventsStore.isSaved(e.id || e.eventID)))

const bookedEvents = computed(() =>
  eventsStore.registrations
    .filter(r => r.userID === auth.user?.id || r.userId === auth.user?.id)
    .map(reg => ({ reg, event: eventsStore.events.find(e => e.id === (reg.eventID || reg.eventId)) }))
    .filter(item => item.event)
)

function formatDate(d) {
  if (!d) return 'TBA'
  return new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function cancelBooking(reg) {
  if (!confirm('Cancel this booking?')) return
  try {
    await eventsStore.cancelRegistration(reg.id || reg.registrationID)
    show('Booking cancelled.', '✅')
  } catch (e) {
    show(e.message || 'Failed to cancel booking.', '⚠️')
  }
}
</script>

<style scoped>
.content-main { padding: 28px 30px; overflow-y: auto; }
.page-header { margin-bottom: 20px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.page-sub { font-size: 13px; color: var(--text3); font-weight: 300; }
.tabs { display: flex; gap: 4px; background: var(--surface2); border-radius: 99px; padding: 4px; width: fit-content; margin-bottom: 24px; }
.tab { padding: 8px 20px; border-radius: 99px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: var(--text3); cursor: pointer; transition: all .18s; display: flex; align-items: center; gap: 6px; font-family: 'Plus Jakarta Sans', sans-serif; }
.tab.active { background: var(--surface3); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,.2); }
.tab-badge { background: var(--accent); color: #fff; font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 99px; }
.bookings-list { display: flex; flex-direction: column; gap: 12px; }
.booking-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 14px 18px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all .2s; }
.booking-card:hover { border-color: var(--accent); background: var(--surface2); }
.booking-img { width: 60px; height: 60px; border-radius: var(--radius); overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--surface2); }
.booking-img img { width: 100%; height: 100%; object-fit: cover; }
.booking-info { flex: 1; min-width: 0; }
.booking-title { font-weight: 600; font-size: 14px; color: var(--text); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.booking-meta { font-size: 12px; color: var(--text3); margin-bottom: 2px; display: flex; align-items: center; gap: 4px; }
.booking-status { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
.cancel-btn { font-size: 11px; padding: 5px 12px; color: var(--err); border-color: var(--err); }
.cancel-btn:hover { background: var(--err-bg); }
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
</style>
