# Code Duplication Audit

> Audit Date: 2026-02-02 | Auditor: duplicates-auditor | Status: ✅ Complete

---

## Summary

| Category | Severity | Impact |
|----------|----------|--------|
| Product Types | 🔴 Critical | 15+ different interfaces |
| Price Utils | 🟠 High | 90% overlap between files |
| Mobile/Desktop Components | 🔴 Critical | 6+ pairs with 45-70% similarity |
| Filter Components | 🟠 Medium | ~70% code sharing |
| Discount Calc | 🟠 Medium | Same formula in 6+ locations |
| Zod Schemas | 🟠 Medium | Password/email defined multiple times |

---

## Critical Duplicates (Phase 2)

### 1. Product Types Sprawl

**Problem:** 15+ different `Product` interfaces across codebase

| Location | Type Name | Fields |
|----------|-----------|--------|
| `lib/types/product.ts` | `Product` | Base type |
| `lib/types/database.ts` | `Database['products']['Row']` | DB schema |
| `app/actions/products.ts` | Inline interface | Action-specific |
| Various components | Inline types | Pick/partial |

**Fix:** Create base `Product` types in single location with composition (`Pick<T>`, `Omit<T>`, `Partial<T>`)

### 2. Price Utils Duplication

**Problem:** `lib/format-price.ts` and `lib/currency.ts` duplicate 90% logic

| File | Functions |
|------|-----------|
| `lib/format-price.ts` | `formatPrice()`, `formatPriceRange()` |
| `lib/currency.ts` | `formatCurrency()`, `formatAmount()` |

**Fix:** Merge `lib/format-price.ts` into `lib/currency.ts`

---

## High Priority (Phase 3)

### 3. Mobile/Desktop Component Pairs

| Component | Mobile Location | Desktop Location | Similarity |
|-----------|-----------------|------------------|------------|
| ProductQuickView | `mobile/drawers/product-quick-view-drawer.tsx` | `desktop/product/product-quick-view-dialog.tsx` | 70% |
| CartView | `mobile/drawers/cart-drawer.tsx` | `layout/header/cart/cart-dropdown.tsx` | 65% |
| FilterView | `mobile/drawers/filter-drawer.tsx` | `shared/filters/filter-panel.tsx` | 60% |
| CategoryNav | `mobile/category-nav/` | `desktop/category/` | 55% |

**Fix:** Extract shared content components, platform shells just wrap them

### 4. Filter Components

**Problem:** `FilterModal` & `FilterHub` share ~70% code

**Fix:** Refactor FilterModal to use FilterHub with `mode="single"`

---

## Medium Priority (Phase 3)

### 5. Discount Calculation

**Problem:** Same discount formula inlined in 6+ locations:
```typescript
const discount = Math.round(((listPrice - price) / listPrice) * 100);
```

**Locations:**
- `components/shared/product/product-card.tsx`
- `components/shared/product/product-price.tsx`
- `app/[locale]/(main)/[username]/[productSlug]/page.tsx`
- Plus 3 more...

**Fix:** Create `lib/discount.ts` with `calculateDiscountPercent()` helper

### 6. Zod Schema Duplication

| Schema | Defined In |
|--------|------------|
| Password validation | `lib/validations/auth.ts`, `app/actions/auth.ts`, inline in forms |
| Email validation | Same pattern |

**Fix:** Single source of truth in `lib/validations/auth.ts`, import everywhere

---

## Consolidation Priority Order

1. **Product Types** → Single `lib/types/product.ts` with composition
2. **Price Utils** → Merge into `lib/currency.ts`
3. **Filter Components** → FilterHub as base, modal as wrapper
4. **Mobile/Desktop** → Shared content components
5. **Discount Calc** → `lib/discount.ts` helper
6. **Zod Schemas** → Single validation source

---

*Generated: 2026-02-02*
