"use client";

import { useState } from "react";
import { conditionOptions, formatOptions, sellFormSchemaV4, defaultSellFormValuesV4 } from "@/lib/sell/schema-v4";
import { CategorySelector } from "./category-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, Camera, Check, Package, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

import type { CategoryNode } from "./category-selector";

type SellFormData = z.infer<typeof sellFormSchemaV4>;

const STEPS = [
  { id: "photos", title: "Photos" },
  { id: "category", title: "Category" },
  { id: "details", title: "Details" },
  { id: "price", title: "Price" },
  { id: "review", title: "Review" },
] as const;

type StepId = typeof STEPS[number]["id"];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export function SellForm({ categories }: { categories: CategoryNode[] }) {
  const [currentStep, setCurrentStep] = useState<StepId>("photos");
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<Partial<SellFormData>>(defaultSellFormValuesV4);
  
  // Fake state for demo photos
  const [localPhotos, setLocalPhotos] = useState<string[]>([]);

  // Helper to update form data
  const updateData = (data: Partial<SellFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  const addFakePhoto = () => {
    if (localPhotos.length >= 10) return;
    // ...existing code...
    const colors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200'];
    const newPhoto = `photo-${Date.now()}`; 
    setLocalPhotos([...localPhotos, newPhoto]);
    
    // Update actual form data schema too
    const currentImages = formData.images || [];
    updateData({ images: [...currentImages, { url: 'https://placehold.co/400', isPrimary: currentImages.length === 0 }] });
  };
  
  const removePhoto = (index: number) => {
    const newPhotos = [...localPhotos];
    newPhotos.splice(index, 1);
    setLocalPhotos(newPhotos);
    
    // ...existing code...
    const currentImages = formData.images || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    updateData({ images: newImages });
  };


  // Step Navigation
  const goToNext = () => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setDirection(1);
      const next = STEPS[currentIndex + 1];
      if (next) setCurrentStep(next.id);
      window.scrollTo(0, 0);
    }
  };

  const goToPrev = () => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setDirection(-1);
      const prev = STEPS[currentIndex - 1];
      if (prev) setCurrentStep(prev.id);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F2F2F7] dark:bg-background flex flex-col font-sans overflow-hidden">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b px-4 h-12 flex items-center justify-between">
        <div className="flex items-center flex-1">
          {currentStep !== "photos" && (
            <button 
              onClick={goToPrev} 
              className="flex items-center text-primary -ml-2 pr-4 active:opacity-50 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="text-[17px]">Back</span>
            </button>
          )}
        </div>
        
        <div className="flex-1 text-center font-semibold text-[17px]">
           {STEPS.find(s => s.id === currentStep)?.title}
        </div>
        
        <div className="flex-1 flex justify-end">
           <Button variant="ghost" size="sm" className="text-primary font-medium hover:text-primary hover:bg-transparent px-0 text-[17px]">
             Exit
           </Button>
        </div>
      </header>
      
      {/* Progress Bar (refined) */}
      <div className="h-[2px] bg-transparent w-full">
         <div 
           className="h-full bg-primary transition-all duration-300 ease-out" 
           style={{ width: `${((STEPS.findIndex(s => s.id === currentStep) + 1) / STEPS.length) * 100}%` }}
         />
      </div>

      <main className="flex-1 pb-32 relative">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        
        {/* STEP: PHOTOS */}
        {currentStep === "photos" && (
          <motion.div
            key="photos"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-6 pt-6 px-4"
          >
            <div className="space-y-1 text-center pb-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Add Photos</h2>
              <p className="text-[15px] text-muted-foreground">Add up to 12 photos. First is main.</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={addFakePhoto}
                className="aspect-square rounded-xl bg-background border border-border shadow-sm active:bg-muted transition-colors flex flex-col items-center justify-center gap-1 group"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                   <Camera className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[13px] font-medium text-foreground">Add</span>
              </button>
              
               {localPhotos.map((photo, i) => (
                 <div key={photo} className="aspect-square rounded-xl bg-muted/20 border border-border/50 relative overflow-hidden group shadow-sm">
                    {/* Simulated Image */}
                    <div className={cn("absolute inset-0 flex items-center justify-center text-muted-foreground/30 bg-white dark:bg-muted")}>
                       <Package className="h-8 w-8" />
                    </div>
                    
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-[2px] text-white text-[10px] py-0.5 text-center font-medium">Main Photo</span>
                    )}
                    
                    <button 
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 h-5 w-5 bg-black/40 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                 </div>
               ))}
               
               {/* Empty slots */}
               {Array.from({ length: Math.max(0, 3 - localPhotos.length) }).map((_, i) => (
                 <div key={`empty-${i}`} className="aspect-square rounded-xl bg-muted/5 border border-dashed border-muted-foreground/20" />
               ))}
            </div>
          </motion.div>
        )}

        {/* STEP: CATEGORY */}
        {currentStep === "category" && (
          <motion.div
            key="category"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col h-full pt-4"
          >
            <div className="px-4 pb-4">
               <h2 className="text-2xl font-bold text-center">Which Category?</h2>
            </div>
            
            <div className="border rounded-xl overflow-hidden bg-background shadow-sm mx-4">
               <CategorySelector 
                  categories={categories}
                  selectedId={formData.categoryId ?? ""}
                  onSelect={(cat, path) => {
                    updateData({ 
                      categoryId: cat.id, 
                      categoryPath: path 
                    });
                    setTimeout(() => goToNext(), 150);
                  }}
               />
            </div>
          </motion.div>
        )}

        {/* STEP: DETAILS */}
        {currentStep === "details" && (
          <motion.div
            key="details"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-6 pt-6 px-4"
          >
            <div className="space-y-1 text-center pb-2">
              <h2 className="text-2xl font-bold text-foreground">Details</h2>
            </div>

            <div className="bg-background rounded-xl overflow-hidden shadow-sm divide-y divide-border/60 border border-border/50">
               <div className="flex flex-col px-4 py-2">
                 <Input 
                    id="title" 
                    placeholder="Title" 
                    className="border-none shadow-none focus-visible:ring-0 p-0 h-10 text-[17px] font-normal placeholder:text-muted-foreground"
                    value={formData.title ?? ""}
                    onChange={e => updateData({ title: e.target.value })}
                 />
               </div>
               
               <div className="flex flex-col px-4 py-3">
                 <Textarea 
                    id="desc" 
                    placeholder="Description (Optional)" 
                    className="border-none shadow-none focus-visible:ring-0 p-0 min-h-[120px] resize-none text-[17px] font-normal placeholder:text-muted-foreground leading-relaxed"
                    value={formData.description ?? ""}
                    onChange={e => updateData({ description: e.target.value })}
                 />
               </div>
            </div>
          
           <div className="space-y-2">
             <Label className="text-[13px] uppercase tracking-wider text-muted-foreground font-medium ml-4">Condition</Label>
             <div className="bg-background rounded-xl overflow-hidden shadow-sm divide-y divide-border/60 border border-border/50">
               {conditionOptions.map((opt) => (
                 <label 
                   key={opt.value}
                   className={cn(
                     "flex items-center justify-between p-4 active:bg-muted/30 transition-colors cursor-pointer",
                   )}
                 >
                   <span className="text-[17px] text-foreground">{opt.label}</span>
                   {formData.condition === opt.value && (
                     <Check className="h-5 w-5 text-primary" />
                   )}
                   <input 
                      type="radio" 
                      name="condition" 
                      value={opt.value}
                      className="sr-only"
                      checked={formData.condition === opt.value}
                      onChange={() => updateData({ condition: opt.value })}
                    />
                 </label>
               ))}
             </div>
           </div>
        </motion.div>
        )}

        {/* STEP: PRICE */}
        {currentStep === "price" && (
          <motion.div
            key="price"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-6 pt-6 px-4"
          >
            <div className="space-y-1 text-center pb-4">
              <h2 className="text-2xl font-bold text-foreground">Set Price</h2>
            </div>

            <div className="bg-background p-1 rounded-lg border shadow-sm grid grid-cols-2 gap-1 mb-6">
              {formatOptions.map(opt => {
                const isSelected = formData.format === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => updateData({ format: opt.value })}
                    className={cn(
                       "flex items-center justify-center py-1.5 rounded-md text-[15px] font-medium transition-all duration-200",
                       isSelected 
                        ? "bg-white dark:bg-muted text-foreground shadow-sm" 
                        : "text-muted-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="bg-background rounded-xl overflow-hidden shadow-sm divide-y divide-border/60 border border-border/50">
               <div className="p-4 flex items-center justify-between">
                 <span className="text-[17px] text-foreground">Price</span>
                 <div className="flex items-center gap-1">
                   <Input 
                     type="number" 
                     inputMode="decimal"
                     placeholder="$0"
                     className="border-none shadow-none focus-visible:ring-0 p-0 h-auto text-[17px] text-right w-32 placeholder:text-muted-foreground bg-transparent text-primary font-semibold" 
                     value={formData.price ?? ""}
                     onChange={e => updateData({ price: e.target.value })}
                   />
                 </div>
               </div>
               
               <div className="p-4 flex items-center justify-between active:bg-muted/30 transition-colors cursor-pointer">
                 <span className="text-[17px] text-foreground">Shipping</span>
                 <div className="flex items-center gap-2 text-muted-foreground/60">
                    <span className="text-[17px] text-foreground">
                      {formData.shippingPrice ? `$${formData.shippingPrice}` : 'Calculated'}
                    </span>
                    <ChevronRight className="h-5 w-5 opacity-40" />
                 </div>
               </div>
            </div>
            
            <div className="px-4">
              <p className="text-[13px] text-muted-foreground text-center">
                Similar items sell for <span className="text-foreground font-medium">$45 - $60</span>
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP: REVIEW */}
        {currentStep === "review" && (
          <motion.div
            key="review"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8 pt-12 px-6 flex flex-col items-center"
          >
            <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mb-2 ring-8 ring-green-500/5">
              <Check className="h-12 w-12" />
            </div>
            
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Ready?</h2>
              <p className="text-[17px] text-muted-foreground">
                Your listing is ready to go live.
              </p>
            </div>
            
            <div className="w-full bg-background rounded-2xl border shadow-sm p-4 flex gap-4 items-start">
               <div className="h-24 w-24 bg-muted/50 rounded-lg shrink-0 flex items-center justify-center text-muted-foreground/20">
                  <Package className="h-10 w-10" />
               </div>
               <div className="py-1">
                  <h3 className="font-semibold text-[17px] leading-tight">{formData.title || "Untitled Listing"}</h3>
                  <p className="text-xl font-bold mt-2 text-primary">{formData.price ? `$${formData.price}` : "—"}</p>
                  <div className="flex gap-2 mt-3">
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground">
                       {formData.condition ? conditionOptions.find(c => c.value === formData.condition)?.label : "New"}
                     </span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        </AnimatePresence>
      </main>

      {/* Footer Area - Sticky Bottom Action */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/40">
        <div className="max-w-md mx-auto">
           <Button 
             size="lg" 
             className="w-full text-[17px] h-14 font-semibold rounded-xl shadow-lg shadow-primary/20"
             onClick={goToNext}
           >
             {currentStep === "review" ? "Publish Listing" : "Continue"}
           </Button>
        </div>
      </footer>
    </div>
  );
}


