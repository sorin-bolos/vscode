import { DefineComponent } from 'vue';

export interface Message {
	id: number;
	type: 'user' | 'assistant';
	content: string;
	timestamp: Date;
}

export interface MessageSentEvent {
	message: string;
	messageObject: Message;
}

export interface ChatWidgetProps {
	title?: string;
	placeholder?: string;
	disabled?: boolean;
}

export interface ChatWidgetMethods {
        addMessage(message: Partial<Message>): void;
        setLoading(loading: boolean): void;
        clearChat(): void;
        copyAll(): void;
}

export interface ChatWidgetEmits {
	'message-sent': (event: MessageSentEvent) => void;
	'message-received': (message: Message) => void;
	'chat-cleared': () => void;
}

declare const ChatWidget: DefineComponent<
	ChatWidgetProps,
	{},
	{},
	{},
	ChatWidgetMethods,
	{},
	{},
	ChatWidgetEmits
>;

export default ChatWidget;
export { ChatWidget };
