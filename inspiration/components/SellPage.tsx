import React, { useState } from 'react';
import { X, Camera, ChevronRight, MapPin, AlertCircle, Trash2 } from 'lucide-react';

interface SellPageProps {
  onClose: () => void;
}

export const SellPage: React.FC<SellPageProps> = ({ onClose }) => {
  const [condition, setCondition] = useState('new');
  const [images, setImages] = useState<string[]>([]); // Mock state
  
  const handleAddImage = () => {
    setImages([...images, 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=200']);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white min-h-screen pb-[90px] font-sans relative z-[60]">
      
      {/* Header - 48px */}
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="pt-safe-top">
          <div className="flex items-center justify-between px-3 h-[48px]">
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full active:bg-zinc-100 text-zinc-900"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
            <h1 className="text-[16px] font-bold text-zinc-900">Нова обява</h1>
            <button className="text-[14px] font-bold text-zinc-400 disabled:opacity-50">
              Запази
            </button>
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="py-4 border-b border-zinc-100">
        <div className="px-4 mb-2 flex items-center justify-between">
           <h3 className="text-[13px] font-bold text-zinc-900">Снимки</h3>
           <span className="text-[11px] text-zinc-500 font-medium">0/10</span>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar px-4 gap-2">
           <button 
             onClick={handleAddImage}
             className="flex-shrink-0 w-[86px] h-[86px] border border-dashed border-zinc-300 rounded-md flex flex-col items-center justify-center gap-1 text-zinc-500 bg-zinc-50 active:bg-zinc-100 transition-all"
           >
              <Camera className="w-5 h-5 stroke-[1.5]" />
              <span className="text-[10px] font-bold">Добави</span>
           </button>

           {images.map((img, idx) => (
             <div key={idx} className="relative flex-shrink-0 w-[86px] h-[86px] rounded-md overflow-hidden bg-zinc-100 border border-zinc-200">
               <img src={img} alt="" className="w-full h-full object-cover" />
               <button 
                 onClick={() => removeImage(idx)}
                 className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full backdrop-blur-sm"
               >
                 <Trash2 className="w-3 h-3" />
               </button>
               {idx === 0 && (
                 <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/80 text-white text-[9px] font-bold text-center py-0.5">
                   КОРИЦА
                 </div>
               )}
             </div>
           ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-4 border-b border-zinc-100 space-y-4">
        <div>
           <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-1.5">Заглавие</label>
           <input 
              type="text" 
              placeholder="Напр. iPhone 13 Pro..." 
              className="w-full h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[15px] font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-0 transition-colors placeholder:text-zinc-400 outline-none"
           />
        </div>
        
        <div>
           <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-1.5">Категория</label>
           <button className="w-full h-[44px] px-3 bg-white border border-zinc-200 rounded-md flex items-center justify-between active:bg-zinc-50 transition-colors text-left group">
              <span className="text-[15px] text-zinc-500 font-medium group-active:text-zinc-900">Избери категория</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
           </button>
        </div>
      </div>

      {/* Condition */}
      <div className="p-4 border-b border-zinc-100">
         <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-2">Състояние</label>
         <div className="grid grid-cols-2 gap-2">
            {['new', 'used'].map((c) => (
              <label 
                key={c}
                className={`
                  flex items-center justify-center h-[40px] rounded-md border cursor-pointer transition-all
                  ${condition === c 
                    ? 'bg-zinc-900 text-white border-zinc-900 font-bold' 
                    : 'bg-white text-zinc-600 border-zinc-200 font-medium active:bg-zinc-50'}
                `}
                onClick={() => setCondition(c)}
              >
                 <span className="text-[13px]">{c === 'new' ? 'Ново' : 'Използвано'}</span>
              </label>
            ))}
         </div>
      </div>

      {/* Price */}
      <div className="p-4 border-b border-zinc-100">
         <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-1.5">Цена</label>
         <div className="relative">
            <input 
              type="number" 
              placeholder="0.00" 
              className="w-full h-[52px] pl-4 pr-12 bg-white border border-zinc-200 rounded-md text-[22px] font-bold text-zinc-900 focus:border-zinc-900 focus:ring-0 transition-colors placeholder:text-zinc-300 outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[16px] font-bold text-zinc-400">лв.</span>
         </div>
      </div>

      {/* Description */}
      <div className="p-4 border-b border-zinc-100">
         <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-1.5">Описание</label>
         <textarea 
            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-md text-[14px] text-zinc-900 min-h-[120px] focus:bg-white focus:border-zinc-900 outline-none resize-none"
            placeholder="Опиши състоянието, размерите и забележките..."
         ></textarea>
      </div>

      {/* Location */}
      <div className="p-4">
         <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-1.5">Локация</label>
         <div className="flex items-center gap-2 px-3 py-3 bg-blue-50/50 border border-blue-100 rounded-md text-blue-800">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="text-[13px] font-bold">София, Център</span>
            <button className="ml-auto text-[11px] font-bold underline decoration-blue-300 underline-offset-2">Промени</button>
         </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 pb-safe z-50">
        <div className="p-4">
          <button className="w-full h-[48px] bg-zinc-900 text-white font-bold text-[15px] rounded-md flex items-center justify-center active:scale-[0.99] transition-transform">
            Публикувай обявата
          </button>
        </div>
      </div>

    </div>
  );
};