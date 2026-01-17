# Mobile Landing Migration Guide

> **Goal:** Replace the main mobile landing UI with `/demo/mobile` patterns while preserving all existing business logic, data fetching, filters, and integrations.

---

## Overview

### What We're Migrating

| Component | Demo Location | Target Location |
|-----------|---------------|-----------------|
| Header (Temu-style) | `demo/mobile/_components` | `components/mobile/` |
| Bottom Navigation | `demo/mobile/_components` | `components/mobile/` |
| Search Overlay | `demo/mobile/_components` | `components/mobile/` |
| Hamburger Menu | `demo/mobile/_components` | `components/mobile/` |
| Product Card (compact) | `demo/mobile/_components` | `components/mobile/` |
| Category Pills | `demo/mobile/_components` | `components/mobile/` |
| Subcategory Circles | `demo/mobile/_components` | `components/mobile/` |
| Filter/Sort Drawers | `demo/mobile/_components` | Keep existing, restyle |
| Promoted Listings | `demo/mobile/_components` | `components/mobile/` |

### What We're Keeping (from main)

- Real data fetching (Supabase queries)
- Authentication state
- Cart/wishlist logic (hooks)
- Filter state management
- URL sync for filters/sort
- i18n translations
- Analytics tracking
- Real product data

---

## Phase 1: Extract Demo Components

### 1.1 Create Mobile Component Directory

```
components/mobile/
├── mobile-header.tsx          # Temu-style header
├── mobile-bottom-nav.tsx      # iOS-style tab bar
├── mobile-search-overlay.tsx  # Full-screen search
├── mobile-hamburger-menu.tsx  # Side drawer menu
├── mobile-product-card.tsx    # Compact product card
├── mobile-category-pills.tsx  # Horizontal pill strip
├── mobile-subcategory-circles.tsx  # Visual browse circles
├── mobile-promoted-section.tsx     # Horizontal promo cards
├── mobile-native-drawer.tsx   # Base drawer component
└── index.ts                   # Barrel exports
```

### 1.2 Extract NativeDrawer (Base Component)

This is the foundation - no shadcn dependency.

```tsx
// components/mobile/mobile-native-drawer.tsx
"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface NativeDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
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
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const sideClasses = {
    left: "inset-y-0 left-0 w-[85%] max-w-sm translate-x-[-100%] data-[state=open]:translate-x-0",
    right: "inset-y-0 right-0 w-[85%] max-w-sm translate-x-[100%] data-[state=open]:translate-x-0",
    bottom: "inset-x-0 bottom-0 translate-y-[100%] data-[state=open]:translate-y-0 rounded-t-2xl max-h-[92dvh]",
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

### 1.3 Extract MobileHeader

```tsx
// components/mobile/mobile-header.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { 
  MagnifyingGlass, 
  List,
  ShoppingCartSimple,
  Heart,
} from "@phosphor-icons/react"
import { useCart } from "@/hooks/use-cart"      // Real hook
import { useWishlist } from "@/hooks/use-wishlist"  // Real hook

interface MobileHeaderProps {
  onSearchOpen: () => void
  onMenuOpen: () => void
  categories: Category[]
  activeCategory: string
  onCategorySelect: (slug: string) => void
}

export function MobileHeader({ 
  onSearchOpen,
  onMenuOpen,
  categories,
  activeCategory,
  onCategorySelect,
}: MobileHeaderProps) {
  const locale = useLocale()
  const t = useTranslations("common")
  const { itemCount: cartCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const pillsRef = useRef<HTMLDivElement>(null)
  
  // Scroll active pill into view
  useEffect(() => {
    const container = pillsRef.current
    if (!container) return
    
    const activeEl = container.querySelector(`[data-slug="${activeCategory}"]`) as HTMLElement
    if (activeEl) {
      const containerRect = container.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()
      
      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [activeCategory])
  
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 pt-safe">
      {/* Row 1: Hamburger + Logo + Search + Wishlist + Cart */}
      <div className="h-12 px-(--page-inset) flex items-center gap-1.5">
        {/* Hamburger */}
        <button
          type="button"
          onClick={onMenuOpen}
          className="size-10 flex items-center justify-center -ml-2 shrink-0 rounded-md active:bg-muted/60 transition-colors"
          aria-label={t("menu")}
        >
          <List size={24} weight="bold" className="text-foreground" />
        </button>
        
        {/* Logo */}
        <Link href="/" className="shrink-0 -ml-1">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
        </Link>
        
        {/* Search Bar */}
        <button
          type="button"
          onClick={onSearchOpen}
          className={cn(
            "flex-1 min-w-0 flex items-center gap-1.5 h-9 px-3 rounded-full",
            "bg-muted/50 border border-border/30",
            "text-muted-foreground text-sm text-left",
            "active:bg-muted/70 transition-colors"
          )}
          aria-label={t("search")}
        >
          <MagnifyingGlass size={16} className="text-muted-foreground shrink-0" />
          <span className="flex-1 truncate font-normal text-xs">{t("search")}...</span>
        </button>
        
        {/* Wishlist + Cart */}
        <div className="flex items-center shrink-0">
          <Link
            href="/wishlist"
            className="relative size-9 flex items-center justify-center rounded-full active:bg-muted/60 transition-colors"
            aria-label={t("wishlist")}
          >
            <Heart size={22} className="text-foreground" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>
          
          <Link
            href="/cart"
            className="relative size-9 flex items-center justify-center rounded-full active:bg-muted/60 transition-colors"
            aria-label={t("cart")}
          >
            <ShoppingCartSimple size={22} className="text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Row 2: Category Pills */}
      <div ref={pillsRef} className="overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-2 px-(--page-inset)">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug
            const label = locale === "bg" ? cat.nameBg : cat.name
            
            return (
              <button
                key={cat.slug}
                type="button"
                data-slug={cat.slug}
                onClick={() => onCategorySelect(cat.slug)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-foreground text-background" 
                    : "bg-muted/50 text-muted-foreground active:bg-muted"
                )}
              >
                <CategoryIcon slug={cat.slug} active={isActive} size={14} />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
```

---

## Phase 2: Integration Points

### 2.1 Real Data Hooks to Connect

| Demo Mock | Real Implementation |
|-----------|---------------------|
| `MOCK_PRODUCTS` | `useProducts()` hook or server component data |
| `MOCK_CATEGORIES` | `useCategories()` or `getCategories()` |
| `PROMOTED_PRODUCTS` | `getPromotedProducts()` server action |
| `OFFERS_FOR_YOU` | `getPersonalizedOffers()` (ML/recommendation) |
| `cartCount` state | `useCart().itemCount` |
| `wishlistCount` state | `useWishlist().itemCount` |
| Filter state | `useProductFilters()` existing hook |
| Sort state | `useProductSort()` existing hook |

### 2.2 Existing Filter Infrastructure

The main app likely has:

```tsx
// hooks/use-product-filters.ts (existing)
export function useProductFilters() {
  // URL sync, pending/applied state, etc.
  return {
    filters,
    pendingFilters,
    setPendingFilters,
    applyFilters,
    clearFilters,
    isFilterActive,
  }
}
```

**Action:** Wrap the demo's `FilterDrawer` to use this hook instead of local state.

### 2.3 Restyle Existing Filter Drawer

Instead of rewriting filter logic, restyle the existing `FilterDrawer`:

```tsx
// Before: shadcn Sheet
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="bottom">
    {/* filter content */}
  </SheetContent>
</Sheet>

// After: NativeDrawer with same content
<NativeDrawer open={open} onOpenChange={setOpen} side="bottom">
  {/* same filter content, restyled */}
</NativeDrawer>
```

---

## Phase 3: Page Structure

### 3.1 Target File Structure

```
app/[locale]/(main)/
├── layout.tsx                 # Keep - handles auth, providers
├── page.tsx                   # MODIFY - add mobile detection
└── _components/
    ├── desktop-landing.tsx    # NEW - extract current desktop UI
    └── mobile-landing.tsx     # NEW - demo patterns + real data
```

### 3.2 Main Page with Device Detection

```tsx
// app/[locale]/(main)/page.tsx
import { headers } from "next/headers"
import { DesktopLanding } from "./_components/desktop-landing"
import { MobileLanding } from "./_components/mobile-landing"
import { getCategories, getPromotedProducts, getProducts } from "@/lib/queries"

export default async function HomePage() {
  // Server-side device detection
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  
  // Fetch data (shared between mobile/desktop)
  const [categories, promotedProducts, initialProducts] = await Promise.all([
    getCategories(),
    getPromotedProducts(),
    getProducts({ limit: 12 }),
  ])
  
  // Also fetch personalized offers if user is logged in
  // const offers = await getPersonalizedOffers(userId)
  
  if (isMobile) {
    return (
      <MobileLanding 
        categories={categories}
        promotedProducts={promotedProducts}
        initialProducts={initialProducts}
      />
    )
  }
  
  return (
    <DesktopLanding 
      categories={categories}
      promotedProducts={promotedProducts}
      initialProducts={initialProducts}
    />
  )
}
```

### 3.3 Mobile Landing Component

```tsx
// app/[locale]/(main)/_components/mobile-landing.tsx
"use client"

import { useState, useMemo } from "react"
import { useLocale } from "next-intl"
import { 
  MobileHeader,
  MobileBottomNav,
  MobileSearchOverlay,
  MobileHamburgerMenu,
  MobileProductCard,
  MobilePromotedSection,
  MobileSubcategoryCircles,
  NativeDrawer,
} from "@/components/mobile"
import { useProductFilters } from "@/hooks/use-product-filters"  // Real hook
import { useProductSort } from "@/hooks/use-product-sort"        // Real hook
import { FilterDrawerContent } from "@/components/filters/filter-drawer-content"
import { SortDrawerContent } from "@/components/filters/sort-drawer-content"
import { TrustBadgesInline } from "@/components/common/trust-badges"
import { SellPromoBanner } from "@/components/common/sell-promo-banner"
import { InfiniteProductGrid } from "@/components/products/infinite-product-grid"

interface MobileLandingProps {
  categories: Category[]
  promotedProducts: Product[]
  initialProducts: Product[]
}

export function MobileLanding({ 
  categories, 
  promotedProducts, 
  initialProducts 
}: MobileLandingProps) {
  const locale = useLocale()
  
  // UI State
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false)
  
  // Real filter/sort hooks (URL-synced)
  const { 
    filters, 
    pendingFilters, 
    setPendingFilters, 
    applyFilters, 
    clearFilters,
    activeCategory,
    setActiveCategory,
  } = useProductFilters()
  
  const { sortBy, setSortBy } = useProductSort()
  
  // Derived state
  const showSubcategories = activeCategory !== "all"
  const subcategories = useMemo(() => {
    if (activeCategory === "all") return []
    return categories.find(c => c.slug === activeCategory)?.subcategories || []
  }, [categories, activeCategory])
  
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Overlays */}
      <MobileHamburgerMenu 
        open={menuOpen} 
        onOpenChange={setMenuOpen} 
      />
      
      <MobileSearchOverlay 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
      />
      
      {/* Header */}
      <MobileHeader 
        onSearchOpen={() => setSearchOpen(true)}
        onMenuOpen={() => setMenuOpen(true)}
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />
      
      {/* Main Content */}
      <main className="pb-4">
        {/* Promoted Listings - Only on "All" */}
        {activeCategory === "all" && (
          <MobilePromotedSection products={promotedProducts} />
        )}
        
        {/* Offers For You - Only on "All" */}
        {activeCategory === "all" && (
          <MobileOffersSection />  {/* Uses personalization hook */}
        )}
        
        {/* Subcategory Circles - When category selected */}
        {showSubcategories && (
          <MobileSubcategoryCircles
            categorySlug={activeCategory}
            subcategories={subcategories}
          />
        )}
        
        {/* Filter/Sort Bar */}
        <MobileFilterSortBar
          onFiltersClick={() => setFilterDrawerOpen(true)}
          onSortClick={() => setSortDrawerOpen(true)}
          activeFiltersCount={Object.keys(filters).length}
        />
        
        {/* Product Grid with Infinite Scroll */}
        <InfiniteProductGrid 
          initialProducts={initialProducts}
          category={activeCategory}
          filters={filters}
          sortBy={sortBy}
          renderCard={(product) => (
            <MobileProductCard key={product.id} product={product} />
          )}
          interstitial={<TrustBadgesInline />}
          interstitialAfter={4}
        />
      </main>
      
      {/* Sell CTA */}
      <SellPromoBanner variant="mobile" />
      
      {/* Filter Drawer - Uses real filter hook */}
      <NativeDrawer 
        open={filterDrawerOpen} 
        onOpenChange={setFilterDrawerOpen} 
        side="bottom"
      >
        <FilterDrawerContent
          pending={pendingFilters}
          onChange={setPendingFilters}
          onApply={() => {
            applyFilters()
            setFilterDrawerOpen(false)
          }}
          onClear={clearFilters}
          onClose={() => setFilterDrawerOpen(false)}
        />
      </NativeDrawer>
      
      {/* Sort Drawer */}
      <NativeDrawer 
        open={sortDrawerOpen} 
        onOpenChange={setSortDrawerOpen} 
        side="bottom"
        className="max-h-[50dvh]"
      >
        <SortDrawerContent
          value={sortBy}
          onChange={(value) => {
            setSortBy(value)
            setSortDrawerOpen(false)
          }}
          onClose={() => setSortDrawerOpen(false)}
        />
      </NativeDrawer>
      
      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
```

---

## Phase 4: Checklist

### 4.1 Components to Extract

- [ ] `NativeDrawer` - Base drawer component
- [ ] `MobileHeader` - Temu-style header
- [ ] `MobileBottomNav` - iOS-style tab bar
- [ ] `MobileSearchOverlay` - Full-screen search
- [ ] `MobileHamburgerMenu` - Side drawer menu
- [ ] `MobileProductCard` - Compact product card
- [ ] `MobileCategoryPills` - Horizontal pill strip (can be inline in header)
- [ ] `MobileSubcategoryCircles` - Visual browse circles
- [ ] `MobilePromotedSection` - Horizontal promo cards
- [ ] `MobileOffersSection` - Personalized offers row
- [ ] `MobileFilterSortBar` - Inline filter/sort triggers
- [ ] `CategoryIcon` - Icon mapper for categories

### 4.2 Hooks to Integrate

- [ ] `useCart()` - Cart state
- [ ] `useWishlist()` - Wishlist state  
- [ ] `useProductFilters()` - Filter state with URL sync
- [ ] `useProductSort()` - Sort state with URL sync
- [ ] `useAuth()` - User authentication state
- [ ] `useRecentSearches()` - Search history (localStorage)

### 4.3 Server Actions/Queries

- [ ] `getCategories()` - Fetch all categories
- [ ] `getSubcategories(categorySlug)` - Fetch subcategories
- [ ] `getPromotedProducts()` - Fetch promoted/boosted products
- [ ] `getPersonalizedOffers(userId)` - ML recommendations
- [ ] `getProducts(filters, sort, cursor)` - Paginated products
- [ ] `searchProducts(query)` - Search autocomplete

### 4.4 i18n Keys to Add

```json
// messages/en.json
{
  "mobile": {
    "menu": "Menu",
    "search": "Search",
    "searchPlaceholder": "Search products...",
    "wishlist": "Wishlist",
    "cart": "Cart",
    "home": "Home",
    "browse": "Browse",
    "sell": "Sell",
    "profile": "Profile",
    "filters": "Filters",
    "sort": "Sort",
    "loadMore": "Load more",
    "recentSearches": "Recent Searches",
    "trending": "Trending",
    "clearRecent": "Clear",
    "promotedListings": "Promoted Listings",
    "offersForYou": "Offers for You",
    "seeAll": "See all",
    "signIn": "Sign In"
  }
}
```

---

## Phase 5: Testing

### 5.1 Visual Testing

```bash
# Start dev server
pnpm dev

# Open in mobile viewport
# Chrome DevTools > Toggle Device Toolbar > iPhone 14 Pro
```

### 5.2 E2E Tests to Update

```typescript
// e2e/mobile-landing.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Mobile Landing", () => {
  test.use({ viewport: { width: 390, height: 844 } })  // iPhone 14 Pro
  
  test("shows mobile header with logo", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("treido.")).toBeVisible()
  })
  
  test("opens search overlay on tap", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: /search/i }).click()
    await expect(page.getByPlaceholder(/search products/i)).toBeFocused()
  })
  
  test("category pills scroll horizontally", async ({ page }) => {
    await page.goto("/")
    const pills = page.locator("[data-slug]")
    await expect(pills.first()).toBeVisible()
  })
  
  test("filter drawer opens from bottom", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: /filters/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
  })
  
  test("bottom nav is fixed at bottom", async ({ page }) => {
    await page.goto("/")
    const nav = page.locator("nav").filter({ has: page.getByText("Home") })
    await expect(nav).toBeVisible()
    const box = await nav.boundingBox()
    expect(box?.y).toBeGreaterThan(700)  // Near bottom
  })
})
```

### 5.3 Verification Gates

```bash
# TypeScript
pnpm -s exec tsc -p tsconfig.json --noEmit

# Lint
pnpm lint

# Unit tests
pnpm test:unit

# E2E smoke (mobile viewport)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## Phase 6: Migration Steps (Ordered)

### Step 1: Create Component Files (Day 1)
```bash
mkdir -p components/mobile
# Create all component files from Phase 1
```

### Step 2: Extract Demo Code (Day 1)
- Copy NativeDrawer
- Copy MobileHeader (convert to real hooks)
- Copy MobileBottomNav
- Copy MobileSearchOverlay
- Copy MobileProductCard
- Copy supporting components

### Step 3: Create Integration Layer (Day 2)
- Wire up real hooks (cart, wishlist, filters)
- Connect to real data queries
- Add i18n translations

### Step 4: Create MobileLanding Component (Day 2)
- Assemble all components
- Integrate infinite scroll
- Add analytics tracking

### Step 5: Update Main Page (Day 3)
- Add device detection
- Extract current UI to DesktopLanding
- Conditionally render Mobile/Desktop

### Step 6: Testing & Polish (Day 3-4)
- Visual QA on multiple devices
- E2E tests
- Performance audit
- Accessibility audit

### Step 7: Cleanup (Day 4)
- Remove demo route (optional, keep for reference)
- Remove unused code
- Update documentation

---

## Appendix: Key Patterns Reference

### Touch Target Sizing
```
h-9  (36px) - Pills, compact buttons
h-10 (40px) - Icon buttons, header icons
h-11 (44px) - Primary CTAs
h-16 (64px) - Bottom nav height
```

### Spacing
```
gap-1.5 - Inline elements
gap-2   - Mobile list items
gap-3   - Card grids
px-(--page-inset) - Horizontal page padding
```

### Glass Surfaces
```
bg-background/95 backdrop-blur-md border-b border-border/40  // Header
bg-background/95 backdrop-blur-xl border-t border-border/50  // Bottom nav
```

### Active States
```
// Pills
active: bg-foreground text-background
inactive: bg-muted/50 text-muted-foreground

// Touch feedback
active:bg-muted/60 transition-colors
```

---

## Questions Before Starting

1. **Existing hooks:** Do `useProductFilters()` and `useProductSort()` exist, or need creation?
2. **Data fetching:** Server components or client-side hooks for products?
3. **Personalization:** Is there an ML/recommendation system for "Offers for You"?
4. **Search:** Real-time search API or local filtering?
5. **Analytics:** Which events to track on mobile landing?

---

*Last updated: January 17, 2026*
