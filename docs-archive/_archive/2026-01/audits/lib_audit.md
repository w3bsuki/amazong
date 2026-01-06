# 🔥 LIB FOLDER AUDIT

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 3 |
| 🟠 HIGH | 8 |
| 🟡 MEDIUM | 12 |
| 🟢 LOW | 9 |

---

## 🔴 CRITICAL ISSUES

### 1. DUPLICATE CODE: `formatPrice` and `formatPriceCompact` in TWO files!

| File | Functions |
|------|-----------|
| `lib/format-price.ts` | `formatPrice`, `formatPriceCompact` |
| `lib/currency.ts` | `formatPrice`, `formatPriceCompact` |

**Impact:** Tests import from BOTH files. Copy-paste disaster waiting to happen.

**Fix:** Delete `lib/format-price.ts` and consolidate into `lib/currency.ts`. Update all imports.

---

### 2. MASSIVE 920-line GOD FILE: `lib/data/business.ts`

**Lines:** 920+

**Responsibilities (TOO MANY):**
- Authentication
- Subscription validation
- Dashboard stats
- Products queries
- Orders queries
- Inventory management
- Customers
- Activity transforms
- Performance scoring

**Fix:** Split into:
- `lib/auth/business-auth.ts`
- `lib/data/dashboard-stats.ts`
- `lib/data/business-products.ts`
- `lib/data/business-orders.ts`

---

### 3. Missing Type Exports in `lib/shipping.ts`

**Description:** THREE functions (`calculateShipping`, `getShippingOptions`, `validateAddress`) are declared but NOT EXPORTED.

**Fix:** Export the functions or remove them.

---

## 🟠 HIGH SEVERITY ISSUES

### 4. Unused Function: `lib/geolocation.ts`

| Line | Issue |
|------|-------|
| 80 | `getDistanceKm` declared but never used |
| 90 | `SUPPORTED_COUNTRIES` declared but never exported |

---

### 5. Unused `normalizeSlug` Function in `lib/url-utils.ts`

**Line:** 112  
**Description:** Declared but never used or exported.

---

### 6. TRIPLE Icon Mapping Duplication: `lib/category-icons.tsx`

| Lines | Maps |
|-------|------|
| 70-200 | `CATEGORY_ICONS` |
| 220-350 | `getCategoryIcon` internal map |
| 356-410 | `SUBCATEGORY_ICONS` |
| 415-440 | `FALLBACK_ICONS` |

**Impact:** FOUR separate icon mappings with overlapping keys! Each time you add a category, you must update FOUR places!

**Fix:** Create single source of truth:
```typescript
const ICON_CONFIG: Record<string, { icon: PhosphorIcon; variants?: {...} }> = {...}
```

---

### 7. Inconsistent Export Patterns in `lib/image-utils.ts`

**Description:** Mix of exported and non-exported functions. `compressImage`, `resizeImage`, `validateImage`, etc. are all private but look like public utilities.

**Fix:** Either export them or prefix with `_` to indicate internal use.

---

### 8. Hardcoded Magic Numbers in `lib/shipping.ts`

**Lines:** 35-80  
**Description:** Delivery time estimates hardcoded in massive matrix (e.g., `SOFIA_TO_PLOVDIV: 2`).

**Fix:** Move to configuration or allow admin override.

---

### 9. Dead Functions in `lib/validations/product.ts`

**Functions:** `validateProductTitle`, `validateProductDescription`, `validateProductPrice`  
**Description:** Declared but never exported or used.

---

### 10. Missing Return Types on Legacy Exports

**File:** `lib/currency.ts`  
**Functions:** `formatBGN`, `formatEUR`, `formatUSD`, `convertCurrency`, `getCurrencySymbol`

**Fix:** Add proper return type annotations.

---

### 11. Inconsistent `'server-only'` Import

| File | Has `'server-only'` |
|------|---------------------|
| `lib/data/business.ts` | ✅ Yes |
| `lib/stripe.ts` | ❌ No |
| `lib/auth/admin.ts` | ✅ Yes |
| `lib/auth/business.ts` | ✅ Yes |

**Fix:** Add `import 'server-only'` to `lib/stripe.ts`.

---

## 🟡 MEDIUM SEVERITY ISSUES

### 12. `BULGARIAN_CITIES` Duplicated in Two Files

| File | Location |
|------|----------|
| `lib/bulgarian-cities.ts` | `CITIES` array |
| `lib/geolocation.ts` | `CITIES` array |

**Fix:** Single source of truth - export from one place.

---

### 13. Unused Type Definitions in `lib/types/`

| Type | Status |
|------|--------|
| `CartItem` | Defined but not exported |
| `WishlistItem` | Defined but not exported |
| `OrderItem` | Defined but not exported |
| `ReviewData` | Defined but not exported |
| `SellerProfile` | Defined but not exported |

---

### 14. Re-export File Pattern: `lib/supabase.ts`

**Content:** Just re-exports from `lib/supabase/client.ts`

**Fix:** Update all imports to point to `lib/supabase/client.ts` directly and delete the re-export file.

---

### 15. Inconsistent Error Handling in Data Functions

| File | Pattern |
|------|---------|
| `lib/data/categories.ts` | `console.error` + return empty |
| `lib/data/products.ts` | `console.error` + return empty |
| `lib/data/orders.ts` | Silent `null` return |

**Fix:** Use consistent error handling - consider using `lib/safe-result` module.

---

### 16. `lib/validations/auth.ts` Has Unused Schemas

| Schema | Status |
|--------|--------|
| `signUpSchema` | Declared but not exported (Line 18) |
| `resetPasswordSchema` | Declared but not exported (Line 124) |
| `updateProfileSchema` | Declared but not exported (Line 135) |

---

### 17. UUID Regex Duplicated

| File | Location |
|------|----------|
| `lib/url-utils.ts` | `const UUID_REGEX = /^[0-9a-f]{8}-.../` |
| `lib/validations/product.ts` | `const UUID_REGEX = /^[0-9a-f]{8}-.../` |
| `lib/data/products.ts` | `const UUID_REGEX = /^[0-9a-f]{8}-.../` |

**Fix:** Create `lib/utils/uuid.ts` with shared `UUID_REGEX` and `isValidUUID` function.

---

## 🟢 LOW SEVERITY ISSUES

### 18. Inconsistent Type Import Style
Some files use `import type { X }`, others use `import { X }`.

### 19. `lib/ai/prompts.ts` Has Hardcoded Token Limits
```typescript
maxOutputTokens: 640,
maxOutputTokens: 512,
```

### 20. Missing JSDoc on Some Public Functions
Files like `lib/currency.ts`, `lib/shipping.ts` lack documentation.

### 21. Stripe API Version Hardcoded
```typescript
apiVersion: "2024-12-18.acacia"
```

---

## Recommended Actions

### Immediate (Do Today):
1. ⚠️ Merge `lib/format-price.ts` into `lib/currency.ts`
2. ⚠️ Export or delete unused functions in `lib/shipping.ts`
3. ⚠️ Add `'server-only'` to `lib/stripe.ts`

### This Week:
4. Split `lib/data/business.ts` into smaller modules
5. Consolidate `BULGARIAN_CITIES` to single source
6. Create shared `lib/utils/uuid.ts`
7. Export unused type definitions or remove them

### This Sprint:
8. Refactor `lib/category-icons.tsx` to single icon config
9. Make shipping times configurable
10. Standardize error handling across data functions

---

## Final Verdict

**Overall Grade: C-**

The code works, but it's a maintenance nightmare waiting to happen. The duplicate `formatPrice` functions alone could cause currency display bugs if one gets updated and the other doesn't.
