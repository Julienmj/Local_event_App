<template>
  <div class="app-shell">

    <!-- Left Sidebar Nav -->
    <aside class="left-nav">
      <div class="logo">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        EventLocal
      </div>
      <nav>
        <router-link to="/" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </router-link>
        <router-link to="/events" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Events
        </router-link>
        <router-link v-if="auth.user?.role === 'Attendee'" to="/my-registrations" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          My Registrations
        </router-link>
        <router-link v-if="auth.user?.role === 'Organizer'" to="/organizer" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          Organizer
        </router-link>
        <router-link v-if="auth.user?.role === 'Admin'" to="/admin" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2"></path>
          </svg>
          Admin
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
            <span class="cat-label">
              <span class="cat-icon-svg" v-html="cat.icon"></span>
              {{ cat.name }}
            </span>
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
  { 
    name: 'Music & Art', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
    count: 24 
  },
  { 
    name: 'Sports', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>',
    count: 18 
  },
  { 
    name: 'Food & Drink', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
    count: 12 
  },
  { 
    name: 'Tech', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
    count: 9 
  },
  { 
    name: 'Community', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    count: 15 
  },
  { 
    name: 'Education', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    count: 7 
  },
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
  font-size: 18px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 24px;
  padding-left: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
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

.nav-icon { 
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

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

.cat-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cat-icon-svg {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-icon-svg svg {
  width: 100%;
  height: 100%;
}

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
