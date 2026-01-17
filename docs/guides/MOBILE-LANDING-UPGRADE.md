# Mobile Landing Page Upgrade Guide

> **Goal**: Bring demo/mobile layout patterns to the main mobile landing page while keeping our existing header and bottom navbar (they're better).

---

## What to Keep vs Replace

| Component | Source | Reason |
|-----------|--------|--------|
| **Header** | ✅ Keep Main | Better icons (duotone), proper sizing |
| **Bottom Navbar** | ✅ Keep Main | Better styling, iOS-native look |
| **Search Bar** | 🔄 Adopt Demo Style | Clean single-line with camera icon |
| **Category Pills** | 🔄 Adopt Demo Style | Horizontal scroll with icons |
| **Promoted Section** | 🆕 From Demo | Big w-40 horizontal cards |
| **Offers Section** | 🆕 From Demo | Same horizontal row style |
| **Filter/Sort** | 🔄 Native Drawers | No shadcn, cleaner mobile UX |
| **Product Grid** | ✅ Keep Main | Works well, uses real Supabase data |

---

## File Structure (Clean Naming)

```
components/
└── mobile/
    ├── landing/
    │   ├── mobile-landing.tsx          # Main orchestrator
    │   ├── promoted-section.tsx        # Horizontal promoted cards
    │   ├── offers-section.tsx          # Horizontal offers cards
    │   ├── category-pills.tsx          # Scrollable category pills
    │   └── filter-sort-bar.tsx         # Inline filter/sort triggers
    ├── drawers/
    │   ├── native-drawer.tsx           # Base drawer (no shadcn)
    │   ├── filter-drawer.tsx           # Filter options
    │   └── sort-drawer.tsx             # Sort options
    └── [DELETE] mobile-home-unified.tsx  # Remove after migration
```

**Naming Rules**:
- No "unified", "v2", "new" suffixes
- Descriptive: `promoted-section.tsx` not `promo-strip.tsx`
- Grouped by purpose: `drawers/`, `landing/`

---

## Phase 1: Supabase Schema (Already Done ✅)

The boost system is already in place:

```sql
-- products table already has:
-- is_boosted BOOLEAN DEFAULT false
-- boost_expires_at TIMESTAMPTZ

-- Query for active boosts:
SELECT * FROM products
WHERE is_boosted = true 
  AND boost_expires_at > NOW()
ORDER BY boost_expires_at ASC  -- Fair rotation
LIMIT 10;
```

**Existing function** in `lib/data/products.ts`:
```typescript
// getBoostedProducts fetches products with active boosts
export const getBoostedProducts = (limit = 36, zone?: ShippingRegion) => 
  getProducts('featured', limit, zone)
```

### "Offers for You" Data Strategy

For the "Offers for You" section, we have two options:

**Option A: Simple (use existing data)**
Filter products that have discounts (`listPrice > price`):
```typescript
const offers = initialProducts.filter(p => p.listPrice && p.listPrice > p.price)
```

**Option B: Personalized (future)**
```sql
-- Migration: 20260118000000_user_recommended_products.sql
CREATE TABLE IF NOT EXISTS user_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  score NUMERIC(5,2) DEFAULT 1.0,
  reason TEXT,  -- 'viewed_similar', 'category_match', 'price_range'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  UNIQUE(user_id, product_id)
);
```

---

## Phase 2: Native Drawer Primitive

Create a reusable native drawer without shadcn dependency:

### `components/mobile/drawers/native-drawer.tsx`

```typescript
"use client"

import { useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface NativeDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  side?: "left" | "right" | "bottom"
  className?: string
}

export function NativeDrawer({ 
  open, 
  onOpenChange, 
  children, 
  side = "bottom", 
  className 
}: NativeDrawerProps) {
  // Escape key closes drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onOpenChange(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const sideClasses = {
    left: "inset-y-0 left-0 w-[85%] max-w-sm -translate-x-full data-[state=open]:translate-x-0",
    right: "inset-y-0 right-0 w-[85%] max-w-sm translate-x-full data-[state=open]:translate-x-0",
    bottom: "inset-x-0 bottom-0 translate-y-full data-[state=open]:translate-y-0 rounded-t-2xl max-h-[92dvh]",
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        data-state={open ? "open" : "closed"}
        className={cn(
          "fixed z-50 bg-background flex flex-col transition-transform duration-300 ease-out",
          sideClasses[side],
          className
        )}
      >
        {children}
      </div>
    </>
  )
}
```

---

## Phase 3: Filter Drawer

### `components/mobile/drawers/filter-drawer.tsx`

```typescript
"use client"

import { useState, useEffect } from "react"
import { Check, X, Star, Truck } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { NativeDrawer } from "./native-drawer"

interface FilterState {
  minRating: number | null
  freeShipping: boolean
  condition: string | null
}

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function FilterDrawer({
  open,
  onOpenChange,
  locale,
  filters,
  onFiltersChange,
}: FilterDrawerProps) {
  const [pending, setPending] = useState(filters)

  useEffect(() => {
    if (open) setPending(filters)
  }, [open, filters])

  const handleApply = () => {
    onFiltersChange(pending)
    onOpenChange(false)
  }

  const conditions = [
    { value: "new", label: locale === "bg" ? "Нов" : "New" },
    { value: "like_new", label: locale === "bg" ? "Като нов" : "Like New" },
    { value: "used", label: locale === "bg" ? "Употребяван" : "Used" },
  ]

  return (
    <NativeDrawer open={open} onOpenChange={onOpenChange} side="bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-(--page-inset) h-14 border-b border-border/50">
        <h2 className="text-base font-semibold">
          {locale === "bg" ? "Филтри" : "Filters"}
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPending({ minRating: null, freeShipping: false, condition: null })}
            className="text-sm font-medium text-primary active:opacity-70"
          >
            {locale === "bg" ? "Изчисти" : "Clear"}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="size-8 flex items-center justify-center rounded-full hover:bg-muted"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
      </div>

      {/* Content - Rating, Condition, Free Shipping */}
      <div className="flex-1 overflow-y-auto p-(--page-inset) space-y-5">
        {/* Rating section */}
        <div>
          <h3 className="text-sm font-semibold mb-2">{locale === "bg" ? "Рейтинг" : "Rating"}</h3>
          <div className="space-y-1">
            {[4, 3, 2].map((stars) => {
              const isActive = pending.minRating === stars
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setPending(p => ({ ...p, minRating: isActive ? null : stars }))}
                  className={cn(
                    "w-full flex items-center gap-3 h-10 px-3 rounded-lg transition-colors text-left",
                    isActive ? "bg-muted/60" : "active:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "size-5 rounded border flex items-center justify-center shrink-0",
                    isActive ? "bg-primary border-primary" : "border-input"
                  )}>
                    {isActive && <Check size={12} weight="bold" className="text-primary-foreground" />}
                  </div>
                  <div className="flex text-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} weight={i < stars ? "fill" : "regular"} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {locale === "bg" ? "и нагоре" : "& up"}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Condition section */}
        <div>
          <h3 className="text-sm font-semibold mb-2">{locale === "bg" ? "Състояние" : "Condition"}</h3>
          <div className="space-y-1">
            {conditions.map(({ value, label }) => {
              const isActive = pending.condition === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPending(p => ({ ...p, condition: isActive ? null : value }))}
                  className={cn(
                    "w-full flex items-center gap-3 h-10 px-3 rounded-lg transition-colors text-left",
                    isActive ? "bg-muted/60" : "active:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "size-5 rounded border flex items-center justify-center shrink-0",
                    isActive ? "bg-primary border-primary" : "border-input"
                  )}>
                    {isActive && <Check size={12} weight="bold" className="text-primary-foreground" />}
                  </div>
                  <span className="text-sm">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Free Shipping toggle */}
        <button
          type="button"
          onClick={() => setPending(p => ({ ...p, freeShipping: !p.freeShipping }))}
          className={cn(
            "w-full flex items-center gap-3 h-10 px-3 rounded-lg transition-colors text-left",
            pending.freeShipping ? "bg-muted/60" : "active:bg-muted/40"
          )}
        >
          <div className={cn(
            "size-5 rounded border flex items-center justify-center shrink-0",
            pending.freeShipping ? "bg-primary border-primary" : "border-input"
          )}>
            {pending.freeShipping && <Check size={12} weight="bold" className="text-primary-foreground" />}
          </div>
          <Truck size={16} className="text-shipping-free" />
          <span className="text-sm">{locale === "bg" ? "Безплатна доставка" : "Free Shipping"}</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-(--page-inset) border-t border-border/50 pb-safe">
        <button
          type="button"
          onClick={handleApply}
          className="w-full h-11 rounded-full bg-foreground text-background text-sm font-bold active:opacity-90"
        >
          {locale === "bg" ? "Приложи филтри" : "Apply Filters"}
        </button>
      </div>
    </NativeDrawer>
  )
}
```

---

## Phase 4: Sort Drawer

### `components/mobile/drawers/sort-drawer.tsx`

```typescript
"use client"

import { Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { NativeDrawer } from "./native-drawer"

interface SortDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string
  sortBy: string
  onSortChange: (value: string) => void
}

const SORT_OPTIONS = [
  { value: "featured", labelEn: "Featured", labelBg: "Препоръчани" },
  { value: "newest", labelEn: "Newest", labelBg: "Най-нови" },
  { value: "price-asc", labelEn: "Price: Low to High", labelBg: "Цена: ниска → висока" },
  { value: "price-desc", labelEn: "Price: High to Low", labelBg: "Цена: висока → ниска" },
  { value: "rating", labelEn: "Top Rated", labelBg: "Най-висок рейтинг" },
]

export function SortDrawer({ open, onOpenChange, locale, sortBy, onSortChange }: SortDrawerProps) {
  return (
    <NativeDrawer open={open} onOpenChange={onOpenChange} side="bottom" className="max-h-[50dvh]">
      {/* Drag Handle */}
      <div className="flex items-center justify-center pt-3 pb-2">
        <div className="h-1.5 w-12 rounded-full bg-muted-foreground/25" />
      </div>
      
      <div className="px-(--page-inset) pb-3 border-b border-border/50">
        <h2 className="text-base font-semibold text-center">
          {locale === "bg" ? "Сортирай по" : "Sort By"}
        </h2>
      </div>

      <div className="py-2 pb-safe">
        {SORT_OPTIONS.map(({ value, labelEn, labelBg }) => {
          const isActive = sortBy === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => { onSortChange(value); onOpenChange(false) }}
              className={cn(
                "w-full flex items-center justify-between px-(--page-inset) h-11 transition-colors text-left",
                isActive ? "bg-muted/50" : "active:bg-muted/30"
              )}
            >
              <span className="text-sm font-medium">{locale === "bg" ? labelBg : labelEn}</span>
              {isActive && <Check size={16} weight="bold" className="text-primary" />}
            </button>
          )
        })}
      </div>
    </NativeDrawer>
  )
}
```

---

## Phase 5: Promoted Section (Horizontal Scroll)

Uses real Supabase data via `getBoostedProducts()`.

### `components/mobile/landing/promoted-section.tsx`

```typescript
"use client"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Fire, ArrowRight, Sparkle, Heart, Star, Truck, Package } from "@phosphor-icons/react"
import type { UIProduct } from "@/lib/data/products"
import Image from "next/image"

interface PromotedSectionProps {
  products: UIProduct[]
  locale: string
}

export function PromotedSection({ products, locale }: PromotedSectionProps) {
  if (!products.length) return null

  return (
    <section className="pt-3 pb-1">
      {/* Header */}
      <div className="px-(--page-inset) mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fire size={18} weight="fill" className="text-orange-500" />
          <span className="text-sm font-bold text-foreground">
            {locale === "bg" ? "Промотирани обяви" : "Promoted Listings"}
          </span>
        </div>
        <Link
          href="/todays-deals"
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
        >
          {locale === "bg" ? "Виж всички" : "See all"}
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>

      {/* Horizontal Scroll - w-40 cards */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-(--page-inset)">
          {products.slice(0, 8).map((product) => {
            const hasDiscount = product.listPrice && product.listPrice > product.price
            const discountPercent = hasDiscount
              ? Math.round(((product.listPrice! - product.price) / product.listPrice!) * 100)
              : 0
            const href = product.storeSlug && product.slug
              ? `/${product.storeSlug}/${product.slug}`
              : `/product/${product.id}`

            return (
              <Link key={product.id} href={href} className="shrink-0 w-40 active:opacity-80 transition-opacity">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                  {/* AD Badge */}
                  <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-orange-500 text-white text-3xs font-bold rounded flex items-center gap-0.5">
                    <Sparkle size={10} weight="fill" />
                    <span>AD</span>
                  </div>
                  
                  {/* Discount or Wishlist */}
                  {hasDiscount ? (
                    <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-2xs font-bold rounded">
                      -{discountPercent}%
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                      className="absolute top-2 right-2 z-10 size-7 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90"
                      aria-label="Add to wishlist"
                    >
                      <Heart size={14} className="text-foreground" />
                    </button>
                  )}

                  {/* Free shipping badge */}
                  {product.freeShipping && (
                    <div className="absolute bottom-2 left-2 z-10 px-1.5 py-0.5 bg-shipping-free text-background text-2xs font-medium rounded flex items-center gap-0.5">
                      <Truck size={10} weight="fill" />
                      Free
                    </div>
                  )}

                  {/* Image */}
                  {product.image && product.image !== '/placeholder.svg' ? (
                    <Image src={product.image} alt={product.title} fill className="object-cover" sizes="160px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package size={36} className="text-muted-foreground/15" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn("text-sm font-bold", hasDiscount ? "text-price-sale" : "text-foreground")}>
                      €{product.price.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-2xs text-muted-foreground line-through">€{product.listPrice!.toFixed(2)}</span>
                    )}
                  </div>
                  <p className="text-xs text-foreground line-clamp-2 leading-snug">{product.title}</p>
                  <div className="flex items-center gap-1">
                    <Star size={11} weight="fill" className="text-rating" />
                    <span className="text-2xs text-muted-foreground">
                      {product.rating} ({product.reviews?.toLocaleString()})
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

---

## Phase 6: Offers Section (Horizontal Scroll)

Same horizontal layout as Promoted, but shows discounted products.

### `components/mobile/landing/offers-section.tsx`

```typescript
"use client"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Tag, ArrowRight, Heart, Star, Truck, Package } from "@phosphor-icons/react"
import type { UIProduct } from "@/lib/data/products"
import Image from "next/image"

interface OffersSectionProps {
  products: UIProduct[]
  locale: string
}

export function OffersSection({ products, locale }: OffersSectionProps) {
  // Filter to products with discounts
  const offers = products.filter(p => p.listPrice && p.listPrice > p.price).slice(0, 8)
  
  if (!offers.length) return null

  return (
    <section className="py-3">
      {/* Header */}
      <div className="px-(--page-inset) mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={18} weight="fill" className="text-primary" />
          <span className="text-sm font-bold text-foreground">
            {locale === "bg" ? "Оферти за теб" : "Offers for You"}
          </span>
        </div>
        <Link
          href="/deals"
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
        >
          {locale === "bg" ? "Виж всички" : "See all"}
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>

      {/* Horizontal Scroll - same w-40 cards */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-(--page-inset)">
          {offers.map((product) => {
            const discountPercent = Math.round(
              ((product.listPrice! - product.price) / product.listPrice!) * 100
            )
            const href = product.storeSlug && product.slug
              ? `/${product.storeSlug}/${product.slug}`
              : `/product/${product.id}`

            return (
              <Link key={product.id} href={href} className="shrink-0 w-40 active:opacity-80 transition-opacity">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-2xs font-bold rounded">
                    -{discountPercent}%
                  </div>
                  
                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                    className="absolute top-2 right-2 z-10 size-7 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={14} className="text-foreground" />
                  </button>

                  {/* Free shipping badge */}
                  {product.freeShipping && (
                    <div className="absolute bottom-2 left-2 z-10 px-1.5 py-0.5 bg-shipping-free text-background text-2xs font-medium rounded flex items-center gap-0.5">
                      <Truck size={10} weight="fill" />
                      Free
                    </div>
                  )}

                  {/* Image */}
                  {product.image && product.image !== '/placeholder.svg' ? (
                    <Image src={product.image} alt={product.title} fill className="object-cover" sizes="160px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package size={36} className="text-muted-foreground/15" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-price-sale">€{product.price.toFixed(2)}</span>
                    <span className="text-2xs text-muted-foreground line-through">€{product.listPrice!.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-foreground line-clamp-2 leading-snug">{product.title}</p>
                  <div className="flex items-center gap-1">
                    <Star size={11} weight="fill" className="text-rating" />
                    <span className="text-2xs text-muted-foreground">
                      {product.rating} ({product.reviews?.toLocaleString()})
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

---

## Phase 7: Main Landing Component

Integrates all sections with existing header/navbar from main.

### `components/mobile/landing/mobile-landing.tsx`

```typescript
"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ShieldCheck, Tag, Truck } from "@phosphor-icons/react"
import { SlidersHorizontal, ArrowUpDown } from "lucide-react"

// Keep existing main components
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { ProductFeed } from "@/components/shared/product/product-feed"

// New landing sections
import { PromotedSection } from "./promoted-section"
import { OffersSection } from "./offers-section"
import { FilterDrawer } from "../drawers/filter-drawer"
import { SortDrawer } from "../drawers/sort-drawer"

import type { UIProduct } from "@/lib/data/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { useCategoryNavigation } from "@/hooks/use-category-navigation"

interface MobileLandingProps {
  initialProducts: UIProduct[]
  promotedProducts: UIProduct[]
  initialCategories: CategoryTreeNode[]
  locale: string
  user?: { id: string } | null
}

export function MobileLanding({
  initialProducts,
  promotedProducts,
  initialCategories,
  locale,
  user,
}: MobileLandingProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false)
  const [filters, setFilters] = useState({
    minRating: null as number | null,
    freeShipping: false,
    condition: null as string | null,
  })
  const [sortBy, setSortBy] = useState("featured")

  // Use existing category navigation hook
  const nav = useCategoryNavigation({
    initialCategories,
    defaultTab: null,
    defaultSubTab: null,
    defaultL2: null,
    defaultL3: null,
    tabsNavigateToPages: false,
    l0Style: "pills",
    initialProducts,
    initialProductsSlug: "all",
    locale,
    activeAllFilter: "newest",
  })

  const categoryName = useMemo(() => {
    if (nav.isAllTab) return locale === "bg" ? "Най-нови обяви" : "Newest Listings"
    return nav.activeCategoryName || nav.activeTab
  }, [nav.isAllTab, nav.activeCategoryName, nav.activeTab, locale])

  return (
    <div className="min-h-screen bg-background">
      {/* NOTE: Header and Bottom Nav come from layout - keep existing main components */}
      
      {/* Search Overlay */}
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={searchOpen}
        onOpenChange={setSearchOpen}
      />

      {/* Promoted Section - Only on "All" tab */}
      {nav.isAllTab && <PromotedSection products={promotedProducts} locale={locale} />}

      {/* Offers Section - Only on "All" tab */}
      {nav.isAllTab && <OffersSection products={initialProducts} locale={locale} />}

      {/* Filter/Sort Bar */}
      <div className="px-(--page-inset) pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">{categoryName}</h2>
          <span className="text-xs text-muted-foreground">
            ({nav.activeFeed.products.length})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-1 h-7 px-2.5 border border-border/60 rounded-full text-2xs font-medium active:bg-muted"
          >
            <SlidersHorizontal className="size-3" />
            {locale === "bg" ? "Филтри" : "Filters"}
          </button>
          <button
            type="button"
            onClick={() => setSortDrawerOpen(true)}
            className="flex items-center gap-1 h-7 px-2.5 border border-border/60 rounded-full text-2xs font-medium active:bg-muted"
          >
            <ArrowUpDown className="size-3" />
            {locale === "bg" ? "Сортирай" : "Sort"}
          </button>
        </div>
      </div>

      {/* Product Grid - existing ProductFeed component */}
      <ProductFeed
        products={nav.activeFeed.products}
        hasMore={nav.activeFeed.hasMore}
        isLoading={nav.isLoading}
        activeSlug={nav.activeSlug}
        locale={locale}
        isAllTab={nav.isAllTab}
        activeCategoryName={categoryName}
        onLoadMore={nav.loadMoreProducts}
      />

      {/* Trust Badges (interstitial) */}
      {nav.activeFeed.products.length >= 4 && <TrustBadges locale={locale} />}

      {/* Native Drawers */}
      <FilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        locale={locale}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <SortDrawer
        open={sortDrawerOpen}
        onOpenChange={setSortDrawerOpen}
        locale={locale}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </div>
  )
}

function TrustBadges({ locale }: { locale: string }) {
  const badges = [
    { icon: ShieldCheck, label: locale === "bg" ? "Защитени" : "Protected" },
    { icon: Truck, label: locale === "bg" ? "Бърза доставка" : "Fast Ship" },
    { icon: Tag, label: locale === "bg" ? "Топ цени" : "Best Prices" },
  ]

  return (
    <div className="mx-(--page-inset) my-3 flex items-center justify-between py-2.5 px-3 bg-muted/30 rounded-lg border border-border/30">
      {badges.map(({ icon: Icon, label }, i) => (
        <div key={label} className={cn("flex items-center gap-1.5", i > 0 && "border-l border-border/40 pl-3")}>
          <Icon size={14} weight="fill" className="text-foreground/70" />
          <span className="text-2xs text-foreground/70 font-medium">{label}</span>
        </div>
      ))}
    </div>
  )
}
```

---

## Phase 8: Update Page Component

Wire up real Supabase data.

### `app/[locale]/(main)/page.tsx`

```typescript
import { Suspense } from "react"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { DesktopProductFeed, DesktopProductFeedSkeleton } from "@/components/sections/desktop-product-feed"
import { MobileLanding } from "@/components/mobile/landing/mobile-landing"
import { getNewestProducts, getBoostedProducts, toUI } from "@/lib/data/products"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { createClient } from "@/lib/supabase/server"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  return {
    title: locale === 'bg' ? 'Начало' : 'Home',
    description: locale === 'bg'
      ? 'Treido - вашият онлайн магазин'
      : 'Treido - your online marketplace',
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const categoriesWithChildren = await getCategoryHierarchy(null, 2)

  // Fetch products in parallel
  const [newestProducts, boostedProducts] = await Promise.all([
    getNewestProducts(24),
    getBoostedProducts(10),  // Promoted products with active boosts
  ])
  
  const initialProducts = newestProducts.map(p => toUI(p))
  const promotedProducts = boostedProducts.map(p => toUI(p))

  return (
    <main className="flex min-h-screen flex-col bg-background md:pb-0">
      {/* Mobile - Uses new MobileLanding with sections */}
      <div className="w-full md:hidden">
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <MobileLanding
            initialProducts={initialProducts.slice(0, 12)}
            promotedProducts={promotedProducts}
            initialCategories={categoriesWithChildren}
            locale={locale}
            user={user ? { id: user.id } : null}
          />
        </Suspense>
      </div>

      {/* Desktop - Unchanged */}
      <div className="hidden md:block w-full">
        <div className="w-full bg-background pt-4 pb-6">
          <div className="container">
            <Suspense fallback={<DesktopProductFeedSkeleton />}>
              <DesktopProductFeed
                locale={locale}
                categories={categoriesWithChildren}
                initialTab="newest"
                initialProducts={initialProducts}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
```

---

## Migration Checklist

### Phase 1: Create New Files
- [ ] `components/mobile/drawers/native-drawer.tsx`
- [ ] `components/mobile/drawers/filter-drawer.tsx`
- [ ] `components/mobile/drawers/sort-drawer.tsx`
- [ ] `components/mobile/landing/promoted-section.tsx`
- [ ] `components/mobile/landing/offers-section.tsx`
- [ ] `components/mobile/landing/mobile-landing.tsx`

### Phase 2: Update Imports
- [ ] `app/[locale]/(main)/page.tsx` - import `MobileLanding`
- [ ] Remove shadcn Drawer imports from mobile components

### Phase 3: Cleanup
- [ ] Delete `components/mobile/mobile-home-unified.tsx`
- [ ] Delete any unused filter-hub/sort-modal mobile components

### Phase 4: Keep (Don't Touch)
- ✅ Main header component (better icons)
- ✅ Main bottom navbar (better styling)
- ✅ `ProductFeed` component
- ✅ `useCategoryNavigation` hook
- ✅ Supabase data functions

---

## Testing Checklist

1. **Visual Match**: Compare with demo/mobile layout
2. **Promoted Section**: Shows boosted products from Supabase
3. **Offers Section**: Shows discounted products (horizontal scroll)
4. **Filter Drawer**: Opens, applies filters, closes
5. **Sort Drawer**: Instant apply on selection
6. **Category Pills**: Switch categories, filter products
7. **Header/Navbar**: Unchanged from current main
8. **Desktop**: Completely unchanged

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| **Keep main header** | Better icons (duotone, size 26), proper badge positioning |
| **Keep main navbar** | iOS-native styling, better touch targets |
| **Native drawers** | No shadcn bloat, better mobile control |
| **Horizontal offers** | Matches promoted section, consistent UX |
| **Clean file names** | `promoted-section.tsx` not `promo-strip-v2-unified.tsx` |
| **Existing ProductFeed** | Already works with Supabase, just integrate |
| **Real data only** | No mock data in main - use Supabase functions |
