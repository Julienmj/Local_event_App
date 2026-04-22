<template>
  <section class="cta-section">
    <div class="cta-inner">
      <div class="eyebrow reveal" style="color:rgba(255,255,255,.6)">Ready to begin?</div>
      <h2 class="cta-title reveal">Your next great<br/>experience awaits</h2>
      <p class="cta-desc reveal">Join thousands of Rwandans already discovering amazing events, building connections, and creating lasting memories.</p>
      <div class="cta-btns reveal">
        <RouterLink to="/auth" class="btn btn-ink btn-xl">Get Started Free</RouterLink>
        <RouterLink to="/app/create" class="btn btn-outline-amber btn-lg" style="color:#fff;border-color:rgba(255,255,255,.4)">Host an Event</RouterLink>
      </div>
      <div class="cta-note reveal">No credit card · Free forever plan · Cancel anytime</div>
    </div>
  </section>
</template>

<style scoped>
section { padding: 96px 6%; }
.eyebrow { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--amber-600); margin-bottom: 14px; }

.cta-section { background: var(--amber-500); padding: 100px 6%; text-align: center; position: relative; overflow: hidden; }
.cta-section::before { content: ''; position: absolute; top: -120px; left: -120px; width: 500px; height: 500px; background: var(--amber-400); border-radius: 50%; opacity: .3; }
.cta-section::after { content: ''; position: absolute; bottom: -80px; right: -80px; width: 380px; height: 380px; background: var(--amber-600); border-radius: 50%; opacity: .25; }
.cta-inner { position: relative; z-index: 1; }
.cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; color: #fff; letter-spacing: -0.035em; line-height: 1; margin-bottom: 18px; font-style: italic; }
.cta-desc { font-size: 1.05rem; color: rgba(255,255,255,.75); font-weight: 300; max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }
.cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.cta-note { font-size: 12px; color: rgba(255,255,255,.5); margin-top: 14px; font-weight: 300; }

.reveal { opacity: 0; transform: translateY(36px); transition: opacity .75s ease, transform .75s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
</style>
