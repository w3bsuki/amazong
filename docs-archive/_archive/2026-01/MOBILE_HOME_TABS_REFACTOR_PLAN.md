# Mobile Home Tabs Refactor Plan

> **Goal**: Break down `mobile-home-tabs.tsx` (1183 lines) into smaller, maintainable components while preserving **pixel-perfect UI parity**.

## Current State

| Metric | Value | Target |
|--------|-------|--------|
| Lines of Code | 1183 | ~600 (orchestrator + imports) |
| Responsibilities | 7+ | 1 per component |
| Conditional Link/button blocks | 4 duplicated | 0 (unified pattern) |
| Client-side fetches | 2 (products, L3 categories) | 1 (products only) |

## Architecture: Before vs After

```
BEFORE (1 mega-component):
┌─────────────────────────────────────────────────────────┐
│ mobile-home-tabs.tsx (1183 lines)                       │
│ ├── L0 Tabs (underline style)                           │
│ ├── L0 Pills (compact style)                            │
│ ├── L1/L2 Circles navigation                            │
│ ├── L3 Pills deep navigation                            │
│ ├── All-tab filter buttons                              │
│ ├── Product feed + infinite scroll                      │
│ ├── URL state management                                │
│ └── Loading skeletons                                   │
└─────────────────────────────────────────────────────────┘

AFTER (composable components):
┌─────────────────────────────────────────────────────────┐
│ mobile-home-tabs.tsx (~250 lines) - ORCHESTRATOR        │
│ ├── imports + props + state                             │
│ └── composition of child components                     │
├─────────────────────────────────────────────────────────┤
│ hooks/                                                  │
│ └── use-category-navigation.ts (~150 lines)             │
│     └── URL sync, tab/L1/L2/L3 state, navigation logic  │
├─────────────────────────────────────────────────────────┤
│ components/mobile/category-nav/                         │
│ ├── category-tabs.tsx (~100 lines)                      │
│ ├── category-quick-pills.tsx (~80 lines)                │
│ ├── category-circles.tsx (~120 lines)                   │
│ ├── category-l3-pills.tsx (~60 lines)                   │
│ ├── all-tab-filters.tsx (~50 lines)                     │
│ └── category-nav-item.tsx (~40 lines) - Link/button     │
├─────────────────────────────────────────────────────────┤
│ components/shared/product/                              │
│ └── product-feed.tsx (~200 lines)                       │
│     └── grid + infinite scroll + loading + empty state  │
└─────────────────────────────────────────────────────────┘
```

## UI Parity Guarantee

### What Will NOT Change:
- ✅ Visual appearance of tabs (underline style)
- ✅ Visual appearance of pills (compact rounded style)
- ✅ Circle sizes, spacing, animations
- ✅ L3 pill styling and behavior
- ✅ Product grid layout (2 columns, gap-1)
- ✅ Sticky header positioning
- ✅ All CSS classes and Tailwind utilities
- ✅ Animations and transitions
- ✅ Loading skeleton layouts
- ✅ Empty state CTAs

### What Will Change:
- 🔧 Code organization (split into files)
- 🔧 Props passed between components
- 🔧 State management (extracted to hook)
- 🔧 Link/button conditional → unified component

---

## Phase 1: Extract Navigation Hook

**File**: `hooks/use-category-navigation.ts`

**Purpose**: Centralize all navigation state and URL synchronization.

```typescript
// Extract from mobile-home-tabs.tsx lines 170-210, 530-640
export function useCategoryNavigation({
  initialCategories,
  defaultTab,
  defaultSubTab,
  defaultL2,
  defaultL3,
  tabsNavigateToPages,
  l0Style,
}: UseCategoryNavigationProps) {
  // State: activeTab, activeL1, activeL2, selectedPill
  // URL sync: useEffect for searchParams
  // Handlers: handleTabChange, handleCircleClick, handleBack, handlePillClick
  // Derived: currentL0, l1Categories, currentL1, l2Categories, etc.
  
  return {
    // State
    activeTab,
    activeL1,
    activeL2,
    selectedPill,
    
    // Derived
    currentL0,
    l1Categories,
    l2Categories,
    l3Categories,
    circlesToDisplay,
    showL1Circles,
    showL2Circles,
    showPills,
    activeSlug,
    isAllTab,
    
    // Handlers
    handleTabChange,
    handleCircleClick,
    handleBack,
    handlePillClick,
    
    // Loading
    isL3Loading,
  }
}
```

**Lines to extract**: 151-340 (state, derived values, handlers)

---

## Phase 2: Create CategoryNavItem (Unified Link/Button)

**File**: `components/mobile/category-nav/category-nav-item.tsx`

**Purpose**: Eliminate 4x duplicated Link vs button conditionals.

```typescript
// Replaces the pattern repeated at lines 667-763, 779-875, etc.
interface CategoryNavItemProps {
  href?: string              // If provided, renders as Link
  onClick?: () => void       // If no href, renders as button
  isActive: boolean
  variant: 'tab' | 'pill'
  children: React.ReactNode
  className?: string
  'data-tab'?: string
}

export function CategoryNavItem({
  href,
  onClick,
  isActive,
  variant,
  children,
  className,
  ...props
}: CategoryNavItemProps) {
  const baseStyles = variant === 'tab' 
    ? "shrink-0 py-3 text-sm relative..."
    : "shrink-0 h-7 px-3 text-xs font-medium rounded-full..."
  
  const Component = href ? Link : 'button'
  
  return (
    <Component
      {...(href ? { href } : { type: 'button', onClick })}
      role="tab"
      aria-selected={isActive}
      className={cn(baseStyles, className)}
      {...props}
    >
      {children}
    </Component>
  )
}
```

**Impact**: Removes ~200 lines of duplication.

---

## Phase 3: Extract Category Tabs Component

**File**: `components/mobile/category-nav/category-tabs.tsx`

**Purpose**: L0 navigation with underline indicator style.

```typescript
// Extract from lines 655-778
interface CategoryTabsProps {
  categories: Category[]
  activeTab: string
  locale: string
  headerHeight: number
  tabsNavigateToPages: boolean
  onTabChange: (slug: string) => void
}

export function CategoryTabs({
  categories,
  activeTab,
  locale,
  headerHeight,
  tabsNavigateToPages,
  onTabChange,
}: CategoryTabsProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll effect (lines 383-392)
  
  return (
    <div className="sticky z-30 bg-background..." style={{ top: headerHeight }}>
      <div ref={tabsContainerRef} className="relative flex items-center gap-3...">
        {/* "All" tab */}
        <CategoryNavItem
          href={tabsNavigateToPages ? "/categories" : undefined}
          onClick={tabsNavigateToPages ? undefined : () => onTabChange("all")}
          isActive={activeTab === "all"}
          variant="tab"
          data-tab="all"
        >
          {/* Tab content with underline indicator */}
        </CategoryNavItem>
        
        {/* Category tabs */}
        {categories.map((cat) => (
          <CategoryNavItem key={cat.id} ... />
        ))}
      </div>
    </div>
  )
}
```

---

## Phase 4: Extract Category Quick Pills Component

**File**: `components/mobile/category-nav/category-quick-pills.tsx`

**Purpose**: L0 navigation with compact pill style (used on /categories).

```typescript
// Extract from lines 779-875
interface CategoryQuickPillsProps {
  categories: Category[]
  activeTab: string
  locale: string
  headerHeight: number
  tabsNavigateToPages: boolean
  onTabChange: (slug: string) => void
}

export function CategoryQuickPills({ ... }: CategoryQuickPillsProps) {
  // Similar structure to CategoryTabs but with pill styling
  // Uses CategoryNavItem with variant="pill"
}
```

---

## Phase 5: Extract Category Circles Component

**File**: `components/mobile/category-nav/category-circles.tsx`

**Purpose**: L1/L2 subcategory circle navigation.

```typescript
// Extract from lines 957-1017
interface CategoryCirclesProps {
  circles: Category[]
  activeL1: string | null
  activeL2: string | null
  showL2Circles: boolean
  locale: string
  circlesNavigateToPages: boolean
  activeTab: string
  onCircleClick: (category: Category) => void
  onBack: () => void
}

export function CategoryCircles({ ... }: CategoryCirclesProps) {
  return (
    <div className="px-(--page-inset) flex items-start justify-between gap-3">
      {/* Back button when L1+ selected */}
      {activeL1 && <BackButton onClick={onBack} locale={locale} />}
      
      {/* Circle grid */}
      <div className="flex-1 flex overflow-x-auto no-scrollbar gap-2...">
        {circles.map((sub) => (
          <CategoryCircle
            key={sub.slug}
            category={sub}
            href={circlesNavigateToPages ? `/categories/${sub.slug}` : undefined}
            onClick={circlesNavigateToPages ? undefined : () => onCircleClick(sub)}
            active={...}
            dimmed={...}
            // ... all existing props
          />
        ))}
      </div>
    </div>
  )
}
```

---

## Phase 6: Extract L3 Pills Component

**File**: `components/mobile/category-nav/category-l3-pills.tsx`

**Purpose**: Deep navigation pills when L2 is selected.

```typescript
// Extract from lines 1029-1073
interface CategoryL3PillsProps {
  categories: Category[]
  selectedPill: string | null
  locale: string
  isLoading: boolean
  onPillClick: (category: Category) => void
  onAllClick: () => void
}

export function CategoryL3Pills({ ... }: CategoryL3PillsProps) {
  if (isLoading) return <PillsSkeleton />
  
  return (
    <div className="bg-background py-3 px-(--page-inset) overflow-x-auto no-scrollbar">
      <div className="flex gap-2 items-center">
        {/* "All" pill */}
        <button onClick={onAllClick} className={cn(...)}>
          {locale === "bg" ? "Всички" : "All"}
        </button>
        
        {/* L3 pills */}
        {categories.map((child) => (
          <button key={child.slug} onClick={() => onPillClick(child)} className={cn(...)}>
            {getCategoryName(child, locale)}
          </button>
        ))}
      </div>
    </div>
  )
}
```

---

## Phase 7: Extract All Tab Filters Component

**File**: `components/mobile/category-nav/all-tab-filters.tsx`

**Purpose**: Quick filter buttons for the "All" tab (Promoted, Newest, etc.).

```typescript
// Extract from lines 932-956
interface AllTabFiltersProps {
  activeFilter: string
  locale: string
  onFilterClick: (id: string) => void
}

export function AllTabFilters({ ... }: AllTabFiltersProps) {
  return (
    <div className="px-(--page-inset)">
      <div className="flex overflow-x-auto no-scrollbar gap-2 snap-x...">
        {ALL_TAB_FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterClick(filter.id)}
            className={cn(...)}
          >
            <filter.icon ... />
            <span>{filter.label[locale]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

---

## Phase 8: Extract Product Feed Component

**File**: `components/shared/product/product-feed.tsx`

**Purpose**: Product grid with infinite scroll, loading, and empty states.

```typescript
// Extract from lines 1124-1175 + data fetching logic 393-530
interface ProductFeedProps {
  initialProducts: UIProduct[]
  activeSlug: string
  locale: string
  isAllTab: boolean
  activeAllFilter: string
  activeCategoryName: string | null
  filterQueryKey: string
}

export function ProductFeed({ ... }: ProductFeedProps) {
  // State: tabData, isLoading
  // Refs: loadMoreRef
  // Data fetching: loadPage, loadMoreProducts
  // Intersection observer for infinite scroll
  
  return (
    <div className="pt-1">
      {products.length === 0 && !isLoading ? (
        <EmptyStateCTA ... />
      ) : (
        <div className="grid grid-cols-2 gap-1 px-1">
          {products.map((product, index) => (
            <ProductCard key={...} ... />
          ))}
        </div>
      )}
      
      <div ref={loadMoreRef} className="py-3">
        {isLoading && <ProductGridSkeleton count={4} />}
        {!hasMore && products.length > 0 && <EndOfResults locale={locale} />}
      </div>
    </div>
  )
}
```

---

## Phase 9: Refactor Orchestrator

**File**: `components/mobile/mobile-home-tabs.tsx` (refactored)

**Final size**: ~250 lines

```typescript
"use client"

import { useCategoryNavigation } from "@/hooks/use-category-navigation"
import { CategoryTabs } from "./category-nav/category-tabs"
import { CategoryQuickPills } from "./category-nav/category-quick-pills"
import { CategoryCircles } from "./category-nav/category-circles"
import { CategoryL3Pills } from "./category-nav/category-l3-pills"
import { AllTabFilters } from "./category-nav/all-tab-filters"
import { ProductFeed } from "@/components/shared/product/product-feed"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import { MobileFilters } from "@/components/shared/filters/mobile-filters"
import { SortSelect } from "@/components/shared/search/sort-select"

export function MobileHomeTabs({
  initialProducts,
  initialCategories = [],
  defaultTab = null,
  defaultSubTab = null,
  defaultL2 = null,
  defaultL3 = null,
  showBanner = true,
  pageTitle = null,
  showL0Tabs = true,
  l0Style = "tabs",
  tabsNavigateToPages = false,
  circlesNavigateToPages = false,
  locale: localeProp,
  filterableAttributes = [],
}: MobileHomeTabsProps) {
  const locale = localeProp || useLocale()
  const [headerHeight, setHeaderHeight] = useState(0)
  
  const nav = useCategoryNavigation({
    initialCategories,
    defaultTab,
    defaultSubTab,
    defaultL2,
    defaultL3,
    tabsNavigateToPages,
    l0Style,
  })

  // Header height measurement effect (lines 343-380)
  useEffect(() => { ... }, [])

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 1. L0 Navigation */}
      {showL0Tabs && l0Style === "tabs" && (
        <CategoryTabs
          categories={initialCategories}
          activeTab={nav.activeTab}
          locale={locale}
          headerHeight={headerHeight}
          tabsNavigateToPages={tabsNavigateToPages}
          onTabChange={nav.handleTabChange}
        />
      )}
      
      {showL0Tabs && l0Style === "pills" && (
        <CategoryQuickPills
          categories={initialCategories}
          activeTab={nav.activeTab}
          locale={locale}
          headerHeight={headerHeight}
          tabsNavigateToPages={tabsNavigateToPages}
          onTabChange={nav.handleTabChange}
        />
      )}

      {/* 2. Seller Banner (All tab only) */}
      {showBanner && nav.isAllTab && (
        <StartSellingBanner locale={locale} variant="full-bleed" showTrustRow />
      )}

      {/* 3. Page Title */}
      {pageTitle && (
        <div className="bg-background px-(--page-inset) py-3 border-b border-border/40">
          <h1 className="text-lg font-bold">{pageTitle}</h1>
        </div>
      )}

      {/* 4. Subcategory Navigation */}
      <div className="bg-background border-b border-border/40 py-2.5">
        {nav.isAllTab ? (
          <AllTabFilters
            activeFilter={nav.activeAllFilter}
            locale={locale}
            onFilterClick={nav.handleAllFilterClick}
          />
        ) : (
          <CategoryCircles
            circles={nav.circlesToDisplay}
            activeL1={nav.activeL1}
            activeL2={nav.activeL2}
            showL2Circles={nav.showL2Circles}
            locale={locale}
            circlesNavigateToPages={circlesNavigateToPages}
            activeTab={nav.activeTab}
            onCircleClick={nav.handleCircleClick}
            onBack={nav.handleBack}
          />
        )}
      </div>

      {/* 5. L3 Deep Navigation Pills */}
      {nav.showPills && (
        <CategoryL3Pills
          categories={nav.l3Categories}
          selectedPill={nav.selectedPill}
          locale={locale}
          isLoading={nav.isL3Loading}
          onPillClick={nav.handlePillClick}
          onAllClick={() => nav.setSelectedPill(null)}
        />
      )}

      {/* 6. Filter/Sort Toolbar (pills mode only) */}
      {l0Style === "pills" && (
        <div className="bg-background border-b border-border/40 px-(--page-inset) py-2">
          <div className="flex items-center gap-2">
            <MobileFilters locale={locale} attributes={filterableAttributes} />
            <SortSelect />
            <span className="text-xs text-muted-foreground...">
              {nav.activeFeed.products.length}
            </span>
          </div>
        </div>
      )}

      {/* 7. "View All" Link (tabs mode, category selected) */}
      {l0Style === "tabs" && !nav.isAllTab && (
        <ViewAllLink slug={nav.activeSlug} locale={locale} />
      )}

      {/* 8. Product Feed */}
      <ProductFeed
        initialProducts={initialProducts}
        activeSlug={nav.activeSlug}
        locale={locale}
        isAllTab={nav.isAllTab}
        activeAllFilter={nav.activeAllFilter}
        activeCategoryName={nav.activeCategoryName}
        filterQueryKey={nav.filterQueryKey}
      />
    </div>
  )
}
```

---

## Implementation Order

| Phase | Task | Risk | Time |
|-------|------|------|------|
| 1 | Extract `useCategoryNavigation` hook | Low | 2h |
| 2 | Create `CategoryNavItem` | Low | 1h |
| 3 | Extract `CategoryTabs` | Low | 1h |
| 4 | Extract `CategoryQuickPills` | Low | 1h |
| 5 | Extract `CategoryCircles` | Medium | 1.5h |
| 6 | Extract `CategoryL3Pills` | Low | 0.5h |
| 7 | Extract `AllTabFilters` | Low | 0.5h |
| 8 | Extract `ProductFeed` | Medium | 2h |
| 9 | Refactor orchestrator | Low | 1h |
| 10 | Visual regression testing | Critical | 2h |

**Total estimated time**: ~12 hours

---

## Testing Strategy

### Visual Regression Tests

Before starting, capture screenshots of:

1. **Home page** (`/en`) - All tab with banner
2. **Home page** - Fashion tab selected
3. **Home page** - Fashion → Men (L1) selected
4. **Home page** - Fashion → Men → Clothing (L2) selected
5. **Categories page** (`/en/categories`) - Pills mode, All
6. **Categories page** - Fashion category
7. **Category page** (`/en/categories/fashion`) - With circles
8. **Category page** - Deep navigation with L3 pills visible

### Automated Tests

```typescript
// e2e/mobile-home-tabs-refactor.spec.ts
test.describe('Mobile Home Tabs Refactor Parity', () => {
  test('tabs render identically', async ({ page }) => {
    // Compare before/after screenshots
  })
  
  test('pills render identically', async ({ page }) => {
    // Compare before/after screenshots
  })
  
  test('circles navigation works', async ({ page }) => {
    // Click through L0 → L1 → L2 → L3
  })
  
  test('infinite scroll still works', async ({ page }) => {
    // Scroll and verify products load
  })
})
```

---

## Rollback Plan

1. Keep original `mobile-home-tabs.tsx` as `mobile-home-tabs.legacy.tsx`
2. Feature flag: `USE_REFACTORED_TABS=true/false`
3. A/B test in production before removing legacy

---

## Success Criteria

- [ ] All 8 components extracted and working
- [ ] Original component reduced to ~250 lines
- [ ] Zero visual differences (screenshot comparison passes)
- [ ] All existing tests pass
- [ ] New unit tests for extracted hooks/components
- [ ] No performance regression (measure First Contentful Paint)
- [ ] Code review approved

---

## Post-Refactor Benefits

1. **Easier A/B testing**: Swap `CategoryTabs` ↔ `CategoryQuickPills` with one prop
2. **Reusability**: `ProductFeed` can be used on search results page
3. **Testability**: Each component can be unit tested in isolation
4. **Onboarding**: New devs understand one 100-line file, not 1183 lines
5. **Future features**: Adding L4 navigation = new component, not +200 lines
