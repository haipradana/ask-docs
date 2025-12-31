import { useState, useEffect, useRef } from 'react';

interface UseTypingEffectOptions {
  text: string;
  speed?: number; // milliseconds per character
  enabled?: boolean;
}

export function useTypingEffect({ 
  text, 
  speed = 20, 
  enabled = true 
}: UseTypingEffectOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Reset when text changes
    if (!enabled) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    indexRef.current = 0;
    setDisplayedText('');
    setIsTyping(true);

    const typeNextChar = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
        timeoutRef.current = setTimeout(typeNextChar, speed);
      } else {
        setIsTyping(false);
      }
    };

    // Start typing after a small delay
    timeoutRef.current = setTimeout(typeNextChar, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, enabled]);

  return { displayedText, isTyping };
}