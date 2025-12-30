import React, { useState, useEffect } from 'react';
import { Room } from '@/types/chat';

interface EmptyStateProps {
  room: Room;
}

const getPhrasesForRoom = (roomName: string) => [
  `tentang ${roomName}`,
  `soal ${roomName}`,
  'apa kek',
  'apa pun', 
  'apa ya',
];

export const EmptyState: React.FC<EmptyStateProps> = ({ room }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = getPhrasesForRoom(room.name);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          // Wait before deleting
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 80 : 150);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhraseIndex]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
      
      

      <span className="text-xl font-medium text-foreground" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        tanya{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a8a] via-[#4338ca] to-[#7c3aed]">
          {displayText}
        </span>
        <span className="animate-pulse text-muted-foreground">|</span>
      </span>
    </div>
  );
};
