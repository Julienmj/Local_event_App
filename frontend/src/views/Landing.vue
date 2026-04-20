<template>
  <div id="landing-root">
    <!-- Custom Cursor -->
    <div class="cursor" ref="cursorEl"></div>
    <div class="cursor-ring" ref="ringEl"></div>

    <LandingNav :scrolled="scrolled" />
    <LandingHero @mounted="initCursor" />
    <LandingTicker />
    <LandingStats />
    <LandingFeatures />
    <LandingShowcase />
    <LandingHowItWorks />
    <LandingAICopilot />
    <LandingTestimonials />
    <LandingPricing />
    <LandingCTA />
    <LandingFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import LandingNav from '@/components/landing/LandingNav.vue'
import LandingHero from '@/components/landing/LandingHero.vue'
import LandingTicker from '@/components/landing/LandingTicker.vue'
import LandingStats from '@/components/landing/LandingStats.vue'
import LandingFeatures from '@/components/landing/LandingFeatures.vue'
import LandingShowcase from '@/components/landing/LandingShowcase.vue'
import LandingHowItWorks from '@/components/landing/LandingHowItWorks.vue'
import LandingAICopilot from '@/components/landing/LandingAICopilot.vue'
import LandingTestimonials from '@/components/landing/LandingTestimonials.vue'
import LandingPricing from '@/components/landing/LandingPricing.vue'
import LandingCTA from '@/components/landing/LandingCTA.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'

const scrolled = ref(false)
const cursorEl = ref(null)
const ringEl = ref(null)

function onScroll() {
  scrolled.value = window.scrollY > 60
}

function onMouseMove(e) {
  if (cursorEl.value) {
    cursorEl.value.style.left = e.clientX + 'px'
    cursorEl.value.style.top = e.clientY + 'px'
  }
  if (ringEl.value) {
    // Smooth lag effect for the ring
    gsap.to(ringEl.value, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
    })
  }
}

function initCursor() {
  const targets = document.querySelectorAll('a, button, .feat-card, .tcard, .float-card, .sc-card, .price-card, .hero-tag')
  targets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!cursorEl.value || !ringEl.value) return
      cursorEl.value.style.width = '14px'
      cursorEl.value.style.height = '14px'
      cursorEl.value.style.background = 'var(--amber-600)'
      ringEl.value.style.width = '50px'
      ringEl.value.style.height = '50px'
      ringEl.value.style.borderColor = 'var(--amber-500)'
      ringEl.value.style.opacity = '1'
    })
    el.addEventListener('mouseleave', () => {
      if (!cursorEl.value || !ringEl.value) return
      cursorEl.value.style.width = '8px'
      cursorEl.value.style.height = '8px'
      cursorEl.value.style.background = 'var(--amber-500)'
      ringEl.value.style.width = '36px'
      ringEl.value.style.height = '36px'
      ringEl.value.style.borderColor = 'var(--amber-400)'
      ringEl.value.style.opacity = '0.6'
    })
  })
}

// GSAP Scroll Reveals
function initReveals() {
    if (!window.gsap) {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
        s.onload = () => {
            const st = document.createElement('script')
            st.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
            st.onload = setupGsap
            document.head.appendChild(st)
        }
        document.head.appendChild(s)
    } else {
        setupGsap()
    }
}

function setupGsap() {
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    // Standard reveals
    document.querySelectorAll('.reveal').forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 32 },
            {
                opacity: 1, 
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        )
    })

    // Side reveals
    document.querySelectorAll('.reveal-left').forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, x: -40 },
            {
                opacity: 1, 
                x: 0,
                duration: 0.9,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        )
    })

    document.querySelectorAll('.reveal-right').forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, x: 40 },
            {
                opacity: 1, 
                x: 0,
                duration: 0.9,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        )
    })
}

onMounted(async () => {
  window.addEventListener('scroll', onScroll)
  document.addEventListener('mousemove', onMouseMove)
  
  await nextTick()
  initCursor()
  initReveals()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('mousemove', onMouseMove)
})
</script>

<style scoped>
#landing-root {
  overflow-x: hidden;
  background: var(--cream);
  cursor: none !important; /* Hide default cursor for landing */
  --amber-400: #fbbf24;
  --amber-500: #f59e0b;
  --amber-600: #d97706;
}

/* Ensure global scope for cursor but scoped to this page */
:deep(*) {
    cursor: none !important;
}

.cursor {
  position: fixed;
  width: 8px;
  height: 8px;
  background: var(--amber-500);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1), height 0.3s cubic-bezier(0.23, 1, 0.32, 1), background 0.3s;
}

.cursor-ring {
  position: fixed;
  width: 36px;
  height: 36px;
  border: 1px solid var(--amber-500);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  transform: translate(-50%, -50%);
  transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1), height 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s;
  opacity: 1;
}

/* Fallback for reveal if GSAP fails/loading */
.reveal, .reveal-left, .reveal-right {
    opacity: 0;
}
</style>
