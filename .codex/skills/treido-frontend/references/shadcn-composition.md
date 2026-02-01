# shadcn/ui Composition (Primitives vs Composites)

Treido uses shadcn/ui primitives as the stable foundation. This doc explains how to scale without turning `components/ui/*` into app code.

## Boundary (non-negotiable)

`components/ui/*`:

- primitives only
- no imports from `app/**`
- no imports from feature composites (`components/shared/*`, `components/layout/*`, `components/providers/*`)
- no Supabase, Stripe, or server actions

If you need feature logic, build a composite:

- reusable → `components/shared/*`
- route-private → `app/[locale]/(group)/**/_components/*`

## What belongs in a primitive

- styling + variants (CVA)
- Radix composition and accessibility wiring
- `className` passthrough and `cn()` merge
- small ergonomic props (e.g., `inset`, `size`)

What does not belong:

- data fetching
- business rules
- app state hooks
- route-specific layout decisions

## CVA pattern (preferred)

Use `class-variance-authority` for variant APIs:

- variants stay declarative
- call sites stay readable

Rules:

- keep variant count small
- prefer composing primitives over adding more variants

## Client boundaries

Some primitives must be client components (Radix requires it).

Rules:

- client primitives must still remain “primitive-only”
- keep any state inside the Radix primitive usage (avoid feature state)
- never pull app modules into `components/ui/*` just because it is client

## Migration heuristic

If a `components/ui/*` file starts to accumulate feature conditionals:

1. extract a composite into `components/shared/*`
2. keep the primitive’s API stable
3. update call sites to use the composite

