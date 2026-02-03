# Next.js 16 (App Router) Audit + Refactor Playbook

Goal: keep identical routing + behavior while deleting boilerplate and shrinking `"use client"` scope.

Reference overview (stable): `docs/refactor.md`
Reference plan (active): `.codex/refactor/refactor.md`

## What “good” looks like in this repo

- `app/` contains **routes only** (pages/layouts/loading/error/route handlers).
- Route groups are used for **organization**, not as a dumping ground for shared code.
- Server Components by default; `"use client"` only at interactive leaves.
- One canonical pattern for:
  - data fetching (server-only),
  - server actions,
  - route handlers (`app/**/route.ts`),
  - caching/tagging/invalidation (consistent).

## Audit checklist (high ROI first)

### 1) Route map + wrapper consolidation

- [ ] Inventory route groups and URL surface (no URL changes allowed).
- [ ] Identify “thin wrapper” layouts and consolidate upward.
- [ ] Consolidate repeated `loading.tsx` / `error.tsx` / `not-found.tsx` into the highest meaningful boundary.
- [ ] Identify duplicated `@modal` / intercepting route wiring; hoist/merge.

Evidence to collect:
- layout graph (which layouts wrap which routes)
- counts: `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- duplicated UI shells (same header/footer/providers repeated)

### 2) Server vs Client boundary shrink

- [ ] List top `"use client"` files in `app/` by “breadth” (route-level / layout-level is most suspicious).
- [ ] For each candidate: propose split into server wrapper + client leaf.
- [ ] Ensure client leaves receive **serializable props only**.

Red flags:
- `use client` at route level “because it uses a hook” (usually fixable by extracting the hook usage).
- Providers in `app/` that could be scoped to a route group instead of global.

### 3) Data + caching correctness (reduce complexity, not features)

- [ ] Identify all request-entrypoints (`cookies()`, `headers()`, auth session access) to know which routes are dynamic.
- [ ] Ensure cached code (`'use cache'`) never touches request APIs.
- [ ] Ensure every cache tag has an invalidation “owner”.

### 4) Route handlers sanity

- [ ] Inventory `app/**/route.ts` handlers and categorize: public read, auth read, writes, webhooks.
- [ ] Check: auth gating, consistent error schema, safe logging, no secrets/PII.
- [ ] Identify duplicate handler patterns and centralize helpers.

### 5) URL hygiene and metadata

- [ ] `generateMetadata` consistency: canonical/OG/robots, no duplicated titles.
- [ ] Locale routing correctness (next-intl): internal links always locale-correct.

## “Search patterns” (manual audit when tools fail)

```powershell
# All App Router files
rg -n --glob \"app/**\" \"page\\.tsx|layout\\.tsx|loading\\.tsx|error\\.tsx|not-found\\.tsx|route\\.ts\"

# Client surface
rg -n --glob \"app/**\" '\"use client\"'

# Request-entrypoint usage (forces dynamic)
rg -n --glob \"app/**\" \"next/headers|cookies\\(|headers\\(\"

# Parallel routes / intercepts
rg -n --glob \"app/**\" \"@modal|\\(\\.\\.\\)\"
```

## Subagent prompt (copy/paste)

```text
Stack audit: Next.js 16 App Router

Focus:
- layout consolidation opportunities
- duplicated @modal / intercept wiring
- excessive \"use client\" scope in app/
- duplicated loading/error/not-found UI
- request API usage that makes routes dynamic

Output:
- inventory counts
- top 10 consolidation candidates (with file paths)
- top 10 \"use client\" shrink candidates (with file paths)
- 3 smallest safe batches + verification commands
```
