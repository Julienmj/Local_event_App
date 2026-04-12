<template>
  <div class="event-card card h-100">
    <div class="card-img-top d-flex align-items-center justify-content-center" :style="{ background: gradient, height: '160px' }">
      <i class="bi bi-calendar-event text-white" style="font-size:3rem;opacity:.7"></i>
    </div>
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <span class="badge rounded-pill px-3 py-1" :class="statusClass">{{ event.status }}</span>
        <small class="text-muted"><i class="bi bi-tag me-1"></i>{{ event.categoryName }}</small>
      </div>
      <h6 class="fw-bold mb-1">{{ event.title }}</h6>
      <p class="text-muted small mb-2 flex-grow-1">{{ truncate(event.description, 80) }}</p>
      <div class="small text-muted mb-3">
        <div><i class="bi bi-calendar3 me-1"></i>{{ formatDate(event.eventDate) }}</div>
        <div><i class="bi bi-geo-alt me-1"></i>{{ event.venueName }}</div>
        <div><i class="bi bi-people me-1"></i>{{ event.maxAttendees }} spots</div>
      </div>
      <router-link :to="`/events/${event.eventID}`" class="btn btn-primary-custom btn-sm w-100">
        View Details
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ event: Object })

const gradients = [
  'linear-gradient(135deg,#4f46e5,#06b6d4)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
  'linear-gradient(135deg,#3b82f6,#10b981)'
]
const gradient = computed(() => gradients[props.event.eventID % gradients.length])

const statusClass = computed(() => ({
  'badge-pending': props.event.status === 'Pending',
  'badge-active': props.event.status === 'Active',
  'badge-cancelled': props.event.status === 'Cancelled',
  'badge-completed': props.event.status === 'Completed'
}))

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}
function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '…' : str
}
</script>
