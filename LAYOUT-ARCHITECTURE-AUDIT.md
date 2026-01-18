# Layout Architecture Audit

**Date:** 2026-01-18  
**Status:** CRITICAL ISSUES IDENTIFIED  
**Verdict:** Over-engineered, fragmented, AI slop everywhere

---

## Executive Summary

The layout system is a mess. We have:
- **4+ header implementations** doing similar things
- **CSS-based mobile detection** instead of proper architecture
- **Massive 1000+ line components** that should be split
- **Contextual headers rendered via DOM manipulation** (really?)
- **Duplicate code** everywhere because each page "needs special handling"

This is classic AI-generated sprawl: every request got a new solution instead of fixing the core architecture.

---

## 1. Header Chaos

### Current State: 4 Header Implementations

| File | Lines | Purpose | Problem |
|------|-------|---------|---------|
| `site-header-unified.tsx` | 562 | "Unified" header with 5 variants | Still too complex, nested functions |
| `site-header.tsx` | 291 | Legacy header | Still imported, should be dead |
| `minimal-header.tsx` | 90 | Auth/plans pages | Fine, but redundant with unified |
| `dashboard-header.tsx` | 25 | Account sidebar trigger | Not really a header |
| `desktop-home.tsx::SlimTopBar` | ~100 | Desktop homepage header | DUPLICATE of site-header functionality |

### What "Unified" Actually Means
```
site-header-unified.tsx exports:
├── SiteHeader (main export)
│   ├── MobileDefaultHeader()
│   ├── MobileHomepageHeader()
│   ├── MobileProductHeader()
│   ├── MobileContextualHeader()
│   ├── MobileMinimalHeader()
│   ├── DesktopStandardHeader()
│   └── DesktopMinimalHeader()
```

This is 7 internal components in ONE FILE using nested functions. Each renders totally different JSX.

### The Real Problem

The "unified" header auto-detects routes via `usePathname()`:

```tsx
function detectRouteConfig(pathname: string, explicitVariant?: HeaderVariant): RouteConfig {
  if (pathWithoutLocale === "/" || pathWithoutLocale === "") {
    return { variant: "homepage", skipMobile: true }  // <-- Homepage SKIPS mobile header
  }
  if (pathWithoutLocale.startsWith("/categories")) {
    return { variant: "contextual", skipMobile: true }  // <-- Categories SKIPS mobile header
  }
  // ...
}
```

So the "unified" header... skips rendering on the two most important pages? Why does it exist then?

---

## 2. Homepage: Double Header Avoidance Hell

### Desktop
```
(main)/layout.tsx
  └── <SiteHeader />  ← renders DesktopStandardHeader

(main)/page.tsx
  └── <DesktopHome />
        └── SlimTopBar()  ← ANOTHER header component
```

**Result:** Desktop homepage has its OWN header (SlimTopBar) that duplicates SiteHeader dropdowns but lives inside the content area. The SiteHeader from layout is hidden somehow.

### Mobile
```
(main)/layout.tsx
  └── <SiteHeader variant="homepage" skipMobile={true} />  ← SKIPS MOBILE

(main)/page.tsx
  └── <MobileHome />
        └── <SiteHeader variant="homepage" ... />  ← Renders ITS OWN header
```

**Result:** Mobile homepage renders header INSIDE the page component, not from layout.

This is backwards. The layout should provide headers. Pages should NOT render their own headers.

---

## 3. Categories Page: DOM Manipulation 🤮

```tsx
// mobile-category-browser.tsx
useEffect(() => {
  if (!contextualMode) return
  const siteHeader = document.querySelector('body > div > header')
  if (!(siteHeader instanceof HTMLElement)) return
  
  // HIDE THE PARENT HEADER BY MANIPULATING THE DOM
  siteHeader.style.display = mql.matches ? 'none' : previousDisplay
}, [contextualMode])
```

We're using `document.querySelector` to find and HIDE the layout's header so we can render our own contextual header. This is:
- Fragile (selector can break)
- Causes layout shift
- Fighting the component hierarchy
- Pure AI slop

---

## 4. Mobile Detection: CSS vs JS Split Brain

### How We Detect Mobile

**Pattern 1: CSS classes (correct)**
```tsx
<div className="md:hidden">Mobile only</div>
<div className="hidden md:block">Desktop only</div>
```

**Pattern 2: JavaScript hook (sometimes needed)**
```tsx
const isMobile = useIsMobile()  // returns false on SSR
```

**Pattern 3: Route-based skipMobile flag**
```tsx
{ variant: "homepage", skipMobile: true }
```

**Pattern 4: DOM query + matchMedia**
```tsx
const mql = window.matchMedia('(max-width: 767px)')
siteHeader.style.display = mql.matches ? 'none' : previousDisplay
```

We use ALL FOUR approaches. The result:
- Mobile renders header from page component
- Desktop renders header from layout
- Nobody knows which header is showing

---

## 5. Bottom Navigation: Actually Fine

`mobile-tab-bar.tsx` is clean:
- Single component
- Proper hide logic for product/cart pages
- Uses CSS `md:hidden` correctly
- Rendered from layout (correct place)

**Verdict:** Keep as-is.

---

## 6. Code Bloat Stats

### Largest Components (Lines)

| File | Lines | Diagnosis |
|------|-------|-----------|
| `desktop-home.tsx` | 1084 | God component, does everything |
| `category-subheader.tsx` | 847 | Mega-menu monster |
| `filter-hub.tsx` | 808 | Filter drawer sprawl |
| `post-signup-onboarding-modal.tsx` | 806 | Onboarding wizard |
| `desktop-product-feed.tsx` | 741 | Another god component |
| `filter-modal.tsx` | 688 | Duplicate of filter-hub? |
| `sidebar.tsx` | 684 | shadcn sidebar + extras |
| `ui/sidebar.tsx` | 672 | ANOTHER sidebar? |
| `site-header-unified.tsx` | 562 | The "unified" header |
| `mobile-home.tsx` | 560 | Mobile homepage |
| `mobile-category-browser.tsx` | 556 | Category page |

### Observations

1. **Two sidebar components**: `layout/sidebar/sidebar.tsx` (684 lines) AND `ui/sidebar.tsx` (672 lines). Why?

2. **desktop-home.tsx at 1084 lines**: Contains SlimTopBar, FeedToolbar, CompactCategorySidebar, FiltersSidebar, ProductGridSkeleton, and DesktopHome. Should be 5+ separate files.

3. **filter-hub.tsx + filter-modal.tsx**: Two 700+ line filter components. Likely duplicated functionality.

---

## 7. What Should Exist

### Correct Architecture

```
app/[locale]/layout.tsx
  └── Only <html>, <body>, providers

app/[locale]/(main)/layout.tsx
  └── <AppShell>  ← ONE component that handles everything
        ├── <Header variant={auto-detect} />
        ├── <main>{children}</main>
        ├── <Footer />
        └── <MobileTabBar />

app/[locale]/(account)/layout.tsx
  └── <AccountShell>
        ├── <Sidebar />
        └── <main>{children}</main>

app/[locale]/(auth)/layout.tsx
  └── Minimal (no header)

app/[locale]/(checkout)/layout.tsx
  └── <CheckoutShell>
        ├── <MinimalHeader />
        └── <main>{children}</main>
```

### Header Variants (should be ONE component)

```tsx
// ONE file: components/layout/app-header.tsx
export function AppHeader({ variant?: "default" | "contextual" | "minimal" }) {
  // CSS-only mobile/desktop handling
  return (
    <header>
      <MobileHeader variant={variant} className="md:hidden" />
      <DesktopHeader variant={variant} className="hidden md:block" />
    </header>
  )
}
```

Pages should NOT render headers. Period.

---

## 8. Recommended Fixes

### Priority 1: Kill Duplicate Headers

1. Delete `site-header.tsx` (legacy)
2. Move `SlimTopBar` from `desktop-home.tsx` into `site-header-unified.tsx` as desktop variant
3. Remove header rendering from `MobileHome` and `MobileCategoryBrowser`
4. Delete the DOM manipulation hack in `mobile-category-browser.tsx`

### Priority 2: Fix Layout Hierarchy

1. Layout renders header ALWAYS
2. Header uses CSS `md:hidden` / `hidden md:block` for mobile/desktop
3. Pages never render headers
4. Use React Context or URL params for variant detection, not `usePathname()` hacks

### Priority 3: Split God Components

| Component | Split Into |
|-----------|------------|
| `desktop-home.tsx` | `desktop-home.tsx`, `feed-toolbar.tsx`, `category-sidebar.tsx`, `filters-sidebar.tsx` |
| `filter-hub.tsx` | Keep one, delete `filter-modal.tsx` |
| `sidebar.tsx` (layout) | Merge with or replace `ui/sidebar.tsx` |

### Priority 4: Standardize Mobile Detection

Use ONLY:
1. CSS classes (`md:hidden`, `hidden md:block`)
2. `useIsMobile()` hook when JS behavior differs

Never use:
- DOM queries
- matchMedia directly
- skipMobile flags
- Hiding elements via JS

---

## 9. Dead Code Suspects

Files that might be unused (verify before deletion):

- `components/layout/header/site-header.tsx` - old version
- `components/sections/desktop-product-feed.tsx` - might be replaced by desktop-home
- `components/navigation/category-subheader.tsx` - isSubheaderEnabled = false
- `components/layout/sidebar/sidebar.tsx` - shadcn dupe?

---

## 10. Conclusion

The layout system was built by asking AI to "add a header variant for X" repeatedly without architectural planning. Result:
- 4 header implementations
- Pages rendering their own headers
- DOM manipulation to hide parent headers
- 1000+ line god components
- Duplicate filter/sidebar components

**Fix approach:** Small, surgical changes. Don't "rewrite the layout system." Pick ONE problem (e.g., homepage header duplication) and fix it properly. Then move to the next.

---

## Appendix: File Inventory

### Headers
- `components/layout/header/site-header-unified.tsx` - 562 lines (KEEP, refactor)
- `components/layout/header/site-header.tsx` - 291 lines (DELETE candidate)
- `components/layout/header/minimal-header.tsx` - 90 lines (KEEP)
- `components/layout/header/dashboard-header.tsx` - 25 lines (KEEP)
- `components/desktop/desktop-home.tsx::SlimTopBar` - ~100 lines (MERGE into unified)

### Layouts
- `app/[locale]/layout.tsx` - Root (fine)
- `app/[locale]/(main)/layout.tsx` - Main shell (fix header logic)
- `app/[locale]/(account)/layout.tsx` - Account (fine)
- `app/[locale]/(auth)/layout.tsx` - Auth (fine)
- `app/[locale]/(checkout)/layout.tsx` - Checkout (fine)
- `app/[locale]/(sell)/layout.tsx` - Sell (fine)

### Navigation
- `components/mobile/mobile-tab-bar.tsx` - 170 lines (fine)
- `components/navigation/category-subheader.tsx` - 847 lines (disabled, review)

### Mobile Detection
- `hooks/use-mobile.ts` - 35 lines (fine)
- CSS classes - primary method (correct)
