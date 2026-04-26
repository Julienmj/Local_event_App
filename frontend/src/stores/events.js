import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { DEMO_EVENTS, DEMO_VENUES, DEMO_CATS, DEMO_NOTIFICATIONS } from '@/data/demo'

const CAT_EMOJI = { 'Music & Art': '🎷', Sports: '⚽', 'Food & Drink': '🍲', Tech: '💻', Community: '🌿', Education: '📸' }
const CAT_COLOR = { 'Music & Art': '#3d1500', Sports: '#0a1a0a', 'Food & Drink': '#2a0a00', Tech: '#0a1520', Community: '#041a0a', Education: '#1a0a1a' }

export const useEventsStore = defineStore('events', () => {
  const api = useApi()

  const events = ref([])
  const categories = ref([])
  const venues = ref([])
  const notifications = ref([])
  const registrations = ref([])
  const stats = ref(null)
  const roles = ref([])
  const savedIds = ref(JSON.parse(localStorage.getItem('el_saved') || '[]'))

  const searchQ = ref('')
  const catFilter = ref('All')

  const filteredEvents = computed(() =>
    events.value.filter(e =>
      (catFilter.value === 'All' || e.category?.name === catFilter.value || e.categoryName === catFilter.value) &&
      (!searchQ.value ||
        e.title.toLowerCase().includes(searchQ.value.toLowerCase()) ||
        e.venue?.name?.toLowerCase().includes(searchQ.value.toLowerCase()))
    )
  )

  const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)

  function enrichEvent(e) {
    const catName = e.category?.name || e.categoryName || 'Other'
    return { 
      ...e, 
      id: e.id || e.eventID || e.EventID,
      categoryID: e.categoryID || e.category?.id || e.category?.CategoryID,
      venueID: e.venueID || e.venue?.id || e.venue?.VenueID,
      organizerID: e.organizerID || e.organizerId || e.OrganizerID,
      imageUrl: e.imageUrl || e.ImageUrl,
      price: e.price || e.Price || 0,
      emoji: CAT_EMOJI[catName] || '🎉', 
      color: CAT_COLOR[catName] || '#1a1714' 
    }
  }

  async function loadAll(userId) {
    try {
      const [evts, cats, vens] = await Promise.all([
        api.get('/events'), api.get('/categories'), api.get('/venues')
      ])
      console.log('[Store Debug] Live Data Loaded:', {
        eventsCount: evts.length,
        categories: cats.slice(0, 3),
        venues: vens.slice(0, 3)
      })
      events.value = evts.map(enrichEvent).map(e => ({
        ...e,
        imageUrl: e.imageUrl || `https://picsum.photos/seed/${e.id || e.eventID}/400/300.jpg`
      }))
      categories.value = cats.map(c => ({
        id: c.id || c.categoryID || c.CategoryID,
        name: c.name || c.categoryName || c.CategoryName,
        icon: c.icon || CAT_EMOJI[c.name || c.categoryName || c.CategoryName] || '🏷️'
      }))
      venues.value = vens.map(v => ({
        id: v.id || v.venueID || v.VenueID,
        name: v.name || v.venueName || v.VenueName,
        address: v.address || v.city || v.Address
      }))
    } catch (e) {
      console.warn('Failed to load events from backend, using demo data.', e)
      events.value = DEMO_EVENTS.map(e => ({
        id: e.EventID, title: e.Title, description: e.Description,
        eventDate: e.EventDate + 'T' + e.EventTime, status: e.Status,
        categoryName: e.CategoryName, venueName: e.VenueName,
        price: e.Price, capacity: e.Capacity, attendeesCount: e.AttendeesCount,
        imageUrl: `https://picsum.photos/seed/${e.EventID}/400/300.jpg`
      })).map(enrichEvent)
      categories.value = DEMO_CATS.map(c => ({ id: c.CategoryID || c.id, name: c.CategoryName || c.name, icon: c.icon }))
      venues.value = DEMO_VENUES.map(v => ({ id: v.VenueID || v.id, name: v.VenueName || v.name, address: v.Address || v.address }))
    }

    if (userId) {
      loadUserData(userId)
    }
  }

  async function loadUserData(userId) {
    try {
      const [notifs, regs] = await Promise.all([
        api.get(`/notifications/user/${userId}`).catch(() => []),
        api.get(`/registrations/user/${userId}`).catch(() => [])
      ])
      notifications.value = notifs.map(n => ({
        ...n,
        id: n.notificationID || n.id,
        isRead: n.isRead ?? n.IsRead ?? false,
        message: n.message || n.Message || n.title || n.Title || ''
      }))
      registrations.value = regs.map(r => ({
        ...r,
        id: r.registrationID || r.RegistrationID || r.id,
        eventID: r.eventID || r.EventID || r.event?.eventID,
        userID: r.userID || r.UserID
      }))
      
      // Analytics might 404 if no events exist yet
      api.get(`/analytics/organizer/${userId}`)
        .then(data => { stats.value = data })
        .catch(() => { stats.value = { totalEvents: 0, totalAttendees: 0, revenue: 0 } })
    } catch (e) {
      console.warn('User data load failed.', e)
    }
  }

  // --- Events ---
  async function getEventById(id) {
    return await api.get(`/events/${id}`)
  }

  async function createEvent(payload) {
    const data = await api.post('/events', payload)
    events.value.unshift(enrichEvent(data))
    return data
  }

  async function updateEvent(id, payload) {
    const data = await api.put(`/events/${id}`, payload)
    const idx = events.value.findIndex(e => e.id === id)
    if (idx !== -1) events.value[idx] = enrichEvent(data)
    return data
  }

  async function deleteEvent(id) {
    await api.del(`/events/${id}`)
    const idx = events.value.findIndex(e => e.id === id)
    if (idx !== -1) events.value.splice(idx, 1)
  }

  async function getEventsByCategory(catId) {
    return await api.get(`/events/category/${catId}`)
  }

  async function getEventsByOrganizer(userId) {
    return await api.get(`/events/organizer/${userId}`)
  }

  // --- Categories ---
  async function createCategory(payload) {
    const data = await api.post('/categories', payload)
    categories.value.push(data)
    return data
  }

  async function updateCategory(id, payload) {
    const data = await api.put(`/categories/${id}`, payload)
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx !== -1) categories.value[idx] = data
    return data
  }

  async function deleteCategory(id) {
    await api.del(`/categories/${id}`)
    categories.value = categories.value.filter(c => c.id !== id)
  }

  // --- Venues ---
  async function createVenue(payload) {
    const data = await api.post('/venues', payload)
    venues.value.push(data)
    return data
  }

  async function updateVenue(id, payload) {
    const data = await api.put(`/venues/${id}`, payload)
    const idx = venues.value.findIndex(v => v.id === id)
    if (idx !== -1) venues.value[idx] = data
    return data
  }

  async function deleteVenue(id) {
    await api.del(`/venues/${id}`)
    venues.value = venues.value.filter(v => v.id !== id)
  }

  // --- Registrations ---
  async function registerForEvent(userId, eventId) {
    const data = await api.post('/registrations', {
      userID: userId,
      eventID: parseInt(eventId),
      status: 'Confirmed'
    })
    registrations.value.push(data)
    addNotification('Registration confirmed!')
    return data
  }

  async function getRegistrationsByEvent(eventId) {
    return await api.get(`/registrations/event/${eventId}`)
  }

  async function cancelRegistration(id) {
    await api.del(`/registrations/${id}`)
    registrations.value = registrations.value.filter(r => r.id !== id)
  }

  // --- Reviews ---
  async function submitReview(payload) {
    const data = await api.post('/reviews', payload)
    return data
  }

  async function getReviewsByEvent(eventId) {
    return await api.get(`/reviews/event/${eventId}`)
  }

  async function deleteReview(id) {
    await api.del(`/reviews/${id}`)
  }

  // --- Roles ---
  async function getRoles() {
    const data = await api.get('/roles')
    roles.value = data
    return data
  }

  async function createRole(roleName) {
    return await api.post('/roles', roleName)
  }

  // --- Notifications & UI ---
  function toggleSave(id) {
    const idx = savedIds.value.indexOf(id)
    if (idx === -1) savedIds.value.push(id)
    else savedIds.value.splice(idx, 1)
    localStorage.setItem('el_saved', JSON.stringify(savedIds.value))
  }

  function isSaved(id) {
    return savedIds.value.includes(id)
  }

  function markRead(id) {
    api.put(`/notifications/${id}/read`, {}).catch(() => {})
    const n = notifications.value.find(n => n.id === id || n.notificationID === id)
    if (n) n.isRead = true
  }

  function addNotification(message) {
    notifications.value.unshift({
      id: 'n-' + Date.now(),
      message: message,
      isRead: false,
      createdAt: new Date().toISOString(),
    })
  }

  return {
    events, categories, venues, notifications, registrations, stats, roles, savedIds,
    searchQ, catFilter, filteredEvents, unreadCount,
    loadAll, loadUserData, toggleSave, isSaved, markRead, addNotification, 
    getEventById, createEvent, updateEvent, deleteEvent, getEventsByCategory, getEventsByOrganizer,
    createCategory, updateCategory, deleteCategory,
    createVenue, updateVenue, deleteVenue,
    registerForEvent, getRegistrationsByEvent, cancelRegistration,
    submitReview, getReviewsByEvent, deleteReview,
    getRoles, createRole
  }
})
