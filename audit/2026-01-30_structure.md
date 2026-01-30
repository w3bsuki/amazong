# Structure Audit (Merged) — 2026-01-30

## NEXTJS

### Scope
- Files:
  - `proxy.ts`
  - `next.config.ts`
  - `app/**` (esp. `app/[locale]/**`, `app/api/**`)
  - `lib/data/**`, `lib/supabase/**`
  - `components/**` (esp. `components/storybook/**`)
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | High | app/[locale]/(sell)/_components/sell-form-unified.tsx:18 | Route-boundary drift: `(sell)` imports route-private UI from `(account)` via `@/app/.../_components` (`BoostDialog`) | Move `BoostDialog` to `components/shared/**` and import it from there in both routes |
| NEXTJS-002 | Medium | components/storybook/sellers-grid.stories.tsx:8 | Storybook imports route-private component from `app/**/_components` (`SellersGrid`), breaking Treido route boundaries | Extract `SellersGrid` into `components/shared/**` (keep app wrapper thin) and update story import |
| NEXTJS-003 | Medium | components/storybook/design-system.stories.tsx:3 | Storybook imports route-private component from `app/[locale]/design-system/_components` (`DesignSystemClient`) | Move `DesignSystemClient` into `components/**` (shared) and keep the route as a thin wrapper |

### Acceptance Checks
- [ ] `pnpm -s typecheck` passes
- [ ] No `cookies()`/`headers()` usage inside cached (`'use cache'`) functions

### Risks
- Moving components out of `app/**` can expose accidental imports back into route-private code; keep shared components free of `@/app/**` imports.
- Refactors that relocate client components must preserve `"use client"` boundaries to avoid server/client import violations.

## TW4

### Scope
- Files:
  - `app/[locale]/(account)/account/orders/_components/buyer-order-actions.tsx`
  - `app/[locale]/(sell)/sell/orders/client.tsx`
  - `app/[locale]/(admin)/admin/tasks/_components/tasks-content.tsx`
  - `app/[locale]/design-system2/page.tsx`
  - `app/[locale]/(main)/demo/codex/page.tsx`
  - `components/ui/badge.tsx`
  - `scripts/scan-tailwind-palette.mjs`
- Lines: n/a (repo-wide scans + spot checks)
- Notes: `pnpm -s styles:gate` currently passes but does **not** flag `text-white`/`bg-white` hardcoded color utilities.

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | High | `app/[locale]/(account)/account/orders/_components/buyer-order-actions.tsx:302` | Hardcoded `text-white` on a tokenized background (`bg-status-success`) violates “no hardcoded colors” and can drift vs theme/tokens. | Replace `text-white` with a semantic on-solid token (e.g. `text-badge-fg-on-solid`), or add `text-status-*-foreground` tokens and use those. |
| TW4-002 | High | `app/[locale]/(account)/account/orders/_components/buyer-order-actions.tsx:439` | Same issue for `bg-status-warning text-white`. | Same fix as TW4-001. |
| TW4-003 | High | `app/[locale]/(sell)/sell/orders/client.tsx:199` | Hardcoded `text-white` in stat icon pills (`stat.color` supplies bg), bypassing semantic foreground tokens. | Replace `text-white` with `text-badge-fg-on-solid` (or a dedicated fg token tied to `stat.color`). |
| TW4-004 | Medium | `app/[locale]/(admin)/admin/tasks/_components/tasks-content.tsx:58` | `PRIORITY_COLORS` uses `text-white` for `urgent`/`high` (hardcoded color utility). | Swap to `text-badge-fg-on-solid` for solid priority styles (keep `medium/low` tokenized as-is). |
| TW4-005 | Low | `app/[locale]/design-system2/page.tsx:816` | Design-system examples use `text-white` (+ `hover:bg-opacity-90`) and manual `style={{ backgroundColor: 'var(...)' }}` instead of the existing Badge semantic variants. | Use `Badge` variants (`condition-new`, `condition-likenew`, etc.) or at least replace `text-white` with `text-badge-fg-on-solid` and avoid opacity utilities. |
| TW4-006 | Low | `app/[locale]/(main)/demo/codex/page.tsx:151` | Demo uses `text-white` in badge class strings (hardcoded color utility). | Replace with `text-badge-fg-on-solid` (or `text-background` where appropriate). |
| TW4-007 | Medium | `scripts/scan-tailwind-palette.mjs:10` | Styles gate scans palette families but misses hardcoded utilities like `bg-white` / `text-white` / `bg-black` / `text-black`, allowing rail drift while still passing CI. | Extend the scan to flag `bg|text|border|ring|fill|stroke-(white|black)` (at least under `app/` + `components/`). |

### Acceptance Checks
- [ ] `pnpm -s styles:gate` passes
- [ ] `rg -n "\\btext-white\\b|\\bbg-white\\b|\\btext-black\\b|\\bbg-black\\b" app components` returns no matches
- [ ] If scan is updated: `pnpm -s styles:scan:palette` reports findings when any `*-(white|black)` utilities appear in `app/`/`components/`

### Risks
- Some “solid color” surfaces may currently rely on `text-white` for contrast; switching should use the existing on-solid semantic token (`text-badge-fg-on-solid`) to avoid visual regressions.
- Tightening the styles scan may initially fail CI in non-critical pages (admin/demo/design-system); plan a small cleanup batch once enforcement is in place.

## SHADCN

### Scope
- Files:
  - components/ui/social-input.tsx
  - app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx
  - components/ui/chart.tsx
  - components/ui/button.tsx
  - components/ui/select.tsx
  - components/ui/dropdown-menu.tsx
  - components/ui/drawer.tsx
  - components/ui/toggle.tsx
  - docs/DESIGN.md
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | High | components/ui/social-input.tsx:17 | `components/ui` contains an app-specific composite (“Used in onboarding and profile edit forms”) and allows freeform Tailwind via `iconBg` string; also uses `React.*` types without importing React types (inconsistent with other ui primitives). | Move to `components/shared/*` (or route-private `app/[locale]/**/_components/*` since current usage is onboarding) and replace `iconBg` string with a variant prop mapped to tokens; normalize React type imports. |
| SHADCN-002 | High | components/ui/chart.tsx:225 | Tailwind rails drift inside `components/ui`: arbitrary value utilities (`border-(--color-border)`, `bg-(--color-bg)`) and `border-[1.5px]` appear, plus dynamic inline color plumbing; likely conflicts with “no arbitrary values / token-only” enforcement. | Replace arbitrary utilities with semantic tokens (or dedicated CSS vars/tokens defined in theme) and constrain chart color inputs to token-based values; consider relocating heavy chart styling helpers out of `components/ui` if exceptions are needed. |
| SHADCN-003 | Medium | components/ui/select.tsx:62 | Opacity modifiers are used across ui primitives (`dark:bg-input/30`, `focus:bg-destructive/10`, `bg-muted-foreground/30`, `hover:bg-*/90`), which conflicts with the design guidance to avoid opacity variants (consistency/gate risk). | Replace opacity modifiers with semantic surface tokens (`bg-hover`, `bg-active`, `bg-selected`, etc.) or introduce explicit theme tokens for these states instead of ad-hoc `/NN`. |
| SHADCN-004 | Low | components/ui/toggle.tsx:10 | More “arbitrary value” utilities show up in primitives (`focus-visible:ring-[3px]`, `transition-[color,box-shadow]`), which may violate the repo’s “no arbitrary values” rail depending on `styles:gate` rules. | Prefer non-arbitrary equivalents (`focus-visible:ring-2`, `transition-colors`, `transition-shadow`) or centralize any exceptions behind shared `ui-*` classes in CSS. |

### Acceptance Checks
- [ ] `rg -n 'from [''"]@/app/|from ['"]\\.{1,2}/.*app/' components/ui` returns no matches
- [ ] `rg -n '\\b(supabase|stripe)\\b' components/ui` returns no matches
- [ ] `pnpm -s styles:gate` passes (no opacity/arbitrary-value violations in `components/ui/*`)
- [ ] `rg -n '@/components/ui/social-input' app components` returns no matches after moving `SocialInput`

### Risks
- Moving `SocialInput` changes import paths (currently used in `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx`) and may affect future planned reuse (profile edit).
- Refactoring chart color/state utilities can be noisy if charts are already used in multiple account/sales views; keep the API surface stable or migrate in one batch.

## SUPABASE

### Scope
- Files:
  - supabase/migrations/20251127_add_search_history.sql
  - supabase/migrations/20251127000002_share_wishlist.sql
  - supabase/migrations/20251213000000_chat_query_optimization.sql
  - app/[locale]/(account)/account/orders/page.tsx
  - app/actions/orders.ts
  - lib/supabase/messages.ts
  - lib/auth/admin.ts
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SUPABASE-001 | Critical | supabase/migrations/20251127_add_search_history.sql:58 | `add_search_history(p_user_id, ...)` is `SECURITY DEFINER` and trusts caller-supplied `p_user_id` (no `auth.uid()`/admin check) → enables horizontal writes (delete+insert) if EXECUTE isn’t explicitly revoked from `PUBLIC`/`anon`. | Inside function, derive user id from `auth.uid()` and reject when null; ignore/forbid `p_user_id` unless `is_admin()`; explicitly `REVOKE EXECUTE ... FROM PUBLIC, anon` then `GRANT EXECUTE ... TO authenticated`. |
| SUPABASE-002 | Critical | supabase/migrations/20251127000002_share_wishlist.sql:81 | `enable_wishlist_sharing(p_user_id default null)`/`disable_wishlist_sharing(...)` are `SECURITY DEFINER` and allow bypassing auth by passing `p_user_id` (only `NULL` check) → attacker can toggle other users’ wishlist sharing. | Always use `auth.uid()` (or enforce `p_user_id = auth.uid()` unless `is_admin()`); add explicit `REVOKE EXECUTE` from `PUBLIC`/`anon`; grant only to `authenticated`. |
| SUPABASE-003 | Critical | supabase/migrations/20251213000000_chat_query_optimization.sql:9 | `get_user_conversations(p_user_id)` (+ `get_user_conversation_ids`) are `SECURITY DEFINER` and don’t assert `p_user_id = auth.uid()`/admin → horizontal read of conversation metadata/IDs. | Remove/ignore `p_user_id` (use `auth.uid()`), or enforce equality/admin; explicitly revoke execute from `PUBLIC`/`anon` and re-grant to `authenticated`. |
| SUPABASE-004 | High | app/[locale]/(account)/account/orders/page.tsx:115 | Wildcard selects (`orders.*`, `order_items.*`, `products(*)`) and then passes raw rows into a client component, so extra fields (e.g. `shipping_address`, `stripe_payment_intent_id`, full product row) get serialized to the browser; also violates “no `*` in hot paths”. | Replace wildcards with explicit projections matching UI needs; map to a minimal DTO before passing to `AccountOrdersGrid`; add `.limit/.range` for a hard cap or real pagination. |
| SUPABASE-005 | High | app/actions/orders.ts:163 | Multiple order queries use `order_items.*` in select strings (e.g. seller/buyer list + detail) and are unbounded, risking overfetch (tracking fields, etc.) and poor scaling. | Replace `*` with explicit column lists per query; paginate/cap list queries via `.range`/`.limit`; only select joined fields actually rendered. |
| SUPABASE-006 | High | lib/supabase/messages.ts:140 | `CONVERSATION_SELECT` includes `*` (hot path) and `fetchConversations` derives last messages by querying all messages across conversation IDs (unbounded) → potentially large reads. | Replace `*` with explicit conversation fields; add pagination/limit for conversations/messages; fetch last message via bounded query (or store last-message fields on `conversations`). |
| SUPABASE-007 | Medium | lib/auth/admin.ts:129 | Admin revenue calc pulls *all* paid orders (`select('total_amount')`) and sums in JS → scales poorly as orders grow. | Compute sum in SQL (RPC/view/materialized stats) instead of fetching all rows. |

### Acceptance Checks
- [ ] DB: the functions in SUPABASE-001/002/003 reject cross-user access (and reject unauthenticated calls even if params are supplied).
- [ ] DB: `has_function_privilege('anon', 'public.enable_wishlist_sharing(uuid)', 'execute')` (and the other affected RPCs) returns `false` after explicit `REVOKE`.
- [ ] Code: `rg -n '^\\s*\\*,\\s*$' app lib --glob '*.ts' --glob '*.tsx'` returns no matches.
- [ ] Code: `rg -n 'products\\(\\*\\)' app --glob '*.tsx'` returns no matches.

### Risks
- Tightening RPC signatures/privileges can break any existing callers (and may require regenerating `lib/supabase/database.types.ts`).
- Reducing selected fields may require small UI/data-shaping adjustments where client components currently receive extra columns implicitly.

## TYPESCRIPT

### Scope
- Files:
  - `app/**`
  - `components/**`
  - `lib/**`
  - `hooks/**`
  - `supabase/functions/**`
  - `scripts/ts-safety-gate.mjs`
  - `scripts/ts-safety-gate.baseline.json`
  - `knip.json`
  - `package.json`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TS-001 | Critical | app/actions/profile.ts:466 | Non-null assertion `user.email!` in password update can crash for non-email auth users | Guard `user.email`; avoid `!` |
| TS-002 | High | app/api/revalidate/route.ts:104 | `record`/`old_record` are typed as objects but accessed via `(rec as any).field` | Use `Record<string, unknown>` + `rec["slug"]`; remove `any` |
| TS-003 | High | supabase/functions/ai-shopping-assistant/index.ts:1 | `// @ts-nocheck` disables typechecking; also contains `// @ts-ignore` | Replace with typed API calls; avoid file-level disable |
| TS-004 | Medium | app/api/categories/attributes/route.ts:154 | Non-null assertion on `categoryIds[i]!` can hide invalid input shape | Ensure `categoryIds` is `string[]`; filter/validate before loop |
| TS-005 | Medium | app/api/categories/route.ts:75 | Non-null assertions on `categoryMap.get(...)!` can crash if tree build assumptions drift | Guard missing map entries; skip or throw explicit error |
| TS-006 | Medium | app/[locale]/(business)/dashboard/inventory/page.tsx:88 | `(product as any).variant_count` indicates untyped inventory product shape | Export/derive `InventoryProduct` type; remove cast |
| TS-007 | Medium | app/[locale]/(business)/_components/product-form-modal.tsx:295 | `zodResolver(...) as any` + eslint disable hides resolver/form mismatch | Derive form type from schema (`z.infer`); remove `any` |
| TS-008 | Medium | app/[locale]/(sell)/_components/sell-form-provider.tsx:115 | `zodResolver(...) as any` + eslint disable hides resolver/form mismatch | Derive form type from schema (`z.infer`); remove `any` |
| TS-009 | Medium | app/[locale]/(sell)/_components/ai/ai-listing-assistant.tsx:230 | `(data as any)?.error` defeats the existing union type | Narrow via `"error" in data`; avoid `any` |
| TS-010 | Medium | components/ui/chart.tsx:143 | `labelFormatter`/`formatter` use `any` (explicit-any disables) | Type with `TooltipPayloadItem`-based unions; remove `any` |
| TS-011 | Medium | app/[locale]/(main)/categories/[slug]/page.tsx:225 | Props typed as `any`/`any[]` for category trees/attributes | Reuse `CategoryWithChildren`/`CategoryAttribute` types; remove `any` |
| TS-012 | Low | app/[locale]/[username]/[productSlug]/page.tsx:72 | `[] as any[]` fallback hides expected query row shape | Use a typed empty array; avoid `any[]` |
| TS-013 | Medium | app/api/subscriptions/webhook/route.ts:146 | Redundant `as unknown as { current_period_end: number }` despite Stripe typings | Use `Stripe.Subscription` fields directly; delete double cast |
| TS-014 | Medium | app/api/products/newest/route.ts:230 | `(data ?? []) as unknown as ProductRowWithRelations[]` hides schema drift | Type the query via `.returns<T>()`/typed select; avoid double cast |
| TS-015 | Low | scripts/ts-safety-gate.baseline.json:1 | Baseline contains more entries than current scan; noise reduces gate usefulness | Update baseline after cleanup; keep it minimal |
| TS-016 | Medium | knip.json:1 | `knip` reports unused code (30 files, 8 exports, 3 duplicate exports, 3 devDeps) | Delete or rewire; adjust knip entry/ignores as needed |
| TS-017 | Low | package.json:129 | Unused devDependencies reported by knip (`@storybook/react`, `@storybook/react-vite`, `buffer`) | Remove or add real entry usage |
| TS-018 | Low | lib/data/products.ts:278 | Unused export `sortWithBoostPriority` reported by knip | Remove export or use it |
| TS-019 | Low | components/layout/desktop-shell.tsx:214 | Unused/duplicate default export reported by knip | Keep single export style; remove duplicate |
| TS-020 | Low | components/grid/grid-container.tsx:65 | Unused/duplicate default export reported by knip | Keep single export style; remove duplicate |
| TS-021 | Low | components/grid/product-grid.tsx:229 | Unused/duplicate default export reported by knip | Keep single export style; remove duplicate |
| TS-022 | Low | components/shared/product/category-product-row.tsx:67 | Unused exports reported by knip (`CategoryProductRow`, `TrustBannerDesktop`) | Remove exports or wire imports |
| TS-023 | Low | app/[locale]/(sell)/_actions/sell.ts:289 | Unused export `completeSellerOnboarding` reported by knip | Remove export or wire imports |
| TS-024 | Low | app/[locale]/(sell)/_components/seller-onboarding-wizard.tsx:36 | Unused export `SellerOnboardingWizard` reported by knip | Remove export or wire imports |

### Acceptance Checks
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit --incremental false`
- [ ] `pnpm -s ts:gate`
- [ ] `pnpm -s knip`

### Risks
- Knip false positives: Storybook files and Supabase Edge Functions may be “unused” from the Next.js graph; verify deployment/entrypoints before deletion.
- Tightening types in API routes/actions may require small runtime guards; ensure behavior remains unchanged (validate via typecheck + relevant tests).
