# Phase 2 — Supabase Backend + TypeScript Alignment (Correctness, Security, and Query Hygiene)

Purpose: make Supabase integration **typed, consistent, secure, and performant** so frontend + backend behavior is predictable and production-safe.

This phase owns:
- Supabase client patterns (server/static/admin/browser)
- DB types generation and usage
- RLS boundary correctness (what is allowed, where, and why)
- Query consolidation and payload hygiene

---

## Scope

In scope:
- Standardize Supabase client creation across server components, route handlers, actions, and client components.
- Ensure database types are current and used end-to-end (no `any` for rows).
- Fix unsafe “silent failure” patterns around missing env vars.
- Create/adjust SQL migrations in `supabase/migrations/` when they reduce risk or remove N+1s.
- Validate storage/public bucket usage for product images.

Out of scope:
- UI styling/UX polish (Phase 1)
- App Router structural refactors and caching strategy beyond what’s needed for backend correctness (Phase 3)
- Release automation + Playwright (Phase 4)

---

## Repo Reality (what exists now)

- Typed DB schema: `lib/supabase/database.types.ts`
- Server clients: `lib/supabase/server.ts` (`createClient`, `createStaticClient`, `createAdminClient`)
- Middleware session refresh: `lib/supabase/middleware.ts`
- Browser client: `lib/supabase/client.ts` (currently includes a mock client fallback when env vars are missing)
- Migrations: `supabase/migrations/*.sql` (extensive)
- Legacy migration script: `scripts/migrations.sql`
- Local migration applier: `scripts/apply-migration.js` (depcheck reports missing `pg`)

---

## Quality Gates (must stay green)

- [ ] Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] Lint: `pnpm lint`
- [ ] Build: `pnpm build`
- [ ] Manual smoke (auth + data): `/[locale]/account`, `/[locale]/sell`, `/[locale]/categories`, product page, chat page

---

## AI Execution Protocol (required)

When executing Phase 2, the agent MUST:

- Work in small batches (1–3 tasks), and after each batch run typecheck + a relevant smoke.
- Never change DB schema without adding a migration under `supabase/migrations/`.
- Prefer **joins/RPC/database functions** over client-side N+1 loops when retrieving related entities.
- Make RLS boundaries explicit:
  - If using admin/service role, justify it and ensure it’s only server-side.
  - If using anon key, ensure policies allow only the intended rows.

If Supabase MCP tools are available, use them to validate assumptions:
- List tables and confirm schemas
- Run security/performance advisors
- Generate types

---

## Work Queue (prioritized)

### P0 — Correctness & security (launch-blocking risks)

#### 1) Eliminate “silent Supabase mock” in real runtime
Context: `lib/supabase/client.ts` returns a mock client when env vars are missing, which can hide production misconfiguration.
- [ ] Change behavior to be environment-aware:
  - Dev: allow a warning fallback if you intentionally want it
  - Production: fail fast (throw) so you don’t ship a broken backend
- [ ] Ensure the fallback can’t mask auth/data issues on deployed builds.
- Acceptance:
  - Missing env vars causes an obvious failure in production mode.
  - Dev still remains ergonomic (documented behavior).
- Verify:
  - `pnpm build`
  - `pnpm start` with env present

#### 2) Single source of truth for Supabase client patterns
- [ ] Confirm that all server-side code imports from `lib/supabase/server.ts`.
- [ ] Confirm that all client-side code imports from `lib/supabase/client.ts`.
- [ ] Remove ad-hoc `createClient(supabaseUrl, key)` usage in scripts/app routes unless justified.
- Acceptance:
  - No “random” clients created in app runtime.
  - Admin client is only used server-side.

#### 3) Database types are current and regenerated predictably
- [ ] Verify `lib/supabase/database.types.ts` matches the current Supabase project schema.
- [ ] Add/confirm a single documented way to regenerate types:
  - via Supabase MCP type generation, or
  - via Supabase CLI `gen types typescript` (if you’re using CLI)
- [ ] Ensure all DB operations use `Database` typing.
- Acceptance:
  - Regenerating types produces no app compile changes (or changes are expected and fixed).
  - No `any` for query results where DB row shapes are known.

#### 4) RLS boundary audit for critical tables
- [ ] Identify “critical” tables used by core flows:
  - profiles
  - products
  - orders/order_items
  - messages/conversations
  - sellers/stores
  - storage objects (buckets)
- [ ] For each: confirm RLS is enabled and policies match app behavior.
- [ ] Document each table’s access model in this phase file (one short block per table).
- Acceptance:
  - No client-side code requires service role.
  - Auth-required pages don’t rely on insecure client-provided user ids.

#### 5) Fix the chat N+1 query hotspot via SQL/RPC
(Production audit calls out N+1 patterns in message loading.)
- [ ] Move “load conversations with profiles/store + last message” to one DB call:
  - SQL view/function + `rpc()` is acceptable.
- [ ] Update app code to call the RPC and remove multiple per-conversation fetches.
- Acceptance:
  - Conversation list loads with a single query.
  - No realtime channel subscribes to “everything” without server-side filter (if feasible).

---

### P1 — Performance + data hygiene (high value)

#### 6) Normalize query select shapes (avoid `select('*')` where it bloats payload)
- [ ] For critical pages, tighten selects to fields actually used.
- [ ] Ensure the narrowed selects don’t break UI.
- Acceptance:
  - Smaller payloads on category/search/product lists.
  - No missing fields in UI.

#### 7) Storage image reliability pass
(Audits reported broken Supabase storage image loads.)
- [ ] Confirm how product images are stored (public bucket vs signed URLs).
- [ ] Ensure UI always has a fallback for missing/broken images.
- [ ] Ensure storage policies allow intended read access (public browsing vs auth).
- Acceptance:
  - Product grids show images or a clean placeholder (no broken icons).
  - No recurring console warnings for failed image fetches.

#### 8) “Test data in production” mitigation hooks (backend-side)
(UI audits complain about gibberish product titles; full cleanup is operational, but backend can prevent future damage.)
- [ ] Add server-side validation constraints where appropriate (DB constraint or trigger) ONLY if it won’t break existing flows.
- [ ] Alternatively, add validation at insert/update boundary (server actions / route handler).
- Acceptance:
  - New product titles meet minimum quality rules.
  - Existing data is not silently corrupted.

---

### P2 — Tooling + migration hygiene (clean and predictable)

#### 9) Resolve migration tooling split-brain
Currently you have both `supabase/migrations/*.sql` and legacy `scripts/migrations.sql`.
- [ ] Decide the canonical source:
  - Prefer `supabase/migrations/` for production evolution.
- [ ] Mark legacy scripts as deprecated (docs) or remove if unused.
- Acceptance:
  - One clear migration path.

#### 10) Fix or remove `scripts/apply-migration.js`
(depcheck indicates `pg` is missing.)
- [ ] Determine if the script is still used.
  - If yes: add `pg` dependency and document usage.
  - If no: remove script and references.
- Acceptance:
  - No broken scripts in repo.

#### 11) Add Supabase advisors as a recurring checklist
- [ ] Run Security advisor and record findings.
- [ ] Run Performance advisor and record findings.
- [ ] Convert actionable items into Phase 2 tasks (small, check-boxable).

---

## Verification Checklist (end-of-phase)

- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] `pnpm lint`
- [ ] `pnpm build`
- [ ] Manual smoke:
  - [ ] Login, then `/[locale]/account` loads reliably
  - [ ] `/[locale]/sell` can read required data (categories, profile)
  - [ ] Browse categories + product page without console spam
  - [ ] Chat loads conversation list without lag/spikes

---

## Deliverables (must be true)

- [ ] Supabase is fully typed and consistently instantiated (server/static/admin/browser).
- [ ] Missing env vars can’t silently “mock” production behavior.
- [ ] RLS boundaries are documented and enforced.
- [ ] The worst N+1 queries are eliminated (starting with chat).
- [ ] Migration + type generation workflow is explicit and repeatable.
