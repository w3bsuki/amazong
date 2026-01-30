# Audit — 2026-01-30 — Backend Production Push (Backend Bundle)

## SUPABASE

### Scope
- Files:
  - `supabase/migrations/20251127_add_search_history.sql`
  - `supabase/migrations/20251124_audit_and_secure.sql`
  - `supabase/migrations/20251214100000_reviews_feedback_system.sql`
  - `supabase/migrations/20260124213000_anon_privileges_hardening.sql`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SUPABASE-001 | Critical | `supabase/migrations/20251127_add_search_history.sql:58` | `public.add_search_history` is `SECURITY DEFINER` and trusts `p_user_id` without enforcing `auth.uid()`; if EXECUTE is granted, a caller can write search history for other users. | Ignore `p_user_id` and use `auth.uid()` exclusively; add `SET search_path = public, pg_temp`; `REVOKE EXECUTE` from `PUBLIC/anon` and grant only to `authenticated`. |
| SUPABASE-002 | High | `supabase/migrations/20251124_audit_and_secure.sql:11` | `public.is_admin` is `SECURITY DEFINER` without fixed `search_path`, which is a standard linter/security risk. | Add `SET search_path = public, pg_temp` (or `''` + qualified names) and ensure EXECUTE is not broadly granted. |
| SUPABASE-003 | Medium | `supabase/migrations/20251214100000_reviews_feedback_system.sql:32` | `increment_helpful_count` grants EXECUTE to `anon` (and is allow-listed in `20260124213000_anon_privileges_hardening.sql`), enabling unauthenticated write amplification/spam. | Remove `anon` EXECUTE (or gate by auth) and keep `authenticated` only; consider rate-limiting if anon is required. |

### Acceptance Checks
- [ ] No `select('*')` in hot paths (project fields + paginate)
- [ ] Schema/RLS changes are represented as migrations

### Risks
- `SECURITY DEFINER` functions without fixed `search_path` may fail Supabase linter and increase injection risk; requires migration updates before prod deploy.
- If `anon` EXECUTE remains for write RPCs, review abuse surface and monitoring/rate-limits.

## NEXTJS

### Scope
- Files:
  - app/[locale]/(account)/layout.tsx
  - lib/badges/category-badge-specs.server.ts
  - lib/data/categories.ts
  - lib/data/products.ts
  - app/api/categories/route.ts
  - app/api/categories/[slug]/attributes/route.ts
  - app/api/categories/[slug]/children/route.ts
  - app/api/categories/attributes/route.ts
  - app/api/categories/products/route.ts
  - app/api/categories/counts/route.ts
  - proxy.ts
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | Low | lib/badges/category-badge-specs.server.ts:1 | Module-level `"use cache"` applies to all exports; easy to add a new export without `cacheLife()`/`cacheTag()` | Keep `"use cache"` inside each exported cached function or enforce `cacheLife()`/`cacheTag()` on any new export |
| NEXTJS-002 | Low | app/[locale]/(account)/layout.tsx:75 | `headers()` is used in a layout; if this layout is ever wrapped in a cached helper, it will violate cache rules | Ensure this layout remains dynamic and never called from cached functions; keep `connection()` guard |

### Acceptance Checks
- [ ] `pnpm -s typecheck` passes
- [ ] No `cookies()`/`headers()` usage inside cached functions

### Risks
- Low risk of future caching regressions if module-level `"use cache"` is extended without cache tags/lifetimes

## TS

### Scope
- Files:
  - `supabase/functions/ai-shopping-assistant/index.ts`
  - `app/api/checkout/webhook/route.ts`
  - `app/api/boost/checkout/route.ts`
  - `app/api/payments/set-default/route.ts`
  - `app/api/payments/delete/route.ts`
  - `app/api/products/count/route.ts`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TS-001 | Critical | `app/api/checkout/webhook/route.ts:37` | Unsafe cast of `items_json` metadata to `OrderItemPayload[]` without validation in Stripe webhook path. | Validate metadata with zod/io-ts (array of `{id, qty, price, variantId?}`) before use. |
| TS-002 | Critical | `app/api/products/count/route.ts:74` | `request.json()` cast to `CountRequest` without runtime validation in data-access route. | Add schema parse (zod) and default-safe coercion before building queries. |
| TS-003 | High | `app/api/boost/checkout/route.ts:63` | Body cast to `{ productId, durationDays, locale }` without validation in payment flow. | Add zod schema, reject non-string/invalid values before Stripe calls. |
| TS-004 | High | `app/api/payments/set-default/route.ts:15` | Unvalidated `paymentMethodId/dbId` from `request.json()` used in Stripe + DB updates. | Parse/validate body schema; ensure strings and expected formats. |
| TS-005 | High | `app/api/payments/delete/route.ts:15` | Unvalidated `paymentMethodId/dbId` used to detach Stripe method and delete DB row. | Parse/validate body schema; ensure strings and expected formats. |
| TS-006 | Medium | `supabase/functions/ai-shopping-assistant/index.ts:1` | `@ts-nocheck` disables all type safety in Edge Function. | Remove `@ts-nocheck` and fix typing errors explicitly. |
| TS-007 | Medium | `supabase/functions/ai-shopping-assistant/index.ts:516` | `@ts-ignore` masks type mismatch for `.overlaps("tags", tags)` query. | Fix Supabase client typing or cast to correct typed query builder. |

### Acceptance Checks
- [ ] `pnpm -s typecheck` passes
- [ ] No new `as any` / `@ts-ignore` in touched files

### Risks
- Typecheck not run during this audit.
- Other route handlers may accept `request.json()` without schema validation beyond this grep.

## ORCH

### Scope
- Files:
  - `app/api/checkout/webhook/route.ts`
  - `app/actions/products.ts`
  - `app/actions/orders.ts`
  - `lib/structured-log.ts`
  - `supabase/migrations/*` (RLS policy tightening)
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| ORCH-001 | High | `app/api/checkout/webhook/route.ts:9` | Module-level admin client + raw `console.error` calls in a Stripe webhook handler increase risk of noisy logs and accidental PII leakage. | Create admin client inside `POST()`, replace `console.error` with `logError(...)` and keep meta minimal (no emails/addresses/session bodies). |
| ORCH-002 | High | `supabase (RLS): orders/order_items policies` | Some policies are scoped to `{public}` roles (includes anon); although `auth.uid()` checks block most anon writes, it broadens exposure and increases audit surface. | Restrict affected policies to `authenticated` roles (keep same `USING`/`WITH CHECK` clauses). |
| ORCH-003 | Medium | `app/actions/products.ts:199` | Multiple server actions log raw error objects via `console.error(...)` (potential for leaking data in structured error payloads). | Replace with `logError(...)` and include only safe identifiers; avoid embedding user content. |

### Acceptance Checks
- [ ] `pnpm -s lint` passes
- [ ] No secrets/PII in logs in touched files

### Risks
- Tightening policy roles requires care not to break admin/service-role flows; verify with Supabase advisors and minimal app smoke.
