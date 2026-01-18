# Layout Architecture Refactor Plan

**Created:** 2026-01-18  
**Status:** APPROVED FOR EXECUTION  
**Goal:** Eliminate over-engineering, establish clean modular architecture

---

## The Problem (Summary)

We built an e-commerce app with Next.js 16 + shadcn/ui—the perfect stack for this.
Instead of leveraging it properly, we AI-slopped our way into:

1. **6 header implementations** (4 files + 2 embedded in page components)
2. **Desktop/Mobile god components** (`desktop-home.tsx` at 1168 lines, `mobile-home.tsx` at 604 lines)
3. **DOM manipulation** to hide headers from parent layouts
4. **Pages rendering their own headers** instead of layouts owning them
5. **Duplicate internal components** (SlimTopBar duplicates SiteHeader dropdowns)
6. **skipMobile hacks** where the "unified" header skips the most important pages

This is insane for a Next.js App Router project. The layout system exists FOR THIS PURPOSE.

---

## The Solution (Architecture)

### Core Principle

**Layouts own chrome. Pages own content.**

```
Layout responsibility:
├── Header (always)
├── Footer (always)
├── Navigation (always)
└── Shell structure

Page responsibility:
├── Page-specific content
├── Page-specific data fetching
└── NOTHING about headers/footers
```

### Target Architecture

```
app/[locale]/layout.tsx
  └── Providers only (locale, theme, auth)

app/[locale]/(main)/layout.tsx
  └── <AppShell>
        ├── <AppHeader />          ← ONE component, CSS-based responsive
        ├── <main>{children}</main>
        ├── <SiteFooter />
        └── <MobileTabBar />

app/[locale]/(account)/layout.tsx
  └── <AccountShell>
        ├── <Sidebar />
        └── <main>{children}</main>

app/[locale]/(auth)/layout.tsx
  └── <MinimalShell>
        └── <main>{children}</main>

app/[locale]/(checkout)/layout.tsx
  └── <CheckoutShell>
        ├── <MinimalHeader />
        └── <main>{children}</main>
```

### Header Architecture (ONE Component)

```tsx
// components/layout/header/app-header.tsx
export function AppHeader({ variant, ...props }) {
  return (
    <header className="sticky top-0 z-50">
      {/* Mobile - hidden on md+ */}
      <div className="md:hidden">
        <MobileHeader variant={variant} {...props} />
      </div>
      
      {/* Desktop - hidden below md */}
      <div className="hidden md:block">
        <DesktopHeader variant={variant} {...props} />
      </div>
    </header>
  )
}
```

**Variants supported:**
- `default` — Standard pages (search bar, nav, user actions)
- `homepage` — Homepage (integrated search, category quick-nav)
- `contextual` — Category/filters active (back button, context title)
- `minimal` — Auth/checkout (logo only)

**Mobile/Desktop is CSS, not JS.** No `useIsMobile()` for layout decisions. No `skipMobile` flags.

---

## Execution Phases

### Phase 0: Preparation (Do First)
**Goal:** Establish baseline, prevent regressions

- [ ] Run full typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] Run E2E smoke: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- [ ] Document current header behavior (screenshots of mobile/desktop homepage, category, product)
- [ ] Create branch: `refactor/layout-architecture`

---

### Phase 1: Kill Dead Code
**Goal:** Remove unused files, reduce surface area

**Files to delete (verify unused first):**
- [ ] `components/layout/header/site-header.tsx` — Legacy header (291 lines)
- [ ] `components/sections/desktop-product-feed.tsx` — If unused (check imports)
- [ ] `components/navigation/category-subheader.tsx` — Disabled via flag (847 lines!)

**Verification before each delete:**
```bash
# Search for imports of the file
grep -r "from.*site-header[^-]" --include="*.tsx" --include="*.ts"
grep -r "from.*desktop-product-feed" --include="*.tsx" --include="*.ts"
grep -r "from.*category-subheader" --include="*.tsx" --include="*.ts"
```

**After deletions:**
- [ ] Typecheck passes
- [ ] Smoke tests pass

---

### Phase 2: Extract Embedded Components from God Files
**Goal:** `desktop-home.tsx` and `mobile-home.tsx` become thin orchestrators

#### 2A: Desktop Home Extraction

**Current `desktop-home.tsx` (1168 lines) contains:**
| Component | Lines | Extract To |
|-----------|-------|------------|
| `SlimTopBar` | ~100 | DELETE (use layout header) |
| `FeedToolbar` | ~100 | `components/desktop/feed-toolbar.tsx` |
| `CompactCategorySidebar` | ~200 | `components/desktop/category-sidebar.tsx` |
| `FiltersSidebar` | ~250 | `components/desktop/filters-sidebar.tsx` |
| `ProductGridSkeleton` | ~50 | `components/shared/product/product-grid-skeleton.tsx` |
| `DesktopHome` (main) | ~400 | Stays, but imports extracted components |

**Extraction rules:**
1. Each extracted file is self-contained (own imports, own types)
2. Props interfaces are exported from each file
3. No business logic changes—just file separation
4. Preserve all styling, all functionality

**After extractions:**
- [ ] `desktop-home.tsx` < 500 lines
- [ ] Each extracted file < 300 lines
- [ ] Typecheck passes
- [ ] Visual diff: homepage looks identical

#### 2B: Mobile Home Extraction

**Current `mobile-home.tsx` (604 lines) contains:**
| Component | Lines | Action |
|-----------|-------|--------|
| `SubcategoryCircles` | ~60 | Extract to `components/mobile/subcategory-circles.tsx` |
| `FeedTabs` | ~80 | Extract to `components/mobile/feed-tabs.tsx` |
| `MobileHome` header render | ~50 | DELETE (use layout header) |
| `MobileHome` (main) | ~400 | Stays, imports extracted |

**After extractions:**
- [ ] `mobile-home.tsx` < 400 lines
- [ ] No internal SiteHeader rendering
- [ ] Typecheck passes
- [ ] Visual diff: mobile homepage looks identical

---

### Phase 3: Unify Header Ownership
**Goal:** Layout renders header. Pages NEVER render headers.

#### 3A: Audit Current Header Rendering

| Page | Current | Target |
|------|---------|--------|
| Homepage (mobile) | Page renders `<SiteHeader variant="homepage">` | Layout renders, page passes variant via context/param |
| Homepage (desktop) | Page renders `SlimTopBar` | Layout renders `<AppHeader variant="homepage">` |
| Categories (mobile) | Page hides layout header via DOM, renders own | Layout renders `<AppHeader variant="contextual">` |
| Product (mobile) | Layout renders `<SiteHeader variant="product">` | Keep as-is (already correct) |

#### 3B: Remove Page-Level Header Rendering

**mobile-home.tsx changes:**
```tsx
// BEFORE: Page renders its own header
function MobileHome({ ... }) {
  return (
    <>
      <SiteHeader variant="homepage" ... />
      <main>...</main>
    </>
  )
}

// AFTER: Page is content-only
function MobileHome({ ... }) {
  return (
    <main>...</main>  // Header comes from layout
  )
}
```

**desktop-home.tsx changes:**
```tsx
// BEFORE: Page renders SlimTopBar
function DesktopHome({ ... }) {
  return (
    <>
      <SlimTopBar ... />
      <div>...</div>
    </>
  )
}

// AFTER: Page is content-only
function DesktopHome({ ... }) {
  return (
    <div>...</div>  // Header comes from layout
  )
}
```

#### 3C: Remove DOM Manipulation

**mobile-category-browser.tsx — DELETE THIS:**
```tsx
// This entire useEffect must go
useEffect(() => {
  if (!contextualMode) return
  const siteHeader = document.querySelector('body > div > header')
  if (!(siteHeader instanceof HTMLElement)) return
  siteHeader.style.display = mql.matches ? 'none' : previousDisplay
}, [contextualMode])
```

**Replace with:** Layout detects category route, renders contextual header variant.

#### 3D: Update Main Layout

**Current `(main)/layout.tsx`:**
```tsx
<SiteHeader user={...} categories={...} />
```

**Updated:**
```tsx
<AppHeader 
  variant={/* detect from pathname or searchParam */}
  user={...}
  categories={...}
/>
```

**Variant detection options:**
1. **Server-side pathname check** (preferred)
2. **Search param** `?header=contextual`
3. **React Context** from page (last resort)

**After Phase 3:**
- [ ] No page component renders `<SiteHeader>` or any header
- [ ] No DOM manipulation for header hiding
- [ ] No `skipMobile` flags
- [ ] Layout owns all header rendering
- [ ] Typecheck passes
- [ ] E2E smoke passes
- [ ] Visual diff: all pages look identical

---

### Phase 4: Consolidate Header Variants
**Goal:** ONE header file with clean internal structure

#### 4A: Create New `app-header.tsx`

```tsx
// components/layout/header/app-header.tsx

import { MobileDefaultHeader } from "./mobile/default-header"
import { MobileHomepageHeader } from "./mobile/homepage-header"
import { MobileContextualHeader } from "./mobile/contextual-header"
import { DesktopDefaultHeader } from "./desktop/default-header"
import { DesktopHomepageHeader } from "./desktop/homepage-header"

export type HeaderVariant = "default" | "homepage" | "contextual" | "minimal"

export interface AppHeaderProps {
  variant?: HeaderVariant
  user: User | null
  categories?: CategoryTreeNode[]
  // Contextual props
  contextualTitle?: string
  contextualBackHref?: string
  // ... other props
}

export function AppHeader({ variant = "default", ...props }: AppHeaderProps) {
  if (variant === "minimal") {
    return <MinimalHeader />
  }

  return (
    <header className="sticky top-0 z-50 bg-background">
      {/* Mobile */}
      <div className="md:hidden">
        {variant === "homepage" && <MobileHomepageHeader {...props} />}
        {variant === "contextual" && <MobileContextualHeader {...props} />}
        {variant === "default" && <MobileDefaultHeader {...props} />}
      </div>
      
      {/* Desktop */}
      <div className="hidden md:block">
        {variant === "homepage" && <DesktopHomepageHeader {...props} />}
        {(variant === "contextual" || variant === "default") && (
          <DesktopDefaultHeader {...props} />
        )}
      </div>
    </header>
  )
}
```

#### 4B: File Structure

```
components/layout/header/
├── app-header.tsx           ← Main export (thin orchestrator)
├── mobile/
│   ├── default-header.tsx   ← Standard mobile header
│   ├── homepage-header.tsx  ← Homepage mobile (inline search, pills)
│   └── contextual-header.tsx ← Category browser header (back, title)
├── desktop/
│   ├── default-header.tsx   ← Standard desktop header
│   └── homepage-header.tsx  ← Homepage desktop (integrated search)
├── minimal-header.tsx       ← Auth/checkout (keep existing)
└── cart/
    ├── cart-dropdown.tsx    ← Keep existing
    └── mobile-cart-dropdown.tsx
```

#### 4C: Migrate from `site-header-unified.tsx`

1. Extract each internal variant function to its own file
2. Preserve ALL existing JSX and styling
3. Update imports in new `app-header.tsx`
4. Update `(main)/layout.tsx` to use `AppHeader`
5. Delete `site-header-unified.tsx`

**After Phase 4:**
- [ ] ONE header export: `AppHeader`
- [ ] Each variant is a separate file < 200 lines
- [ ] All existing styling preserved
- [ ] Typecheck passes
- [ ] E2E smoke passes

---

### Phase 5: Eliminate Duplicate Sidebars
**Goal:** ONE sidebar system

**Current state:**
- `components/layout/sidebar/sidebar.tsx` (684 lines)
- `components/ui/sidebar.tsx` (672 lines) — shadcn primitive

**Resolution:**
1. `ui/sidebar.tsx` is shadcn primitive — KEEP, don't modify
2. `layout/sidebar/sidebar.tsx` should USE `ui/sidebar.tsx` primitives
3. If they're doing the same thing, merge logic into one

**After Phase 5:**
- [ ] Clear separation: `ui/sidebar.tsx` = primitives, `layout/sidebar/` = composed
- [ ] No duplicate functionality
- [ ] Typecheck passes

---

### Phase 6: Cleanup & Documentation
**Goal:** Prevent future AI slop

#### 6A: Delete Dead Files

- [ ] `site-header-unified.tsx` (replaced by `app-header.tsx`)
- [ ] `site-header.tsx` (legacy)
- [ ] Any other orphaned files found

#### 6B: Update Agents Guide

Add to `agents.md`:
```markdown
## Layout Rules (Non-Negotiable)

1. **Layouts own headers/footers.** Pages NEVER render headers.
2. **Mobile/Desktop is CSS-only.** Use `md:hidden` / `hidden md:block`. No JS detection for layout.
3. **No DOM manipulation.** Never use `document.querySelector` to hide elements.
4. **No god components.** Max 400 lines per file. Extract when larger.
5. **One header system.** `AppHeader` with variants. No custom page headers.
```

#### 6C: Add Architecture Decision Record

Create `docs/adr/001-layout-architecture.md` documenting:
- Why layouts own chrome
- Why CSS-only responsive
- Why one header component

---

## Success Criteria

| Metric | Before | After |
|--------|--------|-------|
| Header files | 6 | 1 main + 5 variant files |
| `desktop-home.tsx` lines | 1168 | < 500 |
| `mobile-home.tsx` lines | 604 | < 400 |
| DOM manipulation for headers | Yes | No |
| Pages rendering headers | 2 | 0 |
| `skipMobile` hacks | Yes | No |
| Sidebar duplicates | 2 | 1 system |

---

## Execution Order

```
Phase 0: Preparation (30 min)
    ↓
Phase 1: Kill Dead Code (1 hour)
    ↓
Phase 2: Extract from God Components (3-4 hours)
    ↓
Phase 3: Unify Header Ownership (2-3 hours)
    ↓
Phase 4: Consolidate Header Variants (2-3 hours)
    ↓
Phase 5: Eliminate Duplicate Sidebars (1-2 hours)
    ↓
Phase 6: Cleanup & Documentation (1 hour)
```

**Total estimate:** 10-14 hours of focused work

---

## Non-Negotiables

1. **No functionality changes.** This is REFACTOR only. UX stays identical.
2. **No styling changes.** All CSS classes preserved exactly.
3. **Incremental commits.** Each phase = 1 commit. Can revert if broken.
4. **Tests pass at each phase.** Typecheck + smoke after every phase.
5. **No new abstractions.** We're REMOVING complexity, not adding.

---

## What We Keep

- All current header designs and UX flows
- Contextual header behavior on category pages
- Homepage variant with integrated search
- Product page header with seller info
- Mobile tab bar behavior
- All animations and transitions
- All accessibility features (skip links, ARIA)

**We're not redesigning. We're reorganizing.**

---

## Appendix: Current File Audit

### Headers (6 implementations → 1 system)
| File | Lines | Status |
|------|-------|--------|
| `site-header-unified.tsx` | 598 | REPLACE |
| `site-header.tsx` | 291 | DELETE |
| `minimal-header.tsx` | 90 | KEEP |
| `dashboard-header.tsx` | 25 | KEEP |
| `desktop-home.tsx::SlimTopBar` | ~100 | DELETE (merge) |
| `mobile-home.tsx::header render` | ~50 | DELETE |

### God Components (2 → modular)
| File | Lines | Target |
|------|-------|--------|
| `desktop-home.tsx` | 1168 | < 500 |
| `mobile-home.tsx` | 604 | < 400 |

### DOM Manipulation (2 locations → 0)
| File | Lines | Action |
|------|-------|--------|
| `mobile-category-browser.tsx` | 298-313 | DELETE |
| `sticky-category-tabs.tsx` | 23-24 | REFACTOR |

---

## Start Command

After approval, begin with:

```bash
git checkout -b refactor/layout-architecture
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

Then Phase 1: Kill Dead Code.
