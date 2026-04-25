<template>
  <div class="toast-stack">
    <div v-for="t in toasts" :key="t.id" class="toast">
      <div class="toast-icon">
        <i :class="toastIcon(t.icon)"></i>
      </div>
      <span class="toast-msg">{{ t.message }}</span>
      <button class="toast-close" @click="dismiss(t.id)">
        <i class="ph ph-x"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toasts, dismiss } = useToast()

function toastIcon(icon) {
  const map = {
    '✅': 'ph ph-check-circle',
    '⚠️': 'ph ph-warning',
    '🎟️': 'ph ph-ticket',
    '⭐': 'ph ph-star',
    '🗑️': 'ph ph-trash',
    '📍': 'ph ph-map-pin',
    '🎉': 'ph ph-confetti',
    '👤': 'ph ph-user-circle',
    '🏷️': 'ph ph-tag',
    '✓':  'ph ph-check-circle',
  }
  return map[icon] || 'ph ph-info'
}
</script>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
}

.toast {
  background: var(--surface2);
  color: var(--ink);
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  font-size: 13.5px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  animation: toastIn .3s ease;
  max-width: 340px;
  border: 1px solid var(--border2);
  border-left: 3px solid var(--a500);
}

@keyframes toastIn {
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

.toast-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--accent-l);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: var(--accent);
  flex-shrink: 0;
}

.toast-msg { flex: 1; font-weight: 400; color: var(--ink2); line-height: 1.4; }

.toast-close {
  background: none;
  border: none;
  color: var(--ink4);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 4px;
  transition: color .15s;
  flex-shrink: 0;
}
.toast-close:hover { color: var(--ink); }
</style>
