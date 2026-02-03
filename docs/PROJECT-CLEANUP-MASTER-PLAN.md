# Project Cleanup Master Plan (No-Behavior-Change)

## Goal

Massively reduce repo size/complexity **without changing observable behavior** (UI, styling, copy, routes, payloads).

**Target**: ~50% less “code” (define scope below, then measure).

## Status (2026-02-03)

Already shipped cleanup commits (main branch):
- `468f8808` checkpoint before cleanup
- `a56e2966` remove confirmed unused modules (~3.2k LOC deleted)
- `5e25a5d2` centralize cached API responses (`lib/api/response-helpers.ts`)
- `ff7c9645` centralize addresses select
- `4bc07cee` dedupe plans selectors

## Non‑Negotiables / Safety

- No UI/styling changes (same Tailwind tokens/classes; same rendered structure where feasible).
- No logic changes (same route behavior, same API payloads, same actions semantics).
- No copy changes (`next-intl` keys/values must remain equivalent).
- No auth/session changes; no Supabase migrations/RLS changes; no Stripe/payment flow changes.
- Ship in **small batches** (1–3 files) with gates after every batch:
  - `pnpm -s typecheck`
  - `pnpm -s lint`
  - `pnpm -s styles:gate`
  - `pnpm -s test:unit`
  - `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

## What “50% less code” Means (Pick One)

1) **Runtime code only (recommended):** TS/TSX under `app/`, `components/`, `lib/`, `hooks/`.
2) **Whole repo:** includes docs, templates, archived skill files, editor integrations, etc.

Baseline snapshot on 2026-02-03 (tracked files):
- TS/TSX lines in `app/components/lib/hooks`: **~136,905** (`app`: ~76,591, `components`: ~43,916, `lib`: ~13,616, `hooks`: ~2,782).

Current snapshot after initial cleanup:
- TS/TSX lines in `app/components/lib/hooks`: **~134,147** (`app`: ~75,706, `components`: ~42,055, `lib`: ~13,604, `hooks`: ~2,782).

## Audit Summary (5 lanes)

### Lane A — Dead code & duplication (static “unused” scan)

- Confirmed unused TS/TSX files exist (example candidates):
  - `components/mobile/feed-control-bar.tsx`
  - `components/mobile/category-nav/contextual-double-decker-nav.tsx`
  - `components/shared/auth/social-input.tsx`
  - `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx`
- Expectation: deleting “unused files” alone is **not** enough for 50%; it’s the first safe win.

### Lane B — Next.js App Router consolidation

- Duplicate shell/layout patterns across:
  - `app/[locale]/(main)/layout.tsx`
  - `app/[locale]/[username]/layout.tsx`
- Multiple pass-through layouts that only set locale + return children:
  - `app/[locale]/(main)/cart/layout.tsx`
  - `app/[locale]/(main)/categories/[slug]/layout.tsx`
  - `app/[locale]/[username]/[productSlug]/layout.tsx`
- Duplicated response/cache logic across route handlers; consolidate into `lib/api/response-helpers.ts`.

### Lane C — shadcn/ui boundary cleanup (no UI change)

Move composites out of `components/ui/` to `components/shared/` (or route-private) while keeping markup/classes:
- `components/ui/command.tsx` (`CommandDialog`)
- `components/ui/pagination.tsx` (`PaginationPrevious/Next/Ellipsis`)
- `components/ui/breadcrumb.tsx` (`BreadcrumbSeparator/Ellipsis`)
- `components/ui/drawer.tsx` (Treido/iOS-specific behavior)
- Delete or relocate Storybook artifacts if not used: `components/ui/chart.stories.tsx`

### Lane D — Supabase/backend consolidation (selectors, DTOs, helpers)

- Centralize repeated select strings/constants and shared DTOs:
  - addresses selectors: `app/[locale]/(account)/account/addresses/**`
  - plans selectors: `app/[locale]/(account)/account/plans/**` + `lib/data/plans.ts`
  - shared wishlist DTO: `app/[locale]/(main)/wishlist/**` + `app/api/wishlist/[token]/route.ts`
- Potentially unused:
  - `lib/supabase/messages.ts`
  - `lib/types/messages.ts`

### Lane E — i18n/messages cleanup (no copy change)

- Large set of potentially unused keys across `messages/en.json` + `messages/bg.json`.
- Many duplicates by value (e.g. repeated “Close”, “All”, “Orders” strings) can be centralized to reduce key bloat.
- Must account for **dynamic key** access patterns (filters/sorts) before deleting.

## Execution Strategy (How We Actually Reach 50%)

### Phase 0 — “Lock behavior”

- Start from a clean git state.
- Record baseline metrics (TS/TSX LOC + key pages smoke).
- Run gates once to ensure a known-green baseline.

### Phase 1 — Safe deletions (low risk, high confidence)

- Delete confirmed-unused files (tooling + manual confirmation).
- Remove unused exports inside otherwise-used files.
- Delete/archive-only files in `docs/archive/**` if we agree they’re not needed.

### Phase 2 — Consolidate obvious duplicates (medium risk)

- Consolidate shared response helpers and cache header logic for route handlers.
- Merge pass-through layouts and modal-slot wrappers via shared components (keep same output).
- Centralize repeated Supabase select strings and DTO types.

### Phase 2.1 — Fast “drift killers” (recommended next)

These reduce maintenance cost immediately with low blast radius:
- App Router: move `setRequestLocale(locale)` to `app/[locale]/layout.tsx` and delete pass-through layouts that only set locale and return children (keep layouts that define parallel route slots).
- Supabase: introduce canonical `lib/supabase/selects/*` constants and replace inline select strings (categories/products/profiles).

### Phase 3 — Big-ticket de-duplication (higher risk, biggest LOC wins)

This is where 50% becomes realistic:
- Merge near-identical mobile/desktop feature components into a single component with variants (same JSX output per variant).
- Collapse multiple “page shell / container / overlay” wrappers into a single canonical primitive + thin adapters.
- Normalize filter/nav systems (category nav variants, filter modal/hub/list) into one configurable system.

### Phase 4 — i18n hygiene and drift prevention

- Remove unused keys (both locales, same batch).
- Consolidate duplicate-value keys into shared namespaces (keep identical output).
- Add/upgrade a script to prevent new unused/duplicate keys from accumulating.

## Deliverables (What “Done” Looks Like)

- [ ] LOC reduced by agreed scope (runtime-only or whole repo).
- [ ] All gates green after every batch.
- [ ] No UI/copy regressions on golden-path flows (smoke + E2E).
- [ ] Clear ownership + boundaries strengthened (`components/ui` primitives only, route-private stays route-private).
