# Category Browsing UX/UI Audit & Improvement Plan

**Status**: DRAFT — Pending Implementation  
**Author**: AI Analysis (Jan 2026)  
**Focus**: Mobile category browsing flow (`/categories`, `/categories/[slug]`, `/search`)

---

## Executive Summary

**Verdict**: Image 1 (Vinted-style) is objectively **better for shopping UX** than our current implementation. Here's the brutal breakdown:

| Metric | Image 1 (Vinted) | Image 2 (Current Treido) | Winner |
|--------|------------------|-------------------------|--------|
| Products above fold | ~4 cards visible | ~2.5 cards visible | **Vinted** |
| Nav chrome height | ~100px | ~180px (header+tabs+circles) | **Vinted** |
| Filter access | 4+ filters inline | 3 pills + drawer | **Vinted** |
| Context clarity | "Мода" title = instant | Category tabs = scanning | **Vinted** |
| Visual density | High (tight gaps) | Medium (circles eat space) | **Vinted** |
| Exploration | Back arrow + pills | Circles + nested levels | **Tie** (different goals) |

**Recommendation**: Adopt Image 1's **contextual category header** pattern for `/categories/[slug]` routes while keeping circles for homepage discovery.

---

## Brutal Honesty Assessment

### What Image 1 Does Right

1. **Contextual Header Saves ~80px**
   - Back arrow + category title replaces full-width site header
   - Search + Cart remain accessible but compact
   - User knows EXACTLY where they are ("Мода")

2. **Horizontal Pill Sub-Navigation**
   - "всички", "Обувки", "Дрехи", "Аксесоари" pills
   - Single-tap filtering, no drill-down needed
   - Takes ~40px total height

3. **Dense Inline Filter Bar**
   - "Филтри" button + Price + Condition + Size dropdowns
   - All major filters visible without opening drawer
   - Takes ~44px height

4. **Maximum Product Visibility**
   - 2-column grid starts immediately
   - ~4 product cards visible above fold
   - Minimal whitespace between cards

5. **Product Card Density**
   - Badges ("ТОП", "СПЕШНО") integrated into image
   - Location + time metadata on single line
   - Compact pricing without excessive typography

### What Our Current Implementation Gets Wrong

1. **Triple-Stacked Navigation Chrome (~180px)**
   - Site header: ~56px
   - Category tabs: ~44px  
   - Circle subcategories: ~80px
   - That's ~180px before ANY product appears

2. **Circles Are Space-Hungry**
   - Each circle: 64px width × ~72px height (including label)
   - Only 4-5 circles fit on screen
   - Good for discovery, BAD for shopping intent

3. **Context Loss**
   - When deep in "Мода > Жени > Дрехи", header still shows "treido." logo
   - User must remember where they are
   - No visual breadcrumb on mobile

4. **Filter Access Requires Extra Tap**
   - Quick pills exist but open modals
   - No inline filter dropdowns
   - More taps = more friction

5. **"View all" Link is Cognitive Load**
   - Extra decision point
   - Unclear what "all" means in context
   - Should be eliminated by navigation redesign

### What We Do Right (Keep These)

1. **Category circles for homepage discovery** — Good for exploration
2. **L3 pills for deep navigation** — Works well when user knows what they want
3. **FilterHub drawer** — Comprehensive filter UI (keep as fallback)
4. **Product feed infinite scroll** — Standard, works well
5. **Search page structure** — Already uses contextual patterns

---

## Proposed Architecture: Hybrid Approach

### Route-Specific Navigation Modes

| Route | Header Style | Sub-Nav Style | Filter Style |
|-------|-------------|---------------|--------------|
| `/` (home) | Full site header | Category tabs + circles | Quick pills |
| `/categories` | Full site header | Category list (desktop) | N/A |
| `/categories/[slug]` | **Contextual header** | **Horizontal pills** | **Inline filter bar** |
| `/search` | Contextual (query) | Category pills | Inline filter bar |

### The "Contextual Category Header" Pattern

When user is IN a category, replace the full header with:

```
┌────────────────────────────────────────────┐
│ ← │ Мода                         🔍  🛒(9) │  ← 44px contextual header
├────────────────────────────────────────────┤
│ всички │ Обувки │ Дрехи │ Аксесоари │ ...  │  ← 36px subcategory pills
├────────────────────────────────────────────┤
│ ≡ Филтри │ Цена ▾ │ Състояние ▾ │ Размер ▾│  ← 40px inline filters
└────────────────────────────────────────────┘
```

**Total chrome height: ~120px** (vs current ~180px = **33% reduction**)

---

## Implementation Plan

### Phase 1: Contextual Category Header Component

Create `components/mobile/contextual-category-header.tsx`:

```tsx
interface ContextualCategoryHeaderProps {
  title: string
  backHref: string
  showSearch?: boolean
  showCart?: boolean
}
```

**Design specs (Tailwind v4 + shadcn):**

```tsx
// Solid background, NO glass/blur for max readability
<header className="sticky top-0 z-40 bg-background border-b border-border">
  <div className="flex items-center h-11 px-3 gap-2">
    {/* Back button - compact touch target */}
    <Link href={backHref} className="size-touch flex items-center justify-center -ml-2">
      <ArrowLeft className="size-5 text-foreground" strokeWidth={2} />
    </Link>
    
    {/* Category title - bold, tight */}
    <h1 className="flex-1 text-base font-bold text-foreground truncate">
      {title}
    </h1>
    
    {/* Actions - search + cart */}
    <div className="flex items-center gap-1">
      <SearchTrigger />
      <CartIcon />
    </div>
  </div>
</header>
```

### Phase 2: Subcategory Pill Strip

Replace circles with horizontal pills when in category context:

```tsx
// components/mobile/category-nav/subcategory-pills.tsx
<div className="sticky top-11 z-30 bg-background border-b border-border/50">
  <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar">
    {/* "All" pill - always first */}
    <button className={cn(
      "h-8 px-3 rounded-full text-sm font-medium whitespace-nowrap",
      "border transition-colors",
      isAll 
        ? "bg-foreground text-background border-foreground" 
        : "bg-background text-muted-foreground border-border hover:bg-muted/40"
    )}>
      {locale === 'bg' ? 'всички' : 'All'}
    </button>
    
    {/* Subcategory pills */}
    {subcategories.map(sub => (
      <button key={sub.slug} className={cn(
        "h-8 px-3 rounded-full text-sm font-medium whitespace-nowrap",
        "border transition-colors",
        isActive(sub.slug)
          ? "bg-foreground text-background border-foreground"
          : "bg-background text-muted-foreground border-border hover:bg-muted/40"
      )}>
        {getCategoryShortName(sub, locale)}
      </button>
    ))}
  </div>
</div>
```

### Phase 3: Inline Filter Bar

Dense filter row with dropdown triggers:

```tsx
// components/mobile/category-nav/inline-filter-bar.tsx
<div className="sticky top-[83px] z-20 bg-background border-b border-border/30">
  <div className="flex items-center h-10 px-3 gap-2 overflow-x-auto no-scrollbar">
    {/* All filters button */}
    <button className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-border text-sm font-medium">
      <Sliders className="size-4" />
      <span>{t('filters')}</span>
    </button>
    
    {/* Vertical divider */}
    <div className="w-px h-5 bg-border/60 shrink-0" />
    
    {/* Inline filter triggers */}
    <FilterDropdown label={t('price')} paramKey="price" />
    <FilterDropdown label={t('condition')} paramKey="condition" />
    <FilterDropdown label={t('size')} paramKey="size" />
  </div>
</div>
```

### Phase 4: Update MobileHomeTabs Routing Logic

Modify `components/mobile/mobile-home-tabs.tsx` to support two modes:

```tsx
interface MobileHomeTabsProps {
  // ... existing props
  
  /**
   * When true, use contextual header + pills instead of tabs + circles.
   * Automatically enabled when route is /categories/[slug] (not homepage).
   */
  contextualMode?: boolean
}
```

**Routing logic:**
- `/` → `contextualMode: false` (full tabs + circles)
- `/categories/[slug]` → `contextualMode: true` (contextual header + pills)
- `/search` → `contextualMode: true` (query-based header + category pills)

### Phase 5: Product Grid Density

Update grid to tighter gaps:

```tsx
// Before (current)
<div className="grid grid-cols-2 gap-2 sm:gap-3">

// After (tighter)
<div className="grid grid-cols-2 gap-1.5 p-1.5">
```

**Product card adjustments:**
- Reduce card padding: `p-2` → `p-1.5`
- Tighter title: `text-sm` → `text-xs` with `line-clamp-2`
- Price on same line as location when possible

---

## Component Checklist

### New Components to Create

- [ ] `components/mobile/contextual-category-header.tsx` — Contextual back + title header
- [ ] `components/mobile/category-nav/subcategory-pills.tsx` — Horizontal pill strip
- [ ] `components/mobile/category-nav/inline-filter-bar.tsx` — Dense dropdown filters
- [ ] `components/mobile/filter-dropdown.tsx` — Compact filter dropdown (shadcn Popover)

### Components to Modify

- [ ] `components/mobile/mobile-home-tabs.tsx` — Add `contextualMode` prop
- [ ] `app/[locale]/(main)/categories/[slug]/page.tsx` — Enable contextual mode
- [ ] `app/[locale]/(main)/search/page.tsx` — Enable contextual mode
- [ ] `components/shared/product/product-card.tsx` — Density pass (optional)

### Components to Keep As-Is

- `components/mobile/category-nav/category-tabs.tsx` — Homepage only
- `components/mobile/category-nav/category-circles.tsx` — Homepage only
- `components/shared/filters/filter-hub.tsx` — Fallback for complex filters

---

## Design Tokens Reference

Per `important/DESIGN.md` and `app/globals.css`:

```css
/* Heights */
--touch-target: 44px;      /* Minimum touch target */
--touch-sm: 36px;          /* Small touch target */
--touch-lg: 48px;          /* Large touch target */

/* Spacing */
--page-inset: 12px;        /* Mobile horizontal padding */

/* Category specific */
--category-circle-mobile: 48px;  /* Circle size (for reference) */
```

### Pill Styling (Canonical)

```tsx
// Inactive pill
"h-8 px-3 rounded-full text-sm font-medium whitespace-nowrap border border-border bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"

// Active pill
"h-8 px-3 rounded-full text-sm font-medium whitespace-nowrap border border-foreground bg-foreground text-background"
```

### Header Styling (Solid, No Glass)

```tsx
// Contextual category header - SOLID background
"sticky top-0 z-40 bg-background border-b border-border"

// NOT glass (avoid in category context for max readability)
// "bg-background/90 backdrop-blur-md" ← Only for homepage header
```

---

## Migration Strategy

### Phase 1 (Safe)
1. Create new components without changing existing routes
2. Add feature flag: `USE_CONTEXTUAL_CATEGORY_NAV=true`
3. Test on `/categories/moda` route only

### Phase 2 (Gradual)
1. Enable for all `/categories/[slug]` routes
2. Monitor E2E smoke tests
3. Gather feedback on space savings

### Phase 3 (Full)
1. Enable for `/search` page
2. Remove feature flag
3. Clean up unused circle logic from category pages

---

## Success Metrics

| Metric | Before | Target | How to Measure |
|--------|--------|--------|----------------|
| Nav chrome height | ~180px | ~120px | Manual measurement |
| Products above fold | ~2.5 | ~4 | Screenshot comparison |
| Taps to filter | 2 (pill → modal) | 1 (inline dropdown) | User flow |
| Time to first product | ~300ms | ~200ms | FCP on category page |

---

## Open Questions

1. **Search Integration**: Should search on category page be a modal or navigate to `/search?category=X`?
2. **Back Navigation**: Where does back arrow go? Parent category or previous page?
3. **Desktop Behavior**: Keep current sidebar + grid, or unify with mobile patterns?
4. **Circles on Homepage**: Keep circles for "All" tab discovery, or switch to pills everywhere?

---

## References

- `important/DESIGN.md` — Canonical design tokens
- `components/mobile/category-nav/` — Current navigation components
- `app/[locale]/(main)/categories/[slug]/page.tsx` — Category page entry
- Image 1: Vinted-style reference (compact, utilitarian)
- Image 2: Current Treido implementation (circles, tabs)

---

## Appendix: Full Component Examples

### A. ContextualCategoryHeader (Complete)

```tsx
"use client"

import Link from "next/link"
import { ArrowLeft, MagnifyingGlass, ShoppingCart } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/hooks/use-cart-store"

interface ContextualCategoryHeaderProps {
  title: string
  backHref: string
  locale: string
  showSearch?: boolean
  className?: string
}

export function ContextualCategoryHeader({
  title,
  backHref,
  locale,
  showSearch = true,
  className,
}: ContextualCategoryHeaderProps) {
  const cartCount = useCartStore((s) => s.items.length)

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "bg-background border-b border-border",
        className
      )}
    >
      <div className="flex items-center h-11 px-3 gap-2">
        {/* Back */}
        <Link
          href={backHref}
          className="size-touch flex items-center justify-center -ml-2 rounded-full hover:bg-muted/50"
          aria-label={locale === "bg" ? "Назад" : "Back"}
        >
          <ArrowLeft size={20} weight="bold" className="text-foreground" />
        </Link>

        {/* Title */}
        <h1 className="flex-1 text-base font-bold text-foreground truncate">
          {title}
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          {showSearch && (
            <button
              type="button"
              className="size-touch flex items-center justify-center rounded-full hover:bg-muted/50"
              aria-label={locale === "bg" ? "Търсене" : "Search"}
            >
              <MagnifyingGlass size={20} className="text-foreground" />
            </button>
          )}
          <Link
            href={`/${locale}/cart`}
            className="size-touch flex items-center justify-center rounded-full hover:bg-muted/50 relative"
            aria-label={locale === "bg" ? "Количка" : "Cart"}
          >
            <ShoppingCart size={20} className="text-foreground" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 size-4 rounded-full bg-primary text-primary-foreground text-2xs font-bold flex items-center justify-center">
                {cartCount > 9 ? "9" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
```

### B. SubcategoryPills (Complete)

```tsx
"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getCategoryShortName } from "@/lib/category-display"
import type { CategoryTreeNode } from "@/lib/category-tree"

interface SubcategoryPillsProps {
  subcategories: CategoryTreeNode[]
  activeSlug: string | null
  locale: string
  onSelect: (slug: string | null) => void
  className?: string
}

export function SubcategoryPills({
  subcategories,
  activeSlug,
  locale,
  onSelect,
  className,
}: SubcategoryPillsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll active pill into view
  useEffect(() => {
    if (!containerRef.current || !activeSlug) return
    const activeEl = containerRef.current.querySelector(`[data-slug="${activeSlug}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
    }
  }, [activeSlug])

  const allLabel = locale === "bg" ? "всички" : "All"

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2",
        "overflow-x-auto no-scrollbar",
        className
      )}
    >
      {/* "All" pill */}
      <button
        type="button"
        data-slug="all"
        onClick={() => onSelect(null)}
        className={cn(
          "h-8 px-3 rounded-full text-sm font-medium whitespace-nowrap",
          "border transition-colors shrink-0",
          !activeSlug
            ? "bg-foreground text-background border-foreground"
            : "bg-background text-muted-foreground border-border hover:bg-muted/40 hover:text-foreground"
        )}
      >
        {allLabel}
      </button>

      {/* Subcategory pills */}
      {subcategories.map((sub) => {
        const isActive = activeSlug === sub.slug
        return (
          <button
            key={sub.slug}
            type="button"
            data-slug={sub.slug}
            onClick={() => onSelect(sub.slug)}
            className={cn(
              "h-8 px-3 rounded-full text-sm font-medium whitespace-nowrap",
              "border transition-colors shrink-0",
              isActive
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:bg-muted/40 hover:text-foreground"
            )}
          >
            {getCategoryShortName(sub, locale)}
          </button>
        )
      })}
    </div>
  )
}
```

### C. InlineFilterBar (Complete)

```tsx
"use client"

import { useState } from "react"
import { Sliders, CaretDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface FilterConfig {
  key: string
  label: string
  options: Array<{ value: string; label: string }>
}

interface InlineFilterBarProps {
  locale: string
  onAllFiltersClick: () => void
  filters: FilterConfig[]
  activeFilters: Record<string, string | null>
  onFilterChange: (key: string, value: string | null) => void
  className?: string
}

export function InlineFilterBar({
  locale,
  onAllFiltersClick,
  filters,
  activeFilters,
  onFilterChange,
  className,
}: InlineFilterBarProps) {
  const t = useTranslations("SearchFilters")

  return (
    <div
      className={cn(
        "flex items-center h-10 px-3 gap-2",
        "overflow-x-auto no-scrollbar",
        "bg-background border-b border-border/30",
        className
      )}
    >
      {/* All filters button */}
      <button
        type="button"
        onClick={onAllFiltersClick}
        className={cn(
          "flex items-center gap-1.5 h-8 px-3 shrink-0",
          "rounded-md border border-border",
          "text-sm font-medium text-foreground",
          "hover:bg-muted/50 transition-colors"
        )}
      >
        <Sliders size={16} weight="bold" />
        <span>{t("filters")}</span>
      </button>

      {/* Vertical divider */}
      <div className="w-px h-5 bg-border/60 shrink-0" />

      {/* Inline filter dropdowns */}
      {filters.map((filter) => {
        const isActive = !!activeFilters[filter.key]
        return (
          <Popover key={filter.key}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 h-8 px-2.5 shrink-0",
                  "rounded-md border text-sm font-medium",
                  "transition-colors",
                  isActive
                    ? "border-foreground bg-foreground/5 text-foreground"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <span>{filter.label}</span>
                <CaretDown size={14} weight="bold" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-48 p-1 bg-background border border-border shadow-lg"
            >
              <div className="flex flex-col">
                {/* Clear option */}
                <button
                  type="button"
                  onClick={() => onFilterChange(filter.key, null)}
                  className={cn(
                    "text-left px-3 py-2 text-sm rounded-sm",
                    "hover:bg-muted/50",
                    !activeFilters[filter.key] && "font-medium text-foreground"
                  )}
                >
                  {locale === "bg" ? "Всички" : "All"}
                </button>
                {filter.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFilterChange(filter.key, opt.value)}
                    className={cn(
                      "text-left px-3 py-2 text-sm rounded-sm",
                      "hover:bg-muted/50",
                      activeFilters[filter.key] === opt.value &&
                        "font-medium text-foreground bg-muted/30"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )
      })}
    </div>
  )
}
```

---

## Visual Comparison (ASCII)

### Current (Image 2 - Treido):
```
┌────────────────────────────────────────────┐
│ ≡  treido.               💬 ❤️ 🛒(9)      │  56px header
├────────────────────────────────────────────┤
│ 🔍 Търсене...                         📷  │  44px search
├────────────────────────────────────────────┤
│ Мода │ Електроника │ Дом и кухня │ ...    │  44px tabs
├────────────────────────────────────────────┤
│ (○)Мъже (○)Жени (○)Деца (○)Унисекс       │  80px circles
├────────────────────────────────────────────┤
│ ≡ Всички филтри │ Сортирай по │ Марка    │  40px filters
├────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐                           │
│ │     │ │     │  ← Products start ~264px  │
│ │ ... │ │ ... │     down from top         │
```

### Proposed (Image 1 style):
```
┌────────────────────────────────────────────┐
│ ←  Мода                          🔍 🛒(9) │  44px contextual header
├────────────────────────────────────────────┤
│ всички │ Обувки │ Дрехи │ Аксесоари │ ... │  36px pills
├────────────────────────────────────────────┤
│ ≡ Филтри │ Цена ▾ │ Състояние ▾ │ Размер ▾│  40px inline filters
├────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐                           │
│ │     │ │     │  ← Products start ~120px  │
│ │ ... │ │ ... │     down from top         │
│ └─────┘ └─────┘                           │
│ ┌─────┐ ┌─────┐                           │
│ │     │ │     │  ← MORE products visible! │
```

**Space saved: 144px** → **~2 extra product cards above fold**

---

## Next Steps

1. **Review this plan** with team/stakeholder
2. **Decide on open questions** (search UX, back nav, desktop unification)
3. **Create feature branch** for implementation
4. **Build Phase 1** components with feature flag
5. **Test on single route** before rollout

---

*This document will be updated as implementation progresses.*
