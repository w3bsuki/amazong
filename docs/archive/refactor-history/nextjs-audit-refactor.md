# Next.js Full Audit + Refactor

> **For Codex CLI.** A focused, ground-up Next.js alignment pass.
> Covers: App Router patterns, Server/Client boundaries, caching, routing, metadata, performance, bloat removal.
> **Does NOT touch:** DB/migrations/RLS, auth internals, payment/webhook logic, Stripe code.

---

## Prerequisites

1. Read `AGENTS.md` — project identity, constraints, conventions.
2. Read `docs/STACK.md` — our tech stack, especially the Next.js 16 + React 19 sections.
3. Read `docs/DESIGN.md` — UI patterns, responsive strategy, component organization.
4. Read `docs/DECISIONS.md` — why patterns exist (DEC-001 through DEC-014).
5. Read `refactor/shared-rules.md` — mandatory rules for all refactor work.
6. **Fetch latest docs** using the MCP tools:
   - `resolve-library-id` → `get-library-docs` for **Next.js** (App Router, Server Components, caching, metadata, image optimization, route handlers, server actions, middleware, config)
   - `resolve-library-id` → `get-library-docs` for **shadcn/ui** (latest component patterns, RSC compatibility)
   - `resolve-library-id` → `get-library-docs` for **Tailwind CSS v4** (CSS-first config, v4 migration patterns)

---

## Current Codebase Snapshot

| Metric | Value |
|--------|-------|
| Next.js version | 16.1.4 |
| React version | 19.2.3 |
| TypeScript | 5.9.3 |
| Total source files | 937 |
| LOC (source) | ~131K |
| `"use client"` directives | 216 |
| `"use cache"` directives | 11 |
| Pages (page.tsx) | 86 |
| Layouts (layout.tsx) | 12 |
| Route handlers (route.ts) | 47 |
| Loading boundaries (loading.tsx) | 88 |
| Error boundaries (error.tsx) | 25 |
| Files with metadata | 92 |
| >300 line files | 93 |
| <50 line files | 248 |

---

## Phase 1: AUDIT (read-only — use subagents for bulk discovery)

Launch subagents for each audit area in parallel. Each subagent catalogs findings into a structured list. **No code changes in this phase.**

### Audit 1A: Server/Client Boundary Analysis

Catalog every `"use client"` file. For each, determine:
- Does it actually use `useState`, `useEffect`, `useRef`, `useReducer`, `useCallback`, `useMemo`, event handlers (`onClick`, `onChange`, `onSubmit`, etc.), or browser APIs (`window`, `document`, `navigator`, `localStorage`)?
- If NO → flag for `"use client"` removal (convert to Server Component)
- If YES but only a small section needs interactivity → flag for splitting (Server Component wrapper + thin Client island)

**Subagent prompt:** "List all files containing `\"use client\"` in `app/`, `components/`, `hooks/`. For each file, report: path, line count, which client-only APIs it uses (useState/useEffect/useRef/event handlers/browser APIs). If none found, mark as REMOVABLE."

### Audit 1B: Caching & Data Fetching Patterns

Catalog all data fetching patterns:
- Files using `"use cache"` — verify they follow the contract: `cacheLife()` + `cacheTag()` paired, `createStaticClient()` used (not `createClient()`), no `cookies()`/`headers()`/`new Date()`/user-specific data inside.
- Files doing Supabase queries WITHOUT caching that could benefit from `"use cache"` (public, non-user-specific reads like categories, product listings, homepage sections).
- Files using stale patterns: `fetch()` with `revalidate` (old Pages Router style), `getStaticProps`/`getServerSideProps` leftovers, manual `unstable_cache`.
- Check `next.config.ts` cacheLife profiles — are they all being used? Are any unused?

**Subagent prompt:** "Search for all Supabase query calls (`supabase.from(`, `.select(`, `createClient()`, `createStaticClient()`, `createAdminClient()`) in `app/`, `lib/`, `components/`. For each: report path, which client is used, whether it's inside a `\"use cache\"` block, and whether the data is user-specific or public."

### Audit 1C: Route & Layout Architecture

Catalog the full route tree:
- Every route group `(group)` — list pages, layouts, loading, error, not-found, template files
- Pages MISSING `generateMetadata` or `export const metadata` — every public page needs metadata for SEO
- Pages MISSING `error.tsx` boundaries — every user-facing route group needs one
- Pages MISSING `loading.tsx` — evaluate if streaming is sufficient or if explicit loading states are needed
- Redundant/duplicate loading.tsx files (88 is suspicious — many might be unnecessary if layouts stream properly)
- Unnecessary route groups — any `(group)` that contains only 1 page and adds no layout value
- Parallel routes (`@modal`, `@slot`) — are they used correctly?
- Route handler bloat — 47 route handlers, which ones could be server actions instead?

**Subagent prompt:** "Map the complete route tree under `app/[locale]/`. For each directory, list: magic files present (page/layout/loading/error/not-found/template/route), whether the page has metadata, and line count of each file. Flag: pages without metadata, route groups with unnecessary nesting, loading.tsx files that are generic skeleton duplicates."

### Audit 1D: Import & Bundle Analysis

- Files importing from `next/link` directly instead of `@/i18n/routing` (convention violation)
- Files importing from `next/navigation` directly instead of `@/i18n/routing` for `redirect`/`usePathname`/`useRouter`
- `next/image` usage — are images using proper `width`/`height` or `fill`? Any missing `alt`?
- `next/dynamic` usage — are dynamic imports used where they should be (heavy client components)?
- Barrel files (`index.ts` that re-export) — these break tree-shaking in App Router
- Circular imports
- Unused exports (cross-reference with `pnpm knip` output)

**Subagent prompt:** "Search for: (1) `from 'next/link'` or `from \"next/link\"` — should use `@/i18n/routing` instead. (2) `from 'next/navigation'` — check if it's for redirect/usePathname/useRouter which should come from `@/i18n/routing`. (3) `next/dynamic` usage. (4) `index.ts` barrel files in `components/` and `lib/`. Report all findings."

### Audit 1E: Performance & Best Practices

- `<Suspense>` boundaries — are they wrapping async Server Components properly?
- Streaming — are layouts set up to stream content progressively?
- `optimizePackageImports` in next.config.ts — is the list complete? Any heavy packages missing?
- Image optimization — any `<img>` tags that should be `<Image>`?
- Font loading — is `next/font` used correctly? Any external font loads that should be local?
- Bundle size concerns — any large client components that should be lazy-loaded?
- `generateStaticParams` — are dynamic routes that could be statically generated using it?
- Any `export const dynamic = 'force-dynamic'` or `export const revalidate = 0` that could be removed?
- Check for `suppressHydrationWarning` spam — should only be on `<html>` tag for themes

**Subagent prompt:** "Search for: `<Suspense`, `generateStaticParams`, `export const dynamic`, `export const revalidate`, `<img ` (not Image), `suppressHydrationWarning`, `next/font`. Report all findings with file paths."

### Audit 1F: Over-Engineering & Bloat Detection

- Files <30 lines that exist just to re-export or wrap one thing
- Loading/error/not-found files that are copy-paste duplicates of each other
- Route handlers that do what a server action could do (no external callers, just same-origin mutations)
- `_components/` folders with only 1 file — might not need the indirection
- Provider files that wrap a single context with <5 lines of logic
- Utility files in `lib/` with only 1 exported function used in 1 place

**Subagent prompt:** "Find: (1) All files <30 lines in `app/`, `components/`, `lib/` — report path and content summary. (2) All `loading.tsx` files — hash their content to find duplicates. (3) All `_components/` directories with only 1 file. (4) All `lib/` files with only 1 export."

---

## Phase 2: PLAN

After all audit subagents report back, synthesize findings into a prioritized action plan:

### Priority 1 — Quick Wins (safe, mechanical, high impact)
- Remove unnecessary `"use client"` directives
- Fix `next/link` → `@/i18n/routing` imports
- Fix `next/navigation` → `@/i18n/routing` imports
- Add `generateMetadata` to pages missing it
- Deduplicate identical loading.tsx files (extract shared skeleton)
- Remove barrel index.ts files

### Priority 2 — Caching Improvements
- Add `"use cache"` to public data fetching functions that qualify
- Ensure all cached functions have proper `cacheLife()` + `cacheTag()` pairs
- Verify Supabase client selection (static client for cached reads)

### Priority 3 — Component Boundary Optimization
- Split mixed Server+Client components into proper islands
- Convert route handlers to server actions where appropriate
- Merge tiny over-extracted files back into parents
- Split oversized (>300L) files into focused modules

### Priority 4 — Performance
- Add Suspense boundaries where beneficial
- Add `next/dynamic` for heavy client components not above the fold
- Ensure `generateStaticParams` on eligible dynamic routes
- Remove unnecessary `force-dynamic` / `revalidate: 0`

### Priority 5 — Cleanup
- Delete truly dead code (grep-verified zero usage)
- Remove redundant not-found/error boundaries that add nothing over parent layout
- Consolidate duplicate patterns

Write the plan as a checklist with estimated file count per item.

---

## Phase 3: EXECUTE

Work through the plan in priority order. For each priority batch:

1. Make all changes in the batch
2. Run verification:
   ```bash
   pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
   ```
3. If FAIL: fix up to 3 attempts, then revert and continue
4. If PASS: move to next batch

### Execution Rules

- **No behavior changes.** Every page must render identically before and after.
- **No route URL changes.** Paths stay the same.
- **Grep before deleting.** Zero imports/usage before removing any file or export.
- **Think in batches.** Don't verify after every single file edit.
- **Don't touch:** `supabase/`, `lib/auth/`, Stripe webhook routes, `components/providers/auth-state-manager.tsx`, `database.types.ts`, `proxy.ts` auth logic.
- **Loading.tsx special rule:** Don't delete a loading.tsx unless you've verified the page streams properly without it. Route-level loading boundaries are a feature, not bloat, IF they show meaningful skeletons.
- **Metadata special rule:** Use `generateMetadata` (dynamic) for pages with dynamic title/description. Use `export const metadata` (static) for pages with fixed content. Always include at minimum: `title`, `description`.
- **Server action vs route handler rule:** Only convert a route handler to a server action if it has NO external callers (webhooks, callbacks, third-party services, cron jobs).

---

## Phase 4: REPORT

After execution, generate `refactor/nextjs-audit-report.md`:

```markdown
# Next.js Audit + Refactor — Report

## Metrics: Before → After
| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| "use client" directives | 216 | ? | ? |
| "use cache" directives | 11 | ? | ? |
| Route handlers | 47 | ? | ? |
| Loading files | 88 | ? | ? |
| Pages with metadata | 92/86 | ? | ? |
| Barrel index.ts files | ? | ? | ? |
| Wrong import (next/link) | ? | ? | ? |
| Total source files | 937 | ? | ? |

## Changes Made
[Categorized list of all changes]

## What Was NOT Changed (and why)
[Items found in audit but intentionally skipped — with reasoning]

## Recommendations for Future Work
[Items that need human decision or are out of scope]
```

---

## Verification (final)

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

Then run architecture scan to see updated metrics:
```bash
pnpm -s architecture:scan
```

---

## How To Run This

### Full autonomous run:
```
Read refactor/nextjs-audit-refactor.md. Execute all 4 phases. Use subagents for Phase 1 audit discovery.
Fetch latest Next.js docs via resolve-library-id + get-library-docs before starting.
```

### Audit only (no code changes):
```
Read refactor/nextjs-audit-refactor.md. Execute Phase 1 only — audit and report findings. No code changes.
```

### Resume after interruption:
```
Read refactor/nextjs-audit-refactor.md. Check refactor/nextjs-audit-report.md for progress. Continue from where you left off.
```
