import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Search, SlidersHorizontal, ChevronDown, ShoppingBag, 
  ArrowUpDown, X, Check, ChevronRight, Home, ChevronLeft, Filter
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { FilterModal } from './FilterModal';
import { FASHION_GROUPS, FASHION_TREE, PRODUCTS } from '../constants';
import { Product } from '../types';

interface CategoryPageProps {
  categoryName: string; // "Мода"
  onBack: () => void;
  onProductSelect: (product: Product) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryName, onBack, onProductSelect }) => {
  // --- Navigation State ---
  // We treat "Gender" just as Level 1 navigation, same as "Computers" inside Electronics.
  const [activeL1, setActiveL1] = useState<string | null>(null); // e.g., 'women'
  const [activeL2, setActiveL2] = useState<string | null>(null); // e.g., 'shoes'
  const [activeL3, setActiveL3] = useState<string | null>(null); // e.g., 'sneakers'
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Data Logic (Unified Tree Traversal) ---
  const isFashion = categoryName === 'Мода';
  
  // 1. Determine Current Items & Context
  let currentPills: { id: string; name: string }[] = [];
  let smartAnchor: { name: string; onClick: () => void } | null = null;
  let pageTitle = categoryName;

  if (isFashion) {
      if (!activeL1) {
          // ROOT LEVEL: Show L1 Options (Women, Men, Kids)
          currentPills = FASHION_GROUPS;
          pageTitle = categoryName;
      } else {
          // L1 SELECTED: Show L2 Options (Clothing, Shoes...)
          const l1Node = FASHION_GROUPS.find(g => g.id === activeL1);
          const l1Children = FASHION_TREE[activeL1] || [];
          
          if (!activeL2) {
              currentPills = l1Children;
              pageTitle = l1Node?.name || categoryName;
              
              // Anchor: Go back to Root
              smartAnchor = {
                  name: l1Node?.name || '',
                  onClick: () => setActiveL1(null)
              };
          } else {
              // L2 SELECTED: Show L3 Options (Sneakers, Boots...)
              const l2Node = l1Children.find(c => c.id === activeL2);
              const l2Children = l2Node?.items || [];
              
              currentPills = l2Children;
              pageTitle = l2Node?.name || pageTitle;

              // Anchor: Go back to L1
              smartAnchor = {
                  name: l2Node?.name || '',
                  onClick: () => setActiveL2(null)
              };
          }
      }
  }

  // --- Handlers ---
  const handlePillClick = (id: string) => {
      // Logic depends on current depth
      if (!activeL1) {
          setActiveL1(id);
      } else if (!activeL2) {
          setActiveL2(id);
      } else {
          // Leaf node selection (L3)
          // Just toggle or set activeL3
          setActiveL3(id === activeL3 ? null : id);
      }

      // Scroll to start on drill down
      requestAnimationFrame(() => {
          if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;
      });
  };

  const handleSystemBack = () => {
      // Handle physical/top back button logic
      if (activeL2) {
          setActiveL2(null);
      } else if (activeL1) {
          setActiveL1(null);
      } else {
          onBack();
      }
  };

  return (
    <div className="bg-white min-h-screen pb-24 font-sans relative">
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={() => setIsFilterOpen(false)} 
      />

      {/* --- STICKY HEADER STACK (Max 2 Rows now!) --- */}
      <div className="sticky top-0 z-40 bg-white shadow-sm transition-all duration-300">
        
        {/* ROW 1: System Header (48px) */}
        <div className="pt-safe-top bg-white relative z-20 border-b border-zinc-100">
          <div className="flex items-center justify-between px-3 h-[48px]">
            <div className="flex items-center gap-2 overflow-hidden">
              <button 
                onClick={handleSystemBack}
                className="w-9 h-9 flex items-center justify-center rounded-full active:bg-zinc-100 transition-colors text-zinc-900 -ml-2"
              >
                <ArrowLeft className="w-[22px] h-[22px] stroke-[2]" />
              </button>
              
              <h1 className="text-[17px] font-bold text-zinc-900 truncate animate-in fade-in duration-300">
                {pageTitle}
              </h1>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="w-9 h-9 flex items-center justify-center rounded-full active:bg-zinc-100 transition-colors text-zinc-900">
                 <Search className="w-[22px] h-[22px] stroke-[1.5]" />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full active:bg-zinc-100 transition-colors text-zinc-900 relative">
                 <ShoppingBag className="w-[22px] h-[22px] stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: UNIFIED SMART NAV (48px) */}
        {/* Shows Pills OR Anchor + Pills */}
        <div className="bg-zinc-50/90 backdrop-blur-md border-b border-zinc-200">
            <div 
                ref={scrollContainerRef}
                className="flex items-center px-3 h-[48px] gap-2 overflow-x-auto no-scrollbar"
            >
                {/* 2.1: THE SMART ANCHOR (Only when drilled down) */}
                {smartAnchor && (
                    <button
                        onClick={smartAnchor.onClick}
                        className="flex-shrink-0 h-[32px] pl-2 pr-3.5 bg-zinc-900 text-white rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-all animate-in fade-in slide-in-from-left-2 duration-200"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                        <span className="text-[13px] font-bold">
                            {smartAnchor.name}
                        </span>
                    </button>
                )}

                {/* 2.2: THE OPTIONS (Siblings) */}
                {currentPills.map((item) => {
                    const isActive = activeL3 === item.id; // Only visual for leaf nodes
                    return (
                        <button
                            key={item.id}
                            onClick={() => handlePillClick(item.id)}
                            className={`
                              whitespace-nowrap h-[32px] px-4 rounded-full text-[13px] font-semibold transition-all border flex-shrink-0 active:scale-95
                              ${isActive 
                                ? 'bg-zinc-900 text-white border-zinc-900' 
                                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'}
                            `}
                        >
                            {item.name}
                        </button>
                    );
                })}
            </div>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      
      {/* Inline Filters (Scrolls away) */}
      <div className="px-3 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
           <button 
             onClick={() => setIsFilterOpen(true)}
             className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[13px] font-bold text-zinc-900 shadow-sm active:bg-zinc-50"
           >
             <Filter className="w-3.5 h-3.5 stroke-[2.5]" />
             Филтри
           </button>
           <div className="w-[1px] h-6 bg-zinc-200 mx-1"></div>
           {['Размер', 'Състояние', 'Цена', 'Цвят'].map((f) => (
               <button 
                key={f}
                onClick={() => setIsFilterOpen(true)}
                className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[13px] font-medium text-zinc-600 active:bg-zinc-50 whitespace-nowrap"
               >
                 {f} <ChevronDown className="w-3 h-3 inline-block ml-1 opacity-50" />
               </button>
           ))}
      </div>

      {/* Grid */}
      <div className="px-3 pb-3">
         {/* Breadcrumb Context (Optional subtle hint) */}
         <div className="mb-3 px-1">
             <span className="text-[11px] font-medium text-zinc-400">
                {activeL1 ? FASHION_GROUPS.find(g => g.id === activeL1)?.name : 'Всички'} 
                {activeL2 && <span className="text-zinc-300"> / </span>}
                {activeL2 && FASHION_TREE[activeL1!]?.find(c => c.id === activeL2)?.name}
             </span>
         </div>

         <div className="grid grid-cols-2 gap-2">
            {[...PRODUCTS, ...PRODUCTS].map((product, idx) => (
               <ProductCard 
                  key={`${product.id}-${idx}`} 
                  product={product} 
                  onClick={() => onProductSelect(product)}
               />
            ))}
         </div>
         
         <div className="py-12 flex flex-col items-center justify-center gap-2 text-center opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
            <p className="text-[11px] text-zinc-400 font-medium tracking-wide uppercase">Край на резултатите</p>
         </div>
      </div>
    </div>
  );
};