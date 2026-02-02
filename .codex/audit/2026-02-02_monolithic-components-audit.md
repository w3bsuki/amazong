# Monolithic Component Audit

> **Generated:** February 2, 2026
> **Scope:** Large page/component files (300+ lines) with inline sub-components

## Summary

| Severity | Count | Definition |
|----------|-------|------------|
| 🔴 Critical | 2 | 600+ lines |
| 🟠 High | 2 | 400-599 lines |
| 🟡 Medium | 4 | 300-399 lines |

---

## 🔴 CRITICAL (600+ lines)

### 1. checkout-page-client.tsx — ~720 lines

**Path:** `app/[locale]/(checkout)/_components/checkout-page-client.tsx`

| Metric | Value |
|--------|-------|
| Lines | ~720 |
| Inline Components | 5 |
| Tailwind Violations | 0 |
| shadcn/ui Usage | ✅ Proper |

**Inline Components Found:**
- `AddressSection` — address form with validation
- `ShippingMethodSection` — shipping option selection
- `OrderItemsSection` — mobile order items list
- `OrderItemsSectionDesktop` — desktop order items list
- Additional helper functions for formatting

**Issues:**
- Mobile and desktop layouts duplicated within same file
- Address form logic coupled to component
- Shipping method selection duplicated (compact vs full views)

**Recommended Extractions:**
```
components/shared/checkout/
├── address-section.tsx
├── shipping-method-section.tsx
├── order-items-section.tsx
└── order-summary-card.tsx

hooks/
└── use-checkout-form.ts
```

---

### 2. filter-hub.tsx — ~640 lines

**Path:** `components/shared/filters/filter-hub.tsx`

| Metric | Value |
|--------|-------|
| Lines | ~640 |
| Inline Components | 0 (but massive render logic) |
| Tailwind Violations | 0 |
| shadcn/ui Usage | ✅ Proper |

**Issues:**
- ~15 different filter section renderers inline
- Category, Rating, Price, Availability, Attribute sections all in one file
- Complex pending state management mixed with rendering

**Recommended Extractions:**
```
components/shared/filters/
├── filter-rating-section.tsx
├── filter-availability-section.tsx
├── filter-category-section.tsx
├── filter-attribute-section.tsx
└── filter-pending-indicator.tsx

hooks/
└── use-filter-pending-state.ts
```

---

## 🟠 HIGH (400-599 lines)

### 3. mobile-category-browser.tsx — ~430 lines

**Path:** `components/mobile/mobile-category-browser.tsx`

| Metric | Value |
|--------|-------|
| Lines | ~430 |
| Inline Components | 0 |
| Tailwind Violations | 0 |
| shadcn/ui Usage | ✅ Proper |

**Issues:**
- Two completely different rendering modes (contextual vs traditional)
- Heavy conditional branching adds complexity
- Good: Already uses extracted hooks (`useCategoryNavigation`, `useInstantCategoryBrowse`)

**Recommended Actions:**
- Split into `MobileCategoryBrowserContextual.tsx` and `MobileCategoryBrowserTraditional.tsx`
- Keep shared hook usage pattern

---

### 4. feed-toolbar.tsx — ~390 lines

**Path:** `components/desktop/feed-toolbar.tsx`

| Metric | Value |
|--------|-------|
| Lines | ~390 |
| Inline Components | 0 |
| Tailwind Violations | 0 |
| shadcn/ui Usage | ✅ Proper |

**Issues:**
- Complex filter pill rendering logic
- Category attribute filters rendered inline
- Overflow filter handling adds complexity

**Recommended Extractions:**
```
components/desktop/
├── quick-filter-pills.tsx
├── category-attribute-dropdowns.tsx
└── overflow-filters-dropdown.tsx
```

---

## 🟡 MEDIUM (300-399 lines)

### 5. desktop-home.tsx — ~360 lines

**Path:** `components/desktop/desktop-home.tsx`

| Metric | Value |
|--------|-------|
| Lines | ~360 |
| Inline Components | 0 |
| Tailwind Violations | 0 |

**Issues:**
- Product fetching and transformation logic inline
- Grid product mapping duplicated

**Recommended Actions:**
- Extract `useDesktopHomeFeed` hook
- Extract `DesktopHomeSidebar` component if sidebar grows

---

### 6. product-card.tsx — ~350 lines ✅

**Path:** `components/shared/product/product-card.tsx`

| Metric | Value |
|--------|-------|
| Lines | ~350 |
| Inline Components | 1 (`formatTimeAgo`) |
| Tailwind Violations | 0 |

**Status:** Good pattern! Uses extracted sub-components properly.

**Minor Fix:**
- Move `formatTimeAgo` to `lib/utils/format-time.ts`

---

### 7. mobile-product-info-tab.tsx — ~445 lines

**Path:** `components/mobile/product/mobile-product-info-tab.tsx`

| Metric | Value |
|--------|-------|
| Lines | ~445 |
| Inline Components | 5 |
| Tailwind Violations | 0 |

**Inline Components Found:**
- `ProductHeader`
- `SpecificationsList`
- `ProductDescription`
- `DeliveryOptions`
- `ShippingReturnsInfo`

**Note:** These are duplicates of what was extracted for `mobile-product-single-scroll.tsx`. Consider importing from shared instead:
```tsx
import { SpecificationsList } from "@/components/shared/product/specifications-list"
import { DeliveryOptions } from "@/components/shared/product/delivery-options"
import { ShippingReturnsInfo } from "@/components/shared/product/shipping-returns-info"
```

---

### 8. mobile-home.tsx — ~310 lines

**Path:** `components/mobile/mobile-home.tsx`

| Metric | Value |
|--------|-------|
| Lines | ~310 |
| Inline Components | 3 |
| Tailwind Violations | 0 |

**Inline Components Found:**
- `PromotedListingsStrip`
- `TrustBadgesInline`
- `SellPromoBanner`

**Recommended Extractions:**
```
components/shared/
├── promoted-listings-strip.tsx
├── trust-badges-inline.tsx (or variant of existing TrustBadges)
└── sell-promo-banner.tsx
```

---

## Recently Refactored ✅

### mobile-product-single-scroll.tsx — 647 → 355 lines

Successfully refactored on Feb 2, 2026.

**Extracted Components:**
- `components/shared/product/meta-row.tsx`
- `components/shared/product/product-header.tsx`
- `components/shared/product/specifications-list.tsx`
- `components/shared/product/delivery-options.tsx`
- `components/shared/product/shipping-returns-info.tsx`
- `components/shared/product/similar-items-grid.tsx`

---

## Shared Components Inventory

### components/shared/product/ (42+ files)
Well-decomposed primitives ready for reuse:
- `product-card-*.tsx`, `hero-specs.tsx`, `trust-badges.tsx`
- `freshness-indicator.tsx`, `horizontal-product-card.tsx`
- **NEW:** `meta-row.tsx`, `specifications-list.tsx`, `delivery-options.tsx`, etc.

### components/shared/filters/ (10 files)
- `color-swatches.tsx`, `size-tiles.tsx`, `filter-list.tsx`, `price-slider.tsx`

### components/ui/ (34 primitives)
Full shadcn/ui library — all audited files use these properly.

---

## Refactoring Priority Matrix

| Priority | File | Effort | Impact | Reason |
|----------|------|--------|--------|--------|
| 🔥 P1 | `checkout-page-client.tsx` | High | High | Critical user path, testability |
| 🔥 P1 | `filter-hub.tsx` | High | High | Reusable filter sections everywhere |
| 📌 P2 | `mobile-product-info-tab.tsx` | Low | Medium | Just import existing shared components |
| 📌 P2 | `mobile-category-browser.tsx` | Medium | Medium | Cleaner mode separation |
| 📝 P3 | `feed-toolbar.tsx` | Medium | Medium | Reusable filter pills |
| 📝 P3 | `mobile-home.tsx` | Low | Low | Extract promo/trust components |

---

## Tailwind v4 Compliance

**Status:** ✅ All audited files compliant

No palette colors (`bg-gray-*`, `text-blue-*`) or gradient classes detected. All files use semantic tokens:
- `bg-background`, `bg-card`, `bg-surface-subtle`, `bg-selected`
- `text-foreground`, `text-muted-foreground`
- `border-border`, `border-selected-border`

---

## Next Steps

1. **Quick Win:** Update `mobile-product-info-tab.tsx` to import from shared (P2)
2. **Major Refactor:** Split `checkout-page-client.tsx` (P1)
3. **Major Refactor:** Decompose `filter-hub.tsx` (P1)
