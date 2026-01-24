# Next.js Audit Checklist

## Routing & layouts
- [ ] Layouts render chrome; pages do not render headers/footers.
- [ ] No DOM manipulation to hide layout elements.
- [ ] Route groups are respected (no cross-imports of `app/[locale]/(group)/_*` code).

## Server/client boundaries
- [ ] Shared components don’t import server actions directly (pass handlers as props).
- [ ] No client components doing server-only work (cookies/headers/db).

## Data fetching & caching
- [ ] “One place” per domain query (no duplicated `.select()` strings across routes).
- [ ] Caching is explicit (`'use cache'` + `cacheLife()` where used).

## Production safety
- [ ] Redirects/URLs do not trust `Origin` headers (use env base URL).
- [ ] Env vars are documented and used consistently.

