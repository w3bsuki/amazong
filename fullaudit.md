# AMZN Full UI/UX Audit Report

**Date:** December 2024  
**Auditor:** Playwright MCP Automated Audit + Manual Code Review  
**Mode:** Ultrathink - Brutal Honesty  
**Viewport Tested:** Desktop (1440x900), Mobile (375x812)

---

## Executive Summary

The AMZN platform has a solid foundation but suffers from **over-containerization**, **inconsistent information density**, and **visual noise** that detracts from the shopping experience. The UI feels more like a UI framework demo than a polished e-commerce platform like Amazon or eBay.

### Critical Issues (Priority 1)
1. **Container overload** - Every element wrapped in cards/borders
2. **Product cards too equal** - 50/50 image/content vs recommended 70/30
3. **Mobile wastefully spaced** - Too much padding, not enough products visible
4. **Section separation unclear** - No visual rhythm between sections
5. **Badge system inconsistent** - Mixed styling, sizes, and placements

### Medium Issues (Priority 2)
1. Typography could be denser with better hierarchy
2. Missing "sponsored" indicators and trust signals
3. Filters UI needs simplification
4. Checkout flow has unnecessary visual weight

### Minor Issues (Priority 3)
1. Footer could be more compact on mobile
2. Some button states could be clearer
3. Carousel controls inconsistent

---

## Page-by-Page Audit

### 1. Homepage

#### Desktop (1440px)
**Current State:**
- Hero carousel: Good implementation with CSS scroll-snap
- "Пазарувай по категория" section: Tabbed product carousel
- Category grid sections (Computers, Home, Fashion, Beauty): Card-heavy
- Promotional banners: 4 promos in a row (Apple $200, Toys 50%, etc.)
- "Още начини за пазаруване": 5 promotional cards

**Issues Identified:**

| Issue | Severity | Amazon/eBay Comparison |
|-------|----------|------------------------|
| Hero carousel text overlays too dark | Medium | Amazon uses lighter gradients |
| Tabbed section has visible borders on every product | High | Amazon: borderless, eBay: minimal borders |
| Category circles feel cramped in cards | Medium | eBay uses simple image circles without containers |
| Promo banners all same visual weight | Low | Amazon varies sizes for hierarchy |
| No "grey section separator" between sections | High | Amazon uses `bg-gray-100` bands |

**Recommendations:**
```
1. Remove Card borders from product items in carousels
2. Add grey background bands (bg-gray-100/bg-secondary) between major sections
3. Reduce padding inside product cards from p-2.5 to p-1.5
4. Make promo banners edge-to-edge on mobile
```

#### Mobile (375px)
**Current State:**
- Simplified header with hamburger menu
- Hero carousel working well
- Product carousels horizontal scroll
- Category sections stacked vertically

**Issues Identified:**

| Issue | Severity | Description |
|-------|----------|-------------|
| Too much white space between sections | High | `py-6` should be `py-3` on mobile |
| Product cards have full borders | High | Creates visual noise on small screens |
| Only ~2 products visible at a time | High | Should show 2.5 for visual hint |
| Section headers have too much margin | Medium | `mb-4` should be `mb-2` |
| No section separators | High | Amazon uses full-width grey bars |

**Mobile-Specific Recommendations:**
```css
/* Section separators like Amazon/eBay */
.section-separator {
  @apply w-full h-2 bg-secondary/50 my-4;
}

/* Denser product cards */
.product-card-mobile {
  @apply border-0 shadow-none bg-transparent;
  @apply p-1;
}

/* Show partial next product */
.carousel-container {
  @apply pr-8; /* Creates peek effect */
}
```

---

### 2. Search/Product Grid Page

#### Desktop
**Current State:**
- Left sidebar filters (collapsible sections)
- Sort dropdown + filter chips
- 4-column product grid
- Pagination at bottom

**Issues Identified:**

| Issue | Severity | Current | Recommended |
|-------|----------|---------|-------------|
| Product cards too square | High | `aspect-square` image | 70% image, 30% text |
| Cards have visible borders | High | `border-border` | Remove border, use shadow-xs on hover |
| Wishlist button placement | Low | Top-right overlay | Fine, but make smaller |
| Rating stars too prominent | Low | 11px stars | 10px, greyer color |
| Add to cart button always visible | Medium | Always shown | Show on hover (desktop) |
| Price not prominent enough | High | Same size as title | Should be larger |

**Filter Sidebar Issues:**
- Too many visible options at once
- Checkbox styling inconsistent
- Price range inputs look dated
- "Prime" badge placement awkward

#### Mobile (375px)
**Current State:**
- Filters in bottom sheet modal
- 2-column grid
- Smaller product cards

**Critical Mobile Issues:**

| Issue | Impact | Fix |
|-------|--------|-----|
| Cards still have borders | Visual clutter | Remove all borders on mobile |
| Too much padding between cards | Wastes space | `gap-2` not `gap-4` |
| Title text too small | Readability | `text-sm` minimum |
| Add to cart button too wide | Touch target overkill | Icon-only button |
| Only ~4 products visible above fold | Bad for conversion | Should see 6+ |

**Amazon Mobile Reference:**
```
- NO card borders, just image + text directly
- Price in BOLD, large font
- Rating inline with review count
- "Add to Cart" icon button only
- Grey horizontal lines between products (not boxes)
```

---

### 3. Product Detail Page (PDP)

#### Mobile Audit
**Current State:**
- Breadcrumb navigation
- Image gallery with thumbnails
- Title, rating, price
- Seller info card
- Shipping/returns info
- Specs table
- Related products carousel
- Reviews section

**Issues Identified:**

| Element | Issue | Recommendation |
|---------|-------|----------------|
| Breadcrumb | Takes too much space | Collapse to icon + back button |
| Image gallery | Good implementation | Keep as-is |
| Price section | Not prominent enough | Larger font, darker color |
| Seller card | Too boxy | Remove border, use subtle bg |
| Shipping info | Too many icons | Simplify to text with checkmarks |
| Specs table | Good | Keep striped rows |
| Related products | Has card borders | Remove borders like homepage |
| Reviews | Section title too heavy | Lighter weight |

**Trust Signals Missing:**
- No "X people bought this" indicator
- No "In stock - Ships tomorrow" urgency
- No "Best Seller" badge in category
- No "Amazon's Choice" equivalent

**Sticky Add-to-Cart (Mobile):**
- Currently implemented but could be more prominent
- Should show price + Add to Cart in sticky footer
- Consider showing "Buy Now" as primary action

---

### 4. Cart Page

**Current State:**
- Header: "Количка (2)" with item count
- Cart items with images, titles, quantities
- "Запази за по-късно" and "Изтрий" actions
- Order summary sidebar
- "Продължи към плащане" CTA

**Issues Identified:**

| Issue | Severity | Current | Amazon Style |
|-------|----------|---------|--------------|
| Cart items in full cards | Medium | Bordered cards | Simple rows with dividers |
| Quantity selector too fancy | Low | Custom steppers | Simple +/- inline |
| "Save for later" too prominent | Low | Full text button | Link text only |
| Order summary has shadow | Low | `shadow-sm` | Flat with border-top only |
| Empty state unknown | - | Not visible | Should be compelling |

**Recommendations:**
```
1. Replace card wrappers with simple horizontal dividers
2. Make quantity +/- controls inline and smaller
3. Reduce visual weight of action buttons
4. Add "You might also like" section at bottom
5. Show "Free shipping" progress bar
```

---

### 5. Checkout Page

**Current State:**
- 3-step checkout: Shipping → Delivery → Payment
- Address form with full fields
- Shipping method radio buttons (Standard free, Express 9.99лв, Next-day 19.99лв)
- Order summary on right sidebar
- Clean step indicator

**Issues Identified:**

| Issue | Severity | Description |
|-------|----------|-------------|
| Form fields too spaced | Medium | `space-y-4` should be `space-y-3` |
| Shipping options over-styled | Medium | Full cards vs simple radio list |
| Step indicator too large | Low | Could be more compact |
| Order summary repeats cart | Low | Show collapsed version |
| Missing "secure checkout" badge | Medium | Add trust indicators |

**Positive Notes:**
- Clean form layout
- Good validation states (assumed)
- Proper shipping options with prices
- Tax calculation visible

---

### 6. Sell Page

**Current State:**
- Hero: "Turn your items into instant cash"
- Stats: $2M+, 50K+, 4.9★
- Clean marketing layout

**Issues:**
- English text on Bulgarian locale ("Turn your items...")
- Stats could use better visual treatment
- CTA button could be more prominent
- Missing "How it works" steps section

---

### 7. Login/Auth Pages

**Current State:**
- Clean form with email/password
- "Забравена парола?" link
- "Създай Amazon акаунт" CTA
- Terms/privacy footer links

**Issues:**
- Form too centered with too much white space
- Could benefit from product imagery on side
- Password visibility toggle should be added
- Social login options missing

---

## Component-Level Audit

### Product Card (`product-card.tsx`)

**Current Implementation:**
```tsx
// 288 lines - too complex
// Uses: Card, CardContent, CardFooter from shadcn/ui
// Variants: default, grid, compact, carousel
// Tags: new, sale, limited, trending, bestseller, premium, handmade, eco-friendly
```

**Issues:**
1. **Over-engineered** - 4 variants when 2 would suffice
2. **Too many badge types** - 8 tags creates inconsistency
3. **Card wrapper adds visual weight** - Should be borderless on mobile
4. **Image container is 50%** - Should be 70% for visual impact
5. **Footer with add-to-cart always visible** - Hide on desktop, show on hover

**Recommended Refactor:**
```tsx
// Simplified structure
<article className="group">
  {/* 70% image area */}
  <div className="relative aspect-[4/5]">
    <Image fill ... />
    {tag && <Badge position="top-left" />}
    <WishlistButton position="top-right" showOnHover />
  </div>
  
  {/* 30% content area - dense */}
  <div className="p-1.5">
    <h3 className="text-sm line-clamp-2">{title}</h3>
    <Rating size="xs" />
    <Price size="lg" className="font-semibold" />
    <AddToCart showOnHover className="md:opacity-0 md:group-hover:opacity-100" />
  </div>
</article>
```

### Badge System

**Current State (from TAG_CONFIG):**
- 8 different badge types with varying colors
- Inconsistent sizing
- Some are overlay, some are inline

**Recommendation:**
```tsx
// Reduce to 4 essential badges
const BADGES = {
  sale: { bg: 'bg-red-600', text: 'white', label: 'SALE' },
  new: { bg: 'bg-blue-600', text: 'white', label: 'NEW' },
  top: { bg: 'bg-amber-500', text: 'black', label: 'TOP' },
  prime: { bg: 'bg-interactive', text: 'white', label: 'Prime' }
}

// Consistent sizing
<Badge className="text-[10px] px-1.5 py-0.5 font-bold uppercase" />
```

### Section Separators (Missing!)

**Amazon/eBay Pattern:**
- Full-width grey bands between sections
- Sometimes with slight gradient
- Creates visual rhythm without boxes

**Implementation Needed:**
```tsx
// New component: SectionSeparator.tsx
function SectionSeparator({ variant = 'default' }) {
  return (
    <div className={cn(
      "w-full",
      variant === 'default' && "h-2 bg-gray-100",
      variant === 'thick' && "h-3 bg-gray-200",
      variant === 'gradient' && "h-4 bg-gradient-to-b from-gray-100 to-white"
    )} />
  )
}

// Usage in homepage
<HeroCarousel />
<SectionSeparator variant="gradient" />
<TabbedProductSection />
<SectionSeparator />
<CategoryGrid />
```

---

## Mobile-Specific Recommendations

### 1. Remove Container/Card Overload
```css
/* Mobile: no borders on product items */
@media (max-width: 640px) {
  .product-card {
    @apply border-0 shadow-none rounded-none;
    @apply p-0;
  }
  
  .product-card-content {
    @apply p-1.5;
  }
}
```

### 2. Denser Product Grid
```tsx
// Current: gap-4 (16px)
// Recommended: gap-2 (8px) on mobile
<div className="grid grid-cols-2 gap-2 sm:gap-4">
```

### 3. Image-Heavy Cards (70-30 Split)
```tsx
// Current: aspect-square (1:1)
// Recommended: aspect-[4/5] (taller image)
<div className="relative aspect-[4/5]">
  <Image fill className="object-cover" />
</div>
```

### 4. Full-Width Section Banners
```tsx
// Promotional banners should be edge-to-edge on mobile
<div className="mx-[-1rem] sm:mx-0">
  <PromoBanner />
</div>
```

### 5. Simplified Text Hierarchy
```css
/* Mobile typography */
.product-title {
  @apply text-sm leading-tight line-clamp-2;
}

.product-price {
  @apply text-base font-semibold;
}

.product-rating {
  @apply text-xs text-muted-foreground;
}
```

---

## CSS/Styling Audit

### Current `globals.css` Issues:

1. **Border radius too rounded** - Using `radius-lg` (6px) when eBay-style should be 2-4px
2. **Shadows too prominent** - `shadow-sm` still visible, should use `shadow-none` or `shadow-2xs`
3. **Too many color tokens** - Over-engineered for current needs
4. **Missing density utilities** - Need `compact`, `dense` variants

### Recommended Additions:
```css
@theme {
  /* Density scale for mobile-first */
  --spacing-dense-xs: 0.25rem;  /* 4px */
  --spacing-dense-sm: 0.5rem;   /* 8px */
  --spacing-dense: 0.75rem;     /* 12px */
  --spacing-dense-lg: 1rem;     /* 16px */
  
  /* Section backgrounds */
  --color-section-alt: oklch(0.97 0 0);
  --color-section-separator: oklch(0.94 0 0);
}

/* Utility classes */
.section-band {
  @apply w-full py-6 bg-section-alt;
}

.section-separator {
  @apply w-full h-2 bg-section-separator;
}

.card-borderless {
  @apply border-0 shadow-none bg-transparent;
}
```

---

## Action Items Summary

### Immediate (This Sprint)
- [ ] Remove borders from product cards on mobile
- [ ] Add section separators between homepage sections
- [ ] Change product card aspect ratio to 4:5 (70% image)
- [ ] Reduce padding in carousels and grids
- [ ] Simplify badge system to 4 types

### Short-term (Next Sprint)
- [ ] Create `<SectionSeparator>` component
- [ ] Implement "show on hover" for add-to-cart on desktop
- [ ] Reduce cart page visual weight
- [ ] Add trust signals to PDP
- [ ] Fix locale issues on Sell page

### Medium-term (Backlog)
- [ ] Refactor `product-card.tsx` to be less complex
- [ ] Audit and optimize filter sidebar
- [ ] Add progress indicators (free shipping bar)
- [ ] Implement "Recently Viewed" section
- [ ] A/B test compact vs current layout

---

## Visual Reference: Amazon vs Current

### Product Card Comparison

| Aspect | Amazon | AMZN (Current) | Recommendation |
|--------|--------|----------------|----------------|
| Border | None | `border-border` | Remove |
| Image ratio | ~70% | 50% | Increase to 70% |
| Padding | 4-8px | 10px (p-2.5) | Reduce to 6px |
| Price size | 18px bold | 14px normal | Increase, add weight |
| Rating | 12px inline | 11px, own line | Keep size, inline |
| Add to Cart | Hidden/minimal | Always visible | Hover on desktop |
| Wishlist | Heart icon only | Heart in circle | Simplify |

### Section Separator Comparison

| Site | Implementation |
|------|----------------|
| Amazon | `bg-gray-200` full-width, 8px height |
| eBay | `border-t border-gray-200` only |
| Walmart | `bg-gray-100` with gradient |
| AMZN (Current) | None - just white space |
| AMZN (Recommended) | `bg-gray-100` full-width, 8px height |

---

## Conclusion

The AMZN platform has good bones but suffers from "design system syndrome" - too much visual consistency at the expense of information density and shopping efficiency. The key insight from Amazon and eBay is that **less decoration = more products = more sales**.

The highest-impact change would be removing card borders on mobile and adding section separators. This single change would transform the feel from "app demo" to "serious e-commerce."

### Priority Score Matrix

| Change | Effort | Impact | Priority |
|--------|--------|--------|----------|
| Remove mobile card borders | Low | High | **P0** |
| Add section separators | Low | High | **P0** |
| 70/30 image ratio | Medium | High | **P1** |
| Reduce padding/spacing | Low | Medium | **P1** |
| Simplify badges | Low | Medium | **P2** |
| Cart page cleanup | Medium | Low | **P3** |

---

*End of Audit Report*
