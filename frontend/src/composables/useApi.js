const BASE = 'https://localeventorganizer.onrender.com/api/v1'

export function useApi() {
  async function request(method, path, body) {
    // Break circular dependency with authStore.
    // authStore now persists to the 'token' key as requested.
    const token = localStorage.getItem('token') || ''
    
    // Identify public endpoints that should NOT send an Authorization header.
    const isPublic = path.includes('/auth/login') || 
                     path.includes('/auth/register') || 
                     path.includes('/auth/forgot-password') || 
                     path.includes('/auth/reset-password')

    const headers = { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    
    // exact format as per backend requirement: Bearer <token>
    if (token && !isPublic) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      // Since backend has .AllowCredentials(), some browsers require this
      credentials: 'include' 
    })
    
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      // Improved error logging for debugging 401s
      console.error(`[API Error] ${res.status} on ${path}:`, data)
      throw new Error(data.message || data.title || `HTTP ${res.status}`)
    }
    return data
  }

  return {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    del: (path) => request('DELETE', path),
  }
}
