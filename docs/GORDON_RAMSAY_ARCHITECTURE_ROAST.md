# 🔥 GORDON RAMSAY'S NEXT.JS ARCHITECTURE ROAST 🔥

*"COME HERE, YOU!!"*

> **Audit Date:** January 1, 2026  
> **Codebase:** Treido Marketplace (amazong)  
> **Framework:** Next.js 16 + React 19 + Supabase + TypeScript  
> **Stats:** 634 TypeScript files, ~3.9MB of source code

Right, you lot call yourselves developers? This codebase is like a **three-star Michelin restaurant that's been run by DONKEYS**! Let me tell you what's WRONG with this kitchen!

---

## 📊 Executive Summary

| Metric | Value | Verdict |
|--------|-------|---------|
| Total TS/TSX Files | 634 | 🟡 Large but manageable |
| Component Folders | 21 | 🔴 Way too fragmented |
| Route Groups | 9 | 🟡 Borderline excessive |
| Context Providers | 8 | 🔴 Provider hell |
| Unit Test Files | 9 | 🔴 Criminally underdone |
| Icon Libraries | 3 | 🔴 Pick ONE |
| Console.log Count | 100+ | 🔴 Production noise |
| TypeScript Strictness | Excellent | ✅ Chef's kiss |

**Overall Grade: B-**

---

## 🍝 1. THE SPAGHETTI ARCHITECTURE

### Component Organization - IT'S BLOODY CHAOS!

```
components/
├── ai/
├── ai-elements/
├── auth/
├── buyer/         # 1 FILE
├── category/
├── charts/
├── common/
├── desktop/
├── dropdowns/
├── layout/
├── mobile/
├── navigation/
├── orders/
├── pricing/
├── promo/
├── providers/
├── sections/
├── seller/        # 2 FILES
├── shared/
├── support/
├── ui/            # 39 FILES (ALL SHADCN)
```

**21 FOLDERS** for components?! 

### Problems:
- The `buyer/` folder has **ONE FILE**
- The `seller/` folder has **TWO FILES**
- Did you create a folder for every time you sneezed?!

### Confusion:
- `components/common/` - What's "common"?
- `components/shared/` - WHAT'S THE DIFFERENCE?!
- `components/desktop/` AND `components/mobile/` - Duplicating components instead of RESPONSIVE DESIGN!

### Recommended Fix:
```
components/
├── features/      # Business logic components
│   ├── auth/
│   ├── cart/
│   ├── orders/
│   ├── products/
│   └── seller/
├── layout/        # Structural components
│   ├── headers/
│   ├── footers/
│   └── navigation/
├── shared/        # Reusable across features
└── ui/            # Primitives (shadcn)
```

---

## 🧀 2. THE CACHING SITUATION - IT'S RAW!

### The Good: next.config.ts

```typescript
cacheLife: {
  categories: { stale: 300, revalidate: 3600, expire: 86400 },
  products: { stale: 60, revalidate: 300, expire: 3600 },
  deals: { stale: 30, revalidate: 120, expire: 600 },
  user: { stale: 30, revalidate: 60, expire: 300 },
}
```

BEAUTIFUL config!

### The Bad: lib/data/products.ts

```typescript
'use cache'
cacheTag('categories', slug ? `category-hierarchy-${slug}` : 'category-hierarchy-all')
cacheLife('categories')
```

Proper `'use cache'` directive usage - BRILLIANT!

### The UGLY: hooks/use-categories-cache.ts

```typescript
// Global cache state (outside React to persist across component instances)
let categoriesCache: Category[] | null = null
let cachedDepth: number = 0
let categoriesFetching = false
let categoriesCallbacks: Array<(cats: Category[]) => void> = []
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes TTL
```

**YOU'RE CACHING THE SAME DATA TWICE!** 

- Server-side with `'use cache'`
- Client-side with module variables

### Fix:
Remove the manual client-side cache. Use React Server Components with `'use cache'` and pass data as props. If client-side state is needed, use React Query or SWR with proper cache coordination.

---

## 🥩 3. THE CLIENT/SERVER BOUNDARY - REVOLVING DOOR!

### UI Components: All Client-Side

Your `components/ui/` folder has **39 FILES - ALL `"use client"`!**

```typescript
"use client" // tooltip.tsx
'use client' // toggle.tsx
'use client' // toggle-group.tsx
'use client' // toast.tsx
```

Some with double quotes, some with single quotes - **PICK A STYLE!**

### Category Rail: Should Be Server Component

```typescript
// components/shared/category-rail.tsx
"use client"

export function MobileCategoryRail({ locale }: MobileCategoryRailProps) {
  const { categories: fetchedCategories, isLoading } = useCategoriesCache()
```

You're fetching categories on the **CLIENT** when you have perfectly good Server Components!

### Fix:
```typescript
// components/shared/category-rail.tsx (Server Component)
import { getCategoryHierarchy } from '@/lib/data/categories'

export async function MobileCategoryRail({ locale }: MobileCategoryRailProps) {
  const categories = await getCategoryHierarchy() // Uses 'use cache' internally
  return <CategoryRailUI categories={categories} locale={locale} />
}
```

---

## 🍳 4. THE PROVIDER SOUP - SEVEN LAYERS OF HELL!

```
components/providers/
├── auth-state-listener.tsx
├── cart-context.tsx
├── message-context.tsx
├── prompt-input-context.tsx
├── sonner.tsx
├── theme-provider.tsx
├── wishlist-context.tsx
```

Plus `app/[locale]/locale-providers.tsx`!

### Current Nesting:

```jsx
<NextIntlProvider>
  <ThemeProvider>
    <CartProvider>
      <WishlistProvider>
        <AuthStateListener>
          <MessageProvider>
            <PromptInputProvider>
              <SonnerProvider>
                {children}
              </SonnerProvider>
            </PromptInputProvider>
          </MessageProvider>
        </AuthStateListener>
      </WishlistProvider>
    </CartProvider>
  </ThemeProvider>
</NextIntlProvider>
```

**EIGHT WRAPPERS** around your children! Every render cascades through this!

### Fix:
Consider Zustand or Jotai - **ONE STORE TO RULE THEM ALL!**

```typescript
// lib/store.ts
import { create } from 'zustand'

interface AppStore {
  cart: CartItem[]
  wishlist: WishlistItem[]
  messages: Message[]
  // ... combine all state
}

export const useStore = create<AppStore>((set) => ({
  // Single store, multiple slices
}))
```

---

## 🐄 5. THE CONSOLE.LOG INFESTATION

**100+ console.log/warn/error statements scattered throughout!**

From `docs/CODEBASE_ROAST_AUDIT.md`:
> **Problem:** 100+ console.log/warn/error statements scattered throughout.

**YOU ALREADY KNEW ABOUT THIS!** And did you fix it? **NO!**

### Fix: Create a Logger

```typescript
// lib/logger.ts
const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  debug: (message: string, meta?: unknown) => {
    if (isDev) console.debug(`[DEBUG] ${message}`, meta ?? '')
  },
  info: (message: string, meta?: unknown) => {
    console.info(`[INFO] ${message}`, meta ?? '')
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(`[WARN] ${message}`, meta ?? '')
  },
  error: (message: string, error?: unknown, meta?: unknown) => {
    console.error(`[ERROR] ${message}`, { error, ...meta })
    // Optional: Send to error tracking service
  },
}
```

Then global find/replace:
- `console.log` → `logger.debug`
- `console.warn` → `logger.warn`
- `console.error` → `logger.error`

---

## 🍖 6. THE ERROR HANDLING - ACTUALLY DECENT!

### ✅ What's Good:

**app/global-error.tsx:**
```typescript
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Proper error UI with retry button
}
```

**app/[locale]/error.tsx:**
```typescript
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorBoundaryUI error={error} reset={reset} />
}
```

### 🔴 What's Bad: Mock Supabase in Production

**lib/supabase/client.ts:**
```typescript
const mockQueryBuilder = {
  select: () => mockQueryBuilder,
  eq: () => mockQueryBuilder,
  neq: () => mockQueryBuilder,
  gt: () => mockQueryBuilder,
  gte: () => mockQueryBuilder,
  lt: () => mockQueryBuilder,
  lte: () => mockQueryBuilder,
  like: () => mockQueryBuilder,
  ilike: () => mockQueryBuilder,
  is: () => mockQueryBuilder,
  in: () => mockQueryBuilder,
  contains: () => mockQueryBuilder,
  containedBy: () => mockQueryBuilder,
  overlaps: () => mockQueryBuilder,
  textSearch: () => mockQueryBuilder,
  match: () => mockQueryBuilder,
  not: () => mockQueryBuilder,
  or: () => mockQueryBuilder,
  filter: () => mockQueryBuilder,
  single: () => Promise.resolve({ data: null, error: null }),
  maybeSingle: () => Promise.resolve({ data: null, error: null }),
  // ...more
}
```

That's a **40-LINE MOCK** in production code! 

### Fix:
Move to `test/mocks/supabase.ts` and use dependency injection or environment-based imports.

---

## 🥬 7. THE TYPE SITUATION - SURPRISINGLY STRICT!

### ✅ Excellent tsconfig.json:

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true
  }
}
```

This is **CHEF'S KISS** level TypeScript configuration!

### 🟡 The Surrender Flag:

```typescript
// lib/data/products.ts
/** Product attributes - Json from DB, we accept any */
attributes?: import("@/lib/supabase/database.types").Json | null
```

**"WE ACCEPT ANY"** - THE SURRENDER FLAG OF TYPESCRIPT!

### Fix:
Create proper attribute types:

```typescript
interface ProductAttribute {
  name: string
  value: string | number | boolean
  type: 'text' | 'number' | 'boolean' | 'select'
}

interface Product {
  attributes?: ProductAttribute[] | null
}
```

---

## 🧅 8. THE ROUTE GROUPS - NESTED LIKE ONIONS!

```
app/[locale]/
├── (account)/
├── (admin)/
├── (auth)/
├── (business)/
├── (chat)/
├── (checkout)/
├── (main)/
├── (plans)/
├── (sell)/
├── [username]/
├── [...notFound]/
```

**NINE route groups plus two dynamic segments!**

### (main) Folder Explosion:

```
(main)/
├── (legal)/
├── (support)/
├── about/
├── accessibility/
├── advertise/
├── affiliates/
├── blog/
├── careers/
├── cart/
├── categories/
├── free-shipping/
├── gift-cards/
├── investors/
├── members/
├── product/
├── registry/
├── search/
├── seller/
├── sellers/
├── store-locator/
├── suppliers/
├── todays-deals/
├── wishlist/
├── _components/
├── _lib/
```

**26 ROUTES** under (main) alone!

### Fix:
Static content pages like `/about`, `/careers`, `/investors` should be:
1. In a CMS (Contentful, Sanity, or even MDX files)
2. Generated from a single `[slug]/page.tsx` dynamic route

---

## 🥕 9. THE DATA LAYER - SPLIT PERSONALITY!

You've got THREE places for product data:

| Location | Lines | Purpose |
|----------|-------|---------|
| `app/actions/products.ts` | 597 | Server Actions |
| `app/api/products/route.ts` | 176 | API Route Handler |
| `lib/data/products.ts` | 732 | Data Fetching |

**THREE DIFFERENT PLACES to manage products!** Which one do I use?!

### Current Confusion:
- Creating a product? → `app/actions/products.ts` OR `app/api/products/route.ts`?
- Fetching products? → `lib/data/products.ts`
- Updating products? → ????

### Recommended Pattern:

```
lib/data/
├── products/
│   ├── queries.ts     # 'use cache' data fetching
│   ├── mutations.ts   # Server Actions for create/update/delete
│   └── types.ts       # Shared types
```

Keep API routes ONLY for:
- Webhooks (Stripe, Supabase)
- External integrations
- Public API endpoints

---

## 🌶️ 10. THE ESLINT CONFIG - 384 LINES OF RULES!

### ✅ Impressive Route Isolation:

```javascript
function getRouteOwnedPatternsForGroup(group) {
  const routeGroup = `(${group})`;
  return [
    {
      group: [
        `**/${routeGroup}/_components`,
        `**/${routeGroup}/_components/**`,
        `**/${routeGroup}/_lib`,
        `**/${routeGroup}/_lib/**`,
        `**/${routeGroup}/_actions`,
        `**/${routeGroup}/_actions/**`,
      ],
      message: `Route-owned (${group}) code is private to the ${routeGroup} route group.`,
    },
  ];
}
```

This is **EXCELLENT** architectural boundary enforcement!

### 🔴 eslint-disable Violations:

```typescript
// eslint-disable-next-line react-hooks/exhaustive-deps
```

This appears **5 TIMES** in:
- `components/desktop/desktop-filter-modal.tsx` (2x)
- `components/common/filters/mobile-filters.tsx`
- `app/[locale]/(account)/account/orders/_components/account-orders-toolbar.tsx`
- `app/[locale]/(account)/account/wishlist/_components/account-wishlist-toolbar.tsx`

If you need to disable hook rules, your hooks are WRONG!

---

## 🍰 11. THE TESTING - CRIMINALLY UNDERDONE!

### Unit Tests:

```
__tests__/
├── currency.test.ts
├── format-price.test.ts
├── image-utils.test.ts
├── normalize-image-url.test.ts
├── order-status.test.ts
├── product-card-hero-attributes.test.ts
├── product-price.test.tsx
├── safe-json.test.ts
└── url-utils.test.ts
```

**9 UNIT TEST FILES** for 634 source files!

| Metric | Value |
|--------|-------|
| Source Files | 634 |
| Test Files | 9 |
| Coverage (by file) | 1.4% |

### Missing Tests:
- ❌ Component tests
- ❌ Hook tests
- ❌ Integration tests
- ❌ Server Action tests
- ✅ E2E tests (good coverage)

### Recommended Test Structure:

```
__tests__/
├── unit/
│   ├── lib/           # Pure function tests
│   ├── hooks/         # Custom hook tests
│   └── utils/         # Utility function tests
├── integration/
│   ├── actions/       # Server Action tests
│   └── api/           # API route tests
└── components/
    ├── ui/            # UI component tests
    └── features/      # Feature component tests
```

---

## 🍜 12. THE PACKAGE.JSON - DEPENDENCY BLOAT

### THREE Icon Libraries:

```json
{
  "@phosphor-icons/react": "^2.1.10",
  "@tabler/icons-react": "^3.35.0",
  "lucide-react": "^0.560.0"
}
```

**PICK ONE!** That's potentially **thousands of icons** bloating your bundle!

### Recommendation:
- **Keep:** `@phosphor-icons/react` (best variety, weight variants)
- **Remove:** `lucide-react`, `@tabler/icons-react`

### Migration Script:
```bash
# Find all icon imports
grep -r "from 'lucide-react'" --include="*.tsx" --include="*.ts"
grep -r "from '@tabler/icons-react'" --include="*.tsx" --include="*.ts"

# Replace with Phosphor equivalents
# ArrowRight (lucide) → ArrowRight (phosphor)
# IconHome (tabler) → House (phosphor)
```

---

## ✅ WHAT YOU ACTUALLY DID RIGHT

### 1. Next.js 16 Adoption
- `cacheLife` profiles configured
- `cacheTag` for granular invalidation
- `'use cache'` directives in data layer

### 2. TypeScript Strict Mode
- `noUncheckedIndexedAccess` prevents undefined access
- `exactOptionalPropertyTypes` catches property bugs
- Zero `any` types in strict mode

### 3. Route Group Isolation
- ESLint rules preventing cross-route imports
- `_components`, `_lib`, `_actions` convention
- Clear boundaries between features

### 4. Zod Validation
- All Server Actions validate input
- API routes have schema validation
- Proper error messages returned

### 5. Error Boundaries
- Global error handler exists
- Locale-level error handling
- Proper reset functionality

### 6. i18n Setup
- next-intl properly configured
- `generateStaticParams` for all locales
- Bulgarian + English support

### 7. Supabase Architecture
- `createClient` - Browser client
- `createStaticClient` - Cookie-free for caching
- `createRouteHandlerClient` - For API routes
- `createAdminClient` - For privileged operations

---

## 📋 THE GORDON RAMSAY FIX LIST

### 🔴 P0 - Fix Immediately

| Issue | Location | Fix |
|-------|----------|-----|
| 3 icon libraries | `package.json` | Remove lucide-react and @tabler/icons-react |
| Client-side cache duplication | `hooks/use-categories-cache.ts` | Remove manual cache, use RSC |
| 100+ console.log | Throughout codebase | Create `lib/logger.ts`, global replace |
| Mock Supabase in prod | `lib/supabase/client.ts` | Move to `test/mocks/` |

### 🟠 P1 - Fix This Sprint

| Issue | Location | Fix |
|-------|----------|-----|
| 21 component folders | `components/` | Consolidate to 5-6 folders max |
| 8 Context providers | `components/providers/` | Migrate to Zustand |
| 3 product data sources | `app/actions/`, `app/api/`, `lib/data/` | Merge into unified pattern |
| Quote inconsistency | `components/ui/*.tsx` | ESLint rule for double quotes |
| 5 eslint-disable | Various | Fix the actual hook issues |

### 🟡 P2 - Fix This Month

| Issue | Location | Fix |
|-------|----------|-----|
| Static pages in routes | `app/[locale]/(main)/` | Move to MDX or CMS |
| 9 unit tests | `__tests__/` | Target 50+ for critical paths |
| Split data layer | `lib/data/`, `app/actions/` | Document clear ownership |

---

## 🎯 Suggested Refactoring Order

### Week 1: Quick Wins
1. ✅ Remove extra icon libraries
2. ✅ Create logger utility
3. ✅ Replace console.* calls
4. ✅ Move mock to test directory

### Week 2: Component Restructure
1. Merge `common/` and `shared/`
2. Move device-specific to responsive
3. Consolidate single-file folders
4. Update all imports

### Week 3: State Management
1. Install Zustand
2. Create unified store
3. Migrate cart context
4. Migrate wishlist context
5. Remove old providers

### Week 4: Testing
1. Set up component testing
2. Add hook tests
3. Add Server Action tests
4. Target 30% coverage

---

## 🏆 FINAL VERDICT

**Grade: B-**

This codebase is like a talented chef who learned from YouTube tutorials - you know the techniques (Next.js 16 caching, TypeScript strict mode, route isolation) but your kitchen is a **DISASTER ZONE**.

You've built an e-commerce marketplace with:
- ✅ Internationalization (Bulgarian + English)
- ✅ Supabase backend
- ✅ Stripe payments
- ✅ AI chat features
- ✅ Seller/buyer marketplace

**THAT'S AMBITIOUS!** But the architecture screams "I added features faster than I refactored."

### The Path Forward:

1. **Stop adding features** for 2 weeks
2. **Consolidate** the component structure
3. **Unify** the data layer
4. **Test** the critical paths
5. **Document** the patterns

And remember: **"This kitchen has POTENTIAL, but right now it's running on CHAOS!"**

---

*🔥 Now get back in there and CLEAN IT UP! Service! 🔥*

---

**Audit performed by:** GitHub Copilot (channeling Gordon Ramsay)  
**Date:** January 1, 2026  
**Next review:** After P0 items are resolved
