# DOMAINS.md — Consolidated Domain Contracts

> Unified domain contract for auth, database, payments, API, routes, and i18n.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-15 |
| Refresh cadence | Weekly + whenever domain behavior or contracts change |

## Runtime Truth Paths

### Auth

- `proxy.ts`
- `lib/supabase/middleware.ts`
- `lib/supabase/server.ts`
- `lib/supabase/client.ts`
- `lib/auth/require-auth.ts`
- `lib/auth/admin.ts`
- `lib/auth/business.ts`
- `components/providers/auth-state-manager.tsx`
- `app/auth/confirm/route.ts`
- `app/api/auth/sign-out/route.ts`
- `app/[locale]/(auth)/**`
- `app/[locale]/(onboarding)/**`
- `app/[locale]/(main)/_providers/onboarding-provider.tsx`

### Database

- `supabase/migrations/**`
- `supabase/functions/**`
- `lib/supabase/server.ts`
- `lib/supabase/client.ts`
- `lib/supabase/shared.ts`
- `lib/supabase/database.types.ts`
- `app/actions/**`
- `app/api/**`
- `docs/generated/db-schema.md`

### Payments

- `lib/env.ts`
- `lib/stripe.ts`
- `lib/stripe-connect.ts`
- `app/actions/payments.ts`
- `app/api/checkout/webhook/route.ts`
- `app/api/payments/webhook/route.ts`
- `app/api/subscriptions/webhook/route.ts`
- `app/api/connect/webhook/route.ts`
- `app/api/connect/onboarding/route.ts`
- `app/[locale]/(checkout)/**`

### API

- `app/actions/**`
- `app/api/**`
- `lib/api/envelope.ts`
- `lib/api/response-helpers.ts`
- `lib/validation/**`
- `lib/auth/require-auth.ts`

### Routes

- `proxy.ts`
- `i18n/routing.ts`
- `app/[locale]/(main)/**`
- `app/[locale]/(account)/**`
- `app/[locale]/(auth)/**`
- `app/[locale]/(onboarding)/**`
- `app/[locale]/(sell)/**`
- `app/[locale]/(checkout)/**`
- `app/[locale]/(business)/**`
- `app/[locale]/(chat)/**`
- `app/[locale]/(plans)/**`
- `app/[locale]/(admin)/**`
- `app/[locale]/[username]/**`

### i18n

- `i18n/routing.ts`
- `i18n/request.ts`
- `proxy.ts`
- `messages/en.json`
- `messages/bg.json`
- `app/[locale]/**`

## Auth

### Quick Reference

| Concern | Runtime behavior |
|---|---|
| Session storage | HTTP-only cookies via `@supabase/ssr` clients |
| Server-side authorization | `supabase.auth.getUser()` |
| Client session state | `AuthStateManager` bootstraps + listens to `onAuthStateChange` |
| Session refresh | Middleware for protected surfaces + client refresh when leaving `/auth/*` |
| Onboarding gating | `profiles.onboarding_completed` checked by route provider |

### Security Non-Negotiables

- Never authorize server behavior with `getSession()`.
- Use `createAdminClient()` only in trusted server-only flows.
- For sign-out, keep mutating behavior on `POST`; `GET` stays redirect-only.
- Validate redirect targets (`safeNextPath()` in `app/auth/confirm/route.ts`).

### Session Lifecycle

Server path:

1. `proxy.ts` runs middleware.
2. Middleware delegates to `updateSession()` in `lib/supabase/middleware.ts`.
3. Auth checks run for protected/likely-authenticated surfaces to control edge cost.

Client path (`AuthStateManager`):

1. Reads session on initial mount.
2. Subscribes to `onAuthStateChange()`.
3. Forces refresh when transitioning away from `/auth/*` routes.
4. Performs throttled background refresh for authenticated users.

### Route Protection

Current middleware redirect coverage for unauthenticated users:

- `/${locale}/account/*`
- `/${locale}/sell/orders/*`
- `/protected*` (legacy locale-aware route)

Server-side enforcement still applies for protected actions/components via:

- `requireAuth()`
- `requireAuthOrFail()`
- `requireAdmin()`
- `requireDashboardAccess()`

### Onboarding Dependencies

- Source field: `profiles.onboarding_completed`.
- `OnboardingProvider` redirects incomplete users to `/${locale}/onboarding` except explicit bypass routes.
- Email-confirm flow redirects new incomplete users to `/${locale}/?onboarding=true`.

### Common Gotchas

- Route handlers should use `createRouteHandlerClient(request)`, not direct `cookies()` reads.
- Cached reads must use `createStaticClient()` and avoid cookie/header access.
- New protected routes require an explicit middleware-vs-server-gating decision.

## Database

### Supabase Client Selection

| Context | Client | Why |
|---|---|---|
| Server Components / Server Actions (user-scoped) | `createClient()` | Reads/writes auth cookies |
| Cached reads (`"use cache"`) | `createStaticClient()` | Cache-safe, no cookie/header coupling |
| Route handlers (`app/api/*`) | `createRouteHandlerClient(request)` | Request-scoped auth context |
| Admin/webhooks | `createAdminClient()` | Service-role access after trust verification |
| Browser components | `createBrowserClient()` | Client-side Supabase runtime |

### RLS Safety

- Keep RLS enabled on user-data tables.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.
- Restrict service-role usage to verified webhook/admin surfaces.
- Document and minimize any required RLS bypass.

### Migrations Truth

- `supabase/migrations/**` is authoritative for schema and policy history.
- If prose differs from migrations, migrations win and docs follow.
- Use small reversible migration batches for risky changes.

### Schema Visibility

Generate search-friendly schema docs when schema changes:

- Script: `node scripts/generate-db-schema.mjs`
- Output: `docs/generated/db-schema.md`

### Operational Knobs

- `SUPABASE_FETCH_TIMEOUT_MS` controls fetch timeout behavior in `lib/supabase/shared.ts`.
- `AUTH_COOKIE_DOMAIN` is production-only and enables cross-subdomain auth cookies.

## Payments

### Webhook Ownership

| Concern | Owning route |
|---|---|
| One-time checkout orders | `app/api/checkout/webhook/route.ts` |
| Listing boosts + saved card setup (`mode=setup`) | `app/api/payments/webhook/route.ts` |
| Subscriptions + invoices | `app/api/subscriptions/webhook/route.ts` |
| Stripe Connect account status updates | `app/api/connect/webhook/route.ts` |

Ownership rules:

- Avoid cross-handler duplication for the same event domain.
- Checkout webhook intentionally exits early for `subscription` and `setup` session modes.

### Environment Variables

Use `lib/env.ts` (validated access) rather than raw `process.env` reads.

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (supports comma/newline rotation)
- `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`
- `STRIPE_CONNECT_WEBHOOK_SECRET`

### Webhook Safety Rules

- Verify signature with `stripe.webhooks.constructEvent(...)` before any DB write.
- Only after verification, perform writes with `createAdminClient()`.
- Keep handlers idempotent:
  - Orders keyed by `orders.stripe_payment_intent_id`
  - Boosts constrained by `listing_boosts.stripe_checkout_session_id`
  - Saved cards deduped on `user_payment_methods.stripe_payment_method_id`
- Sanitize logs; never log raw secrets or full payload bodies.

### Fee Model

- Pricing/fees are DB-configured via `subscription_plans`.
- `getFeesForSeller()` and `calculateTransactionFees()` in `lib/stripe-connect.ts` are runtime fee logic entry points.
- Do not hardcode fee values in UI.

### Connect Onboarding + Payout Eligibility

- Stripe account type is Express.
- Connect webhook updates payout readiness fields:
  - `details_submitted`
  - `charges_enabled`
  - `payouts_enabled`
- Treat those fields as the gating contract for seller payout UX.

### Saved Payment Methods

`app/actions/payments.ts` setup-mode flow persists:

- `private_profiles.stripe_customer_id`
- `user_payment_methods` records created from verified webhook events

## API

### Server Actions vs Route Handlers

| Scenario | Prefer | Reason |
|---|---|---|
| Same-origin UI mutation | Server action (`app/actions/**`) + envelope return | Typed contract, simpler auth path, predictable UI handling |
| Third-party callback/webhook | Route handler (`app/api/**`) | Stable URL + explicit verification boundary |
| Cacheable public GET | `cachedJsonResponse(...)` | Aligned cache headers for CDN behavior |
| User-specific/private GET | `noStoreJson(...)` | Prevents caching auth-sensitive responses |

### Response Conventions

- Server actions return envelope shape from `lib/api/envelope.ts`.
- Route handlers use response helpers from `lib/api/response-helpers.ts`.
- Avoid returning raw `Error` objects to clients.

### Validation Rules

- Parse at the boundary with Zod for action inputs, route params, query params, and webhook metadata.
- Prefer `safeParse()` and return user-safe error messages.
- Keep parsed payloads typed through internal flows.

### Auth Rules

- Route handlers: use `createRouteHandlerClient(request)` for cookie-aware auth context.
- Server actions: use `requireAuth()` family helpers from `lib/auth/require-auth.ts`.
- Security checks use `supabase.auth.getUser()`.

### Common Gotchas

- Do not cache responses that vary by auth/session context.
- Do not bypass webhook verification before database writes.
- Keep integration handlers explicit about retry/idempotency behavior.

## Routes

### Locale Contract

- All user-facing routes are under `app/[locale]/`.
- URL locale prefix is always present (`/en/...`, `/bg/...`).
- Middleware sets `x-pathname` for layout-aware rendering decisions.

### Route Groups Ownership Map

| Route group | Primary responsibility |
|---|---|
| `(main)` | Browsing, search, category discovery, cart shell |
| `(auth)` | Login/signup/reset flows with minimal chrome |
| `(account)` | Settings, orders, profile surfaces |
| `(sell)` | Listing creation and seller workflows |
| `(checkout)` | Checkout and payment flow UI |
| `(onboarding)` | Post-signup onboarding wizard |
| `(chat)` | Messaging surfaces |
| `(business)` | Dashboard and business upgrades |
| `(plans)` | Subscription/plan selection |
| `(admin)` | Admin surfaces |
| `[username]` | Public profiles and product detail entry points |

### Route-Private Conventions

Keep route internals private to their owning route group:

- `_components/`
- `_actions/`
- `_lib/`
- `_providers/`

Rule: never import route-private modules across route groups.

### Common Gotchas

- `app/api/**` is intentionally excluded from middleware matcher.
- New route groups must explicitly define layout chrome ownership.
- Do not assume locale headers are available in non-page surfaces.

## i18n

### Quick Reference

| Concern | Contract |
|---|---|
| Supported locales | `en`, `bg` |
| Default locale | `en` |
| URL structure | Always locale-prefixed |
| Locale cookie | `NEXT_LOCALE` (1 year) |
| Navigation helpers | `Link`, `redirect`, `useRouter` from `@/i18n/routing` |

### Locale Contract

- `i18n/routing.ts` defines supported locales and prefix behavior.
- Locale detection uses cookie and `Accept-Language` via next-intl.
- User-facing routes remain locale-scoped by contract.

### Message Loading + Fallbacks

- `i18n/request.ts` loads `messages/${locale}.json`.
- Development fallback: visible `[namespace.key]` marker and warning.
- Production fallback: suppress raw key output (empty-string fallback).

### Routing Rules

- Prefer locale-aware helpers from `@/i18n/routing`.
- Avoid manual locale string concatenation in navigation code.
- Server context uses `getTranslations()` + `setRequestLocale()`.
- Client context uses `useTranslations()`.

### Common Gotchas

- Do not import `next/link` directly for app navigation surfaces.
- Keep `messages/en.json` and `messages/bg.json` key sets synchronized.
- Avoid introducing production UIs that can show raw translation keys.

## Verification

Use `docs/GUIDE.md` as the verification source of truth. For domain-contract updates, run the docs contract gate plus baseline static checks.

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s docs:check
```

*Last updated: 2026-02-15*
