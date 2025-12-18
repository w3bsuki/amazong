# Product Card Refactor Plan

## Executive Summary

The current `ProductCard` implementation is bloated (880 lines) because it conflates three distinct concerns:

1. **Layout variants** (compact, grid, featured) → Should be responsive CSS
2. **State variants** (promoted, sale, business) → CVA is perfect for this
3. **Feature toggles** (showSeller, showMeta) → Should be boolean props

CVA is the **correct** pattern for a marketplace with semantic variants. The problem is HOW it's currently used.

---

## Current State Analysis

### Files to Audit

| File | Lines | Status |
|------|-------|--------|
| `components/product-card.tsx` | 880 | **REFACTOR** - Bloated, wrong CVA usage |
| `components/perfect-marketplace-card.tsx` | 351 | **DELETE** - Duplicate of ProductCard |
| `components/final-cards.tsx` | 400 | **DELETE** - Demo duplicates |
| `app/[locale]/(main)/demo/cards/page.tsx` | 1527 | **KEEP** - Reference demos |
| `app/[locale]/(main)/demo/cards/perfect/page.tsx` | ~180 | **KEEP** - Uses UltimateMarketplaceCard |
| `app/[locale]/(main)/demo/cards/final/page.tsx` | ~180 | **DELETE** - Uses deleted final-cards.tsx |

### Current (Wrong) CVA Structure

```tsx
// ❌ WRONG - These are layout concerns, not semantic variants
const productCardVariants = cva("...", {
  variants: {
    variant: {
      default: "rounded-md",      // Layout
      grid: "rounded-sm",         // Layout
      compact: "rounded-md",      // Layout
      ultimate: "rounded-md",     // Layout
      marketplace: "rounded-md",  // Layout
      featured: "rounded-md",     // Layout
    }
  }
})
```

---

## Proposed Architecture

### CVA Variants (Semantic States Only)

```tsx
// ✅ CORRECT - Semantic states that affect appearance
const productCardVariants = cva(
  // Base styles (always applied)
  "overflow-hidden flex flex-col group relative bg-card border border-border rounded-lg h-full",
  {
    variants: {
      // Product state - affects visual treatment
      state: {
        default: "",
        promoted: "ring-1 ring-primary/20 shadow-sm",
        sale: "ring-1 ring-deal/20",
      },
      // Seller tier - affects trust indicators
      sellerTier: {
        basic: "",
        premium: "",
        business: "",
      },
      // Card density (valid layout variant)
      density: {
        default: "",
        compact: "",
      }
    },
    compoundVariants: [
      // Promoted + Business = Extra emphasis
      {
        state: "promoted",
        sellerTier: "business",
        className: "ring-2 ring-primary/30",
      },
    ],
    defaultVariants: {
      state: "default",
      sellerTier: "basic",
      density: "default",
    }
  }
)
```

### Props Interface (Clean)

```tsx
interface ProductCardProps {
  // Required
  id: string
  title: string
  price: number
  image: string
  
  // Product info
  originalPrice?: number | null
  rating?: number
  reviews?: number
  condition?: string
  brand?: string
  
  // Category (for smart pills + category badge)
  categorySlug?: string
  categoryName?: string  // NEW: Display name like "Automotive"
  
  // Seller info
  sellerId?: string
  sellerName?: string
  sellerAvatarUrl?: string | null
  sellerVerified?: boolean
  sellerTier?: 'basic' | 'premium' | 'business'
  
  // URLs
  slug?: string | null
  username?: string | null
  
  // CVA Variants (semantic states)
  state?: 'default' | 'promoted' | 'sale'
  density?: 'default' | 'compact'
  
  // Feature toggles (boolean)
  showSeller?: boolean      // Show seller header (default: true)
  showCategory?: boolean    // Show category badge (default: true)
  showRating?: boolean      // Show product rating (default: true)
  showPills?: boolean       // Show attribute pills (default: true)
  showActions?: boolean     // Show add to cart (default: true)
  
  // Smart pills data
  attributes?: Record<string, string>
  tags?: string[]
  
  // Context
  index?: number
  currentUserId?: string | null
}
```

---

## Visual Design System

### State Variants

#### 1. Default State
```
┌─────────────────────────────────────────┐
│ [Avatar] SellerName ✓  ★4.9  [Menu]    │
├─────────────────────────────────────────┤
│ [Category: Automotive]                  │
│         [PRODUCT IMAGE]                 │
│                              [♡]        │
├─────────────────────────────────────────┤
│ Title of the product...                 │
│ [Diesel] [2016] [Manual]                │
│                                         │
│ €3,500           [Add to Cart]          │
└─────────────────────────────────────────┘
```

#### 2. Promoted State
- Subtle primary ring (`ring-1 ring-primary/20`)
- "Promoted" badge on image (top-left)
- Slightly elevated shadow

```
┌─────────────────────────────────────────┐
│ [Avatar] SellerName ✓  ★4.9  [Menu]    │
├─────────────────────────────────────────┤
│ [⚡ Promoted]  [Category: Electronics]  │
│         [PRODUCT IMAGE]                 │
│                              [♡]        │
├─────────────────────────────────────────┤
│ Title of the product...                 │
│ [Apple] [256GB] [New]                   │
│                                         │
│ €999            [Add to Cart]           │
└─────────────────────────────────────────┘
```

#### 3. Sale State
- Deal ring (`ring-1 ring-deal/20`)
- Discount badge on image (top-left, red)
- Strikethrough original price
- "Sale" or "-XX%" badge

```
┌─────────────────────────────────────────┐
│ [Avatar] SellerName ✓  ★4.9  [Menu]    │
├─────────────────────────────────────────┤
│ [-25%]           [Category: Fashion]    │
│         [PRODUCT IMAGE]                 │
│                              [♡]        │
├─────────────────────────────────────────┤
│ Title of the product...                 │
│ [Nike] [Size 42] [New]                  │
│                                         │
│ €75  €100̶       [Add to Cart]          │
└─────────────────────────────────────────┘
```

### Seller Tier Treatments

| Tier | Header Treatment | Badge |
|------|-----------------|-------|
| `basic` | Standard avatar + name | None or "New seller" |
| `premium` | Avatar + name + subtle crown | "Premium" pill |
| `business` | Avatar + name + verified check | "Business" badge |

### Category Badge System (24 Categories)

Map category slugs to display labels and optional icons:

```tsx
const CATEGORY_CONFIG: Record<string, { label: string; icon?: IconType }> = {
  // Vehicles
  'cars': { label: 'Automotive', icon: Car },
  'motorcycles': { label: 'Motorcycles', icon: Motorcycle },
  'parts': { label: 'Auto Parts', icon: Wrench },
  
  // Electronics
  'electronics': { label: 'Electronics', icon: DeviceMobile },
  'computers': { label: 'Computers', icon: Laptop },
  'phones': { label: 'Phones', icon: Phone },
  
  // Fashion
  'fashion': { label: 'Fashion', icon: TShirt },
  'shoes': { label: 'Shoes', icon: Sneaker },
  'accessories': { label: 'Accessories', icon: Watch },
  
  // Home
  'home': { label: 'Home & Garden', icon: House },
  'furniture': { label: 'Furniture', icon: Couch },
  'appliances': { label: 'Appliances', icon: Refrigerator },
  
  // Sports & Hobbies
  'sports': { label: 'Sports', icon: Football },
  'hobbies': { label: 'Hobbies', icon: GameController },
  'music': { label: 'Music', icon: MusicNote },
  
  // Services & Other
  'services': { label: 'Services', icon: Briefcase },
  'jobs': { label: 'Jobs', icon: UserCircle },
  'real-estate': { label: 'Real Estate', icon: Buildings },
  
  // ...etc for all 24
}
```

---

## Smart Pills Logic (Simplified)

Current implementation is 150+ lines. New approach:

```tsx
function getSmartPills(
  categorySlug: string,
  attributes: Record<string, string>,
  tags: string[],
  condition?: string,
  brand?: string
): Array<{ key: string; label: string }> {
  const pills: Array<{ key: string; label: string }> = []
  const MAX_PILLS = 3
  
  // Category-specific priority order
  const priorityKeys = CATEGORY_PILL_PRIORITY[categorySlug] || ['brand', 'condition']
  
  // Add pills in priority order
  for (const key of priorityKeys) {
    if (pills.length >= MAX_PILLS) break
    
    const value = attributes[key] || (key === 'condition' ? condition : key === 'brand' ? brand : null)
    if (value) {
      pills.push({ key, label: value })
    }
  }
  
  // Fill remaining slots with tags
  for (const tag of tags) {
    if (pills.length >= MAX_PILLS) break
    if (!pills.some(p => p.label.toLowerCase() === tag.toLowerCase())) {
      pills.push({ key: `tag:${tag}`, label: tag })
    }
  }
  
  return pills
}

const CATEGORY_PILL_PRIORITY: Record<string, string[]> = {
  'cars': ['year', 'mileage_km', 'fuel_type', 'transmission'],
  'electronics': ['brand', 'storage', 'condition'],
  'fashion': ['size', 'brand', 'condition'],
  'real-estate': ['rooms', 'area_sqm', 'location'],
  // ...etc
}
```

---

## Migration Plan

### Phase 1: Create New ProductCard (Day 1)

1. Create `components/product-card-v2.tsx` (~350 lines)
2. Implement proper CVA with `state`, `sellerTier`, `density`
3. Add category badge system
4. Simplify smart pills to ~50 lines
5. Test in demo page

### Phase 2: Update Consumers (Day 2)

1. Update `newest-listings-section.tsx`
2. Update `product-page.tsx` (related products)
3. Update `search-results-page.tsx`
4. Update `category-page.tsx`
5. Update `wishlist-page.tsx`

### Phase 3: Cleanup (Day 3)

1. Delete old `product-card.tsx`
2. Rename `product-card-v2.tsx` → `product-card.tsx`
3. Delete `perfect-marketplace-card.tsx`
4. Delete `final-cards.tsx`
5. Delete `app/[locale]/(main)/demo/cards/final/page.tsx`
6. Keep `demo/cards/page.tsx` for reference

### Phase 4: Polish (Day 4)

1. Add loading skeletons matching new card
2. Test all 24 categories
3. Test mobile/desktop
4. Verify all states (default, promoted, sale)
5. Verify all seller tiers

---

## Code Reduction Estimate

| Before | After | Reduction |
|--------|-------|-----------|
| 880 lines (product-card.tsx) | ~350 lines | -60% |
| 351 lines (perfect-marketplace-card.tsx) | 0 lines | -100% |
| 400 lines (final-cards.tsx) | 0 lines | -100% |
| **1631 total** | **~350 total** | **-78%** |

---

## Files to Keep (Reference)

```
app/[locale]/(main)/demo/cards/
├── page.tsx          ✅ KEEP - 17 variant demos
├── perfect/
│   └── page.tsx      ✅ KEEP - UltimateMarketplaceCard demo
├── final/
│   └── page.tsx      ❌ DELETE - References deleted components
├── gpt/
│   └── page.tsx      ✅ KEEP - GPT-generated demos
└── merged/
    └── page.tsx      ✅ KEEP - Merged comparison
```

---

## Success Criteria

- [ ] Single `ProductCard` component < 400 lines
- [ ] CVA variants: `state` (default/promoted/sale), `sellerTier` (basic/premium/business), `density` (default/compact)
- [ ] Category badge visible on all cards
- [ ] Smart pills work for all 24 categories
- [ ] Mobile and desktop responsive (no separate variants)
- [ ] TypeScript strict mode passing
- [ ] Demo page still functional for reference

---

## Next Steps

1. **Approve this plan**
2. I will implement `product-card-v2.tsx` with proper CVA
3. Test in isolation on demo page
4. Migrate consumers one by one
5. Delete legacy files

Ready to proceed?
