<template>
  <div class="ai-panel">
    <div class="ai-panel-header">
      <span style="font-size:1rem">🤖</span>
      <span class="ai-panel-title">Gemini AI</span>
      <div class="ai-status">
        <div class="ai-status-dot"></div>
        Online
      </div>
    </div>

    <div class="ai-messages" ref="messagesEl">
      <div
        v-for="(msg, i) in history"
        :key="i"
        class="ai-msg"
        :class="msg.role === 'user' ? 'user' : 'bot'"
        v-html="formatMsg(msg.content)"
      ></div>
      <div v-if="loading" class="ai-msg bot typing">Thinking…</div>
    </div>

    <div class="ai-input-area">
      <div class="ai-quick-prompts">
        <button
          v-for="p in quickPrompts"
          :key="p"
          class="ai-qp"
          @click="send(p)"
        >{{ p }}</button>
      </div>
      <div class="ai-input-row">
        <input
          v-model="inputText"
          class="ai-input"
          placeholder="Ask anything about your event…"
          @keydown.enter="send()"
        />
        <button class="ai-send" :disabled="loading" @click="send()">→</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useToast } from '@/composables/useToast'

const { show } = useToast()

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`
const SYSTEM_PROMPT = `You are an expert AI event planning copilot for EventLocal, an event platform in Rwanda (Kigali). Help organizers draft agendas, timelines, budgets, write marketing copy, forecast attendance and suggest pricing. Use <b> tags for bold headers. Keep responses concise (max 200 words), practical and specific to the Rwandan event market. Use RWF for prices.`

const quickPrompts = ['Draft agenda', 'Estimate budget', 'Write description', 'Predict attendance']

const history = ref([
  { role: 'assistant', content: 'Hello! I\'m your EventLocal Gemini AI assistant. Ask me to draft an agenda, estimate a budget, write marketing copy, or forecast attendance for your event.' }
])
const inputText = ref('')
const loading = ref(false)
const messagesEl = ref(null)

function formatMsg(text) {
  return text.replace(/\n/g, '<br/>')
}

async function send(preset) {
  const msg = preset || inputText.value.trim()
  if (!msg || loading.value) return
  inputText.value = ''
  history.value.push({ role: 'user', content: msg })
  loading.value = true
  await scrollBottom()

  try {
    const messages = history.value.slice(-6)
      .filter(m => m.role !== 'assistant' || history.value.indexOf(m) > 0)
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    // Gemini requires conversation to start with a user turn
    if (!messages.length || messages[0].role !== 'user') return
    const res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages,
        generationConfig: { maxOutputTokens: 600 }
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'AI error')
    history.value.push({ role: 'assistant', content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.' })
  } catch (e) {
    history.value.push({ role: 'assistant', content: `Error: ${e.message}` })
    show('Gemini unavailable — check your API key.', '⚠️')
  } finally {
    loading.value = false
    await scrollBottom()
  }
}

async function scrollBottom() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}
</script>

<style scoped>
.ai-panel { background: var(--ink); border-radius: var(--radius-xl); overflow: hidden; }
.ai-panel-header { padding: 14px 16px; background: rgba(245,158,11,.12); border-bottom: 1px solid rgba(245,158,11,.2); display: flex; align-items: center; gap: 8px; }
.ai-panel-title { font-family: 'Cormorant Garamond', serif; font-weight: 700; color: #fff; font-size: 1rem; }
.ai-status { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(255,255,255,.5); margin-left: auto; }
.ai-status-dot { width: 7px; height: 7px; background: #4ADE80; border-radius: 50%; animation: blink 2s infinite; }
.ai-messages { height: 280px; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.ai-messages::-webkit-scrollbar { width: 3px; }
.ai-msg { padding: 10px 13px; border-radius: 12px; font-size: 12.5px; line-height: 1.65; font-weight: 300; }
.ai-msg.user { background: var(--a600); color: #fff; border-radius: 12px 12px 3px 12px; align-self: flex-end; max-width: 85%; }
.ai-msg.bot { background: rgba(255,255,255,.07); color: rgba(255,255,255,.82); border-radius: 12px 12px 12px 3px; max-width: 95%; }
.ai-msg.typing { color: rgba(255,255,255,.4); font-style: italic; }
.ai-input-area { padding: 12px; border-top: 1px solid rgba(255,255,255,.08); }
.ai-quick-prompts { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 9px; }
.ai-qp { padding: 4px 9px; border-radius: 99px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.09); font-size: 11px; color: rgba(255,255,255,.55); cursor: pointer; transition: all .18s; }
.ai-qp:hover { background: rgba(245,158,11,.15); border-color: rgba(245,158,11,.3); color: var(--a400); }
.ai-input-row { display: flex; gap: 7px; }
.ai-input { flex: 1; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 99px; padding: 8px 14px; font-size: 12.5px; color: rgba(255,255,255,.75); font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color .2s; }
.ai-input:focus { border-color: rgba(245,158,11,.4); }
.ai-input::placeholder { color: rgba(255,255,255,.25); }
.ai-send { background: var(--a500); border: none; border-radius: 50%; width: 34px; height: 34px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .2s; font-size: 13px; color: #fff; }
.ai-send:hover { background: var(--a600); }
.ai-send:disabled { opacity: .5; cursor: not-allowed; }
</style>
