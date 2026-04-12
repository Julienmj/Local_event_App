<template>
  <div class="py-5">
    <div class="container">
      <h2 class="section-title mb-1">Browse Events</h2>
      <p class="text-muted mb-4">Discover what's happening in your community</p>

      <!-- Filters -->
      <div class="card border-0 shadow-sm rounded-3 p-3 mb-4">
        <div class="row g-2 align-items-end">
          <div class="col-md-4">
            <label class="form-label small fw-semibold">Search</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input v-model="search" type="text" class="form-control" placeholder="Search events..." />
            </div>
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-semibold">Category</label>
            <select v-model="selectedCategory" class="form-select">
              <option value="">All Categories</option>
              <option v-for="c in eventsStore.categories" :key="c.categoryID" :value="c.categoryID">{{ c.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-semibold">Date From</label>
            <input v-model="dateFrom" type="date" class="form-control" />
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-1"></i>Clear
            </button>
          </div>
        </div>
      </div>

      <!-- Results count -->
      <p class="text-muted small mb-3">Showing <strong>{{ filtered.length }}</strong> events</p>

      <!-- Loading -->
      <div v-if="eventsStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2 text-muted">Loading events...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="filtered.length === 0" class="text-center py-5">
        <i class="bi bi-calendar-x" style="font-size:4rem;color:#cbd5e1"></i>
        <h5 class="mt-3 text-muted">No events found</h5>
        <p class="text-muted small">Try adjusting your filters</p>
      </div>

      <!-- Grid -->
      <div v-else class="row g-4">
        <div class="col-md-4 col-lg-3" v-for="event in paginated" :key="event.eventID">
          <EventCard :event="event" />
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <button class="page-link" @click="page--">‹</button>
          </li>
          <li class="page-item" v-for="p in totalPages" :key="p" :class="{ active: p === page }">
            <button class="page-link" @click="page = p">{{ p }}</button>
          </li>
          <li class="page-item" :class="{ disabled: page === totalPages }">
            <button class="page-link" @click="page++">›</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEventsStore } from '../../stores/events'
import EventCard from '../../components/EventCard.vue'

const eventsStore = useEventsStore()
const route = useRoute()

const search = ref('')
const selectedCategory = ref('')
const dateFrom = ref('')
const page = ref(1)
const perPage = 8

onMounted(async () => {
  await eventsStore.fetchEvents()
  await eventsStore.fetchCategories()
  if (route.query.category) {
    const cat = eventsStore.categories.find(c => c.name === route.query.category)
    if (cat) selectedCategory.value = cat.categoryID
  }
})

watch([search, selectedCategory, dateFrom], () => { page.value = 1 })

const filtered = computed(() => {
  return eventsStore.events.filter(e => {
    const matchSearch = !search.value || e.title.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = !selectedCategory.value || e.categoryID === selectedCategory.value
    const matchDate = !dateFrom.value || new Date(e.eventDate) >= new Date(dateFrom.value)
    return matchSearch && matchCat && matchDate && e.status === 'Active'
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))
const paginated = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

function clearFilters() {
  search.value = ''
  selectedCategory.value = ''
  dateFrom.value = ''
}
</script>
