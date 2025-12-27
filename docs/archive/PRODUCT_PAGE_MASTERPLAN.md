# 🛍️ AMAZONG PRODUCT PAGE MASTERPLAN
> **Version 2.0** | December 27, 2025  
> Production-Ready C2C Marketplace Product Page Architecture

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Data Architecture](#data-architecture)
4. [Component Architecture](#component-architecture)
5. [Design System & Tokens](#design-system--tokens)
6. [Layout & Grid System](#layout--grid-system)
7. [Component Specifications](#component-specifications)
8. [shadcn/ui Component Usage](#shadcnui-component-usage)
9. [Mobile Optimization](#mobile-optimization)
10. [Performance & SEO](#performance--seo)
11. [Implementation Checklist](#implementation-checklist)

---

## 1. EXECUTIVE SUMMARY

### 🎯 Goals
- **100% Supabase-driven** product pages from `/sell` listings
- **35 L0 categories** with visual badges/icons
- **Pixel-perfect** Tailwind CSS v4 grid layouts
- **Production-ready** with optimal UX/UI
- **C2C marketplace focus** (eBay/Vinted/Facebook Marketplace style)

### 🏗️ Key Components
1. **Seller Banner** - Trust-building header with seller info
2. **Image Gallery** - Next.js Image + PhotoSwipe lightbox
3. **Buy Box** - Price, actions, shipping, payments
4. **Product Info** - Description, attributes, specifics
5. **Category Badge** - L0 category with icon
6. **Contact Seller** - Messaging CTA
7. **More from Seller** - Related products grid
8. **Reviews Section** - Customer reviews with ratings
9. **Similar Items** - Recommendation bar

---

## 2. CURRENT STATE ANALYSIS

### ✅ What Exists
```
app/[locale]/[username]/[productSlug]/page.tsx  ← Main entry
lib/data/product-page.ts                        ← Data fetching (cached)
components/shared/product/
├── ultimate-c2c-product-page.tsx               ← Current layout (needs work)
├── product-gallery-hybrid.tsx                  ← PhotoSwipe gallery
├── product-buy-box.tsx                         ← Buy box (eBay style)
├── customer-reviews-hybrid.tsx                 ← Reviews section
├── mobile-seller-card.tsx                      ← Mobile seller card
├── seller-products-grid.tsx                    ← More from seller
├── mobile-sticky-bar.tsx                       ← Mobile CTA bar
└── ...
```

### ❌ Issues to Fix
1. **UltimateC2CProductPage** uses hardcoded gray colors instead of design tokens
2. **No L0 category badge** displayed on product page
3. **Contact seller** exists but not integrated into buy box properly
4. **Seller stats** fetched but not displayed (response time, rating)
5. **Missing** proper dark mode support (hardcoded colors)
6. **Reviews** using mock data, not connected to Supabase
7. **Breadcrumbs** commented out
8. **No Seller's Note** section (product description from seller perspective)
9. **Seller metrics** not displayed in clean 3-column format
10. **Payment methods** not visually shown
11. **Report button** not prominent enough

### ✨ Design Inspirations to Adopt
From analysis of reference C2C layouts, we should incorporate:

| Pattern | Source | Implementation |
|---------|--------|----------------|
| **Seller's Note** | Reference HTML | Quote-styled section with indent |
| **3-Column Metrics** | Reference HTML | Response/Shipped/Since grid |
| **Payment Footer** | Reference HTML | Icons + Report button row |
| **Bento Gallery** | Reference HTML | Already have (PhotoSwipe) |
| **Sticky Sidebar** | Reference HTML | Already have |
| **Trust Badges** | Reference HTML | Already have (needs tokens) |

### ❌ Patterns to AVOID (from reference)
- ❌ Hardcoded `gray-*` colors (breaks dark mode)
- ❌ `hover:scale-[1.02]` transforms (we disabled zoom)
- ❌ No mobile-specific layout
- ❌ No category badge
- ❌ No reviews section
- ❌ CDN-loaded icons (we use tree-shaken)

### 📊 Database Schema (Products Table)
```typescript
products: {
  id: string
  seller_id: string              // FK → profiles.id
  category_id: string | null     // FK → categories.id
  title: string
  description: string | null
  price: number
  list_price: number | null      // Strike-through price
  images: string[] | null
  rating: number | null
  review_count: number | null
  stock: number
  slug: string | null            // SEO-friendly URL
  condition: string | null       // New, Used, Refurbished
  attributes: Json | null        // Flexible key-value
  tags: string[] | null
  is_boosted: boolean | null
  is_featured: boolean | null
  free_shipping: boolean | null
  ships_to_bulgaria: boolean
  ships_to_europe: boolean
  shipping_days: number | null
  status: string                 // active, sold, paused
  created_at: string
  updated_at: string
}
```

### 📊 Categories Schema (35 L0 Categories)
```typescript
categories: {
  id: string
  name: string                   // English name
  name_bg: string | null         // Bulgarian name
  slug: string                   // URL-friendly
  icon: string | null            // Emoji or Lucide icon name
  description: string | null
  parent_id: string | null       // NULL = L0 (root)
  display_order: number | null
  image_url: string | null
}
```

### 📊 L0 Categories (35 Root Categories)
| # | Slug | Name (EN) | Name (BG) | Icon |
|---|------|-----------|-----------|------|
| 1 | fashion | Fashion | Мода | 👗 |
| 2 | electronics | Electronics | Електроника | 📱 |
| 3 | automotive | Automotive | Автомобили | 🚗 |
| 4 | home | Home & Kitchen | Дом и Кухня | 🏠 |
| 5 | sports | Sports & Outdoors | Спорт и туризъм | ⚽ |
| 6 | beauty | Beauty | Красота | 💄 |
| 7 | toys | Toys & Hobbies | Играчки и хобита | 🧸 |
| 8 | gaming | Gaming | Гейминг | 🎮 |
| 9 | computers | Computers | Компютри | 💻 |
| 10 | books | Books & Magazines | Книги и списания | 📚 |
| 11 | pets | Pet Supplies | Зоомагазин | 🐕 |
| 12 | baby-kids | Baby & Kids | Бебета и деца | 👶 |
| 13 | health-wellness | Health & Wellness | Здраве | 💊 |
| 14 | garden-outdoor | Garden & Outdoor | Градина | 🌱 |
| 15 | jewelry-watches | Jewelry & Watches | Бижута и часовници | 💎 |
| 16 | collectibles | Collectibles & Art | Колекционерски | 🎨 |
| 17 | movies-music | Movies & Music | Филми и музика | 🎬 |
| 18 | musical-instruments | Musical Instruments | Музикални инструменти | 🎸 |
| 19 | office-school | Office & School | Офис и училище | 📝 |
| 20 | cameras-photo | Cameras & Photo | Фото и видео | 📷 |
| 21 | cell-phones | Cell Phones | Телефони | 📱 |
| 22 | smart-home | Smart Home | Умен дом | 🏠 |
| 23 | tools-home | Tools & Hardware | Инструменти | 🔧 |
| 24 | industrial | Industrial & Scientific | Индустриално | 🏭 |
| 25 | grocery | Grocery & Food | Храна | 🛒 |
| 26 | handmade | Handmade & Crafts | Ръчна изработка | 🧶 |
| 27 | services | Services | Услуги | 🛠️ |
| 28 | real-estate | Real Estate | Имоти | 🏡 |
| 29 | software | Software & Digital | Софтуер | 💿 |
| 30 | gift-cards | Gift Cards | Ваучери | 🎁 |
| 31 | bulgarian-traditional | Bulgarian Traditional | Българско | 🇧🇬 |
| 32 | e-mobility | E-Mobility | Електромобилност | ⚡ |
| 33 | agriculture | Agriculture | Земеделие | 🚜 |
| 34 | tickets | Tickets & Events | Билети | 🎟️ |
| 35 | wholesale | Wholesale | Търговия на едро | 📦 |

---

## 3. DATA ARCHITECTURE

### 3.1 Product Page Data Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                    /[username]/[productSlug]                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              fetchProductByUsernameAndSlug()                    │
│    • Uses 'use cache' with cacheTag('products', 'product')      │
│    • Joins: seller (profiles), category (categories)            │
│    • Falls back to two-step query if join fails                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Product Object Shape                         │
├─────────────────────────────────────────────────────────────────┤
│ {                                                               │
│   id, title, description, price, list_price,                    │
│   images[], rating, review_count, stock, slug, condition,       │
│   attributes: { brand, color, size, ... },                      │
│   tags[], is_boosted, free_shipping,                            │
│   ships_to_bulgaria, shipping_days, status,                     │
│   seller: {                                                     │
│     id, username, display_name, avatar_url, verified,           │
│     is_seller, created_at                                       │
│   },                                                            │
│   category: {                                                   │
│     id, name, name_bg, slug, icon, parent_id                    │
│   },                                                            │
│   seller_stats: {                                               │
│     average_rating, total_reviews, response_time_hours,         │
│     positive_feedback_pct, shipped_on_time_pct,                 │
│     total_sales, follower_count                                 │
│   }                                                             │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Required Data Fetches
```typescript
// lib/data/product-page.ts - ALREADY EXISTS, NEEDS ENHANCEMENT

// 1. Main product fetch (exists)
fetchProductByUsernameAndSlug(username, slug)

// 2. Seller's other products (exists)
fetchSellerProducts(sellerId, excludeProductId, limit)

// 3. NEW: Fetch reviews for product
fetchProductReviews(productId, page, limit)

// 4. NEW: Fetch L0 (root) category for breadcrumb
fetchRootCategory(categoryId)

// 5. NEW: Check if current user has liked/wishlisted
fetchUserProductInteraction(userId, productId)
```

### 3.3 Enhanced Supabase Query
```typescript
// Enhanced product query with full category hierarchy
const { data: product } = await supabase
  .from("products")
  .select(`
    *,
    seller:profiles!products_seller_id_fkey (
      id, username, display_name, avatar_url, verified,
      is_seller, created_at, account_type
    ),
    category:categories (
      id, name, name_bg, slug, icon, parent_id, description,
      parent:categories!categories_parent_id_fkey (
        id, name, name_bg, slug, icon
      )
    ),
    reviews (
      id, rating, comment, created_at,
      user:profiles!reviews_user_id_fkey (
        id, display_name, avatar_url
      )
    )
  `)
  .eq("slug", productSlug)
  .eq("seller.username", username)
  .single()
```

---

## 4. COMPONENT ARCHITECTURE

### 4.1 Component Tree
```
ProductPage (Server Component)
├── JsonLd (SEO structured data)
├── RecentlyViewedTracker (Client)
├── ProductPageContent
│   ├── Desktop Layout (lg+)
│   │   ├── SellerBanner
│   │   ├── Grid [col-span-7, col-span-5]
│   │   │   ├── Left Column
│   │   │   │   ├── Breadcrumb (with L0 category)
│   │   │   │   ├── ProductGallery
│   │   │   │   ├── CategoryBadge (L0)
│   │   │   │   └── ItemSpecifics
│   │   │   └── Right Column (Sticky)
│   │   │       ├── ProductTitle
│   │   │       ├── ProductPrice
│   │   │       ├── SellerCard (mini)
│   │   │       ├── BuyActions (Buy Now, Add to Cart)
│   │   │       ├── ContactSellerButton
│   │   │       ├── ShippingInfo
│   │   │       └── TrustBadges
│   │   ├── ProductDescription
│   │   ├── SellerProductsGrid ("More from Seller")
│   │   └── CustomerReviews
│   │
│   └── Mobile Layout (<lg)
│       ├── ProductGallery (carousel)
│       ├── MobileSellerCard
│       ├── ProductTitle
│       ├── ProductPrice
│       ├── CategoryBadge
│       ├── MobileAccordions (Description, Shipping, Seller)
│       ├── SellerProductsGrid
│       ├── CustomerReviews
│       └── MobileStickyBar (fixed bottom)
```

### 4.2 New Components Needed
```
components/shared/product/
├── category-badge.tsx          ← NEW: L0 category display
├── product-page-layout.tsx     ← NEW: Unified desktop/mobile wrapper
├── seller-banner.tsx           ← NEW: Full-width seller header
├── seller-card-desktop.tsx     ← NEW: Detailed seller card
├── product-info-section.tsx    ← NEW: Title + price + actions
├── shipping-info.tsx           ← NEW: Delivery estimates
├── trust-badges.tsx            ← NEW: Buyer protection icons
├── wishlist-button.tsx         ← NEW: Heart/save functionality
└── report-button.tsx           ← NEW: Flag listing
```

---

## 5. DESIGN SYSTEM & TOKENS

### 5.1 Current Tailwind v4 Tokens (globals.css)
```css
/* === PRODUCT PAGE SPECIFIC === */
/* Seller Card */
--color-seller-card: oklch(0.98 0.01 250);
--color-seller-card-border: oklch(0.90 0.01 250);
--color-seller-banner: oklch(0.50 0.20 255);
--color-seller-banner-text: oklch(1 0 0);

/* Product Container */
--color-product-container-bg: oklch(1 0 0);
--color-product-container-border: oklch(0.90 0 0);

/* CTA Buttons */
--color-cta-primary: oklch(0.48 0.22 260);
--color-cta-trust-blue: oklch(0.50 0.20 255);

/* Prices */
--color-price-regular: oklch(0.15 0.01 250);
--color-price-sale: oklch(0.50 0.22 27);
--color-price-original: oklch(0.55 0.01 250);
--color-price-savings: oklch(0.50 0.18 145);

/* Ratings */
--color-rating: oklch(0.78 0.18 90);
--color-rating-empty: oklch(0.88 0.03 90);
```

### 5.2 NEW Tokens to Add
```css
@theme {
  /* === CATEGORY BADGE TOKENS === */
  --color-category-badge-bg: oklch(0.95 0.02 250);
  --color-category-badge-text: oklch(0.35 0.05 250);
  --color-category-badge-border: oklch(0.88 0.02 250);
  --color-category-badge-icon: oklch(0.50 0.15 250);

  /* === PRODUCT PAGE LAYOUT === */
  --spacing-product-gap: 2rem;          /* 32px - between major sections */
  --spacing-product-gap-sm: 1rem;       /* 16px - between related items */
  --spacing-product-sticky-top: 6rem;   /* 96px - sticky sidebar offset */

  /* === CONDITION BADGES === */
  --color-condition-new: oklch(0.55 0.18 145);
  --color-condition-like-new: oklch(0.55 0.15 200);
  --color-condition-good: oklch(0.55 0.12 250);
  --color-condition-fair: oklch(0.65 0.12 60);
  --color-condition-poor: oklch(0.50 0.15 30);

  /* === STOCK STATUS === */
  --color-stock-high: oklch(0.55 0.18 145);    /* In Stock (green) */
  --color-stock-low: oklch(0.65 0.15 60);      /* Low Stock (orange) */
  --color-stock-out: oklch(0.50 0.18 25);      /* Out of Stock (red) */

  /* === SHIPPING BADGES === */
  --color-shipping-free-bg: oklch(0.95 0.03 145);
  --color-shipping-free-text: oklch(0.40 0.15 145);
  --color-shipping-fast-bg: oklch(0.95 0.03 250);
  --color-shipping-fast-text: oklch(0.40 0.15 250);
}
```

### 5.3 Typography Scale (Already Defined)
```css
/* Professional scale (Amazon/eBay inspired) */
--text-tiny: 0.6875rem;    /* 11px - micro text */
--text-body: 0.875rem;     /* 14px - body copy */
--text-price: 1rem;        /* 16px - prices */
--font-size-2xs: 0.625rem; /* 10px - badges */
```

---

## 6. LAYOUT & GRID SYSTEM

### 6.1 Desktop Layout (1440px container)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            SELLER BANNER (full width)                        │
│  [Avatar] Store Name | ⭐ 4.9 (234) | 98% Positive | Member since 2022       │
│  [Follow] [Message]                                                          │
└──────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────┬──────────────────────────────────────────┐
│          LEFT COL (58%)           │            RIGHT COL (42%)               │
│          lg:col-span-7            │            lg:col-span-5                 │
├───────────────────────────────────┼──────────────────────────────────────────┤
│                                   │ [STICKY top-24]                          │
│  Breadcrumb: Home > Electronics   │                                          │
│  > Cell Phones > iPhone           │  📱 Fashion (L0 Badge)                   │
│                                   │                                          │
│  ┌─────────────────────────────┐  │  iPhone 15 Pro Max 256GB                 │
│  │                             │  │  Space Titanium · Unlocked               │
│  │                             │  │                                          │
│  │      MAIN IMAGE             │  │  2,199.00 лв.  ̶2̶,̶4̶9̶9̶.̶0̶0̶ ̶л̶в̶.̶  -12%   │
│  │      (aspect-square)        │  │                                          │
│  │                             │  │  ┌──────────────────────────────────┐    │
│  │                             │  │  │ [Avatar] seller_username         │    │
│  └─────────────────────────────┘  │  │ ⭐4.9 · 98% positive · <1hr      │    │
│                                   │  │ [View Profile] [💬]              │    │
│  [thumb1] [thumb2] [thumb3] [+3]  │  └──────────────────────────────────┘    │
│                                   │                                          │
│  ┌─────────────────────────────┐  │  [====== Buy Now ======]                 │
│  │  ITEM SPECIFICS             │  │  [--- Add to Cart ---]                   │
│  │  Condition: Open Box ●      │  │  [♡ Add to Watchlist]                    │
│  │  Storage: 256GB             │  │                                          │
│  │  Battery: 100%              │  │  ┌──────────────────────────────────┐    │
│  │  Model: A3102 (EU)          │  │  │ 🛡️ Buyer Protection              │    │
│  └─────────────────────────────┘  │  │ Money held until delivery        │    │
│                                   │  │                                  │    │
│                                   │  │ 🚚 Standard Shipping ~6.50лв.    │    │
│                                   │  │ Est. delivery: Tue, Jan 2        │    │
│                                   │  └──────────────────────────────────┘    │
│                                   │                                          │
│                                   │  [Visa] [MC] [ApplePay] | 🚩 Report      │
└───────────────────────────────────┴──────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                          PRODUCT DESCRIPTION                                 │
│  About this item                                                             │
│  Received as gift, prefer smaller model. Phone activated but never used...  │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                         MORE FROM THIS SELLER                                │
│  [Product1] [Product2] [Product3] [Product4] [Product5] → View all (12)     │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                          CUSTOMER REVIEWS                                    │
│  ┌─────────────┬─────────────────────────────────────────────────────────┐  │
│  │  Summary    │  Individual Reviews                                     │  │
│  │  ⭐ 4.6     │  ┌────────────┐ ┌────────────┐ ┌────────────┐          │  │
│  │  (128)      │  │ Review 1   │ │ Review 2   │ │ Review 3   │          │  │
│  │  ████ 5★    │  └────────────┘ └────────────┘ └────────────┘          │  │
│  │  ██ 4★      │                                                         │  │
│  └─────────────┴─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Mobile Layout (<768px)
```
┌──────────────────────────────────────┐
│    ←  iPhone 15 Pro Max        🔗 ♡  │  ← Header (sticky)
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │                                  │ │
│ │         IMAGE CAROUSEL           │ │  ← Full-width swipeable
│ │        (aspect-[4/3])            │ │
│ │                                  │ │
│ │           ● ○ ○ ○ ○              │ │  ← Pagination dots
│ └──────────────────────────────────┘ │
│                                      │
│  📱 Fashion                          │  ← L0 Category Badge
│                                      │
│  iPhone 15 Pro Max 256GB             │
│  Space Titanium · Unlocked           │
│                                      │
│  2,199.00 лв.  ̶2̶,̶4̶9̶9̶.̶0̶0̶  -12%       │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ [👤] seller_name | ⭐4.9 | [💬]  │ │  ← Compact seller card
│ └──────────────────────────────────┘ │
│                                      │
│ ▼ Description                        │  ← Accordion sections
│ ▼ Shipping & Returns                 │
│ ▼ About the Seller                   │
│ ▼ Item Specifics                     │
│                                      │
│ ──────────────────────────────────── │
│  More from this seller               │
│  [Card1] [Card2] [Card3] →           │
│ ──────────────────────────────────── │
│                                      │
│  Customer Reviews (128)              │
│  [Review1] [Review2]                 │
│                                      │
└──────────────────────────────────────┘
┌──────────────────────────────────────┐
│  2,199 лв.  [Buy Now] [Add to Cart]  │  ← Sticky bottom bar
└──────────────────────────────────────┘
```

### 6.3 Grid Classes Reference
```tsx
// Desktop two-column layout
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
  <div className="lg:col-span-7">
    {/* Gallery, Specs */}
  </div>
  <div className="lg:col-span-5">
    <div className="sticky top-24">
      {/* Buy Box */}
    </div>
  </div>
</div>

// Thumbnail grid
<div className="grid grid-cols-4 gap-2 h-24 sm:h-32">
  {/* 4 thumbnails */}
</div>

// More from seller (responsive)
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
  {/* Product cards */}
</div>

// Reviews grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Review cards */}
</div>
```

---

## 7. COMPONENT SPECIFICATIONS

### 7.1 Category Badge Component
```tsx
// components/shared/product/category-badge.tsx
interface CategoryBadgeProps {
  category: {
    name: string
    name_bg?: string | null
    slug: string
    icon?: string | null
    parent?: {
      name: string
      name_bg?: string | null
      slug: string
    } | null
  }
  locale: string
  size?: "sm" | "md" | "lg"
  showLink?: boolean
  className?: string
}

// Visual:
// ┌────────────────────────┐
// │ 📱 Electronics          │  ← Icon + L0 Name
// └────────────────────────┘
// or with subcategory:
// ┌─────────────────────────────────┐
// │ 📱 Electronics > Cell Phones    │
// └─────────────────────────────────┘
```

### 7.2 Seller Banner Component
```tsx
// components/shared/product/seller-banner.tsx
interface SellerBannerProps {
  seller: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
    verified: boolean
    created_at: string
  }
  stats: {
    average_rating: number | null
    total_reviews: number | null
    positive_feedback_pct: number | null
    follower_count: number | null
    total_sales: number | null
  } | null
  locale: string
  productId: string
  productTitle: string
}

// Visual:
// ┌──────────────────────────────────────────────────────────────────┐
// │  [Avatar]  seller_username                                       │
// │            ⭐ 4.9 (234 reviews) · 98% Positive · Since 2022      │
// │            🏪 12 items for sale                                  │
// │                                          [Follow] [Message]      │
// └──────────────────────────────────────────────────────────────────┘
```

### 7.3 Product Info Section
```tsx
// components/shared/product/product-info-section.tsx
interface ProductInfoSectionProps {
  product: {
    title: string
    price: number
    list_price?: number | null
    condition?: string | null
    rating?: number | null
    review_count?: number | null
    stock: number
    free_shipping?: boolean
  }
  category: {
    name: string
    name_bg?: string | null
    slug: string
    icon?: string | null
  } | null
  locale: string
}

// Visual:
// 📱 Electronics (Category Badge)
//
// iPhone 15 Pro Max 256GB
// Space Titanium · Unlocked · Open Box
//
// ⭐ 4.6 (128 reviews)
//
// 2,199.00 лв.  ̶2̶,̶4̶9̶9̶.̶0̶0̶ ̶л̶в̶.̶
// 🏷️ Save 300 лв. (12% off)
//
// ✓ In Stock (3 available)
// 🚚 Free Shipping
```

### 7.4 Buy Box Actions
```tsx
// components/shared/product/buy-box-actions.tsx
interface BuyBoxActionsProps {
  product: {
    id: string
    price: number
    stock: number
    seller_id: string
  }
  seller: {
    id: string
    username: string
  }
  locale: string
}

// Visual:
// ┌─────────────────────────────────┐
// │ [========= Buy Now =========]  │  ← Primary CTA
// │ [------- Add to Cart -------]  │  ← Secondary CTA
// │ [♡ Add to Watchlist] [💬 Chat]│  ← Tertiary actions
// └─────────────────────────────────┘
```

### 7.5 Shipping Info Component
```tsx
// components/shared/product/shipping-info.tsx
interface ShippingInfoProps {
  product: {
    free_shipping?: boolean
    shipping_days?: number | null
    ships_to_bulgaria?: boolean
    ships_to_europe?: boolean
    pickup_only?: boolean
    seller_city?: string | null
  }
  locale: string
}

// Visual:
// ┌─────────────────────────────────────────┐
// │ 🚚 Standard Shipping                    │
// │    ~6.50 лв. | Est. Tue, Jan 2         │
// │                                         │
// │ 🇧🇬 Ships to Bulgaria                   │
// │ 🇪🇺 Ships to Europe (+12.00 лв.)       │
// │                                         │
// │ 📍 Pickup available in Sofia            │
// └─────────────────────────────────────────┘
```

### 7.6 Trust Badges Component
```tsx
// components/shared/product/trust-badges.tsx
// Visual:
// ┌─────────────────────────────────────────┐
// │ 🛡️ Buyer Protection                     │
// │ Money held until delivery confirmed     │
// ├─────────────────────────────────────────┤
// │ ↩️ 14-Day Returns                       │
// │ Return if item not as described         │
// ├─────────────────────────────────────────┤
// │ ✓ Verified Seller                       │
// │ Identity confirmed                      │
// └─────────────────────────────────────────┘
```

### 7.7 Seller's Note Component (NEW - Inspired by Reference)
```tsx
// components/shared/product/sellers-note.tsx
interface SellersNoteProps {
  note: string
  locale: string
  className?: string
}

// Visual:
// ┌──────────────────────────────────────────────────────────────┐
// │ SELLER'S NOTE                                                │
// │ ┌──────────────────────────────────────────────────────────┐ │
// │ │ ❝ Received this as a gift but I prefer the smaller      │ │
// │ │   model. The phone has been activated but never used    │ │
// │ │   as a daily driver. Comes with original box, unused    │ │
// │ │   USB-C cable, and all documentation.                   │ │
// │ └──────────────────────────────────────────────────────────┘ │
// └──────────────────────────────────────────────────────────────┘

// Implementation:
<div>
  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 ml-1">
    {locale === "bg" ? "Бележка от продавача" : "Seller's Note"}
  </h3>
  <div className="relative bg-muted/30 rounded-lg p-4 border border-border">
    <Quote className="w-4 h-4 text-muted-foreground/30 absolute top-3 left-3" />
    <p className="text-sm text-muted-foreground leading-relaxed indent-6">
      {note}
    </p>
  </div>
</div>
```

### 7.8 Seller Performance Metrics Row (NEW - Inspired by Reference)
```tsx
// Part of SellerCard component - clean 3-column metrics display
interface SellerMetricsProps {
  responseTime: string      // "< 1hr"
  shippingSpeed: string     // "24hrs"
  memberSince: string       // "2021"
  locale: string
}

// Visual:
// ┌─────────────────────────────────────────────────────────────┐
// │  RESPONSE      │      SHIPPED       │       SINCE          │
// │    < 1hr       │       24hrs        │       2021           │
// └─────────────────────────────────────────────────────────────┘

// Implementation:
<div className="grid grid-cols-3 gap-2 py-3 border-t border-border">
  <div className="text-center">
    <span className="block text-2xs text-muted-foreground uppercase tracking-widest font-medium">
      {locale === "bg" ? "Отговор" : "Response"}
    </span>
    <span className="block text-sm font-medium text-foreground mt-0.5">
      {responseTime}
    </span>
  </div>
  <div className="text-center border-l border-border">
    <span className="block text-2xs text-muted-foreground uppercase tracking-widest font-medium">
      {locale === "bg" ? "Изпращане" : "Shipped"}
    </span>
    <span className="block text-sm font-medium text-foreground mt-0.5">
      {shippingSpeed}
    </span>
  </div>
  <div className="text-center border-l border-border">
    <span className="block text-2xs text-muted-foreground uppercase tracking-widest font-medium">
      {locale === "bg" ? "От" : "Since"}
    </span>
    <span className="block text-sm font-medium text-foreground mt-0.5">
      {memberSince}
    </span>
  </div>
</div>
```

### 7.9 Payment Methods & Report Footer (NEW - Inspired by Reference)
```tsx
// Part of Buy Box footer
// Visual:
// ┌──────────────────────────────────────────────────────────────┐
// │ PAYMENTS  [Visa] [MC] [ApplePay]              🚩 Report      │
// └──────────────────────────────────────────────────────────────┘

// Implementation:
<div className="flex items-center justify-between px-1 pt-4">
  <div className="flex items-center gap-3">
    <span className="text-2xs text-muted-foreground font-medium uppercase tracking-wider">
      {locale === "bg" ? "Плащане" : "Payments"}
    </span>
    <div className="flex gap-1.5">
      {/* Payment icons - grayscale until hover */}
      <div className="h-5 w-8 bg-muted rounded-sm border border-border opacity-50 hover:opacity-100 transition-opacity" />
      <div className="h-5 w-8 bg-muted rounded-sm border border-border opacity-50 hover:opacity-100 transition-opacity" />
      <div className="h-5 w-8 bg-muted rounded-sm border border-border opacity-50 hover:opacity-100 transition-opacity" />
    </div>
  </div>
  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors">
    <Flag className="w-3 h-3" />
    {locale === "bg" ? "Докладвай" : "Report"}
  </button>
</div>
```

---

## 8. SHADCN/UI COMPONENT USAGE

### 8.1 Required shadcn Components
```bash
# Already installed (verify in components/ui/):
✅ avatar.tsx
✅ badge.tsx
✅ button.tsx
✅ card.tsx
✅ carousel.tsx
✅ dialog.tsx
✅ accordion.tsx
✅ tabs.tsx
✅ tooltip.tsx
✅ separator.tsx
✅ progress.tsx
✅ skeleton.tsx
```

### 8.2 Component Mapping
| Product Page Element | shadcn Component | Custom Wrapper |
|---------------------|------------------|----------------|
| Seller Avatar | `Avatar` | - |
| Category Badge | `Badge` (variant="outline") | `CategoryBadge` |
| Condition Badge | `Badge` (variant by condition) | `ConditionBadge` |
| Stock Badge | `Badge` | `StockBadge` |
| Image Gallery | `Carousel` + custom | `ProductGallery` |
| Buy Now/Add to Cart | `Button` | - |
| Wishlist Button | `Button` (variant="ghost") | `WishlistButton` |
| Trust Info | `Card` + `CardContent` | `TrustBadges` |
| Reviews | `Card` | `ReviewCard` |
| Mobile Sections | `Accordion` | `MobileAccordions` |
| Price Tooltip | `Tooltip` | - |
| Rating Stars | Custom + `Progress` | `RatingDisplay` |
| Product Grid | Custom grid | `ProductCard` |
| Share Dialog | `Dialog` | `ShareDialog` |

### 8.3 Button Variants for Product Page
```tsx
// Primary CTA (Buy Now)
<Button className="w-full bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-white font-bold h-12 rounded-full">
  Buy Now
</Button>

// Secondary CTA (Add to Cart)
<Button 
  variant="outline" 
  className="w-full border-cta-trust-blue text-cta-trust-blue hover:bg-cta-trust-blue/5 font-bold h-12 rounded-full"
>
  Add to Cart
</Button>

// Tertiary (Wishlist)
<Button variant="ghost" className="w-full h-12 font-bold rounded-full">
  <Heart className="mr-2 h-5 w-5" />
  Add to Watchlist
</Button>

// Icon Button (Chat)
<Button variant="ghost" size="icon" className="rounded-full">
  <MessageCircle className="h-5 w-5" />
</Button>
```

---

## 9. MOBILE OPTIMIZATION

### 9.1 Mobile-Specific Components
```
MobileStickyBar       ← Fixed bottom CTA bar
MobileSellerCard      ← Compact seller info
MobileAccordions      ← Collapsible sections
MobileGallery         ← Swipeable carousel
```

### 9.2 Touch Targets (WCAG 2.1 AA)
```css
/* From globals.css tokens */
--spacing-touch: 2.75rem;     /* 44px minimum */
--spacing-touch-lg: 3rem;     /* 48px for primary CTAs */
```

### 9.3 Mobile-Specific Breakpoints
```tsx
// Hide on mobile, show on desktop
<div className="hidden lg:block">
  {/* Desktop seller card, full specs */}
</div>

// Show on mobile, hide on desktop
<div className="lg:hidden">
  {/* Mobile seller card, accordions */}
</div>
```

### 9.4 Mobile Sticky Bar
```tsx
// components/shared/product/mobile-sticky-bar.tsx
// Fixed to bottom on mobile, hides on desktop

// Visual:
// ┌────────────────────────────────────────────┐
// │  2,199 лв.   [Buy Now]  [🛒]              │
// │              Free Shipping                 │
// └────────────────────────────────────────────┘
```

---

## 10. PERFORMANCE & SEO

### 10.1 Image Optimization
```tsx
import Image from "next/image"

// Main product image
<Image
  src={product.images[0]}
  alt={product.title}
  width={600}
  height={600}
  priority // LCP image
  className="object-contain"
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Thumbnails (lazy load)
<Image
  src={thumb}
  alt={`${product.title} view ${i}`}
  width={150}
  height={150}
  loading="lazy"
/>
```

### 10.2 Data Caching Strategy
```typescript
// lib/data/product-page.ts
export async function fetchProductByUsernameAndSlug(username: string, slug: string) {
  'use cache'
  cacheTag('products', 'product')  // Tag-based invalidation
  cacheLife('products')            // ~60s revalidation
  // ...
}

// Invalidate on product update:
// revalidateTag('products')
```

### 10.3 JSON-LD Structured Data
```tsx
// Already implemented in page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.title,
  description: product.description,
  image: product.images,
  sku: product.id,
  offers: {
    "@type": "Offer",
    price: product.price,
    priceCurrency: "BGN",
    availability: product.stock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    seller: { "@type": "Organization", name: seller.display_name }
  },
  aggregateRating: product.review_count > 0 ? {
    "@type": "AggregateRating",
    ratingValue: product.rating,
    reviewCount: product.review_count
  } : undefined
}
```

### 10.4 Metadata Generation
```tsx
// Canonical URL pattern
const canonicalUrl = `/${locale}/${username}/${productSlug}`

// Open Graph
openGraph: {
  type: "website",
  url: fullCanonicalUrl,
  title: product.title,
  description: product.description || `Shop ${product.title}`,
  images: product.images?.[0] ? [{ url: product.images[0] }] : []
}
```

---

## 11. IMPLEMENTATION CHECKLIST

### Phase 1: Data Layer (Day 1)
- [ ] Add new tokens to `globals.css`
- [ ] Enhance `fetchProductByUsernameAndSlug` to include category hierarchy
- [ ] Create `fetchProductReviews` function
- [ ] Create `fetchRootCategory` helper
- [ ] Add `fetchUserProductInteraction` for wishlist state

### Phase 2: Core Components (Day 2-3)
- [ ] Create `CategoryBadge` component
- [ ] Create `SellerBanner` component
- [ ] Create `ProductInfoSection` component
- [ ] Create `ShippingInfo` component
- [ ] Create `TrustBadges` component
- [ ] Create `WishlistButton` component

### Phase 3: Layout Integration (Day 4)
- [ ] Refactor `UltimateC2CProductPage` to use design tokens
- [ ] Implement responsive grid with proper breakpoints
- [ ] Integrate all new components
- [ ] Add proper dark mode support

### Phase 4: Reviews & Interaction (Day 5)
- [ ] Connect `CustomerReviewsHybrid` to Supabase
- [ ] Implement review submission
- [ ] Add wishlist/favorite functionality
- [ ] Implement "Contact Seller" integration

### Phase 5: Mobile Polish (Day 6)
- [ ] Finalize `MobileStickyBar` with all actions
- [ ] Optimize `MobileAccordions` content
- [ ] Test touch targets
- [ ] Verify carousel swipe behavior

### Phase 6: Testing & QA (Day 7)
- [ ] E2E tests for product page loading
- [ ] Test with real Supabase data
- [ ] Verify SEO metadata
- [ ] Lighthouse performance audit
- [ ] Accessibility audit (screen readers)

---

## 12. FILE CHANGES SUMMARY

### Files to CREATE:
```
components/shared/product/category-badge.tsx          ← L0 category display
components/shared/product/seller-banner.tsx           ← Full-width seller header
components/shared/product/product-info-section.tsx    ← Title + price + actions
components/shared/product/shipping-info.tsx           ← Delivery estimates
components/shared/product/trust-badges.tsx            ← Buyer protection
components/shared/product/wishlist-button.tsx         ← Save/heart functionality
components/shared/product/sellers-note.tsx            ← NEW: Quote-styled note
components/shared/product/seller-metrics.tsx          ← NEW: 3-column stats row
components/shared/product/payment-footer.tsx          ← NEW: Payment icons + Report
lib/data/product-reviews.ts                           ← Reviews data fetching
```

### Files to MODIFY:
```
app/globals.css                                    (add new tokens)
lib/data/product-page.ts                           (enhance queries)
app/[locale]/[username]/[productSlug]/page.tsx     (integrate new components)
components/shared/product/ultimate-c2c-product-page.tsx (refactor to tokens)
components/shared/product/customer-reviews-hybrid.tsx    (connect to Supabase)
```

### Files to DELETE (cleanup):
```
components/shared/product/product-page-content-new.tsx   (if redundant)
components/shared/product/product-page-desktop-v2.tsx    (if redundant)
```

---

## 13. QUICK REFERENCE: TAILWIND V4 UTILITIES

### Spacing
```tsx
gap-8         // 32px (desktop column gap)
gap-6         // 24px (card gap)
gap-4         // 16px (element gap)
gap-2         // 8px (tight gap)
p-6           // 24px padding
px-4          // 16px horizontal padding
py-3          // 12px vertical padding
```

### Typography
```tsx
text-2xl lg:text-3xl  // Title
text-sm               // Body (14px)
text-xs               // Small (12px)
text-2xs              // Tiny (10px, custom)
font-bold             // 700
font-semibold         // 600
font-medium           // 500
tracking-tight        // -0.01em
```

### Colors (semantic tokens)
```tsx
text-foreground                // Primary text
text-muted-foreground          // Secondary text
bg-background                  // Page background
bg-card                        // Card background
border-border                  // Standard border
bg-cta-trust-blue              // Primary CTA
text-price-regular             // Price color
text-price-sale                // Sale price (red)
text-rating                    // Star rating yellow
```

### Border Radius
```tsx
rounded-md      // 4px (buttons)
rounded-lg      // 6px (cards)
rounded-xl      // 8px (larger cards)
rounded-2xl     // 12px (featured)
rounded-full    // Pills, avatars
```

---

**END OF MASTERPLAN**

> Next Step: Begin Phase 1 implementation by adding new tokens to globals.css and enhancing data fetching.
