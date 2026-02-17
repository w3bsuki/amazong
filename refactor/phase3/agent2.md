# Phase 3 — Agent 2: Data Layer Optimization

> **Scope:** Query optimization, client→server data migration, Supabase client correctness.
> **Read `refactor/shared-rules.md` first.**

---

## Objectives

1. Eliminate remaining `select('*')` in hot paths.
2. Move client-side data fetching to server-side.
3. Fix incorrect Supabase client usage per context.
4. Find and fix N+1 query patterns.

## How to Work

### 1. Find and fix `select('*')`

```bash
grep -rn "select(['\"]\\*['\"])" app/ lib/ --include="*.ts" --include="*.tsx"
```

For each result: replace with explicit column list. Only select columns that the consuming component actually uses. Check the component that receives this data — what fields does it render?

### 2. Find client-side data fetching that should be server-side

```bash
# useEffect + fetch pattern
grep -rn "useEffect" app/ components/ --include="*.tsx" -l | xargs grep -l "fetch\|supabase"
# Client-side supabase queries in components
grep -rn "createBrowserClient" components/ --include="*.tsx" -l
```

For each pattern found:
- Can this data be loaded in a Server Component or server action instead?
- If the component fetches data on mount → move the fetch to the parent Server Component, pass as props.
- If it fetches on user interaction (search, pagination) → that's legitimate client-side. Keep it.

### 3. Verify Supabase client correctness

| Context | Correct Client |
|---------|---------------|
| Server Components / Server Actions | `createClient()` |
| Cached reads (`"use cache"`) | `createStaticClient()` |
| Route handlers (`app/api/`) | `createRouteHandlerClient(request)` |
| Admin / webhooks | `createAdminClient()` |
| Browser / client components | `createBrowserClient()` |

```bash
# Server components using browser client (WRONG)
grep -rn "createBrowserClient" app/ --include="*.tsx" -l | while read f; do grep -L '"use client"' "$f"; done

# Route handlers not using route handler client
grep -rn "createClient()" app/api/ --include="*.ts"

# Server actions using browser client (WRONG)
grep -rn "createBrowserClient" app/actions/ --include="*.ts"
```

Fix any mismatches.

### 4. Find N+1 queries

```bash
# Loops that query supabase inside them
grep -rn "\.from(" app/ lib/ --include="*.ts" --include="*.tsx" -B5 | grep -E "for |\.map\(|\.forEach\("
```

For each: can the loop query be replaced with a single batch query using `.in()` or a join?

## Special Notes

- **DON'T TOUCH** queries in `lib/auth/`, Stripe webhook handlers, or payment flows.
- **DON'T modify** `lib/supabase/database.types.ts` — it's auto-generated.
- **DON'T modify** the Supabase client factories themselves (`lib/supabase/server.ts`, `lib/supabase/client.ts`) — only fix which client is used WHERE.
- When reducing `select('*')`, check the TypeScript types — the consuming code may expect certain fields. Run typecheck after each change.

## Verification

After each query change: `pnpm -s typecheck`
After all changes: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

## Output

- `select('*')` eliminated (count + files)
- Client-side fetches moved to server (count + files)
- Supabase client mismatches fixed (list)
- N+1 queries fixed or flagged (list)
- Queries intentionally left as-is (brief reason)
