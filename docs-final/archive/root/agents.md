# Agents Guide — Amazong Marketplace

This file is the entry point for coding agents working in this repo.

## Quick Start

**For spec-driven development (recommended):**
1. `.specs/QUICKSTART.md` — 2-minute guide
2. `.specs/ROADMAP.md` — Master production launch plan
3. `.specs/queue/INDEX.md` — Pick next spec to work on

**For ad-hoc tasks:**
1. `RULES.md` (what docs to read for your task)
2. `docs/README.md` (canonical docs index)
3. `TODO.md` (legacy task list)

## Agent Collaboration (Claude ↔ Codex)

See `.specs/AGENT-PROTOCOL.md` for full details.

| Agent | Role | Triggers |
|-------|------|----------|
| **Claude** | Implement, fix, create | `TREIDO:`, `FRONTEND:`, `BACKEND:`, `SPEC:` |
| **Codex** | Verify, review, orchestrate | `/verify`, `/gates`, `/review` |

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
- `app/[locale]/(group)/_*` — route-private code (don't import across groups)

## Workflow (Spec-Driven)

1. `COORD:` — Pick next spec from `.specs/queue/`
2. Move spec to `.specs/active/`
3. Work through `tasks.md` using role prefixes
4. Update `context.md` with session notes
5. Codex verifies with `/verify`
6. Move to `.specs/completed/`

## Workflow (Legacy)

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

## .specs System

- `.specs/README.md` — System overview
- `.specs/AGENT-PROTOCOL.md` — Claude ↔ Codex collaboration
- `.specs/ROADMAP.md` — Production launch master plan
- `.specs/templates/` — Spec templates
- `.specs/queue/` — Specs ready to start
- `.specs/active/` — In-progress (max 3)
- `.specs/completed/` — Done specs
- `.specs/blocked/` — Waiting on external
