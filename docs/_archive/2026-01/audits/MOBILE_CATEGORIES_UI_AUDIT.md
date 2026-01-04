# Mobile Categories Page UI/UX Audit

**Date:** January 3, 2026  
**Component:** `/categories` page mobile experience  
**Auditor:** Senior Frontend UI/UX Expert

---

## Executive Summary

The mobile categories page has **4 stacked navigation rows** before product content appears. This is a **vertical space crime** that pushes products below the fold unnecessarily. The UX is confused about hierarchy, mixing pills and circles inconsistently.

---

## Current Implementation Analysis

### Navigation Stack (Top to Bottom)

| Row | Component | Height | Purpose |
|-----|-----------|--------|---------|
| 1 | Quick Pills (L0) | ~44px | Root categories: Fashion, Electronics, etc. |
| 2 | Circle Subcategories (L1/L2) | ~80px | Visual drill-down: Men, Women, Shoes |
| 3 | L3 Pills | ~44px | Deep categories: Boots, Sneakers, etc. |
| 4 | Filter + Sort Bar | ~40px | Filters dropdown + Sort dropdown |

**Total Navigation Height: ~208px before product grid**

### Screenshot Breakdown

```
┌─────────────────────────────────┐
│ Header: Treido + icons          │  ~56px
├─────────────────────────────────┤
│ Search bar                      │  ~48px  
├─────────────────────────────────┤
│ [Мода] [Електроника] [Дом...]   │  ~44px  ← L0 Quick Pills
├─────────────────────────────────┤
│ ← ○ ○ ○ ○ ○                     │  ~80px  ← L1/L2 Circle Subcategories
│   Облекло Обувки Аксесоари      │         (with back button)
├─────────────────────────────────┤
│ [Всички] [Спортни] [Ботуши]     │  ~44px  ← L3 Pills
├─────────────────────────────────┤
│ [Филтри ↑] [Препоръчани ↓] 12   │  ~40px  ← Filter/Sort toolbar
├─────────────────────────────────┤
│ Product Grid starts here...     │
└─────────────────────────────────┘
```

**Above-the-fold space consumed: ~312px (header + search + 4 nav rows)**  
**On a 667px iPhone SE screen: 47% of viewport is navigation!**

---

## UI/UX Issues Identified

### 🔴 Critical: Vertical Space Abuse

**Problem:** Users scroll through 4 rows of navigation before seeing products.

**Evidence from code:**
```tsx
// mobile-home-tabs.tsx lines 548-680
{showL0Tabs && l0Style === "pills" && (
  <div className="sticky z-30 bg-background border-b border-border/40"
       style={{ top: headerHeight }}>
    <div className="flex items-center gap-1.5 ... px-(--page-inset) py-2">
```

```tsx
// Line 731-780: Circle subcategories container  
<div className="bg-background border-b border-border/40 py-2.5">
```

```tsx
// Line 792-824: L3 Pills container
{showPills && (
  <div className="bg-background py-3 px-(--page-inset) ...">
```

```tsx
// Line 830-843: Filter toolbar
{l0Style === "pills" && (
  <div className="bg-background border-b border-border/40 px-(--page-inset) py-2">
```

**Each section adds its own padding + borders = cumulative waste.**

---

### 🔴 Critical: Inconsistent Category Depth Visualization

**Problem:** L3 categories use pills, but L1/L2 use circles. This is backwards.

**UX Principle:** The *broadest* categories should be visually *largest* (circles with images). The *deepest/most specific* should be compact (pills).

**Current Reality:**
- L0 (Fashion, Electronics) → Pills ❌ (should be prominent)
- L1/L2 (Shoes, Clothing) → Circles ✓ (correct)
- L3 (Boots, Sneakers) → Pills ✓ (correct)

**But:** The L0 pills look identical to L3 pills! Users can't tell which level they're at.

---

### 🟠 High: Filter Button Sizing is Wrong

**Problem:** Filter and Sort buttons are `h-8` (32px) with `rounded-full` - they look like chunky action buttons, not filter toggles.

**From mobile-filters.tsx:**
```tsx
<Button
  variant="ghost"
  onClick={() => setIsOpen(true)}
  className={cn(
    "h-8 w-full rounded-full px-3 gap-1 text-sm bg-secondary...",
```

**From sort-select.tsx:**
```tsx
<SelectTrigger 
  className={cn(
    "!h-8 !py-0 px-3 w-full rounded-full gap-1",
```

**Issues:**
1. `w-full` on both = they each try to take 50% of row width
2. `rounded-full` = looks like primary CTA buttons, not filter controls
3. `h-8` = too tall for a utility control
4. Icons (Sliders, ArrowsDownUp) are 14px = awkwardly small in 32px containers

**Comparison:**
- Amazon: Filter/Sort are compact text links, ~28px height
- eBay: Inline text "Sort: Best Match ▼" without button styling
- This app: Two chunky rounded buttons fighting for space

---

### 🟠 High: Results Count is Disconnected

**Current:** `12` appears as tiny text at the end of filter row.
```tsx
<span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
  <ListBullets size={14} aria-hidden="true" />
  {activeFeed.products.length}
</span>
```

**Problem:** 
1. It shows `products.length` (loaded count) not `totalProducts` (actual count)
2. Users don't know if 12 means "12 total" or "12 loaded so far"
3. Icon (ListBullets) is weird - why a list icon for count?

---

### 🟡 Medium: Back Button in Circles Row is Confusing

**From category-circles.tsx:**
```tsx
{activeL1 && (
  <div className="flex flex-col items-center gap-1 shrink-0 snap-start w-14">
    <button onClick={onBack}
            className="size-12 rounded-full bg-brand/10 border border-brand/20...">
      <CaretLeft size={22} weight="bold" className="text-brand" />
    </button>
    <span className="text-2xs ...">Назад</span>
  </div>
)}
```

**Issues:**
1. Back button looks like another category circle (same size, same row)
2. `size-12` (48px) back button mixed with `size-[var(--category-circle-mobile)]` (52px) circles
3. Users may accidentally tap it thinking it's a category

---

### 🟡 Medium: Sticky Stacking Creates Scroll Jank

**Problem:** Three sticky elements stack on scroll:
1. L0 Pills row: `sticky z-30` at `top: headerHeight`
2. Circles row: Not sticky (good)
3. Filter row: Not sticky (good)

But when L3 Pills appear, there's no sticky behavior, so users lose context of which L2 they selected.

---

### 🟡 Medium: Padding Inconsistencies

**L0 Pills:** `py-2` (8px vertical) + `gap-1.5` (6px between pills)
**Circles:** `py-2.5` (10px vertical) + `gap-2` (8px between circles)  
**L3 Pills:** `py-3` (12px vertical) + `gap-2` (8px between pills)
**Filter bar:** `py-2` (8px vertical)

**No consistent rhythm!**

---

## Specific Recommendations

### 1. Collapse Navigation Layers (CRITICAL)

**Option A: Unified Tab Bar**
Replace 4 rows with 2:
- Row 1: Sticky L0 tabs (text-only, underline style) 
- Row 2: Context-aware content strip (shows circles OR pills based on depth)

```tsx
// PROPOSED: Unified navigation with depth awareness
<div className="sticky top-[headerHeight] z-30 bg-background">
  {/* L0: Always visible, compact */}
  <div className="flex gap-3 overflow-x-auto px-2 py-1.5 border-b">
    {categories.map(cat => (
      <button className={cn(
        "text-sm whitespace-nowrap pb-1.5",
        isActive ? "text-primary border-b-2 border-primary font-medium" : "text-muted-foreground"
      )}>
        {cat.name}
      </button>
    ))}
  </div>
  
  {/* Depth indicator: circles when shallow, pills when deep */}
  {activeL1 && !activeL2 && (
    <CircleSubcategories circles={l2Categories} /> 
  )}
  {activeL2 && (
    <div className="flex gap-1.5 overflow-x-auto px-2 py-1.5">
      {l3Categories.map(cat => <CompactPill {...cat} />)}
    </div>
  )}
</div>

{/* Filter bar - not in sticky group */}
<div className="flex items-center gap-2 px-2 py-1.5 border-b">
  <MobileFilters />
  <SortSelect />
  <span className="text-xs text-muted-foreground ml-auto">{totalProducts}</span>
</div>
```

**Space saved:** ~60-80px

---

### 2. Fix Filter Button Sizing (HIGH)

**Before:**
```tsx
className="h-8 w-full rounded-full px-3 gap-1 text-sm bg-secondary"
```

**After:**
```tsx
className={cn(
  "h-7 flex-1 max-w-[140px] rounded-lg px-2.5 gap-1.5",  // Compact, bounded width
  "text-xs font-medium",  // Smaller text
  "bg-muted/50 border border-border/40",  // Subtle, not chunky
  "hover:bg-muted active:bg-muted/70"
)}
```

**Key changes:**
- `h-8` → `h-7` (28px, more compact)
- `rounded-full` → `rounded-lg` (less button-like)
- `w-full` → `flex-1 max-w-[140px]` (bounded, don't fight for space)
- `bg-secondary` → `bg-muted/50` (more subtle)

---

### 3. Make L0 Categories More Prominent

**Current pills (L0):** Same visual weight as L3 pills.

**Recommendation:** Use underline tabs for L0 (like Amazon's department tabs):

```tsx
// L0 should use tab variant, not pill variant
<CategoryNavItem
  variant="tab"  // NOT "pill"
  isActive={isActive}
  className="px-0"  // No padding, just text + underline
>
  {categoryName}
</CategoryNavItem>
```

Or if keeping pills, make L0 pills larger:

```tsx
// L0 pills: larger, with icons
className="h-8 px-4 text-sm font-medium gap-2"  // Include category icon

// L3 pills: smaller, text-only  
className="h-6 px-2.5 text-xs"  // Current compact style
```

---

### 4. Unified Padding Rhythm

**Establish consistent spacing:**

```css
/* In globals.css @theme */
--nav-row-padding: 0.5rem;  /* 8px - consistent vertical padding */
--nav-item-gap: 0.375rem;   /* 6px - consistent gap between items */
```

```tsx
// All navigation rows use same rhythm:
<div className="px-(--page-inset) py-[var(--nav-row-padding)] 
                flex gap-[var(--nav-item-gap)] overflow-x-auto">
```

---

### 5. Better Back Button

**Current:** Looks like a category circle.

**Proposed:** Make it clearly a back navigation:

```tsx
{activeL1 && (
  <button
    onClick={onBack}
    className={cn(
      "shrink-0 h-8 px-3 rounded-lg",  // Pill shape, not circle
      "bg-muted/50 text-muted-foreground",
      "flex items-center gap-1.5",
      "text-xs font-medium"
    )}
  >
    <CaretLeft size={14} weight="bold" />
    {locale === "bg" ? "Назад" : "Back"}
  </button>
)}
```

This makes it clearly a navigation control, not a category option.

---

### 6. Fix Results Count

**Current:** Shows loaded count, not total.

**Fix in mobile-home-tabs.tsx:**
```tsx
// Pass totalProducts from server, not activeFeed.products.length
<span className="text-xs text-muted-foreground">
  {totalProducts.toLocaleString()} {t('results')}
</span>
```

---

## Code Changes Summary

### mobile-home-tabs.tsx

```tsx
// CHANGE 1: Reduce L0 pills height
// Before:
<div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-(--page-inset) py-2">

// After:
<div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-(--page-inset) py-1.5">

// CHANGE 2: Reduce circles container padding
// Before:
<div className={cn("bg-background border-b border-border/40", "py-2.5")}>

// After:
<div className={cn("bg-background border-b border-border/40", "py-2")}>

// CHANGE 3: Reduce L3 pills padding
// Before:
<div className="bg-background py-3 px-(--page-inset)...">

// After:
<div className="bg-background py-2 px-(--page-inset)...">

// CHANGE 4: Compact filter toolbar
// Before:
<div className="bg-background border-b border-border/40 px-(--page-inset) py-2">

// After:
<div className="bg-background border-b border-border/40 px-(--page-inset) py-1.5">
```

### mobile-filters.tsx

```tsx
// Before:
<Button
  className={cn(
    "h-8 w-full rounded-full px-3 gap-1 text-sm bg-secondary..."
  )}
>

// After:
<Button
  className={cn(
    "h-7 flex-1 rounded-lg px-2.5 gap-1.5 text-xs font-medium",
    "bg-muted/50 border border-border/40",
    filterCount > 0 && "bg-primary/10 text-primary border-primary/20"
  )}
>
```

### sort-select.tsx

```tsx
// Before:
<SelectTrigger 
  className={cn(
    "!h-8 !py-0 px-3 w-full rounded-full gap-1",
    "bg-secondary..."
  )}
>

// After:
<SelectTrigger 
  className={cn(
    "!h-7 !py-0 px-2.5 flex-1 rounded-lg gap-1.5",
    "bg-muted/50 border border-border/40",
    isSorted && "bg-primary/10 text-primary border-primary/20"
  )}
>
```

---

## Visual Comparison

### Before (Current)
```
Header:      56px
Search:      48px
L0 Pills:    44px  ← py-2 (8+8) + h-7 (28)
Circles:     80px  ← py-2.5 (10+10) + size-12 (48) + label
L3 Pills:    48px  ← py-3 (12+12) + h-8 (24)
Filter:      40px  ← py-2 (8+8) + h-8 (32)
─────────────────
TOTAL:       316px before content
```

### After (Proposed)
```
Header:      56px
Search:      48px
L0 Tabs:     36px  ← py-1.5 (6+6) + text (24)
Circles:     70px  ← py-2 (8+8) + size-11 (44) + label
L3 Pills:    38px  ← py-2 (8+8) + h-6 (22)
Filter:      34px  ← py-1.5 (6+6) + h-7 (22)
─────────────────
TOTAL:       282px before content (SAVED: 34px)
```

**Or with Option A (collapsed navigation):**
```
Header:      56px
Search:      48px
Unified Nav: 70px  ← Single row with tabs + context strip
Filter:      34px  
─────────────────
TOTAL:       208px before content (SAVED: 108px)
```

---

## Priority Implementation Order

1. **P0 (Do Now):** Reduce padding on all navigation rows - quick wins
2. **P0 (Do Now):** Fix filter/sort button sizing  
3. **P1 (This Sprint):** Differentiate L0 visual style from L3
4. **P2 (Next Sprint):** Consider collapsing to unified navigation bar
5. **P3 (Backlog):** Fix results count to show total, not loaded count

---

## Conclusion

The categories page suffers from **navigation obesity** - too many rows, too much padding, inconsistent visual hierarchy. The UX doesn't clearly communicate category depth, and the filter controls look like primary CTAs instead of utility toggles.

**Quick wins (30 mins):** Reduce padding, shrink filter buttons.  
**Medium effort (2-4 hours):** Differentiate L0 from L3 visual style.  
**Larger refactor (1-2 days):** Collapse to unified navigation component.

The goal should be: **Products above the fold on iPhone SE (667px viewport)**.
