<template>
  <div class="content-main">
    <div class="page-header">
      <div style="display:flex; justify-content:space-between; align-items:center">
        <div>
          <h1 class="page-title">Venues</h1>
          <p class="page-sub">Manage locations for your events</p>
        </div>
        <button class="btn btn-amber" @click="openCreate">+ Add Venue</button>
      </div>
    </div>

    <div class="venue-grid">
      <div v-for="v in eventsStore.venues" :key="v.id" class="venue-card">
        <div class="venue-info">
          <div class="venue-name">{{ v.name }}</div>
          <div class="venue-addr">{{ v.address || v.city }}</div>
          <div class="venue-coords">{{ v.latitude }}, {{ v.longitude }}</div>
        </div>
        <div class="venue-actions">
          <button class="btn-icon" @click="openEdit(v)"><i class="ph ph-pencil-simple"></i></button>
          <button class="btn-icon danger" @click="handleDelete(v.id)"><i class="ph ph-trash"></i></button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modal.show" class="modal-overlay" @click.self="modal.show = false">
      <div class="modal-box" style="max-width:440px; padding:24px">
        <h2 style="margin-bottom:16px">{{ modal.mode === 'create' ? 'Add' : 'Edit' }} Venue</h2>
        <div class="form-group">
          <label class="form-label">Venue Name</label>
          <input v-model="modal.form.name" class="form-input" placeholder="e.g. Kigali Convention Centre"/>
        </div>
        <div class="form-group">
          <label class="form-label">City</label>
          <input v-model="modal.form.city" class="form-input" placeholder="e.g. Kigali"/>
        </div>
        
        <VenuePicker v-model="modal.form" />

        <div class="form-group" style="margin-top:16px">
          <label class="form-label">Capacity</label>
          <input v-model.number="modal.form.capacity" class="form-input" type="number"/>
        </div>

        <div style="display:flex;gap:10px;margin-top:20px">
          <button class="btn btn-amber" :disabled="loading" @click="handleSubmit">
            {{ loading ? 'Saving...' : 'Save Venue' }}
          </button>
          <button class="btn btn-ghost" @click="modal.show = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useToast } from '@/composables/useToast'
import VenuePicker from '@/components/VenuePicker.vue'

const eventsStore = useEventsStore()
const { show } = useToast()
const loading = ref(false)

const modal = reactive({
  show: false,
  mode: 'create',
  form: { id: null, name: '', address: '', city: '', capacity: 0, latitude: 0, longitude: 0 }
})

function openCreate() {
  modal.mode = 'create'
  modal.form = { id: null, name: '', address: '', city: '', capacity: 0, latitude: 0, longitude: 0 }
  modal.show = true
}

function openEdit(v) {
  modal.mode = 'edit'
  modal.form = { ...v }
  modal.show = true
}

async function handleSubmit() {
  loading.value = true
  try {
    if (modal.mode === 'create') {
      await eventsStore.createVenue(modal.form)
      show('Venue created!', '✅')
    } else {
      await eventsStore.updateVenue(modal.form.id, modal.form)
      show('Venue updated!', '✅')
    }
    modal.show = false
  } catch (e) {
    show(e.message || 'Error saving venue', '⚠️')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure?')) return
  try {
    await eventsStore.deleteVenue(id)
    show('Venue deleted', '✅')
  } catch (e) {
    show(e.message || 'Error deleting venue', '⚠️')
  }
}
</script>

<style scoped>
.content-main { padding: 28px 30px; }
.venue-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-top: 20px; }
.venue-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px; display: flex; justify-content: space-between; align-items: center; }
.venue-name { font-weight: 700; font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: var(--ink); }
.venue-addr { font-size: 12.5px; color: var(--ink3); margin-top: 2px; }
.venue-coords { font-size: 11px; color: var(--ink4); font-family: monospace; }
.venue-actions { display: flex; gap: 8px; }
.btn-icon { width: 32px; height: 32px; background: var(--surface2); border: 1px solid var(--border); cursor: pointer; font-size: 15px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: var(--text2); transition: all .2s; }
.btn-icon:hover { background: var(--accent-l); color: var(--accent); border-color: var(--accent); }
.btn-icon.danger:hover { background: var(--err-bg); color: var(--err); border-color: var(--err); }
</style>
