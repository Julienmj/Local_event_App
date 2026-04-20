<template>
  <div class="content-main">
    <div class="page-header">
      <h1 class="page-title">Create Event</h1>
      <p class="page-sub">Fill in the details to publish your event</p>
    </div>

    <form class="create-form" @submit.prevent="handleSubmit">
      <div class="form-section-title">Basic Information</div>
      <div class="form-group">
        <label class="form-label">Event Title *</label>
        <input v-model="form.title" class="form-input" type="text" placeholder="e.g. Kigali Jazz Night" required/>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Category *</label>
          <select v-model="form.categoryId" class="form-input" required>
            <option value="">Select category</option>
            <option v-for="c in eventsStore.categories" :key="c.CategoryID" :value="c.CategoryID">
              {{ c.icon }} {{ c.CategoryName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Venue *</label>
          <select v-model="form.venueId" class="form-input" required>
            <option value="">Select venue</option>
            <option v-for="v in eventsStore.venues" :key="v.VenueID" :value="v.VenueID">
              {{ v.VenueName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Date *</label>
          <input v-model="form.date" class="form-input" type="date" required/>
        </div>
        <div class="form-group">
          <label class="form-label">Time *</label>
          <input v-model="form.time" class="form-input" type="time" required/>
        </div>
        <div class="form-group">
          <label class="form-label">Ticket Price (RWF)</label>
          <input v-model.number="form.price" class="form-input" type="number" min="0" placeholder="0 for free"/>
        </div>
        <div class="form-group">
          <label class="form-label">Capacity *</label>
          <input v-model.number="form.capacity" class="form-input" type="number" min="1" placeholder="100" required/>
        </div>
      </div>

      <div class="form-section-title" style="margin-top:8px">Description</div>
      <div class="form-group">
        <label class="form-label">Event Description *</label>
        <textarea v-model="form.description" class="form-input textarea" placeholder="Describe your event…" required></textarea>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <div class="form-actions">
        <button type="submit" class="btn btn-amber" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>Publish Event</span>
        </button>
        <RouterLink to="/app/myevents" class="btn btn-ghost">Cancel</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'

const eventsStore = useEventsStore()
const auth = useAuthStore()
const api = useApi()
const router = useRouter()
const { show } = useToast()

const loading = ref(false)
const error = ref('')

const form = reactive({
  title: '', categoryId: '', venueId: '',
  date: '', time: '', price: 0, capacity: 100, description: '',
})

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    const payload = {
      title: form.title,
      description: form.description,
      eventDate: new Date(`${form.date}T${form.time}`).toISOString(),
      maxAttendees: form.capacity,
      status: 'upcoming',
      organizerID: auth.user?.id || auth.user?.userID,
      categoryID: parseInt(form.categoryId),
      venueID: parseInt(form.venueId)
    }
    await eventsStore.createEvent(payload)
    show('Event published successfully!', '🎉')
    router.push('/app/myevents')
  } catch (e) {
    error.value = e.message || 'Failed to create event.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.content-main { padding: 28px 30px; overflow-y: auto; }
.page-header { margin-bottom: 26px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.page-sub { font-size: 13px; color: var(--ink3); font-weight: 300; }
.create-form { background: var(--surface); border-radius: var(--radius-xl); border: 1px solid var(--border); padding: 28px; max-width: 700px; }
.form-section-title { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 700; color: var(--ink); margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-actions { display: flex; gap: 10px; margin-top: 22px; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
</style>
