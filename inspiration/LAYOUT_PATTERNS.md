# Agent Pattern Guide: Layouts & Views

## 1. The Sticky Header Pattern
Headers should be sticky, semi-transparent (glassmorphism), and sit on top of content.

```tsx
<header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100">
  <div className="pt-safe-top">
    <div className="h-12 flex items-center px-4">
      {/* Content */}
    </div>
  </div>
</header>
```

## 2. The Fixed Action Footer
Used for "Add to Cart", "Apply Filters", "Chat".
Must handle iPhone Home Bar (Safe Area).

```tsx
<footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
  <div className="p-4 pb-safe-bottom">
    <Button className="w-full h-12 text-[16px] font-bold">
      Primary Action
    </Button>
  </div>
</footer>
```

## 3. Horizontal Scroll Snap (Carousels)
Used for Categories, Image Galleries, Filter Chips.

```tsx
<div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 gap-3">
  {items.map(item => (
    <div key={item.id} className="snap-center flex-shrink-0">
      {/* Card */}
    </div>
  ))}
</div>
```

## 4. The "Form Group" Pattern (Settings/Selling)
Group inputs with dividers, rather than separate cards.

```tsx
<div className="border-b border-gray-100 py-4 px-4">
  <Label className="uppercase text-xs font-bold text-gray-500 mb-2 block">
    Category
  </Label>
  <div className="flex items-center justify-between text-base">
    <span>Electronics</span>
    <ChevronRight className="text-gray-400" />
  </div>
</div>
```

## 5. Grid Product Feed
Two-column grid with gap.

```tsx
<div className="grid grid-cols-2 gap-x-3 gap-y-6 px-3">
  {/* Product Cards */}
</div>
```

## 6. Product Card Pattern
Clean, minimal product cards with proper touch feedback.

```tsx
<div className="group relative">
  {/* Image */}
  <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border border-gray-100">
    <img src={imageUrl} className="w-full h-full object-cover" loading="lazy" />
  </div>
  
  {/* Content */}
  <div className="mt-2 space-y-1">
    <p className="text-[13px] text-gray-900 line-clamp-2">{title}</p>
    <p className="text-[16px] font-extrabold text-gray-900 tracking-tight">
      {price}<span className="text-[14px] font-bold ml-0.5">{currency}</span>
    </p>
    <p className="text-[11px] text-gray-400 truncate">
      {location} • {postedAt}
    </p>
  </div>
</div>
```

## 7. Filter Modal / Bottom Sheet Pattern
Full-height bottom sheet with sticky header and footer.

```tsx
<div className="fixed inset-0 z-[100] flex justify-center items-end">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

  {/* Sheet Container */}
  <div className="relative w-full max-w-[430px] bg-white h-[92vh] rounded-t-xl flex flex-col">
    
    {/* Header - Sticky */}
    <div className="flex items-center justify-between px-4 h-[56px] border-b border-gray-100 flex-shrink-0">
      <button className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100">
        <X className="w-5 h-5 stroke-[2]" />
      </button>
      <h2 className="text-[16px] font-bold text-gray-900">Filters</h2>
      <button className="text-[14px] font-medium text-gray-500">Clear</button>
    </div>

    {/* Scrollable Body */}
    <div className="flex-1 overflow-y-auto">
      {/* Filter sections */}
    </div>

    {/* Footer - Sticky */}
    <div className="border-t border-gray-100 p-4 pb-safe bg-white flex-shrink-0">
      <button className="w-full h-[48px] bg-gray-900 text-white font-bold rounded-lg">
        Show Results
      </button>
    </div>
  </div>
</div>
```

## 8. Category Strip Pattern
Horizontal scrolling category tabs with underline indicator.

```tsx
<div className="overflow-x-auto no-scrollbar border-b border-gray-100">
  <div className="flex items-center gap-4 px-4">
    {categories.map(cat => {
      const isActive = activeCategory === cat.id;
      return (
        <button
          key={cat.id}
          className={`
            flex-shrink-0 relative text-[13px] font-medium pb-2.5 transition-colors
            ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}
          `}
        >
          {cat.name}
          {isActive && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full" />
          )}
        </button>
      );
    })}
  </div>
</div>
```
