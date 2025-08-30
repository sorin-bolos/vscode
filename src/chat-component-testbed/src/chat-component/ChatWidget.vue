<template>
  <div class="vscode-chat">
    <div class="chat-messages" ref="messagesEl">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['chat-message', msg.type]"
      >
        <div class="avatar">{{ msg.type === 'user' ? 'U' : 'A' }}</div>
        <div class="content" v-html="msg.content"></div>
      </div>
      <div v-if="isLoading" class="chat-message assistant">
        <div class="avatar">A</div>
        <div class="content typing">...</div>
      </div>
    </div>
    <div class="chat-input-bar">
      <textarea
        v-model="currentMessage"
        class="chat-input"
        :placeholder="placeholder"
        @keydown.enter.exact.prevent="sendMessage"
      ></textarea>
      <button
        class="send-button"
        :disabled="!currentMessage.trim() || disabled"
        @click="sendMessage"
      >Send</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, nextTick, onMounted } from 'vue';

export default defineComponent({
  name: 'ChatWidget',
  props: {
    title: { type: String, default: 'Chat' },
    placeholder: { type: String, default: 'Add Agent' },
    disabled: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const messages = ref([]);
    const currentMessage = ref('');
    const isLoading = ref(false);
    const messageId = ref(0);
    const messagesEl = ref(null);

    function scrollToBottom() {
      if (messagesEl.value) {
        messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
      }
    }

    function addMessage(message) {
      const msg = {
        id: messageId.value++,
        type: message.type || 'assistant',
        content: message.content || '',
        timestamp: new Date()
      };
      messages.value.push(msg);
      emit('message-received', msg);
      nextTick(scrollToBottom);
    }

    function setLoading(v) {
      isLoading.value = v;
      nextTick(scrollToBottom);
    }

    function clearChat() {
      messages.value = [];
      emit('chat-cleared');
    }

    function stripHtml(html) {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || '';
    }

    function copyAll() {
      const text = messages.value
        .map(m => `${m.type === 'user' ? 'You' : 'Assistant'}: ${stripHtml(m.content)}`)
        .join('\n\n');
      navigator.clipboard.writeText(text);
    }

    function sendMessage() {
      if (!currentMessage.value.trim() || props.disabled) return;
      const userMsg = {
        id: messageId.value++,
        type: 'user',
        content: currentMessage.value,
        timestamp: new Date()
      };
      messages.value.push(userMsg);
      emit('message-sent', { message: currentMessage.value, messageObject: userMsg });
      currentMessage.value = '';
      nextTick(scrollToBottom);
    }

    onMounted(() => {
      // make copy function available globally for testing/demo purposes
      window.copyChatContent = copyAll;
    });

    // expose methods for parent via template ref
    return {
      messages,
      currentMessage,
      isLoading,
      messagesEl,
      placeholder: props.placeholder,
      sendMessage,
      addMessage,
      setLoading,
      clearChat,
      copyAll
    };
  }
});
</script>

<style scoped>
.vscode-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  color: #cccccc;
  font-family: var(--vscode-font-family, sans-serif);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  user-select: text;
}

.chat-message {
  display: flex;
  margin-bottom: 12px;
}

.chat-message .avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3c3c3c;
  color: #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 12px;
  flex-shrink: 0;
}

.chat-message.user .avatar {
  background: #0e639c;
}

.chat-message .content {
  white-space: pre-wrap;
}

.typing {
  opacity: 0.6;
}

.chat-input-bar {
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-top: 1px solid #3c3c3c;
}

.chat-input {
  width: 100%;
  min-height: 60px;
  resize: none;
  border: 1px solid #3c3c3c;
  padding: 8px;
  background: #ffffff;
  color: #1e1e1e;
  font-family: inherit;
}

.send-button {
  align-self: flex-end;
  margin-top: 8px;
  background: #0e639c;
  color: #ffffff;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}

.send-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>

