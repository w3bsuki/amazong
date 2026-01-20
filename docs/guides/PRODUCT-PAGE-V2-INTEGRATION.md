# Product Page V2 Integration Guide

> **Status:** Ready for Implementation  
> **Demo Source:** `app/[locale]/demo/product-adaptive/`  
> **Target Route:** `app/[locale]/[username]/[productSlug]/`  
> **Estimated Effort:** 3-4 sessions

---

## Executive Summary

This guide walks through integrating the V2 category-adaptive product page design from our demo into the main Treido production route. The demo components prove:

- **Desktop:** 55/45 split, horizontal thumbnails below hero, sticky buy box, seller card inside buy box
- **Mobile:** Sticky bottom bar with price + dual CTAs, horizontal thumbnail strip, tabs for Specs/Description
- **Category-Adaptive:** Hero specs (4-pill grid) that change per category (electronics shows Screen/Storage/Battery; automotive shows Mileage/Engine/Fuel)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [File Structure](#2-file-structure)
3. [Step 1: Create Hero Specs System](#step-1-create-hero-specs-system)
4. [Step 2: Modularize Desktop Components](#step-2-modularize-desktop-components)
5. [Step 3: Modularize Mobile Components](#step-3-modularize-mobile-components)
6. [Step 4: Update Product Page Layout](#step-4-update-product-page-layout)
7. [Step 5: Wire Up Category-Adaptive Logic](#step-5-wire-up-category-adaptive-logic)
8. [Step 6: Styling Compliance](#step-6-styling-compliance)
9. [Verification Gates](#verification-gates)
10. [Rollback Plan](#rollback-plan)

---

## 1. Architecture Overview

### Current State (Main Project)

```
app/[locale]/[username]/[productSlug]/page.tsx
    ↓ renders
components/shared/product/product-page-layout.tsx
    ├── MobileProductPage (components/mobile/product/)
    │   └── 14 mobile-specific components
    └── Desktop inline JSX (7-col gallery + 5-col buy box)
```

### Target State (After Integration)

```
app/[locale]/[username]/[productSlug]/page.tsx
    ↓ renders
components/shared/product/product-page-layout.tsx
    ├── ProductPageMobile (refactored V2)
    │   ├── MobileGallery (horizontal strip)
    │   ├── MobileHeroSpecs (category-adaptive 4-pill)
    │   ├── MobileProductInfo (title + badges + meta)
    │   ├── MobileSellerCard (existing, enhanced)
    │   ├── MobileBottomBar (dual CTA, category-adaptive)
    │   └── MobileSpecsTabs (Specs/Description tabs)
    └── ProductPageDesktop (refactored V2)
        ├── DesktopGallery (55% width, horizontal thumbs)
        ├── DesktopHeroSpecs (category-adaptive 4-pill)
        ├── DesktopProductInfo (breadcrumb + title + tags)
        ├── DesktopBuyBox (sticky, seller inside)
        └── DesktopSpecsAccordion (expandable details)
```

---

## 2. File Structure

Create these new files during integration:

```
components/
├── shared/
│   └── product/
│       ├── hero-specs.tsx              # NEW: Category-adaptive spec pills
│       ├── hero-specs-config.ts        # NEW: Category → spec mapping
│       ├── product-page-desktop-v2.tsx # NEW: V2 desktop layout
│       └── product-page-mobile-v2.tsx  # NEW: V2 mobile layout
│
├── desktop/
│   └── product/
│       ├── desktop-gallery-v2.tsx      # NEW: 55/45 split + horizontal thumbs
│       ├── desktop-buy-box-v2.tsx      # NEW: Sticky box with seller inside
│       └── desktop-specs-accordion.tsx # NEW: Expandable specifications
│
└── mobile/
    └── product/
        ├── mobile-gallery-v2.tsx       # REFACTOR: Edge-to-edge + horizontal strip
        ├── mobile-hero-specs.tsx       # NEW: 4-pill category-adaptive grid
        ├── mobile-specs-tabs.tsx       # NEW: Specs/Description tabs
        └── mobile-bottom-bar-v2.tsx    # REFACTOR: Category-adaptive CTAs
```

---

## 3. Step 1: Create Hero Specs System

The hero specs system determines which 4 attributes to prominently display based on category.

### 3.1 Create the Config File

```typescript
// components/shared/product/hero-specs-config.ts

export type HeroSpecKey = 
  | 'brand' | 'size' | 'color' | 'condition' | 'material'  // Universal
  | 'screen_size' | 'storage' | 'battery' | 'camera' | 'processor' | 'ram'  // Electronics
  | 'mileage' | 'engine' | 'fuel_type' | 'transmission' | 'year' | 'body_type'  // Automotive
  | 'bedrooms' | 'bathrooms' | 'area_sqm' | 'floor' | 'year_built'  // Real Estate
  | 'author' | 'publisher' | 'pages' | 'isbn'  // Books

export interface HeroSpecConfig {
  /** Attribute key from product.attributes */
  key: HeroSpecKey
  /** Display label (use i18n key in production) */
  label: string
  /** Optional unit suffix (m², km, etc.) */
  unit?: string
  /** Priority (lower = shown first) */
  priority: number
}

/**
 * Maps L0 category slugs to their hero spec configurations.
 * First 4 specs by priority are displayed in the hero grid.
 */
export const CATEGORY_HERO_SPECS: Record<string, HeroSpecConfig[]> = {
  // Electronics & Tech
  'electronics': [
    { key: 'screen_size', label: 'Screen', priority: 1 },
    { key: 'storage', label: 'Storage', priority: 2 },
    { key: 'battery', label: 'Battery', priority: 3 },
    { key: 'camera', label: 'Camera', priority: 4 },
    { key: 'processor', label: 'Processor', priority: 5 },
    { key: 'ram', label: 'RAM', priority: 6 },
    { key: 'condition', label: 'Condition', priority: 10 },
  ],
  
  // Automotive (Cars, Motorcycles, Parts)
  'automotive': [
    { key: 'mileage', label: 'Mileage', unit: 'km', priority: 1 },
    { key: 'engine', label: 'Engine', priority: 2 },
    { key: 'fuel_type', label: 'Fuel', priority: 3 },
    { key: 'transmission', label: 'Transmission', priority: 4 },
    { key: 'year', label: 'Year', priority: 5 },
    { key: 'body_type', label: 'Body', priority: 6 },
  ],
  
  // Fashion & Apparel
  'fashion': [
    { key: 'size', label: 'Size', priority: 1 },
    { key: 'brand', label: 'Brand', priority: 2 },
    { key: 'material', label: 'Material', priority: 3 },
    { key: 'condition', label: 'Condition', priority: 4 },
    { key: 'color', label: 'Color', priority: 5 },
  ],
  'fashion-womens': [
    { key: 'size', label: 'Size', priority: 1 },
    { key: 'brand', label: 'Brand', priority: 2 },
    { key: 'material', label: 'Material', priority: 3 },
    { key: 'condition', label: 'Condition', priority: 4 },
  ],
  'fashion-mens': [
    { key: 'size', label: 'Size', priority: 1 },
    { key: 'brand', label: 'Brand', priority: 2 },
    { key: 'material', label: 'Material', priority: 3 },
    { key: 'condition', label: 'Condition', priority: 4 },
  ],
  
  // Real Estate
  'real-estate': [
    { key: 'bedrooms', label: 'Beds', priority: 1 },
    { key: 'area_sqm', label: 'Area', unit: 'm²', priority: 2 },
    { key: 'year_built', label: 'Built', priority: 3 },
    { key: 'floor', label: 'Floor', priority: 4 },
    { key: 'bathrooms', label: 'Baths', priority: 5 },
  ],
  
  // Books & Media
  'books': [
    { key: 'author', label: 'Author', priority: 1 },
    { key: 'publisher', label: 'Publisher', priority: 2 },
    { key: 'pages', label: 'Pages', priority: 3 },
    { key: 'condition', label: 'Condition', priority: 4 },
  ],
  
  // Default fallback (universal attributes)
  'default': [
    { key: 'brand', label: 'Brand', priority: 1 },
    { key: 'condition', label: 'Condition', priority: 2 },
    { key: 'size', label: 'Size', priority: 3 },
    { key: 'color', label: 'Color', priority: 4 },
  ],
}

/**
 * Get hero specs for a category, falling back to parent or default.
 */
export function getHeroSpecsForCategory(
  categorySlug: string | null,
  parentSlug: string | null
): HeroSpecConfig[] {
  // Try exact match first
  if (categorySlug && CATEGORY_HERO_SPECS[categorySlug]) {
    return CATEGORY_HERO_SPECS[categorySlug]
  }
  // Try parent category
  if (parentSlug && CATEGORY_HERO_SPECS[parentSlug]) {
    return CATEGORY_HERO_SPECS[parentSlug]
  }
  // Fallback to default
  return CATEGORY_HERO_SPECS['default']
}
```

### 3.2 Create the Hero Specs Component

```typescript
// components/shared/product/hero-specs.tsx
"use client"

import { cn } from "@/lib/utils"
import { getHeroSpecsForCategory, type HeroSpecConfig } from "./hero-specs-config"

interface HeroSpecsProps {
  /** Product attributes from DB */
  attributes: Record<string, unknown> | null
  /** Current category slug */
  categorySlug: string | null
  /** Parent category slug (for fallback) */
  parentSlug: string | null
  /** Max specs to show (default: 4) */
  maxSpecs?: number
  /** Layout variant */
  variant?: "desktop" | "mobile"
  className?: string
}

export function HeroSpecs({
  attributes,
  categorySlug,
  parentSlug,
  maxSpecs = 4,
  variant = "desktop",
  className,
}: HeroSpecsProps) {
  const specConfigs = getHeroSpecsForCategory(categorySlug, parentSlug)
  
  // Build display specs from attributes
  const specs = specConfigs
    .map((config) => {
      const rawValue = attributes?.[config.key]
      if (rawValue == null || rawValue === "") return null
      
      const value = config.unit 
        ? `${rawValue} ${config.unit}`
        : String(rawValue)
      
      return {
        label: config.label,
        value,
        priority: config.priority,
      }
    })
    .filter(Boolean)
    .slice(0, maxSpecs)
  
  if (specs.length === 0) return null
  
  const isMobile = variant === "mobile"
  
  return (
    <div
      className={cn(
        "grid gap-2",
        isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {specs.map((spec) => (
        <div
          key={spec!.label}
          className={cn(
            "flex items-center justify-between rounded-lg bg-muted/50 border border-border/50",
            isMobile ? "px-3 py-2" : "px-4 py-3"
          )}
        >
          <span className="text-xs text-muted-foreground">{spec!.label}</span>
          <span className={cn(
            "font-semibold text-foreground",
            isMobile ? "text-sm" : "text-base"
          )}>
            {spec!.value}
          </span>
        </div>
      ))}
    </div>
  )
}
```

---

## 4. Step 2: Modularize Desktop Components

### 4.1 Desktop Gallery V2

Reference: `demo/product-adaptive/_components/product-page-desktop.tsx` → `ProductGallery`

Key changes from current:
- 55% width (not 58%)
- Horizontal thumbnail strip below hero (not vertical sidebar)
- Image counter overlay
- Lightbox on click

```typescript
// components/desktop/product/desktop-gallery-v2.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { GalleryImage } from "@/lib/view-models/product-page"

interface DesktopGalleryV2Props {
  images: GalleryImage[]
  className?: string
}

export function DesktopGalleryV2({ images, className }: DesktopGalleryV2Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  
  const activeImage = images[activeIndex] ?? images[0]
  
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Hero Image */}
      <div 
        className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-zoom-in"
        onClick={() => setLightboxOpen(true)}
      >
        {activeImage && (
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        )}
        {/* Image counter */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium">
          {activeIndex + 1}/{images.length}
        </div>
      </div>
      
      {/* Horizontal Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {images.map((image, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "flex-shrink-0 size-16 rounded-md overflow-hidden transition-all",
              i === activeIndex 
                ? "ring-2 ring-foreground ring-offset-2" 
                : "opacity-60 hover:opacity-100"
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={64}
              height={64}
              className="object-cover size-full"
            />
          </button>
        ))}
      </div>
      
      {/* Lightbox (simplified - use your existing lightbox component) */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <Image
            src={activeImage?.src ?? ""}
            alt={activeImage?.alt ?? ""}
            width={1200}
            height={1200}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  )
}
```

### 4.2 Desktop Buy Box V2

Reference: `demo/product-adaptive/_components/product-page-desktop.tsx` → `BuyBox`

Key changes:
- Seller card embedded inside (not separate component)
- Category-adaptive primary CTA (Buy Now / Contact Agent / Test Drive)
- Shipping/returns section at bottom

```typescript
// components/desktop/product/desktop-buy-box-v2.tsx
"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { Heart, MessageCircle, ShoppingCart, Truck, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DesktopBuyBoxV2Props {
  productId: string
  title: string
  price: number
  originalPrice?: number | null
  currency?: string
  condition?: string
  seller: {
    name: string
    avatar?: string
    rating?: number
    reviews?: number
    verified?: boolean
  }
  /** Category type affects CTA labels */
  categoryType?: "default" | "automotive" | "real-estate"
  freeShipping?: boolean
  className?: string
}

export function DesktopBuyBoxV2({
  productId,
  title,
  price,
  originalPrice,
  currency = "EUR",
  condition,
  seller,
  categoryType = "default",
  freeShipping,
  className,
}: DesktopBuyBoxV2Props) {
  const t = useTranslations("Product")
  
  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0
  
  // Category-adaptive CTAs
  const getPrimaryCTA = () => {
    switch (categoryType) {
      case "real-estate": return { label: t("contactAgent"), icon: MessageCircle }
      case "automotive": return { label: t("contactSeller"), icon: MessageCircle }
      default: return { label: t("buyNow"), icon: ShoppingCart }
    }
  }
  
  const getSecondaryCTA = () => {
    switch (categoryType) {
      case "real-estate": return t("scheduleVisit")
      case "automotive": return t("testDrive")
      default: return t("addToCart")
    }
  }
  
  const primaryCTA = getPrimaryCTA()
  
  return (
    <div className={cn(
      "sticky top-24 rounded-lg border border-border bg-card p-4 space-y-4",
      className
    )}>
      {/* Price Block */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-bold text-foreground">
            €{price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                €{originalPrice.toLocaleString()}
              </span>
              <span className="px-2 py-0.5 rounded bg-destructive/10 text-destructive text-sm font-semibold">
                -{discount}%
              </span>
            </>
          )}
        </div>
        {condition && (
          <span className="inline-block px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
            {condition}
          </span>
        )}
      </div>
      
      {/* Seller Card (embedded) */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
        <div className="relative size-12 rounded-full overflow-hidden bg-muted">
          {seller.avatar ? (
            <Image 
              src={seller.avatar} 
              alt={seller.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="size-full flex items-center justify-center text-muted-foreground font-semibold">
              {seller.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          {seller.verified && (
            <span className="absolute -bottom-0.5 -right-0.5 size-4 bg-verified rounded-full flex items-center justify-center">
              <svg className="size-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground truncate">{seller.name}</div>
          {seller.rating && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="text-rating">★</span>
              <span className="font-medium">{seller.rating}</span>
              {seller.reviews && <span>· {seller.reviews} reviews</span>}
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" className="size-9">
          <MessageCircle className="size-4" />
        </Button>
      </div>
      
      {/* CTAs */}
      <div className="space-y-2">
        <Button className="w-full h-12 text-base font-bold rounded-lg" size="lg">
          <primaryCTA.icon className="mr-2 size-5" />
          {primaryCTA.label}
        </Button>
        <Button variant="outline" className="w-full h-10 font-semibold rounded-lg">
          {getSecondaryCTA()}
        </Button>
        <Button variant="ghost" className="w-full h-9 text-muted-foreground">
          <Heart className="mr-2 size-4" />
          {t("addToWatchlist")}
        </Button>
      </div>
      
      {/* Shipping & Returns */}
      <div className="space-y-2 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 text-sm">
          <Truck className={cn("size-4", freeShipping ? "text-shipping-free" : "text-muted-foreground")} />
          <span className={freeShipping ? "text-shipping-free font-medium" : "text-muted-foreground"}>
            {freeShipping ? t("freeShipping") : t("shippingCalculated")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RotateCcw className="size-4" />
          <span>{t("returns30Days")}</span>
        </div>
      </div>
    </div>
  )
}
```

---

## 5. Step 3: Modularize Mobile Components

### 5.1 Mobile Gallery V2

Update existing `mobile-gallery-olx.tsx` or create new:
- Edge-to-edge hero image
- Horizontal thumbnail strip below (not dots)
- Swipe gesture support

### 5.2 Mobile Specs Tabs

New component for Specs/Description tabs:

```typescript
// components/mobile/product/mobile-specs-tabs.tsx
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ItemSpecificDetail } from "@/lib/view-models/product-page"

interface MobileSpecsTabsProps {
  specifications: ItemSpecificDetail[]
  description: string | null
}

export function MobileSpecsTabs({ specifications, description }: MobileSpecsTabsProps) {
  const [tab, setTab] = useState<"specs" | "desc">("specs")
  
  return (
    <div className="bg-card border-t border-border">
      {/* Tab Headers */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setTab("specs")}
          className={cn(
            "flex-1 py-3 text-sm font-semibold relative",
            tab === "specs" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Specifications
          {tab === "specs" && (
            <span className="absolute bottom-0 inset-x-4 h-0.5 bg-foreground rounded-full" />
          )}
        </button>
        <button
          onClick={() => setTab("desc")}
          className={cn(
            "flex-1 py-3 text-sm font-semibold relative",
            tab === "desc" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Description
          {tab === "desc" && (
            <span className="absolute bottom-0 inset-x-4 h-0.5 bg-foreground rounded-full" />
          )}
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        {tab === "specs" ? (
          <div className="space-y-2">
            {specifications.map((spec) => (
              <div key={spec.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{spec.label}</span>
                <span className="font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {description || "No description provided."}
          </p>
        )}
      </div>
    </div>
  )
}
```

### 5.3 Mobile Bottom Bar V2

Update `mobile-bottom-bar.tsx` with category-adaptive CTAs:

```typescript
// In mobile-bottom-bar.tsx, add categoryType prop:

interface MobileBottomBarProps {
  // ... existing props
  categoryType?: "default" | "automotive" | "real-estate"
}

// Then use it for CTA labels:
const primaryLabel = categoryType === "real-estate" 
  ? t("contactAgent")
  : categoryType === "automotive"
  ? t("contactSeller") 
  : t("buyNow")

const secondaryLabel = categoryType === "real-estate"
  ? t("scheduleVisit")
  : categoryType === "automotive"
  ? t("testDrive")
  : t("chat")
```

---

## 6. Step 4: Update Product Page Layout

### 6.1 Detect Category Type

Add helper to `product-page-layout.tsx`:

```typescript
function getCategoryType(
  categorySlug: string | null,
  parentSlug: string | null
): "default" | "automotive" | "real-estate" {
  const slugs = [categorySlug, parentSlug].filter(Boolean)
  
  if (slugs.some(s => s?.includes("auto") || s?.includes("car") || s?.includes("motor"))) {
    return "automotive"
  }
  if (slugs.some(s => s?.includes("real-estate") || s?.includes("property"))) {
    return "real-estate"
  }
  return "default"
}
```

### 6.2 Pass Category Info to Components

Update `ProductPageLayout` to pass category context:

```tsx
// In product-page-layout.tsx

const categoryType = getCategoryType(
  category?.slug ?? null, 
  parentCategory?.slug ?? null
)

// Pass to components:
<ProductPageDesktopV2
  // ... other props
  categoryType={categoryType}
  categorySlug={category?.slug ?? null}
  parentSlug={parentCategory?.slug ?? null}
/>

<ProductPageMobileV2
  // ... other props
  categoryType={categoryType}
  categorySlug={category?.slug ?? null}
  parentSlug={parentCategory?.slug ?? null}
/>
```

---

## 7. Step 5: Wire Up Category-Adaptive Logic

### 7.1 View Model Enhancement

Add hero specs to `lib/view-models/product-page.ts`:

```typescript
// Add to ProductPageViewModel interface:
export interface ProductPageViewModel {
  // ... existing fields
  heroSpecs: Array<{ label: string; value: string }>
}

// In buildProductPageViewModel(), add:
import { getHeroSpecsForCategory } from "@/components/shared/product/hero-specs-config"

const heroSpecConfigs = getHeroSpecsForCategory(
  category?.slug ?? null,
  parentCategory?.slug ?? null
)

const heroSpecs = heroSpecConfigs
  .map((config) => {
    const attrs = toRecord(product.attributes)
    const rawValue = attrs[config.key]
    if (rawValue == null || rawValue === "") return null
    return {
      label: config.label,
      value: config.unit ? `${rawValue} ${config.unit}` : String(rawValue),
    }
  })
  .filter(Boolean)
  .slice(0, 4)

return {
  // ... existing fields
  heroSpecs,
}
```

---

## 8. Step 6: Styling Compliance

### 8.1 Token Checklist

Ensure all new components use design tokens from `docs/DESIGN.md`:

| Element | ✅ Use | ❌ Avoid |
|---------|--------|---------|
| Card background | `bg-card` | `bg-white` |
| Muted surface | `bg-muted/50` | `bg-gray-100` |
| Primary text | `text-foreground` | `text-black` |
| Secondary text | `text-muted-foreground` | `text-gray-500` |
| Borders | `border-border` | `border-gray-200` |
| Success/green | `text-success`, `bg-success/10` | `text-green-500` |
| Ratings | `text-rating` | `text-yellow-400` |
| Sale price | `text-price-sale` | `text-red-500` |

### 8.2 Touch Targets

All interactive elements must meet minimums:

```tsx
// Buttons: min h-10 (40px)
<Button className="h-10" />

// Icon buttons: min size-9 (36px)
<button className="size-9 rounded-full" />

// Thumbnail buttons: min size-12 (48px) on mobile
<button className="size-12 lg:size-16" />
```

### 8.3 Spacing System

```tsx
// Mobile gaps: gap-2 (8px)
// Desktop gaps: gap-3 (12px)
// Section spacing: py-4 (mobile), py-6 (desktop)

<div className="space-y-2 lg:space-y-3">
  {/* content */}
</div>
```

---

## 9. Verification Gates

After each step, run:

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke (with dev server running)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

### Manual Testing Checklist

- [ ] Desktop: 55/45 split renders correctly
- [ ] Desktop: Thumbnails are horizontal below hero
- [ ] Desktop: Buy box sticks on scroll
- [ ] Desktop: Seller card is inside buy box
- [ ] Mobile: Gallery is edge-to-edge
- [ ] Mobile: Bottom bar is sticky with safe area
- [ ] Mobile: Specs/Description tabs work
- [ ] Electronics product shows: Screen, Storage, Battery, Camera
- [ ] Automotive product shows: Mileage, Engine, Fuel, Transmission
- [ ] Fashion product shows: Size, Brand, Material, Condition
- [ ] CTA labels change per category type

---

## 10. Rollback Plan

If issues arise:

1. **Component-level rollback**: Keep both V1 and V2 components, switch via feature flag:
   ```tsx
   const useV2Layout = process.env.NEXT_PUBLIC_PRODUCT_PAGE_V2 === "true"
   
   {useV2Layout ? <ProductPageDesktopV2 {...props} /> : <ProductPageDesktop {...props} />}
   ```

2. **Git rollback**: Tag before integration:
   ```bash
   git tag -a pre-product-page-v2 -m "Before V2 product page integration"
   ```

3. **Gradual rollout**: Use percentage-based feature flag via Vercel Edge Config or similar.

---

## Implementation Order

1. **Session 1**: Hero specs system (config + component)
2. **Session 2**: Desktop components (gallery, buy box)
3. **Session 3**: Mobile components (gallery, specs tabs, bottom bar)
4. **Session 4**: Integration + testing + polish

---

## Files to Reference

- Demo source: `app/[locale]/demo/product-adaptive/`
- Current desktop: `components/shared/product/product-page-layout.tsx`
- Current mobile: `components/mobile/product/mobile-product-page.tsx`
- Design tokens: `docs/DESIGN.md`
- Engineering rules: `docs/ENGINEERING.md`

---

*Last updated: January 2026*
