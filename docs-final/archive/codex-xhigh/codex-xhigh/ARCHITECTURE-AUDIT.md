# Architecture Audit — 2026-01-20

This is an implementation-focused audit: boundaries, duplication, and “where correctness is at risk”.

## Repo boundaries (rails)

- `components/ui/*`: shadcn primitives only (no app imports/hooks).
- `components/shared/*`: shared composites (cards/sections).
- `components/layout/*`: shells (headers/nav/sidebars).
- `lib/*`: pure utilities and reusable data access (no React).
- `hooks/*`: reusable React hooks.
- `app/[locale]/(group)/_*`: route-private code; do not cross-import across groups.

## Evidence (automated signals)

- `components/ui` has no `@/app` or `@/hooks` imports (boundary respected).
- Knip unused candidates: `codex-xhigh/typescript/knip-2026-01-20.log`.
- Large-file hotspots (top 20 by line count in `app/` + `components/`):
  - `app/demo/sell2/page.tsx` (1077) — demo surface
  - `app/actions/orders.ts` (863)
  - `components/shared/filters/filter-hub.tsx` (808)
  - `components/layout/sidebar/sidebar.tsx` (700)
  - `components/shared/filters/filter-modal.tsx` (688)
  - `app/actions/products.ts` (669)
  - `app/actions/username.ts` (646)
  - `app/actions/seller-feedback.ts` (596)
  - `components/layout/header/site-header-unified.tsx` (574) — also in Knip unused list
  - `components/mobile/mobile-category-browser.tsx` (517)
  - `components/desktop/desktop-filter-modal.tsx` (515)
  - `components/layout/sidebar/sidebar-menu-v2.tsx` (511)

## Findings (prioritized)

### Critical

- [ ] Server/client boundary violations remain a recurring risk: app-layer actions are imported directly by UI surfaces (see `codex-xhigh/nextjs/imports-app-actions-2026-01-20.txt`). This can accidentally pull server-only code into client bundles or break caching boundaries.

### High

- [ ] “God files” exist in both UI and server actions (700–800+ LOC). This increases regression risk (harder review, harder tests). Prefer:
  - Delete if unused (validate with Knip + route usage)
  - Otherwise split by domain and move reusable logic into `lib/*` (queries, formatting, fee calc)
- [ ] Demo surfaces are disproportionately responsible for styling drift and file count (`app/[locale]/demo/*`). Treat as deletion candidates once confirmed out-of-scope for launch.

### Medium

- [ ] Route-private code footprint is large (52 `_*/` directories inside `app/`). This is fine if kept internal, but becomes dangerous if imported cross-group. Enforce “no `@/app/.../_...` absolute imports” rule where possible.
- [ ] Duplicate/unused header and product components exist (Knip list). Choose one canonical implementation per “surface” (header, filters, product page) and delete the rest.

### Low

- [ ] Reduce repo-level decision drift by keeping SSOT:
  - Tasks/gates: `TODO.md`
  - Multi-session board: `codex-xhigh/EXECUTION-BOARD.md`
  - Lane evidence: `codex-xhigh/*/AUDIT-*.md` + `codex-xhigh/logs/*`
