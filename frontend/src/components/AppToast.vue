<template>
  <div class="toast-stack">
    <div v-for="t in toasts" :key="t.id" class="toast">
      <span>{{ t.icon }}</span>
      <span>{{ t.message }}</span>
      <button class="toast-close" @click="dismiss(t.id)">×</button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toasts, dismiss } = useToast()
</script>
