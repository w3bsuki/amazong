# Architecture — Technical Reference

> **This is the single technical reference for the codebase.** Covers stack, boundaries, caching, backend, and frontend patterns.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix) + lucide-react |
| i18n | next-intl |
| Database | Supabase (Postgres + RLS) |
| Auth | Supabase Auth via `@supabase/ssr` |
| Storage | Supabase Storage |
| Payments | Stripe + Stripe Connect |
| Testing | Vitest (unit `__tests__/`) + Playwright (E2E `e2e/`) |

---

## Code Boundaries

### Import Rules

```
components/ui/       → shadcn primitives ONLY (no app logic, no hooks)
components/shared/   → shared composites (cards, fields, filters)
components/layout/   → shells (header, nav, sidebar, footer)
components/providers/→ thin providers/contexts
hooks/               → reusable React hooks
lib/                 → pure utilities (no React, no app imports)
```

### Route-Private Code

Do NOT import across route groups:
- `app/[locale]/(group)/_components/**`
- `app/[locale]/(group)/_actions/**`
- `app/[locale]/(group)/_lib/**`

If a component is only used by one route group, keep it route-private.

### Shared Actions

- Route-private actions: `app/[locale]/(group)/_actions/**`
- Shared actions: `app/actions/**`

---

## Next.js App Router

### Server vs Client Components

- **Default to Server Components** — add `"use client"` only when needed (state, effects, handlers)
- Fetch data in Server Components or `lib/data/**` fetchers
- Prefer Server Actions for mutations
- Keep client components "dumb" — data passed as props

### Caching (Cache Components)

This repo uses Next.js 16 Cache Components (`next.config.ts`).

**Rules:**
- Use `'use cache'` only for cacheable server work
- Always pair with `cacheLife('<profile>')`
- Use granular `cacheTag()` — avoid broad tags
- Never read `cookies()` / `headers()` inside cached functions
- Invalidate with `revalidateTag(tag, profile)` (two args)

**Cache profiles:** `categories`, `products`, `deals`, `user`

**Cost drivers to watch:**
- Missing `generateStaticParams()` on hot segments (ISR write spikes)
- Middleware running on every request (including static assets)
- Over-fetching (wide selects / deep joins)

### i18n Routing (next-intl)

- Use `Link` / `useRouter` from `@/i18n/routing` (not `next/navigation`)
- Keep hrefs locale-agnostic (e.g. `"/search"`) — helpers prefix automatically
- All strings via `messages/en.json` + `messages/bg.json`

---

## Supabase

### Client Selection

| Use Case | Client | File |
|----------|--------|------|
| Server Components / Actions | `createClient()` | `lib/supabase/server.ts` |
| Cached/public reads | `createStaticClient()` | `lib/supabase/server.ts` |
| Route handlers (`app/api/**`) | `createRouteHandlerClient()` | `lib/supabase/server.ts` |
| Admin (bypass RLS) | `createAdminClient()` | `lib/supabase/server.ts` |
| Client Components | `createBrowserClient()` | `lib/supabase/client.ts` |

### Security Rules

- **RLS must be enabled** on all user data tables
- Validate sessions with `getClaims()` / `getUser()` for security-sensitive checks
- Prefer `(SELECT auth.uid())` in RLS policies (evaluates once per query)
- Never ship `SUPABASE_SERVICE_ROLE_KEY` to client bundles

### Performance Rules

- Don't `select('*')` in hot paths — project only needed fields
- Avoid wide joins in list views; use RPCs for complex aggregations
- Don't cache user-specific reads (cookies/headers make output dynamic)

---

## Stripe

### Baseline Rules

- Verify webhook signatures with `stripe.webhooks.constructEvent()`
- Make webhook handlers **idempotent** (events can retry)
- Never log secrets, customer PII, or full request bodies
- Webhook secrets may be comma/newline list for rotation — try each secret
- **Environment separation**: staging = test keys, production = live keys

### Webhooks

| Endpoint | Purpose |
|----------|---------|
| `/api/checkout/webhook` | Goods checkout (order creation) |
| `/api/payments/webhook` | Saved payment methods |
| `/api/subscriptions/webhook` | Subscription events |

### Connect (Payouts)

- `/api/connect/onboarding` returns Express account link
- Individual + Business flows supported
- Payout release is escrow-style (delayed after delivery confirmation)

---

## Frontend Patterns

### Component Boundaries

- `components/ui/` — shadcn primitives only (no app hooks)
- `components/shared/` — shared composites (use ui primitives + lib utilities)
- Route-private in `_components/`

### Forms

- Use `components/shared/field.tsx` (`Field`, `FieldLabel`, `FieldError`)
- Use `components/ui/*` inputs/buttons

### UX & Accessibility

- Touch targets ≥32px (use `h-touch-*` utilities)
- Use shadcn primitives for focus/disabled states
- Images: meaningful `alt`, no layout shift (`next/image`)
- Keyboard: all interactive controls reachable + visible focus
- No gradients or arbitrary Tailwind values (see `DESIGN.md`)

### i18n in Components

- Client Components: `useTranslations()`
- Server Components: `getTranslations()` + `setRequestLocale()`
- Use `@/i18n/routing` for localized Link/navigation

---

## Data Access Patterns

### Recommended

```ts
// Server Component fetching
import { getProducts } from "@/lib/data/products";
const products = await getProducts({ category: "electronics" });

// Server Action mutation
"use server"
import { createClient } from "@/lib/supabase/server";
export async function updateProfile(data: FormData) {
  const supabase = await createClient();
  // ... validate, update, revalidateTag
}

// Cached public data
"use cache"
import { cacheLife, cacheTag } from "next/cache";
export async function getCategories() {
  cacheLife("categories");
  cacheTag("categories");
  // ...
}
```

### Avoid

- `select('*')` in hot paths
- Client-side data fetching when server fetch is possible
- `any` casts in data layer
- Caching user-specific data

---

## Batch Guidelines

### What a "good batch" looks like

- **Scope**: 1–3 files/features
- **Risk**: low unless touching auth/checkout/seller flows
- **Verification**: typecheck + e2e:smoke minimum (see `TESTING.md`)

### Non-negotiables (Rails)

- No secrets/PII in logs
- All user-facing strings via `next-intl`
- No gradients; no arbitrary Tailwind values
- Small, verifiable batches (no rewrites / no redesigns)

---

## Related Docs

| Doc | Purpose |
|-----|---------|
| [DESIGN.md](DESIGN.md) | UI tokens, patterns, anti-patterns |
| [TESTING.md](TESTING.md) | Gates, debugging |
| [PRODUCTION.md](PRODUCTION.md) | Deployment checklist |
| [PRD.md](PRD.md) | Product scope & roadmap |

---

*Last updated: 2026-01-25*
