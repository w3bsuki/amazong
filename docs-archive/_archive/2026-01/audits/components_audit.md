# 🔥 COMPONENTS FOLDER AUDIT

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 4 |
| 🟠 HIGH | 11 |
| 🟡 MEDIUM | 18 |
| 🔵 LOW | 14 |

---

## 🔴 CRITICAL ISSUES

### 1. DEAD CODE - Unused Files
**Status:** UNUSED - Delete immediately

| File | Status |
|------|--------|
| `components/ui/use-toast.ts` | UNUSED |
| `components/ui/toaster.tsx` | UNUSED |
| `components/shared/legacy-product-card.tsx` | UNUSED |

---

### 2. MONSTER COMPONENT - `mobile-home-tabs.tsx` (1,000+ lines)
**File:** `components/mobile/mobile-home-tabs.tsx`  
**Lines:** ~1,000+  

**Issues:**
- Too many responsibilities (navigation, data fetching, UI rendering, URL management)
- 20+ useState hooks
- Complex nested effects
- Multiple API calls in single component

**Fix:** Split into:
- `MobileHomeTabsContainer` (state management)
- `MobileTabsNavigation` (L0-L3 navigation)
- `MobileProductFeed` (product grid + infinite scroll)
- `useCategoryNavigation` hook
- `useProductFeed` hook

---

### 3. DUPLICATE FUNCTIONALITY - Three Product Feed Sections

| Component | Lines | Purpose |
|-----------|-------|---------|
| `mobile-product-feed-section.tsx` | 430 | Mobile product feed |
| `desktop-product-feed-section.tsx` | 450 | Desktop product feed |
| `mobile-home-tabs.tsx` | 1000 | Mobile home tabs w/ products |

**Fix:** Create unified `ProductFeed` component with `variant` prop.

---

### 4. EMPTY CART FOLDER
**Path:** `components/buyer/cart/`  
**Status:** EMPTY FOLDER

**Fix:** Add cart components or delete folder.

---

## 🟠 HIGH SEVERITY ISSUES

### 5. Console.error Statements in Production

| File | Count |
|------|-------|
| `mobile-home-tabs.tsx` | 3 |
| `mobile-product-feed-section.tsx` | 2 |
| `desktop-product-feed-section.tsx` | 3 |
| `search-overlay.tsx` | 4 |
| `mobile-search-overlay.tsx` | 7 |
| `desktop-search-overlay.tsx` | 4 |

**Fix:** Replace with proper error boundaries and logging service.

---

### 6. Duplicate Search Components
~60% duplicate logic between:
- `desktop-search-overlay.tsx`
- `mobile-search-overlay.tsx`

**Fix:** Create `useSearchOverlay` hook to share logic.

---

### 7. Duplicate Filter Components

| Component | Purpose |
|-----------|---------|
| `desktop-quick-filters.tsx` | Desktop quick filters |
| `mobile-filter-drawer.tsx` | Mobile filter drawer |
| `desktop-filter-modal.tsx` | Desktop filter modal |

**Fix:** Create `useFilters` hook for shared state/logic.

---

### 8. "use client" Overuse in UI Components
Many pure presentational components have unnecessary `"use client"`:
- `badge.tsx`
- `card.tsx`
- `separator.tsx`
- `skeleton.tsx`

**Fix:** Remove `"use client"` from pure presentational components.

---

### 9. Empty Reviews Folder
**Path:** `components/shared/reviews/`  
**Status:** EMPTY

---

### 10. Auth Folder Contains Only an Image
**Path:** `components/auth/`  
**Contains:** Just `google-icon.svg`

**Fix:** Move image to `public/`. Delete folder.

---

### 11. Inconsistent Naming Conventions

| Pattern | Examples |
|---------|----------|
| kebab-case | `product-card.tsx`, `search-overlay.tsx` |
| Mixed exports | `ProductCard` vs `productCard` |

**Fix:** Standardize: files = kebab-case, exports = PascalCase.

---

### 12. Props Interface Bloat in ProductCard
**File:** `components/shared/product-card.tsx`  
**Props Count:** 40+  
**Legacy Props:** `showBadges`, `showRating`, `showWishlist`, `showQuickView` marked as "accepted but ignored"

**Fix:** Remove legacy props, use composition pattern.

---

### 13. Missing Index Exports

| Folder | Has index.ts |
|--------|--------------|
| `components/ui/` | ✅ Yes |
| `components/shared/` | ✅ Yes |
| `components/mobile/` | ❌ No |
| `components/desktop/` | ❌ No |
| `components/seller/` | ❌ No |
| `components/buyer/` | ❌ No |

---

## 🟡 MEDIUM SEVERITY ISSUES

### 14. Complex useEffect Dependencies
Multiple `eslint-disable-line react-hooks/exhaustive-deps` comments.

### 15. Magic Numbers
```tsx
hasMore: initialProducts.length >= 12  // Why 12?
```
**Fix:** Extract to constants: `const PAGE_SIZE = 12`

### 16. Hardcoded Localization
```tsx
{locale === "bg" ? "Всички" : "All"}
```
**Fix:** Use `useTranslations()` consistently.

### 17. Missing Error Boundaries
No dedicated error boundaries in mobile/, desktop/, seller/.

### 18. Large Inline Styles
```tsx
style={{ top: headerHeight }}
```
**Fix:** Use CSS custom properties or Tailwind JIT.

---

## ✅ WHAT'S ACTUALLY GOOD

1. **UI Components (shadcn/ui)** - Well structured, consistent
2. **TypeScript Usage** - Good type coverage
3. **Accessibility** - ARIA labels present in most places
4. **CVA Variants** - Good pattern for component variants
5. **Custom Hooks** - `use-mobile`, `use-recently-viewed` are clean

---

## Priority Fix Order

### Week 1 (Critical)
1. Delete 3 unused files
2. Delete/populate empty folders
3. Move image out of auth folder
4. Start splitting `mobile-home-tabs.tsx`

### Week 2 (High)
1. Replace console.error with proper logging
2. Create shared hooks for search/filters
3. Consolidate product feed components
4. Add index.ts files

### Week 3 (Medium)
1. Add error boundaries
2. Extract magic numbers to constants
3. Use translations consistently
4. Add loading states
