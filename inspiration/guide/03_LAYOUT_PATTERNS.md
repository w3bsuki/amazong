# 03. Layout Patterns (High Density)

**Role:** UI Developer
**Context:** Implementing the "Technical Utility" layout structure.

## 1. The "48px Rhythm" (Vertical Harmony)
To create a native feel, all major vertical anchors must align.

*   **Header Height:** `h-[48px]` (Flex `items-center`).
*   **Bottom Nav Height:** `h-[48px]`.
*   **Primary Button Height:** `h-[48px]` (in sticky footers).
*   **Standard Button:** `h-[40px]` or `h-[44px]`.

## 2. The "Double Decker" Navigation (Focus Mode)
This pattern solves "Horizontal Cramping" when navigating deep hierarchies (Gender -> Dept -> Category -> SubCategory).

**State A: Top Level (Root)**
*   **Row 1:** Gender Tabs (`h-[44px]`).
*   **Row 2:** Department Circles (`h-[80px]`).

**State B: Deep Dive (Focus Mode)**
When a user selects a Department (L2), the UI transforms:
*   **Gender Tabs:** HIDDEN.
*   **Row 1 (Context Stack):** A dedicated row showing the path back.
    *   Contains: `[Back Button]` `[Active Category Pill]`.
    *   Background: `bg-zinc-50` or `bg-white`.
*   **Row 2 (Options Deck):** A dedicated row for the *next* choices.
    *   Contains: Horizontal scroll of pills.
    *   Width: 100% of screen.
    *   Background: `bg-white`.

**Why?** This prevents the "Active Pill" from eating up 50% of the screen width, leaving no room for the actual options.

## 3. The "Data Grid" (Product Feed)
In a high-density layout, gaps are minimized to `gap-2` (8px).

```tsx
<div className="grid grid-cols-2 gap-2 px-3 pb-safe-bottom">
  {items.map(item => (
    // Product Card
    <div className="group border border-border rounded-md bg-white overflow-hidden shadow-none active:border-zinc-400 transition-colors">
       {/* Image 1:1 Aspect Ratio */}
       <div className="aspect-square bg-secondary relative">
          <img src="..." className="object-cover" />
       </div>
       {/* Content - Compact Padding */}
       <div className="p-2 space-y-1">
          <h3 className="text-[13px] font-medium leading-tight truncate">Title</h3>
          <div className="text-[15px] font-bold">120 лв.</div>
       </div>
    </div>
  ))}
</div>
```

## 4. The "Control Bar" (Filters/Sort)
A dense horizontal strip of controls. Use `border-r` dividers between icon groups.

```tsx
<div className="flex items-center gap-2 overflow-x-auto px-3 py-2 border-b border-border bg-background no-scrollbar">
  <button className="h-8 px-2.5 rounded-md border border-border bg-white text-[12px] font-bold whitespace-nowrap shadow-sm">
    FILTERS
  </button>
  <div className="h-4 w-[1px] bg-border mx-1"></div> {/* Vertical Divider */}
  {chips.map(chip => (
    <button className="h-8 px-3 rounded-md border border-border bg-white text-[12px] font-medium whitespace-nowrap">
      {chip.label}
    </button>
  ))}
</div>
```

## 5. The "Property List" (Details)
Dense key-value pairs separated by dotted lines or borders.

```tsx
<div className="space-y-2.5">
   <div className="flex justify-between text-[14px] items-center">
     <span className="text-zinc-500 font-medium">Brand</span>
     {/* Dotted Leader */}
     <div className="flex-1 border-b border-dotted border-zinc-200 mx-3 relative top-1"></div>
     <span className="text-zinc-900 font-bold">Apple</span>
   </div>
</div>
```