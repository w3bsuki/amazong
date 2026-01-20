# Next.js Full Audit — 2026-01-20

## Evidence

- Build: `codex-xhigh/nextjs/build-2026-01-20.log` (compiled successfully)
- Lint: `codex-xhigh/nextjs/lint-2026-01-20.log` (❌ 2 errors, 614 warnings)
- `use client` matches: `codex-xhigh/nextjs/use-client-2026-01-20.txt` (37)
- Server actions imported from UI surfaces: `codex-xhigh/nextjs/imports-app-actions-2026-01-20.txt` (20)
- Origin/header redirect scan: `codex-xhigh/nextjs/origin-usage-2026-01-20.txt` (0)
- Routing stats:
  - Pages: 115
  - Layouts: 16
  - Route handlers: 51
  - Loading: 56
  - Error boundaries: 15
  - Not found: 3
  - Middleware: 1
- Route groups under `app/[locale]/`: `(account) (admin) (auth) (business) (chat) (checkout) (main) (plans) (sell) [username] @productModal demo`

## Findings (prioritized)

### Critical

- [ ] Lint errors block `pnpm -s lint`:
  - `components/mobile/drawers/product-quick-view-drawer.tsx:109:7` — React Compiler cannot preserve memoization
  - `components/mobile/drawers/product-quick-view-drawer.tsx:109:15` — same root cause
  - Fix options: remove the `useMemo` (this computation is trivial), or ensure dependencies are immutable/stable.
- [ ] `next` dependency is in a vulnerable range (<16.0.9) per `codex-xhigh/DEPENDENCIES-AUDIT.md`.

### High

- [ ] Server actions imported directly from route components and UI:
  - Evidence list: `codex-xhigh/nextjs/imports-app-actions-2026-01-20.txt`
  - Fix: ensure only Server Components/route handlers import actions directly; pass handlers down as props to Client Components or move behind an API.
- [ ] Demo routes are large and contribute to style drift:
  - `app/[locale]/demo/*` includes 15 pages; several are top offenders for Tailwind palette/arbitrary usage (see `codex-xhigh/ui/styles-scan-2026-01-20.log`).

### Medium

- [ ] 51 route handlers (`**/route.ts`) should be reviewed for auth, input validation, and caching expectations. Treat as “audit list”, not “rewrite list”.
- [ ] `use client` surface (37) is mostly shadcn primitives and error boundaries; acceptable, but re-evaluate any non-UI client components for boundary creep.
