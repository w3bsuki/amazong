# Mobile Product Page – Premium UI Polish Plan

> **Inspiration**: OLX Bulgaria / Treido mobile product detail page (see attached screenshots)
> **Goal**: Transform our mobile product page into a premium, high-trust marketplace experience matching the reference design.
> **Date**: 2026-01-08
> **Status**: 📋 Planning

---

## Executive Summary

The reference screenshots show a masterfully designed product page with:
- **Clean, minimal header** (Back arrow, Share, More menu only)
- **Full-bleed image gallery** with simple dot indicators
- **Clear visual hierarchy**: Title → Price → Location/Time → Trust badges → Seller → Details
- **Professional seller card** with avatar, rating, and "Виж профила" CTA
- **Clean key-value details** section with proper labels
- **Compact, professional bottom action bar** (Chat + Buy Now)
- **High information density** without clutter

Our current implementation has the structure but needs significant polish to match this reference.

---

## Current vs. Reference Comparison

| Aspect | Reference (OLX/Treido) | Our Current | Gap |
|--------|------------------------|-------------|-----|
| **Header** | Clean: ← Share ⋮ only | Has seller avatar, search, wishlist, cart | Too cluttered |
| **Gallery** | Edge-to-edge, minimal dots | Has navigation arrows, pill-shaped dots | Needs simplification |
| **Title** | Below image, clean single line | Below category badge | Order is good |
| **Price** | Large, bold "1250 лв." standalone | Has VAT text, savings sparkle | Needs simplification |
| **Location/Time** | Icon + "София · преди 2ч" | Not visible in current | Missing |
| **Buyer Protection** | Prominent trust badge with icon | Buried in trust block | Needs prominence |
| **Seller Card** | Full-width card with border, avatar, name, verified badge, rating (24), "Виж профила" button | Inline seller trust line | Needs card treatment |
| **Details Section** | Clean "Детайли" header with key-value list | Quick specs pills + accordions | Needs restructure |
| **Description** | Clean "Описание" section with "Още" expand | Inside accordion | Should be visible |
| **More from Seller** | Horizontal scroll row with header | Grid + section | Good, minor polish |
| **Bottom Bar** | 2 buttons: Chat (outline) + Купи сега (solid amber) | 3 elements: Heart + Add to Cart + Buy Now | Needs simplification |

---

## Phase 1: Header Simplification

### Current (`mobile-product-header.tsx`)
```tsx
// Current: Back + Seller Avatar/Name + Search + Share + Wishlist + Cart
// Reference: Back + Share + Menu (⋮)
```

### Target Design
- **Left**: Back arrow (→ home or history.back)
- **Right**: Share icon + More menu (⋮)
- **No**: Seller avatar, search, wishlist, cart in header

### Implementation

```tsx
// mobile-product-header.tsx - SIMPLIFIED
"use client"

import { ArrowLeft, Share2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MobileProductHeaderProps {
  productTitle?: string
}

export function MobileProductHeader({ productTitle }: MobileProductHeaderProps) {
  const router = useRouter()
  
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productTitle || document.title,
          url: window.location.href,
        })
      } catch { /* cancelled */ }
    }
  }

  return (
    <header className="fixed top-0 inset-x-0 z-60 h-12 bg-background flex items-center justify-between px-1 border-b border-border lg:hidden">
      {/* Left: Back */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="size-10 rounded-full"
      >
        <ArrowLeft className="size-5" strokeWidth={1.5} />
      </Button>
      
      {/* Right: Share + Menu */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="size-10 rounded-full"
        >
          <Share2 className="size-5" strokeWidth={1.5} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-10 rounded-full">
              <MoreHorizontal className="size-5" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report listing</DropdownMenuItem>
            <DropdownMenuItem>Save to wishlist</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
```

### Changes Summary
- Remove seller avatar from header
- Remove search button
- Remove wishlist heart
- Remove cart icon
- Add "More" dropdown menu
- Change header background to `bg-background` (white) instead of `bg-brand`

---

## Phase 2: Gallery Polish

### Reference Design
- Edge-to-edge (no padding, no rounded corners on mobile)
- Simple **solid circle dots** (not pill-shaped)
- No visible navigation arrows (swipe-only on mobile)
- Aspect ratio ~4:3 or square

### Target Changes
```tsx
// Gallery dots - SIMPLE SOLID CIRCLES
<div className="absolute bottom-3 left-0 right-0 z-10 lg:hidden flex justify-center gap-1.5">
  {images.map((_, index) => (
    <button 
      key={index}
      type="button"
      aria-label={`Image ${index + 1}`}
      onClick={() => api?.scrollTo(index)}
      className={cn(
        "size-2 rounded-full transition-colors",
        current === index 
          ? "bg-foreground" 
          : "bg-foreground/30"
      )}
    />
  ))}
</div>
```

### Implementation Notes
- Remove the prev/next arrow buttons on mobile (keep swipe + dots)
- Make dots smaller and simpler (8px solid circles)
- Keep `aspect-[4/3]` ratio for mobile
- Ensure edge-to-edge (no px-3 wrapper)

---

## Phase 3: Price + Location Block

### Reference Design
```
Apple iPhone 13 Pro Max - 256GB - Graphite          ♡
1250 лв.
📍 София · преди 2ч
```

### New Component: `MobilePriceLocationBlock`

```tsx
// mobile-price-location-block.tsx - NEW COMPONENT
"use client"

import { useLocale } from "next-intl"
import { MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface MobilePriceLocationBlockProps {
  price: number
  currency?: string
  location?: string
  createdAt?: string | Date
  onWishlistToggle?: () => void
  isWishlisted?: boolean
}

export function MobilePriceLocationBlock({
  price,
  currency = "BGN", // Reference uses лв. (BGN)
  location,
  createdAt,
  onWishlistToggle,
  isWishlisted = false,
}: MobilePriceLocationBlockProps) {
  const locale = useLocale()

  const formatPrice = (p: number) =>
    new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(p)

  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
        locale: locale === "bg" ? bg : enUS,
      })
    : null

  return (
    <div className="space-y-1">
      {/* Price Row with Wishlist */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-foreground">
          {formatPrice(price)}
        </span>
        {onWishlistToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onWishlistToggle}
            className="size-10 rounded-full -mr-2"
          >
            <Heart 
              className={cn(
                "size-6",
                isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
              )} 
              strokeWidth={1.5} 
            />
          </Button>
        )}
      </div>

      {/* Location + Time */}
      {(location || timeAgo) && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" strokeWidth={1.5} />
          <span>
            {location}
            {location && timeAgo && " · "}
            {timeAgo}
          </span>
        </div>
      )}
    </div>
  )
}
```

---

## Phase 4: Buyer Protection Badge

### Reference Design
```
┌──────────────────────────────────────────────┐
│ ✓ Защита на купувача                         │
│   Преглед и тест преди плащане. Сигурна...   │
└──────────────────────────────────────────────┘
```

### New Component: `MobileBuyerProtectionBadge`

```tsx
// mobile-buyer-protection-badge.tsx - NEW COMPONENT
"use client"

import { CheckCircle2 } from "lucide-react"

interface MobileBuyerProtectionBadgeProps {
  locale?: string
}

export function MobileBuyerProtectionBadge({ 
  locale = "en" 
}: MobileBuyerProtectionBadgeProps) {
  const t = {
    title: locale === "bg" ? "Защита на купувача" : "Buyer Protection",
    subtitle: locale === "bg" 
      ? "Преглед и тест преди плащане. Сигурна доставка."
      : "Inspect and test before payment. Secure delivery.",
  }

  return (
    <div className="flex items-start gap-3 p-3 border border-border rounded-lg bg-background">
      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <CheckCircle2 className="size-5 text-primary" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{t.title}</p>
        <p className="text-xs text-muted-foreground leading-snug">{t.subtitle}</p>
      </div>
    </div>
  )
}
```

---

## Phase 5: Seller Profile Card

### Reference Design
```
┌──────────────────────────────────────────────┐
│ [Avatar]  Иван Петров ✓     │ Виж профила │  │
│           ★ 4.9 (24)                         │
└──────────────────────────────────────────────┘
```

### Enhanced Component: `MobileSellerCard`

```tsx
// mobile-seller-card.tsx - NEW COMPONENT (replaces MobileSellerTrustLine)
"use client"

import { Star, ShieldCheck } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { safeAvatarSrc } from "@/lib/utils"

interface MobileSellerCardProps {
  name: string
  username?: string
  avatarUrl?: string
  rating?: number | null
  reviewCount?: number | null
  isVerified?: boolean
  locale?: string
}

export function MobileSellerCard({
  name,
  username,
  avatarUrl,
  rating,
  reviewCount,
  isVerified,
  locale = "en",
}: MobileSellerCardProps) {
  const t = {
    viewProfile: locale === "bg" ? "Виж профила" : "View Profile",
  }

  const href = username ? `/${username}` : "#"
  const hasRating = rating != null && rating > 0

  return (
    <div className="border border-border rounded-lg bg-background p-3">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <Link href={href}>
          <Avatar className="size-12 border-2 border-border">
            <AvatarImage src={safeAvatarSrc(avatarUrl)} alt={name} />
            <AvatarFallback className="text-sm font-semibold bg-muted">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link href={href} className="text-sm font-semibold text-foreground hover:underline truncate">
              {name}
            </Link>
            {isVerified && (
              <ShieldCheck className="size-4 text-primary shrink-0" strokeWidth={2} />
            )}
          </div>
          
          {hasRating && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-foreground">
                {typeof rating === "number" ? rating.toFixed(1) : rating}
              </span>
              {reviewCount != null && reviewCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 px-3 rounded-md shrink-0"
        >
          <Link href={href}>
            {t.viewProfile}
          </Link>
        </Button>
      </div>
    </div>
  )
}
```

---

## Phase 6: Details Section

### Reference Design
```
Детайли
─────────────────────────────
Състояние        Използвано
Марка            Apple
Цвят             Graphite
Памет            256GB
Доставка         Еконт / Спиди
```

### Enhanced Component: `MobileDetailsSection`

```tsx
// mobile-details-section.tsx - NEW COMPONENT
"use client"

interface DetailItem {
  label: string
  value: string
}

interface MobileDetailsSectionProps {
  details: DetailItem[]
  locale?: string
}

export function MobileDetailsSection({
  details,
  locale = "en",
}: MobileDetailsSectionProps) {
  const t = {
    title: locale === "bg" ? "Детайли" : "Details",
  }

  if (!details || details.length === 0) return null

  return (
    <div className="border-t border-border">
      <h3 className="text-base font-semibold text-foreground px-3 py-3">
        {t.title}
      </h3>
      <div className="divide-y divide-border">
        {details.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between px-3 py-2.5"
          >
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-medium text-foreground text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Phase 7: Description Section

### Reference Design
```
Описание
─────────────────────────────
Продавам телефона, защото си взех по-нов модел.
Работи перфектно, без драскотини по екрана. Винаги е
носен с калъф и протектор.
                                              [Още]
```

### Enhanced Component: `MobileDescriptionSection`

```tsx
// mobile-description-section.tsx - NEW COMPONENT
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileDescriptionSectionProps {
  description: string
  maxLines?: number
  locale?: string
}

export function MobileDescriptionSection({
  description,
  maxLines = 4,
  locale = "en",
}: MobileDescriptionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const t = {
    title: locale === "bg" ? "Описание" : "Description",
    showMore: locale === "bg" ? "Още" : "More",
    showLess: locale === "bg" ? "По-малко" : "Less",
  }

  if (!description) return null

  return (
    <div className="border-t border-border">
      <h3 className="text-base font-semibold text-foreground px-3 py-3">
        {t.title}
      </h3>
      <div className="px-3 pb-3">
        <p 
          className={cn(
            "text-sm text-foreground leading-relaxed whitespace-pre-wrap",
            !isExpanded && "line-clamp-4"
          )}
        >
          {description}
        </p>
        {description.length > 200 && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-auto p-0 mt-1 text-primary font-medium"
          >
            {isExpanded ? t.showLess : t.showMore}
          </Button>
        )}
      </div>
    </div>
  )
}
```

---

## Phase 8: Bottom Action Bar

### Reference Design
```
┌────────────────────────────────────────────────┐
│  [○ Чат]              [████ Купи сега ████]    │
└────────────────────────────────────────────────┘
```

- Two buttons only: Chat (outline) + Buy Now (solid amber/primary)
- Compact height (~42-48px buttons)
- Safe area padding at bottom

### Enhanced Component: `MobileBottomBar`

```tsx
// mobile-bottom-bar.tsx - SIMPLIFIED
"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "next-intl"

interface MobileBottomBarProps {
  onChat?: () => void
  onBuyNow?: () => void
  isOutOfStock?: boolean
  sellerUsername?: string
}

export function MobileBottomBar({
  onChat,
  onBuyNow,
  isOutOfStock = false,
}: MobileBottomBarProps) {
  const locale = useLocale()

  const t = {
    chat: locale === "bg" ? "Чат" : "Chat",
    buyNow: locale === "bg" ? "Купи сега" : "Buy Now",
    soldOut: locale === "bg" ? "Изчерпано" : "Sold Out",
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background lg:hidden">
      <div className="flex items-center gap-2 px-3 py-2 pb-safe">
        {/* Chat Button */}
        <Button
          variant="outline"
          onClick={onChat}
          className="flex-1 h-11 rounded-lg border-border text-foreground font-medium gap-2"
        >
          <MessageCircle className="size-5" strokeWidth={1.5} />
          {t.chat}
        </Button>

        {/* Buy Now Button */}
        <Button
          onClick={onBuyNow}
          disabled={isOutOfStock}
          className="flex-1 h-11 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold"
        >
          {isOutOfStock ? t.soldOut : t.buyNow}
        </Button>
      </div>
    </div>
  )
}
```

---

## Phase 9: More from Seller Section

### Reference Design
```
Още от Иван                    [Виж всички]
┌────┐ ┌────┐ ┌────┐ ┌────┐
│    │ │    │ │    │ │    │  ← Horizontal scroll
└────┘ └────┘ └────┘ └────┘
```

### Changes to `SellerProductsGrid`
- Add horizontal scroll variant for mobile
- Add "View all" link to seller profile
- Use card style matching reference

---

## Phase 10: Full Layout Restructure

### New Mobile Product Page Order

```tsx
// mobile-product-page.tsx - NEW STRUCTURE
return (
  <div className="min-h-screen bg-background pb-20 pt-12 lg:hidden">
    {/* 1. Header (simplified) */}
    <MobileProductHeader productTitle={product.title} />

    {/* 2. Gallery (edge-to-edge) */}
    <ProductGalleryHybrid images={viewModel.galleryImages} />

    {/* 3. Title */}
    <div className="px-3 pt-3">
      <h1 className="text-base font-semibold text-foreground leading-snug">
        {product.title}
      </h1>
    </div>

    {/* 4. Price + Wishlist + Location/Time */}
    <div className="px-3 pt-2">
      <MobilePriceLocationBlock
        price={displayPrice}
        currency="BGN"
        location={product.location || "София"}
        createdAt={product.created_at}
        onWishlistToggle={handleWishlist}
        isWishlisted={isInWishlist}
      />
    </div>

    {/* 5. Buyer Protection Badge */}
    <div className="px-3 pt-3">
      <MobileBuyerProtectionBadge locale={locale} />
    </div>

    {/* 6. Seller Card */}
    <div className="px-3 pt-3">
      <MobileSellerCard
        name={sellerInfo.name}
        username={sellerInfo.username}
        avatarUrl={sellerInfo.avatarUrl}
        rating={sellerInfo.rating}
        reviewCount={product.seller_stats?.total_reviews}
        isVerified={sellerInfo.verified}
        locale={locale}
      />
    </div>

    {/* 7. Details Section */}
    <div className="mt-3">
      <MobileDetailsSection
        details={viewModel.itemSpecifics.details || []}
        locale={locale}
      />
    </div>

    {/* 8. Description Section */}
    <MobileDescriptionSection
      description={product.description || ""}
      locale={locale}
    />

    {/* 9. More from Seller */}
    {relatedProducts.length > 0 && (
      <div className="mt-3 border-t border-border">
        <SellerProductsGrid
          products={relatedProducts}
          sellerUsername={username}
          variant="horizontal" // New prop for mobile scroll
        />
      </div>
    )}

    {/* 10. Reviews (if any) */}
    {reviews.length > 0 && (
      <div className="px-3 mt-3">
        <CustomerReviewsHybrid
          rating={Number(product.rating ?? 0)}
          reviewCount={Number(product.review_count ?? 0)}
          reviews={reviews}
          productId={product.id}
          productTitle={product.title}
          locale={locale}
        />
      </div>
    )}

    {/* 11. Bottom Action Bar */}
    <MobileBottomBar
      onChat={() => router.push(`/chat/${sellerInfo.username}`)}
      onBuyNow={handleBuyNow}
      isOutOfStock={stockStatus === "out_of_stock"}
      sellerUsername={sellerInfo.username}
    />
  </div>
)
```

---

## Implementation Checklist

### Priority 1 (Critical Visual Impact)
- [ ] Simplify header (remove clutter)
- [ ] Simplify gallery dots (solid circles)
- [ ] Remove gallery arrows on mobile
- [ ] Add price + location block
- [ ] Simplify bottom bar (2 buttons)

### Priority 2 (Structure)
- [ ] Add buyer protection badge
- [ ] Create proper seller card
- [ ] Restructure details as key-value list
- [ ] Add visible description section

### Priority 3 (Polish)
- [ ] More from seller horizontal scroll
- [ ] Proper spacing adjustments
- [ ] Border/divider consistency
- [ ] Animation removal audit

---

## Design Tokens to Add

```css
/* In globals.css @theme block */
--color-cta-chat: oklch(0.15 0 0);          /* Dark outline for chat */
--color-cta-buy: oklch(0.65 0.16 85);       /* Amber for Buy Now */
--color-cta-buy-hover: oklch(0.58 0.18 85);
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `components/mobile/product/mobile-product-header.tsx` | Simplify to back + share + menu |
| `components/mobile/product/mobile-product-page.tsx` | Full restructure |
| `components/mobile/product/mobile-sticky-bar-enhanced.tsx` | Rename to mobile-bottom-bar, simplify |
| `components/shared/product/product-gallery-hybrid.tsx` | Simplify dots, remove arrows |
| `components/mobile/product/mobile-price-block.tsx` | Replace with MobilePriceLocationBlock |
| `components/mobile/product/mobile-seller-trust-line.tsx` | Replace with MobileSellerCard |
| `components/mobile/product/mobile-trust-block.tsx` | Replace with MobileBuyerProtectionBadge |
| `components/mobile/product/mobile-quick-specs.tsx` | Replace with MobileDetailsSection |

### New Files to Create
- `components/mobile/product/mobile-price-location-block.tsx`
- `components/mobile/product/mobile-buyer-protection-badge.tsx`
- `components/mobile/product/mobile-seller-card.tsx`
- `components/mobile/product/mobile-details-section.tsx`
- `components/mobile/product/mobile-description-section.tsx`
- `components/mobile/product/mobile-bottom-bar.tsx`

---

## Verification Gates

After each phase:
```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## Reference Screenshots Analysis

### Screenshot 1 (Top Half)
- **Header**: Transparent/white with back arrow (left), share + menu (right)
- **Gallery**: Full-width, 4:3 aspect, no visible borders
- **Dots**: Small solid circles, current = dark, others = light gray
- **Title**: Bold, single line with heart icon right-aligned
- **Price**: Large bold "1250 лв." without any VAT text
- **Location**: "📍 София · преди 2ч" in muted gray
- **Trust Badge**: Full-width card with checkmark icon

### Screenshot 2 (Bottom Half)
- **Seller Card**: Bordered card with avatar, name, verified badge, rating, and "Виж профила" button
- **Details**: Clean key-value list with dividers
- **Description**: Visible section (not hidden in accordion)
- **More Products**: Horizontal scroll row
- **Bottom Bar**: Fixed, two buttons (Chat outline, Buy Now solid amber)

---

## Key Principles Applied

1. **"Invisible Utility"** - UI should be tool-like, not decorative
2. **No Scale Animations** - Use `active:opacity-70` not `active:scale-95`
3. **No Gradients** - Solid colors only
4. **Tight Gaps** - `gap-2` default
5. **Compact Touch Targets** - 40-44px button heights
6. **Border Separation** - Use `border-border` not shadows
7. **High Information Density** - Show more, scroll less

---

## Estimated Effort

| Phase | Files | LOC Change | Time |
|-------|-------|------------|------|
| 1. Header | 1 | -50 | 30min |
| 2. Gallery | 1 | -20 | 20min |
| 3. Price Block | 1 new | +60 | 30min |
| 4. Trust Badge | 1 new | +40 | 20min |
| 5. Seller Card | 1 new | +70 | 30min |
| 6. Details | 1 new | +50 | 20min |
| 7. Description | 1 new | +50 | 20min |
| 8. Bottom Bar | 1 | -30 | 20min |
| 9. More Seller | 1 | +30 | 20min |
| 10. Full Layout | 1 | ±100 | 45min |

**Total: ~4-5 hours of focused work**

---

## Success Metrics

After implementation, the mobile product page should:
- ✅ Match visual hierarchy of reference design
- ✅ Have cleaner header with fewer icons
- ✅ Show price + location prominently
- ✅ Display buyer protection badge clearly
- ✅ Show seller as a proper card (not inline strip)
- ✅ Have readable details section (not pills)
- ✅ Have simplified 2-button bottom bar
- ✅ Pass all E2E smoke tests
- ✅ Have no TypeScript errors

---

## Visual Diff Summary

```
BEFORE (Current):
┌──────────────────────────────────────────┐
│ ← [Avatar] [Name] | 🔍 ↗ ♡ 🛒           │  ← Too many icons
├──────────────────────────────────────────┤
│                                          │
│            [ PRODUCT IMAGE ]             │
│        ◄                      ►          │  ← Arrows visible
│           ●━━●━━●━━●                     │  ← Pill-shaped dots
│                                          │
├──────────────────────────────────────────┤
│ [Category Badge]                         │
│ Product Title Line 1                     │
│ Product Title Line 2                     │
├──────────────────────────────────────────┤
│ €45.00 incl. VAT                         │
│ ✨ You save €10.00                        │
├──────────────────────────────────────────┤
│ [Seller Strip with colored background]   │
├──────────────────────────────────────────┤
│ [Quick Specs Pills scrolling]            │
├──────────────────────────────────────────┤
│ [Accordions - Description hidden]        │
├──────────────────────────────────────────┤
│ [Trust icons grid]                       │
├──────────────────────────────────────────┤
│ [♡]    [Add to Cart]    [Buy Now]       │  ← 3 elements
└──────────────────────────────────────────┘

AFTER (Target):
┌──────────────────────────────────────────┐
│ ←                             ↗  ⋯       │  ← Clean: Back + Share + Menu
├──────────────────────────────────────────┤
│                                          │
│            [ PRODUCT IMAGE ]             │
│                                          │
│               ● ○ ○ ○                    │  ← Simple solid dots
│                                          │
├──────────────────────────────────────────┤
│ Product Title                         ♡  │
├──────────────────────────────────────────┤
│ 1250 лв.                                 │  ← Big, bold, no VAT text
│ 📍 София · преди 2ч                      │  ← Location + time
├──────────────────────────────────────────┤
│ ✓ Защита на купувача                     │
│   Преглед и тест преди плащане...        │
├──────────────────────────────────────────┤
│ [●] Иван Петров ✓          [Виж профила] │
│     ★ 4.9 (24)                           │
├──────────────────────────────────────────┤
│ Детайли                                  │
│ ─────────────────────────────            │
│ Състояние          Използвано            │
│ Марка              Apple                 │
│ Цвят               Graphite              │
├──────────────────────────────────────────┤
│ Описание                                 │
│ ─────────────────────────────            │
│ Продавам телефона, защото...      [Още]  │
├──────────────────────────────────────────┤
│ Още от Иван              [Виж всички →]  │
│ [□] [□] [□] [□]        ← Horizontal      │
├──────────────────────────────────────────┤
│  [○ Чат]         [████ Купи сега ████]   │  ← 2 buttons only
└──────────────────────────────────────────┘
```

---

## Next Steps

1. Review this plan with the team
2. Start with Phase 1 (Header) as it's the most visible change
3. Implement phases in order, verifying after each
4. Keep each PR small (1-3 files max)
5. Run verification gates after each phase
