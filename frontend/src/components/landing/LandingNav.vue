<template>
  <nav :class="{ scrolled: scrolled }">
    <div class="nav-inner">
      <a class="nav-logo" href="#">
        <div class="nav-logo-icon">📍</div>
        <span class="nav-logo-name">EventLocal</span>
      </a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#events">Events</a>
        <a href="#how">How it works</a>
        <a href="#ai">AI Copilot</a>
        <a href="#pricing">Pricing</a>
      </div>
      <div class="nav-cta">
        <RouterLink to="/auth" class="btn btn-ghost">Sign in</RouterLink>
        <RouterLink to="/auth" class="btn btn-amber">Get started</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({ scrolled: Boolean })
</script>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 6%;
  transition: background 0.3s, border-color 0.3s;
}
.nav-inner {
  max-width: 1320px;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
}
.nav-logo-icon {
  width: 40px;
  height: 40px;
  background: var(--amber-500);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  transition: transform 0.3s;
}
.nav-logo-icon:hover { transform: rotate(-8deg) scale(1.05); }
.nav-logo-name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--ink);
  letter-spacing: -0.02em;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 36px;
}
.nav-links a {
  padding: 7px 15px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 400;
  color: var(--ink2);
  text-decoration: none;
  transition: all 0.2s;
  letter-spacing: 0.01em;
}
.nav-links a:hover {
  background: var(--amber-100);
  color: var(--amber-800);
}
.nav-cta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}
nav.scrolled {
  background: rgba(255, 253, 245, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
@media (max-width: 1000px) {
  .nav-links { display: none; }
}
</style>
