# STACK.md — Technology Context

> How we use each technology. Our config, our files, our decisions.
> For framework knowledge, read the official docs linked below.
> If a **context7 MCP** is available, use `resolve-library-id` + `get-library-docs` for any framework question.

---

## Next.js 16 — App Router

> Docs: https://nextjs.org/docs

We use Next.js 16 with App Router. Server Components by default.

**Our config:** `next.config.ts`
- Typed routes enabled — `<Link href>` and `router.push()` are statically typed
- Typed env enabled — auto-generates `.d.ts` for environment variables
- Cache Components enabled (`cacheComponents: true`)
- Server actions: 10MB body size limit
- Image: AVIF + WebP, 30-day cache, quality presets `[25, 50, 75, 85, 90, 100]`
- Remote images: `*.supabase.co`, `images.unsplash.com`, `cdn.simpleicons.org`, `flagcdn.com`, `api.dicebear.com`
- Bundle: `optimizePackageImports` for date-fns, recharts, lucide-react, framer-motion
- Redirects: `/u/:username` → `/:username`, `/demo/*` → `/`, `/registry` → `/gift-cards`

**Cache profiles** (in `next.config.ts`):

| Profile | Stale | Revalidate | Expire | For |
|---------|-------|------------|--------|-----|
| `categories` | 5m | 1h | 1d | Category tree |
| `products` | 1m | 5m | 1h | Product listings |
| `deals` | 30s | 2m | 10m | Time-sensitive content |
| `user` | 5m | 1h | 1d | User-specific cached data |
| `max` | 5m | 1h | 1d | Generic long cache |

**Caching pattern:**
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

Always pair `cacheLife()` + `cacheTag()`. Use `createStaticClient()` for cached reads (no cookies). Never put `cookies()`, `headers()`, `new Date()`, or user-specific data inside `"use cache"`.

**Middleware:** `proxy.ts` (Next.js 16 convention, renamed from `middleware.ts`).
Does three things: i18n routing → geo detection → session refresh.
Skips prefetch requests. Passes `x-pathname` header to layouts. Excludes `/api`, `/_next`, static files.

**Key convention:** Server Components by default. `"use client"` only for state, effects, event handlers, browser APIs.

---

## React 19

> Docs: https://react.dev

React 19 with Server Components. Client components are prop-driven — data fetched server-side, passed as props.

**Forms:** react-hook-form 7 + @hookform/resolvers + Zod 4 at boundaries.
**Animations:** framer-motion 12 (sparingly — see DESIGN.md § Motion).

---

## TypeScript 5.9

> Docs: https://www.typescriptlang.org/docs

**Our config:** `tsconfig.json`
- Strict mode + extra: `noUncheckedIndexedAccess`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `exactOptionalPropertyTypes`
- Path alias: `@/*` → project root
- File naming: `kebab-case.ts`. No version suffixes, no generic `client.tsx`.

---

## Tailwind CSS v4

> Docs: https://tailwindcss.com/docs

CSS-first config — no `tailwind.config.ts`. Everything in `app/globals.css`.

**Our token system:** OKLCH-based semantic tokens as CSS custom properties.
- Theme: "Pure Neutral + Twitter Blue CTAs"
- `--primary`: blue (`oklch(0.62 0.20 255)`)
- `--destructive`: red-orange for errors/discounts
- All grays: true neutral (near-zero chroma)
- Dark mode: class-based (`.dark`)
- Category color families for 11 categories

**Enforcement:** We use scanner scripts that fail the build if you use palette classes, raw hex/oklch, arbitrary values, or gradients.
- `pnpm -s styles:gate` runs all scanners
- Allowed only: semantic tokens (`bg-background`, `text-foreground`, `border-border`, etc.)
- See `docs/DESIGN.md` § Token Contract for the full rule + exceptions

**Key files:**
- `app/globals.css` — token definitions, dark mode, custom utilities
- `app/utilities.css` — safe-area utilities, layout helpers
- `app/shadcn-components.css` — shadcn component tokens
- `postcss.config.mjs` — PostCSS pipeline

---

## shadcn/ui

> Docs: https://ui.shadcn.com
> Also see: Anthropic's "Building effective agents" — https://github.com/anthropics/anthropic-cookbook/tree/main/misc/prompt_caching

**Our config:** `components.json`
- Style: `new-york`
- RSC: enabled
- Base color: `neutral`
- Icon library: `lucide`
- Extra registries: `@shadcnblocks`, `@shadcn-studio`

**Key conventions:**
- `components/ui/*` — shadcn primitives. Editable open code we own. Keep primitive-only: no domain logic, no data fetching.
- `components/shared/*` — composed UI built on top of ui/ + lib/. Shared across routes.
- `components/layout/*` — app shells (header, sidebar, footer).
- Never import `_components/` across route groups.

**Drawers:** Vaul (`vaul@1.1.2`) for mobile bottom sheets. Radix Dialog for desktop modals.
**Toasts:** Sonner (`sonner@2.0.7`).
**Commands:** cmdk (`cmdk@1.1.1`) for command palette patterns.

---

## Supabase — Auth + Database

> Docs: https://supabase.com/docs

Auth via `@supabase/ssr` (cookie-based sessions). Postgres database with RLS.

**Our clients** (all in `lib/supabase/server.ts`):

| Client | Cookies | RLS | Use case |
|--------|---------|-----|----------|
| `createClient()` | Yes (next/headers) | Respects | User-specific queries in Server Components / Actions |
| `createRouteHandlerClient(request)` | Yes (request) | Respects | Route handlers (`app/api/*`) |
| `createStaticClient()` | None | Anon-only | Cached queries (`"use cache"`) |
| `createAdminClient()` | None | Bypasses | Service-role ops after trust verification |
| `createBrowserClient()` | Auto | Respects | Client Components (in `lib/supabase/client.ts`) |

**Critical:** `getUser()` only — never `getSession()` (JWT spoofing risk). This is our most important security decision.

**Auth flow:**
- `proxy.ts` → `updateSession()` in `lib/supabase/middleware.ts` → session refresh for protected routes
- Client: `AuthStateManager` provider listens to `onAuthStateChange()`
- Server actions: `requireAuth()` from `lib/auth/require-auth.ts`
- Protected routes: `/account/*`, `/sell/orders/*`

**Database:**
- Schema: `supabase/migrations/**` (authoritative source of truth)
- Generated types: `lib/supabase/database.types.ts`
- Schema docs: run `node scripts/generate-db-schema.mjs` → `docs/generated/db-schema.md`
- Shared helpers: `fetchWithTimeout`, `fetchWithoutTimeout` in `lib/supabase/shared.ts`
- Operational knobs: `SUPABASE_FETCH_TIMEOUT_MS` (fetch timeout), `AUTH_COOKIE_DOMAIN` (cross-subdomain, prod only)

---

## Stripe — Payments

> Docs: https://docs.stripe.com

Stripe Connect (Express) for seller payouts. Stripe Checkout for purchases.

**Our setup:**
- Server instance: `lib/stripe.ts` (server-only, API version `2025-12-15.clover`)
- Connect utilities: `lib/stripe-connect.ts`
- Environment: `lib/env.ts` — `getStripeSecretKey()`, `getStripeWebhookSecrets()`
- Webhook secrets support rotation (comma/newline separated multi-value)

**Fee model** (Vinted-style buyer-protection):
- Personal sellers: 0% seller fee, buyer pays protection (3-4% + fixed)
- Business sellers: 0.5-1.5% seller fee, lower buyer fee
- Fees DB-configured via `subscription_plans` table, resolved at runtime by `getFeesForSeller()`

**Webhook ownership:**

| Route | Events |
|-------|--------|
| `app/api/checkout/webhook/route.ts` | One-time checkout orders |
| `app/api/payments/webhook/route.ts` | Listing boosts + saved card setup |
| `app/api/subscriptions/webhook/route.ts` | Subscriptions + invoices |
| `app/api/connect/webhook/route.ts` | Connect account status updates |

**Critical:** `constructEvent()` before any DB write. All handlers must be idempotent.

---

## next-intl — Internationalization

> Docs: https://next-intl.dev/docs/getting-started

Two locales: `en` (default), `bg`. All URLs locale-prefixed (`/en/...`, `/bg/...`).

**Our config:**
- Routing: `i18n/routing.ts` — exports `Link`, `redirect`, `usePathname`, `useRouter`
- Messages: `i18n/request.ts` loads from `messages/${locale}.json`
- Timezone: `Europe/Sofia`, Currency: EUR
- Cookie: `NEXT_LOCALE` (1-year, sameSite lax)
- Missing translations: visible `[namespace.key]` in dev, empty string in prod

**Key conventions:**
- Server: `getTranslations()` + `setRequestLocale()`
- Client: `useTranslations()`
- Navigation: always use `Link` / `redirect` from `@/i18n/routing` — never `next/link` directly
- Keep `messages/en.json` and `messages/bg.json` key sets synchronized

---

## API Patterns

**Server actions** (`app/actions/`) return envelope shapes from `lib/api/envelope.ts`.
**Route handlers** (`app/api/`) use response helpers from `lib/api/response-helpers.ts`:
- `cachedJsonResponse()` — CDN-aligned cache headers for public GETs
- `noStoreJson()` — prevents caching auth-sensitive responses

Prefer server actions for same-origin UI mutations. Use route handlers for webhooks, third-party callbacks, and cacheable public endpoints.

---

## Vercel AI SDK

> Docs: https://sdk.vercel.ai/docs

AI-powered features using `ai` SDK with multiple providers.

**Our setup:**
- Config: `lib/ai/` — model config, schemas, tools
- Providers: Google (Gemini), Groq, OpenAI
- Used for: AI assistant, product descriptions, category suggestions

---

## Testing

**Unit tests:** Vitest with three config files:
- `vitest.config.ts` — main (jsdom, React components)
- `vitest.hooks.config.ts` — hook tests
- `vitest.node.config.ts` — pure Node tests

**E2E tests:** Playwright (`playwright.config.ts`)
- Custom runner: `scripts/run-playwright.mjs`
- Primary: `e2e/smoke.spec.ts`, `e2e/seller-routes.spec.ts`

**Test directory:** `__tests__/` for unit tests, `e2e/` for Playwright, `test/` for shared test utilities.

---

## Build & Quality Gates

```bash
# Type safety
pnpm -s typecheck

# Linting (ESLint 9 flat config)
pnpm -s lint

# Token enforcement (semantic-only Tailwind)
pnpm -s styles:gate

# Unit tests
pnpm -s test:unit

# Architecture boundaries
pnpm -s architecture:gate

# Dead code detection
pnpm -s knip

# Full verification (refactor)
pnpm -s refactor:verify
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.1.4 | Framework |
| `react` | 19.2.3 | UI |
| `typescript` | 5.9.3 | Language |
| `tailwindcss` | 4.1.18 | Styling |
| `@supabase/ssr` | 0.8.0 | Server-side auth |
| `stripe` | 20.2.0 | Payments |
| `next-intl` | 4.7.0 | i18n |
| `zod` | 4.3.5 | Validation |
| `ai` | 6.0.49 | AI SDK |
| `react-hook-form` | 7.71.1 | Forms |
| `framer-motion` | 12.27.5 | Animation |
| `vaul` | 1.1.2 | Drawers |
| `sonner` | 2.0.7 | Toasts |
| `lucide-react` | 0.562.0 | Icons |
| `sharp` | 0.34.5 | Image processing |
| `recharts` | 3.6.0 | Charts |

---

*Last updated: 2026-02-18*
