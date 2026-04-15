<template>
  <AppLayout>
    <!-- Page Header -->
    <div class="page-header">
      <h1>Discover Events</h1>
      <router-link v-if="auth.user?.role === 'Organizer'" to="/organizer" class="btn-primary">+ Create Event</router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">Loading events...</div>

    <template v-else>
      <!-- Section: This Weekend -->
      <section class="event-section" v-if="weekendEvents.length">
        <h2 class="section-title">🗓️ This Weekend</h2>
        <div class="events-grid">
          <EventCard
            v-for="event in weekendEvents"
            :key="event.id"
            :event="event"
            @dismiss="dismissEvent"
            @click="goToEvent(event.id)"
          />
        </div>
      </section>

      <!-- Section: Music & Art -->
      <section class="event-section" v-if="musicEvents.length">
        <h2 class="section-title">🎵 Music & Art</h2>
        <div class="events-grid">
          <EventCard
            v-for="event in musicEvents"
            :key="event.id"
            :event="event"
            @dismiss="dismissEvent"
            @click="goToEvent(event.id)"
          />
        </div>
      </section>

      <!-- Section: All Events -->
      <section class="event-section">
        <h2 class="section-title">✨ All Events</h2>
        <div v-if="visibleEvents.length" class="events-grid">
          <EventCard
            v-for="event in visibleEvents"
            :key="event.id"
            :event="event"
            @dismiss="dismissEvent"
            @click="goToEvent(event.id)"
          />
        </div>
        <div v-else class="empty-state">No events found. Check back soon!</div>
      </section>
    </template>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import EventCard from '../components/EventCard.vue'
import { useAuthStore } from '../stores/auth'
import api from '../api'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const events = ref([])
const dismissed = ref([])

const visibleEvents = computed(() => {
  let filtered = events.value.filter(e => !dismissed.value.includes(e.id))
  if (route.query.category) filtered = filtered.filter(e => e.category === route.query.category)
  if (route.query.location) filtered = filtered.filter(e => e.location.toLowerCase().includes(route.query.location.toLowerCase()))
  if (route.query.date === 'Today') filtered = filtered.filter(e => new Date(e.date).toDateString() === new Date().toDateString())
  if (route.query.date === 'This Weekend') filtered = filtered.filter(e => isThisWeekend(e.date))
  return filtered
})
const weekendEvents = computed(() => visibleEvents.value.filter(e => isThisWeekend(e.date)).slice(0, 3))
const musicEvents = computed(() => visibleEvents.value.filter(e => e.category === 'Music & Art').slice(0, 3))

function isThisWeekend(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay()
  return day === 0 || day === 6
}

function dismissEvent(id) { dismissed.value.push(id) }
function goToEvent(id) { router.push(`/events/${id}`) }

onMounted(async () => {
  try {
    const res = await api.get('/events')
    events.value = res.data
  } catch {
    // fallback mock data while backend is being connected
    events.value = [
      { id: 1, title: 'Kigali Jazz Night', date: '2026-04-12', location: 'Kigali, Rwanda', category: 'Music & Art', attendeeCount: 142, friends: ['Alice', 'Bob'], imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80' },
      { id: 2, title: 'Community Football Tournament', date: '2026-04-13', location: 'Amahoro Stadium', category: 'Sports', attendeeCount: 320, friends: ['Chris'], imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80' },
      { id: 3, title: 'Tech Startup Meetup', date: '2026-04-15', location: 'Norrsken House', category: 'Tech', attendeeCount: 87, friends: [], imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
      { id: 4, title: 'Art Exhibition: Colors of Africa', date: '2026-04-19', location: 'Inema Arts Center', category: 'Music & Art', attendeeCount: 65, friends: ['Diana'], imageUrl: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80' },
      { id: 5, title: 'Food & Culture Festival', date: '2026-04-20', location: 'Kimironko Market', category: 'Food & Drink', attendeeCount: 210, friends: ['Eve', 'Frank'], imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80' },
      { id: 6, title: 'Youth Leadership Summit', date: '2026-04-22', location: 'Radisson Blu, Kigali', category: 'Education', attendeeCount: 180, friends: [], imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80' },
    ]
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
}

.event-section { margin-bottom: 36px; }

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.loading {
  text-align: center;
  color: var(--muted);
  padding: 60px 0;
  font-size: 15px;
}

.empty-state {
  text-align: center;
  color: var(--muted);
  padding: 40px 0;
  font-size: 14px;
}

@media (max-width: 1200px) { .events-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .events-grid { grid-template-columns: 1fr; } }
</style>
