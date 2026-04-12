<template>
  <div class="page-wrapper">
    <OrganizerSidebar />
    <div class="main-content">
      <router-link to="/organizer" class="text-decoration-none text-muted small mb-3 d-inline-block">
        <i class="bi bi-arrow-left me-1"></i>Back to Dashboard
      </router-link>
      <h4 class="fw-bold mb-4">Edit Event</h4>

      <div v-if="pageLoading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

      <div v-else class="card border-0 shadow-sm rounded-4 p-4" style="max-width:700px">
        <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>
        <div v-if="success" class="alert alert-success py-2 small">Event updated successfully!</div>

        <form @submit.prevent="submit">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label fw-semibold small">Event Title *</label>
              <input v-model="form.title" type="text" class="form-control" required />
            </div>
            <div class="col-12">
              <label class="form-label fw-semibold small">Description *</label>
              <textarea v-model="form.description" class="form-control" rows="4" required></textarea>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold small">Event Date & Time *</label>
              <input v-model="form.eventDate" type="datetime-local" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold small">Max Attendees *</label>
              <input v-model.number="form.maxAttendees" type="number" class="form-control" min="1" required />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold small">Category *</label>
              <select v-model.number="form.categoryID" class="form-select" required>
                <option v-for="c in categories" :key="c.categoryID" :value="c.categoryID">{{ c.name }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold small">Venue *</label>
              <select v-model.number="form.venueID" class="form-select" required>
                <option v-for="v in venues" :key="v.venueID" :value="v.venueID">{{ v.name }} — {{ v.city }}</option>
              </select>
            </div>
            <div class="col-12 pt-2">
              <button type="submit" class="btn btn-primary-custom px-4" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Save Changes
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
import { useRoute } from 'vue-router'
import { eventsAPI, categoriesAPI, venuesAPI } from '../../services/api'
import OrganizerSidebar from './OrganizerSidebar.vue'

const route = useRoute()
const categories = ref([])
const venues = ref([])
const pageLoading = ref(true)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const form = ref({})

onMounted(async () => {
  const [evRes, catRes, venRes] = await Promise.all([
    eventsAPI.getById(route.params.id),
    categoriesAPI.getAll(),
    venuesAPI.getAll()
  ])
  const e = evRes.data
  form.value = {
    title: e.title, description: e.description,
    eventDate: e.eventDate?.slice(0, 16),
    maxAttendees: e.maxAttendees, categoryID: e.categoryID, venueID: e.venueID
  }
  categories.value = catRes.data
  venues.value = venRes.data
  pageLoading.value = false
})

async function submit() {
  error.value = ''; loading.value = true
  try {
    await eventsAPI.update(route.params.id, form.value)
    success.value = true
  } catch (e) {
    error.value = e.response?.data?.message || 'Update failed.'
  } finally { loading.value = false }
}
</script>
