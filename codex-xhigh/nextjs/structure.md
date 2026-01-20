# Next.js (App Router) — Target Structure

## Invariants (non-negotiable)
- Layouts own chrome (header/footer/nav). Pages own content only.
- Server Components fetch data; Client Components handle interactivity.
- Shared components must not import app-layer server actions directly.
- Route-private code stays inside its route group (don’t import across groups).

## Where things live (target)
- `app/[locale]/layout.tsx`: providers only (locale/theme/auth)
- `app/[locale]/(main)/layout.tsx`: app shell + header + footer + mobile nav
- `app/[locale]/*/_actions/*`: server actions (route-scoped when possible)
- `lib/data/*` and `lib/supabase/queries/*`: reusable data access
- `components/ui/*`: shadcn primitives only (no app hooks)
- `components/common/*`: shared composites (cards/sections)
- `components/layout/*`: shells (headers/nav/sidebars)

## Preferred patterns
- Data fetching: centralize queries in `lib/data/*` (with caching where safe).
- Variants (homepage/contextual/minimal): choose via layout + context, not DOM hacks.
- Errors: use App Router error boundaries + `notFound()` (avoid ad-hoc redirects).

