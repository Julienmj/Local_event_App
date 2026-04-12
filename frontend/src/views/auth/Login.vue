<template>
  <div class="min-vh-100 d-flex align-items-center" style="background:linear-gradient(135deg,#1e1b4b,#4f46e5)">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="text-center mb-4">
            <router-link to="/" class="text-white text-decoration-none">
              <i class="bi bi-calendar-event fs-2 me-2"></i>
              <span class="fs-4 fw-bold">EventHub</span>
            </router-link>
          </div>
          <div class="auth-card card p-4">
            <h4 class="fw-bold mb-1">Welcome back</h4>
            <p class="text-muted small mb-4">Sign in to your account</p>

            <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label fw-semibold small">Email</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input v-model="form.email" type="email" class="form-control" placeholder="you@example.com" required />
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-semibold small">Password</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input v-model="form.password" :type="showPwd ? 'text' : 'password'" class="form-control" placeholder="••••••••" required />
                  <button type="button" class="input-group-text" @click="showPwd = !showPwd">
                    <i :class="showPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
              <button type="submit" class="btn btn-primary-custom w-100 py-2" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Sign In
              </button>
            </form>

            <p class="text-center text-muted small mt-4 mb-0">
              Don't have an account?
              <router-link to="/register" class="text-primary-custom fw-semibold">Sign up</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)
const showPwd = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.value)
    if (auth.isAdmin) router.push('/admin')
    else if (auth.isOrganizer) router.push('/organizer')
    else router.push('/events')
  } catch (e) {
    error.value = e.response?.data?.message || 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}
</script>
