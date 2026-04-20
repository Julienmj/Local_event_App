<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <div class="modal-img" :style="{ background: event.color }">
        <span style="font-size:4rem">{{ event.emoji }}</span>
        <button class="modal-close" @click="$emit('close')">✕</button>
        <div style="position:absolute;top:12px;left:12px">
          <span class="pill" :class="event.status === 'live' ? 'pill-live' : 'pill-upcoming'">
            {{ event.status === 'live' ? '🟢 Live' : 'Upcoming' }}
          </span>
        </div>
      </div>

      <div class="modal-body">
        <div class="modal-title">{{ event.title }}</div>
        <p class="modal-desc">{{ event.description || 'Join us for this exciting event!' }}</p>

        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <div class="modal-meta-label">Date & Time</div>
            <div class="modal-meta-val">{{ formattedDate }} · {{ formattedTime }}</div>
          </div>
          <div class="modal-meta-item">
            <div class="modal-meta-label">Venue</div>
            <div class="modal-meta-val">{{ event.venue?.name || event.venueName || 'TBD' }}</div>
          </div>
          <div class="modal-meta-item">
            <div class="modal-meta-label">Category</div>
            <div class="modal-meta-val">{{ event.category?.name || event.categoryName || 'General' }}</div>
          </div>
          <div class="modal-meta-item">
            <div class="modal-meta-label">Capacity</div>
            <div class="modal-meta-val">{{ event.attendeesCount || 0 }} / {{ event.maxAttendees || event.capacity || '—' }} attending</div>
          </div>
        </div>

        <div class="modal-footer">
          <div>
            <div style="font-size:11px;color:var(--ink3);margin-bottom:2px">Price</div>
            <div class="modal-price" :class="{ free: !event.price }">
              {{ event.price ? 'RWF ' + Number(event.price).toLocaleString() : 'Free' }}
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-outline-amber" @click="$emit('save', event.id)">
              🔖 {{ isSaved ? 'Saved' : 'Save' }}
            </button>
            <button class="btn btn-amber" :disabled="registering" @click="handleRegister">
              <span v-if="registering" class="loading-spinner"></span>
              <span v-else>Register Now</span>
            </button>
          </div>
        </div>

        <!-- Reviews -->
        <div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--border)">
          <div style="font-family:'Cormorant Garamond',serif;font-weight:700;font-size:1.05rem;margin-bottom:12px">
            Reviews ({{ reviews.length }})
          </div>

          <div v-if="reviews.length" class="review-list">
            <div v-for="r in reviews.slice(0, 3)" :key="r.id" class="review-item">
              <div class="review-meta">
                <span style="font-weight:500">{{ r.user?.fullName || r.userName || 'Attendee' }}</span>
                <span>★{{ r.rating || 5 }}</span>
              </div>
              <div class="review-text">{{ r.comment || r.reviewText }}</div>
            </div>
          </div>
          <p v-else style="font-size:13px;color:var(--ink3);font-weight:300;font-style:italic;margin-bottom:10px">
            No reviews yet. Be the first!
          </p>

          <div class="review-form">
            <div style="font-size:12px;font-weight:500;margin-bottom:8px;color:var(--ink2)">Leave a review</div>
            <div class="star-input">
              <span
                v-for="s in 5" :key="s"
                class="star-btn" :class="{ active: stars >= s }"
                @click="stars = s"
              >★</span>
            </div>
            <textarea
              v-model="reviewText"
              class="form-input textarea"
              style="min-height:64px;font-size:13px"
              placeholder="Share your experience…"
            ></textarea>
            <button class="btn btn-amber" style="margin-top:8px;font-size:13px;padding:8px 18px" @click="submitReview">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  event: { type: Object, required: true },
  reviews: { type: Array, default: () => [] },
  isSaved: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'save', 'registered'])

const api = useApi()
const auth = useAuthStore()
const eventsStore = useEventsStore()
const { show } = useToast()

const stars = ref(0)
const reviewText = ref('')
const registering = ref(false)

const formattedDate = computed(() => {
  if (!props.event.eventDate) return 'TBD'
  return new Date(props.event.eventDate).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })
})

const formattedTime = computed(() => {
  if (props.event.eventTime) return props.event.eventTime
  if (!props.event.eventDate) return 'TBD'
  return new Date(props.event.eventDate).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
})

async function handleRegister() {
  if (!auth.isLoggedIn) {
    show('Please sign in to register.', '📍')
    return
  }
  registering.value = true
  try {
    await eventsStore.registerForEvent(auth.user.id || auth.user.userID, props.event.id)
    show('Registration confirmed! Check your notifications.', '🎟️')
    emit('registered', props.event.id)
    emit('close')
  } catch (e) {
    show(e.message || 'Registration failed. Try again.', '⚠️')
  } finally {
    registering.value = false
  }
}

async function submitReview() {
  if (!auth.isLoggedIn) {
     show('Please sign in to leave a review.', '📍')
     return
  }
  if (!reviewText.value.trim() || !stars.value) {
    show('Please add a rating and comment.', '⚠️')
    return
  }
  try {
    await api.post('/reviews', {
      eventID: props.event.id,
      userID: auth.user.id || auth.user.userID,
      rating: stars.value,
      comment: reviewText.value.trim(),
    })
    show('Review submitted! Thanks.', '⭐')
    reviewText.value = ''
    stars.value = 0
    emit('close')
  } catch (e) {
    show(e.message || 'Failed to submit review', '⚠️')
  }
}
</script>
