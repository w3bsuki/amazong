# 🎨 Mobile Product Card - Ultra Audit & Improvement Plan

> **Date:** January 3, 2026  
> **Auditor:** Frontend UI Stylist Agent  
> **Component:** `components/shared/product/product-card.tsx`  
> **Target:** Mobile-first C2C marketplace (Temu density + eBay professionalism)

---

## 📸 Current State Analysis

Based on browser inspection at `localhost:3000/bg/search` and user-provided screenshot:

### Visual Breakdown (Current Mobile Card)
```
┌─────────────────────────────────────┐
│  [Image 4:5 ratio]           [♡]   │  ← Wishlist: size-7 (28px) ✓ correct
│                             ⬆      │
│                        top-right   │
│  [-XX%]                            │  ← Discount badge: bottom-left ✓
└─────────────────────────────────────┘
│ 10 € 15 €                          │  ← Price: text-base (16px) 
│ Product Title Here...              │  ← Title: text-[13px] line-clamp-2
│ ★ 4.8 (1.2k)                       │  ← Rating: 10px with star
│ [👤] seller_name            [+]    │  ← Seller: size-4 (16px) | Cart: size-6 (24px)
└─────────────────────────────────────┘
```

---

## 🔴 CRITICAL ISSUES (User Reported + Audit Findings)

### 1. **Seller Avatar Too Small** ⚠️ USER REPORTED

**Current:** `size-4` (16px) - technically spec-compliant but feels cramped
```tsx
// product-card.tsx:373-378
<Avatar className="size-4 shrink-0">
  <AvatarImage src={sellerAvatarUrl || undefined} />
  <AvatarFallback className="text-[6px] bg-muted">
    {displaySellerName.slice(0, 2).toUpperCase()}
  </AvatarFallback>
</Avatar>
```

**Problem:** 
- 16px avatar with 6px fallback text is **barely legible**
- On dense grids, seller identity gets lost
- Temu uses 18-20px, eBay uses 20px for seller avatars in cards

**Recommendation:** Increase to `size-5` (20px) with `text-[8px]` fallback

---

### 2. **Add to Cart Button Too Small** ⚠️ USER REPORTED

**Current:** `size-6` (24px) - WCAG minimum, but poor for mobile marketplace
```tsx
// product-card.tsx:390-400
<button
  type="button"
  className={cn(
    "flex size-6 shrink-0 items-center justify-center rounded transition-colors duration-100",
    inCart
      ? "bg-blue-600 text-white"
      : "bg-muted text-muted-foreground active:bg-blue-600 active:text-white"
  )}
  onClick={handleAddToCart}
  ...
>
  {inCart ? (
    <ShoppingCart size={12} weight="fill" />
  ) : (
    <Plus size={12} weight="bold" />
  )}
</button>
```

**Problem:**
- 24px is WCAG minimum, but for a **primary action** (add to cart), it's undersized
- Icon at 12px inside 24px button = too much dead space ratio
- Temu/Shein use 28-32px quick-add buttons
- Our design system says secondary actions = 32px (`size-8`)

**Recommendation:** Increase to `size-7` (28px) with `size={14}` icon

---

### 3. **Wishlist Button Positioning** ⚠️ MINOR

**Current:** `right-1.5 top-1.5` (6px offset)
```tsx
// product-card.tsx:322-334
<button
  type="button"
  className={cn(
    "absolute right-1.5 top-1.5 z-10 flex size-7 items-center justify-center rounded-full ...",
```

**Issue:** On smaller screens, 6px feels tight. Could use 8px (`right-2 top-2`) for better touch clearance.

---

### 4. **Price Typography** ⚠️ SPEC VIOLATION

**Current:** `text-base` (16px) everywhere
```tsx
// product-card.tsx:346-352
<span className={cn(
  "text-base font-bold leading-none",
  hasDiscount ? "text-red-600" : "text-foreground"
)}>
  {priceFormatter.format(price)}
</span>
```

**Per Design System DESIGN.md:**
> Mobile price: 16px ✓  
> Desktop price: **18px** (`text-lg`)

**Missing:** No responsive breakpoint for desktop price sizing.

---

### 5. **Content Spacing** ⚠️ MINOR

**Current:** `px-0.5 pt-1.5 pb-1` (2px horizontal, 6px top, 4px bottom)
```tsx
// product-card.tsx:342
<div className="relative z-[2] px-0.5 pt-1.5 pb-1 lg:p-1.5">
```

**Issue:** 
- `px-0.5` (2px) is very tight for mobile
- Design system says card content padding = `p-1.5` (6px)
- This creates cramped feeling on mobile

---

### 6. **Rating Row Inconsistency**

**Current:** Uses `text-[10px]` arbitrary value
```tsx
// product-card.tsx:366-371
{hasRating && (
  <div className="mt-1 flex items-center gap-0.5">
    <Star size={10} weight="fill" className="text-amber-400" />
    <span className="text-[10px] text-muted-foreground">
```

**Issue:** 
- `text-[10px]` is an arbitrary value (design system forbids these)
- Should use `text-2xs` (10px) if that's the intended size, or `text-xs` (12px) for better readability

---

## 🟡 MEDIUM PRIORITY ISSUES

### 7. **No Free Shipping Badge Visibility**

**Current:** Just a tiny truck icon at 10px
```tsx
// product-card.tsx:356-360
{freeShipping && (
  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
    <Truck size={10} weight="bold" />
  </span>
)}
```

**Issue:**
- No text label, just icon
- Icon at 10px is hard to notice
- Should have subtle background for visibility (per DESIGN.md badge tokens)

---

### 8. **Missing Desktop Hover States**

**Current:** No hover interaction beyond link
```tsx
// product-card.tsx:263
className={cn(productCardVariants({ variant, state: resolvedState }), className)}
```

**CVA variants include:** `lg:hover:border-border/60 lg:hover:shadow-sm`  

This is correct per spec! ✅ (No scale transforms, just subtle border/shadow)

---

### 9. **Condition Badge Untranslated Edge Cases**

**Current logic:**
```tsx
// product-card.tsx:205-212
const conditionLabel = React.useMemo(() => {
  if (!condition) return null
  const c = condition.toLowerCase()
  if (c === "new" || c === "novo" || c === "ново") return locale === "bg" ? "Ново" : "New"
  // ...
  return condition.slice(0, 8)  // ← Fallback shows raw value!
}, [condition, locale])
```

**Issue:** Unknown conditions show raw database value (could be "used excellent" in English on Bulgarian page).

---

## 🟢 WHAT'S WORKING WELL

| Element | Status | Notes |
|---------|--------|-------|
| Image aspect ratio | ✅ 4:5 locked | No CLS |
| Wishlist size | ✅ size-7 (28px) | Per design system compact touch target |
| Discount badge | ✅ Red, left-positioned | Good visibility |
| Line clamp | ✅ 2 lines max | Prevents overflow |
| CVA variants | ✅ Clean architecture | State-based styling |
| Skeleton | ✅ Matches structure | (but check for animate-pulse) |

---

## 🛠️ IMPLEMENTATION PLAN

### Phase 1: Critical Fixes (User-Reported) ⏱️ 30 min

#### 1.1 Seller Avatar: 16px → 20px
```diff
// product-card.tsx:373-378
- <Avatar className="size-4 shrink-0">
+ <Avatar className="size-5 shrink-0">
    <AvatarImage src={sellerAvatarUrl || undefined} />
-   <AvatarFallback className="text-[6px] bg-muted">
+   <AvatarFallback className="text-[8px] bg-muted">
      {displaySellerName.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
```

**Result:** Avatar 16px → 20px (+25%), fallback text 6px → 8px (+33%)

#### 1.2 Add to Cart Button: 24px → 28px
```diff
// product-card.tsx:390-400
<button
  type="button"
  className={cn(
-   "flex size-6 shrink-0 items-center justify-center rounded transition-colors duration-100",
+   "flex size-7 shrink-0 items-center justify-center rounded transition-colors duration-100",
    inCart
      ? "bg-blue-600 text-white"
      : "bg-muted text-muted-foreground active:bg-blue-600 active:text-white"
  )}
  ...
>
  {inCart ? (
-   <ShoppingCart size={12} weight="fill" />
+   <ShoppingCart size={14} weight="fill" />
  ) : (
-   <Plus size={12} weight="bold" />
+   <Plus size={14} weight="bold" />
  )}
</button>
```

**Result:** Button 24px → 28px, icon 12px → 14px

---

### Phase 2: Typography & Spacing ⏱️ 20 min

#### 2.1 Add Desktop Price Breakpoint
```diff
// product-card.tsx:346-352
<span className={cn(
- "text-base font-bold leading-none",
+ "text-base font-bold leading-none lg:text-lg",
  hasDiscount ? "text-red-600" : "text-foreground"
)}>
```

#### 2.2 Fix Arbitrary Values
```diff
// product-card.tsx:366-371 (Rating)
- <span className="text-[10px] text-muted-foreground">
+ <span className="text-2xs text-muted-foreground">

// product-card.tsx:356-360 (Free shipping)  
- <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
+ <span className="inline-flex items-center gap-0.5 text-2xs font-medium text-emerald-600">
```

#### 2.3 Improve Content Padding
```diff
// product-card.tsx:342
- <div className="relative z-[2] px-0.5 pt-1.5 pb-1 lg:p-1.5">
+ <div className="relative z-[2] px-1 pt-1.5 pb-1 lg:p-2">
```

---

### Phase 3: Visual Polish ⏱️ 20 min

#### 3.1 Improve Free Shipping Badge Visibility
```diff
// product-card.tsx:356-360
{freeShipping && (
- <span className="inline-flex items-center gap-0.5 text-2xs font-medium text-emerald-600">
-   <Truck size={10} weight="bold" />
- </span>
+ <span className="inline-flex items-center gap-0.5 rounded-sm bg-emerald-50 px-1 py-0.5 text-2xs font-medium text-emerald-700">
+   <Truck size={10} weight="bold" />
+   <span className="hidden sm:inline">Free</span>
+ </span>
)}
```

#### 3.2 Slightly More Prominent Seller Row
```diff
// product-card.tsx:372-386
{displaySellerName ? (
  <div className="flex min-w-0 items-center gap-1">
-   <Avatar className="size-5 shrink-0">
+   <Avatar className="size-5 shrink-0 ring-1 ring-border/50">
```

Light ring adds subtle definition without being heavy.

---

### Phase 4: Skeleton Audit ⏱️ 10 min

Check `ProductCardSkeleton` for animate-pulse violations:

```tsx
// product-card.tsx - Skeleton component uses Skeleton from ui/skeleton
// Verify ui/skeleton.tsx doesn't have animate-pulse

// If it does, replace with static gray:
// - className="bg-muted" (not animate-pulse bg-muted)
```

---

## 📊 Before/After Comparison

| Element | Before | After | Change |
|---------|--------|-------|--------|
| Seller Avatar | 16px (size-4) | 20px (size-5) | +25% |
| Avatar Fallback | 6px | 8px | +33% |
| Add to Cart | 24px (size-6) | 28px (size-7) | +17% |
| Cart Icon | 12px | 14px | +17% |
| Content Padding | px-0.5 (2px) | px-1 (4px) | +100% |
| Desktop Price | 16px | 18px | +12.5% |

---

## 🎯 Design System Alignment Check

| Requirement | Before | After | Compliant? |
|-------------|--------|-------|------------|
| Price largest element | ✅ 16px bold | ✅ 16-18px bold | ✅ |
| Touch targets ≥24px | ⚠️ 24px cart | ✅ 28px cart | ✅ |
| No arbitrary values | ❌ text-[10px], text-[6px] | ✅ text-2xs, text-[8px] | ⚠️ |
| Avatar ≥16px (C2C) | ✅ 16px | ✅ 20px | ✅ |
| Compact button 28px | ❌ 24px | ✅ 28px | ✅ |
| No hover scale | ✅ | ✅ | ✅ |
| No shadow on cards | ✅ | ✅ | ✅ |

---

## 🧪 Testing Checklist

After implementing changes:

- [ ] Mobile viewport (375-414px): Cards render correctly
- [ ] Tablet (768px): 3-col grid, spacing appropriate  
- [ ] Desktop (1024px+): 4-5 col grid, price bumps to 18px
- [ ] Add to cart tap target feels natural (thumb reach)
- [ ] Seller avatar legible with 2-letter fallback
- [ ] Free shipping badge visible without being noisy
- [ ] No layout shift on image load
- [ ] Dark mode: all badges/buttons visible
- [ ] RTL: layout mirrors correctly (if supported)

---

## 📝 Code Change Summary

**Files to modify:**
1. `components/shared/product/product-card.tsx` - Main changes

**Total lines affected:** ~15-20 lines
**Risk level:** Low (non-breaking visual polish)
**Backward compatible:** Yes

---

## 🚀 Quick Start Commands

```bash
# 1. View changes in dev
pnpm dev

# 2. Navigate to search page
# http://localhost:3000/bg/search

# 3. Test mobile view in Chrome DevTools (Ctrl+Shift+M)
# Set to iPhone 14 (390x844)

# 4. Verify changes with Playwright
pnpm test:e2e e2e/smoke.spec.ts
```

---

## ✅ Final Recommendation

**Priority Order:**
1. ⚡ **Avatar + Cart button size** - User-reported, high impact
2. 🔧 **Typography fixes** - Spec compliance
3. 💅 **Visual polish** - Nice to have

**Estimated Total Time:** 1-1.5 hours including testing

---

*Audit by Frontend UI Stylist Agent • Treido Design System v1.0*
