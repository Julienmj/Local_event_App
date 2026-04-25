<template>
  <div class="content-with-aside">
    <div class="content-main">
      <div class="page-header">
        <h1 class="page-title">Good {{ greeting }}, {{ auth.user?.fullName?.split(' ')[0] || 'there' }}</h1>
        <p class="page-sub">Here's what's happening in your EventLocal world today.</p>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card">
          <div class="kpi-icon"><i :class="['ph', kpi.icon]"></i></div>
          <div class="kpi-num">{{ kpi.value }}</div>
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-trend" :class="kpi.up ? 'trend-up' : 'trend-dn'">
            <i :class="kpi.up ? 'ph ph-trend-up' : 'ph ph-trend-down'"></i> {{ kpi.trend }}
          </div>
        </div>
      </div>

      <!-- My Bookings Summary -->
      <div class="bookings-summary">
        <div class="summary-card">
          <div class="summary-icon"><i class="ph ph-ticket"></i></div>
          <div class="summary-content">
            <div class="summary-title">Total Bookings</div>
            <div class="summary-value">{{ savedEvents.length }}</div>
            <div class="summary-sub">Events you're registered for</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon"><i class="ph ph-calendar-check"></i></div>
          <div class="summary-content">
            <div class="summary-title">Upcoming</div>
            <div class="summary-value">{{ upcomingCount }}</div>
            <div class="summary-sub">Events in the next 7 days</div>
          </div>
        </div>
      </div>

      <!-- Popular Events -->
      <div class="popular-events">
        <div class="section-label">Popular Events This Week</div>
        <div class="popular-grid">
          <div v-for="event in popularEvents.slice(0, 4)" :key="event.id" class="popular-card" @click="openModal(event)">
            <div class="popular-image">
              <img v-if="event.imageUrl" :src="event.imageUrl" :alt="event.title" class="popular-img" />
              <i v-else class="ph ph-calendar-blank"></i>
            </div>
            <div class="popular-info">
              <div class="popular-title">{{ event.title }}</div>
              <div class="popular-meta">{{ event.venue?.name || event.venueName }}</div>
              <div class="popular-date">{{ formatDate(event.eventDate) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="section-row" style="margin-top:24px">
        <div class="section-label">Upcoming Events</div>
        <RouterLink :to="'/attendee/events'" class="btn btn-ghost" style="font-size:12px;padding:6px 14px">View all</RouterLink>
      </div>
      <div class="upcoming-list">
        <div
          v-for="ev in upcomingEvents"
          :key="ev.id || ev.eventID"
          class="upcoming-item"
          @click="openModal(ev)"
        >
          <div class="date-block">
            <div class="date-mon">{{ formatMon(ev.eventDate) }}</div>
            <div class="date-day">{{ formatDay(ev.eventDate) }}</div>
          </div>
          <div class="upcoming-info">
            <div class="upcoming-title">{{ ev.title }}</div>
            <div class="upcoming-sub">{{ ev.venue?.name || ev.venueName }} · {{ formatTime(ev.eventDate, ev.eventTime) }}</div>
          </div>
          <span class="pill" :class="ev.status === 'live' ? 'pill-live' : 'pill-upcoming'">
            {{ ev.status === 'live' ? 'Live' : 'Upcoming' }}
          </span>
          <span class="pill" :class="ev.price ? 'pill-paid' : 'pill-free'">
            {{ ev.price ? 'Paid' : 'Free' }}
          </span>
        </div>
        <div v-if="!upcomingEvents.length" class="empty">No upcoming events found.</div>
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import EventModal from '@/components/EventModal.vue'

const auth = useAuthStore()
const eventsStore = useEventsStore()
const selectedEvent = ref(null)

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
})

const upcomingEvents = computed(() => {
  if (auth.isOrganizer) {
    const uid = auth.user?.id || auth.user?.userID
    return eventsStore.events.filter(e => e.organizerID === uid).slice(0, 5)
  }
  return eventsStore.events.slice(0, 5)
})

const kpis = computed(() => [
  {
    icon: 'ph-calendar-blank',
    value: eventsStore.stats?.totalEvents || eventsStore.events.length,
    label: auth.isOrganizer ? 'Events Managed' : 'Events Near You',
    trend: '+12% this month', up: true
  },
  {
    icon: 'ph-ticket',
    value: auth.isOrganizer
      ? (eventsStore.stats?.totalAttendees || eventsStore.events.reduce((s, e) => s + (e.attendeesCount || 0), 0))
      : eventsStore.registrations.length,
    label: auth.isOrganizer ? 'Total Reach' : 'My Registrations',
    trend: '+8% this month', up: true
  },
  { icon: 'ph-bookmark-simple', value: eventsStore.savedIds.length, label: 'Saved Events', trend: 'Your wishlist', up: true },
  { icon: 'ph-bell', value: eventsStore.unreadCount, label: 'Notifications', trend: 'Unread', up: false },
])

const savedEvents = computed(() => {
  return eventsStore.events.filter(e => eventsStore.savedIds.includes(e.id || e.eventID))
})

const upcomingCount = computed(() => {
  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return savedEvents.value.filter(e => {
    const eventDate = new Date(e.eventDate)
    return eventDate >= now && eventDate <= weekFromNow
  }).length
})

const popularEvents = computed(() => {
  return [...eventsStore.events]
    .filter(e => e.status === 'live')
    .sort((a, b) => (b.attendeesCount || 0) - (a.attendeesCount || 0))
})

function openModal(ev) { selectedEvent.value = ev }
function formatMon(d) { if (!d) return 'TBA'; return new Date(d).toLocaleDateString('en', { month: 'short' }).toUpperCase() }
function formatDay(d) { if (!d) return '--'; return new Date(d).getDate() }
function formatTime(d, t) {
  if (t) return t
  if (!d) return ''
  return new Date(d).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
}
function formatDate(d) {
  if (!d) return 'TBA'
  return new Date(d).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
}

onMounted(() => eventsStore.loadAll(auth.user?.id || auth.user?.userID))
</script>

<style scoped>
.content-with-aside { display: flex; flex: 1; overflow: hidden; }
.content-main { flex: 1; overflow-y: auto; padding: 28px 30px; }
.page-header { margin-bottom: 26px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--text); margin-bottom: 4px; letter-spacing: -0.025em; }
.page-sub { font-size: 13px; color: var(--text3); font-weight: 300; }

.bookings-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.summary-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; display: flex; align-items: center; gap: 16px; }
.summary-icon { width: 48px; height: 48px; background: var(--accent-l); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--accent); flex-shrink: 0; }
.summary-title { font-size: 12px; color: var(--text3); margin-bottom: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.summary-value { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: var(--text); line-height: 1; margin-bottom: 2px; }
.summary-sub { font-size: 11px; color: var(--text4); }

.popular-events { margin-bottom: 24px; }
.popular-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.popular-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; cursor: pointer; transition: all 0.2s; display: flex; gap: 12px; }
.popular-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.popular-image { width: 60px; height: 60px; background: var(--accent-l); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--accent); flex-shrink: 0; overflow: hidden; position: relative; }
.popular-img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
.popular-info { flex: 1; min-width: 0; }
.popular-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.popular-meta { font-size: 12px; color: var(--text3); margin-bottom: 2px; }
.popular-date { font-size: 11px; color: var(--text4); }

@media (max-width: 768px) {
  .bookings-summary { grid-template-columns: 1fr; }
  .popular-grid { grid-template-columns: 1fr; }
}

.upcoming-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.upcoming-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 12px 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all .2s; }
.upcoming-item:hover { border-color: var(--accent); background: var(--surface2); }
.date-block { width: 44px; height: 46px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; background: var(--accent-l); }
.date-mon { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--accent); }
.date-day { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 700; line-height: 1; color: var(--text); }
.upcoming-info { flex: 1; min-width: 0; }
.upcoming-title { font-weight: 500; font-size: 13.5px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text); }
.upcoming-sub { font-size: 11.5px; color: var(--text3); }

.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.kpi-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; position: relative; overflow: hidden; }
.kpi-icon { position: absolute; top: 16px; right: 16px; font-size: 32px; color: var(--accent); opacity: 0.1; }
.kpi-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.kpi-label { font-size: 12px; color: var(--text3); margin-bottom: 8px; font-weight: 500; }
.kpi-trend { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; }
.trend-up { color: var(--green); }
.trend-dn { color: var(--red); }

.section-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.section-label { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 700; color: var(--text); }

.pill { font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.5px; }
.pill-live { background: var(--green-l); color: var(--green); }
.pill-upcoming { background: var(--accent-l); color: var(--accent); }
.pill-paid { background: var(--blue-l); color: var(--blue); }
.pill-free { background: var(--surface2); color: var(--text3); }

.empty { text-align: center; color: var(--text3); font-size: 13px; padding: 20px; }

@media (max-width: 900px) { .kpi-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .kpi-grid { grid-template-columns: 1fr; } }
</style>
