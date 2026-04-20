<template>
  <div class="not-found">
    <div class="content">
      <div class="emoji">🗓️</div>
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="btn-primary">Go Home</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}
.content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.emoji { font-size: 64px; }
h1 { font-size: 80px; font-weight: 700; color: var(--blue); line-height: 1; }
h2 { font-size: 22px; font-weight: 700; }
p { color: var(--muted); font-size: 14px; max-width: 320px; }
</style>
