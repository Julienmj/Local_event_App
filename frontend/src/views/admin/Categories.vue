<template>
  <div class="page-wrapper">
    <AdminSidebar />
    <div class="main-content">
      <h4 class="fw-bold mb-1">Manage Categories</h4>
      <p class="text-muted mb-4">Add or remove event categories</p>

      <div class="row g-4">
        <!-- Add form -->
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 p-4">
            <h6 class="fw-bold mb-3">{{ editing ? 'Edit Category' : 'Add Category' }}</h6>
            <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>
            <form @submit.prevent="submit">
              <div class="mb-3">
                <label class="form-label small fw-semibold">Name *</label>
                <input v-model="form.name" type="text" class="form-control" placeholder="e.g. Sports" required />
              </div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Description</label>
                <textarea v-model="form.description" class="form-control" rows="2" placeholder="Optional description"></textarea>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary-custom btn-sm flex-fill" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                  {{ editing ? 'Update' : 'Add Category' }}
                </button>
                <button v-if="editing" type="button" class="btn btn-outline-secondary btn-sm" @click="cancelEdit">Cancel</button>
              </div>
            </form>
          </div>
        </div>

        <!-- List -->
        <div class="col-md-8">
          <div v-if="loadingList" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
          <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <table class="table table-custom mb-0">
              <thead><tr><th>#</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                <tr v-if="categories.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">No categories yet.</td>
                </tr>
                <tr v-for="c in categories" :key="c.categoryID">
                  <td class="text-muted small">{{ c.categoryID }}</td>
                  <td class="fw-semibold">{{ c.name }}</td>
                  <td class="small text-muted">{{ c.description || '—' }}</td>
                  <td>
                    <div class="d-flex gap-1">
                      <button class="btn btn-sm btn-outline-primary" @click="startEdit(c)"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-outline-danger" @click="remove(c)"><i class="bi bi-trash"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoriesAPI } from '../../services/api'
import AdminSidebar from './AdminSidebar.vue'

const categories = ref([])
const loadingList = ref(true)
const loading = ref(false)
const error = ref('')
const editing = ref(null)
const form = ref({ name: '', description: '' })

onMounted(async () => {
  try { const res = await categoriesAPI.getAll(); categories.value = res.data }
  finally { loadingList.value = false }
})

async function submit() {
  error.value = ''; loading.value = true
  try {
    if (editing.value) {
      await categoriesAPI.update(editing.value, form.value)
      const i = categories.value.findIndex(c => c.categoryID === editing.value)
      categories.value[i] = { ...categories.value[i], ...form.value }
      cancelEdit()
    } else {
      const res = await categoriesAPI.create(form.value)
      categories.value.push(res.data)
      form.value = { name: '', description: '' }
    }
  } catch (e) { error.value = e.response?.data?.message || 'Operation failed.' }
  finally { loading.value = false }
}

function startEdit(c) { editing.value = c.categoryID; form.value = { name: c.name, description: c.description || '' } }
function cancelEdit() { editing.value = null; form.value = { name: '', description: '' } }

async function remove(c) {
  if (!confirm(`Delete category "${c.name}"?`)) return
  await categoriesAPI.remove(c.categoryID)
  categories.value = categories.value.filter(x => x.categoryID !== c.categoryID)
}
</script>
