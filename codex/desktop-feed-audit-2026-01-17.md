# Desktop Feed Audit — `/demo/desktop`

**Date:** January 17, 2026  
**Status:** Deep Analysis + Recommendations

---

## Executive Summary

The current `/demo/desktop` route (`UnifiedDesktopFeed`) is a solid foundation but has UX gaps that prevent it from being best-in-class. This audit proposes a **contextual drill-down sidebar** pattern inspired by Amazon, eBay, and Vinted desktop browse experiences.

---

## Current State Analysis

### What Works
- ✅ Fixed 224px (`w-56`) sidebar with category list
- ✅ Inverted pill style for active category (`bg-foreground text-background`)
- ✅ Product grid with proper responsive breakpoints
- ✅ Compact sort dropdown (not tabs)
- ✅ View mode toggle (grid/list)
- ✅ Clean semantic tokens, no arbitrary values

### What's Missing
1. **No subcategory drill-down** — User clicks "Fashion" and gets filtered results, but no L1/L2/L3 navigation appears
2. **No breadcrumb context** — Once in a category, user loses hierarchy awareness
3. **Filters are static** — Same Price/Condition filters regardless of category context
4. **Quick pills row is absent** — No gender/style pills for Fashion, no Brand pills for Electronics
5. **Grid density could improve** — Current `lg:grid-cols-4 xl:grid-cols-5` leaves white space on ultra-wide

---

## Proposed UX Architecture

### The Pattern: **Contextual Sidebar Drill-Down**

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Header (search bar)                                                        │
├────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌───────────────────────────────────────────────────────┐│
│ │  SIDEBAR     │  │ MAIN CONTENT                                          ││
│ │              │  │                                                       ││
│ │ ← All        │  │ Fashion × Men × Shoes                    24 listings  ││
│ │              │  │ ┌─────────────────────────────────────────────────┐   ││
│ │ CATEGORIES   │  │ │ Quick Pills: [Sneakers] [Boots] [Sandals] [...]│   ││
│ │ ├ Fashion ✓  │  │ └─────────────────────────────────────────────────┘   ││
│ │ │ └ Men      │  │                                                       ││
│ │ │   └ Shoes ✓│  │ ┌────────────────────────────────────────────────────┐││
│ │ │   └ Tops   │  │ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │       │││
│ │ │ └ Women    │  │ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │       │││
│ │ ├ Electronics│  │ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │       │││
│ │ ├ Home       │  │ └────────────────────────────────────────────────────┘││
│ │ └ ...        │  │                                                       ││
│ │              │  │ ┌───────────────────────────────────────────────────┐ ││
│ │ FILTERS      │  │ │ Load More                                         │ ││
│ │ ├ Price      │  │ └───────────────────────────────────────────────────┘ ││
│ │ ├ Condition  │  │                                                       ││
│ │ ├ Size ★     │  │                                                       ││
│ │ ├ Color ★    │  │                                                       ││
│ │ └ Brand ★    │  └───────────────────────────────────────────────────────┘│
│ └──────────────┘                                                           │
└────────────────────────────────────────────────────────────────────────────┘

★ = contextual filters (appear only when relevant category is selected)
```

### Key Behaviors

1. **Sidebar shows full L0 list initially**  
   User lands on `/demo/desktop` → sees all L0 categories (Fashion, Electronics, Home, etc.)

2. **Click L0 → Expand children inline + filter grid**  
   User clicks "Fashion" → sidebar expands to show L1 (Men, Women, Kids, Unisex) indented
   Grid shows all Fashion products

3. **Click L1 → Expand L2 + update grid**  
   User clicks "Men" → sidebar expands L2 (Shoes, Tops, Bottoms, etc.)
   Grid shows Fashion > Men products

4. **Click L2 → Show L3 as quick pills (not in sidebar)**  
   User clicks "Shoes" → Quick pills appear above grid: [Sneakers] [Boots] [Sandals]
   Sidebar shows full path but doesn't expand L3 (too granular)

5. **Breadcrumb row shows path + clear X**  
   `Fashion × Men × Shoes` — each crumb clickable to go back up
   
6. **Filters become contextual**  
   - Fashion → adds Size, Color, Brand
   - Electronics → adds Storage, Screen Size, RAM
   - Vehicles → adds Year, Mileage, Fuel Type

---

## Perfect Grid: Tailwind v4 Spec

### Current Grid (Good)
```tsx
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
```

### Perfect Grid (Better)
```tsx
// Use container queries + fluid grid for density optimization
className={cn(
  "grid gap-3",
  // Base: 2 cols (very narrow)
  "grid-cols-2",
  // Medium: 3 cols (tablet-ish content area)
  "@md:grid-cols-3",
  // Large: 4 cols (standard desktop)
  "@lg:grid-cols-4",
  // XL: 5 cols (wide desktop)
  "@xl:grid-cols-5",
  // 2XL: 6 cols (ultra-wide, maxes out at 6)
  "@2xl:grid-cols-6"
)}
```

**Why Container Queries (`@`)?**  
The grid is inside a flex container that shrinks when sidebar is present. Media queries see the viewport, but container queries see the actual content area. This prevents underfill on wide screens with sidebar open.

### Card Aspect Ratio
Keep `aspect-square` for images. The current ProductCard is well-designed.

### Gap
`gap-3` (12px) is correct per DESIGN.md. Don't change.

---

## Sidebar Width Analysis

| Site | Sidebar Width | Notes |
|------|---------------|-------|
| Amazon | 220px | Dense tree, filters inline |
| eBay | 240px | Collapsible sections |
| Vinted | 280px | Wider for filter sliders |
| **Treido (current)** | **224px (`w-56`)** | Good balance |

**Recommendation:** Keep `w-56` (224px). Add `shrink-0` to prevent flex shrinking.

---

## Recommended File Changes

### 1. Create `DesktopCategorySidebar` Component

New file: `app/[locale]/(main)/demo/desktop/_components/desktop-category-sidebar.tsx`

Responsibilities:
- Render L0 list
- Expand/collapse L1, L2 on click
- Show current path with checkmarks
- Pass selected category up to parent

### 2. Create `DesktopBreadcrumbRow` Component

New file: `app/[locale]/(main)/demo/desktop/_components/desktop-breadcrumb-row.tsx`

Responsibilities:
- Show `Home > Fashion > Men > Shoes` style crumbs
- Each crumb is clickable
- "×" button to clear category entirely

### 3. Create `DesktopQuickPills` Component

New file: `app/[locale]/(main)/demo/desktop/_components/desktop-quick-pills.tsx`

Responsibilities:
- Fetch L3 children of current L2 category
- Render horizontal pill strip (like mobile SubcategoryPills)
- Keep in content area, NOT sidebar

### 4. Create `DesktopContextualFilters` Component

New file: `app/[locale]/(main)/demo/desktop/_components/desktop-contextual-filters.tsx`

Responsibilities:
- Use `getCategoryContext(slug)` to fetch attributes
- Render filter sections dynamically based on category
- Price is always shown; others are category-specific

### 5. Refactor `unified-desktop-feed.tsx`

- Import new components
- Lift category state up
- Add container queries to grid
- Wire up breadcrumb + quick pills

---

## Grid Breakpoints (Final Spec)

```css
/* In globals.css or inline via Tailwind v4 @theme */
@theme {
  /* Container breakpoints for grid area (not viewport) */
  --breakpoint-@sm: 480px;
  --breakpoint-@md: 640px;
  --breakpoint-@lg: 896px;
  --breakpoint-@xl: 1152px;
  --breakpoint-@2xl: 1408px;
}
```

### Product Grid Classes
```tsx
<div className="@container">
  <div className={cn(
    "grid gap-3",
    "grid-cols-2",
    "@[480px]:grid-cols-3",
    "@[640px]:grid-cols-4",
    "@[896px]:grid-cols-5",
    "@[1152px]:grid-cols-6"
  )}>
    {products.map(...)}
  </div>
</div>
```

This ensures the grid fills available space regardless of sidebar presence.

---

## Implementation Priority

| Task | Effort | Impact | Order |
|------|--------|--------|-------|
| Container query grid | Low | High | 1 |
| Drill-down sidebar | Medium | High | 2 |
| Breadcrumb row | Low | Medium | 3 |
| Quick pills (L3) | Low | Medium | 4 |
| Contextual filters | High | High | 5 |

---

## Visual Reference (Target State)

**Landing (no category):**
```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar            │ [Search in listings...]    Sort ▼  ▦ ☰   │
│                    │─────────────────────────────────────────── │
│ ▣ All         239  │ 239 listings                              │
│ 👗 Fashion     26  │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│ 📱 Electronics 42  │ │     │ │     │ │     │ │     │ │     │  │
│ 🏠 Home        20  │ │     │ │     │ │     │ │     │ │     │  │
│ ...                │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │
│                    │ ...                                       │
│ ─────────────────  │                                           │
│ FILTERS            │                                           │
│ Price [Min]-[Max]  │                                           │
│ Condition ○ New    │                                           │
│            ○ Used  │                                           │
│ [Apply]            │                                           │
└────────────────────┴───────────────────────────────────────────┘
```

**Drilled into Fashion > Men:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar            │ Fashion × Men ×                 12 обяви  │
│                    │ [Shoes] [Tops] [Bottoms] [Accessories]    │
│ ← All              │────────────────────────────────────────── │
│ ▼ 👗 Fashion   26  │                                           │
│   ▼ Men       12   │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│     • Shoes        │ │Nike │ │Adid.│ │Puma │ │NB   │ │Vans │  │
│     • Tops         │ │ €150│ │ €190│ │ €80 │ │ €299│ │ €154│  │
│     • Bottoms      │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │
│   ▶ Women     10   │ ...                                       │
│   ▶ Kids       4   │                                           │
│ ▶ 📱 Electronics   │                                           │
│ ─────────────────  │                                           │
│ FILTERS            │                                           │
│ Price [Min]-[Max]  │                                           │
│ Size  [S][M][L]    │ ← contextual                              │
│ Color [●][●][●]    │ ← contextual                              │
│ Condition ○ New    │                                           │
│ [Apply]            │                                           │
└────────────────────┴───────────────────────────────────────────┘
```

---

## CSS Pattern: Container Queries in Tailwind v4

Tailwind v4 supports container queries natively. Enable on the grid wrapper:

```tsx
// Wrapper
<div className="@container flex-1 min-w-0">
  
  {/* Grid responds to container width, not viewport */}
  <div className="grid gap-3 grid-cols-2 @sm:grid-cols-3 @md:grid-cols-4 @lg:grid-cols-5 @xl:grid-cols-6">
    ...
  </div>
</div>
```

No extra config needed in `tailwind.config.ts` for v4.

---

## Summary

The goal is a **Vinted + Amazon desktop hybrid**:
- Sidebar drills down L0 → L1 → L2 with expand/collapse
- L3 appears as quick pills in content area
- Filters become category-aware
- Grid uses container queries for optimal fill
- Breadcrumb provides clear navigation context

This creates the "truly perfect" desktop layout while staying within existing patterns and Tailwind v4 semantics.
