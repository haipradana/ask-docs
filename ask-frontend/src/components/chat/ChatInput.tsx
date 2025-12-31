import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  placeholder = 'Ketik pertanyaan Anda...',
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  // Handle focus - scroll input into view
  const handleFocus = useCallback(() => {
    // Small delay to ensure keyboard is shown
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      // Alternative: scroll to bottom of page
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 300); // 300ms delay for keyboard animation
  }, []);

  const handleSubmit = useCallback(() => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  }, [input, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 p-1.5 bg-[#2a2a28] border border-[#3a3a38] rounded-2xl focus-within:border-[hsl(220,70%,45%)] hover:border-[hsl(220,70%,40%)/50] transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className={cn(
            'flex-1 bg-transparent text-foreground placeholder:text-muted-foreground',
            'resize-none outline-none px-2 py-1.5 text-sm md:text-base',
            'scrollbar-thin max-h-[150px]',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-lg transition-all duration-200',
            'bg-gradient-to-r from-[#1e3a8a] via-[#4338ca] to-[#7c3aed] text-white',
            'hover:opacity-90 active:scale-95',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
            input.trim() && !isLoading && 'shadow-[0_0_20px_rgba(124,58,237,0.4)]'
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
      </p>
    </div>
  );
};