# Product Page Refactor Plan

> **Target File**: `components/product-page-content-new.tsx` (1070 lines → target ~300 lines)
> **Created**: December 15, 2025
> **Priority**: Production-Ready Cleanup

---

## Quick Reference: `cn()` vs Template Literals

### ✅ ALWAYS USE: `cn()` (shadcn/ui utility)
```tsx
import { cn } from "@/lib/utils"

// Good - handles Tailwind conflicts, cleaner syntax
<div className={cn(
  "base-class p-2",
  isActive && "bg-primary text-white",
  size === "lg" && "p-4"  // This overrides p-2 correctly!
)} />
```

### ❌ NEVER USE: Template Literals for classes
```tsx
// Bad - doesn't merge conflicts, messy syntax
<div className={`base-class p-2 ${isActive ? 'bg-primary text-white' : ''} ${size === 'lg' ? 'p-4' : ''}`} />
// Result: "base-class p-2 bg-primary text-white p-4" - BOTH p-2 AND p-4 applied!
```

---

## Phase Overview

| Phase | Focus | Effort | Impact |
|-------|-------|--------|--------|
| **Phase 1** | Remove Mock Data | 🟢 Easy | 🔴 Critical |
| **Phase 2** | Fix Currency System | 🟢 Easy | 🔴 Critical |
| **Phase 3** | i18n Migration | 🟡 Medium | 🟠 High |
| **Phase 4** | Component Extraction | 🔴 Large | 🟠 High |
| **Phase 5** | UI/UX Polish | 🟡 Medium | 🟡 Medium |
| **Phase 6** | Accessibility | 🟢 Easy | 🟡 Medium |

---

## Phase 1: Remove Mock/Hardcoded Data 🔴 CRITICAL

### Task 1.1: Remove Fake Seller Stats
**File**: `components/product-page-content-new.tsx`
**Lines**: ~137-155

**Current (BAD)**:
```tsx
const sellerData = seller ? {
  ...seller,
  store_name: seller.display_name || seller.username || 'Seller',
  store_slug: seller.username,
  positive_feedback_percentage: 100,        // ❌ FAKE
  total_items_sold: 505000,                 // ❌ FAKE
  response_time_hours: 24,                  // ❌ FAKE
  feedback_score: 798,                      // ❌ FAKE
  feedback_count: 746,                      // ❌ FAKE
  member_since: new Date(seller.created_at).getFullYear().toString(),
  ratings: {
    accuracy: 5.0,                          // ❌ ALL FAKE
    shipping_cost: 5.0,
    shipping_speed: 5.0,
    communication: 5.0,
  }
} : null
```

**Target (GOOD)**:
```tsx
const sellerData = seller ? {
  ...seller,
  store_name: seller.display_name || seller.username || 'Seller',
  store_slug: seller.username,
  // Real data should come from seller prop or be fetched
  // Show null/undefined if no real data - UI should handle empty states
  positive_feedback_percentage: seller.feedback_percentage ?? null,
  total_items_sold: seller.total_sales ?? null,
  feedback_score: seller.feedback_score ?? null,
  feedback_count: seller.feedback_count ?? null,
  member_since: new Date(seller.created_at).getFullYear().toString(),
  ratings: seller.ratings ?? null,  // null = show "No ratings yet"
} : null
```

**Action Items**:
- [ ] Update `ProductPageContentProps` interface to accept real seller stats
- [ ] Pass real data from page.tsx (fetch from database)
- [ ] Add empty state UI for when data is null

---

### Task 1.2: Remove Fake Feedback Reviews
**File**: `components/product-page-content-new.tsx`
**Lines**: ~158-180

**Current (BAD)**:
```tsx
const sampleFeedback = [
  { user: "j***n", score: 156, text: '...', date: 'Past 6 months' },
  { user: "m***a", score: 89, text: '...', date: 'Past 6 months' },
  { user: "s***k", score: 234, text: '...', date: 'Past 6 months' },
]
```

**Target (GOOD)**:
```tsx
// Remove sampleFeedback entirely
// Pass real feedback as prop or show empty state

// In the JSX:
{sellerFeedback && sellerFeedback.length > 0 ? (
  sellerFeedback.map((feedback) => (
    <FeedbackItem key={feedback.id} {...feedback} />
  ))
) : (
  <EmptyState message={t('noFeedbackYet')} />
)}
```

**Action Items**:
- [ ] Delete `sampleFeedback` constant
- [ ] Add `sellerFeedback` to props interface
- [ ] Fetch real feedback in page.tsx
- [ ] Create empty state component for no feedback

---

### Task 1.3: Remove Magic Number Multipliers
**File**: `components/product-page-content-new.tsx`
**Lines**: ~127-128

**Current (BAD)**:
```tsx
const soldCount = product.reviews_count ? product.reviews_count * 12 : 150
const watchCount = Math.floor(soldCount * 0.15)
```

**Target (GOOD)**:
```tsx
// Option A: Use real data from product/analytics
const watchCount = product.watch_count ?? 0

// Option B: If we must estimate, use named constants with documentation
// But honestly, just remove fake social proof entirely
```

**Action Items**:
- [ ] Remove fake social proof calculations
- [ ] Either fetch real watch count or remove the feature
- [ ] If keeping, add `watch_count` to product interface

---

## Phase 2: Fix Currency System 🔴 CRITICAL

### Currency Strategy Decision

**Context**:
- Bulgaria joined Eurozone: **January 1, 2025** ✅
- Primary market: Bulgaria/EU → **EUR is base currency**
- Secondary market: USA → Show USD equivalent

**Strategy Options**:

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **A: EUR Only** | Simple, no conversion needed | US users see unfamiliar € | ✅ **Recommended for MVP** |
| **B: Locale-Based Display** | Familiar for all users | Needs exchange rates, complexity | Future enhancement |
| **C: User Preference** | Best UX | Most complex | V2 feature |

**Decision: Option A for now** - All prices stored and displayed in EUR. 
- Bulgaria uses EUR (post-January 2025)
- EU users see familiar EUR
- US users can mentally convert (or we add converter later)
- No exchange rate API needed
- Consistent pricing across the platform

### Task 2.1: Create Unified Price Formatting

**Create new file**: `lib/format-price.ts`
```tsx
import { useLocale } from 'next-intl'

// EUR is the base currency (Bulgaria joined Eurozone Jan 2025)
export const BASE_CURRENCY = 'EUR' as const

export type SupportedCurrency = 'EUR' | 'USD'

interface FormatPriceOptions {
  locale?: string
  currency?: SupportedCurrency
  showSymbol?: boolean
}

/**
 * Format price for display
 * 
 * @param priceInEUR - Price in EUR (base currency)
 * @param options - Formatting options
 * @returns Formatted price string
 * 
 * @example
 * formatPrice(29.99) // "€29.99" or "29,99 €" depending on locale
 * formatPrice(29.99, { locale: 'en' }) // "€29.99"
 * formatPrice(29.99, { locale: 'bg' }) // "29,99 €"
 */
export function formatPrice(
  priceInEUR: number,
  options: FormatPriceOptions = {}
): string {
  const {
    locale = 'en',
    currency = BASE_CURRENCY,
    showSymbol = true
  } = options

  // Locale formatting map
  const localeMap: Record<string, string> = {
    'bg': 'bg-BG',  // Bulgarian: "29,99 €"
    'en': 'en-IE',  // Irish English uses EUR: "€29.99"
    'de': 'de-DE',  // German: "29,99 €"
  }

  return new Intl.NumberFormat(localeMap[locale] || 'en-IE', {
    style: showSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInEUR)
}

/**
 * React hook for formatting prices with current locale
 */
export function useFormatPrice() {
  const locale = useLocale()
  
  return (price: number) => {
    return formatPrice(price, { locale })
  }
}

/**
 * Format price range (for filters, etc.)
 */
export function formatPriceRange(
  min: number,
  max: number,
  locale: string = 'en'
): string {
  return `${formatPrice(min, { locale })} - ${formatPrice(max, { locale })}`
}

/**
 * Format discount display
 * @returns Object with formatted prices and discount percentage
 */
export function formatDiscount(
  currentPrice: number,
  originalPrice: number,
  locale: string = 'en'
) {
  const discountPercent = Math.round((1 - currentPrice / originalPrice) * 100)
  
  return {
    current: formatPrice(currentPrice, { locale }),
    original: formatPrice(originalPrice, { locale }),
    percentage: discountPercent,
    label: `-${discountPercent}%`
  }
}
```

### Task 2.1b: Future Enhancement - Multi-Currency Support (V2)

> **Note**: This is for future implementation when US market grows

```tsx
// Future: lib/currency-converter.ts
// Would need exchange rate API (e.g., exchangerate-api.com, openexchangerates.org)

interface ExchangeRates {
  EUR: 1,        // Base
  USD: number,   // ~1.08
  GBP: number,   // ~0.86
}

// Store user currency preference in:
// - Cookie (for guests)
// - User profile (for logged in users)

// Display flow:
// 1. Price stored in EUR in database
// 2. On display: convert to user's preferred currency
// 3. On checkout: always charge in EUR
```

---

### Task 2.2: Replace All Price Displays

**File**: `components/product-page-content-new.tsx`

**Find and replace ALL instances**:

| Line | Current (Wrong) | Target (EUR) |
|------|---------|--------|
| ~519 | `US ${product.price.toFixed(2)}` | `{formatPrice(product.price, { locale })}` |
| ~525 | `US ${product.original_price.toFixed(2)}` | `{formatPrice(product.original_price, { locale })}` |
| ~970 | `US ${product.price.toFixed(2)}` | `{formatPrice(product.price, { locale })}` |
| ~973 | `US ${product.original_price.toFixed(2)}` | `{formatPrice(product.original_price, { locale })}` |
| ~1025 | `.toLocaleString(...currency: 'BGN')` | `{formatPrice(product.price, { locale })}` |

**Expected Output by Locale**:
- `locale='bg'` → `29,99 €` (Bulgarian format)
- `locale='en'` → `€29.99` (English/Irish format)

**Action Items**:
- [ ] Create `lib/format-price.ts`
- [ ] Import `formatPrice` in product-page-content-new.tsx
- [ ] Replace all 5+ price display instances
- [ ] Verify ProductCard uses same format (check `product-card.tsx`)
- [ ] Update any database schemas if needed (ensure `price` column stores EUR)
- [ ] Update seed data to use EUR values
- [ ] Search codebase for `BGN` and remove all references

### Task 2.3: Database/Seed Audit for Currency

**Files to check**:
- `supabase/seed.sql` - Ensure prices are in EUR
- `supabase/migrations/*.sql` - Check for BGN references
- Any price-related constants

**Search command**:
```bash
grep -r "BGN\|USD\|\$\d" --include="*.tsx" --include="*.ts" --include="*.sql"
```

---

## Phase 3: i18n Migration 🟠 HIGH

### Task 3.1: Update Props to Use Translations

**Current (BAD)** - Line 98:
```tsx
t: _t, // TODO: Replace inline locale checks with t.* translations
```

**Target**:
```tsx
t: TranslationFunction  // Actually use it!
```

---

### Task 3.2: Replace ALL Inline Locale Checks

Create a search-and-replace checklist:

| Current Pattern | Replace With |
|----------------|--------------|
| `{locale === 'bg' ? 'Доставка:' : 'Shipping:'}` | `{t('shipping')}` |
| `{locale === 'bg' ? 'Състояние:' : 'Condition:'}` | `{t('condition')}` |
| `{locale === 'bg' ? 'Ново' : 'New'}` | `{t('conditionNew')}` |
| `{locale === 'bg' ? 'Виж детайли' : 'See details'}` | `{t('seeDetails')}` |
| `{locale === 'bg' ? 'Магазин' : 'View Store'}` | `{t('viewStore')}` |
| `{locale === 'bg' ? 'Увеличи' : 'Enlarge'}` | `{t('enlarge')}` |
| `{locale === 'bg' ? 'Добави в списък' : 'Add to watchlist'}` | `{t('addToWatchlist')}` |
| `{locale === 'bg' ? 'В списъка' : 'Watching'}` | `{t('watching')}` |
| `{locale === 'bg' ? 'Снимка' : 'Picture'}` | `{t('picture')}` |
| `{locale === 'bg' ? 'от' : 'of'}` | `{t('of')}` |
| `{locale === 'bg' ? 'Популярно.' : 'People are checking this out.'}` | `{t('popularItem')}` |
| `{locale === 'bg' ? 'добавили в списъка.' : 'have added this to their watchlist.'}` | `{t('addedToWatchlist')}` |
| `{locale === 'bg' ? 'БЕЗПЛАТНА' : 'FREE'}` | `{t('free')}` |
| `{locale === 'bg' ? 'Местоположение:' : 'Located in:'}` | `{t('locatedIn')}` |
| `{locale === 'bg' ? 'Очаквано между' : 'Est.'}` | `{t('estimatedDelivery')}` |
| `{locale === 'bg' ? '30 дни безплатно връщане.' : '30 days returns.'}` | `{t('returns30Days')}` |
| `{locale === 'bg' ? 'Плащания:' : 'Payments:'}` | `{t('payments')}` |
| `{locale === 'bg' ? 'Гаранция за връщане' : 'Money Back Guarantee'}` | `{t('moneyBackGuarantee')}` |
| ... | (40+ more instances) |

**Action Items**:
- [ ] Add all translations to `messages/en.json` under `Product` namespace
- [ ] Add all translations to `messages/bg.json` under `Product` namespace
- [ ] Replace all inline checks with `t('key')` calls
- [ ] Remove unused `locale` prop after migration

---

### Task 3.3: Add Missing Translation Keys

**File**: `messages/en.json` - Add to `Product` section:
```json
{
  "Product": {
    "shipping": "Shipping:",
    "delivery": "Delivery:",
    "returns": "Returns:",
    "payments": "Payments:",
    "condition": "Condition:",
    "conditionNew": "New",
    "conditionUsed": "Used",
    "seeDetails": "See details",
    "viewStore": "View Store",
    "enlarge": "Enlarge",
    "addToWatchlist": "Add to Watchlist",
    "watching": "Watching",
    "picture": "Picture",
    "of": "of",
    "popularItem": "People are checking this out.",
    "watchlistCount": "{count} have added this to their watchlist.",
    "free": "FREE",
    "locatedIn": "Located in:",
    "estimatedDelivery": "Est.",
    "returns30Days": "30 days returns.",
    "moneyBackGuarantee": "Money Back Guarantee",
    "getItemOrMoneyBack": "Get item or money back.",
    "learnMore": "Learn more",
    "description": "Description",
    "specifications": "Specifications",
    "inTheBox": "In the Box",
    "technicalSpecifications": "Technical Specifications",
    "whatsInTheBox": "What's in the Box",
    "itemNumber": "Item number",
    "brand": "Brand",
    "type": "Type",
    "model": "Model",
    "countryOfOrigin": "Country of Origin",
    "warranty": "Warranty",
    "mainProduct": "Main Product",
    "userManual": "User Manual",
    "warrantyCard": "Warranty Card",
    "originalPackaging": "Original Packaging",
    "contactSeller": "Contact Seller",
    "detailedSellerRatings": "Detailed seller ratings",
    "averageLast12Months": "Average for the last 12 months",
    "accurateDescription": "Accurate description",
    "reasonableShippingCost": "Reasonable shipping cost",
    "shippingSpeed": "Shipping speed",
    "communication": "Communication",
    "sellerFeedback": "Seller feedback",
    "allRatings": "All ratings",
    "positive": "Positive",
    "neutral": "Neutral",
    "negative": "Negative",
    "seeAllFeedback": "See all feedback",
    "noDescriptionAvailable": "No description available.",
    "previousImage": "Previous image",
    "nextImage": "Next image",
    "imagePreview": "Image Preview",
    "clickToEnlarge": "Click to enlarge"
  }
}
```

---

## Phase 4: Component Extraction 🟠 HIGH

### Task 4.1: Extract Product Gallery Component

**Create**: `components/product/product-gallery.tsx`

```tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { CaretLeft, CaretRight, MagnifyingGlassPlus, Heart, X } from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  title: string
  watchCount?: number
  isWatching?: boolean
  onWatchlistToggle?: () => void
  isWatchlistPending?: boolean
  t: {
    enlarge: string
    addToWatchlist: string
    removeFromWatchlist: string
    previousImage: string
    nextImage: string
    imagePreview: string
    picture: string
    of: string
  }
}

export function ProductGallery({
  images,
  title,
  watchCount = 0,
  isWatching = false,
  onWatchlistToggle,
  isWatchlistPending = false,
  t
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  // ... Extract all gallery-related JSX and logic here
}
```

**Lines to extract**: ~254-450 (gallery, thumbnails, zoom modal)

---

### Task 4.2: Extract Buy Box Component

**Create**: `components/product/product-buy-box.tsx`

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "@phosphor-icons/react"
import { AddToCart } from "@/components/add-to-cart"
import { formatPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"

interface ProductBuyBoxProps {
  product: {
    id: string
    title: string
    price: number
    originalPrice?: number | null
    images: string[]
    sellerId?: string
    slug?: string
  }
  seller?: {
    store_slug?: string
  } | null
  currentUserId: string | null
  isWatching: boolean
  isWishlistPending: boolean
  onWatchlistToggle: () => void
  locale: string
  t: TranslationKeys
}

export function ProductBuyBox({ ... }: ProductBuyBoxProps) {
  // Extract buy box JSX and logic
}
```

**Lines to extract**: ~567-680 (action buttons, price display)

---

### Task 4.3: Extract Seller Info Card Component

**Create**: `components/product/seller-info-card.tsx`

```tsx
interface SellerInfoCardProps {
  seller: SellerData
  variant: 'banner' | 'compact' | 'full'
  locale: string
  t: TranslationKeys
}

export function SellerInfoCard({ seller, variant, locale, t }: SellerInfoCardProps) {
  // Single component for all 3 seller display variants
}
```

**Remove redundancy**: Currently seller info appears 3 times. Use one component with variants.

---

### Task 4.4: Extract Shipping Info Component

**Create**: `components/product/shipping-info.tsx`

```tsx
interface ShippingInfoProps {
  shippingCost: number | 'free'
  location: string
  deliveryDate: string
  returnDays: number
  paymentMethods: string[]
  t: TranslationKeys
}

export function ShippingInfo({ ... }: ShippingInfoProps) {
  // Extract lines ~618-665
}
```

---

### Task 4.5: Extract Product Specs Component

**Create**: `components/product/product-specs.tsx`

```tsx
interface ProductSpecsProps {
  specs: Array<{ label: string; value: string }>
  boxContents: string[]
  description?: string | null
  variant: 'mobile' | 'desktop'
  t: TranslationKeys
}

export function ProductSpecs({ ... }: ProductSpecsProps) {
  // Extract lines ~680-770
}
```

---

### Task 4.6: Create Index File

**Create**: `components/product/index.ts`
```tsx
export { ProductGallery } from './product-gallery'
export { ProductBuyBox } from './product-buy-box'
export { SellerInfoCard } from './seller-info-card'
export { ShippingInfo } from './shipping-info'
export { ProductSpecs } from './product-specs'
```

---

### Final Component Structure

After extraction:
```
components/
├── product/
│   ├── index.ts
│   ├── product-gallery.tsx        (~150 lines)
│   ├── product-buy-box.tsx        (~100 lines)
│   ├── seller-info-card.tsx       (~120 lines)
│   ├── shipping-info.tsx          (~60 lines)
│   └── product-specs.tsx          (~80 lines)
├── product-page-content-new.tsx   (~300 lines - orchestrator only)
```

---

## Phase 5: UI/UX Polish 🟡 MEDIUM

### Task 5.1: Fix Grid Height Consistency

**Current issue**: 3-column cards (Description, Specs, In Box) have uneven heights

**File**: `components/product-page-content-new.tsx` ~706-770

**Fix**:
```tsx
// Add h-full and flex-grow to ensure equal heights
<div className="grid lg:grid-cols-3 gap-4">
  <div className="bg-muted/30 border rounded-xl p-5 h-full flex flex-col">
    <h3>...</h3>
    <div className="flex-1">  {/* Content grows to fill */}
      ...
    </div>
  </div>
</div>
```

---

### Task 5.2: Remove Redundant Seller Displays

**Current**: Seller info appears 3 times on desktop
1. Blue banner (top)
2. Inside buy box
3. Full card below specs

**Action**: Keep only:
1. Blue banner (for brand recognition)
2. Full card below (for detailed info)

Remove the duplicate inside buy box (~lines 530-560).

---

### Task 5.3: Fix Dead Links

**Find**: `href="#"` occurrences

**Replace with**:
- Actual pages: `/help/returns`, `/help/money-back-guarantee`
- Or remove the link and make it plain text
- Or add `onClick` handler for modal

```tsx
// Current (BAD)
<Link href="#">Learn more</Link>

// Option A: Real link
<Link href="/help/buyer-protection">Learn more</Link>

// Option B: Modal trigger
<button onClick={() => setShowGuaranteeModal(true)}>Learn more</button>

// Option C: Remove link styling if no action
<span className="text-muted-foreground">Learn more</span>
```

---

### Task 5.4: Standardize Responsive Patterns

**Create consistent breakpoint system**:

```tsx
// In tailwind config or as documentation:
// Mobile: default (no prefix)
// Tablet: sm: (640px+)
// Desktop: lg: (1024px+)
// Large Desktop: xl: (1280px+)

// Pattern for mobile-first:
<div className="
  px-4                    {/* Mobile */}
  sm:px-6                 {/* Tablet */}
  lg:px-8                 {/* Desktop */}
">

// Pattern for hide/show:
<div className="lg:hidden">Mobile only</div>
<div className="hidden lg:block">Desktop only</div>
```

**Audit all instances** of mixed patterns like:
- `px-2 sm:px-0 lg:p-5 xl:p-6` → Simplify
- Random `md:` breakpoints → Standardize to `sm:`/`lg:`

---

### Task 5.5: Fix Sticky Buy Box Currency

**File**: `components/product-page-content-new.tsx` ~1025

**Current**:
```tsx
{product.price.toLocaleString(locale === 'bg' ? 'bg-BG' : 'en-US', { 
  style: 'currency', 
  currency: 'BGN' 
})}
```

**Fix**: Use same `formatPrice` function as main price display (from Phase 2).

---

## Phase 6: Accessibility 🟡 MEDIUM

### Task 6.1: Add Missing ARIA Attributes

**Progress bars need values**:
```tsx
// Current
<Progress value={(rating.value / 5) * 100} className="h-2 w-20" />

// Fixed
<Progress 
  value={(rating.value / 5) * 100} 
  className="h-2 w-20"
  aria-label={`${rating.label}: ${rating.value} out of 5`}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={(rating.value / 5) * 100}
/>
```

---

### Task 6.2: Ensure Focus States

**Check all interactive elements have visible focus**:
```tsx
// Good pattern
<button className="... focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
```

---

### Task 6.3: Keyboard Navigation for Gallery

**Ensure arrow keys work in zoom modal**:
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isZoomOpen) return
    if (e.key === 'ArrowLeft') setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)
    if (e.key === 'ArrowRight') setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)
    if (e.key === 'Escape') setIsZoomOpen(false)
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [isZoomOpen, images.length])
```

---

## Execution Checklist

### Phase 1: Mock Data Removal
- [ ] Remove hardcoded seller stats (lines 137-155)
- [ ] Remove `sampleFeedback` array (lines 158-180)
- [ ] Remove fake social proof calculations (lines 127-128)
- [ ] Update interfaces to accept real data
- [ ] Add empty state UI components

### Phase 2: Currency Fix
- [ ] Create `lib/format-price.ts`
- [ ] Replace all USD displays
- [ ] Replace all EUR displays
- [ ] Replace all BGN displays
- [ ] Verify consistency in ProductCard component

### Phase 3: i18n Migration
- [ ] Add ~50 new translation keys to `messages/en.json`
- [ ] Add ~50 new translation keys to `messages/bg.json`
- [ ] Replace all `locale === 'bg' ? ... : ...` patterns
- [ ] Test both locales

### Phase 4: Component Extraction
- [ ] Create `components/product/` directory
- [ ] Extract ProductGallery
- [ ] Extract ProductBuyBox
- [ ] Extract SellerInfoCard
- [ ] Extract ShippingInfo
- [ ] Extract ProductSpecs
- [ ] Create index.ts
- [ ] Refactor main component to use extracted components
- [ ] Verify no functionality lost

### Phase 5: UI/UX Polish
- [ ] Fix grid height consistency
- [ ] Remove duplicate seller card
- [ ] Fix/remove dead `#` links
- [ ] Standardize responsive patterns
- [ ] Fix sticky buy box currency

### Phase 6: Accessibility
- [ ] Add ARIA to progress bars
- [ ] Verify focus states
- [ ] Add keyboard navigation to gallery
- [ ] Test with screen reader

---

## Post-Refactor Verification

- [ ] `pnpm build` passes with no errors
- [ ] `pnpm lint` passes with no warnings
- [ ] Page renders correctly on mobile (375px)
- [ ] Page renders correctly on desktop (1440px)
- [ ] All buttons/links are functional
- [ ] **Price displays consistently in EUR everywhere**
- [ ] No console errors
- [ ] Translations work in both locales
- [ ] Lighthouse score > 90 for accessibility

### Currency Verification Checklist
- [ ] Product page shows EUR (e.g., `€29.99` or `29,99 €`)
- [ ] Product cards show EUR
- [ ] Cart shows EUR
- [ ] Checkout shows EUR
- [ ] Order history shows EUR
- [ ] No `US $`, `BGN`, or `лв.` anywhere in UI
- [ ] Search `grep -r "BGN\|USD\|\\\$[0-9]" --include="*.tsx"` returns 0 results

---

## Notes

### Why `cn()` is Superior

The `cn()` utility from shadcn/ui combines:
1. `clsx` - Conditional class joining
2. `tailwind-merge` - Intelligent Tailwind class conflict resolution

```tsx
// Example: cn() handles conflicts correctly
cn("p-2 text-sm", large && "p-4 text-lg")
// If large=true: "p-4 text-lg" (p-2 and text-sm removed!)

// Template literal would give:
`p-2 text-sm ${large ? 'p-4 text-lg' : ''}`
// If large=true: "p-2 text-sm p-4 text-lg" (BOTH applied - bug!)
```

### File Size Targets

| File | Current | Target |
|------|---------|--------|
| product-page-content-new.tsx | 1070 lines | ~300 lines |
| product-gallery.tsx | - | ~150 lines |
| product-buy-box.tsx | - | ~100 lines |
| seller-info-card.tsx | - | ~120 lines |
| shipping-info.tsx | - | ~60 lines |
| product-specs.tsx | - | ~80 lines |

**Total**: Same functionality, better organization, easier maintenance.
