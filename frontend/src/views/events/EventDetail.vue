<template>
  <div class="py-5">
    <div class="container">
      <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
      <div v-else-if="!event" class="text-center py-5">
        <h5 class="text-muted">Event not found.</h5>
        <router-link to="/events" class="btn btn-primary-custom mt-3">Back to Events</router-link>
      </div>
      <div v-else>
        <!-- Back -->
        <router-link to="/events" class="text-decoration-none text-muted small mb-3 d-inline-block">
          <i class="bi bi-arrow-left me-1"></i>Back to Events
        </router-link>

        <div class="row g-4">
          <!-- Main -->
          <div class="col-lg-8">
            <div class="rounded-4 d-flex align-items-center justify-content-center mb-4" :style="{ background: gradient, height: '280px' }">
              <i class="bi bi-calendar-event text-white" style="font-size:5rem;opacity:.6"></i>
            </div>
            <div class="d-flex gap-2 mb-3">
              <span class="badge rounded-pill px-3 py-2" :class="statusClass">{{ event.status }}</span>
              <span class="badge bg-light text-dark px-3 py-2">{{ event.categoryName }}</span>
            </div>
            <h2 class="fw-bold mb-3">{{ event.title }}</h2>
            <p class="text-muted">{{ event.description }}</p>

            <!-- Reviews -->
            <div class="mt-5">
              <h5 class="fw-bold mb-3">Reviews</h5>
              <div v-if="reviews.length === 0" class="text-muted small">No reviews yet.</div>
              <div v-for="r in reviews" :key="r.reviewID" class="card border-0 bg-light rounded-3 p-3 mb-2">
                <div class="d-flex justify-content-between">
                  <strong class="small">{{ r.userName }}</strong>
                  <span>
                    <i v-for="n in 5" :key="n" class="bi" :class="n <= r.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'" style="font-size:.8rem"></i>
                  </span>
                </div>
                <p class="mb-0 small text-muted mt-1">{{ r.comment }}</p>
              </div>

              <!-- Add review (attendee who registered) -->
              <div v-if="auth.isLoggedIn && isRegistered" class="mt-3">
                <h6 class="fw-semibold">Leave a Review</h6>
                <div class="d-flex gap-1 mb-2">
                  <i v-for="n in 5" :key="n" class="bi fs-5 cursor-pointer"
                    :class="n <= reviewForm.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
                    @click="reviewForm.rating = n" style="cursor:pointer"></i>
                </div>
                <textarea v-model="reviewForm.comment" class="form-control mb-2" rows="2" placeholder="Share your experience..."></textarea>
                <button class="btn btn-primary-custom btn-sm" @click="submitReview">Submit Review</button>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 sticky-top" style="top:80px">
              <h5 class="fw-bold mb-3">Event Details</h5>
              <ul class="list-unstyled">
                <li class="mb-3 d-flex gap-3">
                  <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:40px;height:40px;background:#f0f4ff;flex-shrink:0">
                    <i class="bi bi-calendar3 text-primary"></i>
                  </div>
                  <div>
                    <div class="small text-muted">Date & Time</div>
                    <div class="fw-semibold small">{{ formatDate(event.eventDate) }}</div>
                  </div>
                </li>
                <li class="mb-3 d-flex gap-3">
                  <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:40px;height:40px;background:#f0f4ff;flex-shrink:0">
                    <i class="bi bi-geo-alt text-primary"></i>
                  </div>
                  <div>
                    <div class="small text-muted">Venue</div>
                    <div class="fw-semibold small">{{ event.venueName }}</div>
                    <div class="small text-muted">{{ event.venueCity }}</div>
                  </div>
                </li>
                <li class="mb-3 d-flex gap-3">
                  <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:40px;height:40px;background:#f0f4ff;flex-shrink:0">
                    <i class="bi bi-people text-primary"></i>
                  </div>
                  <div>
                    <div class="small text-muted">Capacity</div>
                    <div class="fw-semibold small">{{ event.maxAttendees }} spots</div>
                  </div>
                </li>
              </ul>

              <hr />

              <!-- Register / Cancel -->
              <div v-if="!auth.isLoggedIn">
                <router-link to="/login" class="btn btn-primary-custom w-100">Login to Register</router-link>
              </div>
              <div v-else-if="auth.isOrganizer || auth.isAdmin">
                <p class="text-muted small text-center mb-0">Organizers cannot register for events.</p>
              </div>
              <div v-else>
                <div v-if="isRegistered">
                  <div class="alert alert-success py-2 small text-center mb-3">
                    <i class="bi bi-check-circle me-1"></i>You're registered!
                  </div>
                  <button class="btn btn-outline-danger w-100" @click="cancelRegistration" :disabled="regLoading">
                    <span v-if="regLoading" class="spinner-border spinner-border-sm me-1"></span>
                    Cancel Registration
                  </button>
                </div>
                <div v-else>
                  <button class="btn btn-primary-custom w-100 py-2" @click="registerForEvent" :disabled="regLoading || event.status !== 'Active'">
                    <span v-if="regLoading" class="spinner-border spinner-border-sm me-1"></span>
                    <i class="bi bi-ticket me-2" v-else></i>
                    {{ event.status === 'Active' ? 'Register Now' : 'Registration Closed' }}
                  </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { eventsAPI, registrationsAPI, reviewsAPI } from '../../services/api'

const route = useRoute()
const auth = useAuthStore()

const event = ref(null)
const reviews = ref([])
const loading = ref(true)
const regLoading = ref(false)
const myRegistrationId = ref(null)
const isRegistered = ref(false)
const reviewForm = ref({ rating: 5, comment: '' })

const gradients = ['linear-gradient(135deg,#4f46e5,#06b6d4)', 'linear-gradient(135deg,#10b981,#06b6d4)', 'linear-gradient(135deg,#f59e0b,#ef4444)']
const gradient = computed(() => gradients[(event.value?.eventID || 0) % gradients.length])
const statusClass = computed(() => ({
  'badge-pending': event.value?.status === 'Pending',
  'badge-active': event.value?.status === 'Active',
  'badge-cancelled': event.value?.status === 'Cancelled',
  'badge-completed': event.value?.status === 'Completed'
}))

onMounted(async () => {
  try {
    const [evRes, revRes] = await Promise.all([
      eventsAPI.getById(route.params.id),
      reviewsAPI.byEvent(route.params.id)
    ])
    event.value = evRes.data
    reviews.value = revRes.data

    if (auth.isLoggedIn && auth.isAttendee) {
      const regRes = await registrationsAPI.byUser(auth.user.userID)
      const reg = regRes.data.find(r => r.eventID == route.params.id)
      if (reg) { isRegistered.value = true; myRegistrationId.value = reg.registrationID }
    }
  } finally {
    loading.value = false
  }
})

async function registerForEvent() {
  regLoading.value = true
  try {
    const res = await registrationsAPI.create({ userID: auth.user.userID, eventID: event.value.eventID })
    myRegistrationId.value = res.data.registrationID
    isRegistered.value = true
  } finally { regLoading.value = false }
}

async function cancelRegistration() {
  regLoading.value = true
  try {
    await registrationsAPI.cancel(myRegistrationId.value)
    isRegistered.value = false
    myRegistrationId.value = null
  } finally { regLoading.value = false }
}

async function submitReview() {
  await reviewsAPI.create({ userID: auth.user.userID, eventID: event.value.eventID, ...reviewForm.value })
  const res = await reviewsAPI.byEvent(route.params.id)
  reviews.value = res.data
  reviewForm.value = { rating: 5, comment: '' }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
