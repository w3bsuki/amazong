# Amazong Marketplace – Project Memory

A modern e-commerce marketplace built with Next.js 16, Supabase, and Stripe.

## Tech Stack

- **Framework**: Next.js 16 (App Router with Cache Components)
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase Auth (SSR-friendly)
- **Payments**: Stripe (server-side only)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **i18n**: next-intl (`app/[locale]/...`)

## Project Structure Rules

Where to put files:

- `app/[locale]/(group)/.../_components/*` — UI owned by a single route group
- `app/[locale]/(group)/.../_actions/*` — server actions owned by a route group
- `app/[locale]/actions/*` — shared server actions
- `components/ui/*` — shadcn primitives only (no feature composites)
- `components/common/*` — shared composites (cards, tables, blocks)
- `components/layout/*` — layout shells (headers, sidebars, navigation)
- `components/providers/*` — React providers/contexts
- `hooks/*` — reusable hooks (not under `components/ui`)
- `lib/*` — pure utilities, clients, domain helpers (no React components)
- `messages/*` — translation JSON files (per locale)
- `supabase/*` — migrations, project config, SQL artifacts

## Key Conventions

- Default to **Server Components**; add `'use client'` only when required
- Keep secrets **server-only** (server components, route handlers, server actions)
- Use existing shadcn primitives from `components/ui/` instead of inventing new ones
- Prefer **Server Actions** for UI-coupled mutations; **Route Handlers** for webhooks/external APIs
- Follow Tailwind v4 conventions; global CSS is in `app/globals.css`

## Common Commands

```bash
# Development
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Production build
pnpm lint             # ESLint

# Testing
pnpm test:unit        # Vitest unit tests
pnpm test:e2e         # Playwright E2E tests

# Verification
pnpm -s exec tsc -p tsconfig.json --noEmit   # Typecheck
```

## Caching (Next.js 16)

- Cache Components enabled (`cacheComponents: true`)
- Cache profiles in `next.config.ts`: `categories`, `products`, `deals`, `user`
- Use `'use cache'` + `cacheLife()` + `cacheTag()` for server data fetchers

## Skills/Rules

Detailed domain knowledge is organized in `.claude/rules/`:

- `backend-architect.md` — DB schemas, APIs, auth, RLS, integrations
- `frontend-ui.md` — shadcn/Tailwind, design direction, component patterns
- `nextjs-app-router.md` — App Router routes, layouts, server/client boundaries
- `supabase-auth-db.md` — Auth, SSR patterns, RLS, env vars
- `stripe-payments.md` — Checkout, webhooks, idempotency
- `i18n.md` — next-intl, locale routing, translations
- `ux-flows.md` — Sell/order UX flows, states, friction reduction

## Quality Bar

Before marking a task done:

1. **Typecheck passes**: `pnpm -s exec tsc -p tsconfig.json --noEmit`
2. **No lint errors**: `pnpm lint`
3. If changing auth/routes/data: **Build works**: `pnpm build`
4. If changing critical flows: **E2E passes**: `pnpm test:e2e`
