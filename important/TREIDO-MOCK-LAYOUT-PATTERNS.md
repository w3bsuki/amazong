# Treido Mock — Layout Patterns

> High-density, mobile-first layout patterns extracted from treido-mock.

---

## 1. The "Data Grid" (Product Feed)

In a high-density layout, gaps are minimized. Two-column grid with `gap-2`.

```tsx
<div className="grid grid-cols-2 gap-2 px-3 pb-safe">
  {items.map(item => (
    <div key={item.id} className="group border border-border rounded-md bg-white overflow-hidden">
      {/* Image 1:1 Aspect Ratio */}
      <div className="aspect-square bg-secondary relative">
        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
        {item.tag && (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-zinc-900 text-white text-[10px] font-bold uppercase rounded-sm">
            {item.tag}
          </span>
        )}
      </div>
      {/* Content - Compact Padding */}
      <div className="p-2.5">
        <h3 className="text-sm font-medium leading-tight truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{item.location}</p>
        <div className="mt-2 text-sm font-bold">{item.price} лв.</div>
      </div>
    </div>
  ))}
</div>
```

---

## 2. The "Control Bar" (Filters/Sort)

A dense horizontal strip of scrollable controls.

```tsx
<div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-2 border-b border-border bg-background">
  {/* Filter Button */}
  <button className="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-white text-xs font-semibold whitespace-nowrap">
    <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2]" />
    Filters
  </button>
  
  {/* Vertical Divider */}
  <div className="h-4 w-[1px] bg-border mx-1 flex-shrink-0" />
  
  {/* Filter Chips */}
  {chips.map(chip => (
    <button 
      key={chip.id}
      className={`h-8 px-3 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
        chip.active 
          ? 'bg-zinc-900 text-white border border-zinc-900' 
          : 'border border-dashed border-border bg-white'
      }`}
    >
      {chip.label}
    </button>
  ))}
</div>
```

---

## 3. The "Property List" (Details/Specs)

Dense key-value pairs separated by borders.

```tsx
<div className="px-4 py-4 border-b border-zinc-100">
  <h3 className="text-[13px] font-bold text-zinc-900 mb-3 uppercase tracking-wide">
    Details
  </h3>
  <div className="space-y-2">
    {Object.entries(specs).map(([key, value]) => (
      <div key={key} className="flex justify-between text-[13px]">
        <span className="text-zinc-500">{key}</span>
        <span className="text-zinc-900 font-semibold">{value}</span>
      </div>
    ))}
  </div>
</div>
```

**Alternative with borders:**
```tsx
<div className="border-y border-border divide-y divide-border bg-background">
  <div className="flex justify-between py-3 px-4">
    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Brand</span>
    <span className="text-sm font-medium">Apple</span>
  </div>
  <div className="flex justify-between py-3 px-4">
    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Condition</span>
    <span className="text-sm font-medium">New</span>
  </div>
</div>
```

---

## 4. The Sticky Header Pattern

Headers should be sticky, semi-transparent (glassmorphism), and sit on top of content.

```tsx
<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200 supports-[backdrop-filter]:bg-white/80">
  <div className="pt-safe-top">
    <div className="h-[48px] flex items-center justify-between px-4">
      <button className="w-9 h-9 flex items-center justify-center text-zinc-900 active:bg-zinc-100 rounded-full">
        <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
      </button>
      <h1 className="text-[16px] font-bold text-zinc-900">Page Title</h1>
      <button className="w-9 h-9 flex items-center justify-center text-zinc-900 active:bg-zinc-100 rounded-full">
        <Settings className="w-5 h-5 stroke-[1.5]" />
      </button>
    </div>
  </div>
</header>
```

---

## 5. The Fixed Action Footer

Used for "Add to Cart", "Apply Filters", "Chat". Must handle iPhone Home Bar (Safe Area).

```tsx
<footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50">
  <div className="flex items-center gap-2 px-4 py-2 pb-safe">
    {/* Secondary Action */}
    <button className="flex-1 h-[44px] flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white text-zinc-900 font-bold text-[14px] active:bg-zinc-50 transition-colors">
      <MessageCircle className="w-4 h-4 stroke-[1.5]" />
      Chat
    </button>
    {/* Primary Action */}
    <button className="flex-1 h-[44px] flex items-center justify-center rounded-md bg-zinc-900 text-white font-bold text-[14px] active:opacity-90 transition-opacity">
      Buy Now
    </button>
  </div>
</footer>
```

**Single button variant:**
```tsx
<footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 z-50">
  <div className="p-4 pb-safe">
    <button className="w-full h-[48px] bg-zinc-900 text-white font-bold text-[15px] rounded-lg flex items-center justify-center active:opacity-90">
      Apply Filters
    </button>
  </div>
</footer>
```

---

## 6. Horizontal Scroll Snap (Carousels)

Used for Categories, Image Galleries, Filter Chips.

```tsx
<div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 gap-3">
  {items.map(item => (
    <div key={item.id} className="snap-center flex-shrink-0">
      {/* Card or Category Button */}
      <button className="h-[70px] w-[90px] bg-zinc-50 rounded-md border border-zinc-100 p-3 flex flex-col justify-between items-start active:bg-zinc-100 transition-colors">
        <span className="font-bold text-zinc-900 text-[14px]">{item.name}</span>
        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-zinc-200">
          <ArrowRight className="w-3 h-3 text-zinc-900" />
        </div>
      </button>
    </div>
  ))}
</div>
```

**Image Gallery variant:**
```tsx
<div className="relative w-full aspect-square bg-zinc-50 border-b border-zinc-200">
  <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full">
    {images.map((img, idx) => (
      <div key={idx} className="flex-shrink-0 w-full h-full snap-center">
        <img src={img} alt="" className="w-full h-full object-cover" />
      </div>
    ))}
  </div>
  {/* Pagination Dots */}
  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full">
    {images.map((_, idx) => (
      <div 
        key={idx} 
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          idx === activeImage ? 'bg-white' : 'bg-white/40'
        }`}
      />
    ))}
  </div>
</div>
```

---

## 7. The "Form Group" Pattern (Settings/Selling)

Group inputs with dividers, rather than separate cards.

```tsx
<div className="border-b border-zinc-100 py-4 px-4">
  <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-1.5">
    Category
  </label>
  <div className="flex items-center justify-between text-base">
    <span className="text-zinc-900">Electronics</span>
    <ChevronRight className="w-5 h-5 text-zinc-400" />
  </div>
</div>

<div className="p-4 border-b border-zinc-100">
  <label className="block text-[11px] font-bold text-zinc-900 uppercase tracking-wide mb-1.5">
    Price
  </label>
  <div className="relative">
    <input 
      type="number" 
      placeholder="0.00" 
      className="w-full h-[52px] pl-4 pr-12 bg-white border border-zinc-200 rounded-md text-[22px] font-bold text-zinc-900 focus:border-zinc-900 focus:ring-0 transition-colors placeholder:text-zinc-300 outline-none"
    />
    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[16px] font-bold text-zinc-400">лв.</span>
  </div>
</div>
```

---

## 8. Menu/Settings List

```tsx
<div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
  {/* Section Header */}
  <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50/50">
    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
      Account
    </span>
  </div>
  {/* Menu Items */}
  <div className="divide-y divide-zinc-100">
    <button className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-zinc-50 transition-colors">
      <Box className="w-[18px] h-[18px] text-zinc-600 stroke-[1.5]" />
      <span className="text-[14px] font-medium text-zinc-900">My Listings</span>
      <ChevronRight className="w-5 h-5 text-zinc-400 ml-auto" />
    </button>
    <button className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-zinc-50 transition-colors">
      <CreditCard className="w-[18px] h-[18px] text-zinc-600 stroke-[1.5]" />
      <span className="text-[14px] font-medium text-zinc-900">Payments</span>
      <ChevronRight className="w-5 h-5 text-zinc-400 ml-auto" />
    </button>
  </div>
</div>
```

---

## 9. Mobile App Wrapper

For desktop preview, constrain to mobile width.

```tsx
<div className="min-h-screen bg-zinc-100 flex justify-center font-sans antialiased text-zinc-900">
  <div className="w-full max-w-[430px] bg-white min-h-screen relative border-x border-zinc-200 pb-safe shadow-none">
    {/* App Content */}
  </div>
</div>
```

---

## 10. Stats Grid

For profile pages or dashboards.

```tsx
<div className="grid grid-cols-3 gap-2 mt-5">
  <div className="flex flex-col items-center justify-center p-2 bg-zinc-50 rounded-lg border border-zinc-100">
    <span className="text-[16px] font-bold text-zinc-900">12</span>
    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Active</span>
  </div>
  <div className="flex flex-col items-center justify-center p-2 bg-zinc-50 rounded-lg border border-zinc-100">
    <span className="text-[16px] font-bold text-zinc-900">48</span>
    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Sold</span>
  </div>
  <div className="flex flex-col items-center justify-center p-2 bg-zinc-50 rounded-lg border border-zinc-100">
    <span className="text-[16px] font-bold text-zinc-900">156</span>
    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Following</span>
  </div>
</div>
```

---

## Key Spacing Rules

| Pattern | Gap | Padding |
|---------|-----|---------|
| Product Grid | `gap-2` | `px-3` |
| Filter Strip | `gap-2` | `px-4 py-2` |
| Menu Items | `gap-3` | `px-4 py-3.5` |
| Form Fields | n/a | `p-4` per field |
| Stats Grid | `gap-2` | `p-2` per cell |

---

## CSS Utilities Required

```css
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.pt-safe-top { padding-top: env(safe-area-inset-top); }
```
