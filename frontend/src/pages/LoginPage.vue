<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-logo">📍 EventLocal</div>
      <h2>Welcome back</h2>
      <p class="auth-sub">Sign in to your account</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="input-wrap">
            <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Enter your password" required />
            <button type="button" class="toggle-pass" @click="showPass = !showPass">{{ showPass ? '🙈' : '👁️' }}</button>
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

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.post('/auth/login', form)
    const { token, user } = res.data
    auth.setAuth({ token, user: user ?? { email: form.email } })
    router.push('/')
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
  font-size: 20px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 36px;
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
