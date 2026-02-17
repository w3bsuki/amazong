# REFACTOR.md — Treido Full Codebase Audit, Refactor & Performance Sweep

> **Executor:** Codex CLI (autonomous, multi-session)
> **Mode:** AUDIT → THINK → FIX → VERIFY → ITERATE
> **Goal:** Clean architecture. Minimal JS. Server-first. Fast loads. No bloat. Production-grade codebase.
> **Site:** www.treido.eu (LIVE — don't break it)

---

## 0 · How You Work

You are an autonomous refactoring agent. You don't just follow a checklist — you **think**, **discover**, and **fix**.

### Mindset

1. **Read first, act second.** Before touching any folder, read every file in it. Understand what it does, who imports it, and whether it belongs there.
2. **Fetch latest docs.** Before auditing any tech area, fetch the latest official documentation (URLs provided per phase). Compare current code against latest recommended patterns.
3. **Find your own issues.** The phases below are a navigation guide, not an exhaustive list. If you find something wrong that isn't listed — fix it. If you're unsure — flag it in the session log.
4. **Think in layers.** Ask yourself: "Is this file in the right place? Does it follow naming conventions? Is it a server or client component? Could it be cached? Is it dead code? Does it import things it shouldn't?"
5. **Be aggressive but safe.** Remove everything that doesn't earn its place. But verify before deleting — grep for usage, check for Next.js magic files, run typecheck.

### Operating Rules

**Work one file at a time:**
- Read the file fully. Audit it against every applicable rule. Fix it. Verify. Move on.
- After modifying a file: `pnpm -s typecheck`
- After completing a folder: `pnpm -s typecheck && pnpm -s lint`
- After completing a phase: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

**Think deep before deleting:**
- Before deleting any file or export, verify ZERO usage:
  ```bash
  grep -rn "filename-or-export" --include="*.ts" --include="*.tsx" --include="*.mjs" --include="*.css" .
  ```
- Next.js magic files are NEVER dead: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `sitemap.ts`, `template.tsx`, `default.tsx`
- If a file is imported only by tests, it is NOT dead — keep it

**Use subagents for folder audits:**
- When auditing a folder with 5+ files, spawn a subagent to read every file, grep for imports/usage, and report findings BEFORE making changes.
- Aggregate findings, then fix from highest-impact to lowest.

**Log every meaningful decision** in the Session Log (section 9) — what you changed, why, and what risk level.

### Session Lifecycle

**Starting:**
```
1. Read this file (REFACTOR.md) completely.
2. Read AGENTS.md (project identity, conventions, rules, component map).
3. Read the Progress Tracker (section 8). Find the first unchecked area.
4. For the phase you're about to work on, read the relevant docs:
   - Architecture work → also read ARCHITECTURE.md
   - Styling work → also read docs/DESIGN.md
   - DB/auth/API work → also read docs/DOMAINS.md
5. Start working. Update the tracker as you go.
```

**During:**
- One phase at a time. One file at a time. Verify after every change.
- If you discover issues outside the current phase, note them in the session log for a future session — don't jump around.

**Ending:**
```
1. Run: pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
2. Run: pnpm -s test:unit
3. Update Progress Tracker checkboxes for everything completed
4. Append session summary to Session Log (section 9)
5. List: files changed, files deleted, decisions made, what's next
```

---

## 1 · Project Context

Treido is a mobile-first marketplace. Next.js 16, React 19, TypeScript, Tailwind CSS v4 (CSS-first config), shadcn/ui, Supabase (Postgres + RLS), Stripe Connect, next-intl (en/bg). 87% feature-complete, deployed at treido.eu.

### What's Already Been Done (2026-02-15/16)
- Dead files removed (components, routes, public assets, scripts)
- Route aliases consolidated to canonical paths
- Dead exports cleaned across lib/ and hooks/
- Demo routes renamed from versioned (v2/v3/v4) to semantic (feed/category-rails/discovery)
- Architecture boundary violations fixed
- select('*') removed from hot paths
- RLS policies tightened

### What Remains (This Sweep)
- Full architecture audit (naming, structure, placement)
- Server/client boundary optimization (200+ "use client" files)
- Bundle size reduction (deps, dynamic imports, tree-shaking)
- Caching strategy (underutilized "use cache")
- Code quality (duplicates, oversized files, dead code in live files)
- Route completeness (loading.tsx, metadata, streaming)
- Style cleanup (legacy CSS, inline styles)
- i18n quality (unused keys, parity)
- Test hygiene (stale specs, missing coverage on hot paths)

---

## 2 · Rules (Non-Negotiable)

### DO
- Remove unnecessary `"use client"` — default to Server Components
- Rename files that violate naming conventions (kebab-case, no version suffixes)
- Move misplaced files to their correct architectural location
- Add `next/dynamic` for heavy below-the-fold components
- Add `loading.tsx` to routes that need one
- Add `"use cache"` + `cacheLife()` + `cacheTag()` to read-heavy fetchers
- Replace `select('*')` with explicit column selection
- Consolidate duplicate logic into shared utilities
- Remove commented-out code blocks (>3 lines) — they live in git
- Split files over 300 lines into focused modules
- Fetch latest docs before auditing each tech area

### DON'T
- Touch DB schema, migrations, or RLS policies (`supabase/`)
- Touch auth/session/access control logic
- Touch payment/webhook/billing code (Stripe webhooks, Connect)
- Create new features — this is audit + refactor only
- Delete files without verifying zero usage via grep
- Remove `"use client"` from components that genuinely use hooks/handlers/browser APIs
- Break the existing i18n setup
- Modify test assertions (fix broken imports only)

### STOP AND FLAG (document, don't modify)
- Any file in `supabase/`, `app/api/checkout/webhook/`, `app/api/payments/webhook/`, `app/api/subscriptions/webhook/`, `app/api/connect/`
- Auth logic in `lib/auth/`, `components/providers/auth-state-manager.tsx`
- Stripe secrets or webhook signature verification
- Anything that feels like it could break payments or auth

---

## 3 · Latest Documentation (Fetch Before Each Phase)

Always check latest docs before auditing. Codex: use the context7 MCP tool or fetch_webpage if available.

| Area | URL |
|------|-----|
| **Next.js 16 App Router** | https://nextjs.org/docs/app |
| **Next.js Caching** | https://nextjs.org/docs/app/building-your-application/caching |
| **Next.js Server Components** | https://nextjs.org/docs/app/building-your-application/rendering/server-components |
| **Next.js Dynamic Import** | https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading |
| **Next.js Metadata** | https://nextjs.org/docs/app/building-your-application/optimizing/metadata |
| **Tailwind CSS v4** | https://tailwindcss.com/docs |
| **shadcn/ui** | https://ui.shadcn.com/docs |
| **Supabase SSR** | https://supabase.com/docs/guides/auth/server-side/nextjs |
| **next-intl App Router** | https://next-intl.dev/docs/getting-started/app-router |
| **Stripe Webhooks** | https://docs.stripe.com/webhooks |

---

## 4 · Naming & Structure Standards

### File Naming
| Type | Pattern | Example |
|------|---------|---------|
| Components | `kebab-case.tsx` | `product-card.tsx` |
| Hooks | `use-<name>.ts` | `use-is-mobile.ts` |
| Utilities | `kebab-case.ts` | `format-price.ts` |
| Server actions | `kebab-case.ts` in `_actions/` | `checkout.ts` |
| Types | `kebab-case.ts` in `lib/types/` | `product.ts` |
| Tests | `<source-name>.test.ts(x)` | `format-price.test.ts` |

**Forbidden patterns — rename on sight:**
- Version suffixes: ~~`home-v4.tsx`~~ → `home.tsx`
- Temp/backup names: ~~`sidebar-old.tsx`~~ → delete or rename
- Generic names: ~~`client.tsx`~~ → `<feature>-client.tsx` (e.g., `sell-orders-client.tsx`)
- Ambiguous: ~~`index.tsx`~~ that re-exports a single component → rename to the component name

### Architecture Boundaries

```
components/ui/         → shadcn primitives ONLY (no domain logic, no data fetching)
components/shared/     → shared composites (used by 2+ route groups)
components/layout/     → shells (header, sidebar, footer)
components/providers/  → thin React contexts
components/mobile/     → mobile-specific components
components/desktop/    → desktop-specific components
components/auth/       → auth forms

app/[locale]/(group)/_components/  → route-private (NEVER import across groups)
app/[locale]/(group)/_actions/     → route-private server actions
app/[locale]/(group)/_lib/         → route-private utilities
app/[locale]/_components/          → locale-level shared components

lib/                   → framework-agnostic (NO React imports, NO app/ imports)
hooks/                 → shared React hooks (used by 2+ route groups)
```

**Check every file is in the RIGHT place:**
- Is a route-private `_components/` file imported by another route group? → Move to `components/shared/`
- Is a `components/shared/` file only used by one route group? → Move to that route's `_components/`
- Is a file in `lib/` that imports React? → Move to `hooks/` or `components/`
- Is a file in `components/ui/` that has domain logic? → Move to `components/shared/`

---

## 5 · Known Bloat Signals (Discovered Issues)

Codex: start with these. But also **find your own** — these are not exhaustive.

| # | Signal | Severity | Detail |
|---|--------|----------|--------|
| B1 | **200+ "use client" files** | HIGH | Many are unnecessary. Audit each one — can it be server? |
| B2 | **Two icon libraries** | MEDIUM | `@phosphor-icons/react` AND `lucide-react` both installed. lucide is shadcn default. Audit usage — consolidate if possible. |
| B3 | **Heavy deps not tree-shaken** | HIGH | `framer-motion` (120KB+), `recharts` (200KB+), `photoswipe`, `react-markdown` not fully optimized |
| B4 | **3 AI SDK providers** | LOW | `@ai-sdk/google`, `@ai-sdk/groq`, `@ai-sdk/openai` — are all used? Remove unused. |
| B5 | **Missing `optimizePackageImports`** | HIGH | Many barrel-export packages not listed |
| B6 | **Missing dynamic imports** | HIGH | Heavy components (charts, AI chat, photoswipe, drawers) loaded eagerly |
| B7 | **Missing `loading.tsx`** | MEDIUM | Some routes lack loading states, causing blank screens |
| B8 | **Caching gaps** | HIGH | `"use cache"` underutilized — read-heavy pages re-fetch on every request |
| B9 | **Demo routes still exist** | LOW | `app/[locale]/(main)/demo/` — are these needed in production? |
| B10 | **Oversized files** | MEDIUM | Some components 400+ lines — should be split |
| B11 | **Barrel re-exports** | MEDIUM | `index.ts` files that pull in entire modules — hurt tree-shaking |
| B12 | **Client-side data fetching** | HIGH | useEffect+fetch patterns that should be server-side |

---

## 6 · Phases

### Phase 0: Baseline & Config ⏱️ ~30 min

**Goal:** Establish measurements. Apply free config wins.

**0A: Measure baseline:**
```bash
# Build and note output sizes
pnpm build 2>&1 | tee build-baseline.txt

# Bundle analysis
ANALYZE=true pnpm build
# Save the generated reports
```

**0B: Add `optimizePackageImports`** in `next.config.ts` → `experimental`:
```ts
optimizePackageImports: [
  'date-fns',
  'recharts',
  '@phosphor-icons/react',
  'lucide-react',
  'framer-motion',
  '@radix-ui/react-accordion',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-popover',
  '@radix-ui/react-select',
  '@radix-ui/react-tabs',
  '@radix-ui/react-tooltip',
]
```

**0C: Verify:** `pnpm -s typecheck && pnpm build`

---

### Phase 1: Architecture & Structure Audit ⏱️ ~2-3 hours

**Goal:** Every file in the right place, with the right name, following the right patterns.

**This is the thinking phase.** Read the whole codebase structure first. Then fix.

**1A: Scan for naming violations:**
```bash
# Find non-kebab-case .tsx/.ts files (excluding Next.js conventions)
find app/ components/ lib/ hooks/ -name "*.tsx" -o -name "*.ts" | grep -E "[A-Z]|_[a-z]" | grep -v node_modules | grep -v ".test." | grep -v "__tests__"
```
Rename violators to kebab-case. Update all imports.

**1B: Scan for misplaced files:**

For every file in `components/shared/`:
```bash
# How many route groups import this file?
grep -rn "FILENAME" app/ --include="*.tsx" --include="*.ts" -l | sed 's|app/\[locale\]/(\([^)]*\)).*|\1|' | sort -u | wc -l
```
- If imported by only 1 route group → move to that route group's `_components/`
- If imported by 0 → it's dead. Delete after verifying zero usage everywhere.

For every route-private `_components/` file:
```bash
# Is this imported outside its route group?
grep -rn "FILENAME" app/ --include="*.tsx" --include="*.ts" -l | grep -v "(CURRENT_GROUP)"
```
- If imported across groups → move to `components/shared/`

**1C: Scan for architecture violations:**
```bash
# lib/ importing React (forbidden)
grep -rn "from 'react'\|from \"react\"" lib/ --include="*.ts" --include="*.tsx"

# components/ui/ with domain logic (fetch, supabase, actions)
grep -rn "supabase\|createClient\|fetch(" components/ui/ --include="*.tsx"

# Cross-route-group imports
# For each route group, check if _components/ files are imported by other groups
```

**1D: Audit demo/test routes for production:**
- `app/[locale]/(main)/demo/` — Should this exist in production? If not, delete.
- `app/[locale]/(main)/registry/` — Is this a real feature or placeholder?
- `app/[locale]/(main)/gift-cards/` — Is this implemented or stub?
- `app/[locale]/(main)/members/` — Is this active?

For each questionable route:
```bash
# Does anything link to it?
grep -rn "/demo\|/registry\|/gift-cards\|/members" app/ components/ --include="*.tsx" --include="*.ts"
```
If zero internal links and no real content → flag for removal.

**1E: Audit barrel exports:**
```bash
find components/ lib/ hooks/ -name "index.ts" -o -name "index.tsx"
```
For each barrel file:
- Does it export everything from the module? → Risk of pulling in unused code
- Does it add value or just re-export? → If single re-export, consider removing the barrel

---

### Phase 2: Server/Client Boundary Audit ⏱️ ~3-4 hours

**Goal:** Every component is a Server Component unless it genuinely needs client-side interactivity. This is the HIGHEST IMPACT phase for bundle size.

**Fetch first:** Read https://nextjs.org/docs/app/building-your-application/rendering/server-components

**A component NEEDS "use client" ONLY if it directly uses:**
- `useState`, `useReducer`, `useEffect`, `useLayoutEffect`
- `useRef` (with DOM mutation — not just for forwarding)
- `useContext`, `createContext`
- Event handlers bound in JSX: `onClick`, `onChange`, `onSubmit`, `onKeyDown`, `onScroll`, `onFocus`, `onBlur`, `onMouseEnter`
- Browser APIs: `window`, `document`, `navigator`, `localStorage`, `sessionStorage`, `IntersectionObserver`, `ResizeObserver`
- `useTranslations()` from next-intl (this is client-only)
- Third-party hooks that need client context (`useForm`, `useCart`, etc.)

**A component does NOT need "use client" if it:**
- Only renders JSX with props (even if it imports a client component — parents can be server)
- Only uses `cn()`, `clsx()`, utility functions from `lib/`
- Only maps over data and renders children
- Uses `getTranslations()` instead of `useTranslations()` (server-side i18n)

**The Island Pattern (use this to split files):**
```tsx
// SERVER component (no "use client") — handles data, layout, translations
import { getTranslations } from "next-intl/server"
import { ProductCardClient } from "./product-card-client"

export async function ProductCard({ id }: { id: string }) {
  const t = await getTranslations("Product")
  const product = await getProduct(id){
  return <ProductCardClient product={product} addToCartLabel={t("addToCart")} />
}

// CLIENT component — only the interactive bits
"use client"
export function ProductCardClient({ product, addToCartLabel }: Props) {
  const [added, setAdded] = useState(false)
  return <button onClick={() => setAdded(true)}>{addToCartLabel}</button>
}
```

**Audit order (highest impact first):**
```
1. components/shared/product/card/         — product cards (rendered MANY times per page)
2. components/shared/product/              — rest of product components
3. components/shared/filters/              — filter UI (search page hot path)
4. components/layout/                      — layout shells
5. app/[locale]/_components/               — locale-level shared
6. app/[locale]/[username]/[productSlug]/  — PDP (biggest page, most components)
7. app/[locale]/(main)/_components/        — homepage/search components
8. app/[locale]/(sell)/_components/        — sell flow (many form fields)
9. app/[locale]/(checkout)/_components/    — checkout
10. app/[locale]/(account)/               — account pages
11. components/ui/                         — shadcn (many legitimately client)
12. components/mobile/ + components/desktop/
```

**Per file, ask these questions in order:**
1. Does this file have `"use client"`? → If no, skip (already server).
2. Does it directly use hooks/handlers/browser APIs? → If yes, keep `"use client"`. But...
3. Can the file be SPLIT? → Extract the server-safe parts (data, layout, translations) into a server wrapper. Keep only the interactive island as client.
4. Does it use `useTranslations()`? → Can the parent pass translations as props instead, making this a server component?
5. Is it a thin wrapper that just passes props to a client child? → Make it server — a server component CAN import and render a client component.

---

### Phase 3: Dynamic Imports & Code Splitting ⏱️ ~1-2 hours

**Goal:** Heavy components not needed on initial load should be lazy-loaded.

**Fetch first:** Read https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading

**Candidates for `next/dynamic`:**
| Component | Why | Import Pattern |
|-----------|-----|---------------|
| AI chat (`search-ai-chat.tsx`) | ai SDK + react-markdown (~150KB) | `{ ssr: false }` |
| Charts (`_components/charts/`) | recharts (~200KB) | `{ ssr: false }` |
| Quick view modals | Loaded on user click | `{ ssr: false }` |
| Photoswipe gallery | Loaded on "view full" click | `{ ssr: false }` |
| Cookie consent banner | Not critical path | `{ ssr: false }` |
| Category browse drawer | Loaded on menu tap | `{ ssr: false }` |
| Mobile drawers (cart, auth, messages, account) | Loaded on user action | `{ ssr: false, loading: () => null }` |
| framer-motion `AnimatePresence` | If wrapping non-critical UI | Consider CSS alternatives |
| react-dropzone (sell flow) | Only needed in upload step | `{ ssr: false }` |

**Pattern:**
```tsx
import dynamic from "next/dynamic"

const SearchAiChat = dynamic(
  () => import("@/components/shared/search/ai/search-ai-chat").then(m => m.SearchAiChat),
  { ssr: false, loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" /> }
)
```

**Also audit:**
- Are there `import` statements at the top of pages that pull in heavy modules unconditionally?
- Can any page-level component imports be wrapped in `Suspense` + dynamic?

---

### Phase 4: Data Layer & Caching ⏱️ ~2-3 hours

**Goal:** No over-fetching. Cache everything cacheable. Server-side data loading.

**Fetch first:** Read https://nextjs.org/docs/app/building-your-application/caching

**4A: Find remaining `select('*')`:**
```bash
grep -rn "select(['\"]\\*['\"])" app/ lib/ --include="*.ts" --include="*.tsx"
```
Replace each with explicit column list projecting only what's needed.

**4B: Add `"use cache"` to read-heavy fetchers:**

Scan `lib/data/`, `lib/supabase/`, and `app/` server components for data fetching. If a function reads public/semi-public data that doesn't change per-request:

```ts
async function getCategories() {
  "use cache"
  cacheLife("categories")
  cacheTag("categories")
  // ... query logic
}
```

**Cache profiles defined in next.config.ts:**
- `categories` — 5 min stale, 1 hour revalidate, 1 day expire
- `products` — 1 min stale, 5 min revalidate, 1 hour expire
- `deals` — 30 sec stale, 2 min revalidate, 10 min expire
- `user` — 5 min stale, 1 hour revalidate, 1 day expire
- `max` — 5 min stale, 1 hour revalidate, 1 day expire

**4C: Find client-side data fetching that should be server-side:**
```bash
# useEffect + fetch pattern
grep -rn "useEffect.*\n.*fetch(" app/ components/ --include="*.tsx" -A2
# Client-side supabase queries
grep -rn "createBrowserClient\|supabase\.from" components/ --include="*.tsx"
```
If data is available at render time → move to server component or server action.

**4D: Find N+1 queries:**
```bash
# Loops that query supabase
grep -rn "\.from(" app/ lib/ --include="*.ts" --include="*.tsx" -B3 | grep -E "for |\.map\(|\.forEach\("
```

**4E: Audit Supabase client usage (correct client per context):**
```bash
# Server Components using browser client (WRONG)
grep -rn "createBrowserClient" app/ --include="*.tsx" | grep -v '"use client"'
# API Routes not using route handler client (POTENTIALLY WRONG)
grep -rn "createClient()" app/api/ --include="*.ts"
```

Correct mapping:
| Context | Client |
|---------|--------|
| Server Components / Actions | `createClient()` |
| Cached reads (`"use cache"`) | `createStaticClient()` |
| Route handlers | `createRouteHandlerClient(request)` |
| Admin / webhooks | `createAdminClient()` |
| Browser / client components | `createBrowserClient()` |

---

### Phase 5: Dependency Diet ⏱️ ~1-2 hours

**Goal:** Remove unused deps. Consolidate duplicates. Lighten the bundle.

**5A: Run knip:**
```bash
pnpm -s knip
```
Act on every finding: remove unused deps, unused exports, unused files.

**5B: Icon library audit:**
```bash
# Count phosphor usage
grep -rn "@phosphor-icons/react" app/ components/ --include="*.tsx" -l | wc -l
# Count lucide usage
grep -rn "lucide-react" app/ components/ --include="*.tsx" -l | wc -l
```
- If one library has <10 usages → replace with equivalents from the other and remove
- If both are heavily used → make sure both are in `optimizePackageImports`
- lucide-react is the shadcn/ui default — prefer it when possible

**5C: AI SDK audit:**
```bash
grep -rn "@ai-sdk/google\|@ai-sdk/groq\|@ai-sdk/openai" app/ lib/ --include="*.ts" --include="*.tsx"
```
Remove unused providers. Verify remaining are server-only (not leaking to client bundle).

**5D: Heavy dependency alternatives:**
- `framer-motion` → Can any animations be pure CSS with tw-animate-css? Check each usage.
- `react-markdown` + `remark-gfm` → Only used in AI chat? If so, confirm it's dynamically imported.
- `boring-avatars` → Still used? If not, remove.
- `photoswipe` → Dynamically imported? If not, fix in Phase 3.

**5E: Duplicate code detection:**
```bash
pnpm -s dupes
```
Act on any 10+ line duplicated blocks.

---

### Phase 6: Route Completeness ⏱️ ~1-2 hours

**Goal:** Every route loads fast. Streaming. Loading states. SEO metadata. No waterfalls.

**6A: Add missing `loading.tsx`:**

Check every route directory that has a `page.tsx`:
```bash
# Windows-compatible: list all page.tsx directories missing loading.tsx
Get-ChildItem -Recurse -Filter page.tsx app/ | ForEach-Object {
  $dir = $_.DirectoryName
  if (-not (Test-Path "$dir/loading.tsx")) { Write-Host "MISSING: $dir" }
}
```
For each missing one, create a minimal skeleton:
```tsx
import { Skeleton } from "@/components/ui/skeleton"
export default function Loading() {
  return <div className="space-y-4 p-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>
}
```

**6B: Check for `generateMetadata()` or static `metadata` on all pages:**
```bash
grep -rL "generateMetadata\|export const metadata\|export const dynamic" app/[locale]/**/page.tsx
```
Pages missing metadata hurt SEO. Add at minimum: title, description, openGraph.

**6C: Check for data waterfalls in layouts:**
- Read every `layout.tsx`. If it fetches data synchronously, child `page.tsx` is blocked.
- Wrap data-dependent layout sections in `<Suspense>`.

**6D: Audit `error.tsx` coverage:**
```bash
# Which route groups have error.tsx?
find app/[locale] -name "error.tsx" -exec dirname {} \;
```
Every user-facing route group should have an error boundary.

---

### Phase 7: Styling & CSS Cleanup ⏱️ ~1 hour

**Goal:** Minimal CSS. Semantic tokens only. No legacy cruft.

**Fetch first:** Read `docs/DESIGN.md` and `app/globals.css`

**7A: Run style gates:**
```bash
pnpm -s styles:gate
```
Fix every violation. Reference the token maps in `app/globals.css`.

**7B: Audit `app/legacy-vars.css`:**
For each CSS variable defined, verify it's actually used:
```bash
grep -rn "var(--variable-name)" app/ components/ --include="*.tsx" --include="*.css"
```
Remove unused variables.

**7C: Audit `app/utilities.css` and `app/shadcn-components.css`:**
Same — remove anything unused.

**7D: Find inline styles:**
```bash
grep -rn "style={{" app/ components/ --include="*.tsx"
```
Convert to Tailwind classes. If impossible (truly dynamic values), keep but document why.

**7E: Check for `!important`:**
```bash
grep -rn "!important" app/ components/ --include="*.tsx" --include="*.css"
```
Remove if possible. This is a code smell.

---

### Phase 8: Code Quality Pass ⏱️ ~2-3 hours

**Goal:** No duplicates. No dead code. No oversized files. Clean, readable, maintainable.

**8A: Find oversized files:**
```bash
find app/ components/ lib/ hooks/ -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn | head -40
```
Files over 300 lines → split into focused modules. Common splits:
- Extract types/interfaces into a colocated `types.ts`
- Extract utility functions into a colocated `utils.ts`
- Extract sub-components into their own files

**8B: Remove commented-out code (>3 lines):**
```bash
# Find multi-line comment blocks
grep -rn "^\s*//" app/ components/ lib/ --include="*.tsx" --include="*.ts" | head -100
```
Commented-out code is dead weight. It lives in git history. Delete it.

**8C: Find TODO/FIXME/HACK comments:**
```bash
grep -rn "TODO\|FIXME\|HACK\|XXX\|TEMP" app/ components/ lib/ hooks/ --include="*.tsx" --include="*.ts"
```
For each: is it actionable? Fix it now, or remove the comment if it's stale.

**8D: Verify test health:**
```bash
pnpm -s test:unit
```
- Fix any broken tests (usually broken imports from refactoring)
- If a test file tests a deleted file → delete the test too
- Verify architecture boundary tests still pass

**8E: i18n audit:**
- Check EN/BG translation parity (run the existing test: `pnpm -s test:unit -- -t "i18n"`)
- Look for hardcoded strings in components that should be translated
- Look for unused translation keys

---

### Phase 9: Final Verification & Metrics ⏱️ ~30 min

1. **Full gate:**
   ```bash
   pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
   ```
2. **All tests:**
   ```bash
   pnpm -s test:unit
   ```
3. **Production build:**
   ```bash
   pnpm build 2>&1 | tee build-final.txt
   ```
4. **Compare with baseline:**
   - First Load JS: compare `build-baseline.txt` vs `build-final.txt`
   - Target: no route over 200KB First Load JS
   - Target: homepage First Load JS under 150KB
5. **Bundle analysis (optional):**
   ```bash
   ANALYZE=true pnpm build
   ```

---

## 7 · Subagent Deep Audit Template

When you encounter a folder with 5+ files, spawn a subagent with this prompt:

```
CONTEXT: You are auditing [FOLDER_PATH] for the Treido marketplace refactor.
PROJECT: Next.js 16 + React 19 + TypeScript + Tailwind v4 + shadcn/ui + Supabase.
RULES: Read AGENTS.md for project conventions. Read REFACTOR.md section 4 for naming/structure standards.

TASK: Audit every file in [FOLDER_PATH] and subdirectories.

FOR EACH FILE, answer:
1. NAMING: Is the filename kebab-case? No version suffixes? No temp names?
2. PLACEMENT: Does this file belong here per architecture rules?
3. CLIENT: Does it have "use client"? Does it NEED it? (search for hooks, handlers, browser APIs)
4. IMPORTS: Unused imports? Imports from wrong architectural layers?
5. SIZE: Over 300 lines? Could it be split?
6. DEAD CODE: Commented-out blocks? Unused functions/exports?
7. DATA: Any select('*')? Any client-side fetching that should be server-side?
8. STYLING: Inline styles? Palette classes? token-alpha shortcuts?
9. USAGE: Is this file imported by anything? (grep for it)

OUTPUT FORMAT (per file):
- ✅ CLEAN: [file] — no issues
- 🔧 FIX: [file] — [issue]: [suggested fix]
- 🗑️ DELETE: [file] — [reason: zero imports, dead code, etc.]
- 📦 MOVE: [file] → [new location] — [reason]
- ✂️ SPLIT: [file] — [how to split]
- ⚠️ FLAG: [file] — [needs human review, reason]

DO NOT MAKE CHANGES. Only report findings.
```

---

## 8 · Progress Tracker

Check off items as you complete them. **Update this in real-time.**

### Phase 0: Baseline & Config
- [x] Measured baseline build sizes
- [x] Added packages to `optimizePackageImports`
- [x] Verified build still works

### Phase 1: Architecture & Structure
- [x] Scanned for naming violations — fixed
- [x] Scanned for misplaced files — moved
- [x] Scanned for architecture boundary violations — fixed
- [x] Audited demo/stub routes — decided keep/delete
- [x] Audited barrel exports — cleaned

### Phase 2: Server/Client Boundary
- [ ] `components/shared/product/card/` — audited
- [ ] `components/shared/product/` (rest) — audited
- [ ] `components/shared/filters/` — audited
- [ ] `components/layout/` — audited
- [ ] `app/[locale]/_components/` — audited
- [ ] `app/[locale]/[username]/[productSlug]/` — audited
- [ ] `app/[locale]/(main)/_components/` — audited
- [ ] `app/[locale]/(sell)/_components/` — audited
- [ ] `app/[locale]/(checkout)/_components/` — audited
- [ ] `app/[locale]/(account)/` — audited
- [ ] `components/ui/` — audited
- [ ] `components/mobile/` + `components/desktop/` — audited

### Phase 3: Dynamic Imports
- [ ] AI chat → dynamic
- [ ] Charts/recharts → dynamic
- [ ] Quick view modals → dynamic
- [ ] Drawers → dynamic (where not critical)
- [ ] Photoswipe → dynamic
- [ ] Cookie consent → dynamic
- [ ] Other heavy components identified

### Phase 4: Data & Caching
- [ ] Eliminated remaining `select('*')`
- [ ] Added `"use cache"` to read-heavy fetchers
- [ ] Moved client-side fetches to server
- [ ] Checked for N+1 queries
- [ ] Verified correct Supabase client per context

### Phase 5: Dependencies
- [ ] Ran knip — acted on findings
- [x] Icon library audit — consolidated or optimized
- [ ] AI SDK audit — removed unused
- [ ] Heavy dep evaluation — lighter alternatives or dynamic
- [ ] Duplicate code detection — fixed

### Phase 6: Routes
- [ ] Added missing `loading.tsx`
- [ ] Added missing `generateMetadata()`
- [ ] Checked layouts for data waterfalls
- [ ] Added missing `error.tsx`

### Phase 7: Styling
- [ ] Style gates pass clean
- [ ] `legacy-vars.css` — removed unused
- [ ] `utilities.css` — removed unused
- [ ] Inline styles → Tailwind
- [ ] No `!important`

### Phase 8: Code Quality
- [ ] Oversized files (300+) split
- [ ] Commented-out code removed
- [ ] TODOs triaged (fixed or removed)
- [ ] Tests passing
- [ ] i18n parity verified

### Phase 9: Final
- [ ] Full gate clean (typecheck + lint + styles:gate)
- [ ] Unit tests pass
- [ ] Build succeeds
- [ ] First Load JS < 200KB per route
- [ ] Before/after metrics documented

---

## 9 · Session Log

> After each session, append a summary. This is how future sessions know what was done.

```
### Session N — YYYY-MM-DD
**Phase(s):** <which phases worked on>
**Duration:** ~Xh
**Changes:**
- <file>: <what changed and why>
**Deleted:**
- <file>: <reason — zero usage confirmed>
**Moved:**
- <old path> → <new path>: <reason>
**Decisions:**
- <choice made and reasoning>
**Flagged (needs human review):**
- <file>: <concern>
**Metrics:**
- Build size before: X KB | after: Y KB
- "use client" files before: X | after: Y
**Next session should:**
- <start with Phase X, subsection Y>
- <address flagged items if approved>
```

### Session 1 — 2026-02-16
**Phase(s):** Phase 0, Phase 1
**Duration:** ~3h
**Changes:**
- `next.config.ts`: expanded `experimental.optimizePackageImports` to the full Phase 0 package list.
- `app/[locale]/(main)/search/_components/filters/types.ts`: renamed from `_types.ts` and updated imports for naming compliance.
- `app/[locale]/(main)/search/_components/filters/_lib/category-utils.ts`: updated `../types` type import path.
- `app/[locale]/(main)/search/_components/filters/sections/category-navigation.tsx`: updated `../types` type import path.
- `app/[locale]/(main)/search/_components/filters/search-filters.tsx`: updated `./types` type import path.
- `app/[locale]/[username]/profile-client.tsx`: updated profile component imports to route-private location.
**Deleted:**
- None.
**Moved:**
- `components/shared/profile/index.ts` → `app/[locale]/[username]/_components/profile/index.ts`: shared profile UI was only consumed by the `[username]` route.
- `components/shared/profile/profile-header-sync.tsx` → `app/[locale]/[username]/_components/profile/profile-header-sync.tsx`: same route-private consolidation.
- `components/shared/profile/profile-settings-panel.tsx` → `app/[locale]/[username]/_components/profile/profile-settings-panel.tsx`: same route-private consolidation.
- `components/shared/profile/profile-shell.tsx` → `app/[locale]/[username]/_components/profile/profile-shell.tsx`: same route-private consolidation.
- `components/shared/profile/profile-stats.tsx` → `app/[locale]/[username]/_components/profile/profile-stats.tsx`: same route-private consolidation.
- `components/shared/profile/profile-tabs.tsx` → `app/[locale]/[username]/_components/profile/profile-tabs.tsx`: same route-private consolidation.
- `app/[locale]/(main)/search/_components/filters/_types.ts` → `app/[locale]/(main)/search/_components/filters/types.ts`: removed underscore-based filename violation.
**Decisions:**
- Kept `app/[locale]/(main)/demo/`, `app/[locale]/(main)/registry/`, `app/[locale]/(main)/gift-cards/`, and `app/[locale]/(main)/members/` because they are linked and have implemented page content.
- Kept existing `index.ts` barrels in `components/` because they are multi-export barrels with active imports (not single-file pass-throughs).
- Used `next experimental-analyze` after `ANALYZE=true pnpm build` because Turbopack does not emit bundle-analyzer reports through `@next/bundle-analyzer`.
**Flagged (needs human review):**
- `app/[locale]/(main)/demo/*`: route is active but appears partially demo-oriented; product decision needed on long-term production status.
- `app/[locale]/_components/*`: several components may be better moved to route-private or shared domains in a follow-up pass.
**Metrics:**
- Build baseline: captured in `build-baseline.txt` via `pnpm build`.
- Build after config update: `pnpm -s typecheck && pnpm build` passed.
- `"use client"` files before: 358 | after: 358.
**Next session should:**
- Start Phase 2 (`components/shared/product/card/` first) and reduce unnecessary client boundaries.
- Revisit flagged locale-level component placement and demo-route scope if product direction is confirmed.

### Session 2 — 2026-02-16
**Phase(s):** Phase 1 (completion pass)
**Duration:** ~1.5h
**Changes:**
- `app/[locale]/(sell)/sell/page.tsx`: updated import after client file rename.
- `app/[locale]/(sell)/sell/orders/page.tsx`: updated import after client file rename.
- `app/[locale]/(sell)/_components/fields/category-field.tsx`: updated `CategorySelector` import path after UI file rename.
- `app/[locale]/(sell)/_components/ui/index.ts`: updated barrel export path for `CategorySelector`.
- `app/[locale]/(sell)/_components/ui/category-selector.tsx`: renamed from folder-index component and fixed relative type import.
- `app/[locale]/(main)/categories/page.tsx`: switched `CategoryCircleVisual` import to route-private `(main)` component location.
- `app/[locale]/(main)/_components/category/subcategory-circles.tsx`: switched `CategoryCircleVisual` import to local route-private path.
- `app/[locale]/(main)/_components/category/subcategory-tabs.tsx`: switched `CategoryCircleVisual` import to local route-private path.
- `app/[locale]/(main)/_components/mobile-home.tsx`: switched `getCategoryIcon` import to route-private category utilities.
- `app/[locale]/(main)/_components/desktop/category-sidebar.tsx`: switched `getCategoryIcon` import to route-private category utilities.
- `app/[locale]/(main)/demo/_components/category-circles-simple.tsx`: switched `getCategoryIcon` import to route-private category utilities.
- `app/[locale]/(main)/demo/category-rails/demo-home.tsx`: switched `getCategoryIcon` import to route-private category utilities.
- `app/[locale]/(main)/demo/discovery/demo-home.tsx`: switched `getCategoryIcon` import to route-private category utilities.
- `app/[locale]/(main)/_components/category/category-circle-visual.tsx`: switched `category-icons` import to local route-private path.
- `__tests__/category-tone.test.ts`: updated import path after category utility move.
**Deleted:**
- None.
**Moved:**
- `app/[locale]/(sell)/sell/client.tsx` → `app/[locale]/(sell)/sell/sell-page-client.tsx`: removed generic `client.tsx` filename.
- `app/[locale]/(sell)/sell/orders/client.tsx` → `app/[locale]/(sell)/sell/orders/seller-orders-client.tsx`: removed generic `client.tsx` filename.
- `app/[locale]/(sell)/_components/ui/category-modal/index.tsx` → `app/[locale]/(sell)/_components/ui/category-selector.tsx`: removed ambiguous folder `index.tsx` naming.
- `components/shared/category/category-circle-visual.tsx` → `app/[locale]/(main)/_components/category/category-circle-visual.tsx`: component was consumed only by `(main)`.
- `components/shared/category/category-icons.tsx` → `app/[locale]/(main)/_components/category/category-icons.tsx`: utility was consumed only by `(main)` routes/components.
**Decisions:**
- Kept remaining `components/shared/*` single-group candidates that are consumed through `components/*` intermediates (e.g. quick-view/search/wishlist helpers used by locale-level shells) to avoid forcing route-private imports into shared component layers.
- Considered Phase 1 complete after naming scan was clean, route-private placement violations found in this pass were resolved, demo/stub route decision remained explicit, and barrel-export checks stayed valid.
**Flagged (needs human review):**
- `components/shared/filters/*`: still mainly `(main)`-oriented but referenced by shared component-layer modules; moving it route-private would require broader component-layer reshaping.
- `components/shared/product/*` utilities currently single-group by app usage in spots, but still transitively shared through shared product card/quick-view modules.
**Metrics:**
- `pnpm -s typecheck`: passed.
- `pnpm -s lint`: passed (warnings only).
- `pnpm -s styles:gate`: passed.
- `pnpm -s test:unit`: passed.
- `"use client"` files before: 358 | after: 358.
**Next session should:**
- Start Phase 2 with `components/shared/product/card/` server/client boundary splitting.
- Re-evaluate whether `components/shared/filters/*` should be moved with a coordinated move of `components/mobile/category-nav/*` consumers.

### Session 3 — 2026-02-17
**Phase(s):** Wave 0 (metrics rails), Wave 1 (route surface cleanup), Wave 2 (icon contract removal)
**Duration:** ~4h
**Changes:**
- `scripts/architecture-scan.mjs`: added repeatable architecture metrics scanner (client boundaries, oversized files, route completeness, duplicate blocks via jscpd) with baseline/gate mode.
- `package.json`: added `architecture:scan*` and `architecture:gate*` script family.
- `scripts/architecture-gate.baseline.json`: recorded baseline metrics before route/icon mutations.
- `next.config.ts`: removed stale phosphor optimize-import entry and added permanent redirects for deleted route surface.
- `app/[locale]/_components/site-footer.tsx`: replaced `/registry` link target with `/gift-cards`.
- `app/[locale]/_components/app-header.tsx`: removed demo route detection/allowlist handling.
- `app/[locale]/[username]/page.tsx`: removed demo-route hotfix fallback/import coupling.
- `eslint.config.mjs`: added hard legacy-icon import bans (`@/lib/icons/phosphor`, `@/lib/icons/tabler`, `@/lib/icons/lucide-picker`, `@/lib/icons/compat`, `@phosphor-icons/react`).
- `app/**`, `components/**`: migrated legacy icon imports to direct `lucide-react` imports and normalized legacy phosphor-only props.
**Deleted:**
- `app/[locale]/(main)/demo/**`: removed production demo route tree.
- `app/[locale]/(main)/registry/**`: removed legacy registry route tree.
- `lib/icons/compat.tsx`: removed compatibility abstraction.
- `lib/icons/lucide-picker.ts`: removed legacy picker indirection.
- `lib/icons/phosphor.ts`: removed phosphor compatibility surface.
- `lib/icons/tabler.ts`: removed tabler compatibility surface.
**Decisions:**
- Route surface default is now strict production-only: demo and registry are removed and canonicalized via redirects.
- Icon strategy is now direct-import only (`lucide-react`) with no local compatibility indirection.
**Flagged (needs human review):**
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` did not complete in this environment (route warm-up timeouts and early process termination before final pass/fail summary).
**Metrics:**
- Baseline (`scripts/architecture-gate.baseline.json`): files=777, `"use client"`=362, `>300`=125, `>500`=44, pages=91, missing loading=38, missing metadata=58, clones=259 (3.15%).
- After Wave 1/2 (`pnpm -s architecture:scan`): files=762, `"use client"`=357, `>300`=120, `>500`=43, pages=86, missing loading=34, missing metadata=54, clones=247 (3.06%).
**Next session should:**
- Start Wave 3 server/client boundary reduction in the fixed folder order (beginning with `components/shared/product/card`).
- Add dynamic imports for heavy non-critical UI surfaces (Wave 4) and rerun analyzer.
- Continue lint hardening toward <=120 warnings, prioritizing restricted imports and hook deps first.

---

*Created: 2026-02-17 | Last updated: 2026-02-17*
