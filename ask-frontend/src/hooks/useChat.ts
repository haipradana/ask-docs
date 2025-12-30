import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ChatState, Room } from '@/types/chat';
import { sendMessage } from '@/lib/api';

type ChatHistory = Record<string, Message[]>;

export function useChat(currentRoom: Room) {
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const messages = chatHistory[currentRoom.id] || [];

  const addMessage = useCallback((roomId: string, message: Message) => {
    setChatHistory(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), message],
    }));
  }, []);

  const updateLastMessage = useCallback((roomId: string, updates: Partial<Message>) => {
    setChatHistory(prev => {
      const roomMessages = prev[roomId] || [];
      if (roomMessages.length === 0) return prev;
      
      const updatedMessages = [...roomMessages];
      updatedMessages[updatedMessages.length - 1] = {
        ...updatedMessages[updatedMessages.length - 1],
        ...updates,
      };
      
      return {
        ...prev,
        [roomId]: updatedMessages,
      };
    });
  }, []);

  const send = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    addMessage(currentRoom.id, userMessage);

    // Add placeholder for AI response
    const aiMessageId = crypto.randomUUID();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    addMessage(currentRoom.id, aiMessage);

    setIsLoading(true);

    try {
      const response = await sendMessage({
        room: currentRoom.id,
        message: content.trim(),
      });

      // Map sources to display strings
      const mappedSources = response.sources?.map((source: any) => {
        // If source has filename, use it; otherwise use a preview of the text
        if (source.filename) {
          return source.filename;
        }
        if (source.source) {
          return source.source;
        }
        // Fallback to text preview (first 50 chars)
        return source.text?.slice(0, 50) + '...' || 'Unknown source';
      });

      updateLastMessage(currentRoom.id, {
        content: response.answer,
        sources: mappedSources,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);
      updateLastMessage(currentRoom.id, {
        content: 'Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentRoom.id, isLoading, addMessage, updateLastMessage]);

  const clearChat = useCallback(() => {
    setChatHistory(prev => ({
      ...prev,
      [currentRoom.id]: [],
    }));
    setError(null);
  }, [currentRoom.id]);

  return {
    messages,
    isLoading,
    error,
    send,
    clearChat,
  };
}
