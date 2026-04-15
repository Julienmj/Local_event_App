<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-logo">📍 EventLocal</div>
      <h2>Create account</h2>
      <p class="auth-sub">Join your local community today</p>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="form.fullName" type="text" placeholder="Enter your full name" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="input-wrap">
            <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Create a password" required />
            <button type="button" class="toggle-pass" @click="showPass = !showPass">{{ showPass ? '🙈' : '👁️' }}</button>
          </div>
        </div>
        <div class="form-group">
          <label>I want to</label>
          <div class="role-options">
            <label
              v-for="role in roles"
              :key="role.value"
              :class="['role-card', { active: form.role === role.value }]"
            >
              <input type="radio" v-model="form.role" :value="role.value" hidden />
              <span class="role-icon">{{ role.icon }}</span>
              <span class="role-label">{{ role.label }}</span>
            </label>
          </div>
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>
        <div v-if="success" class="success-msg">Account created! Redirecting to login...</div>

        <button type="submit" class="btn-primary submit-btn" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="auth-switch">
        Already have an account? <router-link to="/login">Sign in</router-link>
      </p>
    </div>

    <div class="auth-visual">
      <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" alt="events" />
      <div class="visual-overlay">
        <h3>Be part of something local</h3>
        <p>Create, attend, and organize events in your community</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const form = reactive({ fullName: '', email: '', password: '', role: 'Attendee' })
const loading = ref(false)
const error = ref('')
const success = ref(false)
const showPass = ref(false)

const roles = [
  { value: 'Attendee', label: 'Attend Events', icon: '🎟️' },
  { value: 'Organizer', label: 'Organize Events', icon: '🗂️' },
]

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    await api.post('/auth/register', {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      role: form.role,
    })
    success.value = true
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    error.value = e.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.auth-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 56px;
  background: var(--white);
  overflow-y: auto;
}

.auth-logo { font-size: 20px; font-weight: 700; color: var(--blue); margin-bottom: 36px; }
.auth-card h2 { font-size: 28px; font-weight: 700; margin-bottom: 6px; }
.auth-sub { color: var(--muted); font-size: 14px; margin-bottom: 32px; }

.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text); }

.form-group input, .input-wrap input {
  padding: 11px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border 0.2s;
  width: 100%;
}

.form-group input:focus, .input-wrap input:focus { border-color: var(--blue); }

.input-wrap { position: relative; }
.toggle-pass {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.role-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  border: 2px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.role-card.active { border-color: var(--blue); background: #e8f4fd; }
.role-icon { font-size: 24px; }
.role-label { font-size: 12px; font-weight: 600; color: var(--text); }

.error-msg {
  background: #fff0f0;
  color: #e0245e;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 16px;
}

.success-msg {
  background: #f0fff4;
  color: #16a34a;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 16px;
}

.submit-btn { width: 100%; padding: 13px; font-size: 15px; border-radius: 10px; margin-top: 4px; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.auth-switch { text-align: center; font-size: 13px; color: var(--muted); margin-top: 24px; }
.auth-switch a { color: var(--blue); font-weight: 600; }

.auth-visual { position: relative; overflow: hidden; }
.auth-visual img { width: 100%; height: 100%; object-fit: cover; }

.visual-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 40px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
}

.visual-overlay h3 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
.visual-overlay p { font-size: 14px; opacity: 0.85; }

@media (max-width: 768px) {
  .auth-wrapper { grid-template-columns: 1fr; }
  .auth-visual { display: none; }
  .auth-card { padding: 40px 24px; }
}
</style>
