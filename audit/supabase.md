# Supabase Audit — 2026-01-24

## Current state snapshot

- Client helpers: `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/middleware.ts`
- Migrations: `supabase/migrations/*` (long history; consider baseline strategy later)

## Advisors (Supabase MCP) — 2026-01-24

### Security

- ✅ `public.category_stats` is no longer flagged (previously: `materialized_view_in_api`, then `security_definer_view`)
- ⚠️ Leaked password protection disabled (advisor: `auth_leaked_password_protection`) — manual dashboard toggle

### Performance

- INFO: many `unused_index` advisories (review candidates; don’t auto-drop)
- WARN: duplicate index on `public.admin_docs` (advisor: `duplicate_index`) — drop one after confirming usage

## Fixes applied (migrations)

- `supabase/migrations/20260124213000_anon_privileges_hardening.sql`
- `supabase/migrations/20260124214000_category_stats_public_view.sql`
- `supabase/migrations/20260124215000_category_stats_security_invoker_view.sql`

### `public.category_stats` hardening

- Materialized view renamed to `public.category_stats_mv` (internal)
- Public surface remains `public.category_stats`:
  - `public.get_category_stats()` (SECURITY DEFINER) reads from the materialized view
  - `public.category_stats` is a SECURITY INVOKER view selecting from the function
- Grants:
  - `anon`/`authenticated`: SELECT on `public.category_stats`, EXECUTE on `public.get_category_stats()`
  - `anon`/`authenticated`: no privileges on `public.category_stats_mv`

### Anon privileges hardening

- Revoked anon DML on all tables in `public` (`INSERT/UPDATE/DELETE/...`)
- Revoked all sequence privileges from anon
- Revoked EXECUTE on all functions in `public` from PUBLIC and from anon, then allow-listed anon EXECUTE for:
  - `get_shared_wishlist(character varying)`
  - `get_hero_specs(uuid, text)`
  - `increment_view_count(uuid)`
  - `increment_helpful_count(uuid)`
  - `get_category_stats()`
- Default privileges (new objects):
  - `postgres` in schema `public`: removed default grants to anon for tables/sequences/functions
  - `supabase_admin` in schema `public`: may be skipped in this environment (permission denied); verify `pg_default_acl` in prod

## Data exposure notes

### `public.profiles` vs `public.private_profiles`

- `public.profiles` contains public-facing profile fields (username/display_name/avatar/etc) and is intentionally public-readable.
- Sensitive PII/finance fields live in `public.private_profiles` (`email`, `phone`, `stripe_customer_id`, fee/commission fields) and are protected by RLS and no anon privileges.
- Follow-up: decide whether `profiles.role` should remain publicly readable; `requireAdmin()` already reads admin email from `private_profiles`.

## Remaining (manual) action

- Enable leaked password protection: Supabase Dashboard → Authentication → Password security (HaveIBeenPwned), then re-run security advisors.
