<template>
  <div class="content-with-aside">
    <div class="content-main">
      <div class="page-header">
        <h1 class="page-title">Analytics</h1>
        <p class="page-sub">Performance overview for your events</p>
      </div>

      <!-- Attendance bar chart -->
      <div class="chart-card">
        <div class="chart-title">Monthly Attendance</div>
        <div class="chart-sub">Attendees across all events this year</div>
        <div class="bar-chart">
          <div v-for="(bar, i) in barData" :key="i" class="bar-wrap">
            <div class="bar" :style="{ height: bar.pct + '%' }"></div>
            <div class="bar-lbl">{{ bar.label }}</div>
          </div>
        </div>
      </div>

      <!-- Category breakdown -->
      <div class="chart-card">
        <div class="chart-title">Attendance by Category</div>
        <div class="chart-sub">Distribution across event types</div>
        <div class="progress-list">
          <div v-for="cat in categoryBreakdown" :key="cat.name" class="prog-row">
            <div class="prog-header">
              <span>{{ cat.icon }} {{ cat.name }}</span>
              <span class="prog-pct">{{ cat.pct }}%</span>
            </div>
            <div class="prog-track">
              <div class="prog-fill" :style="{ width: cat.pct + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <aside class="aside-panel">
      <AiCopilot />
    </aside>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEventsStore } from '@/stores/events'
import AiCopilot from '@/components/AiCopilot.vue'

const eventsStore = useEventsStore()

const barData = [
  { label: 'Jan', pct: 40 }, { label: 'Feb', pct: 55 }, { label: 'Mar', pct: 70 },
  { label: 'Apr', pct: 90 }, { label: 'May', pct: 65 }, { label: 'Jun', pct: 80 },
]

const categoryBreakdown = computed(() => {
  if (eventsStore.stats?.categoryBreakdown) {
    return eventsStore.stats.categoryBreakdown.map(c => ({
      name: c.categoryName,
      icon: eventsStore.categories.find(cat => cat.name === c.categoryName)?.icon || '🎉',
      pct: c.percentage
    }))
  }
  const total = eventsStore.events.reduce((s, e) => s + (e.attendeesCount || 0), 0) || 1
  const grouped = {}
  eventsStore.events.forEach(e => {
    const catName = e.category?.name || e.categoryName || 'Other'
    if (!grouped[catName]) grouped[catName] = { count: 0, icon: e.emoji || '🎉' }
    grouped[catName].count += e.attendeesCount || 0
  })
  return Object.entries(grouped).map(([name, v]) => ({
    name, icon: v.icon, pct: Math.round((v.count / total) * 100)
  })).sort((a, b) => b.pct - a.pct)
})
</script>

<style scoped>
.content-with-aside { display: flex; flex: 1; overflow: hidden; }
.content-main { flex: 1; overflow-y: auto; padding: 28px 30px; }
.aside-panel { width: 300px; border-left: 1px solid var(--border); background: var(--surface); overflow-y: auto; padding: 20px 18px; flex-shrink: 0; }
.page-header { margin-bottom: 26px; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.page-sub { font-size: 13px; color: var(--ink3); font-weight: 300; }
.chart-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 20px; margin-bottom: 18px; }
.chart-title { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
.chart-sub { font-size: 11.5px; color: var(--ink3); margin-bottom: 16px; font-weight: 300; }
.bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 140px; padding-top: 10px; }
.bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; }
.bar { width: 100%; background: linear-gradient(to top, var(--a500), var(--a300)); border-radius: 4px 4px 0 0; transition: height .6s ease; }
.bar-lbl { font-size: 9px; color: var(--ink4); }
.progress-list { display: flex; flex-direction: column; gap: 10px; }
.prog-row { display: flex; flex-direction: column; gap: 3px; }
.prog-header { display: flex; justify-content: space-between; font-size: 12px; color: var(--ink2); }
.prog-pct { color: var(--ink3); font-size: 11px; }
.prog-track { height: 5px; background: var(--cream2); border-radius: 99px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--a500), var(--a300)); transition: width .8s ease; }
</style>
