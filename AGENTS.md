# AGENTS.md — Treido

Treido is a mobile-first marketplace where people and businesses buy and sell products with secure card payments. Deployed at treido.eu.
Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Stripe · next-intl (en/bg).

---

## How to Work

You're a strong developer — trust your judgment. This section makes you more effective, not slower.

1. **Read your task** in `TASKS.md`. Load the context docs it references.
2. **Think first.** For multi-file changes, sketch your plan before touching code. Think through edge cases.
3. **Work in batches.** Group related changes. Verify after each batch, not after every file.
4. **Mark tasks done.** When you finish a task, check its box in `TASKS.md`. If acceptance criteria have sub-items, check those too.
5. **If something feels risky** (auth, payments, DB schema), add a note to the task explaining what you'd do — don't execute it. The human will review.
6. **If a doc is wrong,** fix it. You have permission to update docs that are stale or inaccurate.

**Use official docs for framework questions.** Our docs contain what's unique to Treido. For how Next.js / Supabase / Stripe / Tailwind / shadcn / next-intl work, read their official docs (links in `docs/STACK.md`). If a context7 MCP is available, use `resolve-library-id` + `get-library-docs`.

---

## Find Context for Your Task

Read this file (~100 lines) + one doc for your task area. Only add more for complex work.

| Working on | Read |
|------------|------|
| Understanding the product | `docs/PRD.md` |
| How we use our tech stack | `docs/STACK.md` + official docs |
| UI, styling, components | `docs/DESIGN.md` |
| Database, schema, queries | `docs/database.md` |
| Testing | `docs/testing.md` |
| A specific feature | `docs/features/<feature>.md` |
| Why a pattern or decision exists | `docs/DECISIONS.md` |
| What to work on | `TASKS.md` |
| Plans, pricing, subscriptions | `docs/business/plans-pricing.md` |
| Revenue, monetization, fees | `docs/business/monetization.md` |
| Launch strategy, go-to-market | `docs/business/go-to-market.md` |
| Competitive landscape | `docs/business/competitors.md` |
| Success metrics and KPIs | `docs/business/metrics-kpis.md` |
| Legal, GDPR, compliance | `docs/business/legal-compliance.md` |

Feature docs: auth, bottom-nav, checkout-payments, header, product-cards, search-filters, sell-flow.
Business docs: plans-pricing, monetization, go-to-market, competitors, metrics-kpis, legal-compliance.
Agent personas: `docs/agents/` — business-strategist, marketing-manager, finance-analyst, operations-manager.

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

## Knowledge That Prevents Mistakes

These aren't arbitrary rules — they exist because violating them causes real production incidents.

- **Auth:** `getUser()` only — `getSession()` reads the JWT without re-validating, so a spoofed token passes silently.
- **Webhooks:** `constructEvent()` before any DB write. Stripe signs payloads — without verification, forged events create fake orders.
- **Route privacy:** `_components/`, `_actions/`, `_lib/` are route-group-private. Never import across route groups.
- **Styling:** semantic tokens only (`bg-background`, `text-foreground`). No palette classes, hex, arbitrary values, or gradients. `pnpm -s styles:gate` catches violations.
- **Data:** no `select('*')` in hot paths. Use the correct Supabase client per context (→ `docs/STACK.md` § Supabase client table).
- **Performance:** no wide joins in list views. `createStaticClient()` for cached reads. Never cache user-specific data.

**Stop and flag for human approval:** DB schema · migrations · RLS · auth/session logic · payments/webhooks · destructive operations.

---

## Conventions

- Server Components by default. `"use client"` only for state, effects, event handlers, or browser APIs.
- Client components are prop-driven — data fetched server-side, passed as props.
- Zod at boundaries (forms, webhooks, API inputs). Typed data internally.
- File naming: `kebab-case`. No version suffixes, no generic `client.tsx`.
- `requireAuth()` from `lib/auth/require-auth.ts` for server action auth.
- `components/ui/` primitive-only. `components/shared/` for cross-route composites. `components/layout/` for shells.
- Navigation: always `Link` / `redirect` from `@/i18n/routing` — never `next/link` directly.

---

## Verify

After every batch of changes:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

If you changed files referenced in a doc, verify the doc is still accurate.

*Last updated: 2026-02-23*
