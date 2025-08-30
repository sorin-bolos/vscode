<template>
  <div class="chat-widget" :class="{ 'chat-widget-focused': isFocused }">
    <div class="chat-header">
      <h3 class="chat-title">{{ title }}</h3>
      <button @click="clearChat" class="clear-button" title="Clear chat">
        <span>🗑️</span>
      </button>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message', `message-${message.type}`]"
      >
        <div class="message-content">
          <div class="message-text" v-html="message.content"></div>
          <div class="message-timestamp">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>

      <div v-if="isLoading" class="message message-assistant loading">
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input-container">
      <div class="chat-input-wrapper">
        <textarea
          v-model="currentMessage"
          @keydown="handleKeyDown"
          @focus="isFocused = true"
          @blur="isFocused = false"
          placeholder="Ask a question..."
          class="chat-input"
          rows="1"
          ref="inputElement"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="!currentMessage.trim() || isLoading"
          class="send-button"
          title="Send message"
        >
          <span>→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWidget',
  props: {
    title: {
      type: String,
      default: 'Chat'
    },
    placeholder: {
      type: String,
      default: 'Ask a question...'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      messages: [],
      currentMessage: '',
      isLoading: false,
      isFocused: false,
      messageId: 0
    }
  },
  methods: {
    sendMessage() {
      if (!this.currentMessage.trim() || this.isLoading) {
        return;
      }

      const userMessage = {
        id: this.messageId++,
        type: 'user',
        content: this.currentMessage,
        timestamp: new Date()
      };

      this.messages.push(userMessage);
      const messageContent = this.currentMessage;
      this.currentMessage = '';
      this.isLoading = true;

      // Emit event for parent component to handle
      this.$emit('message-sent', {
        message: messageContent,
        messageObject: userMessage
      });

      // Auto-resize textarea
      this.$nextTick(() => {
        this.adjustTextareaHeight();
      });

      // Simulate response (replace with actual chat integration)
      this.simulateResponse();
    },

    simulateResponse() {
      setTimeout(() => {
        const assistantMessage = {
          id: this.messageId++,
          type: 'assistant',
          content: 'This is a placeholder response. Replace with actual chat integration.',
          timestamp: new Date()
        };

        this.messages.push(assistantMessage);
        this.isLoading = false;
        this.$emit('message-received', assistantMessage);

        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }, 1500);
    },

    clearChat() {
      this.messages = [];
      this.$emit('chat-cleared');
    },

    handleKeyDown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    },

    adjustTextareaHeight() {
      const textarea = this.$refs.inputElement;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    formatTime(timestamp) {
      return timestamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    addMessage(message) {
      this.messages.push({
        id: this.messageId++,
        ...message,
        timestamp: message.timestamp || new Date()
      });

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    setLoading(loading) {
      this.isLoading = loading;
    }
  },
  watch: {
    currentMessage() {
      this.$nextTick(() => {
        this.adjustTextareaHeight();
      });
    }
  },
  mounted() {
    this.adjustTextareaHeight();
  }
}
</script>

<style scoped>
.chat-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.chat-widget-focused {
  border-color: #0078d4;
  box-shadow: 0 0 0 1px #0078d4;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
}

.chat-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
}

.clear-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #656d76;
  font-size: 16px;
}

.clear-button:hover {
  background: #f3f4f6;
  color: #24292f;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  max-width: 80%;
}

.message-user {
  align-self: flex-end;
}

.message-assistant {
  align-self: flex-start;
}

.message-content {
  padding: 8px 12px;
  border-radius: 12px;
  position: relative;
}

.message-user .message-content {
  background: #0078d4;
  color: white;
}

.message-assistant .message-content {
  background: #f6f8fa;
  color: #24292f;
  border: 1px solid #e1e4e8;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.message-timestamp {
  font-size: 11px;
  opacity: 0.7;
}

.loading .message-content {
  padding: 12px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #656d76;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-input-container {
  padding: 16px;
  border-top: 1px solid #e1e4e8;
  background: #fff;
}

.chat-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 8px;
}

.chat-input {
  flex: 1;
  border: none;
  background: none;
  resize: none;
  outline: none;
  font-size: 14px;
  line-height: 1.4;
  font-family: inherit;
  min-height: 20px;
  max-height: 120px;
}

.chat-input::placeholder {
  color: #656d76;
}

.send-button {
  background: #0078d4;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.send-button:hover:not(:disabled) {
  background: #106ebe;
}

.send-button:disabled {
  background: #d1d9e0;
  cursor: not-allowed;
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d1d9e0;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8b3c1;
}
</style>
