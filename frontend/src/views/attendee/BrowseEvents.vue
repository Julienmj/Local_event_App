<template>
  <div class="content-main">
    <div class="page-header">
      <h1 class="page-title">Browse Events</h1>
      <p class="page-sub">Discover what's happening across Rwanda</p>
    </div>

    <!-- Filters -->
    <div class="chips">
      <span
        class="chip"
        :class="{ active: eventsStore.catFilter === 'All' }"
        @click="eventsStore.catFilter = 'All'"
      >All</span>
      <span
        v-for="cat in eventsStore.categories"
        :key="cat.id"
        class="chip"
        :class="{ active: eventsStore.catFilter === cat.name }"
        @click="eventsStore.catFilter = cat.name"
      >{{ cat.icon }} {{ cat.name }}</span>
    </div>

    <!-- View toggle -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
      <span style="font-size:13px;color:var(--ink3)">{{ eventsStore.filteredEvents.length }} events found</span>
      <div class="view-toggle">
        <span class="vt" :class="{ active: view === 'grid' }" @click="view = 'grid'">⊞ Grid</span>
        <span class="vt" :class="{ active: view === 'map' }" @click="view = 'map'">🗺 Map</span>
      </div>
    </div>

    <!-- Grid -->
    <div v-if="view === 'grid'" class="events-grid">
      <EventCard
        v-for="ev in eventsStore.filteredEvents"
        :key="ev.id || ev.eventID"
        :event="ev"
        :is-saved="eventsStore.isSaved(ev.id)"
        @open="openModal"
        @save="eventsStore.toggleSave($event)"
      />
      <div v-if="!eventsStore.filteredEvents.length" class="empty" style="grid-column:1/-1">
        <h3>No events found</h3>
        <p>Try adjusting your search or category filter.</p>
      </div>
    </div>

    <!-- Map -->
    <div v-show="view === 'map'" id="map" ref="mapEl"></div>

    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      :is-saved="eventsStore.isSaved(selectedEvent.id)"
      @close="selectedEvent = null"
      @save="eventsStore.toggleSave($event)"
      @registered="eventsStore.addNotification('Registration confirmed for ' + selectedEvent?.title)"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import { useEventsStore } from '@/stores/events'
import EventCard from '@/components/EventCard.vue'
import EventModal from '@/components/EventModal.vue'

const eventsStore = useEventsStore()
const view = ref('grid')
const selectedEvent = ref(null)
const mapEl = ref(null)
let mapInstance = null

function openModal(ev) { selectedEvent.value = ev }

async function initMap() {
  await nextTick()
  if (!mapEl.value || mapInstance) return
  mapInstance = L.map(mapEl.value, { center: [-1.9536, 30.0606], zoom: 12 })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', maxZoom: 19
  }).addTo(mapInstance)

  const icon = L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;background:#F59E0B;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:12px">📍</div>`,
    iconSize: [28, 28], iconAnchor: [14, 14],
  })

  eventsStore.filteredEvents.forEach(ev => {
    const venue = ev.venue || eventsStore.venues.find(v => v.id === ev.venueID || v.id === ev.venueId)
    if (venue?.latitude && venue?.longitude) {
      const timeStr = ev.eventTime || (ev.eventDate ? new Date(ev.eventDate).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }) : '')
      L.marker([venue.latitude, venue.longitude], { icon })
        .addTo(mapInstance)
        .bindPopup(`<div style="font-family:'Cormorant Garamond',serif;font-weight:700;font-size:1rem">${ev.title}</div><div style="font-size:12px;color:#8B7D5C">${venue.name || venue.venueName} · ${timeStr}</div>`)
    }
  })
}

watch(view, async (v) => {
  if (v === 'map') await initMap()
})

onUnmounted(() => { if (mapInstance) { mapInstance.remove(); mapInstance = null } })
</script>

<style scoped>
.content-main { padding: 28px 30px; overflow-y: auto; }
.page-header { margin-bottom: 26px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.page-sub { font-size: 13px; color: var(--ink3); font-weight: 300; }
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
.view-toggle { display: flex; gap: 2px; background: var(--cream2); border-radius: 99px; padding: 3px; }
.vt { padding: 5px 14px; border-radius: 99px; font-size: 12.5px; font-weight: 500; cursor: pointer; color: var(--ink3); transition: all .18s; }
.vt.active { background: #fff; color: var(--ink); box-shadow: 0 1px 4px rgba(0,0,0,.1); }
#map { height: 420px; border-radius: var(--radius-xl); border: 1.5px solid var(--border); overflow: hidden; margin-bottom: 24px; }
</style>
