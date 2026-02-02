# Code Duplication Audit Report

**Date:** February 2, 2026  
**Auditor:** GitHub Copilot  
**Project:** Treido Marketplace (Next.js)  
**Status:** READ-ONLY AUDIT

---

## Executive Summary

This audit identified **significant code duplication** across the codebase affecting maintainability, bundle size, and developer experience. The primary duplication categories are:

| Category | Severity | Estimated Files | Consolidation Effort |
|----------|----------|-----------------|---------------------|
| Product Type Definitions | 🔴 High | 15+ locations | Medium |
| Price Formatting Utilities | 🟠 Medium | 2 files | Low |
| Mobile/Desktop Component Pairs | 🔴 High | 8+ pairs | High |
| Filter-related Components | 🟠 Medium | 3 files | Medium |
| Discount Calculation Logic | 🟠 Medium | 6+ locations | Low |
| Subcategory Circle Components | 🟡 Low | 2 files | Medium |
| Zod Schema Definitions | 🟠 Medium | 10+ files | Medium |

---

## Detailed Findings

### 1. Product Type Duplication (🔴 Critical)

**Problem:** Product interfaces are defined in 15+ different locations with varying subsets of properties.

| File Location | Interface Name | Similarity % | Phase |
|---------------|----------------|--------------|-------|
| [lib/types/products.ts](lib/types/products.ts) | `UIProduct` | Base | - |
| [lib/data/products.ts](lib/data/products.ts#L16) | `Product` | ~85% | 2 |
| [lib/data/product-page.ts](lib/data/product-page.ts#L41) | `ProductPageProduct` | ~70% | 2 |
| [lib/data/profile-page.ts](lib/data/profile-page.ts#L13) | `ProfileProduct` | ~60% | 2 |
| [hooks/use-recently-viewed.ts](hooks/use-recently-viewed.ts#L6) | `RecentlyViewedProduct` | ~40% | 3 |
| [hooks/use-product-search.ts](hooks/use-product-search.ts#L11) | `SearchProduct` | ~50% | 3 |
| [components/shared/seller/boost-dialog.tsx](components/shared/seller/boost-dialog.tsx#L40) | `Product` (local) | ~30% | 2 |
| [components/providers/drawer-context.tsx](components/providers/drawer-context.tsx#L13) | `QuickViewProduct` | ~55% | 2 |
| [components/grid/product-grid.tsx](components/grid/product-grid.tsx#L31) | `ProductGridProduct` | ~65% | 2 |
| [components/desktop/promoted-section.tsx](components/desktop/promoted-section.tsx#L26) | `Product` (local) | ~50% | 3 |
| [components/desktop/desktop-home.tsx](components/desktop/desktop-home.tsx#L47) | `Product` (local) | ~75% | 2 |
| [app/[locale]/(main)/search/_lib/types.ts](app/[locale]/(main)/search/_lib/types.ts#L10) | `Product` | ~70% | 2 |
| [app/[locale]/[username]/profile-client.tsx](app/[locale]/[username]/profile-client.tsx#L41) | `ProfileProduct` | ~55% | 3 |
| [app/[locale]/(main)/categories/[slug]/_lib/types.ts](app/[locale]/(main)/categories/[slug]/_lib/types.ts#L1) | `Product` | ~70% | 2 |
| [app/[locale]/(account)/account/selling/page.tsx](app/[locale]/(account)/account/selling/page.tsx#L30) | `Product` (local) | ~40% | 3 |

**Consolidation Suggestion:**
- Create a base `BaseProduct` interface in `lib/types/products.ts`
- Use TypeScript's `Pick`, `Omit`, and intersection types for specialized variants
- Example: `type QuickViewProduct = Pick<BaseProduct, 'id' | 'title' | 'price' | 'image'> & { images?: string[] }`

---

### 2. Price Formatting Duplication (🟠 High)

**Problem:** Two separate files implement nearly identical price formatting logic.

| File | Functions | Similarity % | Phase |
|------|-----------|--------------|-------|
| [lib/format-price.ts](lib/format-price.ts) | `formatPrice`, `formatPriceParts`, `formatPriceRange`, `formatDiscount`, `hasDiscount`, `getDiscountPercentage` | Base | - |
| [lib/currency.ts](lib/currency.ts) | `formatPrice`, `formatPriceParts`, `getCurrencySymbol`, `getCurrencyCode`, `formatDeliveryDate` | ~90% overlapping | 2 |

**Key Duplications:**
- Both implement `formatPrice()` with same logic
- Both implement `formatPriceParts()` with identical output structure
- Both use `Intl.NumberFormat` with same locale mappings

**Consolidation Suggestion:**
- Merge into single `lib/currency.ts` that handles:
  - Price formatting (`formatPrice`, `formatPriceParts`, `formatPriceRange`)
  - Discount calculations (`formatDiscount`, `hasDiscount`, `getDiscountPercentage`)
  - Currency utilities (`getCurrencySymbol`, `getCurrencyCode`, `eurToBgnApprox`)
  - Date formatting (`formatDeliveryDate`, `getEstimatedDeliveryDate`)
- Delete `lib/format-price.ts` after migration

---

### 3. Mobile/Desktop Component Pairs (🔴 Critical)

**Problem:** Several components have nearly identical mobile and desktop implementations that differ only in responsive styling.

| Mobile Component | Desktop Component | Similarity % | Key Differences | Phase |
|------------------|-------------------|--------------|-----------------|-------|
| [components/mobile/mobile-home.tsx](components/mobile/mobile-home.tsx) | [components/desktop/desktop-home.tsx](components/desktop/desktop-home.tsx) | ~65% | Layout shell, state mgmt logic duplicated | 2 |
| [components/mobile/product/mobile-gallery-v2.tsx](components/mobile/product/mobile-gallery-v2.tsx) | [components/desktop/product/desktop-gallery-v2.tsx](components/desktop/product/desktop-gallery-v2.tsx) | ~50% | Lightbox vs fullscreen viewer, thumbnail layout | 2 |
| [components/mobile/subcategory-circles.tsx](components/mobile/subcategory-circles.tsx) | [components/category/subcategory-circles.tsx](components/category/subcategory-circles.tsx) | ~55% | Sizing, interactive vs link modes | 3 |
| [components/mobile/horizontal-product-card.tsx](components/mobile/horizontal-product-card.tsx) | [components/shared/product/product-card.tsx](components/shared/product/product-card.tsx) | ~60% | Layout orientation, badge positioning | 2 |
| [components/mobile/feed-control-bar.tsx](components/mobile/feed-control-bar.tsx) | [components/desktop/feed-toolbar.tsx](components/desktop/feed-toolbar.tsx) | ~45% | Tab vs dropdown UI, filter integration | 3 |
| [components/mobile/drawers/product-quick-view-drawer.tsx](components/mobile/drawers/) | [components/desktop/product/product-quick-view-dialog.tsx](components/desktop/product/product-quick-view-dialog.tsx) | ~70% | Drawer vs Dialog container, same content | 2 |

**Consolidation Suggestion:**
- Create responsive variants using composition pattern:
  ```tsx
  // components/shared/product/gallery.tsx
  export function ProductGallery({ variant = "auto" }: { variant?: "mobile" | "desktop" | "auto" }) {
    const isMobile = useIsMobile()
    const effectiveVariant = variant === "auto" ? (isMobile ? "mobile" : "desktop") : variant
    // Shared logic, variant-driven styling
  }
  ```
- Extract common business logic into hooks (already have `useCategoryNavigation`)
- Use CSS container queries or responsive Tailwind classes instead of component duplication

---

### 4. Filter Component Duplication (🟠 Medium)

**Problem:** Filter logic is spread across multiple overlapping components.

| File | Purpose | Similarity % | Phase |
|------|---------|--------------|-------|
| [components/shared/filters/filter-modal.tsx](components/shared/filters/filter-modal.tsx) | Single-section filter modal | ~70% shared with Hub | 2 |
| [components/shared/filters/filter-hub.tsx](components/shared/filters/filter-hub.tsx) | Multi-section filter hub | Base | - |
| [components/shared/filters/desktop-filters.tsx](components/shared/filters/desktop-filters.tsx) | Sidebar filters | ~40% shared | 3 |
| [components/desktop/filters-sidebar.tsx](components/desktop/filters-sidebar.tsx) | Desktop sidebar | ~35% shared | 3 |

**Shared Duplications:**
- `PendingFilters` interface defined in both filter-modal.tsx and filter-hub.tsx
- Same `COLOR_ATTRIBUTE_NAMES`, `SIZE_ATTRIBUTE_NAMES`, `SEARCHABLE_ATTRIBUTE_NAMES` constants
- Same `FORCE_MULTISELECT_NAMES` array
- Similar section rendering logic for price, rating, attributes

**Consolidation Suggestion:**
- Extract constants to `lib/filters/constants.ts`
- Create `lib/filters/types.ts` for shared interfaces
- Make `FilterHub` accept a `mode` prop to handle both single/multi section views
- Delete `FilterModal` and use `FilterHub` with `mode="single"`

---

### 5. Discount Calculation Duplication (🟠 Medium)

**Problem:** Discount percentage calculation is duplicated inline across 6+ components.

| Location | Code Pattern | Phase |
|----------|--------------|-------|
| [lib/format-price.ts](lib/format-price.ts#L114) | `Math.round((1 - currentPrice / originalPrice) * 100)` | - |
| [components/mobile/horizontal-product-card.tsx](components/mobile/horizontal-product-card.tsx#L46) | `Math.round(((listPrice - product.price) / listPrice) * 100)` | 2 |
| [components/shared/product/product-card.tsx](components/shared/product/product-card.tsx#L235) | `Math.round(((originalPrice - price) / originalPrice) * 100)` | 2 |
| [components/shared/product/product-card-list.tsx](components/shared/product/product-card-list.tsx#L147) | Same pattern | 2 |
| [components/mobile/product/mobile-bottom-bar-v2.tsx](components/mobile/product/mobile-bottom-bar-v2.tsx#L78) | Same pattern | 3 |

**Consolidation Suggestion:**
- Use the existing `getDiscountPercentage()` from `lib/format-price.ts` everywhere
- Add to exports and import in components

---

### 6. Zod Schema Duplication (🟠 Medium)

**Problem:** Similar validation schemas are defined multiple times across actions and lib files.

| Schema Type | Locations | Similarity % | Phase |
|-------------|-----------|--------------|-------|
| Password validation | [lib/validations/auth.ts](lib/validations/auth.ts), [app/[locale]/(auth)/_actions/auth.ts](app/[locale]/(auth)/_actions/auth.ts) | ~85% | 2 |
| Product schema | [app/actions/products.ts](app/actions/products.ts), [lib/sell/schema-v4.ts](lib/sell/schema-v4.ts), [app/[locale]/(business)/_components/product-form-modal.tsx](app/[locale]/(business)/_components/product-form-modal.tsx) | ~60% | 2 |
| Email schema | [lib/validations/auth.ts](lib/validations/auth.ts), [app/actions/profile.ts](app/actions/profile.ts) | ~95% | 2 |

**Consolidation Suggestion:**
- All auth-related schemas should import from `lib/validations/auth.ts`
- Create `lib/validations/product.ts` for all product-related schemas
- Server actions should reference, not redefine, these schemas

---

### 7. CSS/Style Patterns (🟡 Low)

**Problem:** Repeated className patterns for common UI elements.

| Pattern | Occurrences | Consolidation |
|---------|-------------|---------------|
| `rounded-full bg-surface-floating/90 shadow-sm flex items-center justify-center` | 5+ | Create `floating-button` component |
| `text-2xs text-muted-foreground` | 20+ | Already using, OK |
| `size-touch-lg` / `size-touch-xs` | 10+ | Already using design tokens, OK |
| Discount badge styling | 4+ | Create Badge variant |

**Note:** Most styling follows design system conventions. Low priority.

---

## Recommended Consolidation Strategy

### Phase 2 (High Priority - Do First)
1. **Unify Product Types** - Create base interfaces with composition
2. **Merge Price Utilities** - Single source of truth for formatting
3. **Consolidate Filter Components** - One component with modes
4. **Extract Discount Logic** - Use lib function everywhere
5. **Dedupe Auth Schemas** - Import from lib/validations

### Phase 3 (Medium Priority)
1. **Responsive Component Pattern** - Refactor mobile/desktop pairs
2. **Unify Quick View** - Single component with drawer/dialog variants
3. **Category Circles Merge** - Variant-based single component
4. **Home Page Logic** - Extract shared state management to hooks

---

## Estimated Impact

| Metric | Current | After Consolidation |
|--------|---------|---------------------|
| Total Lines of Code | ~45,000 | ~40,000 (-11%) |
| Type Definition Files | 15+ | 5-7 |
| Duplicate Functions | 8+ | 0 |
| Bundle Size (est.) | Baseline | -5-8% |
| Maintenance Complexity | High | Medium |

---

## Files to Delete After Consolidation

1. `lib/format-price.ts` → merge into `lib/currency.ts`
2. `components/shared/filters/filter-modal.tsx` → use FilterHub with mode
3. Multiple local `Product` interface definitions → import from lib

---

*This audit is read-only. No changes have been made to the codebase.*
