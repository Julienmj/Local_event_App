<template>
  <section id="ai" class="ai-section">

    <!-- Background blobs -->
    <div class="blob blob1"></div>
    <div class="blob blob2"></div>

    <div class="ai-inner">

      <!-- LEFT: Feature list -->
      <div class="ai-left reveal-left">
        <div class="eyebrow">✦ Organizer Superpower</div>
        <h2 class="section-heading">Your AI Event<br/><em>Planning Copilot</em></h2>
        <p class="section-sub">
          From blank page to fully-planned event in minutes. Draft agendas, forecast attendance,
          optimise pricing and write marketing copy — all with natural language.
        </p>

        <div class="ai-features">
          <div v-for="feat in aiFeatures" :key="feat.title" class="ai-feat">
            <div class="ai-feat-icon"><i :class="feat.icon"></i></div>
            <div class="ai-feat-body">
              <div class="ai-feat-title">{{ feat.title }}</div>
              <div class="ai-feat-desc">{{ feat.desc }}</div>
            </div>
          </div>
        </div>

        <div class="ai-cta-row">
          <a href="/auth" class="btn-cta">
            <i class="ph ph-rocket-launch"></i> Start Planning Free
          </a>
          <span class="ai-cta-note">No credit card required</span>
        </div>
      </div>

      <!-- RIGHT: AI Chat Mockup -->
      <div class="ai-mockup reveal-right">

        <!-- Mockup header bar -->
        <div class="mockup-topbar">
          <div class="mockup-dots">
            <span class="mdot red"></span>
            <span class="mdot yellow"></span>
            <span class="mdot green"></span>
          </div>
          <div class="mockup-title">
            <i class="ph ph-robot" style="color:#f59e0b"></i>
            EventLocal AI Copilot
          </div>
          <div class="mockup-status">
            <span class="status-dot"></span> Live
          </div>
        </div>

        <!-- Chat messages -->
        <div class="ai-chat" ref="chatRef">

          <div v-for="(msg, i) in messages" :key="i" class="msg-wrap" :class="msg.role === 'user' ? 'msg-wrap-user' : 'msg-wrap-bot'">

            <!-- Bot avatar -->
            <div v-if="msg.role === 'bot'" class="msg-avatar bot-av">
              <i class="ph ph-robot"></i>
            </div>

            <!-- Bubble -->
            <div class="msg-bubble" :class="msg.role === 'user' ? 'bubble-user' : 'bubble-bot'">
              <div v-html="msg.text"></div>
            </div>

            <!-- User avatar -->
            <div v-if="msg.role === 'user'" class="msg-avatar user-av">
              <i class="ph ph-user"></i>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="typing" class="msg-wrap msg-wrap-bot">
            <div class="msg-avatar bot-av"><i class="ph ph-robot"></i></div>
            <div class="msg-bubble bubble-bot bubble-typing">
              <span class="tdot"></span>
              <span class="tdot"></span>
              <span class="tdot"></span>
            </div>
          </div>
        </div>

        <!-- Input row -->
        <div class="ai-input-area">
          <div class="ai-quick-chips">
            <button v-for="q in quickPrompts" :key="q.label" class="qchip" @click="sendQuick(q.text)">
              {{ q.label }}
            </button>
          </div>
          <div class="ai-input-row">
            <input
              v-model="inputMsg"
              class="ai-input"
              type="text"
              placeholder="e.g. Plan a 200-person tech conference in Kigali…"
              @keyup.enter="sendMessage"
            />
            <button class="ai-send-btn" @click="sendMessage" :disabled="typing">
              <i class="ph ph-paper-plane-tilt"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const inputMsg = ref('')
const chatRef = ref(null)
const typing = ref(false)

const aiFeatures = [
  { icon: 'ph ph-list-checks', title: 'Agenda & Timeline Generator', desc: 'Describe your event and get a structured schedule with speaker slots, breaks and logistics.' },
  { icon: 'ph ph-chart-line-up', title: 'Predictive Attendance AI', desc: 'Forecasts ticket sales, no-shows and revenue based on event type, pricing and location.' },
  { icon: 'ph ph-currency-circle-dollar', title: 'Dynamic Pricing Advisor', desc: 'Suggests optimal ticket prices and promotional timing to maximise revenue and fill rates.' },
  { icon: 'ph ph-pencil-line', title: 'Marketing Copy Writer', desc: 'Generates compelling event descriptions, social posts, and email campaigns on demand.' }
]

const quickPrompts = [
  { label: 'Draft agenda', text: 'Draft a 3-day tech conference agenda for 200 people in Kigali' },
  { label: 'Estimate budget', text: 'Estimate budget for a 200-person event with RWF 5M budget' },
  { label: 'Predict attendance', text: 'Predict attendance for a paid tech event in Kigali' },
]

const messages = ref([
  {
    role: 'user',
    text: 'Help me plan a 200-person tech conference for 3 days in Kigali. Budget: RWF 5M'
  },
  {
    role: 'bot',
    text: `
      <div class="ai-plan">
        <div class="plan-section">
          <div class="plan-section-header">
            <span class="plan-icon"><i class="ph ph-calendar-blank"></i></span>
            <strong>Day 1 — Arrive &amp; Connect</strong>
          </div>
          <div class="plan-rows">
            <div class="plan-row"><span class="plan-time">08:00</span><span>Registration &amp; networking breakfast</span></div>
            <div class="plan-row"><span class="plan-time">09:30</span><span>Opening keynote: Rwanda Tech 2026</span></div>
            <div class="plan-row"><span class="plan-time">11:00</span><span>Track splits: AI · Fintech · CleanTech</span></div>
            <div class="plan-row"><span class="plan-time">18:00</span><span>Welcome cocktail @ Inzora Rooftop</span></div>
          </div>
        </div>
        <div class="plan-section">
          <div class="plan-section-header">
            <span class="plan-icon"><i class="ph ph-currency-circle-dollar"></i></span>
            <strong>Budget Forecast</strong>
          </div>
          <div class="plan-budget-grid">
            <div class="budget-item"><span class="budget-label">Venue</span><span class="budget-val">RWF 800K</span></div>
            <div class="budget-item"><span class="budget-label">Catering</span><span class="budget-val">RWF 1.2M</span></div>
            <div class="budget-item"><span class="budget-label">Speakers</span><span class="budget-val">RWF 600K</span></div>
            <div class="budget-item"><span class="budget-label">Marketing</span><span class="budget-val">RWF 400K</span></div>
          </div>
        </div>
        <div class="plan-section">
          <div class="plan-section-header">
            <span class="plan-icon"><i class="ph ph-chart-bar"></i></span>
            <strong>Attendance Prediction</strong>
          </div>
          <div class="plan-attendance">
            <div class="attend-bar-wrap">
              <div class="attend-bar"><div class="attend-fill" style="width:93%"></div></div>
              <span class="attend-pct">93%</span>
            </div>
            <div class="attend-label">Predicted: <strong>186 / 200 attendees</strong></div>
          </div>
        </div>
      </div>
    `
  }
])

function scrollToBottom() {
  setTimeout(() => {
    if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
  }, 80)
}

function sendQuick(text) {
  inputMsg.value = text
  sendMessage()
}

function sendMessage() {
  const text = inputMsg.value.trim()
  if (!text || typing.value) return
  messages.value.push({ role: 'user', text })
  inputMsg.value = ''
  typing.value = true
  scrollToBottom()

  setTimeout(() => {
    messages.value.push({
      role: 'bot',
      text: `
        <div class="ai-plan">
          <div class="plan-section">
            <div class="plan-section-header">
              <span class="plan-icon"><i class="ph ph-sparkle"></i></span>
              <strong>AI Response</strong>
            </div>
            <p style="margin:0;line-height:1.7;color:var(--text2)">
              I'm analyzing <em>"${text}"</em>.<br/>
              I can generate a full agenda, speaker lineup, budget breakdown, and marketing strategy for this event.
              Sign up to unlock the full AI Copilot experience.
            </p>
          </div>
        </div>
      `
    })
    typing.value = false
    scrollToBottom()
  }, 1400)
}
</script>

<style scoped>
.ai-section { background: var(--bg); padding: 100px 6%; position: relative; overflow: hidden; }
.blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.blob1 { width: 500px; height: 500px; background: var(--accent); opacity: .05; top: -120px; right: -80px; }
.blob2 { width: 400px; height: 400px; background: var(--accent); opacity: .03; bottom: -100px; left: -60px; }
.ai-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.1fr; gap: 72px; align-items: center; }
.eyebrow { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; font-weight: 700; color: var(--accent); margin-bottom: 14px; }
.section-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4vw, 3.4rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; color: var(--text); margin-bottom: 18px; }
.section-heading em { font-style: italic; color: var(--accent); }
.section-sub { font-size: 15px; color: var(--text2); max-width: 480px; line-height: 1.8; font-weight: 300; margin-bottom: 36px; }
.ai-features { display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
.ai-feat { display: flex; align-items: flex-start; gap: 14px; padding: 16px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; transition: all .25s; }
.ai-feat:hover { background: var(--surface2); border-color: var(--border2); transform: translateX(4px); }
.ai-feat-icon { width: 40px; height: 40px; border-radius: 11px; background: var(--accent-l); border: 1px solid rgba(245,158,11,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; }
.ai-feat-title { font-family: 'Cormorant Garamond', serif; font-weight: 700; color: var(--text); font-size: 1rem; margin-bottom: 4px; }
.ai-feat-desc { font-size: 12.5px; color: var(--text3); font-weight: 300; line-height: 1.6; }
.ai-cta-row { display: flex; align-items: center; gap: 16px; }
.btn-cta { display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; background: var(--accent); color: #fff; border-radius: 99px; font-size: 14px; font-weight: 600; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; transition: all .22s; box-shadow: 0 6px 24px rgba(245,158,11,0.3); }
.btn-cta:hover { background: var(--accent-h); transform: translateY(-2px); }
.ai-cta-note { font-size: 12px; color: var(--text3); }
.ai-mockup { background: var(--surface); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-lg); border: 1px solid var(--border2); }
.mockup-topbar { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: var(--surface2); border-bottom: 1px solid var(--border); }
.mockup-dots { display: flex; gap: 6px; }
.mdot { width: 11px; height: 11px; border-radius: 50%; }
.mdot.red { background: #ef4444; } .mdot.yellow { background: var(--accent); } .mdot.green { background: #22c55e; }
.mockup-title { flex: 1; text-align: center; font-size: 12.5px; font-weight: 600; color: var(--text2); display: flex; align-items: center; justify-content: center; gap: 6px; }
.mockup-status { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #86efac; font-weight: 500; }
.status-dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; animation: blink 2s infinite; }
.ai-chat { padding: 18px 16px; display: flex; flex-direction: column; gap: 14px; max-height: 360px; overflow-y: auto; background: var(--bg); }
.ai-chat::-webkit-scrollbar { width: 4px; }
.ai-chat::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
.msg-wrap { display: flex; align-items: flex-end; gap: 8px; }
.msg-wrap-user { flex-direction: row-reverse; } .msg-wrap-bot { flex-direction: row; }
.msg-avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; color: #fff; }
.bot-av { background: var(--surface3); border: 1px solid var(--border2); color: var(--accent); }
.user-av { background: var(--accent); }
.msg-bubble { padding: 12px 16px; border-radius: 18px; font-size: 13px; line-height: 1.65; max-width: 85%; word-break: break-word; }
.bubble-user { background: var(--accent); color: #fff; border-radius: 18px 18px 4px 18px; font-weight: 500; }
.bubble-bot { background: var(--surface2); color: var(--text); border-radius: 4px 18px 18px 18px; border: 1px solid var(--border2); }
.bubble-typing { display: flex; align-items: center; gap: 5px; padding: 14px 18px; }
.tdot { width: 8px; height: 8px; background: var(--text3); border-radius: 50%; animation: bounce 1.2s infinite; }
.tdot:nth-child(2) { animation-delay: .2s; } .tdot:nth-child(3) { animation-delay: .4s; }
@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: .4; } 30% { transform: translateY(-7px); opacity: 1; } }
.ai-chat :deep(.ai-plan) { display: flex; flex-direction: column; gap: 14px; }
.ai-chat :deep(.plan-section) { background: var(--surface2); border: 1px solid var(--border2); border-radius: 12px; padding: 13px 15px; }
.ai-chat :deep(.plan-section-header) { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 13.5px; color: var(--text); }
.ai-chat :deep(.plan-icon) { width: 28px; height: 28px; background: var(--accent-l); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.ai-chat :deep(.plan-rows) { display: flex; flex-direction: column; gap: 6px; }
.ai-chat :deep(.plan-row) { display: flex; align-items: baseline; gap: 10px; font-size: 12.5px; color: var(--text2); }
.ai-chat :deep(.plan-time) { font-weight: 700; color: var(--accent); font-size: 11.5px; min-width: 38px; flex-shrink: 0; }
.ai-chat :deep(.plan-budget-grid) { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.ai-chat :deep(.budget-item) { background: var(--surface3); border: 1px solid var(--border); border-radius: 8px; padding: 7px 10px; display: flex; justify-content: space-between; align-items: center; }
.ai-chat :deep(.budget-label) { font-size: 11.5px; color: var(--text3); }
.ai-chat :deep(.budget-val) { font-size: 12px; font-weight: 700; color: var(--text); }
.ai-chat :deep(.plan-attendance) { display: flex; flex-direction: column; gap: 7px; }
.ai-chat :deep(.attend-bar-wrap) { display: flex; align-items: center; gap: 10px; }
.ai-chat :deep(.attend-bar) { flex: 1; height: 8px; background: var(--border2); border-radius: 99px; overflow: hidden; }
.ai-chat :deep(.attend-fill) { height: 100%; background: var(--accent); border-radius: 99px; }
.ai-chat :deep(.attend-pct) { font-size: 13px; font-weight: 700; color: var(--accent); min-width: 36px; }
.ai-chat :deep(.attend-label) { font-size: 12.5px; color: var(--text2); }
.ai-input-area { padding: 14px 16px; border-top: 1px solid var(--border); background: var(--surface); }
.ai-quick-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.qchip { padding: 5px 12px; border-radius: 99px; background: var(--accent-l); border: 1px solid rgba(245,158,11,0.25); font-size: 11.5px; color: var(--accent); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; transition: all .18s; }
.qchip:hover { background: var(--accent); border-color: var(--accent); color: #fff; transform: translateY(-1px); }
.ai-input-row { display: flex; gap: 8px; align-items: center; }
.ai-input { flex: 1; background: var(--surface2); border: 1.5px solid var(--border2); border-radius: 99px; padding: 10px 16px; font-size: 13px; color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all .2s; }
.ai-input:focus { border-color: var(--accent); background: var(--surface3); box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
.ai-input::placeholder { color: var(--text3); }
.ai-send-btn { background: var(--accent); border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #fff; flex-shrink: 0; transition: all .2s; }
.ai-send-btn:hover { background: var(--accent-h); transform: scale(1.08); }
.ai-send-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.reveal-left { opacity: 0; transform: translateX(-36px); transition: opacity .75s ease, transform .75s ease; }
.reveal-left.visible { opacity: 1; transform: translateX(0); }
.reveal-right { opacity: 0; transform: translateX(36px); transition: opacity .75s ease, transform .75s ease; }
.reveal-right.visible { opacity: 1; transform: translateX(0); }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
@media (max-width: 1024px) { .ai-inner { grid-template-columns: 1fr; gap: 52px; } .ai-mockup { max-width: 600px; margin: 0 auto; width: 100%; } }
</style>
