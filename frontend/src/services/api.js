import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' }
})

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
}

// Users
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`)
}

// Events
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  remove: (id) => api.delete(`/events/${id}`),
  byCategory: (categoryId) => api.get(`/events/category/${categoryId}`),
  byOrganizer: (userId) => api.get(`/events/organizer/${userId}`)
}

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`)
}

// Venues
export const venuesAPI = {
  getAll: () => api.get('/venues'),
  create: (data) => api.post('/venues', data),
  update: (id, data) => api.put(`/venues/${id}`, data),
  remove: (id) => api.delete(`/venues/${id}`)
}

// Registrations
export const registrationsAPI = {
  create: (data) => api.post('/registrations', data),
  byUser: (userId) => api.get(`/registrations/user/${userId}`),
  byEvent: (eventId) => api.get(`/registrations/event/${eventId}`),
  cancel: (id) => api.delete(`/registrations/${id}`)
}

// Reviews
export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  byEvent: (eventId) => api.get(`/reviews/event/${eventId}`),
  remove: (id) => api.delete(`/reviews/${id}`)
}

// Notifications
export const notificationsAPI = {
  byUser: (userId) => api.get(`/notifications/user/${userId}`),
  markRead: (id) => api.put(`/notifications/${id}/read`)
}

export default api
