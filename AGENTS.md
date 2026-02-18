# AGENTS.md — Treido

Treido is a mobile-first marketplace deployed at treido.eu.
Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Stripe · next-intl (en/bg).

---

## How to Work

**Read before writing.** Before modifying any file, read it completely. Understand what it does, who imports it, and why it exists.

**Grep before deleting.** Before removing any file or export, verify zero usage across the codebase.

**Think in batches.** Group related changes together. Verify after completing a logical unit of work — not after every individual file edit.

**Load context for your task.** Don't work from assumptions — read the relevant doc first:

| Working on | Read first |
|------------|------------|
| Understanding the product | `PRD.md` |
| Navigating / finding files | `docs/PROJECT-MAP.md` |
| Refactoring | `refactor/CURRENT.md` → linked task file → `refactor/shared-rules.md` |
| Architecture, modules, caching | `ARCHITECTURE.md` |
| UI, styling, components | `docs/DESIGN.md` |
| Auth, DB, payments, i18n, API | `docs/DOMAINS.md` |
| Why a pattern or decision exists | `docs/DECISIONS.md` |
| A specific feature | `docs/features/<feature>.md` (if it exists) |
| Active non-refactor work | `TASKS.md` |

Feature docs exist for: auth, bottom-nav, checkout-payments, header, product-cards, search-filters, sell-flow.
Decision log is append-only: `### DEC-NNN: <title>`, 5-8 lines.

---

## Codebase

Full file-by-file map with every route, component, lib module, hook, API route, and script: → `docs/PROJECT-MAP.md`

Quick orientation:

```
app/[locale]/(main|account|auth|sell|checkout|business|chat|admin|plans|onboarding|[username])/
app/actions/       → Server actions         components/ui/       → shadcn primitives
app/api/           → Webhooks, REST         components/shared/   → Cross-route composites
                                            components/layout/   → Header, sidebar, footer
lib/               → Utilities, clients     hooks/               → Shared React hooks
messages/          → i18n JSON (en, bg)     scripts/             → Build & quality gates
```

---

## Stack

| Layer | Tech | Key detail |
|-------|------|------------|
| Framework | Next.js 16 App Router | Server Components by default |
| Styling | Tailwind CSS v4 | CSS-first config in `app/globals.css`, semantic tokens only |
| Auth | Supabase Auth via `@supabase/ssr` | `getUser()` only — never `getSession()` |
| Database | Supabase Postgres + RLS | Client selection rules in `ARCHITECTURE.md` §2 |
| Payments | Stripe Connect | Webhooks verify signatures before any DB write |
| i18n | next-intl | Locale-prefixed URLs; use `Link`/`redirect` from `@/i18n/routing` |

---

## Constraints

Violating these causes production incidents:

- **Auth:** `getUser()` only — `getSession()` is banned (JWT spoofing risk).
- **Webhooks:** `constructEvent()` before any DB write. Handlers must be idempotent.
- **Route privacy:** `_components/`, `_actions/`, `_lib/` never imported across route groups.
- **Styling:** semantic tokens only (`bg-background`, `text-foreground`). Palette classes, raw hex, and arbitrary values are forbidden.
- **Data:** no `select('*')` in hot paths — project only needed columns.
- **Supabase clients:** correct client per context (server/cached/route-handler/admin/browser). See `ARCHITECTURE.md` §2.

**Stop and get human approval before touching:** DB schema · migrations · RLS · auth/session logic · payments/webhooks · destructive operations.

---

## Conventions

- Server Components by default. `"use client"` only for state, effects, event handlers, or browser APIs.
- Client components are prop-driven — data fetched server-side, passed as props.
- Zod at boundaries (forms, webhooks, API inputs). Typed data internally.
- File naming: `kebab-case`. No version suffixes, no generic `client.tsx`.
- Server actions use `requireAuth()` from `lib/auth/require-auth.ts`.
- `components/ui/` stays primitive-only. Cross-route shared code → `components/shared/`, `hooks/`, or `lib/`.

---

## Active Work

Codebase refactor in progress (Phases 1-2 done, 3-4 remain). Start here → `refactor/CURRENT.md`

---

## Verify

Run once when your task is complete:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

*Last updated: 2026-02-17*
