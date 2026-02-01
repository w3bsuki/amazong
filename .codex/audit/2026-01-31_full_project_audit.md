# Full Project Audit — 2026-01-31

Merged specialist audits for Next.js, Tailwind v4, shadcn/ui, Supabase, and Backend.

## NEXTJS

### Scope
- Files:
  - components/mobile/mobile-home.tsx
  - components/desktop/desktop-filter-modal.tsx
  - lib/data/products.ts
  - lib/data/categories.ts
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | Medium | components/mobile/mobile-home.tsx:24 | Client component imports `UIProduct` from `lib/data/products`, which is marked server-only (`lib/data/products.ts:1`). This violates RSC boundaries and can break client bundling. | Move shared product types to a client-safe module (e.g., `lib/types/products` or `lib/data/products.types.ts` without `server-only`) and update client imports. |
| NEXTJS-002 | Medium | components/desktop/desktop-filter-modal.tsx:32 | Client component imports `CategoryAttribute` from `lib/data/categories`, which is marked server-only (`lib/data/categories.ts:1`). Same client/server boundary violation. | Extract category types to a client-safe module and switch client imports to that module. |

### Acceptance Checks
- [ ] `pnpm -s typecheck`
- [ ] `pnpm -s lint`

### Risks
- Moving shared types may require updating many import sites (components, stories, tests).
- Missing an import swap can leave a residual server-only dependency in client code.
- If types are re-exported from a new module, ensure no runtime values leak into client bundles.

## TW4

### Scope
- Files:
  - app/**
  - components/**
  - app/globals.css
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | High | app/shadcn-components.css:243 | `oklch(...)` used outside `app/globals.css` `@theme` (forbidden outside token definitions). | Move the derived color into `app/globals.css` as a semantic token (light + dark) and reference via `background-color: var(--color-<token>)` or `bg-<token>`. |
| TW4-002 | Medium | app/shadcn-components.css:226 | Opacity hacks on tokens: `border-muted/40`, `hover:border-destructive/30`, `focus:ring-destructive/50`. | Replace with semantic tokens like `border-border`, `border-destructive`, `ring-focus-ring`, `bg-hover`, or add explicit semantic tokens in `app/globals.css`. |
| TW4-003 | Medium | app/[locale]/(business)_components/business-live-activity.tsx:55 | Text token opacity (`text-primary/70`); similar in `app/[locale]/not-found.tsx:34` and `components/layout/sidebar/sidebar-menu-v2.tsx:442`. | Use semantic text tokens (`text-muted-foreground`, `text-foreground`, etc.) or add a dedicated semantic text token in `app/globals.css`. |
| TW4-004 | Medium | components/dropdowns/notifications-dropdown.tsx:448 | Background opacity on tokens (`bg-accent/30`); also in `components/shared/design-system/design-system-client.tsx:390` and `app/[locale]/(sell)_components/steps/step-details.tsx:344` (`hover:bg-accent/30`, `active:bg-accent/80`). | Swap to state tokens (`bg-hover`, `bg-selected`, `bg-active`) or define explicit semantic surface tokens in `app/globals.css`. |

### Acceptance Checks
- [ ] `pnpm -s styles:gate`
- [ ] `pnpm -s lint`

### Risks
- Replacing opacity hacks with semantic tokens may alter visual weight/contrast and needs UI review.
- Adding new semantic tokens requires both light and dark definitions to avoid theme drift.

## SHADCN

### Scope
- Files:
  - `components/ui/**`
  - `components/shared/**`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | Low | n/a | No findings in scope. | n/a |

### Acceptance Checks
- [ ] n/a (read-only audit)

### Risks
- None noted.

## SUPABASE

### Scope
- Files:
  - `supabase/migrations/20251124_audit_and_secure.sql`
  - `supabase/migrations/20251127_add_search_history.sql`
  - `lib/supabase/**` (scanned)
  - `app/actions/**` (scanned)
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SUPABASE-001 | High | `supabase/migrations/20251124_audit_and_secure.sql:19` | `public.is_admin()` is `SECURITY DEFINER` without a fixed `search_path`, enabling search_path injection risk. | Recreate function with `security definer set search_path = public, pg_temp`. |
| SUPABASE-002 | High | `supabase/migrations/20251127_add_search_history.sql:72` | `add_search_history` writes using caller-supplied `p_user_id` without guarding to `auth.uid()`/admin; with `SECURITY DEFINER` this can bypass RLS. | Enforce `actual_user_id := auth.uid()` and only allow override for `service_role`/admin; use that ID in deletes/inserts. |
| SUPABASE-003 | Medium | `supabase/migrations/20251127_add_search_history.sql:50` | `cleanup_old_search_history` is `SECURITY DEFINER` without fixed `search_path`. | Recreate trigger function with `security definer set search_path = public, pg_temp`. |
| SUPABASE-004 | Medium | `supabase/migrations/20251127_add_search_history.sql:74` | `add_search_history` is `SECURITY DEFINER` without fixed `search_path`. | Recreate function with `security definer set search_path = public, pg_temp`. |

### Acceptance Checks
- [ ] Provide Supabase MCP access token; rerun `mcp__supabase__list_tables` + `mcp__supabase__get_advisors` (security/perf) to confirm live RLS/policy state.
- [ ] `rg -n "security definer" supabase/migrations` shows all SECURITY DEFINER functions include `set search_path = public, pg_temp`.
- [ ] `rg -n "select\\(\\s*\\*\\s*\\)|\\.select\\(\\s*\\)" app lib` returns no matches in hot paths.
- [ ] Verify `add_search_history` uses `auth.uid()` (or admin/service_role override) for all writes.

### Risks
- Supabase MCP is unauthorized, so live RLS/policy drift vs migrations is unverified.
- Tightening `add_search_history` auth may break callers that currently pass arbitrary `p_user_id`.

## BACKEND

### Scope
- Files:
  - `app/api/orders/[id]/ship/route.ts`
  - `app/api/orders/[id]/track/route.ts`
  - `app/api/badges/evaluate/route.ts`
  - `app/api/checkout/webhook/route.ts`
  - `app/api/subscriptions/webhook/route.ts`
  - `lib/structured-log.ts`

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| BE-001 | Medium | `app/api/orders/[id]/ship/route.ts:12` | Body/params are unvalidated; invalid JSON is silently ignored and `trackingNumber`/`shippingCarrier` can be junk, and `id` isn’t checked as UUID. | Add a Zod schema for params/body (UUID `id`, enum `shippingCarrier`, length limits), return 400 on parse/validation failure. |
| BE-002 | Medium | `app/api/orders/[id]/track/route.ts:12` | Same validation gap as ship route; accepts arbitrary JSON and untyped carrier/number. | Share a Zod schema with `ship` and reject invalid payloads (optionally require tracking number for track). |
| BE-003 | Medium | `app/api/badges/evaluate/route.ts:61` | `request.json()` is used without schema; `user_id`/`context` are untrusted and can be oversized or unexpected. | Introduce a strict Zod schema (`user_id` UUID optional, `context` enum) and reject invalid input. |
| BE-004 | High | `app/api/checkout/webhook/route.ts:207` | Idempotency is “select then insert” only; concurrent Stripe retries can still create duplicate orders. | Use an atomic upsert keyed by `stripe_payment_intent_id` and back it with a unique index. |
| BE-005 | High | `app/api/subscriptions/webhook/route.ts:195` | Subscription webhook uses select-then-insert; retries can double-create subscriptions under race. | Upsert by `stripe_subscription_id` with a unique index to make retries safe. |
| BE-006 | Low | `lib/structured-log.ts:9` | Redaction regex omits common PII keys (email/phone/address), so meta logs can leak PII. | Extend `SENSITIVE_KEY` to cover email/phone/address/user_id (or move to an allowlist). |

### Acceptance Checks
- [ ] POST `/api/orders/{id}/ship` with invalid UUID or non-string `trackingNumber` returns 400 and does not update `order_items`.
- [ ] POST `/api/orders/{id}/track` with invalid `shippingCarrier` returns 400.
- [ ] POST `/api/badges/evaluate` with unsupported `context` returns 400.
- [ ] Replaying the same `checkout.session.completed` (same `payment_intent`) results in a single `orders` row.
- [ ] Replaying the same subscription `checkout.session.completed` results in a single `subscriptions` row.
- [ ] Logging with meta `{ email: "a@b.com", phone: "123" }` outputs redacted values.

### Risks
- Stricter validation may break older clients sending unexpected fields or non-UUID IDs.
- Adding unique constraints/upserts can fail if duplicates already exist; requires cleanup/backfill.
- Broader log redaction may reduce debugging visibility unless observability guidance is updated.
