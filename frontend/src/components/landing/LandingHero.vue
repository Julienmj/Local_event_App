<template>
  <section class="hero">
    <canvas ref="canvas" id="hero-canvas"></canvas>
    <div class="hero-inner">
      <div class="hero-left">
        <div class="hero-kicker">
          <div class="hero-kicker-dot"><i class="ph ph-map-pin" style="font-size:10px;color:#fff"></i></div>
          {{ liveCount }} events happening in Kigali right now
        </div>
        <h1 class="hero-title">
          <span class="line">Where Every</span>
          <span class="line"><em>Moment</em></span>
          <span class="line">Becomes Memory</span>
        </h1>
        <p class="hero-desc">
          Discover curated events across Rwanda, connect with your community,
          and manage unforgettable experiences — all from one platform.
        </p>
        <div class="hero-actions">
          <RouterLink to="/auth" class="btn btn-amber btn-xl">
            <i class="ph ph-calendar-blank"></i> Discover Events
          </RouterLink>
          <RouterLink to="/auth" class="btn btn-ghost btn-lg">
            <i class="ph ph-plus"></i> Host an Event
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
const liveCount = ref(3)
let animId = null

function initThree() {
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
  script.onload = setupScene
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
    const mat = new THREE.MeshPhongMaterial({ color: ambers[i % ambers.length], transparent: true, opacity: solid ? 0.35 + Math.random() * 0.25 : 0.2 + Math.random() * 0.15, wireframe: !solid, shininess: 120, specular: new THREE.Color(0xFFF3C7) })
    const mesh = new THREE.Mesh(geoTypes[i % 3](), mat)
    const r = 6.5 + Math.random() * 3, theta = Math.random() * Math.PI * 2, phi = (Math.random() - 0.5) * Math.PI * 0.8
    mesh.position.set(r * Math.cos(theta) * Math.cos(phi), r * Math.sin(phi), Math.random() * 4 - 5)
    mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0)
    shapes.push({ mesh, rx: (Math.random() - 0.5) * 0.018, ry: (Math.random() - 0.5) * 0.014, floatAmp: 0.012 + Math.random() * 0.01, floatSpeed: 0.6 + Math.random() * 0.5, floatOffset: Math.random() * Math.PI * 2 })
    scene.add(mesh)
  }
  const pc = 280, pp = new Float32Array(pc * 3)
  for (let i = 0; i < pc; i++) { pp[i*3] = (Math.random()-0.5)*22; pp[i*3+1] = (Math.random()-0.5)*16; pp[i*3+2] = (Math.random()-0.5)*10-4 }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3))
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xFCD34D, size: 0.06, transparent: true, opacity: 0.55 })))
  const mouse = { x: 0, y: 0 }
  window.addEventListener('mousemove', e => { mouse.x = (e.clientX/innerWidth-0.5)*1.8; mouse.y = -(e.clientY/innerHeight-0.5)*1.2 })
  let t = 0
  function animate() {
    animId = requestAnimationFrame(animate); t += 0.01
    shapes.forEach(s => { s.mesh.rotation.x += s.rx; s.mesh.rotation.y += s.ry; s.mesh.position.y += Math.sin(t*s.floatSpeed+s.floatOffset)*s.floatAmp })
    camera.position.x += (mouse.x*0.4 - camera.position.x)*0.025
    camera.position.y += (mouse.y*0.25 - camera.position.y)*0.025
    camera.lookAt(scene.position)
    renderer.render(scene, camera)
  }
  animate()
  window.addEventListener('resize', () => { w = c.parentElement.clientWidth; h = c.parentElement.clientHeight; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix() })
}

onMounted(() => { window.THREE ? setupScene() : initThree() })
onUnmounted(() => { if (animId) cancelAnimationFrame(animId) })
</script>

<style scoped>
.hero { min-height: 100vh; position: relative; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); cursor: none; }
#hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero-inner { position: relative; z-index: 2; max-width: 1320px; margin: 0 auto; padding: 0 6%; flex: 1; display: flex; align-items: center; padding-top: 72px; }
.hero-left { flex: 1; max-width: 680px; }

.hero-kicker { display: inline-flex; align-items: center; gap: 8px; background: var(--accent-l); border: 1px solid rgba(245,158,11,0.25); border-radius: 99px; padding: 5px 14px 5px 8px; font-size: 12.5px; font-weight: 500; color: var(--accent); margin-bottom: 28px; opacity: 0; animation: fadeUp 0.8s 0.3s forwards; }
.hero-kicker-dot { width: 22px; height: 22px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; }

.hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(3.2rem, 7vw, 6rem); font-weight: 700; line-height: 0.95; letter-spacing: -0.035em; color: var(--text); margin-bottom: 24px; opacity: 0; animation: fadeUp 0.9s 0.5s forwards; }
.hero-title em { font-style: italic; color: var(--accent); }
.hero-title .line { display: block; }

.hero-desc { font-size: 1.05rem; color: var(--text2); line-height: 1.75; max-width: 460px; font-weight: 300; margin-bottom: 38px; opacity: 0; animation: fadeUp 0.9s 0.7s forwards; }

.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 32px; opacity: 0; animation: fadeUp 0.9s 0.85s forwards; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeLeft { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }

@media (max-width: 1000px) { .hero-float-cards { display: none; } }
</style>
