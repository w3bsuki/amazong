# 🔬 Full Codebase Audit Plan

**Project:** amazong-marketplace  
**Date Started:** December 14, 2025  
**Status:** ✅ AUDIT COMPLETE

---

## 📋 Audit Phases

### Phase 1: Structure Export ✅
**Tool:** `tree /F /A`  
**Output:** `audit-results/structure.txt`  
**Purpose:** Get complete folder/file tree for reference

**Status:** ✅ Complete

---

### Phase 2: Unused Code Detection ✅
**Tool:** `knip`  
**Output:** `audit-results/knip-report.txt`  
**Purpose:** Find unused files, exports, and dependencies

**Status:** ✅ Complete - **92 unused files, 206 unused exports, 57 unused types found!**

---

### Phase 3: Duplicate Code Detection ✅
**Tool:** `jscpd`  
**Output:** `audit-results/jscpd-report/` (JSON)  
**Purpose:** Find copy-pasted code blocks

**Status:** ✅ Complete - **403 duplicate clones found! (6.09% duplication)**

---

### Phase 4: Circular Dependencies ✅
**Tool:** `madge --circular`  
**Output:** `audit-results/circular-deps.txt`  
**Purpose:** Find circular import issues

**Status:** ✅ Complete - **1 circular dependency found**

---

### Phase 5: Unused Dependencies ✅
**Tool:** `depcheck`  
**Output:** `audit-results/depcheck-report.txt`  
**Purpose:** Find unused npm packages

**Status:** ✅ Complete - **10 unused packages found**

---

## 📊 AUDIT SUMMARY

| Metric | Count | Action Needed |
|--------|-------|---------------|
| Total Files Analyzed | 829 | - |
| **Unused Files** | **92** | 🔴 Delete |
| **Unused Exports** | **206** | 🟡 Remove |
| **Unused Types** | **57** | 🟡 Remove |
| **Duplicate Clones** | **403** | 🔴 Consolidate |
| **Duplication Rate** | **6.09%** | Target: <3% |
| **Circular Deps** | **1** | 🟢 Easy fix |
| **Unused npm Packages** | **25** | 🔴 Uninstall |
| **Backup Files** | **4** | 🔴 Delete |

---

## 🔴 CRITICAL: Unused Files to Delete (92 files)

### Components (31 files)
- `components/analytics.tsx`
- `components/app-sidebar.tsx`
- `components/attribute-filters.tsx`
- `components/breadcrumb.tsx`
- `components/category-sidebar.tsx`
- `components/category-subheader.tsx`
- `components/data-table.tsx`
- `components/error-boundary.tsx`
- `components/header-dropdowns.tsx`
- `components/image-upload.tsx`
- `components/language-switcher.tsx`
- `components/main-nav.tsx`
- `components/mega-menu.tsx`
- `components/mobile-search-bar.tsx`
- `components/nav-documents.tsx`
- `components/product-actions.tsx`
- `components/product-form-enhanced.tsx`
- `components/product-form.tsx`
- `components/product-price.tsx`
- `components/product-row.tsx`
- `components/product-variant-selector.tsx`
- `components/promo-banner-strip.tsx`
- `components/rating-scroll-link.tsx`
- `components/section-cards.tsx`
- `components/seller-card.tsx`
- `components/sign-out-button.tsx`
- `components/sticky-add-to-cart.tsx`
- `components/sticky-checkout-button.tsx`
- `components/tabbed-product-section.tsx`
- `components/theme-provider.tsx`
- `components/upgrade-banner.tsx`

### Hooks (2 files)
- `hooks/use-business-account.ts`
- `hooks/use-header-height.ts`

### Lib (4 files)
- `lib/category-icons.tsx`
- `lib/currency.ts`
- `lib/sell-form-schema-v3.ts`
- `lib/toast-utils.ts`

### Scripts (8 files - all scripts!)
- `scripts/apply-migration.js`
- `scripts/create-user.js`
- `scripts/seed-data.ts`
- `scripts/seed.js`
- `scripts/seed.ts`
- `scripts/setup-db.ts`
- `scripts/test-supabase-connection.ts`
- `scripts/verify-product.js`

### UI Components (24 files)
- `components/ui/button-group.tsx`
- `components/ui/calendar.tsx`
- `components/ui/carousel.tsx`
- `components/ui/chat-container.tsx`
- `components/ui/code-block.tsx`
- `components/ui/collapsible.tsx`
- `components/ui/context-menu.tsx`
- `components/ui/empty.tsx`
- `components/ui/field.tsx`
- `components/ui/input-group.tsx`
- `components/ui/input-otp.tsx`
- `components/ui/item.tsx`
- `components/ui/kbd.tsx`
- `components/ui/markdown.tsx`
- `components/ui/menubar.tsx`
- `components/ui/message.tsx`
- `components/ui/prompt-input.tsx`
- `components/ui/resizable.tsx`
- `components/ui/scroll-button.tsx`
- `components/ui/searchable-filter-list.tsx`
- `components/ui/spinner.tsx`
- `components/ui/toaster.tsx`
- `components/ui/use-mobile.tsx`

### Other unused folders/files
- `components/badges/` (entire folder)
- `components/category-subheader/` (entire folder)
- `components/navigation/` (partial)
- `components/sell/schemas/` (entire folder)
- `app/actions/notifications.ts`
- `app/actions/revalidate.ts`
- `app/[locale]/(main)/sell/demo1/` (entire folder)

---

## 🔴 CRITICAL: Unused npm Dependencies (25 packages)

### Unused Dependencies (21)
```
@dnd-kit/core
@dnd-kit/modifiers
@dnd-kit/sortable
@dnd-kit/utilities
@radix-ui/react-collapsible
@radix-ui/react-context-menu
@radix-ui/react-menubar
@tanstack/react-table
@vercel/analytics
embla-carousel
embla-carousel-autoplay
embla-carousel-react
input-otp
marked
react-day-picker
react-markdown
react-resizable-panels
remark-breaks
remark-gfm
shiki
use-stick-to-bottom
```

### Unused devDependencies (4)
```
cross-env
dotenv
shadcn
supabase
```

---

## 🔴 BACKUP FILES TO DELETE

```
app/globals.css.backup
components/category-subheader.tsx.backup
components/header-dropdowns.tsx.backup
components/mega-menu.tsx.backup
```

---

## 🟡 CIRCULAR DEPENDENCY TO FIX

```
app/[locale]/(account)/account/sales/page.tsx 
  → app/[locale]/(account)/account/sales/sales-table.tsx
  → (back to page.tsx)
```

---

## 🔴 TOP DUPLICATE CODE HOTSPOTS

### Profile/Store Duplication (HIGH PRIORITY)
- `profile-client.tsx` ↔ `store-page-client.tsx` (48+ lines duplicated)

### Product Pages Duplication (HIGH PRIORITY)
- `product/[id]/page.tsx` ↔ `product/[...slug]/page.tsx` (massive duplication)

### Admin/Business Duplication
- `admin-stats-cards.tsx` ↔ `business-stats-cards.tsx`
- `admin-recent-activity.tsx` ↔ `business-recent-activity.tsx`

### Account Pages Duplication
- Multiple `account/*` pages share identical patterns
- Error pages are copy-pasted across routes

### Auth Pages Duplication
- `login/page.tsx` ↔ `sign-up/page.tsx` (significant overlap)

### API Routes Duplication
- `products/newest/route.ts` ↔ `products/promoted/route.ts`
- `payments/*.ts` routes share code

---

## 🎯 Cleanup Priorities

### Priority 1 - Quick Wins (Can do NOW)
- [ ] Delete 4 `.backup` files
- [ ] Uninstall 25 unused npm packages
- [ ] Delete unused scripts (8 files)

### Priority 2 - Dead Code Removal
- [ ] Delete 92 unused files (verify each first)
- [ ] Remove 206 unused exports
- [ ] Remove 57 unused types

### Priority 3 - Consolidation (Refactoring)
- [ ] Merge `profile-client.tsx` and `store-page-client.tsx`
- [ ] Create shared product page component
- [ ] Create shared stats-cards component for admin/business
- [ ] Create shared error boundary component
- [ ] Consolidate auth form logic

### Priority 4 - Architecture
- [ ] Fix circular dependency in sales pages
- [ ] Reorganize component folders

---

## 📈 Target Metrics After Cleanup

| Metric | Current | Target |
|--------|---------|--------|
| Unused Files | 92 | 0 |
| Duplication Rate | 6.09% | <3% |
| Unused Packages | 25 | 0 |
| Bundle Size | ? | -20% estimated |

---

## 📝 Notes

- All audit reports saved in `audit-results/` folder
- Run `pnpm dlx knip` again after cleanup to verify
- Consider adding knip to CI/CD pipeline
