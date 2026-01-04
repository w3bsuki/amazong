# 📱 Mobile Frontend UI/UX Refactor Plan

> **Created:** January 4, 2026  
> **Target:** Production-grade mobile experience (iOS/Android)  
> **Standards:** WCAG 2.2 AA, Tailwind v4, shadcn/ui  
> **Philosophy:** Temu density + eBay trust + Shein polish

---

## 📊 Current State Assessment

### What's Working ✅
- MobileHomeTabs with sticky category navigation
- ProductCard with proper 4:5 aspect ratio images
- CategoryCircles with back navigation
- Mobile filters in Drawer (Vaul)
- Safe area padding on footer CTA
- Horizontal scroll with snap points

### What Needs Improvement ⚠️
- **Inconsistent sizing across similar components** (main issue)
- L3 pills too small (`h-6`, `text-2xs`) — hard to tap and read
- L0 pills vs L0 tabs have different heights (`h-7` vs `py-3`)
- Category circles label width varies
- Filter drawer hierarchy unclear (nested views)
- No skeleton states during category transitions
- Quick pills crowded on smaller devices (320px)

---

## 🎯 PHASE 1: Component Size Standardization [CRITICAL]

### 1.1 Current Size Audit — The Problem

```
Component                    Height    Font      Padding   Status
──────────────────────────────────────────────────────────────────
L0 Tabs (homepage)           ~48px     text-sm   py-3      ✅ Good
L0 Pills (/categories)       28px      text-xs   h-7 px-3  ⚠️ Small
L1/L2 Category Circles       44px      text-2xs  —         ✅ OK
L3 Pills (deep nav)          24px      text-2xs  h-6 px-2.5 ❌ Too small
Filter trigger button        28px      text-xs   h-7       ⚠️ Small
Sort dropdown                28px      text-xs   h-7       ⚠️ Small
Quick Add button             28px      —         size-7    ✅ OK (compact)
Wishlist heart               28px      —         size-7    ✅ OK (compact)
Back button                  28px      —         size-7    ⚠️ Feels small
```

**WCAG 2.2 AA Reference:**
- Minimum touch target: **24×24px** (we meet this)
- Recommended spacing: **24px** between small targets
- Our design choice: **28-32px** for compact density ✅

### 1.2 Proposed Standardized Sizes

**Goal:** Consistent visual hierarchy, not maximum size

```
NAVIGATION PILLS (tappable categories/filters):
├── L0 (primary)    → h-8 (32px), text-xs, font-bold, px-3.5
├── L3 (tertiary)   → h-7 (28px), text-xs, font-medium, px-3
└── Filters/Sort    → h-8 (32px), text-xs, font-medium, px-3

ACTION BUTTONS (quick actions):
├── Primary CTA     → h-9 (36px), text-sm, font-semibold
├── Icon buttons    → size-8 (32px) visual, size-10 touch area
└── Compact icons   → size-7 (28px) — OK for wishlist/cart

CATEGORY CIRCLES:
├── Circle size     → size-12 (48px) — slightly larger
├── Label           → text-2xs, w-14, line-clamp-2
└── Touch area      → size-14 (56px) including label
```

### 1.3 L3 Pills Fix (Most Visible Issue)

**Current:** `h-6 px-2.5 text-2xs` (24px height, 10px font)
**Problem:** Too small to read and tap comfortably

```tsx
// BEFORE (category-l3-pills.tsx)
<button className={cn(
  "h-6 px-2.5 rounded-full text-2xs font-medium ..."
)}>

// AFTER — Match L0 pills but slightly subtler
<button className={cn(
  "h-7 px-3 rounded-full text-xs font-medium whitespace-nowrap border",
  "focus-visible:outline-none transition-colors",
  isSelected
    ? "bg-primary/15 text-primary border-primary/40"
    : "bg-muted/50 text-muted-foreground border-border/40 hover:bg-muted/70"
)}>
```

**Changes:**
- `h-6` → `h-7` (24px → 28px)
- `px-2.5` → `px-3` (10px → 12px)
- `text-2xs` → `text-xs` (10px → 12px font)

### 1.4 L0 Pills Standardization

**Current:** `h-7 px-3 text-xs font-bold`
**Proposed:** `h-8 px-3.5 text-xs font-bold` (bump to 32px for primary nav)

```tsx
// category-nav-item.tsx - pill variant
const pillStyles = cn(
  "shrink-0 h-8 px-3.5 text-xs font-bold rounded-full whitespace-nowrap",
  "flex items-center justify-center",
  "border",
  // ... rest stays same
)
```

### 1.5 Back Button Enhancement

**Current:** `size-7` (28px) — functional but feels cramped
**Proposed:** `size-9` (36px) visual with proper spacing

```tsx
// category-circles.tsx
<button
  type="button"
  onClick={onBack}
  className="size-9 shrink-0 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors duration-100"
  aria-label={locale === "bg" ? "Назад" : "Back"}
>
  <CaretLeft size={18} weight="bold" className="text-muted-foreground" />
</button>
```

### 1.6 Files to Update

| File | Changes |
|------|---------|
| `category-l3-pills.tsx` | h-6→h-7, text-2xs→text-xs, px-2.5→px-3 |
| `category-nav-item.tsx` | h-7→h-8, px-3→px-3.5 (pill variant) |
| `category-circles.tsx` | size-7→size-9 (back button) |
| `mobile-filters.tsx` | h-7→h-8 (trigger button) |

---

## 🎯 PHASE 2: Category Navigation UX & Styling

### 2.1 L0 Tabs vs Pills — Keep Both, Polish Both

**Current Implementation:** Two variants exist
1. **Tabs** (homepage): Underline indicator, `py-3`, `text-sm`
2. **Pills** (/categories): Filled background, `h-7`, `text-xs`

**Decision:** Keep BOTH — they serve different contexts

| Context | Use | Visual Treatment |
|---------|-----|------------------|
| Homepage | Tabs | Underline, light touch, exploratory |
| Category pages | Pills | Solid fill, committed selection |
| Search results | Pills | Clear filter indication |

**Polish needed:**
- Tabs: Add subtle fade edges for scroll affordance
- Pills: Bump to h-8 for better tap feel (Phase 1)

### 2.2 Category Circles Polish

**Current Token:** `--category-circle-mobile: 2.75rem` (44px)
**Proposed:** `--category-circle-mobile: 3rem` (48px)

```tsx
// A. Slightly larger circles for better visual hierarchy
circleClassName="size-12"  // 48px
fallbackIconSize={22}      // Bump from 20

// B. Fixed label width for alignment (prevent jagged edges)
labelClassName={cn(
  "text-2xs text-center leading-tight line-clamp-2",
  "w-14",  // 56px fixed width
  "min-h-7 flex items-center justify-center",
  isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
)}

// C. Active state — ring instead of just color
<CategoryCircleVisual
  className={cn(
    isActive && "ring-2 ring-primary/50 ring-offset-1 ring-offset-background"
  )}
/>
```

### 2.3 Scroll Affordance (Both Tabs & Circles)

**Problem:** No visual cue that content scrolls horizontally

```tsx
// Add fade edges to scrollable containers
<div className="relative">
  {/* Left fade - only show when scrolled */}
  <div className={cn(
    "absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none",
    "transition-opacity",
    scrollLeft > 0 ? "opacity-100" : "opacity-0"
  )} />
  
  {/* Scrollable content */}
  <div className="overflow-x-auto no-scrollbar ...">
    {children}
  </div>
  
  {/* Right fade - hide when scrolled to end */}
  <div className={cn(
    "absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none",
    "transition-opacity",
    canScrollRight ? "opacity-100" : "opacity-0"
  )} />
</div>
```

### 2.4 Visual Hierarchy Summary

```
Navigation Depth    Component          Size      Font        Weight
────────────────────────────────────────────────────────────────────
L0 (root)           Tabs               48px      text-sm     medium/bold
L0 (root)           Pills              32px      text-xs     bold
L1/L2 (subcats)     Circles            48px      text-2xs    medium
L3 (deep/attrs)     Pills              28px      text-xs     medium
```

---

## 🎯 PHASE 3: Product Discovery & Grid UX

### 3.1 Product Grid Polish

**Current:** `gap-1.5` (6px) on mobile — good density
**Keep:** Current gaps work well for Temu-style density

**Enhancements:**

```tsx
// A. Responsive gaps for different screen sizes
className="grid grid-cols-2 gap-1.5 xs:gap-2"

// B. Edge padding consistency
// Current: px-1 (4px) — too tight
// Proposed: px-(--page-inset) for consistency with other sections
className="px-(--page-inset)"
```

### 3.2 Product Card Typography Polish

**Current Issues:**
- Price font varies between card contexts
- Title truncation feels abrupt on some products

```tsx
// A. Price — add tabular-nums for alignment
<span className={cn(
  "text-lg font-bold leading-tight tracking-tight",
  "tabular-nums",  // Align decimals in grid view
  hasDiscount ? "text-red-600" : "text-foreground"
)}>
  {formattedPrice}
</span>

// B. Title — softer truncation with fade
<h3 className={cn(
  "mt-0.5 line-clamp-2 text-[13px] leading-snug",
  "text-foreground/90"  // Slightly muted for visual hierarchy
)}>
```

### 3.3 Loading States

**Current:** Spinner at bottom during infinite scroll
**Enhancement:** Skeleton grid for category transitions

```tsx
// When transitioning categories (not infinite scroll)
{isLoading && products.length === 0 && (
  <ProductCardSkeletonGrid count={6} density="compact" />
)}

// During infinite scroll (keep current spinner)
{isLoadingMore && products.length > 0 && (
  <div className="py-4 flex justify-center">
    <Spinner className="size-5 text-primary" />
  </div>
)}
```

### 3.4 End of Results Indicator

```tsx
// Show when no more products to load
{!hasMore && products.length > 0 && (
  <div className="py-6 text-center">
    <p className="text-xs text-muted-foreground">
      {locale === 'bg' 
        ? `${products.length} продукта` 
        : `${products.length} products`}
    </p>
  </div>
)}
```

---

## 🎯 PHASE 4: Filter & Sort UX

### 4.1 Filter Trigger Button

**Current:** `h-7` (28px) with icon + text
**Proposed:** `h-8` (32px) for consistency with standardized sizes

```tsx
// mobile-filters.tsx trigger
<Button
  variant="ghost"
  onClick={() => setIsOpen(true)}
  className={cn(
    "h-8 w-full rounded-lg px-3 gap-2 text-xs font-medium",
    "bg-muted/50 hover:bg-muted/70 border border-border/40",
    filterCount > 0 && "bg-primary/10 text-primary border-primary/30"
  )}
>
```

### 4.2 Filter Drawer Internal Styling

**Current Issues:**
1. Nested navigation loses context
2. Filter section rows feel cramped
3. No visual preview of current selections

**Fixes:**

```tsx
// A. Section row height — use h-12 (48px) for comfortable tapping
<button className="w-full flex items-center justify-between px-4 h-12 active:bg-muted/50">

// B. Preview chips in section rows
<div className="flex flex-col items-start gap-0.5">
  <span className="font-medium text-sm">{section.label}</span>
  {summary && (
    <span className="text-2xs text-primary/80 truncate max-w-[200px]">
      {summary}
    </span>
  )}
</div>

// C. Sticky header in sub-views
<div className="sticky top-0 bg-background z-10 px-4 py-3 border-b border-border/30">
  <button onClick={() => setActiveSection(null)} className="flex items-center gap-2">
    <CaretLeft size={18} weight="bold" />
    <span className="font-semibold text-base">{sectionLabel}</span>
  </button>
</div>
```

### 4.3 Sort Dropdown Styling

**Current:** Same `h-7` as filter button
**Proposed:** Match filter at `h-8`, consistent border treatment

```tsx
<SortSelect className="h-8 text-xs font-medium rounded-lg border border-border/40" />
```

### 4.4 Quick Filter Pills (Optional Enhancement)

Add most-used filters as quick-tap pills above product grid:

```tsx
// Show only when NOT on "All" tab
{!isAllTab && (
  <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-(--page-inset) py-2 border-b border-border/30">
    <QuickFilterPill 
      label={locale === 'bg' ? 'Безплатна доставка' : 'Free Shipping'}
      active={freeShipping}
      onClick={toggleFreeShipping}
      icon={<Truck size={12} />}
    />
    <QuickFilterPill 
      label={locale === 'bg' ? 'Намаление' : 'On Sale'}
      active={onSale}
      onClick={toggleOnSale}
    />
    <QuickFilterPill 
      label="4+"
      active={minRating === 4}
      onClick={() => setMinRating(4)}
      icon={<Star size={12} weight="fill" />}
    />
  </div>
)}
```

```tsx
// QuickFilterPill component
function QuickFilterPill({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 px-2.5 rounded-full text-xs font-medium whitespace-nowrap",
        "flex items-center gap-1.5 border transition-colors",
        active
          ? "bg-primary/15 text-primary border-primary/40"
          : "bg-muted/50 text-muted-foreground border-border/40"
      )}
    >
      {icon}
      {label}
    </button>
  )
}
```

---

## 🎯 PHASE 5: Accessibility & Polish

### 5.1 WCAG 2.2 AA Compliance Check

**Touch Targets (2.5.8):**
- Minimum: 24×24px ✅ (all components meet this)
- Spacing: 24px between small targets (use `gap-2` minimum)

**Color Contrast (1.4.3):**
| Element | Current | Ratio | Status |
|---------|---------|-------|--------|
| Muted text | `oklch(0.45)` on `oklch(0.985)` | 4.8:1 | ✅ |
| Primary on white | `oklch(0.48)` on `oklch(1)` | 5.1:1 | ✅ |
| Placeholder text | `oklch(0.55)` | 3.5:1 | ⚠️ Borderline |

**Focus Indicators (2.4.7):**
```tsx
// Ensure all interactive elements have visible focus
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### 5.2 Live Regions for Screen Readers

```tsx
// Announce category changes
<div role="status" aria-live="polite" className="sr-only">
  {activeCategoryName && (
    locale === 'bg' 
      ? `Показване на ${activeCategoryName}` 
      : `Now showing ${activeCategoryName}`
  )}
</div>

// Announce filter applications
<div role="status" aria-live="polite" className="sr-only">
  {filterAnnouncement}
</div>
```

### 5.3 Reduced Motion Support

```css
/* Add to globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.4 Loading State Accessibility

```tsx
// Skeleton grids should have aria-busy
<div aria-busy={isLoading} aria-label={isLoading ? "Loading products" : undefined}>
  {isLoading ? <ProductCardSkeletonGrid /> : <ProductGrid />}
</div>
```

---

## 🎯 PHASE 6: Performance & Micro-Interactions

### 6.1 Image Loading Strategy

**Current:** Priority for first 4, lazy for rest ✅ (good)

**Enhancement:** Preload next page images when near end

```tsx
useEffect(() => {
  if (isNearEnd && nextProducts.length > 0) {
    nextProducts.slice(0, 4).forEach(p => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = p.image
      document.head.appendChild(link)
    })
  }
}, [isNearEnd, nextProducts])
```

### 6.2 Category Transition Polish

**Current:** Instant content swap
**Proposed:** Subtle fade for smoother UX (within design system limits)

```tsx
// Use CSS transitions, not JS animation libraries
<div className={cn(
  "transition-opacity duration-100",
  isTransitioning ? "opacity-50" : "opacity-100"
)}>
  {content}
</div>
```

### 6.3 Button Press Feedback

**Current:** `active:bg-*` states exist
**Enhancement:** Ensure consistent press states

```tsx
// Standard press feedback pattern
className={cn(
  "transition-colors",
  "active:scale-[0.98] active:transition-transform active:duration-75",
  // ... other classes
)}
```

Note: Keep transforms minimal per design system (≤120ms, no spring/bounce).

### 6.4 Virtualization Threshold

**When to virtualize:** > 100 products visible

```tsx
// Consider for category pages with many products
{products.length > 100 ? (
  <VirtualizedProductGrid products={products} />
) : (
  <ProductGrid>{products.map(...)}</ProductGrid>
)}
```

---

## 📋 Implementation Checklist

### Sprint 1: Size Standardization (Day 1) [PRIORITY]
- [ ] Update L3 pills: h-6→h-7, text-2xs→text-xs, px-2.5→px-3
- [ ] Update L0 pills: h-7→h-8, px-3→px-3.5
- [ ] Update back button: size-7→size-9
- [ ] Update filter trigger: h-7→h-8
- [ ] Update sort dropdown: h-7→h-8
- [ ] Verify all changes on 320px screen width

### Sprint 2: Category Navigation Polish (Day 1-2)
- [ ] Add scroll fade affordances to tabs/pills
- [ ] Increase category circle size to 48px
- [ ] Add ring indicator for active circles
- [ ] Fix label widths (w-14 fixed)
- [ ] Test circle navigation flow end-to-end

### Sprint 3: Product Grid & Cards (Day 2)
- [ ] Add tabular-nums to prices
- [ ] Implement skeleton states for category transitions
- [ ] Add end-of-results indicator
- [ ] Verify grid padding consistency

### Sprint 4: Filters (Day 2-3)
- [ ] Increase filter section row height to h-12
- [ ] Add sticky header in filter sub-views
- [ ] Add selection preview in section rows
- [ ] Consider quick filter pills (optional)

### Sprint 5: Accessibility & Polish (Day 3)
- [ ] Add aria-live regions for announcements
- [ ] Verify focus indicators on all interactive elements
- [ ] Add reduced-motion media query
- [ ] Test with VoiceOver (iOS) and TalkBack (Android)

---

## 🎨 Design Tokens Reference (Updated)

```css
/* Standardized interactive element sizes */
--size-pill-primary: 2rem;       /* 32px - L0 pills, filter triggers */
--size-pill-secondary: 1.75rem;  /* 28px - L3 pills, quick filters */
--size-button-primary: 2.25rem;  /* 36px - Primary CTAs */
--size-button-icon: 2rem;        /* 32px - Icon buttons */
--size-button-icon-compact: 1.75rem; /* 28px - Wishlist, add to cart */

/* Category navigation */
--category-circle-mobile: 3rem;  /* 48px */
--category-label-width: 3.5rem;  /* 56px */

/* Spacing */
--gap-pills: 0.375rem;           /* 6px - between pills */
--gap-circles: 0.375rem;         /* 6px - between circles */
--gap-grid: 0.375rem;            /* 6px - product grid mobile */

/* Typography */
--text-pill-primary: 0.75rem;    /* 12px - text-xs */
--text-pill-secondary: 0.75rem;  /* 12px - text-xs (was text-2xs) */
--text-circle-label: 0.625rem;   /* 10px - text-2xs */
```

---

## 📱 Device Testing Matrix

| Device | Width | Priority | Focus Areas |
|--------|-------|----------|-------------|
| iPhone SE | 320px | 🔴 High | Pill overflow, grid fit |
| iPhone 13 | 390px | 🔴 High | Primary target |
| iPhone 15 Pro Max | 430px | 🟡 Medium | Large phone spacing |
| Samsung Galaxy S23 | 360px | 🔴 High | Android baseline |
| Pixel 7 | 412px | 🟡 Medium | Stock Android |

---

## 🔗 Related Documentation

- `docs/DESIGN.md` → Design system overview
- `docs/refactor_plan.md` → Main refactor plan
- `docs/desktop_frontend_refactor.md` → Desktop companion plan
- `agents.md` → Agent guidelines

---

**Next Steps:** Begin with Sprint 1 (Size Standardization) — the L3 pills fix will have the most visible impact on usability.
