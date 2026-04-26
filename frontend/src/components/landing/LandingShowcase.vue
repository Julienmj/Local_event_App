<template>
  <section id="events" class="showcase-section">
    <div class="section-inner">
      <div class="showcase-header">
        <div>
          <div class="eyebrow reveal">Happening Now</div>
          <h2 class="section-heading reveal">Trending in <em>Kigali</em></h2>
        </div>
        <RouterLink to="/app/events" class="btn btn-outline-amber btn-lg reveal">View all events</RouterLink>
      </div>
      <div class="showcase-grid reveal">
        <div
          v-for="event in events"
          :key="event.title"
          :class="['sc-card', { big: event.big }]"
          @click="router.push('/app/events')"
        >
          <div class="sc-bg" :style="{ background: event.gradient }">
            <div class="sc-overlay"></div>
            <div class="sc-icon"><i :class="event.icon"></i></div>
            <div class="sc-content">
              <div class="sc-cat">{{ event.category }} · {{ event.date }}</div>
              <div class="sc-title">{{ event.title }}</div>
              <div class="sc-meta">
                {{ event.venue }} · {{ event.price }}
                <span v-if="event.badge" class="sc-badge">{{ event.badge }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const events = [
  { title: 'Kigali Jazz & Wine Evening', category: 'Music & Art', date: 'Apr 22', venue: 'Inzora Rooftop', price: 'RWF 15,000', icon: 'ph ph-music-note', gradient: 'linear-gradient(145deg, #1a0a00, #3d1500)', big: true, badge: 'Trending' },
  { title: 'Gorilla Conservation Run', category: 'Sports', date: 'Apr 27', venue: 'Volcanoes NP', price: 'RWF 20,000', icon: 'ph ph-person-simple-run', gradient: 'linear-gradient(145deg, #0a1a0a, #0f4c2a)', big: false },
  { title: 'Tech Founders Meetup', category: 'Tech', date: 'Apr 24', venue: 'Norrsken House', price: 'Free', icon: 'ph ph-desktop-tower', gradient: 'linear-gradient(145deg, #0a0a1a, #1a3a5c)', big: false, badge: 'Free' },
  { title: 'Nyamirambo Food Trail', category: 'Food & Drink', date: 'Apr 26', venue: 'Nyamirambo', price: 'RWF 8,000', icon: 'ph ph-fork-knife', gradient: 'linear-gradient(145deg, #1a0800, #5c2a00)', big: false },
  { title: 'Umuganda Art Fair', category: 'Music & Art', date: 'May 5', venue: 'Village Urugwiro', price: 'Free', icon: 'ph ph-paint-brush', gradient: 'linear-gradient(145deg, #100a1a, #3d1a6e)', big: false, badge: 'Free' },
]
</script>

<style scoped>
section { padding: 96px 6%; }
.section-inner { max-width: 1320px; margin: 0 auto; }
.eyebrow { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--accent); margin-bottom: 14px; }
.section-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4.5vw, 3.6rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; color: var(--text); margin-bottom: 18px; }
.section-heading em { font-style: italic; color: var(--accent); }
.showcase-section { background: var(--bg); }
.showcase-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 44px; flex-wrap: wrap; gap: 16px; }
.showcase-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; grid-template-rows: 240px 240px; gap: 16px; }
.sc-card { border-radius: var(--radius-xl); overflow: hidden; position: relative; cursor: none; transition: transform .35s; }
.sc-card:hover { transform: scale(1.025); }
.sc-card.big { grid-row: span 2; }
.sc-bg { width: 100%; height: 100%; display: flex; align-items: flex-end; padding: 20px 22px; position: relative; }
.sc-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,15,5,.75) 0%, transparent 60%); }
.sc-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -60%); font-size: 3.5rem; opacity: .2; z-index: 0; pointer-events: none; color: #fff; }
.sc-card.big .sc-icon { font-size: 5rem; }
.sc-content { position: relative; z-index: 1; color: #fff; }
.sc-cat { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; color: rgba(255,255,255,.6); margin-bottom: 4px; }
.sc-title { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 700; line-height: 1.2; margin-bottom: 3px; }
.sc-card.big .sc-title { font-size: 1.6rem; }
.sc-meta { font-size: 11.5px; color: rgba(255,255,255,.55); display: flex; align-items: center; gap: 8px; }
.sc-badge { background: var(--accent); color: #fff; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 99px; }
.reveal { opacity: 0; transform: translateY(36px); transition: opacity .75s ease, transform .75s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
@media (max-width: 1000px) { .showcase-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; } .sc-card.big { grid-column: span 2; grid-row: span 1; } }
@media (max-width: 600px) { .showcase-grid { grid-template-columns: 1fr; } .sc-card.big { grid-column: span 1; } }
</style>
