# Full Codebase Audit (Reality Check)

Date: 2026-02-20

This is an **audit + prioritization report**. It does **not** change behavior. High‑risk areas (auth/payments/webhooks/DB) are documented but not refactored without explicit approval (per `AGENTS.md`).

---

## How this audit was done

Commands run:

- `pnpm -s architecture:scan`
- `pnpm -s knip`
- `pnpm -s dupes` (captured to `.tmp/dupes-2026-02-20.txt`)
- Local inventory scripts for LOC breakdown + “tiny module imported once” candidates

---

## What’s already strong

- **Mechanical gates exist and work**: typecheck + lint + styles gate + unit tests.
- **Styling contract is enforced** (`styles:gate`): semantic tokens only; no palette utilities, hex, arbitrary values, gradients.
- **Architecture invariants are tested** (see `__tests__/architecture-boundaries.test.ts`): route privacy, `getSession()` ban, `select('*')` ban, etc.

---

## Reality check: why “50% LOC reduction” isn’t free

This codebase is big primarily because the **product surface is big** (many routes + UIs), not because it’s full of dead code.

- **Dead code surface is currently small**: `knip` flags 1 unused file + 4 unused exports.
- **Duplicate code is limited**: `dupes` reports ~1.1% duplicated lines (135 clone blocks).

If you truly want “half the LOC”, you’ll need at least one of:

- **De-scope/removal** of real V1 features/routes, or
- A **high‑risk architecture rewrite** (not compatible with “don’t break anything”).

What *is* realistic without drama: **reduce indirection**, **tighten boundaries**, **delete dead code**, and **chip away at safe duplicates**.

---

## High‑ROI improvements (realistically achievable)

### 1) Kill dead/unused code (safe, immediate)

From `pnpm -s knip` (2026-02-20):

- Unused file:
  - `app/[locale]/(main)/search/_components/mobile-browse-mode-switch.tsx`
- Unused exports:
  - `toast` in `hooks/use-toast.ts`
  - `DesktopHomeSkeleton` in `app/[locale]/(main)/_components/desktop-home.tsx`
  - `PaginationPrevious`, `PaginationNext` in `components/ui/pagination.tsx`

These are “free” wins: delete/remove after verifying zero usage (`rg`) and run the core gate.

### 2) Reduce over‑fragmentation (safe, low churn)

The “tiny files” metric is noisy because **Next.js magic files** (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`, …) are supposed to be small.

A better signal for merging is: **a tiny module imported exactly once** → inline/merge back into its only consumer when cohesive.

Merge candidates found (<=45 LOC, exactly one importer; excludes `components/ui/*` primitives):

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

This list is intentionally conservative: it’s about **reducing “file tax”** where a split file is only acting as indirection.

### 3) Dedupe where it’s safe (and skip auth/payments/webhooks unless approved)

From `pnpm -s dupes` (2026-02-20):

- Total clones: **135**
- Duplicated lines: **1750** (~**1.1%**)

Top clone blocks by line count (annotated by risk):

- **High risk (payments/webhooks) — audit only**
  - `app/api/payments/delete/route.ts` <-> `app/api/payments/set-default/route.ts` (38L, 23L)
  - `app/api/subscriptions/webhook/route.ts` internal clones (20L, 18L)
  - `app/actions/payments.ts` internal clone (18L)
  - `app/api/connect/webhook/route.ts` <-> `app/api/subscriptions/webhook/route.ts` (14L)
- **Safe (UI/components) — worth deduping**
  - `components/shared/product/quick-view/product-quick-view-desktop-content.tsx` <-> `components/shared/product/quick-view/product-quick-view-mobile-content.tsx` (15L)
  - `components/auth/login-form-body.tsx` <-> `components/auth/sign-up-form-body.tsx` (15L)
  - `app/[locale]/_components/nav/nav-user.tsx` <-> `app/[locale]/(account)/account/_components/account-sidebar.tsx` (17L, 16L)

### 4) Lint “signal” (where refactors will actually reduce pain)

Top warning categories from `.codex_lint.txt`:

- `sonarjs/cognitive-complexity`: 28
- `no-restricted-imports`: 25
- `unicorn/consistent-function-scoping`: 22

Interpretation:

- **Complexity warnings** → split by responsibility inside large components/actions (avoid scatter‑splitting into 20 tiny files).
- **Restricted import warnings** → tighten boundaries (move shared logic to `lib/`, keep route code route‑private).
- **Function scoping warnings** → low-risk micro‑cleanup; do in batches while touching files for other reasons.

### 5) Hotspots that dominate maintenance cost (not necessarily LOC)

Top non-generated files by size (where changes are expensive):

- `components/providers/message-context.tsx` (768L)
- `components/providers/cart-context.tsx` (556L)
- `components/mobile/drawers/account-drawer.tsx` (543L)
- `app/[locale]/_components/category-browse-drawer.tsx` (599L)
- `app/[locale]/(checkout)/_components/checkout-page-layout.tsx` (569L)

These are the best candidates for “split-by-responsibility” refactors, but note: splitting often **increases file count**. The win is lower complexity + clearer ownership.

### 6) Documentation hygiene quick wins

- `README.md` references `ARCHITECTURE.md` and `docs/DOMAINS.md`, but both are missing.
- There is an existing doc-restructure proposal: `docs/PLAN-doc-architecture.md` (optional program; not required for product work).

---

## Blocked / approval-gated areas (document only)

Per `AGENTS.md` + `refactor/shared-rules.md`, stop and get explicit approval before refactoring:

- Auth/session internals (`lib/auth/**`, `components/providers/auth-state-manager.tsx`)
- Payments/webhooks (`app/actions/payments.ts`, `app/actions/boosts.ts`, `app/api/**/webhook/**`, Connect routes)
- DB schema/migrations/RLS (`supabase/migrations/**`, RLS policies)

---

## Suggested execution order (safe-first)

1. **Dead code cleanup** (knip items) → run `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`.
2. **Merge tiny imported-once modules** (the list above) in cohesive batches (per route group).
3. **Fix boundary hygiene** (`no-restricted-imports`) by moving shared logic out of `app/` and keeping route code route-private.
4. **Dedupe safe UI clones** (auth forms, quick view, nav row patterns).
5. Only after explicit approval: **payments/webhooks/actions/auth internals**.

---

## Appendix: surface breakdown (for focus, not as targets)

LOC by major area (ts/tsx/mjs/css):

- `app`: 97,498
- `components`: 18,547
- `lib`: 13,267
- `hooks`: 1,570

`app/[locale]` route group LOC (ts/tsx/mjs/css):

- `(main)`: 20,794
- `(account)`: 18,984
- `(sell)`: 9,093
- `(business)`: 8,876
- `[username]`: 6,303
- `(checkout)`: 2,683
- `(chat)`: 2,196
- `(admin)`: 3,579
- `(auth)`: 1,650
- `(onboarding)`: 1,228
- `(plans)`: 1,230

