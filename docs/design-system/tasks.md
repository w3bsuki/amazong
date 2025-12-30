# Mobile UI/UX Redesign Tasks

> Based on [Temu UX Audit](./temu-ux-audit.md) - Goal: Dense, instant, trust-first mobile experience

---

## Phase 1: Trust & Header (Priority: HIGH)

### 1.1 Trust Bar Component
- [ ] Create `<TrustBar />` component in `components/mobile/`
- [ ] Horizontal scrollable strip with 4-5 trust signals
- [ ] Each item: Icon + 3-word label (e.g., "Free Shipping", "90-Day Returns")
- [ ] Sticky on scroll OR show condensed version in header
- [ ] Add i18n keys in `messages/bg.json` and `messages/en.json`

### 1.2 Mobile Header Redesign
- [ ] Condense header: `[☰] [Logo] [🔍] [🛒(badge)]`
- [ ] Search icon expands to full-width input on tap
- [ ] Cart badge shows item count (use existing cart state)
- [ ] Hamburger menu slides in from left
- [ ] Review `components/mobile/` for existing header components

### 1.3 Bottom Navigation
- [ ] Create `<MobileBottomNav />` with 5 tabs max
- [ ] Icons: Home, Categories, Search, Account, Cart
- [ ] Active state: filled icon + label
- [ ] Badge support for cart count
- [ ] Hide on scroll down, show on scroll up

---

## Phase 2: Category Tabs (Priority: HIGH)

### 2.1 Instant Category Switching
- [ ] Create `<CategoryTabs />` component
- [ ] Horizontal scrollable tabs
- [ ] **No page reload** - use client-side state/URL params
- [ ] Selected tab animates to first position (use `framer-motion` or CSS)
- [ ] URL updates without navigation: `/search?category=electronics`

### 2.2 Subcategory Circles
- [ ] Create `<SubcategoryCircles />` component
- [ ] Horizontal scroll row below main tabs
- [ ] Each circle: Icon + 2-word label
- [ ] Fade-in animation when parent category selected
- [ ] Pull icons from `lib/category-icons.tsx`

### 2.3 Category State Management
- [ ] Use URL search params for category state
- [ ] `useSearchParams()` for reading
- [ ] `router.push()` with shallow routing
- [ ] Persist last selected category in localStorage

---

## Phase 3: Product Card Redesign (Priority: HIGH)

### 3.1 Card Layout Update
- [ ] Audit existing card in `components/mobile/` or `components/shared/`
- [ ] New hierarchy:
  1. Image (square, 1:1 ratio)
  2. Price (bold, 16-18px, primary color)
  3. Sold count: "X sold" or "XK+ sold"
  4. Original price (strikethrough, if discounted)
  5. Rating: ★ 4.7 (123)
- [ ] Title: 2-line clamp, 13-14px

### 3.2 Social Proof Integration
- [ ] Add `sold_count` to product type/API response
- [ ] Format: `formatSoldCount(3100)` → "3.1K+ sold"
- [ ] Create utility in `lib/format-sold-count.ts`
- [ ] Gray text, smaller font (11-12px)

### 3.3 Card Interactions
- [ ] Tap → navigate to product page
- [ ] Long press → quick add to cart (optional)
- [ ] Wishlist heart icon in top-right corner
- [ ] Skeleton loading state for images

---

## Phase 4: Product Grid (Priority: MEDIUM)

### 4.1 Grid Layout
- [ ] Mobile: 2 columns, 8-12px gap
- [ ] Use CSS Grid or Flexbox
- [ ] Cards should be equal height per row
- [ ] Infinite scroll with skeleton loading

### 4.2 Section Headers
- [ ] Format: `"Section Title" [See all →]`
- [ ] Bold title left, link right
- [ ] Optional filter chips below header

### 4.3 Loading States
- [ ] Skeleton cards while fetching
- [ ] "Load more" button as fallback
- [ ] Pull-to-refresh on mobile

---

## Phase 5: Spacing & Typography (Priority: MEDIUM)

### 5.1 Tighten Spacing
- [ ] Audit current padding/margins in mobile components
- [ ] Target: 8-12px internal card padding
- [ ] Grid gap: 12-16px
- [ ] Reduce whitespace without sacrificing readability

### 5.2 Typography Scale
- [ ] Update Tailwind config or CSS variables:
  - Price: `text-base` to `text-lg`, `font-bold`
  - Title: `text-sm`, `font-normal`, `line-clamp-2`
  - Metadata: `text-xs`, `text-muted-foreground`
  - Section header: `text-lg`, `font-semibold`

### 5.3 Color Adjustments
- [ ] Ensure primary color (orange?) is used for prices/CTAs
- [ ] Gray scale for secondary text
- [ ] Review `globals.css` for CSS variables

---

## Phase 6: Promotional Sections (Priority: LOW)

### 6.1 "Why Choose Us" Section
- [ ] Create `<TrustFeatures />` grid component
- [ ] 3-4 cards with icon + 2-word label
- [ ] Place below hero or above footer
- [ ] Reuse trust bar content

### 6.2 Promo Banner
- [ ] Create `<PromoBanner />` component
- [ ] Dismissible, time-sensitive messaging
- [ ] Strong CTA button
- [ ] Can be used at top of page or between sections

---

## Component Checklist

| Component | Location | Status |
|-----------|----------|--------|
| `TrustBar` | `components/mobile/trust-bar.tsx` | ⬜ TODO |
| `MobileHeader` | `components/mobile/mobile-header.tsx` | ⬜ Audit existing |
| `MobileBottomNav` | `components/mobile/bottom-nav.tsx` | ⬜ TODO |
| `CategoryTabs` | `components/mobile/category-tabs.tsx` | ⬜ TODO |
| `SubcategoryCircles` | `components/mobile/subcategory-circles.tsx` | ⬜ TODO |
| `ProductCard` | `components/shared/product-card.tsx` | ⬜ Redesign |
| `ProductGrid` | `components/mobile/product-grid.tsx` | ⬜ Audit existing |
| `TrustFeatures` | `components/sections/trust-features.tsx` | ⬜ TODO |
| `PromoBanner` | `components/promo/promo-banner.tsx` | ⬜ TODO |

---

## Files to Audit First

1. `components/mobile/` - All existing mobile components
2. `components/shared/` - Shared card/grid components
3. `app/[locale]/` - Mobile page layouts
4. `lib/category-icons.tsx` - Existing category icons
5. `config/mega-menu-config.ts` - Category structure
6. `globals.css` - CSS variables, spacing tokens

---

## Success Metrics

- [ ] Trust bar visible on mobile homepage
- [ ] Category tabs switch without page reload
- [ ] Product cards show price, sold count, rating
- [ ] 2-column grid on mobile with tight spacing
- [ ] Bottom nav with 5 icons
- [ ] All interactions feel instant (<100ms feedback)

---

## Notes

- Use existing shadcn/ui components where possible
- Follow "modern utilitarian marketplace" style from skill file
- Test on real devices, not just DevTools
- Prioritize performance - lazy load images, minimize JS

---

*Created: 2024-12-30 | Based on: temu-ux-audit.md*
