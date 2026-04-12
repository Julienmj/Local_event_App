<template>
  <div class="py-5">
    <div class="container">
      <h2 class="section-title mb-1">My Registered Events</h2>
      <p class="text-muted mb-4">Events you've signed up for</p>

      <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

      <div v-else-if="registrations.length === 0" class="text-center py-5">
        <i class="bi bi-ticket" style="font-size:4rem;color:#cbd5e1"></i>
        <h5 class="mt-3 text-muted">No registrations yet</h5>
        <router-link to="/events" class="btn btn-primary-custom mt-3">Browse Events</router-link>
      </div>

      <div v-else class="row g-4">
        <div class="col-md-6" v-for="reg in registrations" :key="reg.registrationID">
          <div class="card border-0 shadow-sm rounded-4 p-3">
            <div class="d-flex gap-3 align-items-start">
              <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:56px;height:56px;background:linear-gradient(135deg,#4f46e5,#06b6d4)">
                <i class="bi bi-calendar-event text-white fs-4"></i>
              </div>
              <div class="flex-grow-1">
                <h6 class="fw-bold mb-1">{{ reg.eventTitle }}</h6>
                <p class="small text-muted mb-1"><i class="bi bi-calendar3 me-1"></i>{{ formatDate(reg.eventDate) }}</p>
                <p class="small text-muted mb-2"><i class="bi bi-geo-alt me-1"></i>{{ reg.venueName }}</p>
                <div class="d-flex gap-2 align-items-center">
                  <span class="badge rounded-pill" :class="reg.status === 'Confirmed' ? 'badge-active' : 'badge-cancelled'">{{ reg.status }}</span>
                  <button class="btn btn-outline-danger btn-sm ms-auto" @click="cancel(reg)" v-if="reg.status === 'Confirmed'">
                    Cancel
                  </button>
                  <router-link :to="`/events/${reg.eventID}`" class="btn btn-outline-primary btn-sm">View</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { registrationsAPI } from '../../services/api'

const auth = useAuthStore()
const registrations = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await registrationsAPI.byUser(auth.user.userID)
    registrations.value = res.data
  } finally { loading.value = false }
})

async function cancel(reg) {
  if (!confirm('Cancel your registration for this event?')) return
  await registrationsAPI.cancel(reg.registrationID)
  reg.status = 'Cancelled'
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
