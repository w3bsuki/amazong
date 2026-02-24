# 02 — Next.js 16: End Goal

---

## Architecture Target

### Server Components First
- Pages and layouts are Server Components by default
- `"use client"` only at leaf components that need interactivity
- Client boundary pushed as low as possible in the component tree

### Middleware
- `proxy.ts` verified on production-like build
- If naming causes issues, add `middleware.ts` re-export + update docs
- Handles: i18n → geo → session refresh (unchanged)

### Caching Strategy
- Every data-fetching function has an explicit caching policy
- `"use cache"` + `cacheLife()` + `cacheTag()` for all static data
- `cookies()` reads isolated to components that genuinely need them
- No `cookies()` inside `"use cache"` functions ever

### Sitemap
- Explicit revalidation: `"use cache"` + `cacheLife("max")` + `cacheTag("sitemap")`
- Sitemap index strategy for >50K URLs (section by category/locale)
- Graceful fallback if DB unavailable

---

## Target Patterns

### generateStaticParams (centralized)

```ts
// lib/next/static-params.ts
import { routing } from "@/i18n/routing";

export function localeStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export function emptyStaticParams() {
  return [] as never[];
}
```

All layout files:
```ts
import { localeStaticParams } from "@/lib/next/static-params";
export const generateStaticParams = localeStaticParams;
```

All dynamic auth-only pages:
```ts
import { emptyStaticParams } from "@/lib/next/static-params";
export const generateStaticParams = emptyStaticParams;
```

### Route Metadata (standardized)

Every page exports `generateMetadata()` with:
- Locale-aware title + description
- OpenGraph image (shared helper)
- Twitter card
- Canonical URL
- `robots: { index: false }` for auth-only pages

Shared helper in `lib/seo/metadata.ts`:
```ts
export function createPageMetadata(opts: PageMetaOpts): Metadata { ... }
```

### Loading States
- Every route segment has `loading.tsx`
- Skeletons match content shape (no spinners)
- `missingLoading=0` maintained via architecture gate

### Error Handling
- Every route group has `error.tsx` with consistent UI
- `global-error.tsx` catches unhandled errors
- Error UI includes: error message, retry button, link to home
- Structured error reporting via logger

---

## Acceptance Criteria

- [ ] `proxy.ts` verified working in `next build` + production mode
- [ ] `generateStaticParams` uses shared helpers in all 14 files
- [ ] `app/sitemap.ts` has explicit caching + revalidation
- [ ] Every page has `generateMetadata()` (or inherits from layout)
- [ ] No `cookies()` inside `"use cache"` blocks
- [ ] Error states audited and consistent across all route groups
- [ ] `missingLoading=0` maintained
- [ ] Placeholder static params routes are `noindex`
