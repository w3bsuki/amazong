# Next.js 16 Audit Task Plan (Deepthink)

## Critical Actions (cache components & runtime health)
- Verify dev server errors (pnpm dev fails) via logs and MCP runtime tools; unblock local dev before code edits.
- Keep cacheComponents enabled in next.config.ts; confirm cacheLife profiles match product SLAs and add docstring inline.
- Replace remaining unstable_cache usages with use cache + cacheLife/cacheTag or cacheHandlers as needed.

## Caching & Invalidation
- App/sell categories: migrate getSellCategoriesCached (unstable_cache) to use cache directive with cacheLife('categories') and cacheTag('categories') plus tags per hierarchy depth; ensure createStaticClient stays cookie-free.
- API categories route: remove unstable_cache import (currently unused) and add use cache where safe for tree builders; align Cache-Control headers with cacheLife profiles; add cacheTag coverage for root-with-children/context/category-hierarchy tags; ensure depth param doesn’t cause unbounded cache growth (cap depth, chunking already in place).
- Review lib/data categories/products/profile modules: ensure each cached function has explicit cacheLife profile and cacheTag values; add updateTag/revalidateTag call sites in mutations to keep data fresh.
- Revalidation webhook (/api/revalidate): validate availableTags list matches actual tags; add rate limit/authz note; ensure secret is set in env and CI.

## Routing, params, and metadata
- Confirm generateStaticParams coverage for dynamic routes: categories/[slug], username pages, product [...slug]; add sample params where missing to avoid Cache Components runtime param errors.
- Wrap runtime param access in Suspense where required under Cache Components (dynamic routes that read params without generateStaticParams).
- Ensure generateMetadata functions avoid runtime data unless necessary; when they use cookies/headers/params, ensure Suspense-compatible behavior or defer intentionally.
- SEO/OG audit: check static metadata exports, Open Graph images coverage, robots.txt and sitemap.ts presence; add fixes for any missing locales/paths.

## Middleware
- Audit middleware.ts/middleware.entry.ts for lean execution: no DB calls, minimal parsing, only guards/rewrites needed; measure cold start/time and trim.

## Parallel routes
- If @slot/parallel routes exist, confirm correct usage (no unnecessary nesting, proper loading/error boundaries per slot) and clean up unused slot groups.

## Client-only imports
- Enforce client-only imports in browser-exclusive modules; add client-only guard where DOM APIs are used and ensure server bundles don’t pull those deps.

## Server vs Client components
- Audit "use client" surface: downscope large client files into server wrappers where possible (filters/search header/product cards/sell flow). Identify components doing data fetch in client that can move server-side.
- Enforce server-only for Supabase admin/secure utilities; add server-only import where needed.

## Data fetching & streaming
- Category page: continue server fetch; add Suspense boundaries for slow sections (products grid already sync; consider streaming search results skeleton); ensure cookies() use is minimal.
- Add loading.tsx/error.tsx where missing for key routes (categories, product, cart, checkout, sell) to improve UX and error isolation.

## API vs Server Actions
- Inventory/sell mutations: prefer Server Actions with revalidateTag/updateTag instead of API POSTs when caller is internal UI; keep webhooks/3rd-party integrations as route handlers.
- Ensure server actions have "use server" and proper input validation; avoid leaking non-serializable data to client.

## Observability & DX
- Add lightweight logging/metrics around cache hits/misses for category/product fetchers (guarded by NODE_ENV !== 'production').
- Document cache tag naming conventions and cacheLife profiles in README/DEV notes.
- Add MCP runtime diagnostics pass: use nextjs_index/nextjs_call to check hydration/bundle warnings and route health once dev server is up.

## Bundle analysis
- Run pnpm build then ANALYZE=true pnpm dev or pnpm analyze (bundle analyzer) to capture size regressions; document top offenders and action items.

## Verification
- Typecheck: pnpm -s exec tsc -p tsconfig.json --noEmit
- Dev: pnpm dev (after fixing startup failures)
- E2E smoke (reuse server): pnpm -s exec cross-env REUSE_EXISTING_SERVER=true BASE_URL=http://localhost:3000 node scripts/run-playwright.mjs test e2e/smoke.spec.ts --project=chromium
- Targeted: categories flow, sell flow, product page navigation under Cache Components.
