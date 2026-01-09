import React from 'react';
import { Search, Heart, ShoppingBag, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="pt-safe-top bg-white border-b border-zinc-200">
      {/* Main Header Bar - Compact 44px */}
      <div className="flex items-center justify-between px-3 h-12">
        {/* Logo - Tracking Tight */}
        <div className="flex items-center gap-2">
           <span className="text-[20px] font-extrabold tracking-tighter text-zinc-900">treido.</span>
        </div>
        
        {/* Action Icons - Stroke 1.5px */}
        <div className="flex items-center gap-1.5">
           <button className="p-2 text-zinc-900 hover:text-zinc-700 active:bg-zinc-100 rounded-md transition-all relative">
             <Bell className="w-[22px] h-[22px] stroke-[1.5]" />
             <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-600 rounded-full ring-2 ring-white"></span>
           </button>
           <button className="p-2 text-zinc-900 hover:text-zinc-700 active:bg-zinc-100 rounded-md transition-all">
             <Heart className="w-[22px] h-[22px] stroke-[1.5]" />
           </button>
           <button className="p-2 text-zinc-900 hover:text-zinc-700 active:bg-zinc-100 rounded-md transition-all -mr-2">
             <ShoppingBag className="w-[22px] h-[22px] stroke-[1.5]" />
           </button>
        </div>
      </div>

      {/* Search Input - High Utility */}
      <div className="px-3 pb-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-[16px] w-[16px] text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full h-[44px] pl-10 pr-4 bg-zinc-100/50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-md text-zinc-900 text-[15px] font-medium placeholder-zinc-400 focus:outline-none transition-all shadow-none"
            placeholder="Търсене на продукти..."
          />
        </div>
      </div>
    </div>
  );
};