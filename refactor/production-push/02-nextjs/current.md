# 02 — Next.js 16: Current State

---

## Version & Config

- **Next.js 16.1.6** with App Router
- **React 19.2.4** (Server Components default)
- `next.config.ts` features: `typedRoutes`, `cacheComponents`, 5 `cacheLife` profiles
- Middleware: `proxy.ts` (Next.js 16 convention — formerly `middleware.ts`)
- Build: AVIF+WebP images, `optimizePackageImports`, 10MB server action body limit

---

## Caching Setup

| Profile | Stale | Revalidate | Expire |
|---------|-------|------------|--------|
| categories | 5m | 1h | 1d |
| products | 1m | 5m | 1h |
| deals | 30s | 2m | 10m |
| user | 5m | 1h | 1d |
| max | 5m | 1h | 1d |

Pattern: `"use cache"` + `cacheLife()` + `cacheTag()` + `createStaticClient()`.

---

## Route Structure

| Route Groups | Count |
|-------------|-------|
| (main), (account), (auth), (sell), (checkout), (chat), (business), (admin), (onboarding), (plans), [username] | 11 |

Each has its own layout with route-group-specific shell.

---

## Middleware (`proxy.ts`)

Handles: i18n routing → geo detection → session refresh.
Skips: prefetch requests, `/api`, `/_next`, static files.
Passes: `x-pathname` header to layouts.

---

## Pain Points

### 1. Middleware naming risk
`proxy.ts` as "Next 16 convention" is **not standard** Next.js naming. Official docs confirm `middleware.ts` is the convention. Must verify `proxy.ts` works correctly in production builds, or rename to `middleware.ts`.

### 2. generateStaticParams duplication
14 files define `generateStaticParams`. Pattern breakdown:
- **6 layout files** return `routing.locales.map(locale => ({locale}))` — identical
- **5 page files** return `[]` (empty array for dynamic rendering) — identical
- **2 data files** fetch top 25 entities from Supabase — similar pattern
- **1 locale layout** combines with `setRequestLocale`

### 3. Dynamic routes from cookie reads
Some pages (e.g., `todays-deals/page.tsx`) become dynamic due to `cookies()` reads, reducing static benefits.

### 4. Sitemap lacks caching policy
`app/sitemap.ts` reads from DB on every request. No `revalidate` or `"use cache"` directive. No sitemap index strategy for >50K URLs.

### 5. placeholder static params
Dynamic auth-only pages return `[]` from `generateStaticParams` to satisfy the cache component system. These could generate weird placeholder URLs if not guarded.

### 6. Error/loading state coverage
`architecture:gate` reports `missingLoading=0` — good. But error states haven't been audited for quality/consistency across all route groups.

---

## Files to Review

| File | Issue |
|------|-------|
| `proxy.ts` | Middleware naming — verify Next 16 production compatibility |
| `app/sitemap.ts` | No caching strategy |
| `app/[locale]/layout.tsx` | generateStaticParams duplication root |
| All `(account|sell|checkout|chat|auth|business)/layout.tsx` | Duplicated static params |
| All `**/**/page.tsx` with `generateStaticParams: []` | Placeholder pattern |
