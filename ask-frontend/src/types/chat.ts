export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
}

export interface Room {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatRequest {
  room: string;
  message: string;
}

export interface ChatResponse {
  answer: string;
  sources?: any[]; // Array of payload objects from backend
}
