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

      <!-- Charts Row -->
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-card-header">
            <span class="chart-title">Events by Category</span>
            <span class="chart-badge">{{ eventsStore.events.length }} total</span>
          </div>
          <div class="donut-wrap">
            <canvas ref="donutEl"></canvas>
            <div class="donut-center">
              <span class="donut-num">{{ topCat.count }}</span>
              <span class="donut-sub">{{ topCat.name }}</span>
            </div>
          </div>
          <div class="donut-legend">
            <div v-for="item in catData" :key="item.name" class="legend-item">
              <span class="legend-dot" :style="{ background: item.color }"></span>
              <span class="legend-label">{{ item.name }}</span>
              <span class="legend-val">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <div class="chart-card chart-card--wide">
          <div class="chart-card-header">
            <span class="chart-title">Attendance vs Capacity</span>
            <span class="chart-badge">Top {{ attendanceData.length }} events</span>
          </div>
          <div class="bar-wrap">
            <canvas ref="barEl"></canvas>
          </div>
        </div>
      </div>

      <!-- Fill Rate -->
      <div class="fill-row">
        <div class="fill-card" v-for="ev in fillEvents" :key="ev.id">
          <div class="fill-info">
            <div class="fill-icon"><i class="ph ph-calendar-star"></i></div>
            <div>
              <div class="fill-title">{{ ev.title }}</div>
              <div class="fill-venue">{{ ev.venueName || ev.venue?.name }}</div>
            </div>
          </div>
          <div class="fill-bar-wrap">
            <div class="fill-bar-track">
              <div class="fill-bar-fill" :style="{ width: fillPct(ev) + '%', background: fillColor(ev) }"></div>
            </div>
            <span class="fill-pct" :style="{ color: fillColor(ev) }">{{ fillPct(ev) }}%</span>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="section-row" style="margin-top:24px">
        <div class="section-label">All Events</div>
        <RouterLink :to="'/organizer/events'" class="btn btn-ghost" style="font-size:12px;padding:6px 14px">View all</RouterLink>
      </div>
      <div class="upcoming-list">
        <div
          v-for="ev in upcomingEvents"
          :key="ev.id || ev.eventID"
          class="upcoming-item"
          @click="openModal(ev)"
        >
          <div class="upcoming-image">
            <img v-if="ev.imageUrl" :src="ev.imageUrl" :alt="ev.title" class="upcoming-img" />
            <div v-else class="upcoming-img-placeholder">
              <i class="ph ph-calendar-star"></i>
            </div>
          </div>
          <div class="upcoming-content">
            <div class="date-block">
              <div class="date-mon">{{ formatMon(ev.eventDate) }}</div>
              <div class="date-day">{{ formatDay(ev.eventDate) }}</div>
            </div>
            <div class="upcoming-info">
              <div class="upcoming-title">{{ ev.title }}</div>
              <div class="upcoming-sub">{{ ev.venue?.name || ev.venueName }} · {{ formatTime(ev.eventDate, ev.eventTime) }}</div>
            </div>
            <div class="upcoming-pills">
              <span class="pill" :class="ev.status === 'live' ? 'pill-live' : 'pill-upcoming'">
                {{ ev.status === 'live' ? 'Live' : 'Upcoming' }}
              </span>
              <span class="pill" :class="ev.price ? 'pill-paid' : 'pill-free'">
                {{ ev.price ? 'Paid' : 'Free' }}
              </span>
            </div>
          </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, BarController } from 'chart.js'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import EventModal from '@/components/EventModal.vue'

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, BarController)

const auth = useAuthStore()
const eventsStore = useEventsStore()
const selectedEvent = ref(null)
const donutEl = ref(null)
const barEl = ref(null)
let donutChart = null
let barChart = null

const AMBER = ['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F', '#FCD34D']
const CAT_COLORS = {
  'Music & Art': '#F59E0B', 'Tech': '#38BDF8', 'Food & Drink': '#FB923C',
  'Sports': '#4ADE80', 'Community': '#A78BFA', 'Education': '#F472B6'
}

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
})

const upcomingEvents = computed(() => {
  // Admin sees all events, not just their own
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

const catData = computed(() => {
  const map = {}
  eventsStore.events.forEach(e => {
    const name = e.categoryName || e.category?.name || 'Other'
    map[name] = (map[name] || 0) + 1
  })
  return Object.entries(map)
    .map(([name, count], i) => ({ name, count, color: CAT_COLORS[name] || AMBER[i % AMBER.length] }))
    .sort((a, b) => b.count - a.count)
})

const topCat = computed(() => catData.value[0] || { name: '—', count: 0 })

const attendanceData = computed(() =>
  [...eventsStore.events]
    .filter(e => e.capacity)
    .sort((a, b) => (b.attendeesCount || 0) - (a.attendeesCount || 0))
    .slice(0, 6)
)

const fillEvents = computed(() =>
  [...eventsStore.events]
    .filter(e => e.capacity)
    .sort((a, b) => fillPct(b) - fillPct(a))
    .slice(0, 4)
)

function fillPct(ev) {
  if (!ev.capacity) return 0
  return Math.min(100, Math.round(((ev.attendeesCount || 0) / ev.capacity) * 100))
}

function fillColor(ev) {
  const p = fillPct(ev)
  if (p >= 90) return '#ef4444'
  if (p >= 65) return '#f59e0b'
  return '#22c55e'
}

function buildDonut() {
  if (!donutEl.value || !catData.value.length) return
  donutChart?.destroy()
  donutChart = new Chart(donutEl.value, {
    type: 'doughnut',
    data: {
      labels: catData.value.map(c => c.name),
      datasets: [{ data: catData.value.map(c => c.count), backgroundColor: catData.value.map(c => c.color), borderColor: 'var(--surface)', borderWidth: 3, hoverOffset: 6 }]
    },
    options: {
      cutout: '72%',
      plugins: { legend: { display: false }, tooltip: { backgroundColor: 'var(--surface2)', borderColor: 'rgba(245,158,11,.3)', borderWidth: 1, titleColor: '#fff', bodyColor: 'rgba(255,255,255,.6)', callbacks: { label: ctx => ` ${ctx.parsed} events` } } },
      animation: { animateRotate: true, duration: 800 },
    }
  })
}

function buildBar() {
  if (!barEl.value || !attendanceData.value.length) return
  barChart?.destroy()
  const labels = attendanceData.value.map(e => e.title.length > 14 ? e.title.slice(0, 14) + '…' : e.title)
  barChart = new Chart(barEl.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Attendees', data: attendanceData.value.map(e => e.attendeesCount || 0), backgroundColor: 'rgba(245,158,11,0.85)', borderRadius: 6, borderSkipped: false },
        { label: 'Capacity', data: attendanceData.value.map(e => e.capacity || 0), backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 6, borderSkipped: false }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: 'rgba(255,255,255,0.45)', font: { size: 11 }, boxWidth: 10, padding: 14 } },
        tooltip: { backgroundColor: 'var(--surface2)', borderColor: 'rgba(245,158,11,.3)', borderWidth: 1, titleColor: '#fff', bodyColor: 'rgba(255,255,255,.6)' }
      },
      scales: {
        x: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true }
      }
    }
  })
}

onMounted(() => { buildDonut(); buildBar() })
watch(() => eventsStore.events.length, () => { buildDonut(); buildBar() })

function openModal(ev) { selectedEvent.value = ev }
function formatMon(d) { if (!d) return 'TBA'; return new Date(d).toLocaleDateString('en', { month: 'short' }).toUpperCase() }
function formatDay(d) { if (!d) return '--'; return new Date(d).getDate() }
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
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--text); margin-bottom: 4px; letter-spacing: -0.025em; }
.page-sub { font-size: 13px; color: var(--text3); font-weight: 300; }

.charts-row { display: grid; grid-template-columns: 220px 1fr; gap: 14px; margin-bottom: 14px; }
.chart-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px; }
.chart-card--wide { display: flex; flex-direction: column; }
.chart-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.chart-title { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 700; color: var(--text); }
.chart-badge { font-size: 10px; background: var(--accent-l); color: var(--accent); padding: 2px 8px; border-radius: 99px; font-weight: 600; }
.donut-wrap { position: relative; width: 130px; height: 130px; margin: 0 auto 14px; }
.donut-wrap canvas { width: 100% !important; height: 100% !important; }
.donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
.donut-num { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: var(--text); line-height: 1; }
.donut-sub { font-size: 9px; color: var(--text3); text-align: center; max-width: 60px; line-height: 1.3; margin-top: 2px; }
.donut-legend { display: flex; flex-direction: column; gap: 5px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; }
.legend-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.legend-label { flex: 1; color: var(--text3); }
.legend-val { font-weight: 600; color: var(--text); }
.bar-wrap { flex: 1; min-height: 180px; position: relative; }
.bar-wrap canvas { width: 100% !important; height: 100% !important; }

.fill-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 4px; }
.fill-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 14px; }
.fill-info { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.fill-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--accent-l); display: flex; align-items: center; justify-content: center; font-size: 1rem; color: var(--accent); flex-shrink: 0; }
.fill-title { font-size: 12px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px; }
.fill-venue { font-size: 10.5px; color: var(--text3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px; }
.fill-bar-wrap { display: flex; align-items: center; gap: 8px; }
.fill-bar-track { flex: 1; height: 5px; background: var(--border2); border-radius: 99px; overflow: hidden; }
.fill-bar-fill { height: 100%; border-radius: 99px; transition: width .6s ease; }
.fill-pct { font-size: 11px; font-weight: 600; min-width: 32px; text-align: right; }

.upcoming-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.upcoming-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; transition: all .2s; display: flex; }
.upcoming-item:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.upcoming-image { width: 120px; height: 100px; flex-shrink: 0; position: relative; overflow: hidden; }
.upcoming-img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
.upcoming-img-placeholder { width: 100%; height: 100%; background: var(--accent-l); display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--accent); }
.upcoming-content { flex: 1; display: flex; padding: 12px 16px; gap: 12px; }
.date-block { width: 44px; height: 46px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; background: var(--accent-l); }
.date-mon { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--accent); }
.date-day { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 700; line-height: 1; color: var(--text); }
.upcoming-info { flex: 1; min-width: 0; }
.upcoming-title { font-weight: 500; font-size: 13.5px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text); }
.upcoming-sub { font-size: 11.5px; color: var(--text3); margin-bottom: 8px; }
.upcoming-pills { display: flex; gap: 6px; flex-wrap: wrap; }

.pill { font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.5px; }
.pill-live { background: var(--green-l); color: var(--green); }
.pill-upcoming { background: var(--accent-l); color: var(--accent); }
.pill-paid { background: var(--blue-l); color: var(--blue); }
.pill-free { background: var(--surface2); color: var(--text3); }

.empty { text-align: center; color: var(--text3); font-size: 13px; padding: 20px; }

@media (max-width: 768px) {
  .upcoming-item { flex-direction: column; }
  .upcoming-image { width: 100%; height: 160px; }
  .upcoming-content { flex-direction: column; gap: 8px; }
}
</style>
