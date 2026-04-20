<template>
  <AppLayout>
    <div v-if="loading" class="loading">Loading event...</div>

    <template v-else-if="event">
      <!-- Hero Image -->
      <div class="hero-image">
        <img :src="event.imageUrl || fallbackImage" :alt="event.title" />
        <button class="back-btn" @click="router.back()">← Back</button>
        <span class="category-badge">{{ event.category }}</span>
      </div>

      <div class="detail-body">
        <!-- Left: Main Info -->
        <div class="detail-main">
          <h1 class="event-title">{{ event.title }}</h1>

          <div class="meta-row">
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <div>
                <span class="meta-label">Date & Time</span>
                <span class="meta-value">{{ formatDate(event.date) }}</span>
              </div>
            </div>
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <span class="meta-label">Location</span>
                <span class="meta-value">{{ event.location }}</span>
              </div>
            </div>
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <div>
                <span class="meta-label">Attendees</span>
                <span class="meta-value">{{ event.attendeeCount }} going</span>
              </div>
            </div>
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <div>
                <span class="meta-label">Organizer</span>
                <span class="meta-value">{{ event.organizer || 'EventLocal' }}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>About this event</h3>
            <p class="description">{{ event.description || 'Join us for an amazing event! Connect with your community, enjoy great activities, and make unforgettable memories.' }}</p>
          </div>

          <div class="section">
            <h3>Attendees ({{ attendees.length }})</h3>
            <div class="attendees-list">
              <div v-for="a in attendees" :key="a.id" class="attendee-chip">
                <div class="attendee-avatar">{{ a.username?.charAt(0).toUpperCase() }}</div>
                <span>{{ a.username }}</span>
              </div>
              <div v-if="!attendees.length" class="no-attendees">Be the first to attend!</div>
            </div>
          </div>
        </div>

        <!-- Right: Action Card -->
        <div class="action-card">
          <div class="price-row">
            <span class="price">{{ event.price ? `$${event.price}` : 'Free' }}</span>
            <span class="spots">{{ event.spotsLeft ?? '∞' }} spots left</span>
          </div>

          <button
            :class="['btn-primary action-main-btn', { attending: attending }]"
            @click="toggleAttend"
            :disabled="actionLoading"
          >
            <svg v-if="attending" style="width: 16px; height: 16px; margin-right: 6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {{ attending ? 'Attending' : 'Join Event' }}
          </button>

          <button
            :class="['btn-ghost action-main-btn', { saved: saved }]"
            @click="saved = !saved"
          >
            <svg style="width: 16px; height: 16px; margin-right: 6px;" viewBox="0 0 24 24" :fill="saved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            {{ saved ? 'Saved' : 'Save Event' }}
          </button>

          <div class="share-row">
            <span class="share-label">Share</span>
            <div class="share-btns">
              <button class="share-btn" @click="copyLink">
                <svg style="width: 14px; height: 14px; margin-right: 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Copy Link
              </button>
            </div>
          </div>

          <div v-if="copied" class="copied-msg">Link copied!</div>
        </div>
      </div>
    </template>

    <div v-else class="empty-state">Event not found.</div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import api from '../api'

const route = useRoute()
const router = useRouter()

const event = ref(null)
const attendees = ref([])
const loading = ref(true)
const attending = ref(false)
const saved = ref(false)
const actionLoading = ref(false)
const copied = ref(false)

const fallbackImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80'

const mockEvents = {
  1: { id: 1, title: 'Kigali Jazz Night', date: '2026-04-12', location: 'Kigali, Rwanda', category: 'Music & Art', attendeeCount: 142, organizer: 'Kigali Arts Collective', price: 0, spotsLeft: 58, imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80', description: 'An unforgettable evening of live jazz music featuring local and international artists. Enjoy great music, food, and connect with fellow music lovers in the heart of Kigali.' },
  2: { id: 2, title: 'Community Football Tournament', date: '2026-04-13', location: 'Amahoro Stadium', category: 'Sports', attendeeCount: 320, organizer: 'Kigali Sports Club', price: 0, spotsLeft: 80, imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80', description: 'Annual community football tournament open to all skill levels. Form your team and compete for the championship trophy!' },
  3: { id: 3, title: 'Tech Startup Meetup', date: '2026-04-15', location: 'Norrsken House', category: 'Tech', attendeeCount: 87, organizer: 'Rwanda Tech Hub', price: 0, spotsLeft: 13, imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80', description: 'Monthly meetup for tech entrepreneurs, developers, and investors. Pitch your ideas, network, and learn from industry leaders.' },
  4: { id: 4, title: 'Art Exhibition: Colors of Africa', date: '2026-04-19', location: 'Inema Arts Center', category: 'Music & Art', attendeeCount: 65, organizer: 'Inema Arts', price: 5, spotsLeft: 35, imageUrl: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=1200&q=80', description: 'A vibrant exhibition celebrating African art, culture, and creativity through paintings, sculptures, and installations.' },
  5: { id: 5, title: 'Food & Culture Festival', date: '2026-04-20', location: 'Kimironko Market', category: 'Food & Drink', attendeeCount: 210, organizer: 'Kigali Food Network', price: 0, spotsLeft: 190, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80', description: 'Taste dishes from across Rwanda and beyond. Live cooking demos, cultural performances, and family-friendly activities.' },
  6: { id: 6, title: 'Youth Leadership Summit', date: '2026-04-22', location: 'Radisson Blu, Kigali', category: 'Education', attendeeCount: 180, organizer: 'Rwanda Youth Council', price: 10, spotsLeft: 20, imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80', description: 'Empowering the next generation of African leaders through workshops, keynotes, and networking sessions.' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

async function toggleAttend() {
  actionLoading.value = true
  try {
    if (attending.value) {
      await api.delete(`/events/${event.value.id}/attend`)
    } else {
      await api.post(`/events/${event.value.id}/attend`)
    }
    attending.value = !attending.value
  } catch {
    attending.value = !attending.value // optimistic fallback
  } finally {
    actionLoading.value = false
  }
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

onMounted(async () => {
  const id = route.params.id
  try {
    const [eventRes, attendeesRes] = await Promise.all([
      api.get(`/events/${id}`),
      api.get(`/events/${id}/attendees`),
    ])
    event.value = eventRes.data
    attendees.value = attendeesRes.data
  } catch {
    event.value = mockEvents[id] || null
    attendees.value = [
      { id: 1, username: 'alice_k' },
      { id: 2, username: 'bob_rw' },
      { id: 3, username: 'claire_n' },
    ]
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.loading, .empty-state {
  text-align: center;
  color: var(--muted);
  padding: 60px 0;
  font-size: 15px;
}

.hero-image {
  position: relative;
  width: 100%;
  aspect-ratio: 21/9;
  border-radius: var(--card-radius);
  overflow: hidden;
  margin-bottom: 28px;
}

.hero-image img { width: 100%; height: 100%; object-fit: cover; }

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.back-btn:hover { background: white; }

.category-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255,255,255,0.92);
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.detail-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 28px;
  align-items: start;
}

.event-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.3;
}

.meta-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--bg);
  border-radius: 10px;
  padding: 14px;
}

.meta-icon { 
  width: 20px;
  height: 20px;
  color: var(--blue);
  flex-shrink: 0;
}

.meta-item div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label { font-size: 11px; color: var(--muted); font-weight: 500; text-transform: uppercase; }
.meta-value { font-size: 13px; font-weight: 600; color: var(--text); }

.section { margin-bottom: 28px; }
.section h3 { font-size: 16px; font-weight: 700; margin-bottom: 12px; }

.description { font-size: 14px; color: var(--muted); line-height: 1.7; }

.attendees-list { display: flex; flex-wrap: wrap; gap: 8px; }

.attendee-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--bg);
  border-radius: 999px;
  padding: 5px 12px 5px 5px;
  font-size: 13px;
  font-weight: 500;
}

.attendee-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--blue);
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-attendees { font-size: 13px; color: var(--muted); }

/* Action Card */
.action-card {
  background: var(--white);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 24px;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.price { font-size: 22px; font-weight: 700; color: var(--text); }
.spots { font-size: 12px; color: var(--muted); background: var(--bg); padding: 4px 10px; border-radius: 999px; }

.action-main-btn { 
  width: 100%; 
  padding: 13px; 
  font-size: 14px; 
  border-radius: 10px; 
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-main-btn.attending { background: #e8f4fd; color: var(--blue); }
.action-main-btn.saved { color: #e0245e; border-color: #e0245e; }

.share-row { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--border); }
.share-label { font-size: 12px; font-weight: 600; color: var(--muted); }

.share-btn {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-btn:hover { border-color: var(--blue); color: var(--blue); }

.copied-msg { text-align: center; font-size: 12px; color: #16a34a; font-weight: 600; }

@media (max-width: 900px) {
  .detail-body { grid-template-columns: 1fr; }
  .action-card { position: static; }
  .meta-row { grid-template-columns: 1fr; }
}
</style>
