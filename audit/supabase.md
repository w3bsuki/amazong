# Supabase Audit — 2026-01-24

## Current state snapshot

- Client helpers: `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/middleware.ts`
- Migrations: `supabase/migrations/*` (long history; consider baseline strategy later)

## Advisors (Supabase MCP)

### Security

- Materialized View exposed via Data APIs
  - `public.category_stats` is selectable by anon/auth roles (advisor: `materialized_view_in_api`)
- Leaked password protection disabled (advisor: `auth_leaked_password_protection`)

### Performance

- Many “unused index” advisories across admin/notifications/orders/etc. (advisor: `unused_index`)
  - Treat as **review candidates**, not auto-delete (usage stats reset after some operations/environments).

## Critical exposure: `public.profiles`

### Evidence (policy + grants)

- RLS policy exists:
  - `Public profiles are viewable by everyone` → `SELECT` → `qual = true` → `roles = {public}`
- Grants:
  - `has_table_privilege('anon', 'public.profiles', 'select') = true`
  - `has_table_privilege('authenticated', 'public.profiles', 'select') = true`

SQL used (for repeatability):

```sql
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname='public' and tablename='profiles'
order by policyname;

select
  has_table_privilege('anon','public.profiles','select') as anon_select,
  has_table_privilege('authenticated','public.profiles','select') as auth_select;
```

### Why this is critical

`public.profiles` includes sensitive columns (examples seen in schema metadata): `email`, `phone`, `stripe_customer_id`, plus fee/commission fields. With the current `SELECT true` policy, **anon can read them** unless you’ve applied column-level privileges elsewhere.

## Where `profiles` is queried today (impact)

Public-ish reads (anon/static client) exist and will break if you simply remove broad `SELECT` access:

- Public profile pages: `lib/data/profile-page.ts` (`createStaticClient().from("profiles")...`)
- Product pages (seller info): `lib/data/product-page.ts` (`.from("profiles")...`)
- Seller lists and other UIs: `app/[locale]/(main)/**`, `components/**` (multiple `.from("profiles")` usages)

This is why a **read-only public view** is the cleanest fix: keep private columns on the base table, but serve public UI from a safe projection.

## Critical exposure: `public.category_stats` (materialized view)

### Evidence (grants)

- `has_table_privilege('anon', 'public.category_stats', 'select') = true`
- `has_table_privilege('authenticated', 'public.category_stats', 'select') = true`
- Advisor reports it as exposed via Data APIs.

## Findings (Phase 1)

### Critical (blocks Phase 2)

- [ ] **Lock down `public.profiles`** → prevent anon from reading sensitive columns → Evidence: policy `SELECT true` + anon select privilege on `public.profiles` → Fix: remove the broad public policy, grant anon reads via a `public_profiles` view (safe columns only), and restrict base-table reads to “own row” (and admin/service role).
- [ ] **Restrict `public.category_stats` exposure** → materialized view is accessible via Data APIs → Evidence: advisor + anon/auth select privilege → Fix: revoke privileges for anon/auth and expose a safe alternative (view/RPC) if needed.
- [ ] **Enable leaked password protection** in Supabase Auth → reduces account takeover risk → Evidence: advisor warning.

### High (do in Phase 2)

- [ ] **Inventory all public-readable tables/views** → ensure only intended columns are readable by anon/auth → Fix: document an “exposure map” and enforce via views/privileges.
- [ ] **Review unused indexes** from advisors → drop only after verifying query usage in prod/stage → Fix: batch drops with rollback notes.

### Deferred (Phase 3 or backlog)

- [ ] **Migration strategy** → long migration chain slows onboarding/dev DB resets → Fix: create a new baseline migration for staging/dev and archive old ones.

## Client/Server usage (code health check)

### Good patterns present

- Cookie-aware server client: `createClient()` in `lib/supabase/server.ts`
- Route handler client uses request cookies: `createRouteHandlerClient()` in `lib/supabase/server.ts`
- Cached reads use anon key + fetch without timeout: `createStaticClient()` in `lib/supabase/server.ts`
- Admin client separated: `createAdminClient()` in `lib/supabase/server.ts`
- Middleware session refresh + route gating: `lib/supabase/middleware.ts` (used by `proxy.ts`)

### Guardrails to keep

- Never import `createAdminClient()` into `"use client"` modules (keep it server-only).
- Prefer explicit column selection on hot paths (avoid widening exposure by accident).

## Suggested next actions (small batches)

1) Add `public_profiles` view (safe columns only) and switch **public reads** to it (`lib/data/profile-page.ts`, `lib/data/product-page.ts`, etc.).
2) Replace the broad base-table `SELECT true` policy with:
   - authenticated: `auth.uid() = id` (own row)
   - admin/service role: explicitly allowed as needed
3) Re-run Supabase advisors and confirm warnings cleared.
