<template>
  <div class="content-main">
    <div class="page-header">
      <div style="display:flex; justify-content:space-between; align-items:center">
        <div>
          <h1 class="page-title">Categories</h1>
          <p class="page-sub">Organize your events by type</p>
        </div>
        <button class="btn btn-amber" @click="openCreate">+ New Category</button>
      </div>
    </div>

    <div class="cat-grid">
      <div v-for="c in eventsStore.categories" :key="c.id" class="cat-card">
        <div class="cat-info">
          <span class="cat-icon">{{ c.icon || '🏷️' }}</span>
          <div>
            <div class="cat-name">{{ c.name || c.CategoryName }}</div>
            <div class="cat-desc">{{ c.description || 'Event category' }}</div>
          </div>
        </div>
        <div class="cat-actions">
          <button class="btn-icon" @click="openEdit(c)">✏️</button>
          <button class="btn-icon" @click="handleDelete(c.id)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modal.show" class="modal-overlay" @click.self="modal.show = false">
      <div class="modal-box" style="max-width:400px; padding:24px">
        <h2 style="margin-bottom:16px">{{ modal.mode === 'create' ? 'New' : 'Edit' }} Category</h2>
        <div class="form-group">
          <label class="form-label">Name</label>
          <input v-model="modal.form.name" class="form-input" placeholder="e.g. Workshop"/>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea v-model="modal.form.description" class="form-input textarea" placeholder="Describe this category..."></textarea>
        </div>

        <div style="display:flex;gap:10px;margin-top:20px">
          <button class="btn btn-amber" :disabled="loading" @click="handleSubmit">
            {{ loading ? 'Saving...' : 'Save Category' }}
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

const eventsStore = useEventsStore()
const { show } = useToast()
const loading = ref(false)

const modal = reactive({
  show: false,
  mode: 'create',
  form: { id: null, name: '', description: '' }
})

function openCreate() {
  modal.mode = 'create'
  modal.form = { id: null, name: '', description: '' }
  modal.show = true
}

function openEdit(c) {
  modal.mode = 'edit'
  modal.form = { id: c.id, name: c.name || c.CategoryName, description: c.description || '' }
  modal.show = true
}

async function handleSubmit() {
  if (!modal.form.name.trim()) return
  loading.value = true
  try {
    if (modal.mode === 'create') {
      await eventsStore.createCategory(modal.form)
      show('Category created!', '🏷️')
    } else {
      await eventsStore.updateCategory(modal.form.id, modal.form)
      show('Category updated!', '🏷️')
    }
    modal.show = false
  } catch (e) {
    show(e.message || 'Error saving category', '⚠️')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('Delete this category?')) return
  try {
    await eventsStore.deleteCategory(id)
    show('Category deleted', '🗑️')
  } catch (e) {
    show(e.message || 'Error deleting category', '⚠️')
  }
}
</script>

<style scoped>
.content-main { padding: 28px 30px; }
.cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; margin-top: 20px; }
.cat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; display: flex; justify-content: space-between; align-items: center; }
.cat-info { display: flex; align-items: center; gap: 12px; }
.cat-icon { font-size: 1.4rem; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: var(--cream2); border-radius: 12px; }
.cat-name { font-weight: 700; font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; color: var(--ink); }
.cat-desc { font-size: 12px; color: var(--ink3); margin-top: 2px; }
.cat-actions { display: flex; gap: 6px; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 4px; border-radius: 4px; }
.btn-icon:hover { background: var(--cream2); }
</style>
