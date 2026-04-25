<template>
  <div class="ai-assistant-page">
    <div class="page-header">
      <h1 class="page-title">AI Assistant</h1>
      <p class="page-sub">Your intelligent event planning companion</p>
    </div>

    <div class="ai-chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" class="message" :class="message.role">
          <div class="message-avatar">
            <i v-if="message.role === 'assistant'" class="ph ph-robot"></i>
            <span v-else>{{ auth.initials }}</span>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="message.content"></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
        <div v-if="isTyping" class="message assistant">
          <div class="message-avatar">
            <i class="ph ph-robot"></i>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <div class="suggested-prompts" v-if="messages.length === 0">
          <div class="prompts-title">Try asking:</div>
          <div class="prompts-grid">
            <button v-for="prompt in suggestedPrompts" :key="prompt.text" 
                    class="prompt-btn" @click="sendPrompt(prompt.text)">
              <i :class="['ph', prompt.icon]"></i>
              {{ prompt.text }}
            </button>
          </div>
        </div>
        <div class="input-container">
          <textarea 
            v-model="currentMessage" 
            @keydown.enter.exact="sendMessage"
            @keydown.enter.shift.prevent="currentMessage += '\n'"
            placeholder="Ask me anything about events..."
            class="message-input"
            rows="1"
          ></textarea>
          <button 
            @click="sendMessage" 
            :disabled="!currentMessage.trim() || isTyping"
            class="send-btn"
          >
            <i class="ph ph-paper-plane-tilt"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const messagesContainer = ref(null)
const currentMessage = ref('')
const isTyping = ref(false)

const messages = ref([
  {
    id: 1,
    role: 'assistant',
    content: 'Hello! I\'m your AI event assistant. I can help you discover events, plan your attendance, and answer any questions about the EventLocal platform. How can I assist you today?',
    timestamp: new Date()
  }
])

const suggestedPrompts = [
  { text: 'What events are happening this weekend?', icon: 'ph-calendar-blank' },
  { text: 'Find music events near me', icon: 'ph-music-notes' },
  { text: 'How do I book tickets?', icon: 'ph-ticket' },
  { text: 'Recommend networking events', icon: 'ph-users-three' }
]

function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }).format(date)
}

async function sendMessage() {
  if (!currentMessage.value.trim() || isTyping.value) return

  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: currentMessage.value,
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const messageText = currentMessage.value
  currentMessage.value = ''

  await nextTick()
  scrollToBottom()

  isTyping.value = true
  await nextTick()
  scrollToBottom()

  // Simulate AI response
  setTimeout(() => {
    const aiResponse = generateAIResponse(messageText)
    messages.value.push(aiResponse)
    isTyping.value = false
    nextTick()
    scrollToBottom()
  }, 1500)
}

function sendPrompt(text) {
  currentMessage.value = text
  sendMessage()
}

function generateAIResponse(message) {
  const responses = {
    'weekend': 'This weekend, there are several exciting events! I found 3 music concerts, 2 tech meetups, and a food festival. Would you like me to show you details for any specific type of event?',
    'music': 'Great choice! There are 5 music events coming up, including a jazz night on Friday and a rock concert on Saturday. Most events have tickets starting from $15.',
    'tickets': 'Booking tickets is easy! Simply browse events, click on any that interest you, and click the "Book Now" button. You can pay securely online and receive instant e-tickets.',
    'networking': 'I found 4 networking events this month, including a startup mixer and a tech professionals meetup. These are great opportunities to expand your professional network!'
  }

  const defaultResponse = 'That\'s an interesting question! Based on your preferences, I\'d recommend checking out our upcoming events. You can filter by category, date, and location to find exactly what you\'re looking for. Is there a specific type of event you\'d like to explore?'

  const responseText = Object.keys(responses).find(key => 
    message.toLowerCase().includes(key)
  ) ? responses[Object.keys(responses).find(key => message.toLowerCase().includes(key))] 
    : defaultResponse

  return {
    id: Date.now(),
    role: 'assistant',
    content: responseText,
    timestamp: new Date()
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.ai-assistant-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 24px;
  text-align: center;
}

.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.page-sub {
  color: var(--text3);
  font-size: 14px;
}

.ai-chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: var(--accent-dark);
}

.message-content {
  flex: 1;
}

.message-text {
  background: var(--surface2);
  padding: 12px 16px;
  border-radius: var(--radius);
  color: var(--text);
  line-height: 1.5;
}

.message.user .message-text {
  background: var(--accent);
  color: white;
}

.message-time {
  font-size: 11px;
  color: var(--text4);
  margin-top: 4px;
  padding: 0 4px;
}

.message.user .message-time {
  text-align: right;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: var(--surface2);
  border-radius: var(--radius);
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text3);
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-10px); }
}

.chat-input {
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.suggested-prompts {
  padding: 20px;
  border-bottom: 1px solid var(--border);
}

.prompts-title {
  font-size: 12px;
  color: var(--text3);
  margin-bottom: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.prompts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.prompt-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.prompt-btn:hover {
  background: var(--accent-xl);
  border-color: var(--accent);
  color: var(--accent);
}

.prompt-btn i {
  font-size: 16px;
}

.input-container {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  resize: none;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 16px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  background: var(--surface2);
  color: var(--text);
  outline: none;
  transition: all 0.2s;
  max-height: 120px;
}

.message-input:focus {
  border-color: var(--accent);
  background: var(--surface3);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: var(--accent-dark);
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
