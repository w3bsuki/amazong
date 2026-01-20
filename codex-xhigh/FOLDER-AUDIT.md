# Folder Audit — 2026-01-20

Scope: workspace structure and “where the bloat lives”. This is evidence-backed and excludes build artifacts and dependencies (`node_modules/`, `.next/`, `docs-site/node_modules/`, `docs-site/.next/`).

## Snapshot (repo-wide)

- Top-level file counts (non-artifacts, non-deps):
  - `app/`: 465
  - `components/`: 230
  - `docs/`: 90
  - `codex-xhigh/`: 69
  - `supabase/`: 61
  - `lib/`: 54
  - `public/`: 39
  - `docs-site/`: 35
  - `__tests__/`: 23
  - `e2e/`: 21
  - `scripts/`: 15
  - `hooks/`: 12

## `app/` (Next.js App Router)

- Route groups under `app/[locale]/`:
  - `(account)`, `(admin)`, `(auth)`, `(business)`, `(chat)`, `(checkout)`, `(main)`, `(plans)`, `(sell)`, `[username]`, `@productModal`, `demo`
- File counts in `app/`:
  - Pages: 115 (`**/page.tsx`)
  - Layouts: 16 (`**/layout.tsx`)
  - Route handlers: 51 (`**/route.ts`)
  - Loading: 56 (`**/loading.tsx`)
  - Error boundaries: 15 (`**/error.tsx`)
  - Not found: 3 (`**/not-found.tsx`)
  - Middleware: 1 (`middleware.ts`)
- Demo surface area:
  - `app/[locale]/demo/`: 15 pages, 25 files total

## `components/`

- `components/ui/` exists and is shadcn primitives (see shadcn/tailwind audits).
- Knip indicates many unused/duplicate UI surfaces (esp. desktop/product/filter and header variants). See `codex-xhigh/typescript/knip-2026-01-20.log` for the candidate list.

## `lib/` + `hooks/`

- `lib/` is the intended place for pure utilities/data access (SSOT goal per `codex-xhigh/frontend/structure.md`).
- `hooks/` is relatively small (12 files), likely not the main bloat driver.

## `supabase/`

- Canonical DB source-of-truth: `supabase/migrations/*`.
- Production hardening and drift tracking is in `codex-xhigh/supabase/*`.

## `docs/`, `codex-xhigh/`, `docs-site/`

- `docs/`: canonical documentation.
- `codex-xhigh/`: execution playbook + lane audits + logs (operational).
- `docs-site/`: separate Next.js docs app; used by root scripts (`pnpm docs`, `pnpm docs:install`). Treat as out-of-scope for ship unless you explicitly commit to maintaining it.

## Findings (prioritized)

### Critical

- [ ] Dependencies/build artifacts must not be treated as “repo structure” to reorganize. Use `pnpm -s clean:artifacts` to clear generated folders instead of manual deletions.

### High

- [ ] Demo routes (`app/[locale]/demo/*`) are a major source of Tailwind violations and file count. Decide: keep as internal demos or delete post-ship.
- [ ] Knip unused files list (49) is concentrated in duplicated UI surfaces; delete only after verifying route usage.

### Medium

- [ ] Large single files exist in both `app/actions/*` and UI surfaces (see `codex-xhigh/ARCHITECTURE-AUDIT.md`). Split only when it improves correctness/testability; prefer deletion over refactor for unused/demo.
