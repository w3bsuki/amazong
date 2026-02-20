# Treido — Architecture Audit & Cleanup Roadmap

*Date:* 2026-02-20  
*Context:* Safe-only hardening + overengineering reduction before production launch. This doc is written for future AI sessions to quickly regain project context and execute cleanup work without re-discovering everything.

## Non‑Negotiables (Do Not Touch Without Explicit Approval)

- DB schema / migrations / RLS (`supabase/`)
- Auth/session/access control internals (`lib/auth/**`, `components/providers/auth-state-manager.tsx`)
- Payments/webhooks/billing (Stripe routes + webhook signature verification)
- Any destructive data operations

## Current Targets (from `refactor/CURRENT.md`)

- Files: `<650` (now ~936)
- LOC (source): `<85K` (now ~130K)
- `"use client"`: `<120` (now ~216)
- Tiny files `<50L`: `<100` (now ~247)
- Oversized files `>300L`: `<20` (now ~88)
- Clone %: `<1.5%` (now ~2.56%)

## High‑Signal Audit Findings (2026‑02‑20)

### 0) `/sell` route is slow (guest + auth) — wasted work + heavy client bundle

- Root cause (guest): server was fetching sell categories + payout status even when user is `null` or not a seller, inflating TTFB.
- Root cause (guest): client entry imported the huge sell form module eagerly, so guests downloaded the whole sell bundle just to see the auth gate.
- Fixes applied:
  - `app/[locale]/(sell)/sell/page.tsx`: fetch seller first; only fetch categories + payout status when `seller.is_seller === true`.
  - `app/[locale]/(sell)/sell/sell-page-client.tsx`: `next/dynamic()` import for `UnifiedSellForm` with `ssr: false` + skeleton.
  - `app/[locale]/(sell)/sell/_lib/categories.ts`: use `getCategoryHierarchy(null, 2)` (L0→L2) instead of depth‑3 tree; L3+ via `/api/categories/[id]/children`.

### 1) Repo clutter (artifacts) — Fixed (safe-only)

- No tracked `.tmp/**` artifacts found in the git index at the time of this sweep.
- `.gitignore` now ignores `.tmp/` broadly + refactor scratch outputs (`refactor-final/`, `refactor/*-audit-*`, etc.) to prevent reintroducing local cruft.
- Local-only untracked scratch docs under `refactor-final/` and `refactor/*-audit-*.md` were removed to keep the working tree clean.

### 2) Architecture violation (route-private import leak) — Resolved

- Categories pagination constant is now sourced from `app/[locale]/(main)/_lib/pagination.ts` (shared within `(main)`), avoiding cross-route `_lib` imports.
  - `app/[locale]/(main)/categories/[slug]/_lib/search-products.ts`
  - `app/[locale]/(main)/categories/[slug]/_components/category-page-dynamic-content.tsx`

### 3) UI primitives polluted with domain semantics — Resolved

- Verified: `components/ui/badge.tsx` is primitive-only (base + semantic status variants), with no marketplace-specific variants.

### 4) Duplicated realtime subscription logic — Fixed

- `hooks/use-supabase-postgres-changes.ts` is the shared lifecycle implementation.
- Extended to support an optional `onPayload` callback + optional injected Supabase client, and migrated remaining manual subscriptions:
  - `components/providers/message-context.tsx`
  - `app/[locale]/(main)/(support)/customer-service/_components/support-chat-widget.tsx`

### 5) Duplicated product Quick View click logic — Fixed

- Shared handler lives in `components/shared/product/card/use-product-card-quick-view.ts` and is used by both desktop and mobile product cards.

### 6) Script duplication (gates / scanners) — Fixed

- Tailwind token scanners use shared utilities in `scripts/lib/*` (`file-walker.mjs`, `tailwind-scan-utils.mjs`).
- `scripts/architecture-scan.mjs` now also reuses the shared walker and limits scanning to `.ts/.tsx` for faster runs.

### 7) Root script clutter (ad-hoc audits)

- Removed: `audit-sr.py`, `script.py` (ad-hoc setRequestLocale scanners).
- Added: `scripts/audit-set-request-locale.py` (single consolidated CLI script).

## Execution Plan (Safe‑Only Batches)

### Batch A — Untrack local artifacts + harden `.gitignore`

- Status: `.gitignore` hardened (includes broad `.tmp/` ignore + refactor scratch patterns).

### Batch B — De-duplicate gate scripts

- Status: `scripts/lib/*` exists; Tailwind scanners use it; `scripts/architecture-scan.mjs` reuses it.

### Batch C — Restore `components/ui` purity (badge variants)

- Status: verified clean — `components/ui/badge.tsx` is primitive-only.

### Batch D — Realtime subscribe helper

- Status: `hooks/use-supabase-postgres-changes.ts` is the shared lifecycle hook (plus payload support where needed).

### Batch E — Quick View handler extraction

- Status: `components/shared/product/card/use-product-card-quick-view.ts` in use.

### Batch F — Split `hooks/use-geo-welcome.ts`

- Status: hardened lifecycle (error guard + tighter callback deps). Full helper extraction remains optional.

### Batch G — Fix route-private import leak (defer if conflict)

- Status: resolved — shared pagination constant lives under `app/[locale]/(main)/_lib/pagination.ts`.

## Sweep Results (2026‑02‑20)

- **Loading boundaries:** pruned redundant leaf `loading.tsx` files where an ancestor already provided a meaningful skeleton (70 → 56).
- **Suspense/fallback spam:** reduced nested `Suspense` usage (86 → 17 matches) and explicit `fallback=` usage (26 → 7 matches), favoring route-segment `loading.tsx` over local fallbacks.
- **Loading UX:** removed `fallback={null}` wrappers that swallowed segment loading UI:
  - `app/[locale]/layout.tsx`
  - `app/[locale]/(business)/dashboard/layout.tsx`
  - `app/[locale]/(business)/dashboard/upgrade/page.tsx`
  - `app/[locale]/_providers/commerce-providers.tsx`
- **Pagination navigation:** `components/ui/pagination.tsx` supports `asChild`; `SearchPagination` uses locale-aware `Link` to avoid full reloads.
- **Hooks correctness:** `components/providers/wishlist-context.tsx` no longer uses conditional `useContext` (removed hooks-rule disables). Additional `react-hooks/exhaustive-deps` disables removed in key filter toolbars by using refs + correct deps.
- **Page-level fallbacks:** removed redundant page-local `Suspense` skeletons (Admin, About, Account Orders, PDP, Home, Search) and relied on the nearest meaningful route-level loading boundary.
- **Repo hygiene:** local report artifacts like `playwright-report/` and `.codex/dupes/` are ignored and treated as non-SSOT scratch outputs.

## Verification (Run Once per Batch Cluster)

Run after completing a logical batch (not after every file):

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```
