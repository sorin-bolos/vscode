# VS Code Chat Widget Vue Component

A Vue.js component extracted from VS Code's chat functionality that can be used in external Vue.js projects.

## Installation

```bash
npm install @vscode/chat-widget
```

## Usage

### Vue 3

```vue
<template>
  <div class="app">
    <ChatWidget
      title="AI Assistant"
      placeholder="Ask me anything..."
      @message-sent="handleMessageSent"
      @message-received="handleMessageReceived"
      @chat-cleared="handleChatCleared"
    />
  </div>
</template>

<script>
import { ChatWidget } from '@vscode/chat-widget'

export default {
  name: 'App',
  components: {
    ChatWidget
  },
  methods: {
    handleMessageSent(event) {
      console.log('Message sent:', event.message);
      // Handle the sent message, e.g., send to your chat API
    },
    handleMessageReceived(message) {
      console.log('Message received:', message);
      // Handle received message
    },
    handleChatCleared() {
      console.log('Chat cleared');
      // Handle chat clear event
    }
  }
}
</script>
```

### Vue 2

```vue
<template>
  <div class="app">
    <ChatWidget
      title="AI Assistant"
      placeholder="Ask me anything..."
      @message-sent="handleMessageSent"
      @message-received="handleMessageReceived"
      @chat-cleared="handleChatCleared"
    />
  </div>
</template>

<script>
import ChatWidget from '@vscode/chat-widget'

export default {
  name: 'App',
  components: {
    ChatWidget
  },
  methods: {
    handleMessageSent(event) {
      console.log('Message sent:', event.message);
      // Handle the sent message, e.g., send to your chat API
    },
    handleMessageReceived(message) {
      console.log('Message received:', message);
      // Handle received message
    },
    handleChatCleared() {
      console.log('Chat cleared');
      // Handle chat clear event
    }
  }
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | String | `'Chat'` | The title displayed in the chat header |
| `placeholder` | String | `'Ask a question...'` | Placeholder text for the input field |
| `disabled` | Boolean | `false` | Whether the chat input is disabled |
| `theme` | 'light' \| 'dark' | `'dark'` | Selects the light or dark theme |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `message-sent` | `{ message: String, messageObject: Object }` | Emitted when user sends a message |
| `message-received` | `Object` | Emitted when a response message is added |
| `chat-cleared` | `void` | Emitted when the chat is cleared |

## Methods

The component exposes the following methods via `ref`:

| Method | Parameters | Description |
|--------|------------|-------------|
| `addMessage` | `message: Object` | Programmatically add a message to the chat |
| `setLoading` | `loading: Boolean` | Set the loading state |
| `clearChat` | `void` | Clear all messages |

### Example with ref methods:

```vue
<template>
  <div>
    <ChatWidget ref="chatWidget" @message-sent="handleMessageSent" />
    <button @click="addBotMessage">Add Bot Message</button>
  </div>
</template>

<script>
export default {
  methods: {
    handleMessageSent(event) {
      // Set loading state
      this.$refs.chatWidget.setLoading(true);

      // Simulate API call
      setTimeout(() => {
        // Add response message
        this.$refs.chatWidget.addMessage({
          type: 'assistant',
          content: 'This is a response from the API'
        });

        // Clear loading state
        this.$refs.chatWidget.setLoading(false);
      }, 1000);
    },

    addBotMessage() {
      this.$refs.chatWidget.addMessage({
        type: 'assistant',
        content: 'This is a programmatically added message'
      });
    }
  }
}
</script>
```

## Message Object Structure

```javascript
{
  id: Number,        // Unique message ID
  type: String,      // 'user' or 'assistant'
  content: String,   // Message content (supports HTML)
  timestamp: Date    // Message timestamp
}
```

## Styling

The component comes with default styling that matches VS Code's design system. You can override the styles by targeting the CSS classes:

- `.chat-widget` - Main container
- `.chat-header` - Header area
- `.chat-messages` - Messages container
- `.message` - Individual message
- `.message-user` - User messages
- `.message-assistant` - Assistant messages
- `.chat-input-container` - Input area container
- `.chat-input` - Input textarea
- `.send-button` - Send button

## Development

This component is extracted from VS Code's chat functionality and maintains the same visual design and interaction patterns.

## License

MIT
