# 🔧 PHASE 2: TECHNICAL DEBT & REFACTOR

> **Priority:** 🟡 Medium - Code quality and maintainability  
> **Estimated Time:** 2-4 hours  
> **Philosophy:** If it's not broken and not blocking, ship it first

---

## ⚠️ IMPORTANT DISCLAIMER

**This phase is about NECESSARY refactoring only.** 

Do NOT:
- Rewrite working code for "cleanliness"
- Add new abstractions
- Change folder structures that work
- Optimize prematurely

DO:
- Fix circular dependencies (breaks builds)
- Consolidate duplicate configs (confusion risk)
- Standardize what's inconsistent (maintenance cost)

---

## 🔴 CIRCULAR DEPENDENCIES

### Identified Issue
```
app/[locale]/(account)/account/sales/page.tsx 
  ↓ imports
app/[locale]/(account)/account/sales/sales-table.tsx
  ↓ imports (circular)
app/[locale]/(account)/account/sales/page.tsx
```

### Fix Strategy
Extract shared types to a separate file:

```typescript
// NEW FILE: app/[locale]/(account)/account/sales/types.ts
export interface SalesOrder {
  id: string;
  // ... shared type definitions
}
```

Then import from types.ts in both files.

- [ ] Identify all circular dependencies
- [ ] Extract shared types to separate files
- [ ] Verify with `pnpm build`

### Detection Command
```powershell
# Using madge (install if needed: npm install -g madge)
npx madge --circular --extensions ts,tsx app/ components/ lib/
```

---

## 📁 FILE EXTENSION INCONSISTENCY

### Current State
| Extension | Count | Location |
|-----------|-------|----------|
| `.ts` | Many | lib/, hooks/, config/ |
| `.tsx` | Many | components/, app/ |
| `.js` | 4 | scripts/ only |
| `.mjs` | 2 | eslint.config, postcss.config |

### Decision
- ✅ Keep `.ts`/`.tsx` for all source code
- ✅ Keep `.mjs` for ESM config files (eslint, postcss)
- ⚠️ Delete `.js` scripts (moving to cleanup phase)

**No action needed** - Current structure follows Next.js 16 conventions.

- [x] File extensions are correct ✅

---

## 🗂️ CONFIG FILE AUDIT

### Root Config Files
| File | Purpose | Keep? |
|------|---------|-------|
| `next.config.ts` | Next.js config | ✅ Yes |
| `tsconfig.json` | TypeScript config | ✅ Yes |
| `eslint.config.mjs` | ESLint flat config | ✅ Yes |
| `postcss.config.mjs` | PostCSS for Tailwind | ✅ Yes |
| `components.json` | shadcn/ui config | ✅ Yes |
| `next-env.d.ts` | Next.js types (auto-generated) | ✅ Yes |

### Config Directory
```
config/
├── category-icons.tsx      # Category icon mapping
├── mega-menu-config.ts     # Mega menu structure
└── subcategory-images.ts   # Subcategory image URLs
```

**Assessment:** Clean and organized. No changes needed.

- [x] Config files are organized ✅

---

## 📦 UNUSED EXPORTS ANALYSIS

### What Knip Found
206 unused exports across the codebase. 

### Strategy
**Do NOT bulk delete unused exports now.** Here's why:

1. **Tree-shaking handles it** - Unused exports don't affect bundle size
2. **Future use** - Exports may be needed later
3. **Risk** - Might break dynamic imports or external usage

### Action Items
Only clean these if they're clearly dead code:

```typescript
// lib/data/products.ts - Review these exports
filterByZone              // Duplicate of filterByShippingZone?
getFeaturedProducts       // Used?
getTopRatedProducts       // Used?
filterByShippingZone      // Used?

// components/sell/index.ts - Many re-exports
// KEEP - This is the public API for the sell module
```

- [ ] Review `lib/data/products.ts` exports (potential duplicates)
- [ ] SKIP other unused exports (low priority)

---

## 🏗️ FOLDER STRUCTURE VERIFICATION

### Next.js 16 App Router Structure (Verified ✅)
```
app/
├── [locale]/                    # i18n routing ✅
│   ├── (main)/                  # Main layout group ✅
│   ├── (account)/               # Account layout group ✅
│   ├── (auth)/                  # Auth layout group ✅
│   ├── (business)/              # Business dashboard group ✅
│   ├── (chat)/                  # Chat/messaging group ✅
│   ├── (checkout)/              # Checkout flow group ✅
│   ├── (plans)/                 # Subscription plans group ✅
│   ├── (sell)/                  # Sell flow group ✅
│   ├── [username]/              # Dynamic user profiles ✅
│   ├── error.tsx                # Locale error boundary ✅
│   ├── layout.tsx               # Locale layout ✅
│   ├── loading.tsx              # Locale loading ✅
│   └── not-found.tsx            # Locale 404 ✅
├── api/                         # API routes ✅
├── auth/                        # Auth callbacks ✅
├── actions/                     # Server actions ✅
├── global-error.tsx             # Global error boundary ✅
├── global-not-found.tsx         # Global 404 ✅
├── globals.css                  # Global styles ✅
├── robots.ts                    # SEO robots ✅
└── sitemap.ts                   # SEO sitemap ✅
```

**Assessment:** Folder structure follows Next.js 16 App Router best practices.

- [x] Folder structure is correct ✅

---

## 🔄 SUPABASE CLIENT PATTERNS

### Current Implementation (Verified Correct)
```typescript
// lib/supabase/server.ts
export function createClient()        // Auth operations (uses cookies)
export function createStaticClient()  // Cache-safe operations (no cookies)
export function createAdminClient()   // Admin operations (bypasses RLS)

// lib/supabase/client.ts
export function createClientBrowser() // Browser-side singleton
```

### Best Practices Checklist
- [x] Server components use `createClient()` or `createStaticClient()` ✅
- [x] Client components use `createClientBrowser()` ✅
- [x] Admin operations use `createAdminClient()` with service role ✅
- [x] `createStaticClient()` used for cacheable data ✅

**No refactoring needed** - Implementation follows Next.js 16 + Supabase SSR best practices.

---

## 🧩 COMPONENT ORGANIZATION

### Current Structure
```
components/
├── ui/                    # shadcn/ui primitives (66 files)
├── sell/                  # Sell flow components
├── sections/              # Homepage sections
├── business/              # Business dashboard
├── badges/                # Badge system
├── dropdowns/             # Search dropdowns
├── icons/                 # Custom icons
├── navigation/            # Navigation components
├── skeletons/             # Loading skeletons
├── category-subheader/    # Category navigation
└── [root components]      # ~70 feature components
```

### Assessment
Root `components/` folder is crowded with ~70 files. However:

1. **Not blocking production** - All imports work
2. **Risky to reorganize now** - Many import paths would break
3. **Post-launch task** - Organize into feature folders later

**Decision:** KEEP current structure. Reorganize post-launch if needed.

- [x] Components organization is acceptable ✅
- [ ] POST-LAUNCH: Consider grouping by feature

---

## 🔧 next.config.ts REVIEW

### Current Config (Verified with Next.js 16 MCP)
```typescript
const nextConfig: NextConfig = {
  // ✅ Cache Components enabled
  cacheComponents: true,
  
  // ✅ Custom cache life profiles
  cacheLife: {
    categories: { stale: 300, revalidate: 3600, expire: 86400 },
    products: { stale: 60, revalidate: 300, expire: 3600 },
    deals: { stale: 30, revalidate: 120, expire: 600 },
    user: { stale: 30, revalidate: 60, expire: 300 },
  },
  
  // ✅ Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    // ... remotePatterns configured
  },
  
  // ✅ Experimental features
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
    optimisticClientCache: true,
    optimizePackageImports: ['@phosphor-icons/react', 'date-fns', 'recharts'],
  },
  
  // ✅ Compression enabled
  compress: true,
};
```

**Assessment:** Config follows Next.js 16 best practices. No changes needed.

- [x] next.config.ts is optimized ✅

---

## 🔍 CODE PATTERNS TO FIX

### Pattern 1: Inconsistent Error Handling
**Current (inconsistent):**
```typescript
// Some files
try { ... } catch (error) { console.error(error); }

// Other files
try { ... } catch (error) { throw error; }

// Other files
try { ... } catch (error) { return { error: 'Failed' }; }
```

**Recommendation:** Standardize post-launch, not now.

### Pattern 2: Type Assertions
**Current (risky):**
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
```

**Better (for production):**
```typescript
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error('Missing STRIPE_SECRET_KEY');
const stripe = new Stripe(stripeKey, {});
```

**Decision:** LOW PRIORITY - Current code works, improve post-launch.

---

## 📋 REFACTOR CHECKLIST SUMMARY

### Must Do (Blockers)
- [ ] Fix circular dependencies if any exist

### Should Do (High Priority)
- [ ] Review duplicate exports in products.ts
- [ ] Verify no circular imports in build

### Skip for Now (Post-Launch)
- [ ] Error handling standardization
- [ ] Component folder reorganization
- [ ] Type assertion improvements
- [ ] Unused export cleanup

---

## 🏁 PHASE 2 COMPLETION CRITERIA

```powershell
# Run these checks before proceeding to Phase 3

# 1. No circular dependencies
npx madge --circular --extensions ts,tsx app/ components/ lib/
# Should return: "No circular dependencies found"

# 2. Build passes
pnpm build # SUCCESS

# 3. TypeScript passes
pnpm exec tsc --noEmit # No errors

# 4. ESLint passes (warnings OK)
pnpm lint # No errors (warnings acceptable)
```

---

## 💡 POST-LAUNCH REFACTOR BACKLOG

These are not blockers but should be addressed in v1.1:

1. **Reorganize components/** - Group by feature (auth/, product/, checkout/)
2. **Standardize error handling** - Create error handling utilities
3. **Add input validation** - Env var validation at startup
4. **Clean unused exports** - After monitoring what's actually used
5. **Add barrel files** - For cleaner imports

---

*Verified with: Next.js 16 MCP, TypeScript strict mode*
