<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">📍</div>
        <span class="sidebar-logo-name">EventLocal</span>
      </div>
      <div class="sidebar-user">
        <div class="user-av">{{ auth.initials }}</div>
        <div>
          <div class="user-name">{{ auth.user?.fullName || 'User' }}</div>
          <div class="user-role">{{ auth.user?.role || 'Attendee' }}</div>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Main</div>
      <RouterLink
        v-for="item in mainNav"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        active-class="active"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>

      <template v-if="auth.isOrganizer">
        <div class="nav-section-label" style="margin-top:8px">Organizer</div>
        <RouterLink
          v-for="item in organizerNav"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          active-class="active"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </template>

      <div class="nav-section-label" style="margin-top:8px">Account</div>
      <RouterLink
        v-for="item in accountNav"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        active-class="active"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        {{ item.label }}
        <span v-if="item.badge && eventsStore.unreadCount > 0" class="nav-badge">
          {{ eventsStore.unreadCount }}
        </span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout">🚪 Sign out</button>
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
  { to: '/app/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/app/events', icon: '📅', label: 'Browse Events' },
  { to: '/app/saved', icon: '🔖', label: 'Saved' },
]

const organizerNav = [
  { to: '/app/myevents', icon: '📋', label: 'My Events' },
  { to: '/app/create', icon: '✨', label: 'Create Event' },
  { to: '/app/analytics', icon: '📊', label: 'Analytics' },
  { to: '/app/venues', icon: '📍', label: 'Venues' },
  { to: '/app/categories', icon: '🏷️', label: 'Categories' },
]

const accountNav = [
  { to: '/app/notifications', icon: '🔔', label: 'Notifications', badge: true },
  { to: '/app/profile', icon: '👤', label: 'Profile' },
]

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.sidebar { width: 252px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; }
.sidebar-top { padding: 22px 18px 10px; border-bottom: 1px solid var(--border); }
.sidebar-logo { display: flex; align-items: center; gap: 9px; margin-bottom: 16px; }
.sidebar-logo-icon { width: 36px; height: 36px; background: var(--a500); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.sidebar-logo-name { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.2rem; color: var(--ink); }
.sidebar-user { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--cream2); border-radius: var(--radius-lg); }
.user-av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--a500), var(--a700)); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 13px; color: #fff; flex-shrink: 0; }
.user-name { font-size: 13px; font-weight: 500; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 10.5px; color: var(--ink3); }
.sidebar-nav { padding: 12px 10px; flex: 1; }
.nav-section-label { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; color: var(--ink4); padding: 10px 10px 6px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--radius); cursor: pointer; color: var(--ink3); font-size: 13.5px; font-weight: 400; transition: all .18s; margin: 1px 0; position: relative; text-decoration: none; }
.nav-item:hover { background: var(--a50); color: var(--ink2); }
.nav-item.active { background: var(--a100); color: var(--a800); font-weight: 500; }
.nav-item.active::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; background: var(--a500); border-radius: 0 2px 2px 0; }
.nav-icon { width: 17px; height: 17px; flex-shrink: 0; }
.nav-badge { margin-left: auto; background: var(--a500); color: #fff; font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 99px; min-width: 20px; text-align: center; }
.sidebar-footer { padding: 12px 14px; border-top: 1px solid var(--border); }
.logout-btn { width: 100%; display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: var(--radius); background: transparent; border: none; cursor: pointer; color: var(--red); font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; transition: background .2s; }
.logout-btn:hover { background: var(--red-pale); }
</style>
