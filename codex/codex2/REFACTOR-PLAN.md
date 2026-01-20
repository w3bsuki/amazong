# Refactor Plan (Architecture + Folder Organization)

## Goals
- Minimal, intentional file layout with clear boundaries
- Remove duplication and dead code
- Enforce public interfaces for shared components
- Prepare for production readiness gates

## Folder structure rules (proposed)
- app/ — routes only (route-private code stays inside route group)
- components/
  - ui/ — primitives only
  - common/ — shared composites
  - layout/ — shells
  - domain/ — domain-specific components (buyer, seller, orders, etc.)
- hooks/ — reusable hooks
- lib/ — pure utilities only
- config/ — build/config
- messages/ — i18n
- supabase/ — db + functions
- docs/ — consolidated docs

## Step-by-step refactor
1. Identify dead code and duplicate components. Remove or merge.
2. Normalize domain components:
   - Move cross-domain components into components/common/.
   - Ensure route-private modules stay in app/[locale]/(group)/_*.
3. Reduce components/ sprawl by merging small single-use directories.
4. Ensure lib/ has no React imports and components/ has no app/ imports.
5. Standardize naming and index exports for shared components.
6. Remove legacy CSS files that are no longer referenced.

## Enforce boundaries
- Update lint rules or add simple checks in scripts/ to prevent cross-group imports.
- Restrict UI primitives to components/ui/ only.

## Cleanup sweep
- Remove leftover temporary files, archived docs, and reports.
- Ensure no unused assets in public/.
