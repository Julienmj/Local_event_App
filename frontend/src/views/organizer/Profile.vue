<template>
  <div class="content-main">
    <div class="page-header">
      <h1 class="page-title">Profile</h1>
      <p class="page-sub">Manage your account details</p>
    </div>

    <div class="profile-grid">
      <div class="profile-card">
        <div class="profile-av-large">{{ auth.initials }}</div>
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;margin-bottom:4px">{{ auth.user?.fullName }}</h3>
        <p style="font-size:13px;color:var(--ink3);margin-bottom:4px">{{ auth.user?.email }}</p>
        <span class="pill pill-upcoming">{{ auth.user?.role }}</span>
      </div>

      <div class="profile-card">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:700;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border)">
          Edit Profile
        </div>
        <div v-if="saved" class="success-msg">Profile updated successfully!</div>
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input v-model="form.name" class="form-input" type="text"/>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="form.email" class="form-input" type="email"/>
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <input v-model="form.role" class="form-input" type="text" readonly />
          <p style="font-size:12px;color:var(--text3);margin-top:6px">Your role cannot be changed. Contact system admin for role changes.</p>
        </div>
        <button class="btn btn-amber" @click="saveProfile">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const { show } = useToast()
const loading = ref(false)
const saved = ref(false)

const form = reactive({
  name: auth.user?.fullName || auth.user?.Name || '',
  email: auth.user?.email || auth.user?.Email || '',
  role: auth.user?.role || auth.user?.Role || 'Attendee',
})

async function saveProfile() {
  loading.value = true
  saved.value = false
  try {
    const id = auth.user?.id || auth.user?.userID
    await auth.updateUser(id, {
      fullName: form.name,
      email: form.email
    })
    saved.value = true
    show('Profile updated successfully!', '👤')
    setTimeout(() => { saved.value = false }, 3000)
  } catch (e) {
    show(e.message || 'Failed to update profile.', '⚠️')
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
.profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.profile-card { background: var(--surface); border-radius: var(--radius-xl); border: 1px solid var(--border); padding: 24px; }
.profile-av-large { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--a500), var(--a700)); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.8rem; color: #fff; margin-bottom: 14px; }
@media (max-width: 900px) { .profile-grid { grid-template-columns: 1fr; } }
</style>
