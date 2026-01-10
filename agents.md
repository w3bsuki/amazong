# Agents Guide — Amazong Marketplace

This file is for coding agents working in this repo.

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui + lucide-react
- Supabase (Postgres + Auth + Storage)
- Stripe payments
- next-intl for i18n
- Tests: Vitest (`__tests__/`), Playwright (`e2e/`)

## Commands
```bash
pnpm dev                                          # Dev server
pnpm -s exec tsc -p tsconfig.json --noEmit        # Typecheck
pnpm test:unit                                    # Unit tests
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke    # E2E smoke
```

## Code Boundaries
- `components/ui/` — shadcn primitives only (no app hooks)
- `components/common/` — shared composites (cards, sections)
- `components/layout/` — shells (headers, nav, sidebars)
- `lib/` — pure utilities (no React, no app imports)
- `hooks/` — reusable React hooks
- `app/[locale]/(group)/_*` — route-private code (don't import across groups)

## Workflow
1. Read `TODO.md` → pick one task
2. Make changes (scope to the task)
3. Run gates: typecheck + smoke
4. Verify no regressions

## Rails (non-negotiable)
- No secrets in logs
- All user strings via next-intl (en.json + bg.json)
- No gradients, no arbitrary Tailwind values
- Prefer deleting dead code over reorganizing
- No "rewrite" PRs — small, verifiable changes only

## Detailed Docs (when needed)
- `docs/ENGINEERING.md` — stack rules, boundaries, caching, Supabase
- `docs/DESIGN.md` — UI tokens, spacing, patterns
- `docs/styling/README.md` — styling system docs (guide, patterns, refactor plan)
- `docs/PRODUCTION.md` — launch checklist
- `docs/guides/` — domain deep-dives (frontend, backend, testing)