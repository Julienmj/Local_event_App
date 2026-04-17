<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-logo">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        EventLocal
      </div>
      <h2>Welcome back</h2>
      <p class="auth-sub">Sign in to your account</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Username</label>
          <div class="input-with-icon">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input v-model="form.username" type="text" placeholder="Enter your username" required />
          </div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Enter your password" required />
            <button type="button" class="toggle-pass" @click="showPass = !showPass">
              <svg v-if="showPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button type="submit" class="btn-primary submit-btn" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="auth-switch">
        Don't have an account? <router-link to="/register">Register</router-link>
      </p>
    </div>

    <div class="auth-visual">
      <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80" alt="events" />
      <div class="visual-overlay">
        <h3>Connect with your community</h3>
        <p>Discover and attend local events happening around you</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ username: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.post('/auth/login', form)
    auth.setAuth({ token: res.data.token, user: res.data.user })
    const role = res.data.user?.role
    if (role === 'Admin') router.push('/admin')
    else if (role === 'Organizer') router.push('/organizer')
    else router.push('/events')
  } catch (e) {
    error.value = e.response?.data?.message || 'Invalid username or password'
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
}

.auth-logo {
  font-size: 18px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.auth-card h2 { font-size: 28px; font-weight: 700; margin-bottom: 6px; }
.auth-sub { color: var(--muted); font-size: 14px; margin-bottom: 32px; }

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
}

.form-group label { font-size: 13px; font-weight: 600; color: var(--text); }

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  padding: 11px 14px 11px 42px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border 0.2s;
  width: 100%;
}

.input-with-icon input:focus {
  border-color: var(--blue);
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--muted);
  pointer-events: none;
}

.form-group input, .input-wrap input {
  padding: 11px 14px 11px 42px;
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
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  transition: color 0.2s;
}

.toggle-pass:hover {
  color: var(--blue);
}

.toggle-pass svg {
  width: 18px;
  height: 18px;
}

.error-msg {
  background: #fff0f0;
  color: #e0245e;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 16px;
}

.submit-btn {
  width: 100%;
  padding: 13px;
  font-size: 15px;
  border-radius: 10px;
  margin-top: 4px;
}

.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.auth-switch {
  text-align: center;
  font-size: 13px;
  color: var(--muted);
  margin-top: 24px;
}

.auth-switch a { color: var(--blue); font-weight: 600; }

.auth-visual {
  position: relative;
  overflow: hidden;
}

.auth-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.visual-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
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
