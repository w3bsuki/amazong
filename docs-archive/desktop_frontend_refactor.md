# 🖥️ Desktop Frontend UI/UX Refactor Plan

> **Created:** January 4, 2026  
> **Target:** Production-grade desktop experience (1024px+)  
> **Standards:** WCAG 2.2 AA, Tailwind v4, shadcn/ui  
> **Philosophy:** Dense · Flat · Fast · Trustworthy · eBay/Amazon patterns

---

## 📊 Current State Assessment

### What's Working ✅
- MarketplaceHero with trust badges and CTAs
- DesktopCategoryRail with horizontal scroll
- Sidebar filters (SearchFilters) on category pages
- TabbedProductFeed with tab switching
- DesktopFilters with popover dropdowns
- Product grid scales 4-5-6 columns responsively

### What Needs Improvement ⚠️
- **Hero banner has decorative gradient/overlay** (violates design system "no gradients")
- Category rail lacks scroll affordance (no fade edges)
- Filter popovers too narrow (`w-48`) — cramped
- Filter pills use `rounded-full` (should be `rounded-md` per design system)
- Product cards lack hover states (desktop expectation)
- Tab underline animation missing
- Inconsistent button heights across filter toolbar
- SignInCTA placement feels disconnected

---

## 🎯 PHASE 1: Design System Compliance Fixes

### 1.1 Hero Gradient Removal

**Current:** Decorative background image with `mix-blend-overlay`
**Issue:** Violates "no gradients" rule in design system

```tsx
// BEFORE (marketplace-hero.tsx)
<div className="absolute inset-0 bg-cta-trust-blue z-0" />
<div
  className="absolute right-0 top-0 h-full w-1/2 opacity-10 mix-blend-overlay"
  style={{ backgroundImage: "url('https://example.com/image.jpg')" }}
/>

// AFTER — Clean solid color
<div className="relative w-full overflow-hidden rounded-md bg-cta-trust-blue">
  <div className="relative px-6 py-5 lg:px-8 lg:py-6">
    {/* Content — no decorative overlays */}
```

### 1.2 Filter Pill Shape Correction

**Current:** `rounded-full` (pill shape)
**Design System:** Cards/pills should be `rounded-md` max

```tsx
// BEFORE (desktop-filters.tsx)
className="inline-flex items-center gap-2 h-9 px-4 rounded-full ..."

// AFTER
className="inline-flex items-center gap-2 h-8 px-3.5 rounded-md ..."
```

### 1.3 Shadow Audit

**Design System:** `shadow-sm` hover only, `shadow-md` modals max

Check components for shadow violations:
- Hero: `shadow-sm` ✅
- Product cards: Hover `shadow-sm` ✅
- Modals: `shadow-dropdown` / `shadow-modal` ✅

---

## 🎯 PHASE 2: Category Rail Polish

### 2.1 Scroll Affordance (Missing)

**Problem:** No visual cue that content scrolls horizontally

```tsx
// Add fade edges to indicate scrollability
<div className="relative">
  {/* Left fade - appears when scrolled */}
  <div className={cn(
    "absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none",
    "bg-gradient-to-r from-card to-transparent",
    scrollPosition > 0 ? "opacity-100" : "opacity-0",
    "transition-opacity duration-150"
  )} />
  
  {/* Category items */}
  <div 
    ref={scrollRef}
    className="flex gap-3 overflow-x-auto no-scrollbar px-1 py-2"
    onScroll={handleScroll}
  >
    {categories.map(cat => <CategoryRailItem ... />)}
  </div>
  
  {/* Right fade - hides when scrolled to end */}
  <div className={cn(
    "absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none",
    "bg-gradient-to-l from-card to-transparent",
    canScrollMore ? "opacity-100" : "opacity-0",
    "transition-opacity duration-150"
  )} />
</div>
```

### 2.2 Category Item Hover States

**Current:** No hover feedback
**Expected:** Subtle background + text color change

```tsx
<Link
  href={`/categories/${category.slug}`}
  className={cn(
    "group flex flex-col items-center gap-2 p-2 rounded-md",
    "transition-colors duration-100",
    "hover:bg-muted/50",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  )}
>
  <div className={cn(
    "size-14 rounded-md flex items-center justify-center",
    "bg-muted transition-colors duration-100",
    "group-hover:bg-muted/80"
  )}>
    <CategoryIcon slug={category.slug} className="size-7" />
  </div>
  <span className={cn(
    "text-xs font-medium text-center line-clamp-2 w-16",
    "text-muted-foreground transition-colors duration-100",
    "group-hover:text-foreground"
  )}>
    {getCategoryName(category, locale)}
  </span>
</Link>
```

### 2.3 Keyboard Navigation

```tsx
// Add arrow key navigation
const handleKeyDown = (e: KeyboardEvent, index: number) => {
  const items = scrollRef.current?.querySelectorAll('a')
  if (!items) return
  
  if (e.key === 'ArrowRight' && index < items.length - 1) {
    e.preventDefault()
    ;(items[index + 1] as HTMLElement).focus()
  }
  if (e.key === 'ArrowLeft' && index > 0) {
    e.preventDefault()
    ;(items[index - 1] as HTMLElement).focus()
  }
}
```

---

## 🎯 PHASE 3: Product Grid & Card Polish

### 3.1 Product Card Hover States

**Current:** Border change only (`lg:hover:border-border/60`)
**Expected:** More noticeable feedback for desktop users

```tsx
// Enhanced hover state
const productCardVariants = cva(
  cn(
    "tap-transparent group relative block h-full min-w-0 cursor-pointer overflow-hidden bg-transparent",
    "focus-within:ring-2 focus-within:ring-ring/40",
    // Desktop styling
    "lg:rounded-md lg:border lg:border-transparent lg:bg-card",
    // Enhanced hover
    "lg:hover:border-border lg:hover:shadow-sm",
    "lg:transition-all lg:duration-150"
  ),
)

// Image hover — subtle scale (within design system limits)
<Image
  className={cn(
    "object-cover",
    "lg:transition-transform lg:duration-150",
    "lg:group-hover:scale-[1.02]"
  )}
/>
```

### 3.2 Hover-Reveal Actions (Desktop Only)

**Current:** Wishlist/cart buttons always visible
**Proposed:** Reveal on hover for cleaner grid

```tsx
// Wishlist button - reveal on hover
<button
  className={cn(
    "absolute right-1.5 top-1.5 z-10 flex size-7 items-center justify-center rounded-full",
    // Mobile: always visible | Desktop: hover reveal
    "lg:opacity-0 lg:group-hover:opacity-100",
    "lg:transition-opacity lg:duration-100",
    // Always show if active
    inWishlist && "lg:opacity-100"
  )}
>
```

### 3.3 Grid Density Verification

**Current:** `lg:gap-3` (12px) — acceptable for desktop
**Keep:** Current spacing works well

```tsx
// Current grid classes are good
className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-3"
```

---

## 🎯 PHASE 4: Filter Sidebar Improvements

### 4.1 Scrollbar Visibility

**Current:** `no-scrollbar` class hides overflow indication
**Issue:** Users don't know content is scrollable

```tsx
// Use thin visible scrollbar for desktop
<aside className="w-56 shrink-0 border-r border-border">
  <div className={cn(
    "sticky top-16 pr-4 py-3 max-h-[calc(100vh-5rem)] overflow-y-auto",
    // Custom thin scrollbar
    "[&::-webkit-scrollbar]:w-1",
    "[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full",
    "[&::-webkit-scrollbar-track]:bg-transparent"
  )}>
```

### 4.2 Collapsible Filter Sections

**Current:** All sections always expanded
**Proposed:** Collapsible with persistence

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

function FilterSection({ title, children, defaultOpen = true }) {
  // Persist open/closed state per section
  const [isOpen, setIsOpen] = useLocalStorage(`filter-section-${title}`, defaultOpen)
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border/50 pb-3">
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold hover:text-foreground transition-colors">
        <span>{title}</span>
        <CaretDown className={cn(
          "size-4 text-muted-foreground transition-transform duration-150",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
```

### 4.3 Filter Count Badge

```tsx
// Show active filter count in sidebar header
<div className="flex items-center justify-between pb-3 border-b border-border mb-3">
  <h2 className="font-semibold text-sm">Filters</h2>
  {activeFilterCount > 0 && (
    <button 
      onClick={clearAllFilters}
      className="text-xs text-primary hover:underline"
    >
      Clear all ({activeFilterCount})
    </button>
  )}
</div>
```

---

## 🎯 PHASE 5: Desktop Filter Pills/Popovers

### 5.1 Popover Width Fix

**Current:** `w-48` (192px) for price, `w-52` (208px) for rating
**Issue:** Content feels cramped

```tsx
// Wider popovers with better internal spacing
<PopoverContent 
  className="w-56 p-2 rounded-lg shadow-dropdown border-border/50" 
  align="start"
>
  <div className="space-y-0.5">
    {options.map(option => (
      <button className="w-full text-left px-3 py-2.5 rounded-md text-sm hover:bg-muted">
        {option.label}
      </button>
    ))}
  </div>
</PopoverContent>
```

### 5.2 Filter Pill Styling Standardization

**Current Issues:**
- `rounded-full` (violates design system)
- `h-9` (36px) height
- Inconsistent active state colors

**Standardized:**
```tsx
// Base filter pill styles
const filterPillStyles = cn(
  "inline-flex items-center gap-2",
  "h-8 px-3.5",                    // 32px height
  "rounded-md",                     // Not rounded-full
  "text-sm font-medium",
  "border transition-colors",
)

// State variants
const filterPillVariants = {
  default: "bg-secondary hover:bg-secondary/80 text-foreground border-border/50 hover:border-border",
  active: "bg-primary/10 text-primary border-primary/30",
}
```

### 5.3 "All Filters" Enhancement

**Current:** Modal dialog (DesktopFilterModal)
**Alternative:** Sheet from right (maintains grid context)

```tsx
// Consider replacing modal with Sheet
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" size="sm" className={cn(filterPillStyles, "gap-1.5")}>
      <Sliders size={14} />
      All Filters
      {totalActiveFilters > 0 && (
        <span className="bg-primary text-primary-foreground text-xs rounded-full size-5 flex items-center justify-center">
          {totalActiveFilters}
        </span>
      )}
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-80">
    {/* Filter content with full height scrollable area */}
  </SheetContent>
</Sheet>
```

---

## 🎯 PHASE 6: Product Feed Tabs Polish

### 6.1 Tab Underline Animation

**Current:** Static underline via pseudo-element
**Enhancement:** Animated underline transition

```tsx
<TabsTrigger
  value={tab.value}
  className={cn(
    "relative pb-3 text-sm font-medium",
    "text-muted-foreground hover:text-foreground transition-colors",
    "data-[state=active]:text-foreground",
    // Animated underline
    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
    "after:bg-primary after:rounded-full",
    "after:scale-x-0 after:transition-transform after:duration-150",
    "data-[state=active]:after:scale-x-100"
  )}
>
  {tab.label}
</TabsTrigger>
```

### 6.2 Tab Content Loading State

**Current:** No loading feedback during tab switch
**Enhancement:** Skeleton during transition

```tsx
const [isTabChanging, setIsTabChanging] = useState(false)

const handleTabChange = (newTab: string) => {
  setIsTabChanging(true)
  setActiveTab(newTab)
  // Content will load, then set isTabChanging false
}

// In render
{isTabChanging ? (
  <ProductCardSkeletonGrid count={8} density="default" />
) : (
  <ProductGrid>{products.map(...)}</ProductGrid>
)}
```

### 6.3 "See All" Links

```tsx
// Tab header with see-all link
<div className="flex items-center justify-between mb-4">
  <h2 className="text-lg font-semibold">{tabTitle}</h2>
  <Link 
    href={tabHref} 
    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
  >
    See all
    <ArrowRight size={14} />
  </Link>
</div>
```

### 6.4 Minimum Height for Content

```tsx
// Prevent layout shift during tab changes
<div className="min-h-[420px]">
  <TabsContent value={tab.value}>
    {content}
  </TabsContent>
</div>
```

---

## 🎯 PHASE 7: Supplementary Sections

### 7.1 PromoCards Consistency

**Ensure:** Cards follow design system (border, no heavy shadow, flat)

```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {promos.map(promo => (
    <div className={cn(
      "p-4 rounded-md border border-border",
      "hover:border-border/80 transition-colors"
    )}>
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <promo.icon className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-1">{promo.title}</h3>
          <p className="text-xs text-muted-foreground mb-2">{promo.description}</p>
          <Link href={promo.href} className="text-xs text-primary hover:underline">
            {promo.cta} →
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>
```

### 7.2 SignInCTA Repositioning

**Current:** Bottom of page, disconnected
**Proposed:** Inline after first product row (more contextual)

```tsx
// In homepage product feed
<ProductGrid>
  {products.slice(0, 5).map(p => <ProductCard ... />)}
</ProductGrid>

{!user && (
  <div className="my-6 p-4 rounded-md bg-muted/30 border border-border/50 flex items-center justify-between">
    <div>
      <p className="font-medium text-sm">Get personalized recommendations</p>
      <p className="text-xs text-muted-foreground">Create a free account • No spam</p>
    </div>
    <Button size="sm" asChild>
      <Link href="/auth/sign-up">Sign Up Free</Link>
    </Button>
  </div>
)}

<ProductGrid>
  {products.slice(5).map(p => <ProductCard ... />)}
</ProductGrid>
```

### 7.3 MoreWaysToShop Polish

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
  {[
    { icon: Tag, label: "Today's Deals", href: "/todays-deals" },
    { icon: Truck, label: "Free Shipping", href: "/free-shipping" },
    { icon: Users, label: "Top Sellers", href: "/sellers" },
    { icon: Gift, label: "Gift Cards", href: "/gift-cards" },
  ].map(item => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 p-3 rounded-md",
        "border border-border/50",
        "hover:border-border hover:bg-muted/30 transition-colors"
      )}
    >
      <item.icon className="size-5 text-muted-foreground" />
      <span className="text-sm font-medium">{item.label}</span>
    </Link>
  ))}
</div>
```

---

## 🎯 PHASE 8: Accessibility & Keyboard UX

### 8.1 Skip Link

```tsx
// Add to main layout (app/[locale]/layout.tsx)
<a 
  href="#main-content" 
  className={cn(
    "sr-only focus:not-sr-only",
    "focus:absolute focus:top-4 focus:left-4 focus:z-50",
    "focus:px-4 focus:py-2 focus:bg-background",
    "focus:border focus:border-border focus:rounded-md",
    "focus:text-sm focus:font-medium"
  )}
>
  Skip to main content
</a>

// Target in main
<main id="main-content" className="...">
```

### 8.2 Focus Indicators

Verify all interactive elements have visible focus:

```css
/* In globals.css — ensure base focus styles */
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-ring);
}
```

### 8.3 ARIA Live Regions

```tsx
// Announce filter/sort changes
const [announcement, setAnnouncement] = useState('')

const handleSortChange = (sortBy: string) => {
  applySorting(sortBy)
  setAnnouncement(`Sorted by ${sortBy}`)
}

<div role="status" aria-live="polite" className="sr-only">
  {announcement}
</div>
```

### 8.4 WCAG 2.2 AA Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| Touch targets ≥24px | ✅ | All interactive elements |
| Color contrast 4.5:1 | ✅ | Verified in design system |
| Focus visible | ⚠️ | Audit needed |
| Keyboard navigable | ⚠️ | Category rail needs work |
| Skip link | ❌ | Add to layout |

---

## 🎯 PHASE 9: Performance Considerations

### 9.1 Above-the-Fold Audit

**Critical render path:**
1. Hero (SSR, static) ✅
2. Category Rail (cached via ISR) ✅
3. First 8 products (cached) ✅
4. Trust Bar (static) ✅

**Verify:** No client-side fetch blocking initial paint

### 9.2 Lazy Load Below-Fold Sections

```tsx
import dynamic from 'next/dynamic'

// Lazy load supplementary sections
const PromoCards = dynamic(
  () => import('./_components/promo-cards').then(m => m.PromoCards),
  { loading: () => <div className="h-32" /> }
)

const MoreWaysToShop = dynamic(
  () => import('./_components/more-ways-to-shop').then(m => m.MoreWaysToShop)
)

const SignInCTA = dynamic(
  () => import('@/components/sections/sign-in-cta').then(m => m.SignInCTA)
)
```

### 9.3 Image Optimization

```tsx
// Product images — precise sizes attribute
<Image
  src={imageSrc}
  alt={title}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
  loading={index < 8 ? 'eager' : 'lazy'}
  priority={index < 4}
/>
```

---

## 📋 Implementation Checklist

### Sprint 1: Design System Compliance (Day 1)
- [ ] Remove hero gradient/overlay
- [ ] Fix filter pills: rounded-full → rounded-md
- [ ] Verify shadow usage across components
- [ ] Update hero padding (py-6 → py-5)

### Sprint 2: Category Rail (Day 1)
- [ ] Add scroll fade affordances
- [ ] Add hover states to category items
- [ ] Implement keyboard navigation (arrow keys)

### Sprint 3: Product Cards (Day 1-2)
- [ ] Enhance desktop hover states
- [ ] Implement hover-reveal for actions
- [ ] Add subtle image scale on hover

### Sprint 4: Filters (Day 2)
- [ ] Add visible scrollbar to sidebar
- [ ] Implement collapsible sections
- [ ] Widen filter popovers (w-48 → w-56)
- [ ] Standardize filter pill styles

### Sprint 5: Tabs & Sections (Day 2)
- [ ] Add tab underline animation
- [ ] Implement loading skeleton for tab switch
- [ ] Add "See All" links
- [ ] Reposition SignInCTA

### Sprint 6: Accessibility (Day 3)
- [ ] Add skip link to layout
- [ ] Verify focus indicators
- [ ] Add ARIA live regions
- [ ] Test keyboard navigation end-to-end

---

## 🎨 Design Tokens Reference (Desktop)

```css
/* Interactive element sizes */
--size-filter-pill: 2rem;        /* 32px (h-8) */
--size-button-default: 2.25rem;  /* 36px (h-9) */
--size-icon-button: 2rem;        /* 32px */

/* Filter sidebar */
--sidebar-width: 14rem;          /* 224px (w-56) */
--sidebar-scrollbar-width: 0.25rem; /* 4px */

/* Transitions */
--duration-hover: 150ms;
--duration-focus: 100ms;

/* Spacing */
--gap-grid-desktop: 0.75rem;     /* 12px (gap-3) */
--gap-pills: 0.5rem;             /* 8px (gap-2) */
```

---

## 🖥️ Breakpoint Testing Matrix

| Breakpoint | Width | Priority | Focus Areas |
|------------|-------|----------|-------------|
| lg | 1024px | 🔴 High | Sidebar + 4-col grid |
| xl | 1280px | 🔴 High | 5-col grid, common desktop |
| 2xl | 1536px | 🟡 Medium | 6-col grid, wide monitors |
| 4K | 2560px | 🟢 Low | Container max-width |

---

## 🔗 Related Documentation

- `docs/DESIGN.md` → Design system overview
- `docs/refactor_plan.md` → Main refactor plan
- `docs/mobile_frontend_refactor.md` → Mobile companion plan
- `agents.md` → Agent guidelines

---

**Next Steps:** Begin with Sprint 1 (Design System Compliance) — hero gradient removal is the most visible violation.
