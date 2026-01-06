# Product Details Page - Full UI/UX Audit

> **Page:** `/[locale]/[username]/[productSlug]` (e.g., `/bg/shop4e/123123123123`)  
> **Date:** January 2, 2026  
> **Design System:** Tailwind CSS v4 + shadcn/ui + OKLCH  
> **Reference:** [DESIGN.md](../design-system/DESIGN.md)

---

## Executive Summary

The product details page has a solid foundation but suffers from **inconsistent spacing**, **desktop layout inefficiencies**, and **mobile UX friction points**. Key violations of our shadcn/Tailwind v4 best practices include oversized touch targets on desktop, improper container usage, and suboptimal information hierarchy.

### Critical Priority Fixes

| Priority | Issue | Impact |
|----------|-------|--------|
| 🔴 P0 | Desktop layout wastes space above fold | Lost conversions |
| 🔴 P0 | Mobile price block spacing inconsistent | Brand quality |
| 🔴 P0 | Sticky bar too tall (64px vs 56px spec) | Screen real estate |
| 🟡 P1 | Gallery container too narrow on desktop | Product presentation |
| 🟡 P1 | Buy box form uses non-standard spacing | Visual consistency |
| 🟡 P1 | Mobile header redundant (already in layout) | Wasted space |
| 🟢 P2 | Item specifics layout not scannable | UX friction |
| 🟢 P2 | Trust badges use rounded-full on icons | Design system violation |

---

## 1. Architecture Analysis

### Current Component Structure

```
ProductPageLayout (product-page-layout.tsx)
├── Mobile: MobileProductPage (lg:hidden)
│   ├── MobileProductHeader - REDUNDANT, remove
│   ├── ProductGalleryHybrid - OK
│   ├── MobilePriceBlock - Needs spacing fix
│   ├── Select (variants) - OK
│   ├── MobileUrgencyBanner - OK, well implemented
│   ├── Title (h1) - Spacing inconsistent
│   ├── MobileBadgesRow - OK, good WCAG compliance
│   ├── MobileSellerTrustLine - Good, needs minor tweaks
│   ├── MobileQuickSpecs - Good
│   ├── MobileTrustBlock - Good
│   ├── MobileAccordions - OK
│   ├── SellerProductsGrid - Needs mobile optimization
│   ├── CustomerReviewsHybrid - OK
│   └── MobileStickyBarEnhanced - Height violation
│
└── Desktop: div.hidden.lg:block
    ├── RecentlyViewedTracker - OK
    ├── Grid 12-col
    │   ├── Col 7: Gallery + CategoryBadge + ItemSpecifics + SellersNote
    │   └── Col 5: SellerBanner + ProductBuyBox + TrustBadges (sticky)
    ├── SellerProductsGrid - OK
    └── CustomerReviewsHybrid - OK
```

### Issues Identified

1. **Mobile header is redundant** - The app layout already has a header
2. **Desktop uses 12-col grid but only 7+5** - Should be 7+5 or 8+4 max
3. **Gallery doesn't take full width on mobile** - Edge-to-edge is correct
4. **Item specifics rendered TWICE** - Once in left col, once inside ProductBuyBox

---

## 2. Mobile Audit (Detailed)

### 2.1 Above-the-Fold Analysis

**Current viewport (375px wide, ~667px tall):**
```
┌─────────────────────────────────────┐
│ [Header - from layout]        48px  │
├─────────────────────────────────────┤
│ [MobileProductHeader]         48px  │ ← REMOVE (duplicate)
├─────────────────────────────────────┤
│                                     │
│       GALLERY (aspect-square)       │ 375px
│                                     │
├─────────────────────────────────────┤
│ лв 24.99  (вкл. ДДС)               │ Price block
│ You save лв 8.00                   │
├─────────────────────────────────────┤
│ [Urgency Banner - conditional]      │
├─────────────────────────────────────┤
│ Product Title Here That Can Be...   │ ← Below fold on small devices
```

**Problems:**
1. `MobileProductHeader` adds 48px of wasted space
2. Gallery + price barely fit above fold
3. User must scroll to see title and CTA

**Fix:** Remove `MobileProductHeader`, let gallery start immediately after layout header.

### 2.2 Component-by-Component Audit

#### MobilePriceBlock ✅ (Minor Issues)

```tsx
// Current - Good
<span className="text-xl font-bold">  // 20px - within spec (16-18px recommended)
<span className="text-xs line-through"> // 12px - correct
<Badge className="text-[10px]">        // 10px - correct for badges
```

**Issues:**
- `text-xl` (20px) is slightly larger than spec (16-18px) - OK for mobile emphasis
- Gap `gap-0.5` is too tight between savings icon and text

**Fix:**
```tsx
// Change
<div className="flex items-center gap-1">  // was gap-1, add gap-1.5
  <Sparkles className="size-3 text-price-savings" />
  <span className="text-tiny font-medium">...</span>
</div>
```

#### MobileBadgesRow ✅ (Good)

Implements WCAG 2.2 AA correctly:
- `h-6` (24px) badges - meets minimum touch target
- `text-2xs` (10px) font with proper contrast
- Semantic colors from design system tokens
- `shrink-0` prevents badge squishing
- `scrollbar-hide` for clean horizontal scroll

**No changes needed.**

#### MobileSellerTrustLine ✅ (Minor Issues)

Good implementation but:
- `h-7` (28px) visit button is compact but OK for secondary action
- Uses `text-tiny` (11px) which is correct
- Banner color `bg-seller-banner` is good semantic token

**Issue:** Avatar border `border-2 border-white/30` - inconsistent with design system (should use `border-border`)

**Fix:**
```tsx
// Change
<Avatar className="size-9 border border-border shrink-0">
```

#### MobileStickyBarEnhanced 🔴 (Violations)

**Current:**
```tsx
<div className="fixed inset-x-0 bottom-0 z-50 ...">
  <div className="flex items-center gap-2 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
    <Button className="size-10" />        // 40px wishlist
    <Button className="h-11" />           // 44px cart ← VIOLATION
    <Button className="h-11" />           // 44px buy now ← VIOLATION
  </div>
</div>
```

**Design System Spec:**
- Bottom bar: 56px + safe area
- Primary CTA: **40px max** (`h-10`)
- Secondary: 36px (`h-9`)

**Violations:**
1. `h-11` (44px) exceeds 40px max
2. Container padding creates ~64px total height

**Fix:**
```tsx
// Correct implementation
<div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background shadow-[0_-2px_10px_rgba(0,0,0,0.08)] lg:hidden">
  <div className="flex items-center gap-2 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
    {/* Wishlist - 36px secondary */}
    <Button variant="ghost" size="icon" className="shrink-0 size-9 rounded-full border border-border">
      <Heart className="size-5" />
    </Button>
    
    {/* Add to Cart - 40px primary */}
    <Button variant="outline" className="flex-1 h-10 text-sm font-bold rounded-full border-primary text-primary">
      <ShoppingCart className="size-5 mr-1.5" />
      <span>Add</span>
    </Button>
    
    {/* Buy Now - 40px primary */}
    <Button className="flex-1 h-10 text-sm font-bold rounded-full bg-brand text-white">
      Buy Now
    </Button>
  </div>
</div>
```

#### MobileQuickSpecs ✅ (Good)

Well-implemented horizontal scrolling specs:
- `min-h-touch` (32px) on see-all button - correct
- `text-2xs` (10px) labels - correct
- Clean pill design with `rounded-lg` - acceptable for pills

**No changes needed.**

#### MobileTrustBlock ✅ (Minor Issues)

Good grid layout, but:
- Icons use `rounded-md` container - correct
- `size-8` (32px) icon containers - correct
- `text-2xs` labels - correct

**Issue:** `mx-4 my-2 rounded-md` - inconsistent with page padding `px-3`

**Fix:**
```tsx
// Change mx-4 to match page padding
<div className="grid grid-cols-4 gap-2 py-3 px-3 bg-muted/30 rounded-md border border-border/50">
```

### 2.3 Mobile Information Architecture

**Current order:**
1. Gallery
2. Price
3. Variants (if exist)
4. Urgency (conditional)
5. Title ← Should be higher
6. Badges
7. Seller trust line
8. Quick specs
9. Trust block
10. Accordions
11. Related products
12. Reviews

**Recommended order (conversion-optimized):**
1. Gallery
2. **Title** (moved up - users need context for price)
3. Price + Savings
4. Badges (condition, shipping, stock)
5. Urgency (if applicable)
6. Variants (if exist)
7. Seller trust line
8. Quick specs
9. Trust block
10. Accordions
11. Related products
12. Reviews

---

## 3. Desktop Audit (Detailed)

### 3.1 Layout Analysis

**Current Grid:**
```tsx
<div className="container px-8 py-10">
  <div className="grid grid-cols-12 gap-12 items-start">
    <div className="col-span-7">...</div>  // Gallery + Details
    <div className="col-span-5">...</div>  // Buy box
  </div>
</div>
```

**Issues:**
1. `gap-12` (48px) is excessive - should be `gap-6` or `gap-8` per design system
2. `px-8` (32px) + container padding = 64px total - too much
3. Gallery constrained to `lg:max-w-[600px]` but column is wider
4. Buy box sticky `top-24` but header is ~64px - mismatch

### 3.2 Gallery Container Issues

**Current:**
```tsx
<div className="flex flex-col gap-3 w-full lg:max-w-[600px]">
```

**Problem:** 600px gallery in a ~7/12 column (~840px at 1440px container) leaves awkward whitespace.

**Fix:** Either:
A) Remove `lg:max-w-[600px]` and let gallery fill column
B) Use CSS custom property: `--container-gallery: 36rem` (576px) which is defined in globals.css

```tsx
<div className="flex flex-col gap-3 w-full max-w-container-gallery">
```

### 3.3 Buy Box Deep Dive

**Current Structure:**
```tsx
<ProductBuyBox>
  ├── Title + Seller Info (hidden on mobile)
  ├── Price Section
  ├── Condition (hardcoded "New with tags")
  ├── Form (variants, quantity, buttons)
  ├── About this item (description) ← Duplicate
  ├── Item specifics ← Duplicate
  └── Shipping/Returns/Payments
</ProductBuyBox>
```

**Issues:**

1. **Duplicated content**: Item specifics rendered both in left column AND inside buy box
2. **Hardcoded condition**: `<span className="font-bold">New with tags</span>` - should use `product.condition`
3. **Button styling violations**:
   - Buy Now: `h-11` (44px) → should be `h-10` (40px)
   - Add to Cart: `h-11` → should be `h-10`
   - Wishlist: `h-11` → should be `h-9` (36px)
4. **Form spacing**: Uses `space-y-form-sm` which isn't a Tailwind v4 token

**Fix for buttons:**
```tsx
// Inside ProductBuyBox
<Button className="w-full h-10 text-base font-bold rounded-full" size="lg">
  Buy It Now
</Button>
<Button variant="outline" className="w-full h-10 text-base font-bold rounded-full" size="lg">
  Add to cart
</Button>
<Button variant="outline" className="w-full h-9 text-base font-bold rounded-full">
  <Heart className="mr-2 h-5 w-5" /> Add to Watchlist
</Button>
```

### 3.4 Seller Banner Issues

**Current:**
```tsx
<div className="flex flex-col gap-3 rounded-md border p-4">
  <div className="grid grid-cols-3 gap-2 border-t pt-3">
    <div className="text-2xs uppercase tracking-widest">Response</div>
```

**Issues:**
1. `tracking-widest` (0.1em) is too wide for small text - use `tracking-wide` (0.025em)
2. Stats grid `grid-cols-3` doesn't scale well on narrow screens

**Fix:**
```tsx
<div className="text-2xs text-muted-foreground uppercase tracking-wide font-medium">
```

### 3.5 Trust Badges Card

**Current:**
```tsx
<Card className="border border-border/50">
  <CardContent className="p-4 space-y-4">
    <div className="mt-0.5 rounded-full bg-muted/40 p-2">
```

**Issues:**
1. `rounded-full` on icon containers - design system says `rounded-md` for containers
2. `space-y-4` (16px) is too much - use `space-y-3` (12px)
3. `p-4` is fine but `space-y-4` creates 64px+ card

**Fix:**
```tsx
<CardContent className="p-3 space-y-3">
  <div className="flex items-start gap-3">
    <div className="mt-0.5 rounded-md bg-muted/40 p-2">
```

---

## 4. Tailwind v4 / shadcn Best Practices Violations

### 4.1 Spacing Token Issues

| Location | Current | Should Be | Reason |
|----------|---------|-----------|--------|
| `product-page-layout.tsx` | `gap-12` | `gap-6` or `gap-8` | Excessive desktop gap |
| `product-page-layout.tsx` | `px-8 py-10` | `px-6 py-8` | Excessive padding |
| `product-buy-box.tsx` | `space-y-form-sm` | `space-y-3` | Non-standard token |
| `mobile-product-page.tsx` | Various `pt-2`, `mt-1` | Consistent `gap-` | Scattered margins |

### 4.2 Radius Token Issues

| Location | Current | Should Be | Reason |
|----------|---------|-----------|--------|
| `trust-badges.tsx` | `rounded-full` | `rounded-md` | Design system violation |
| `product-gallery-hybrid.tsx` | `rounded-lg` | `rounded-md` | Over-rounded for cards |
| `mobile-trust-block.tsx` | `rounded-lg` | `rounded-md` | Over-rounded |

### 4.3 Touch Target Issues

| Location | Current | Should Be | Reason |
|----------|---------|-----------|--------|
| `mobile-sticky-bar-enhanced.tsx` | `h-11` (44px) | `h-10` (40px) | Exceeds 40px max |
| `product-buy-box.tsx` | `h-11` (44px) | `h-10` (40px) | Exceeds 40px max |

### 4.4 Typography Issues

| Location | Current | Should Be | Reason |
|----------|---------|-----------|--------|
| `product-buy-box.tsx` | `text-2xl lg:text-3xl` | `text-xl lg:text-2xl` | Price too large on desktop |
| `seller-banner.tsx` | `tracking-widest` | `tracking-wide` | Too wide for small text |

### 4.5 Color Token Issues

| Location | Issue |
|----------|-------|
| `mobile-urgency-banner.tsx` | Uses hardcoded Tailwind colors (`bg-amber-50`, `text-amber-900`) instead of semantic tokens |

**Fix:** Create semantic urgency tokens in globals.css or use existing `--color-urgency-*` tokens.

---

## 5. Accessibility Audit

### 5.1 WCAG 2.2 AA Compliance

| Criterion | Status | Notes |
|-----------|--------|-------|
| 1.4.3 Contrast (4.5:1) | ⚠️ | Urgency banner text may fail on some combos |
| 2.1.1 Keyboard | ✅ | All interactive elements focusable |
| 2.4.7 Focus Visible | ✅ | Ring styles applied globally |
| 2.5.5 Target Size | ⚠️ | Some touch targets exceed 40px (not a fail, but inconsistent) |
| 2.5.7 Dragging Movements | ✅ | Gallery has arrow alternatives |

### 5.2 Screen Reader Issues

1. **Gallery images** - Need `aria-label` on carousel navigation
2. **Price** - Should use `aria-label` to announce full price with currency
3. **Urgency banner** - Should be `role="status"` with `aria-live="polite"`

---

## 6. Performance Considerations

### 6.1 Image Loading

**Gallery Current:**
```tsx
<Magnifier
  src={img.src}
  alt={img.alt}
  width={img.width}
  height={img.height}
  className="size-full object-contain"
/>
```

**Issue:** No `sizes` prop, browser downloads full-size images.

**Fix:**
```tsx
<Magnifier
  src={img.src}
  alt={img.alt}
  width={img.width}
  height={img.height}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
/>
```

### 6.2 Component Hydration

**Issue:** `MobileProductPage` is a `"use client"` component but most children are static.

**Recommendation:** Split static parts (gallery, badges, trust block) into server components, only hydrate interactive parts (variant selector, sticky bar).

---

## 7. Recommended Fixes (Priority Order)

### 🔴 P0 - Critical (Do First)

1. **Remove MobileProductHeader** - Redundant, wastes 48px
2. **Fix sticky bar height** - Change `h-11` to `h-10` on CTAs
3. **Move title above price on mobile** - Critical for UX

### 🟡 P1 - High (This Sprint)

4. **Fix desktop layout spacing** - `gap-12` → `gap-6`, `px-8` → `px-6`
5. **Remove duplicate item specifics** - Only show in one location
6. **Fix hardcoded condition** - Use `product.condition`
7. **Standardize touch targets** - All CTAs to design system spec
8. **Fix urgency banner colors** - Use semantic tokens

### 🟢 P2 - Medium (Next Sprint)

9. **Fix rounded corners** - `rounded-lg` → `rounded-md` on containers
10. **Improve gallery sizing** - Use `--container-gallery` token
11. **Fix trust badges icons** - `rounded-full` → `rounded-md`
12. **Add image `sizes` props** - Performance optimization
13. **Fix tracking-widest** - Use `tracking-wide`

### 🔵 P3 - Low (Backlog)

14. **Server/client component split** - Performance optimization
15. **Add aria-labels** - Accessibility polish
16. **Create urgency color tokens** - Design system completeness

---

## 8. Implementation Checklist

```
Mobile Fixes:
[ ] Remove MobileProductHeader component reference
[ ] Reorder: Title before Price
[ ] Fix MobileStickyBarEnhanced button heights (h-11 → h-10)
[ ] Fix MobileSellerTrustLine avatar border
[ ] Fix MobileTrustBlock margins (mx-4 → match page padding)
[ ] Verify all touch targets ≤40px

Desktop Fixes:
[ ] Change grid gap-12 → gap-6
[ ] Change container px-8 py-10 → px-6 py-8
[ ] Remove duplicate ItemSpecifics from ProductBuyBox
[ ] Fix ProductBuyBox condition (use product.condition)
[ ] Fix ProductBuyBox button heights (h-11 → h-10)
[ ] Fix SellerBanner tracking-widest → tracking-wide
[ ] Fix TrustBadges rounded-full → rounded-md

Token Compliance:
[ ] Audit all rounded-lg → rounded-md on cards
[ ] Audit all h-11 → h-10 on primary CTAs
[ ] Create/use semantic urgency color tokens
[ ] Add sizes prop to all gallery images

Testing:
[ ] Test on 360px mobile viewport
[ ] Test on 1440px desktop viewport
[ ] Run Lighthouse audit
[ ] Run axe accessibility check
```

---

## 9. Visual Mockup (Recommended Mobile Layout)

```
┌─────────────────────────────────────┐
│ [Layout Header - 48px]              │
├─────────────────────────────────────┤
│                                     │
│         GALLERY (375px)             │
│         aspect-square               │
│                                     │
├─────────────────────────────────────┤
│ Product Title That Can Span Up...   │ ← NEW POSITION
│ ...To Three Lines Maximum           │
├─────────────────────────────────────┤
│ лв 24.99 вкл. ДДС  л̶в̶ ̶3̶2̶.̶9̶9̶  -25%   │
│ ✨ Спестяваш лв 8.00                │
├─────────────────────────────────────┤
│ [Ново] [Безплатна доставка] [✓]     │ Badges row
├─────────────────────────────────────┤
│ ⚠️ Бързо! Остават само 3 броя!      │ Urgency (conditional)
├─────────────────────────────────────┤
│ [Variant selector if applicable]    │
├─────────────────────────────────────┤
│ [Avatar] SellerName ✓  ★4.8  Visit→ │ Seller trust line
├─────────────────────────────────────┤
│ [Brand: X] [Size: M] [Color: Red]...│ Quick specs
├─────────────────────────────────────┤
│ 🛡️ Protected  ↩️ Returns  🚚 Free   │ Trust block
├─────────────────────────────────────┤
│ ▼ Description                       │
│ ▼ Item Details                      │ Accordions
│ ▼ Shipping & Returns                │
├─────────────────────────────────────┤
│ More from this seller               │
│ [Card] [Card] [Card] →              │
├─────────────────────────────────────┤
│ Customer Reviews (23)               │
│ ...                                 │
├─────────────────────────────────────┤
│                                     │
├─────────────────────────────────────┤
│ [♡] [Add to Cart] [Buy Now]         │ Sticky bar (56px + safe)
└─────────────────────────────────────┘
```

---

*Audit completed by UI/UX Agent | January 2, 2026*
*Next review scheduled after P0/P1 fixes implemented*
