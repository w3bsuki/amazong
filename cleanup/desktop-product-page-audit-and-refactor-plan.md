# Desktop Product Page Audit + Refactor Plan

Target route: `http://localhost:3000/bg/shop4e/aysifon`

Date: 2025-12-27 (Comprehensive Update)

---

## Executive Summary

The current desktop product page lacks visual hierarchy, modern spacing, and the polished look of best-in-class marketplaces. This plan proposes a complete desktop-first redesign using **shadcn/ui + Tailwind v4** best practices with a clean grid system.

---

## Route & Components

- **Route**: [app/[locale]/[username]/[productSlug]/page.tsx](../app/%5Blocale%5D/%5Busername%5D/%5BproductSlug%5D/page.tsx)
- **Similar/top bar**: [similar-items-bar.tsx](../components/shared/product/similar-items-bar.tsx)
- **Gallery**: [product-gallery-hybrid.tsx](../components/shared/product/product-gallery-hybrid.tsx)
- **Buy box**: [product-buy-box.tsx](../components/shared/product/product-buy-box.tsx)
- **More from seller**: [seller-products-grid.tsx](../components/shared/product/seller-products-grid.tsx)
- **Reviews**: [customer-reviews-hybrid.tsx](../components/shared/product/customer-reviews-hybrid.tsx)

---

## Current State Analysis

### Observed Issues (Desktop)

| Issue | Severity | Notes |
|-------|----------|-------|
| **No visual hierarchy** | 🔴 High | All sections blend together; gallery/title/price don't "pop" |
| **Layout full-bleed on large screens** | 🔴 High | Content spans nearly full viewport width on 1920px |
| **Crowded above-the-fold** | 🔴 High | SimilarItemsBar + seller info + gallery all compete for attention |
| **Gallery proportions wrong** | 🔴 High | `aspect-square` + `max-h-[80vh]` balloons on wide screens |
| **Buy box placeholder content** | 🔴 High | Hardcoded avatar, condition, shipping data |
| **Inconsistent spacing** | 🟡 Medium | Mixed gaps, no rhythm |
| **Flat trust badges** | 🟡 Medium | Small icons, no card treatment |
| **Product grid is monotonous** | 🟡 Medium | No variation, heavy feel |
| **Reviews section feels detached** | 🟡 Medium | Doesn't flow with the page |
| **Duplicate skip links** | 🟡 Medium | A11y issue - multiple skip links |
| **No breadcrumbs** | 🟠 Low | Users can't orient themselves |
| **Footer overwhelms** | 🟠 Low | Too many links without grouping |

---

## Current Layout (Approximation)

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER (Brand | Search | Auth | Cart)                               │
├──────────────────────────────────────────────────────────────────────┤
│  SimilarItemsBar: [seller] [thumb][thumb][thumb][thumb] [Shop store→]│
├──────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐  ┌──────────────────────────────────────┐│
│ │                         │  │ Title (h1)                          ││
│ │    GALLERY              │  │ Seller badge + feedback              ││
│ │    (main image)         │  │                                      ││
│ │                         │  │ Price: 5,00 лв.                      ││
│ │ [thumb][thumb][thumb]   │  │ Condition: New                       ││
│ │                         │  │ Quantity: [-] 1 [+]   In Stock       ││
│ │                         │  │                                      ││
│ │                         │  │ [Buy It Now] [Add to cart] [♡ Watch] ││
│ └─────────────────────────┘  │                                      ││
│                              │ Shipping: ...                        ││
│                              │ Returns: ...                         ││
│                              │ Payments: [icons]                    ││
│                              │                                      ││
│                              │ 🔒 Secure | 💰 Money Back | 🚚 Fast  ││
│                              └──────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  MORE FROM THIS SELLER                                               │
│  [card][card][card][card][card][card][card][card][card][card]       │
│  [See all (519)]                                                     │
├──────────────────────────────────────────────────────────────────────┤
│  CUSTOMER REVIEWS                                                    │
│  Rating breakdown + filters + reviews list                          │
├──────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Proposed Desktop Layout

### Design Philosophy

1. **12-column grid** with `max-w-7xl` container (1280px)
2. **Sticky buy box** on scroll (remains visible while exploring)
3. **Card-based sections** with consistent `rounded-xl` borders
4. **Clear visual hierarchy**: Gallery is king, then title/price, then secondary info
5. **Whitespace rhythm**: Use Tailwind's spacing scale consistently (`gap-6`, `gap-8`, `py-8`)

### Proposed ASCII Grid Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          HEADER (fixed/sticky)                           │
│  [AMZN]  [═══════════ Search ═══════════]  [Login] [Sign Up] [Sell] 🛒   │
└──────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────┐
│ BREADCRUMBS: Home > shop4e > Айсифон                                     │
└──────────────────────────────────────────────────────────────────────────┘
│                              max-w-7xl container                         │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                        PRODUCT HERO (grid cols-12)                  │ │
│  │  ┌───────────────────────────────┐ ┌────────────────────────────┐   │ │
│  │  │                               │ │                            │   │ │
│  │  │      GALLERY (col-span-7)     │ │  BUY BOX (col-span-5)     │   │ │
│  │  │                               │ │                            │   │ │
│  │  │   ┌─────────────────────────┐ │ │  ┌──────────────────────┐ │   │ │
│  │  │   │                         │ │ │  │ [Seller] shop4e      │ │   │ │
│  │  │   │     MAIN IMAGE          │ │ │  │ ★★★★★ 98% positive   │ │   │ │
│  │  │   │     (aspect-[4/5])      │ │ │  └──────────────────────┘ │   │ │
│  │  │   │                         │ │ │                            │   │ │
│  │  │   │          🔍             │ │ │  h1 "Айсифон"             │   │ │
│  │  │   │                         │ │ │                            │   │ │
│  │  │   └─────────────────────────┘ │ │  ┌──────────────────────┐ │   │ │
│  │  │   [○][○][●][○] thumbnails     │ │  │ 5,00 лв.             │ │   │ │
│  │  │                               │ │  │ Condition: New ✓     │ │   │ │
│  │  └───────────────────────────────┘ │  │ In Stock             │ │   │ │
│  │                                     │  └──────────────────────┘ │   │ │
│  │                                     │                            │   │ │
│  │                                     │  Quantity: [−] 1 [+]      │   │ │
│  │                                     │                            │   │ │
│  │                                     │  ╔══════════════════════╗ │   │ │
│  │                                     │  ║   🟠 Buy It Now      ║ │   │ │
│  │                                     │  ╚══════════════════════╝ │   │ │
│  │                                     │  ┌──────────────────────┐ │   │ │
│  │                                     │  │   🛒 Add to cart     │ │   │ │
│  │                                     │  └──────────────────────┘ │   │ │
│  │                                     │  ┌──────────────────────┐ │   │ │
│  │                                     │  │   ♡  Add to Wishlist │ │   │ │
│  │                                     │  └──────────────────────┘ │   │ │
│  │                                     │                            │   │ │
│  │                                     │  ─────────────────────────│   │ │
│  │                                     │  📦 Ships to Bulgaria     │   │ │
│  │                                     │  ↩️  30 days returns      │   │ │
│  │                                     │  💳 Visa MC PayPal       │   │ │
│  │                                     │  ─────────────────────────│   │ │
│  │                                     │                            │   │ │
│  │                                     │  ┌────────────────────────┐│  │ │
│  │                                     │  │ 🔒    💰    🚚        ││  │ │
│  │                                     │  │Secure Money  Fast     ││  │ │
│  │                                     │  │Trans  Back   Delivery ││  │ │
│  │                                     │  └────────────────────────┘│  │ │
│  │                                     └────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                   MORE FROM THIS SELLER                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐│ │
│  │  │ [Header: "More from shop4e" + "See all (519)" button]           ││ │
│  │  │                                                                  ││ │
│  │  │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                ││ │
│  │  │ │ IMG │ │ IMG │ │ IMG │ │ IMG │ │ IMG │ │ IMG │   ← 6 cols     ││ │
│  │  │ │─────│ │─────│ │─────│ │─────│ │─────│ │─────│                ││ │
│  │  │ │Title│ │Title│ │Title│ │Title│ │Title│ │Title│                ││ │
│  │  │ │5 €  │ │67 € │ │67 € │ │5 €  │ │5 €  │ │5 €  │                ││ │
│  │  │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                ││ │
│  │  └─────────────────────────────────────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                     CUSTOMER REVIEWS                                │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐│ │
│  │  │ ┌───────────────────────┐  ┌─────────────────────────────────┐ ││ │
│  │  │ │   RATING SUMMARY      │  │      RATING BREAKDOWN          │ ││ │
│  │  │ │                       │  │                                 │ ││ │
│  │  │ │   ★★★★★ 4.8          │  │  5 ★ ███████████████████░ 136  │ ││ │
│  │  │ │   Excellent           │  │  4 ★ ████░░░░░░░░░░░░░░░  33  │ ││ │
│  │  │ │   95% Satisfaction    │  │  3 ★ ██░░░░░░░░░░░░░░░░░   9  │ ││ │
│  │  │ │   Based on 190 Reviews│  │  2 ★ ██░░░░░░░░░░░░░░░░░  10  │ ││ │
│  │  │ │                       │  │  1 ★ █░░░░░░░░░░░░░░░░░░   2  │ ││ │
│  │  │ └───────────────────────┘  └─────────────────────────────────┘ ││ │
│  │  │                                                                ││ │
│  │  │  [All (190)] [With Photos (12)] [Verified Only]  [Write review]││ │
│  │  └─────────────────────────────────────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────┐
│                              FOOTER                                      │
│  [Back to top ↑]                                                         │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐                │
│  │ About Us  │ │ Help      │ │ Stores    │ │ Services  │                │
│  │ ───────── │ │ ───────── │ │ ───────── │ │ ───────── │                │
│  │ About AMZN│ │ Help Ctr  │ │ Find Store│ │ Membership│                │
│  │ Careers   │ │ Returns   │ │ Pharmacy  │ │ Gift Cards│                │
│  │ ...       │ │ ...       │ │ ...       │ │ ...       │                │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘                │
│                                                                          │
│  [AMZN]  [Pinterest][Facebook][Instagram][X][YouTube][TikTok]           │
│  Terms | Privacy | Cookies | CA Rights | Privacy Choices | Ads          │
│  © 2025 AMZN, Inc.                                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component-Level Refactor Plan

### P0: Critical Fixes (Desktop)

#### P0.1: Implement 12-Column Grid Layout

**Goal**: Clean, modern responsive grid using Tailwind v4 + shadcn patterns.

**Proposed structure for page.tsx:**

```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* Breadcrumbs */}
  <Breadcrumb className="py-4" />
  
  {/* Product Hero: 12-col grid */}
  <div className="grid grid-cols-12 gap-8">
    {/* Gallery: 7 cols on desktop */}
    <div className="col-span-12 lg:col-span-7">
      <ProductGallery />
    </div>
    
    {/* Buy Box: 5 cols on desktop, sticky */}
    <div className="col-span-12 lg:col-span-5">
      <div className="lg:sticky lg:top-20">
        <ProductBuyBox />
      </div>
    </div>
  </div>
  
  {/* More from seller */}
  <section className="mt-12">
    <SellerProductsGrid />
  </section>
  
  {/* Reviews */}
  <section className="mt-12 mb-16">
    <CustomerReviews />
  </section>
</div>
```

**Alternative grid approach (fixed sidebar width):**
```tsx
<div className="lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
```

**Files to modify**:
- `app/[locale]/[username]/[productSlug]/page.tsx`

#### P0.2: Remove SimilarItemsBar from Desktop View

**Goal**: Eliminate redundant seller info above the fold.

**Changes**:
- Make `SimilarItemsBar` mobile-only OR repurpose it as a "recently viewed" bar.
- Keep seller info consolidated in the BuyBox.

```tsx
// Option A: Hide on desktop
<SimilarItemsBar className="lg:hidden" />

// Option B: Remove entirely and rely on SellerProductsGrid section
```

**Files**:
- `components/shared/product/similar-items-bar.tsx`
- `app/[locale]/[username]/[productSlug]/page.tsx`

#### P0.3: Add Breadcrumbs Component

**Goal**: Improve navigation and SEO.

```tsx
// components/shared/product/product-breadcrumb.tsx (use shadcn Breadcrumb)
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/shop4e">shop4e</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Айсифон</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

**Files**:
- Create: `components/shared/product/product-breadcrumb.tsx`
- Modify: `app/[locale]/[username]/[productSlug]/page.tsx`

---

### P1: Visual Polish

#### P1.1: Card-Based Sections with shadcn Card

**Goal**: Each major section (Gallery, BuyBox, SellerProducts, Reviews) uses `Card` for consistent styling.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Buy Box example
<Card className="rounded-xl border-0 shadow-lg">
  <CardContent className="p-6">
    {/* Buy box content */}
  </CardContent>
</Card>

// Seller Products section
<Card className="rounded-xl">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>More from this seller</CardTitle>
    <Button variant="ghost">See all (519) →</Button>
  </CardHeader>
  <CardContent>
    {/* Product grid */}
  </CardContent>
</Card>
```

**Files**:
- `components/shared/product/product-buy-box.tsx`
- `components/shared/product/seller-products-grid.tsx`
- `components/shared/product/customer-reviews-hybrid.tsx`

#### P1.2: Gallery Improvements

**Goal**: Better aspect ratio and functional zoom.

```tsx
// components/shared/product/product-gallery-hybrid.tsx

<div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted max-h-[70vh]">
  <Image
    src={mainImage}
    alt={product.title}
    fill
    className="object-contain"
    priority
  />
  <Button
    variant="secondary"
    size="icon"
    className="absolute bottom-4 right-4 h-11 w-11 rounded-full shadow-lg"
    onClick={openZoom}
  >
    <ZoomIn className="h-5 w-5" />
  </Button>
</div>

{/* Thumbnails */}
<div className="mt-4 flex gap-2">
  {thumbnails.map((thumb, i) => (
    <button
      key={i}
      className={cn(
        "h-16 w-16 rounded-lg overflow-hidden border-2 transition-all",
        selected === i ? "border-primary ring-2 ring-primary/20" : "border-muted"
      )}
    >
      <Image src={thumb} alt="" fill className="object-cover" />
    </button>
  ))}
</div>
```

#### P1.3: Sticky Buy Box on Desktop

**Goal**: Keep purchase options visible while scrolling.

```tsx
<div className="col-span-12 lg:col-span-5">
  <div className="lg:sticky lg:top-24 lg:self-start">
    <ProductBuyBox />
  </div>
</div>
```

---

### P2: Trust & Conversion

#### P2.1: Enhanced Trust Badges

**Goal**: Make trust signals more prominent with card treatment.

```tsx
<div className="grid grid-cols-3 gap-4 mt-6">
  <Card className="flex flex-col items-center p-4 text-center">
    <ShieldCheck className="h-8 w-8 text-green-600 mb-2" />
    <span className="text-sm font-medium">Secure Transaction</span>
  </Card>
  <Card className="flex flex-col items-center p-4 text-center">
    <BadgeCheck className="h-8 w-8 text-blue-600 mb-2" />
    <span className="text-sm font-medium">Money Back Guarantee</span>
  </Card>
  <Card className="flex flex-col items-center p-4 text-center">
    <Truck className="h-8 w-8 text-orange-600 mb-2" />
    <span className="text-sm font-medium">Fast Delivery</span>
  </Card>
</div>
```

#### P2.2: Improved CTA Button Hierarchy

**Goal**: Clear primary/secondary/tertiary button styles.

```tsx
// Primary: Buy It Now
<Button className="w-full h-12 text-lg font-semibold">
  Buy It Now
</Button>

// Secondary: Add to Cart
<Button variant="outline" className="w-full h-12 text-lg">
  <ShoppingCart className="mr-2 h-5 w-5" />
  Add to cart
</Button>

// Tertiary: Wishlist
<Button variant="ghost" className="w-full h-10">
  <Heart className="mr-2 h-5 w-5" />
  Add to Watchlist
</Button>
```

---

### P3: Seller Products Grid

#### P3.1: 6-Column Grid with Hover Effects

**Goal**: Modern product cards with smooth interactions.

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
  {products.map((product) => (
    <Card key={product.id} className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {product.badge && (
          <Badge className="absolute top-2 left-2">{product.badge}</Badge>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="text-sm font-medium line-clamp-1">{product.title}</h3>
        <p className="text-xs text-muted-foreground">{product.condition}</p>
        <div className="flex items-center gap-1 mt-1">
          <Truck className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Free shipping</span>
        </div>
        <p className="text-lg font-bold mt-1">{formatPrice(product.price)}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

---

### P4: Reviews Section

#### P4.1: Two-Column Rating Layout

**Goal**: Summary on left, breakdown on right.

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Customer Reviews</CardTitle>
    <Button>Write a review</Button>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Rating Summary */}
      <div className="flex flex-col items-center text-center">
        <span className="text-5xl font-bold">4.8</span>
        <StarRating value={4.8} className="mt-2" />
        <Badge variant="secondary" className="mt-2">Excellent</Badge>
        <p className="text-sm text-muted-foreground mt-1">
          95% Satisfaction Rate
        </p>
        <p className="text-xs text-muted-foreground">
          Based on 190 Reviews
        </p>
      </div>
      
      {/* Rating Breakdown */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="w-4">{rating}</span>
            <Progress value={percentages[rating]} className="flex-1" />
            <span className="w-8 text-sm text-muted-foreground">
              {counts[rating]}
            </span>
          </div>
        ))}
      </div>
    </div>
    
    {/* Filter Tabs */}
    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
      <Button variant="secondary" size="sm">All (190)</Button>
      <Button variant="ghost" size="sm">With Photos (12)</Button>
      <Button variant="ghost" size="sm">Verified Only</Button>
    </div>
  </CardContent>
</Card>
```

---

### P5: Fix Skip-Link Duplication

**Goal**: Only one skip link per target in the DOM.

**Files to check**:
- `app/[locale]/(main)/layout.tsx`
- `app/[locale]/[username]/layout.tsx`
- Header components

**Solution**: Extract a shared `SkipLinks` component and render it in exactly one place.

---

## Tailwind v4 Best Practices Applied

### 1. Container Queries (New in v4)

```tsx
// Use @container for responsive component design
<div className="@container">
  <div className="@lg:grid-cols-2 grid gap-4">
    {/* Responds to container, not viewport */}
  </div>
</div>
```

### 2. Color Palette Using CSS Variables

```css
/* globals.css */
@layer base {
  :root {
    --primary: oklch(0.7 0.15 250);
    --primary-foreground: oklch(0.98 0 0);
    --muted: oklch(0.96 0.01 250);
    --accent: oklch(0.95 0.02 250);
  }
}
```

### 3. Spacing Rhythm

- **Section spacing**: `py-12` / `mt-12`
- **Card padding**: `p-6`
- **Grid gaps**: `gap-4`, `gap-6`, `gap-8`
- **Inline spacing**: `gap-2`, `space-x-2`

### 4. Typography Scale

```tsx
// Consistent heading sizes
<h1 className="text-3xl font-bold tracking-tight">Product Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<h3 className="text-lg font-medium">Subsection</h3>
<p className="text-base text-muted-foreground">Body text</p>
<span className="text-sm text-muted-foreground">Small text</span>
```

---

## shadcn/ui Components to Use

| Component | Usage |
|-----------|-------|
| `Card` | Sections, product cards, trust badges |
| `Button` | CTAs, filters, actions |
| `Badge` | Product labels, seller ratings |
| `Breadcrumb` | Navigation |
| `Tabs` | Review filters |
| `Progress` | Rating breakdown |
| `Dialog` | Image zoom |
| `Carousel` | Gallery (if using swipe) |
| `Separator` | Visual dividers |
| `Tooltip` | Icon explanations |

---

## Implementation Order

### Sprint 1: Layout Foundation
1. [ ] P0.1: Implement 12-column grid in page.tsx
2. [ ] P0.2: Remove/hide SimilarItemsBar on desktop
3. [ ] P0.3: Add breadcrumbs component

### Sprint 2: Visual Polish
4. [ ] P1.1: Wrap sections in Card components
5. [ ] P1.2: Gallery improvements (aspect ratio, zoom button)
6. [ ] P1.3: Sticky buy box implementation

### Sprint 3: Trust & Conversion
7. [ ] P2.1: Enhanced trust badges with cards
8. [ ] P2.2: CTA button hierarchy refinement

### Sprint 4: Secondary Content
9. [ ] P3.1: Seller products 6-column grid
10. [ ] P4.1: Two-column reviews layout

### Sprint 5: Cleanup
11. [ ] P5: Fix skip-link duplication

---

## Verification Checklist

### Desktop (1280px+)

- [ ] Gallery takes ~60% width, BuyBox ~40%
- [ ] Buy box stays sticky on scroll
- [ ] No duplicate seller info above fold
- [ ] Breadcrumbs visible
- [ ] Trust badges are prominent
- [ ] Seller products show 6 per row
- [ ] Reviews have two-column layout

### Tablet (768px - 1279px)

- [ ] Grid collapses appropriately
- [ ] Gallery full-width on small tablets
- [ ] Buy box below gallery on smaller screens

### Visual QA

- [ ] Consistent spacing (`gap-6`, `gap-8`)
- [ ] All cards use `rounded-xl`
- [ ] Hover states on interactive elements
- [ ] Focus states for accessibility

---

## Quick Wins You Can Do Immediately

1. Constrain width + fix grid columns (Phase 1)
2. Wire zoom button to actually open PhotoSwipe
3. Remove hardcoded avatar in buy box

---

## Notes

- There's a separate desktop experiment component: [product-page-desktop-v2.tsx](../components/shared/product/product-page-desktop-v2.tsx). If you swap to it, avoid rendering `SimilarItemsBar` twice.
- The current page uses placeholder values for rating/condition/shipping. Prefer hiding unknown fields over showing fake ones.

---

## Next Steps

Would you like me to:

1. **Implement P0.1** - Create the 12-column grid layout in the page component
2. **Implement P0.3** - Add the breadcrumbs component using shadcn
3. **Create a detailed mockup** with more visual specifications

Let me know which path you'd like to take!
