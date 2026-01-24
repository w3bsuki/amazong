# UI Refactor + Cleanup Plan (OPUS) — ISSUE-0003
Date: 2026-01-24

Purpose:
- Provide a safe, step-by-step refactor plan to remove “duplicate” UI implementations (headers/cards/pages) without breaking production behavior.

Non-negotiable rails (from `CLAUDE.md` / `WORKFLOW.md`):
- No secrets/PII in logs.
- All user-facing strings via `next-intl` (`messages/en.json` + `messages/bg.json`).
- No gradients; no arbitrary Tailwind values unless unavoidable.
- Small, verifiable batches (no rewrites / no redesigns).
- Run gates after every batch:
  - `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (when UI/flows are touched)

Reference audit:
- `UI_COMPONENT_AUDIT_2026-01-24.md`
- Reports:
  - `cleanup/knip-report.txt`
  - `cleanup/dupes-report.txt`
  - `cleanup/palette-scan-report.txt`
  - `cleanup/arbitrary-scan-report.txt`

---

## Phase 0 — Baseline + safety

- [ ] (ISSUE-0003) Ensure git safety: create a branch and commit/stash current state before large moves.
- [ ] (ISSUE-0003) Capture baseline metrics (commit the reports if you keep them tracked):
  - `pnpm -s styles:scan`
  - `pnpm -s knip`
  - `pnpm -s dupes`
- [ ] (ISSUE-0003) Write down “golden routes” to manually verify after header/card changes:
  - `/` (homepage)
  - `/search`
  - `/categories`
  - `/{username}` (store)
  - `/{username}/{productSlug}` (PDP)
  - `/assistant`
  - `/cart`

Acceptance:
- [ ] Baseline reports exist and are linkable.

---

## Phase 1 — Unblock Tailwind gate (delete or quarantine demo routes)

Why first:
- `pnpm -s styles:gate` currently fails due to Tailwind palette usage in demo PDP code under `app/`.

Tasks:
- [ ] (ISSUE-0003) Delete `app/[locale]/demo/` entirely if it is not required for production.
- [ ] (ISSUE-0003) If demo must remain, move it out of `app/` (so it doesn’t ship/routes don’t exist) OR fully re-theme it to follow rails.

Verify:
- [ ] `pnpm -s styles:gate` (should now pass, or at least move to the next offender)
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`

---

## Phase 2 — Remove Tailwind bracket-arbitrary classes in production UI

Target files (from `cleanup/arbitrary-scan-report.txt`):
- `components/shared/search/mobile-search-overlay.tsx`
- `components/shared/search/search-ai-chat.tsx`

Tasks:
- [ ] (ISSUE-0003) Replace `z-[...]` usage with a token/class solution:
  - Option A: adjust stacking (`AppHeader` z-index vs overlay z-index) so `z-50` is sufficient.
  - Option B: introduce a semantic z-index token/class (preferred if repeated).
- [ ] (ISSUE-0003) Replace layout percent-based `max-w-[...]` with a semantic utility class:
  - Add a single-purpose utility in `app/utilities.css` (e.g., `.chat-bubble { max-width: 85%; }`) and use that class.

Verify:
- [ ] `pnpm -s styles:gate`
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (overlay + header interactions)

---

## Phase 3 — Header standardization (make “main header” consistent across main routes)

### 3.1 Decide the header matrix (one page of truth)

- [ ] (ISSUE-0003) Create a route → header variant matrix and lock decisions:
  - Homepage `/` → `homepage` (keep pills row)
  - Categories `/categories*` → `contextual`
  - PDP `/{username}/{productSlug}` → `product`
  - Assistant `/assistant` → **contextual** (recommended: back + title, no search bar row)
  - Everything else under `(main)` → decide between:
    - “homepage-like” header (inline search), OR
    - current “default” header (search in second row)

Acceptance:
- [ ] There is an explicit “what header do we want on which routes” table (commit it somewhere canonical: either `TASKS.md` under ISSUE-0003 or a short section in `UI_COMPONENT_AUDIT_2026-01-24.md`).

### 3.2 Fix `/assistant` header mismatch

- [ ] (ISSUE-0003) Update `components/layout/header/app-header.tsx` route detection:
  - Map `/assistant` to `contextual` (or another chosen variant).
- [ ] (ISSUE-0003) Add a client sync component (pattern like `ProductHeaderSync`) to set:
  - contextual title (translated)
  - back href (likely `/` or `/search`)
  - optional back handler (optional)

Verify:
- [ ] `/assistant` shows the intended header on mobile + desktop.
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

### 3.3 Reduce duplication between homepage and default mobile headers

Goal:
- Remove “two different main headers” perception by unifying shared parts.

Tasks:
- [ ] (ISSUE-0003) Extract shared “top row” into a single component (hamburger + logo + search trigger + actions).
- [ ] (ISSUE-0003) Make pills row optional (homepage only).
- [ ] (ISSUE-0003) Delete the redundant header file(s) after migration.

Verify:
- [ ] `/` (homepage) still shows pills + correct interactions.
- [ ] non-home `(main)` routes still show a consistent main header UX.
- [ ] Header drawers + search overlay still work.
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

---

## Phase 4 — Product cards: one component, variants, no “list card” duplication

Why:
- `ProductCard` is the de-facto reusable card, but `ProductCardList` and `HorizontalProductCard` create duplication/confusion.
- jscpd reports clones between `product-card.tsx` and `product-card-list.tsx`.

Tasks:
- [ ] (ISSUE-0003) Define `ProductCard` variants:
  - `grid` (current default)
  - `list` (current `ProductCardList`)
  - `horizontal` (current `HorizontalProductCard`)
- [ ] (ISSUE-0003) Implement variants via a single API:
  - Preferred: `cva` (class-variance-authority) with variant classes + shared subcomponents.
- [ ] (ISSUE-0003) Migrate usage sites:
  - `components/desktop/desktop-home.tsx` (list)
  - `components/mobile/mobile-home.tsx` (horizontal)
- [ ] (ISSUE-0003) Delete `components/shared/product/product-card-list.tsx` and `components/mobile/horizontal-product-card.tsx` after migration (only when unused).

Verify:
- [ ] Home (mobile + desktop), search results, category browse still render correct cards.
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

---

## Phase 5 — Naming cleanup (remove “v2” and “unified” suffixes where they are now the only version)

Goal:
- Reduce “we have multiple versions” perception when only one file remains.

Candidates:
- `components/desktop/product/desktop-buy-box-v2.tsx`
- `components/desktop/product/desktop-gallery-v2.tsx`
- `components/mobile/product/mobile-bottom-bar-v2.tsx`
- `components/mobile/product/mobile-gallery-v2.tsx`
- `components/layout/sidebar/sidebar-menu-v2.tsx`

Tasks:
- [ ] (ISSUE-0003) Confirm there is no V1 in active use (or it’s deleted).
- [ ] (ISSUE-0003) Rename the file to the canonical name and update imports.
- [ ] (ISSUE-0003) Keep changes small: one rename per batch.

Verify:
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (for PDP/UI renames)

---

## Phase 6 — Make `knip` clean (remove unused deps/exports/types)

From `cleanup/knip-report.txt`:
- Unused deps: `@ai-sdk/gateway`, `@radix-ui/react-toggle`
- Unused exports/types in:
  - `i18n/routing.ts`
  - `components/layout/sidebar/sidebar.tsx`
  - `components/ui/*`
  - `lib/ai/schemas/*`

Tasks:
- [ ] (ISSUE-0003) Remove unused deps (verify no runtime import or conditional use first).
- [ ] (ISSUE-0003) Remove unused exports/types in small batches (1 file per batch).

Verify:
- [ ] `pnpm -s knip` has no findings (or intentional ignores documented in `knip.json`)
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`

---

## Phase 7 — Targeted duplicate-hotspot consolidation (jscpd)

Goal:
- Reduce real duplication (not just file count) in the most confusing clusters.

How:
- Pick 1 cluster at a time from `cleanup/dupes-report.txt`.
- Extract the duplicated logic/UI into a shared helper/component in the correct boundary (`lib/` or `components/shared/`).
- Re-run `pnpm -s dupes` and confirm the clone disappears.

Initial recommended targets (highest confusion/payoff):
- Filters cluster (`components/shared/filters/*`)
- Product card cluster (`components/shared/product/*`)
- Drawer cluster (`components/mobile/drawers/*` vs `components/layout/header/cart/*`)

Verify:
- [ ] `pnpm -s dupes` shows lower clone count and/or lower duplicated lines.
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

---

## Acceptance criteria (ISSUE-0003)

- [ ] `pnpm -s styles:gate` passes.
- [ ] `pnpm -s knip` passes (or intentional ignores are documented).
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit` passes.
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` passes.
- [ ] “Main header” is consistent across main routes and `/assistant` uses an intentional contextual header.
- [ ] Product card API is consolidated into a single component with variants; no “unified/v2” naming for active components.

