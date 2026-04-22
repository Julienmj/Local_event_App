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
            <option v-for="c in eventsStore.categories" :key="c.id" :value="c.id">
              {{ c.icon }} {{ c.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Venue *</label>
          <select v-model="form.venueId" class="form-input" required>
            <option value="">Select venue</option>
            <option v-for="v in eventsStore.venues" :key="v.id" :value="v.id">
              {{ v.name }}
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
      </div>

      <div class="form-section-title">Visuals & Capacity</div>
      <div class="form-grid">
        <div class="form-group" style="grid-column: span 2">
          <label class="form-label">Event Image</label>
          <div class="image-toggle">
            <button
              type="button"
              class="toggle-btn"
              :class="{ active: imageSource === 'url' }"
              @click="imageSource = 'url'"
            >
              🔗 Paste URL
            </button>
            <button
              type="button"
              class="toggle-btn"
              :class="{ active: imageSource === 'upload' }"
              @click="imageSource = 'upload'"
            >
              📁 Upload Image
            </button>
          </div>
          
          <input
            v-if="imageSource === 'url'"
            v-model="form.imageUrl"
            class="form-input"
            type="url"
            placeholder="https://example.com/image.jpg"
          />
          
          <div v-else class="file-upload-zone" @click="$refs.fileInput.click()">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileUpload"
            />
            <div v-if="!form.imageUrl" class="upload-placeholder">
              <span>📤</span>
              <p>Click to upload event poster</p>
            </div>
            <div v-else class="upload-preview">
              <img :src="form.imageUrl" alt="Preview"/>
              <button type="button" class="btn-remove" @click.stop="form.imageUrl = ''">✕</button>
            </div>
          </div>
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
const imageSource = ref('url') // 'url' or 'upload'

const form = reactive({
  title: '', categoryId: '', venueId: '',
  date: '', time: '', price: 0, capacity: 100, description: '',
  imageUrl: ''
})

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    form.imageUrl = ev.target.result
  }
  reader.readAsDataURL(file)
}

async function handleSubmit() {
  if (!form.imageUrl) {
    error.value = 'Please provide an event image (URL or Upload).'
    return
  }
  error.value = ''
  loading.value = true
  
  try {
    const orgId = auth.user?.id || auth.user?.userID || auth.user?.userId
    if (!orgId) {
      error.value = 'User profile incomplete. Please check your account settings.'
      return
    }

    if (form.imageUrl.length > 500) {
      error.value = 'The uploaded image is too large for the server (limit: 500 chars). Please use a direct Image URL instead.'
      return
    }

    const payload = {
      title: form.title,
      description: form.description,
      eventDate: new Date(`${form.date}T${form.time}`).toISOString(),
      maxAttendees: form.capacity,
      status: 'Pending',
      organizerID: orgId,
      categoryID: form.categoryId,
      venueID: form.venueId,
      imageUrl: form.imageUrl,
      price: form.price
    }
    
    console.log('[Create Event Payload]', payload)
    
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
select.form-input option { color: #000; background: #fff; }
.image-toggle { display: flex; gap: 8px; margin-bottom: 12px; }
.toggle-btn { flex: 1; padding: 10px; border-radius: var(--radius); border: 1.5px solid var(--border2); font-size: 13px; font-weight: 500; cursor: pointer; background: transparent; color: var(--ink3); transition: all .2s; }
.toggle-btn:hover { background: var(--a50); }
.toggle-btn.active { background: var(--a500); border-color: var(--a500); color: #fff; }

.file-upload-zone { border: 2px dashed var(--border2); border-radius: var(--radius-lg); padding: 32px; text-align: center; cursor: pointer; transition: all .2s; position: relative; overflow: hidden; background: var(--cream2); }
.file-upload-zone:hover { border-color: var(--a500); background: var(--a50); }
.upload-placeholder span { font-size: 2rem; display: block; margin-bottom: 8px; }
.upload-placeholder p { font-size: 13px; color: var(--ink3); }
.upload-preview { height: 160px; width: 100%; border-radius: var(--radius); overflow: hidden; position: relative; }
.upload-preview img { width: 100%; height: 100%; object-fit: cover; }
.btn-remove { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.5); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-remove:hover { background: var(--red); }

@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
</style>
