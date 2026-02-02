# File Organization Audit Report

> **Generated:** 2026-02-02  
> **Scope:** Next.js marketplace codebase (Treido)  
> **Type:** READ-ONLY audit  
> **Phase:** 3 (Structural Refactor)

---

## Executive Summary

| Category | Issues Found | Severity |
|----------|-------------|----------|
| Misplaced Files | 2 | 🟡 Medium |
| Boundary Violations | 2 | 🔴 High |
| Architecture Drift | 10 | 🟡 Medium |
| Empty/Orphaned Dirs | 5 | 🟢 Low |
| Duplicate Folders | 2 | 🟡 Medium |
| Index Sprawl | 0 | ✅ Clear |

**Risk Assessment:** Most issues are architectural drift (feature folders outside documented structure). One high-priority boundary violation in `lib/category-icons.tsx`.

---

## 1. Boundary Violations (High Priority)

### 1.1 React in `lib/` — VIOLATION

| Property | Value |
|----------|-------|
| File | [lib/category-icons.tsx](../lib/category-icons.tsx) |
| Issue | Contains React imports and JSX in utility folder |
| Rule Violated | `lib/` must be pure utilities (no React, no app imports) |
| Imports React From | `react`, `@phosphor-icons/react/ssr` |
| Consumers | 8 components across `components/` |

**Evidence:**
```tsx
import * as React from "react"
// ... returns React.ReactNode
```

**Suggested Location:** `components/shared/category/category-icons.tsx` or create `hooks/use-category-icon.ts`

### 1.2 Binary Asset in Components

| Property | Value |
|----------|-------|
| File | [components/auth/image.png](../components/auth/image.png) |
| Issue | Binary image stored in component folder |
| Suggested Location | `public/images/auth/` or `public/auth/` |

---

## 2. Architecture Drift — Feature Folders

The documented architecture specifies:
- `components/ui/` — shadcn primitives only
- `components/shared/` — Shared composites
- `components/layout/` — Header, footer, sidebars
- `components/mobile/` — Mobile-specific
- `components/desktop/` — Desktop-specific

**Found:** Multiple feature-specific folders at `components/` root level:

| Current Location | Contents | Suggested Location | Status |
|-----------------|----------|-------------------|--------|
| `components/auth/` | 3 files (auth-card, submit-button, image.png) | `components/shared/auth/` | 🟡 Move |
| `components/seller/` | 2 files (follow-seller-button.*) | `components/shared/seller/` | 🟡 Move |
| `components/orders/` | 1 file (order-status-badge.tsx) | `components/shared/orders/` | 🟡 Move |
| `components/onboarding/` | 2 files (account-type-card, interest-chip) | `components/shared/onboarding/` | 🟡 Move |
| `components/category/` | 3 files (breadcrumb, circles, tabs) | `components/shared/category/` ✓ exists | 🟡 Merge |
| `components/charts/` | 1 file (chart-area-interactive.tsx) | `components/shared/charts/` | 🟡 Move |
| `components/sections/` | 1 file (start-selling-banner.tsx) | `components/shared/sections/` | 🟡 Move |
| `components/support/` | 2 files (customer-service-chat, support-widget) | `components/shared/support/` | 🟡 Move |
| `components/pricing/` | 1 file (plan-card.tsx) | `components/shared/pricing/` | 🟡 Move |
| `components/grid/` | 2 files (product-grid.*, index.ts) | `components/shared/grid/` | 🟡 Move |
| `components/dropdowns/` | 5 files (account, messages, etc.) | `components/shared/dropdowns/` | 🟡 Move |

**Impact:** 23 files across 11 directories need relocation to match architecture spec.

---

## 3. Empty/Orphaned Directories

| Path | Status | Recommendation |
|------|--------|----------------|
| `app/[locale]/(main)/demo2/` | Empty | 🗑 Delete |
| `app/[locale]/(main)/demo3/` | Empty | 🗑 Delete |
| `app/[locale]/(main)/demo4/` | Empty | 🗑 Delete |
| `app/[locale]/(main)/demo/` | Has `/codex/page.tsx` only | 🔍 Review purpose |
| `docs/archive/refactor-2026-02-02/` | Archived | ✅ Moved to `docs/archive/` |

---

## 4. Duplicate/Overlapping Folders

### 4.1 Validation Split

| Folder | Contents |
|--------|----------|
| `lib/validation/` | `orders.ts` |
| `lib/validations/` | `auth.ts`, `password-strength.ts` |

**Recommendation:** Consolidate into single `lib/validations/` with subfolders if needed.

### 4.2 Design System Split

| Folder | Contents |
|--------|----------|
| `components/design-system2/` | `theme.css` only |
| `components/shared/design-system/` | `design-system-client.tsx` only |

**Recommendation:** Merge into `components/shared/design-system/` or consolidate with `app/` styles.

---

## 5. Documentation Folders Assessment

| Folder | Purpose | Recommendation |
|--------|---------|----------------|
| `docs/` | Primary documentation | ✅ Keep (SSOT) |
| `docs/archive/uirefactor/` | UI/UX planning snapshot | ✅ Archived under `docs/archive/` |
| `docs/archive/refactor-2026-02-02/` | Refactor planning snapshot | ✅ Archived under `docs/archive/` |
| `cleanup/` | Audit report outputs | ✅ Keep (gitignored) |

---

## 6. Gitignore Verification

| Item | Status |
|------|--------|
| `storybook-static/` | ✅ Correctly ignored |
| `cleanup/` | ✅ Outputs ignored (`cleanup/*.json`, `cleanup/*.txt`) |
| `.next/` | ✅ Ignored |
| `node_modules/` | ✅ Ignored |

---

## 7. Index File Assessment

| Location | Purpose | Risk |
|----------|---------|------|
| `components/grid/index.ts` | Exports ProductGrid | ✅ Clean |
| `components/dropdowns/index.ts` | Exports 4 dropdowns | ✅ Clean |
| `components/layout/header/mobile/index.ts` | Exports 5 headers | ✅ Clean |
| `components/layout/header/desktop/index.ts` | Exports 2 headers | ✅ Clean |
| `components/mobile/drawers/index.ts` | Exports 5 drawers | ✅ Clean |
| `components/mobile/category-nav/index.ts` | Exports ~15 nav components | ⚠️ Large barrel |
| `app/[locale]/(sell)/_components/index.ts` | Route barrel | ✅ Route-scoped |

**No circular dependency risks detected.**

---

## 8. Findings Table (Full)

| Path | Issue Type | Current | Suggested | Phase |
|------|-----------|---------|-----------|-------|
| `lib/category-icons.tsx` | Boundary violation | lib/ | components/shared/category/ | 3 |
| `components/auth/image.png` | Misplaced asset | components/ | public/images/auth/ | 3 |
| `components/auth/` | Architecture drift | components/ | components/shared/auth/ | 3 |
| `components/seller/` | Architecture drift | components/ | components/shared/seller/ | 3 |
| `components/orders/` | Architecture drift | components/ | components/shared/orders/ | 3 |
| `components/onboarding/` | Architecture drift | components/ | components/shared/onboarding/ | 3 |
| `components/category/` | Duplicate location | components/ | Merge to components/shared/category/ | 3 |
| `components/charts/` | Architecture drift | components/ | components/shared/charts/ | 3 |
| `components/sections/` | Architecture drift | components/ | components/shared/sections/ | 3 |
| `components/support/` | Architecture drift | components/ | components/shared/support/ | 3 |
| `components/pricing/` | Architecture drift | components/ | components/shared/pricing/ | 3 |
| `components/grid/` | Architecture drift | components/ | components/shared/grid/ | 3 |
| `components/dropdowns/` | Architecture drift | components/ | components/shared/dropdowns/ | 3 |
| `lib/validation/` | Duplicate folder | lib/ | Merge to lib/validations/ | 3 |
| `lib/validations/` | Duplicate folder | lib/ | Keep (target) | 3 |
| `components/design-system2/` | Sparse folder | components/ | Merge to shared/design-system/ | 3 |
| `app/.../demo2/` | Empty dir | Route | Delete | 3 |
| `app/.../demo3/` | Empty dir | Route | Delete | 3 |
| `app/.../demo4/` | Empty dir | Route | Delete | 3 |
| `docs/archive/uirefactor/` | Archived docs | Root | Keep as archive | 3 |
| `docs/archive/refactor-2026-02-02/` | Archived docs | Root | Keep as archive | 3 |

---

## 9. Recommended Action Order

### Phase 3.1: Critical Fixes (Do First)
1. Relocate `lib/category-icons.tsx` → `components/shared/category/category-icons.tsx`
2. Update 8 component imports
3. Move `components/auth/image.png` → `public/images/auth/`

### Phase 3.2: Architecture Alignment
1. Create consolidated folder moves:
   - `components/auth/` → `components/shared/auth/`
   - `components/seller/` → `components/shared/seller/`
   - ... (11 total folder moves)
2. Update all import paths via find-and-replace

### Phase 3.3: Cleanup
1. Delete empty demo directories
2. Consolidate validation folders
3. ✅ Move legacy planning folders to `docs/archive/`

---

## 10. Cross-Route Import Check

**Status:** ✅ No violations found

All `_components/`, `_lib/`, `_actions/` imports stay within their route groups. Relative imports like `../../_lib/pagination` are used correctly within `(main)` group.

---

## Appendix: Directory Structure Summary

```
components/
├── ui/                 ✅ shadcn only (35 files)
├── shared/            ✅ Composites (40+ files)
├── layout/            ✅ Shells (correct)
├── mobile/            ✅ Mobile-specific
├── desktop/           ✅ Desktop-specific  
├── providers/         ✅ Context providers
├── storybook/         ✅ Storybook utils
├── auth/              🟡 Should be in shared/
├── seller/            🟡 Should be in shared/
├── orders/            🟡 Should be in shared/
├── onboarding/        🟡 Should be in shared/
├── category/          🟡 Should merge to shared/
├── charts/            🟡 Should be in shared/
├── sections/          🟡 Should be in shared/
├── support/           🟡 Should be in shared/
├── pricing/           🟡 Should be in shared/
├── grid/              🟡 Should be in shared/
├── dropdowns/         🟡 Should be in shared/
└── design-system2/    🟡 Sparse, consolidate
```

---

*End of Audit Report*
