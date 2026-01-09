import React from 'react';
import { Settings, MapPin, Star, Box, Heart, CreditCard, ChevronRight, LogOut, HelpCircle, ShoppingBag, CheckCircle2, Package } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 pb-[80px] font-sans">
      
      {/* Header - 48px / px-3 */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-zinc-200">
        <div className="pt-safe-top">
           <div className="h-[48px] px-3 flex items-center justify-between">
              <h1 className="text-[16px] font-bold text-zinc-900">Профил</h1>
              <button className="p-2 -mr-2 text-zinc-900 active:opacity-50">
                 <Settings className="w-5 h-5 stroke-[1.5]" />
              </button>
           </div>
        </div>
      </div>

      {/* Identity Card */}
      <div className="p-3">
         <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-none">
            <div className="flex items-center gap-4">
               <div className="relative">
                  <div className="w-[60px] h-[60px] rounded-full overflow-hidden border border-zinc-100 bg-zinc-100">
                     <img 
                       src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" 
                       alt="Profile" 
                       className="w-full h-full object-cover"
                     />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                     <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
               </div>
               
               <div className="flex-1 min-w-0">
                  <h2 className="text-[16px] font-bold text-zinc-900 leading-tight truncate">Александър Димов</h2>
                  <div className="flex items-center gap-3 mt-1 text-zinc-500">
                     <div className="flex items-center gap-1 text-[12px] font-medium">
                        <Star className="w-3 h-3 fill-zinc-900 text-zinc-900" />
                        <span className="text-zinc-900">4.9</span>
                        <span>(28)</span>
                     </div>
                     <div className="w-[1px] h-3 bg-zinc-300"></div>
                     <div className="flex items-center gap-1 text-[12px]">
                        <MapPin className="w-3 h-3" />
                        <span>София</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
               <div className="flex flex-col items-center justify-center p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                  <span className="text-[16px] font-bold text-zinc-900">12</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Активни</span>
               </div>
               <div className="flex flex-col items-center justify-center p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                  <span className="text-[16px] font-bold text-zinc-900">48</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Продадени</span>
               </div>
               <div className="flex flex-col items-center justify-center p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                  <span className="text-[16px] font-bold text-zinc-900">156</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Следващи</span>
               </div>
            </div>
         </div>
      </div>

      {/* Balance */}
      <div className="px-3 mb-2">
         <div className="bg-white rounded-lg border border-zinc-200 p-3 flex items-center justify-between active:bg-zinc-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-md bg-green-50 flex items-center justify-center text-green-700">
                  <CreditCard className="w-5 h-5 stroke-[2]" />
               </div>
               <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase">Баланс</p>
                  <p className="text-[15px] font-bold text-zinc-900">245.00 лв.</p>
               </div>
            </div>
            <button className="px-3 py-1.5 bg-zinc-900 text-white text-[12px] font-bold rounded-md active:scale-95 transition-transform">
               Теглене
            </button>
         </div>
      </div>

      {/* Menu Groups */}
      <div className="px-3 space-y-3">
         {/* Buying */}
         <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50/50">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Моите покупки</span>
            </div>
            <div className="divide-y divide-zinc-100">
               <MenuItem icon={<ShoppingBag />} label="Поръчки" badge="2" />
               <MenuItem icon={<Heart />} label="Любими обяви" />
               <MenuItem icon={<Package />} label="Доставки" />
            </div>
         </div>

         {/* Selling */}
         <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50/50">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Продажби</span>
            </div>
             <div className="divide-y divide-zinc-100">
               <MenuItem icon={<Box />} label="Моите обяви" />
               <MenuItem icon={<CreditCard />} label="Плащания и промотиране" />
            </div>
         </div>

         {/* Account */}
         <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50/50">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Акаунт</span>
            </div>
             <div className="divide-y divide-zinc-100">
               <MenuItem icon={<HelpCircle />} label="Помощ и контакти" />
               <div className="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-zinc-50 transition-colors">
                  <LogOut className="w-[18px] h-[18px] text-red-500 stroke-[1.5]" />
                  <span className="text-[14px] font-medium text-red-500">Изход</span>
               </div>
            </div>
         </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8 opacity-40">
         <p className="text-[10px] font-bold text-zinc-900">TREIDO v1.0.4</p>
      </div>

    </div>
  );
};

const MenuItem: React.FC<{ icon: React.ReactNode, label: string, badge?: string }> = ({ icon, label, badge }) => {
   return (
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer active:bg-zinc-50 transition-colors group">
         <div className="flex items-center gap-3.5">
            {React.cloneElement(icon as React.ReactElement<any>, {
               className: "w-[18px] h-[18px] text-zinc-400 group-hover:text-zinc-900 transition-colors stroke-[1.5]"
            })}
            <span className="text-[14px] font-medium text-zinc-900">{label}</span>
         </div>
         <div className="flex items-center gap-2">
            {badge && (
               <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm min-w-[18px] text-center">
                  {badge}
               </span>
            )}
            <ChevronRight className="w-4 h-4 text-zinc-300" />
         </div>
      </div>
   );
};