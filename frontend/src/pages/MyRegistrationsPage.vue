<template>
  <AppLayout>
    <div class="page-header">
      <div>
        <h1>My Registrations</h1>
        <p class="sub">Events you've signed up for</p>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading your registrations...</div>

    <div v-else-if="registrations.length === 0" class="empty-state">
      <div class="empty-icon">🎟️</div>
      <h3>No registrations yet</h3>
      <p>Browse events and register to see them here.</p>
      <router-link to="/events" class="btn-primary">Browse Events</router-link>
    </div>

    <div v-else>
      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-num">{{ registrations.length }}</span>
          <span class="stat-label">Total Registered</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ upcoming.length }}</span>
          <span class="stat-label">Upcoming</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ past.length }}</span>
          <span class="stat-label">Past Events</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ cancelled.length }}</span>
          <span class="stat-label">Cancelled</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button :class="['tab', { active: tab === 'upcoming' }]" @click="tab = 'upcoming'">
          🗓️ Upcoming ({{ upcoming.length }})
        </button>
        <button :class="['tab', { active: tab === 'past' }]" @click="tab = 'past'">
          ✅ Past ({{ past.length }})
        </button>
        <button :class="['tab', { active: tab === 'cancelled' }]" @click="tab = 'cancelled'">
          ✕ Cancelled ({{ cancelled.length }})
        </button>
      </div>

      <!-- List -->
      <div class="reg-list">
        <div
          v-for="reg in currentList"
          :key="reg.registrationID"
          class="reg-card"
        >
          <div class="reg-image">
            <img :src="reg.eventImageUrl || fallback" :alt="reg.eventTitle" />
          </div>
          <div class="reg-info">
            <div class="reg-top">
              <h3 class="reg-title">{{ reg.eventTitle }}</h3>
              <span :class="['status-badge', reg.status.toLowerCase()]">{{ reg.status }}</span>
            </div>
            <div class="reg-meta">
              <span>📅 {{ formatDate(reg.eventDate) }}</span>
              <span>📍 {{ reg.venueName }}</span>
              <span>🗂️ {{ reg.categoryName }}</span>
            </div>
            <div class="reg-footer">
              <span class="reg-date">Registered {{ formatDate(reg.registeredAt) }}</span>
              <div class="reg-actions">
                <router-link :to="`/events/${reg.eventID}`" class="btn-ghost btn-sm">View Event</router-link>
                <button
                  v-if="reg.status === 'Confirmed' && isUpcoming(reg.eventDate)"
                  class="btn-cancel"
                  @click="cancelReg(reg)"
                  :disabled="cancelling === reg.registrationID"
                >
                  {{ cancelling === reg.registrationID ? 'Cancelling...' : 'Cancel' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentList.length === 0" class="empty-tab">
          No {{ tab }} registrations.
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import api from '../api'

const auth = useAuthStore()
const registrations = ref([])
const loading = ref(true)
const tab = ref('upcoming')
const cancelling = ref(null)
const fallback = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=60'

const upcoming = computed(() => registrations.value.filter(r => r.status === 'Confirmed' && isUpcoming(r.eventDate)))
const past = computed(() => registrations.value.filter(r => !isUpcoming(r.eventDate) && r.status !== 'Cancelled'))
const cancelled = computed(() => registrations.value.filter(r => r.status === 'Cancelled'))

const currentList = computed(() => {
  if (tab.value === 'upcoming') return upcoming.value
  if (tab.value === 'past') return past.value
  return cancelled.value
})

function isUpcoming(date) { return new Date(date) >= new Date() }

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function cancelReg(reg) {
  if (!confirm(`Cancel your registration for "${reg.eventTitle}"?`)) return
  cancelling.value = reg.registrationID
  try {
    await api.delete(`/registrations/${reg.registrationID}`)
    reg.status = 'Cancelled'
  } catch (e) {
    alert('Failed to cancel. Please try again.')
  } finally {
    cancelling.value = null
  }
}

onMounted(async () => {
  try {
    const res = await api.get(`/registrations/user/${auth.user?.userID}`)
    registrations.value = res.data
  } catch {
    // mock data while backend connects
    registrations.value = [
      { registrationID: 1, eventID: 1, eventTitle: 'Kigali Jazz Night', eventDate: '2026-04-20', venueName: 'Kigali Arena', categoryName: 'Music & Art', registeredAt: '2026-04-10', status: 'Confirmed', eventImageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=60' },
      { registrationID: 2, eventID: 3, eventTitle: 'Tech Startup Meetup', eventDate: '2026-04-25', venueName: 'Norrsken House', categoryName: 'Tech', registeredAt: '2026-04-09', status: 'Confirmed', eventImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=60' },
      { registrationID: 3, eventID: 2, eventTitle: 'Community Football Tournament', eventDate: '2026-03-15', venueName: 'Amahoro Stadium', categoryName: 'Sports', registeredAt: '2026-03-01', status: 'Confirmed', eventImageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=60' },
    ]
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; }
.sub { font-size: 13px; color: var(--muted); margin-top: 4px; }

.loading { text-align: center; color: var(--muted); padding: 60px 0; font-size: 15px; }

.empty-state {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.empty-icon { font-size: 48px; }
.empty-state h3 { font-size: 18px; font-weight: 700; }
.empty-state p { color: var(--muted); font-size: 14px; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.stat-card { background: var(--white); border-radius: var(--card-radius); box-shadow: var(--shadow); padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-num { font-size: 26px; font-weight: 700; color: var(--blue); }
.stat-label { font-size: 12px; color: var(--muted); }

.tabs { display: flex; gap: 4px; margin-bottom: 20px; background: var(--white); border-radius: 10px; padding: 4px; box-shadow: var(--shadow); width: fit-content; }
.tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; background: transparent; color: var(--muted); cursor: pointer; transition: all 0.2s; }
.tab.active { background: var(--blue); color: white; }

.reg-list { display: flex; flex-direction: column; gap: 14px; }

.reg-card {
  background: var(--white);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow);
  display: flex;
  overflow: hidden;
  transition: transform 0.2s;
}
.reg-card:hover { transform: translateY(-2px); }

.reg-image { width: 140px; flex-shrink: 0; }
.reg-image img { width: 100%; height: 100%; object-fit: cover; }

.reg-info { flex: 1; padding: 16px 20px; display: flex; flex-direction: column; gap: 8px; }

.reg-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.reg-title { font-size: 16px; font-weight: 700; line-height: 1.3; }

.status-badge { padding: 3px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
.status-badge.confirmed { background: #d1fae5; color: #065f46; }
.status-badge.cancelled { background: #fee2e2; color: #991b1b; }
.status-badge.waitlisted { background: #fef3c7; color: #92400e; }

.reg-meta { display: flex; gap: 16px; flex-wrap: wrap; }
.reg-meta span { font-size: 12px; color: var(--muted); }

.reg-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.reg-date { font-size: 11px; color: var(--muted); }

.reg-actions { display: flex; gap: 8px; }

.btn-sm { padding: 6px 14px; font-size: 12px; }

.btn-cancel {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: #fff0f0;
  color: #e0245e;
  border: 1px solid #fecdd3;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover { background: #fee2e2; }
.btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }

.empty-tab { text-align: center; color: var(--muted); padding: 40px 0; font-size: 14px; }

@media (max-width: 768px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .reg-card { flex-direction: column; }
  .reg-image { width: 100%; height: 160px; }
}
</style>
