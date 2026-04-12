<template>
  <div class="min-vh-100 d-flex align-items-center py-5" style="background:linear-gradient(135deg,#1e1b4b,#4f46e5)">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="text-center mb-4">
            <router-link to="/" class="text-white text-decoration-none">
              <i class="bi bi-calendar-event fs-2 me-2"></i>
              <span class="fs-4 fw-bold">EventHub</span>
            </router-link>
          </div>
          <div class="auth-card card p-4">
            <h4 class="fw-bold mb-1">Create your account</h4>
            <p class="text-muted small mb-4">Join the community today</p>

            <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>
            <div v-if="success" class="alert alert-success py-2 small">Account created! <router-link to="/login">Sign in</router-link></div>

            <form @submit.prevent="handleRegister" v-if="!success">
              <div class="mb-3">
                <label class="form-label fw-semibold small">Full Name</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input v-model="form.fullName" type="text" class="form-control" placeholder="Claire Niyigena" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small">Email</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input v-model="form.email" type="email" class="form-control" placeholder="you@example.com" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small">Password</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input v-model="form.password" :type="showPwd ? 'text' : 'password'" class="form-control" placeholder="Min. 8 characters" required minlength="8" />
                  <button type="button" class="input-group-text" @click="showPwd = !showPwd">
                    <i :class="showPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-semibold small">I want to join as</label>
                <div class="d-flex gap-3">
                  <label class="role-option flex-fill text-center p-3 rounded-3 border" :class="{ selected: form.role === 'Attendee' }">
                    <input type="radio" v-model="form.role" value="Attendee" class="d-none" />
                    <div class="fs-4">🎟️</div>
                    <div class="fw-semibold small mt-1">Attendee</div>
                  </label>
                  <label class="role-option flex-fill text-center p-3 rounded-3 border" :class="{ selected: form.role === 'Organizer' }">
                    <input type="radio" v-model="form.role" value="Organizer" class="d-none" />
                    <div class="fs-4">🎪</div>
                    <div class="fw-semibold small mt-1">Organizer</div>
                  </label>
                </div>
              </div>
              <button type="submit" class="btn btn-primary-custom w-100 py-2" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Create Account
              </button>
            </form>

            <p class="text-center text-muted small mt-4 mb-0">
              Already have an account?
              <router-link to="/login" class="text-primary-custom fw-semibold">Sign in</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const form = ref({ fullName: '', email: '', password: '', role: 'Attendee' })
const error = ref('')
const success = ref(false)
const loading = ref(false)
const showPwd = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(form.value)
    success.value = true
  } catch (e) {
    error.value = e.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.role-option { cursor: pointer; transition: all .2s; }
.role-option:hover { border-color: #4f46e5 !important; background: #f0f4ff; }
.role-option.selected { border-color: #4f46e5 !important; background: #f0f4ff; }
</style>
