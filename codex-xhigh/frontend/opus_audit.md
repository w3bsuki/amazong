# Opus Audit — Frontend Checklist

Comprehensive audit checklist organized by domain. Each section tracks specific issues with evidence.

---

## 1. Component Architecture

### UI Primitives (`components/ui/`)
- [x] No app imports (verified via grep — boundary respected)
- [x] 38 shadcn primitives installed
- [ ] Audit: Some primitives may be unused (accordion, hover-card, etc.)

### Shared Components (`components/shared/`)
- [ ] **Filters**: 14 files with overlapping logic
  - `filter-hub.tsx` (808 LOC) — main implementation
  - `filter-modal.tsx` (688 LOC) — secondary implementation
  - `desktop-filter-sidebar.tsx` — unused per Knip
  - `mobile-filters.tsx` — unused per Knip
  - `control-bar.tsx` — unused per Knip
  - `quick-filter-chips.tsx` — unused per Knip
  - `view-mode-toggle.tsx` — unused per Knip
- [ ] **Product**: 34 files, 11 with overlapping purpose
  - `product-card.tsx` — canonical
  - `product-gallery-hybrid.tsx` — unused per Knip
  - `product-buy-box.tsx` — unused per Knip
  - Several condition/badge components duplicated
- [ ] **Wishlist**: 1 folder (verify usage)
- [ ] **Search**: 1 folder (verify consistency with desktop-search.tsx)

### Layout Components (`components/layout/`)
- [ ] **Header variants**: 7+ variants across mobile/desktop
  - `app-header.tsx` — main adaptive header
  - `dashboard-header.tsx` — dashboard specific
  - `minimal-header.tsx` — checkout/auth flows
  - `site-header-unified.tsx` — **UNUSED per Knip**
  - `header/desktop/`: 3 variants
  - `header/mobile/`: 5 variants
- [ ] **Sidebar**: 2 implementations
  - `sidebar.tsx` (700 LOC) — large file
  - `sidebar-menu-v2.tsx` (511 LOC) — V2 variant
- [ ] **Footer**: 1 implementation (clean)

### Mobile Components (`components/mobile/`)
- [ ] 17 files total
- [ ] **Product subfolder**: 11 files, ALL unused per Knip
  - `mobile-bottom-bar.tsx`
  - `mobile-buyer-protection-badge.tsx`
  - `mobile-description-section.tsx`
  - `mobile-details-section.tsx`
  - `mobile-gallery-olx.tsx`
  - `mobile-hero-specs.tsx`
  - `mobile-price-block.tsx`
  - `mobile-price-location-block.tsx`
  - `mobile-quick-specs.tsx`
  - `mobile-seller-card.tsx`
  - `mobile-sticky-bar-enhanced.tsx`
  - `mobile-trust-block.tsx`
  - `mobile-urgency-banner.tsx`
- [ ] Active mobile components:
  - `mobile-category-browser.tsx` (517 LOC)
  - `mobile-home.tsx`
  - `mobile-menu-sheet.tsx`
  - `mobile-tab-bar.tsx`

### Desktop Components (`components/desktop/`)
- [ ] 13 files total, 6 unused per Knip
  - **Unused**: `desktop-category-nav.tsx`, `desktop-category-rail.tsx`, `desktop-filter-tabs.tsx`, `desktop-hero-cta.tsx`, `hero-search.tsx`, `marketplace-hero.tsx`
  - **Active**: `desktop-home.tsx`, `desktop-search.tsx`, `desktop-filter-modal.tsx` (515 LOC), `filters-sidebar.tsx`, `feed-toolbar.tsx`, `category-sidebar.tsx`

---

## 2. Data Layer

### Server Actions (`app/actions/`)
- [ ] **Large files** (regression risk):
  - `orders.ts` (863 LOC) — order lifecycle
  - `products.ts` (669 LOC) — product CRUD
  - `username.ts` (646 LOC) — username/profile
  - `seller-feedback.ts` (596 LOC) — seller feedback
- [ ] Potential splits:
  - `orders.ts` → `orders/create.ts`, `orders/status.ts`, `orders/queries.ts`
  - `products.ts` → `products/create.ts`, `products/update.ts`, `products/queries.ts`

### Data Access (`lib/data/`)
- [x] 5 query modules (clean separation)
  - `categories.ts`
  - `product-page.ts`
  - `product-reviews.ts`
  - `products.ts`
  - `profile-page.ts`
- [ ] Check for duplicated queries in server actions

### Supabase Client (`lib/supabase/`)
- [x] 6 files — clean structure
- [x] Server/static/admin clients properly separated
- [ ] Verify all routes use correct client type

---

## 3. Hooks

### Reusable Hooks (`hooks/`)
- [x] 12 hooks — appropriate count
- [ ] Audit unused:
  - `use-badges.ts` — verify usage
  - `use-category-counts.ts` — verify usage
  - `use-filter-count.ts` — verify usage
  - `use-view-mode.ts` — verify usage

---

## 4. Route Organization

### Route Groups (`app/[locale]/`)
- [x] 9 route groups properly isolated:
  - `(main)` — homepage, search, product pages
  - `(sell)` — sell flow
  - `(account)` — user account
  - `(checkout)` — checkout flow
  - `(auth)` — authentication
  - `(chat)` — messaging
  - `(business)` — business dashboard
  - `(plans)` — subscription plans
  - `(admin)` — admin panel

### Private Code (`_*` folders)
- [x] Route-private code properly prefixed
- [ ] Verify no cross-group imports of `_components/`, `_actions/`, `_lib/`

### Demo Surfaces (`app/demo/`, `app/[locale]/demo/`)
- [ ] **32+ demo pages** — major bloat source
  - `app/demo/` — 8 files
  - `app/[locale]/demo/` — 16+ subfolders
  - `sell2/page.tsx` (1077 LOC) — largest demo file
- [ ] Decision needed: delete vs. keep for internal testing

---

## 5. Styling Compliance

### Token Usage
- [ ] Audit arbitrary values (`[42px]`, `[13px]`)
- [ ] Audit hardcoded colors (`#hex`, `rgb()`)
- [ ] Verify semantic token adoption

### Design System
- [x] `globals.css` defines semantic tokens
- [ ] All components should use:
  - `bg-background`, `bg-card`, `bg-muted`
  - `text-foreground`, `text-muted-foreground`
  - `border-border`
  - Semantic status colors (`success`, `warning`, `error`, `info`)

---

## 6. i18n Compliance

### Translation Coverage
- [ ] Verify no hardcoded strings in:
  - `components/shared/`
  - `components/layout/`
  - `components/mobile/`
  - `components/desktop/`
- [ ] All user-facing text via `next-intl`

---

## 7. Providers

### Context Providers (`components/providers/`)
- [x] 10 providers — clean count
- [ ] Audit for unused providers:
  - `currency-context.tsx` — has unused export per Knip
  - `drawer-context.tsx` — verify usage pattern
  - `message-context.tsx` — verify usage pattern

---

## Priority Matrix

| Priority | Domain | Issue | Impact |
|----------|--------|-------|--------|
| P0 | mobile/product/ | 11 unused files | Bloat |
| P0 | shared/filters/ | 5 unused files | Bloat |
| P0 | desktop/ | 6 unused files | Bloat |
| P1 | layout/header/ | Variant explosion | Maintenance |
| P1 | actions/ | God files | Regression risk |
| P2 | demo/ | 32+ demo files | Styling violations |
| P2 | shared/product/ | Duplicate components | Confusion |
| P3 | hooks/ | Verify unused | Minor bloat |

---

## Evidence Links

- Knip report: `codex-xhigh/typescript/knip-2026-01-20.log`
- Architecture audit: `codex-xhigh/ARCHITECTURE-AUDIT.md`
- Folder audit: `codex-xhigh/FOLDER-AUDIT.md`
- Design system: `docs/DESIGN.md`
- Engineering rules: `docs/ENGINEERING.md`
