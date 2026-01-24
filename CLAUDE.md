# CLAUDE.md — Agent Instructions

> **This file is read on every prompt.** Keep it concise and actionable.

## Project

**Treido** — A modern marketplace (Next.js 16 + Supabase + Stripe). Think Vinted meets StockX.

## Workflow (Issues → Tasks → Verify)

```
1. Check ISSUES.md    → Is there an open issue for this work?
2. Check TASKS.md     → Are there active tasks? Pick one or add new.
3. Implement          → Small batch, 1-3 files max.
4. Verify             → Run gates (below). Fix any failures.
5. Update             → Mark task done. Update REQUIREMENTS.md if feature is "locked".
```

**Codex verifies. Claude implements.** Don't skip verification.

## Gates (Run After Every Change)

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit   # Typecheck (required)
pnpm test:unit                                # Unit tests (if touched)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke  # E2E smoke (if UI/flow touched)
```

## Rails (Non-Negotiable)

- **No secrets/PII in logs** — ever.
- **All UI strings via next-intl** — `messages/en.json` + `messages/bg.json`.
- **No gradients** — solid surfaces + subtle borders only.
- **No arbitrary Tailwind** — use semantic tokens from `globals.css`.
- **Small batches** — no rewrites, no redesigns.

## What Doc to Read

| Task Type | Read First |
|-----------|------------|
| UI/styling | `DESIGN.md` |
| Routes/data/caching | `ARCHITECTURE.md` |
| Supabase/Stripe/backend | `ARCHITECTURE.md` → Backend section |
| Find a route/action/DB table | `FEATURES.md` |
| Testing/debugging | `TESTING.md` |
| Deployment/go-live | `PRODUCTION.md` |
| Scope/roadmap questions | `PRODUCT.md` |
| Launch checklist | `REQUIREMENTS.md` |

## Code Boundaries

```
components/ui/       → shadcn primitives ONLY (no app logic)
components/shared/   → shared composites (cards, fields, filters)
components/layout/   → shells (header, nav, sidebar, footer)
hooks/               → reusable React hooks
lib/                 → pure utilities (no React)
app/[locale]/(group)/_components/  → route-private UI
app/[locale]/(group)/_actions/     → route-private actions
app/actions/         → shared server actions
```

**Rule**: Don't import route-private code across groups.

## Stack Quick Reference

- **Framework**: Next.js 16 (App Router, Cache Components)
- **DB**: Supabase (Postgres + RLS + Auth + Storage)
- **Payments**: Stripe (server-side only)
- **Styling**: Tailwind v4 + shadcn/ui
- **i18n**: next-intl (`@/i18n/routing` for Link/useRouter)

## Caching (Next.js 16)

- Use `'use cache'` + `cacheLife('<profile>')` + `cacheTag('<tag>')`.
- Never read `cookies()`/`headers()` inside cached functions.
- Invalidate with `revalidateTag(tag, profile)`.
- Profiles: `categories`, `products`, `deals`, `user`.

## Supabase Clients

| Use Case | Client |
|----------|--------|
| Server Components / Actions | `createClient()` |
| Cached/public reads | `createStaticClient()` |
| Route handlers | `createRouteHandlerClient()` |
| Admin (bypass RLS) | `createAdminClient()` |
| Client Components | `createBrowserClient()` |

## Common Commands

```bash
pnpm dev                    # Dev server
pnpm build                  # Production build
pnpm lint                   # ESLint
pnpm test:unit              # Vitest
pnpm test:e2e               # Playwright full
pnpm test:e2e:smoke         # Playwright smoke only
```

## Canonical Docs (Root)

| Doc | Purpose |
|-----|---------|
| `WORKFLOW.md` | Process loop |
| `ISSUES.md` | Issue registry |
| `TASKS.md` | Active task list |
| `REQUIREMENTS.md` | Launch feature checklist |
| `ARCHITECTURE.md` | Stack, boundaries, caching |
| `DESIGN.md` | UI tokens, patterns, anti-patterns |
| `TESTING.md` | Gates, debugging |
| `FEATURES.md` | Route/action/DB/test map |
| `PRODUCTION.md` | Deploy checklist |
| `PRODUCT.md` | Scope, roadmap |

**Legacy docs**: `docs-final/archive/` (reference only, don't update).

## Before You Start Any Task

1. **Read this file** (you just did).
2. **Check TASKS.md** for active work.
3. **Read the relevant doc** from the table above.
4. **Keep scope small** — if it touches >3 files, break it up.
5. **Run gates** after every meaningful change.
