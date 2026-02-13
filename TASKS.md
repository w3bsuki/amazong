# Tasks — Structure & Rails Hardening (2026-02-11)

> **Active work only.** Max **20 total** tasks listed below, keep **≤15 “Ready”** at any time.

## Gates (Run After Every Batch)

Always:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Conditional:

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

Weekly + before deploy + cleanup batches:

```bash
pnpm -s knip
pnpm -s dupes
```

## 🚀 Production Finalization Queue (2026-02-10)

- [x] TASK-0 LAUNCH COMMAND CENTER: Normalize production docs + audit evidence contract
  - Priority: Critical
  - Owner: treido-orchestrator
  - Scope: Align launch SSOT and remove production-doc contradictions before phase execution
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate` · `pnpm -s docs:check`
  - Files: `docs/PRODUCTION.md` · `docs/TESTING.md` · `docs/PRODUCTION-TEST-PLAN.md` · `docs/ROUTES.md` · `docs/guides/deployment.md` · `production-audit/master.md` · `production-audit/01..18`
- [x] TASK-1 AUTH: Sign in + sign up logic, UI/UX, styling, mobile polish
  - Priority: Critical
  - Owner: treido-impl-frontend
  - Scope: `/(auth)` routes + auth drawer + auth state sync (`AUTH-001`, `AUTH-002`, `AUTH-003`)
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate` · `pnpm -s test:unit` · `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
  - Files: `components/auth/*` · `app/[locale]/(auth)/**/*` · `components/providers/auth-state-manager.tsx` · `lib/supabase/client.ts` · `components/mobile/drawers/auth-drawer.tsx`

## 🔥 In Progress

| Task | Issue | Owner | Notes |
|------|-------|-------|-------|
| Structure + rails hardening batches | – | treido-orchestrator | Audit: `audit/2026-01-30_structure.md` |

## 📋 Ready (≤15)

### Frontend lane (UI bundle) — Production hardening (audit: `audit/2026-01-30_frontend_lane_ui.md`)

- [x] FE-UI-001: Global error page — next-intl strings + safe client logging
  - Priority: Critical
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/global-error.tsx` · `messages/en.json` · `messages/bg.json`
- [x] FE-UI-002: Global not-found page — next-intl strings + locale-aware links
  - Priority: Critical
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/global-not-found.tsx` · `messages/en.json` · `messages/bg.json`
- [x] FE-UI-003: DesktopShell client boundary — keep server pages lean without breaking client imports
  - Priority: Medium
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/(main)/_components/layout/desktop-shell.server.tsx` · `app/[locale]/(main)/_components/layout/desktop-shell.tsx` · `app/[locale]/(main)/search/page.tsx` · `app/[locale]/(main)/categories/[slug]/page.tsx` · `app/[locale]/(main)/_components/desktop-home.tsx`
  - Status: Complete — server routes use `desktop-shell.server.tsx`; client surfaces keep `desktop-shell.tsx`.
- [x] FE-UX-004: LocaleProviders suspense fallback — stop double-mounting `{children}` and drawers
  - Priority: Critical
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/locale-providers.tsx`
  - Audit: `audit/2026-01-30_ui-quick-view-drawer.md` (NEXTJS-001)
- [x] FE-UX-005: Mobile product quick view drawer — fix scroll + touch utilities, remove manual body scroll lock
  - Priority: Critical
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `components/ui/drawer.tsx` · `components/mobile/drawers/product-quick-view-drawer.tsx`
  - Audit: `audit/2026-01-30_ui-quick-view-drawer.md` (NEXTJS-004, TW4-001, SHADCN-001/002)
- [x] FE-UX-006: TW4 rail cleanup — remove invalid `touch-action-*` utilities + bracket `aspect-[...]` in quick view
  - Priority: High
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s styles:gate`
  - Files: `components/shared/product/quick-view/quick-view-image-gallery.tsx` · `components/shared/product/quick-view/quick-view-skeleton.tsx` · `app/utilities.css`
  - Audit: `audit/2026-01-30_ui-quick-view-drawer.md` (TW4-002/004/005)

Notes (2026-01-30):
- Shipped: FE-UI-001, FE-UI-002, FE-UI-003, FE-UX-004, FE-UX-005, FE-UX-006
- Remaining: none in this lane
- Backend dependencies: none discovered in this lane.

### Backend lane — Backend Production Push (audit: `audit/2026-01-30_backend_production_push.md`)

- [x] [EXEC] [treido-impl-backend] ORCH-001 / TS-001: Harden checkout webhook (safe logging + validate `items_json`)
  - Priority: Critical
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate` · `pnpm -s test:unit`
  - Files: `app/api/checkout/webhook/route.ts` · `lib/structured-log.ts`

- [x] [EXEC] [treido-impl-backend] TS-002: Validate `/api/products/count` request body (schema parse + safe coercions)
  - Priority: Critical
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/api/products/count/route.ts`

- [x] [EXEC] [treido-impl-backend] TS-003: Validate `/api/boost/checkout` request body (schema parse + safe defaults)
  - Priority: High
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/api/boost/checkout/route.ts`

- [x] [EXEC] [treido-impl-backend] TS-004 / TS-005: Validate payments routes request bodies (set-default + delete)
  - Priority: High
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/api/payments/set-default/route.ts` · `app/api/payments/delete/route.ts`

- [x] [EXEC] [treido-impl-backend] ORCH-002: Tighten `orders`/`order_items` policy roles to `authenticated`
  - Priority: High
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `mcp__supabase__get_advisors({ type: \"security\" })`
  - Files: `supabase/migrations/*` (new migration)

- [x] [EXEC] [treido-impl-backend] SUPABASE-003: Remove `anon` EXECUTE for `increment_helpful_count` (write RPC)
  - Priority: Medium
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `mcp__supabase__get_advisors({ type: \"security\" })`
  - Files: `supabase/migrations/*` (new migration)

- Notes: Supabase Security Advisor still warns `auth_leaked_password_protection` disabled (see `LAUNCH-004`).
- Frontend follow-up: if the UI allowed anonymous “helpful” clicks, require auth or handle 401/403 gracefully (anon EXECUTE revoked).

### Batch B01 (≤13 files) — Critical security + TS crash

- [x] STRUCT-001: Secure `SECURITY DEFINER` RPCs (auth.uid + revoke PUBLIC/anon execute)
  - Priority: Critical
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `supabase/migrations/*` (new migration)
- [x] STRUCT-002: Remove `user.email!` crash risk in profile password update
  - Priority: Critical
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/actions/profile.ts`

### Batch B02 (≤13 files) — Supabase hot paths (no `*`, no PII serialization)

- [x] STRUCT-003: Orders page: replace wildcard selects + map to minimal DTO for client
  - Priority: High
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/(account)/account/orders/page.tsx`
- [x] STRUCT-004: Orders actions: replace `order_items.*` selects + add hard caps/ranges
  - Priority: High
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/actions/orders.ts`
- [x] STRUCT-005: Messages: replace conversation `*` select + bound last-message queries
  - Priority: High
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `lib/supabase/messages.ts`

### Batch B03 (≤13 files) — Route boundary fixes (move out of `app/**/_components`)

- [x] STRUCT-006: Move `BoostDialog` to `components/shared/**` and fix cross-route imports
  - Priority: High
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/(sell)/_components/sell-form-unified.tsx` + `app/**/_components/*` + `components/shared/*`
- [x] STRUCT-007: Storybook: extract `SellersGrid` to `components/shared/**` (no app-private imports)
  - Priority: Medium
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `components/storybook/sellers-grid.stories.tsx` + `app/**/_components/*` + `components/shared/*`
- [x] STRUCT-008: Storybook: move `DesignSystemClient` out of `app/**` and update story imports
  - Priority: Medium
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `components/storybook/design-system.stories.tsx` + `app/[locale]/design-system/_components/*` + `components/shared/*`

### Batch B04 (≤13 files) — shadcn boundary + TW4 enforcement

- [x] STRUCT-009: Move `SocialInput` out of `components/ui` and remove freeform `iconBg`
  - Priority: High
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `components/ui/social-input.tsx` + `components/shared/*` + `app/**/_components/*`
- [x] STRUCT-010: Remove hardcoded `text-white` utilities (use semantic fg tokens)
  - Priority: High
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s styles:gate`
  - Files: `app/[locale]/(account)/account/orders/_components/buyer-order-actions.tsx` · `app/[locale]/(sell)/sell/orders/client.tsx` · `app/[locale]/(admin)/admin/tasks/_components/tasks-content.tsx` · `app/[locale]/design-system2/page.tsx` · `app/[locale]/(main)/demo/codex/page.tsx`
- [x] STRUCT-011: Tighten styles scan to flag `bg|text|border|ring|fill|stroke-(white|black)`
  - Priority: Medium
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s styles:gate`
  - Files: `scripts/scan-tailwind-palette.mjs`

### Batch B05 (≤13 files) — TS safety cleanup (targeted)

- [x] STRUCT-012: Remove `any`/unsafe access in revalidate route payload handling
  - Priority: High
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/api/revalidate/route.ts`
- [x] STRUCT-013: Remove `zodResolver(...) as any` and derive form types from schemas
  - Priority: Medium
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/(business)/_components/product-form-modal.tsx` · `app/[locale]/(sell)/_components/sell-form-provider.tsx`

### Batch B06 (manual) — Production hard gates + data sanity

- [ ] LAUNCH-001: Verify Stripe webhook idempotency (no duplicate orders on replay)
  - Priority: Critical
  - Owner: treido-impl-backend
  - Verify: documented manual replay steps + outcome notes
- [ ] LAUNCH-002: Test refund/dispute flow end-to-end (buyer protection + seller refund path)
  - Priority: Critical
  - Owner: treido-impl-backend
  - Verify: documented test steps + outcome notes
- [ ] LAUNCH-003: Verify Stripe environment separation (prod uses live keys + correct webhook secrets)
  - Priority: Critical
  - Owner: treido-impl-backend
  - Verify: documented env var checklist + outcome notes
- [ ] LAUNCH-004: Enable leaked password protection + re-run Supabase Security Advisor until clean
  - Priority: Critical
  - Owner: treido-supabase-mcp
  - Verify: record advisor results (or exceptions) + date
- [x] LAUNCH-005: Write support playbooks (refund/dispute decision tree, SLAs, escalation, prohibited items)
  - Priority: High
  - Owner: HUMAN
  - Verify: docs drafted under `docs-site/` + linked from `docs-site/README.md` (if present)
  - Status: 2026-02-13 complete — playbooks present (`support-playbook`, `dispute-resolution-matrix`, `prohibited-items`) and surfaced from `docs-site/content/index.mdx` via direct links.
- [x] LAUNCH-006: Fix cart badge discrepancy + verify cart counts match server truth
  - Priority: High
  - Owner: treido-impl-frontend
  - Verify: manual repro before/after + `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` (if applicable)
  - Status: 2026-02-13 complete — unified badge readiness behavior, guarded pre-hydration empty/cart counts, and added unit coverage in `__tests__/cart-badge-count.test.tsx`; smoke suite passed (23 passed, 3 skipped).
- [ ] LAUNCH-007: Verify product data sanity (no test/dummy listings; categorization sane)
  - Priority: High
  - Owner: treido-impl-backend
  - Verify: sample audit list + fix plan (data + cache invalidation)

## 🗂️ Backlog (Defer)

- [x] DOCS-001: Docs governance lane — keep workflow docs + gates in sync
  - Priority: Medium
  - Owner: treido-orchestrator
  - Scope: `AGENTS.md` · `docs/WORKFLOW.md` · `docs/QA.md` · `docs/RISK.md` · `scripts/docs-*.mjs`
  - Done means: `pnpm -s docs:check` green; process docs include Owner/Last verified/Refresh cadence; no stale migration refs to nonexistent docs trees
  - Verify: `pnpm -s docs:check`
  - Status: 2026-02-13 complete — `docs:check` and docs freshness gate passed.
- [x] DOCS-002: Production audit docs — migrate phases to Evidence Log (v2) template
  - Priority: Low
  - Owner: treido-audit
  - Scope: `production-audit/01..18` + `production-audit/master.md`
  - Done means: phase docs use `production-audit/TEMPLATE.md` Evidence Log columns for new runs; legacy phases updated opportunistically
  - Verify: manual review + `pnpm -s docs:check`
  - Status: 2026-02-13 complete — phases `01..18` migrated to `Evidence Log (v2)` schema with method guidance line; master doc note updated.

- [x] BACKLOG-001: Replace chart primitive arbitrary utilities + `any` types (SHADCN-002, TS-010)
  - Priority: Medium
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/[locale]/_components/charts/chart.tsx`
  - Status: 2026-02-13 complete — removed arbitrary selector utilities from tooltip row icon styling and tightened theme color resolution typing.
- [x] BACKLOG-002: Remove opacity modifiers + arbitrary transitions/rings in `components/ui` primitives (SHADCN-003/004)
  - Priority: Medium
  - Owner: treido-impl-frontend
  - Verify: `pnpm -s styles:gate`
  - Files: `components/ui/select.tsx` · `components/ui/toggle.tsx`
  - Status: 2026-02-13 complete — removed class-level ring/transition modifiers from select/toggle primitives per SHADCN-004.
- [x] BACKLOG-003: Remove `// @ts-nocheck` from `supabase/functions/ai-shopping-assistant/index.ts`
  - Priority: Medium
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` (plus Supabase deploy checks)
  - Files: `supabase/functions/ai-shopping-assistant/index.ts`
  - Status: 2026-02-13 complete — `index.ts` no longer contains `@ts-nocheck`; verified with repo search and passing `typecheck`.
- [x] BACKLOG-004: Reduce admin revenue calc scan-all-orders to SQL aggregate (SUPABASE-007)
  - Priority: Low
  - Owner: treido-impl-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `lib/auth/admin.ts` (+ `supabase/migrations/*` if adding an RPC/view)
  - Status: 2026-02-13 complete — revenue now uses `admin_paid_revenue_total` RPC with DB-side aggregate fallback (`total_amount.sum()`), avoiding row-by-row app-layer summation.

- [ ] BACKLOG-005: Checkout buyer blocking/warning (buyer protection UX)
  - Priority: Medium
  - Owner: treido-impl-backend
  - Scope: Decide enforcement strategy (hard block vs warn), and implement in checkout action with clear messaging.
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s test:unit` · `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
  - Files: `app/[locale]/(checkout)/_actions/checkout.ts`

- [ ] BACKLOG-006: Buyer confirmation email on checkout completion
  - Priority: Low
  - Owner: treido-impl-backend
  - Scope: Wire an email provider and send confirmation on successful order creation (idempotent).
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s test:unit`
  - Files: `app/api/checkout/webhook/route.ts`

- [ ] BACKLOG-007: PDP mobile seller bio surface (when profile bio exists)
  - Priority: Low
  - Owner: treido-impl-frontend
  - Scope: Display seller bio (or hide section cleanly when absent) in mobile PDP.
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-product-single-scroll.tsx`

- [ ] BACKLOG-008: PDP report modal/flow (trust & safety)
  - Priority: Medium
  - Owner: treido-impl-frontend
  - Scope: Implement report UI + endpoint wiring (product/user), with abuse-safe rate limits and user feedback states.
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s test:unit` · `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
  - Files: `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-product-single-scroll.tsx`
 
## ✅ Recently Completed

| Task | Date | Notes |
|------|------|-------|
| Frontend lane: global error + global not-found next-intl + safe logging | 2026-01-30 | `app/global-error.tsx` · `app/global-not-found.tsx` · `messages/en.json` · `messages/bg.json` |
| Checkout webhook hardening: zod-validated metadata + structured logging | 2026-01-30 | `app/api/checkout/webhook/route.ts` |
| Validate `/api/products/count` body + structured error logging | 2026-01-30 | `app/api/products/count/route.ts` |
| Validate boost checkout body + locale-safe Stripe return URLs | 2026-01-30 | `app/api/boost/checkout/route.ts` |
| Validate payment method routes bodies + structured error logging | 2026-01-30 | `app/api/payments/set-default/route.ts` · `app/api/payments/delete/route.ts` |
| RLS hardening: restrict orders/order_items policies + revoke anon helpful-count RPC | 2026-01-30 | `supabase/migrations/20260130100000_backend_rls_roles_and_helpful_count.sql` |
| TS safety: remove `any` in revalidate webhook payload access | 2026-01-30 | `app/api/revalidate/route.ts` |
| TS safety: remove `as any` from zod resolvers (typed Resolver cast) | 2026-01-30 | `app/[locale]/(business)/_components/product-form-modal.tsx` + `app/[locale]/(sell)/_components/sell-form-provider.tsx` |
| shadcn boundary: move SocialInput out of `components/ui` | 2026-01-30 | `components/shared/auth/social-input.tsx` |
| TW4 rail: remove `text-white` and enforce scan | 2026-01-30 | `scripts/scan-tailwind-palette.mjs` |
| Route boundary fix: move BoostDialog to shared | 2026-01-30 | `components/shared/seller/boost-dialog.tsx` |
| Route boundary fix: move SellersGrid to shared (storybook-safe) | 2026-01-30 | `components/shared/seller/sellers-grid.tsx` |
| Route boundary fix: move DesignSystemClient to shared (storybook-safe) | 2026-01-30 | `components/shared/design-system/design-system-client.tsx` |
| Replace wildcard selects on account orders page | 2026-01-30 | `app/[locale]/(account)/account/orders/page.tsx` |
| Remove `order_items.*` selects + cap list queries | 2026-01-30 | `app/actions/orders.ts` |
| Fetch conversations via RPC (no `*`, no unbounded last-message scan) | 2026-01-30 | `lib/supabase/messages.ts` + `lib/types/messages.ts` |
| Secure SECURITY DEFINER RPCs + revoke PUBLIC/anon execute | 2026-01-30 | `supabase/migrations/20260130021328_secure_security_definer_rpcs.sql` |
| Guard password update for non-email accounts (remove `user.email!`) | 2026-01-30 | `app/actions/profile.ts` |
| Verify checkout session action typing (no unsafe casts) | 2026-01-29 | `app/[locale]/(checkout)/_actions/checkout.ts` |
| Remove `as any` from payments webhook route | 2026-01-29 | `app/api/payments/webhook/route.ts` |
| Share payout setup UI (`SellerPayoutSetup`) | 2026-01-24 | Reused in /sell payout gating |
| Use `ProgressHeader` for /sell gating states | 2026-01-24 | |
| Remove nested `PageShell` in (sell) routes | 2026-01-24 | Layout owns shell |
| Move seller onboarding copy to next-intl | 2026-01-24 | `Sell.sellerOnboardingWizard.*` |
| Delete demo routes (`app/[locale]/demo/`) | 2026-01-24 | Unblocked styles:gate |
| Set `/assistant` header variant to contextual | 2026-01-24 | |
| Remove unused deps (ai-sdk, radix-toggle) | 2026-01-24 | |
| Delete legacy middleware.ts | 2026-01-24 | proxy.ts is request hook |
| Knip cleanup (all exports) | 2026-01-24 | `pnpm -s knip` clean |
| Supabase Phase 1 security | 2026-01-24 | See audit/supabase.md |

## Task Writing Rules

1. Each task references an issue: `(ISSUE-####)` when applicable
2. Keep tasks small (≤ 1 day)
3. If a task changes product scope, update `docs/PROJECT.md` + `REQUIREMENTS.md`
4. Every task should have an Owner (skill): `treido-frontend`, `treido-backend`, `treido-supabase-mcp`, or `treido-audit`
5. Ownership convention (to avoid task churn):
   - Owners update their own tasks (notes/status) and avoid editing other owners’ tasks.
   - `treido-audit` may re-triage/reassign tasks, and may move tasks between sections.
6. Weekly maintenance:
   - `treido-audit` does a weekly sweep; tasks with no movement in 7+ days are marked `[STALE]` and re-triaged or de-scoped.
7. Phase tags (parallel workflow):
   - Prefix tasks with one of: `[AUDIT]`, `[PLAN]`, `[EXEC]`, `[REVIEW]`.
   - Example: `- [ ] [PLAN] [treido-frontend] Move hardcoded strings in seller flows to next-intl (ISSUE-0004)`
8. Single-writer rule (parallel workflow):
   - Only one terminal edits `TASKS.md` at a time.
   - Phase 1 audits (parallel): console output only, no `TASKS.md` edits.
   - Phase 2 planning: designated single writer consolidates into `TASKS.md`.
9. Full refactor mode: follow DEC-2026-01-29-05 (parallel Phase 1 audits → single-writer planning → round-based execute with gates).

*Last updated: 2026-02-11*
