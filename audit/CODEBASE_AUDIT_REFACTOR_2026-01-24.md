# Amazong Full Audit + Refactor Proposal (2026-01-24)

## Scope and Method
- Codebase scan of app/, lib/, components/, hooks/, scripts/, supabase/
- Supabase MCP advisors (security + performance), table inventory, and policy checks
- Tailwind palette scan + globals.css review + arbitrary value scan

## Executive Summary
- Critical security issue: a live API key exists in local `.env` (ensure it is not committed; rotate if leaked/used anywhere public). NOTE: in this checkout, `.env` is not tracked by git.
- Critical data exposure risk: `public.profiles` is publicly readable and includes sensitive columns (email, phone, stripe IDs, fees).
- Additional data exposure risks: `public.products` is publicly readable (policy `qual=true`) and includes seller-only fields like `cost_price`; `public.subscription_overview` view selects `profiles.email` and is accessible to `anon/authenticated`.
- Over-engineering hotspots: duplicated product creation flows, duplicated category tree logic, and multiple product feed endpoints with overlapping query logic.
- Supabase health: RLS is enabled on all public tables and no tables are missing policies, but a materialized view is exposed via Data APIs and leaked-password protection is disabled.

## Treido Audit - 2026-01-24

### Critical (blocks release)
- [ ] Secret committed in repo -> `.env` -> remove from git, rotate the key immediately, move to `.env.local` / secret manager
- [ ] Public profiles expose sensitive fields -> `public.profiles` (RLS policy: public SELECT) -> split into public view + private table or remove sensitive columns from public access

### High (next sprint)
- [ ] Duplicated product creation and validation rules -> `app/actions/products.ts` and `app/api/products/create/route.ts` -> extract shared validation + creation service, keep one public entry point
- [ ] Duplicated category tree building and filters -> `lib/data/categories.ts` and `app/api/categories/route.ts` -> centralize in `lib/data/categories` and reuse
- [ ] Multiple product feed endpoints with similar selects and business rules -> `app/api/products/feed/route.ts`, `app/api/products/newest/route.ts`, `app/api/products/deals/route.ts`, `app/api/products/nearby/route.ts` -> create a single feed query builder and reuse
- [ ] Logging noise and potential sensitive logs -> many `console.*` in `app/actions/*`, `app/api/*`, `components/*` -> replace with structured logger and redaction rules
- [ ] Docs drift and duplication -> `docs/`, `docs-site/`, `docs-final/` -> pick a single source of truth and archive the rest

### Deferred (backlog)
- [ ] CSS token sprawl and conflicting font sources -> `app/globals.css` + `app/legacy-vars.css` + `app/shadcn-components.css` -> consolidate tokens into one layer
- [ ] Generated artifacts in repo -> `.next/`, `node_modules/`, `playwright-report/` present locally -> ensure they remain gitignored and not committed
- [ ] Review AI assistant surface area and costs -> `app/api/assistant/*`, `lib/ai/*` -> ensure rate limits and feature-flagged access

## Supabase Lane Phase 1 Audit — 2026-01-24

### Critical (blocks Phase 2)
- [ ] Public SELECT on `profiles` includes sensitive columns (email, phone, stripe_customer_id, fees) -> `public.profiles` -> create `public_profiles` view and revoke direct table SELECT for anon/auth
- [ ] Public SELECT on `products` includes seller-only columns (e.g. `cost_price`, `sku`, `barcode`) -> `public.products` -> restrict columns (column privileges) or move seller-only fields to a private table / view-backed public surface
- [ ] `subscription_overview` view selects `profiles.email` and is accessible to anon/auth -> `public.subscription_overview` -> remove email from view OR restrict view to service role/admin only
- [ ] Materialized view exposed via Data APIs -> `public.category_stats` -> restrict to service role or add RLS/select policy and a narrow view
- [ ] SECURITY DEFINER maintenance RPCs appear callable by PUBLIC/anon/auth (DoS/state-change risk) -> `refresh_category_stats`, `cleanup_expired_boosts`, `expire_listing_boosts`, `check_subscription_expiry` -> restrict EXECUTE to service role and call via cron only

### High (do in Phase 2)
- [ ] Leaked password protection disabled -> Supabase Auth -> enable leaked password protection
- [ ] Unused indexes reported by advisor -> `public.listing_boosts`, `public.admin_docs`, `public.admin_tasks`, `public.admin_notes`, `public.buyer_feedback`, `public.conversations`, `public.notifications`, `public.seller_feedback`, `public.cart_items`, `public.order_items`, `public.user_badges`, `public.business_verification`, `public.category_stats`, `public.profiles`, `public.orders`, `public.return_requests` -> review and drop safe candidates

### Deferred (Phase 3 or backlog)
- [ ] Migration history is extremely long and category-heavy -> `supabase/migrations/*` -> consider squashing into a new baseline for dev/staging and archiving old migrations
- [ ] Verify all publicly readable tables only expose intended columns -> `public.products`, `public.buyer_stats`, `public.seller_stats`, `public.badge_definitions`, `public.category_attributes`, `public.product_attributes` -> document allowed fields and enforce via views

## Tailwind Lane Phase 1 Audit — 2026-01-24

### Critical (blocks Phase 2)
- [ ] None detected by scan (palette/gradient scan produced no offenders)

### High (do in Phase 2)
- [ ] Arbitrary values still present -> `components/ui/accordion.tsx`, `components/ui/toggle.tsx`, `components/ui/radio-group.tsx`, `components/ui/textarea.tsx` -> replace `[3px]` ring values with theme tokens where possible

### Deferred (Phase 3 or backlog)
- [ ] Token source duplication -> `app/globals.css` and `app/legacy-vars.css` -> migrate remaining calc-only vars into `@theme` and remove legacy file
- [ ] Missing styling guide at `docs/guides/styling.md` referenced by skill -> document or delete reference

## Evidence and Notes (selected)
- RLS enabled on all public tables; no public tables missing policies (Supabase MCP query)
- Views `deal_products` and `subscription_overview` are `security_invoker=true` (so they rely on underlying table policies/privileges)
- `public.category_stats` is a materialized view with `anon/authenticated` read ACL and no RLS
- `public.products` and `public.profiles` both have public SELECT policies with `qual=true` and contain sensitive columns that should not be world-readable
- No `.select('*')` usage found in `lib/data/*.ts`
- Category and product query logic is duplicated across API routes and data modules
- Many console logs across actions/routes/components should be centralized and redacted

## Refactor Proposal (Incremental, shippable steps)

### Goals
- Reduce duplicated business rules and query logic
- Minimize public data exposure and tighten Supabase policies
- Simplify docs and design token sources
- Keep each step small (1-3 files) and safe to ship

### Phase 0 - Security and Hygiene (immediate)
1. Remove any leaked secret -> `.env` -> rotate immediately if it was used anywhere public, ensure `.env` is not tracked, add `.env.example` if needed
2. Confirm `.env.local` and `.env.vercel.local` are not tracked and contain no secrets committed to git
3. Lock down public surfaces -> create safe views (or column-privilege model) for `profiles` and `products`, and remove `profiles.email` from `subscription_overview` (or restrict view)

### Phase 1 - Data Access Consolidation
1. Extract shared product creation service -> new `lib/services/products/create.ts` -> update `app/actions/products.ts` to call it
2. Retire duplicate API product creation -> `app/api/products/create/route.ts` -> delegate to service or remove endpoint if unused
3. Centralize product feed query builder -> new `lib/data/products/queries.ts` -> update `app/api/products/*` and `lib/data/products.ts`

### Phase 2 - Category System Simplification
1. Reuse category tree builder -> move tree logic into `lib/data/categories.ts` and import in `app/api/categories/route.ts`
2. Replace multi-query category fetch with RPC or view -> update `app/api/categories/route.ts` to use `get_category_descendants` / `get_category_path`
3. Introduce a single categories cache tag map -> shared `lib/data/categories/cache.ts`

### Phase 3 - Supabase Cleanup
1. Enable leaked password protection in Supabase Auth
2. Remove unused indexes flagged by advisors (after verifying usage)
3. Restrict `category_stats` access -> create a security definer view or disable API access
4. Create a new baseline migration and archive old migrations in `supabase/migrations/` (staging first)

### Phase 4 - UI and Token Cleanup
1. Consolidate design tokens into `app/globals.css` `@theme` block
2. Migrate remaining calc-only tokens out of `app/legacy-vars.css` and remove the file
3. Replace `[3px]` focus rings with theme tokens in `components/ui/*`

### Phase 5 - Docs and Tooling Cleanup
1. Pick a single docs source (`docs-site` or `docs/`) and archive/remove the rest
2. Move audit outputs to `docs/audits/` and stop storing in repo root
3. Add a short STYLE guide referencing actual token sources

## Cleanup and Improvements Backlog
- Normalize logging via `lib/structured-log.ts` with redaction helpers
- Add rate limits for AI and webhook endpoints
- Revisit default product validation differences between API routes and actions
- Track and delete unused features (AI assistant, boost flows, admin docs seeding) if not in scope

## Gates (after each change set)
- `pnpm -s exec tsc -p tsconfig.json --noEmit`
- `pnpm test:unit`
- `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
