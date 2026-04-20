<template>
  <section class="hero">
    <canvas ref="canvas" id="hero-canvas"></canvas>
    <div class="hero-inner">
      <div class="hero-left">
        <div class="hero-kicker">
          <div class="hero-kicker-dot">🟡</div>
          {{ liveCount }} events happening in Kigali right now
        </div>
        <h1 class="hero-title">
          <span class="line">Where Every</span>
          <span class="line"><em>Moment</em></span>
          <span class="line">Becomes</span>
          <span class="line">Memory</span>
        </h1>
        <p class="hero-desc">
          Discover curated events across Rwanda, connect with your community,
          and manage unforgettable experiences — all from one elegant platform.
        </p>
        <div class="hero-search">
          <input v-model="searchQuery" type="text" placeholder="Search events, venues, or categories…" @keyup.enter="goSearch" />
          <RouterLink to="/app/events" class="btn btn-amber" style="padding:9px 22px;font-size:13px">Search</RouterLink>
        </div>
        <div class="hero-tags">
          <span v-for="tag in tags" :key="tag.label" class="hero-tag" @click="searchQuery = tag.label">
            {{ tag.emoji }} {{ tag.label }}
          </span>
        </div>
        <div class="hero-actions">
          <RouterLink to="/app/events" class="btn btn-amber btn-xl">Discover Events</RouterLink>
          <RouterLink to="/app/create" class="btn btn-outline-amber btn-lg">Host an Event →</RouterLink>
        </div>
        <div class="hero-proof">
          <div class="av-stack">
            <div v-for="av in avatars" :key="av.initials" class="mini-av" :style="{ background: av.color }">{{ av.initials }}</div>
          </div>
          <span>Trusted by <strong style="color:var(--ink)">3,400+</strong> members across 12 cities</span>
        </div>
      </div>
    </div>

    <!-- Floating event cards -->
    <div class="hero-float-cards">
      <div v-for="card in floatCards" :key="card.title" class="float-card">
        <div class="fc-emoji">{{ card.emoji }}</div>
        <div class="fc-cat">{{ card.category }}</div>
        <div class="fc-title">{{ card.title }}</div>
        <div class="fc-meta">
          <span>{{ card.date }}</span>
          <span class="fc-price" :style="card.free ? { color: '#0E8C6A' } : {}">{{ card.price }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const canvas = ref(null)
const searchQuery = ref('')
const liveCount = ref(3)

const tags = [
  { emoji: '🎷', label: 'Music & Art' },
  { emoji: '💻', label: 'Tech' },
  { emoji: '🍽️', label: 'Food & Drink' },
  { emoji: '⚽', label: 'Sports' },
  { emoji: '🤝', label: 'Community' },
  { emoji: '📚', label: 'Education' },
]

const avatars = [
  { initials: 'JM', color: '#F59E0B' },
  { initials: 'AU', color: '#B45309' },
  { initials: 'RE', color: '#92400E' },
  { initials: 'NK', color: '#D97706' },
]

const floatCards = [
  { emoji: '🎷', category: 'Music & Art', title: 'Kigali Jazz & Wine Evening', date: 'Apr 22 · 7:00 PM', price: 'RWF 15,000', free: false },
  { emoji: '💻', category: 'Tech', title: 'Tech Founders Meetup', date: 'Apr 24 · 5:30 PM', price: 'Free', free: true },
  { emoji: '🦍', category: 'Sports', title: 'Gorilla Conservation Run', date: 'Apr 27 · 6:30 AM', price: 'RWF 20,000', free: false },
]

function goSearch() {
  router.push({ path: '/app/events', query: { q: searchQuery.value } })
}

// ── Three.js Hero Background ──────────────────────────────────────────────────
let animId = null

function initThree() {
  if (!canvas.value) return
  // lazy-load three.js from CDN via a script tag approach
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
  script.onload = () => setupScene()
  document.head.appendChild(script)
}

function setupScene() {
  if (!window.THREE || !canvas.value) return
  const THREE = window.THREE
  const c = canvas.value
  const renderer = new THREE.WebGLRenderer({ canvas: c, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  const parent = c.parentElement
  let w = parent.clientWidth, h = parent.clientHeight
  renderer.setSize(w, h)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100)
  camera.position.z = 5.5

  scene.add(new THREE.AmbientLight(0xFFF8E7, 0.8))
  const pl = new THREE.PointLight(0xF59E0B, 3, 20)
  pl.position.set(4, 3, 4); scene.add(pl)
  const pl2 = new THREE.PointLight(0xFDE68A, 1.5, 15)
  pl2.position.set(-3, -2, 2); scene.add(pl2)

  const ambers = [0xF59E0B, 0xFBBF24, 0xFCD34D, 0xD97706, 0xB45309, 0xFDBA74]
  const geoTypes = [
    () => new THREE.IcosahedronGeometry(0.28 + Math.random() * 0.25, 0),
    () => new THREE.OctahedronGeometry(0.22 + Math.random() * 0.28, 0),
    () => new THREE.TetrahedronGeometry(0.26 + Math.random() * 0.24, 0),
  ]
  const shapes = []
  for (let i = 0; i < 14; i++) {
    const solid = Math.random() > 0.45
    const mat = new THREE.MeshPhongMaterial({
      color: ambers[i % ambers.length],
      transparent: true,
      opacity: solid ? 0.35 + Math.random() * 0.25 : 0.2 + Math.random() * 0.15,
      wireframe: !solid, shininess: 120,
      specular: new THREE.Color(0xFFF3C7)
    })
    const mesh = new THREE.Mesh(geoTypes[i % 3](), mat)
    const r = 6.5 + Math.random() * 3
    const theta = Math.random() * Math.PI * 2
    const phi = (Math.random() - 0.5) * Math.PI * 0.8
    mesh.position.set(r * Math.cos(theta) * Math.cos(phi), r * Math.sin(phi), Math.random() * 4 - 5)
    mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0)
    shapes.push({ mesh, rx: (Math.random() - 0.5) * 0.018, ry: (Math.random() - 0.5) * 0.014, floatAmp: 0.012 + Math.random() * 0.01, floatSpeed: 0.6 + Math.random() * 0.5, floatOffset: Math.random() * Math.PI * 2 })
    scene.add(mesh)
  }

  const pc = 280, pp = new Float32Array(pc * 3)
  for (let i = 0; i < pc; i++) { pp[i * 3] = (Math.random() - 0.5) * 22; pp[i * 3 + 1] = (Math.random() - 0.5) * 16; pp[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4 }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3))
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xFCD34D, size: 0.06, transparent: true, opacity: 0.55 })))

  const mouse = { x: 0, y: 0 }
  const onMouse = e => { mouse.x = (e.clientX / innerWidth - 0.5) * 1.8; mouse.y = -(e.clientY / innerHeight - 0.5) * 1.2 }
  window.addEventListener('mousemove', onMouse)

  let t = 0
  function animate() {
    animId = requestAnimationFrame(animate); t += 0.01
    shapes.forEach(s => {
      s.mesh.rotation.x += s.rx; s.mesh.rotation.y += s.ry
      s.mesh.position.y += Math.sin(t * s.floatSpeed + s.floatOffset) * s.floatAmp
    })
    camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.025
    camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.025
    camera.lookAt(scene.position)
    renderer.render(scene, camera)
  }
  animate()

  const onResize = () => {
    w = c.parentElement.clientWidth; h = c.parentElement.clientHeight
    renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', onResize)
}

onMounted(() => {
  // If Three.js already loaded (e.g. page revisit), just set up scene
  if (window.THREE) {
    setupScene()
  } else {
    initThree()
  }
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
.hero {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--cream);
  cursor: none;
}
#hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 6%;
  flex: 1;
  display: flex;
  align-items: center;
  padding-top: 72px;
}
.hero-left { flex: 1; max-width: 680px; }

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--amber-100);
  border: 1px solid var(--amber-200);
  border-radius: 99px;
  padding: 5px 14px 5px 8px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--amber-800);
  margin-bottom: 28px;
  opacity: 0;
  animation: fadeUp 0.8s 0.3s forwards;
}
.hero-kicker-dot {
  width: 22px; height: 22px;
  background: var(--amber-500);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px;
}

.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.2rem, 7vw, 6rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.035em;
  color: var(--ink);
  margin-bottom: 24px;
  opacity: 0;
  animation: fadeUp 0.9s 0.5s forwards;
}
.hero-title em { font-style: italic; color: var(--amber-600); }
.hero-title .line { display: block; }

.hero-desc {
  font-size: 1.05rem;
  color: var(--ink3);
  line-height: 1.75;
  max-width: 460px;
  font-weight: 300;
  margin-bottom: 38px;
  opacity: 0;
  animation: fadeUp 0.9s 0.7s forwards;
}

.hero-search {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid var(--amber-200);
  border-radius: 99px;
  padding: 6px 6px 6px 22px;
  box-shadow: 0 8px 40px rgba(180,130,0,0.1);
  margin-bottom: 20px;
  max-width: 520px;
  opacity: 0;
  animation: fadeUp 0.9s 0.85s forwards;
}
.hero-search input {
  flex: 1;
  border: none;
  outline: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  color: var(--ink);
  background: transparent;
  font-weight: 300;
}
.hero-search input::placeholder { color: var(--ink4); }

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  opacity: 0;
  animation: fadeUp 0.9s 1s forwards;
}
.hero-tag {
  padding: 5px 12px;
  border-radius: 99px;
  background: var(--cream2);
  border: 1px solid var(--border);
  font-size: 12px;
  color: var(--ink3);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 400;
}
.hero-tag:hover { background: var(--amber-100); border-color: var(--amber-300); color: var(--amber-800); }

.hero-actions {
  display: flex; gap: 12px; flex-wrap: wrap;
  margin-top: 32px;
  opacity: 0;
  animation: fadeUp 0.9s 1.1s forwards;
}
.hero-proof {
  display: flex; align-items: center; gap: 10px;
  margin-top: 20px;
  font-size: 13px; color: var(--ink3); font-weight: 300;
  opacity: 0;
  animation: fadeUp 0.9s 1.2s forwards;
}
.av-stack { display: flex; }
.mini-av {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; color: #fff;
  margin-right: -7px;
  font-family: 'Cormorant Garamond', serif;
}

/* Floating cards */
.hero-float-cards {
  position: absolute;
  right: 6%; top: 50%;
  transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 14px;
  z-index: 2;
  opacity: 0;
  animation: fadeLeft 1s 1.3s forwards;
}
.float-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 18px;
  width: 230px;
  box-shadow: var(--shadow);
  transition: all 0.3s;
  cursor: pointer;
  border-left: 3px solid var(--amber-400);
}
.float-card:hover { transform: translateX(-6px); box-shadow: var(--shadow-lg); }
.fc-emoji { font-size: 1.4rem; margin-bottom: 6px; }
.fc-cat { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--ink4); font-weight: 600; margin-bottom: 3px; }
.fc-title { font-family: 'Cormorant Garamond', serif; font-size: .95rem; font-weight: 700; color: var(--ink); margin-bottom: 5px; line-height: 1.2; }
.fc-meta { font-size: 11px; color: var(--ink3); display: flex; justify-content: space-between; align-items: center; }
.fc-price { font-weight: 600; color: var(--amber-700); font-size: 11px; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeLeft { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }

@media (max-width: 1000px) { .hero-float-cards { display: none; } }
</style>
