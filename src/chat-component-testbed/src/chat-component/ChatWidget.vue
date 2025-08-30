<template>
  <div class="vscode-chat">
    <div class="chat-header">
      <span class="title">{{ title }}</span>
      <div class="actions">
        <button class="codicon codicon-plus" title="New Chat"></button>
        <button class="codicon codicon-history" title="History"></button>
        <button class="codicon codicon-settings-gear" title="Settings"></button>
        <button class="codicon codicon-toolbar-more" title="More"></button>
      </div>
    </div>
    <div class="chat-messages" ref="messagesEl">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['chat-message', msg.type]"
      >
        <div class="avatar">
          <span :class="['codicon', msg.type === 'user' ? 'codicon-account' : 'codicon-tools']"></span>
        </div>
        <div class="bubble" v-html="msg.content"></div>
      </div>
      <div v-if="isLoading" class="chat-message assistant">
        <div class="avatar"><span class="codicon codicon-tools"></span></div>
        <div class="bubble typing">...</div>
      </div>
    </div>
    <div class="chat-input-container">
      <textarea
        v-model="currentMessage"
        class="chat-input"
        :placeholder="placeholder"
        @keydown.enter.exact.prevent="sendMessage"
      ></textarea>
      <button
        class="send-button codicon codicon-send"
        :disabled="!currentMessage.trim() || disabled"
        @click="sendMessage"
        title="Send"
      ></button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, nextTick, onMounted } from 'vue';
import '../../../vs/base/browser/ui/codicons/codicon/codicon.css';

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
  background: var(--vscode-chat-requestBackground, #1f1f1f);
  color: var(--vscode-foreground, #cccccc);
  font-family: var(--vscode-font-family, 'Segoe WPC', 'Segoe UI', sans-serif);
  font-size: 13px;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-bottom: 1px solid var(--vscode-chat-requestBorder, #3c3c3c);
}

.chat-header .actions button {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  margin-left: 4px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.chat-message {
  display: flex;
  margin-bottom: 12px;
}

.chat-message .avatar {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background: var(--vscode-chat-avatarBackground, #1f1f1f);
  color: var(--vscode-chat-avatarForeground, #cccccc);
  flex-shrink: 0;
}

.chat-message .bubble {
  background: var(--vscode-chat-requestBubbleBackground, rgba(38,79,120,0.3));
  border: 1px solid var(--vscode-chat-requestCodeBorder, rgba(0,73,114,0.72));
  padding: 6px 8px;
  border-radius: 4px;
  max-width: 100%;
  white-space: pre-wrap;
}

.chat-message.assistant .bubble {
  background: transparent;
  border: none;
}

.typing {
  opacity: 0.6;
}

.chat-input-container {
  position: relative;
  border-top: 1px solid var(--vscode-chat-requestBorder, #3c3c3c);
  padding: 8px;
}

.chat-input {
  width: 100%;
  min-height: 60px;
  resize: none;
  padding: 8px 32px 8px 8px;
  background: var(--vscode-inlineChatInput-background, #313131);
  color: var(--vscode-foreground, #cccccc);
  border: 1px solid var(--vscode-chat-requestBorder, #3c3c3c);
  font-family: inherit;
}

.send-button {
  position: absolute;
  right: 16px;
  bottom: 16px;
  background: transparent;
  border: none;
  color: var(--vscode-foreground, #cccccc);
  cursor: pointer;
  font-size: 16px;
}

.send-button:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>

