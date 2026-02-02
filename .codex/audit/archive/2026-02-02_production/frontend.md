# Frontend Audit Report

> **Date**: 2026-02-02  
> **Auditor**: treido-frontend + spec-nextjs  
> **Scope**: Next.js 16 patterns, Route organization, Components, i18n, Navigation, Performance

---

## Executive Summary

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Next.js 16 Patterns | 0 | 2 | 1 | 0 |
| Route Organization | 0 | 0 | 1 | 1 |
| Component Boundaries | 0 | 0 | 0 | 0 |
| Error Handling | 0 | 1 | 2 | 0 |
| i18n Completeness | 0 | 4 | 2 | 0 |
| Navigation | 0 | 3 | 0 | 0 |
| Performance | 0 | 2 | 1 | 0 |
| **Total** | **0** | **12** | **7** | **1** |

**Overall Grade**: ⚠️ **Production Ready with High-Priority Fixes**

---

## Positive Findings ✅

1. **shadcn boundaries respected**: `components/ui/` is clean
2. **Route-private _components/**: Properly used across route groups
3. **Error boundaries exist**: Root + key routes have error.tsx
4. **Loading states comprehensive**: 57 loading.tsx files found
5. **generateStaticParams widely used**: 20+ routes pre-render params
6. **Server actions use Zod**: Profile, orders, subscriptions validated
7. **Most navigation uses i18n/routing**: Only 3 files use raw `next/link`

---

## High Priority Issues

### FE-001: `cookies()` usage prevents caching

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Files** | `app/[locale]/(main)/todays-deals/page.tsx#L36`, `app/[locale]/(main)/search/page.tsx#L83` |
| **Impact** | Routes cannot be statically generated or cached |
| **Fix** | Move cookie reading to client component or middleware |
| **Phase** | 3 |

---

### FE-002: Unnecessary `connection()` in upgrade page

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Files** | `app/[locale]/(business)/dashboard/upgrade/page.tsx#L167` |
| **Impact** | Forces dynamic rendering unnecessarily |
| **Fix** | Remove `connection()` — page can be static |
| **Phase** | 3 |

---

### FE-006: Missing error boundaries in business dashboard

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Files** | `(business)/dashboard/products/`, `orders/`, `analytics/`, `settings/`, `customers/` |
| **Impact** | Errors bubble to layout-level handler |
| **Fix** | Add error.tsx to each sub-route |
| **Phase** | 2 |

---

### FE-009–012: Hardcoded inline translations (4 files)

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Files** | Onboarding pages (5), upgrade page, plans-modal, post-signup-modal |
| **Pattern** | `const translations = {en: {...}, bg: {...}}` inline |
| **Fix** | Move to `messages/*.json`, use `useTranslations()` |
| **Phase** | 2 |

---

### FE-015–017: Wrong Link import (3 files)

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Files** | `similar-items-grid.tsx`, `design-system-client.tsx`, `promoted-section.tsx` |
| **Pattern** | `import Link from "next/link"` instead of `@/i18n/routing` |
| **Impact** | Links don't include locale prefix |
| **Fix** | Change to `import { Link } from "@/i18n/routing"` |
| **Phase** | 2 |

---

### FE-018: Using `<img>` instead of `next/image`

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Files** | `similar-items-grid.tsx`, `seller-profile-drawer.tsx`, `step-details.tsx` |
| **Impact** | Missing image optimization, larger bundle |
| **Fix** | Replace with `next/image` Image component |
| **Phase** | 3 |

---

## Medium Priority Issues

### FE-003: Client-side page.tsx in onboarding

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Files** | All 5 onboarding pages use `"use client"` |
| **Fix** | Extract interactive parts to `_components/` |
| **Phase** | 4 |

---

### FE-004: Cross-route-group import

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Files** | `app/[locale]/(account)/@modal/(.)account/plans/upgrade/page.tsx#L5` |
| **Fix** | Move `UpgradeContent` to `components/shared/` |
| **Phase** | 4 |

---

### FE-007: Missing error boundaries in admin routes

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Files** | `(admin)/admin/users/`, `orders/`, `products/`, `sellers/` |
| **Fix** | Add error.tsx files |
| **Phase** | 3 |

---

### FE-008: Missing not-found pages for dynamic routes

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Files** | `(business)/dashboard/products/[productId]/` and similar |
| **Fix** | Add not-found.tsx for 404 handling |
| **Phase** | 4 |

---

### FE-019: Missing generateStaticParams on popular routes

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Files** | `todays-deals/page.tsx`, `search/page.tsx` |
| **Fix** | Pre-render popular search terms/paths |
| **Phase** | 4 |

---

## Low Priority Issues

### FE-005: Nested route groups inherit layouts (not an issue)

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Files** | `(legal)/`, `(support)/` under `(main)/` |
| **Status** | Acceptable — inheritance is correct |
| **Phase** | N/A |

---

### FE-020: Large design-system-client component

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Files** | `design-system-client.tsx` (~983 lines) |
| **Fix** | Split or lazy-load if used in production |
| **Phase** | 5 |

---

## Summary by Phase

### Phase 2 — Critical Path (8 items)
- FE-006: Add error boundaries to business dashboard routes
- FE-009–012: Move inline translations to message files (8 files)
- FE-015–017: Fix navigation Links to use `@/i18n/routing`

### Phase 3 — High Priority (5 items)
- FE-001: Address cookies() caching
- FE-002: Remove unnecessary connection()
- FE-007: Add error boundaries to admin routes
- FE-013–014: Fix hardcoded strings in sell orders
- FE-018: Replace `<img>` with `next/image`

### Phase 4 — Medium Priority (5 items)
- FE-003: Refactor onboarding pages
- FE-004: Fix cross-route-group import
- FE-008: Add not-found pages
- FE-019: Add generateStaticParams

### Phase 5 — Polish (1 item)
- FE-020: Split large components

---

## Effort Estimates

| Phase | Items | Est. Hours |
|-------|-------|------------|
| 2 | 8 | 6-8h |
| 3 | 5 | 4-6h |
| 4 | 5 | 4-6h |
| 5 | 1 | 2h |
| **Total** | **19** | **16-22h** |

---

*Audit complete — 2026-02-02*
