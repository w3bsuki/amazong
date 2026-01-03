````markdown
# 🏆 ULTRATHINK: Professional Mobile Product Card

> **Agent:** Frontend UI Stylist (PlanMode)  
> **Date:** January 3, 2026  
> **Target:** C2C/B2B Marketplace Product Card - 10x Better  
> **Stack:** Tailwind CSS v4 + shadcn/ui + OKLCH Tokens  
> **Philosophy:** Temu Density + eBay Professionalism + Shein Polish

---

## 🎯 Executive Vision

Create the **ULTIMATE** mobile product card that:
1. **Converts** — Price-first hierarchy that drives purchases
2. **Trusts** — Seller verification, ratings, authenticity signals
3. **Performs** — Zero layout shift, instant interactions
4. **Scales** — Works for C2C (used items) AND B2B (bulk deals)
5. **Delights** — Professional polish without gimmicks

---

## 📊 Competitive Analysis

| Platform | Strengths | Weaknesses |
|----------|-----------|------------|
| **Temu** | Dense grid, price prominence | Cluttered badges, cheap feel |
| **eBay** | Trust signals, seller info | Outdated typography, sparse |
| **Shein** | Clean visuals, quick-add | Too fashion-focused |
| **Amazon** | Prime badges, ratings | Generic, no personality |
| **Vinted** | C2C seller focus, condition | Too minimal for B2B |
| **Alibaba** | MOQ badges, B2B signals | Overwhelming, cluttered |

### Our Differentiator
```
TEMU DENSITY  +  EBAY TRUST  +  SHEIN POLISH  =  PRO CARD
─────────────    ──────────    ────────────      ─────────
• 4-6px gaps     • Seller verified   • Clean type     • Maximum value
• Stacked info   • Rating count      • Sharp radius   • Price dominance
• Quick actions  • Condition badge   • Semantic color • Trust-first
```

---

## 🏗️ Card Architecture v2.0

### Visual Structure (Mobile 375px)

```
┌──────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────┐ │
│ │                                          │ │
│ │                                          │ │
│ │            P R O D U C T                 │ │
│ │              I M A G E                   │ │
│ │                                          │ │
│ │                                          │ │
│ │  [CONDITION]                       [♡]  │ │  ← Top corners: Condition + Wishlist
│ │                                          │ │
│ │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [-25%]    │ │  ← Bottom gradient + Discount
│ └──────────────────────────────────────────┘ │
│                                              │
│   €24.99  €̶3̶2̶.̶9̶9̶  🚚                        │  ← HERO: Price + Shipping badge
│                                              │
│   iPhone 14 Pro Max 256GB Space...          │  ← Title: 2 lines max
│                                              │
│   ★ 4.8 (1.2K) · 847 sold                   │  ← Social proof row
│                                              │
│   [🔵] johndoe123 ✓        [MOQ:10]   [➕]  │  ← Seller + B2B badge + QuickAdd
│                                              │
└──────────────────────────────────────────────┘
```

### Information Hierarchy (Priority Order)

1. **Image** — First impression, aspect-ratio locked
2. **Price** — HERO element, largest text
3. **Discount** — Red badge if applicable
4. **Title** — Product name, 2-line clamp
5. **Social Proof** — Rating + sold count
6. **Trust Signals** — Verified seller, condition
7. **Actions** — Wishlist, Quick-add

---

## 🎨 Design Tokens (Tailwind v4)

### Typography Scale

```css
/* Price Tokens - HERO treatment */
--product-price-size: 1.125rem;      /* 18px - Bold, prominent */
--product-price-size-lg: 1.25rem;    /* 20px - Desktop */
--product-price-line-height: 1.2;

/* Original Price (crossed) */
--product-original-size: 0.75rem;    /* 12px */

/* Title */
--product-title-size: 0.8125rem;     /* 13px - Dense but readable */
--product-title-line-height: 1.3;

/* Meta (rating, sold) */
--product-meta-size: 0.6875rem;      /* 11px */

/* Micro (badges) */
--product-badge-size: 0.625rem;      /* 10px */
```

### Touch Targets

```css
/* Action Buttons */
--card-wishlist-size: 1.75rem;       /* 28px - size-7 */
--card-quickadd-size: 1.75rem;       /* 28px - size-7 (matched) */
--card-seller-avatar: 1.25rem;       /* 20px - size-5 */
```

### Spacing

```css
/* Card Content */
--card-content-padding-x: 0.25rem;   /* 4px - px-1 */
--card-content-padding-y: 0.375rem;  /* 6px - pt-1.5 pb-1.5 */
--card-row-gap: 0.125rem;            /* 2px - space-y-0.5 */
--card-meta-gap: 0.25rem;            /* 4px - gap-1 */
```

### Colors (OKLCH Semantic)

```css
/* Price States */
--color-price-default: var(--color-foreground);
--color-price-sale: oklch(0.50 0.22 27);           /* Red-orange */
--color-price-crossed: var(--color-muted-foreground);

/* Badges */
--color-badge-discount-bg: oklch(0.55 0.22 27);    /* Red */
--color-badge-discount-text: oklch(1 0 0);         /* White */
--color-badge-condition-bg: oklch(0.18 0.01 250);  /* Near black */
--color-badge-condition-text: oklch(1 0 0);        /* White */
--color-badge-shipping-bg: oklch(0.95 0.03 145);   /* Light green */
--color-badge-shipping-text: oklch(0.35 0.12 145); /* Dark green */
--color-badge-moq-bg: oklch(0.95 0.02 250);        /* Light blue */
--color-badge-moq-text: oklch(0.35 0.12 250);      /* Dark blue */

/* Interactive */
--color-wishlist-inactive: oklch(1 0 0 / 90%);     /* White semi */
--color-wishlist-active: oklch(0.55 0.22 350);     /* Pink/red */
--color-quickadd-bg: var(--color-muted);
--color-quickadd-active: var(--color-primary);
```

---

## 📐 Component Specifications

### 1. Image Container

```tsx
// Wrapper
<div className="relative overflow-hidden rounded-md bg-muted">
  <AspectRatio ratio={4 / 5}>
    <Image
      src={imageSrc}
      alt={title}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      placeholder="blur"
      blurDataURL={productBlurDataURL()}
      loading={index < 4 ? "eager" : "lazy"}
      priority={index < 4}
    />
  </AspectRatio>
  
  {/* Overlays positioned inside */}
</div>
```

**Specs:**
- Aspect: `4:5` (portrait, maximizes image in mobile grid)
- Border: `rounded-md` (6px) — Sharp, professional
- Background: `bg-muted` — Placeholder before load
- No CLS: Fixed aspect ratio

### 2. Condition Badge (C2C)

```tsx
{condition && (
  <span className="absolute left-1.5 top-1.5 z-10 rounded-sm bg-foreground/90 px-1.5 py-0.5 text-2xs font-semibold uppercase tracking-wide text-background">
    {conditionLabel}
  </span>
)}
```

**Specs:**
- Position: Top-left, inside image
- Size: `text-2xs` (10px), `font-semibold`
- Background: `bg-foreground/90` — Near black, universal
- Radius: `rounded-sm` (2px)
- Text: `uppercase tracking-wide` — Authority feel

**Condition Values:**
| Value | EN | BG |
|-------|----|----|
| new | New | Ново |
| like_new | Like New | Като ново |
| used | Used | Употр. |
| refurbished | Refurb | Рефърб. |

### 3. Wishlist Button

```tsx
<button
  type="button"
  className={cn(
    "absolute right-1.5 top-1.5 z-10",
    "flex size-7 items-center justify-center",
    "rounded-full backdrop-blur-sm transition-colors",
    inWishlist
      ? "bg-red-500 text-white"
      : "bg-black/30 text-white hover:bg-black/50"
  )}
  onClick={handleWishlist}
  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
>
  <Heart size={14} weight={inWishlist ? "fill" : "bold"} />
</button>
```

**Specs:**
- Size: `size-7` (28px) — Compact but tappable
- Icon: 14px Phosphor Heart
- Background: Glass effect (`backdrop-blur-sm`)
- Active: Solid red, filled heart

### 4. Discount Badge

```tsx
{hasDiscount && discountPercent >= 5 && (
  <span className="absolute bottom-1.5 left-1.5 z-10 rounded-sm bg-red-600 px-1.5 py-0.5 text-2xs font-bold text-white">
    -{discountPercent}%
  </span>
)}
```

**Alternative: Inside Gradient Overlay**
```tsx
{/* Bottom gradient for discount readability */}
<div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent" />
<span className="absolute bottom-1.5 right-1.5 z-10 text-2xs font-bold text-white drop-shadow-sm">
  -{discountPercent}%
</span>
```

**Specs:**
- Threshold: Only show if `discountPercent >= 5`
- Position: Bottom-left OR bottom-right with gradient
- Size: `text-2xs` (10px), `font-bold`
- Background: `bg-red-600` (solid, high contrast)

### 5. Price Row (HERO)

```tsx
<div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
  {/* Current Price - HERO */}
  <span className={cn(
    "text-lg font-bold leading-tight tracking-tight lg:text-xl",
    hasDiscount ? "text-red-600" : "text-foreground"
  )}>
    {formatPrice(price, locale)}
  </span>
  
  {/* Original Price */}
  {hasDiscount && originalPrice && (
    <span className="text-xs text-muted-foreground line-through">
      {formatPrice(originalPrice, locale)}
    </span>
  )}
  
  {/* Free Shipping Badge */}
  {freeShipping && (
    <span className="inline-flex items-center gap-0.5 rounded-sm bg-emerald-50 px-1 py-px text-2xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
      <Truck size={10} weight="bold" />
      <span className="hidden xs:inline">Free</span>
    </span>
  )}
</div>
```

**Specs:**
- Current: `text-lg` (18px) mobile, `text-xl` (20px) desktop
- Weight: `font-bold` — Maximum emphasis
- Sale: `text-red-600` — Universal sale color
- Original: `text-xs` (12px), `line-through`, muted
- Shipping: Pill badge, green semantic

### 6. Title

```tsx
<h3 className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-foreground/90 lg:text-sm">
  {title}
</h3>
```

**Specs:**
- Size: `text-[13px]` mobile → `text-sm` (14px) desktop
- Lines: `line-clamp-2` — Maximum 2 lines
- Line height: `leading-snug` (1.375)
- Color: `text-foreground/90` — Slightly softer than black

### 7. Rating & Social Proof Row

```tsx
{(hasRating || soldCount > 0) && (
  <div className="mt-0.5 flex items-center gap-1 text-2xs text-muted-foreground">
    {hasRating && (
      <>
        <Star size={10} weight="fill" className="text-amber-400" />
        <span className="font-medium text-foreground/80">
          {rating.toFixed(1)}
        </span>
        {reviewCount > 0 && (
          <span>({formatCount(reviewCount)})</span>
        )}
      </>
    )}
    
    {hasRating && soldCount > 0 && (
      <span className="text-border">·</span>
    )}
    
    {soldCount > 0 && (
      <span>{formatCount(soldCount)} sold</span>
    )}
  </div>
)}
```

**Specs:**
- Size: `text-2xs` (10px)
- Star: 10px, filled, amber
- Rating: Slightly bolder than meta
- Separator: Middle dot (`·`)
- Format: `1.2K` for thousands

### 8. Seller Row + Quick-Add

```tsx
<div className="mt-1 flex items-center justify-between gap-1">
  {/* Seller Info */}
  {showSeller && displaySellerName && (
    <div className="flex min-w-0 items-center gap-1">
      <Avatar className="size-5 shrink-0 ring-1 ring-border/50">
        <AvatarImage src={sellerAvatarUrl || undefined} />
        <AvatarFallback className="text-[8px] bg-muted font-medium">
          {displaySellerName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <span className="truncate text-2xs text-muted-foreground">
        {displaySellerName}
      </span>
      
      {sellerVerified && (
        <SealCheck size={10} weight="fill" className="shrink-0 text-blue-500" />
      )}
    </div>
  )}
  
  {/* B2B MOQ Badge (if applicable) */}
  {minOrderQuantity && minOrderQuantity > 1 && (
    <span className="shrink-0 rounded-sm bg-blue-50 px-1 py-px text-2xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
      MOQ:{minOrderQuantity}
    </span>
  )}
  
  {/* Spacer */}
  {!displaySellerName && !minOrderQuantity && <div className="flex-1" />}
  
  {/* Quick-Add Button */}
  {showQuickAdd && (
    <button
      type="button"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded",
        "transition-colors duration-100",
        inCart
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground active:bg-primary active:text-primary-foreground"
      )}
      onClick={handleAddToCart}
      disabled={isOwnProduct || !inStock}
      aria-label={inCart ? "In cart" : "Add to cart"}
    >
      {inCart ? (
        <ShoppingCart size={14} weight="fill" />
      ) : (
        <Plus size={14} weight="bold" />
      )}
    </button>
  )}
</div>
```

**Specs:**
- Avatar: `size-5` (20px) with subtle ring
- Fallback: `text-[8px]` (acceptable for 2-char)
- Verified: Blue checkmark, 10px
- MOQ Badge: Blue pill for B2B
- Quick-Add: `size-7` (28px), matches wishlist

---

## 🔄 B2B Mode Variations

For wholesale/B2B listings, show additional signals:

```tsx
interface ProductCardProps {
  // ... existing props
  
  // B2B specific
  minOrderQuantity?: number
  bulkPricing?: { qty: number; price: number }[]
  businessVerified?: boolean
  samplesAvailable?: boolean
}
```

### B2B Badge Stack

```tsx
{/* B2B Badges - below rating row */}
{(minOrderQuantity || businessVerified || samplesAvailable) && (
  <div className="mt-0.5 flex flex-wrap gap-1">
    {minOrderQuantity && minOrderQuantity > 1 && (
      <span className="rounded-sm bg-blue-50 px-1 py-px text-2xs font-medium text-blue-700">
        MOQ: {minOrderQuantity}
      </span>
    )}
    {samplesAvailable && (
      <span className="rounded-sm bg-amber-50 px-1 py-px text-2xs font-medium text-amber-700">
        Samples
      </span>
    )}
    {businessVerified && (
      <span className="rounded-sm bg-emerald-50 px-1 py-px text-2xs font-medium text-emerald-700">
        Verified
      </span>
    )}
  </div>
)}
```

---

## 🌙 Dark Mode Support

All colors use semantic tokens that auto-switch:

```tsx
// Price badge (dark mode)
"bg-red-600 text-white" // Works in both modes

// Shipping badge
"bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"

// Condition badge
"bg-foreground/90 text-background" // Auto-inverts

// Card background
"bg-card" // Uses --color-card token
```

---

## ⚡ Performance Optimizations

### 1. Zero Layout Shift
- Fixed `aspect-[4/5]` ratio
- `placeholder="blur"` with `blurDataURL`
- Skeleton matches exact dimensions

### 2. Lazy Loading Strategy
```tsx
const loadingStrategy = {
  loading: index < 4 ? "eager" : "lazy",
  priority: index < 4,
}
```

### 3. Memoization
```tsx
// Expensive computations
const imageSrc = React.useMemo(() => getProductCardImageSrc(image), [image])
const conditionLabel = React.useMemo(() => getConditionLabel(condition, locale), [condition, locale])
const formattedPrice = React.useMemo(() => formatPrice(price, locale), [price, locale])
```

### 4. Event Handler Optimization
```tsx
// Stable callbacks
const handleAddToCart = React.useCallback((e: React.MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  // ... logic
}, [id, title, price, image, slug, username])
```

---

## 📱 Responsive Behavior

### Breakpoints

| Breakpoint | Grid | Card Changes |
|------------|------|--------------|
| < 640px | 2 cols | Base mobile specs |
| 640-768px | 2-3 cols | Slight spacing increase |
| 768-1024px | 3-4 cols | `text-sm` title |
| 1024px+ | 4-5 cols | `text-lg` → `text-xl` price, hover states |

### Grid Component

```tsx
function ProductGrid({ children, density = "default" }) {
  const densityClasses = {
    compact: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    comfortable: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }

  return (
    <div className={cn(
      "grid gap-1.5 px-1 sm:gap-2 sm:px-2 lg:gap-3 lg:px-3",
      densityClasses[density]
    )}>
      {children}
    </div>
  )
}
```

---

## 🧪 Accessibility Checklist

| Requirement | Implementation |
|-------------|----------------|
| Touch targets | All buttons ≥28px |
| Contrast | 4.5:1 verified with OKLCH |
| Focus visible | 2px ring on focus-visible |
| Screen reader | Proper aria-labels |
| Keyboard | Tab through all actions |
| Reduced motion | Respects prefers-reduced-motion |

---

## 📋 Implementation Checklist

### Phase 1: Core Structure (30 min)
- [ ] Update image container with proper aspect ratio
- [ ] Implement condition badge positioning
- [ ] Update wishlist button size and styling
- [ ] Add discount badge with threshold

### Phase 2: Price & Title (20 min)
- [ ] Implement price row with responsive sizing
- [ ] Add free shipping badge
- [ ] Update title with proper line-clamp

### Phase 3: Social Proof (15 min)
- [ ] Add rating row with star
- [ ] Implement sold count with formatting
- [ ] Add separator logic

### Phase 4: Seller & Actions (20 min)
- [ ] Update seller avatar size to 20px
- [ ] Add verified badge
- [ ] Update quick-add button to 28px
- [ ] Add B2B MOQ badge support

### Phase 5: Polish (15 min)
- [ ] Verify dark mode support
- [ ] Test all breakpoints
- [ ] Run accessibility audit
- [ ] Performance profiling

---

## 🎯 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 2.5s | Lighthouse |
| CLS | 0 | No layout shift |
| FID | < 100ms | Instant interactions |
| Tap accuracy | > 95% | User testing |
| Conversion lift | +15% | A/B test vs current |

---

## 🏁 Final Component API

```tsx
interface ProductCardProps {
  // Required
  id: string
  title: string
  price: number
  image: string
  
  // Pricing
  originalPrice?: number
  isOnSale?: boolean
  salePercent?: number
  
  // C2C
  condition?: "new" | "like_new" | "used" | "refurbished"
  
  // B2B
  minOrderQuantity?: number
  bulkPricing?: { qty: number; price: number }[]
  businessVerified?: boolean
  samplesAvailable?: boolean
  
  // Seller
  sellerId?: string
  sellerName?: string
  sellerAvatarUrl?: string
  sellerVerified?: boolean
  
  // Trust signals
  rating?: number
  reviewCount?: number
  soldCount?: number
  
  // Shipping
  freeShipping?: boolean
  
  // URLs
  slug?: string
  username?: string
  
  // Feature toggles
  showQuickAdd?: boolean
  showWishlist?: boolean
  showSeller?: boolean
  
  // Context
  index?: number
  currentUserId?: string
  inStock?: boolean
  className?: string
}
```

---

## 📚 Reference Materials

- [Design System](./design-system/DESIGN.md)
- [Tailwind Tasks](../prompts/tailwind_tasks.md)
- [shadcn Tasks](../prompts/shadcn_tasks.md)
- [Current Product Card](../components/shared/product/product-card.tsx)
- [Mobile Product Card Audit](./MOBILE_PRODUCT_CARD_AUDIT_PLAN.md)

---

*Generated by Frontend UI Stylist Agent • January 3, 2026*
*PlanMode: ULTRATHINK • Tailwind CSS v4 + shadcn/ui*

````