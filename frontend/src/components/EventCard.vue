<template>
  <div class="event-card">
    <div class="card-image">
      <img :src="event.imageUrl || fallbackImage" :alt="event.title" />
      <span class="category-badge">{{ event.category }}</span>
    </div>

    <div class="card-body">
      <div class="card-date">
        <svg class="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>{{ formatDate(event.date) }}</span>
      </div>

      <h3 class="card-title">{{ event.title }}</h3>

      <div class="card-meta">
        <span class="meta-item">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {{ event.location }}
        </span>
        <span class="meta-item">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          {{ event.attendeeCount }} attending
        </span>
      </div>

      <div class="card-footer">
        <div class="avatars">
          <div
            v-for="(a, i) in event.friends?.slice(0, 3)"
            :key="i"
            class="mini-avatar"
            :style="{ left: i * 18 + 'px' }"
          >{{ a.charAt(0) }}</div>
          <span v-if="event.friends?.length" class="friends-text">
            {{ event.friends.length }} friend{{ event.friends.length > 1 ? 's' : '' }} going
          </span>
        </div>

        <div class="card-actions">
          <button
            :class="['action-btn attend', { active: attending }]"
            @click.stop="attending = !attending"
            title="Attend"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          <button
            :class="['action-btn save', { active: saved }]"
            @click.stop="saved = !saved"
            title="Save"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          <button
            class="action-btn dismiss"
            @click.stop="$emit('dismiss', event.id)"
            title="Dismiss"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  event: { type: Object, required: true }
})

defineEmits(['dismiss'])

const attending = ref(false)
const saved = ref(false)
const fallbackImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.event-card {
  background: var(--white);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.event-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid var(--blue);
  border-radius: var(--card-radius);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
}

.event-card:hover::after {
  opacity: 0.3;
}

.card-image {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.event-card:hover .card-image img {
  transform: scale(1.08);
}

.category-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255,255,255,0.92);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text);
  backdrop-filter: blur(4px);
}

.card-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; }

.card-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
}

.date-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-item {
  font-size: 12px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.avatars {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  height: 24px;
}

.mini-avatar {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--blue);
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.friends-text {
  font-size: 11px;
  color: var(--muted);
  margin-left: 64px;
  white-space: nowrap;
}

.card-actions { display: flex; gap: 6px; }

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--muted);
  padding: 0;
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

.action-btn:hover { 
  border-color: var(--blue); 
  color: var(--blue);
  transform: scale(1.15);
}

.action-btn.attend.active { 
  background: #e8f4fd; 
  color: var(--blue); 
  border-color: var(--blue);
  transform: scale(1.1);
}

.action-btn.save.active { 
  background: #fff0f0; 
  color: #e0245e; 
  border-color: #e0245e;
  transform: scale(1.1);
  animation: heartbeat 0.6s ease;
}

.action-btn.save.active svg {
  fill: #e0245e;
}

.action-btn.dismiss:hover { 
  border-color: #e0245e; 
  color: #e0245e;
  transform: scale(1.15) rotate(90deg);
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1.1); }
}
</style>
