# App Feel & UX

> **Consolidates:** APP-FEEL-GUIDE.md, APP-FEEL-COMPONENTS.md, APP-FEEL-CHECKLIST.md, 14-UI-UX-PLAN.md, and DESIGN.md §8.5.
> DESIGN.md remains the token/pattern authority. This file adds the implementation plan, component specs, and UX strategy.

## Goal

Transform Treido from "website" to "web app" feel through consistent mobile-first interaction patterns: bottom navigation, sell drawer wizard, sticky headers, tap states on all interactive elements, 44px touch targets, card hierarchy with light shadows, and progressive disclosure via sheets/modals. Deliver a fast, calm, premium marketplace UX without visual noise.

## Current Status

- Requirements: 3/5 complete (R17) — see REQUIREMENTS.md §R17
- Production: 🟡 Partial — foundation patterns defined but implementation phases not yet started

## Requirements Mapping

| Req ID | Description | Status |
|--------|-------------|--------|
| R17.1 | Keyboard navigation | ✅ |
| R17.2 | Focus management | ✅ |
| R17.3 | Touch targets follow 36/44/48 tiers (44px default) | ✅ |
| R17.4 | Screen reader labels | 🟡 In progress (partial) |
| R17.5 | WCAG 2.1 AA compliance | 🟡 In progress |

## Design Philosophy

**"Native app feel" isn't about copying iOS visuals — it's about:**

1. **Instant feedback** on every interaction (`tap-highlight`)
2. **Consistent spacing** (4px grid)
3. **Content density** without clutter
4. **Bottom navigation** for primary actions
5. **Sheet/drawer patterns** that preserve browsing context
6. **Clean solid surfaces** (solid `bg-background`, no blur/glass)

### Core UX Strategy: URL-as-State

- Progressive disclosure: show more without losing context
- Back button always works (state is in the URL)
- Deep links work (share a product, it opens correctly)
- Prefer **intercepting routes** for overlays — bookmarkable, navigation-consistent

### Default Interaction Patterns

| Interaction | Mobile | Desktop |
|-------------|--------|---------|
| PDP / item preview | Sheet (bottom) | Dialog (modal) |
| Filters | Sheet | Dialog or inline panel |
| Seller preview | Sheet | Dialog |
| Multi-step selling | Sheet wizard | Dialog wizard |

## Mobile-First Production Contract

1. **Visual system**: neutral surfaces + blue accent + destructive red only. No gradients, decorative animation, or palette classes.
2. **Interaction ergonomics**: 44px is the default touch target for core actions (nav, search, category, filters, CTA). Product quick-view is default tap behavior. Filter/search/category flows preserve browsing context.
3. **Layout density**: one primary filter row per screen. Tighter whitespace. Product cards use lower corner radii for larger media area.
4. **Delivery order**: mobile lock first → desktop parity → repo-wide style sweep.

## Component Specifications

### ListingCard

| Element | Pattern | Notes |
|---------|---------|-------|
| Container | `rounded-xl shadow-card tap-highlight` | Light shadow, no border |
| Image | `aspect-square object-cover lazy` | Consistent ratios |
| Save button | Floating `bg-card shadow-sm` | Solid, top-right |
| Badge | `absolute top-2 left-2 text-2xs` | Promoted / condition |
| Content | Price → Title → Location hierarchy | `font-bold text-lg` → `text-sm line-clamp-1` → `text-xs text-muted-foreground` |
| Seller | `border-t pt-2 mt-2` separator | Avatar + name + verified badge |

### BottomNav

| Element | Pattern | Notes |
|---------|---------|-------|
| Container | `fixed bottom-0 bg-background border-t safe-bottom` | Solid white, z-40 |
| Height | `h-16` (64px) | Comfortable touch |
| Labels | `text-2xs` (10px) | Compact |
| Active state | `text-primary` | Color only, no background |
| Sell FAB | `w-12 h-12 -mt-4 shadow-lg rounded-full bg-primary` | Elevated center button |

### StickyHeader

| Element | Pattern | Notes |
|---------|---------|-------|
| Container | `sticky top-0 bg-background border-b safe-top` | Solid, z-40 |
| Height | `h-14` (56px) | Compact |
| Icon buttons | `p-2.5 rounded-full tap-highlight` | 44px touch target |
| Notification dot | `absolute top-1.5 right-1.5 w-2 h-2 bg-primary` | Small indicator |

### SellDrawer (Multi-Step Wizard)

| Element | Pattern | Notes |
|---------|---------|-------|
| Container | `h-[95vh] rounded-t-3xl` bottom Sheet | Near full-height |
| Header | 3-column: back/close, centered title + step count, spacer | Consistent layout |
| Progress bar | `h-1 bg-muted` with `bg-primary` fill | Thin, animated |
| Content | `flex-1 overflow-y-auto` | Independent scroll |
| Footer | `p-4 border-t safe-bottom` | Sticky CTA: `w-full py-3.5 rounded-xl` |

### FormInputs (App-Style Variant)

| Attribute | Standard | App-Style |
|-----------|----------|-----------|
| Border | `border border-input` | `border-0` |
| Background | `bg-background` | `bg-muted` |
| Radius | `rounded-md` | `rounded-xl` |
| Height | `h-(--control-default)` (44px) | `h-(--control-primary)` (48px) |
| Focus | `ring-ring` | `ring-primary` |

### SelectionCards

- **Toggle card**: full-width with iOS-style switch, `tap-highlight`
- **Chip selection**: `px-3 py-1.5 rounded-full`, active = `bg-primary text-primary-foreground`
- **Radio card**: `rounded-xl border`, active = `bg-selected border-primary`

### FloatingButtons

- **Save**: `w-8 h-8 rounded-full bg-card shadow-sm` — over card images
- **Back**: `w-9 h-9 rounded-full bg-card shadow-sm` — over galleries
- **Cover badge**: `absolute bottom-2 left-2 text-2xs bg-primary`

### Badges

- Standard: `text-xs` (12px)
- Compact: `text-2xs` (10px) — used on cards and inline
- Positioning: `absolute top-2 left-2` on cards; `inline-flex` on detail pages

## CSS Utilities Required

```css
/* Tap feedback (CRITICAL for app feel) */
.tap-highlight {
  -webkit-tap-highlight-color: transparent;
}
.tap-highlight:active {
  opacity: 0.7;
  transition: opacity 0.1s ease-in-out;
}

/* Safe areas (iOS notch) */
.safe-top { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }

/* Scrollbar hide */
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
```

### Token Additions (globals.css)

```css
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.1);
```

**Rule:** No glass/blur tokens needed. Use solid `bg-background` everywhere.

## Touch Target Policy (2026-02)

| Tier | Size | Where |
|------|------|-------|
| Migration floor | 32px | Legacy-only; new UI should not introduce this size (`R17.3`) |
| Product default | 44px | Core interactions: header/search/actions, sticky pills, category/scope/filter controls, primary taps |
| Compact exception | 36px | Dense secondary controls only; never primary navigation/actions |

## ResponsiveOverlay

Planned shared component: `components/shared/responsive-overlay.tsx`

- Renders `Dialog` on `md:` and above
- Renders `Drawer` (bottom sheet) on mobile
- Unified props: `open`, `onOpenChange`, `title`, `children`
- URL sync via `useRouter`

**Status:** ⬜ Not built. Product quick-view already uses this pattern (Dialog + Sheet) but not generalized.

## Implementation Phases

| Phase | Focus | Status | Effort |
|-------|-------|--------|--------|
| 1: Foundation | `tap-highlight`, `safe-top`/`safe-bottom`, `scrollbar-hide`, shadow tokens | ⬜ Not started | 1–2 days |
| 2: Core Components | Button tap-highlight, ProductCard patterns, Badge `text-2xs`, Avatar sizes | ⬜ Not started | 3–5 days |
| 3: Navigation | BottomNav solid bg + FAB, StickyHeader + safe areas, back button patterns | ⬜ Not started | 2–3 days |
| 4: Forms & Sell UX | App-style input variant, selection components, SellDrawer wizard | ⬜ Not started | 3–5 days |
| 5: Polish | Skeleton loading, empty states, error states, minimal animations | ⬜ Not started | Ongoing |

## Success Metrics

| Metric | Target |
|--------|--------|
| Modal open → paint | < 100ms |
| Lighthouse accessibility | ≥ 95 |
| Touch target compliance | 100% (core interactive controls ≥ 44px) |
| Back-button reliability | 100% (URL-driven, E2E verified) |
| Design rail violations | 0 (`pnpm -s styles:gate`) |

## Current State

| Component | Status |
|-----------|--------|
| Search `@modal` slot | ✅ Done |
| Category `@modal` slot | ❌ Missing |
| Seller preview modal | ❌ Missing |
| Touch target utilities | ✅ Done (`--spacing-touch*` in globals.css) |
| Product quick-view overlay | ✅ Done (Dialog + Sheet) |
| ResponsiveOverlay component | ❌ Missing |
| Glass surface token | ✅ Done (`bg-surface-glass`) |
| Modal routing E2E test | ❌ Missing |

## Anti-Patterns (Do NOT Use)

| Pattern | Why |
|---------|-----|
| `bg-primary/10` | Use semantic token instead |
| `border-border/60` | Use `border-border-subtle` token instead |
| `rounded-3xl` | Use `rounded-lg` or `rounded-xl` max |
| `bg-gradient-to-r` | No gradients (design rail) |
| `text-[13px]` | Use `text-sm` or `text-xs` |
| Border AND shadow on same element | Choose one |
| Blur/glass on headers | Solid `bg-background` only |

## Required E2E Tests (When Implemented)

| Test File | Scenarios |
|-----------|-----------|
| `e2e/modal-routing.spec.ts` | Search→PDP modal, Category→PDP modal, back preserves scroll, deep link opens modal |
| `e2e/drawer-flows.spec.ts` | Cart drawer, filter drawer on mobile, sell wizard steps |
| `e2e/touch-targets.spec.ts` | All buttons/links ≥ 44px on mobile viewport |

## Known Gaps & V1.1+ Items

| Item | Status | Notes |
|------|--------|-------|
| All 5 implementation phases | ⬜ Not started | Foundation through polish |
| ResponsiveOverlay | ⬜ Not built | Generalized Dialog/Drawer component |
| Category `@modal` slot | ⬜ Missing | PDP modal from category pages |
| Seller preview modal | ⬜ Missing | Quick-view from search/category |
| R17.4: Screen reader labels | 🟡 Partial | Many components lack aria-labels |
| R17.5: WCAG AA | 🟡 In progress | Contrast and focus ring audit needed |
| Modal routing E2E | ⬜ Missing | Back-button verification |

## Cross-References

- DESIGN.md §8.5 — Token/pattern authority for app-feel principles
- DESIGN.md §9 — Accessibility tokens and patterns
- [ROUTES.md](../ROUTES.md) — Modal routing, parallel routes, intercepting routes
- [selling.md](./selling.md) — SellDrawer wizard implementation
- [search-discovery.md](./search-discovery.md) — Product card, filter UX, modal routing
- [TESTING.md](../TESTING.md) — E2E test patterns for modal and drawer flows

---

*Last updated: 2026-02-08*
