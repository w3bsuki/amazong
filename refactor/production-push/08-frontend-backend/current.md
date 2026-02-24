# 08 — Frontend/Backend Alignment: Current State

---

## Server Actions (40 files in `app/actions/`)

### Return Shape Split

| Pattern | Count | Example |
|---------|-------|---------|
| `Envelope<T>` (standard) | 11 | `payments.ts`, `subscriptions-*`, `boosts-*`, `orders-reads-*` |
| Ad-hoc `{ success, errorCode }` | 29 | `profile-mutations.ts`, `products-create.ts`, `onboarding.ts` |

**73% of actions use ad-hoc return shapes.** This forces per-feature error handling in the UI.

### Input Validation

| Pattern | Prevalence |
|---------|------------|
| Zod schema at boundary | Some actions |
| Trust FormData shape | Many actions |
| No validation | Some older actions |

Not all actions parse inputs with Zod before processing.

### Auth Pattern

Standard pattern (mostly followed):
```ts
const auth = await requireAuth();
// OR
const auth = await requireAuthOrFail();
```

`requireAuth()` always uses `getUser()` (server-verified), never `getSession()`.

---

## API Routes (21 domains in `app/api/`)

### Webhook Routes (sensitive)
- `app/api/payments/webhook/route.ts` — Stripe checkout webhook
- `app/api/subscriptions/webhook/route.ts` — Stripe subscription webhook

Both use `constructEvent()` before DB writes (enforced by architecture tests).

### Public API Routes
- `app/api/products/*` — product listing/search/feed
- `app/api/categories/*` — category tree
- `app/api/health/route.ts` — health check

### Internal Routes
- `app/api/connect/*` — Stripe Connect
- `app/api/billing/*` — invoices
- `app/api/checkout/*` — checkout session
- `app/api/revalidate/*` — cache revalidation

---

## Response Helpers

```ts
// lib/api/response-helpers.ts
successResponse(data)    → NextResponse.json(data, { status: 200 })
errorResponse(msg, code) → NextResponse.json({ error: msg }, { status: code })
```

Route handlers use response helpers. Server actions use Envelope (when they use it at all).

---

## Domain Logic Location

| Location | Purpose | Issue |
|----------|---------|-------|
| `lib/data/*` | Query functions | Good — centralized |
| `app/actions/*` | Server actions | Mixed — some contain domain logic inline |
| `app/api/**/route.ts` | Route handlers | Mixed — some have inline queries |
| `app/[locale]/**/_lib/*.ts` | Route-private helpers | Some should be in lib/ |
| `app/[locale]/**/_actions/*.ts` | Route-private actions | Some duplicate app/actions/ patterns |

**Problem:** Domain logic is split between `lib/data/`, inline in actions, and inline in route handlers. Not all queries go through the data layer.

---

## logging in Backend

**111 `console.*` statements** in production code:
- 88 in `app/` (actions + routes)
- 19 in `components/` (providers)
- 4 in `lib/` (logger itself + feature flags)

All are `console.error` or `console.warn` — no `console.log`. But Next.js only strips `console.log` in production, so errors and warnings ship to production stdout.

---

## Pain Points

1. **Two return type systems** — Envelope vs ad-hoc creates inconsistent UI handling
2. **Domain logic scattered** — queries live in lib/, actions, routes, and _lib/ helpers
3. **Missing Zod validation** — not all action inputs validated at boundary
4. **Console.* in production** — 111 statements that should use structured logger
5. **Duplicate domain logic** — some business rules exist in both actions and routes
6. **No standard action flow** — each action has its own validation/auth/error pattern
