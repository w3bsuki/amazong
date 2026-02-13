# Mobile-First Design Rationale

> Design decision: Why Treido is mobile-first and how breakpoints work.

| Status | Verified |
|--------|----------|
| Date | 2026-02-12 |

---

## Context

Treido targets the Bulgarian marketplace, where mobile usage dominates.
The app must feel native-quality on phones while remaining functional on desktop.

## Decision

- **Mobile-first:** All layouts designed for 375px+ then scaled up
- **Breakpoint strategy:** Tailwind's responsive prefixes (sm → md → lg → xl)
- **Touch targets:** Minimum 44×44px tap targets, 48px for primary actions
- **Mobile UX patterns:**
  - Bottom tab bar for primary navigation
  - Drawer-based modals over route-based modals on mobile
  - Swipe gestures where platform conventions exist
- **Desktop enhancement:** Additional sidebars, hover states, keyboard navigation

## Alternatives Considered

- Desktop-first: Poor mobile experience, which is majority traffic
- Separate mobile app: Too much dev overhead for small team
- Capacitor hybrid: Used for potential future app store presence, not primary channel

## Consequences

- Components need responsive variants (mobile/desktop directories)
- Navigation is completely different between mobile (tab bar) and desktop (header nav)
- Testing needs both viewport sizes in E2E

---

*Last updated: 2026-02-12*
