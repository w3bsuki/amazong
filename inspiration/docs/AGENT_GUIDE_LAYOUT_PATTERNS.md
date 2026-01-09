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
