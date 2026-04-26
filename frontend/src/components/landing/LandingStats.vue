<template>
  <div class="stats-band">
    <div class="stats-inner">
      <div v-for="(stat, i) in stats" :key="stat.label" class="stat-item reveal" :class="`reveal-delay-${i}`">
        <div class="stat-num" ref="numEls" :data-val="stat.val">{{ stat.display }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const stats = [
  { val: 120, display: '120+', label: 'Events every month' },
  { val: 3400, display: '3,400', label: 'Community members' },
  { val: 18, display: '18', label: 'Event categories' },
  { val: 12, display: '12', label: 'Cities covered' }
]

const numEls = ref([])
let gsapCtx = null

onMounted(() => {
  // lazy-load gsap
  if (!window.gsap) {
    const s1 = document.createElement('script')
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
    const s2 = document.createElement('script')
    s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
    
    s1.onload = () => {
      document.head.appendChild(s2)
      s2.onload = initAnim
    }
    document.head.appendChild(s1)
  } else {
    initAnim()
  }
})

onUnmounted(() => {
  if (gsapCtx) gsapCtx.revert()
})

function initAnim() {
  const gsap = window.gsap
  const ScrollTrigger = window.ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)
  
  gsapCtx = gsap.context(() => {
    numEls.value.forEach(el => {
      const val = parseFloat(el.getAttribute('data-val'))
      const hasPlus = el.textContent.includes('+')
      
      gsap.from({v: 0}, {
        v: val,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: function() {
          el.textContent = Math.round(this.targets()[0].v).toLocaleString() + (hasPlus ? '+' : '')
        }
      })
    })
  })
}
</script>

<style scoped>
.stats-band { background: var(--surface); padding: 64px 6%; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stats-inner {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  divide-x: 1px solid rgba(255,255,255,0.06);
}
.stat-item {
  padding: 16px 40px;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.stat-item:first-child { padding-left: 0; }
.stat-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: var(--accent); line-height: 1; margin-bottom: 6px; font-style: italic; }
.stat-label { font-size: 13px; color: var(--text3); font-weight: 300; letter-spacing: 0.03em; }
.reveal {
  opacity: 0;
  transform: translateY(36px);
  transition: opacity .75s ease, transform .75s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: .1s; }
.reveal-delay-2 { transition-delay: .2s; }
.reveal-delay-3 { transition-delay: .3s; }

@media (max-width: 1000px) {
  .stats-inner { grid-template-columns: 1fr 1fr; border: none; }
  .stat-item { border-right: none; }
}
</style>
