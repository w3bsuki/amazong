# Backend Refactor + Audit Plan (Supabase, Next.js 16 caching, Stripe)

Owner: Backend agent(s) (Supabase MCP)

Canonical execution queue: `docs/backend_tasks.md` (tick items + add batch notes there).  
Global launch checklist: `tasks.md` (orchestrator-owned).

Goal: ship with secure RLS, boringly-correct payments, and stable Vercel/Supabase costs (no caching/ISR regressions).

## Non-negotiables

- No new architecture layers.
- Don’t touch secrets; don’t log keys/JWTs/full request bodies.
- Use existing Supabase client patterns (`lib/supabase/server.ts`); don’t invent new client wrappers.
- Every non-trivial batch must pass: `tsc` + `e2e:smoke` (see `docs/TESTING.md`).

## Sources of truth

- Stack rules: `docs/ENGINEERING.md`, `docs/PRODUCTION.md`, `agents.md`
- Workflow + gates: `docs/workflow.md`, `tasks.md`
- Dashboard-only tasks: `supabase_tasks.md`

## Definition of Done (backend)

- Supabase Security Advisors: 0 actionable warnings (dashboard-only items may be deferred but must be recorded).
- RLS correctness: user-facing reads/writes are impossible without being the owner (`auth.uid()` patterns).
- Hot-path queries avoid `select('*')` and avoid deep nested joins; list views project fields.
- Next.js caching is correct: `'use cache'` + `cacheLife('<profile>')` + granular `cacheTag()`; invalidation uses `revalidateTag(tag, profile)`.
- Stripe/webhooks are correct and idempotent (replays don’t create duplicates).

## What to audit (backend tech stack)

### Supabase (security + perf)

- Advisors (security + performance) via Supabase MCP.
- Storage bucket policies for product images (no public write).
- RLS policy perf: avoid bare `auth.uid()` evaluation; prefer `(select auth.uid())` where relevant.

### Next.js 16 caching + ISR (cost + correctness)

- Cached reads use `createStaticClient()` and never read `cookies()`/`headers()` inside cached code.
- Every cached function pairs `'use cache'` with `cacheLife('<profile>')`.
- Tags are granular; avoid invalidating “everything” by accident.
- Ensure `generateStaticParams()` exists where feasible (locale + key segments) to avoid ISR write spikes.

### Middleware/proxy (Vercel cost control)

- Ensure matcher skips static assets and auth checks run only on protected routes.
- Ensure middleware/proxy doesn’t accidentally read per-user data in cached contexts.

### Stripe (money correctness)

- Checkout/portal return URLs include locale.
- Webhooks verify signatures and are idempotent.
- Subscription plan mapping uses `metadata.plan_id` and can’t be spoofed by client input.

## Repeatable audit commands (fast, repo-local)

- Find `select('*')` hotspots: `rg -n \"select\\('\\*'\\)|select\\(\\*\\)\" -S lib app`
- Find `revalidateTag` missing profile: `rg -n \"revalidateTag\\(\" -S app lib` (manually inspect calls)
- Find cached code missing `cacheLife`: `rg -n \"'use cache'\" -S lib app` then verify `cacheLife(...)` nearby
- Unused files/exports signals: `pnpm -s knip`

## Supabase MCP (audit mode)

1. `mcp_supabase_get_advisors({ type: \"security\" })`
2. `mcp_supabase_get_advisors({ type: \"performance\" })`
3. `mcp_supabase_list_tables({ schemas: [\"public\"] })`
4. Apply minimal migrations via `mcp_supabase_apply_migration(...)`

## Execution strategy (so you don’t stall)

- Work in meaningful slices: one migration or 1–3 related code files.
- Ship multiple batches per session (3–6 is the target).
- Always record evidence + “done when” in `docs/backend_tasks.md`.

