# 🔥 Codebase Architecture Roast & Action Plan

> **Generated:** January 1, 2026  
> **Auditor:** Gordon Ramsay of Code  
> **Overall Score:** 4.5/10  

---

## 📊 Executive Summary

| Category | Score | Priority Fix |
|----------|-------|--------------|
| Folder Structure | 3/10 | Merge `common/` and `shared/` |
| Type Safety | 6/10 | Centralize types from Supabase |
| Component Architecture | 4/10 | Remove unnecessary `use client` |
| Dependencies | 5/10 | Remove duplicate icon libraries |
| Test Coverage | 2/10 | Add component/integration tests |
| Dead Code | 3/10 | Execute existing audit phases |
| Documentation | 7/10 | Problems documented but not fixed |
| Server/Client Boundary | 6/10 | Good `server-only` usage |

---

## 🚨 Critical Issues Identified

### 1. Duplicate Shared Folders
**Problem:** `components/common/` and `components/shared/` serve identical purposes.

```
components/common/   <- Has wishlist/, filters/, modal
components/shared/   <- Has cart/, product/, search
```

**Impact:** Confusing for developers, inconsistent imports, harder onboarding.

### 2. Device-Specific Component Folders
**Problem:** `components/desktop/` and `components/mobile/` encourage code duplication.

```
components/desktop/desktop-hero-cta.tsx
components/desktop/desktop-search.tsx
components/mobile/mobile-home-tabs.tsx
components/mobile/mobile-tab-bar.tsx
```

**Impact:** Duplicate logic, harder maintenance, larger bundle size.

### 3. Three Icon Libraries
**Problem:** Three separate icon packages installed.

```json
"@phosphor-icons/react": "^2.1.10",
"@tabler/icons-react": "^3.35.0",
"lucide-react": "^0.560.0"
```

**Impact:** ~35-50KB unnecessary bundle size, inconsistent icon styling.

### 4. Excessive `use client` Directives
**Problem:** Stateless UI components marked as client components.

```tsx
// These DON'T need "use client":
components/ui/skeleton.tsx    // Just a div with className
components/ui/separator.tsx   // Just an hr element
components/ui/label.tsx       // Just a label element
components/ui/badge.tsx       // Just a span with className
```

**Impact:** Larger client bundle, unnecessary hydration overhead.

### 5. Scattered Type Definitions
**Problem:** Types defined in multiple locations instead of centrally.

```
lib/types/badges.ts              <- One file in types folder
lib/supabase/database.types.ts   <- Generated types (underused)
lib/data/products.ts             <- 100+ lines of inline types
app/[locale]/(sell)/_lib/types.ts
app/[locale]/(main)/search/_lib/types.ts
```

**Impact:** Type duplication, drift from database schema, maintenance burden.

### 6. Console Statement Infestation
**Problem:** 100+ console.log/warn/error statements scattered throughout.

**Impact:** Noisy logs, potential info leaks, no structured logging.

### 7. Single-File Private Folders
**Problem:** `_lib/` and `_actions/` folders often contain just one file.

```
app/[locale]/(sell)/_lib/types.ts        <- One file
app/[locale]/(sell)/_actions/sell.ts     <- One file
app/[locale]/(main)/_lib/pagination.ts   <- One file
```

**Impact:** Folder bloat, unnecessary navigation depth.

### 8. Weak Test Coverage
**Problem:** Only 9 unit tests, all for utility functions.

```
__tests__/
├── currency.test.ts
├── format-price.test.ts
├── image-utils.test.ts
└── ... (6 more utility tests)
```

**Impact:** No component tests, no integration tests, high regression risk.

---

## ✅ Action Items

### Phase 1: Quick Wins (This Week)

#### 1.1 Merge `common/` into `shared/`
- [ ] Move `components/common/*` to `components/shared/`
- [ ] Update all imports
- [ ] Delete empty `components/common/` folder
- [ ] Run typecheck: `pnpm typecheck`

```bash
# Find all imports to update
grep -rn "@/components/common" --include="*.tsx" --include="*.ts"
```

#### 1.2 Remove Unnecessary `use client` Directives
- [ ] `components/ui/skeleton.tsx` - Remove `use client`
- [ ] `components/ui/separator.tsx` - Remove `use client`
- [ ] `components/ui/badge.tsx` - Remove `use client` (if no interactivity)
- [ ] `components/ui/card.tsx` - Remove `use client` (if no interactivity)
- [ ] `components/ui/table.tsx` - Remove `use client` (if no interactivity)

**Rule:** Only keep `use client` if the component uses:
- `useState`, `useEffect`, `useContext`, or other hooks
- Event handlers (`onClick`, `onChange`, etc.)
- Browser-only APIs (`window`, `document`, etc.)

#### 1.3 Consolidate Icon Libraries
- [ ] Audit which icons come from which library
- [ ] Pick Lucide (shadcn default) as the single source
- [ ] Replace Phosphor/Tabler imports with Lucide equivalents
- [ ] Remove unused packages from `package.json`

```bash
# Find Phosphor imports
grep -rn "@phosphor-icons/react" --include="*.tsx"

# Find Tabler imports  
grep -rn "@tabler/icons-react" --include="*.tsx"
```

#### 1.4 Delete Archive Folders
- [ ] Remove `cleanup/` if exists
- [ ] Remove `docs/archive/` if exists
- [ ] Verify no imports reference deleted folders

---

### Phase 2: Structural Improvements (This Month)

#### 2.1 Centralize Type Definitions
- [ ] Create `types/index.ts` as central export
- [ ] Create `types/database.ts` re-exporting Supabase types
- [ ] Create `types/domain.ts` for business types derived from DB types
- [ ] Migrate inline types from `lib/data/products.ts`
- [ ] Update imports across codebase

**Target Structure:**
```
types/
├── index.ts          <- Re-exports all
├── database.ts       <- From Supabase generated
├── domain/
│   ├── product.ts    <- Product domain types
│   ├── order.ts      <- Order domain types
│   ├── user.ts       <- User/profile types
│   └── index.ts
└── api/
    ├── responses.ts  <- API response shapes
    └── index.ts
```

#### 2.2 Implement Structured Logging
- [ ] Create `lib/logger.ts` with log levels
- [ ] Replace all `console.log` with `logger.debug`
- [ ] Replace all `console.warn` with `logger.warn`
- [ ] Replace all `console.error` with `logger.error`
- [ ] Add ESLint rule to prevent raw console usage

**Logger Implementation:**
```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogMeta {
  [key: string]: unknown
}

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  debug: (message: string, meta?: LogMeta) => {
    if (isDev) console.debug(`[DEBUG] ${message}`, meta ?? '')
  },
  info: (message: string, meta?: LogMeta) => {
    console.info(`[INFO] ${message}`, meta ?? '')
  },
  warn: (message: string, meta?: LogMeta) => {
    console.warn(`[WARN] ${message}`, meta ?? '')
  },
  error: (message: string, error?: Error, meta?: LogMeta) => {
    console.error(`[ERROR] ${message}`, { error, ...meta })
    // TODO: In production, send to error tracking service
  },
}
```

#### 2.3 Execute Existing Audit Phases
Reference: `docs/CODEBASE_AUDIT_MASTER_PLAN.md`

- [ ] Phase 2: Consolidate 290 code clones (4,634 lines)
- [ ] Phase 3: Dedupe config files
- [ ] Phase 4: Remove console statements (after logger is ready)
- [ ] Phase 5: Address or remove TODO comments
- [ ] Phase 6: Delete archive folders

```bash
# Run duplicate detection
npx jscpd --reporters console ./app ./lib ./components

# Count console statements
grep -rn "console\." --include="*.ts" --include="*.tsx" | wc -l

# Find TODOs
grep -rn "// TODO" --include="*.ts" --include="*.tsx"
```

#### 2.4 Flatten Single-File Private Folders
- [ ] If `_lib/` has one file, move to parent as `_types.ts` or similar
- [ ] If `_actions/` has one file, move to parent as `_actions.ts`
- [ ] Update imports

---

### Phase 3: Architecture Evolution (This Quarter)

#### 3.1 Migrate to Responsive Components
- [ ] Audit `components/desktop/` - identify which can be merged
- [ ] Audit `components/mobile/` - identify which can be merged
- [ ] Create unified responsive components using Tailwind breakpoints
- [ ] Delete device-specific folders when empty

**Pattern:**
```tsx
// Instead of:
// components/desktop/desktop-hero.tsx
// components/mobile/mobile-hero.tsx

// Create:
// components/hero/hero.tsx
export function Hero() {
  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex ...">
        <DesktopHeroContent />
      </div>
      {/* Mobile layout */}
      <div className="md:hidden ...">
        <MobileHeroContent />
      </div>
    </>
  )
}
```

#### 3.2 Add Component Test Coverage
- [ ] Set up component testing with Vitest + Testing Library
- [ ] Add tests for critical UI components:
  - [ ] `ProductCard`
  - [ ] `CartItem`
  - [ ] `CheckoutForm`
  - [ ] `SearchResults`
- [ ] Add tests for hooks:
  - [ ] `use-categories-cache`
  - [ ] `use-product-search`
  - [ ] `use-recently-viewed`
- [ ] Target: 60% coverage on `components/` folder

#### 3.3 Consider Feature-Based Architecture (Future)
**Current:**
```
lib/
├── data/products.ts (732 lines!)
├── format-price.ts
├── currency.ts
├── shipping.ts
```

**Future Consideration:**
```
features/
├── products/
│   ├── data.ts
│   ├── types.ts
│   ├── utils.ts
│   └── components/
├── pricing/
│   ├── currency.ts
│   ├── format.ts
│   └── types.ts
├── shipping/
│   ├── regions.ts
│   └── geolocation.ts
```

---

## 🔧 Verification Commands

```bash
# After each change, run:
pnpm typecheck          # TypeScript check
pnpm lint               # ESLint check
pnpm test:unit          # Unit tests
pnpm knip               # Dead code check

# Full validation:
pnpm test:all           # All tests + lint + typecheck
```

---

## 📈 Progress Tracking

| Task | Status | Date Completed |
|------|--------|----------------|
| Merge common/ into shared/ | ⏳ Not Started | |
| Remove unnecessary `use client` | ⏳ Not Started | |
| Consolidate icon libraries | ⏳ Not Started | |
| Delete archive folders | ⏳ Not Started | |
| Centralize type definitions | ⏳ Not Started | |
| Implement structured logging | ⏳ Not Started | |
| Execute audit phases 2-6 | ⏳ Not Started | |
| Flatten single-file folders | ⏳ Not Started | |
| Migrate to responsive components | ⏳ Not Started | |
| Add component test coverage | ⏳ Not Started | |

---

## 📝 Notes

- Always run full test suite before committing major refactors
- Create a branch for each phase to allow easy rollback
- Update this document as tasks are completed
- Consider pairing on complex refactors to catch issues early
