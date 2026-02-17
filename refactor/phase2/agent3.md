# Phase 2 — Agent 3: Dynamic Imports & Bundle Optimization

> **Scope:** Lazy-load heavy components. Optimize bundle configuration.
> **Read `refactor/shared-rules.md` first.**

---

## Dynamic Imports

Heavy components not needed on initial page load should use `next/dynamic` with `{ ssr: false }`.

**Pattern:**
```tsx
import dynamic from "next/dynamic"

const HeavyComponent = dynamic(
  () => import("@/components/path/to/component").then(m => m.ComponentName),
  { ssr: false, loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" /> }
)
```

## How to Work

### Step 1: Identify heavy components

Search for imports of known heavy libraries across `app/` and `components/`:
```bash
grep -rn "from ['\"]recharts" --include="*.tsx" --include="*.ts" app/ components/
grep -rn "from ['\"]framer-motion" --include="*.tsx" --include="*.ts" app/ components/
grep -rn "from ['\"]react-markdown" --include="*.tsx" --include="*.ts" app/ components/
grep -rn "from ['\"]photoswipe" --include="*.tsx" --include="*.ts" app/ components/
grep -rn "from ['\"]react-dropzone" --include="*.tsx" --include="*.ts" app/ components/
grep -rn "from ['\"]@ai-sdk" --include="*.tsx" --include="*.ts" app/ components/
```

### Step 2: Wrap in dynamic imports

For each component that uses heavy libraries and is NOT on the critical rendering path (above the fold, first paint), wrap it with `next/dynamic`.

**Strong candidates:**
| Component pattern | Why heavy | SSR needed? |
|---|---|---|
| Charts (recharts) | ~200KB | No — `{ ssr: false }` |
| AI chat (react-markdown + AI SDK) | ~150KB | No |
| Image galleries (photoswipe) | ~50KB | No |
| File upload zones (react-dropzone) | ~30KB | No |
| Cookie consent banners | Non-critical | No |
| Mobile drawers (loaded on user action) | Defer load | `{ ssr: false }` |
| Quick view modals (loaded on click) | Defer load | `{ ssr: false }` |

### Step 3: Check framer-motion usage

For each file importing `framer-motion`:
- Is the animation achievable with CSS/Tailwind (`tw-animate-css`)? → Replace and remove the import.
- Is it a critical above-the-fold animation? → Keep direct import.
- Is it below-the-fold or triggered by interaction? → Wrap parent in `next/dynamic`.

### Step 4: Verify `optimizePackageImports` in next.config.ts

Check that `next.config.ts` includes all barrel-export packages:
```bash
grep -A30 "optimizePackageImports" next.config.ts
```

Ensure these are listed (add any missing):
- `date-fns`, `recharts`, `lucide-react`, `framer-motion`
- All `@radix-ui/*` packages used in the project
- Any other barrel-export libraries found during the audit

### Step 5: Check for conditional/lazy patterns

```bash
# Find top-level imports of heavy packages in page files
grep -rn "^import.*from.*recharts\|^import.*from.*framer-motion\|^import.*from.*react-markdown\|^import.*from.*photoswipe" app/**/page.tsx
```

Page files should NOT directly import heavy libraries. They should import a wrapper component that is dynamically loaded.

## Special Notes

- Don't dynamically import shadcn/ui primitives — they're small and tree-shaken.
- Don't dynamically import layout-critical components (header, sidebar, bottom nav) — they're needed immediately.
- When adding `{ ssr: false }`, always provide a `loading` fallback (skeleton or null).
- The `loading` fallback should roughly match the component's dimensions to avoid layout shift.
- After wrapping with dynamic: verify the page still works correctly. Some components may depend on being server-rendered.

## Verification

After each dynamic import change: `pnpm -s typecheck`
After completing all changes: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`
Final: `pnpm build` — check that First Load JS per route hasn't increased (and ideally decreased).

## Output

- Components wrapped in `next/dynamic` (list + which library they pull in)
- framer-motion usages replaced with CSS (list)
- Packages added to `optimizePackageImports` (list)
- Estimated bundle size reduction per route (if measurable from build output)
