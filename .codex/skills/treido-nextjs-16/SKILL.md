---
name: treido-nextjs-16
description: Next.js 16 App Router specialist for Treido. Use for routing, layouts, Server vs Client Components, caching ('use cache'), and request entrypoints (proxy.ts). Not for styling.
---

# treido-nextjs-16

Treido Next.js App Router specialist focused on boundaries, caching purity, and routing conventions.

## When to Apply

- Route/layout/group restructuring in `app/**`.
- Server vs client component boundary decisions.
- Cached data function design (`'use cache'`, `cacheLife`, `cacheTag`).
- Revalidation strategy after mutations.

## When NOT to Apply

- Tailwind styling/token-only work.
- Pure DB schema work with no Next.js boundary impact.
- Stripe-only payment correctness tasks.

## Non-Negotiables

- Treido request entrypoint is `proxy.ts` (do not introduce root `middleware.ts` without explicit request).
- Default to Server Components.
- In cached functions: never use `cookies()`, `headers()`, or auth/session reads.
- Keep cached functions pure and serializable.

## Treido Conventions

- Route-private components: `app/**/_components/*`
- Route-private actions: `app/**/_actions/*`
- Shared server actions: `app/actions/*`
- Revalidate by tags/paths after server mutations.

## Output Template

```md
## Boundary Decision
- <server/client/cached/dynamic>

## Files
- <paths>

## Verification
- <typecheck/lint + route and cache sanity checks>
```

## References

- `docs/ARCHITECTURE.md`
- `docs/ROUTES.md`
- `docs/WORKFLOW.md`
- `docs/AGENTS.md`
