# Routing (App Router): Groups, Layouts, Errors, Middleware

Treido uses:
- `app/[locale]/**` (next-intl routing)
- route groups `(account)`, `(sell)`, etc.
- route-private code in `app/[locale]/(group)/_components` and `_actions`

## Route Groups and Boundaries

Rule: Do not import route-private code across route groups.

Audit for:
- imports from `app/**/_components/**` or `app/**/_actions/**` outside their group
- shared code incorrectly left route-private (should be `components/shared/*` or `app/actions/*`)

Fix patterns:
- Promote shared UI to `components/shared/*`
- Promote shared server actions to `app/actions/*`
- Promote shared pure helpers to `lib/*`

## Layouts

Layouts are easy to accidentally turn into a performance bottleneck.

Audit for:
- heavy server fetches in `layout.tsx` that run for many routes
- providers placed too high (forcing large client bundles)
- `layout.tsx` becoming a "God component"

Fix patterns:
- push expensive work down to leaf segments
- keep providers minimal and route-scoped when possible

## Error / Loading / Not Found

Audit for:
- `error.tsx` rendering raw error stacks or message details (PII/secret leak risk)
- missing `not-found.tsx` on user-visible segments that can 404
- `loading.tsx` that uses forbidden styles (arbitrary/palette) or blocks layout shift

Fix patterns:
- show generic error copy via `next-intl`, log safely on server only
- ensure `not-found` copy is localized and provides a safe navigation path

## Segment Config Exports

Audit for:
- `export const dynamic = "force-dynamic"` used broadly (kills caching)
- `export const revalidate = ...` mismatched with caching rules
- `runtime`/`preferredRegion` used without clear need

Fix patterns:
- keep defaults; override only when required
- if a segment must be dynamic, ensure server reads are not accidentally cached

## Middleware / proxy.ts

Middleware runs frequently and can become a global tax.

Audit for:
- matcher too broad (runs on static assets)
- rewriting loops
- request cookie/header mutation that breaks caching assumptions
- heavy logic / DB calls

Fix patterns:
- tighten matcher
- move heavy work to route handlers
- ensure any cookie updates are deliberate and minimal

