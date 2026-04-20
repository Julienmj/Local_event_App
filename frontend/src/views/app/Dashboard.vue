<template>
  <div class="content-with-aside">
    <div class="content-main">
      <div class="page-header">
        <h1 class="page-title">Good {{ greeting }}, {{ auth.user?.fullName?.split(' ')[0] || 'there' }} 👋</h1>
        <p class="page-sub">Here's what's happening in your EventLocal world today.</p>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card">
          <div class="kpi-icon">{{ kpi.icon }}</div>
          <div class="kpi-num">{{ kpi.value }}</div>
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-trend" :class="kpi.up ? 'trend-up' : 'trend-dn'">
            {{ kpi.up ? '↑' : '↓' }} {{ kpi.trend }}
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="section-row">
        <div class="section-label">{{ auth.isOrganizer ? 'My Managed Events' : 'Upcoming Events' }}</div>
        <RouterLink :to="auth.isOrganizer ? '/app/myevents' : '/app/events'" class="btn btn-ghost" style="font-size:12px;padding:6px 14px">View all</RouterLink>
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
        <div v-if="!upcomingEvents.length" class="empty-state">
          No upcoming events found.
        </div>
      </div>
    </div>

    <!-- Aside: AI Copilot -->
    <aside class="aside-panel">
      <AiCopilot />
    </aside>

    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      :is-saved="eventsStore.isSaved(selectedEvent.id)"
      :reviews="[]"
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
import AiCopilot from '@/components/AiCopilot.vue'
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
  { icon: '📅', value: eventsStore.events.length, label: auth.isOrganizer ? 'Events Managed' : 'Events Near You', trend: '+12% this month', up: true },
  { icon: '🎟️', value: auth.isOrganizer ? eventsStore.events.reduce((s, e) => s + (e.attendeesCount || 0), 0) : eventsStore.registrations.length, label: auth.isOrganizer ? 'Total Reach' : 'My Registrations', trend: '+8% this month', up: true },
  { icon: '🔖', value: eventsStore.savedIds.length, label: 'Saved Events', trend: 'Your wishlist', up: true },
  { icon: '🔔', value: eventsStore.unreadCount, label: 'Notifications', trend: 'Unread', up: false },
])

function openModal(ev) { selectedEvent.value = ev }
function formatMon(d) { 
  if (!d) return 'TBA'
  return new Date(d).toLocaleDateString('en', { month: 'short' }).toUpperCase() 
}
function formatDay(d) { 
  if (!d) return '--'
  return new Date(d).getDate() 
}
function formatTime(d, t) {
  if (t) return t
  if (!d) return ''
  return new Date(d).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
}
</script>

<style scoped>
.content-with-aside { display: flex; flex: 1; overflow: hidden; }
.content-main { flex: 1; overflow-y: auto; padding: 28px 30px; }
.aside-panel { width: 300px; border-left: 1px solid var(--border); background: var(--surface); overflow-y: auto; padding: 20px 18px; display: flex; flex-direction: column; gap: 18px; flex-shrink: 0; }
.page-header { margin-bottom: 26px; }
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
.trend-up { color: var(--teal); } .trend-dn { color: var(--red); }
.section-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.section-label { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 700; color: var(--ink); }
.upcoming-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.upcoming-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 12px 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all .2s; }
.upcoming-item:hover { border-color: var(--a300); box-shadow: var(--shadow); }
.date-block { width: 44px; height: 46px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; background: var(--a100); }
.date-mon { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--a700); }
.date-day { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 700; line-height: 1; color: var(--ink); }
.upcoming-info { flex: 1; min-width: 0; }
.upcoming-title { font-weight: 500; font-size: 13.5px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--ink); }
.upcoming-sub { font-size: 11.5px; color: var(--ink3); }
@media (max-width: 900px) { .kpi-grid { grid-template-columns: 1fr 1fr; } .aside-panel { display: none; } }
</style>
