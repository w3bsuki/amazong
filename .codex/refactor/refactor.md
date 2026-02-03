# Refactor Plan — Next.js App Router Audit (50% code reduction target)

Date: 2026-02-03

## Goal (non-negotiable)

- Preserve **100% external behavior** (URLs, data, permissions, analytics, UX flows).
- Keep UI **identical or better** (no layout regressions, no missing states).
- Reduce codebase surface area by ~**50%** via **dedupe + boundary fixes + deletes** (not feature cuts).
- Follow Treido rails: Server Components by default, `next-intl` copy, Tailwind v4 tokens only, safe caching, no secrets/PII.

## Audit checklist rules

- This doc is an **audit checklist**. We mark **one** new `[x]` per chat/terminal batch.
- Each checked item must include: (1) evidence (file:line and/or command output), (2) risk notes, (3) next refactor targets.
- Avoid “big bang” refactors. One batch = one small, shippable slice.

## Tech stack audit checklist (grouped by stack)

Versions are detected from `.codex/stack.yml` and `package.json`. Checkmarks mean “audited”, not “installed”.

### Next.js 16.1.4 (App Router)

- [ ] Route map + inventory (pages/layouts/route.ts/@modal/intercepts) with counts + route-group diagram
- [ ] Layout graph audit: identify “thin wrapper” layouts safe to merge (with file:line) + acceptance checks
- [ ] Parallel + intercepting routes audit: `@modal` hoist + quick-view dedupe plan with URL + UX parity constraints
- [ ] RSC vs Client audit: top 25 “over-broad” `"use client"` candidates + split plan (server wrapper → client leaf)
- [ ] Cached-server rules audit: verify `'use cache'` functions never touch `cookies()`/`headers()` + tag/life consistency
- [ ] Route handlers audit (`app/**/route.ts`): auth gating, caching headers, error schema, safe logging, rate limiting signals
- [ ] Metadata audit: `generateMetadata`, title templates, canonical/OG, robots/sitemap (no duplicated titles)
- [ ] i18n + routing audit: `proxy.ts` + `next-intl` integration + locale-correct internal hrefs

### React 19.2.3

- [ ] Client context audit: list all global providers + shrink scope (route-private where possible)
- [ ] Hook usage audit: identify components that can become server by extracting tiny client leaves
- [ ] Suspense + streaming audit: prevent waterfalls; ensure skeletons match final layout
- [ ] Hydration mismatch audit: list top offenders and fixes (esp. drawers/portals)

### TypeScript 5.9.3

- [ ] `pnpm -s ts:gate` report reviewed; baseline plan for reducing unsafe patterns
- [ ] Server/client boundary types: ensure props are serializable; remove leaky server-only types from client
- [ ] Module boundaries audit: no route-private imports across groups; stable public APIs in `lib/*`

### Tailwind CSS 4.1.18

- [ ] Token rails audit: confirm no palette classes/gradients/arbitrary values in app UI (keep `styles:gate` green)
- [ ] Globals/theme audit: `app/globals.css` token mapping consistent; dark mode behavior stable

### shadcn/ui (Radix primitives)

- [ ] Boundary audit: `components/ui/*` stays primitive-only (no app logic, no cross-route deps)
- [ ] Variant audit: CVA usage consistent; delete duplicate “button-like” primitives if present

### next-intl 4.7.0

- [ ] Hardcoded copy audit: zero user-facing strings outside `messages/*` (except safe system strings)
- [ ] Routing audit: locale param usage consistent; no locale-less internal links

### Supabase (`@supabase/ssr 0.8.0`, `@supabase/supabase-js 2.91.0`)

- [ ] SSR client audit: `createStaticClient()` only in cached/public reads; auth-aware client only in dynamic reads
- [ ] Query audit: no `select('*')` on hot paths; select explicit fields; identify top 10 hot-path queries
- [ ] Security audit (requires human alignment for changes): RLS policy coverage for core tables + Storage policies

### Stripe 20.2.0

- [ ] Webhook audit: signature verification, idempotency, safe logging (no PII), retry behavior

### Vitest 4.0.17

- [ ] Unit test map: what protects refactor-critical utilities; add missing tests where needed

### Playwright 1.57.0

- [ ] E2E smoke map: routes/flows that must not regress during refactor; ensure stable selectors

### ESLint 9.39.2 (+ `eslint-config-next 16.1.4`)

- [ ] Lint scope audit: ensure lint doesn’t waste time scanning template/vendor folders; enforce boundaries that reduce bloat

### Storybook 10.2.0

- [ ] Component library audit: delete dead stories; ensure shared components have story coverage where valuable

### Capacitor 8.0.1

- [ ] Mobile wrapper audit: build/sync scripts, config drift, and which UI constraints exist (safe-area, viewport)

### Knip 5.82.1

- [ ] Unused code audit: delete unused exports/files safely (with gates + tests)

### jscpd 4.0.7

- [ ] Duplication audit: top duplicate clusters; convert to shared primitives/composites and delete copies

## Execution loop (how we actually get 50% smaller safely)

Each batch:
1) Pick **one** unchecked item above.
2) Produce evidence + targets.
3) If it implies a refactor, do the smallest possible delete/dedupe/boundary split.
4) Verify: `pnpm -s typecheck`, `pnpm -s lint`, `pnpm -s styles:gate` (plus targeted tests when touching routes).

---

# Phase 1 — Baseline + Next.js App Router audit (executed)

Worklog note: this section contains evidence already collected on 2026-02-03, but we did **not** mark any checklist item `[x]` yet (per the “one check per batch” rule).

## Baseline snapshot (signals)

**App Router inventory**

- Route groups under `app/[locale]/`:
  - `(account)`, `(admin)`, `(auth)`, `(business)`, `(chat)`, `(checkout)`, `(main)`, `(onboarding)`, `(plans)`, `(sell)`, plus `[username]` and `api`.
- Layout files: `13` (`app/[locale]/layout.tsx` + per-group layouts)
- Pages: `104` (`page.tsx` files)
- Route handlers: `51` (`route.ts` files; `47` under `app/api/**`)
- Parallel routes: `@modal` used in multiple places:
  - `app/[locale]/(account)/@modal/*`
  - `app/[locale]/(main)/categories/@modal/*`
  - `app/[locale]/(main)/search/@modal/*`
- Intercepting routes used for quick-view modals:
  - `app/[locale]/(main)/categories/@modal(..)[username]/[productSlug]/page.tsx`
  - `app/[locale]/(main)/search/@modal(..)[username]/[productSlug]/page.tsx`

**Code surface (TS/TSX LOC)**

- `app/`: `438` TS/TSX files, ~`69,187` LOC
- `components/`: ~`38,580` LOC
- `lib/`: ~`12,563` LOC

**Client surface**

- `"use client"` files (TS+TSX):
  - `app/`: `130` files
  - `components/`: `180` files
  - total: `310` files
- Example: a route-level provider is client (`app/[locale]/(main)/_providers/onboarding-provider.tsx:1`).

**Dynamic request API usage**

- Request APIs in layouts/pages (make routes dynamic by definition):
  - `app/[locale]/(account)/layout.tsx:7` imports `headers` from `next/headers`
  - `app/[locale]/(main)/search/page.tsx:18` imports `cookies` from `next/headers`
  - `lib/supabase/server.ts:6` imports `cookies` from `next/headers` (module contains both auth-aware and static client constructors)

## App Router audit — simplification opportunities (preserve URLs)

### 1) Layout consolidation (reduce nesting, fewer “shell” files)

There are many group-level layouts (and nested route layouts) that likely wrap the same shell primitives (header/footer/providers). Route groups do not affect URLs, so moves are safe if behavior is preserved.

Targets (evidence: layout file list):
- `app/[locale]/layout.tsx`
- `app/[locale]/(main)/layout.tsx`
- `app/[locale]/(account)/layout.tsx`
- `app/[locale]/(sell)/layout.tsx`
- `app/[locale]/(checkout)/layout.tsx`
- `app/[locale]/(auth)/layout.tsx`
- `app/[locale]/(chat)/layout.tsx`
- `app/[locale]/(admin)/admin/layout.tsx`
- `app/[locale]/(onboarding)/layout.tsx`
- `app/[locale]/(business)/dashboard/layout.tsx`
- `app/[locale]/(main)/categories/layout.tsx`
- `app/[locale]/(main)/search/layout.tsx`
- `app/[locale]/[username]/layout.tsx`

Plan (Phase 2): identify which of these are “thin wrappers” and merge them upward while keeping:
- identical markup structure
- identical providers order (important for context)
- identical streaming boundaries

### 2) Parallel route `@modal` hoisting (dedupe quick-view infra)

`@modal` appears in multiple `(main)` subtrees; this is a common bloat multiplier because it duplicates slot wiring and default UI.

Plan (Phase 2):
- Keep `@modal` scoped (do **not** hoist) — prior hoisting attempt caused cart→checkout locale 404s on client transitions.
- Deduplicate the intercepted quick-view route logic **without** changing URLs:
  - `app/[locale]/(main)/categories/@modal(..)[username]/[productSlug]/page.tsx`
  - `app/[locale]/(main)/search/@modal(..)[username]/[productSlug]/page.tsx`

### 3) Loading/error/not-found dedupe (reduce repeated boilerplate)

Signals:
- `57` `loading.tsx` files + `15` `error.tsx` files suggests heavy repetition.
- Not-found layering appears at multiple levels.

Plan (Phase 2):
- Move identical skeletons to group-level boundaries (keep per-route fallbacks only when meaningfully different).
- Reduce not-found duplication by ensuring global/locale/username not-found each has a distinct purpose (otherwise consolidate).

## Server vs Client boundary audit — shrink client surface area

### Findings

- Many route pages / composites are marked `"use client"` even when only a small leaf is interactive.
- This inflates bundle size, hydration surface, and makes refactors harder (client-only constraints bubble up).

Examples of suspiciously broad client boundaries (evidence: directive at file start):
- `app/[locale]/(account)/account-layout-content.tsx:1`
- `app/[locale]/(plans)/_components/plans-page-client.tsx:1`
- `components/layout/desktop-shell.tsx:32`

### Plan (Phase 3)

- Convert page/layout-level components back to Server Components where possible.
- Keep only leaf components client (event handlers/hooks/browser APIs).
- Prefer pattern: `Thing.server.tsx` (data + layout) → `Thing.client.tsx` (interactive bits).

## Caching / invalidation audit — preserve correctness, reduce mental overhead

### What looks good

Cached reads consistently use `'use cache'` with `cacheLife()` + `cacheTag()` in `lib/data/*` and `app/api/categories*`.

Examples:
- `lib/data/products.ts:272` + `lib/data/products.ts:273` + `lib/data/products.ts:274`
- `lib/data/profile-page.ts:93` + `lib/data/profile-page.ts:94` + `lib/data/profile-page.ts:95`
- `lib/data/categories.ts:350` + `lib/data/categories.ts:351` + `lib/data/categories.ts:352`

Invalidation exists via server actions and a revalidation endpoint:
- `app/actions/reviews.ts:139`
- `app/actions/username.ts:170`
- `app/api/revalidate/route.ts:182`

### Gaps / risks

Some tags are set but appear to have no corresponding invalidation path:
- `lib/data/product-page.ts:320` sets `product-favorites:*`
- `lib/data/product-page.ts:362` sets `product-hero-specs:*`

Plan (Phase 5):
- Centralize cache tags in a registry and enforce a “tag must have invalidation owner” rule.

---

# What “50% shorter” realistically means (method, not vibes)

This target is achievable **only** if we treat the work as three buckets:

1) **Delete**: unused routes/endpoints/components (Knip + runtime logs + tests)
2) **Deduplicate**: layouts, modals, skeletons, shared composites (jscpd + manual consolidation)
3) **De-boundary**: shrink `"use client"` surfaces (server wrapper + client leaf pattern)

## Next steps (Phase 2 start checklist)

- [ ] Run duplication + unused audits and collect top offenders:
  - `pnpm -s dupes`
  - `pnpm -s knip`
- [ ] Pick **one** route group (recommend `(main)`), and do:
  - Layout consolidation (thin wrappers → remove)
  - `@modal` hoist + dedupe quick-view intercept
  - Consolidate identical `loading.tsx` + `error.tsx` to group boundary
- [ ] Verify:
  - `pnpm -s typecheck`
  - `pnpm -s lint`
  - `pnpm -s styles:gate`
  - `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` (when route behavior touched)
