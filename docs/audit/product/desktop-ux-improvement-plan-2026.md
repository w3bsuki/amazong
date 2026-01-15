# Treido Desktop UI/UX Improvement Plan 2026

**Date:** January 13, 2026  
**Audit Type:** Full Desktop UI/UX Comparative Analysis  
**Auditor:** Playwright Browser Automation + Manual Analysis  
**Inspirations:** Vinted, eBay, Depop, Etsy, OLX.bg, Bazar.bg  

---

## Executive Summary

This document presents a comprehensive desktop UI/UX improvement plan for Treido, comparing our current implementation against industry-leading C2C/B2B marketplaces. The goal is to achieve **best-in-class desktop UX by 2026** while maintaining our clean, dense marketplace aesthetic.

### Current State: B+ → Target: A+

| Area | Current | Target | Gap |
|------|---------|--------|-----|
| Navigation & Discovery | B | A+ | Major overhaul needed |
| Product Cards | B+ | A+ | Trust indicators missing |
| Search UX | B- | A | Autocomplete, filters weak |
| Category Browsing | C+ | A | No mega-menu, poor hierarchy |
| Product Detail Page | B+ | A+ | Good foundation, needs polish |
| Trust & Safety | C+ | A+ | Critical gap vs competition |
| Seller Experience | B | A | Profile pages need work |

---

## Part 1: Competitive Benchmark Analysis

### 🏆 Top 3 Desktop UX Leaders (2025-2026)

#### 1. **Vinted** — Best Trust-First Design
| Strength | Implementation | Treido Gap |
|----------|----------------|------------|
| Buyer Protection inline on every card | `$27.18` → `$29.24 incl. Buyer Protection` | ❌ Not shown on cards |
| Dual-price transparency | Base + total with fees | ❌ Single price only |
| Condition badges | "Very good", "Like new" prominent | ⚠️ Shown but not prominent |
| 3:4 portrait product images | 310x430 WebP | ⚠️ Square images |
| Social proof on cards | ♡ count visible | ⚠️ No favorites count |

#### 2. **Depop** — Best Visual-First Design
| Strength | Implementation | Treido Gap |
|----------|----------------|------------|
| Shop by style | "Athleisure", "Vintage" filters | ❌ No style taxonomy |
| Trend indicators | "+1.6k searches" badges | ❌ No demand signals |
| Price segmentation | "Under €10", "Under €20" quick filters | ❌ No quick price filters |
| Visual search | Upload image → find similar | ❌ Not implemented |

#### 3. **eBay** — Best Search & Navigation
| Strength | Implementation | Treido Gap |
|----------|----------------|------------|
| Mega-menu with images | Hover → rich dropdown | ❌ Disabled menu button |
| Category scope in search | "laptops in Electronics" | ❌ No scoped search |
| Abbreviation support | "13in", "XL", "EU 42" | ⚠️ Not tested |
| View All at each level | Every category has "View All" | ⚠️ Partial |

### OLX.bg & Bazar.bg (Local Competition)

| Feature | OLX.bg | Bazar.bg | Treido |
|---------|--------|----------|--------|
| Dual currency (BGN + EUR) | ✅ | ✅ | ⚠️ EUR only |
| Promoted listings badge | ✅ | ✅ | ✅ |
| Location-based filters | ✅ | ✅ | ❌ |
| Business profiles | ✅ | ✅ | ⚠️ Partial |
| Chat integration | ✅ | ✅ | ✅ |
| Mobile apps promoted | ✅ | ✅ | ❌ |

---

## Part 2: Current State Issues

### 🔴 Critical Issues

| Issue | Location | Impact | Priority |
|-------|----------|--------|----------|
| **Mobile nav on desktop** | Categories, Search, Wishlist | Broken layout, confusing UX | P0 |
| **Menu button disabled** | All pages (guests) | No navigation for 90% users | P0 |
| **No mega-menu** | Header | Can't browse categories | P0 |
| **Gift Cards page empty** | `/en/gift-cards` | Broken route | P0 |
| **Seller profile page errors** | `/en/[username]` | Missing translations | P0 |

### 🟠 High Priority Issues

| Issue | Location | Impact | Priority |
|-------|----------|--------|----------|
| No Buyer Protection on cards | Product cards | Trust gap vs Vinted | P1 |
| No favorites count on cards | Product cards | Missing social proof | P1 |
| Generic page titles | Multiple pages | Poor SEO, bad UX | P1 |
| Search has no autocomplete | Header search | Discovery friction | P1 |
| Footer collapsed by default | All pages | Hidden info on desktop | P1 |
| No category thumbnails | Categories page | Visual hierarchy weak | P1 |

### 🟡 Medium Priority Issues

| Issue | Location | Impact | Priority |
|-------|----------|--------|----------|
| No price filters | Search/category | Filter friction | P2 |
| No condition filters | Search/category | C2C essential feature | P2 |
| Social links placeholder | Footer | Incomplete feel | P2 |
| Copyright 2024 | Footer | Outdated | P2 |
| No breadcrumbs consistency | Various | Navigation confusion | P2 |
| No seller verification badges | Seller cards | Trust gap | P2 |

---

## Part 3: Improvement Roadmap

### Phase 1: Critical Fixes (Week 1-2)

#### 1.1 Fix Mobile Nav on Desktop
```
Problem: Mobile bottom navigation visible on desktop viewport
Solution: Add responsive class to hide on lg+ breakpoints
Files: components/mobile/MobileNav.tsx or layout
Effort: 1 hour
```

#### 1.2 Enable Desktop Navigation
```
Problem: Menu button disabled for guests
Solution: Enable for all users, show login prompt for protected actions
Files: components/layout/Header.tsx, navigation components
Effort: 4 hours
```

#### 1.3 Implement Mega-Menu
```
Problem: No way to browse categories from header
Solution: Build hover-activated mega-menu with category images
Reference: eBay, Wayfair mega-menu patterns
Components needed:
  - MegaMenuTrigger
  - MegaMenuPanel
  - CategoryColumn
  - SubcategoryLink
Effort: 16 hours
```

#### 1.4 Fix Empty Pages
```
Problem: Gift Cards, some category pages broken
Solution: Implement content or proper empty states
Effort: 4 hours
```

---

### Phase 2: Trust & Social Proof (Week 3-4)

#### 2.1 Buyer Protection on Product Cards
```
Current card:
┌─────────────────────────────┐
│  [Image]                    │
│  ♡                          │
├─────────────────────────────┤
│  Product Title              │
│  €12.34                     │
│  3 wk. ago                  │
└─────────────────────────────┘

Target card (Vinted-inspired):
┌─────────────────────────────┐
│  [Image 1] [·] [·] [·]      │  ← Multiple images indicator
│  ♡ 24                       │  ← Favorites count
├─────────────────────────────┤
│  Brand Name (if applicable) │
│  Size M · Very good         │  ← Condition badge
│  ─────────────────────────  │
│  €12.34                     │  ← Base price
│  €13.50 incl. protection    │  ← Total with fees (muted)
│  🛡️ Buyer Protection        │  ← Trust badge
└─────────────────────────────┘

Files to modify:
  - components/buyer/product-card.tsx (or equivalent)
  - Add BuyerProtectionBadge component
  - Add ConditionBadge component
  - Add FavoritesCount component
Effort: 12 hours
```

#### 2.2 Seller Verification Badges
```
Implement tiered verification:
- ✓ Email verified (basic)
- ✓✓ Phone verified (standard)
- ✓✓✓ ID verified (premium)
- 🏆 Top Seller badge

Show on:
- Seller cards (/en/sellers)
- Product cards (seller row)
- Product detail page (seller section)
- Seller profile page

Effort: 8 hours
```

#### 2.3 Social Proof Elements
```
Add to product cards:
- Favorites/saves count (♡ 24)
- View count (optional, consider privacy)
- "X people looking at this" (real-time, optional)

Add to seller profiles:
- Response rate
- Response time
- Transaction count
- Rating breakdown

Effort: 8 hours
```

---

### Phase 3: Search & Discovery (Week 5-6)

#### 3.1 Search Autocomplete
```
Current: Plain input with no suggestions
Target: Rich autocomplete with:
  - Recent searches (local storage)
  - Trending searches (backend API)
  - Category suggestions
  - Product suggestions with images
  - "Search in [Category]" scope option

Components:
  - SearchCombobox
  - RecentSearches
  - TrendingSearches
  - CategorySuggestions
  - ProductSuggestions

Reference: eBay, Amazon search patterns
Effort: 20 hours
```

#### 3.2 Filter Bar Improvements
```
Current: Basic filter buttons (All filters, Sort, Price, Category)
Target:
  - Quick condition filter (New, Like New, Good, etc.)
  - Quick price ranges (Under €10, €10-€25, €25-€50, €50+)
  - Brand filter (top brands)
  - Location filter (for local pickup)
  - "View All" chip to clear filters

Filter bar layout:
[All filters] [Condition ▾] [Price ▾] [Brand ▾] [Location ▾] [Sort ▾]

Add condition filter pills:
[All] [New] [Like new] [Very good] [Good] [Fair]

Effort: 16 hours
```

#### 3.3 Category Mega-Menu
```
Structure:
┌────────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Fashion  │  │ Tech     │  │ Home     │  │ Beauty   │  ...  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
├────────────────────────────────────────────────────────────────┤
│  Fashion                                                       │
│  ├── Men's                    ├── Women's                     │
│  │   ├── Clothing             │   ├── Clothing                │
│  │   ├── Shoes                │   ├── Shoes                   │
│  │   └── Accessories          │   └── Accessories             │
│  ├── Kids                     ├── View All Fashion →          │
│  └── Unisex                                                   │
│                                        [Featured Image]        │
└────────────────────────────────────────────────────────────────┘

Features:
- Hover delay 300-500ms (prevent accidental triggers)
- Category images for visual recognition
- "View All" at each level
- Highlight current category scope
- Subcategory thumbnails (Baymard: 55% of sites missing this)

Effort: 24 hours
```

---

### Phase 4: Product Detail Page Polish (Week 7-8)

#### 4.1 Desktop Layout Optimization
```
Current: Single-column scrolling layout
Target: Two-column layout for desktop

┌─────────────────────────────────────────────────────────────┐
│  [Back]                                    [Share] [More]   │
├────────────────────────┬────────────────────────────────────┤
│                        │                                    │
│   [Image Gallery]      │   Category > Subcategory           │
│   [Main Image]         │                                    │
│   [Thumbnails...]      │   Product Title                    │
│                        │   ⭐⭐⭐⭐⭐ (123 reviews)          │
│                        │                                    │
│                        │   €12.34                           │
│                        │   €13.50 incl. Buyer Protection    │
│                        │                                    │
│                        │   🛡️ Buyer Protection included     │
│                        │   📦 Free shipping                 │
│                        │   ↩️ 30-day returns                │
│                        │                                    │
│                        │   [Buy Now]  [Add to Cart]         │
│                        │   [💬 Chat with Seller]            │
│                        │                                    │
│                        │   ┌─────────────────────────────┐  │
│                        │   │ 👤 seller_name              │  │
│                        │   │ ⭐ 4.9 · 234 sales          │  │
│                        │   │ [View Profile]              │  │
│                        │   └─────────────────────────────┘  │
├────────────────────────┴────────────────────────────────────┤
│  Details                                                    │
│  Condition: Very good | Size: M | Brand: Nike               │
├─────────────────────────────────────────────────────────────┤
│  Description                                                │
│  Lorem ipsum...                                             │
├─────────────────────────────────────────────────────────────┤
│  Shipping & Returns (collapsible)                           │
├─────────────────────────────────────────────────────────────┤
│  Customer Reviews                                           │
│  [Rating breakdown] [Review list]                           │
└─────────────────────────────────────────────────────────────┘

Effort: 16 hours
```

#### 4.2 Image Gallery Enhancement
```
Current: Single image carousel
Target:
- Multiple image thumbnails below main image
- Zoom on hover (desktop)
- Fullscreen lightbox view
- Image count indicator (1/5)
- Video support (if applicable)

Effort: 8 hours
```

#### 4.3 Trust Badges Section
```
Add prominent trust indicators:
┌─────────────────────────────────────────────┐
│ 🛡️ Buyer Protection | 📦 Free Shipping     │
│ ↩️ 30-day Returns   | 🔒 Secure Payment     │
└─────────────────────────────────────────────┘

Effort: 2 hours
```

---

### Phase 5: Seller Experience (Week 9-10)

#### 5.1 Seller Profile Page Redesign
```
Current issues:
- Translation errors (MISSING_MESSAGE)
- Sparse layout
- No verification indicators

Target layout:
┌─────────────────────────────────────────────────────────────┐
│  [Avatar]  seller_name                                      │
│            ⭐ 4.9 (234 reviews) · Member since Jan 2024     │
│            ✓✓✓ Verified Seller                              │
│            [Follow] [Message]                               │
├─────────────────────────────────────────────────────────────┤
│  Stats                                                      │
│  [Items] 45  |  [Sold] 123  |  [Response] < 1 hour         │
├─────────────────────────────────────────────────────────────┤
│  About                                                      │
│  "Hi! I sell quality second-hand electronics..."            │
├─────────────────────────────────────────────────────────────┤
│  [All] [For Sale] [Sold] [Reviews]   [Sort ▾] [Filter ▾]   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │     │ │     │ │     │ │     │ │     │ │     │          │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘          │
└─────────────────────────────────────────────────────────────┘

Effort: 16 hours
```

#### 5.2 Sellers Directory Enhancement
```
Current: Basic grid of seller cards
Target:
- Search sellers by name
- Filter by category specialty
- Sort by rating, sales, new arrivals
- Seller card improvements:
  - Verification badges
  - Category tags
  - Featured items preview

Effort: 8 hours
```

---

### Phase 6: Footer & Global Elements (Week 11)

**Status:** ✅ Completed (2026-01-13)

**Implementation notes:**
- Desktop footer is always expanded on `lg+` (no accordion collapse).
- Mobile/tablet keeps accordion behavior.
- Desktop footer includes “Back to top”.
- Social links row renders only when real URLs exist (no placeholder/dead links). Configure via `NEXT_PUBLIC_SOCIAL_*` env vars.
- Page titles standardized so the global template applies exactly once: `{Page Name} | Treido`.

#### 6.1 Desktop Footer Expansion
```
Current: Collapsed accordion sections
Target: Full expanded footer on desktop

┌─────────────────────────────────────────────────────────────┐
│  [Back to top]                                              │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│  Company    │  Help       │  Sell       │  Download App   │
│  About      │  Help Center│  Start Sell │  [App Store]    │
│  Careers    │  Contact    │  Seller Hub │  [Google Play]  │
│  Press      │  Returns    │  Fees       │                 │
│  Blog       │  Shipping   │  Tools      │  [QR Code]      │
├─────────────┴─────────────┴─────────────┴─────────────────┤
│  [Pinterest] [Facebook] [Instagram] [X] [YouTube] [TikTok] │
├─────────────────────────────────────────────────────────────┤
│  Terms · Privacy · Cookies · ODR                           │
│  Treido Ltd. · Sofia, Bulgaria · VAT: BG123456789          │
│  © 2026 Treido, Inc.                                       │
└─────────────────────────────────────────────────────────────┘

Effort: 4 hours
```

#### 6.2 Page Titles Standardization
```
Pattern: "{Page Name} | Treido"

Current issues:
- "Treido - Online Shopping" (generic)
- "Top Sellers | Treido | Treido" (duplicate)
- Missing titles on some pages

Fix all page metadata to follow pattern.
Effort: 4 hours
```

---

## Part 4: Design Specifications

### Product Card Redesign Spec

```css
/* Card dimensions */
.product-card {
  width: 100%;
  aspect-ratio: auto; /* Height based on content */
  border-radius: var(--radius-md); /* 4px */
  border: 1px solid var(--border);
  background: var(--card);
}

/* Image */
.product-card-image {
  aspect-ratio: 4/5; /* Portrait like Vinted */
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

/* Content padding */
.product-card-content {
  padding: 0.75rem; /* 12px */
  gap: 0.25rem; /* 4px between elements */
}

/* Typography */
.product-card-title {
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  line-clamp: 2;
}

.product-card-price {
  font-size: 1rem; /* 16px */
  font-weight: 600;
}

.product-card-price-total {
  font-size: 0.75rem; /* 12px */
  color: var(--muted-foreground);
}

.product-card-condition {
  font-size: 0.625rem; /* 10px */
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 9999px;
  background: var(--muted);
}
```

### Condition Badge Colors

| Condition | Background | Text |
|-----------|------------|------|
| New with tags | `bg-emerald-100` | `text-emerald-700` |
| New without tags | `bg-emerald-50` | `text-emerald-600` |
| Like new | `bg-blue-100` | `text-blue-700` |
| Very good | `bg-sky-100` | `text-sky-700` |
| Good | `bg-amber-100` | `text-amber-700` |
| Fair | `bg-orange-100` | `text-orange-700` |

### Trust Badge Design

```tsx
// Buyer Protection Badge
<div className="flex items-center gap-1.5 text-xs text-emerald-600">
  <ShieldCheck className="h-3.5 w-3.5" />
  <span>Buyer Protection</span>
</div>

// Verified Seller Badge
<div className="flex items-center gap-1">
  <BadgeCheck className="h-4 w-4 text-blue-500" />
  <span className="text-xs font-medium">Verified</span>
</div>
```

---

## Part 5: Implementation Priority Matrix

### Effort vs Impact Matrix

```
                    HIGH IMPACT
                        │
    ┌───────────────────┼───────────────────┐
    │ Quick Wins        │ Major Projects    │
    │                   │                   │
    │ • Fix mobile nav  │ • Mega-menu       │
    │ • Page titles     │ • Search autocomplete
    │ • Footer expand   │ • Card redesign   │
    │ • Enable Menu btn │ • Seller profiles │
LOW │                   │                   │ HIGH
EFFORT ─────────────────┼───────────────────── EFFORT
    │                   │                   │
    │ Fill Later        │ Consider Carefully│
    │                   │                   │
    │ • Visual search   │ • Style taxonomy  │
    │ • App promotion   │ • AI features     │
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                    LOW IMPACT
```

### Sprint Breakdown

| Sprint | Focus | Stories | Effort |
|--------|-------|---------|--------|
| Sprint 1 | Critical Fixes | Mobile nav, Menu, Empty pages | 10h |
| Sprint 2 | Navigation | Mega-menu implementation | 24h |
| Sprint 3 | Product Cards | Trust badges, condition, social proof | 20h |
| Sprint 4 | Search | Autocomplete, filters | 36h |
| Sprint 5 | PDP | Desktop layout, gallery | 24h |
| Sprint 6 | Seller | Profile pages, directory | 24h |
| Sprint 7 | Polish | Footer, titles, remaining issues | 12h |

**Total Estimated Effort: ~150 hours**

---

## Part 6: Success Metrics

### Key Performance Indicators

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Category navigation usage | Unknown | +50% | Analytics |
| Search-to-purchase rate | Unknown | +25% | Funnel |
| Average session duration | Unknown | +30% | Analytics |
| Bounce rate from PDP | Unknown | -20% | Analytics |
| Mobile nav complaints | High | Zero | Bug reports |
| Seller profile views | Unknown | +40% | Analytics |

### User Testing Goals

- [ ] Users can find categories within 3 clicks
- [ ] Users understand Buyer Protection before purchase
- [ ] Users can filter by condition and price easily
- [ ] Users trust sellers based on visible verification
- [ ] Users can search and find products in < 30 seconds

---

## Part 7: Design References

### Inspiration Screenshots Needed

1. **Vinted** - Product card with dual pricing
2. **Vinted** - Buyer Protection explanation
3. **eBay** - Mega-menu hover state
4. **eBay** - Search autocomplete
5. **Depop** - Condition badges
6. **Etsy** - Seller profile layout
7. **OLX.bg** - Category grid
8. **Bazar.bg** - Filter bar

### Component Library Additions

```
components/
├── common/
│   ├── BuyerProtectionBadge.tsx    ← NEW
│   ├── ConditionBadge.tsx          ← NEW
│   ├── VerificationBadge.tsx       ← NEW
│   ├── FavoritesCount.tsx          ← NEW
│   └── TrustBadges.tsx             ← NEW
├── navigation/
│   ├── MegaMenu/                   ← NEW
│   │   ├── MegaMenuTrigger.tsx
│   │   ├── MegaMenuPanel.tsx
│   │   ├── CategoryColumn.tsx
│   │   └── index.tsx
│   └── SearchCombobox/             ← NEW
│       ├── SearchInput.tsx
│       ├── RecentSearches.tsx
│       ├── TrendingSearches.tsx
│       └── index.tsx
└── seller/
    └── SellerStats.tsx             ← NEW
```

---

## Appendix A: Competitive Feature Matrix

| Feature | Treido | Vinted | eBay | Depop | OLX.bg | Priority |
|---------|--------|--------|------|-------|--------|----------|
| Mega-menu | ❌ | ✅ | ✅ | ⚠️ | ❌ | P0 |
| Search autocomplete | ❌ | ✅ | ✅ | ✅ | ✅ | P1 |
| Buyer Protection inline | ❌ | ✅ | ✅ | ✅ | ❌ | P1 |
| Condition filters | ❌ | ✅ | ✅ | ✅ | ❌ | P1 |
| Favorites count | ❌ | ✅ | ✅ | ✅ | ❌ | P2 |
| Seller verification | ⚠️ | ✅ | ✅ | ✅ | ✅ | P1 |
| Visual search | ❌ | ✅ | ✅ | ✅ | ❌ | P3 |
| Price range filters | ❌ | ✅ | ✅ | ✅ | ✅ | P1 |
| Location filters | ❌ | ✅ | ✅ | ❌ | ✅ | P2 |
| Multiple images indicator | ❌ | ✅ | ✅ | ✅ | ✅ | P2 |
| Trending searches | ❌ | ✅ | ✅ | ✅ | ❌ | P2 |

---

## Appendix B: Technical Debt

Issues discovered during audit that need addressing:

1. **Missing translations** - `Product.condition.new` error on seller pages
2. **Duplicate page title** - "Treido | Treido" on seller pages
3. **Console errors** - IntlError on various pages
4. **Cart button inconsistency** - Sometimes Cart, sometimes button
5. **Next.js Dev Tools visible** - Should hide in production

---

## Conclusion

Treido has a solid foundation with clean design and good semantics. To compete with Vinted, eBay, and other market leaders in 2026, we need to:

1. **Immediately**: Fix broken navigation and enable category discovery
2. **Short-term**: Add trust indicators (Buyer Protection, verification)
3. **Medium-term**: Enhance search with autocomplete and filters
4. **Long-term**: Polish seller experience and add social features

The estimated 150 hours of work across 7 sprints will bring Treido from B+ to A+ in desktop UX, making it competitive with global marketplace leaders while maintaining our clean Bulgarian marketplace identity.

---

*Document generated from Playwright browser audit and competitive analysis on January 13, 2026.*
