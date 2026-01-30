# UI Component Duplication Audit (Headers + Product UI)
Date: 2026-01-24

Scope (this pass):
- Headers (layout header SSOT + route/page “headers”)
- Product cards
- Product pages (full page + modal)
- Tailwind/shadcn discipline signals (styles scans + “no arbitrary values” rail)
- Static analysis: `knip` + `jscpd` (duplicate detection)

How this was produced (reproducible):
- Inventory + usage: `rg` (ripgrep)
- Unused detection: `pnpm -s knip` → `cleanup/knip-report.txt`
- Duplicate detection: `pnpm -s dupes` → `cleanup/dupes-report.txt`
- Tailwind scans: `pnpm -s styles:scan` → `cleanup/*-scan-report.txt`
- Tailwind gate: `pnpm -s styles:gate` (currently failing; see below)

---

## Snapshot metrics

High-level file counts:
- `components/`: 193 files
  - `components/ui/`: 36 files
  - `components/shared/`: 66 files
  - `components/layout/`: 22 files
- `app/`: 441 files

Header-related files (name contains `header`):
- Total: 24 files
- Under `components/layout/header/`: 15 files

Product card files (name contains `product-card`):
- Total: 9 files
  - `components/shared/product/product-card.tsx` (+ subcomponents)
  - `components/mobile/horizontal-product-card.tsx`

Product page route files:
- Total: 5 files containing `[productSlug]`
  - `app/[locale]/[username]/[productSlug]/page.tsx` (+ `layout.tsx`, `loading.tsx`, `error.tsx`)
  - `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx` (quick-view modal)

“V2” file naming (potential churn/ambiguity):
- `components/desktop/product/desktop-buy-box-v2.tsx`
- `components/desktop/product/desktop-gallery-v2.tsx`
- `components/mobile/product/mobile-bottom-bar-v2.tsx`
- `components/mobile/product/mobile-gallery-v2.tsx`
- `components/layout/sidebar/sidebar-menu-v2.tsx`

---

## Key findings

### F1) The “main header” is already centralized, but variant UX diverges (this is why `/assistant` looks “old”)

Single source-of-truth (SSOT) for the main site header:
- `components/layout/header/app-header.tsx`

Layouts that render it:
- `app/[locale]/(main)/layout.tsx`
- `app/[locale]/[username]/layout.tsx` (store + PDP routes)

How the variant is chosen today:
- `AppHeader` auto-detects variant via `detectRouteConfig()`:
  - `/` → `homepage` (inline search + category pills on mobile)
  - `/categories*` → `contextual` (back + title + subcategory circles on mobile)
  - `/{username}/{productSlug}` (unknown first segment) → `product`
  - everything else → `default` (two-row mobile header; search is under the top row)

Therefore:
- `/en/assistant` (route: `app/[locale]/(main)/assistant/page.tsx`) falls into `default`.
- Homepage falls into `homepage`.
- This explains the “why does assistant use the old header” report: it’s not a separate header component — it’s the `default` variant.

Recommendation:
- Decide the desired header matrix for “main” pages:
  - If “homepage header UX” should be the default for most pages, unify `homepage` + `default` (mobile) into one base header, with pills as an optional row.
  - If `/assistant` is a contextual experience, explicitly route it to `contextual` and set a contextual title via `HeaderProvider` (similar to PDP’s `ProductHeaderSync`).

---

### F2) “Too many headers” is partly naming: layout headers vs in-page headers vs route headers

There are three distinct “header” concepts in the repo:

1) **Layout header** (global navigation shell)
- `components/layout/header/app-header.tsx` (+ variants under `components/layout/header/mobile/*` and `components/layout/header/desktop/*`)

2) **Route headers** (intentionally contextual; not meant to match the main header)
- Checkout: `app/[locale]/(checkout)/_components/checkout-header.tsx`
- Business dashboard: `app/[locale]/(business)/_components/business-header.tsx`
- Account: `app/[locale]/(account)/account/_components/account-header.tsx`
- Admin: `components/layout/header/dashboard-header.tsx`
- Plans page uses a custom minimal header: `components/layout/header/minimal-header.tsx`

3) **In-page headers** (page-section headers, not navigation shells)
- Search results page header: `app/[locale]/(main)/search/_components/search-header.tsx`
- Inventory page header: `app/[locale]/(business)/dashboard/inventory/_components/inventory-header.tsx`
- Sell flow progress header: `app/[locale]/(sell)/_components/ui/progress-header.tsx`

Recommendation (to reduce confusion without risky UI changes):
- Naming: reserve `*Header` for actual navigation headers; rename in-page headers to `*PageHeader` / `*SectionHeader` (incrementally).
- Location: keep “main header” code in `components/layout/header/*`; keep route-private headers under `app/[locale]/(group)/.../_components/`.

---

### F3) Product card system is mostly centralized, but there are 3 entry points and jscpd reports duplication

Current “product card” files (9):
- `components/shared/product/product-card.tsx` (main)
- `components/shared/product/product-card-*.tsx` (subcomponents)
- `components/shared/product/product-card-list.tsx` (list variant)
- `components/mobile/horizontal-product-card.tsx` (mobile promoted strip)

Current usage:
- `ProductCard` is imported by 7 callers (search, categories, deals, cart, desktop home, profile, and product-feed).
- `ProductCardList` is imported by 1 caller (`components/desktop/desktop-home.tsx`).
- `HorizontalProductCard` is imported by 1 caller (`components/mobile/mobile-home.tsx`).

Duplicate detection signal:
- `pnpm -s dupes` reports a clone between:
  - `components/shared/product/product-card-list.tsx`
  - `components/shared/product/product-card.tsx`

Recommendation:
- Consolidate to a single `ProductCard` entry point with a `variant` prop (`grid` / `list` / `horizontal`) and a shared internal layout.
- After migration, delete `product-card-list.tsx` and `horizontal-product-card.tsx` if no longer needed.

---

### F4) Product pages are already modular, but demo PDP code is shipping in `app/` and breaks the Tailwind gate

Production PDP structure (good):
- Route: `app/[locale]/[username]/[productSlug]/page.tsx`
- Shared layout wrapper: `components/shared/product/product-page-layout.tsx`
- Mobile PDP: `components/mobile/product/mobile-product-page.tsx`
- Desktop PDP: `components/desktop/product/*` (gallery/buy-box/specs/quick-view)
- Search modal PDP: `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx`

Demo PDP (problematic for cleanliness + gates):
- Route: `app/[locale]/demo/product-adaptive/*`
- Tailwind palette scan flags 55 palette-class matches in:
  - `app/[locale]/demo/product-adaptive/_components/product-page-mobile.tsx`
- This causes `pnpm -s styles:gate` to fail today.

Recommendation:
- If demo routes are not required for production, delete `app/[locale]/demo/` entirely (also reduces “duplicate product page files” confusion).
- If demos are required, move them out of `app/` or re-theme them to obey rails (no palette, no arbitrary values).

---

### F5) Tooling already exists; current outputs identify concrete cleanup targets

Tailwind gate status:
- `pnpm -s styles:gate` currently fails due to palette usage in demo PDP.
- See `cleanup/palette-scan-report.txt`.

Tailwind arbitrary scan status:
- 6 bracket-arbitrary matches across 5 files.
- See `cleanup/arbitrary-scan-report.txt`.

Unused detection (Knip):
- 2 unused dependencies + 21 unused exports + 5 unused exported types.
- See `cleanup/knip-report.txt`.

Duplicate detection (jscpd):
- 315 clones found across `app/`, `components/`, `lib/` (3.61% duplicated lines).
- See `cleanup/dupes-report.txt` for the full list; focus first on the largest/most confusing clusters.

---

## Bottom line (why the repo *feels* duplicated)

- The header system is centralized, but variant UX is divergent and route selection is simplistic (so `/assistant` looks like an “old header”).
- “Header” is used as a name for multiple unrelated concepts (layout navigation vs page section headers), which makes it feel like there are many “headers”.
- Demo routes under `app/` are effectively shipping extra “versions” of product pages and are currently breaking the style gate.
- There are legitimate code clones (jscpd: 315), mostly in UI-heavy areas (filters, cards, drawers), that are worth consolidating.

---

## Next steps

Execution plan (OPUS): `UI_REFACTOR_PLAN_OPUS_2026-01-24.md`

