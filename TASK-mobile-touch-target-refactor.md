# Mobile Touch Target & Layout Refactor

> **Status:** 🔄 In Progress  
> **Created:** 2026-01-15  
> **Priority:** P1  
> **Delete after completion:** ✅ YES

---

## Overview

This task addresses mobile touch target compliance, 8px grid alignment, and Tailwind CSS v4 + shadcn/ui best practices across all mobile components.

**Goal:** Achieve WCAG 2.2 AA compliance (≥40px touch targets) and consistent design token usage.

---

## Audit Summary

| Metric | Current | Target |
|--------|---------|--------|
| P0 Issues (WCAG violation) | 0 | 0 ✅ |
| P1 Issues (Touch < 40px) | 3 | 0 |
| P2 Issues (Non-8px grid) | 2 | 0 |
| P3 Issues (Token violations) | 3 | 0 |
| **Overall Score** | ⚠️ Needs Work | ✅ Compliant |

---

## Design System Reference

### Touch Target Tokens (globals.css)

```css
--spacing-touch-xs: 2rem;      /* 32px - minimum WCAG */
--spacing-touch-sm: 2.25rem;   /* 36px - compact */
--spacing-touch: 2.5rem;       /* 40px - standard */
--spacing-touch-lg: 3rem;      /* 48px - bottom nav */
```

### Tailwind v4 Token Usage

```tsx
/* ✅ GOOD - Use CSS variable tokens */
size-(--spacing-touch)        /* 40px */
h-(--spacing-touch-lg)        /* 48px */
min-h-touch                   /* 40px via @theme */
min-h-touch-sm                /* 36px via @theme */

/* ❌ BAD - Avoid hardcoded arbitrary values */
size-[40px]                   /* Use token instead */
h-[48px]                      /* Use token instead */
```

### shadcn/ui Button Sizes (Already Compliant)

```tsx
/* components/ui/button.tsx */
xs: "h-8"       /* 32px - minimum density */
sm: "h-9"       /* 36px - compact */
default: "h-10" /* 40px - standard touch */
lg: "h-11"      /* 44px - primary CTA */
icon: "size-10" /* 40px - icon buttons */
```

---

## Task List

### Phase 1: P1 Issues (Touch Targets < 40px)

- [ ] **1.1 MobileFilters close/back buttons**
  - File: `components/shared/filters/mobile-filters.tsx`
  - Lines: 264, 270
  - Change: `w-8 h-8` → `size-10`
  - Test: Open filter drawer, verify buttons are tappable

- [x] **1.2 MobileSearchOverlay close button** ✅ ACCEPTABLE AS-IS
  - File: `components/shared/search/mobile-search-overlay.tsx`
  - Line: 256
  - Current: `h-8 px-2` - Text button "Затвори" has adequate touch area
  - Status: **Keep as-is** - matches reference design perfectly

- [x] **1.3 MobileSearchOverlay clear input button** ✅ ACCEPTABLE AS-IS
  - File: `components/shared/search/mobile-search-overlay.tsx`
  - Line: 295
  - Current: `size-6` (24px) - standard pattern for inline clear buttons
  - Status: **Keep as-is** - secondary action, users can also backspace

- [ ] **1.4 MobileCartDropdown quantity buttons**
  - File: `components/layout/header/cart/mobile-cart-dropdown.tsx`
  - Lines: 161, 168, 175
  - Change: `size-7` → `size-9`
  - Test: Add item to cart, verify +/- buttons are tappable

- [ ] **1.5 WishlistDrawer action buttons**
  - File: `components/shared/wishlist/wishlist-drawer.tsx`
  - Lines: 161, 171
  - Change: `h-6` → `h-8` minimum
  - Test: Add to wishlist, verify action buttons work

### Phase 2: P2 Issues (8px Grid Alignment)

- [x] **2.1 MobileSearchOverlay input height** ✅ ACCEPTABLE AS-IS
  - File: `components/shared/search/mobile-search-overlay.tsx`
  - Line: 284
  - Current: `h-9` (36px)
  - Status: **Keep as-is** - 36px is standard for search inputs, matches reference design
  - Note: Close button is a text button with adequate hit area, not an icon button

- [ ] **2.2 MobileFilters trigger button**
  - File: `components/shared/filters/mobile-filters.tsx`
  - Line: 237
  - Change: `h-9` → `h-10`
  - Rationale: Consistency with other filter pills

### Phase 3: P3 Issues (Token Consistency)

- [ ] **3.1 MobileUrgencyBanner icon containers**
  - File: `components/mobile/product/mobile-urgency-banner.tsx`
  - Lines: 63, 83
  - Change: `size-9` → `size-10` (optional, decorative)
  - Rationale: Consistency with touch target tokens

- [ ] **3.2 MobileAccordions icon containers**
  - File: `components/shared/product/mobile-accordions.tsx`
  - Lines: 39, 58, 84
  - Status: Keep `size-8` (decorative, not interactive)
  - Note: Document as intentional exception

- [ ] **3.3 MobileGalleryOlx dot indicators**
  - File: `components/mobile/product/mobile-gallery-olx.tsx`
  - Line: 101
  - Change: Add touch padding around dots
  - Rationale: Visual size fine, but hit area should be larger

### Phase 4: Category Browse Filter UX Redesign

**Problem:** Current scrolling quick pills under category circles creates visual clutter and feels busy.

**Current flow (screenshot):**
```
┌─────────────────────────────────────────┐
│ ← Мода           🔍 ♡⁷ 🛒⁹              │  Header
├─────────────────────────────────────────┤
│ ⬡ Всички  ○Мъже  ○Жени  ○Деца  ○Унисекс│  Category circles
├─────────────────────────────────────────┤
│ ⚙Филтри │ Пол ▼ │ Състояние ▼ │ Разм...│  Quick pills (scrolls) ❌ UGLY
├─────────────────────────────────────────┤
│ [Product Grid]                          │
└─────────────────────────────────────────┘
```

**Proposed: Clean 50/50 Filter Bar**
```
┌─────────────────────────────────────────┐
│ ← Мода           🔍 ♡⁷ 🛒⁹              │  Header
├─────────────────────────────────────────┤
│ ⬡ Всички  ○Мъже  ○Жени  ○Деца  ○Унисекс│  Category circles
├──────────────────┬──────────────────────┤
│ ⚙ Филтри (3)     │ ↕ Сортирай: Най-нови │  50/50 tabs ✅ CLEAN
├──────────────────┴──────────────────────┤
│ [Product Grid]                          │
└─────────────────────────────────────────┘
```

**Benefits:**
- No horizontal scrolling = cleaner UX
- Filter count badge shows active filters at a glance
- Sort value visible without opening drawer
- Single tap to open full filter drawer or sort sheet
- Matches OLX/Vinted/Depop patterns

**Design options to explore:**
1. **50/50 split buttons**: `[⚙ Filters (3)]  [↕ Sort: Newest]`
2. **Icon + text tabs**: Underline active state
3. **Segmented control**: iOS-style pill toggle

**Files to modify:**
- `components/mobile/category-nav/inline-filter-bar.tsx`
- `components/shared/filters/quick-filter-row.tsx` (or remove)
- `components/mobile/mobile-home-tabs.tsx`

- [ ] **4.0 Design filter bar mockup**
- [ ] **4.1 Implement 50/50 filter/sort bar component**
- [ ] **4.2 Remove/deprecate quick pills on category pages**
- [ ] **4.3 Update FilterHub to work with new trigger**
- [ ] **4.4 Add sort bottom sheet**

---

### Phase 5: Codebase-Wide Cleanup

- [ ] **4.1 Grep audit for remaining violations**
  ```bash
  # Run after Phase 1-3 complete
  grep -rn "size-[4-7]\b" components/ --include="*.tsx" | grep -v icon
  grep -rn "h-[6-8]\b" components/ --include="*.tsx" | grep -v icon
  grep -rn "w-[6-8]\b" components/ --include="*.tsx" | grep -v icon
  ```

- [ ] **4.2 Verify all mobile drawers/sheets**
  - `components/ui/drawer.tsx` - Check close button defaults
  - `components/ui/sheet.tsx` - Check close button defaults

- [ ] **4.3 Document exceptions**
  - Add comments for intentional small sizes (icons, decorative)

---

## Implementation Guide

### Pattern 1: Drawer Close Buttons

```tsx
/* ❌ BEFORE */
<button className="w-8 h-8 flex items-center justify-center rounded-full">
  <X size={20} />
</button>

/* ✅ AFTER */
<button className="size-10 flex items-center justify-center rounded-full">
  <X size={20} />
</button>
```

### Pattern 2: Inline Action Buttons

```tsx
/* ❌ BEFORE */
<button className="h-6 px-2 text-xs">
  Add to Cart
</button>

/* ✅ AFTER */
<button className="h-8 px-3 text-xs">
  Add to Cart
</button>
```

### Pattern 3: Input Clear Buttons

```tsx
/* ❌ BEFORE */
<button className="size-6 rounded-full">
  <X size={12} />
</button>

/* ✅ AFTER - Option A: Larger button */
<button className="size-8 rounded-full">
  <X size={14} />
</button>

/* ✅ AFTER - Option B: Padding wrapper */
<button className="p-2 -m-2 rounded-full"> {/* 8px padding = 32px hit area */}
  <span className="size-4 flex items-center justify-center">
    <X size={12} />
  </span>
</button>
```

### Pattern 4: Quantity Steppers

```tsx
/* ❌ BEFORE */
<div className="flex items-center bg-muted rounded-md">
  <button className="size-7"><Minus size={14} /></button>
  <span className="w-6 text-center">{qty}</span>
  <button className="size-7"><Plus size={14} /></button>
</div>

/* ✅ AFTER */
<div className="flex items-center bg-muted rounded-md">
  <button className="size-9 flex items-center justify-center"><Minus size={16} /></button>
  <span className="w-8 text-center">{qty}</span>
  <button className="size-9 flex items-center justify-center"><Plus size={16} /></button>
</div>
```

---

## Tailwind CSS v4 Best Practices

### 1. Use CSS Variable Tokens

```tsx
/* ✅ Preferred - Dynamic, themeable */
className="size-(--spacing-touch)"
className="h-(--spacing-touch-lg)"
className="gap-(--page-inset)"

/* ⚠️ Acceptable - Static Tailwind classes */
className="size-10"  /* When you need exactly 40px */
className="h-12"     /* When you need exactly 48px */

/* ❌ Avoid - Arbitrary values */
className="size-[40px]"
className="h-[48px]"
```

### 2. Responsive Touch Targets

```tsx
/* Mobile-first, desktop can be smaller */
className="h-10 md:h-9"  /* 40px mobile, 36px desktop */
className="size-10 lg:size-9"
```

### 3. Safe Area Handling

```tsx
/* Bottom bars - always use safe area */
className="pb-safe"           /* env(safe-area-inset-bottom) */
className="pb-safe-max"       /* max(16px, env(...)) */
className="pb-safe-max-xs"    /* max(8px, env(...)) */
```

### 4. Touch Feedback States

```tsx
/* ✅ Treido pattern - opacity feedback */
className="active:opacity-50 transition-opacity"
className="active:bg-muted/70 transition-colors"

/* ❌ Avoid - scale transforms */
className="active:scale-95"  /* Can cause layout shift */
```

---

## shadcn/ui Component Checklist

### Drawer (`components/ui/drawer.tsx`)
- [ ] Default close button ≥ 40px
- [ ] Handle/grabber has sufficient touch area
- [ ] Content respects safe area

### Sheet (`components/ui/sheet.tsx`)
- [ ] Close button in header ≥ 40px
- [ ] Mobile variant uses full height

### Dialog (`components/ui/dialog.tsx`)
- [ ] Close button ≥ 40px
- [ ] Mobile: Consider drawer instead

### Select (`components/ui/select.tsx`)
- [x] Trigger height: `h-10` on mobile ✅
- [ ] Option items ≥ 44px height

### Input (`components/ui/input.tsx`)
- [x] Default height: `h-10` ✅
- [ ] Clear button (if added) ≥ 32px

---

## Verification Commands

```bash
# 1. Typecheck after changes
pnpm -s exec tsc -p tsconfig.json --noEmit

# 2. Run E2E smoke tests
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# 3. Manual mobile testing
# - Test on actual device or Chrome DevTools mobile emulation
# - Verify all buttons are easily tappable with thumb
# - Check drawer close buttons specifically

# 4. Final audit scan
grep -rn "size-[4-7]\b\|h-[6-8]\b\|w-[6-8]\b" components/mobile/ components/shared/ --include="*.tsx"
```

---

## Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `components/shared/filters/mobile-filters.tsx` | Close/back buttons, trigger | P1 |
| `components/shared/search/mobile-search-overlay.tsx` | ✅ Already perfect | — |
| `components/layout/header/cart/mobile-cart-dropdown.tsx` | Quantity buttons | P1 |
| `components/shared/wishlist/wishlist-drawer.tsx` | Action buttons | P1 |
| `components/mobile/product/mobile-urgency-banner.tsx` | Icon containers | P3 |
| `components/mobile/product/mobile-gallery-olx.tsx` | Dot hit areas | P3 |

---

## Completion Criteria

- [ ] All P1 issues resolved (touch targets ≥ 40px)
- [ ] All P2 issues resolved (8px grid alignment)
- [ ] P3 issues addressed or documented as exceptions
- [ ] Typecheck passes
- [ ] E2E smoke tests pass
- [ ] Manual mobile testing confirms usability
- [ ] This file deleted ✅

---

## References

- [WCAG 2.2 Target Size (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) - 24px minimum, 44px recommended
- [Apple HIG Touch Targets](https://developer.apple.com/design/human-interface-guidelines/accessibility#Touch-targets) - 44pt minimum
- [Material Design Touch Targets](https://m3.material.io/foundations/accessible-design/accessibility-basics#28032e45-c598-450c-b355-f9fe737b1cd8) - 48dp recommended
- Project docs: `docs/DESIGN.md`, `docs/guides/MOBILE-TOUCH-TARGETS.md`

---

> ⚠️ **DELETE THIS FILE** after all tasks are complete and verified.
