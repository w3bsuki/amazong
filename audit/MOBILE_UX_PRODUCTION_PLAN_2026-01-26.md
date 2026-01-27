# Mobile UI/UX Production Refactor Plan
**Date:** 2026-01-26  
**Status:** PLANNING  
**Focus:** Mobile-first, production-ready, cleanest UI/UX  

---

## Executive Summary

This plan addresses the following critical issues for production push:

1. **Broken filtering UX** — Segmented control disappears on scroll, no persistent filter access
2. **Ineffective subcategory circles** — Too large, single-dimension filtering only
3. **Missing "Explore All" quick action** — Can't easily navigate to full category pages
4. **Inconsistent drawer usage** — Not utilizing mobile-native patterns
5. **Theme refinement** — Moving from Twitter Blue to OpenAI-style clean white + black
6. **Navigation state loss** — Users lose scroll position when returning from PDP

---

## Part 1: Current State Analysis

### 1.1 Landing Page Issues

| Component | Issue | Impact |
|-----------|-------|--------|
| `ExploreBanner` (segmented control) | Disappears on scroll | Users can't filter beyond initial view |
| `SubcategoryCircles` | 56px circles, single L1 filter | Wastes space, limited filtering |
| Category pills (header) | No "View All" link | Can't navigate to `/categories/[slug]` |
| Product feed | No persistent sort/filter | Only works with initial tab selection |

### 1.2 Current Navigation Flow

```
Landing Page (All tab):
├── Header: Logo + Search + Category Pills (sticky)
├── Promoted Listings (horizontal scroll)
├── For You section (horizontal scroll)
├── ExploreBanner with segmented control ❌ NOT STICKY
└── Product Feed (infinite scroll)

Landing Page (Category selected):
├── Header: Same pills, one highlighted
├── SubcategoryCircles (56px, limited) ❌ TAKES TOO MUCH SPACE
└── Product Feed (filtered by L0 only)
```

### 1.3 What Works Well

- ✅ Contextual headers (already implemented)
- ✅ Drawer infrastructure (Vaul-based, iOS-friendly)
- ✅ Product quick view drawer (exists but underutilized)
- ✅ Filter Hub drawer (full filter drawer exists)
- ✅ Sticky header with category pills

---

## Part 2: Theme Strategy Decision

### 2.1 Current Theme: Twitter Blue + Clean White

**Pros:**
- Already implemented and consistent
- Blue primary CTA is recognizable
- Works well for e-commerce

**Cons:**
- Twitter Blue may feel dated by 2026
- Not as "premium" as pure minimalist approaches

### 2.2 Proposed: OpenAI-Inspired Clean White + Black

**Key Characteristics:**
- Pure white (`oklch(1 0 0)`) backgrounds — **already have this**
- Near-black (`oklch(0.15 0 0)`) foreground text — **already have this**
- Minimal use of color (only for CTAs and status)
- More whitespace, fewer borders
- Subtle shadows instead of borders
- Monochromatic badges (black/white inverted pills)

### 2.3 Theme Implementation Approach

**RECOMMENDED: Evolve current theme, don't replace**

```css
/* Current Twitter theme already uses clean white + near-black */
:root {
  --background: oklch(1 0 0);           /* ✅ Pure white */
  --foreground: oklch(0.15 0.01 250);   /* ✅ Near black */
  --primary: oklch(0.65 0.17 230);      /* Twitter blue - KEEP for CTAs */
}
```

**Changes needed for OpenAI aesthetic:**

| Token | Current | Proposed | Reason |
|-------|---------|----------|--------|
| `--border` | `oklch(0.93 0.01 230)` | `oklch(0.95 0 0)` | Lighter, less visible borders |
| `--muted` | `oklch(0.96 0 0)` | `oklch(0.98 0 0)` | Even subtler muted backgrounds |
| Pills/chips | Bordered style | Inverted (black bg, white text) | Modern minimalist |
| Shadows | `shadow-sm` | `shadow-2xs` or none | Flatter UI |
| Cards | Bordered cards | Borderless with subtle shadow | Cleaner |

**Keep Twitter Blue for:**
- Primary CTA buttons (Buy Now, Add to Cart)
- Interactive links
- Focus rings
- Selected states

---

## Part 3: Mobile Navigation Architecture

### 3.1 Core Principle: Drawer-First Mobile UX

Modern mobile apps (Instagram, TikTok, Shopify) use drawers for:
- Quick actions without full navigation
- Preserving scroll position on parent screen
- Reducing page loads
- Creating "app-like" feel

### 3.2 Proposed Navigation Model

```
┌─────────────────────────────────────────────────────────────────┐
│ LANDING PAGE (/en)                                              │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ STICKY HEADER (48px)                                        │ │
│ │ [☰] [LOGO] [🔍] ─────────────────────────── [♡] [🛒] [👤]  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ STICKY CATEGORY PILLS (40px) - scrollable                   │ │
│ │ [All] [Fashion] [Electronics] [Home] [Beauty] [Sports] →    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ STICKY FILTER BAR (40px) - NEW!                             │ │
│ │ [⬇ Sort: Newest] [≡ Filters] ──────── [View All →]         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ PRODUCT GRID (infinite scroll)                              │ │
│ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                            │ │
│ │ │     │ │     │ │     │ │     │  ← Tap opens QUICK VIEW    │ │
│ │ │ 📦  │ │ 📦  │ │ 📦  │ │ 📦  │     DRAWER (not full page) │ │
│ │ │     │ │     │ │     │ │     │                             │ │
│ │ └─────┘ └─────┘ └─────┘ └─────┘                            │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

STICKY COMBINED HEIGHT: 48 + 40 + 40 = 128px (acceptable)
```

### 3.3 Drawer Interactions

| Action | Current | Proposed | Rationale |
|--------|---------|----------|-----------|
| Tap product card | Navigate to PDP | Open Quick View Drawer | Preview without losing scroll position |
| "View full details" in drawer | N/A | Navigate to PDP | Explicit navigation for those who want full page |
| "Buy Now" in drawer | ❌ (concerns about CTA) | **Keep Add to Cart only** | Drawer is for preview; Buy Now is commitment |
| Category "View All" | Missing | Link in filter bar OR long-press pill | Quick access to `/categories/[slug]` |
| Filter | Filter Hub drawer | Same, but with sticky trigger | Always accessible |
| Sort | Sort modal | Sort drawer (same component) | Consistent drawer pattern |

### 3.4 Quick View Drawer Mental Model

**User's question:** "Is Buy Now appropriate in a drawer?"

**Answer:** No, not for primary CTA. Here's the model:

```
┌─────────────────────────────────────────────────────────────────┐
│ QUICK VIEW DRAWER (bottom sheet, 75% height)                    │
├─────────────────────────────────────────────────────────────────┤
│ ──────── (drag handle) ────────                                 │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ GALLERY (swipeable, 60% width)                              │ │
│ │ ┌─────────────────────────────────────────────────────────┐ │ │
│ │ │                                                         │ │ │
│ │ │                    [Product Image]                      │ │ │
│ │ │                                                         │ │ │
│ │ └─────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Product Title (truncated 2 lines)                               │
│ ⭐ 4.8 (1,234) · Seller Name                                    │
│                                                                 │
│ €99.00  ̶€̶1̶2̶9̶.̶0̶0̶  -23%                                        │
│                                                                 │
│ [🚚 Free shipping] [✓ In stock]                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER (sticky, safe-area padded)                               │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ [♡ Save]  [🛒 Add to Cart]  [View Full Details →]        │   │
│ └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Key decisions:**
- **Add to Cart** = Low-commitment CTA (user adds to cart, remains in browse flow)
- **View Full Details** = Navigate to PDP (explicit, user expects page change)
- **No Buy Now** = Too high-commitment for a preview drawer
- **Save/Wishlist** = Quick action, stays in drawer
- **Drawer dismissal** = Preserves scroll position on landing page

---

## Part 4: Landing Page Refactor Specification

### 4.1 Remove Ineffective Components

| Remove | Reason | Replacement |
|--------|--------|-------------|
| `ExploreBanner` segmented control | Not sticky, confusing | Sticky filter bar |
| `SubcategoryCircles` (current) | Too large, single-dimension | Compact subcategory pills OR remove entirely |

### 4.2 New Sticky Filter Bar Component

**Component:** `MobileFilterBar`

```tsx
interface MobileFilterBarProps {
  activeSort: SortOption
  onSortClick: () => void      // Opens sort drawer
  onFilterClick: () => void    // Opens filter hub drawer
  filterCount: number          // Number of active filters (badge)
  categorySlug?: string        // If set, shows "View All" link
  categoryName?: string        // For "View All Fashion →"
}
```

**Layout:**
```
┌───────────────────────────────────────────────────────────────┐
│ [⬇ Newest ▾]    [≡ Filters (2)]    ────────    [Fashion →]   │
└───────────────────────────────────────────────────────────────┘
     Sort trigger    Filter trigger                 View All link
     (opens drawer)  (opens drawer)                 (to /categories/slug)
```

**Styling:**
```tsx
<div className={cn(
  "sticky z-30 bg-background/95 backdrop-blur-md",
  "border-b border-border/30",
  "flex items-center justify-between gap-2 px-inset py-2",
  "h-touch"
)}>
  {/* Sort dropdown trigger */}
  <button className="flex items-center gap-1.5 text-sm font-medium">
    <CaretDown size={14} />
    <span>{sortLabel}</span>
  </button>

  {/* Filter trigger with badge */}
  <button className="flex items-center gap-1.5 text-sm font-medium">
    <Sliders size={14} />
    <span>Filters</span>
    {filterCount > 0 && (
      <span className="size-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
        {filterCount}
      </span>
    )}
  </button>

  {/* View All link (only when category selected) */}
  {categorySlug && (
    <Link
      href={`/categories/${categorySlug}`}
      className="ml-auto flex items-center gap-1 text-xs font-medium text-muted-foreground"
    >
      <span>View All</span>
      <ArrowRight size={12} />
    </Link>
  )}
</div>
```

### 4.3 Subcategory Handling — Deep Analysis

**User request:** "We want to be better than Temu"

#### Analysis: Mobile E-commerce Navigation Patterns

| App | Landing Page | Category Pages | Mental Model |
|-----|--------------|----------------|--------------|
| **Temu** | Full UX (tabs, circles, pills, filters) | Full UX (same controls) | "Everything everywhere" |
| **Vinted** | Feed-first (minimal nav) | Full filter/sort UX | "Browse vs Search" |
| **eBay** | Feed + minimal circles | Full category hierarchy | "Discovery vs Intent" |
| **SHEIN** | Full tabs + circles | Contextual filters | "Dopamine shopping" |
| **Depop** | Feed only | Category pages | "Social feed first" |

#### The Problem with "Everything Everywhere" (Temu)

Temu shows lots of navigation chrome on every page:
- Multiple tab rows
- Circle grids
- Filter bars
- Category pills

**Why it works for Temu:**
- Their users are trained for "shopping as entertainment"
- Average session: 10+ minutes of scrolling
- High tolerance for visual noise

**Why it might NOT work for us:**
- Clean/minimalist brand aesthetic (OpenAI-style)
- Mixed user intent (some browse, some search)
- Cognitive load reduces conversion

#### The Key Insight: User Intent Separation

```
USER INTENT MAP:

DISCOVERY MODE (Landing Page)
├── "I'm bored, show me interesting stuff"
├── "What's new/trending?"
├── "Inspire me"
└── NEED: Quick content, minimal decisions

INTENT MODE (Category Page)  
├── "I want a red dress under €50"
├── "Show me electronics in my size"
├── "I know what I'm looking for"
└── NEED: Filters, sort, hierarchy
```

#### RECOMMENDED APPROACH: Two-Mode Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ LANDING PAGE = DISCOVERY MODE                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ HEADER: Logo + Search + minimal icons                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ L0 CATEGORY PILLS (sticky) - "Quick context switch"         │ │
│ │ [All] [Fashion] [Electronics] [Home] [Beauty] →             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ CONTEXTUAL BANNER (when category selected)                  │ │
│ │ "Fashion" — 12,345 items — [Explore Fashion →]             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ⚡ Promoted Listings (horizontal scroll)                        │
│ 🏷️ For You (personalized, horizontal scroll)                   │
│ 📦 PRODUCT GRID (infinite scroll, all/filtered by L0)          │
│                                                                 │
│ NO CIRCLES. NO FILTERS. Just content.                          │
│                                                                 │
│ User taps "Explore Fashion →" or header pill long-press        │
│ → Navigates to /categories/fashion                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CATEGORY PAGE = INTENT MODE                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ CONTEXTUAL HEADER: [← Back] Fashion                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ SUBCATEGORY CIRCLES (L1) - "Visual browse"                  │ │
│ │ [Men] [Women] [Kids] [Accessories] [Shoes] →                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ FILTER BAR (sticky) - "Power user tools"                    │ │
│ │ [Sort ▾] [Filters (3)] ─────────────── [Clear all]          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ACTIVE FILTER CHIPS                                         │ │
│ │ [Size: M ×] [Color: Black ×] [Price: €20-50 ×]             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ 📦 PRODUCT GRID (filtered by all selections)                    │
│                                                                 │
│ Circle tap → drills deeper (L2, L3)                            │
│ Filter tap → opens filter drawer                               │
│ Full power for users who WANT to drill down                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Why This Is Better Than Temu

| Aspect | Temu | Our Approach |
|--------|------|--------------|
| Landing complexity | High (5+ nav elements) | Low (2 elements) |
| Cognitive load | High | Low on landing, high when needed |
| First-time user | Overwhelmed | Clean, can discover |
| Power user | Happy | Goes to category page |
| Clean aesthetic | ❌ Busy | ✅ Minimal |
| Filter access | Everywhere | Only when user wants it |

#### When User Selects L0 Pill on Landing

**Current behavior (problematic):**
```
User taps "Fashion" pill
→ Shows big 56px circles (Men, Women, Kids)
→ User confused: "What do I do now?"
→ Taps circle, products filter
→ Wants more filters, can't find them easily
```

**Proposed behavior:**
```
User taps "Fashion" pill  
→ Products filter to Fashion (immediate feedback)
→ Small banner appears: "Fashion — 12,345 items — [Explore →]"
→ User keeps scrolling (happy, minimal distraction)
→ OR user taps "Explore" to go deep
```

#### The Banner Component

```tsx
// When L0 category is selected (not "All")
function CategoryContextBanner({ 
  categoryName, 
  productCount, 
  categorySlug 
}: Props) {
  return (
    <div className="mx-inset my-2 p-3 rounded-lg bg-muted/30 border border-border/30">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold">{categoryName}</span>
          <span className="text-xs text-muted-foreground ml-1.5">
            {productCount.toLocaleString()} items
          </span>
        </div>
        <Link 
          href={`/categories/${categorySlug}`}
          className="flex items-center gap-1 text-xs font-medium text-primary"
        >
          Explore
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  )
}
```

#### Alternative: "Smart Circles" (If Visual Browse Must Stay)

If circles are a must-have for landing page:

```
User taps "Fashion" pill
→ Products filter to Fashion
→ SMALL circles appear (40px, not 56px)
→ Circles show top 5 subcategories + "More"
→ "More" → goes to /categories/fashion
→ Circle tap → filters products (stays on page)
```

But I recommend the **NO circles on landing** approach for cleaner UX.

#### Final Decision Framework

| If user wants... | Landing action | Outcome |
|------------------|----------------|---------|
| Quick browse by L0 | Tap category pill | Products filter, banner shows |
| Visual subcategory browse | Tap "Explore" in banner | Navigate to category page |
| Deep filtering | Tap "Explore" in banner | Full filter UX on category page |
| Just scroll discovery | Keep scrolling | No interruption |

**This is better than Temu because:**
1. ✅ Cleaner landing page (less visual noise)
2. ✅ Faster initial load (less chrome)
3. ✅ Clear user path (discover vs search)
4. ✅ Power users get full tools (on category page)
5. ✅ Matches "clean white + black" aesthetic goal

### 4.4 Updated Landing Page Layout

```tsx
export function MobileHome({ ... }) {
  return (
    <PageShell variant="muted">
      {/* Header rendered by layout with L0 category pills */}

      {/* Category Context Banner (when L0 selected, NOT "All") */}
      {!nav.isAllTab && (
        <CategoryContextBanner
          categoryName={nav.activeCategoryName}
          productCount={nav.activeFeed.products.length}
          categorySlug={nav.activeTab}
          locale={locale}
        />
      )}

      {/* Promoted Listings (All tab only) */}
      {nav.isAllTab && promotedProducts.length > 0 && (
        <PromotedListingsStrip products={promotedProducts} />
      )}

      {/* For You section (All tab only) */}
      {nav.isAllTab && (
        <ForYouSection products={nav.activeFeed.products.slice(0, 8)} />
      )}

      {/* Simple Sort Dropdown (not a full filter bar) */}
      <div className="px-inset py-2 flex items-center justify-between">
        <SortDropdown 
          activeSort={sortOption}
          onSortChange={setSortOption}
        />
        {!nav.isAllTab && (
          <span className="text-xs text-muted-foreground">
            {nav.activeFeed.products.length} items
          </span>
        )}
      </div>

      {/* Product Grid - drawer opens on tap (already works) */}
      <ProductFeed
        products={nav.activeFeed.products}
        hasMore={nav.activeFeed.hasMore}
        isLoading={nav.isLoading}
        onLoadMore={nav.loadMoreProducts}
        // Product card already opens drawer via useDrawer() context
      />

      {/* NO FilterHub on landing - only on category pages */}
      {/* Sort drawer if needed */}
      <SortDrawer open={sortDrawerOpen} onOpenChange={setSortDrawerOpen} />
    </PageShell>
  )
}
```

**Key Changes from Current:**
1. ❌ Removed `SubcategoryCircles` — too much visual noise
2. ❌ Removed `ExploreBanner` with segmented control — confusing, not useful
3. ✅ Added `CategoryContextBanner` — clean, shows "Explore" link
4. ✅ Simplified sort to dropdown only — no filter bar on landing
5. ✅ Product tap → drawer (already works via feature flag)

---

## Part 5: Category Pages Strategy

### 5.1 When to Navigate to `/categories/[slug]`

| Scenario | Action | Destination |
|----------|--------|-------------|
| User wants full category experience | Tap "View All" link | `/categories/fashion` |
| User wants deep filtering | Tap "Filters" in filter bar | Opens Filter Hub drawer |
| User wants to drill into subcategory | Tap pill (Fashion > Men) | Stay on landing, filter applied |
| User wants to see category page with full tools | Long-press category pill OR tap View All | `/categories/fashion` |

### 5.2 Category Page Features (Contextual Mode)

The `/categories/[slug]` pages already have:
- ✅ Contextual header (back button, title)
- ✅ Inline filter bar (sort + filters)
- ✅ Filter chips (removable)
- ✅ URL-synced filters

**What to add:**
- Better category-specific filters (brand, size, color for fashion)
- Price range slider
- Condition filter (for used items)

---

## Part 6: Product Card Interaction Flow

### 6.1 Current Flow (ALREADY WORKING ✓)

The drawer system is already implemented and enabled:

```tsx
// lib/feature-flags.ts
drawerProductQuickView: {
  enabled: true,
  rolloutPercentage: 100,  // Full rollout
}
```

```
User taps product card
  → Quick View Drawer opens (via DrawerContext)
  → User sees preview: image, title, price, rating
  → Add to Cart → stays in drawer, toast confirms
  → View Full Details → navigates to PDP
  → Dismiss drawer → scroll position preserved ✓
```

**Status:** No changes needed for drawer-first product interaction.

### 6.2 Drawer CTA Refinement (Optional)

Current quick view drawer CTAs may need review for consistency. See drawer component for current implementation.

### 6.3 No Additional Implementation Needed

**ProductCard changes:**

```tsx
interface ProductCardProps {
  product: UIProduct
  onQuickView?: (product: UIProduct) => void  // NEW
  onClick?: () => void  // Existing - now optional
}

function ProductCard({ product, onQuickView, onClick }: ProductCardProps) {
  const handleClick = () => {
    if (onQuickView) {
      onQuickView(product)  // Opens drawer
    } else if (onClick) {
      onClick()  // Custom handler
    } else {
      // Default: navigate to PDP (backward compatible)
      router.push(productPath)
    }
  }

  return (
    <button onClick={handleClick} className="...">
      {/* Card content */}
    </button>
  )
}
```

**ProductFeed changes:**

```tsx
interface ProductFeedProps {
  products: UIProduct[]
  onProductClick?: (product: UIProduct) => void  // NEW
  // ... existing props
}

function ProductFeed({ products, onProductClick, ... }: ProductFeedProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onProductClick}  // Pass through
        />
      ))}
    </div>
  )
}
```

---

## Part 7: Theme Token Updates

### 7.1 OpenAI Aesthetic Refinements

Update `app/globals.css`:

```css
:root {
  /* Keep existing base colors - already clean */
  --background: oklch(1 0 0);                /* Pure white ✓ */
  --foreground: oklch(0.15 0.01 250);        /* Near black ✓ */

  /* Soften borders for cleaner look */
  --border: oklch(0.95 0 0);                 /* Was: 0.93 → lighter */

  /* Subtler muted backgrounds */
  --muted: oklch(0.98 0 0);                  /* Was: 0.96 → even lighter */

  /* Reduced shadow intensity */
  --shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 4%);
  --shadow: 0 2px 4px -1px oklch(0 0 0 / 5%);
  --shadow-md: 0 4px 6px -2px oklch(0 0 0 / 5%);
}
```

### 7.2 Tailwind v4 + shadcn Theme Structure

**Yes, styling goes in `globals.css` under `:root` and `.dark`**

The `@theme inline` block in `globals.css` bridges CSS vars to Tailwind:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... all semantic tokens */
}
```

**Pattern for new tokens:**
1. Define CSS var in `:root` and `.dark`
2. Add Tailwind mapping in `@theme inline`
3. Use via Tailwind class: `bg-[semantic-name]` or `text-[semantic-name]`

### 7.3 Pill/Chip Style Update

**Current:** Bordered pills with subtle backgrounds
**Proposed:** Inverted pills for selected state

```css
/* Add to globals.css */
:root {
  --pill-default-bg: var(--background);
  --pill-default-text: var(--foreground);
  --pill-default-border: var(--border);
  --pill-active-bg: var(--foreground);
  --pill-active-text: var(--background);
}

@theme inline {
  --color-pill-default-bg: var(--pill-default-bg);
  --color-pill-default-text: var(--pill-default-text);
  --color-pill-default-border: var(--pill-default-border);
  --color-pill-active-bg: var(--pill-active-bg);
  --color-pill-active-text: var(--pill-active-text);
}
```

**Usage:**
```tsx
<button className={cn(
  "h-8 px-3 rounded-full text-xs font-medium transition-colors",
  isActive
    ? "bg-pill-active-bg text-pill-active-text"
    : "bg-pill-default-bg text-pill-default-text border border-pill-default-border"
)}>
  {label}
</button>
```

---

## Part 8: Implementation Roadmap

### Phase 1: Landing Page Simplification (Day 1-2)
- [ ] Create `CategoryContextBanner` component (simple banner when L0 selected)
- [ ] Update `MobileHome` to remove `SubcategoryCircles` render
- [ ] Update `MobileHome` to show context banner instead
- [ ] Simplify or remove `ExploreBanner` segmented control
- [ ] Test: L0 pills filter products, banner appears with "Explore" link

### Phase 2: Category Page Full UX (Day 2-3)
- [ ] Ensure `/categories/[slug]` has contextual mode enabled
- [ ] Verify circles render on category pages (they should already)
- [ ] Add/verify sticky filter bar with Sort + Filters
- [ ] Verify filter chips work (already implemented)
- [ ] Test: Full drill-down UX on category pages

### Phase 3: Theme Polish (Day 3-4)
- [ ] Update border tokens (lighter: `oklch(0.95 0 0)`)
- [ ] Update muted tokens (subtler: `oklch(0.98 0 0)`)
- [ ] Add inverted pill style tokens
- [ ] Update all category pills to inverted style
- [ ] Visual QA: Light + dark mode

### Phase 4: Quick View Drawer Review (Day 4)
- [ ] Review CTAs in `ProductQuickViewDrawer`
- [ ] Ensure "Add to Cart" is prominent
- [ ] Ensure "View Full Details" navigates properly
- [ ] Consider removing "Buy Now" if present (too high commitment)
- [ ] Test drawer flow on landing page

### Phase 5: Testing & Polish (Day 5-6)
- [ ] E2E tests for new flows
- [ ] Performance check (no regressions)
- [ ] Accessibility check (focus management, screen reader)
- [ ] Update `DESIGN.md` with new patterns
- [ ] Final visual QA pass

---

## Part 9: Decision Log

| Question | Decision | Rationale |
|----------|----------|-----------|
| Keep Twitter Blue primary? | **Yes** | Works well for CTAs, recognizable, already implemented |
| Buy Now in quick view drawer? | **Remove or keep Add to Cart only** | Drawer is preview context; keep commitment low |
| Subcategory circles on landing? | **No - use banner instead** | Cleaner UX, less cognitive load, better than Temu |
| Category pages have circles? | **Yes** | Full UX for intent-mode users |
| Filter bar on landing? | **Yes, but simpler** | Sort dropdown + "Explore" link (no filter drawer trigger) |
| Filter bar on category page? | **Yes, full** | Sort + Filters + Chips for power users |
| Product drawer already works? | **Yes** | Feature flag at 100%, no changes needed |

---

## Part 10: Files to Modify

### New Files
- `components/mobile/category-context-banner.tsx` — Small banner when L0 selected

### Modify
- `components/mobile/mobile-home.tsx` — Remove circles, add context banner
- `components/mobile/explore-banner.tsx` — Simplify or remove (replaced by context banner)
- `app/[locale]/(main)/categories/[slug]/page.tsx` — Ensure full UX with circles + filters
- `app/globals.css` — Theme token refinements

### Delete or Deprecate
- `components/mobile/subcategory-circles.tsx` — No longer used on landing (keep for category pages)

### Keep As-Is
- `components/mobile/drawers/product-quick-view-drawer.tsx` — Already working
- `components/shared/product/product-card.tsx` — Already opens drawer on mobile
- `/categories` page structure — Already has contextual mode

---

## Part 11: Success Metrics

| Metric | Target |
|--------|--------|
| Sticky filter bar visible on scroll | 100% of scroll depth |
| Quick view drawer open time | <200ms |
| Add to Cart from drawer | Working, toast confirmation |
| Category "View All" accessible | Always visible when category selected |
| Scroll position preserved after drawer dismiss | Yes |
| Visual QA pass | All screens, light + dark mode |

---

## Appendix A: Reference Implementations

### A.1 Apps with excellent mobile filtering
- **Vinted** — Sticky filter bar, drawer-based filters, excellent UX
- **Depop** — Simple pills, quick filters
- **eBay** — Classic but effective filter chips
- **Shopify mobile** — Clean, drawer-first

### A.2 Apps with clean white + black aesthetics
- **OpenAI ChatGPT** — Pure white, minimal borders, inverted pills
- **Linear** — Clean, professional, minimal color
- **Notion** — White canvas, subtle shadows
- **Apple Store app** — White bg, black text, blue CTAs

---

## Approval Checklist

Before implementation:
- [ ] User confirms theme direction (evolve vs replace)
- [ ] User confirms drawer-first product interaction
- [ ] User confirms subcategory pills over circles
- [ ] User confirms sticky filter bar approach
- [ ] User confirms "no Buy Now in drawer" decision

---

*Last updated: 2026-01-26*
