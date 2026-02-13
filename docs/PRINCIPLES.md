# PRINCIPLES.md — Golden Principles

> Non-negotiable engineering beliefs that guide every implementation decision. These are the "why" behind our patterns. When in doubt, refer here.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Monthly + whenever a principle is added or revised |

---

## 1. Parse at the boundary, trust inside

Validate all external inputs (webhook payloads, form data, query params, API responses) with Zod at the entry point. Once parsed, pass typed data through the system without re-validation. Never build on guessed shapes.

**Enforced by:** Zod schemas in `lib/validation/**`, webhook signature checks, `safeParse()` in server actions.

---

## 2. Code is runtime truth

When documentation and code disagree, code and migrations win. Docs must be updated in the same change that modifies behavior. Never let prose overrule what actually runs.

**Enforced by:** `docs/RISK.md` policy, `AGENTS.md` execution rules.

---

## 3. Semantic tokens only — never bypass the design system

Use semantic token utilities (`bg-background`, `text-foreground`, `border-border`). Never use palette classes (`bg-gray-100`), raw hex, or `oklch()` in components. Token alpha hacks (`bg-primary/10`) are also forbidden.

**Enforced by:** `pnpm -s styles:gate` (palette scan, arbitrary scan, token-alpha scan).

---

## 4. Never use `getSession()` for security checks

`getSession()` reads from cookies without server verification and can be spoofed. Always use `supabase.auth.getUser()` for authorization decisions. This applies to middleware, server actions, and route handlers.

**Enforced by:** Architecture boundary tests (`__tests__/architecture-boundaries.test.ts`), `lib/auth/require-auth.ts` uses `getUser()` exclusively.

---

## 5. No `select('*')` in hot paths

Project only the fields you need. Wide selects increase payload size, leak schema details, and break cache efficiency. Use explicit column lists or RPCs for aggregations.

**Enforced by:** Architecture boundary tests (`__tests__/architecture-boundaries.test.ts`), `ARCHITECTURE.md` performance rules.

---

## 6. Supabase client selection is non-negotiable

| Context | Client | Why |
|---------|--------|-----|
| Server Components / Actions | `createClient()` | Reads auth cookies |
| Cached reads (`"use cache"`) | `createStaticClient()` | No cookies, no AbortController (Next cache safe) |
| Route handlers | `createRouteHandlerClient(request)` | Uses request cookies |
| Admin / webhooks | `createAdminClient()` | Service role, bypasses RLS — only after trust verification |

Wrong client = broken auth, cache pollution, or RLS bypass. See `docs/domain/DATABASE.md`.

---

## 7. Route-private code stays private

`_components/`, `_actions/`, `_lib/`, `_providers/` inside a route group must never be imported across route groups. Shared code goes in `components/shared/`, `hooks/`, or `lib/`.

**Enforced by:** Architecture boundary tests, `ARCHITECTURE.md` import rules.

---

## 8. Webhooks verify before writing

Every webhook handler must verify the signature (`stripe.webhooks.constructEvent(...)`) before any database operation. Use `createAdminClient()` only after verification. Make handlers idempotent — retries must not create duplicates.

**Enforced by:** Architecture boundary tests (`__tests__/architecture-boundaries.test.ts`), `docs/domain/PAYMENTS.md` safety rules.

---

## 9. Server Components by default

Only add `"use client"` when you need state, effects, or event handlers. Client components should be prop-driven and thin — avoid client-side "mini data layers." Auth checks and data fetching belong on the server.

**Enforced by:** `docs/ui/FRONTEND.md` §3.

---

## 10. Respect the user's device

- Touch targets: 44px default, 48px primary controls, 36px compact-only.
- No horizontal overflow on mobile.
- Respect `prefers-reduced-motion` for non-essential animation.
- Keyboard-reachable flows with visible focus states.
- Safe-area utilities for notches and system chrome.

**Enforced by:** `docs/ui/DESIGN.md` §3, accessibility tests.

---

## 11. High-risk domains require human approval

DB schema/migrations/RLS, auth/session behavior, payments/webhooks/billing, and destructive data operations must not be finalized by an agent alone. Stop and ask a human.

**Enforced by:** `docs/RISK.md` stop-and-ask policy.

---

## 12. Mechanical enforcement over prose promises

Prefer linting rules, type checks, CI gates, and structural tests over documentation-only guidelines. A rule that isn't mechanically checked will eventually be violated.

**Enforced by:** `pnpm -s typecheck`, `pnpm -s lint`, `pnpm -s styles:gate`, `pnpm -s docs:check`.

---

## How Principles Evolve

1. When a pattern causes repeated bugs or agent confusion, propose a new principle.
2. Encode the principle as a mechanical check if possible (lint rule, gate, test).
3. Add it here with an "Enforced by" line.
4. Update downstream docs if the principle changes existing conventions.

*Last updated: 2026-02-13*
