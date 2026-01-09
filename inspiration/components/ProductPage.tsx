import React, { useState } from 'react';
import { ArrowLeft, Share2, Heart, ShieldCheck, MapPin, Star, MessageCircle, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product, onBack }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const images = [product.imageUrl, product.imageUrl, product.imageUrl];
  const specs = {
    'Състояние': product.condition === 'New' ? 'Ново' : 'Използвано',
    'Марка': 'Apple', 
    'Цвят': 'Graphite',
    'Памет': '256GB',
    'Доставка': 'Еконт / Спиди'
  };

  const descriptionText = product.description || `Продавам телефона, защото си взех по-нов модел. Работи перфектно, без драскотини по екрана. Винаги е носен с калъф и протектор.\n\nБатерията е на 89% живот. Идва с оригиналната кутия и кабел за зареждане. Няма iCloud заключване и работи с всички оператори.\n\nМоже да се види и тества на място в София. За страната изпращам с Еконт/Спиди с опция преглед и тест. Бартери не ме интересуват. Цената е крайна.`;
  const TRUNCATE_LENGTH = 150;
  const shouldTruncate = descriptionText.length > TRUNCATE_LENGTH;
  const displayedText = !isExpanded && shouldTruncate 
    ? descriptionText.slice(0, TRUNCATE_LENGTH) + '...' 
    : descriptionText;
  const sellerName = product.seller?.name || "Иван Петров";
  const sellerAvatar = product.seller?.avatarUrl || "https://i.pravatar.cc/150?u=a042581f4e29026024d";

  return (
    <div className="bg-white min-h-screen pb-[80px] font-sans relative z-50">
      
      {/* Header - Solid & Reliable - 48px Standard */}
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="pt-safe-top">
          <div className="flex items-center justify-between px-3 h-[48px]">
            <button 
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center text-zinc-900 active:bg-zinc-100 transition-colors rounded-full -ml-1"
            >
              <ArrowLeft className="w-6 h-6 stroke-[1.5]" />
            </button>
            
            <div className="flex items-center gap-2 opacity-0 animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-forwards" style={{animationDelay: '100ms'}}>
                <span className="text-[14px] font-bold text-zinc-900 truncate max-w-[150px]">{product.title}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button className="w-9 h-9 flex items-center justify-center text-zinc-900 active:bg-zinc-100 transition-colors rounded-full">
                <Share2 className="w-[22px] h-[22px] stroke-[1.5]" />
              </button>
              <button className="w-9 h-9 flex items-center justify-center text-zinc-900 active:bg-zinc-100 transition-colors rounded-full">
                <MoreHorizontal className="w-[22px] h-[22px] stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="relative w-full aspect-square bg-zinc-50 border-b border-zinc-200">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full">
          {images.map((img, idx) => (
            <div key={idx} className="flex-shrink-0 w-full h-full snap-center">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        
        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${activeImage === idx ? 'bg-white scale-125' : 'bg-white/50'}`} 
            />
          ))}
        </div>
      </div>

      {/* Info Block - Tight Padding (py-4) */}
      <div className="px-4 py-4 border-b border-zinc-100">
        <div className="flex items-start justify-between gap-4">
           <h1 className="text-[18px] leading-snug font-bold text-zinc-900 line-clamp-2 tracking-tight">{product.title}</h1>
           <button className="text-zinc-400 active:text-red-600 active:scale-110 transition-transform pt-1">
             <Heart className={`w-6 h-6 stroke-[1.5] ${product.isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
           </button>
        </div>
        
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-[24px] font-extrabold text-zinc-900 tracking-tight">{product.price}</span>
          <span className="text-[16px] font-bold text-zinc-900">{product.currency}</span>
        </div>
        
        <div className="mt-3 flex items-center gap-2 text-[13px] text-zinc-500 font-medium">
          <span className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
             <MapPin className="w-3.5 h-3.5 stroke-[1.5]" /> {product.location}
          </span>
          <span className="text-zinc-300">|</span>
          <span>{product.postedAt}</span>
        </div>
      </div>

      {/* Protection Badge */}
      <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
           </div>
           <div>
             <h3 className="text-[13px] font-bold text-zinc-900">Защита на купувача</h3>
             <p className="text-[12px] text-zinc-500 leading-none mt-0.5">
               Парите ви са защитени до преглед на пратката.
             </p>
           </div>
        </div>
      </div>

      {/* Seller - Tight Padding */}
      <div className="px-4 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
             <img src={sellerAvatar} alt="Seller" className="w-full h-full object-cover" />
           </div>
           
           <div className="flex-1 min-w-0">
             <div className="flex items-center gap-1.5">
                <h4 className="text-[15px] font-bold text-zinc-900 truncate">{sellerName}</h4>
                <CheckCircle2 className="w-4 h-4 text-blue-600 fill-white" />
             </div>
             <div className="flex items-center gap-1 text-[13px] text-zinc-500">
               <Star className="w-3.5 h-3.5 fill-zinc-900 text-zinc-900" />
               <span className="font-bold text-zinc-900">4.9</span>
               <span>(24 отзива)</span>
             </div>
           </div>
           
           <button className="text-[13px] font-bold text-zinc-900 border border-zinc-200 px-4 py-2 rounded-lg bg-white active:bg-zinc-50">
              Профил
           </button>
        </div>
      </div>

      {/* Specs - Compact List */}
      <div className="px-4 py-4 border-b border-zinc-100">
        <h3 className="text-[13px] font-bold text-zinc-900 mb-3 uppercase tracking-wide">Детайли</h3>
        <div className="space-y-2.5">
           {Object.entries(specs).map(([key, value]) => (
             <div key={key} className="flex justify-between text-[14px] items-center">
               <span className="text-zinc-500 font-medium">{key}</span>
               <div className="flex-1 border-b border-dotted border-zinc-200 mx-3 relative top-1"></div>
               <span className="text-zinc-900 font-bold">{value}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-4 border-b border-zinc-100">
        <h3 className="text-[13px] font-bold text-zinc-900 mb-2 uppercase tracking-wide">Описание</h3>
        <div className="relative">
          <p className="text-[15px] text-zinc-600 leading-relaxed whitespace-pre-line font-normal">
            {displayedText}
          </p>
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[14px] font-bold text-zinc-900 mt-2 hover:underline active:text-zinc-600 transition-colors"
            >
              {isExpanded ? 'Скрий' : 'Виж още'}
            </button>
          )}
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 pb-safe z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <button className="flex-[0.4] h-[50px] flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white text-zinc-900 font-bold text-[15px] active:bg-zinc-50 transition-colors">
            <MessageCircle className="w-5 h-5 stroke-[2]" />
            Чат
          </button>
          <button className="flex-1 h-[50px] flex items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-[16px] active:scale-[0.98] transition-transform shadow-sm">
            Купи сега
          </button>
        </div>
      </div>
    </div>
  );
};