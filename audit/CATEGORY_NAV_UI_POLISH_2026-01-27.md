# Category Navigation UI Polish Plan
> **Date:** 2026-01-27  
> **Reference:** Treido.com screenshot  
> **Goal:** Tighter, more unified category + filter navigation on mobile

---

## 🎯 Analysis: Treido vs Current UI

### Treido Design Patterns (Reference)

| Element | Treido Approach |
|---------|-----------------|
| **Vertical rhythm** | Ultra-tight stacking, minimal gaps between rows |
| **Separator lines** | **None** between sections - unified visual flow |
| **Circles row** | Compact, minimal py, smaller gaps between items |
| **Filter chips row** | Sits immediately below circles, no visual break |
| **Background** | Same bg for circles + filters = unified "nav zone" |
| **Circle labels** | Small, tight leading, 2-line clamp |
| **Pill heights** | All pills same height (~32px), consistent radii |

### Current Implementation Issues

1. **Excessive vertical spacing:**
   - `SubcategoryCircles`: `py-3` (12px top + bottom = 24px)
   - `ContextualFilterBar`: `py-2` + `border-b` (8px + border)
   - `FilterChips` wrapper: `px-4 py-2` (additional 8px)
   - **Total vertical chrome:** ~50-60px before products

2. **Visual fragmentation:**
   - Each component has its own border/background treatment
   - Separator line (`border-b border-border/20`) breaks flow
   - Filter chips in separate wrapper div

3. **Circle sizing inconsistencies:**
   - Item width `w-16` (64px) but circle only `size-14` (56px)
   - Gap `gap-3` (12px) is generous for mobile density
   - Wasted horizontal space per item

4. **Pill style divergence:**
   - Header pills vs filter bar pills have different weights
   - Category tabs (underlined) vs pills (rounded) mismatch

---

## ✅ Proposed Changes

### 1. Tighten Vertical Spacing

| Component | Current | Proposed |
|-----------|---------|----------|
| SubcategoryCircles | `py-3` | `py-2` |
| CategoryCircles | `px-inset py-2` | `px-inset py-1.5` |
| ContextualFilterBar | `py-2` | `py-1.5` (remove border-b) |
| FilterChips wrapper | `px-4 py-2` | `px-inset py-1` or conditionally hidden |
| Circle gap | `gap-3` | `gap-2` |
| Circle item width | `w-16` | `w-[58px]` |

**Estimated savings:** ~20-24px vertical space

### 2. Remove Separator Lines

```diff
// contextual-filter-bar.tsx
-  "border-b border-border/20",
+  // No bottom border - unified with circles above
```

### 3. Unified Nav Zone Wrapper

Create a single visual container for circles + filters:

```tsx
// Wrap circles + filter bar in a shared container
<div className="bg-background">
  {/* Circles */}
  <SubcategoryCircles ... />
  {/* Filter bar - no border, flows naturally */}
  <ContextualFilterBar ... />
</div>
```

### 4. Compact Circle Items

```diff
// subcategory-circles.tsx
<div className="py-3 overflow-x-auto no-scrollbar">
-  <div className="flex items-start gap-3 px-inset">
+  <div className="flex items-start gap-2 px-inset">
    <Link
      href={...}
-     className="... w-16 ..."
+     className="... w-[58px] ..." // Tighter item width
    >
-     <div className="size-14 rounded-full ...">
+     <div className="size-[52px] rounded-full ..."> // Slightly smaller circle
```

### 5. Unified Pill Heights (32px)

All pills should be consistent:
- Category tabs/pills: `h-8`
- Filter bar pills: `h-8`
- Attribute pills: `h-8`

### 6. Optional: Collapse FilterChips When Empty

```tsx
// Instead of always showing wrapper:
{appliedFilters.length > 0 && (
  <div className="px-inset py-1">
    <FilterChips ... />
  </div>
)}
// No wrapper = no wasted vertical space
```

---

## 📐 Visual Comparison

### Before (Current)
```
┌────────────────────────────────────────┐
│ [Header with search bar]               │ 48px
├────────────────────────────────────────┤
│         py-3 (12px)                    │
│ ○ ○ ○ ○ ○ ○   (circles)               │ 56px
│         py-3 (12px)                    │
├─────────── border-b ───────────────────┤ 1px
│         py-2 (8px)                     │
│ [Filters] [Sort] | [Size] [Color]      │ 32px
│         py-2 (8px)                     │
├────────────────────────────────────────┤
│         py-2 (8px)                     │
│ (active filter chips if any)           │ 0-24px
│         py-2 (8px)                     │
├────────────────────────────────────────┤
│ PRODUCTS START HERE                    │
└────────────────────────────────────────┘

Total nav chrome: 48 + 24 + 1 + 16 + 32 + 16 + 16 = ~153px minimum
```

### After (Proposed)
```
┌────────────────────────────────────────┐
│ [Header with search bar]               │ 48px
├────────────────────────────────────────┤
│       py-1.5 (6px)                     │
│ ○ ○ ○ ○ ○ ○   (circles)               │ 52px
│       py-1.5 (6px)                     │
│ [Filters] [Sort] | [Size] [Color]      │ 32px
│       py-1.5 (6px)                     │
├────────────────────────────────────────┤
│ (filter chips ONLY if active)          │ 0-28px
├────────────────────────────────────────┤
│ PRODUCTS START HERE                    │
└────────────────────────────────────────┘

Total nav chrome: 48 + 6 + 52 + 6 + 32 + 6 = ~150px base, but no wasted padding!
```

---

## 🔧 Implementation Files

1. **`components/mobile/subcategory-circles.tsx`**
   - Tighten py-3 → py-2
   - Tighten gap-3 → gap-2
   - Reduce circle size: size-14 → size-[52px]
   - Reduce item width: w-16 → w-[58px]

2. **`components/mobile/category-nav/category-circles.tsx`**
   - Same spacing adjustments
   - Ensure consistent circle sizing

3. **`components/mobile/category-nav/contextual-filter-bar.tsx`**
   - Remove `border-b border-border/20`
   - Tighten `py-2` → `py-1.5`

4. **`components/mobile/mobile-category-browser.tsx`**
   - Conditionally render FilterChips wrapper
   - Remove redundant `py-2` wrapper

5. **`components/mobile/mobile-home.tsx`**
   - Apply same spacing patterns for consistency

---

## 🎨 Design Tokens to Consider

Add to `globals.css`:

```css
/* Tighter mobile category nav */
--spacing-nav-circle-gap: 0.5rem;     /* 8px */
--spacing-nav-row-py: 0.375rem;       /* 6px */
--spacing-nav-circle-size: 3.25rem;   /* 52px */
--spacing-nav-circle-item-w: 3.625rem;/* 58px */
```

---

## ✨ Additional Polish (Phase 2)

1. **Circle image zoom on tap** (micro-interaction)
2. **Active circle ring treatment** (subtle primary color ring)
3. **Filter pill count badge polish** (smaller, tighter)
4. **Skeleton loading** for circles that matches new compact size

---

## 🧪 Testing

1. Visual regression on:
   - `/categories/fashion` (lots of subcategories)
   - `/categories/electronics` (attribute filters)
   - Homepage "All" tab
2. Verify sticky behavior unchanged
3. Test on iPhone SE (small viewport)

---

## Priority

| Change | Impact | Effort |
|--------|--------|--------|
| Remove border-b | High (cleaner) | 1 line |
| Tighten py | High (more products visible) | 5 mins |
| Tighten gaps | Medium | 5 mins |
| Resize circles | Medium | 10 mins |
| Conditional FilterChips | Medium | 10 mins |
