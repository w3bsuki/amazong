# Golden Target Structure

> The ideal folder structure for Treido after refactor.
> Every folder has a clear purpose. No orphans, no ambiguity.

```
treido/
├── app/
│   ├── globals.css                 # Tailwind v4: @import, @theme, OKLCH tokens
│   ├── utilities.css               # Custom Tailwind utilities
│   ├── shadcn-components.css       # shadcn component-level overrides
│   ├── global-error.tsx            # Root error boundary
│   ├── global-not-found.tsx        # Root 404
│   ├── sitemap.ts                  # Dynamic sitemap generator
│   ├── robots.txt                  # Static robots
│   │
│   ├── [locale]/                   # i18n: all routes locale-prefixed
│   │   ├── layout.tsx              # Root layout: providers, fonts, metadata
│   │   ├── page.tsx                # Homepage
│   │   ├── not-found.tsx           # Locale-aware 404
│   │   │
│   │   ├── (main)/                 # Public marketplace routes
│   │   │   ├── layout.tsx          # Main shell: header + footer + bottom nav
│   │   │   ├── products/
│   │   │   │   ├── page.tsx        # Browse/search all products
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx    # Product detail page (PDP)
│   │   │   │   ├── loading.tsx     # Skeleton while loading
│   │   │   │   └── _components/    # Route-private components
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx        # All categories
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Category products
│   │   │   ├── deals/
│   │   │   │   └── page.tsx        # Deals/promotions
│   │   │   ├── cart/
│   │   │   │   └── page.tsx        # Shopping cart
│   │   │   └── wishlist/
│   │   │       └── page.tsx        # Saved items
│   │   │
│   │   ├── (auth)/                 # Auth routes (no main layout)
│   │   │   ├── login/page.tsx
│   │   │   ├── sign-up/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   └── _components/        # Auth-specific components
│   │   │
│   │   ├── (account)/              # Authenticated user routes
│   │   │   ├── layout.tsx          # Account shell (sidebar + auth guard)
│   │   │   ├── settings/page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx        # Order history
│   │   │   │   └── [id]/page.tsx   # Order detail
│   │   │   └── _components/
│   │   │
│   │   ├── (sell)/                 # Seller routes
│   │   │   ├── layout.tsx          # Sell layout (auth guard)
│   │   │   ├── sell/page.tsx       # Create listing form
│   │   │   └── _components/
│   │   │
│   │   ├── (checkout)/             # Checkout flow
│   │   │   ├── checkout/page.tsx
│   │   │   ├── success/page.tsx
│   │   │   └── _components/
│   │   │
│   │   ├── (business)/             # Business dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   └── _components/
│   │   │
│   │   ├── (chat)/                 # Messaging
│   │   │   └── chat/page.tsx
│   │   │
│   │   ├── (plans)/                # Subscription plans
│   │   │   └── plans/page.tsx
│   │   │
│   │   ├── (onboarding)/           # New user onboarding
│   │   │   └── onboarding/page.tsx
│   │   │
│   │   └── [username]/             # Public seller profiles
│   │       └── page.tsx
│   │
│   ├── actions/                    # Server actions (global)
│   │   ├── cart.ts
│   │   ├── listings.ts
│   │   ├── orders.ts
│   │   ├── profile.ts
│   │   └── wishlist.ts
│   │
│   ├── api/                        # Route handlers (webhooks, external)
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts     # Stripe webhook handler
│   │   └── auth/
│   │       ├── callback/route.ts   # OAuth callback
│   │       └── confirm/route.ts    # Email confirmation
│   │
│   └── auth/                       # Supabase auth callbacks (non-locale)
│       └── ...
│
├── components/
│   ├── ui/                         # shadcn primitives ONLY (never modify for business logic)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...                     # ~30-40 shadcn components
│   │
│   ├── shared/                     # Cross-route composites (business components)
│   │   ├── product-card.tsx        # Composed from ui/card + ui/badge
│   │   ├── product-grid.tsx
│   │   ├── price-display.tsx
│   │   ├── category-badge.tsx
│   │   ├── search-bar.tsx
│   │   ├── filter-sidebar.tsx
│   │   └── ...
│   │
│   ├── layout/                     # Layout shells
│   │   ├── app-header.tsx
│   │   ├── app-footer.tsx
│   │   ├── mobile-tab-bar.tsx
│   │   ├── sidebar.tsx
│   │   └── ...
│   │
│   ├── auth/                       # Auth-specific components
│   │   ├── login-form.tsx
│   │   └── sign-up-form.tsx
│   │
│   ├── providers/                  # Context providers (client-only)
│   │   ├── theme-provider.tsx
│   │   └── ...
│   │
│   └── mobile/                     # Mobile-specific components
│       └── ...
│
├── lib/                            # Utilities, clients, business logic
│   ├── supabase/
│   │   ├── server.ts               # 4 server clients (createClient, createStaticClient, etc.)
│   │   ├── client.ts               # Browser client (createBrowserClient)
│   │   └── database.types.ts       # Generated Supabase types
│   │
│   ├── stripe.ts                   # Stripe server instance
│   ├── stripe-connect.ts           # Connect utilities
│   │
│   ├── auth/
│   │   └── require-auth.ts         # requireAuth() for server actions
│   │
│   ├── api/
│   │   ├── envelope.ts             # Server action return types
│   │   └── response-helpers.ts     # Route handler utilities
│   │
│   ├── env.ts                      # Environment variable access
│   ├── utils.ts                    # cn() and minimal utilities
│   └── ...
│
├── hooks/                          # Shared React hooks (client-only)
│   ├── use-debounce.ts
│   ├── use-media-query.ts
│   └── ...
│
├── i18n/
│   ├── routing.ts                  # Exports: Link, redirect, usePathname, useRouter
│   └── request.ts                  # getRequestConfig()
│
├── messages/
│   ├── en.json                     # English translations (complete)
│   └── bg.json                     # Bulgarian translations (complete, same keys)
│
├── public/                         # Static assets
│   └── ...
│
├── __tests__/                      # Unit tests (Vitest)
│   └── ...
│
├── e2e/                            # E2E tests (Playwright)
│   └── ...
│
├── scripts/                        # Build tools, quality gates
│   ├── scan-tailwind-palette.mjs   # Styles gate scanner
│   └── ...
│
├── supabase/                       # Supabase config + migrations
│   └── ...
│
├── proxy.ts                        # Next.js 16 middleware (i18n + geo + session)
├── next.config.ts                  # Next.js config (cache profiles, images, etc.)
├── components.json                 # shadcn/ui config
├── tsconfig.json                   # TypeScript strict config
├── vitest.config.ts                # Vitest config
├── eslint.config.mjs               # ESLint 9 flat config
├── postcss.config.mjs              # PostCSS (Tailwind plugin)
└── package.json
```

## Key Principles

1. **Route-private stays private:** `_components/`, `_actions/`, `_lib/` inside route groups are never imported from outside that group.
2. **UI primitives vs composites:** `components/ui/` = shadcn only. `components/shared/` = business components. Never mix.
3. **One client per context:** The right Supabase client for the right context (see `codex/refs/supabase.md`).
4. **Server by default:** If a file doesn't say `"use client"`, it's a Server Component. That's intentional.
5. **Flat when possible:** Avoid deeply nested directories. Route groups handle the nesting.
6. **Actions are global:** `app/actions/` contains all server actions. Route-private `_actions/` only for route-specific mutations.
