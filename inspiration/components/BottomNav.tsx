import React from 'react';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavClick: (view: 'HOME' | 'SEARCH' | 'SELL' | 'CHAT' | 'PROFILE') => void;
  onSellClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavClick, onSellClick }) => {
  return (
    <nav className="fixed bottom-0 z-50 w-full max-w-[430px] mx-auto bg-white border-t border-zinc-200 pb-safe">
      <div className="grid grid-cols-5 h-[48px] items-center">
        
        <NavItem 
           icon={<Home />} 
           label="Начало" 
           isActive={currentView === 'HOME' || currentView === 'CATEGORY'} 
           onClick={() => onNavClick('HOME')}
        />
        
        <NavItem 
           icon={<Search />} 
           label="Търси" 
           isActive={currentView === 'SEARCH'} 
           onClick={() => onNavClick('SEARCH')}
        />
        
        {/* Sell Button - Dead Center via Grid 
            34px Box ensures 7px padding top/bottom (48px container).
            Perfect breathing room.
        */}
        <div className="flex items-center justify-center">
            <button 
              onClick={onSellClick}
              className="flex items-center justify-center w-[34px] h-[34px] bg-zinc-900 rounded-md text-white shadow-sm active:bg-zinc-800 transition-colors"
            >
               <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
        </div>

        <NavItem 
           icon={<MessageCircle />} 
           label="Чат" 
           isActive={currentView === 'CHAT'} 
           onClick={() => onNavClick('CHAT')}
        />
        
        <NavItem 
           icon={<User />} 
           label="Профил" 
           isActive={currentView === 'PROFILE'} 
           onClick={() => onNavClick('PROFILE')}
        />
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  isActive?: boolean;
  onClick: () => void; 
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-[2px] w-full h-full active:opacity-50 transition-opacity`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, {
         className: `w-[20px] h-[20px] transition-all ${isActive ? 'stroke-[2.5] text-zinc-900' : 'stroke-[1.5] text-zinc-400'}`
      })}
      <span className={`text-[9px] font-medium leading-none tracking-tight ${isActive ? 'text-zinc-900 font-bold' : 'text-zinc-400'}`}>
        {label}
      </span>
    </button>
  );
};