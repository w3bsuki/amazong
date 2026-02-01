# Primitives vs Composites (Treido Boundary Rules)

Treido uses shadcn/ui primitives under `components/ui/*`.

## What belongs in `components/ui/*` (Primitives)

Primitives are:
- reusable across the app
- mostly presentation + accessibility glue
- composable via props, `asChild`, and standard React patterns

Allowed dependencies (typical):
- Radix primitives
- `class-variance-authority` (CVA)
- `@/lib/utils` (cn helper)
- small shared helpers that do not depend on app routes/features

Primitives must NOT:
- import from `app/**`
- import from route-private folders (`app/**/_components`, `_actions`, `_lib`)
- import Supabase, Stripe, or feature/domain modules
- call `useTranslations` or hardcode feature copy
- perform data fetching or call server actions

## What belongs in `components/shared/*` (Composites)

Composites are:
- feature-agnostic but opinionated building blocks (cards, form blocks, page shells)
- made by composing primitives plus shared business/UI rules

Examples:
- a `PageShell` that applies surface hierarchy rules
- a `ProductCard` that composes Badge, Button, typography, and spacing conventions
- a `FormField` that composes Label, Input, errors, and help text

## What belongs in route-private `app/**/_components`

Route-private UI is:
- only used by one route group or segment
- allowed to know about the feature and route params
- should not be imported outside its route group

## Audit Heuristics (When to move something)

If a `components/ui/*` file contains any of:
- translation keys or next-intl calls
- imports from `@/app/*`
- Supabase client usage
- feature naming in props (e.g. `SellerOnboardingStep`, `CheckoutSummary`)

...it is likely not a primitive.

Minimal fix suggestions for audits:
- move the composite into `components/shared/*`
- keep a thin primitive in `components/ui/*` (or use existing shadcn primitive)
- update imports (avoid route-private leaks)

