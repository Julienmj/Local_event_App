<template>
  <div class="page-content">
    <div class="page-header">
      <div>
        <div class="page-title">Good {{ greeting }}, {{ userName }} 👋</div>
        <div class="page-sub">{{ currentDate }}</div>
      </div>
      <RouterLink v-if="authStore.isOrganizer" to="/app/create" class="btn btn-amber">+ Create Event</RouterLink>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon">📅</div>
        <div class="kpi-num">{{ eventsStore.events.length }}</div>
        <div class="kpi-label">Events available</div>
        <div class="kpi-trend trend-up">↑ 12 this week</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">🎟️</div>
        <div class="kpi-num">{{ eventsStore.registrations.length }}</div>
        <div class="kpi-label">My Registrations</div>
        <div class="kpi-trend" style="color:var(--ink3)">Your bookings</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">🔖</div>
        <div class="kpi-num">{{ eventsStore.savedIds.length }}</div>
        <div class="kpi-label">Saved events</div>
        <div class="kpi-trend" style="color:var(--ink3)">Your collection</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">🔔</div>
        <div class="kpi-num">{{ eventsStore.unreadCount }}</div>
        <div class="kpi-label">Unread notifications</div>
        <div class="kpi-trend" style="color:var(--a600)">Tap to view</div>
      </div>
    </div>

    <div class="section-row">
      <div class="section-label">Trending Now</div>
      <RouterLink to="/app/events" class="btn btn-ghost" style="font-size:12px;padding:6px 14px">View all →</RouterLink>
    </div>
    <div class="events-grid">
      <EventCard
        v-for="ev in trendingEvents"
        :key="ev.id || ev.eventID"
        :event="ev"
        :is-saved="eventsStore.isSaved(ev.id)"
        @open="selectedEvent = $event"
        @save="eventsStore.toggleSave($event)"
      />
      <div v-if="!trendingEvents.length" class="empty" style="grid-column:1/-1">
        <h3>No events yet</h3>
        <p>Events will appear here once loaded.</p>
      </div>
    </div>

    <div class="section-row">
      <div class="section-label">Coming Up</div>
    </div>
    <div class="upcoming-list">
      <div
        v-for="ev in upcomingEvents"
        :key="ev.id || ev.eventID"
        class="upcoming-item"
        @click="selectedEvent = ev"
      >
        <div class="date-block">
          <div class="date-mon">{{ formatMonth(ev.eventDate) }}</div>
          <div class="date-day">{{ formatDay(ev.eventDate) }}</div>
        </div>
        <div class="upcoming-info">
          <div class="upcoming-title">{{ ev.title }}</div>
          <div class="upcoming-sub">{{ ev.eventTime || '' }} · {{ ev.venue?.name || ev.venueName || '' }}</div>
        </div>
        <button class="btn btn-outline-amber" style="font-size:12px;padding:6px 12px">Details</button>
      </div>
      <div v-if="!upcomingEvents.length" class="empty">
        <p>No upcoming events.</p>
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
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import EventCard from '@/components/EventCard.vue'
import EventModal from '@/components/EventModal.vue'

const authStore = useAuthStore()
const eventsStore = useEventsStore()
const selectedEvent = ref(null)

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
})

const userName = computed(() => (authStore.user?.fullName || '').split(' ')[0] || 'there')

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
)

const trendingEvents = computed(() => eventsStore.events.slice(0, 6))
const upcomingEvents = computed(() => eventsStore.events.slice(0, 4))

const formatMonth = (d) => d ? new Date(d).toLocaleDateString('en', { month: 'short' }) : 'TBA'
const formatDay = (d) => d ? new Date(d).getDate() : '--'
</script>

<style scoped>
.page-content { padding: 28px 30px; overflow-y: auto; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 26px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--ink); margin-bottom: 4px; letter-spacing: -0.025em; }
.page-sub { font-size: 13px; color: var(--ink3); font-weight: 300; }
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.kpi-card { background: var(--surface); border-radius: var(--radius-lg); padding: 18px; border: 1px solid var(--border); position: relative; overflow: hidden; transition: box-shadow .2s; }
.kpi-card:hover { box-shadow: var(--shadow); }
.kpi-card::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--a400), var(--a200)); }
.kpi-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--a100); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; margin-bottom: 12px; }
.kpi-num { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--ink); line-height: 1; margin-bottom: 3px; }
.kpi-label { font-size: 12px; color: var(--ink3); }
.kpi-trend { font-size: 11px; margin-top: 6px; display: flex; align-items: center; gap: 3px; font-weight: 500; }
.trend-up { color: var(--teal); }
.section-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.section-label { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 700; color: var(--ink); }
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
.upcoming-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.upcoming-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 12px 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all .2s; }
.upcoming-item:hover { border-color: var(--a300); box-shadow: var(--shadow); }
.date-block { width: 44px; height: 46px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; background: var(--a100); }
.date-mon { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--a700); }
.date-day { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 700; line-height: 1; color: var(--ink); }
.upcoming-info { flex: 1; min-width: 0; }
.upcoming-title { font-weight: 500; font-size: 13.5px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--ink); }
.upcoming-sub { font-size: 11.5px; color: var(--ink3); }
@media (max-width: 900px) { .kpi-grid { grid-template-columns: 1fr 1fr; } }
</style>
