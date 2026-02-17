# AGENTS.md — Treido

Treido is a mobile-first marketplace where people buy and sell products.
Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase, Stripe, next-intl.
Production stage — 87% feature-complete, in launch-readiness hardening.
Site: www.treido.eu

---

## Verify (Run After Every Change)

```bash
# Always — after every file change:
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate

# When touching business logic:
pnpm -s test:unit

# When touching user flows:
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

These are mandatory. Run the full suite before considering any task complete. If any check fails, fix it before moving on.

---

## Stack

| Layer | Technology | Key detail |
|-------|-----------|------------|
| Framework | Next.js 16 (App Router) | React 19, Server Components by default |
| Styling | Tailwind CSS v4 | CSS-first config in `app/globals.css`, NOT a JS config file |
| Components | shadcn/ui (Radix + lucide-react) | Primitives in `components/ui/`, editable but domain-logic-free |
| Auth | Supabase Auth via `@supabase/ssr` | Always `getUser()`, never `getSession()` for security |
| Database | Supabase Postgres + RLS | Clients in `lib/supabase/` (server/static/route/admin/browser) |
| Payments | Stripe + Stripe Connect | Webhooks verify signatures before any DB write |
| i18n | next-intl | `messages/en.json` + `messages/bg.json`, locale-prefixed URLs |
| Testing | Vitest (unit) + Playwright (E2E) | `pnpm test:unit`, `pnpm test:e2e:smoke` |

---

## Deep Context — Documentation Map

Load ONE of these based on your task. Don't load everything — read what you need.

| When you're doing… | Read this |
|---------------------|-----------|
| UI / styling / layout | `docs/DESIGN.md` |
| Architecture / structure / caching | `ARCHITECTURE.md` |
| Auth, DB, payments, i18n, API routes | `docs/DOMAINS.md` |
| "Why did we decide X?" | `docs/DECISIONS.md` |
| Working on a specific feature | `docs/features/<feature>.md` (if it exists) |
| Refactoring / cleanup / bundle optimization | `REFACTOR.md` — full autonomous refactor orchestration (phases 0–9, progress tracker, session log) |
| Active open tasks | `TASKS.md` — launch blockers + backlog |
| Session history between me (Opus/Copilot) and human | `opus.md` — shared working memory |

Reference-only (load when needed): `REQUIREMENTS.md`, `docs/generated/db-schema.md`.

### Feature Docs (`docs/features/`)

Per-feature session memory. Created after a feature is built. Template: `docs/features/TEMPLATE.md`.
Existing: `auth.md`, `bottom-nav.md`, `checkout-payments.md`, `header.md`, `product-cards.md`, `search-filters.md`, `sell-flow.md`.

### Decision Log (`docs/DECISIONS.md`)

Append-only. Format: `### DEC-NNN: <title>`, 5–8 lines. 12 decisions logged so far.
After making a non-obvious decision, add an entry.

---

## Project Map

```
app/[locale]/
  (main)/              → Homepage, discovery, search, categories, cart
  (account)/           → User account, orders, settings
  (auth)/              → Login, register, forgot-password
  (sell)/              → Seller dashboard, listing creation, seller orders
  (checkout)/          → Checkout payment flow
  (business)/          → Business/seller onboarding + dashboard
  (chat)/              → Buyer-seller messaging
  (admin)/             → Admin panel
  (plans)/             → Subscription plans
  (onboarding)/        → Post-signup onboarding wizard
  [username]/          → Public seller profiles + product detail pages

app/actions/           → Server actions (products, orders, payments, profile, reviews, boosts)
app/api/               → Route handlers (webhooks, REST endpoints, health checks)

components/
  ui/                  → shadcn primitives (Button, Input, Dialog, Sheet, Drawer…)
  shared/              → Domain composites (product cards, filters, search, profile, wishlist)
  layout/              → Header (mobile + desktop), sidebar
  mobile/              → Mobile-specific: drawers, category nav
  desktop/             → Desktop-specific components
  providers/           → Context providers (cart, auth state)

lib/                   → Utilities, Supabase clients, Stripe, validation schemas, data fetchers
hooks/                 → Client React hooks (badges, search, geo, toast, mobile detection)
i18n/                  → next-intl routing config
messages/              → Translation JSON (en.json, bg.json)
```

### Key Files

| UI Element | Path |
|-----------|------|
| Mobile bottom nav | `components/ui/mobile-bottom-nav.tsx` |
| App header | `app/[locale]/_components/app-header.tsx` |
| Mobile header | `components/layout/header/mobile/` |
| Desktop header | `components/layout/header/desktop/` |
| Sidebar | `components/layout/sidebar/sidebar-menu.tsx` |
| Product cards | `components/shared/product/product-card.tsx` |
| Quick view (mobile) | `components/mobile/drawers/product-quick-view-drawer.tsx` |
| Quick view (desktop) | `components/desktop/product/product-quick-view-dialog.tsx` |
| Cart drawer | `components/mobile/drawers/cart-drawer.tsx` |
| Cart dropdown | `components/layout/header/cart/cart-dropdown.tsx` |
| Search filters | `components/shared/filters/` |
| Auth state | `components/providers/auth-state-manager.tsx` |
| Auth drawer | `components/mobile/drawers/auth-drawer.tsx` |
| Login form | `components/auth/login-form-body.tsx` |

---

## Conventions

### Styling (Tailwind v4)
- **CSS-first config:** Tokens live in `app/globals.css` as `@theme` + custom properties. No `tailwind.config.ts`.
- **Semantic tokens only:** `bg-background`, `text-foreground`, `border-border`, `bg-primary`, etc.
- **Forbidden:** palette classes (`bg-gray-100`), raw hex (`#fff`), token-alpha (`bg-primary/10`), arbitrary values (`w-[560px]`).
- **Enforced by:** `pnpm -s styles:gate` (scanner scripts block violations).

### Components
- **Server Components by default.** `"use client"` only for state, effects, or event handlers.
- **Client components are prop-driven** — no data fetching or mini data layers in the browser.
- shadcn primitives (`components/ui/`) are editable but must stay domain-logic-free.

### Data
- **Zod at boundaries** (forms, webhooks, API inputs), typed data inside.
- **No `select('*')` in hot paths** — project only needed columns.
- **Correct Supabase client per context:**

| Context | Client |
|---------|--------|
| Server Components / Actions | `createClient()` |
| Cached reads (`"use cache"`) | `createStaticClient()` |
| Route handlers (`app/api/*`) | `createRouteHandlerClient(request)` |
| Admin / webhooks | `createAdminClient()` |
| Browser components | `createBrowserClient()` |

All server clients: `lib/supabase/server.ts`. Browser client: `lib/supabase/client.ts`.

### Routes
- Route-private `_components/`, `_actions/`, `_lib/`, `_providers/` stay in their route group — **never import across route groups.**
- Shared code goes in `components/shared/`, `hooks/`, or `lib/`.
- Use locale-aware helpers from `@/i18n/routing` for `Link`, `redirect`, `useRouter`.

### Auth
- `supabase.auth.getUser()` for all security checks — never `getSession()`.
- Webhook signatures verified with `stripe.webhooks.constructEvent()` before any DB write.
- Webhook handlers must be idempotent (retries must not create duplicates).
- Use `requireAuth()` from `lib/auth/require-auth.ts` in server actions.

### Forms
- react-hook-form + zod for validation.
- Use `Field`, `FieldLabel`, `FieldError` from `components/shared/field.tsx`.

---

## Rules (Non-Negotiable)

1. **Code > docs.** If they disagree, trust code, then update docs.
2. **Semantic tokens only** — enforced by `styles:gate`.
3. **`getUser()` not `getSession()`** — enforced by architecture tests.
4. **No `select('*')` in hot paths** — enforced by architecture tests.
5. **Route-private code stays private** — enforced by architecture tests.
6. **Webhooks verify before writing** — enforced by architecture tests.
7. **Mechanical enforcement over prose promises** — if a rule matters, gate it.

---

## High-Risk Pause

**Stop and get human approval** before finalizing changes to:
- DB schema, migrations, or RLS policies
- Auth/session/access control
- Payments/webhooks/billing
- Destructive or bulk data operations

---

## Output Contract

After completing work, report:
1. Files changed (modified/created/deleted)
2. Verification commands run + pass/fail
3. Assumptions, risks, or follow-ups

---

## After Building a Feature

Create or update `docs/features/<feature>.md` using the template in `docs/features/TEMPLATE.md`.

*Last updated: 2026-02-17*
