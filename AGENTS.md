# AGENTS.md — Treido

Treido is a mobile-first marketplace where people and businesses buy and sell products with secure card payments. Deployed at treido.eu.
Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Stripe · next-intl (en/bg).

---

## How to Work

**Read before writing.** Before modifying any file, read it completely.

**Grep before deleting.** Verify zero usage before removing any file or export.

**Think in batches.** Group related changes. Verify after a logical unit — not after every edit.

**Use official docs for framework questions.** Our docs contain what's unique to Treido. For how Next.js / Supabase / Stripe / Tailwind / shadcn / next-intl work, read their official docs (links in `docs/STACK.md`). If a context7 MCP is available, use `resolve-library-id` + `get-library-docs`.

**Load context for your task:**

| Working on | Read first |
|------------|------------|
| Understanding the product | `docs/PRD.md` |
| How we use our tech stack | `docs/STACK.md` + official docs |
| UI, styling, components | `docs/DESIGN.md` |
| A specific feature | `docs/features/<feature>.md` |
| Why a pattern or decision exists | `docs/DECISIONS.md` |
| Active non-refactor work | `TASKS.md` |
| Refactoring | `refactor/CURRENT.md` |

Feature docs exist for: auth, bottom-nav, checkout-payments, header, product-cards, search-filters, sell-flow.
Decision log is append-only: `### DEC-NNN: <title>`, 5-8 lines.

### Doc Philosophy

Our docs are context layers for AI agents, not textbooks. They contain what you can't get elsewhere:
- **Product context** — what Treido is, how it should feel
- **Current state** — what's built, what's broken, what files exist
- **Our decisions** — why we chose specific approaches
- **Pointers** — where to find framework knowledge (official docs, MCP)

We do NOT re-document how Next.js / Supabase / Stripe / Tailwind / shadcn / next-intl work. Read their official docs for that.

---

## Codebase

```
app/[locale]/(main|account|auth|sell|checkout|business|chat|admin|plans|onboarding|[username])/
app/actions/       → Server actions         components/ui/       → shadcn primitives
app/api/           → Webhooks, REST         components/shared/   → Cross-route composites
                                            components/layout/   → Header, sidebar, footer
lib/               → Utilities, clients     hooks/               → Shared React hooks
messages/          → i18n JSON (en, bg)     scripts/             → Build & quality gates
```

---

## Constraints

Violating these causes production incidents:

- **Auth:** `getUser()` only — `getSession()` is banned (JWT spoofing risk).
- **Webhooks:** `constructEvent()` before any DB write. Handlers must be idempotent.
- **Route privacy:** `_components/`, `_actions/`, `_lib/` never imported across route groups.
- **Styling:** semantic tokens only (`bg-background`, `text-foreground`). Palette classes, raw hex, arbitrary values, and gradients are forbidden. `pnpm -s styles:gate` enforces this.
- **Data:** no `select('*')` in hot paths — project only needed columns.
- **Supabase clients:** correct client per context. See `docs/STACK.md` § Supabase client table.
- **Performance:** no wide joins in list views. Use `createStaticClient()` for cached reads. No caching user-specific data.

**Stop and get human approval before touching:** DB schema · migrations · RLS · auth/session logic · payments/webhooks · destructive operations.

---

## Conventions

- Server Components by default. `"use client"` only for state, effects, event handlers, or browser APIs.
- Client components are prop-driven — data fetched server-side, passed as props.
- Zod at boundaries (forms, webhooks, API inputs). Typed data internally.
- File naming: `kebab-case`. No version suffixes, no generic `client.tsx`.
- Server actions use `requireAuth()` from `lib/auth/require-auth.ts`.
- `components/ui/` stays primitive-only (editable open code — no domain logic, no data fetching).
- `components/shared/` for cross-route composites. `components/layout/` for shells.
- Navigation: always use `Link` / `redirect` from `@/i18n/routing` — never `next/link` directly.

---

## Active Work

Codebase refactor in progress (7 domain audit+refactor tasks, autopilot protocol active). Start here → `refactor/CURRENT.md`
Launch blockers and feature work → `TASKS.md`

---

## Verify

Run once when your task is complete:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

*Last updated: 2026-02-18*
