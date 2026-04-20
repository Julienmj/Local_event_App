<template>
  <section id="features" class="features-section">
    <div class="section-inner">
      <div class="reveal"><div class="eyebrow">Why EventLocal</div></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px">
        <h2 class="section-heading reveal">Everything you need<br/>to <em>discover & host</em></h2>
        <RouterLink to="/auth" class="btn btn-amber reveal">Start free →</RouterLink>
      </div>
      <div class="features-grid">
        <div v-for="(feat, i) in features" :key="feat.title" class="feat-card reveal" :class="feat.delay ? `reveal-delay-${feat.delay}` : ''">
          <div class="feat-icon">{{ feat.icon }}</div>
          <h3 class="feat-title">{{ feat.title }}</h3>
          <p class="feat-desc">{{ feat.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  { icon: '🔍', title: 'Smart Discovery', desc: "AI-powered recommendations based on your location, interests and attendance history. Find events you'll actually love." },
  { icon: '🎟️', title: 'Seamless Registration', desc: 'One-click sign-up with mobile money, VISA, and instant digital ticket delivery. Frictionless from discovery to door.', delay: 1 },
  { icon: '🗺️', title: 'Interactive Maps', desc: 'Explore venues near you with live maps showing distances, transport options and neighborhood context.', delay: 2 },
  { icon: '🤖', title: 'AI Copilot', desc: 'Your personal event-planning assistant drafts agendas, budgets, marketing copy, and predicts attendance in seconds.' },
  { icon: '📊', title: 'Real-time Analytics', desc: 'Live dashboards track ticket sales, attendee demographics, revenue trends and satisfaction scores as events unfold.', delay: 1 },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Personalized alerts for events you care about — reminders, updates and post-event feedback requests, timed perfectly.', delay: 2 }
]
</script>

<style scoped>
section { padding: 96px 6%; }
.section-inner { max-width: 1320px; margin: 0 auto; }
.eyebrow { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--amber-600); margin-bottom: 14px; }
.section-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4.5vw, 3.6rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; color: var(--ink); margin-bottom: 18px; }
.section-heading em { font-style: italic; color: var(--amber-600); }

.features-section { background: var(--cream2); }
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 56px;
}
.feat-card {
  background: var(--surface);
  border-radius: var(--radius-xl);
  padding: 32px;
  border: 1px solid var(--border);
  transition: all .3s;
  position: relative;
  overflow: hidden;
  cursor: none;
}
.feat-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--amber-400), var(--amber-200));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .4s;
}
.feat-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
.feat-card:hover::after { transform: scaleX(1); }
.feat-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: var(--amber-100);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem;
  margin-bottom: 20px;
  transition: transform .3s;
}
.feat-card:hover .feat-icon { transform: scale(1.1) rotate(-5deg); }
.feat-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}
.feat-desc { font-size: .875rem; color: var(--ink3); line-height: 1.7; font-weight: 300; }

.reveal { opacity: 0; transform: translateY(36px); transition: opacity .75s ease, transform .75s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: .1s; }
.reveal-delay-2 { transition-delay: .2s; }

@media (max-width: 1000px) {
  .features-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .features-grid { grid-template-columns: 1fr; }
}
</style>
