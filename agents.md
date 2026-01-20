# Agents Guide — Amazong Marketplace

This file is the entry point for coding agents working in this repo.

Start with:
- `RULES.md` (what docs to read for your task)
- `docs/README.md` (canonical docs index)

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
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke    # E2E smoke (reuse dev server)
```

## Code boundaries (import rules)

- `components/ui/` — shadcn primitives only (no app hooks)
- `components/shared/` — shared composites (cards, product/search/filter UI, fields)
- `components/layout/` — shells (headers, nav, sidebars, footer)
- `components/providers/` — thin providers/contexts
- `lib/` — pure utilities (no React, no app imports)
- `hooks/` — reusable React hooks
- `app/[locale]/(group)/_*` — route-private code (don’t import across groups)

## Workflow

1. Read `RULES.md` → open the relevant canonical doc(s)
2. Read `TODO.md` → pick one task
3. Make changes (scope to the task)
4. Run gates (typecheck + smoke)
5. Verify no regressions

## Rails (non-negotiable)

- No secrets in logs
- All user strings via next-intl (`messages/en.json` + `messages/bg.json`)
- No gradients; no arbitrary Tailwind values unless unavoidable
- Prefer deleting dead code over reorganizing
- No rewrites — small, verifiable changes only

## Canonical docs (use these, not random markdown)

- `docs/ENGINEERING.md`
- `docs/DESIGN.md`
- `docs/FEATURES.md`
- `docs/FRONTEND.md`
- `docs/BACKEND.md`
- `docs/TESTING.md`
- `docs/PRODUCTION.md`
- `docs/PRODUCT.md`
