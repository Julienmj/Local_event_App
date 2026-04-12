<template>
  <div class="page-wrapper">
    <OrganizerSidebar />
    <div class="main-content">
      <router-link to="/organizer" class="text-decoration-none text-muted small mb-3 d-inline-block">
        <i class="bi bi-arrow-left me-1"></i>Back to Dashboard
      </router-link>
      <h4 class="fw-bold mb-4">Create New Event</h4>

      <div class="card border-0 shadow-sm rounded-4 p-4" style="max-width:700px">
        <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>
        <div v-if="success" class="alert alert-success py-2 small">Event created and submitted for approval!</div>

        <form @submit.prevent="submit">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label fw-semibold small">Event Title *</label>
              <input v-model="form.title" type="text" class="form-control" placeholder="e.g. Community Tech Meetup" required />
            </div>
            <div class="col-12">
              <label class="form-label fw-semibold small">Description *</label>
              <textarea v-model="form.description" class="form-control" rows="4" placeholder="Describe your event..." required></textarea>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold small">Event Date & Time *</label>
              <input v-model="form.eventDate" type="datetime-local" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold small">Max Attendees *</label>
              <input v-model.number="form.maxAttendees" type="number" class="form-control" min="1" placeholder="50" required />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold small">Category *</label>
              <select v-model.number="form.categoryID" class="form-select" required>
                <option value="">Select category</option>
                <option v-for="c in categories" :key="c.categoryID" :value="c.categoryID">{{ c.name }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold small">Venue *</label>
              <select v-model.number="form.venueID" class="form-select" required>
                <option value="">Select venue</option>
                <option v-for="v in venues" :key="v.venueID" :value="v.venueID">{{ v.name }} — {{ v.city }}</option>
              </select>
            </div>
            <div class="col-12 pt-2">
              <button type="submit" class="btn btn-primary-custom px-4" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i class="bi bi-send me-2" v-else></i>Submit for Approval
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { eventsAPI, categoriesAPI, venuesAPI } from '../../services/api'
import OrganizerSidebar from './OrganizerSidebar.vue'

const auth = useAuthStore()
const categories = ref([])
const venues = ref([])
const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = ref({ title: '', description: '', eventDate: '', maxAttendees: '', categoryID: '', venueID: '' })

onMounted(async () => {
  const [catRes, venRes] = await Promise.all([categoriesAPI.getAll(), venuesAPI.getAll()])
  categories.value = catRes.data
  venues.value = venRes.data
})

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await eventsAPI.create({ ...form.value, organizerID: auth.user.userID })
    success.value = true
    form.value = { title: '', description: '', eventDate: '', maxAttendees: '', categoryID: '', venueID: '' }
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to create event.'
  } finally { loading.value = false }
}
</script>
