# ARCHITECTURE.md — System Architecture

> Deep technical reference. Load when making structural changes, adding routes, or working with caching/data flow.
> For project identity, conventions, and rules, see `AGENTS.md`.

---

## 1. Module Reference (`lib/`)

| Module | Purpose |
|--------|---------|
| `lib/supabase/` | Supabase clients (server, client, admin, static) |
| `lib/data/` | Cached data fetchers (products, categories, plans) |
| `lib/auth/` | Auth utilities (`requireAuth`, admin/business checks) |
| `lib/ai/` | AI model config, schemas, tools |
| `lib/api/` | Response helpers |
| `lib/badges/` | Category badge specifications |
| `lib/boost/` | Boost status utilities |
| `lib/filters/` | Search filter utilities |
| `lib/sell/` | Listing schema v4 |
| `lib/types/` | TypeScript types |
| `lib/upload/` | Image upload utilities |
| `lib/validation/` | Zod schemas for orders |
| `lib/validation/` | Zod schemas (auth, orders, password strength) |
| `lib/view-models/` | View model transformations |
| `lib/stripe.ts` | Server-side Stripe instance |
| `lib/stripe-connect.ts` | Stripe Connect utilities |
| `lib/currency.ts` | Currency utilities |
| `lib/shipping.ts` | Shipping region filters |
| `lib/logger.ts` | Logging |
| `lib/env.ts` | Environment variable access |
| `lib/feature-flags.ts` | Feature flag system |

---

## 2. Supabase Clients

| Client | Use Case | File |
|--------|----------|------|
| `createClient()` | Server Components / Actions | `lib/supabase/server.ts` |
| `createStaticClient()` | Cached/public reads (no cookies) | `lib/supabase/server.ts` |
| `createRouteHandlerClient()` | API route handlers | `lib/supabase/server.ts` |
| `createAdminClient()` | Bypass RLS (webhooks, admin) | `lib/supabase/server.ts` |
| `createBrowserClient()` | Client Components | `lib/supabase/client.ts` |

### Selection Rules

- **Cached reads:** Use `createStaticClient()` — safe for `'use cache'`
- **User-specific data:** Use `createClient()` — reads cookies
- **Webhooks/admin:** Use `createAdminClient()` — bypasses RLS
- **Client-side:** Use `createBrowserClient()` only

---

## 3. Data Flow

### Request Flow

```
Request → proxy.ts → i18n routing → geo detection → session refresh → App Router
```

### Server Actions (`app/actions/`)

| Action File | Purpose |
|-------------|---------|
| `products.ts` | CRUD operations, bulk updates |
| `orders.ts` | Order management |
| `payments.ts` | Payment operations |
| `boosts.ts` | Listing boosts |
| `profile.ts` | Profile updates |
| `reviews.ts` | Review system |
| `onboarding.ts` | Post-signup flow |

### API Routes (`app/api/`)

| Route | Purpose |
|-------|---------|
| `/api/checkout/webhook` | Stripe checkout webhook (orders) |
| `/api/payments/webhook` | Stripe payments webhook (boosts) |
| `/api/subscriptions/webhook` | Subscription events |
| `/api/connect/*` | Stripe Connect onboarding + dashboard |
| `/api/categories/` | Category data |
| `/api/products/` | Product search/listing |
| `/api/orders/` | Order operations |
| `/api/upload-image/` | Image uploads |

### Cached Fetchers (`lib/data/`)

| Fetcher | Purpose |
|---------|---------|
| `getProducts()` | Product listings with filters |
| `getCategories()` | Category tree |
| `getPlans()` | Subscription plans |
| `getProfile()` | User profile data |

---

## 4. Caching Patterns

### Cache Profiles

Defined in `next.config.ts`:

| Profile | TTL | Use For |
|---------|-----|---------|
| `categories` | Long | Category tree |
| `products` | Medium | Product listings |
| `deals` | Short | Time-sensitive |
| `user` | Short | User-specific |
| `max` | Longest | Static content |

### Cache Rules

1. **Always pair:** `cacheLife('<profile>')` + `cacheTag('<tag>')`
2. **Invalidate with two args:** `revalidateTag(tag, profile)`
3. **Never inside cache:**
   - `cookies()` or `headers()`
   - `new Date()` (causes ISR write storms)
   - User-specific reads
4. **Use `createStaticClient()`** for cached Supabase reads

### Example Pattern

```ts
"use cache"
import { cacheLife, cacheTag } from "next/cache";
import { createStaticClient } from "@/lib/supabase/server";

export async function getCategories() {
  cacheLife("categories");
  cacheTag("categories");
  const supabase = createStaticClient();
  // ... fetch
}
```

---

## 5. Import Rules

### Boundaries

```
components/ui/       → shadcn primitives only (editable; no app/domain logic)
components/shared/   → shared composites (use ui + lib)
components/layout/   → shells (header, nav, footer)
components/providers/→ thin contexts
hooks/               → reusable React hooks
lib/                 → pure utilities (no React, no app imports)
```

### `components/ui/*` Ownership

- `components/ui/*` is open code owned by Treido and may be edited.
- Expected edits include token compliance, accessibility fixes, bug fixes, and variant maintenance.
- Constraint: keep this layer primitive-only (no domain logic, data fetching, or API calls).
- Styling and interaction SSOT for this layer: `docs/DESIGN.md`.

### Forbidden Imports

- Never import `_components/` across route groups
- Never import app code into `lib/`
- Never import app hooks into `components/ui/`

---

## 6. Component Patterns

### Server vs Client

- **Default to Server Components**
- Add `"use client"` only for: state, effects, event handlers
- Keep client components "dumb" — data as props

### Forms

- Use `components/shared/field.tsx` (`Field`, `FieldLabel`, `FieldError`)
- Use `components/ui/*` inputs/buttons

### i18n

- Server: `getTranslations()` + `setRequestLocale()`
- Client: `useTranslations()`
- Links: Use `Link` from `@/i18n/routing`

---

## 7. Security Rules

### Supabase

- RLS must be enabled on all user data tables
- Use `supabase.auth.getUser()` (not `getSession()`) for security checks
- Never ship `SUPABASE_SERVICE_ROLE_KEY` to client

### Stripe

- Verify webhook signatures with `stripe.webhooks.constructEvent()`
- Make handlers idempotent (events can retry)
- Never log secrets or customer PII

### Auth Boundaries

Protected (redirected) by middleware:
- `/account/*`
- `/sell/orders/*`
- `/protected/*`

Session refresh/auth check in middleware runs for:
- `/account/*`
- `/sell/*`
- `/chat/*`
- `/protected/*`

Use `requireAuth()` from `lib/auth/require-auth.ts` in server actions.

---

## 8. Performance Rules

### Avoid

- `select('*')` in hot paths — project only needed fields
- Wide joins in list views — use RPCs for aggregations
- Caching user-specific data
- Missing `generateStaticParams()` on hot segments (ISR spikes)

### Prefer

- Server Components over client fetching
- Granular cache tags over broad ones
- Stable query ordering in cached functions

---

---

## See Also

- [AGENTS.md](./AGENTS.md) — Project identity, conventions, rules, component map
- [docs/DESIGN.md](./docs/DESIGN.md) — UI/UX + frontend contract
- [docs/DOMAINS.md](./docs/DOMAINS.md) — Domain contracts (auth/db/payments/api/routes/i18n)
- [docs/DECISIONS.md](./docs/DECISIONS.md) — Decision log
- [docs/features/](./docs/features/) — Per-feature documentation

---

*Last updated: 2026-02-16*

