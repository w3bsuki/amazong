# Mobile Product Page - Complete Improvement & Refactor Plan

**Target Route:** `http://localhost:3000/bg/shop4e/aysifon`  
**Date:** 2025-12-27  
**Audit Method:** Playwright MCP + Manual Review

---

## Executive Summary

The current mobile product page suffers from:
1. **Information Overload** — Duplicate seller modules, noisy header stack
2. **Inefficient Layout** — Product hero pushed below fold, excessive vertical scrolling
3. **Visual Inconsistency** — Mixed border radii, spacing tokens, typography scales

This plan provides a complete redesign using **shadcn/ui components** and **Tailwind CSS v4** best practices.

---

## ASCII Layout Grid — Proposed Mobile Structure

```
┌─────────────────────────────────────┐
│           HEADER (sticky)           │ ← Compact: Logo + Search + Cart (48px)
├─────────────────────────────────────┤
│                                     │
│       PRODUCT GALLERY (edge2edge)   │ ← Full-width carousel, 1:1 aspect
│       ┌─────────────────────────┐   │   Auto-play dots at bottom
│       │                         │   │
│       │     [   MAIN IMAGE   ]  │   │
│       │                         │   │
│       └─────────────────────────┘   │
│         ● ○ ○ ○ ○                   │ ← Pagination dots
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │ TITLE (2 lines max, truncate)   ││ ← text-lg font-bold line-clamp-2
│  │ ★★★★☆ 4.6 (128) • Sold by Store ││ ← Inline meta: rating + seller link
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ PRICE BLOCK                     ││
│  │ $129.99  ̶$̶1̶5̶9̶.̶9̶9̶  -20% OFF     ││ ← text-2xl bold + strikethrough
│  │ ✓ In Stock • Free Shipping       ││ ← success badge
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  ┌────────┬────────┬────────┐       │
│  │  QTY   │  WISH  │  CART  │       │ ← Horizontal action row (44px tall)
│  │  [-1+] │   ♡    │  ADD   │       │
│  └────────┴────────┴────────┘       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │ SELLER COMPACT CARD             ││ ← Avatar + Name + % + Visit button
│  │ [AV] shop4e  98% positive  →    ││   Single line, 48px height
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  ▼ Description                      │ ← Accordion (collapsed by default)
│  ▼ Product Details                  │
│  ▼ Shipping & Returns               │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │ MORE FROM THIS SELLER           ││ ← Horizontal scroll carousel
│  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐     ││   2 rows max, snap-x
│  │ │    │ │    │ │    │ │    │→    ││
│  │ └────┘ └────┘ └────┘ └────┘     ││
│  │ [See All (519)]                 ││ ← Full-width button, 44px
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │ CUSTOMER REVIEWS (collapsed)    ││ ← Accordion or summary card
│  │ ★★★★☆ 4.6 average (128 reviews) ││
│  │ [Write Review] [See All]        ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│           FOOTER                    │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │      STICKY BOTTOM BAR          ││ ← fixed bottom-0 z-50
│  │  $129.99   [♡]  [BUY NOW]       ││   Price + Heart + CTA (44px min)
│  └─────────────────────────────────┘│
│           (safe-area-inset-bottom)  │
└─────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Remove Duplicate Modules
| Before | After |
|--------|-------|
| `SimilarItemsBar` (seller + thumbnails) | Hidden on mobile `lg:block` |
| `MobileSellerCard` (full card) | Compact inline seller row (1 line) |
| Seller info in `ProductBuyBox` (desktop) | Keep for `lg:` only |

### 2. Spacing Scale (Tailwind v4)
```css
/* Use consistent spacing tokens */
--spacing-xs: 0.25rem;   /* 4px  - gap-1 */
--spacing-sm: 0.5rem;    /* 8px  - gap-2 */
--spacing-md: 1rem;      /* 16px - gap-4 */
--spacing-lg: 1.5rem;    /* 24px - gap-6 */
--spacing-xl: 2rem;      /* 32px - gap-8 */
```

### 4. Border Radius Consistency
```css
/* Single radius scale */
--radius-sm: 0.375rem;   /* rounded-md  - 6px */
--radius-md: 0.5rem;     /* rounded-lg  - 8px */
--radius-lg: 0.75rem;    /* rounded-xl  - 12px */
--radius-full: 9999px;   /* rounded-full - pills */
```

---

## Component-by-Component Refactor

### A. `ProductGalleryHybrid` (Mobile)

**Current Issues:**
- Thumbnails row takes vertical space on mobile
- No swipe indicators/pagination dots

**Proposed Changes:**
```tsx
// Mobile: Full-width swipeable carousel, no thumbnail row
<div className="lg:hidden -mx-4"> {/* Edge-to-edge */}
  <Carousel>
    <CarouselContent className="aspect-square">
      {images.map((img, i) => (
        <CarouselItem key={i}>
          <img src={img.src} alt={img.alt} className="object-contain" />
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
  {/* Pagination dots */}
  <div className="flex justify-center gap-1.5 mt-2">
    {images.map((_, i) => (
      <button
        key={i}
        className={cn(
          "size-2 rounded-full transition-colors",
          current === i ? "bg-primary" : "bg-muted"
        )}
        onClick={() => api?.scrollTo(i)}
      />
    ))}
  </div>
</div>
```

**Files:** `components/shared/product/product-gallery-hybrid.tsx`

---

### B. `ProductBuyBox` (Mobile)

**Current Issues:**
- Full accordion on mobile — too much content above fold
- Desktop seller section renders on mobile

**Proposed Changes:**
```tsx
// Mobile-specific compact buy box
<div className="lg:hidden">
  {/* Title */}
  <h1 className="text-lg font-bold line-clamp-2">{product.name}</h1>
  
  {/* Rating + Seller inline */}
  <div className="flex items-center gap-2 text-sm mt-1">
    <RatingStars rating={product.rating} size="sm" />
    <span className="text-muted-foreground">({product.reviewCount})</span>
    <span className="text-muted-foreground">•</span>
    <Link href={sellerHref} className="text-primary font-medium">
      {product.store.name}
    </Link>
  </div>
  
  {/* Price block */}
  <div className="mt-3">
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold">{formatPrice(product.price.sale)}</span>
      {product.price.regular && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(product.price.regular)}
        </span>
      )}
      {discountPct > 0 && (
        <Badge variant="destructive" className="text-xs">-{discountPct}%</Badge>
      )}
    </div>
    <div className="flex items-center gap-2 mt-1 text-sm">
      <CheckCircle className="size-4 text-success" />
      <span className="text-success font-medium">In Stock</span>
      <span className="text-muted-foreground">• Free Shipping</span>
    </div>
  </div>
  
  {/* Action row */}
  <div className="grid grid-cols-[auto_1fr_1fr] gap-2 mt-4">
    {/* Quantity */}
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-md"
        onClick={() => setQty(Math.max(1, qty - 1))}
      >
        <Minus className="size-4" />
      </Button>
      <span className="w-8 text-center font-bold">{qty}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-md"
        onClick={() => setQty(Math.min(99, qty + 1))}
      >
        <Plus className="size-4" />
      </Button>
    </div>
    
    {/* Wishlist */}
    <Button
      variant="outline"
      className="h-11 rounded-lg"
      onClick={handleWishlistToggle}
    >
      <Heart className={cn("size-5", isWatching && "fill-current text-destructive")} />
    </Button>
    
    {/* Add to cart (not full CTA — that's in sticky bar) */}
    <Button
      variant="outline"
      className="h-11 rounded-lg font-bold"
    >
      Add to Cart
    </Button>
  </div>
</div>
```

**Files:** `components/shared/product/product-buy-box.tsx`

---

### C. `MobileSellerCard` → Compact Inline

**Current Issues:**
- Full card takes too much vertical space

**Proposed Changes:**
```tsx
// Compact single-line seller row
<div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-lg mt-4">
  <Avatar className="size-8 border border-border">
    <AvatarImage src={store.avatarUrl} />
    <AvatarFallback>{store.name.slice(0, 2)}</AvatarFallback>
  </Avatar>
  
  <div className="flex-1 min-w-0">
    <Link 
      href={storeHref}
      className="font-bold text-sm hover:underline truncate block"
    >
      {store.name}
    </Link>
    <span className="text-xs text-success">{store.rating} positive</span>
  </div>
  
  <Button 
    asChild 
    variant="outline" 
    size="sm" 
    className="h-8 px-3 rounded-full shrink-0"
  >
    <Link href={storeHref}>Visit Store</Link>
  </Button>
</div>
```

**Files:** `components/shared/product/mobile-seller-card.tsx`

---

### D. `SimilarItemsBar` → Desktop Only

**Current Issues:**
- Duplicates seller info shown in `MobileSellerCard`
- Thumbnail strip is nice but redundant with gallery

**Proposed Changes:**
```tsx
// Hide entire component on mobile
<div className="hidden lg:block">
  <SimilarItemsBar ... />
</div>
```

**Files:** `app/[locale]/[username]/[productSlug]/page.tsx`

---



### F. `MobileStickyBar` (Redesign)

**Current Issues:**
- Heart button is 44px ✓
- Layout is good but can be improved

**Proposed Changes:**
```tsx
<div className="fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden pb-safe">
  <div className="flex items-center gap-3 px-4 py-3 max-w-md mx-auto">
    {/* Price summary */}
    <div className="flex-1 min-w-0">
      <div className="text-lg font-bold">{formatPrice(price)}</div>
      <span className="text-xs text-success font-medium">Free Shipping</span>
    </div>
    
    {/* Wishlist */}
    <Button
      variant="outline"
      size="icon"
      className="size-11 rounded-full shrink-0"
      onClick={handleWishlistToggle}
    >
      <Heart className={cn("size-5", isWatching && "fill-current text-destructive")} />
    </Button>
    
    {/* Primary CTA */}
    <Button className="flex-1 h-11 rounded-full font-bold text-sm uppercase tracking-wide">
      Buy Now
    </Button>
  </div>
</div>
```

**Files:** `components/shared/product/mobile-sticky-bar.tsx`

---

### F. `SellerProductsGrid` → Horizontal Carousel on Mobile

**Current Issues:**
- Full grid is too much content on mobile

**Proposed Changes:**
```tsx
// Mobile: horizontal scroll carousel
<div className="lg:hidden">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-bold">More from this seller</h3>
    <Button variant="link" asChild className="h-auto p-0 text-sm">
      <Link href={sellerHref}>See all ({totalCount})</Link>
    </Button>
  </div>
  
  <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4">
    {products.slice(0, 8).map((p) => (
      <div key={p.id} className="shrink-0 w-[140px] snap-start">
        <ProductCardCompact product={p} />
      </div>
    ))}
  </div>
</div>

// Desktop: full grid
<div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {products.map((p) => <ProductCard key={p.id} product={p} />)}
</div>
```

**Files:** `components/shared/product/seller-products-grid.tsx`

---

### G. `CustomerReviewsHybrid` → Collapsed Summary

**Current Issues:**
- Full reviews section is too heavy on mobile

**Proposed Changes:**
```tsx
// Mobile: collapsed summary card
<div className="lg:hidden">
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <div className="text-3xl font-bold">{rating.toFixed(1)}</div>
      <div className="flex-1">
        <RatingStars rating={rating} size="md" />
        <p className="text-sm text-muted-foreground mt-0.5">
          {reviewCount} reviews
        </p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-3">
      <Button variant="outline" className="h-11 font-bold">
        Write Review
      </Button>
      <Button variant="outline" className="h-11 font-bold">
        See All
      </Button>
    </div>
  </Card>
</div>
```

**Files:** `components/shared/product/customer-reviews-hybrid.tsx`

---

## Tailwind v4 / shadcn Best Practices Checklist

### ✅ Use CSS Variables for Theming
```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --success: 142.1 76.2% 36.3%;
  --destructive: 0 84.2% 60.2%;
}
```

### ✅ Consistent Component Sizing
```tsx
// shadcn Button sizes - use what looks good
size="sm"      // h-8 - compact
size="default" // h-9 - standard
size="lg"      // h-10 - emphasis
size="icon"    // size-9 - icon buttons
```

### ✅ Safe Area Insets
```css
/* For sticky bars */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### ✅ Scroll Snap for Carousels
```tsx
<div className="flex gap-3 overflow-x-auto snap-x snap-mandatory">
  {items.map((item) => (
    <div className="shrink-0 snap-start">{item}</div>
  ))}
</div>
```

### ✅ Touch Manipulation
```css
/* Prevent 300ms delay */
.touch-manipulation {
  touch-action: manipulation;
}
```

---

## Implementation Priority

### P0 — Ship First (Critical)
| Task | Component | Effort |
|------|-----------|--------|
| Hide `SimilarItemsBar` on mobile | `page.tsx` | 5 min |
| Compact `MobileSellerCard` to single line | `MobileSellerCard` | 15 min |
| Simplify mobile buy box | `ProductBuyBox` | 20 min |

### P1 — Next Sprint
| Task | Component | Effort |
|------|-----------|--------|
| Edge-to-edge gallery with dots | `ProductGalleryHybrid` | 30 min |
| Horizontal scroll seller products | `SellerProductsGrid` | 30 min |
| Collapsed reviews summary | `CustomerReviewsHybrid` | 20 min |

### P2 — Polish
| Task | Component | Effort |
|------|-----------|--------|
| Add backdrop blur to sticky bar | `MobileStickyBar` | 5 min |
| Consistent border radii audit | All components | 30 min |
| Typography scale audit | All components | 30 min |

---

## Verification Checklist

### Automated
```bash
# Run E2E smoke tests
pnpm -s exec cross-env REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 node scripts/run-playwright.mjs test e2e/smoke.spec.ts --project=chromium
```

### Manual QA (Mobile Viewport)
- [ ] Gallery swipes smoothly
- [ ] Zoom opens/closes correctly
- [ ] Sticky bar doesn't overlap content
- [ ] Price/title visible above fold
- [ ] Seller info appears exactly once
- [ ] Accordions expand/collapse correctly
- [ ] Horizontal scroll works on seller products

---

## Reference: eBay Mobile Product Page

**What they do well:**
1. Gallery takes full width, edge-to-edge
2. Title + price immediately visible
3. Seller info is minimal (name + % feedback)
4. "Buy It Now" is the dominant CTA
5. Details are in collapsible sections
6. Sticky bar shows price + CTA only

**ASCII representation of eBay mobile:**
```
┌─────────────────────────────────────┐
│     [FULL-WIDTH IMAGE CAROUSEL]     │
│         ● ○ ○ ○ ○ ○                 │
├─────────────────────────────────────┤
│ iPhone 15 Pro Max 256GB - Blue      │ ← Title
│ ★★★★★ 4.9 (2,341)                   │ ← Rating
├─────────────────────────────────────┤
│ $1,099.00                           │ ← Price (large)
│ Condition: New                      │
├─────────────────────────────────────┤
│ [Buy It Now]  [Add to cart]  [♡]    │ ← Actions
├─────────────────────────────────────┤
│ 🏪 seller_123  99.8% positive →     │ ← Seller (1 line)
├─────────────────────────────────────┤
│ ▼ Item description                  │
│ ▼ Shipping & payments               │
│ ▼ Returns                           │
├─────────────────────────────────────┤
│ More from this seller → [scroll]    │
├─────────────────────────────────────┤
│       [STICKY: $1,099 Buy Now]      │
└─────────────────────────────────────┘
```

---

## Next Steps

1. **Implement P0 changes** in a single PR
2. **Re-run mobile audit** to verify tap targets pass
3. **Run E2E smoke tests** to catch regressions
4. **Visual QA** on real iPhone/Android devices
5. **Implement P1 changes** in follow-up PR

---

*Generated by Playwright MCP audit + Manual code review*  
*Date: 2025-12-27*
