import React, { useState } from 'react';
import { CATEGORIES } from '../constants';

interface CategoryStripProps {
  onSelect?: (id: string, name: string) => void;
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({ onSelect }) => {
  const [activeId, setActiveId] = useState('all');

  const handleSelect = (id: string, name: string) => {
    setActiveId(id);
    if (onSelect && id !== 'all') {
      onSelect(id, name);
    }
  };

  return (
    <div className="pt-2 pb-0">
      <div className="flex overflow-x-auto no-scrollbar px-3 gap-3.5 border-b border-transparent">
        {CATEGORIES.map((cat) => {
          const isActive = activeId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id, cat.name)}
              className={`
                flex-shrink-0 relative text-[13px] font-medium pb-2.5 transition-colors
                ${isActive 
                  ? 'text-zinc-900' 
                  : 'text-zinc-500 hover:text-zinc-700'}
              `}
            >
              {cat.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-900 rounded-t-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};