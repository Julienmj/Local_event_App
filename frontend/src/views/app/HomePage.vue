<template>
  <div class="page-content">
    <div class="page-header">
      <div>
        <div class="page-title">Good {{ greeting }}, {{ userName }} 👋</div>
        <div class="page-sub">{{ currentDate }}</div>
      </div>
      <button class="btn btn-amber" @click="navigateToCreate">+ Create Event</button>
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
        <div class="kpi-num">{{ eventsStore.savedIds.length }}</div>
        <div class="kpi-label">Saved events</div>
        <div class="kpi-trend" style="color:var(--ink3)">Your collection</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">🔔</div>
        <div class="kpi-num">{{ unreadCount }}</div>
        <div class="kpi-label">Unread notifications</div>
        <div class="kpi-trend" style="color:var(--a600)">Tap to view</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">🏙️</div>
        <div class="kpi-num">12</div>
        <div class="kpi-label">Cities covered</div>
        <div class="kpi-trend trend-up">↑ 2 new cities</div>
      </div>
    </div>
    <div class="section-row">
      <div class="section-label">Trending Now</div>
      <button class="btn btn-ghost" style="font-size:12px;padding:6px 14px" @click="navigateToEvents">View all →</button>
    </div>
    <div class="events-grid">
      <EventCard
        v-for="event in trendingEvents"
        :key="event.EventID"
        :event="event"
        @click="openEventModal(event.EventID)"
      />
    </div>
    <div class="section-row">
      <div class="section-label">Coming Up</div>
    </div>
    <div class="upcoming-list">
      <div
        v-for="event in upcomingEvents"
        :key="event.EventID"
        class="upcoming-item"
        @click="openEventModal(event.EventID)"
      >
        <div class="date-block">
          <div class="date-mon">{{ formatMonth(event.EventDate) }}</div>
          <div class="date-day">{{ formatDay(event.EventDate) }}</div>
        </div>
        <div class="upcoming-info">
          <div class="upcoming-title">{{ event.Title }}</div>
          <div class="upcoming-sub">{{ event.EventTime || '' }} · {{ event.VenueName || '' }}</div>
        </div>
        <button class="btn btn-outline-amber" style="font-size:12px;padding:6px 12px">Details</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import EventCard from '@/components/EventCard.vue'

export default {
  name: 'HomePage',
  components: {
    EventCard
  },
  setup() {
    const authStore = useAuthStore()
    const eventsStore = useEventsStore()

    const greeting = computed(() => {
      const hour = new Date().getHours()
      if (hour < 12) return 'morning'
      if (hour < 17) return 'afternoon'
      return 'evening'
    })

    const userName = computed(() => {
      return (authStore.user?.FullName || '').split(' ')[0] || 'User'
    })

    const currentDate = computed(() => {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    })

    const unreadCount = computed(() => eventsStore.unreadCount)

    const trendingEvents = computed(() => eventsStore.events.slice(0, 6))

    const upcomingEvents = computed(() => eventsStore.events.slice(0, 4))

    const navigateToCreate = () => {
      // Use router to navigate
      // Assuming router is available
    }

    const navigateToEvents = () => {
      // Navigate to events
    }

    const openEventModal = (eventId) => {
      // Open modal
    }

    const formatMonth = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('en', { month: 'short' })
    }

    const formatDay = (dateStr) => {
      return new Date(dateStr).getDate()
    }

    return {
      authStore,
      eventsStore,
      greeting,
      userName,
      currentDate,
      unreadCount,
      trendingEvents,
      upcomingEvents,
      navigateToCreate,
      navigateToEvents,
      openEventModal,
      formatMonth,
      formatDay
    }
  }
}
</script>

<style scoped>
/* Include the relevant styles here */
.page-content {
  padding: 28px 30px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 26px;
}

.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
  letter-spacing: -0.025em;
}

.page-sub {
  font-size: 13px;
  color: var(--ink3);
  font-weight: 300;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 22px;
  border-radius: 99px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all .22s;
  border: none;
  letter-spacing: .01em;
}

.btn-amber {
  background: var(--a500);
  color: #fff;
  box-shadow: 0 4px 18px rgba(245, 158, 11, .3);
}

.btn-amber:hover {
  background: var(--a600);
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(245, 158, 11, .38);
}

.btn-ghost {
  background: transparent;
  color: var(--ink2);
  border: 1.5px solid var(--border2);
}

.btn-ghost:hover {
  border-color: var(--a400);
  color: var(--a700);
  background: var(--a50);
}

.btn-outline-amber {
  background: transparent;
  color: var(--a700);
  border: 1.5px solid var(--a300);
}

.btn-outline-amber:hover {
  background: var(--a50);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.kpi-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 18px;
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  transition: box-shadow .2s;
}

.kpi-card:hover {
  box-shadow: var(--shadow);
}

.kpi-card::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--a400), var(--a200));
}

.kpi-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--a100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.kpi-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 3px;
}

.kpi-label {
  font-size: 12px;
  color: var(--ink3);
}

.kpi-trend {
  font-size: 11px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 3px;
  font-weight: 500;
}

.trend-up {
  color: var(--teal);
}

.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.upcoming-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all .2s;
}

.upcoming-item:hover {
  border-color: var(--a300);
  box-shadow: var(--shadow);
}

.date-block {
  width: 44px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--a100);
}

.date-mon {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--a700);
}

.date-day {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1;
  color: var(--ink);
}

.upcoming-info {
  flex: 1;
  min-width: 0;
}

.upcoming-title {
  font-weight: 500;
  font-size: 13.5px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--ink);
}

.upcoming-sub {
  font-size: 11.5px;
  color: var(--ink3);
}

/* Add more styles as needed */
</style>
