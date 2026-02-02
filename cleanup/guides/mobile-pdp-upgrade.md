# Mobile Product Page Upgrade Guide

> **Reference**: `temp-tradesphere-audit/src/pages/ListingDetail.tsx`
> **Target**: `components/mobile/product/mobile-product-page.tsx` and related files

This guide documents how to upgrade our mobile product detail page (PDP) to match the superior UX patterns from the Vite prototype while maintaining our Next.js + shadcn/ui + Tailwind v4 architecture.

---

## Quick Reference: Prototype Files

| Component | Prototype Location | Our Equivalent |
|-----------|-------------------|----------------|
| Product Detail Page | `temp-tradesphere-audit/src/pages/ListingDetail.tsx` | `components/mobile/product/mobile-product-page.tsx` |
| Gallery | Inline in ListingDetail.tsx (L86-158) | `components/mobile/product/mobile-gallery-v2.tsx` |
| Bottom Bar | Inline in ListingDetail.tsx (L296-310) | `components/mobile/product/mobile-bottom-bar-v2.tsx` |
| Listing Card | `temp-tradesphere-audit/src/components/listing/ListingCard.tsx` | `components/shared/product/product-card.tsx` |
| CSS Utilities | `temp-tradesphere-audit/src/index.css` | `app/globals.css`, `app/utilities.css` |

---

## Part 1: Gallery Improvements

### Current State (Ours)
- Thumbnails in separate strip below gallery
- Floating buttons (back, wishlist) - ✅ already good
- Image counter badge - ✅ already good

### Target State (Prototype)
- **Thumbnails overlaid on hero image** (bottom-left, inside gallery area)
- Same floating buttons pattern

### Implementation

**File**: `components/mobile/product/mobile-gallery-v2.tsx`

**Change**: Move thumbnail strip inside the gallery container, position absolute bottom-left.

```tsx
// BEFORE: Thumbnails outside gallery
<div className="relative bg-surface-gallery">
  {/* ... gallery content ... */}
</div>
{/* Thumbnail strip OUTSIDE */}
{images.length > 1 && (
  <div className="flex gap-1.5 p-2 bg-surface-card border-b">
    {/* thumbnails */}
  </div>
)}

// AFTER: Thumbnails INSIDE gallery (prototype pattern)
<div className="relative bg-surface-gallery">
  {/* ... gallery content ... */}
  
  {/* Thumbnail strip - overlaid bottom-left */}
  {images.length > 1 && (
    <div className="absolute bottom-3 left-3 right-16 z-20 flex gap-1.5 overflow-x-auto hide-scrollbar">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); scrollToImage(i); }}
          className={cn(
            "flex-shrink-0 size-11 rounded-lg overflow-hidden border-2 transition-all",
            i === activeIndex 
              ? "border-primary" 
              : "border-transparent opacity-70"
          )}
        >
          <Image src={img.src} alt="" width={44} height={44} className="object-cover size-full" />
        </button>
      ))}
    </div>
  )}
</div>
```

**Reference**: Prototype L143-157
```tsx
// From temp-tradesphere-audit/src/pages/ListingDetail.tsx
<div className="absolute bottom-4 left-4 right-20 flex gap-2 overflow-x-auto hide-scrollbar">
  {listing.images.map((img, index) => (
    <button
      key={index}
      onClick={() => setCurrentImageIndex(index)}
      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 ${
        index === currentImageIndex ? "border-primary" : "border-transparent"
      }`}
    >
      <img src={img} alt="" className="w-full h-full object-cover" />
    </button>
  ))}
</div>
```

---

## Part 2: Bottom Bar Glass Effect

### Current State (Ours)
```tsx
// mobile-bottom-bar-v2.tsx
<div className={cn(
  "fixed bottom-0 left-0 right-0 z-50",
  "bg-surface-elevated border-t border-border",  // ❌ Solid background
  "pb-safe",
)}>
```

### Target State (Prototype)
```tsx
// ListingDetail.tsx L296
<div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-bottom">
```

### Implementation

**File**: `components/mobile/product/mobile-bottom-bar-v2.tsx`

```tsx
// CHANGE THIS:
"bg-surface-elevated border-t border-border",

// TO THIS:
"bg-background/95 backdrop-blur-sm border-t border-border",
```

**Also add max-width centering** (prototype pattern for tablet-friendliness):
```tsx
<div className="px-3 py-2.5 max-w-lg mx-auto">
```

---

## Part 3: Inline Seller Card (Key Difference)

### Current State (Ours)
- Seller info hidden in "Seller" tab
- User must tap tab to see seller details

### Target State (Prototype)
- Seller card **inline in main scroll**, always visible
- Still keep detailed seller tab for full profile

### Implementation

**Create**: `components/mobile/product/mobile-seller-preview-card.tsx`

```tsx
"use client"

import { Star, ChevronRight } from "lucide-react"
import { CheckCircle } from "@phosphor-icons/react"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface MobileSellerPreviewCardProps {
  seller: {
    id: string
    name: string
    username?: string | null
    avatarUrl?: string | null
    verified?: boolean
    rating?: number | null
    reviewCount?: number | null
    responseTimeHours?: number | null
    listingsCount?: number | null
    totalSales?: number | null
    joinedYear?: string | null
  }
  onViewProfile?: () => void
  onFollow?: () => void
  isFollowing?: boolean
}

export function MobileSellerPreviewCard({
  seller,
  onViewProfile,
  onFollow,
  isFollowing = false,
}: MobileSellerPreviewCardProps) {
  const t = useTranslations("Product")
  
  // Response time label
  const responseLabel = seller.responseTimeHours != null
    ? seller.responseTimeHours <= 1
      ? t("seller.respondsWithinHour")
      : t("seller.respondsWithinHours", { hours: Math.round(seller.responseTimeHours) })
    : null

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      {/* Top row: Avatar + Info + Follow */}
      <div className="flex items-start gap-3">
        <UserAvatar
          name={seller.name}
          avatarUrl={seller.avatarUrl}
          size="lg"
          className="size-14"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-foreground truncate">{seller.name}</h3>
            {seller.verified && (
              <CheckCircle weight="fill" className="size-4 text-primary shrink-0" />
            )}
          </div>
          
          {seller.rating != null && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="size-3.5 text-warning fill-warning" />
              <span className="text-sm font-medium text-foreground">{seller.rating.toFixed(1)}</span>
              {seller.reviewCount != null && (
                <span className="text-sm text-muted-foreground">
                  ({seller.reviewCount} {t("seller.reviews")})
                </span>
              )}
            </div>
          )}
          
          {responseLabel && (
            <p className="text-xs text-muted-foreground mt-1">{responseLabel}</p>
          )}
        </div>
        
        <Button
          variant={isFollowing ? "secondary" : "outline"}
          size="sm"
          onClick={onFollow}
          className="shrink-0"
        >
          {isFollowing ? t("seller.following") : t("seller.follow")}
        </Button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-sm">
        {seller.listingsCount != null && (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.listingsCount}</p>
            <p className="text-xs text-muted-foreground">{t("seller.listings")}</p>
          </div>
        )}
        {seller.reviewCount != null && (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.reviewCount}</p>
            <p className="text-xs text-muted-foreground">{t("seller.reviews")}</p>
          </div>
        )}
        {seller.joinedYear && (
          <div className="text-center">
            <p className="font-semibold text-foreground">{seller.joinedYear}</p>
            <p className="text-xs text-muted-foreground">{t("seller.memberSince")}</p>
          </div>
        )}
        
        <button 
          onClick={onViewProfile}
          className="ml-auto flex items-center gap-1 text-primary font-medium active:opacity-70"
        >
          {t("seller.viewProfile")}
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
```

**Reference**: Prototype L209-260

---

## Part 4: Safety Tips + Report Section

### Target Pattern

Add these sections below description, before "Similar Items":

**Create**: `components/mobile/product/mobile-trust-sections.tsx`

```tsx
"use client"

import { Shield, Flag } from "lucide-react"
import { useTranslations } from "next-intl"

interface MobileTrustSectionsProps {
  onReport?: () => void
}

export function MobileSafetyTips() {
  const t = useTranslations("Product")
  
  return (
    <div className="bg-primary/5 rounded-2xl p-4 flex gap-3">
      <Shield className="size-5 text-primary shrink-0 mt-0.5" />
      <div>
        <h3 className="font-medium text-foreground text-sm">{t("safety.title")}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {t("safety.description")}
        </p>
      </div>
    </div>
  )
}

export function MobileReportButton({ onReport }: MobileTrustSectionsProps) {
  const t = useTranslations("Product")
  
  return (
    <button 
      onClick={onReport}
      className="flex items-center justify-center gap-2 w-full py-3 text-sm text-muted-foreground active:text-foreground transition-colors"
    >
      <Flag className="size-4" />
      {t("report.listing")}
    </button>
  )
}
```

**Reference**: Prototype L269-285

---

## Part 5: Price + Negotiable Badge

### Current State (Ours)
- Price display without negotiable indicator

### Target State (Prototype)
```tsx
<div className="flex items-center gap-2 mb-1">
  <p className="text-2xl font-bold text-foreground">
    {listing.currency}{listing.price.toLocaleString()}
  </p>
  {listing.negotiable && (
    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
      Negotiable
    </span>
  )}
</div>
```

### Implementation

**File**: `components/mobile/product/mobile-product-info-tab.tsx`

Add negotiable prop and badge rendering inline with price.

---

## Part 6: Similar Items Grid (At Page Bottom)

### Current State (Ours)
- Related products only in Seller tab

### Target State (Prototype)
- Similar items grid at bottom of main scroll
- 2-column grid using our `ProductCard` component

### Implementation

**File**: `components/mobile/product/mobile-product-page.tsx`

Add a "Similar Items" section after the tabs content area:

```tsx
{/* Similar Items - Outside tabs, at page bottom */}
<section className="px-4 py-4 bg-background">
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-semibold text-foreground">{t("similarItems")}</h2>
    <Link href={`/categories/${rootCategory?.slug}`} className="text-sm text-primary font-medium">
      {t("seeAll")}
    </Link>
  </div>
  <div className="grid grid-cols-2 gap-3">
    {relatedProducts.slice(0, 4).map((product) => (
      <ProductCard key={product.id} {...product} />
    ))}
  </div>
</section>
```

**Reference**: Prototype L287-295

---

## Part 7: CSS Utilities to Add

**File**: `app/utilities.css`

Add these mobile-native utilities if not present:

```css
/* Hidden scrollbar for horizontal scrolls */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Native press feedback */
.tap-highlight {
  @apply active:opacity-70 transition-opacity duration-100;
}

/* Card shadow token (marketplace style) */
.shadow-card {
  box-shadow: 0 4px 12px -2px hsl(var(--foreground) / 0.08);
}

/* Promoted listing glow */
.promoted-glow {
  box-shadow: 0 0 20px hsl(var(--primary) / 0.25);
}
```

---

## Part 8: Translation Keys Required

**File**: `messages/en.json` (and `messages/bg.json`)

```json
{
  "Product": {
    "safety": {
      "title": "Safety Tips",
      "description": "Meet in public places, inspect items before payment, and use secure payment methods."
    },
    "report": {
      "listing": "Report this listing"
    },
    "seller": {
      "respondsWithinHour": "Usually responds within 1 hour",
      "respondsWithinHours": "Usually responds within {hours} hours",
      "listings": "Listings",
      "reviews": "Reviews",
      "memberSince": "Member since",
      "viewProfile": "View Profile",
      "follow": "Follow",
      "following": "Following"
    },
    "similarItems": "Similar Items",
    "negotiable": "Negotiable"
  }
}
```

---

## Summary: Changes by File

| File | Changes |
|------|---------|
| `mobile-gallery-v2.tsx` | Move thumbnails inside gallery, overlay bottom-left |
| `mobile-bottom-bar-v2.tsx` | Add `backdrop-blur-sm bg-background/95`, max-width |
| `mobile-product-page.tsx` | Add inline seller preview, similar items section |
| `mobile-product-info-tab.tsx` | Add negotiable badge, safety tips, report |
| **NEW** `mobile-seller-preview-card.tsx` | Create compact seller card component |
| **NEW** `mobile-trust-sections.tsx` | Safety tips + report button components |
| `utilities.css` | Add `hide-scrollbar`, `tap-highlight`, `shadow-card` |
| `messages/*.json` | Add translation keys |

---

## Implementation Order

1. **Phase 1**: CSS utilities + translations (non-breaking)
2. **Phase 2**: Bottom bar glass effect (visual only)
3. **Phase 3**: Gallery thumbnail overlay (visual only)
4. **Phase 4**: Create seller preview + trust components
5. **Phase 5**: Integrate into mobile-product-page.tsx
6. **Phase 6**: Test on device, adjust spacing

---

## Visual Reference

### Prototype Layout Flow (ListingDetail.tsx)

```
┌─────────────────────────────────┐
│  [Gallery - Full Bleed]         │
│  ├─ Back/Save/Share (floating)  │
│  ├─ Image Counter (bottom-right)│
│  └─ Thumbnails (bottom-left)    │
├─────────────────────────────────┤
│  €42,500 [Negotiable]           │
│  BMW 320d M Sport 2022...       │
│  📍 Bucharest • ⏰ 2d • 👁 1247  │
│  [Like New] [Cars]              │
├─────────────────────────────────┤
│  ┌─ SELLER CARD (inline) ─────┐ │
│  │ [Avatar] Name ✓    [Follow]│ │
│  │ ⭐ 4.9 (127 reviews)       │ │
│  │ Responds within 1 hour     │ │
│  │ ───────────────────────── │ │
│  │ 48 Listings | 127 Reviews  │ │
│  │ 2019 Member  [View Profile]│ │
│  └────────────────────────────┘ │
├─────────────────────────────────┤
│  ┌─ DESCRIPTION ──────────────┐ │
│  │ Beautiful BMW 320d...      │ │
│  └────────────────────────────┘ │
├─────────────────────────────────┤
│  🛡 Safety Tips                 │
│  Meet in public places...       │
├─────────────────────────────────┤
│  🚩 Report this listing         │
├─────────────────────────────────┤
│  Similar Items         [See all]│
│  ┌─────┐ ┌─────┐               │
│  │     │ │     │               │
│  └─────┘ └─────┘               │
├─────────────────────────────────┤
│  [Call]  [████ Message ████]   │ ← Glass sticky bar
└─────────────────────────────────┘
```

### Our Target Layout (Keep Tabs, Add Inline Elements)

```
┌─────────────────────────────────┐
│  [Gallery - Full Bleed]         │
│  ├─ Back/Wishlist (floating)    │
│  ├─ Image Counter (bottom-right)│
│  └─ Thumbnails (bottom-left) ←NEW
├─────────────────────────────────┤
│  [ INFO ]      [ SELLER ]       │ ← Keep our tabs
├─────────────────────────────────┤
│  [Category] [Time • Views]      │
│  Title                          │
│  €42,500 [Negotiable] ←NEW      │
│  [Condition] [Specs...]         │
├─────────────────────────────────┤
│  ┌─ SELLER PREVIEW (inline) ──┐ │ ← NEW
│  │ Compact seller card        │ │
│  │ [View Full Profile →]      │ │
│  └────────────────────────────┘ │
├─────────────────────────────────┤
│  Description                    │
│  Specs/Details                  │
├─────────────────────────────────┤
│  🛡 Safety Tips ←NEW            │
│  🚩 Report ←NEW                 │
├─────────────────────────────────┤
│  Similar Items ←NEW             │
│  ┌─────┐ ┌─────┐               │
│  └─────┘ └─────┘               │
├─────────────────────────────────┤
│  [Chat] [████ Add · €42 ████]  │ ← Glass effect
└─────────────────────────────────┘
```

---

## Notes for AI Implementation

1. **Keep our tab architecture** - don't remove the INFO/SELLER tabs, they provide depth
2. **Add inline seller preview** in INFO tab, not replace SELLER tab
3. **Use our existing components** where possible (UserAvatar, Button, Badge, ProductCard)
4. **Follow our naming conventions** - `mobile-*.tsx` for mobile-only components
5. **Use our semantic tokens** - don't hardcode colors, use `text-foreground`, `bg-card`, etc.
6. **Add translations** - everything user-visible needs i18n
7. **Test backdrop-blur** - may need fallback for older browsers

---

## Delete After Implementation

Once changes are complete and tested, delete:
- `temp-tradesphere-audit/` directory (the cloned prototype)
