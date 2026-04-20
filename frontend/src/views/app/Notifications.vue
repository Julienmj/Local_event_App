<template>
  <div class="content-main">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:26px">
      <div>
        <h1 class="page-title">Notifications</h1>
        <p class="page-sub">{{ eventsStore.unreadCount }} unread</p>
      </div>
      <button v-if="eventsStore.unreadCount > 0" class="btn btn-ghost" style="font-size:13px" @click="markAll">
        Mark all read
      </button>
    </div>

    <div v-if="eventsStore.notifications.length" class="notif-list">
      <div
        v-for="n in eventsStore.notifications"
        :key="n.id || n.notificationID"
        class="notif-item"
        :class="{ unread: !n.isRead }"
        @click="eventsStore.markRead(n.id || n.notificationID)"
      >
        <div class="notif-icon">🔔</div>
        <div style="flex:1">
          <div class="notif-title">{{ n.message }}</div>
          <div class="notif-body">{{ timeAgo(n.createdAt) }}</div>
        </div>
        <span v-if="!n.isRead" style="width:8px;height:8px;background:var(--a500);border-radius:50%;flex-shrink:0"></span>
      </div>
    </div>
    <div v-else class="empty">
      <h3>All caught up!</h3>
      <p>No notifications right now.</p>
    </div>
  </div>
</template>

<script setup>
import { useEventsStore } from '@/stores/events'

const eventsStore = useEventsStore()

function markAll() {
  eventsStore.notifications.forEach(n => {
    n.isRead = true
    eventsStore.markRead(n.id || n.notificationID)
  })
}

function timeAgo(iso) {
  if (!iso) return ''
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return Math.round(diff / 60) + 'm ago'
  if (diff < 86400) return Math.round(diff / 3600) + 'h ago'
  return Math.round(diff / 86400) + 'd ago'
}
</script>

<style scoped>
.content-main { padding: 28px 30px; overflow-y: auto; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.page-sub { font-size: 13px; color: var(--ink3); font-weight: 300; }
.notif-list { display: flex; flex-direction: column; gap: 8px; }
.notif-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px; cursor: pointer; transition: all .2s; }
.notif-item:hover { border-color: var(--a300); background: var(--a50); }
.notif-item.unread { border-left: 3px solid var(--a500); background: var(--a50); }
.notif-icon { width: 34px; height: 34px; border-radius: 50%; background: var(--a100); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.notif-title { font-size: 13.5px; font-weight: 500; color: var(--ink); margin-bottom: 2px; }
.notif-body { font-size: 12px; color: var(--ink3); font-weight: 300; }
</style>
