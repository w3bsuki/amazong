# Phase 1 — Frontend UX/UI (shadcn + Tailwind v4) Comprehensive Production Pass

Purpose: make the **UI/UX consistent, accessible, localized, and predictable** across core routes without adding features or new design systems.

This phase is the “surface + consistency” phase. Anything that requires DB/schema/RLS changes belongs in Phase 2.

---

## Inputs (existing repo evidence)

Use these as your source of truth while executing:
- `STYLING.md` (Tailwind v4 + shadcn standardization rules; especially “no scale/hover effects”).
- `FRONTEND.md` (frontend readiness issues and patterns).
- `DESKTOP_UI_UX_AUDIT.md` + `MOBILE_UI_UX_AUDIT.md` (route-level problems).
- `ACCOUNT_UX_UI_IMPROVEMENT_PLAN.md` (concrete account fixes).
- `COMPONENTS.md` (components folder cleanup map).

---

## Scope

In scope:
- Consistent shadcn usage and Tailwind v4 conventions.
- Remove hardcoding in UI (strings, routes, repeated class clusters) where it causes UX drift.
- Fix missing/incorrect page metadata and visible UI inconsistencies.
- Add/standardize loading + empty states (UI-only; no new backend behaviors).
- Remove/merge obvious duplicate UI components (only when safe; validate usages).

Out of scope (Phase 2/3 instead):
- DB cleanup (test products), RLS/policies, schema changes.
- Major route re-architecture or caching strategy changes.
- New features (wishlists, moderation flows, new pages) unless a route is actually broken.

---

## Quality Gates (must stay green)

- [ ] Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] Lint: `pnpm lint`
- [ ] Manual smoke (desktop + mobile): `/`, `/[locale]/categories`, `/[locale]/search`, `/[locale]/account`, `/[locale]/sell`

---

## AI Execution Protocol (required)

When executing Phase 1, the agent MUST:

- Iterate in small loops:
  - Loop: pick 1–3 tasks → implement → typecheck/lint → quick manual smoke → proceed.
- Never delete or merge components without checking real usages first.
- For any “remove/replace” task, use repo search to prove it’s safe.
- Follow `STYLING.md`: no scale animations, no heavy shadows, avoid bold typography creep.

Suggested search patterns:
- Find hardcoded English strings on BG routes: search for common English UI phrases.
- Find missing metadata exports: search for `export const metadata` and `generateMetadata`.
- Find long Tailwind strings: search for `className=".* .* .* .* .* .*`.

---

## Work Queue (prioritized)

### P0 — Launch blockers (must do)

#### 1) Page titles + metadata completeness
- [ ] Ensure each major route has a proper localized `<title>` / metadata.
  - Targets: all `page.tsx` under `app/[locale]/` for critical routes.
  - Acceptance: browser tab titles match route (e.g., “Search | AMZN”), localized per locale.
  - Verify: run dev server; navigate; confirm titles; no console errors.

#### 2) Search page renders non-empty content
(Desktop audit reports empty `<main>` on search.)
- [ ] Fix `/[locale]/search` so results area never renders empty while loading.
  - Add `loading.tsx` for search if missing.
  - Add a visible empty state when zero results.
  - Acceptance: search shows skeleton/loading then results or empty-state (never blank main).
  - Verify: manual: `/en/search?q=test` and `/en/search?q=zzzzzzzz`.

#### 3) Language consistency (EN/BG)
(Mobile audit reports mixed language strings.)
- [ ] Remove hardcoded English UI strings where locale is BG.
  - Targets: `/sell`, tab bar labels, counters like “X products”, breadcrumbs.
  - Acceptance: for BG locale, all user-facing strings are BG (except brand names).
  - Verify: manual: `/bg/...` pages + quick grep for the removed phrases.

#### 4) Currency consistency (UI formatting)
(Audits report $, €, mixed.)
- [ ] Ensure UI uses one currency format per locale/business rule.
  - Targets: product cards, cart, checkout, deals.
  - Acceptance: currency symbol + formatting is consistent across audited pages.
  - Verify: manual: cart + checkout + product page.

#### 5) Fix obvious encoding glitch “Â©”
(Desktop audit reports footer shows Â©.)
- [ ] Identify where copyright text is produced and fix encoding.
  - Target: footer component.
  - Acceptance: correct “©” renders.
  - Verify: manual: footer on home.

---

### P1 — UX consistency (high value)

#### 6) Standardize loading states per route
- [ ] Ensure these routes have a predictable loading state:
  - Search results
  - Product page
  - Cart page
  - Categories grid/listing
- [ ] Use existing skeleton components under `components/skeletons/` or shadcn `Skeleton`.
- Acceptance: no “blank main” during data fetch; loading UI matches styling rules.

#### 7) Product card consistency across surfaces
(Mobile audit: homepage vs category cards differ.)
- [ ] Identify all product-card variants and standardize to the intended one.
  - Target: `components/product-card.tsx` and all places rendering product cards.
  - Acceptance: same spacing/typography/badges/wishlist affordance across home + categories.
  - Verify: manual: home section and a category listing.

#### 8) Fix tab bar + account mobile polish
(Concrete tasks exist already.)
- [ ] Execute `ACCOUNT_UX_UI_IMPROVEMENT_PLAN.md` tasks that still apply.
  - Targets include:
    - `app/[locale]/(account)/account-layout-content.tsx`
    - `components/account-tab-bar.tsx`
    - `components/account-stats-cards.tsx`
  - Acceptance: no active scale animation, spacing consistent, mobile stats use divider list.

#### 9) Empty states consistency
- [ ] Standardize empty states for:
  - Search (0 results)
  - Cart (empty)
  - Orders/wishlist/messages (where applicable)
- Acceptance: each empty state has: title, short help text, single primary CTA.

#### 10) Accessibility basics pass
- [ ] Ensure forms have labels, error text is associated, and password inputs have `autocomplete`.
- [ ] Ensure icon-only buttons have accessible names (aria-label).
- Acceptance: keyboard navigation works for header, search, tab bar, dialogs.

---

### P2 — Cleanup + debloat (safe only)

#### 11) Components folder cleanup (safe deletions)
(From `COMPONENTS.md`.)
- [ ] Delete known backup files (only those with `.backup`).
- [ ] Remove empty `components/header/` folder.
- Acceptance: no imports reference removed paths; typecheck green.

#### 12) Consolidate obvious duplicates (only with proof)
- [ ] Investigate duplicates (do not guess):
  - `components/breadcrumb.tsx` vs `components/app-breadcrumb.tsx`
  - `components/mega-menu.tsx` vs `components/navigation/mega-menu.tsx`
  - `components/category-subheader.tsx` vs `components/category-subheader/` implementation
- Rule: consolidate only if one is unused or clearly legacy.
- Acceptance: one canonical component remains; imports updated; UI unchanged.

#### 13) Dependency audit follow-ups (UI only)
(depcheck flags some unused deps; treat as “suspected”.)
- [ ] For each flagged “unused dependency”, prove usage with repo search.
- [ ] If truly unused AND UI-related, remove dependency and lockfile updates.
- Acceptance: build passes and route smoke still clean.

---

## Verification Checklist (end-of-phase)

- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `pnpm lint`
- [ ] `pnpm build`
- [ ] Manual smoke (desktop + mobile widths):
  - [ ] Home renders and scrolls
  - [ ] Categories list renders
  - [ ] Search never shows blank main
  - [ ] Product page images render (or show a clean fallback)
  - [ ] Cart and checkout currency is consistent
  - [ ] Account UI matches `STYLING.md` rules

---

## Deliverables (what must be true)

- [ ] Search page is no longer a blank screen during load.
- [ ] Titles/metadata exist for critical routes.
- [ ] No mixed-language UI on BG routes.
- [ ] Product cards and loading/empty states are consistent.
- [ ] Phase quality gates are green.
