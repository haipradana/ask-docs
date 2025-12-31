import React from 'react';
import { Message } from '@/types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Bot } from 'lucide-react';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading }) => {
  const isUser = message.role === 'user';
  const isEmpty = !message.content && isLoading;
  
  // Use typing effect for assistant messages
  const shouldAnimate = !isUser && message.content && !isLoading;
  const { displayedText, isTyping } = useTypingEffect({
    text: message.content,
    speed: 20, // Adjust speed (ms per character)
    enabled: shouldAnimate,
  });

  if (isUser) {
    return (
      <div className="flex justify-end w-full animate-fade-in">
        <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-tr-md px-4 py-3 bg-bubble-user text-foreground animate-slide-in-right">
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in animate-slide-in-left">
      {/* Robot icon */}
      <div className="flex items-center gap-2 mb-2">
        <Bot className="w-5 h-5 text-primary" />
      </div>

      {/* AI content without bubble */}
      <div className="text-foreground">
        {isEmpty ? (
          <div className="flex items-center gap-1.5 py-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: '200ms' }} />
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: '400ms' }} />
          </div>
        ) : (
          <div className="relative">
            <MarkdownRenderer content={shouldAnimate ? displayedText : message.content} />
            {/* Typing cursor */}
            {isTyping && (
              <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-blink" />
            )}
          </div>
        )}

        {/* Sources - only show when typing is complete */}
        {message.sources && message.sources.length > 0 && !isTyping && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-1.5">Sumber:</p>
            <div className="flex flex-wrap gap-1.5">
              {message.sources.map((source, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};