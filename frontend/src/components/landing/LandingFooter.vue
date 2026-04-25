<template>
  <footer>
    <div class="footer-inner">
      <div class="footer-top">
        <div>
          <div class="footer-logo"><div class="footer-logo-mark"><i class="ph-bold ph-map-pin" style="color:#fff;font-size:15px"></i></div><span class="footer-logo-name">EventLocal</span></div>
          <p class="footer-desc">Rwanda's premier event discovery and management platform. Connecting communities, one unforgettable experience at a time.</p>
        </div>
        <div>
          <div class="footer-col-title">Platform</div>
          <div class="footer-links">
            <RouterLink to="/app/events">Browse Events</RouterLink>
            <RouterLink to="/app/create">Create Event</RouterLink>
            <RouterLink to="/app/analytics">Analytics</RouterLink>
            <a href="#">Mobile App</a>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Company</div>
          <div class="footer-links">
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="#">Press Kit</a>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Legal</div>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 EventLocal · Built in Rwanda with <i class="ph ph-heart" style="color:var(--accent)"></i></span>
        <div class="social-links">
          <a class="social-link" href="#">𝕏</a>
          <a class="social-link" href="#">in</a>
          <a class="social-link" href="#">f</a>
          <a class="social-link" href="#">📸</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer { background: var(--bg); padding: 72px 6% 32px; border-top: 1px solid var(--border); }
.footer-inner { max-width: 1320px; margin: 0 auto; }
.footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; padding-bottom: 48px; border-bottom: 1px solid var(--border); }
.footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.footer-logo-mark { width: 36px; height: 36px; background: var(--accent); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.footer-logo-name { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 1.2rem; color: var(--text); }
.footer-desc { font-size: 13px; color: var(--text3); line-height: 1.75; font-weight: 300; max-width: 270px; }
.footer-col-title { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; color: var(--text3); margin-bottom: 16px; }
.footer-links { display: flex; flex-direction: column; gap: 9px; }
.footer-links :deep(a) { font-size: 13px; color: var(--text3); text-decoration: none; transition: color .2s; font-weight: 300; }
.footer-links :deep(a):hover { color: var(--accent); }
.footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 24px; font-size: 12px; color: var(--text3); }
.social-links { display: flex; gap: 8px; }
.social-link { width: 34px; height: 34px; border: 1px solid var(--border2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text3); cursor: pointer; transition: all .2s; font-size: 13px; text-decoration: none; }
.social-link:hover { border-color: var(--accent); color: var(--accent); }

@media (max-width: 1000px) {
  .footer-top { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .footer-top { grid-template-columns: 1fr; }
}
</style>
