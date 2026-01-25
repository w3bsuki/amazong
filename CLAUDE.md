# CLAUDE.md — Agent Instructions

> **Read this file first on every prompt.**

## Project

**Treido** — Bulgarian marketplace (eBay/Vinted meets StockX). Next.js 16 + Supabase + Stripe.

---

## Core Docs (Read These)

| Doc | When to Read |
|-----|--------------|
| **[PRD.md](PRD.md)** | What we're building, scope, roadmap |
| **[FEATURES.md](FEATURES.md)** | Feature status (✅/🚧/⬜), what's implemented |
| **[TASKS.md](TASKS.md)** | Current sprint tasks |
| **[ISSUES.md](ISSUES.md)** | Bug/issue registry |

## Reference Docs

| Doc | When to Read |
|-----|--------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, boundaries, caching, Supabase, Stripe |
| [DESIGN.md](DESIGN.md) | UI tokens, patterns, anti-patterns |
| [TESTING.md](TESTING.md) | Gates, debugging |
| [PRODUCTION.md](PRODUCTION.md) | Deployment, go-live |
| [REQUIREMENTS.md](REQUIREMENTS.md) | Detailed launch requirements |
| [WORKFLOW.md](WORKFLOW.md) | Dev process loop |

---

## Workflow

```
1. Read PRD.md        → Understand what we're building
2. Check FEATURES.md  → See what's implemented (✅) vs pending (⬜)
3. Check TASKS.md     → Pick a task or add new
4. Implement          → Small batch, 1-3 files max
5. Verify             → Run gates (below)
6. Update             → Mark task done, update FEATURES.md if feature ships
```

---

## Gates (Run After Every Change)

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit   # Typecheck (required)
pnpm test:unit                                # Unit tests (if touched)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke  # E2E smoke (if UI touched)
```

---

## Rails (Non-Negotiable)

- **No secrets/PII in logs**
- **All UI strings via next-intl** — `messages/en.json` + `messages/bg.json`
- **No gradients** — solid surfaces + subtle borders
- **No arbitrary Tailwind** — use semantic tokens from `globals.css`
- **Small batches** — no rewrites, no redesigns

---

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

---

## Quick Reference

### Stack

- Next.js 16 (App Router, Cache Components)
- Supabase (Postgres + RLS + Auth + Storage)
- Stripe (server-side only)
- Tailwind v4 + shadcn/ui
- next-intl (`@/i18n/routing` for Link/useRouter)

### Supabase Clients

| Use Case | Client |
|----------|--------|
| Server Components / Actions | `createClient()` |
| Cached/public reads | `createStaticClient()` |
| Route handlers | `createRouteHandlerClient()` |
| Admin (bypass RLS) | `createAdminClient()` |
| Client Components | `createBrowserClient()` |

### Caching

- `'use cache'` + `cacheLife('<profile>')` + `cacheTag('<tag>')`
- Never read `cookies()`/`headers()` inside cached functions
- Invalidate with `revalidateTag(tag, profile)`
- Profiles: `categories`, `products`, `deals`, `user`

### Common Commands

```bash
pnpm dev                    # Dev server
pnpm build                  # Production build
pnpm lint                   # ESLint
pnpm test:unit              # Vitest
pnpm test:e2e               # Playwright full
pnpm test:e2e:smoke         # Playwright smoke
```

---

## Before Starting Any Task

1. **Read PRD.md** — understand the product
2. **Check FEATURES.md** — is this feature built?
3. **Check TASKS.md** — is there an existing task?
4. **Keep scope small** — if >3 files, break it up
5. **Run gates** after every meaningful change

---

*Last updated: 2026-01-25*
