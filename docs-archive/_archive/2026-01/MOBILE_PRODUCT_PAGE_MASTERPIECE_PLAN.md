# 📱 Mobile Product Page Masterpiece Plan

**Date:** December 29, 2025  
**Goal:** Transform the mobile product page into a world-class Temu/eBay-tier shopping experience  
**Core Philosophy:** Dense-but-scannable, thumb-first, trust-forward C2C marketplace

---

## 🎯 Executive Summary

The current mobile product page has solid bones but suffers from:
1. **Information architecture issues** - Too much scroll before CTAs, cluttered hierarchy
2. **Trust signals buried** - Seller info/badges not prominent enough
3. **Weak urgency/conversion triggers** - Missing FOMO elements, promo badges
4. **Touch ergonomics gaps** - Some targets too small, sticky bar underutilized
5. **Visual inconsistency** - Mixing styles, not leveraging our tokens fully

**North Star:** A shopper should be able to scan price → condition → trust → buy in under 3 seconds on first screen.

---

## 🏗️ New Mobile Layout Structure

### Above-the-Fold Priority (390×844 viewport)

```
┌─────────────────────────────────────┐
│  [←] ──────────────── [🔍][🛒][⋮]  │ ← Header (56px, fixed)
├─────────────────────────────────────┤
│                                     │
│         🖼️ GALLERY (edge-to-edge)   │ ← Full-width carousel + dots
│           Aspect: 4:5 or 1:1        │    ~280-320px
│                                     │
├─────────────────────────────────────┤
│  💰 BGN 149.99  ̶B̶G̶N̶ ̶1̶9̶9̶.̶9̶9̶  -25%  │ ← Price Block (bold, immediate)
│  ✅ New with tags • 📦 Free Ship    │ ← Badges row (compact)
├─────────────────────────────────────┤
│  iPhone 15 Pro Max 256GB Titanium   │ ← Title (2 lines max, semibold)
│  Natural Color, Unlocked...         │
├─────────────────────────────────────┤
│  [⭐4.9] shop4e • ✓Verified • 98%   │ ← Seller trust line (tap → profile)
├─────────────────────────────────────┤
│  [───────────── Qty: 1 ─────────────]│ ← Inline qty (optional, can hide)
├─────────────────────────────────────┤
│                                     │ ← Sticky bar takes care of CTAs
└─────────────────────────────────────┘
```

### Below-the-Fold (Scrollable Sections)

```
┌─────────────────────────────────────┐
│  🏷️ PROMO BANNER (Conditional)      │ ← "🔥 3 people viewing • 2 left!"
├─────────────────────────────────────┤
│  📋 QUICK SPECS (Horizontal Pills)   │ ← Key attributes as swipeable chips
├─────────────────────────────────────┤
│  🛡️ TRUST BLOCK (Compact Cards)     │ ← Buyer protection, returns, shipping
├─────────────────────────────────────┤
│  📝 DETAILS ACCORDION               │ ← Description | Specs | Shipping
├─────────────────────────────────────┤
│  👤 SELLER SECTION                  │ ← Expanded seller card with CTA
├─────────────────────────────────────┤
│  🛍️ MORE FROM SELLER (Carousel)    │ ← Horizontal scroll
├─────────────────────────────────────┤
│  ⭐ REVIEWS (Summary + See All)     │ ← Rating distribution + top 2 reviews
├─────────────────────────────────────┤
│  🔗 SIMILAR ITEMS (Carousel)        │ ← Related products
├─────────────────────────────────────┤
│           [ pb-safe padding ]       │ ← Safe area for home indicator
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [♡] [Add to Cart] [Buy Now]        │ ← Sticky bar (always visible)
└─────────────────────────────────────┘
```

---

## 🎨 New Design Tokens Needed

Add to `app/globals.css` inside `@theme`:

```css
/* === MOBILE PRODUCT PAGE TOKENS === */

/* Promo/Urgency */
--color-urgency-bg: oklch(0.97 0.03 27);        /* Light warm background */
--color-urgency-text: oklch(0.45 0.20 27);      /* Deep orange text */
--color-urgency-icon: oklch(0.55 0.22 27);      /* Fire/warning icon */

/* Live/Activity indicators */
--color-live-dot: oklch(0.55 0.25 27);          /* Pulsing "live" dot */
--color-viewers-text: oklch(0.45 0.15 27);      /* "X people viewing" */

/* Quick spec pills */
--color-spec-pill-bg: oklch(0.96 0 0);          /* Neutral pill background */
--color-spec-pill-text: oklch(0.35 0 0);        /* Pill text */
--color-spec-pill-border: oklch(0.90 0 0);      /* Subtle border */

/* Discount badge */
--color-discount-badge-bg: oklch(0.55 0.22 27); /* Red-orange */
--color-discount-badge-text: oklch(1 0 0);      /* White */

/* Stock urgency */
--color-stock-urgent-bg: oklch(0.96 0.04 27);   /* Light red bg */
--color-stock-urgent-text: oklch(0.50 0.20 27); /* Red text for low stock */

/* Mobile spacing tokens */
--spacing-mobile-section: 1rem;                  /* 16px between sections */
--spacing-mobile-card: 0.75rem;                  /* 12px inside cards */
--spacing-mobile-tight: 0.5rem;                  /* 8px tight spacing */

/* Dark mode overrides */
.dark {
  --color-urgency-bg: oklch(0.25 0.04 27);
  --color-urgency-text: oklch(0.70 0.18 27);
  --color-spec-pill-bg: oklch(0.28 0.02 250);
  --color-spec-pill-text: oklch(0.85 0 0);
  --color-stock-urgent-bg: oklch(0.25 0.06 27);
}
```

---

## 📦 Component Architecture

### New Components to Create

```
components/mobile/product/
├── mobile-product-page.tsx          # Main mobile layout orchestrator
├── mobile-gallery-enhanced.tsx      # Enhanced gallery with zoom hint
├── mobile-price-block.tsx           # Price + discount badge + savings
├── mobile-badges-row.tsx            # Condition, shipping, stock badges
├── mobile-seller-trust-line.tsx     # Compact seller + rating + verified
├── mobile-urgency-banner.tsx        # "X viewing" / "Low stock" / promo
├── mobile-quick-specs.tsx           # Horizontal scrolling attribute pills
├── mobile-trust-block.tsx           # Compact buyer protection section
├── mobile-details-accordion.tsx     # Refactored accordions
├── mobile-seller-section.tsx        # Expanded seller card for below fold
├── mobile-reviews-summary.tsx       # Rating dist + top reviews
├── mobile-sticky-bar-enhanced.tsx   # Enhanced with price + both CTAs
└── mobile-product-header.tsx        # (Already exists, minor tweaks)
```

### Component Dependencies

```
MobileProductPage
├── MobileProductHeader (fixed)
├── MobileGalleryEnhanced
├── MobilePriceBlock
│   └── DiscountBadge
├── MobileBadgesRow
│   └── Badge (condition, shipping, stock)
├── ProductTitle (simple h1)
├── MobileSellerTrustLine
│   └── Link to seller profile
├── MobileUrgencyBanner (conditional)
├── MobileQuickSpecs
├── MobileTrustBlock
├── MobileDetailsAccordion
├── MobileSellerSection
├── SellerProductsGrid (existing)
├── MobileReviewsSummary
├── SimilarItemsCarousel (new)
└── MobileStickyBarEnhanced (fixed bottom)
```

---

## 🔧 Implementation Phases

### Phase 1: Foundation & Tokens (30 min)

**Tasks:**
1. Add new tokens to `globals.css`
2. Create mobile section spacing utilities
3. Set up component directory structure

**Files:**
- `app/globals.css` (add tokens)
- Create `components/mobile/product/` directory

---

### Phase 2: Price & Badges Block (1 hour)

**MobilePriceBlock Component:**
```tsx
// Key features:
// - Large price (text-2xl font-bold)
// - Original price strikethrough
// - Discount percentage badge (red pill)
// - "You save X" text (green)
// - Currency code subtle
```

**MobileBadgesRow Component:**
```tsx
// Horizontal scrolling badges:
// - Condition (New with tags, Like New, etc.)
// - Free Shipping (if applicable)
// - Stock status (In Stock / Only X left!)
// - Express delivery (if applicable)
// All using semantic tokens
```

---

### Phase 3: Seller Trust Line (45 min)

**MobileSellerTrustLine Component:**
```tsx
// Single-line seller info:
// - Star rating (filled star + number)
// - Seller name (truncated, tappable)
// - Verified badge (shield icon)
// - Positive feedback % 
// - Chevron right (indicates tappable)
// Entire row is a link to seller profile
```

---

### Phase 4: Urgency & FOMO (45 min)

**MobileUrgencyBanner Component:**
```tsx
// Conditional display:
// - "🔥 X people viewing this" (if > 0)
// - "⚡ Only X left!" (if stock < 5)
// - "🏷️ Sale ends in XX:XX" (if promo active)
// - "✨ X sold in last 24h" (if high velocity)
// 
// Visual: Warm background, icon + text, subtle animation
```

---

### Phase 5: Quick Specs Pills (45 min)

**MobileQuickSpecs Component:**
```tsx
// Horizontal scroll of key attributes:
// - Category-relevant specs (Size: M, Color: Blue, etc.)
// - Pulled from product.attributes
// - Max 6-8 pills visible
// - "See all" link to specs accordion
```

---

### Phase 6: Trust Block Redesign (45 min)

**MobileTrustBlock Component:**
```tsx
// Compact 3-column or horizontal scroll:
// - 🛡️ Buyer Protection
// - 🔄 30-Day Returns  
// - 🚚 Fast Shipping
// 
// Each with icon + label (2 lines max)
// Tappable for more info (sheet/modal)
```

---

### Phase 7: Accordion Refactor (30 min)

**MobileDetailsAccordion Component:**
```tsx
// Sections:
// 1. About this item (description)
// 2. Item Specifics (specs table)
// 3. Shipping & Returns (info)
// 
// One open at a time, nice transitions
// Icons for each section
```

---

### Phase 8: Enhanced Seller Section (45 min)

**MobileSellerSection Component:**
```tsx
// Below-fold expanded seller card:
// - Avatar + name + verified badge
// - Rating + reviews count
// - Member since + location
// - Response time / rate
// - [Visit Store] [Message] buttons
// - "More from this seller" carousel follows
```

---

### Phase 9: Reviews Summary (45 min)

**MobileReviewsSummary Component:**
```tsx
// Compact review display:
// - Big rating number + stars
// - Rating distribution bars (5★-1★)
// - "Based on X reviews"
// - Top 2 reviews preview (truncated)
// - [Write Review] [See All Reviews] buttons
```

---

### Phase 10: Enhanced Sticky Bar (1 hour)

**MobileStickyBarEnhanced Component:**
```tsx
// Layout: [♡] [Price] [Add to Cart] [Buy Now]
// 
// Features:
// - Wishlist icon button (left)
// - Current price (compact)
// - Add to Cart (secondary style)
// - Buy Now (primary CTA, trust-blue)
// - Both buttons same width
// - Safe area padding at bottom
// - Subtle shadow/border at top
```

---

### Phase 11: Gallery Enhancement (30 min)

**MobileGalleryEnhanced Updates:**
```tsx
// Improvements:
// - Tap-to-zoom hint icon (bottom right, fades after first view)
// - Image counter "1/5" (top left, subtle)
// - Swipe affordance (dots more prominent)
// - Share button overlay (optional)
```

---

### Phase 12: Integration & Polish (1.5 hours)

**ProductPageLayout Mobile Integration:**
```tsx
// Update product-page-layout.tsx:
// - Conditional render: mobile vs desktop
// - Pass all required props to mobile components
// - Ensure no duplicate seller info
// - Proper section spacing
// - Safe area handling
```

---

## 📏 Design Specifications

### Typography Scale (Mobile Product Page)

| Element | Size | Weight | Token |
|---------|------|--------|-------|
| Price (sale) | 28px | Bold (700) | `text-[28px] font-bold` |
| Price (original) | 14px | Normal | `text-sm line-through` |
| Discount badge | 11px | Bold | `text-[11px] font-bold` |
| Title | 16px | Semibold | `text-base font-semibold` |
| Badges | 11px | Medium | `text-[11px] font-medium` |
| Seller name | 14px | Semibold | `text-sm font-semibold` |
| Body text | 14px | Normal | `text-sm` |
| Captions | 12px | Medium | `text-xs font-medium` |
| Tiny/legal | 10px | Medium | `text-2xs font-medium` |

### Spacing System

| Use Case | Value | Utility |
|----------|-------|---------|
| Section gap | 16px | `gap-4` / `mt-4` |
| Card padding | 12px | `p-3` |
| Tight gap | 8px | `gap-2` |
| Tiny gap | 4px | `gap-1` |
| Page horizontal | 16px | `px-4` |
| Safe area bottom | env() | `pb-safe` |

### Touch Targets

| Element | Min Size | Utility |
|---------|----------|---------|
| Primary CTA | 44px height | `h-11` |
| Secondary CTA | 40px height | `h-10` |
| Icon buttons | 40×40px | `size-10` |
| Wishlist heart | 40×40px | `size-10` |
| Gallery dots | 8px | (visual only) |
| Badge pills | 28px height | `h-7` |

### Color Usage (Light Mode)

| Element | Token | Value |
|---------|-------|-------|
| Price (sale) | `--color-price-regular` | Deep navy |
| Price (original) | `--color-price-original` | Muted gray |
| Discount badge bg | `--color-discount-badge-bg` | Red-orange |
| Free shipping | `--color-shipping-free` | Blue |
| In stock | `--color-stock-available` | Green |
| Low stock | `--color-stock-urgent-text` | Orange-red |
| Verified icon | `--color-verified` | Blue |
| CTA primary | `--color-cta-trust-blue` | Trust blue |
| CTA secondary | `border-border` | Neutral border |

---

## 🔍 Temu/eBay Patterns to Adopt

### From Temu:
1. **Price prominence** - Massive price, discount badge, "you save" text
2. **Urgency triggers** - "X sold", "X viewing", countdown timers
3. **Compact trust badges** - Icon + short label horizontal row
4. **Quick specs pills** - Swipeable attribute chips
5. **Social proof** - Review count prominent, star rating bold

### From eBay:
1. **Seller trust forward** - Rating %, verified badge, member since
2. **Condition clarity** - Bold condition badge with explanation
3. **Shipping transparency** - Delivery estimate, free shipping callout
4. **Buy/Cart duality** - Both CTAs always visible, equally sized
5. **Item specifics** - Clean table layout in accordion

### From Amazon:
1. **Prime/fulfillment** - Clear shipping/delivery promise
2. **Stock urgency** - "Only X left - order soon"
3. **Reviews distribution** - Visual bar chart
4. **Related items** - "Customers also viewed"

---

## ✅ Acceptance Criteria

### Above-the-Fold (Must Have)
- [ ] Gallery + price + badges visible without scroll
- [ ] Price is largest text element (28px+)
- [ ] Discount % badge if applicable
- [ ] Condition badge always visible
- [ ] Seller trust line with tap target
- [ ] Title visible (2 lines max)

### Sticky Bar (Must Have)
- [ ] Always visible at bottom
- [ ] Wishlist + Add to Cart + Buy Now
- [ ] 44px min height for CTAs
- [ ] Safe area respected

### Trust & Urgency (Should Have)
- [ ] Urgency banner shows when data available
- [ ] Trust badges visible before first accordion
- [ ] Seller rating visible without scrolling

### Performance (Must Have)
- [ ] LCP < 2.5s (gallery image)
- [ ] No layout shift on image load
- [ ] Smooth 60fps scroll
- [ ] Touch delay < 100ms

---

## 🧪 Testing Checklist

### Viewport Testing
- [ ] iPhone SE (375×667) - smallest
- [ ] iPhone 14 Pro (390×844) - standard
- [ ] iPhone 14 Pro Max (430×932) - large
- [ ] Samsung Galaxy S21 (360×800)
- [ ] Pixel 7 (412×915)

### Interaction Testing
- [ ] Gallery swipe smooth
- [ ] Gallery zoom opens/closes
- [ ] Sticky bar doesn't cover content
- [ ] All CTAs tappable
- [ ] Accordions animate smoothly
- [ ] Seller profile link works
- [ ] Wishlist toggle works
- [ ] Add to cart shows toast

### Visual Testing
- [ ] Dark mode looks correct
- [ ] No text truncation issues
- [ ] Images don't flash/shift
- [ ] Icons properly aligned
- [ ] Spacing consistent

---

## 📋 Migration Checklist

1. [ ] Add tokens to globals.css
2. [ ] Create MobilePriceBlock component
3. [ ] Create MobileBadgesRow component
4. [ ] Create MobileSellerTrustLine component
5. [ ] Create MobileUrgencyBanner component
6. [ ] Create MobileQuickSpecs component
7. [ ] Refactor MobileTrustBlock component
8. [ ] Refactor MobileDetailsAccordion component
9. [ ] Create MobileSellerSection component
10. [ ] Create MobileReviewsSummary component
11. [ ] Enhance MobileStickyBar component
12. [ ] Enhance MobileGalleryEnhanced component
13. [ ] Create MobileProductPage orchestrator
14. [ ] Update ProductPageLayout for mobile
15. [ ] Run typecheck
16. [ ] Run E2E smoke tests
17. [ ] Manual QA on multiple viewports
18. [ ] Screenshot comparison (before/after)

---

## 🚀 Quick Start

Begin with Phase 1 (tokens) and Phase 2 (price block) as they have the highest visual impact with lowest risk. The price block alone will transform the above-the-fold experience.

**Priority Order:**
1. Tokens → Price Block → Badges Row (immediate impact)
2. Sticky Bar Enhanced (conversion critical)
3. Seller Trust Line (trust critical)
4. Urgency Banner (FOMO)
5. Everything else (progressive enhancement)

---

## 📚 Reference Screenshots

See these for inspiration:
- Temu mobile product page
- eBay mobile product page
- Amazon mobile product page
- AliExpress mobile product page

Key patterns to note:
- Price is ALWAYS the largest text
- Trust badges are compact but visible
- Sticky bar has BOTH Add to Cart and Buy Now
- Urgency messaging is warm/orange toned
- Seller info is always above the fold

---

*This plan was generated on December 29, 2025. Execute phases in order for best results.*
