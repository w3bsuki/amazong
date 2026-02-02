# Parallel Audit: Tailwind v4 + shadcn Boundaries

**Date:** 2026-02-02  
**Agents:** spec-tailwind, spec-shadcn (parallel execution)  
**Status:** MERGED

---

## TW4 Audit Summary

| Severity | Count | Status |
|----------|-------|--------|
| High | 1 | Requires immediate fix |
| Medium | 24 | Batch execution |
| Low | 4 | UI primitive cleanup |
| **Total** | **29** | |

### High Severity (Hardcoded Mono)

| ID | File:Line | Issue | Fix |
|----|-----------|-------|-----|
| TW4-001 | `components/mobile/product/mobile-gallery-v2.tsx:192` | `border-white` | Replace with `border-background` |

### Medium Severity (Opacity Hacks) — Batch 1: shared/product/

| ID | File:Line | Issue | Fix |
|----|-----------|-------|-----|
| TW4-002 | `components/shared/product/meta-row.tsx:65` | `text-muted-foreground/70` | Use `text-muted-foreground` |
| TW4-003 | `components/shared/product/specifications-list.tsx:31` | `border-border/50`, `divide-border/50` | Use `border-border` |
| TW4-004 | `components/shared/product/similar-items-grid.tsx:37` | `border-border/30` | Use `border-border` |
| TW4-005 | `components/shared/product/similar-items-grid.tsx:77` | `bg-background/80` | Use `bg-surface-overlay` or `bg-background` |
| TW4-016 | `components/shared/product/product-card-price.tsx:100` | `text-muted-foreground/70` | Use `text-muted-foreground` |
| TW4-017 | `components/shared/product/product-card-wishlist-button.tsx:81` | `bg-background/90` | Use `bg-background` |
| TW4-018 | `components/shared/product/product-feed.tsx:104` | `bg-background/60` | Use `bg-background` with overlay |
| TW4-019 | `components/shared/product/product-feed.tsx:106` | `border-muted-foreground/30` | Define token |
| TW4-020 | `components/shared/product/write-review-dialog.tsx:163` | `text-muted-foreground/30`, `/50` | Define tokens |

### Medium Severity (Opacity Hacks) — Batch 2: shared/filters/

| ID | File:Line | Issue | Fix |
|----|-----------|-------|-----|
| TW4-006 | `components/shared/filters/filter-modal.tsx:424` | `divide-border/30` | Use `divide-border` |
| TW4-007 | `components/shared/filters/filter-modal.tsx:619` | `hover:bg-destructive/10` | Define `bg-destructive-subtle` |
| TW4-008 | `components/shared/filters/filter-hub.tsx:553` | `text-muted-foreground/60` | Use `text-muted-foreground` |
| TW4-009 | `components/shared/filters/filter-hub.tsx:692` | `hover:bg-destructive/10` | Define `bg-destructive-subtle` |
| TW4-010 | `components/shared/filters/filter-chips.tsx:253` | `bg-foreground/10`, `bg-destructive-foreground/20` | Define tokens |

### Medium Severity (Opacity Hacks) — Batch 3: shared/search + seller/

| ID | File:Line | Issue | Fix |
|----|-----------|-------|-----|
| TW4-011 | `components/shared/search/search-filters.tsx:212` | `text-sidebar-foreground/70` | Define token |
| TW4-012 | `components/shared/search/search-filters.tsx:323` | `hover:bg-sidebar-accent/50` | Define token |
| TW4-013 | `components/shared/seller/seller-payout-setup.tsx:139` | `shadow-primary/20` | Define shadow token |
| TW4-014 | `components/shared/seller/seller-payout-setup.tsx:173` | `bg-destructive/10` | Define `bg-destructive-subtle` |
| TW4-015 | `components/shared/search/mobile-search-overlay.tsx:275` | `text-muted-foreground/60` | Use `text-muted-foreground` |

### Medium Severity (Opacity Hacks) — Batch 4: app/ routes

| ID | File:Line | Issue | Fix |
|----|-----------|-------|-----|
| TW4-021 | `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx:460` | `bg-destructive/10`, `border-destructive/20` | Define `bg-destructive-subtle` |
| TW4-022 | `app/[locale]/(main)/wishlist/_components/wishlist-page-client.tsx:233` | `bg-background/90` | Use `bg-background` |
| TW4-023 | `app/[locale]/(main)/search/_components/product-route-modal.tsx:44` | `bg-background/90` | Use `bg-background` |
| TW4-024 | `app/[locale]/(main)/sellers/_components/top-sellers-hero.tsx:20` | Multiple `/20`, `/50`, `/80` opacity hacks | Define tokens |
| TW4-025 | `app/[locale]/[username]/[productSlug]/loading.tsx:58` | `border-border/50`, `/30` | Use `border-border` |

### Low Severity (UI Primitives)

| ID | File:Line | Issue | Fix |
|----|-----------|-------|-----|
| TW4-026 | `components/ui/tabs.tsx:39` | `border-border/50` | Use `border-border` |
| TW4-027 | `components/ui/toast.tsx:88` | `text-foreground/50` | Define token |
| TW4-028 | `components/ui/switch.tsx:16` | `ring-ring/50` | Define token |
| TW4-029 | `components/ui/slider.tsx:60` | `ring-ring/50` | Define token |

---

## SHADCN Audit Summary

| Category | Count |
|----------|-------|
| Primitives purity violations | 0 ✅ |
| Boundary violations (shared→mobile) | 2 |
| Duplicate implementations | 2 |
| **Total** | **4** |

### Boundary Violations

| ID | File:Line | Issue | Fix |
|----|-----------|-------|-----|
| SHADCN-001 | `components/shared/product/category-product-row.tsx:5` | Imports `@/components/mobile/horizontal-product-card` | Move to `components/shared/` |
| SHADCN-002 | `components/shared/product/product-page-layout.tsx:55` | Imports `@/components/mobile/product/mobile-product-single-scroll` | Refactor to conditional render |

### Duplicate Components

| ID | Location 1 | Location 2 | Fix |
|----|------------|------------|-----|
| SHADCN-003 | `components/grid/product-grid.tsx` | `components/shared/product/product-grid.tsx` | Consolidate to shared/ |
| SHADCN-004 | `components/mobile/subcategory-circles.tsx` | `components/category/subcategory-circles.tsx` | Consolidate |

---

## Token Gaps Identified

Need to define in `app/globals.css`:

```css
/* Destructive subtle backgrounds (for hover states) */
--color-destructive-subtle: oklch(0.95 0.025 25);
--color-destructive-subtle-hover: oklch(0.92 0.035 25);

/* Overlay surfaces (for modals, popovers) */
--color-surface-overlay: oklch(0.99 0 0 / 0.9);

/* Subdued borders (for dividers, separators) */
--color-border-subtle: oklch(0.92 0 0);
```

---

## Execution Plan

### Lane A: treido-ui (Visual/Tokens)
- TW4-001 (high): Fix `border-white`
- TW4-002 to TW4-005: Batch 1 fixes
- TW4-026 to TW4-029: UI primitive fixes
- Define missing tokens in `globals.css`

### Lane B: treido-frontend (Boundaries/Structure)
- SHADCN-001, SHADCN-002: Fix boundary violations
- SHADCN-003, SHADCN-004: Consolidate duplicates

---

## Acceptance Checks

- [ ] `pnpm -s typecheck`
- [ ] `pnpm -s lint`
- [ ] `pnpm -s styles:gate`
- [ ] No `border-white` in codebase
- [ ] No `/\d+` opacity hacks in token classes
- [ ] No `@/components/mobile` imports in `components/shared/`
