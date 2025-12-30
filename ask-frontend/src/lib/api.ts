import { ChatRequest, ChatResponse } from '@/types/chat';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      room: request.room,
      question: request.message, // Map message to question for backend
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
