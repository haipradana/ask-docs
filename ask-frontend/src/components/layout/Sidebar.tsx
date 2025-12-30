import React from 'react';
import { Room } from '@/types/chat';
import { ROOMS } from '@/config/rooms';
import { cn } from '@/lib/utils';
import { PanelLeftClose, Bot } from 'lucide-react';

interface SidebarProps {
  currentRoom: Room;
  onRoomChange: (room: Room) => void;
  isOpen: boolean;
  onClose: () => void;
  isVisible: boolean;
  onToggleVisible: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoom,
  onRoomChange,
  isOpen,
  onClose,
  isVisible,
  onToggleVisible,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50',
          'w-72 lg:w-64 flex flex-col',
          'bg-gradient-to-b from-[hsl(220,60%,15%)] via-[hsl(270,60%,35%)] to-[hsl(340,80%,50%)] border-r border-white/10',
          'transition-transform duration-300 ease-out',
          // Mobile: use isOpen
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: use isVisible
          'lg:translate-x-0',
          isVisible ? 'lg:ml-0' : 'lg:-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Bot className="w-6 h-6 text-white" />
          <button
            onClick={onToggleVisible}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors hidden lg:block"
            title="Sembunyikan sidebar"
          >
            <PanelLeftClose className="w-5 h-5 text-white/70" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            title="Tutup"
          >
            <PanelLeftClose className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin p-3">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider px-3 mb-2">
            Ruang Chat
          </p>
          <ul className="space-y-1">
            {ROOMS.map((room) => {
              const isActive = currentRoom.id === room.id;
              return (
                <li key={room.id}>
                  <button
                    onClick={() => {
                      onRoomChange(room);
                      onClose();
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                      'text-left transition-all duration-200',
                      isActive
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        isActive && 'text-white'
                      )}>
                        {room.name}
                      </p>
                      <p className="text-xs text-white/50 truncate">
                        {room.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4">
          <div className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
            <p className="text-xs text-white/70">
              ask your document
            </p>
            <p className="text-xs text-white/50">
              ©2025 Pradana Yahya
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
