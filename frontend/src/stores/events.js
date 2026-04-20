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
      id: e.id || e.eventID, // Handle both id formats
      emoji: CAT_EMOJI[catName] || '🎉', 
      color: CAT_COLOR[catName] || '#1a1714' 
    }
  }

  async function loadAll(userId) {
    try {
      const [evts, cats, vens] = await Promise.all([
        api.get('/events'), api.get('/categories'), api.get('/venues')
      ])
      events.value = evts.map(enrichEvent)
      categories.value = cats
      venues.value = vens
    } catch (e) {
      console.warn('Failed to load events from backend, using demo data.', e)
      events.value = DEMO_EVENTS.map(e => ({
        id: e.EventID, title: e.Title, description: e.Description,
        eventDate: e.EventDate + 'T' + e.EventTime, status: e.Status,
        categoryName: e.CategoryName, venueName: e.VenueName,
        price: e.Price, capacity: e.Capacity, attendeesCount: e.AttendeesCount
      })).map(enrichEvent)
      categories.value = DEMO_CATS.map(c => ({ id: c.CategoryID, name: c.CategoryName, icon: c.icon }))
      venues.value = DEMO_VENUES.map(v => ({ id: v.VenueID, name: v.VenueName, address: v.Address }))
    }

    if (userId) {
      try {
        const notifs = await api.get(`/notifications/user/${userId}`)
        notifications.value = notifs
        
        const regs = await api.get(`/registrations/user/${userId}`)
        registrations.value = regs
      } catch (e) {
        console.warn('User-specific load failed.', e)
      }
    }
  }

  async function registerForEvent(userId, eventId) {
    const data = await api.post('/registrations', {
      userID: userId,
      eventID: eventId,
      status: 'confirmed'
    })
    registrations.value.push(data)
    addNotification('Registration confirmed!')
    return data
  }

  async function createEvent(payload) {
    const data = await api.post('/events', payload)
    events.value.unshift(enrichEvent(data))
    return data
  }

  async function deleteEvent(id) {
    await api.del(`/events/${id}`)
    const idx = events.value.findIndex(e => e.id === id)
    if (idx !== -1) events.value.splice(idx, 1)
  }

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
    const n = notifications.value.find(n => n.id === id)
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
    events, categories, venues, notifications, registrations, savedIds,
    searchQ, catFilter, filteredEvents, unreadCount,
    loadAll, toggleSave, isSaved, markRead, addNotification, 
    registerForEvent, createEvent
  }
})
