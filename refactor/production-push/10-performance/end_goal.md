# 10 — Performance: End Goal

---

## Principle

Ship zero unnecessary bytes. Cache aggressively. Log structurally.

---

## MotionProvider Elimination (REF-POLISH-001)

### Current: Global `MotionConfig` wrapping entire app with `reducedMotion="user"`
### Target: Per-route motion config, no global motion provider

#### Step 1: Delete MotionProvider
```diff
- // components/providers/motion-provider.tsx
- "use client";
- import { MotionConfig } from "framer-motion";
- export function MotionProvider({ children }) {
-   return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
- }
```

> **Important:** `reducedMotion="user"` behavior must be preserved.
> Add it to any component that uses framer-motion animations directly.

#### Step 2: Per-component motion config
```tsx
// components/shared/welcome-hero.tsx
"use client";
import { motion, MotionConfig } from "framer-motion";

export function WelcomeHero() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div animate={{ opacity: 1 }}>...</motion.div>
    </MotionConfig>
  );
}
```

#### Step 3: Route-level code splitting
```tsx
// For heavy animation pages (welcome flow):
import dynamic from "next/dynamic";
const WelcomeHero = dynamic(() => import("./welcome-hero"), { ssr: false });
```

### Result
- Routes with no animation: **0KB** framer-motion
- Welcome flow: ~16KB loaded once, on that route only
- Product grid: minimal animation import
- **Estimated saving: ~16KB gzip on all non-animated routes**

---

## Sitemap Caching (REF-POLISH-003)

```tsx
// app/sitemap.ts
"use cache";
import { cacheLife } from "next/cache";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  cacheLife("revalidate_1h");
  // ... existing Supabase queries
}
```

- Revalidates every hour instead of every request
- Crawlers get instant response from cache
- Supabase query load reduced to ~24/day

---

## Console → Logger Migration (REF-CLEANUP-007)

### The logger is ALREADY production-grade (lib/logger.ts, 132 lines)
Do NOT rewrite it. It already has:
- Structured JSON output
- Sensitive key redaction (auth, cookie, password, secret, token, api_key, jwt)
- Deep object serialization (3-level depth limit)
- String/array truncation
- Dev pretty-printing, prod structured output

### What’s needed: Mass migration only
```
111 console.* → logger.*
- console.error → logger.error (62 sites)
- console.warn  → logger.warn  (18 sites)
- console.log   → logger.info or logger.debug (31 sites)
```

### Optional: Add `debug` level
```ts
// If needed, add to existing logger:
debug(msg: string, meta?: LogMeta) {
  if (isDev) emit("debug", { ... });
}
```

### Lint rule (activate immediately after REF-CLEANUP-007, NOT Phase 3)
> **AUDIT NOTE:** Enable `no-console` right after logger migration completes to prevent
> new console.* from being introduced between Phase 1 and Phase 3.

```ts
// eslint.config.mjs
"no-console": ["error", { allow: [] }],
```

### Result
- Zero `console.*` in production code
- Structured, prefixed log output
- Debug logs suppressed in production
- Lint prevents regression

---

## Bundle Budget (REF-POLISH-008)

### Target Metrics
| Metric | Target | Enforcement |
|--------|--------|-------------|
| First Load JS (shared) | < 90KB | CI check |
| Per-route JS | < 150KB | CI check |
| framer-motion on non-animated routes | 0KB | Code review |
| Total page weight (mobile, 3G) | < 500KB | Lighthouse |

### Monitoring
```bash
# Add to CI pipeline
next build --profile
# Parse .next/analyze output for budget violations
```

---

## Image Performance

### Already Good — Maintain:
- AVIF + WebP format negotiation
- Sharp for server-side optimization
- `remotePatterns` for Supabase storage
- `normalizeImageUrl()` for consistent paths

### Enhance (REF-POLISH):
- Add `sizes` prop to all `<Image>` components for responsive srcset
- Audit placeholder strategy (blur vs. empty)
- Ensure priority flag on LCP images (hero, first product card)

---

## Caching Strategy Summary

| Resource | Cache Strategy | TTL |
|----------|---------------|-----|
| Static pages | ISR | varies by route |
| Sitemap | `"use cache"` | 1 hour |
| Product listings | `revalidate_30s` | 30s |
| Category data | `revalidate_5min` | 5 min |
| Static content | `static` | indefinite |
| User-specific data | **Never cache** | — |

---

## Post-Migration Cleanup

> **AUDIT NOTE:** After REF-CLEANUP-007 (logger migration) completes and `no-console` lint
> rule is active, the `removeConsole` compiler option in `next.config.ts` becomes redundant.
> Consider removing it to avoid confusion — lint prevents console.* at source, no need for
> build-time stripping.

---

## Acceptance Criteria

| Metric | Current | Target |
|--------|---------|--------|
| Global MotionProvider | 1 (wraps app) | 0 (deleted) |
| framer-motion global load | ~16KB gzip | 0KB on non-animated routes |
| console.* in code | 111 | 0 |
| Sitemap cache | None | 1h revalidation |
| Bundle budget CI | None | Enforced |
| `no-console` lint rule | Off | Error (activate after CLEANUP-007) |
| LCP image priority flags | Partial | All hero/first-card |
| `removeConsole` in next.config | Active | Remove after lint rule active |
