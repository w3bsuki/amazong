# Stack Context

> How we use each technology. Our config, our decisions, our files.
> For framework knowledge, read the official docs linked below.
> If a **context7 MCP** is available, use `resolve-library-id` + `get-library-docs` for any framework question.

---

## Core Stack

| Tech | Version | Docs | Our config |
|------|---------|------|------------|
| Next.js | 16 (App Router) | https://nextjs.org/docs | `next.config.ts` |
| React | 19 (Server Components) | https://react.dev | — |
| TypeScript | 5.9 (strict) | https://typescriptlang.org | `tsconfig.json` |
| Tailwind CSS | v4 (CSS-first) | https://tailwindcss.com | `app/globals.css` |
| shadcn/ui | new-york style | https://ui.shadcn.com | `components.json` |
| Supabase | Auth + Postgres + RLS | https://supabase.com/docs | `lib/supabase/server.ts` |
| Stripe | Connect Express | https://docs.stripe.com | `lib/stripe.ts` |
| next-intl | en/bg | https://next-intl.dev | `i18n/routing.ts` |
| Vercel AI SDK | Multi-provider | https://sdk.vercel.ai/docs | `lib/ai/` |

---

## Supabase Client Selection

| Client | Cookies | RLS | Use case |
|--------|---------|-----|----------|
| `createClient()` | Yes (next/headers) | Respects | User-specific queries in Server Components / Actions |
| `createRouteHandlerClient(req)` | Yes (request) | Respects | Route handlers (`app/api/*`) |
| `createStaticClient()` | None | Anon-only | Cached queries (`"use cache"`) |
| `createAdminClient()` | None | Bypasses | Service-role ops after trust verification |
| `createBrowserClient()` | Auto | Respects | Client Components (`lib/supabase/client.ts`) |

All in `lib/supabase/server.ts` except browser client in `lib/supabase/client.ts`.

---

## Caching Pattern

```ts
"use cache"
import { cacheLife, cacheTag } from "next/cache";
import { createStaticClient } from "@/lib/supabase/server";

export async function getCategories() {
  cacheLife("categories");
  cacheTag("categories");
  const supabase = createStaticClient();
  // ...
}
```

Cache profiles: `categories` (5m/1h/1d), `products` (1m/5m/1h), `deals` (30s/2m/10m), `user` (5m/1h/1d), `max` (5m/1h/1d).
Always pair `cacheLife()` + `cacheTag()`. Never put `cookies()`, `headers()`, user data inside `"use cache"`.

---

## Stripe Setup

- Server instance: `lib/stripe.ts` (API version `2025-12-15.clover`)
- Connect utilities: `lib/stripe-connect.ts`
- Environment: `lib/env.ts` — `getStripeSecretKey()`, `getStripeWebhookSecrets()`
- Webhook secrets support rotation (comma/newline separated)
- Fee model: DB-configured via `subscription_plans`, resolved by `getFeesForSeller()`
- → See `docs/features/checkout-payments.md` for webhook routes and flow details

---

## i18n Setup

Two locales: `en` (default), `bg`. All URLs locale-prefixed.

- Routing: `i18n/routing.ts` — exports `Link`, `redirect`, `usePathname`, `useRouter`
- Messages: `messages/${locale}.json`
- Server: `getTranslations()` + `setRequestLocale()`
- Client: `useTranslations()`
- Navigation: always use `Link` / `redirect` from `@/i18n/routing` — never `next/link` directly

---

## API Patterns

**Server actions** (`app/actions/`) return envelope shapes from `lib/api/envelope.ts`.
**Route handlers** (`app/api/`) use response helpers from `lib/api/response-helpers.ts`.

Prefer server actions for same-origin UI mutations. Route handlers for webhooks, external callbacks, and cacheable public endpoints.

---

## Middleware

`proxy.ts` (Next.js 16 convention): i18n routing → geo detection → session refresh.
Skips prefetch requests. Passes `x-pathname` header to layouts. Excludes `/api`, `/_next`, static files.

---

## Build & Quality Gates

```bash
pnpm -s typecheck            # TypeScript strict
pnpm -s lint                 # ESLint 9 flat config
pnpm -s styles:gate          # Semantic-only Tailwind enforcement
pnpm -s test:unit            # Vitest unit tests
pnpm -s architecture:gate    # Boundary enforcement
pnpm -s knip                 # Dead code detection
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `zod` 4.x | Validation at boundaries |
| `react-hook-form` 7.x | Client forms |
| `framer-motion` 12.x | Animation (sparingly) |
| `vaul` 1.x | Mobile bottom sheet drawers |
| `sonner` 2.x | Toast notifications |
| `lucide-react` | Icons (direct imports, tree-shakable) |
| `sharp` | Server-side image processing |
| `recharts` 3.x | Charts (business dashboard) |

---

*Last verified: 2026-02-21*
