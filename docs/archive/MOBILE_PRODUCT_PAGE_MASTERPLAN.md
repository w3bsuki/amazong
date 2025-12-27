# 📱 Mobile Product Page Masterplan
## Ultimate C2C Marketplace - Production-Ready Mobile Experience

> **Goal:** Create a pixel-perfect, mobile-first product page that fetches all data from Supabase, displays 24 L0 categories, enables seller messaging, and delivers best-in-class UX using shadcn/ui + Tailwind CSS v4.

---

## 📋 Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Supabase Data Schema](#2-supabase-data-schema)
3. [Mobile Layout Structure](#3-mobile-layout-structure)
4. [Component Breakdown](#4-component-breakdown)
5. [Tailwind CSS v4 Design Tokens](#5-tailwind-css-v4-design-tokens)
6. [shadcn/ui Component Strategy](#6-shadcnui-component-strategy)
7. [24 L0 Categories System](#7-24-l0-categories-system)
8. [Seller Messaging UX](#8-seller-messaging-ux)
9. [Production Checklist](#9-production-checklist)
10. [Implementation Phases](#10-implementation-phases)

---

## 1. Architecture Overview

### Mobile-First Responsive Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE (< 1024px)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Similar Items Horizontal Scroll Bar (Seller Products) │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │              Seller Card (Compact)                    │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │           Product Gallery (Swipeable)                 │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │         Title + Price + Category Badge                │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │              Buy Box (Inline)                         │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │         Accordions (Details, Shipping, etc.)          │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │           More from Seller (Grid)                     │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │              Reviews Section                          │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        STICKY BOTTOM BAR (Price + Buy Now)            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   DESKTOP (≥ 1024px)                        │
│  ┌─────────────────────────┬───────────────────────────────┐│
│  │   Gallery (Left 60%)    │    Sticky Sidebar (40%)      ││
│  │   └ Main Image          │    ├ Title + Price           ││
│  │   └ Thumbnails Grid     │    ├ Category Badge          ││
│  │                         │    ├ Seller Card (Full)      ││
│  │   Item Specifics        │    ├ Buy Box                 ││
│  │                         │    ├ Safety/Shipping         ││
│  ├─────────────────────────┴───────────────────────────────┤│
│  │                More from Seller (5-col grid)            ││
│  ├─────────────────────────────────────────────────────────┤│
│  │                    Reviews Section                      ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
app/[locale]/[username]/[productSlug]/
├── page.tsx                    # RSC - Data fetching + Layout
├── loading.tsx                 # Skeleton loading state
└── not-found.tsx               # 404 for invalid products

components/shared/product/
├── mobile/                     # Mobile-specific components
│   ├── mobile-product-gallery.tsx
│   ├── mobile-seller-banner.tsx
│   ├── mobile-buy-box.tsx
│   ├── mobile-sticky-bar.tsx
│   ├── mobile-accordions.tsx
│   └── mobile-reviews.tsx
├── desktop/                    # Desktop-specific components
│   ├── desktop-gallery.tsx
│   ├── desktop-sidebar.tsx
│   └── desktop-seller-card.tsx
├── shared/                     # Shared components
│   ├── category-badge.tsx
│   ├── seller-metrics.tsx
│   ├── product-price.tsx
│   ├── trust-badges.tsx
│   └── seller-products-grid.tsx
└── product-page-hybrid.tsx     # Main responsive wrapper
```

---

## 2. Supabase Data Schema

### Current Schema Analysis

Your existing schema needs these additions for full product page functionality:

```sql
-- EXTENDED PRODUCTS TABLE (additions needed)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS
  condition text DEFAULT 'new' CHECK (condition IN ('new', 'used', 'refurbished', 'parts')),
  attributes jsonb DEFAULT '{}',
  slug text UNIQUE,
  sku text,
  meta_description text,
  ships_to_bulgaria boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  is_boosted boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('draft', 'active', 'sold', 'inactive'));

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- EXTENDED CATEGORIES (24 L0 Categories)
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS
  icon_name text,                    -- Lucide icon name
  badge_color text,                  -- CSS color token
  display_order int DEFAULT 0,
  is_featured boolean DEFAULT false;

-- PROFILES EXTENSION FOR SELLER DATA
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS
  username text UNIQUE,
  display_name text,
  verified boolean DEFAULT false,
  is_seller boolean DEFAULT false;

-- SELLER STATS VIEW (for metrics display)
CREATE OR REPLACE VIEW public.seller_stats AS
SELECT 
  p.id as seller_id,
  p.username,
  COUNT(DISTINCT pr.id) as total_products,
  COUNT(DISTINCT r.id) as total_reviews,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COALESCE(
    (SELECT COUNT(*) * 100.0 / NULLIF(COUNT(*), 0) 
     FROM public.reviews 
     WHERE rating >= 4), 0
  ) as positive_feedback_pct,
  p.created_at as member_since
FROM public.profiles p
LEFT JOIN public.products pr ON pr.seller_id = p.id
LEFT JOIN public.reviews r ON r.product_id = pr.id
WHERE p.is_seller = true
GROUP BY p.id, p.username, p.created_at;

-- MESSAGES TABLE (for seller contact)
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  thread_id uuid NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) NOT NULL,
  recipient_id uuid REFERENCES public.profiles(id) NOT NULL,
  product_id uuid REFERENCES public.products(id),
  content text NOT NULL,
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- MESSAGE THREADS
CREATE TABLE IF NOT EXISTS public.message_threads (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id uuid REFERENCES public.profiles(id) NOT NULL,
  seller_id uuid REFERENCES public.profiles(id) NOT NULL,
  product_id uuid REFERENCES public.products(id),
  last_message_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(buyer_id, seller_id, product_id)
);

-- RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their own threads" ON public.message_threads
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
```

### Data Fetching Function

```typescript
// lib/data/product-page.ts
import { createStaticClient } from "@/lib/supabase/server"

export interface ProductPageData {
  product: Product
  seller: SellerWithStats
  category: Category | null
  parentCategory: Category | null
  relatedProducts: Product[]
}

export async function fetchProductPageData(
  username: string,
  productSlug: string
): Promise<ProductPageData | null> {
  const supabase = createStaticClient()
  if (!supabase) return null

  // Fetch product with seller and category in single query
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      seller:profiles!seller_id(
        id,
        username,
        display_name,
        avatar_url,
        verified,
        is_seller,
        created_at
      ),
      category:categories!category_id(
        id,
        name,
        slug,
        parent_id,
        icon_name,
        badge_color
      )
    `)
    .eq("seller.username", username)
    .eq("slug", productSlug)
    .eq("status", "active")
    .single()

  if (error || !product) return null

  // Fetch seller stats
  const { data: sellerStats } = await supabase
    .from("seller_stats")
    .select("*")
    .eq("seller_id", product.seller.id)
    .single()

  // Fetch parent category if exists
  let parentCategory = null
  if (product.category?.parent_id) {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("id", product.category.parent_id)
      .single()
    parentCategory = data
  }

  // Fetch related products from same seller
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", product.seller.id)
    .neq("id", product.id)
    .eq("status", "active")
    .limit(10)

  return {
    product,
    seller: { ...product.seller, stats: sellerStats },
    category: product.category,
    parentCategory,
    relatedProducts: relatedProducts || []
  }
}
```

---

## 3. Mobile Layout Structure

### Mobile Component Stack (Top to Bottom)

```tsx
// Mobile-specific layout (< 1024px)
<div className="lg:hidden flex flex-col min-h-screen bg-background">
  {/* 1. Similar Items Scroll Bar - Sticky at top after scroll */}
  <SimilarItemsBar products={relatedProducts} />
  
  {/* 2. Seller Card - Compact version */}
  <MobileSellerCard seller={seller} />
  
  {/* 3. Product Gallery - Full width swipeable */}
  <MobileProductGallery images={product.images} />
  
  {/* 4. Product Info Section */}
  <section className="px-4 py-3 space-y-3">
    {/* Category Badge */}
    <CategoryBadge category={category} />
    
    {/* Title */}
    <h1 className="text-xl font-bold tracking-tight">{product.title}</h1>
    
    {/* Price Block */}
    <ProductPrice 
      sale={product.price} 
      regular={product.list_price} 
      currency="BGN" 
    />
    
    {/* Condition Badge */}
    <ConditionBadge condition={product.condition} />
  </section>
  
  {/* 5. Buy Actions - Inline on mobile */}
  <MobileBuyActions product={product} seller={seller} />
  
  {/* 6. Expandable Sections */}
  <MobileAccordions 
    description={product.description}
    attributes={product.attributes}
    shipping={shippingInfo}
    returns={returnsPolicy}
  />
  
  {/* 7. More from Seller */}
  <SellerProductsGrid 
    products={relatedProducts} 
    sellerName={seller.display_name} 
  />
  
  {/* 8. Reviews */}
  <CustomerReviews productId={product.id} />
  
  {/* 9. Sticky Bottom Bar */}
  <MobileStickyBar 
    price={product.price} 
    sellerId={seller.id}
    productId={product.id}
  />
</div>
```

### Touch Target Guidelines (WCAG 2.1 AA)

```css
/* Mobile touch targets - minimum 44x44px */
@theme {
  --spacing-touch: 2.75rem;      /* 44px - WCAG AA minimum */
  --spacing-touch-sm: 2.5rem;    /* 40px */
  --spacing-touch-lg: 3rem;      /* 48px */
  --spacing-touch-xl: 3.5rem;    /* 56px */
}
```

---

## 4. Component Breakdown

### 4.1 Mobile Gallery Component

```tsx
// components/shared/product/mobile/mobile-product-gallery.tsx
"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileProductGalleryProps {
  images: Array<{ src: string; alt: string }>
  productId: string
}

export function MobileProductGallery({ images, productId }: MobileProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1)
      }
    }
    setTouchStart(null)
  }, [touchStart, currentIndex, images.length])

  return (
    <div className="relative w-full">
      {/* Main Image Container - 1:1 aspect ratio */}
      <div 
        className="relative aspect-square w-full bg-muted overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[currentIndex]?.src || "/placeholder.svg"}
          alt={images[currentIndex]?.alt || "Product image"}
          fill
          priority={currentIndex === 0}
          sizes="100vw"
          className="object-contain"
        />
        
        {/* Fullscreen button */}
        <button 
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 
                     backdrop-blur-sm border border-border/40 shadow-sm
                     active:scale-95 transition-transform"
          aria-label="View fullscreen"
        >
          <Maximize2 className="w-4 h-4 text-foreground" />
        </button>
        
        {/* Image counter */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 
                        px-2.5 py-1 rounded-full bg-background/80 
                        backdrop-blur-sm text-xs font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 py-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-200",
              idx === currentIndex 
                ? "w-6 bg-primary" 
                : "w-1.5 bg-muted-foreground/30"
            )}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail strip - horizontal scroll */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                idx === currentIndex 
                  ? "border-primary ring-1 ring-primary" 
                  : "border-border/40 hover:border-border"
              )}
            >
              <Image
                src={image.src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 4.2 Category Badge Component

```tsx
// components/shared/product/shared/category-badge.tsx
import { cn } from "@/lib/utils"
import * as LucideIcons from "lucide-react"
import { LucideIcon } from "lucide-react"

// 24 L0 Category Configuration
export const L0_CATEGORIES = {
  electronics: { icon: "Laptop", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  computers: { icon: "Monitor", color: "bg-indigo-500/10 text-indigo-600 border-indigo-200" },
  smartphones: { icon: "Smartphone", color: "bg-violet-500/10 text-violet-600 border-violet-200" },
  "smart-home": { icon: "Home", color: "bg-cyan-500/10 text-cyan-600 border-cyan-200" },
  fashion: { icon: "Shirt", color: "bg-pink-500/10 text-pink-600 border-pink-200" },
  beauty: { icon: "Sparkles", color: "bg-rose-500/10 text-rose-600 border-rose-200" },
  home: { icon: "Sofa", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  garden: { icon: "Flower2", color: "bg-green-500/10 text-green-600 border-green-200" },
  toys: { icon: "Gamepad2", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  sports: { icon: "Dumbbell", color: "bg-orange-500/10 text-orange-600 border-orange-200" },
  automotive: { icon: "Car", color: "bg-slate-500/10 text-slate-600 border-slate-200" },
  books: { icon: "BookOpen", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  gaming: { icon: "Gamepad", color: "bg-red-500/10 text-red-600 border-red-200" },
  music: { icon: "Music", color: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200" },
  movies: { icon: "Film", color: "bg-sky-500/10 text-sky-600 border-sky-200" },
  collectibles: { icon: "Trophy", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200" },
  art: { icon: "Palette", color: "bg-teal-500/10 text-teal-600 border-teal-200" },
  jewelry: { icon: "Gem", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  watches: { icon: "Watch", color: "bg-zinc-500/10 text-zinc-600 border-zinc-200" },
  baby: { icon: "Baby", color: "bg-pink-500/10 text-pink-500 border-pink-200" },
  pets: { icon: "PawPrint", color: "bg-orange-500/10 text-orange-500 border-orange-200" },
  food: { icon: "UtensilsCrossed", color: "bg-lime-500/10 text-lime-600 border-lime-200" },
  health: { icon: "Heart", color: "bg-red-500/10 text-red-500 border-red-200" },
  office: { icon: "Briefcase", color: "bg-gray-500/10 text-gray-600 border-gray-200" },
} as const

type CategorySlug = keyof typeof L0_CATEGORIES

interface CategoryBadgeProps {
  category: {
    name: string
    slug: string
    icon_name?: string
    badge_color?: string
  } | null
  parentCategory?: {
    name: string
    slug: string
  } | null
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export function CategoryBadge({ 
  category, 
  parentCategory,
  size = "sm",
  showIcon = true 
}: CategoryBadgeProps) {
  if (!category) return null

  const categoryConfig = L0_CATEGORIES[category.slug as CategorySlug] 
    || L0_CATEGORIES[parentCategory?.slug as CategorySlug]
    || { icon: "Tag", color: "bg-muted text-muted-foreground border-border" }

  const IconComponent = (LucideIcons[categoryConfig.icon as keyof typeof LucideIcons] as LucideIcon) 
    || LucideIcons.Tag

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2"
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4"
  }

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        categoryConfig.color,
        sizeClasses[size]
      )}
    >
      {showIcon && <IconComponent className={iconSizes[size]} />}
      <span>{parentCategory?.name || category.name}</span>
    </span>
  )
}
```

### 4.3 Mobile Seller Card Component

```tsx
// components/shared/product/mobile/mobile-seller-banner.tsx
"use client"

import { BadgeCheck, Star, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileSellerBannerProps {
  seller: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
    verified: boolean
    stats?: {
      positive_feedback_pct: number
      total_reviews: number
      member_since: string
    }
  }
  onMessageClick?: () => void
}

export function MobileSellerBanner({ seller, onMessageClick }: MobileSellerBannerProps) {
  const displayName = seller.display_name || seller.username
  const feedbackPct = seller.stats?.positive_feedback_pct || 0
  const reviewCount = seller.stats?.total_reviews || 0
  const starCount = feedbackPct >= 95 ? 5 : feedbackPct >= 80 ? 4 : feedbackPct >= 60 ? 3 : 2

  return (
    <div className="bg-card border-b border-border">
      {/* Main Row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with online indicator */}
          <div className="relative shrink-0">
            <Avatar className="h-11 w-11 border border-border/50">
              <AvatarImage src={seller.avatar_url || undefined} />
              <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 
                            bg-emerald-500 border-[2.5px] border-card rounded-full" />
          </div>

          {/* Seller Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-foreground truncate">
                {displayName}
              </span>
              {seller.verified && (
                <BadgeCheck className="w-4 h-4 text-cta-trust-blue shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {reviewCount > 0 ? (
                <>
                  <div className="flex text-amber-400">
                    {[...Array(starCount)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span>{Math.round(feedbackPct)}% positive</span>
                </>
              ) : (
                <span>New seller</span>
              )}
            </div>
          </div>
        </div>

        {/* Message Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onMessageClick}
          className="h-9 px-3 gap-1.5 text-xs shrink-0"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Chat
        </Button>
      </div>

      {/* Performance Metrics Row */}
      <div className="grid grid-cols-3 border-t border-border/50 bg-muted/30">
        <div className="py-2 text-center">
          <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
            Response
          </span>
          <span className="block text-sm font-medium text-foreground">&lt; 1hr</span>
        </div>
        <div className="py-2 text-center border-l border-border/50">
          <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
            Ships
          </span>
          <span className="block text-sm font-medium text-foreground">24hrs</span>
        </div>
        <div className="py-2 text-center border-l border-border/50">
          <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
            Member
          </span>
          <span className="block text-sm font-medium text-foreground">
            {new Date(seller.stats?.member_since || Date.now()).getFullYear()}
          </span>
        </div>
      </div>
    </div>
  )
}
```

### 4.4 Mobile Sticky Bottom Bar

```tsx
// components/shared/product/mobile/mobile-sticky-bar.tsx
"use client"

import { Heart, ShoppingCart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileStickyBarProps {
  price: number
  originalPrice?: number
  currency: string
  isFreeShipping?: boolean
  onBuyNow?: () => void
  onAddToCart?: () => void
  onMessage?: () => void
}

export function MobileStickyBar({
  price,
  originalPrice,
  currency,
  isFreeShipping,
  onBuyNow,
  onAddToCart,
  onMessage
}: MobileStickyBarProps) {
  const formattedPrice = new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2
  }).format(price)

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 
                    bg-background/95 backdrop-blur-md border-t border-border
                    safe-area-inset-bottom">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        {/* Price Section */}
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-foreground tracking-tight">
              {formattedPrice}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                {new Intl.NumberFormat("bg-BG", {
                  style: "currency",
                  currency: currency,
                }).format(originalPrice)}
              </span>
            )}
          </div>
          {isFreeShipping && (
            <span className="text-[10px] text-emerald-600 font-medium">
              Free shipping
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
            aria-label="Save to wishlist"
          >
            <Heart className="w-5 h-5" />
          </Button>

          {/* Message Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onMessage}
            className="h-10 w-10 shrink-0"
            aria-label="Message seller"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>

          {/* Buy Now Button */}
          <Button
            onClick={onBuyNow}
            className="h-10 px-6 bg-primary hover:bg-primary/90 
                       text-primary-foreground font-semibold"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### 4.5 Mobile Accordions Component

```tsx
// components/shared/product/mobile/mobile-accordions.tsx
"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface MobileAccordionsProps {
  description: string
  attributes?: Record<string, unknown>
  shippingText: string
  returnsText: string
  details?: Array<{ label: string; value: string }>
}

export function MobileAccordions({
  description,
  attributes,
  shippingText,
  returnsText,
  details
}: MobileAccordionsProps) {
  return (
    <div className="lg:hidden">
      <Accordion type="multiple" defaultValue={["description"]} className="w-full">
        {/* Description */}
        <AccordionItem value="description" className="border-b border-border/50">
          <AccordionTrigger className="px-4 py-3.5 hover:no-underline">
            <span className="text-sm font-semibold">Description</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {description || "No description provided."}
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Item Specifics */}
        <AccordionItem value="specifics" className="border-b border-border/50">
          <AccordionTrigger className="px-4 py-3.5 hover:no-underline">
            <span className="text-sm font-semibold">Item Specifics</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              {details?.map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
              {attributes && Object.entries(attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="font-medium text-foreground">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Shipping & Returns */}
        <AccordionItem value="shipping" className="border-b border-border/50">
          <AccordionTrigger className="px-4 py-3.5 hover:no-underline">
            <span className="text-sm font-semibold">Shipping & Returns</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Shipping
              </span>
              <p className="text-sm text-foreground mt-1">{shippingText}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Returns
              </span>
              <p className="text-sm text-foreground mt-1">{returnsText}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
```

---

## 5. Tailwind CSS v4 Design Tokens

### Complete Token System for Mobile Product Page

Add these to your `app/globals.css`:

```css
@theme {
  /* ===== MOBILE-SPECIFIC SPACING ===== */
  --spacing-mobile-xs: 0.5rem;    /* 8px */
  --spacing-mobile-sm: 0.75rem;   /* 12px */
  --spacing-mobile: 1rem;         /* 16px - base mobile padding */
  --spacing-mobile-lg: 1.25rem;   /* 20px */
  --spacing-mobile-xl: 1.5rem;    /* 24px */
  
  /* ===== PRODUCT PAGE SPECIFIC TOKENS ===== */
  
  /* Gallery */
  --gallery-aspect-ratio: 1;              /* 1:1 for mobile */
  --gallery-thumbnail-size: 4rem;         /* 64px */
  --gallery-dot-size: 0.375rem;           /* 6px */
  --gallery-dot-active-width: 1.5rem;     /* 24px */
  
  /* Category Badge Colors (24 categories) */
  --color-category-electronics: oklch(0.55 0.16 250);
  --color-category-fashion: oklch(0.65 0.20 330);
  --color-category-home: oklch(0.70 0.14 80);
  --color-category-sports: oklch(0.65 0.18 45);
  --color-category-beauty: oklch(0.70 0.18 350);
  --color-category-toys: oklch(0.60 0.22 290);
  --color-category-automotive: oklch(0.50 0.08 250);
  --color-category-gaming: oklch(0.55 0.22 25);
  --color-category-books: oklch(0.55 0.14 145);
  --color-category-music: oklch(0.60 0.22 310);
  --color-category-collectibles: oklch(0.75 0.18 90);
  --color-category-jewelry: oklch(0.70 0.16 80);
  
  /* Seller Card */
  --seller-avatar-size: 2.75rem;          /* 44px */
  --seller-badge-size: 0.875rem;          /* 14px */
  --seller-online-indicator: 0.875rem;    /* 14px */
  
  /* Sticky Bar */
  --sticky-bar-height: 4.5rem;            /* 72px */
  --sticky-bar-safe-bottom: env(safe-area-inset-bottom, 0);
  
  /* Buy Box */
  --buybox-button-height: 2.75rem;        /* 44px touch target */
  --buybox-gap: 0.75rem;                  /* 12px */
  
  /* Product Price */
  --price-sale-color: var(--color-foreground);
  --price-original-color: var(--color-muted-foreground);
  --price-discount-bg: oklch(0.95 0.03 145);
  --price-discount-text: oklch(0.45 0.14 145);
  
  /* Condition Badges */
  --condition-new-bg: oklch(0.95 0.03 145);
  --condition-new-text: oklch(0.45 0.14 145);
  --condition-used-bg: oklch(0.95 0.03 60);
  --condition-used-text: oklch(0.50 0.12 60);
  --condition-refurbished-bg: oklch(0.95 0.03 250);
  --condition-refurbished-text: oklch(0.50 0.14 250);
  
  /* Trust Indicators */
  --trust-shield-bg: oklch(0.95 0.02 250);
  --trust-shield-icon: oklch(0.55 0.16 250);
  --trust-shipping-bg: oklch(0.96 0 0);
  --trust-shipping-icon: oklch(0.50 0 0);
  
  /* Accordions */
  --accordion-header-height: 3.5rem;      /* 56px */
  --accordion-padding: 1rem;              /* 16px */
  
  /* Reviews */
  --review-star-color: oklch(0.78 0.18 90);
  --review-star-empty: oklch(0.88 0.03 90);
  --review-avatar-size: 2.5rem;           /* 40px */
}

/* ===== SAFE AREA UTILITIES ===== */
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.pb-sticky-bar {
  padding-bottom: calc(var(--sticky-bar-height) + env(safe-area-inset-bottom, 0));
}

/* ===== NO SCROLLBAR UTILITY ===== */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ===== MOBILE GALLERY SWIPE ===== */
.touch-pan-x {
  touch-action: pan-x;
}

/* ===== PRODUCT IMAGE ZOOM PREVENTION ===== */
.product-image {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
```

---

## 6. shadcn/ui Component Strategy

### Component Usage Map

| Feature | shadcn Component | Customization |
|---------|------------------|---------------|
| **Gallery** | Custom (no shadcn) | Touch gestures, swipe |
| **Seller Card** | `Avatar`, `Button` | Badge layout |
| **Price** | Custom | Currency formatting |
| **Category Badge** | `Badge` variant | Custom colors per category |
| **Buy Box** | `Button`, `Form`, `RadioGroup` | Touch-optimized sizing |
| **Accordions** | `Accordion` | Mobile-first open states |
| **Reviews** | `Avatar`, `Progress` | Star rating component |
| **Sticky Bar** | Custom | Safe area handling |
| **Message Dialog** | `Dialog`, `Sheet` | Bottom sheet on mobile |
| **Toast** | `Sonner` | Cart add confirmations |

### Required shadcn Components

```bash
# Install required shadcn components
npx shadcn@latest add accordion avatar badge button card dialog \
  form input label progress radio-group scroll-area separator \
  sheet skeleton sonner textarea
```

### Component Extensions Needed

```tsx
// components/ui/badge.tsx - Add category variants
export const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "...",
        secondary: "...",
        destructive: "...",
        outline: "...",
        // Category variants (24 total)
        electronics: "bg-blue-500/10 text-blue-600 border-blue-200",
        fashion: "bg-pink-500/10 text-pink-600 border-pink-200",
        home: "bg-amber-500/10 text-amber-600 border-amber-200",
        // ... add all 24
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

---

## 7. 24 L0 Categories System

### Complete Category Configuration

```typescript
// config/categories.ts
export const L0_CATEGORIES = [
  { slug: "electronics", name: "Electronics", icon: "Laptop", color: "blue" },
  { slug: "computers", name: "Computers", icon: "Monitor", color: "indigo" },
  { slug: "smartphones", name: "Smartphones", icon: "Smartphone", color: "violet" },
  { slug: "smart-home", name: "Smart Home", icon: "Home", color: "cyan" },
  { slug: "fashion", name: "Fashion", icon: "Shirt", color: "pink" },
  { slug: "beauty", name: "Beauty", icon: "Sparkles", color: "rose" },
  { slug: "home", name: "Home & Kitchen", icon: "Sofa", color: "amber" },
  { slug: "garden", name: "Garden & Outdoor", icon: "Flower2", color: "green" },
  { slug: "toys", name: "Toys & Games", icon: "Gamepad2", color: "purple" },
  { slug: "sports", name: "Sports & Fitness", icon: "Dumbbell", color: "orange" },
  { slug: "automotive", name: "Automotive", icon: "Car", color: "slate" },
  { slug: "books", name: "Books & Media", icon: "BookOpen", color: "emerald" },
  { slug: "gaming", name: "Gaming", icon: "Gamepad", color: "red" },
  { slug: "music", name: "Music & Audio", icon: "Music", color: "fuchsia" },
  { slug: "movies", name: "Movies & TV", icon: "Film", color: "sky" },
  { slug: "collectibles", name: "Collectibles", icon: "Trophy", color: "yellow" },
  { slug: "art", name: "Art & Crafts", icon: "Palette", color: "teal" },
  { slug: "jewelry", name: "Jewelry", icon: "Gem", color: "amber" },
  { slug: "watches", name: "Watches", icon: "Watch", color: "zinc" },
  { slug: "baby", name: "Baby & Kids", icon: "Baby", color: "pink" },
  { slug: "pets", name: "Pets", icon: "PawPrint", color: "orange" },
  { slug: "food", name: "Food & Grocery", icon: "UtensilsCrossed", color: "lime" },
  { slug: "health", name: "Health & Wellness", icon: "Heart", color: "red" },
  { slug: "office", name: "Office & Business", icon: "Briefcase", color: "gray" },
] as const

// Migration SQL for 24 categories
export const CATEGORY_SEED_SQL = `
INSERT INTO public.categories (name, slug, icon_name, badge_color, display_order)
VALUES
  ('Electronics', 'electronics', 'Laptop', 'blue', 1),
  ('Computers', 'computers', 'Monitor', 'indigo', 2),
  ('Smartphones', 'smartphones', 'Smartphone', 'violet', 3),
  ('Smart Home', 'smart-home', 'Home', 'cyan', 4),
  ('Fashion', 'fashion', 'Shirt', 'pink', 5),
  ('Beauty', 'beauty', 'Sparkles', 'rose', 6),
  ('Home & Kitchen', 'home', 'Sofa', 'amber', 7),
  ('Garden & Outdoor', 'garden', 'Flower2', 'green', 8),
  ('Toys & Games', 'toys', 'Gamepad2', 'purple', 9),
  ('Sports & Fitness', 'sports', 'Dumbbell', 'orange', 10),
  ('Automotive', 'automotive', 'Car', 'slate', 11),
  ('Books & Media', 'books', 'BookOpen', 'emerald', 12),
  ('Gaming', 'gaming', 'Gamepad', 'red', 13),
  ('Music & Audio', 'music', 'Music', 'fuchsia', 14),
  ('Movies & TV', 'movies', 'Film', 'sky', 15),
  ('Collectibles', 'collectibles', 'Trophy', 'yellow', 16),
  ('Art & Crafts', 'art', 'Palette', 'teal', 17),
  ('Jewelry', 'jewelry', 'Gem', 'amber', 18),
  ('Watches', 'watches', 'Watch', 'zinc', 19),
  ('Baby & Kids', 'baby', 'Baby', 'pink', 20),
  ('Pets', 'pets', 'PawPrint', 'orange', 21),
  ('Food & Grocery', 'food', 'UtensilsCrossed', 'lime', 22),
  ('Health & Wellness', 'health', 'Heart', 'red', 23),
  ('Office & Business', 'office', 'Briefcase', 'gray', 24)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon_name = EXCLUDED.icon_name,
  badge_color = EXCLUDED.badge_color,
  display_order = EXCLUDED.display_order;
`
```

---

## 8. Seller Messaging UX

### Mobile Message Flow

```tsx
// components/shared/messaging/message-sheet.tsx
"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MessageSheetProps {
  seller: {
    id: string
    display_name: string
    avatar_url: string | null
  }
  product: {
    id: string
    title: string
    price: number
    image: string
  }
  trigger: React.ReactNode
}

export function MessageSheet({ seller, product, trigger }: MessageSheetProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    setIsSending(true)
    
    // TODO: Implement Supabase message send
    // await sendMessage({ sellerId: seller.id, productId: product.id, content: message })
    
    setIsSending(false)
    setMessage("")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={seller.avatar_url || undefined} />
              <AvatarFallback>
                {seller.display_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <span className="block text-sm font-semibold">
                Message {seller.display_name}
              </span>
              <span className="block text-xs text-muted-foreground">
                Usually responds in &lt; 1 hour
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Product Context Card */}
        <div className="flex gap-3 p-4 bg-muted/50 rounded-lg my-4">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-16 h-16 rounded-md object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{product.title}</p>
            <p className="text-sm text-primary font-semibold">
              {new Intl.NumberFormat("bg-BG", {
                style: "currency",
                currency: "BGN"
              }).format(product.price)}
            </p>
          </div>
        </div>

        {/* Quick Messages */}
        <div className="flex gap-2 flex-wrap mb-4">
          {[
            "Is this still available?",
            "What's the lowest price?",
            "Can you ship today?"
          ].map((quick) => (
            <button
              key={quick}
              onClick={() => setMessage(quick)}
              className="px-3 py-1.5 text-xs border border-border rounded-full
                         hover:bg-muted transition-colors"
            >
              {quick}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button 
              onClick={handleSend} 
              disabled={!message.trim() || isSending}
              size="icon"
              className="h-11 w-11 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

---

## 9. Production Checklist

### Performance

- [ ] Next.js Image optimization with `sizes` prop for all images
- [ ] Lazy loading for below-fold content
- [ ] Skeleton loading states for all async content
- [ ] Preload critical fonts (Inter)
- [ ] Edge caching for static product data

### Accessibility

- [ ] All touch targets ≥ 44x44px
- [ ] Focus states for all interactive elements
- [ ] Screen reader labels for icons
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Reduced motion support

### Mobile UX

- [ ] iOS Safari safe area insets
- [ ] Prevent zoom on input focus (16px font)
- [ ] Pull-to-refresh disabled on gallery
- [ ] Bottom sheet for modals (not center dialog)
- [ ] Horizontal scroll for related products

### SEO

- [ ] JSON-LD Product schema
- [ ] JSON-LD BreadcrumbList
- [ ] OpenGraph meta tags
- [ ] Canonical URLs
- [ ] Alt text for all images

### Analytics

- [ ] Product view tracking
- [ ] Add to cart events
- [ ] Message seller events
- [ ] Gallery interaction events

---

## 10. Implementation Phases

### Phase 1: Core Mobile Layout (Day 1-2)

1. ✅ Review existing components
2. [ ] Create mobile gallery component with swipe
3. [ ] Implement category badge with 24 variants
4. [ ] Build mobile seller banner
5. [ ] Create mobile sticky bar

### Phase 2: Supabase Integration (Day 2-3)

1. [ ] Update schema with new columns
2. [ ] Create 24 category seed data
3. [ ] Implement seller stats view
4. [ ] Add messaging tables
5. [ ] Update data fetching functions

### Phase 3: Buy Box & Actions (Day 3-4)

1. [ ] Mobile buy box layout
2. [ ] Add to cart functionality
3. [ ] Wishlist integration
4. [ ] Message sheet component

### Phase 4: Content Sections (Day 4-5)

1. [ ] Mobile accordions for specs
2. [ ] Seller products grid
3. [ ] Customer reviews section
4. [ ] Trust badges

### Phase 5: Polish & Testing (Day 5-6)

1. [ ] Loading skeletons
2. [ ] Error states
3. [ ] E2E tests with Playwright
4. [ ] Performance audit
5. [ ] Accessibility audit

---

## Quick Reference: Component Grid Classes

```tsx
// Mobile Gallery Thumbnails
className="grid grid-cols-4 gap-2"

// Seller Products Grid (Mobile)
className="grid grid-cols-2 gap-3"

// Seller Products Grid (Desktop)  
className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10"

// Product Page Main Layout
className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"

// Desktop Columns
className="lg:col-span-7" // Left (gallery)
className="lg:col-span-5" // Right (sticky sidebar)

// Sticky Sidebar
className="lg:sticky lg:top-24"
```

---

## Files to Create/Modify

| File | Action | Priority |
|------|--------|----------|
| `components/shared/product/mobile/mobile-product-gallery.tsx` | Create | P0 |
| `components/shared/product/shared/category-badge.tsx` | Create | P0 |
| `components/shared/product/mobile/mobile-seller-banner.tsx` | Modify | P0 |
| `components/shared/product/mobile/mobile-sticky-bar.tsx` | Modify | P0 |
| `components/shared/product/mobile/mobile-accordions.tsx` | Modify | P1 |
| `components/shared/messaging/message-sheet.tsx` | Create | P1 |
| `app/globals.css` | Add tokens | P0 |
| `config/categories.ts` | Create | P0 |
| `supabase/migrations/add_categories_and_messaging.sql` | Create | P1 |
| `lib/data/product-page.ts` | Modify | P0 |

---

*Document generated: December 27, 2025*
*Based on: shadcn/ui v4, Tailwind CSS v4, Next.js 15, Supabase*
