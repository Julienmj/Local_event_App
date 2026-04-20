<template>
  <div class="app-shell">
    <SidebarNav />
    <div class="main">
      <header class="topbar">
        <div class="topbar-search">
          <svg class="search-ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="7" cy="7" r="5"/><path d="M12 12l2.5 2.5"/>
          </svg>
          <input
            v-model="eventsStore.searchQ"
            type="text"
            placeholder="Search events…"
          />
        </div>
        <div class="topbar-actions">
          <RouterLink to="/app/notifications" class="icon-btn" title="Notifications">
            🔔
            <span v-if="eventsStore.unreadCount > 0" class="notif-badge"></span>
          </RouterLink>
          <RouterLink to="/" class="btn btn-ghost" style="font-size:13px;padding:7px 14px">← Landing</RouterLink>
          <RouterLink to="/app/create" class="btn btn-amber" style="padding:8px 18px;font-size:13px">+ Create Event</RouterLink>
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
.app-shell { display: flex; height: 100vh; overflow: hidden; }
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.topbar { height: 58px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 14px; padding: 0 26px; flex-shrink: 0; }
.topbar-search { flex: 1; max-width: 420px; position: relative; }
.topbar-search input { width: 100%; padding: 8px 14px 8px 36px; border: 1.5px solid var(--border2); border-radius: 99px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13.5px; background: var(--cream); color: var(--ink); outline: none; transition: all .2s; }
.topbar-search input:focus { border-color: var(--a400); background: #fff; box-shadow: 0 0 0 3px rgba(245,158,11,.1); }
.search-ic { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--ink4); }
.topbar-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.icon-btn { width: 36px; height: 36px; border-radius: var(--radius); border: 1.5px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ink3); transition: all .18s; position: relative; text-decoration: none; }
.icon-btn:hover { background: var(--a50); border-color: var(--a300); color: var(--a700); }
.notif-badge { position: absolute; top: 5px; right: 5px; width: 8px; height: 8px; background: var(--a500); border-radius: 50%; border: 2px solid var(--surface); }
.page-content { flex: 1; overflow-y: auto; }
@media (max-width: 900px) { .sidebar { display: none; } }
</style>
