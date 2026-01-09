import React, { useState } from 'react';
import { FILTERS } from '../constants';
import { SlidersHorizontal } from 'lucide-react';

interface FilterStripProps {
  onFilterClick?: () => void;
}

export const FilterStrip: React.FC<FilterStripProps> = ({ onFilterClick }) => {
  const [activeFilter, setActiveFilter] = useState('newest');

  return (
    <div className="w-full overflow-x-auto no-scrollbar pl-3">
      <div className="flex items-center gap-2 pr-3">
        <button 
          onClick={onFilterClick}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-md text-zinc-900 text-[12px] font-semibold whitespace-nowrap active:bg-zinc-50 transition-colors"
        >
           <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2]" />
           <span>Филтри</span>
        </button>
        
        <div className="w-[1px] h-5 bg-zinc-200 mx-1"></div>
        
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all whitespace-nowrap border
                ${isActive 
                  ? 'bg-zinc-900 text-white border-zinc-900' 
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}
              `}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};