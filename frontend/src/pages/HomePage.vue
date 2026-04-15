<template>
  <AppLayout>
    <div class="hero">
      <h1>Find Events Near You</h1>
      <p>Discover local events, connect with your community, and never miss what's happening around you.</p>
      <div class="hero-actions">
        <router-link to="/events" class="btn-primary">Browse Events</router-link>
        <router-link v-if="!auth.isLoggedIn" to="/register" class="btn-ghost">Join Free</router-link>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-num">120+</span>
        <span class="stat-label">Events This Month</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">3,400+</span>
        <span class="stat-label">Community Members</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">18</span>
        <span class="stat-label">Categories</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">12</span>
        <span class="stat-label">Cities Covered</span>
      </div>
    </div>

    <div class="quick-categories">
      <h2 class="section-title">Browse by Category</h2>
      <div class="cat-grid">
        <router-link
          v-for="cat in categories"
          :key="cat.name"
          :to="`/events?category=${cat.name}`"
          class="cat-card"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const categories = [
  { name: 'Music & Art', icon: '🎵' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Food & Drink', icon: '🍕' },
  { name: 'Tech', icon: '💻' },
  { name: 'Community', icon: '🤝' },
  { name: 'Education', icon: '📚' },
]
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f7ff 100%);
  border-radius: var(--card-radius);
  padding: 48px 40px;
  margin-bottom: 32px;
}

.hero h1 { font-size: 32px; font-weight: 700; margin-bottom: 12px; }
.hero p { font-size: 15px; color: var(--muted); max-width: 480px; margin-bottom: 24px; line-height: 1.6; }

.hero-actions { display: flex; gap: 12px; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 36px;
}

.stat-card {
  background: var(--white);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-num { font-size: 24px; font-weight: 700; color: var(--blue); }
.stat-label { font-size: 12px; color: var(--muted); text-align: center; }

.section-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }

.cat-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.cat-card {
  background: var(--white);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow);
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  text-decoration: none;
}

.cat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); background: #e8f4fd; }

.cat-icon { font-size: 28px; }
.cat-name { font-size: 11px; font-weight: 600; color: var(--text); text-align: center; }

@media (max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .cat-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
