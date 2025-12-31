import React, { useState } from 'react';
import { Room } from '@/types/chat';
import { DEFAULT_ROOM } from '@/config/rooms';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { ChatRoom } from '../chat/ChatRoom';
import { cn } from '@/lib/utils';

export const AppLayout: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState<Room>(DEFAULT_ROOM);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [sidebarVisible, setSidebarVisible] = useState(true); // desktop

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentRoom={currentRoom}
        onRoomChange={setCurrentRoom}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isVisible={sidebarVisible}
        onToggleVisible={() => setSidebarVisible(!sidebarVisible)}
      />

      {/* Main content */}
      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-out",
        sidebarVisible ? "lg:ml-64" : "lg:ml-0"
      )}>
        {/* Mobile header */}
        <MobileHeader
          room={currentRoom}
          onMenuClick={() => setSidebarOpen(true)}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible(true)}
        />

        {/* Chat room - key forces remount on room change */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatRoom key={currentRoom.id} room={currentRoom} />
        </div>
      </main>
    </div>
  );
};
