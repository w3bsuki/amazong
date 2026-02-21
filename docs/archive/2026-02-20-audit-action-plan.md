# Audit Action Plan (Safe-First)

Date: 2026-02-20

This is a **doable, low-risk** plan derived from `docs/audit/2026-02-20-full-codebase-audit.md`. It prioritizes cleanup and structural simplification **without touching auth/payments/webhooks/DB** unless you explicitly approve it.

---

## Non‑negotiables (guardrails)

- Pixel + behavior parity.
- Route URLs unchanged.
- No DB schema/migrations/RLS changes.
- Stop + ask before auth/session or Stripe/webhook refactors.

Verification gate after each batch:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Phase 0 — Establish baseline confidence (once)

- Run the verification gate above.
- Capture current scans:
  - `pnpm -s architecture:scan`
  - `pnpm -s dupes`

---

## Phase 1 — Dead code + unused exports (grep-verified)

After `rg` confirms zero usage:

- Delete:
  - `app/[locale]/(main)/search/_components/mobile-browse-mode-switch.tsx`
- Remove unused exports:
  - `toast` from `hooks/use-toast.ts`
  - `DesktopHomeSkeleton` from `app/[locale]/(main)/_components/desktop-home.tsx`
  - `PaginationPrevious` and `PaginationNext` from `components/ui/pagination.tsx`

Run the verification gate.

---

## Phase 2 — Merge “tiny imported-once” modules

Goal: reduce “file tax” (single-purpose split files that only add indirection).

Rule of thumb:

- If a module is <=45 LOC and imported once → inline/merge into the importer.
- Exceptions: shared types used across route groups, schemas used by tests, `components/ui/*` primitives.

Candidate list (from the audit):

- `lib/supabase/selects/categories.ts` <= `lib/data/category-attributes.ts`
- `app/[locale]/(sell)/sell/_lib/categories.ts` <= `app/[locale]/(sell)/sell/page.tsx`
- `components/shared/loading/simple-page-loading.tsx` <= `app/[locale]/(main)/loading.tsx`
- `lib/filters/pending-attributes.ts` <= `app/[locale]/(main)/_components/filters/shared/state/use-pending-filters.ts`
- `app/[locale]/(checkout)/_components/checkout-footer.tsx` <= `app/[locale]/(checkout)/layout.tsx`
- `app/[locale]/(main)/_components/mobile-home/use-home-discovery-feed/types.ts` <= `app/[locale]/(main)/_components/mobile-home/use-home-discovery-feed.ts`
- `app/[locale]/(account)/account/_components/account-chart-lazy.tsx` <= `app/[locale]/(account)/account/page.tsx`
- `components/layout/header/desktop/minimal-header.tsx` <= `app/[locale]/_components/app-header.tsx`
- `components/layout/header/mobile/minimal-header.tsx` <= `app/[locale]/_components/app-header.tsx`
- `app/[locale]/(admin)/_components/dashboard-header.tsx` <= `app/[locale]/(admin)/admin/layout.tsx`
- `app/[locale]/[username]/[productSlug]/_components/pdp/product-description.tsx` <= `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-product-single-scroll.tsx`
- `app/[locale]/(sell)/_components/steps/step-details.tsx` <= `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx`
- `app/[locale]/(sell)/_components/steps/step-what.tsx` <= `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx`
- `app/[locale]/(sell)/_components/steps/step-pricing.tsx` <= `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx`
- `app/[locale]/(account)/account/sales/_components/sales-chart-lazy.tsx` <= `app/[locale]/(account)/account/sales/page.tsx`
- `app/[locale]/(main)/categories/_components/categories-header-sync.tsx` <= `app/[locale]/(main)/categories/page.tsx`
- `app/[locale]/locale-providers.tsx` <= `app/[locale]/layout.tsx`
- `lib/ai/tools/assistant-tools.ts` <= `app/api/assistant/chat/route.ts`
- `app/[locale]/(main)/(support)/customer-service/_components/customer-service-chat.tsx` <= `app/[locale]/(main)/(support)/customer-service/page.tsx`
- `app/[locale]/(main)/_components/desktop/use-view-mode.ts` <= `app/[locale]/(main)/_components/desktop/use-desktop-home-controller.ts`
- `app/[locale]/[username]/[productSlug]/_components/pdp/view-tracker.tsx` <= `app/[locale]/[username]/[productSlug]/_components/product-page-layout.tsx`
- `lib/types/badges.ts` <= `app/[locale]/(account)/account/_components/use-badges.ts`
- `components/shared/product/card/use-product-card-quick-view.ts` <= `components/shared/product/card/product-card-frame.tsx`
- `components/layout/sidebar/sidebar-menu-nav-link.tsx` <= `components/layout/sidebar/sidebar-menu-body.tsx`
- `app/[locale]/(main)/_components/mobile-home/use-home-city-storage.ts` <= `app/[locale]/(main)/_components/mobile-home.tsx`
- `app/[locale]/(sell)/_components/steps/step-review.tsx` <= `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx`
- `app/[locale]/(auth)/_components/sign-up-form.tsx` <= `app/[locale]/(auth)/auth/sign-up/page.tsx`
- `app/[locale]/(sell)/_components/steps/step-category.tsx` <= `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx`
- `lib/ai/schemas/sell-autofill.ts` <= `app/api/assistant/sell-autofill/route.ts`
- `app/[locale]/(main)/_components/filters/filter-hub/filter-hub-list-view.tsx` <= `app/[locale]/(main)/_components/filters/filter-hub.tsx`
- `app/[locale]/(onboarding)/onboarding/_components/interest-chip.tsx` <= `app/[locale]/(onboarding)/onboarding/interests/interests-page-client.tsx`
- `app/[locale]/_components/storefront-shell.tsx` <= `app/[locale]/_components/storefront-layout.tsx`
- `app/[locale]/(main)/_components/mobile-home/mobile-home-product-card.tsx` <= `app/[locale]/(main)/_components/mobile-home/mobile-home-feed.tsx`
- `app/[locale]/_components/nav/nav-secondary.tsx` <= `app/[locale]/(admin)/_components/admin-sidebar.tsx`
- `components/shared/product/card/use-product-card-surface-props.ts` <= `components/shared/product/card/product-card-frame.tsx`
- `app/[locale]/(auth)/_components/login-form.tsx` <= `app/[locale]/(auth)/auth/login/page.tsx`
- `app/[locale]/(main)/search/_lib/search-page-metadata.ts` <= `app/[locale]/(main)/search/page.tsx`
- `app/[locale]/[username]/[productSlug]/_components/pdp/delivery-options.tsx` <= `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-product-single-scroll.tsx`
- `app/[locale]/(sell)/performance-measure-guard.tsx` <= `app/[locale]/(sell)/layout.tsx`
- `components/shared/account-menu-items.tsx` <= `components/dropdowns/account-dropdown.tsx`

Run the verification gate.

---

## Phase 3 — Boundary hygiene (`no-restricted-imports`)

Goal: stop cross-layer coupling and simplify refactors.

Approach:

- If a route page imports from `@/app/actions/*`, choose one:
  - Move the action to the route’s private `app/[locale]/(group)/_actions/` when it’s route-specific.
  - Move reusable logic into `lib/` and keep the action thin.
- Keep `lib/` React-free (pure utilities/data).

Run the verification gate.

---

## Phase 4 — Dedupe “safe” clones

Focus on duplicates that are **UI-only** and have clear parity:

- Quick view desktop/mobile content (`components/shared/product/quick-view/*`)
- Auth form bodies/fields (`components/auth/*`)
- “Nav user row” pattern (`app/[locale]/_components/nav/nav-user.tsx` vs `app/[locale]/(account)/account/_components/account-sidebar.tsx`)

Skip payment/webhook duplicates unless explicitly approved.

Run the verification gate.

---

## Approval‑gated backlog (do not start without explicit greenlight)

- Auth/session internals (`lib/auth/**`, `components/providers/auth-state-manager.tsx`)
- Stripe/webhooks/payment actions (`app/actions/payments.ts`, `app/actions/boosts.ts`, `app/api/**/webhook/**`)
- DB schema/migrations/RLS (`supabase/migrations/**`)
