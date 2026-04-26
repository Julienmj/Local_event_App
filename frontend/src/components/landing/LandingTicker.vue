<template>
  <div class="ticker">
    <div class="ticker-track">
      <span v-for="(item, i) in tickerItems.concat(tickerItems)" :key="i" class="ticker-item">
        <span class="ticker-dot"></span>{{ item }}
      </span>
    </div>
  </div>
</template>

<script setup>
const tickerItems = [
  '120+ Events This Month',
  'Kigali Jazz & Wine Evening — Apr 22',
  'Tech Founders Meetup — Free Entry',
  'Gorilla Conservation Run — Volcanoes Park',
  '3,400+ Community Members',
  'AI-Powered Event Planning Copilot',
  'Interactive Venue Maps',
  'Umuganda Art Fair — May 5',
  'Nyamirambo Food Trail — Apr 26',
  'Rwanda Tech Summit — Jun 1',
]
</script>

<style scoped>
.ticker {
  background: var(--surface);
  padding: 12px 0;
  overflow: hidden;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.ticker-track {
  display: flex;
  white-space: nowrap;
  animation: ticker 35s linear infinite;
}
.ticker-item {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text2);
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: 0.02em;
  font-style: italic;
}
.ticker-dot {
  width: 5px; height: 5px;
  background: var(--accent);
  border-radius: 50%;
  flex-shrink: 0;
}
@keyframes ticker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
