import ChatWidget from './ChatWidget.vue';

// Export the component
export default ChatWidget;

// Also export as named export
export { ChatWidget };

// Plugin install function for Vue.use()
export function install(Vue) {
	Vue.component('ChatWidget', ChatWidget);
}

// Auto-install when used in browser
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue);
}
