<template>
  <div class="event-card">
    <div class="card-image">
      <img :src="event.imageUrl || fallbackImage" :alt="event.title" />
      <span class="category-badge">{{ event.category }}</span>
    </div>

    <div class="card-body">
      <div class="card-date">
        <span class="date-icon">📅</span>
        <span>{{ formatDate(event.date) }}</span>
      </div>

      <h3 class="card-title">{{ event.title }}</h3>

      <div class="card-meta">
        <span class="meta-item">📍 {{ event.location }}</span>
        <span class="meta-item">👥 {{ event.attendeeCount }} attending</span>
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
          >✓</button>
          <button
            :class="['action-btn save', { active: saved }]"
            @click.stop="saved = !saved"
            title="Save"
          >♡</button>
          <button
            class="action-btn dismiss"
            @click.stop="$emit('dismiss', event.id)"
            title="Dismiss"
          >✕</button>
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
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.event-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
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
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
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
  gap: 3px;
}

.meta-item {
  font-size: 12px;
  color: var(--muted);
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
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: var(--muted);
}

.action-btn:hover { border-color: var(--blue); color: var(--blue); }
.action-btn.attend.active { background: #e8f4fd; color: var(--blue); border-color: var(--blue); }
.action-btn.save.active { background: #fff0f0; color: #e0245e; border-color: #e0245e; }
.action-btn.dismiss:hover { border-color: #e0245e; color: #e0245e; }
</style>
