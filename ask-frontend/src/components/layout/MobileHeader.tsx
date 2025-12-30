import React from 'react';
import { Menu, PanelLeftOpen } from 'lucide-react';
import { Room } from '@/types/chat';

interface MobileHeaderProps {
  room: Room;
  onMenuClick: () => void;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  room, 
  onMenuClick,
  sidebarVisible,
  onToggleSidebar 
}) => {
  return (
    <header className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[hsl(220,60%,15%)] via-[hsl(270,60%,35%)] to-[hsl(340,80%,50%)] border-b border-white/10 transition-all duration-300 ease-in-out">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>
      
      {/* Desktop: show sidebar toggle when sidebar is hidden */}
      <button
        onClick={onToggleSidebar}
        className={`p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hidden lg:block ${
          sidebarVisible ? 'opacity-0 w-0 p-0 overflow-hidden' : 'opacity-100 w-auto'
        }`}
        title="Tampilkan sidebar"
      >
        <PanelLeftOpen className="w-5 h-5 text-white" />
      </button>
      
      {/* Left: Website name/logo */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm font-medium text-white">
          ask.pradanayahya.me
        </span>
      </div>
      
      {/* Right: Room name */}
      <div className="flex items-center">
        <span className="text-base font-semibold truncate max-w-[200px] text-white">
          {room.name.toLowerCase()}
        </span>
      </div>
    </header>
  );
};
