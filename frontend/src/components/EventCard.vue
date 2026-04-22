<template>
  <div class="event-card" @click="$emit('open', event)">
    <div class="event-img" :style="{ background: event.color }">
      <img v-if="event.imageUrl" :src="event.imageUrl" class="event-bg-img" alt=""/>
      <span v-else>{{ event.emoji }}</span>
      <span class="event-cat-pill">{{ event.category?.name || event.categoryName }}</span>
      <button class="event-save-btn" @click.stop="$emit('save', event.id)">
        {{ isSaved ? '🔖' : '🤍' }}
      </button>
    </div>
    <div class="event-body">
      <div class="event-meta">
        <span>{{ formattedDate }}</span>
        <span>·</span>
        <span>{{ formattedTime }}</span>
      </div>
      <div class="event-title-text">{{ event.title }}</div>
      <div class="event-loc">📍 {{ event.venue?.name || event.venueName }}</div>
      <div class="event-footer">
        <span class="event-price-tag" :class="{ free: !event.price }">
          {{ event.price ? 'RWF ' + Number(event.price).toLocaleString() : 'Free' }}
        </span>
        <span class="event-attendees">{{ event.attendeesCount || 0 }} attending</span>
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
.event-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; cursor: pointer; transition: all .25s; display: flex; flex-direction: column; }
.event-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); border-color: var(--a300); }
.event-img { height: 136px; position: relative; display: flex; align-items: center; justify-content: center; font-size: 2.8rem; overflow: hidden; }
.event-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
.event-cat-pill { position: absolute; top: 9px; left: 10px; padding: 3px 10px; border-radius: 99px; font-size: 10.5px; font-weight: 600; background: rgba(255,255,255,.88); color: var(--ink2); letter-spacing: .02em; }
.event-save-btn { position: absolute; top: 9px; right: 10px; width: 28px; height: 28px; background: rgba(255,255,255,.88); border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all .2s; }
.event-save-btn:hover { background: #fff; transform: scale(1.1); }
.event-body { padding: 13px 15px; flex: 1; display: flex; flex-direction: column; }
.event-meta { font-size: 11px; color: var(--ink4); margin-bottom: 5px; display: flex; gap: 6px; }
.event-title-text { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1rem; color: var(--ink); margin-bottom: 5px; line-height: 1.25; letter-spacing: -.01em; }
.event-loc { font-size: 11.5px; color: var(--ink3); margin-bottom: 10px; display: flex; align-items: center; gap: 3px; }
.event-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--border); }
.event-price-tag { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.05rem; color: var(--ink); }
.event-price-tag.free { color: var(--teal); }
.event-attendees { font-size: 11px; color: var(--ink3); }
</style>
