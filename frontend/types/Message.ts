export interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export interface ConversationState {
  messages: Message[];
  isTyping: boolean;
  currentQuestionIndex: number;
}
