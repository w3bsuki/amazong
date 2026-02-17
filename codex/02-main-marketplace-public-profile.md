# Main Marketplace And Public Profile Audit

## Scope

- `app/[locale]/(main)`
- `app/[locale]/[username]`
- `components/shared/filters/*`
- `components/shared/product/*`
- `components/layout/*`
- `components/mobile/*`
- `components/desktop/*`

## Current State Summary

- Server-first page shell is good, but client implementations are duplicated by viewport and context.
- Home/discovery and profile listing behavior reuse concepts but not implementation.

## Findings

## P0

- Duplicated discovery state and loading logic between:
  - `app/[locale]/(main)/_components/mobile-home.tsx` (`679 lines`)
  - `app/[locale]/(main)/_components/desktop-home.tsx` (`553 lines`)
- Duplicated filter-system behavior between:
  - `components/shared/filters/filter-hub.tsx`
  - `app/[locale]/(main)/_components/desktop/filters-sidebar.tsx`
  - `app/[locale]/(main)/_components/desktop/desktop-filter-modal.tsx`

## P1

- Product card variants (`mobile`, `desktop`, `list`, `mini`) duplicate rendering/event patterns.
- Shell-level wrappers (`PageShell`, `DesktopShell`, `ProfileShell`) overlap in responsibilities and layout defaults.

## P2

- Header and sidebar variants are numerous and partially configuration-equivalent.

## Simplification Targets

1. Build one discovery state engine used by mobile + desktop renderers.
2. Keep one filter logic engine with presentational modes (drawer/modal/sidebar).
3. Collapse product-card variants into fewer composable configurations.
4. Consolidate shell primitives.

## Candidate Refactor Moves

- Create `useDiscoveryFeed` (or equivalent server/client split) and route all viewports through it.
- Rework filter UIs to consume one shared state contract.
- Convert card variations to `layout`/`density` props instead of separate component trees.
- Reuse shared sidebar primitives for category navigation where possible.

## Visual Parity Risks

- Filter control spacing and live count presentation across breakpoints.
- Product card line-clamp, image behavior, and quick-view actions.
- Sticky layout behavior in shells and sidebars.

## Success Criteria

- Removed duplicated discovery/filter logic.
- Fewer product card files without visual regression.
- Equivalent UX and behavior on mobile + desktop.
