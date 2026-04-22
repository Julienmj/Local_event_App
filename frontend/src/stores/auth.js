import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!user.value)
  const isOrganizer = computed(() => {
    const r = user.value?.role
    if (!r) return false
    if (Array.isArray(r)) return r.some(i => i.toLowerCase() === 'organizer')
    return r.toLowerCase() === 'organizer'
  })
  const initials = computed(() => {
    if (!user.value?.fullName) return 'U'
    return user.value.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  })

  function persist() {
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('token', token.value)
  }

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (e) {
      return null
    }
  }

  async function login(email, password) {
    const api = useApi()
    const data = await api.post('/auth/login', { email, password })
    const resData = data.data || data
    
    // Extract token
    const tokenStr = resData.token || resData.accessToken || resData.access_token || ''
    token.value = tokenStr

    // Decode JWT to get user details
    const decoded = parseJwt(tokenStr)
    if (decoded) {
      let rawRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role
      // Handle case where role might be an array
      if (Array.isArray(rawRole)) rawRole = rawRole[0] 
      
      user.value = {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.sub || decoded.id,
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded.email,
        role: rawRole,
        fullName: decoded.unique_name || decoded.name || (decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']?.split('@')[0]) || 'User'
      }
    } else {
      user.value = resData.user || {}
    }
    
    persist()
  }

  async function register(fullName, email, password, role) {
    const api = useApi()
    const data = await api.post('/auth/register', { fullName, email, password, role })
    const resData = data.data || data
    
    const tokenStr = resData.token || resData.accessToken || resData.access_token || ''
    token.value = tokenStr

    const decoded = parseJwt(tokenStr)
    if (decoded) {
      let rawRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role
      if (Array.isArray(rawRole)) rawRole = rawRole[0]

      user.value = {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.sub || decoded.id,
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded.email,
        role: rawRole,
        fullName: decoded.unique_name || decoded.name || fullName || 'User'
      }
    } else {
      user.value = { ...(resData.user || {}), fullName }
    }
    
    persist()
  }

  async function forgotPassword(email) {
    const api = useApi()
    return await api.post('/auth/forgot-password', { email })
  }

  async function resetPassword(email, tokenVal, newPassword) {
    const api = useApi()
    const payload = { email, token: tokenVal, newPassword }
    console.log('[Auth Debug] Resetting Password:', payload)
    try {
      return await api.post('/auth/reset-password', payload)
    } catch (e) {
      console.error('[Auth Debug] Reset Password Failed:', e)
      throw e
    }
  }

  async function getUsers() {
    const api = useApi()
    return await api.get('/users')
  }

  async function getUserById(id) {
    const api = useApi()
    return await api.get(`/users/${id}`)
  }

  async function updateUser(id, payload) {
    const api = useApi()
    const data = await api.put(`/users/${id}`, payload)
    if (user.value?.id === id || user.value?.userID === id) {
      user.value = { ...user.value, ...data }
      persist()
    }
    return data
  }

  async function deleteUser(id) {
    const api = useApi()
    return await api.del(`/users/${id}`)
  }

  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return { 
    user, token, isLoggedIn, isOrganizer, initials, 
    login, register, logout, 
    forgotPassword, resetPassword, 
    getUsers, getUserById, updateUser, deleteUser 
  }
})
