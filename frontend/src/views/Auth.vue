<template>
  <div class="auth-shell">
    <!-- Left panel -->
    <div class="auth-left">
      <div class="auth-left-bg">
        <div class="auth-left-blob auth-blob1"></div>
        <div class="auth-left-blob auth-blob2"></div>
      </div>
      <div class="auth-brand">
        <div class="auth-brand-icon"><i class="ph-bold ph-map-pin" style="font-size:18px;color:#fff"></i></div>
        <span class="auth-brand-name">EventLocal</span>
      </div>
      <div class="auth-left-content">
        <div class="auth-quote">Where every <em>moment</em><br/>becomes memory</div>
        <p class="auth-left-sub">Discover curated events, connect with your community, and manage unforgettable experiences across Rwanda — all in one elegant platform.</p>
        <div class="auth-stats">
          <div><div class="auth-stat-num">120+</div><div class="auth-stat-label">Events / month</div></div>
          <div><div class="auth-stat-num">3,400</div><div class="auth-stat-label">Community</div></div>
          <div><div class="auth-stat-num">12</div><div class="auth-stat-label">Cities</div></div>
        </div>
      </div>
    </div>

    <!-- Right panel -->
    <div class="auth-right">
      <!-- LOGIN -->
      <div v-if="view === 'login'" class="auth-box">
        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-sub">Sign in to your EventLocal account</p>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div class="form-group">
          <label class="form-label">Email address</label>
          <input v-model="email" class="form-input" type="email" placeholder="you@example.com"/>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input v-model="password" class="form-input" type="password" placeholder="••••••••" @keydown.enter="handleLogin"/>
        </div>
        <div style="text-align:right;margin-bottom:18px">
          <a style="font-size:13px;color:var(--accent);cursor:pointer" @click="view = 'forgot'">Forgot password?</a>
        </div>
        <button class="btn btn-amber btn-full" :disabled="loading" @click="handleLogin">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>Sign In</span>
        </button>
        <div class="auth-toggle">Don't have an account? <a @click="view = 'register'">Create one</a></div>
        <div class="demo-hint">
          <i class="ph ph-info"></i>
          Demo: <strong>demo@gmail.com</strong> / <strong>12345678</strong>
          <button class="demo-fill" @click="fillDemo"><i class="ph ph-lightning"></i> Use demo</button>
        </div>
      </div>

      <!-- REGISTER -->
      <div v-else-if="view === 'register'" class="auth-box">
        <h2 class="auth-title">Create account</h2>
        <p class="auth-sub">Join the EventLocal community today</p>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input v-model="name" class="form-input" type="text" placeholder="Jean Mugisha"/>
        </div>
        <div class="form-group">
          <label class="form-label">Email address</label>
          <input v-model="email" class="form-input" type="email" placeholder="you@example.com"/>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input v-model="password" class="form-input" type="password" placeholder="Min. 8 characters"/>
        </div>
        <div class="form-group">
          <label class="form-label">I want to</label>
          <select v-model="role" class="form-input">
            <option value="Attendee">Discover & attend events</option>
            <option value="Organizer">Organise & host events</option>
          </select>
        </div>
        <button class="btn btn-amber btn-full" :disabled="loading" @click="handleRegister">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>Create Account</span>
        </button>
        <div class="auth-toggle">Already have an account? <a @click="view = 'login'">Sign in</a></div>
      </div>

      <!-- FORGOT PASSWORD -->
      <div v-else-if="view === 'forgot'" class="auth-box">
        <div class="back-link" @click="view = 'login'"><i class="ph ph-arrow-left"></i> Back to sign in</div>
        <h2 class="auth-title">Reset password</h2>
        <p class="auth-sub">Enter your email and we'll send you a reset link</p>
        <div v-if="success" class="success-msg">{{ success }}</div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div class="form-group">
          <label class="form-label">Email address</label>
          <input v-model="email" class="form-input" type="email" placeholder="you@example.com"/>
        </div>
        <button class="btn btn-amber btn-full" :disabled="loading" @click="handleForgot">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>Send Reset Link</span>
        </button>
      </div>

      <!-- RESET PASSWORD (With Token) -->
      <div v-else-if="view === 'reset'" class="auth-box">
        <h2 class="auth-title">Set new password</h2>
        <p class="auth-sub">Enter the token from your email and your new password</p>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div class="form-group">
          <label class="form-label">Email address</label>
          <input v-model="email" class="form-input" type="email" placeholder="you@example.com"/>
        </div>
        <div class="form-group">
          <label class="form-label">Reset Token</label>
          <input v-model="token" class="form-input" type="text" placeholder="Paste token here"/>
        </div>
        <div class="form-group">
          <label class="form-label">New Password</label>
          <input v-model="password" class="form-input" type="password" placeholder="Min. 8 characters"/>
        </div>
        <button class="btn btn-amber btn-full" :disabled="loading" @click="handleReset">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>Update Password</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const view = ref('login')
const email = ref('')
const password = ref('')
const name = ref('')
const token = ref('')
const role = ref('Attendee')
const error = ref('')
const success = ref('')
const loading = ref(false)

onMounted(() => {
  if (route.query.token) {
    view.value = 'reset'
    token.value = route.query.token
    if (route.query.email) email.value = route.query.email
  }
})

function clearFeedback() { error.value = ''; success.value = '' }

function fillDemo() {
  email.value = 'demo@gmail.com'
  password.value = '12345678'
}

async function handleLogin() {
  clearFeedback()
  if (!email.value || !password.value) { error.value = 'Please fill in all fields.'; return }
  loading.value = true
  try {
    // Demo account — bypass backend
    if (email.value === 'demo@gmail.com' && password.value === '12345678') {
      const demoUser = { id: 'demo-001', email: 'demo@gmail.com', fullName: 'Demo User', role: 'Organizer' }
      localStorage.setItem('user', JSON.stringify(demoUser))
      localStorage.setItem('token', 'demo-token')
      auth.user = demoUser
      auth.token = 'demo-token'
      router.push('/app/dashboard')
      return
    }
    await auth.login(email.value, password.value)
    router.push('/app/dashboard')
  } catch (e) {
    error.value = e.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  clearFeedback()
  if (!name.value || !email.value || !password.value) { error.value = 'Please fill in all fields.'; return }
  if (password.value.length < 8) { error.value = 'Password must be at least 8 characters.'; return }
  loading.value = true
  try {
    await auth.register(name.value, email.value, password.value, role.value)
    router.push('/app/dashboard')
  } catch (e) {
    error.value = e.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleForgot() {
  clearFeedback()
  if (!email.value) { error.value = 'Please enter your email.'; return }
  loading.value = true
  try {
    await auth.forgotPassword(email.value)
    success.value = 'Reset link sent! Check your inbox for the token.'
  } catch (e) {
    error.value = e.message || 'Failed to send reset link.'
  } finally {
    loading.value = false
  }
}

async function handleReset() {
  clearFeedback()
  if (!email.value || !token.value || !password.value) { error.value = 'All fields are required.'; return }
  loading.value = true
  try {
    await auth.resetPassword(email.value, token.value, password.value)
    success.value = 'Password updated! You can now sign in.'
    view.value = 'login'
    password.value = ''
    token.value = ''
  } catch (e) {
    error.value = e.message || 'Failed to reset password.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-shell { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
.auth-left { background: var(--surface); position: relative; display: flex; flex-direction: column; justify-content: flex-end; padding: 48px; overflow: hidden; border-right: 1px solid var(--border); }
.auth-left-bg { position: absolute; inset: 0; }
.auth-left-blob { position: absolute; border-radius: 50%; filter: blur(80px); }
.auth-blob1 { width: 350px; height: 350px; background: var(--accent); opacity: .08; top: -80px; right: -80px; }
.auth-blob2 { width: 280px; height: 280px; background: var(--accent); opacity: .05; bottom: -60px; left: -60px; }
.auth-brand { position: absolute; top: 36px; left: 48px; display: flex; align-items: center; gap: 10px; }
.auth-brand-icon { width: 38px; height: 38px; background: var(--accent); border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.auth-brand-name { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.3rem; color: var(--text); }
.auth-left-content { position: relative; z-index: 1; }
.auth-quote { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: var(--text); line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 14px; font-style: italic; }
.auth-quote em { color: var(--accent); }
.auth-left-sub { font-size: 13px; color: var(--text3); font-weight: 300; line-height: 1.7; margin-bottom: 24px; }
.auth-stats { display: flex; gap: 28px; }
.auth-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--accent); line-height: 1; }
.auth-stat-label { font-size: 11px; color: var(--text3); margin-top: 3px; }
.auth-right { display: flex; align-items: center; justify-content: center; padding: 48px; background: var(--bg); }
.auth-box { width: 100%; max-width: 420px; }
.auth-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: var(--text); margin-bottom: 6px; letter-spacing: -0.025em; }
.auth-sub { font-size: 14px; color: var(--text3); font-weight: 300; margin-bottom: 32px; }
.auth-toggle { text-align: center; margin-top: 20px; font-size: 13px; color: var(--text3); }
.auth-toggle a { color: var(--accent); font-weight: 500; cursor: pointer; }
.auth-toggle a:hover { text-decoration: underline; }
.back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text3); cursor: pointer; margin-bottom: 24px; transition: color .2s; }
.back-link:hover { color: var(--accent); }
.demo-hint { margin-top: 20px; padding: 12px 14px; background: var(--surface2); border: 1px solid var(--border2); border-radius: var(--radius); font-size: 12.5px; color: var(--text3); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.demo-hint strong { color: var(--accent); font-weight: 600; }
.demo-fill { margin-left: auto; display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; background: var(--accent); color: #fff; border: none; border-radius: 99px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background .2s; }
.demo-fill:hover { background: var(--accent-h); }
@media (max-width: 900px) { .auth-left { display: none; } .auth-shell { grid-template-columns: 1fr; } }
</style>
