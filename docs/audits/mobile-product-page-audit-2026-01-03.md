# 🔥 Mobile Product Page UI/UX Audit

**Date:** January 3, 2026  
**Page:** `/[locale]/[username]/[productSlug]` (Mobile PDP)  
**Verdict:** 70% production-ready — spacing chaos, oversized elements, inconsistent padding

---

## Executive Summary

The mobile product page has solid bones but suffers from:
- **Inconsistent horizontal padding** (`px-3` vs `px-4` throughout)
- **Oversized typography** (price at 20px instead of 16px)
- **Negative margin hacks** instead of proper layout
- **Design system violations** (arbitrary values, hover states on mobile)

---

## 1. Page Layout - Spacing Chaos

**File:** `components/mobile/product/mobile-product-page.tsx`

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 144 | Top padding too small for header | `pt-12` (48px) | `pt-14` (56px) |
| 168 | Title padding inconsistent | `px-3` | `px-3` ✓ (but others use px-4) |
| 174 | Price gap too tight | `pt-2` | `pt-1.5` |
| 181 | Negative margin hack | `-ml-1` | Remove, fix badges component |
| 191 | Urgency inconsistent | `mx-3` | `mx-3` (but badges has px-4) |
| 240 | Quick specs padding | `px-3` | Standardize all to `px-3` |
| 248 | Trust block margins | `mx-4 my-2` | `mx-3` to match |

### Fix Required
```tsx
// Line 144: Change
<div className="min-h-screen bg-background pb-24 pt-12 lg:hidden">
// To
<div className="min-h-screen bg-background pb-24 pt-14 lg:hidden">
```

---

## 2. Badges Row - Mixed Bag

**File:** `components/mobile/product/mobile-badges-row.tsx`

### ✅ Good
- WCAG contrast tokens
- Proper icon sizing with Lucide

### ❌ Problems

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 124 | Container padding too generous | `px-4 py-2` | `px-3 py-1.5` |
| 73-78 | Badge height oversized | `h-6` (24px) | `h-5` (20px) |
| — | Missing scroll indicators | None | Add dot indicators |

### Design System Reference
> "Micro (badges) 10px" — `text-2xs`, height should be 20px (`h-5`)

---

## 3. Price Block - Hardcoded Values

**File:** `components/mobile/product/mobile-price-block.tsx`

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 45 | Price font too large | `text-xl` (20px) | `text-base` (16px) |
| 58-64 | Arbitrary badge size | `text-[10px]` | `text-2xs` |
| 73 | Sparkle icon too small | `size-3` | `size-3.5` |

### Design System Reference
> "Current Price: 16px mobile, 18px desktop, weight 700"

### Fix Required
```tsx
// Line 45: Change
<span className={`text-xl font-bold ${hasDiscount ? "text-red-600..." : "text-foreground"}`}>
// To
<span className={`text-base font-bold ${hasDiscount ? "text-red-600..." : "text-foreground"}`}>
```

---

## 4. Seller Trust Line - Nearly Good

**File:** `components/mobile/product/mobile-seller-trust-line.tsx`

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 56 | Horizontal padding inconsistent | `px-4` | `px-3` |
| 57 | Active state transition | `active:bg-seller-banner/90` | Remove (instant states) |
| 62 | Avatar oversized | `size-9` (36px) | `size-8` (32px) |
| 68 | Fallback text large | `text-xs` | `text-2xs` |

### Design System Reference
> "Motion Policy: instant state changes, no transitions"

---

## 5. Quick Specs - Padding Wars

**File:** `components/mobile/product/mobile-quick-specs.tsx`

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 43 | Header gap inconsistent | `gap-1.5 mb-2` | `gap-2 mb-2` |
| 51 | Negative margin hack | `-mx-3 px-3` | Proper full-bleed container |
| 55 | Pill padding too big | `px-3 py-1.5` | `px-2 py-1` |
| 56 | Arbitrary width values | `min-w-[90px] max-w-[130px]` | `min-w-20 max-w-32` |
| 62-63 | Label/value size jump | `text-2xs` / `text-xs` | Both `text-2xs` |

### Fix Required
```tsx
// Line 55-56: Change
className="flex flex-col px-3 py-1.5 bg-muted/50 border border-border/50 rounded-lg shrink-0 snap-start min-w-[90px] max-w-[130px]"
// To
className="flex flex-col px-2 py-1 bg-muted/50 border border-border/50 rounded-lg shrink-0 snap-start min-w-20 max-w-32"
```

---

## 6. Trust Block - Actually Decent But...

**File:** `components/mobile/product/mobile-trust-block.tsx`

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 52 | Too many margins | `gap-2 py-3 px-3 mx-4 my-2` | `gap-2 py-2.5 px-3` (parent handles margins) |

### Note
Icon containers at `size-8` and text at `text-2xs` are correct per design system.

---

## 7. Accordions - Almost There

**File:** `components/shared/product/mobile-accordions.tsx`

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 43 | Trigger padding too tall | `py-3` | `py-2.5` |
| 44 | Useless hover state | `hover:bg-accent/50` | Remove for mobile |
| 54-56 | Double padding | `px-4 pb-4` → `p-3` | `px-4 pb-3` → `p-2.5` |
| 80 | Badge background clash | `bg-muted` on `bg-accent/30` | Use `bg-background/80` |

### Design System Reference
> "Touch: no hover states on mobile"

---

## 8. Seller Products Grid - Oversized

**File:** `components/shared/product/seller-products-grid.tsx`

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 65 | Excessive top spacing | `mt-6 pt-6` (48px total) | `mt-4 pt-3` (28px) |
| 69 | Header margin large | `mb-4` | `mb-3` |
| 96 | Arbitrary card width | `w-[130px]` | `w-32` (128px) |
| 103 | Uppercase hard to read | `uppercase` | Remove |
| 107 | Title margin too big | `mt-2.5` | `mt-1.5` |
| 111 | Price too small | `text-sm` (14px) | `text-base` (16px) |

### Design System Reference
> "Price: Always the largest element on product cards"

---

## 9. Customer Reviews - Fat

**File:** `components/shared/product/customer-reviews-hybrid.tsx`

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 61 | Header margin large | `mb-4` | `mb-3` |
| 67 | Rating circle massive | `h-16 w-16 border-4` (64px) | `h-12 w-12 border-2` (48px) |
| 105 | No reviews padding | `p-4` | `p-3` |

---

## 10. Sticky Bar - Good But...

**File:** `components/mobile/product/mobile-sticky-bar-enhanced.tsx`

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 71 | Double border on wishlist | `border border-border` | Remove inner border |
| 81 | CTA font too small | `text-sm` (14px) | `text-base` (16px) |
| 88 | Pill radius inconsistent | `rounded-full` | Consider `rounded-lg` for consistency |

---

## 11. Header - Minor Issues

**File:** `components/mobile/product/mobile-product-header.tsx`

| Line | Issue | Current | Should Be |
|------|-------|---------|-----------|
| 34 | Horizontal padding too tight | `px-1` | `px-2` |
| 40 | Icon small in proportion | `size-5` | `size-6` |

---

## Priority Fix List

### 🔴 Critical (Breaks Layout/UX)

| # | Component | Change | Reason |
|---|-----------|--------|--------|
| 1 | `mobile-product-page.tsx` | `pt-12` → `pt-14` | Content hidden behind header |
| 2 | ALL FILES | Standardize to `px-3` | Visual consistency |
| 3 | `mobile-price-block.tsx` | `text-xl` → `text-base` | Design system violation |

### 🟠 High (Visual Polish)

| # | Component | Change | Reason |
|---|-----------|--------|--------|
| 4 | `mobile-badges-row.tsx` | `h-6` → `h-5` | Badges oversized |
| 5 | `mobile-quick-specs.tsx` | Remove negative margins, `px-2 py-1` | Clean layout |
| 6 | `seller-products-grid.tsx` | `mt-6 pt-6` → `mt-4 pt-3` | Excessive spacing |
| 7 | `mobile-accordions.tsx` | Remove hover, `py-3` → `py-2.5` | Mobile-first |

### 🟡 Medium (Nice to Have)

| # | Component | Change | Reason |
|---|-----------|--------|--------|
| 8 | `customer-reviews-hybrid.tsx` | Rating circle 64px → 48px | Proportion |
| 9 | `mobile-seller-trust-line.tsx` | Avatar 36px → 32px | Compact |
| 10 | Sticky bar CTAs | Font 14px → 16px | Readability |

---

## Quick Reference: Design System Values

```
Typography
├── Price:       16px bold (text-base font-bold)
├── Body:        14px (text-sm)
├── Meta:        12px (text-xs)
├── Micro:       10px (text-2xs)
└── Badges:      10px (text-2xs), h-5 (20px)

Spacing
├── Mobile gap:  6px (gap-1.5)
├── Content:     8px (p-2)
├── Page edge:   12px (px-3)
└── Sections:    12px (gap-3)

Touch Targets
├── Primary CTA: 40px (h-10)
├── Standard:    36px (h-9)
├── Secondary:   32px (h-8)
├── Compact:     28px (h-7)
└── Minimum:     24px (h-6)

Radius
├── Badges:      2px (rounded-sm)
├── Buttons:     4px (rounded)
├── Cards:       6px (rounded-md) MAX
└── Pills:       9999px (rounded-full)
```

---

## Files to Edit

1. `components/mobile/product/mobile-product-page.tsx`
2. `components/mobile/product/mobile-badges-row.tsx`
3. `components/mobile/product/mobile-price-block.tsx`
4. `components/mobile/product/mobile-seller-trust-line.tsx`
5. `components/mobile/product/mobile-quick-specs.tsx`
6. `components/mobile/product/mobile-trust-block.tsx`
7. `components/mobile/product/mobile-sticky-bar-enhanced.tsx`
8. `components/mobile/product/mobile-product-header.tsx`
9. `components/shared/product/mobile-accordions.tsx`
10. `components/shared/product/seller-products-grid.tsx`
11. `components/shared/product/customer-reviews-hybrid.tsx`

---

*Audit by: AI Assistant*  
*Design System Reference: `docs/design-system/DESIGN.md`*
