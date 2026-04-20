<template>
  <section id="pricing" class="pricing-section">
    <div class="section-inner">
      <div style="text-align:center">
        <div class="eyebrow reveal">Simple Pricing</div>
        <h2 class="section-heading reveal">Choose the plan that fits your <em>experience</em></h2>
      </div>
      <div class="pricing-grid">
        <div v-for="(plan, i) in plans" :key="plan.name" class="price-card reveal" :class="{ featured: plan.featured, [`reveal-delay-${i}`]: true }">
          <div v-if="plan.featured" class="price-badge">Most Popular</div>
          <h3 class="plan-name">{{ plan.name }}</h3>
          <div class="plan-price">
            <span class="currency">RWF</span>
            <span class="amount">{{ plan.price }}</span>
            <span class="period">/mo</span>
          </div>
          <p class="plan-desc">{{ plan.desc }}</p>
          <ul class="plan-features">
            <li v-for="feat in plan.features" :key="feat">
              <span class="check">✓</span> {{ feat }}
            </li>
          </ul>
          <RouterLink :to="plan.link" :class="['btn btn-lg truncate', plan.featured ? 'btn-amber' : 'btn-ghost']">
            {{ plan.cta }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const plans = [
  {
    name: 'Discovery',
    price: '0',
    desc: 'For individuals looking to explore and attend events around Rwanda.',
    features: [
      'Unlimited event browsing',
      'Digital ticket storage',
      'AI-powered recommendations',
      'Standard customer support'
    ],
    cta: 'Join for free',
    link: '/auth',
    featured: false
  },
  {
    name: 'Organizer',
    price: '15,000',
    desc: 'Perfect for local organizers hosting recurring events and meetups.',
    features: [
      'Basic AI Copilot access',
      'Real-time ticket tracking',
      'Attendee messaging (100/mo)',
      'Custom venue mapping',
      'Lower booking fees'
    ],
    cta: 'Start 14-day trial',
    link: '/auth',
    featured: true
  },
  {
    name: 'Enterprise',
    price: '45,000',
    desc: 'For large-scale agencies and venues requiring full control and data.',
    features: [
      'Full AI Copilot power',
      'Advanced predictive analytics',
      'Unlimited attendee messaging',
      'Priority 24/7 support',
      'Custom branding options',
      'API access'
    ],
    cta: 'Contact sales',
    link: '/auth',
    featured: false
  }
]
</script>

<style scoped>
section { padding: 96px 6%; }
.section-inner { max-width: 1320px; margin: 0 auto; }
.eyebrow { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--amber-600); margin-bottom: 14px; }
.section-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4.5vw, 3.6rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; color: var(--ink); margin-bottom: 48px; text-align: center; }
.section-heading em { font-style: italic; color: var(--amber-600); }

.pricing-section { background: var(--cream); }
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 24px; }

.price-card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 40px; position: relative; display: flex; flex-direction: column; transition: all .3s; }
.price-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }
.price-card.featured { border: 2px solid var(--amber-400); box-shadow: var(--shadow); }

.price-badge { position: absolute; top: 0; left: 50%; transform: translate(-50%, -50%); background: var(--amber-500); color: #fff; padding: 4px 14px; border-radius: 99px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }

.plan-name { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: var(--ink); margin-bottom: 12px; }
.plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 16px; }
.plan-price .currency { font-size: 0.9rem; color: var(--ink3); font-weight: 500; }
.plan-price .amount { font-size: 2.5rem; font-weight: 700; color: var(--ink); font-family: 'Cormorant Garamond', serif; }
.plan-price .period { font-size: 0.9rem; color: var(--ink3); }

.plan-desc { font-size: 0.9rem; color: var(--ink3); line-height: 1.6; margin-bottom: 24px; min-height: 3.2rem; }

.plan-features { list-style: none; padding: 0; margin: 0 0 32px 0; flex: 1; }
.plan-features li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: var(--ink2); margin-bottom: 12px; line-height: 1.4; }
.plan-features li .check { color: var(--amber-500); font-weight: 700; }

.btn { width: 100%; justify-content: center; }

.reveal { opacity: 0; transform: translateY(36px); transition: opacity .75s ease, transform .75s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: .15s; }
.reveal-delay-2 { transition-delay: .3s; }

@media (max-width: 1000px) {
  .pricing-grid { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; gap: 40px; }
}
</style>
