import React from 'react';
import { ArrowRight } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  return (
    <div className="px-3 pt-3">
      {/* Banner */}
      <div className="group relative overflow-hidden bg-zinc-900 rounded-md p-4 shadow-none border border-zinc-900 active:opacity-95 transition-all duration-200 cursor-pointer">
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <h2 className="text-[15px] font-bold text-white tracking-tight leading-none">Продай за минути</h2>
            <p className="text-[12px] text-zinc-400 font-medium leading-tight">Освободи място и спечели.</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-zinc-900 transition-all">
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      </div>
    </div>
  );
};