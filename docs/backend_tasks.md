# Backend Tasks (Execution Queue)

Owner: Backend agent(s)

This is the day-to-day queue for backend work. The overall go-live checklist remains `tasks.md`.

Read first: `docs/workflow.md`, `docs/backend.md`, `docs/ENGINEERING.md`, `docs/PRODUCTION.md`, `supabase_tasks.md`.

## P0: Start here (today)

- [x] Run Supabase MCP security advisors; eliminate warnings (or explicitly accept + document)
- [ ] Clear dashboard-only security advisor warning later (tracked in `supabase_tasks.md`)
- [x] Run Supabase MCP performance advisors; record findings + decide what is safe to defer
- [x] Reproduce `/plans` failure (Stripe return URLs missing locale) and fix as a small batch
- [x] Stripe sanity: webhook applies plans by `metadata.plan_id` and signature verification is in place

## P0 audit notes (fill this in)

For each issue:
- Area (RLS / advisors / caching / stripe / middleware)
- Evidence (advisor output, SQL, failing route)
- Minimal fix (migration name + summary)
- “Done when” acceptance criteria

### Supabase advisors (latest evidence)

- **Area:** advisors (security)
- **Evidence (2026-01-06):** `mcp_supabase_get_advisors({ type: "security" })`
	- `auth_leaked_password_protection` (WARN): Leaked Password Protection Disabled
- **Minimal fix:** Dashboard-only (deferred; tracked in `supabase_tasks.md`)
- **Done when:** Advisors show 0 non-dashboard warnings; dashboard-only warning remains explicitly tracked with an owner/date

- **Area:** advisors (performance)
- **Evidence (2026-01-06):** `mcp_supabase_get_advisors({ type: "performance" })`
	- INFO-only: unused index lints (no action pre-launch)
- **Minimal fix:** None (defer index removals until post-launch verification)
- **Done when:** No P0/P1 performance warnings requiring action; unused indexes are captured for later cleanup with idx_scan evidence

## P1: Cost + correctness sanity (this session)

- [x] Data/cost sanity: audit hot-path queries for over-fetching (no `select('*')` in list views), deep joins, and missing indexes only when justified by advisors/EXPLAIN
- [ ] Next.js caching sanity: ensure cached reads use `createStaticClient()` + `'use cache'` + `cacheLife` + granular `cacheTag`, and `revalidateTag(tag, profile)` uses the required profile arg
- [ ] Payments sanity: verify `/en/plans` checkout and return URLs behave correctly with locale, and webhook plan mapping via `metadata.plan_id` is correct + idempotent

### Batch notes (2026-01-06)

- **Area:** stripe / locale return URLs
- **Problem:** API routes used for subscription checkout/portal could return users to `/account/plans` without locale.
- **Fix:** Infer locale from request (body/header/referer) and build return URLs as `/{locale}/account/plans`.
- **Done when:** Stripe success/cancel/portal return URLs always include locale; E2E smoke stays green.

- **Area:** business dashboard / orders list payload
- **Problem:** Business orders list fetched `orders.shipping_address` (large JSON) even though the list UI doesn’t read it.
- **Fix:** Stop selecting `shipping_address` in `getBusinessOrders()` and preserve `shipping_address: null` in the mapped object; dedupe `IN (...)` ids to reduce query args.
- **Done when:** Orders list renders unchanged; payload is smaller; typecheck + E2E smoke pass.

#### Phase 2 evidence (data/cost sanity)

- **List endpoints audited (field projection):**
	- `GET /api/products/search` uses explicit select and only joins `profiles(username)`
	- `GET /api/products/feed`, `/api/products/newest`, `/api/products/nearby`, `/api/products/deals` use explicit select strings (no `select('*')`)
- **Business dashboard:** `getBusinessOrders()` no longer fetches `orders.shipping_address` (large JSON) for the list view.
- **No action taken on indexes:** Supabase performance advisors reported INFO-only unused indexes; index changes deferred until post-launch `idx_scan`/EXPLAIN evidence.

## Batch Log entry to copy into tasks.md

Batch name: BE - Supabase advisor snapshot (2026-01-06)
Owner: BE
Scope (1-3 files/features): docs/backend_tasks.md
Risk: low
Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit`, `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Done when:
- Supabase advisor evidence recorded; dashboard-only warning explicitly deferred
- Next batch can focus on hot-path query + caching audits

Batch name: BE - Fix Stripe API return URLs include locale (2026-01-06)
Owner: BE
Scope (1-3 files/features): app/api/subscriptions/checkout/route.ts, app/api/subscriptions/portal/route.ts, docs/backend_tasks.md
Risk: low
Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit`, `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Done when:
- Checkout `success_url`/`cancel_url` and billing portal `return_url` include `/{locale}/account/plans`
- Webhook mapping continues to rely on `metadata.plan_id`

Batch name: BE - Slim business orders list payload (2026-01-06)
Owner: BE
Scope (1-3 files/features): lib/auth/business.ts, docs/backend_tasks.md
Risk: low
Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit`, `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Done when:
- Business orders list no longer fetches `orders.shipping_address`
- Orders list UI behavior unchanged (still receives `shipping_address: null`)

Batch name: BE - Phase 2 complete: data/cost sanity audit (2026-01-06)
Owner: BE
Scope (1-3 files/features): docs/backend_tasks.md
Risk: low
Verification: `pnpm -s exec tsc -p tsconfig.json --noEmit`, `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

Done when:
- Hot-path list views confirmed to use field projection (no `select('*')`)
- At least one concrete payload reduction shipped (business orders list)

## Guardrails (backend)

- Use existing Supabase clients in `lib/supabase/server.ts`; no new client layers.
- RLS policies must rely on `auth.uid()` (not client-provided IDs).
- For cached reads: `createStaticClient()` + `'use cache'` + `cacheLife(...)` + granular `cacheTag()`.
- Keep batches small and always record a Batch Log entry in `tasks.md`.

## P2: Over-engineering cleanup (only after P0/P1 is stable)

- [ ] Refactor `lib/auth/business.ts` into smaller, testable helpers (no behavior changes; keep selects slim)
- [ ] Audit large server action modules for duplication and over-fetching (delete dead paths; no new layers)
