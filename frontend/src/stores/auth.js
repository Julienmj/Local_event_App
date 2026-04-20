import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('el_user') || 'null'))
  const token = ref(localStorage.getItem('el_token') || '')

  const isLoggedIn = computed(() => !!user.value)
  const isOrganizer = computed(() => user.value?.role === 'Organizer')
  const initials = computed(() => {
    if (!user.value?.fullName) return 'U'
    return user.value.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  })

  function persist() {
    localStorage.setItem('el_user', JSON.stringify(user.value))
    localStorage.setItem('el_token', token.value)
  }

  async function login(email, password) {
    const api = useApi()
    const data = await api.post('/auth/login', { email, password })
    // The user confirmed format is { user: {...}, token: "..." }
    user.value = data.user
    token.value = data.token
    persist()
  }

  async function register(fullName, email, password, role) {
    const api = useApi()
    const data = await api.post('/auth/register', { fullName, email, password, role })
    // Assuming register also returns { user, token } or similar
    user.value = data.user || data
    token.value = data.token || data.accessToken || ''
    persist()
  }

  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('el_user')
    localStorage.removeItem('el_token')
  }

  return { user, token, isLoggedIn, isOrganizer, initials, login, register, logout }
})
