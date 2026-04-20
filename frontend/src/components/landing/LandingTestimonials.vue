<template>
  <section class="testi-section">
    <div class="section-inner">
      <div style="text-align:center">
        <div class="eyebrow reveal">Community love</div>
        <h2 class="section-heading reveal" style="text-align:center">What our members <em>say</em></h2>
      </div>
      <div class="testi-grid">
        <div v-for="(testi, i) in testimonials" :key="testi.name" class="tcard reveal" :class="testi.delay ? `reveal-delay-${testi.delay}` : ''">
          <div class="stars">★★★★★</div>
          <p class="tcard-quote">{{ testi.quote }}</p>
          <div class="tcard-author">
            <div class="tcard-av" :style="{ background: testi.color }">{{ testi.initials }}</div>
            <div>
              <div class="tcard-name">{{ testi.name }}</div>
              <div class="tcard-role">{{ testi.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    name: 'Jean-Paul Ntawuruhunga',
    role: 'Software Engineer, Kigali',
    quote: "EventLocal completely changed how I navigate Kigali's social scene. I've attended 14 events I'd never have discovered — jazz nights, tech talks, food trails. It feels curated for me personally.",
    initials: 'JP',
    color: '#F59E0B'
  },
  {
    name: 'Amina Uwimana',
    role: 'Cultural Event Organizer',
    quote: "The organizer dashboard is remarkable. Real-time ticket tracking, attendee messaging and the AI copilot that wrote my entire event description in 30 seconds — I was genuinely impressed.",
    initials: 'AU',
    color: '#D97706',
    delay: 1
  },
  {
    name: 'Robert Ekwueme',
    role: 'Entrepreneur & Networker',
    quote: 'I relocated to Kigali six months ago. EventLocal was the single tool that helped me build my entire network here. The community events section is genuinely unlike anything else I\'ve used.',
    initials: 'RE',
    color: '#B45309',
    delay: 2
  }
]
</script>

<style scoped>
section { padding: 96px 6%; }
.section-inner { max-width: 1320px; margin: 0 auto; }
.eyebrow { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--amber-600); margin-bottom: 14px; }
.section-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4.5vw, 3.6rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; color: var(--ink); margin-bottom: 18px; }
.section-heading em { font-style: italic; color: var(--amber-600); }

.testi-section { background: var(--cream2); }
.testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 52px; }
.tcard { background: var(--surface); border-radius: var(--radius-xl); padding: 28px; border: 1px solid var(--border); transition: all .3s; position: relative; cursor: none; }
.tcard:hover { box-shadow: var(--shadow); transform: translateY(-3px); }
.tcard::before { content: '"'; position: absolute; top: 16px; right: 24px; font-family: 'Cormorant Garamond', serif; font-size: 5rem; color: var(--amber-200); line-height: 1; font-style: italic; }
.stars { color: var(--amber-500); font-size: 14px; letter-spacing: 2px; margin-bottom: 14px; }
.tcard-quote { font-size: .9rem; color: var(--ink2); line-height: 1.78; font-weight: 300; margin-bottom: 20px; font-style: italic; font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; }
.tcard-author { display: flex; align-items: center; gap: 11px; }
.tcard-av { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1rem; color: #fff; flex-shrink: 0; }
.tcard-name { font-weight: 600; font-size: 13.5px; color: var(--ink); }
.tcard-role { font-size: 11.5px; color: var(--ink3); font-weight: 300; }

.reveal { opacity: 0; transform: translateY(36px); transition: opacity .75s ease, transform .75s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: .1s; }
.reveal-delay-2 { transition-delay: .2s; }

@media (max-width: 1000px) {
  .testi-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .testi-grid { grid-template-columns: 1fr; }
}
</style>
