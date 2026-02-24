# 10 — Performance: Current State

---

## Bundle & Loading

### Global MotionProvider (Bundle Issue)
```tsx
// components/providers/motion-provider.tsx (ACTUAL CODE)
"use client";
import { MotionConfig } from "framer-motion";
// Wraps ENTIRE app with reducedMotion="user"
// framer-motion imported globally — loaded on every page
```

**Impact:** framer-motion chunk loaded on every route, even routes with zero animation.
The provider itself is lightweight (`MotionConfig` only ships config, not animation runtime),
but importing from `framer-motion` at the root ensures the module is in the shared chunk.

### framer-motion Import Sites
| File | Usage |
|------|-------|
| `components/providers/motion-provider.tsx` | Global MotionConfig wrapper (`reducedMotion="user"`) |
| `components/shared/welcome-*.tsx` (×5) | Welcome flow animations |
| `components/shared/animated-sell-button.tsx` | Sell CTA |
| `components/layout/product-grid.tsx` | Grid appear animation |

5 of 8 sites are welcome-flow only (shown once per user).

### optimizePackageImports
```ts
// next.config.ts
optimizePackageImports: [
  "lucide-react",
  "@supabase/supabase-js",
  "recharts",
  "date-fns",
  "framer-motion",
],
```
Already configured — tree-shaking works for named imports.

### Recharts
- Already lazy-loaded via `next/dynamic` in seller dashboard
- Only loaded on routes that need charts

---

## Caching

### cacheLife Profiles (next.config.ts)
```ts
cacheLife: {
  revalidate_30s:  { revalidate: 30 },
  revalidate_60s:  { revalidate: 60 },
  revalidate_5min: { revalidate: 300 },
  revalidate_1h:   { revalidate: 3600 },
  static:          { revalidate: false },
},
```

### Sitemap — NOT CACHED
```ts
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Queries Supabase on every request
  // No "use cache" directive
}
```

### Static Generation
- `generateStaticParams` on locale routes
- 14 duplicated implementations across route groups (see 02-nextjs)
- Products/categories: server-fetched, not statically generated

---

## Console Noise

### 111 console.* statements in production code

| Type | Count | Impact |
|------|-------|--------|
| `console.error` | 62 | Fills server logs with unstructured noise |
| `console.warn` | 18 | Mixed with real warnings |
| `console.log` | 31 | Pure debug leaks |

### Logger Exists — Structured, But Underused
```ts
// lib/logger.ts (ACTUAL — 132 lines, NOT a simple wrapper)
// Features:
// - Structured JSON output (JSON.stringify per line)
// - Sensitive key redaction (authorization, cookie, password, secret, token, api_key, jwt)
// - Deep object serialization with depth limit (3 levels)
// - String truncation (500 chars)
// - Array truncation (50 items)
// - Dev-mode pretty printing, prod-mode structured
// - Log levels: info, warn, error
```
The logger is production-grade but almost never imported. 111 console.* calls bypass it entirely.

---

## Image Optimization

### Current Configuration
```ts
// next.config.ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
  ],
  formats: ["image/avif", "image/webp"],
},
```

### Image Utility
```ts
// lib/utils/image-utils.ts
export function normalizeImageUrl(url: string): string { /* ... */ }
export function getImageUrl(path: string, bucket?: string): string { /* ... */ }
```

Sharp is installed for server-side optimization.

---

## Middleware

```ts
// proxy.ts (custom middleware)
// Handles: locale routing, auth sessions, protected routes
// Runs on every request — no heavy computation
```

---

## Current Metrics (Estimated)

| Metric | Value | Status |
|--------|-------|--------|
| First Load JS (shared) | ~85-95KB | Acceptable |
| framer-motion global | ~16KB gzip | Wasteful |
| Largest page bundle | Unknown | Needs audit |
| Sitemap TTL | 0 (no cache) | Bad |
| Console noise | 111 statements | Unprofessional |
| Image optimization | Configured | Good |
| Package tree-shaking | Configured | Good |

---

## Known Non-Issues

- Recharts: already lazy-loaded ✅
- Icons: lucide-react in optimizePackageImports ✅
- Next.js Image: AVIF + WebP configured ✅
- Font loading: next/font/google with display swap ✅
