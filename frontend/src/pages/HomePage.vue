<template>
  <AppLayout>
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Find Events Near You</h1>
        <p class="hero-subtitle">Discover local events, connect with your community, and never miss what's happening around you.</p>
        <div class="hero-actions">
          <router-link to="/events" class="btn-primary">
            Browse Events
          </router-link>
          <router-link v-if="!auth.isLoggedIn" to="/register" class="btn-ghost">Join Free</router-link>
        </div>
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
  { name: 'Music & Art', icon: '♪', color: '#FF6B9D' },
  { name: 'Sports', icon: '⚡', color: '#4CAF50' },
  { name: 'Food & Drink', icon: '☕', color: '#FF9800' },
  { name: 'Tech', icon: '⚙', color: '#2196F3' },
  { name: 'Community', icon: '★', color: '#9C27B0' },
  { name: 'Education', icon: '✎', color: '#00BCD4' },
]
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f7ff 100%);
  border-radius: var(--card-radius);
  padding: 48px 40px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 100%;
}

.hero-title { 
  font-size: 36px; 
  font-weight: 700; 
  margin-bottom: 12px;
  background: linear-gradient(135deg, #1D9BF0 0%, #0d7ac7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.6s ease-out;
}

.hero-subtitle { 
  font-size: 16px; 
  color: var(--muted); 
  max-width: 520px; 
  margin-bottom: 24px; 
  line-height: 1.6;
  animation: fadeInUp 0.6s ease-out 0.1s backwards;
}

.hero-actions { 
  display: flex; 
  gap: 12px;
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.cat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(29, 155, 240, 0.1) 0%, rgba(29, 155, 240, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.cat-card:hover { 
  transform: translateY(-4px) scale(1.02); 
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.cat-card:hover::before {
  opacity: 1;
}

.cat-icon { 
  font-size: 32px;
  font-weight: 400;
  color: var(--blue);
}

.cat-name { 
  font-size: 11px; 
  font-weight: 600; 
  color: var(--text); 
  text-align: center; 
}

@media (max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .cat-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
