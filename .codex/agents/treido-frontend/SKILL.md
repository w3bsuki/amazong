---
name: treido-frontend
description: "Next.js 16 App Router and React 19 Server Components expert for Treido. TRIGGERS: next.js, app router, page, layout, route, server component, client component, 'use client', RSC, streaming, suspense, loading, error boundary, not-found, parallel route, intercepting route, route group, dynamic route, generateStaticParams, generateMetadata, revalidate, cache, fetch, 'use cache', cacheTag, cacheLife, redirect, notFound, headers, cookies, proxy, performance, bundle, PPR. NOT FOR: styling/UI (treido-design), database/RLS (treido-backend), i18n messages (treido-i18n), payments (treido-payments)."
---

# treido-frontend

Next.js 16 App Router expertise: Server Components by default, `'use cache'` directive for data, proxy.ts (not middleware.ts), locale-based routing, Suspense streaming.

## Core Principles

| ID | Principle |
|----|-----------|
| `core-rsc` | Server Components by default — `'use client'` only when required |
| `core-locale` | All pages under `[locale]/` — no root pages |
| `core-proxy` | Use `proxy.ts` — no root `middleware.ts` allowed |
| `core-cache` | `'use cache'` directive for data functions — not client `useEffect` |
| `core-stream` | Stream with Suspense — progressive UI, no waterfalls |

## Quick Reference: File Conventions

| ID | File | Purpose |
|----|------|---------|
| `file-page` | `page.tsx` | Route UI (Server Component by default) |
| `file-layout` | `layout.tsx` | Persistent wrapper, preserved across navigation |
| `file-loading` | `loading.tsx` | Suspense fallback for page/segment |
| `file-error` | `error.tsx` | Error boundary (**must** be `'use client'`) |
| `file-notfound` | `not-found.tsx` | 404 UI |
| `file-route` | `route.ts` | API endpoint (GET/POST/PUT/DELETE) |
| `file-template` | `template.tsx` | Like layout but re-renders on navigation |

→ Patterns: [references/app-router.md](references/app-router.md)

## Quick Reference: Server vs Client

| ID | Condition | Component Type |
|----|-----------|----------------|
| `rsc-default` | Default for all components | Server Component |
| `rsc-use-client` | Need hooks (`useState`, `useEffect`) | Client Component |
| `rsc-interactive` | Need event handlers (`onClick`, `onChange`) | Client Component |
| `rsc-browser` | Need browser APIs (`localStorage`, `window`) | Client Component |
| `rsc-async` | Async data fetching | Server Component (async) |

→ Decision tree & examples: [references/server-components.md](references/server-components.md)

## Quick Reference: Route Groups (Treido)

| ID | Group | Purpose |
|----|-------|---------|
| `route-main` | `(main)` | Public buyer routes (home, search, cart, categories) |
| `route-account` | `(account)` | Authenticated user dashboard |
| `route-auth` | `(auth)` | Login, signup, password flows |
| `route-checkout` | `(checkout)` | Checkout flow |
| `route-sell` | `(sell)` | Seller listing creation |
| `route-business` | `(business)` | Business/seller dashboard |
| `route-admin` | `(admin)` | Admin panel |

Private folders: `_components/`, `_lib/`, `_providers/` — not routable.

→ Full structure: [references/app-router.md](references/app-router.md)

## Quick Reference: Data & Caching

| ID | Pattern | When |
|----|---------|------|
| `cache-use-cache` | `'use cache'` directive | All cached data functions in `lib/data/` |
| `cache-tag` | `cacheTag('products:list')` | Tag for revalidation |
| `cache-life` | `cacheLife('products')` | Use profile from `next.config.ts` |
| `cache-no-store` | `{ cache: 'no-store' }` | User-specific, real-time data |
| `data-server-only` | `import 'server-only'` | Ensure module never in client bundle |
| `data-static-client` | `createStaticClient()` | Cached Supabase reads (no cookies) |

**Cache profiles** (from `next.config.ts`): `categories` (1h), `products` (5m), `deals` (2m), `user` (1h), `max` (1h).

→ Full patterns: [references/data-fetching.md](references/data-fetching.md), [references/caching.md](references/caching.md)

## Quick Reference: Route Params (Next.js 16)

| ID | Pattern | Notes |
|----|---------|-------|
| `route-params-async` | `const { id } = await params` | Params are Promise in Next.js 16 |
| `route-search-async` | `const { q } = await searchParams` | SearchParams are Promise |
| `route-dynamic` | `[id]`, `[slug]`, `[...slug]` | Dynamic segments |
| `route-optional` | `[[...slug]]` | Optional catch-all |
| `route-static` | `generateStaticParams()` | Pre-render at build time |
| `route-meta` | `generateMetadata()` | Dynamic SEO metadata |

→ Examples: [references/app-router.md](references/app-router.md)

## CRITICAL: Forbidden Patterns

| ID | ❌ Never | ✅ Fix |
|----|----------|--------|
| `rsc-no-hooks` | `useState` in Server Component | Move to Client Component |
| `rsc-no-async-client` | `async function` in Client Component | Use Server Component or fetch in useEffect |
| `data-no-client-fetch` | `useEffect` + `fetch` for initial data | Fetch in Server Component |
| `route-no-middleware` | Root `middleware.ts` | Use `proxy.ts` |
| `route-no-pages` | `pages/` directory | Use `app/` only |
| `route-no-query` | `router.query` | Use `params`/`searchParams` |
| `cache-no-date` | `new Date()` in cached function | Causes ISR write storm |
| `import-no-db-client` | Import `db` in Client Component | Keep DB server-only |

## HIGH: Rendering Strategies

| ID | Strategy | Use When |
|----|----------|----------|
| `render-static` | Static | Content rarely changes, pre-render at build |
| `render-dynamic` | Dynamic | User-specific, real-time, cookies/headers |
| `render-stream` | Streaming | Long data fetches, progressive UI |
| `render-ppr` | PPR | Static shell + dynamic slots |

Config exports: `dynamic`, `revalidate`, `fetchCache`, `runtime`.

→ Examples: [references/caching.md](references/caching.md)

## MEDIUM: Performance

| ID | Pattern | Purpose |
|----|---------|---------|
| `perf-dynamic-import` | `dynamic(() => import(...))` | Code splitting |
| `perf-image` | `next/image` | Optimized images |
| `perf-script` | `next/script` | Third-party script loading |
| `perf-suspense` | Suspense boundaries | Streaming, avoid waterfalls |
| `perf-priority` | `priority` prop on LCP image | Preload above-fold images |

→ Full guide: [references/performance.md](references/performance.md)

## Review Checklist

- [ ] `rsc-default` — Server Components by default
- [ ] `rsc-use-client` — `'use client'` only when required (hooks, browser APIs)
- [ ] `route-locale` — All pages under `[locale]/`
- [ ] `route-params-async` — `await params` and `await searchParams`
- [ ] `cache-use-cache` — Data functions use `'use cache'` directive
- [ ] `cache-tag` — Cache tags follow hierarchy (`products:list`, `product:${id}`)
- [ ] `data-server-only` — No `useEffect` data fetching for initial render
- [ ] `file-error` — `error.tsx` has `'use client'`
- [ ] `proxy-no-middleware` — No root `middleware.ts`

## MCP Tools

| Tool | Purpose |
|------|---------|
| `mcp_next-devtools_nextjs_docs` | Search Next.js documentation |
| `mcp_next-devtools_nextjs_call` | Call Next.js API |
| `mcp_io_github_ups_resolve-library-id` | Context7: Get React/Next.js library ID |
| `mcp_io_github_ups_get-library-docs` | Context7: Fetch library docs |

## References (Progressive Disclosure)

| File | Content |
|------|---------|
| [app-router.md](references/app-router.md) | Layouts, pages, route groups, parallel routes |
| [server-components.md](references/server-components.md) | RSC patterns, `'use client'` rules, streaming |
| [data-fetching.md](references/data-fetching.md) | `'use cache'`, cacheTag, Treido lib/data patterns |
| [caching.md](references/caching.md) | Cache layers, revalidation, ISR |
| [performance.md](references/performance.md) | Bundle optimization, images, code splitting |

## SSOT Documents

| Topic | Location |
|-------|----------|
| Architecture | `docs/03-ARCHITECTURE.md` |
| Routes spec | `docs/05-ROUTES.md` |
| App config | `next.config.ts` |
| Data patterns | `lib/data/` |
| Route rules | `app/AGENTS.md` |

## Handoffs

| Domain | Agent |
|--------|-------|
| Design tokens, styling, UI | **treido-design** |
| i18n messages, translations | **treido-i18n** |
| Database, RLS, Supabase | **treido-backend** |
| Auth, sessions, middleware | **treido-backend** |
| Payments, Stripe | **treido-payments** |
