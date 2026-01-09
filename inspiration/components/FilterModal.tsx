import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [selectedSort, setSelectedSort] = useState('recom');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['new']);

  if (!isOpen) return null;

  const toggleCondition = (id: string) => {
    if (selectedConditions.includes(id)) {
      setSelectedConditions(selectedConditions.filter(c => c !== id));
    } else {
      setSelectedConditions([...selectedConditions, id]);
    }
  };

  const conditions = [
    { id: 'new', label: 'Ново' },
    { id: 'like_new', label: 'Като ново' },
    { id: 'good', label: 'Добро' },
    { id: 'used', label: 'Използвано' },
  ];

  const sortOptions = [
    { id: 'recom', label: 'Препоръчани' },
    { id: 'newest', label: 'Най-нови' },
    { id: 'price_asc', label: 'Цена: Ниска към Висока' },
    { id: 'price_desc', label: 'Цена: Висока към Ниска' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-end" role="dialog">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-[430px] bg-white h-[92vh] rounded-t-xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Header - Sticky */}
        <div className="flex items-center justify-between px-4 h-[56px] border-b border-gray-100 flex-shrink-0">
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full active:bg-gray-100 text-gray-900"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
          
          <h2 className="text-[16px] font-bold text-gray-900">Филтри</h2>
          
          <button className="text-[14px] font-medium text-gray-500 active:text-gray-900 px-2">
            Изчисти
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          
          {/* Sort Section */}
          <div className="px-4 py-6 border-b border-gray-100">
            <h3 className="text-[14px] font-bold text-gray-900 mb-4">Сортиране</h3>
            <div className="space-y-0.5">
              {sortOptions.map((opt) => (
                <label 
                  key={opt.id} 
                  className="flex items-center justify-between py-2.5 cursor-pointer group active:opacity-60"
                  onClick={() => setSelectedSort(opt.id)}
                >
                  <span className={`text-[15px] ${selectedSort === opt.id ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                    {opt.label}
                  </span>
                  <div className={`
                    w-5 h-5 rounded-full border flex items-center justify-center transition-all
                    ${selectedSort === opt.id 
                      ? 'border-gray-900 bg-gray-900' 
                      : 'border-gray-300 bg-white'}
                  `}>
                    {selectedSort === opt.id && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <div className="px-4 py-6 border-b border-gray-100">
             <h3 className="text-[14px] font-bold text-gray-900 mb-4">Цена (лв.)</h3>
             <div className="flex items-center gap-3">
                <div className="flex-1">
                   <label className="text-[11px] font-semibold text-gray-500 mb-1 block uppercase tracking-wide">От</label>
                   <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full h-[46px] px-3 bg-gray-50 border border-gray-200 rounded-lg text-[16px] font-medium text-gray-900 focus:bg-white focus:border-gray-900 focus:ring-0 transition-colors placeholder:text-gray-300 outline-none" 
                   />
                </div>
                <div className="flex-1">
                   <label className="text-[11px] font-semibold text-gray-500 mb-1 block uppercase tracking-wide">До</label>
                   <input 
                      type="number" 
                      placeholder="max" 
                      className="w-full h-[46px] px-3 bg-gray-50 border border-gray-200 rounded-lg text-[16px] font-medium text-gray-900 focus:bg-white focus:border-gray-900 focus:ring-0 transition-colors placeholder:text-gray-300 outline-none" 
                   />
                </div>
             </div>
          </div>

          {/* Condition Section */}
          <div className="px-4 py-6 border-b border-gray-100">
            <h3 className="text-[14px] font-bold text-gray-900 mb-4">Състояние</h3>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => {
                const isSelected = selectedConditions.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCondition(c.id)}
                    className={`
                      px-4 py-2.5 rounded-lg text-[14px] font-medium border transition-all active:scale-[0.98]
                      ${isSelected 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Mock */}
          <div className="px-4 py-6 mb-safe">
            <h3 className="text-[14px] font-bold text-gray-900 mb-4">Локация</h3>
            <div className="flex flex-col gap-2">
               <label className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="radio" name="loc" className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900" defaultChecked />
                  <span className="text-[15px] text-gray-900">Цялата страна</span>
               </label>
               <label className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="radio" name="loc" className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900" />
                  <span className="text-[15px] text-gray-900">Близо до мен (София)</span>
               </label>
            </div>
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="border-t border-gray-100 p-4 pb-safe bg-white flex-shrink-0">
          <button 
            onClick={onApply}
            className="w-full h-[48px] bg-gray-900 text-white font-bold text-[15px] rounded-lg flex items-center justify-center active:opacity-90 shadow-lg shadow-gray-200"
          >
            Покажи 142 резултата
          </button>
        </div>
      </div>
    </div>
  );
};