<template>
  <div class="app-shell">
    <SidebarNav />
    <div class="main">
      <header class="topbar">
        <div class="topbar-search">
          <i class="ph ph-magnifying-glass search-ic"></i>
          <input v-model="eventsStore.searchQ" type="text" placeholder="Search events…" />
        </div>
        <div class="topbar-actions">
          <RouterLink to="/attendee/notifications" class="icon-btn" title="Notifications">
            <i class="ph ph-bell"></i>
            <span v-if="eventsStore.unreadCount > 0" class="notif-badge">{{ eventsStore.unreadCount }}</span>
          </RouterLink>
          <RouterLink to="/" class="btn btn-ghost" style="font-size:13px;padding:7px 16px">
            <i class="ph ph-arrow-left"></i> Landing
          </RouterLink>
          <RouterLink to="/attendee/profile" class="user-chip">
            <div class="user-chip-av">{{ auth.initials }}</div>
            <span class="user-chip-name">{{ auth.user?.fullName?.split(' ')[0] }}</span>
            <i class="ph ph-caret-down" style="font-size:11px;color:var(--ink4)"></i>
          </RouterLink>
        </div>
      </header>
      <div class="page-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import SidebarNav from '@/components/SidebarNav.vue'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'

const eventsStore = useEventsStore()
const auth = useAuthStore()

onMounted(() => eventsStore.loadAll(auth.user?.id || auth.user?.userID))
</script>

<style scoped>
.app-shell { display: flex; height: 100vh; overflow: hidden; background: var(--bg); }
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.topbar {
  height: 60px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 24px;
  flex-shrink: 0;
}

.topbar-search { flex: 1; max-width: 400px; position: relative; }

.topbar-search input {
  width: 100%;
  padding: 9px 14px 9px 36px;
  border: 1.5px solid var(--border2);
  border-radius: 99px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px;
  background: var(--surface2);
  color: var(--ink);
  outline: none;
  transition: all .2s;
}
.topbar-search input:focus {
  border-color: var(--a500);
  background: var(--surface3);
  box-shadow: 0 0 0 3px rgba(245,158,11,.12);
}
.topbar-search input::placeholder { color: var(--ink4); }

.search-ic {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 15px;
  color: var(--ink4);
  pointer-events: none;
}

.topbar-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }

.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--radius);
  border: 1.5px solid var(--border2);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink3);
  font-size: 18px;
  transition: all .18s;
  position: relative;
  text-decoration: none;
}
.icon-btn:hover { background: var(--accent-xl); border-color: var(--accent); color: var(--accent); }

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background: var(--accent);
  border-radius: 99px;
  border: 2px solid var(--surface);
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}

.page-content { flex: 1; overflow-y: auto; }

.user-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px 5px 5px;
  border-radius: 99px;
  border: 1.5px solid var(--border2);
  background: var(--surface2);
  text-decoration: none;
  transition: all .18s;
  cursor: pointer;
}
.user-chip:hover { border-color: var(--accent); background: var(--surface3); }

.user-chip-av {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.user-chip-name { font-size: 13px; font-weight: 500; color: var(--ink2); }

@media (max-width: 900px) { .sidebar { display: none; } }
</style>
