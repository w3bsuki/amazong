# TAILWIND CSS v4 REFACTOR TASKS

## Executive Summary

This document provides a comprehensive audit and refactor plan for the codebase's Tailwind CSS usage. The codebase uses **Tailwind v4 with CSS-first configuration** (`@theme` in globals.css), which is excellent. However, there are **400+ instances** of hardcoded values that bypass the design system, creating inconsistency and maintenance overhead.

### Key Findings

| Category | Issues Found | Priority | Effort |
|----------|-------------|----------|--------|
| Hardcoded Colors (bg-*, text-*, border-*) | ~200+ | 🔴 HIGH | Medium |
| Arbitrary Font Sizes (`text-[Npx]`) | ~50+ | 🔴 HIGH | Low |
| Arbitrary Widths/Heights (`w-[Npx]`, `h-[Npx]`) | ~100+ | 🟡 MEDIUM | Medium |
| `bg-white`/`bg-black` (not semantic) | ~80+ | 🔴 HIGH | Low |
| Inconsistent Z-Index | ~50+ | 🟡 MEDIUM | Low |
| Inline Styles | ~30+ | 🟢 LOW | Medium |
| Magic Numbers in Positioning | ~10+ | 🔴 HIGH | Low |

---

## Phase 1: Critical Semantic Token Violations

### 1.1 Replace Hardcoded Color Classes with Semantic Tokens

**Priority: 🔴 HIGH** | **Files: ~40+** | **Estimated: 2-3 hours**

The design system has comprehensive semantic tokens but they're bypassed in many places.

#### Status Colors (Success/Error/Warning/Info)

These files use hardcoded Tailwind colors instead of `--color-status-*` or `--color-success/warning/error/info`:

```
❌ WRONG: bg-green-500, text-green-600, border-green-200
✅ RIGHT: bg-success, text-success, border-success/20

❌ WRONG: bg-red-500, text-red-600, border-red-200  
✅ RIGHT: bg-error, text-error, border-error/20

❌ WRONG: bg-amber-500, text-amber-600, border-amber-200
✅ RIGHT: bg-warning, text-warning, border-warning/20

❌ WRONG: bg-blue-500, text-blue-600, border-blue-200
✅ RIGHT: bg-info, text-info, border-info/20
```

**Files to fix:**

| File | Lines | Issue |
|------|-------|-------|
| `components/ai/ai-chatbot.tsx` | 812, 815, 830, 866, 869, 898, 928, 997-1004 | green-500/600/700, red-500/700 for success/error states |
| `app/[locale]/(sell)/_components/seller-onboarding-wizard.tsx` | 184-314, 400 | gray-100/200/500, blue-500/600, red-50/200/600 |
| `app/[locale]/(main)/seller/dashboard/_components/seller-dashboard-client.tsx` | 114-320 | gray-*, blue-600, green-*, amber-*, red-*, purple-600 |
| `app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx` | 113-125 | emerald-*, yellow-*, blue-*, green-*, red-*, gray-* for status |
| `app/[locale]/(account)/account/sales/_components/sales-stats.tsx` | 61-114 | emerald-*, red-* for trends |
| `app/[locale]/(business)/_components/business-stats-cards.tsx` | 45-135 | emerald-*, blue-*, purple-*, orange-*, amber-* |
| `app/[locale]/(business)/_components/business-recent-activity.tsx` | 55-61 | status color mapping |
| `app/[locale]/(business)/_components/business-performance-score.tsx` | 142-144 | emerald-*, yellow-*, red-* for score tiers |
| `app/[locale]/(business)/dashboard/discounts/page.tsx` | 70-74 | emerald-*, blue-*, gray-* for discount status |
| `app/[locale]/(business)/dashboard/settings/page.tsx` | 135-244 | purple-*, emerald-*, yellow-* |
| `app/[locale]/(account)/account/wishlist/_components/account-wishlist-*.tsx` | multiple | emerald-*, orange-* |
| `app/[locale]/(sell)/_components/ui/smart-category-picker.tsx` | 230, 359, 595 | green-600, orange-* |
| `app/[locale]/(sell)/_components/fields/review-field.tsx` | 53, 56, 309 | green-600 |
| `app/[locale]/(sell)/_components/fields/pricing-field.tsx` | 132 | green-600 |

**Fix Strategy:**

1. Add missing semantic tokens to `globals.css` `@theme` block if needed:
```css
@theme {
  /* Status variants with opacity support */
  --color-success-bg: oklch(0.95 0.05 145);
  --color-success-border: oklch(0.80 0.12 145);
  --color-warning-bg: oklch(0.95 0.05 85);
  --color-warning-border: oklch(0.80 0.12 85);
  --color-error-bg: oklch(0.95 0.05 27);
  --color-error-border: oklch(0.80 0.12 27);
  --color-info-bg: oklch(0.95 0.05 250);
  --color-info-border: oklch(0.80 0.12 250);
}
```

2. Replace hardcoded colors:
```tsx
// Before
className="bg-green-100 text-green-700 border-green-200"

// After
className="bg-success/10 text-success border-success/20"
```

---

### 1.2 Replace `bg-white` and `bg-black` with Semantic Tokens

**Priority: 🔴 HIGH** | **Files: ~30+** | **Estimated: 1 hour**

These bypass dark mode and semantic meaning.

```
❌ WRONG: bg-white
✅ RIGHT: bg-background, bg-card, bg-surface-card, bg-popover

❌ WRONG: bg-black/50
✅ RIGHT: bg-overlay-dark (already defined in @theme)

❌ WRONG: bg-white/90
✅ RIGHT: bg-background/90, bg-card/90
```

**Files to fix:**

| File | Lines | Current | Replace With |
|------|-------|---------|--------------|
| `components/desktop/marketplace-hero.tsx` | 44, 67 | bg-white/10, bg-white | bg-background/10, bg-background |
| `components/ui/slider.tsx` | 56 | bg-white | bg-background |
| `components/ui/sheet.tsx` | 40 | bg-black/50 | bg-overlay-dark |
| `components/ui/drawer.tsx` | 40 | bg-black/50 | bg-overlay-dark |
| `components/ui/dialog.tsx` | 41 | bg-black/50 | bg-overlay-dark |
| `components/ui/alert-dialog.tsx` | 39 | bg-black/50 | bg-overlay-dark |
| `components/ui/carousel-scroll-button.tsx` | 30 | bg-white | bg-background |
| `components/shared/product/product-gallery-hybrid.tsx` | 71 | bg-white | bg-background |
| `components/shared/product/product-buy-box.tsx` | 295-298 | bg-white | bg-background |
| `app/[locale]/(main)/wishlist/_components/wishlist-page-client.tsx` | 230 | bg-white/90 | bg-background/90 |
| `app/[locale]/(main)/_components/more-ways-to-shop.tsx` | 53, 55 | bg-black/35, bg-black/40 | bg-overlay-dark |
| `app/[locale]/(sell)/_components/seller-onboarding-wizard.tsx` | 182 | bg-white | bg-card |
| `app/[locale]/(sell)/_components/ui/photo-thumbnail.tsx` | 73, 84, 91, 96, 101, 113 | bg-white/*, bg-black/* | semantic variants |
| `app/[locale]/(sell)/_components/ui/image-preview-modal.tsx` | 23, 32 | bg-black/95, bg-white/* | bg-overlay-dark, bg-background/* |
| `components/layout/sidebar/sidebar-menu.tsx` | 218, 235, 309 | bg-white/* | bg-background/* |
| `components/sections/sign-in-cta.tsx` | 42 | bg-white | bg-cta-secondary |
| `components/sections/start-selling-banner.tsx` | 68 | bg-white/20 | bg-background/20 |
| `components/ai-elements/listing-preview-card.tsx` | 83 | bg-black/60 | bg-overlay-dark |

---

### 1.3 Fix Arbitrary Font Sizes

**Priority: 🔴 HIGH** | **Files: ~25+** | **Estimated: 45 mins**

The design system defines `--font-size-2xs: 0.625rem` (10px) in `@theme`. Use these tokens.

```
❌ WRONG: text-[9px], text-[10px], text-[11px], text-[13px]
✅ RIGHT: text-2xs (10px), text-xs (12px), text-sm (14px)
```

**Token mapping:**
- `text-[9px]` → `text-2xs` (close enough, 10px)
- `text-[10px]` → `text-2xs` (exact match)
- `text-[11px]` → `text-xs` (12px, close)
- `text-[13px]` → `text-sm` (14px, standard body)

**Files to fix:**

| File | Lines | Current | Replace With |
|------|-------|---------|--------------|
| `components/support/support-chat-widget.tsx` | 369 | text-[10px] | text-2xs |
| `components/shared/product/seller-products-grid.tsx` | 150 | text-[9px] | text-2xs |
| `components/shared/product/product-card.tsx` | 402 | text-[13px] | text-sm |
| `components/shared/product/product-buy-box.tsx` | 133, 228 | text-[11px], text-[10px] | text-xs, text-2xs |
| `components/shared/product/mobile-seller-card.tsx` | 23, 33, 39 | text-[11px] | text-xs |
| `components/shared/product/customer-reviews-hybrid.tsx` | 157, 165 | text-[10px] | text-2xs |
| `components/shared/product/category-badge.tsx` | 40 | text-[11px] | text-xs |
| `components/sections/newest-listings-section.tsx` | 327, 332 | text-[9px], text-[12px] | text-2xs, text-xs |
| `components/promo/promo-card.tsx` | 49 | text-[10px] | text-2xs |
| `components/layout/sidebar/sidebar-menu.tsx` | 123, 237, 296, 372-423 | text-[10px], text-[11px] | text-2xs, text-xs |
| `components/dropdowns/wishlist-dropdown.tsx` | 53 | text-[10px] | text-2xs |
| `components/dropdowns/notifications-dropdown.tsx` | 443, 497 | text-[10px] | text-2xs |
| `components/layout/header/cart/mobile-cart-dropdown.tsx` | 69 | text-[10px] | text-2xs |
| `components/common/wishlist/mobile-wishlist-button.tsx` | 32 | text-[10px] | text-2xs |
| `components/category/subcategory-circles.tsx` | 106, 113 | text-[10px] | text-2xs |
| `app/[locale]/(main)/members/_components/members-page-client.tsx` | 94 | text-[10px] | text-2xs |

---

### 1.4 Fix Magic Number Positioning

**Priority: 🔴 HIGH** | **Files: 2** | **Estimated: 15 mins**

Hardcoded `top-[52px]` assumes header height. Should use CSS variable or calc().

**Files to fix:**

| File | Line | Current | Fix |
|------|------|---------|-----|
| `components/category/mobile-category-tabs.tsx` | 54 | `top-[52px]` | `top-[var(--header-height,52px)]` |
| `app/[locale]/(main)/categories/layout.tsx` | 22 | `top-[52px]` | `top-[var(--header-height,52px)]` |

**Add to globals.css:**
```css
@theme {
  --header-height: 3.25rem; /* 52px - mobile header */
  --header-height-md: 3.5rem; /* 56px - desktop header */
}
```

---

## Phase 2: Medium Priority Refactors

### 2.1 Standardize Arbitrary Width/Height Values

**Priority: 🟡 MEDIUM** | **Files: ~40+** | **Estimated: 2 hours**

Many arbitrary width/height values could use container tokens or be standardized.

**Common patterns to fix:**

| Pattern | Occurrences | Replace With |
|---------|-------------|--------------|
| `w-[400px]`, `w-[380px]` | ~10 | `w-96` (384px) or custom token |
| `max-w-[420px]` | ~5 | `max-w-md` (448px) or `--container-xs` |
| `max-h-[300px]` | ~15 | Create `--max-h-dropdown: 18.75rem` |
| `w-[100px]` | ~5 | `w-24` (96px) or `w-28` (112px) |
| `h-[32px]` | ~5 | `h-8` (32px) - use Tailwind default |
| `sm:w-[400px]` | ~5 | `sm:w-96` |

**Files with most arbitrary values:**

| File | Count | Notes |
|------|-------|-------|
| `components/dropdowns/*.tsx` | ~20 | Dialog widths, max-heights |
| `components/ui/*.tsx` | ~15 | shadcn defaults, some ok |
| `components/shared/product/*.tsx` | ~10 | Gallery, carousel widths |
| `components/desktop/desktop-filter-modal.tsx` | ~5 | Modal dimensions |
| `components/category/subcategory-circles.tsx` | ~5 | Circle sizes |

**Recommended new tokens for globals.css:**

```css
@theme {
  /* Dropdown/popover dimensions */
  --container-dropdown-sm: 20rem;   /* 320px */
  --container-dropdown-md: 24rem;   /* 384px */
  --container-dropdown-lg: 28rem;   /* 448px */
  --max-h-dropdown: 18.75rem;       /* 300px */
  --max-h-modal: 85dvh;
  
  /* Circle/avatar sizes */
  --size-circle-sm: 3.5rem;   /* 56px */
  --size-circle-md: 5.625rem; /* 90px */
  --size-circle-lg: 6.25rem;  /* 100px */
}
```

---

### 2.2 Standardize Z-Index Scale

**Priority: 🟡 MEDIUM** | **Files: ~50+** | **Estimated: 1 hour**

Current z-index usage is inconsistent. Create a proper scale.

**Current chaos:**
- `z-[100]` - toast, skip-links
- `z-[60]` - mobile product header
- `z-50` - EVERYTHING else (sheets, dialogs, drawers, dropdowns, sticky elements)
- `z-30` - category tabs
- `z-[1]` - product card link overlay

**Proposed z-index scale tokens:**

```css
@theme {
  --z-dropdown: 50;
  --z-sticky: 40;
  --z-modal: 50;
  --z-popover: 50;
  --z-toast: 100;
  --z-tooltip: 50;
  --z-overlay: 49;
}
```

**Key files to audit:**
- All `components/ui/*.tsx` (shadcn components)
- `components/dropdowns/*.tsx`
- `components/layout/header/*.tsx`
- `components/mobile/*.tsx`

---

### 2.3 Convert Inline Styles to CSS Variables

**Priority: 🟢 LOW** | **Files: ~30** | **Estimated: 1.5 hours**

Most inline styles are dynamic values (scrollbar hiding, dynamic positioning). Some can be converted.

**Acceptable inline styles (keep):**
- Dynamic `top` positioning based on header height
- `scrollbarWidth: "none"` for horizontal scroll areas
- Dynamic `width` based on measured elements
- Animation delays in loops

**Should convert:**
| File | Line | Current | Fix |
|------|------|---------|-----|
| `components/navigation/category-subheader.tsx` | 277 | `maxHeight: "min(calc(100vh - 150px), 640px)"` | CSS variable |
| `components/sections/newest-listings-section.tsx` | 302 | `style={{ top: headerHeight }}` | CSS variable |

---

## Phase 3: Component-Level Cleanup

### 3.1 AI Chatbot Component Overhaul

**File:** `components/ai/ai-chatbot.tsx`

This file has the most hardcoded colors (~20 instances). Full refactor needed.

**Before/After examples:**

```tsx
// Before (line 812)
className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 p-4"

// After
className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-success/20 bg-success/5 p-4"
```

```tsx
// Before (line 898)
<div className="w-full max-w-5xl rounded-xl border border-red-500/30 bg-red-500/10 p-3 sm:p-4">

// After
<div className="w-full max-w-5xl rounded-xl border border-error/30 bg-error/10 p-3 sm:p-4">
```

---

### 3.2 Seller Onboarding Wizard Refactor

**File:** `app/[locale]/(sell)/_components/seller-onboarding-wizard.tsx`

Heavy use of `gray-*`, `blue-*` colors. Convert to semantic tokens.

**Key replacements:**
- `bg-white` → `bg-card`
- `border-gray-200` → `border-border`
- `bg-gray-100` → `bg-muted`
- `text-gray-900` → `text-foreground`
- `text-gray-500` → `text-muted-foreground`
- `bg-blue-600` → `bg-primary`
- `border-blue-500` → `border-primary`

---

### 3.3 Business Dashboard Components

**Files:** `app/[locale]/(business)/_components/*.tsx`

Multiple files with status color patterns. Create shared status badge variants.

**Recommended approach:**

Create a `StatusBadge` component or extend Badge with status variants:

```tsx
// components/ui/status-badge.tsx
const statusVariants = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-error/10 text-error border-error/20",
  info: "bg-info/10 text-info border-info/20",
  neutral: "bg-muted text-muted-foreground border-border",
}
```

---

## Phase 4: Design System Enhancements

### 4.1 Missing Tokens to Add

Add these to `globals.css` `@theme` block:

```css
@theme {
  /* === MISSING SEMANTIC TOKENS === */
  
  /* Header height for sticky positioning */
  --header-height: 3.25rem;      /* 52px mobile */
  --header-height-md: 3.5rem;    /* 56px desktop */
  
  /* Status color variants (bg/border) */
  --color-success-bg: oklch(0.95 0.05 145);
  --color-success-border: oklch(0.80 0.12 145);
  --color-warning-bg: oklch(0.95 0.05 85);
  --color-warning-border: oklch(0.80 0.12 85);
  --color-error-bg: oklch(0.95 0.05 27);
  --color-error-border: oklch(0.80 0.12 27);
  --color-info-bg: oklch(0.95 0.05 250);
  --color-info-border: oklch(0.80 0.12 250);
  
  /* Dropdown dimensions */
  --container-dropdown-sm: 20rem;
  --container-dropdown-md: 24rem;
  --container-dropdown-lg: 28rem;
  --max-h-dropdown: 18.75rem;
  
  /* Z-index scale */
  --z-base: 0;
  --z-dropdown: 50;
  --z-sticky: 40;
  --z-overlay: 45;
  --z-modal: 50;
  --z-toast: 100;
}
```

---

### 4.2 Dark Mode Audit

Many components with hardcoded colors lack `dark:` variants. Priority files:

| File | Issue |
|------|-------|
| `seller-onboarding-wizard.tsx` | No dark mode at all |
| `seller-dashboard-client.tsx` | Missing dark variants |
| `business-*.tsx` components | Partial dark mode |
| `marketplace-hero.tsx` | Hardcoded light colors |

---

## Task Execution Checklist

### Batch 1: Quick Wins (30 mins)
- [ ] Fix magic number `top-[52px]` (2 files)
- [ ] Add `--header-height` token to globals.css
- [ ] Replace `text-[10px]` → `text-2xs` (15 files)
- [ ] Replace `text-[9px]` → `text-2xs` (3 files)

### Batch 2: White/Black Cleanup (45 mins)
- [ ] Replace `bg-black/50` → `bg-overlay-dark` in UI components (4 files)
- [ ] Replace `bg-white` → `bg-background/bg-card` (20 files)
- [ ] Add dark mode variants where missing

### Batch 3: Status Colors (1.5 hours)
- [ ] Add status token variants to globals.css
- [ ] Refactor `ai-chatbot.tsx` (20 instances)
- [ ] Refactor `seller-onboarding-wizard.tsx` (30 instances)
- [ ] Refactor `seller-dashboard-client.tsx` (25 instances)
- [ ] Refactor `business-*.tsx` components (50+ instances)
- [ ] Refactor `account-orders-grid.tsx` status colors

### Batch 4: Arbitrary Values (1.5 hours)
- [ ] Audit and fix `text-[11px]` → `text-xs` (10 files)
- [ ] Audit and fix `text-[13px]` → `text-sm` (5 files)
- [ ] Add dropdown dimension tokens
- [ ] Standardize popover/dropdown widths

### Batch 5: Z-Index Standardization (45 mins)
- [ ] Add z-index tokens to globals.css
- [ ] Audit and update z-index values across components
- [ ] Document z-index scale in design system docs

---

## Validation Commands

After refactoring, run these to validate:

```bash
# Type check
pnpm exec tsc --noEmit

# Search for remaining arbitrary values
grep -r "text-\[\d" components/ app/ --include="*.tsx"
grep -r "bg-white\|bg-black" components/ app/ --include="*.tsx"
grep -r "bg-gray-\|text-gray-\|border-gray-" components/ app/ --include="*.tsx"
grep -r "bg-green-\|bg-red-\|bg-amber-\|bg-blue-" components/ app/ --include="*.tsx"

# Build to check for CSS errors
pnpm build

# Run E2E smoke tests
pnpm exec cross-env REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 node scripts/run-playwright.mjs test e2e/smoke.spec.ts --project=chromium
```

---

## Summary

| Priority | Tasks | Time Estimate | Impact |
|----------|-------|---------------|--------|
| 🔴 HIGH | Semantic colors, font sizes, magic numbers | 3 hours | High - consistency |
| 🟡 MEDIUM | Arbitrary values, z-index | 2.5 hours | Medium - maintainability |
| 🟢 LOW | Inline styles, edge cases | 1.5 hours | Low - polish |
| **TOTAL** | | **~7 hours** | |

The most impactful changes are in Phase 1 (semantic tokens). These ensure:
1. Dark mode works consistently
2. Design changes propagate automatically
3. Code is more readable and maintainable
4. Accessibility contrast ratios are controlled centrally
