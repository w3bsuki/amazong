# 🔥 ROOT CONFIG FILES AUDIT

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 4 |
| 🟠 HIGH | 8 |
| 🟡 MEDIUM | 10 |
| 🟢 LOW | 5 |

---

## 🔴 CRITICAL ISSUES

### 1. `@supabase/supabase-js` IN WRONG CATEGORY

**File:** `package.json`  
**Line:** 110

**Problem:** `@supabase/supabase-js` is in `devDependencies` but it's being USED IN PRODUCTION CODE!

**Affected Files:**
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `app/api/*/route.ts`

**Impact:** Production builds will EXPLODE when deployed to environments that only install production deps!

**Fix:**
```json
// MOVE FROM devDependencies TO dependencies:
"@supabase/supabase-js": "^2.84.0"
```

---

### 2. THREE ICON LIBRARIES - BUNDLE OBESITY

**File:** `package.json`  
**Lines:** 47, 74, 137

You've got:
- `@phosphor-icons/react` (Line 47) - Used in mobile components
- `lucide-react` (Line 137) - shadcn default
- `@tabler/icons-react` (Line 74) - Used in account components

**Impact:** ~200KB+ of duplicated icon code shipped to users!

**Fix:** Standardize on ONE library (recommend `lucide-react` as shadcn default):
```bash
pnpm remove @tabler/icons-react @phosphor-icons/react
```

---

### 3. MISSING SECURITY HEADERS

**File:** `next.config.ts`

NO SECURITY HEADERS! An e-commerce site handling user data and payments with NO CSP, NO X-Frame-Options, NO HSTS!

**Fix:**
```typescript
// Add to next.config.ts:
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      ],
    },
  ];
},
```

---

### 4. KNIP CONFIGURATION BROKEN

**File:** `knip.json`

Running `knip` throws `ERR_INVALID_ARG_TYPE` - your dead code detection tool IS DEAD ITSELF!

**Unused files detected before crash:**
- `app/api/og/route.tsx`
- `lib/image-compression.ts`
- `components/ui/use-toast.ts`
- `components/ui/toaster.tsx`

**Fix:** Update knip config or upgrade knip version:
```bash
pnpm update knip
```

---

## 🟠 HIGH SEVERITY ISSUES

### 5. MIDDLEWARE SPLIT ACROSS TWO FILES

**Files:** `middleware.ts`, `middleware.entry.ts`

Next.js expects `middleware.ts` at root, but you've created a Frankenstein setup with `middleware.ts` delegating to `middleware.entry.ts`.

**Fix:** Rename `middleware.entry.ts` to `middleware.ts` and consolidate.

---

### 6. DUPLICATE LUCIDE-REACT VERSIONS IN LOCKFILE

**File:** `pnpm-lock.yaml`  
**Lines:** 4548-4553

Two versions in lockfile:
- `lucide-react@0.542.0`
- `lucide-react@0.560.0`

**Fix:**
```bash
pnpm dedupe
```

---

### 7. TYPESCRIPT TARGET TOO LOW

**File:** `tsconfig.json`  
**Line:** 7

`target: "ES6"` - You're targeting 2015 JavaScript when your runtime (Node 22, modern browsers) supports ES2022+!

**Fix:**
```json
"target": "ES2022"
```

---

### 8. VITEST CONFIG EXCLUDES ITSELF FROM TYPECHECK

**File:** `vitest.config.ts`  
**Line:** 32

`vitest.config.ts` is excluded from TypeScript compilation = NO TYPE CHECKING on test config!

**Fix:** Create separate `tsconfig.node.json` for config files.

---

### 9. ESLINT RULES ALL SET TO "WARN" - TOOTHLESS TIGER!

**File:** `eslint.config.mjs`  
**Lines:** 60-290

Nearly EVERY rule is set to `"warn"` instead of `"error"`. Warnings don't block CI!

**Key offenders:**
- `@typescript-eslint/no-explicit-any`: "warn" (Line 113)
- `@typescript-eslint/no-non-null-assertion`: "warn" (Line 114)
- `no-restricted-imports`: "warn" (Line 71)

**Fix:** Upgrade critical rules to `"error"` after fixing existing issues.

---

### 10. MISSING ESLINT-IMPORT-PLUGIN

**File:** `eslint.config.mjs`

You're using `import/no-anonymous-default-export` rule but have no explicit `eslint-plugin-import` in devDependencies!

**Fix:**
```bash
pnpm add -D eslint-plugin-import
```

---

### 11. PLAYWRIGHT `__dirname` USAGE

**File:** `playwright.config.ts`  
**Line:** 56

Using `__dirname` in ESM context. This works but is deprecated.

**Fix:**
```typescript
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
```

---

### 12. `components.json` MISSING TAILWIND CONFIG PATH

**File:** `components.json`  
**Line:** 15

`tailwind.config` is set to empty string `""`. shadcn CLI can't properly detect your Tailwind setup!

**Note:** You're using Tailwind v4 with `@tailwindcss/postcss` - there IS no config file. But shadcn may not handle this properly.

---

## 🟡 MEDIUM SEVERITY ISSUES

### 13. NO COVERAGE THRESHOLDS IN VITEST

**File:** `vitest.config.ts`  
**Lines:** 21-28

Coverage configured but NO THRESHOLDS! Tests can have 0% coverage and still pass!

**Fix:**
```typescript
coverage: {
  provider: 'v8',
  thresholds: {
    statements: 70,
    branches: 70,
    functions: 70,
    lines: 70,
  },
}
```

---

### 14. OUTDATED RADIX PACKAGES (17+ PACKAGES)

**File:** `package.json`

Every single Radix UI package is outdated by multiple patch versions:
- `@radix-ui/react-accordion`: 1.2.2 → 1.2.12
- `@radix-ui/react-dialog`: 1.1.4 → 1.1.15
- (and 15 more...)

**Fix:**
```bash
pnpm update @radix-ui/react-*
```

---

### 15. POSTCSS CONFIG HAS NO AUTOPREFIXER

**File:** `postcss.config.mjs`

Only `@tailwindcss/postcss` plugin. With Tailwind v4 this may be fine, but ensure autoprefixing is handled.

---

### 16. ESLINT SONARJS COGNITIVE COMPLEXITY TOO HIGH

**File:** `eslint.config.mjs`  
**Line:** 198

`cognitive-complexity: ["warn", 25]` - Default is 15, you've set 25. This allows overly complex functions!

---

### 17. NO .NVMRC OR ENGINES FIELD

**File:** `package.json`

No `engines` field specifying Node version. Your lockfile uses pnpm 9.x features but nothing enforces the runtime!

**Fix:**
```json
"engines": {
  "node": ">=22.0.0",
  "pnpm": ">=9.0.0"
}
```

---

### 18. SCRIPTS FOLDER EXCLUDED FROM TSCONFIG

**File:** `tsconfig.json`  
**Line:** 31

Scripts are excluded = no type checking on build/test scripts.

---

### 19. ANALYZE SCRIPT USES BASH SYNTAX

**File:** `package.json`  
**Line:** 14

`"analyze": "ANALYZE=true next build"` - This WILL NOT WORK on Windows!

**Fix:**
```json
"analyze": "cross-env ANALYZE=true next build"
```

---

### 20. IMAGEUNOPTIMIZED FOR E2E

**File:** `next.config.ts`  
**Line:** 64

`unoptimized: true` for E2E tests is fine, but if `CI` env leaks to production, ALL images become unoptimized!

---

## 🟢 LOW SEVERITY ISSUES

### 21. Playwright Timeout Comments Are Wordy
5-line comment explaining why timeout is 60 seconds.

### 22. Inconsistent Semicolon Usage
`eslint.config.mjs` has no semicolons, `vitest.config.ts` uses them.

### 23. robots.txt as Static File
You have both `robots.txt` (static) and `sitemap.ts` (dynamic). Consider making robots.txt dynamic too.

### 24. ESLint Unicorn Rules Mostly Disabled
14 unicorn rules explicitly disabled with "off". Why have the plugin?

### 25. Bundle Analyzer Default to False
Only runs with `ANALYZE=true`. Consider adding to CI on main branch.

---

## 📊 Dependency Analysis Summary

| Category | Issue | Impact |
|----------|-------|--------|
| Icon Libraries | 3 libraries (phosphor, lucide, tabler) | ~200KB bloat |
| Supabase | Wrong dep category | Production failures |
| Radix UI | 17 outdated packages | Bug fixes missed |
| Duplicates | lucide-react 2 versions | Bundle size |
| Unused | 4 files detected by knip | Dead code |

---

## 🔧 Priority Fix Order

1. **IMMEDIATELY**: Move `@supabase/supabase-js` to dependencies
2. **TODAY**: Add security headers to `next.config.ts`
3. **THIS WEEK**: Consolidate icon libraries to one
4. **THIS SPRINT**: Fix knip, upgrade ESLint rules to errors
5. **ONGOING**: Update outdated deps, add coverage thresholds

---

## Final Verdict

The root config is a mix of good intentions and dangerous oversights. The missing security headers on an e-commerce site is inexcusable. The icon library situation is pure bloat. Fix these before launch!
