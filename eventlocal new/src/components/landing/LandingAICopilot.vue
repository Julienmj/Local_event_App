<template>
  <section id="ai" class="ai-section">
    <div class="ai-inner">
      <div class="ai-left reveal-left">
        <div class="eyebrow">Organizer superpower</div>
        <h2 class="section-heading">Your AI Event<br/><em>Planning Copilot</em></h2>
        <p class="section-sub">From blank page to fully-planned event in minutes. Draft agendas, forecast attendance, optimise pricing and write marketing copy — all with natural language.</p>
        <div class="ai-features">
          <div v-for="feat in aiFeatures" :key="feat.title" class="ai-feat">
            <div class="ai-feat-icon">{{ feat.icon }}</div>
            <div>
              <div class="ai-feat-title">{{ feat.title }}</div>
              <div class="ai-feat-desc">{{ feat.desc }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ai-mockup reveal-right">
        <div style="font-size:12px;color:rgba(255,255,255,.3);margin-bottom:14px;font-weight:500;letter-spacing:.05em;text-transform:uppercase">EventLocal AI Copilot</div>
        <div class="ai-chat" ref="chatRef">
          <div v-for="(msg, i) in messages" :key="i" :class="['ai-msg', msg.role]">
            <div v-html="msg.text"></div>
          </div>
        </div>
        <div class="ai-input-row">
          <input 
            v-model="inputMsg" 
            class="ai-input" 
            type="text" 
            placeholder="Ask anything about your event…"
            @keyup.enter="sendMessage"
          />
          <button class="ai-send" @click="sendMessage">→</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const inputMsg = ref('')
const chatRef = ref(null)

const aiFeatures = [
  { icon: '📋', title: 'Agenda & Timeline Generator', desc: 'Describe your event and get a structured schedule with speaker slots, breaks and logistics.' },
  { icon: '📈', title: 'Predictive Attendance AI', desc: 'Forecasts ticket sales, no-shows and revenue based on historical data and event variables.' },
  { icon: '💰', title: 'Dynamic Pricing Advisor', desc: 'Suggests optimal ticket prices and promotional timing to maximise revenue and fill rates.' },
  { icon: '✍️', title: 'Marketing Copy Writer', desc: 'Generates compelling event descriptions, social posts, and email campaigns on demand.' }
]

const messages = ref([
  { role: 'user', text: 'Help me plan a 200-person tech conference for 3 days in Kigali. Budget: RWF 5M' },
  { 
    role: 'bot', 
    text: `<strong>Day 1 — Arrive & Connect</strong><br/>
           08:00 Registration & networking breakfast<br/>
           09:30 Opening keynote: Rwanda Tech 2026<br/>
           11:00 Track splits: AI / Fintech / CleanTech<br/>
           18:00 Welcome cocktail, Inzora Rooftop<br/><br/>
           <strong>Budget Forecast</strong><br/>
           Venue: RWF 800K · Catering: RWF 1.2M<br/>
           Speakers: RWF 600K · Marketing: RWF 400K<br/>
           📊 Predicted attendance: 186/200 (93%)`
  }
])

function sendMessage() {
  if (!inputMsg.value.trim()) return
  
  messages.value.push({ role: 'user', text: inputMsg.value })
  const userText = inputMsg.value
  inputMsg.value = ''
  
  // Simulate AI Thinking
  setTimeout(() => {
    messages.value.push({ 
      role: 'bot', 
      text: `I'm analyzing your request for "${userText}". I can help you draft a full logistical plan, speaker list, and marketing strategy for this event in seconds.`
    })
    
    // Scroll to bottom
    setTimeout(() => {
      if (chatRef.value) {
        chatRef.value.scrollTop = chatRef.value.scrollHeight
      }
    }, 100)
  }, 1000)
}
</script>

<style scoped>
section { padding: 96px 6%; }
.eyebrow { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--amber-600); margin-bottom: 14px; }
.section-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4.5vw, 3.6rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; color: var(--ink); margin-bottom: 18px; }
.section-heading em { font-style: italic; color: var(--amber-600); }
.section-sub { font-size: 1rem; color: var(--ink3); max-width: 500px; line-height: 1.75; font-weight: 300; }

.ai-section { background: linear-gradient(135deg, var(--amber-900) 0%, var(--ink) 60%); padding: 96px 6%; position: relative; overflow: hidden; }
.ai-section::before { content: ''; position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; background: var(--amber-500); border-radius: 50%; opacity: .06; filter: blur(60px); }
.ai-inner { max-width: 1320px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }

.ai-left .eyebrow { color: var(--amber-400); }
.ai-left .section-heading { color: #fff; }
.ai-left .section-sub { color: rgba(255,255,255, .45); }

.ai-features { margin-top: 36px; display: flex; flex-direction: column; gap: 16px; }
.ai-feat { display: flex; align-items: flex-start; gap: 14px; padding: 16px; background: rgba(255,255,255, .04); border: 1px solid rgba(255,255,255,.06); border-radius: var(--radius-lg); transition: background .3s; }
.ai-feat:hover { background: rgba(255,255,255, .07); }
.ai-feat-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(245,158,11, .15); border: 1px solid rgba(245,158,11, .2); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
.ai-feat-title { font-family: 'Cormorant Garamond', serif; font-weight: 700; color: #fff; font-size: .95rem; margin-bottom: 3px; letter-spacing: -0.01em; }
.ai-feat-desc { font-size: 12.5px; color: rgba(255,255,255,.35); font-weight: 300; line-height: 1.6; }

.ai-mockup { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255, .1); border-radius: var(--radius-xl); padding: 24px; backdrop-filter: blur(8px); }
.ai-chat { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; max-height: 300px; overflow-y: auto; padding-right: 4px; }
.ai-chat::-webkit-scrollbar { width: 3px; }
.ai-chat::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }

.ai-msg { padding: 12px 16px; border-radius: var(--radius-lg); font-size: 13px; line-height: 1.65; font-weight: 300; }
.ai-msg.user { background: var(--amber-600); color: #fff; border-radius: var(--radius-lg) var(--radius-lg) 4px var(--radius-lg); align-self: flex-end; max-width: 80%; }
.ai-msg.bot { background: rgba(255,255,255, .08); color: rgba(255,255,255, .85); border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) 4px; max-width: 90%; }
.ai-msg.bot :deep(strong) { color: var(--amber-400); font-weight: 600; }

.ai-input-row { display: flex; gap: 8px; }
.ai-input { flex: 1; background: rgba(255,255,255, .06); border: 1px solid rgba(255,255,255, .1); border-radius: 99px; padding: 9px 16px; font-size: 13px; color: rgba(255,255,255, .7); font-family: 'Plus Jakarta Sans', sans-serif; outline: none; }
.ai-input::placeholder { color: rgba(255,255,255,.25); }
.ai-send { background: var(--amber-500); border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; transition: background .2s; flex-shrink: 0; }
.ai-send:hover { background: var(--amber-600); }

.reveal-left { opacity: 0; transform: translateX(-36px); transition: opacity .75s ease, transform .75s ease; }
.reveal-left.visible { opacity: 1; transform: translateX(0); }
.reveal-right { opacity: 0; transform: translateX(36px); transition: opacity .75s ease, transform .75s ease; }
.reveal-right.visible { opacity: 1; transform: translateX(0); }

@media (max-width: 1000px) {
  .ai-inner { grid-template-columns: 1fr; gap: 48px; }
}
</style>
