<template>
  <div class="content-main">
    <div class="page-header">
      <h1 class="page-title">Saved Events</h1>
      <p class="page-sub">Events you've bookmarked</p>
    </div>
    <div v-if="saved.length" class="events-grid">
      <EventCard
        v-for="ev in saved"
        :key="ev.id || ev.eventID"
        :event="ev"
        :is-saved="true"
        @open="selectedEvent = $event"
        @save="eventsStore.toggleSave($event)"
      />
    </div>
    <div v-else class="empty">
      <h3>No saved events yet</h3>
      <p>Browse events and tap 🤍 to save them here.</p>
      <RouterLink to="/app/events" class="btn btn-amber">Browse Events</RouterLink>
    </div>
    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      :is-saved="true"
      :reviews="[]"
      @close="selectedEvent = null"
      @save="eventsStore.toggleSave($event)"
      @registered="eventsStore.addNotification('Registration confirmed for ' + selectedEvent?.title)"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEventsStore } from '@/stores/events'
import EventCard from '@/components/EventCard.vue'
import EventModal from '@/components/EventModal.vue'

const eventsStore = useEventsStore()
const selectedEvent = ref(null)
const saved = computed(() => eventsStore.events.filter(e => eventsStore.isSaved(e.id || e.eventID)))
</script>

<style scoped>
.content-main { padding: 28px 30px; overflow-y: auto; }
.page-header { margin-bottom: 26px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.page-sub { font-size: 13px; color: var(--ink3); font-weight: 300; }
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
</style>
