# Treido shadcn/ui Structure Audit Report

**Date:** February 2, 2026  
**Scope:** `components/ui/`, `components/shared/`, `components/layout/`, `components/mobile/`, `components/desktop/`  
**Status:** READ-ONLY AUDIT

---

## Executive Summary

The Treido codebase demonstrates **strong adherence** to shadcn/ui architecture principles overall. The `components/ui/` directory maintains primitive purity with appropriate customizations via CVA variants. Cross-boundary imports follow expected patterns. However, there are **several organizational issues** and **duplicate components** that should be addressed.

**Key Findings:**
- ✅ No app-specific logic in `components/ui/`
- ✅ No imports from `@/app/` or `@/hooks/` in UI primitives
- ⚠️ 2 duplicate component implementations found
- ⚠️ Parallel directory structures causing confusion
- ⚠️ Some components in wrong directories

---

## 1. components/ui/ Purity Analysis

### ✅ PASS: No App Logic Violations

All `components/ui/*.tsx` files correctly:
- Import only from `@/lib/utils` (the `cn` utility)
- Import UI siblings when needed (e.g., `toggle-group.tsx` → `toggle.tsx`)
- Use Radix UI primitives and CVA for variants
- Contain no business logic, API calls, or context consumers

### ✅ PASS: Standard shadcn Customizations

The following customizations are **appropriate** and follow shadcn patterns:

| Component | Customization | Rationale |
|-----------|---------------|-----------|
| [button.tsx](components/ui/button.tsx) | Added `cta`, `deal`, `black`, `brand` variants | Marketplace-specific CTAs |
| [button.tsx](components/ui/button.tsx) | Added `xs`, `xl`, `icon-sm`, `icon-lg` sizes | Mobile touch targets (44px standard) |
| [badge.tsx](components/ui/badge.tsx) | Comprehensive variant system (condition, shipping, stock) | C2C marketplace needs |
| [card.tsx](components/ui/card.tsx) | Flat styling (no heavy shadow) | Treido design system |
| [drawer.tsx](components/ui/drawer.tsx) | iOS device detection, overlay blur options | Mobile UX optimization |
| [dialog.tsx](components/ui/dialog.tsx) | Custom overlay to prevent scroll lock issues | Sticky header preservation |

### ⚠️ NOTE: Extended Primitives

These UI components have been **extended beyond standard shadcn** but remain pure:

| Component | Extension | Assessment |
|-----------|-----------|------------|
| [drawer.tsx](components/ui/drawer.tsx) | `DrawerBody` component, iOS optimizations | ✅ Appropriate for mobile-first app |
| [dialog.tsx](components/ui/dialog.tsx) | `fullWidth` variant, custom overlay | ✅ Appropriate for modal patterns |
| [toast.tsx](components/ui/toast.tsx) | `closeLabel` prop on ToastClose | ✅ Accessibility enhancement |

---

## 2. Component Boundary Analysis

### ✅ PASS: Import Direction

```
┌─────────────────────────────────────────────────────────────┐
│                        app/ pages                           │
│                            ↓                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            components/layout/                         │   │
│  │            components/mobile/                         │   │
│  │            components/desktop/                        │   │
│  │                      ↓                                │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │          components/shared/                     │  │   │
│  │  │                    ↓                            │  │   │
│  │  │  ┌──────────────────────────────────────────┐  │  │   │
│  │  │  │         components/ui/ (primitives)      │  │  │   │
│  │  │  │                    ↓                      │  │  │   │
│  │  │  │           @/lib/utils (cn)               │  │  │   │
│  │  │  └──────────────────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

Import patterns are correct:
- `components/ui/` → only `@/lib/utils`
- `components/shared/` → `components/ui/` + `@/lib/` + `@/hooks/`
- `components/layout/` → `components/ui/` + `components/shared/`
- `components/mobile/` → `components/ui/` + `components/shared/`
- `components/desktop/` → `components/ui/` + `components/shared/`

### ✅ PASS: No Reverse Imports

No instances found of:
- `components/ui/` importing from `components/shared/`
- `components/ui/` importing from `components/layout/`
- `components/ui/` importing from `@/app/`
- `components/ui/` importing from `@/hooks/`

---

## 3. Findings Table

| Path | Issue | Severity | Proposed Fix | Phase |
|------|-------|----------|--------------|-------|
| `components/grid/product-grid.tsx` | **Duplicate**: Similar to `components/shared/product/product-grid.tsx` | 🔴 High | Consolidate into single grid component in `shared/product/` | 1 |
| `components/category/subcategory-circles.tsx` | **Duplicate**: Different impl from `components/mobile/subcategory-circles.tsx` | 🔴 High | Keep `category/` version (fuller API), deprecate `mobile/` | 1 |
| `components/auth/` | **Parallel directory**: Conflicts with `components/shared/auth/` | 🟡 Medium | Merge into `components/shared/auth/` | 2 |
| `components/charts/` | **Parallel directory**: Conflicts with `components/shared/charts/` | 🟡 Medium | Merge into `components/shared/charts/` | 2 |
| `components/category/` | **Parallel directory**: Conflicts with `components/shared/category/` | 🟡 Medium | Merge into `components/shared/category/` | 2 |
| `components/seller/` | **Parallel directory**: Conflicts with `components/shared/seller/` | 🟡 Medium | Merge into `components/shared/seller/` | 2 |
| `components/mobile/horizontal-product-card.tsx` | **Wrong location**: Used by `components/shared/`, should be in shared | 🟡 Medium | Move to `components/shared/product/` | 2 |
| `components/grid/` | **Misplaced directory**: Contains only ProductGrid | 🟢 Low | Remove after consolidation | 3 |
| `components/navigation/` | **Nearly empty**: Contains only `app-breadcrumb.tsx` | 🟢 Low | Move to `components/shared/` | 3 |
| `components/orders/` | **Too narrow**: Single component | 🟢 Low | Move to `components/shared/orders/` | 3 |
| `components/onboarding/` | **Inconsistent**: Should be in `shared/` | 🟢 Low | Move to `components/shared/onboarding/` | 3 |
| `components/sections/` | **Inconsistent**: Should be in `shared/` | 🟢 Low | Move to `components/shared/sections/` | 3 |
| `components/pricing/` | **Inconsistent**: Should be in `shared/` | 🟢 Low | Move to `components/shared/pricing/` | 3 |

---

## 4. Duplicate Component Details

### 4.1 ProductGrid Duplication 🔴

**Location 1:** [components/grid/product-grid.tsx](components/grid/product-grid.tsx)
- Uses container queries (`@container`)
- Includes `ViewMode` (grid/list) support
- Accepts `products` array directly
- **Used by:** `search/page.tsx`, `categories/[slug]/page.tsx`, `desktop-home.tsx`

**Location 2:** [components/shared/product/product-grid.tsx](components/shared/product/product-grid.tsx)
- Uses responsive viewport classes
- Provides skeleton components
- Accepts `children` render pattern
- **Used by:** Less frequently, mainly for skeletons

**Recommendation:** Consolidate features into `components/shared/product/product-grid.tsx`:
- Keep container query approach from `grid/`
- Keep skeleton exports from `shared/`
- Update all imports
- Delete `components/grid/`

### 4.2 SubcategoryCircles Duplication 🔴

**Location 1:** [components/category/subcategory-circles.tsx](components/category/subcategory-circles.tsx)
- Full-featured: desktop variant, active highlighting, counts
- Uses `CategoryCircleVisual` from shared
- Supports interactive mode (buttons vs links)
- **Used by:** `desktop-home.tsx`, `subcategory-tabs.tsx`

**Location 2:** [components/mobile/subcategory-circles.tsx](components/mobile/subcategory-circles.tsx)
- Simpler implementation
- Different prop types (`CategoryTreeNode` vs custom)
- **Used by:** `mobile-home.tsx`

**Recommendation:** 
- Enhance `components/category/subcategory-circles.tsx` to support mobile use case
- Update `mobile-home.tsx` to use the unified version
- Delete `components/mobile/subcategory-circles.tsx`

---

## 5. Parallel Directory Structure Issues

The codebase has **fragmented component organization** with parallel directories:

```
components/
├── auth/                    ← 3 files
├── shared/auth/             ← 2 files (different components!)
├── category/                ← 3 files
├── shared/category/         ← 2 files
├── charts/                  ← 1 file
├── shared/charts/           ← 1 file
├── seller/                  ← 2 files
├── shared/seller/           ← 3 files
```

This creates confusion about where to add new components and makes imports inconsistent.

**Recommendation:** Consolidate into `components/shared/` following the established pattern:
- `shared/auth/` - all auth-related composites
- `shared/category/` - all category-related composites
- `shared/charts/` - all chart composites
- `shared/seller/` - all seller-related composites

---

## 6. shadcn Registry Compliance

### ✅ Present & Aligned

All core shadcn components are present and follow patterns:
- accordion, alert, alert-dialog, avatar, badge
- breadcrumb, button, card, checkbox, command
- dialog, drawer, dropdown-menu, hover-card
- input, label, pagination, popover, progress
- radio-group, scroll-area, select, separator
- sheet, skeleton, slider, switch, table
- tabs, textarea, toast, toggle, toggle-group, tooltip

### ⚠️ Missing Common shadcn Components

Consider adding if needed:
- `calendar` - for date pickers
- `carousel` - for product image galleries (using embla)
- `collapsible` - for expandable sections
- `context-menu` - for right-click menus
- `menubar` - for desktop navigation
- `navigation-menu` - for header nav
- `resizable` - for split panes
- `sonner` - ✅ Already using via providers

### ✅ No Custom Duplicates of shadcn

The codebase **correctly** uses `components/shared/` for:
- `modal.tsx` - wraps `Dialog` with router integration
- `field.tsx` - form field pattern (composition, not duplication)
- `spinner.tsx` - loading indicator (shadcn doesn't have one)
- `empty-state-cta.tsx` - empty state pattern (shadcn doesn't have one)

---

## 7. Platform Split Analysis (mobile/ vs desktop/)

### ✅ CORRECT: Separate Implementations

| Pattern | Mobile | Desktop | Shared |
|---------|--------|---------|--------|
| Quick View | `mobile/drawers/product-quick-view-drawer.tsx` | `desktop/product/product-quick-view-dialog.tsx` | `shared/product/quick-view/product-quick-view-content.tsx` |
| Buy Box | - | `desktop/product/desktop-buy-box-v2.tsx` | - |
| Gallery | `mobile/product/mobile-gallery-v2.tsx` | `desktop/product/desktop-gallery-v2.tsx` | - |
| Bottom Bar | `mobile/product/mobile-bottom-bar-v2.tsx` | - | - |
| Filter Modal | - | `desktop/desktop-filter-modal.tsx` | - |

The platform split is **well-implemented**:
- Mobile uses `Drawer` (vaul)
- Desktop uses `Dialog` (radix)
- Both share `ProductQuickViewContent` for consistency

### ⚠️ Misplaced Component

`components/mobile/horizontal-product-card.tsx` is imported by `components/shared/product/category-product-row.tsx`, violating the boundary:

```tsx
// In shared/product/category-product-row.tsx
import { HorizontalProductCard } from "@/components/mobile/horizontal-product-card"
```

**Fix:** Move `horizontal-product-card.tsx` to `components/shared/product/`

---

## 8. Recommended Actions

### Phase 1: Critical Duplicates (Immediate)

1. **Consolidate ProductGrid**
   - Merge features into `shared/product/product-grid.tsx`
   - Update 3 import locations
   - Delete `components/grid/`

2. **Consolidate SubcategoryCircles**
   - Enhance `category/subcategory-circles.tsx`
   - Update `mobile-home.tsx` import
   - Delete `mobile/subcategory-circles.tsx`

### Phase 2: Directory Consolidation (Short-term)

3. **Merge parallel directories into shared/**
   - `auth/` → `shared/auth/`
   - `charts/` → `shared/charts/`
   - `category/` → `shared/category/`
   - `seller/` → `shared/seller/`

4. **Fix boundary violation**
   - Move `horizontal-product-card.tsx` to `shared/product/`

### Phase 3: Cleanup (Low Priority)

5. **Consolidate narrow directories**
   - `navigation/` → `shared/`
   - `orders/` → `shared/orders/`
   - `onboarding/` → `shared/onboarding/`
   - `sections/` → `shared/sections/`
   - `pricing/` → `shared/pricing/`

---

## 9. Component Count Summary

| Directory | Files | Status |
|-----------|-------|--------|
| `components/ui/` | 34 components + 34 stories | ✅ Clean |
| `components/shared/` | ~45 components | ✅ Correct location |
| `components/layout/` | ~15 components | ✅ Correct location |
| `components/mobile/` | ~16 components | ⚠️ 1 misplaced |
| `components/desktop/` | ~10 components | ✅ Correct location |
| `components/providers/` | 10 contexts | ✅ Correct location |
| *Orphan directories* | ~15 components | ⚠️ Should consolidate |

---

## 10. Conclusion

**Overall Grade: B+**

The Treido codebase maintains good shadcn architecture discipline. The `components/ui/` layer is pure and well-customized for marketplace needs. Cross-boundary imports are correct.

**Main Issues:**
1. Two duplicate component implementations need consolidation
2. Parallel directory structures create organizational confusion
3. One boundary violation (`shared/` → `mobile/`)

**Strengths:**
1. No app logic in UI primitives
2. Proper mobile/desktop platform split with shared content
3. Comprehensive CVA variant systems for marketplace needs
4. Good use of design tokens

---

*This audit is READ-ONLY. No changes were made to the codebase.*
