import React from 'react';
import { Product } from '../types';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer tap-highlight-transparent flex flex-col gap-2 p-2 bg-white rounded-md border border-zinc-200 active:border-zinc-300 transition-colors"
    >
      {/* Image Container - Technical Radius (rounded-sm) */}
      <div className="relative aspect-square overflow-hidden rounded-sm bg-zinc-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
        
        {/* Tags - Micro Technical Label */}
        {(product.tag || product.condition === 'New') && (
          <div className="absolute top-1.5 left-1.5 flex gap-1 pointer-events-none">
             {product.tag && (
                <span className="bg-zinc-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm leading-none tracking-wide uppercase">
                  {product.tag}
                </span>
             )}
          </div>
        )}
        
        <button 
          className="absolute top-1.5 right-1.5 p-1.5 bg-white/60 backdrop-blur-md rounded-sm border border-white/20 active:bg-white transition-all hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            // handle favorite logic
          }}
        >
          <Heart 
            className={`w-3.5 h-3.5 transition-colors ${product.isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-900'}`} 
            strokeWidth={2} 
          />
        </button>
      </div>

      {/* Content - Dense & Structured */}
      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
            <h3 className="text-[13px] font-medium text-zinc-900 leading-tight line-clamp-2 h-[2.4em]">
            {product.title}
            </h3>
        </div>

        <div>
           <div className="flex items-baseline gap-0.5">
             <span className="text-[15px] font-bold text-zinc-900 tracking-tight">
               {product.price}
             </span>
             <span className="text-[11px] font-bold text-zinc-500">{product.currency}</span>
          </div>
          
          <div className="flex items-center gap-1.5 pt-0.5">
            <p className="text-[10px] text-zinc-400 font-medium truncate max-w-[60px]">
                {product.location}
            </p>
            <span className="w-0.5 h-0.5 rounded-full bg-zinc-300"></span>
            <p className="text-[10px] text-zinc-400 font-medium truncate">
                {product.postedAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};