import React, { useRef, useEffect } from 'react';
import { Room } from '@/types/chat';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { AlertCircle, Trash2 } from 'lucide-react';

interface ChatRoomProps {
  room: Room;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ room }) => {
  const { messages, isLoading, error, send, clearChat } = useChat(room);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#1a1a18]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-6 py-4 bg-[#1a1a18]">
        {messages.length === 0 ? (
          <EmptyState room={room} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLoading={isLoading && index === messages.length - 1 && message.role === 'assistant'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 md:mx-6 mb-2 px-4 py-2 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Koneksi bermasalah. Silakan coba lagi.</span>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={send} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
