# 03. Layout Patterns (High Density)

**Role:** UI Developer
**Context:** Implementing the "Technical Utility" layout structure.

## 1. The "Data Grid" (Product Feed)
In a high-density layout, gaps are minimized.

```tsx
<div className="grid grid-cols-2 gap-2 px-2 pb-safe-bottom">
  {items.map(item => (
    // Product Card
    <div className="group border border-border rounded-md bg-white overflow-hidden">
       {/* Image 1:1 Aspect Ratio */}
       <div className="aspect-square bg-secondary relative">
          <img src="..." className="object-cover" />
       </div>
       {/* Content - Compact Padding */}
       <div className="p-2.5">
          <h3 className="text-sm font-medium leading-tight truncate">Title</h3>
          <p className="text-xs text-muted-foreground mt-1">Meta</p>
          <div className="mt-2 text-sm font-bold">120 лв.</div>
       </div>
    </div>
  ))}
</div>
```

## 2. The "Control Bar" (Filters/Sort)
A dense horizontal strip of controls.

```tsx
<div className="flex items-center gap-2 overflow-x-auto px-4 py-2 border-b border-border bg-background">
  <button className="h-8 px-3 rounded-sm border border-border bg-secondary text-xs font-medium whitespace-nowrap">
    Filter
  </button>
  <div className="h-4 w-[1px] bg-border mx-1"></div> {/* Vertical Divider */}
  {chips.map(chip => (
    <button className="h-8 px-3 rounded-sm border border-dashed border-border text-xs font-medium whitespace-nowrap">
      {chip.label}
    </button>
  ))}
</div>
```

## 3. The "Property List" (Details)
Dense key-value pairs separated by borders.

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

## 4. Sticky Header Pattern
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

## 5. Fixed Action Footer
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

## 6. Horizontal Scroll Snap (Carousels)
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

## 7. The "Form Group" Pattern (Settings/Selling)
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

## 8. Grid Product Feed
Two-column grid with gap.

```tsx
<div className="grid grid-cols-2 gap-x-3 gap-y-6 px-3">
  {/* Product Cards */}
</div>
```
