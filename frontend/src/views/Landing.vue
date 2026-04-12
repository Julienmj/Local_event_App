<template>
  <div>
    <!-- Hero -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <span class="badge bg-white text-primary fw-semibold px-3 py-2 mb-3 rounded-pill">
              <i class="bi bi-stars me-1"></i> Community Events Platform
            </span>
            <h1 class="display-4 fw-bold mb-4">Discover & Join Local Events Near You</h1>
            <p class="lead mb-4 opacity-75">Connect with your community through sports, music, tech meetups, health workshops and more — all in one place.</p>
            <div class="d-flex gap-3 flex-wrap">
              <router-link to="/events" class="btn btn-light btn-lg fw-semibold px-4">
                <i class="bi bi-search me-2"></i>Browse Events
              </router-link>
              <router-link to="/register" class="btn btn-outline-light btn-lg px-4">
                Get Started Free
              </router-link>
            </div>
          </div>
          <div class="col-lg-6 d-none d-lg-flex justify-content-center">
            <div class="position-relative">
              <div class="rounded-4 p-4 text-center" style="background:rgba(255,255,255,.1);backdrop-filter:blur(10px);width:340px">
                <i class="bi bi-calendar-event" style="font-size:5rem;opacity:.8"></i>
                <h4 class="mt-3 fw-bold">100+ Events</h4>
                <p class="opacity-75 mb-0">Happening in your community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-5 bg-white">
      <div class="container">
        <div class="row g-4 text-center">
          <div class="col-6 col-md-3" v-for="s in stats" :key="s.label">
            <div class="stat-card" :style="{ background: s.bg }">
              <i :class="s.icon" style="font-size:2rem"></i>
              <h3 class="fw-bold mt-2 mb-0">{{ s.value }}</h3>
              <p class="mb-0 opacity-75 small">{{ s.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-5">
      <div class="container">
        <h2 class="section-title text-center mb-2">Browse by Category</h2>
        <p class="text-center text-muted mb-5">Find events that match your interests</p>
        <div class="row g-3 justify-content-center">
          <div class="col-6 col-md-3 col-lg-2" v-for="cat in categories" :key="cat.name">
            <router-link :to="`/events?category=${cat.name}`" class="text-decoration-none">
              <div class="text-center p-3 rounded-3 border h-100 category-pill">
                <div class="fs-2 mb-2">{{ cat.icon }}</div>
                <div class="fw-semibold small">{{ cat.name }}</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Events -->
    <section class="py-5 bg-white">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title mb-0">Featured Events</h2>
          <router-link to="/events" class="btn btn-primary-custom">View All</router-link>
        </div>
        <div v-if="eventsStore.loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else class="row g-4">
          <div class="col-md-4" v-for="event in featured" :key="event.eventID">
            <EventCard :event="event" />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-5" style="background:linear-gradient(135deg,#4f46e5,#06b6d4)">
      <div class="container text-center text-white">
        <h2 class="fw-bold mb-3">Ready to organize your own event?</h2>
        <p class="lead opacity-75 mb-4">Join as an organizer and reach hundreds of community members.</p>
        <router-link to="/register" class="btn btn-light btn-lg fw-semibold px-5">Start Organizing</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useEventsStore } from '../stores/events'
import EventCard from '../components/EventCard.vue'

const eventsStore = useEventsStore()

onMounted(() => {
  eventsStore.fetchEvents()
})

const featured = computed(() => eventsStore.events.filter(e => e.status === 'Active').slice(0, 3))

const stats = [
  { label: 'Events Hosted', value: '120+', icon: 'bi bi-calendar-check', bg: 'linear-gradient(135deg,#4f46e5,#7c3aed)' },
  { label: 'Community Members', value: '2.4K', icon: 'bi bi-people-fill', bg: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
  { label: 'Categories', value: '8', icon: 'bi bi-grid-fill', bg: 'linear-gradient(135deg,#10b981,#06b6d4)' },
  { label: 'Cities Covered', value: '5', icon: 'bi bi-geo-alt-fill', bg: 'linear-gradient(135deg,#f59e0b,#ef4444)' }
]

const categories = [
  { name: 'Sports', icon: '⚽' },
  { name: 'Music', icon: '🎵' },
  { name: 'Tech', icon: '💻' },
  { name: 'Health', icon: '🏃' },
  { name: 'Art', icon: '🎨' },
  { name: 'Food', icon: '🍕' },
  { name: 'Business', icon: '💼' },
  { name: 'Education', icon: '📚' }
]
</script>

<style scoped>
.category-pill { transition: all .2s; cursor: pointer; }
.category-pill:hover { background: #f0f4ff !important; border-color: #4f46e5 !important; transform: translateY(-3px); }
</style>
