# 🧩 COMPONENT PATTERNS

These are the "Blueprints" for complex UI elements. Copy these structures exactly.

## 1. THE "SMART ANCHOR" NAVIGATION (Unified Row)

**Problem:** Deep navigation (Gender -> Category -> Subcategory) usually requires multiple stacked rows, taking up too much vertical space.
**Solution:** A single "Morphing Row" that contains both the "Back" button (Anchor) and the "Next Options" (Siblings).

**Visual Structure:**
1.  **Anchor (Left):** A solid black pill that acts as the Back button for the current context.
2.  **Siblings (Right):** A scrollable list of white pills for the next level options.

```tsx
<div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
  
  {/* ROW 1: GLOBAL HEADER (48px) */}
  <div className="flex items-center justify-between px-3 h-[48px]">
     {/* Back Button, Title, Search */}
  </div>

  {/* ROW 2: SMART NAV ROW (48px) - BG Zinc-50 */}
  <div className="bg-zinc-50/90 backdrop-blur-md border-b border-zinc-200">
      <div className="flex items-center px-3 h-[48px] gap-2 overflow-x-auto no-scrollbar">
          
          {/* A. THE ANCHOR (Only shows if depth > 0) */}
          {/* Visual: Black Background, White Text, Arrow Left */}
          {hasParent && (
             <button className="flex-shrink-0 h-[32px] pl-2 pr-3.5 bg-zinc-900 text-white rounded-full flex items-center gap-1.5 shadow-sm">
                <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                <span className="text-[13px] font-bold">{parentName}</span>
             </button>
          )}

          {/* B. THE OPTIONS (Siblings) */}
          {/* Visual: White Background, Border Zinc-200 */}
          {currentOptions.map(opt => (
             <button className="whitespace-nowrap h-[32px] px-4 bg-white border border-zinc-200 rounded-full text-[13px] font-semibold text-zinc-600">
                {opt.name}
             </button>
          ))}
      </div>
  </div>
</div>
```

## 2. THE DATA GRID (Product Feed)

**Key Traits:** Tight gaps (`gap-2`), Flat borders, Square images.

```tsx
<div className="grid grid-cols-2 gap-2 px-3">
  {products.map(product => (
    <div className="group border border-zinc-200 bg-white rounded-md p-2 active:border-zinc-400 transition-colors">
       {/* Image: Aspect Square, Zinc-100 placeholder */}
       <div className="aspect-square bg-zinc-100 rounded-sm relative overflow-hidden mb-2">
          <img src={product.img} className="object-cover w-full h-full" />
       </div>
       
       {/* Info: Dense Text */}
       <h3 className="text-[13px] font-medium leading-tight line-clamp-2">
         {product.title}
       </h3>
       <div className="mt-1 font-bold text-[15px]">
         {product.price}
       </div>
    </div>
  ))}
</div>
```

## 3. THE "IOS" LIST ITEM (Settings/Profile)

**Key Traits:** Full width with internal padding, Separators, Chevron right.

```tsx
<div className="bg-white border-y border-zinc-200 divide-y divide-zinc-100">
   <button className="w-full flex items-center justify-between px-4 py-3 active:bg-zinc-50">
      <div className="flex items-center gap-3">
         <Icon className="text-zinc-500" />
         <span className="text-[15px] font-medium text-zinc-900">Label</span>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-300" />
   </button>
   {/* Repeat */}
</div>
```