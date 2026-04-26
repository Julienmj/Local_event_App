<template>
  <div class="ai-panel">

    <!-- Header -->
    <div class="ai-header">
      <div class="ai-header-icon">
        <i class="ph ph-robot"></i>
      </div>
      <div class="ai-header-text">
        <div class="ai-title">Gemini AI Copilot</div>
        <div class="ai-subtitle">
          <span class="ai-dot"></span> Ready to help
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="ai-messages" ref="messagesEl">
      <div
        v-for="(msg, i) in history"
        :key="i"
        class="ai-bubble-wrap"
        :class="msg.role === 'user' ? 'wrap-user' : 'wrap-bot'"
      >
        <div v-if="msg.role !== 'user'" class="ai-avatar">
          <i class="ph ph-robot"></i>
        </div>
        <div
          class="ai-bubble"
          :class="msg.role === 'user' ? 'bubble-user' : 'bubble-bot'"
          v-html="formatMsg(msg.content)"
        ></div>
        <div v-if="msg.role === 'user'" class="ai-avatar user-av">
          <i class="ph ph-user"></i>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="loading" class="ai-bubble-wrap wrap-bot">
        <div class="ai-avatar"><i class="ph ph-robot"></i></div>
        <div class="ai-bubble bubble-bot bubble-typing">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="ai-footer">
      <div class="ai-chips">
        <button v-for="p in quickPrompts" :key="p" class="ai-chip" @click="send(p)">
          {{ p }}
        </button>
      </div>
      <div class="ai-input-row">
        <input
          v-model="inputText"
          class="ai-input"
          placeholder="Ask anything about your event…"
          @keydown.enter="send()"
        />
        <button class="ai-send-btn" :disabled="loading" @click="send()">
          <i class="ph ph-paper-plane-tilt"></i>
        </button>
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
const SYSTEM_PROMPT = `You are an expert AI event planning copilot for EventLocal, an event platform in Rwanda (Kigali). Help organizers draft agendas, timelines, budgets, write marketing copy, forecast attendance and suggest pricing. Keep responses concise (max 200 words), practical and specific to the Rwandan event market. Use RWF for prices. Format with clear line breaks between sections.`

const quickPrompts = ['Draft agenda', 'Estimate budget', 'Write description', 'Predict attendance']

const history = ref([
  { role: 'assistant', content: "Hello! I'm your **EventLocal AI Copilot**. I can help you:\n- Draft event agendas\n- Estimate budgets in RWF\n- Write marketing copy\n- Forecast attendance\n\nWhat are you planning today?" }
])
const inputText = ref('')
const loading = ref(false)
const messagesEl = ref(null)

function formatMsg(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n/g, '<br/>')
}

async function send(preset) {
  const msg = (preset || inputText.value).replace(/^[^\w\s]*\s*/, '').trim()
  const rawMsg = preset || inputText.value.trim()
  if (!rawMsg || loading.value) return
  inputText.value = ''
  history.value.push({ role: 'user', content: rawMsg })
  loading.value = true
  await scrollBottom()

  try {
    const contents = history.value
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))

    const firstUserIdx = contents.findIndex(c => c.role === 'user')
    const trimmed = firstUserIdx >= 0 ? contents.slice(firstUserIdx) : contents

    const res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: trimmed,
        generationConfig: { maxOutputTokens: 600 }
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`)

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.'
    history.value.push({ role: 'assistant', content: reply })
  } catch (e) {
    history.value.push({ role: 'assistant', content: `⚠️ **Error:** ${e.message}\n\nPlease check your internet connection or API key.` })
    show('Gemini request failed.', '⚠️')
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
/* Panel */
.ai-panel {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: var(--radius-xl);
  border: 1.5px solid #e2d9f3;
  box-shadow: 0 4px 24px rgba(109, 40, 217, 0.1);
  overflow: hidden;
  height: 100%;
  min-height: 480px;
}

/* Header */
.ai-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: linear-gradient(135deg, #6d28d9, #4f46e5);
  flex-shrink: 0;
}

.ai-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #fff;
  flex-shrink: 0;
}

.ai-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: #ffffff;
  line-height: 1.2;
}

.ai-subtitle {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}

.ai-dot {
  width: 7px;
  height: 7px;
  background: #86efac;
  border-radius: 50%;
  animation: blink 2s infinite;
  box-shadow: 0 0 5px #86efac;
}

/* Messages */
.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8f6ff;
}

.ai-messages::-webkit-scrollbar { width: 4px; }
.ai-messages::-webkit-scrollbar-track { background: transparent; }
.ai-messages::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 2px; }

.ai-bubble-wrap {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.wrap-user { flex-direction: row-reverse; }
.wrap-bot { flex-direction: row; }

.ai-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6d28d9, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #fff;
  flex-shrink: 0;
}

.user-av {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

/* Bubbles */
.ai-bubble {
  padding: 11px 15px;
  border-radius: 18px;
  font-size: 13.5px;
  line-height: 1.7;
  max-width: 82%;
  word-break: break-word;
}

.bubble-bot {
  background: #ffffff;
  color: #1e1b4b;
  border-radius: 4px 18px 18px 18px;
  border: 1.5px solid #e2d9f3;
  box-shadow: 0 2px 8px rgba(109, 40, 217, 0.08);
}

.bubble-user {
  background: linear-gradient(135deg, #6d28d9, #4f46e5);
  color: #ffffff;
  border-radius: 18px 18px 4px 18px;
  box-shadow: 0 4px 14px rgba(109, 40, 217, 0.3);
}

/* Typing dots */
.bubble-typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 14px 18px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #7c3aed;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-7px); opacity: 1; }
}

/* Footer */
.ai-footer {
  padding: 12px 14px;
  border-top: 1.5px solid #e2d9f3;
  background: #ffffff;
  flex-shrink: 0;
}

.ai-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.ai-chip {
  padding: 5px 12px;
  border-radius: 99px;
  background: #f3f0ff;
  border: 1.5px solid #c4b5fd;
  font-size: 11.5px;
  color: #5b21b6;
  cursor: pointer;
  transition: all .18s;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
}

.ai-chip:hover {
  background: #6d28d9;
  border-color: #6d28d9;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(109, 40, 217, 0.25);
}

.ai-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ai-input {
  flex: 1;
  background: #f8f6ff;
  border: 1.5px solid #c4b5fd;
  border-radius: 99px;
  padding: 10px 16px;
  font-size: 13px;
  color: #1e1b4b;
  font-family: 'Plus Jakarta Sans', sans-serif;
  outline: none;
  transition: all .2s;
}

.ai-input:focus {
  border-color: #6d28d9;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.12);
}

.ai-input::placeholder { color: #a78bfa; }

.ai-send-btn {
  background: linear-gradient(135deg, #6d28d9, #4f46e5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all .2s;
  font-size: 16px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(109, 40, 217, 0.35);
}

.ai-send-btn:hover { transform: scale(1.08); box-shadow: 0 6px 18px rgba(109, 40, 217, 0.45); }
.ai-send-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

/* Markdown inside bubbles */
.bubble-bot :deep(strong) { color: #4c1d95; font-weight: 700; }
.bubble-bot :deep(em) { color: #5b21b6; font-style: italic; }
.bubble-bot :deep(ul) { padding-left: 16px; margin: 6px 0; }
.bubble-bot :deep(li) { margin-bottom: 3px; color: #1e1b4b; }
.bubble-user :deep(strong) { color: #fde68a; }
</style>
