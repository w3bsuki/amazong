# UI/UX Complete Refactor Plan
## Amazong → eBay-Quality E-commerce Experience

> **Goal**: Transform Amazong into a pixel-perfect, production-ready marketplace with eBay-level UX, clean architecture, zero tech debt, and exceptional performance on both mobile and desktop.

---

## Executive Summary

### Current State Assessment

| Metric | Current | Target |
|--------|---------|--------|
| **CSS Lines** | 1,643 | ~800 |
| **Design Tokens** | Duplicated/Scattered | Centralized |
| **Component Count** | 127 (65 UI + 62 custom) | ~80 (consolidated) |
| **Mobile UX** | Functional | Pixel-perfect |
| **Desktop UX** | Good | Premium eBay-quality |
| **Tech Debt** | Medium | Zero |
| **Type Safety** | Partial | 100% |

### Key Issues Identified

1. **Over-engineered globals.css** - 1,643 lines with duplicate tokens
2. **Component bloat** - `category-subheader.tsx` (1,170 lines), `product-page-content-new.tsx` (977 lines)
3. **Inconsistent styling patterns** - Mix of semantic tokens and hardcoded values
4. **Mobile UX gaps** - Touch targets, spacing, sticky elements need refinement
5. **Shadcn v4 misuse** - Not leveraging new utility classes properly
6. **Missing loading/error states** - Skeleton implementations incomplete

---

## Phase 1: Foundation Cleanup (Week 1)
### 🎯 Goal: Eliminate tech debt, establish clean base

---

### 1.1 Design Token Consolidation

#### Current Problem
`globals.css` has 500+ CSS variables with significant duplication:
- `--brand` and `--brand-blue` serve same purpose
- `--cta-primary` duplicates `--brand`
- Typography tokens scattered across `:root`, `@theme`, and utilities

#### Refactor Actions

```diff
# globals.css consolidation

- --brand: oklch(0.48 0.22 260);
- --brand-light: oklch(0.58 0.18 260);
- --brand-dark: oklch(0.40 0.24 260);
- --brand-blue: oklch(0.48 0.20 260);
- --brand-blue-light: oklch(0.58 0.16 260);
- --brand-blue-dark: oklch(0.40 0.22 260);
+ --brand: oklch(0.48 0.22 260);
+ --brand-hover: oklch(0.40 0.24 260);
+ --brand-muted: oklch(0.97 0.02 260);
```

#### Files to Modify

| File | Action |
|------|--------|
| `app/globals.css` | Consolidate 500+ vars → ~200 essential tokens |
| `components.json` | Update to Tailwind v4 config |
| All components | Migrate from deprecated tokens |

---

### 1.2 Tailwind v4 Proper Usage

#### Current Issues
- `@utility` blocks reinventing Tailwind utilities
- Not using new `@theme inline` properly
- Hardcoded values in components instead of tokens

#### Tailwind v4 Best Practices to Implement

```css
/* BEFORE: Over-engineered custom utility */
@utility text-heading-1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-tight);
}

/* AFTER: Use Tailwind directly */
/* In component: className="text-2xl font-bold leading-tight" */
```

#### Files to Audit

| File | Issue | Fix |
|------|-------|-----|
| `globals.css` | 20+ redundant `@utility` blocks | Remove, use Tailwind |
| `container` utility | Duplicates Tailwind container | Use Tailwind's |
| Typography utilities | 12 custom text utilities | Use Tailwind's prose or direct |

---

### 1.3 Shadcn Component Audit

#### Current shadcn Config
```json
{
  "style": "new-york",
  "tailwind": {
    "cssVariables": true,
    "baseColor": "neutral"
  }
}
```

#### Issues Found

| Component | Issue | Action |
|-----------|-------|--------|
| `button.tsx` | Good, properly configured | Keep |
| `card.tsx` | Over-styled per-use | Standardize |
| `sheet.tsx` | Missing animation cleanup | Fix |
| `dialog.tsx` | Good | Keep |
| `checkbox.tsx` | Needs touch optimization | Enhance |

---

## Phase 2: Component Consolidation (Week 2)
### 🎯 Goal: Break down mega-components, eliminate redundancy

---

### 2.1 Category Components Refactor

#### Current State: Over-engineered
```
category-subheader.tsx    → 1,170 lines (❌ Too big)
mega-menu.tsx             → 35,336 bytes
sidebar-menu.tsx          → 36,235 bytes
category-circles.tsx      → 11,675 bytes
subcategory-circles.tsx   → 12,191 bytes
```

#### Target State: Clean Separation
```
components/
├── category/
│   ├── CategoryNav.tsx          (~150 lines) - Main nav wrapper
│   ├── CategoryItem.tsx         (~50 lines)  - Single category
│   ├── CategoryMegaMenu.tsx     (~200 lines) - Desktop mega menu
│   ├── CategoryMobileSheet.tsx  (~150 lines) - Mobile sheet
│   ├── CategoryCircle.tsx       (~40 lines)  - Circle component
│   └── config/
│       └── mega-menu-config.ts  (~300 lines) - Extracted config
```

#### Refactor Steps

1. **Extract mega menu configuration**
   - Move 500-line `MEGA_MENU_CONFIG` object to `lib/category-config.ts`
   - Add TypeScript strict types

2. **Split category-subheader.tsx**
   - Extract `MegaMenuDropdown` as separate component
   - Extract `CategoryCircleNav` 
   - Extract `MoreCategoriesSheet`

3. **Merge similar components**
   - `category-circles.tsx` + `subcategory-circles.tsx` → Single `CategoryCircles.tsx` with variant prop

---

### 2.2 Product Components Refactor

#### Current State
```
product-page-content-new.tsx  → 977 lines (❌ Too big)
product-card.tsx              → 274 lines (✓ OK)
product-form.tsx              → 12,485 bytes
product-form-enhanced.tsx     → 27,788 bytes (duplicate?)
```

#### Target State
```
components/
├── product/
│   ├── ProductCard.tsx           (~150 lines)
│   ├── ProductGallery.tsx        (~200 lines) - Images + zoom
│   ├── ProductBuyBox.tsx         (~150 lines) - Price + CTA
│   ├── ProductDetails.tsx        (~100 lines) - Specs
│   ├── ProductSeller.tsx         (~100 lines) - Seller info
│   ├── ProductReviews.tsx        (existing reviews-section.tsx)
│   └── ProductStickyBar.tsx      (~80 lines)  - Mobile sticky CTA
```

#### Breaking Down product-page-content-new.tsx

| Extract | Lines | Responsibility |
|---------|-------|----------------|
| `ProductGallery` | ~200 | Image carousel, thumbnails, zoom modal |
| `ProductBuyBox` | ~150 | Price, discount, action buttons |
| `ProductSellerCard` | ~100 | Seller info, ratings, hover card |
| `ProductShipping` | ~80 | Shipping/delivery info |
| `ProductSpecs` | ~100 | Tech specs, package contents |

---

### 2.3 Filter Components Consolidation

#### Current State
```
mobile-filters.tsx         → 434 lines
desktop-filters.tsx        → 9,638 bytes
desktop-filter-modal.tsx   → 32,042 bytes (❌ Huge)
search-filters.tsx         → 21,672 bytes
attribute-filters.tsx      → 11,895 bytes
filter-chips.tsx           → 5,399 bytes
```

#### Target State
```
components/
├── filters/
│   ├── FilterSheet.tsx          - Mobile bottom sheet
│   ├── FilterSidebar.tsx        - Desktop sidebar
│   ├── FilterChips.tsx          - Active filter pills
│   ├── FilterSection.tsx        - Individual filter section
│   └── hooks/
│       └── useFilters.ts        - Shared filter logic
```

---

## Phase 3: Mobile UX Excellence (Week 3)
### 🎯 Goal: eBay-quality mobile experience

---

### 3.1 Touch Target Audit

#### WCAG 2.1 Requirements
- **Minimum**: 44x44px touch targets
- **Spacing**: 8px+ between targets

#### Components to Fix

| Component | Current | Required | Action |
|-----------|---------|----------|--------|
| `ProductCard` button | 36px | 44px | `min-h-11` |
| `MobileTabBar` items | 44px ✓ | 44px | Good |
| `FilterChips` | 40px | 44px | Increase |
| `CategoryCircles` | Variable | 44px | Standardize |
| Rating stars | 12px | 44px area | Add hit area |

---

### 3.2 Mobile Navigation Improvements

#### Current Issues
1. Mobile header too cramped (py-1.5)
2. Search overlay animation janky
3. Cart dropdown positioning off

#### Fixes

```tsx
// site-header.tsx
// BEFORE
<div className="md:hidden bg-header-bg text-header-text px-2 py-1.5 flex items-center">

// AFTER - Better spacing
<div className="md:hidden bg-header-bg text-header-text px-3 py-2 flex items-center gap-2">
```

---

### 3.3 Mobile Product Page Fixes

#### Current Issues
1. Sticky CTA bar overlaps content
2. Image gallery swipe not smooth
3. Buy box appears twice (inline + sticky)

#### Actions

| Issue | Fix |
|-------|-----|
| Sticky overlap | Add `pb-[env(safe-area-inset-bottom)+80px]` |
| Gallery swipe | Add `touch-action: pan-x` to container |
| Duplicate CTA | Show sticky only when inline scrolls out |

---

### 3.4 Mobile Search/Filter UX

#### Current Issues
1. Filter sheet max-height cuts content
2. No "results will update" indicator
3. Filter chips overflow handling poor

#### Target Behavior (eBay-style)
- Full-screen filter sheet on mobile
- Live result count in sheet header
- Sticky "Apply" button at bottom
- Horizontal scroll for chips with gradient fade

---

## Phase 4: Desktop UX Polish (Week 4)
### 🎯 Goal: Premium desktop experience matching eBay quality

---

### 4.1 Header/Navigation Cleanup

#### Current vs Target

| Element | Current | eBay Target |
|---------|---------|-------------|
| Header height | 64px | 56px (lighter) |
| Search width | max-w-2xl | max-w-xl (tighter) |
| Logo | Text "AMZN" | Text + proper sizing |
| Dropdowns | Various styles | Unified design |

---

### 4.2 Search Results Page

#### Grid Improvements
```tsx
// Current: 5 columns max
grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5

// eBay-style: Denser on large screens
grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
```

#### Sidebar Filter UX
- Collapsible sections with smooth animations
- "See all" expandable lists
- Price range slider (not just presets)
- Applied filters summary at top

---

### 4.3 Product Page Desktop Layout

#### Current Issues
1. Image container too tall
2. Buy box sticky behavior inconsistent
3. Seller section layout cluttered

#### eBay-style Layout

```
┌────────────────────────────────────────────────────────┐
│ Breadcrumb                                             │
├────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────┐ ┌───────────────────┐ │
│ │                             │ │ Title + Rating    │ │
│ │         Gallery             │ │ Price             │ │
│ │       (sticky top)          │ │ Condition         │ │
│ │                             │ │ ━━━━━━━━━━━━━━━━━ │ │
│ │ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │ │ [Buy Now]         │ │
│ │ │ 1 │ │ 2 │ │ 3 │ │ 4 │    │ │ [Add to Cart]     │ │
│ │ └───┘ └───┘ └───┘ └───┘    │ │ [Watchlist]       │ │
│ └─────────────────────────────┘ │ ━━━━━━━━━━━━━━━━━ │ │
│                                 │ Shipping Info     │ │
│                                 │ Returns Policy    │ │
│                                 │ Seller Card       │ │
│                                 └───────────────────┘ │
├────────────────────────────────────────────────────────┤
│ Description | Shipping | Returns | Reviews (tabs)     │
└────────────────────────────────────────────────────────┘
```

---

## Phase 5: Performance & Polish (Week 5)
### 🎯 Goal: Sub-100ms interactions, perfect loading states

---

### 5.1 Loading States Audit

#### Missing Skeletons

| Page/Component | Has Skeleton | Priority |
|----------------|--------------|----------|
| Homepage | ✓ Partial | High |
| Search results | ✗ Needs grid | High |
| Product page | ✗ None | Critical |
| Category mega menu | ✗ None | Medium |
| Cart sheet | ✗ None | Medium |

---

### 5.2 Image Optimization

#### Current State
- Using `next/image` ✓
- `productBlurDataURL` helper ✓
- Missing: Responsive image sizing on some components

#### Fixes Needed

| Component | Issue | Fix |
|-----------|-------|-----|
| `ProductCard` | Fixed sizes | Use `sizes` based on grid |
| `HeroCarousel` | LCP image delay | Add `priority` to first |
| Category images | No blur | Add blur placeholders |

---

### 5.3 Animation Performance

#### Current Animations to Audit
```css
/* globals.css */
@keyframes fadeIn { ... }
@keyframes slideInFromLeft { ... }
@keyframes slideUp { ... }
```

#### Performance Rules
1. Use `transform` and `opacity` only
2. Add `will-change` selectively
3. Keep durations ≤150ms for UI feedback
4. Use CSS over JS animations

---

## Phase 6: Mobile-Specific Refinements (Week 6)
### 🎯 Goal: Pixel-perfect mobile like eBay app

---

### 6.1 iOS Safari Fixes

#### Issues to Address

| Issue | Current | Fix |
|-------|---------|-----|
| Zoom on input | 16px font ✓ | Already fixed |
| Bounce scroll | Not prevented | Add `overscroll-behavior` |
| Safe area | `pb-safe` ✓ | Audit all fixed elements |
| Momentum scroll | Missing in places | Add `-webkit-overflow-scrolling` |

---

### 6.2 Mobile Bottom Sheet UX

#### Target Behavior (eBay Quality)

1. **Drag to dismiss**
   - Velocity-based dismissal
   - Snap points (25%, 50%, 100%)
   - Background blur

2. **Proper keyboard handling**
   - Sheet adjusts for keyboard
   - Input scrolls into view

3. **Scroll containment**
   - Internal scroll when expanded
   - Parent scroll when at top/bottom

---

### 6.3 Mobile Product Cards

#### Current vs eBay Comparison

| Aspect | Current | eBay Target |
|--------|---------|-------------|
| Image ratio | 1:1 | 1:1 ✓ |
| Title lines | 2 | 2 ✓ |
| Price size | 14-16px | 16px bold |
| Touch target | 36px button | Full card tap |
| Rating display | Stars + count | Stars + count ✓ |
| Add to cart | Button | Icon button |

---

## Implementation Priority Matrix

| Phase | Priority | Effort | Impact |
|-------|----------|--------|--------|
| 1.1 Token Consolidation | P0 | Medium | High |
| 1.2 Tailwind v4 Cleanup | P0 | Medium | High |
| 2.1 Category Refactor | P1 | High | Medium |
| 2.2 Product Refactor | P1 | High | High |
| 3.1 Touch Targets | P0 | Low | High |
| 3.2 Mobile Nav | P1 | Medium | High |
| 4.1 Desktop Header | P2 | Low | Medium |
| 5.1 Loading States | P1 | Medium | High |
| 6.1 iOS Fixes | P0 | Low | High |

---

## File Removal Candidates

Files that should be deleted after refactor:

| File | Reason |
|------|--------|
| `product-form.tsx` | Duplicate of enhanced version |
| `header-dropdowns.tsx` (50KB!) | Split into individual dropdowns |
| `desktop-filter-modal.tsx` | Merge with filter components |
| Multiple `*.md` docs | Clean up root directory |

---

## Success Criteria

### Quantitative
- [ ] CSS reduced from 1,643 → <800 lines
- [ ] Component count reduced by 30%
- [ ] All touch targets ≥44px
- [ ] LCP <2.5s on mobile
- [ ] FID <100ms

### Qualitative
- [ ] Matches eBay visual quality
- [ ] Smooth 60fps animations
- [ ] No janky scroll behaviors
- [ ] Professional loading states
- [ ] Consistent spacing/typography

---

## Quick Wins (Do First)

1. **Touch targets** - 30min to fix all
2. **iOS zoom prevention** - Already done ✓
3. **Safe area padding** - Audit and fix
4. **Remove duplicate tokens** - 1hr cleanup
5. **Add missing loading skeletons** - 2hrs

---

## Notes

- All changes should maintain i18n support (en/bg)
- Keep Phosphor icons as primary icon library
- Maintain dark mode support in all changes
- Test on iOS Safari and Chrome Android
