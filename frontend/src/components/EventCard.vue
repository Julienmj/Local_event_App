<template>
  <div class="event-card" @click="$emit('open', event)">
    <div class="event-img" :style="event.imageUrl ? {} : { background: event.color || 'var(--surface2)' }">
      <img v-if="event.imageUrl" :src="event.imageUrl" class="event-bg-img" alt=""/>
      <i v-else class="ph ph-calendar-star event-placeholder-icon"></i>
      <span class="event-cat-pill">{{ event.category?.name || event.categoryName }}</span>
      <button class="event-save-btn" @click.stop="$emit('save', event.id)">
        <i :class="isSaved ? 'ph-fill ph-bookmark-simple' : 'ph ph-bookmark-simple'"></i>
      </button>
    </div>
    <div class="event-body">
      <div class="event-meta">
        <i class="ph ph-calendar-blank" style="font-size:11px"></i>
        <span>{{ formattedDate }}</span>
        <span class="dot-sep">·</span>
        <i class="ph ph-clock" style="font-size:11px"></i>
        <span>{{ formattedTime }}</span>
      </div>
      <div class="event-title-text">{{ event.title }}</div>
      <div class="event-loc">
        <i class="ph ph-map-pin"></i>
        {{ event.venue?.name || event.venueName || 'Venue TBD' }}
      </div>
      <div class="event-footer">
        <span class="event-price-tag" :class="{ free: !event.price }">
          <i class="ph ph-ticket" style="font-size:12px"></i>
          {{ event.price ? 'RWF ' + Number(event.price).toLocaleString() : 'Free' }}
        </span>
        <span class="event-attendees">
          <i class="ph ph-users" style="font-size:11px"></i>
          {{ event.attendeesCount || 0 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  event: { type: Object, required: true },
  isSaved: { type: Boolean, default: false },
})
defineEmits(['open', 'save'])

const formattedDate = computed(() => {
  if (!props.event.eventDate) return 'TBA'
  return new Date(props.event.eventDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })
})

const formattedTime = computed(() => {
  if (props.event.eventTime) return props.event.eventTime
  if (!props.event.eventDate) return ''
  return new Date(props.event.eventDate).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
})
</script>

<style scoped>
.event-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
  cursor: pointer;
  transition: all .25s;
  display: flex;
  flex-direction: column;
}
.event-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  transform: translateY(-3px);
  border-color: var(--accent);
}

.event-img {
  height: 140px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.event-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
.event-placeholder-icon { font-size: 2.8rem; color: rgba(245,158,11,0.4); z-index: 1; }

.event-cat-pill {
  position: absolute;
  top: 9px;
  left: 10px;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 10.5px;
  font-weight: 600;
  background: rgba(15,14,23,0.75);
  color: var(--a300);
  letter-spacing: .02em;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(245,158,11,0.2);
  z-index: 2;
}

.event-save-btn {
  position: absolute;
  top: 9px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: rgba(15,14,23,0.7);
  border-radius: 50%;
  border: 1px solid rgba(245,158,11,0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all .2s;
  color: var(--a400);
  z-index: 2;
  backdrop-filter: blur(4px);
}
.event-save-btn:hover { background: var(--accent); color: #fff; transform: scale(1.1); }

.event-body { padding: 13px 15px; flex: 1; display: flex; flex-direction: column; }

.event-meta {
  font-size: 11px;
  color: var(--ink4);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.dot-sep { color: var(--border2); }

.event-title-text {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--ink);
  margin-bottom: 6px;
  line-height: 1.25;
  letter-spacing: -.01em;
}

.event-loc {
  font-size: 11.5px;
  color: var(--ink3);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.event-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.event-price-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--accent);
}
.event-price-tag.free { color: var(--ok); }

.event-attendees {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--ink4);
}
</style>
