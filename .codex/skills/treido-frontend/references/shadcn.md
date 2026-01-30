# shadcn/ui (Treido Patterns)

Treido uses shadcn/ui primitives as building blocks. This doc describes how we keep the boundary clean.

## Boundary Rule

- `components/ui/*` contains primitives only:
  - no app-specific logic
  - no imports from `app/`, `components/shared/`, `components/layout/`, or `components/providers/`
  - no data fetching (Supabase, Stripe, server actions)
- Composites belong in:
  - `components/shared/*` (reusable across routes)
  - `app/[locale]/(group)/**/_components/*` (route-private)

## Primitive Conventions

- Support `className` and merge with `cn` (`@/lib/utils`).
- Keep APIs small (props, variants), prefer composition over "mega components".
- Avoid one-off styling: tokens only, no arbitrary values, no palette colors.

## Refactor Heuristic

If a `components/ui/*` file starts to:
- import business/domain types
- call hooks that depend on app state
- contain feature-specific branching

...move the feature logic into a composite component in `components/shared/*` and keep the primitive minimal.

## Practical Verification

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```
