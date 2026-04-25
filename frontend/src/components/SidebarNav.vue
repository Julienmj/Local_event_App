<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon"><i class="ph-bold ph-map-pin"></i></div>
        <span class="sidebar-logo-name">EventLocal</span>
      </div>
      <div class="sidebar-user">
        <div class="user-av">{{ auth.initials }}</div>
        <div class="user-info">
          <div class="user-name">{{ auth.user?.fullName || 'User' }}</div>
          <div class="user-role">
            <i class="ph ph-shield-check" style="font-size:10px"></i>
            {{ auth.user?.role || 'Attendee' }}
          </div>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Main</div>
      <RouterLink v-for="item in mainNav" :key="item.to" :to="item.to" class="nav-item" active-class="active">
        <i :class="['ph', item.icon, 'nav-icon']"></i>
        <span>{{ item.label }}</span>
      </RouterLink>

      <template v-if="auth.isOrganizer">
        <div class="nav-section-label" style="margin-top:10px">Organizer</div>
        <RouterLink v-for="item in organizerNav" :key="item.to" :to="item.to" class="nav-item" active-class="active">
          <i :class="['ph', item.icon, 'nav-icon']"></i>
          <span>{{ item.label }}</span>
        </RouterLink>
      </template>

      <div class="nav-section-label" style="margin-top:10px">Account</div>
      <RouterLink v-for="item in accountNav" :key="item.to" :to="item.to" class="nav-item" active-class="active">
        <i :class="['ph', item.icon, 'nav-icon']"></i>
        <span>{{ item.label }}</span>
        <span v-if="item.badge && eventsStore.unreadCount > 0" class="nav-badge">
          {{ eventsStore.unreadCount }}
        </span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout">
        <i class="ph ph-sign-out"></i>
        <span>Sign out</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const eventsStore = useEventsStore()
const router = useRouter()

const mainNav = [
  { to: '/app/dashboard', icon: 'ph-squares-four',   label: 'Dashboard' },
  { to: '/app/events',    icon: 'ph-calendar-blank', label: 'Browse Events' },
  { to: '/app/saved',     icon: 'ph-ticket',         label: 'My Bookings' },
]

const organizerNav = [
  { to: '/app/myevents',   icon: 'ph-list-checks',  label: 'My Events' },
  { to: '/app/create',     icon: 'ph-plus-circle',  label: 'Create Event' },
  { to: '/app/analytics',  icon: 'ph-chart-bar',    label: 'Analytics' },
  { to: '/app/venues',     icon: 'ph-map-pin',      label: 'Venues' },
  { to: '/app/categories', icon: 'ph-tag',          label: 'Categories' },
]

const accountNav = [
  { to: '/app/notifications', icon: 'ph-bell',        label: 'Notifications', badge: true },
  { to: '/app/profile',       icon: 'ph-user-circle', label: 'Profile' },
]

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.sidebar {
  width: 248px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
}

/* Top */
.sidebar-top {
  padding: 20px 16px 14px;
  border-bottom: 1px solid var(--border);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.sidebar-logo-icon {
  width: 36px;
  height: 36px;
  background: var(--accent);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
  flex-shrink: 0;
}

.sidebar-logo-name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--ink);
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--surface2);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.user-av {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 13px;
  color: #fff;
  flex-shrink: 0;
}

.user-info { min-width: 0; }

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 10.5px;
  color: var(--ink4);
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 1px;
}

/* Nav */
.sidebar-nav { padding: 12px 10px; flex: 1; }

.nav-section-label {
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--ink4);
  padding: 10px 10px 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--ink3);
  font-size: 13.5px;
  font-weight: 400;
  transition: all .18s;
  margin: 1px 0;
  position: relative;
  text-decoration: none;
}

.nav-item:hover {
  background: var(--accent-xl);
  color: var(--text);
}

.nav-item.active {
  background: var(--accent-l);
  color: var(--accent);
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 3px;
  background: var(--accent);
  border-radius: 0 2px 2px 0;
}

.nav-icon { font-size: 17px; flex-shrink: 0; line-height: 1; }

.nav-badge {
  margin-left: auto;
  background: var(--accent);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 99px;
  min-width: 20px;
  text-align: center;
}

/* Footer */
.sidebar-footer {
  padding: 12px 14px;
  border-top: 1px solid var(--border);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: var(--radius);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  color: var(--red);
  font-size: 13px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all .2s;
}

.logout-btn:hover {
  background: var(--err-bg);
  border-color: rgba(239,68,68,0.2);
}
</style>
