import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, ArrowRight, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface SearchPageProps {
  onProductSelect: (product: Product) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onProductSelect }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['iPhone 13', 'Nike', 'PS5']);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const filteredProducts = query.length > 0 
    ? PRODUCTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) 
    : [];

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  const removeRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter(t => t !== term));
  };

  return (
    <div className="min-h-screen bg-white pb-[80px]">
      {/* Header - 48px Base */}
      <div className="sticky top-0 z-50 bg-white border-b border-zinc-200">
        <div className="pt-safe-top px-3 pb-2.5">
          <div className="h-[48px] flex items-center gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`w-4 h-4 transition-colors ${isFocused ? 'text-zinc-900' : 'text-zinc-400'}`} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="block w-full h-[38px] pl-9 pr-10 bg-zinc-100 border border-transparent focus:bg-white focus:border-zinc-900 focus:ring-0 rounded-md text-[15px] text-zinc-900 placeholder-zinc-400 transition-all font-medium outline-none"
                placeholder="Търси марки, продукти..."
              />
              {query && (
                <button 
                  onClick={handleClear}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-zinc-400 active:text-zinc-900"
                >
                  <div className="w-5 h-5 bg-zinc-200 rounded-full flex items-center justify-center">
                    <X className="w-3 h-3 stroke-[3] text-zinc-600" />
                  </div>
                </button>
              )}
            </div>
          </div>
          
          {/* Filters */}
          {query.length > 0 && (
             <div className="flex items-center gap-2 mt-1 overflow-x-auto no-scrollbar pb-1">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white rounded-md text-[12px] font-bold whitespace-nowrap">
                   <SlidersHorizontal className="w-3.5 h-3.5" />
                   Филтри
                </button>
                <div className="w-[1px] h-5 bg-zinc-200 mx-1"></div>
                <button className="px-3 py-1.5 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 bg-white whitespace-nowrap">Цена</button>
                <button className="px-3 py-1.5 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 bg-white whitespace-nowrap">Състояние</button>
                <button className="px-3 py-1.5 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 bg-white whitespace-nowrap">Локация</button>
             </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-2">
        {query.length === 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="px-4 mb-2 flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wide">Скорошни</h3>
                  <button onClick={() => setRecentSearches([])} className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900">Изчисти</button>
                </div>
                <div>
                  {recentSearches.map((term) => (
                    <div 
                      key={term}
                      onClick={() => handleRecentClick(term)}
                      className="flex items-center justify-between px-4 py-2.5 active:bg-zinc-50 transition-colors cursor-pointer border-b border-zinc-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-zinc-400 stroke-[2]" />
                        <span className="text-[14px] font-medium text-zinc-900">{term}</span>
                      </div>
                      <button 
                        onClick={(e) => removeRecent(term, e)}
                        className="p-2 -mr-2 text-zinc-300 active:text-zinc-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 px-4">
               <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                 Популярни сега
               </h3>
               <div className="flex flex-wrap gap-2">
                 {['Зимни якета', 'iPhone 15', 'BMW E46', 'Ски обувки', 'PlayStation 5'].map(tag => (
                   <button 
                     key={tag}
                     onClick={() => setQuery(tag)}
                     className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] font-medium text-zinc-700 active:bg-zinc-200 transition-all"
                   >
                     {tag}
                   </button>
                 ))}
               </div>
            </div>

            <div className="px-4">
               <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-3">Разгледай</h3>
               <div className="grid grid-cols-2 gap-2">
                 {CATEGORIES.slice(1, 5).map(cat => (
                   <button key={cat.id} className="h-[64px] bg-zinc-50 rounded-md border border-zinc-100 p-3 flex flex-col justify-between items-start active:scale-[0.98] transition-transform">
                      <span className="font-bold text-zinc-900 text-[13px]">{cat.name}</span>
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-zinc-200">
                        <ArrowRight className="w-3 h-3 text-zinc-900" />
                      </div>
                   </button>
                 ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="px-3 animate-in fade-in duration-300">
            {filteredProducts.length > 0 ? (
              <>
                 <div className="flex items-center justify-between mb-3 mt-1">
                    <p className="text-[11px] font-medium text-zinc-500">
                      Намерени {filteredProducts.length} резултата
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    {filteredProducts.map(product => (
                       <ProductCard 
                          key={product.id} 
                          product={product} 
                          onClick={() => onProductSelect(product)}
                       />
                    ))}
                 </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100">
                    <Search className="w-6 h-6 text-zinc-300" />
                 </div>
                 <h3 className="text-[15px] font-bold text-zinc-900 mb-1">Няма намерени резултати</h3>
                 <p className="text-[13px] text-zinc-500 max-w-[200px] leading-relaxed">
                    Опитайте с други ключови думи.
                 </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};