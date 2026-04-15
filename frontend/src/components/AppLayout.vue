<template>
  <div class="app-shell">

    <!-- Left Sidebar Nav -->
    <aside class="left-nav">
      <div class="logo">📍 EventLocal</div>
      <nav>
        <router-link to="/" class="nav-item">
          <span class="nav-icon">🏠</span> Home
        </router-link>
        <router-link to="/events" class="nav-item">
          <span class="nav-icon">📅</span> Events
        </router-link>
        <router-link v-if="auth.user?.role === 'Attendee'" to="/my-registrations" class="nav-item">
          <span class="nav-icon">🎟️</span> My Registrations
        </router-link>
        <router-link v-if="auth.user?.role === 'Organizer'" to="/organizer" class="nav-item">
          <span class="nav-icon">🗂️</span> Organizer
        </router-link>
        <router-link v-if="auth.user?.role === 'Admin'" to="/admin" class="nav-item">
          <span class="nav-icon">⚙️</span> Admin
        </router-link>
      </nav>
      <div class="nav-bottom">
        <template v-if="auth.isLoggedIn">
          <div class="user-info">
            <div class="avatar">{{ auth.user?.username?.charAt(0).toUpperCase() }}</div>
            <span class="username">{{ auth.user?.username }}</span>
          </div>
          <button class="btn-ghost logout-btn" @click="handleLogout">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-primary nav-auth-btn">Login</router-link>
          <router-link to="/register" class="btn-ghost nav-auth-btn">Register</router-link>
        </template>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Right Sidebar -->
    <aside class="right-sidebar">
      <div class="sidebar-section">
        <h4>Location</h4>
        <input class="filter-input" type="text" placeholder="Search location..." v-model="filters.location" />
      </div>

      <div class="sidebar-section">
        <h4>Date</h4>
        <div class="filter-pills">
          <button
            v-for="d in dateOptions"
            :key="d"
            :class="['pill', { active: filters.date === d }]"
            @click="filters.date = d"
          >{{ d }}</button>
        </div>
      </div>

      <div class="sidebar-section">
        <h4>Categories</h4>
        <div class="category-list">
          <button
            v-for="cat in categories"
            :key="cat.name"
            :class="['category-item', { active: filters.category === cat.name }]"
            @click="filters.category = cat.name"
          >
            <span>{{ cat.icon }} {{ cat.name }}</span>
            <span class="cat-count">{{ cat.count }}</span>
          </button>
        </div>
      </div>

      <button class="btn-primary apply-btn" @click="applyFilters">Apply Filters</button>
    </aside>

  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const filters = reactive({ location: '', date: 'Any', category: '' })
const dateOptions = ['Any', 'Today', 'This Weekend', 'This Week', 'This Month']
const categories = [
  { name: 'Music & Art', icon: '🎵', count: 24 },
  { name: 'Sports', icon: '⚽', count: 18 },
  { name: 'Food & Drink', icon: '🍕', count: 12 },
  { name: 'Tech', icon: '💻', count: 9 },
  { name: 'Community', icon: '🤝', count: 15 },
  { name: 'Education', icon: '📚', count: 7 },
]

function handleLogout() {
  auth.logout()
  router.push('/login')
}

function applyFilters() {
  router.push({ path: '/events', query: { location: filters.location, date: filters.date, category: filters.category } })
}
</script>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: 220px 1fr 240px;
  min-height: 100vh;
  background: var(--bg);
}

/* Left Nav */
.left-nav {
  position: sticky;
  top: 0;
  height: 100vh;
  background: var(--white);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  gap: 8px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 24px;
  padding-left: 8px;
}

nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: var(--muted);
  transition: all 0.2s;
}

.nav-item:hover, .nav-item.router-link-active {
  background: #e8f4fd;
  color: var(--blue);
}

.nav-icon { font-size: 18px; }

.nav-bottom {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.username { font-size: 14px; font-weight: 500; }
.logout-btn { font-size: 13px; }
.nav-auth-btn { text-align: center; display: block; }

/* Main Content */
.main-content {
  padding: 28px 24px;
  min-height: 100vh;
  overflow-y: auto;
}

/* Right Sidebar */
.right-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  background: var(--white);
  border-left: 1px solid var(--border);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.sidebar-section h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.filter-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border 0.2s;
}

.filter-input:focus { border-color: var(--blue); }

.filter-pills { display: flex; flex-wrap: wrap; gap: 6px; }

.pill {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--muted);
  transition: all 0.2s;
}

.pill.active, .pill:hover { background: var(--blue); color: white; border-color: var(--blue); }

.category-list { display: flex; flex-direction: column; gap: 4px; }

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: transparent;
  border: none;
  color: var(--text);
  transition: all 0.2s;
  cursor: pointer;
}

.category-item:hover, .category-item.active { background: #e8f4fd; color: var(--blue); }

.cat-count {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  color: var(--muted);
}

.apply-btn { width: 100%; margin-top: auto; }

@media (max-width: 1024px) {
  .app-shell { grid-template-columns: 200px 1fr; }
  .right-sidebar { display: none; }
}

@media (max-width: 640px) {
  .app-shell { grid-template-columns: 1fr; }
  .left-nav { display: none; }
}
</style>
