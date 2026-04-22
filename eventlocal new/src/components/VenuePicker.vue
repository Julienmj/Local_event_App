<template>
  <div class="venue-picker">
    <div class="form-group">
      <label class="form-label">Search Venue Location</label>
      <div class="search-wrap">
        <input
          v-model="query"
          class="form-input"
          type="text"
          placeholder="Type address or place name..."
          @keyup.enter="searchLocation"
        />
        <button type="button" class="btn-search" @click="searchLocation" :disabled="searching">
          {{ searching ? '...' : '🔍' }}
        </button>
      </div>
      <div v-if="results.length" class="search-results">
        <div
          v-for="res in results"
          :key="res.place_id"
          class="res-item"
          @click="selectLocation(res)"
        >
          {{ res.display_name }}
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Latitude</label>
        <input
          :value="modelValue.latitude"
          class="form-input"
          type="number"
          step="any"
          @input="updateLat($event.target.value)"
        />
      </div>
      <div class="form-group">
        <label class="form-label">Longitude</label>
        <input
          :value="modelValue.longitude"
          class="form-input"
          type="number"
          step="any"
          @input="updateLng($event.target.value)"
        />
      </div>
    </div>

    <button type="button" class="btn btn-ghost btn-full" @click="getCurrentLocation">
      📍 Use My Current Location
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ latitude: 0, longitude: 0, address: '' })
  }
})

const emit = defineEmits(['update:modelValue'])

const query = ref(props.modelValue.address || '')
const searching = ref(false)
const results = ref([])

async function searchLocation() {
  if (!query.value.trim()) return
  searching.value = true
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.value)}`)
    results.value = await res.json()
  } catch (e) {
    console.error('Search failed', e)
  } finally {
    searching.value = false
  }
}

function selectLocation(res) {
  emit('update:modelValue', {
    ...props.modelValue,
    latitude: parseFloat(res.lat),
    longitude: parseFloat(res.lon),
    address: res.display_name
  })
  query.value = res.display_name
  results.value = []
}

function getCurrentLocation() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition((pos) => {
    emit('update:modelValue', {
      ...props.modelValue,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    })
  })
}

function updateLat(v) {
  emit('update:modelValue', { ...props.modelValue, latitude: parseFloat(v) })
}

function updateLng(v) {
  emit('update:modelValue', { ...props.modelValue, longitude: parseFloat(v) })
}
</script>

<style scoped>
.venue-picker { display: flex; flex-direction: column; gap: 4px; }
.search-wrap { display: flex; gap: 8px; position: relative; }
.btn-search { background: var(--a500); border: none; border-radius: var(--radius); width: 42px; color: #fff; cursor: pointer; }
.search-results { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1.5px solid var(--border2); border-radius: var(--radius); z-index: 10; max-height: 200px; overflow-y: auto; box-shadow: var(--shadow-lg); }
.res-item { padding: 8px 12px; font-size: 12.5px; cursor: pointer; border-bottom: 1px solid var(--border); color: #000; }
.res-item:hover { background: var(--a50); }
</style>
