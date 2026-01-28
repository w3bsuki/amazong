# Desktop Layout Grid System Plan

**Date:** 2026-01-27  
**Status:** Phase 3 & 4 Implemented  
**Priority:** High  
**Scope:** Desktop viewport layout architecture

---

## Executive Summary

This document outlines a comprehensive plan to redesign the Treido desktop layout using modern Tailwind CSS v4 grid patterns, container queries, and shadcn/ui best practices to create a flawless C2C/B2B e-commerce experience.

---

## 1. Current State Analysis

### 1.1 Existing Layout Structure

```
app/[locale]/(main)/layout.tsx
├── OnboardingProvider
│   └── HeaderProvider
│       └── div.bg-background.min-h-screen.flex.flex-col
│           ├── SkipLinks
│           ├── Suspense > HeaderWithUser > AppHeader
│           ├── main#main-content.flex-1.pb-20.md:pb-0
│           │   └── {children} (Page content)
│           ├── SiteFooter
│           ├── MobileTabBar
│           ├── Toaster
│           ├── CookieConsent
│           └── GeoWelcomeModal
```

### 1.2 Current Desktop Home Grid (desktop-home.tsx)

```tsx
<PageShell variant="muted">
  <div className="container py-4">
    <div className="grid grid-cols-1 lg:grid-cols-[var(--sidebar-width)_1fr] gap-4 lg:gap-6 items-start">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col shrink-0 gap-3 sticky top-(--sticky-top)...">
        <CompactCategorySidebar />
        <FiltersSidebar />
      </aside>
      
      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 @container flex flex-col gap-4">
        <PromotedSection />
        <FeedToolbar />
        <div className="rounded-xl bg-card border border-border p-4">
          {/* Product Grid */}
        </div>
      </div>
    </div>
  </div>
</PageShell>
```

### 1.3 Current Issues Identified

| Issue | Severity | Description |
|-------|----------|-------------|
| Header detached from grid | Medium | Header renders in layout.tsx, content grid in page.tsx - causes alignment issues |
| Search bar positioning | Medium | Search is in header, not integrated with content context |
| No unified page shell | High | Each page creates its own container/grid structure |
| CSS variables scattered | Medium | `--sidebar-width`, `--sticky-top` defined in multiple places |
| Container inconsistency | High | Some pages use `container`, others use custom max-widths |
| No named grid areas | Low | Grid lines are anonymous, harder to reason about |

---

## 2. Research: Modern E-Commerce Layout Patterns

### 2.1 Industry Reference Platforms

| Platform | Layout Pattern | Key Features |
|----------|---------------|--------------|
| **Amazon** | Sticky header + sidebar + fluid grid | Persistent nav, filter sidebar collapses on mobile |
| **eBay** | Full-width header + constrained content | Category chips below search, left filters |
| **Etsy** | Clean header + masonry product grid | Minimal sidebar, filters in dropdown |
| **Shopify Hydrogen** | Full-bleed sections + container | Modern Next.js patterns, great SEO |
| **Depop** | Mobile-first, grid-heavy | Young audience, visual-first browsing |
| **Vinted** | Sidebar filters + uniform product grid | C2C marketplace, category-first navigation |

### 2.2 Best Practice Patterns for Marketplaces

#### Pattern A: "Shell Layout" (Recommended)
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]           [Search Bar — Full Width]          [Actions]   │ ← Sticky Header
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌───────────────────────────────────────────┐   │
│  │ Category │  │  Breadcrumbs / Context Bar                │   │
│  │ Sidebar  │  ├───────────────────────────────────────────┤   │
│  │          │  │                                           │   │ ← Main Content Area
│  │ Filters  │  │        Product Grid / Content             │   │
│  │          │  │                                           │   │
│  └──────────┘  └───────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                          Footer                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Pattern B: "Command Center" (Alternative)
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]     [Nav Tabs]                               [Actions]   │
├─────────────────────────────────────────────────────────────────┤
│ [Category Pills]    [Search Bar]         [Sort] [View] [Filter] │ ← Toolbar
├──────────┬──────────────────────────────────────────────────────┤
│ Faceted  │                                                      │
│ Filters  │                Product Grid                          │
│ (sticky) │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

---

## 3. Tailwind CSS v4 Grid Architecture

### 3.1 Key Tailwind CSS v4 Features to Leverage

| Feature | Usage | Benefit |
|---------|-------|---------|
| **Container Queries** | `@container` + `@sm:`, `@md:` etc. | Component-level responsiveness |
| **CSS-first config** | `@theme {}` in CSS file | All tokens in one place |
| **Native CSS layers** | `@layer theme, base, components, utilities` | Better cascade control |
| **Dynamic grid values** | `grid-cols-15` (any number) | No config needed |
| **CSS variables** | `--spacing`, `--color-*` exposed | Runtime theming |
| **Subgrid** | `grid-template-columns: subgrid` | Nested alignment |

### 3.2 Proposed CSS Theme Variables

```css
/* app/globals.css — Tailwind v4 CSS-first config */
@import "tailwindcss";

@theme {
  /* Layout Grid System */
  --layout-sidebar-width: 280px;
  --layout-sidebar-width-collapsed: 64px;
  --layout-content-max-width: 1400px;
  --layout-container-padding: theme(spacing.4);
  --layout-gap: theme(spacing.6);
  
  /* Header */
  --header-height: 64px;
  --header-search-max-width: 640px;
  
  /* Sticky Offsets */
  --sticky-top: calc(var(--header-height) + theme(spacing.4));
  --sidebar-max-height: calc(100dvh - var(--sticky-top) - theme(spacing.8));
  
  /* Product Grid */
  --product-card-min-width: 200px;
  --product-grid-gap: theme(spacing.4);
  
  /* Breakpoints */
  --breakpoint-sidebar-visible: 1024px; /* lg */
  --breakpoint-wide: 1536px; /* 2xl */
}
```

### 3.3 Named Grid Areas Pattern

```css
/* Modern grid-template-areas approach */
.desktop-shell {
  display: grid;
  grid-template-areas:
    "header  header"
    "sidebar content"
    "sidebar footer";
  grid-template-columns: var(--layout-sidebar-width) 1fr;
  grid-template-rows: var(--header-height) 1fr auto;
}

/* Responsive collapse */
@media (width < 1024px) {
  .desktop-shell {
    grid-template-areas:
      "header"
      "content"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

---

## 4. Proposed Architecture

### 4.1 New Component Hierarchy

```
components/
├── layout/
│   ├── desktop-shell.tsx        # New unified shell
│   ├── shell-header.tsx         # Header for shell
│   ├── shell-sidebar.tsx        # Sidebar wrapper
│   ├── shell-content.tsx        # Main content area
│   └── shell-footer.tsx         # Footer area
├── grid/
│   ├── product-grid.tsx         # Responsive product grid
│   ├── grid-container.tsx       # @container wrapper
│   └── masonry-grid.tsx         # Future: masonry support
```

### 4.2 DesktopShell Component

```tsx
// components/layout/desktop-shell.tsx
interface DesktopShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebarOpen?: boolean;
  sidebarCollapsible?: boolean;
}

export function DesktopShell({
  children,
  sidebar,
  header,
  footer,
  sidebarOpen = true,
  sidebarCollapsible = false,
}: DesktopShellProps) {
  return (
    <div
      className={cn(
        "min-h-dvh",
        "grid",
        // Named grid areas for clarity
        "[grid-template-areas:'header_header'_'sidebar_content'_'sidebar_footer']",
        // Column sizing
        "grid-cols-[var(--layout-sidebar-width)_1fr]",
        // Row sizing
        "grid-rows-[var(--header-height)_1fr_auto]",
        // Responsive
        "lg:[grid-template-areas:'header_header'_'sidebar_content'_'sidebar_footer']",
        "max-lg:[grid-template-areas:'header'_'content'_'footer']",
        "max-lg:grid-cols-1"
      )}
    >
      <header className="[grid-area:header] sticky top-0 z-50 bg-header-bg border-b">
        {header}
      </header>
      
      {sidebar && (
        <aside className="[grid-area:sidebar] hidden lg:block sticky top-(--sticky-top) self-start overflow-y-auto max-h-(--sidebar-max-height)">
          {sidebar}
        </aside>
      )}
      
      <main className="[grid-area:content] @container min-w-0">
        {children}
      </main>
      
      {footer && (
        <footer className="[grid-area:footer]">
          {footer}
        </footer>
      )}
    </div>
  );
}
```

### 4.3 Container Query-Based Product Grid

```tsx
// components/grid/product-grid.tsx
export function ProductGrid({ products, viewMode = "grid" }: ProductGridProps) {
  return (
    <div className="@container">
      <div
        className={cn(
          viewMode === "grid" && [
            "grid gap-(--product-grid-gap)",
            // Container query breakpoints
            "grid-cols-2",
            "@xs:grid-cols-2",
            "@sm:grid-cols-3", 
            "@md:grid-cols-4",
            "@lg:grid-cols-5",
            "@xl:grid-cols-6",
          ],
          viewMode === "list" && "flex flex-col gap-3"
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
```

### 4.4 Integrated Search in Content Area

```tsx
// Option A: Search as part of content toolbar
<DesktopShell
  header={<MinimalHeader logo user actions />}
  sidebar={<CategorySidebar />}
>
  <div className="flex flex-col gap-4 p-4">
    {/* Search integrated into content context */}
    <SearchBar 
      className="max-w-2xl"
      context={currentCategory}
    />
    
    <FeedToolbar />
    <ProductGrid products={products} />
  </div>
</DesktopShell>

// Option B: Search remains in header but spans full width
<DesktopShell
  header={
    <div className="flex items-center gap-4 px-4 h-full">
      <Logo />
      <SearchBar className="flex-1 max-w-3xl mx-auto" />
      <UserActions />
    </div>
  }
  sidebar={<CategorySidebar />}
>
  <ContentArea />
</DesktopShell>
```

---

## 5. Implementation Phases

### Phase 1: Foundation (Week 1)
- [x] Add Tailwind v4 theme variables to `globals.css`
- [x] Create `DesktopShell` component
- [x] Create `GridContainer` wrapper with `@container`
- [x] Update `PageShell` to use new shell system
- [x] Add CSS custom properties for layout tokens

### Phase 2: Component Migration (Week 2)
- [x] Migrate `desktop-home.tsx` to use `DesktopShell`
- [x] Create unified `ProductGrid` with container queries
- [ ] Move search into content area OR integrate into shell header
- [x] Update sidebar to use new sticky positioning
- [x] Standardize gap/spacing across all views

### Phase 3: Route Integration (Week 3)
- [x] Update `/categories/[slug]` to use shared shell
- [x] Update `/search` to use shared shell
- [x] Update product pages to use consistent layout
- [x] Ensure footer aligns with grid system
- [x] Test all viewport sizes

### Phase 4: Polish & Accessibility (Week 4)
- [x] Add focus management for grid navigation
- [x] Implement keyboard shortcuts for view toggle
- [x] Add skip links that work with grid areas
- [ ] Test with screen readers
- [ ] Performance audit (CLS, LCP)

---

## 6. Design Tokens Reference

### 6.1 Spacing Scale (Tailwind v4)

```css
/* Base spacing multiplier */
--spacing: 0.25rem;

/* Common layout values */
--layout-xs: calc(var(--spacing) * 2);   /* 0.5rem / 8px */
--layout-sm: calc(var(--spacing) * 3);   /* 0.75rem / 12px */
--layout-md: calc(var(--spacing) * 4);   /* 1rem / 16px */
--layout-lg: calc(var(--spacing) * 6);   /* 1.5rem / 24px */
--layout-xl: calc(var(--spacing) * 8);   /* 2rem / 32px */
--layout-2xl: calc(var(--spacing) * 12); /* 3rem / 48px */
```

### 6.2 Breakpoint Reference

| Token | Size | Usage |
|-------|------|-------|
| `sm` | 640px (40rem) | Mobile landscape |
| `md` | 768px (48rem) | Tablet portrait |
| `lg` | 1024px (64rem) | Tablet landscape / Small desktop |
| `xl` | 1280px (80rem) | Desktop |
| `2xl` | 1536px (96rem) | Wide desktop |

### 6.3 Container Query Breakpoints

| Token | Size | Usage |
|-------|------|-------|
| `@3xs` | 256px | Tiny containers |
| `@2xs` | 288px | Very small containers |
| `@xs` | 320px | Small containers |
| `@sm` | 384px | Medium-small containers |
| `@md` | 448px | Medium containers |
| `@lg` | 512px | Large containers |
| `@xl` | 576px | Extra large containers |
| `@2xl` | 672px | Very large containers |
| `@3xl` | 768px | Massive containers |

---

## 7. UX Improvements

### 7.1 Navigation Flow

```
Current: Click category → Full page reload → New grid
Proposed: Click category → Instant sidebar highlight → Grid filters
```

### 7.2 Search Experience

```
Current: 
- Search in header (global)
- Results on /search page
- Context lost when navigating

Proposed:
- Search integrated with current view
- Type-ahead within category context
- Results overlay OR inline filtering
```

### 7.3 View Mode Persistence

```tsx
// Store in localStorage + URL params
const [viewMode, setViewMode] = useViewMode({
  key: "product-view-mode",
  defaultValue: "grid",
  syncToUrl: true,
});
```

---

## 8. Performance Considerations

### 8.1 Grid Performance

- Use `content-visibility: auto` for off-screen product cards
- Virtualize lists with 100+ items (react-window or @tanstack/virtual)
- Defer non-critical sidebar content with `Suspense`

### 8.2 Layout Shift Prevention

```css
/* Reserve space for async content */
.product-grid {
  contain: layout style;
}

.product-card {
  aspect-ratio: 1;
  contain: layout style paint;
}

.sidebar {
  min-width: var(--layout-sidebar-width);
  contain: layout style;
}
```

### 8.3 CSS Performance

- Avoid `calc()` in frequently repainted elements
- Use `will-change` sparingly and only when needed
- Prefer `transform` over `top/left` for animations

---

## 9. Accessibility Checklist

- [x] Grid uses semantic `<main>`, `<aside>`, `<header>`, `<footer>`
- [x] Skip links target grid areas correctly
- [x] Focus order follows visual order
- [x] Sidebar collapse/expand announced to screen readers
- [x] Product cards have proper focus indicators
- [x] View mode toggle has accessible label
- [x] Reduced motion preference respected

### 9.1 Keyboard Navigation Implementation

New hooks created for accessibility:

**`hooks/use-grid-navigation.ts`**
- Arrow keys navigate between grid items
- Home/End jump to first/last item
- Page Up/Down skip rows
- Enter/Space activate item
- Focus management for screen readers

**`hooks/use-view-toggle-shortcuts.ts`**
- `G` key: Switch to grid view
- `L` key: Switch to list view
- Disabled when typing in inputs
- Respects modifier keys

### 9.2 Skip Links

Updated `components/shared/skip-links.tsx` with targets:
- `#main-content` — Main page content
- `#shell-sidebar` — Category/filter sidebar
- `#product-grid` — Product grid container
- `#footerHeader` — Site footer

### 9.3 Screen Reader Testing Checklist

Manual testing required with:
- [ ] VoiceOver (macOS/iOS)
- [ ] NVDA (Windows)
- [ ] JAWS (Windows)

Test scenarios:
- [ ] Navigate to main content via skip link
- [ ] Browse products using arrow keys
- [ ] Switch between grid/list view
- [ ] Hear product count announcements
- [ ] Filter changes announced via aria-live
- [ ] Sidebar navigation works correctly

---

## 10. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Layout Shift (CLS) | ~0.15 | < 0.1 |
| Time to Interactive | ~2.5s | < 1.5s |
| CSS Bundle Size | ~45KB | < 35KB |
| Grid render time | ~120ms | < 50ms |

### 10.1 Performance Audit Checklist

**Layout Shift Prevention (CLS)**
- [x] ProductGrid has fixed aspect-ratio containers
- [x] Sidebar has fixed min-width CSS variable
- [x] Skeleton loaders match content dimensions
- [ ] Measure actual CLS with Lighthouse

**Largest Contentful Paint (LCP)**
- [x] Product images use Next.js Image optimization
- [x] Above-fold content prioritized
- [ ] Measure actual LCP with Lighthouse

**First Input Delay (FID)**
- [x] Keyboard navigation is immediate
- [x] No blocking JavaScript on load
- [ ] Measure actual FID with Lighthouse

**Run Lighthouse Audit:**
```bash
pnpm exec lighthouse http://localhost:3000 --view
```

---

## 11. Related Documents

- [DESIGN.md](../docs/DESIGN.md) — Overall design principles
- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) — Technical architecture
- [UI_REFACTOR_PLAN_OPUS_2026-01-24.md](./UI_REFACTOR_PLAN_OPUS_2026-01-24.md) — Previous UI audit
- [tailwind-shadcn.md](./tailwind-shadcn.md) — Tailwind/shadcn conventions

---

## 12. Open Questions

1. **Should search live in header or content area?**
   - Header: Global, always visible, consistent placement
   - Content: Contextual, cleaner header, better flow

2. **Sidebar collapse behavior:**
   - Always visible on lg+
   - Collapsible to icons
   - Hidden with toggle button

3. **Grid vs. Masonry for homepage:**
   - Uniform grid: Cleaner, predictable
   - Masonry: More visual interest, better for varied image sizes

4. **Named grid areas vs. line-based:**
   - Named areas: More readable, easier to reason about
   - Line-based: More flexible, better for dynamic layouts

---

## Appendix A: Code Snippets

### A.1 Tailwind v4 Grid Template Areas (Utility Classes)

```html
<!-- Using arbitrary values for grid-template-areas -->
<div class="grid [grid-template-areas:'header_header'_'sidebar_content']">
  <header class="[grid-area:header]">...</header>
  <aside class="[grid-area:sidebar]">...</aside>
  <main class="[grid-area:content]">...</main>
</div>
```

### A.2 Container Query Product Grid

```html
<div class="@container">
  <div class="grid grid-cols-2 @sm:grid-cols-3 @md:grid-cols-4 @lg:grid-cols-5 gap-4">
    <!-- Products auto-fit based on container width, not viewport -->
  </div>
</div>
```

### A.3 Sticky Sidebar with Safe Area

```html
<aside class="sticky top-[calc(var(--header-height)+1rem)] max-h-[calc(100dvh-var(--header-height)-2rem)] overflow-y-auto">
  <!-- Sidebar content -->
</aside>
```

---

*Document created by Claude (Opus 4.5) — GitHub Copilot*
