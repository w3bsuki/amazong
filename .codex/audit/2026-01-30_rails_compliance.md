# Treido Rails Compliance Audit (2026-01-30)

Read-only scan for Treido **non-negotiable** violations:

1) Hardcoded user-facing strings bypassing `next-intl`  
2) Tailwind v4 forbidden patterns (gradients, arbitrary values, hardcoded colors)  
3) PII/secrets in logs (`console.*` with user data, emails, tokens, Stripe IDs)  
4) Cached server code violations (`cookies()`/`headers()` inside `'use cache'` functions)  
5) Supabase `select('*')` in hot paths  
6) `components/ui/*` importing from `app/**` (shadcn boundary)

Notes:
- Scan focuses on `app/`, `components/`, `lib/`, `supabase/` (tests/e2e not prioritized).
- Some matches are in demo/design-system/storybook content; those are still violations per rails, but lower priority for production.
- This audit avoids pasting raw line contents when they may contain PII/secrets.

## Commands Run (signals)

- Tailwind rails gate: `pnpm -s styles:scan` (writes reports under `cleanup/`)
- i18n heuristic (JSX text nodes): ripgrep PCRE scan for `>(English text)<`
- Logs: ripgrep scan for `console.*`
- Cache rule: correlation of `'use cache'` directives vs `cookies(` / `headers(`
- Supabase: ripgrep scan for `.select('*')` / `select('*')`
- shadcn boundary: ripgrep scan for `@/app/` imports under `components/ui/`

## Prioritized Findings

### Critical (blocks release)

| Priority | Area | Location | Issue | Suggested fix |
| --- | --- | --- | --- | --- |
| Critical | Secrets/PII | `scripts/audit-treido.mjs:11` | Hardcoded real email address in repo (audit script). | Remove from repo; read from env vars / local secrets; use non-personal test account. |
| Critical | Secrets/PII | `scripts/audit-treido.mjs:12` | Hardcoded password in repo (audit script). | Remove from repo; read from env vars / local secrets; rotate test credentials. |
| Critical | Secrets/PII | `scripts/audit-treido-v2.mjs:11` | Hardcoded real email address in repo (audit script). | Same fix as above. |
| Critical | Secrets/PII | `scripts/audit-treido-v2.mjs:12` | Hardcoded password in repo (audit script). | Same fix as above. |
| Critical | Secrets/PII | `audit/TREIDO_MOBILE_UX_AUDIT_2026-01-28.md:6` | Audit artifact includes a real email address. | Redact; keep audit artifacts PII-free. |
| Critical | Secrets/PII | `audit/TREIDO_MOBILE_UX_AUDIT_2026-01-28.md:209` | Audit artifact includes a login email + password in plain text. | Redact + rotate immediately; avoid credentials in repo artifacts. |
| Critical | Secrets/PII | `audit/archive/TREIDO_PRODUCTION_AUDIT_2026-01-27.md:228` | Archived audit artifact includes a real email address. | Redact (or move to private storage) and rotate if needed. |
| Critical | Secrets/PII | `audit/archive/SELL_FORM_AUDIT_2026-01-27.md:329` | Archived audit artifact references a real email address. | Redact (or move to private storage). |

### High

| Priority | Area | Location | Issue | Suggested fix |
| --- | --- | --- | --- | --- |
| High | Logs (PII/secrets risk) | `app/[locale]/(sell)/_components/ui/sell-error-boundary.tsx:46` | Client error boundary logs full `error` + `errorInfo` (may include sensitive details; violates “no secrets/PII in logs”). | Remove client logging, or gate it to dev-only and only log safe identifiers (e.g., error digest / static code). |
| High | i18n (`next-intl`) | `app/[locale]/(sell)/_components/ui/sell-error-boundary.tsx:72` | Hardcoded UI copy: `Something went wrong`. | Replace with `next-intl` (`t(...)`) strings. |
| High | i18n (`next-intl`) | `app/[locale]/(sell)/_components/ui/sell-error-boundary.tsx:75` | Hardcoded fallback copy: `An unexpected error occurred while loading the sell form.` | Replace with `next-intl` strings; avoid showing raw `error.message` in production UI. |
| High | Logs (PII/secrets risk) | `components/shared/error-boundary-ui.tsx:82` | Logs raw `error` object (`console.error(..., error)`). | Replace with sanitized logger (type + safe message only) and/or dev-only logging. |
| High | Logs (PII/secrets risk) | `components/providers/cart-context.tsx:310` | Logs full cart item object (`console.error("Invalid cart item:", newItem)`) on client. | Log only a safe reason code; never log full objects. Optionally dev-only. |
| High | i18n (`next-intl`) | `components/providers/cart-context.tsx:158` | Hardcoded user-facing string: `Unknown Product`. | Move to translations and render via `t(...)` (or pass a translated fallback from callers). |
| High | Logs (PII/secrets risk) | `app/[locale]/(checkout)/_actions/checkout.ts:91` | Server action logs raw cart item object. | Log only safe identifiers (e.g., productId) + reason code; never log full payloads. |
| High | Logs (PII/secrets risk) | `app/[locale]/(checkout)/_actions/checkout.ts:270` | Logs full error object during Stripe checkout session creation. | Sanitize logs (type + safe message), or use a centralized safe logger helper. |
| High | Logs (PII/secrets risk) | `app/[locale]/(checkout)/_actions/checkout.ts:374` | Logs raw auth error object (`console.error("Auth error:", authError)`). | Sanitize; avoid logging any token/session-bearing objects. |
| High | Logs (PII/secrets risk) | `app/actions/profile.ts:416` | Logs raw error object in update-email flow. | Sanitize + ensure no email/token data is logged. |
| High | Logs (PII/secrets risk) | `app/actions/username.ts:403` | Logs raw error object during account upgrade/downgrade. | Sanitize + dev-only; avoid logging any profile/user payloads. |
| High | i18n (`next-intl`) | `app/[locale]/(auth)/_components/welcome-client.tsx:226` | Hardcoded auth/onboarding UI copy: `Let's set up your profile`. | Replace with `next-intl` strings (`useTranslations`). |
| High | i18n (`next-intl`) | `app/[locale]/(business)/dashboard/settings/page.tsx:64` | Hardcoded business dashboard title: `Settings`. | Replace with `next-intl` strings. |
| High | i18n (`next-intl`) | `app/[locale]/(business)/_components/business-header.tsx:59` | Hardcoded fallback route title: `Home`. | Replace route titles with translated map (locale-aware) or `t(...)`. |
| High | i18n (`next-intl`) | `app/[locale]/(business)/_components/business-header.tsx:76` | Hardcoded badge label: `Verified`. | Replace with `next-intl`. |
| High | i18n (`next-intl`) | `app/[locale]/(business)/_components/business-header.tsx:85` | Hardcoded CTA: `Upgrade to unlock`. | Replace with `next-intl`. |
| High | Tailwind (arbitrary values) | `components/ui/toggle.tsx:10` | Uses arbitrary values: `focus-visible:ring-[3px]`, `transition-[color,box-shadow]`. | Replace with tokenized equivalents (`focus-visible:ring-2`, `transition-colors` / `transition-shadow`) or move to CSS tokens. |
| High | Tailwind (arbitrary values) | `components/ui/alert.tsx:7` | Uses arbitrary grid columns: `grid-cols-[...]` (and `has-[...]`). | Restructure markup or use tokenized layout primitives; avoid `grid-cols-[...]`. |
| High | Tailwind (arbitrary values) | `app/[locale]/[username]/[productSlug]/loading.tsx:122` | Uses arbitrary grid columns: `lg:grid-cols-[320px_1fr]`. | Replace with tokenized layout (e.g., `lg:flex` + `w-80` + `flex-1`). |
| High | i18n (`next-intl`) | `app/[locale]/(business)/dashboard/accounting/page.tsx:93` | Hardcoded accounting dashboard UI copy (multiple JSX text nodes). | Replace with `next-intl`. |
| High | i18n (`next-intl`) | `app/[locale]/(business)/_components/product-form-modal.tsx:503` | Hardcoded product form UI copy (multiple JSX text nodes + placeholders). | Replace with `next-intl` strings. |

### Medium

| Priority | Area | Location | Issue | Suggested fix |
| --- | --- | --- | --- | --- |
| Medium | Tailwind (arbitrary values) | `components/ui/textarea.tsx:10` | Uses arbitrary class: `focus-visible:ring-[3px]`. | Replace with a tokenized class (e.g., `focus-visible:ring-2` if allowed) or a theme token / CSS var approach that passes `styles:gate`. |
| Medium | Tailwind (arbitrary values) | `components/ui/radio-group.tsx:31` | Uses arbitrary classes: `transition-[color,box-shadow]` and `focus-visible:ring-[3px]`. | Replace with non-arbitrary equivalents (or move to tokenized CSS). |
| Medium | Tailwind (arbitrary values) | `components/ui/toggle.tsx:10` | Uses arbitrary classes: `transition-[color,box-shadow]`, `focus-visible:ring-[3px]`, plus selector-based arbitrary variants (`[&_svg...]`). | Replace with allowed tokenized utilities and/or move complex selectors to CSS that complies with Treido Tailwind rails. |
| Medium | Tailwind (arbitrary values) | `components/layout/header/dashboard-header.tsx:12` | Uses arbitrary values: `h-(--header-height)` and `transition-[width,height]`. | Replace with tokenized height/transition utilities or move to CSS variables defined in theme and referenced without arbitrary syntax. |
| Medium | Tailwind (arbitrary values) | `app/[locale]/(business)/_components/business-header.tsx:63` | Same arbitrary patterns as dashboard header: `h-(--header-height)`, `transition-[width,height]`. | Same fix as above. |
| Medium | Tailwind (arbitrary values) | `app/[locale]/(admin)/_components/admin-stats-cards.tsx:46` | Container query uses bracket value: `@[250px]/card:text-3xl`. | Replace with tokenized breakpoints/containers per `docs/DESIGN.md` constraints. |
| Medium | Tailwind (arbitrary values) | `components/grid/product-grid.tsx:81` | Container query uses bracket values: `@[520px]:grid-cols-3` (and similar). | Replace with tokenized responsive rules or approved container query tokens without bracket values. |
| Medium | i18n (`next-intl`) | `app/[locale]/(business)/dashboard/settings/page.tsx:91` | Hardcoded label: `Store Name`. | Replace with `next-intl` strings. |
| Medium | i18n (`next-intl`) | `app/[locale]/(business)/dashboard/settings/page.tsx:235` | Hardcoded help text: `Get notified when you receive a new order`. | Replace with `next-intl`. |
| Medium | i18n (`next-intl`) | `app/[locale]/(auth)/_components/welcome-client.tsx:480` | Hardcoded post-setup prompt: `Your profile is ready. What would you like to do next?` | Replace with `next-intl`. |
| Medium | i18n (`next-intl`) | `app/[locale]/design-system2/page.tsx:153` | Extensive hardcoded UI copy in design system page (e.g. `Design System v2`, `Documentation`, etc.). | If this route is reachable in prod, move all strings to `next-intl`; otherwise consider excluding the route from production builds. |
| Medium | Logs (PII/secrets risk) | `app/actions/products.ts:199` | Extensive `console.*` usage in server actions (repeat pattern across file). | Switch server-only logs to `lib/structured-log.ts` and avoid logging objects/payloads. |
| Medium | Logs (PII/secrets risk) | `app/actions/orders.ts:162` | Extensive `console.*` usage in server actions (repeat pattern across file). | Same fix as above. |
| Medium | Logs (PII/secrets risk) | `app/actions/subscriptions.ts:348` | Logs Stripe error objects in server actions. | Log only safe identifiers; sanitize errors; prefer structured logger with redaction. |
| Medium | Logs (PII/secrets risk) | `app/actions/profile.ts:416` | Logs raw error object in update-email flow. | Sanitize and ensure no email/token data is logged. |
| Medium | Logs (PII/secrets risk) | `app/actions/username.ts:403` | Logs raw error object during account upgrade/downgrade. | Sanitize; avoid user identifiers unless necessary. |
| Medium | Cache rule (context) | `app/[locale]/(main)/todays-deals/page.tsx:40` | Uses `cookies()` in a Server Component. Not a violation by itself, but must never be pulled into cached (`'use cache'`) functions. | Keep request-bound reads outside cached functions; pass derived primitives to cached helpers if needed. |
| Medium | Cache rule (context) | `app/[locale]/(account)/layout.tsx:75` | Uses `headers()` to infer pathname. Not a violation by itself, but must stay out of cached helpers. | Avoid passing `headers()` results into cached functions; pass pathname as a string prop when possible. |
| Medium | Cache rule (context) | `app/[locale]/(auth)/_actions/auth.ts:48` | Server action uses `headers()`. | Ensure it is never called from cached functions; avoid leaking header contents into logs. |

### Low

| Priority | Area | Location | Issue | Suggested fix |
| --- | --- | --- | --- | --- |
| Low | i18n (`next-intl`) | `components/ui/input.stories.tsx:157` | Storybook hardcoded placeholder: `Search...`. | Acceptable for Storybook-only, but violates strict rails; either translate or exclude Storybook from rails gates. |
| Low | i18n (`next-intl`) | `components/ui/toggle-group.stories.tsx:23` | Storybook hardcoded aria-label: `Bold` (and similar). | Same as above. |
| Low | i18n (`next-intl`) | `app/[locale]/(main)/demo/page.tsx:24` | Demo route contains many hardcoded strings. | If demo route ships, translate; otherwise exclude from production builds. |

## Not Found (in this scan)

- Tailwind gradients: none detected by `pnpm -s styles:scan` (report: `cleanup/palette-scan-report.txt`).
- Tailwind hardcoded palette colors: none detected by `pnpm -s styles:scan` (report: `cleanup/palette-scan-report.txt`).
- Supabase `select('*')`: no occurrences found in `app/` and `lib/` (only comments surfaced by ripgrep).
- Cached server rule: no `cookies()`/`headers()` usage found inside files declaring a `'use cache'` directive; cached data modules import and use `createStaticClient()`.
- shadcn boundary: no `components/ui/**` imports from `@/app/**` found in this scan.

## i18n Hotspots (top offenders, heuristic)

These are files with the most JSX text-node matches (first 20 line numbers shown per file):

- `app/[locale]/(main)/demo/page.tsx` (30 matches): 24, 37, 51, 64, 83, 95, 100, 102, 108, 110, 111, 112, 113, 114, 115, 121, 133, 135, 136, 137
- `app/[locale]/(business)/_components/product-form-modal.tsx` (24 matches): 503, 518, 571, 582, 586, 588, 601, 603, 621, 623, 647, 651, 660, 669, 681, 698, 702, 713, 738, 748
- `app/[locale]/(business)/dashboard/accounting/page.tsx` (23 matches): 93, 99, 104, 109, 203, 212, 213, 214, 215, 220, 230, 234, 240, 244, 250, 265, 273, 281, 291, 299
- `app/[locale]/(business)/dashboard/settings/page.tsx` (18 matches): 64, 91, 99, 108, 118, 127, 145, 151, 163, 196, 205, 215, 234, 235, 243, 244, 252, 253
- `app/[locale]/(business)/dashboard/discounts/page.tsx` (16 matches): 70, 72, 74, 76, 96, 102, 106, 111, 201, 210, 211, 212, 213, 214, 215, 216
- `app/[locale]/(auth)/_components/welcome-client.tsx` (16 matches): 226, 267, 268, 298, 327, 396, 397, 415, 422, 479, 480, 493, 494, 510, 511, 527
- `app/[locale]/(business)/dashboard/analytics/page.tsx` (16 matches): 42, 48, 53, 58, 142, 156, 157, 162, 166, 170, 174, 188, 189, 197, 208, 219
- `app/[locale]/(business)/_components/products-table.tsx` (11 matches): 409, 414, 419, 425, 582, 585, 588, 591, 594, 596, 686
- `app/[locale]/(business)/dashboard/inventory/page.tsx` (9 matches): 36, 45, 54, 55, 56, 57, 58, 59, 60
- `app/[locale]/(sell)/sell/orders/client.tsx` (7 matches): 175, 176, 222, 223, 224, 238, 338

## Tailwind Scan Coverage Note

`pnpm -s styles:scan` currently flags common arbitrary *numeric* patterns (`w-[...]`, `p-[...]`, etc.) and color literals. It does **not** flag other arbitrary forms that still violate strict rails (e.g., `ring-[3px]`, `transition-[width,height]`, `grid-cols-[...]`, `h-(--css-var)`), so rails compliance must be reviewed beyond the gate output.

---

## Specialist Auditor Payloads

Specialist auditors were spawned for the Full bundle. The NEXTJS auditor timed out in this run, so a manual NEXTJS payload is included. TW4/TS payloads are intentionally omitted here to keep this report focused on the 6 rails requested (Tailwind scan is covered above; TS is out-of-scope for this request).

## NEXTJS

### Scope
- Files:
  - `lib/data/**`
  - `app/api/categories/**`
  - `lib/supabase/server.ts`
  - `app/[locale]/(main)/todays-deals/page.tsx`
  - `app/[locale]/(main)/search/page.tsx`
  - `app/[locale]/(account)/layout.tsx`
  - `app/[locale]/(auth)/_actions/auth.ts`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | Low | `lib/supabase/server.ts:26` | `cookies()` is used in `createClient()` (auth-dependent client). Not a violation by itself, but it must never be used by cached (`'use cache'`) functions. | Keep `createStaticClient()` as the only client allowed in cached modules; consider adding a repo scan/lint rule to enforce it. |
| NEXTJS-002 | Medium | `app/[locale]/(main)/todays-deals/page.tsx:40` | Server Component reads request cookies via `cookies()`. Not a cached-function violation, but it's a common footgun if refactored into cached helpers. | Keep `cookies()` reads request-bound; pass derived primitives into cached helpers (never the cookie store). |
| NEXTJS-003 | Medium | `app/[locale]/(account)/layout.tsx:75` | Layout reads request headers via `headers()`. Not a cached-function violation, but must stay out of cached helpers. | Avoid passing `headers()` results into cached functions; prefer explicit props (pathname string) where possible. |

### Acceptance Checks
- [ ] No `cookies()`/`headers()` calls in any file/function containing a `'use cache'` directive
- [ ] Cached modules use `createStaticClient()` (never `createClient()`)

### Risks
- Indirect request-bound access can be introduced via helper imports. Guard against this with a scan/lint rule.

## SHADCN

### Scope
- Files:
  - `components/ui/*.tsx`
  - `components/ui/*.stories.tsx`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|

No `components/ui/**` files import from `app/**` (including `@/app/**` or relative `../app/**`) and no obvious app/data-layer usage (e.g., Supabase/Stripe/`next-intl`/`cookies()`/`headers()`/`fetch`) was found in this scan.

### Acceptance Checks
- [ ] `rg -n -F "@/app" components/ui` returns no matches
- [ ] `rg -n -F "../app/" components/ui` returns no matches
- [ ] `rg -n "\\b(supabase|stripe|next-intl|cookies\\(|headers\\(|fetch\\()(\\b|$)" components/ui` returns no matches

### Risks
- Heuristic scan: unusual patterns (barrel re-exports, dynamic `require`, generated code) could hide boundary violations.

## SUPABASE

### Scope
- Files:
  - `supabase/migrations/*.sql`
  - `supabase/schema.sql`
  - `lib/supabase/server.ts`
  - `app/api/products/feed/route.ts`
  - `app/api/products/newest/route.ts`
  - `app/api/sales/export/route.ts`
  - `app/actions/username.ts`
  - `app/[locale]/(sell)/_actions/sell.ts`
  - `app/actions/profile.ts`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SUPABASE-001 | Medium | `app/api/products/feed/route.ts:111` | Hot-path listing endpoint uses `count: "exact"` (can be expensive at scale, especially with wide selects/joins). | Prefer `count: "planned"` or avoid count (fetch `limit + 1` to compute `hasMore`). |
| SUPABASE-002 | Medium | `app/api/products/newest/route.ts:171` | Hot-path listing endpoint uses `count: "exact"` for pagination totals. | Prefer `count: "planned"` or move totals to a dedicated count endpoint / `limit+1` pattern. |
| SUPABASE-003 | Medium | `app/api/sales/export/route.ts:55` | Export flow fetches *all* seller `order_items` first, then filters orders by date range later (potentially huge overfetch / timeouts). | Push date filtering into the initial query (join-filter on `orders.created_at`, or add a dedicated RPC/view for export). |
| SUPABASE-004 | High | `app/actions/username.ts:383` | User-triggered server actions use `createAdminClient()` (service role, bypasses RLS) for profile updates (also seen in `app/[locale]/(sell)/_actions/sell.ts:332`). Any bug in validation/authorization becomes a privilege escalation. | Minimize service-role usage: move to RLS-enabled updates via normal client or a `security invoker` RPC with explicit `auth.uid()` checks + strict field allowlist. |

### Acceptance Checks
- [ ] `rg -n "select\\(\\s*\\*\\s*\\)" app lib proxy.ts --glob "*.ts" --glob "*.tsx"` returns no matches
- [ ] `rg -n -F ".select('*')" app lib proxy.ts` returns no matches
- [ ] `rg -n "createAdminClient" app lib --glob "*.ts" --glob "*.tsx"` only shows webhooks/admin surfaces and explicitly guarded user flows
- [ ] `/api/products/feed` + `/api/products/newest` verified to meet latency targets without `count: "exact"` (or confirmed that exact totals are truly required)

### Risks
- Switching away from `count: "exact"` changes semantics (approx totals or no totals); UI may need to rely on `hasMore` instead of total counts.
- Refactoring away from service-role updates may require DB work (tight RLS policies or new `security invoker` RPCs/migrations).
- Migrations show extensive RLS enabling + policies (including `storage.objects` policies); no obvious “RLS disabled” signals found in the scanned migrations.
