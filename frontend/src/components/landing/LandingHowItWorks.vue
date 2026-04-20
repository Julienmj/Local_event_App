<template>
  <section id="how" class="how-section">
    <div class="section-inner">
      <div style="text-align:center">
        <div class="eyebrow reveal" style="color:var(--amber-400)">Simple by design</div>
        <h2 class="section-heading reveal" style="color:#fff;text-align:center">How it <em>works</em></h2>
      </div>
      <div class="how-grid">
        <div v-for="(step, i) in steps" :key="step.num" class="how-step reveal" :class="step.delay ? `reveal-delay-${step.delay}` : ''">
          <div :class="['step-circle', { active: step.active }]">
            <span class="step-num">{{ step.num }}</span>
          </div>
          <h4 class="step-title">{{ step.title }}</h4>
          <p class="step-desc">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    num: '01',
    title: 'Create your account',
    desc: 'Sign up in seconds. Set your location and interests to personalise your experience from day one.',
    active: true
  },
  {
    num: '02',
    title: 'Discover events',
    desc: 'Browse curated events near you, filter by category, date, price and explore venues on the live map.',
    delay: 1
  },
  {
    num: '03',
    title: 'Register instantly',
    desc: 'Secure your spot with mobile money or card. Digital ticket lands in your pocket within seconds.',
    delay: 2
  },
  {
    num: '04',
    title: 'Show up & connect',
    desc: 'Attend, meet fellow members and leave a review. Build your community event by event.',
    delay: 3
  }
]
</script>

<style scoped>
section { padding: 96px 6%; }
.section-inner { max-width: 1320px; margin: 0 auto; }
.eyebrow { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--amber-600); margin-bottom: 14px; }
.section-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4.5vw, 3.6rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; color: var(--ink); margin-bottom: 18px; }
.section-heading em { font-style: italic; color: var(--amber-600); }

.how-section { background: var(--ink); }
.how-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 60px; position: relative; }
.how-grid::after { content: ''; position: absolute; top: 30px; left: 12%; right: 12%; height: 1px; background: linear-gradient(90deg, transparent, var(--amber-700), var(--amber-700), transparent); }

.how-step { text-align: center; padding: 0 24px; }
.step-circle { width: 60px; height: 60px; border-radius: 50%; border: 1.5px solid rgba(245,158,11,0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto 22px; position: relative; z-index: 1; transition: all .4s; }
.step-circle.active { background: var(--amber-500); border-color: var(--amber-500); box-shadow: 0 0 32px rgba(245,158,11,0.4); }
.step-num { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.2rem; color: rgba(255,255,255,.6); font-style: italic; }
.step-circle.active .step-num { color: #fff; }
.step-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 10px; letter-spacing: -0.01em; }
.step-desc { font-size: 13px; color: rgba(255,255,255,.38); line-height: 1.7; font-weight: 300; }

.reveal { opacity: 0; transform: translateY(36px); transition: opacity .75s ease, transform .75s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: .1s; }
.reveal-delay-2 { transition-delay: .2s; }
.reveal-delay-3 { transition-delay: .3s; }

@media (max-width: 1000px) {
  .how-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
  .how-grid::after { display: none; }
}
@media (max-width: 600px) {
  .how-grid { grid-template-columns: 1fr; }
}
</style>
