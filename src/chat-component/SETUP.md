# Setting Up Test Vue Project

Follow these steps to create a separate Vue.js project to test the ChatWidget component:

## 1. Create a new Vue project

```bash
# Navigate to your desired directory (outside of the VS Code repository)
cd /path/to/your/projects

# Create a new Vue 3 project
npm create vue@latest my-chat-test-app

# Navigate to the project
cd my-chat-test-app

# Install dependencies
npm install
```

## 2. Copy the ChatWidget component

Copy the entire `src/chat-component` folder from this VS Code repository to your new Vue project:

```bash
# From your VS Code repository root
cp -r src/chat-component /path/to/your/projects/my-chat-test-app/src/

# Or on Windows
xcopy src\chat-component C:\path\to\your\projects\my-chat-test-app\src\chat-component\ /E /I
```

## 3. Update your main Vue app

Replace the contents of `src/App.vue` in your new project:

```vue
<template>
  <div id="app">
    <div class="app-header">
      <h1>Chat Widget Test App</h1>
      <p>Testing the extracted VS Code chat component</p>
    </div>

    <div class="chat-container">
      <ChatWidget
        ref="chatWidget"
        title="AI Assistant"
        placeholder="Ask me anything..."
        @message-sent="handleMessageSent"
        @message-received="handleMessageReceived"
        @chat-cleared="handleChatCleared"
      />
    </div>

    <div class="controls">
      <button @click="addTestMessage">Add Test Message</button>
      <button @click="simulateResponse">Simulate Response</button>
      <button @click="clearChat">Clear Chat</button>
    </div>

    <div class="event-log">
      <h3>Event Log:</h3>
      <div class="log-content" ref="logContent">
        <div v-for="log in eventLogs" :key="log.id" class="log-entry">
          [{{ log.timestamp }}] {{ log.event }}: {{ log.data }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatWidget from './chat-component/ChatWidget.vue'

export default {
  name: 'App',
  components: {
    ChatWidget
  },
  data() {
    return {
      eventLogs: [],
      logId: 0
    }
  },
  methods: {
    handleMessageSent(event) {
      this.addLog('Message Sent', event.message);

      // Simulate a response after a delay
      this.$refs.chatWidget.setLoading(true);

      setTimeout(() => {
        const responses = [
          "That's an interesting question! Let me think about that.",
          "I understand what you're asking. Here's my perspective:",
          "Great question! Based on my knowledge:",
          "Thanks for asking! I'd be happy to help with that.",
          "That's a thoughtful inquiry. Here's what I think:"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        this.$refs.chatWidget.addMessage({
          type: 'assistant',
          content: `${randomResponse} <br><br>You asked: "${event.message}"`
        });

        this.$refs.chatWidget.setLoading(false);
      }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
    },

    handleMessageReceived(message) {
      this.addLog('Message Received', message.content.substring(0, 50) + '...');
    },

    handleChatCleared() {
      this.addLog('Chat Cleared', 'All messages removed');
    },

    addTestMessage() {
      this.$refs.chatWidget.addMessage({
        type: 'assistant',
        content: 'This is a test message added programmatically at ' + new Date().toLocaleTimeString()
      });
    },

    simulateResponse() {
      this.$refs.chatWidget.setLoading(true);

      setTimeout(() => {
        this.$refs.chatWidget.addMessage({
          type: 'assistant',
          content: '🤖 Simulated response complete! The component is working correctly.'
        });
        this.$refs.chatWidget.setLoading(false);
      }, 2000);
    },

    clearChat() {
      this.$refs.chatWidget.clearChat();
    },

    addLog(event, data) {
      const timestamp = new Date().toLocaleTimeString();
      this.eventLogs.push({
        id: this.logId++,
        timestamp,
        event,
        data
      });

      // Keep only last 20 logs
      if (this.eventLogs.length > 20) {
        this.eventLogs.shift();
      }

      // Auto-scroll log
      this.$nextTick(() => {
        const logContent = this.$refs.logContent;
        if (logContent) {
          logContent.scrollTop = logContent.scrollHeight;
        }
      });
    }
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f6f8fa;
  min-height: 100vh;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.app-header h1 {
  color: #24292f;
  margin-bottom: 8px;
}

.app-header p {
  color: #656d76;
  margin: 0;
}

.chat-container {
  height: 500px;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.controls button {
  background: #0078d4;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.controls button:hover {
  background: #106ebe;
}

.event-log {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.event-log h3 {
  margin-top: 0;
  color: #24292f;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 12px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 12px;
}

.log-entry {
  margin-bottom: 4px;
  color: #24292f;
}

.log-content::-webkit-scrollbar {
  width: 6px;
}

.log-content::-webkit-scrollbar-track {
  background: transparent;
}

.log-content::-webkit-scrollbar-thumb {
  background: #d1d9e0;
  border-radius: 3px;
}
</style>
```

## 4. Run the test application

```bash
npm run dev
```

Open your browser to the URL shown (usually http://localhost:5173) to see the ChatWidget component in action!

## 5. Testing Features

The test app provides:

- ✅ Message sending and receiving
- ✅ Loading states with typing indicators
- ✅ Event logging to see component interactions
- ✅ Programmatic message addition
- ✅ Chat clearing functionality
- ✅ Responsive design testing

## 6. Integration with Real Chat APIs

To integrate with a real chat API (like OpenAI, Claude, etc.), modify the `handleMessageSent` method in `App.vue`:

```javascript
async handleMessageSent(event) {
  this.addLog('Message Sent', event.message);
  this.$refs.chatWidget.setLoading(true);

  try {
    // Replace with your actual API call
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: event.message })
    });

    const data = await response.json();

    this.$refs.chatWidget.addMessage({
      type: 'assistant',
      content: data.response
    });
  } catch (error) {
    this.$refs.chatWidget.addMessage({
      type: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.'
    });
  } finally {
    this.$refs.chatWidget.setLoading(false);
  }
}
```

This setup gives you a complete testing environment for the extracted ChatWidget component!
