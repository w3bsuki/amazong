# Tasks — Structure & Rails Hardening (2026-01-30)

> **Active work only.** Max **20 total** tasks listed below, keep **≤15 “Ready”** at any time.

## Note (Skills V4)

Treido’s skill owners were revamped in **Skills V4**. Older tasks may still reference legacy owners (e.g. `treido-frontend`, `treido-backend`, `codex-iteration`), but **new work** should use specialist owners such as:

- `treido-rails`, `treido-structure`
- `treido-design`, `treido-mobile-ux`
- `treido-nextjs-16`, `treido-tailwind-v4`, `treido-shadcn-ui`
- `treido-supabase`, `treido-stripe`
- `treido-skillsmith`
- `HUMAN` (for approval-required changes)

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

## 🔥 In Progress

| Task | Issue | Owner | Notes |
|------|-------|-------|-------|
| Structure + rails hardening batches | – | treido-orchestrator | Audit: `.codex/audit/2026-01-30_structure.md` |

## 📋 Ready (≤15)

### Dev department / agent system (2026-02-02) — SSOT + roles + maintenance

- [x] ORCH-AGENTS-SSOT-001: De-duplicate SSOT by turning `.codex/AGENTS.md` + `.codex/WORKFLOW.md` into thin DEPRECATED pointers to docs
  - Priority: High
  - Owner: treido-orchestrator
  - Verify: `rg -n \"^# AGENTS\\.md \\(DEPRECATED\\)|SSOT:\" .codex/AGENTS.md` · `rg -n \"^# WORKFLOW\\.md \\(DEPRECATED\\)|SSOT:\" .codex/WORKFLOW.md`
  - Files: `.codex/AGENTS.md` · `.codex/WORKFLOW.md`
  - Audit: `.codex/audit/2026-02-02_dev-department-agent-system.md`

- [x] DOCS-DRIFT-001: Fix `docs/DOCS-PLAN.md` drift (SSOT vs archive rule; sync manifest status with reality)
  - Priority: High
  - Owner: treido-orchestrator
  - Verify: `rg -n \"Every doc in `/docs`|Doc Manifest\" docs/DOCS-PLAN.md`
  - Files: `docs/DOCS-PLAN.md`
  - Audit: `.codex/audit/2026-02-02_dev-department-agent-system.md`

- [x] FLEET-ROLES-001: Add missing roles as repo skills (`DOCS:` + `STRUCTURE:`) and wire them into SSOT docs
  - Priority: High
  - Owner: treido-orchestrator
  - Verify: `pnpm -s validate:skills`
  - Files: `.codex/skills/treido-docs/**` · `.codex/skills/treido-structure/**` · `docs/11-SKILLS.md` · `docs/AGENTS.md` · `docs/15-DEV-DEPARTMENT.md`
  - Audit: `.codex/audit/2026-02-02_dev-department-agent-system.md`

- [x] AGENTS-COVERAGE-001: Complete AGENTS layering for high-traffic boundary dirs (hooks/i18n/messages) + update root folder list
  - Priority: Medium
  - Owner: treido-orchestrator
  - Verify: `rg --files -g \"AGENTS.md\" | rg -n \"^(hooks|i18n|messages)\\\\AGENTS\\.md$\"`
  - Files: `hooks/AGENTS.md` · `i18n/AGENTS.md` · `messages/AGENTS.md` · `AGENTS.md`
  - Audit: `.codex/audit/2026-02-02_dev-department-agent-system.md`

- [ ] SKILLS-SSOT-002: Finish SSOT link migration in remaining `SKILL.md` files (use `docs/*` + `.codex/stack.yml`; keep `.codex/project/*` as pointers only)
  - Priority: Medium
  - Owner: treido-skillsmith
  - Verify: `pnpm -s validate:skills` · `rg -n \"\\.codex/project/|\\.codex/AGENTS\\.md|\\.codex/WORKFLOW\\.md\" .codex/skills/*/SKILL.md`
  - Files: `.codex/skills/treido-frontend/SKILL.md` · `.codex/skills/treido-backend/SKILL.md`
  - Audit: `.codex/audit/2026-02-02_dev-department-agent-system.md`

- [ ] SPEC-TYPESCRIPT-001: De-generic `spec-typescript` (move tutorial content into references; keep SKILL as audit checklist)
  - Priority: Low
  - Owner: treido-skillsmith
  - Verify: `pnpm -s validate:skills`
  - Files: `.codex/skills/spec-typescript/SKILL.md` · `.codex/skills/spec-typescript/references/**`
  - Audit: `.codex/audit/2026-02-02_dev-department-agent-system.md`

### Production push (2026-02-02) — blockers + alignment

- [x] PROD-000: Delete orphaned `temp-tradesphere-audit/` prototype folder
  - Priority: Critical
  - Owner: treido-orchestrator
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `temp-tradesphere-audit/**`
  - Audit: `.codex/audit/2026-02-02_file-organization-audit.md`

- [ ] FE-PLAY-001: Public routes must not be gated by onboarding (guest can browse)
  - Priority: Critical
  - Owner: treido-frontend
  - Verify: manual guest nav (`/search`, `/cart`, `/categories`) · `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
  - Files: `proxy.ts` · `app/[locale]/(main)/_providers/onboarding-provider.tsx` (and any route-guard logic)
  - Audit: `.codex/audit/playwright/2026-02-02/issues/frontend.md` (ISSUE-002)

- [ ] AUTH-PLAY-001: Fix post-login redirect duplicating locale (`/<locale>/<locale>/account`)
  - Priority: Critical
  - Owner: treido-frontend
  - Verify: manual sign-in from `/en/auth/login?next=%2Fen%2Faccount` redirects to `/en/account` · `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
  - Files: `app/[locale]/(auth)/_actions/auth.ts`
  - Audit: `.codex/audit/playwright/2026-02-02/issues/frontend.md` (ISSUE-004)

- [ ] BE-ONBOARD-001: Fix onboarding completion 500 (unblock cart/checkout)
  - Priority: Critical
  - Owner: treido-backend
  - Verify: complete onboarding → `/en/cart` accessible → proceed to checkout (stop before payment) · `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
  - Files: `app/[locale]/api/onboarding/complete/route.ts` · `lib/supabase/server.ts`
  - Audit: `.codex/audit/playwright/2026-02-02/issues/backend.md` (ISSUE-001) · `.codex/audit/playwright/2026-02-02/issues/frontend.md` (ISSUE-005)

- [ ] FE-SELL-PLAY-001: Sell wizard step validation (category + publish gating)
  - Priority: High
  - Owner: treido-frontend
  - Verify: category step blocks without selection; publish disabled until required fields complete · `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/[locale]/(sell)/_components/layouts/stepper-wrapper.tsx` · `app/[locale]/(sell)/_components/steps/step-category.tsx` · `app/[locale]/(sell)/_components/fields/review-field.tsx`
  - Audit: `.codex/audit/playwright/2026-02-02/issues/frontend.md` (ISSUE-006, ISSUE-007)

- [ ] DOCS-ALIGN-001: Update `docs/02-FEATURES.md` to match actual implementation (upgrade conservative items)
  - Priority: High
  - Owner: treido-orchestrator
  - Verify: docs updated + counts still consistent
  - Files: `docs/02-FEATURES.md`
  - Audit: `.codex/audit/2026-02-02_feature-alignment-audit.md`

- [ ] SUPABASE-PLANS-001: Make `getPlansForUpgrade()` use static client + caching for public plans
  - Priority: Medium
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `lib/data/plans.ts`
  - Audit: `.codex/audit/2026-02-02_supabase-audit.md`

### Production push (2026-02-03) — Playwright production audit (treido.eu)

- [ ] PROD-DATA-002: Purge/hide junk test listings from production + enforce listing-quality validation
  - Priority: Critical
  - Owner: treido-backend
  - Verify: manual prod spot-check (`/bg/search`, `/bg/categories/fashion`) shows no junk listings; `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
  - Files: (high-risk) requires Supabase data ops + listing validation (pause for approval)
  - Audit: `.codex/audit/playwright/2026-02-03/issues/frontend.md` (ISSUE-001)

- [ ] FE-I18N-PLAY-002: Fix store profile missing translations + React runtime error #419
  - Priority: Critical
  - Owner: treido-frontend
  - Verify: no `MISSING_MESSAGE` in console on `/bg/tech_haven`; UI shows translated labels (no raw keys); `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/[username]/profile-client.tsx` · `components/layout/header/mobile/profile-header.tsx` · `messages/bg.json` · `messages/en.json` · `i18n/request.ts`
  - Audit: `.codex/audit/playwright/2026-02-03/issues/frontend.md` (ISSUE-002)

- [ ] AI-PLAY-001: Disable AI mode in prod or ship `/api/assistant/chat` + user-facing error UI
  - Priority: Critical
  - Owner: treido-backend
  - Verify: no 404s to `/api/assistant/chat`; on failure UI shows localized error + retry (no stuck disabled send); `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `components/shared/search/search-ai-chat.tsx` · `app/api/assistant/chat/route.ts` (create) · `app/[locale]/(main)/assistant/_components/assistant-playground.tsx`
  - Audit: `.codex/audit/playwright/2026-02-03/issues/frontend.md` (ISSUE-003) · `.codex/audit/playwright/2026-02-03/issues/backend.md` (ISSUE-B01)

- [ ] FE-NAV-PLAY-002: Fix mobile Profile tab client navigation landing on 404
  - Priority: Critical
  - Owner: treido-frontend
  - Verify: `/bg/search?q=iphone` → bottom-nav Profile always renders login (no 404); add e2e regression; `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
  - Files: `components/mobile/mobile-tab-bar.tsx` · `app/[locale]/(auth)/**` (redirect + next handling)
  - Audit: `.codex/audit/playwright/2026-02-03/issues/frontend.md` (ISSUE-004)

- [ ] FE-I18N-LINKS-002: Fix locale-less internal hrefs (search pagination + similar items)
  - Priority: High
  - Owner: treido-frontend
  - Verify: rendered hrefs include `/bg/...` on BG pages; no redirect hops when paginating/clicking similar items; `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
  - Files: `components/shared/search/search-pagination.tsx` · `components/shared/product/similar-items-grid.tsx`
  - Audit: `.codex/audit/playwright/2026-02-03/issues/frontend.md` (ISSUE-005)

- [ ] CHECKOUT-PLAY-002: Fix checkout auth gating + localization (remove browser `alert`) + cart state consistency
  - Priority: High
  - Owner: treido-backend
  - Verify: user is gated before entering shipping; no English `alert`; `/bg/checkout` reflects `/bg/cart` items; `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
  - Files: `app/[locale]/(checkout)/_actions/checkout.ts` · `app/[locale]/(checkout)/**`
  - Audit: `.codex/audit/playwright/2026-02-03/issues/frontend.md` (ISSUE-006)

- [ ] FE-HOME-NAV-002: Desktop home category navigation deep-links + “Виж всички” works
  - Priority: High
  - Owner: treido-frontend
  - Verify: category selection updates URL to `/bg/categories/*` and back button works; `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/(main)/page.tsx` · `components/category/subcategory-tabs.tsx` (if used)
  - Audit: `.codex/audit/playwright/2026-02-03/issues/frontend.md` (ISSUE-007)

- [ ] FE-POLISH-PLAY-002: Production polish batch (product counts, dialog a11y, safe-area overlap, broken images, metadata titles)
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: no `{count}` placeholders; no dialog a11y warnings; footer not overlapped by bottom nav; graceful image fallback; titles not duplicated; `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `components/shared/product/product-social-proof.tsx` (if used) · `components/layout/footer/site-footer.tsx` · `components/ui/dialog.tsx` · `messages/bg.json` · `messages/en.json`
  - Audit: `.codex/audit/playwright/2026-02-03/issues/frontend.md` (ISSUE-008..ISSUE-012)

- [ ] UI-IOS-001: iOS-native mobile polish spec + pass (after ship blockers)
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: mobile screens follow spec; no rails violations; `pnpm -s styles:gate`
  - Files: `docs/04-DESIGN.md` (spec additions) · `components/mobile/**`
  - Audit: `.codex/audit/playwright/2026-02-03/issues/frontend.md` (iOS-style polish backlog)

### ORCH cleanup + design refresh (2026-01-31) — round 1 (audit: `.codex/audit/2026-01-31_full_orch_cleanup.md`)

- [ ] ORCH-CLN-010: Delete knip-confirmed unused files/folders
  - Priority: High
  - Owner: treido-orchestrator
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate` · `pnpm -s knip`
  - Files: `hooks/use-grid-navigation.ts` · `hooks/use-view-toggle-shortcuts.ts` · `components/layout/desktop-shell.shared.tsx` · `components/mobile/category-context-banner.tsx` · `components/mobile/explore-banner.tsx` · `components/shared/section-header.tsx` · `lib/badges/category-badge-specs.server.ts` · `components/desktop/checkout/**` · `components/mobile/checkout/**` · `components/mobile/product/mobile-specs-tabs.tsx` · `components/shared/product/favorites-count.tsx` · `components/shared/product/mobile-accordions.tsx` · `app/[locale]/(checkout)/_components/checkout-page-client-new.tsx` · `app/[locale]/(account)/account/selling/_components/boost-dialog.tsx` · `.storybook/mocks/*.tsx`

- [x] ORCH-CLN-011: Remove unused exports (knip-confirmed)
  - Priority: Medium
  - Owner: treido-orchestrator
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate` · `pnpm -s knip`
  - Files: `components/layout/desktop-shell.server.tsx` · `components/layout/desktop-shell.tsx` · `components/grid/product-grid.tsx` · `components/grid/index.ts` · `components/grid/grid-container.tsx` (deleted) · `knip.json`

- [ ] ORCH-CLN-012: Remove unused devDependencies (knip-confirmed)
  - Priority: Medium
  - Owner: treido-orchestrator
  - Verify: `pnpm -s lint` · `pnpm -s typecheck` · `pnpm -s knip`
  - Files: `package.json` · `pnpm-lock.yaml`

- [ ] ORCH-AUD-013: Fix priority audit findings (NEXTJS/TW4/SHADCN)
  - Priority: Critical
  - Owner: treido-orchestrator
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `middleware.ts` (new) · `proxy.ts` · `next.config.ts` · `app/api/revalidate/route.ts` · `app/actions/orders.ts` · `lib/data/products.ts` · `app/[locale]/(main)/todays-deals/page.tsx` · `app/[locale]/(account)/account/sales/_components/sales-chart.tsx` · `app/utilities.css` · `app/shadcn-components.css` · `app/[locale]/(admin)/_components/admin-stats-cards.tsx` · `components/category/subcategory-tabs.tsx` · `app/[locale]/[username]/profile-client.tsx` · `components/category/category-breadcrumb-trail.tsx` · `components/shared/modal.tsx` · `components/ui/dialog.tsx` · `components/ui/drawer.tsx`

- [x] ORCH-AUD-014: TW4 rails — remove opacity modifiers from error/admin badges (audit: `.codex/audit/2026-02-01_full_orch_refactor.md`)
  - Priority: High
  - Owner: treido-orchestrator
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/global-error.tsx` · `app/global-not-found.tsx` · `app/[locale]/(admin)/admin/orders/page.tsx` · `app/[locale]/(admin)/_components/admin-stats-cards.tsx`

### Full audit (2026-01-31) — ORCH cleanup (audit: `.codex/audit/2026-01-31_full_orch.md`)

- [x] FE-UX-025: Wishlist drawers — replace arbitrary max-height and destructive hover opacity
  - Priority: High
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `components/shared/wishlist/wishlist-drawer.tsx` · `components/mobile/drawers/cart-drawer.tsx`
- [x] FE-UX-026: Wishlist buttons — normalize touch size + hover tokens on mobile
  - Priority: High
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `components/layout/header/mobile/product-header.tsx` · `components/shared/wishlist/mobile-wishlist-button.tsx`
- [x] FE-UX-027: Homepage filter sidebar — replace non-token touch heights
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `components/desktop/filters-sidebar.tsx`
- [x] FE-UX-028: Dialog semantics — restore modal focus trap by default
  - Priority: High
  - Owner: treido-frontend
  - Verify: manual dialog focus trap + `pnpm -s lint`
  - Files: `components/ui/dialog.tsx`
- [x] FE-UX-029: Modal a11y — ensure title/label for upgrade loading modal
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: manual modal a11y + `pnpm -s lint`
  - Files: `components/shared/modal.tsx` · `app/[locale]/(account)/@modal/(.)account/plans/upgrade/page.tsx`
- [x] NX-030: Product page — remove `connection()` to preserve ISR cache
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/[username]/[productSlug]/page.tsx`
- [x] NX-031: Boosted products — avoid `connection()` in cached listing
  - Priority: Low
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `lib/data/products.ts`
- [x] SUPABASE-009: Profile fetch — read `vat_number` from `private_profiles`
  - Priority: Medium
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck`
  - Files: `app/actions/username.ts`

### Frontend lane (UI bundle) — Production hardening (audit: `.codex/audit/2026-01-30_frontend_lane_ui.md`)

- [x] FE-UI-001: Global error page — next-intl strings + safe client logging
  - Priority: Critical
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/global-error.tsx` · `messages/en.json` · `messages/bg.json`
- [x] FE-UI-002: Global not-found page — next-intl strings + locale-aware links
  - Priority: Critical
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/global-not-found.tsx` · `messages/en.json` · `messages/bg.json`
- [x] FE-UI-003: DesktopShell client boundary — keep server pages lean without breaking client imports
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `components/layout/desktop-shell.tsx` · `components/desktop/desktop-home.tsx` (or split files if needed)
  - Notes (2026-01-30): Server routes import `components/layout/desktop-shell.server.tsx`; client desktop home continues using the client shell.
- [x] FE-UX-004: LocaleProviders suspense fallback — stop double-mounting `{children}` and drawers
  - Priority: Critical
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/locale-providers.tsx`
  - Audit: `.codex/audit/2026-01-30_ui-quick-view-drawer.md` (NEXTJS-001)
- [x] FE-UX-005: Mobile product quick view drawer — fix scroll + touch utilities, remove manual body scroll lock
  - Priority: Critical
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `components/ui/drawer.tsx` · `components/mobile/drawers/product-quick-view-drawer.tsx`
  - Audit: `.codex/audit/2026-01-30_ui-quick-view-drawer.md` (NEXTJS-004, TW4-001, SHADCN-001/002)
- [x] FE-UX-006: TW4 rail cleanup — remove invalid `touch-action-*` utilities + bracket `aspect-[...]` in quick view
  - Priority: High
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate`
  - Files: `components/shared/product/quick-view/quick-view-image-gallery.tsx` · `components/shared/product/quick-view/quick-view-skeleton.tsx` · `app/utilities.css`
  - Audit: `.codex/audit/2026-01-30_ui-quick-view-drawer.md` (TW4-002/004/005)
  - Notes (2026-01-30): Added `@utility aspect-16-10` / `@utility aspect-4-3`; replaced `touch-action-*` with Tailwind `touch-*`.

Notes (2026-01-30):
- Shipped: FE-UI-001, FE-UI-002, FE-UX-004, FE-UX-005
- Remaining: —
- Backend dependencies: none discovered in this lane.

### Backend lane — Backend Production Push (audit: `.codex/audit/2026-01-30_backend_production_push.md`)

- [x] [EXEC] [treido-backend] ORCH-001 / TS-001: Harden checkout webhook (safe logging + validate `items_json`)
  - Priority: Critical
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate` · `pnpm -s test:unit`
  - Files: `app/api/checkout/webhook/route.ts` · `lib/structured-log.ts`

- [x] [EXEC] [treido-backend] TS-002: Validate `/api/products/count` request body (schema parse + safe coercions)
  - Priority: Critical
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/api/products/count/route.ts`

- [x] [EXEC] [treido-backend] TS-003: Validate `/api/boost/checkout` request body (schema parse + safe defaults)
  - Priority: High
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/api/boost/checkout/route.ts`

- [x] [EXEC] [treido-backend] TS-004 / TS-005: Validate payments routes request bodies (set-default + delete)
  - Priority: High
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `app/api/payments/set-default/route.ts` · `app/api/payments/delete/route.ts`

- [x] [EXEC] [treido-backend] ORCH-002: Tighten `orders`/`order_items` policy roles to `authenticated`
  - Priority: High
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `mcp__supabase__get_advisors({ type: \"security\" })`
  - Files: `supabase/migrations/*` (new migration)

- [x] [EXEC] [treido-backend] SUPABASE-003: Remove `anon` EXECUTE for `increment_helpful_count` (write RPC)
  - Priority: Medium
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `mcp__supabase__get_advisors({ type: \"security\" })`
  - Files: `supabase/migrations/*` (new migration)

- Notes: Supabase Security Advisor still warns `auth_leaked_password_protection` disabled (see `LAUNCH-004`).
- Frontend follow-up: if the UI allowed anonymous “helpful” clicks, require auth or handle 401/403 gracefully (anon EXECUTE revoked).

### Full refactor audit (2026-01-31) — Full repo audit (audit: `.codex/audit/2026-01-31_full_refactor.md`)

- [x] [EXEC] FE-UX-012: Input primitives — replace opacity hacks + arbitrary rings
  - Priority: High
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint` · `pnpm -s typecheck`
  - Files: `components/ui/textarea.tsx` · `components/ui/radio-group.tsx` · `components/ui/scroll-area.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (TW4-002, TW4-003, SHADCN-003)
- [x] [EXEC] FE-UX-013: shadcn boundary — move chart composite out of `components/ui`
  - Priority: High
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `components/ui/chart.tsx` · `components/shared/charts/chart.tsx` · `components/shared/charts/index.ts`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (SHADCN-001)
- [x] [EXEC] FE-UX-014: Button variants — replace token opacity modifiers
  - Priority: High
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint` · `pnpm -s typecheck`
  - Files: `components/ui/button.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (TW4-001)
- [x] [EXEC] FE-UX-015: Toast status styles — swap opacity hacks for semantic tokens
  - Priority: High
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `components/providers/sonner.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (TW4-004)
- [x] [EXEC] FE-UX-016: Middleware pathname header — set on request (not response)
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s lint` · `pnpm -s typecheck`
  - Files: `proxy.ts` · `app/[locale]/(account)/layout.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (NEXTJS-001)
  - Notes (2026-01-31): `pnpm -s lint` failed on existing `.codex/evals/run-evals.mjs` (no-assign-module-variable).
- [x] [EXEC] FE-UX-017: Replace link text opacity utilities with semantic tokens
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `components/mobile/category-context-banner.tsx` · `components/desktop/desktop-filter-modal.tsx` · `components/shared/search/mobile-search-overlay.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (TW4-001)
- [x] [EXEC] FE-UX-018: Replace subdued text + ring opacity tokens in onboarding modal + not-found pages
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx` · `app/[locale]/[username]/not-found.tsx` · `app/[locale]/(main)/categories/[slug]/not-found.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (TW4-002, TW4-003)
- [x] [EXEC] FE-UX-019: Replace link text opacity utilities in account + admin surfaces
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `app/[locale]/(account)/account/_components/account-recent-activity.tsx` · `app/[locale]/(admin)/admin/docs/_components/docs-content.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (TW4-001)
- [x] [EXEC] FE-UX-020: Replace ring opacity utilities in pricing + filters
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `components/pricing/plan-card.tsx` · `components/shared/filters/price-slider.tsx` · `components/shared/filters/color-swatches.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (TW4-003)
- [x] [EXEC] FE-UX-021: Replace accent background opacity utilities in drawers + notifications
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `app/[locale]/(sell)/_components/ui/select-drawer.tsx` · `app/[locale]/(account)/account/(settings)/notifications/notifications-content.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (TW4-004)
- [x] [EXEC] FE-UX-022: Replace muted text opacity utilities in sell condition/shipping fields
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `app/[locale]/(sell)/_components/fields/condition-field.tsx` · `app/[locale]/(sell)/_components/fields/shipping-field.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (TW4-005)
- [x] [EXEC] FE-UX-023: shadcn boundary — remove chart re-export + update imports
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `components/ui/chart.tsx` · `components/ui/chart.stories.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (SHADCN-001)
- [x] [EXEC] FE-UX-024: Remove SSG when cookies() is used in localized pages
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s lint` · `pnpm -s typecheck`
  - Files: `app/[locale]/(main)/search/page.tsx` · `app/[locale]/(main)/todays-deals/page.tsx`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (NEXTJS-001)
- [x] [EXEC] SUPABASE-006: Remove service role key from repo env files
  - Priority: High
  - Owner: treido-backend
  - Verify: `pnpm -s lint`
  - Files: `.env.local` · `.env.vercel.local`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (SUPABASE-001)
  - Notes (2026-01-31): Marked done per request; no env changes applied.
- [x] [EXEC] SUPABASE-007: Use route-handler Supabase client in auth confirm route
  - Priority: Medium
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/auth/confirm/route.ts`
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (SUPABASE-002)
- [x] [EXEC] SUPABASE-008: Update avatar bucket policies to use `(SELECT auth.uid())`
  - Priority: Medium
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `mcp__supabase__get_advisors({ type: "security" })`
  - Files: `supabase/migrations/*` (new migration)
  - Audit: `.codex/audit/2026-01-31_full_refactor.md` (SUPABASE-003)

### Full audit follow-ups (2026-01-31) — Re-queued (audit: `.codex/audit/2026-01-31_full_project_audit.md`)

- [x] [EXEC] BE-007: Stripe webhooks — make order/subscription writes idempotent (upsert + unique indexes)
  - Priority: Critical
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s test:unit`
  - Files: `app/api/checkout/webhook/route.ts` · `app/api/subscriptions/webhook/route.ts` · `supabase/migrations/*`
  - Audit: `.codex/audit/2026-01-31_full_project_audit.md` (BE-004, BE-005)
  - Notes (2026-01-31): Verified in repo; no additional changes required.
- [x] [EXEC] SUPABASE-005: Harden SECURITY DEFINER search history functions (fixed search_path + auth.uid)
  - Priority: High
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `mcp__supabase__get_advisors({ type: "security" })`
  - Files: `supabase/migrations/*`
  - Audit: `.codex/audit/2026-01-31_full_project_audit.md` (SUPABASE-001, SUPABASE-002, SUPABASE-003, SUPABASE-004)
  - Notes (2026-01-31): Verified in repo; no additional changes required.
- [x] [EXEC] BE-008: Validate orders ship/track payloads (UUID + carrier + tracking schema)
  - Priority: Medium
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/api/orders/[id]/ship/route.ts` · `app/api/orders/[id]/track/route.ts` · `lib/validation/orders.ts`
  - Audit: `.codex/audit/2026-01-31_full_project_audit.md` (BE-001, BE-002)
  - Notes (2026-01-31): Verified in repo; no additional changes required.
- [x] [EXEC] FE-UX-007: Extract client-safe product types for mobile home
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `components/mobile/mobile-home.tsx` · `lib/data/products.ts` · `lib/types/products.ts`
  - Audit: `.codex/audit/2026-01-31_full_project_audit.md` (NEXTJS-001)
- [x] [EXEC] FE-UX-008: Extract client-safe category types for desktop filter modal
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `components/desktop/desktop-filter-modal.tsx` · `lib/data/categories.ts` · `lib/types/categories.ts`
  - Audit: `.codex/audit/2026-01-31_full_project_audit.md` (NEXTJS-002)
- [x] [EXEC] FE-UX-009: Replace forbidden `oklch(...)` + token opacity hacks in shadcn CSS
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `app/shadcn-components.css` · `app/globals.css`
  - Audit: `.codex/audit/2026-01-31_full_project_audit.md` (TW4-001, TW4-002)
- [x] [EXEC] FE-UX-010: Replace text token opacity utilities with semantic tokens
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `app/[locale]/(business)_components/business-live-activity.tsx` · `app/[locale]/not-found.tsx` · `components/layout/sidebar/sidebar-menu-v2.tsx`
  - Audit: `.codex/audit/2026-01-31_full_project_audit.md` (TW4-003)
- [x] [EXEC] FE-UX-011: Replace background opacity utilities with semantic state tokens
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate` · `pnpm -s lint`
  - Files: `components/dropdowns/notifications-dropdown.tsx` · `components/shared/design-system/design-system-client.tsx` · `app/[locale]/(sell)_components/steps/step-details.tsx`
  - Audit: `.codex/audit/2026-01-31_full_project_audit.md` (TW4-004)
  - Notes (2026-01-31): Verified in repo; no additional changes required.

### Batch B01 (≤13 files) — Critical security + TS crash

- [x] STRUCT-001: Secure `SECURITY DEFINER` RPCs (auth.uid + revoke PUBLIC/anon execute)
  - Priority: Critical
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `supabase/migrations/*` (new migration)
- [x] STRUCT-002: Remove `user.email!` crash risk in profile password update
  - Priority: Critical
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/actions/profile.ts`

### Batch B02 (≤13 files) — Supabase hot paths (no `*`, no PII serialization)

- [x] STRUCT-003: Orders page: replace wildcard selects + map to minimal DTO for client
  - Priority: High
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/(account)/account/orders/page.tsx`
- [x] STRUCT-004: Orders actions: replace `order_items.*` selects + add hard caps/ranges
  - Priority: High
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/actions/orders.ts`
- [x] STRUCT-005: Messages: replace conversation `*` select + bound last-message queries
  - Priority: High
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `lib/supabase/messages.ts`

### Batch B03 (≤13 files) — Route boundary fixes (move out of `app/**/_components`)

- [x] STRUCT-006: Move `BoostDialog` to `components/shared/**` and fix cross-route imports
  - Priority: High
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/(sell)/_components/sell-form-unified.tsx` + `app/**/_components/*` + `components/shared/*`
- [x] STRUCT-007: Storybook: extract `SellersGrid` to `components/shared/**` (no app-private imports)
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `components/storybook/sellers-grid.stories.tsx` + `app/**/_components/*` + `components/shared/*`
- [x] STRUCT-008: Storybook: move `DesignSystemClient` out of `app/**` and update story imports
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `components/storybook/design-system.stories.tsx` + `app/[locale]/design-system/_components/*` + `components/shared/*`

### Batch B04 (≤13 files) — shadcn boundary + TW4 enforcement

- [x] STRUCT-009: Move `SocialInput` out of `components/ui` and remove freeform `iconBg`
  - Priority: High
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `components/ui/social-input.tsx` + `components/shared/*` + `app/**/_components/*`
- [x] STRUCT-010: Remove hardcoded `text-white` utilities (use semantic fg tokens)
  - Priority: High
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate`
  - Files: `app/[locale]/(account)/account/orders/_components/buyer-order-actions.tsx` · `app/[locale]/(sell)/sell/orders/client.tsx` · `app/[locale]/(admin)/admin/tasks/_components/tasks-content.tsx` · `app/[locale]/design-system2/page.tsx` · `app/[locale]/(main)/demo/codex/page.tsx`
- [x] STRUCT-011: Tighten styles scan to flag `bg|text|border|ring|fill|stroke-(white|black)`
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate`
  - Files: `scripts/scan-tailwind-palette.mjs`

### Batch B05 (≤13 files) — TS safety cleanup (targeted)

- [x] STRUCT-012: Remove `any`/unsafe access in revalidate route payload handling
  - Priority: High
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/api/revalidate/route.ts`
- [x] STRUCT-013: Remove `zodResolver(...) as any` and derive form types from schemas
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/[locale]/(business)/_components/product-form-modal.tsx` · `app/[locale]/(sell)/_components/sell-form-provider.tsx`

## 🗂️ Backlog (Defer)

### Launch manual checks (moved from Ready; keep ≤15 Ready)

- [ ] LAUNCH-001: Verify Stripe webhook idempotency (no duplicate orders on replay)
  - Priority: Critical
  - Owner: treido-backend
  - Verify: documented manual replay steps + outcome notes
  - Files: `app/api/checkout/webhook/route.ts`
  - Notes (2026-01-30): Stripe Dashboard → Developers → Webhooks → select endpoint → resend `checkout.session.completed`. Confirm no duplicate `orders` / `order_items`.
- [ ] LAUNCH-002: Test refund/dispute flow end-to-end (buyer protection + seller refund path)
  - Priority: Critical
  - Owner: treido-backend
  - Verify: documented test steps + outcome notes
  - Files: n/a
- [ ] LAUNCH-003: Verify Stripe environment separation (prod uses live keys + correct webhook secrets)
  - Priority: Critical
  - Owner: treido-backend
  - Verify: documented env var checklist + outcome notes
  - Files: n/a
  - Notes (2026-01-30): Confirm `STRIPE_SECRET_KEY` is live, `STRIPE_WEBHOOK_SECRET` matches live endpoint, and redirect URLs match prod domain.
- [ ] LAUNCH-004: Enable leaked password protection + re-run Supabase Security Advisor until clean
  - Priority: Critical
  - Owner: treido-backend
  - Verify: record advisor results (or exceptions) + date
  - Files: n/a
  - Notes (2026-01-30): Supabase Security Advisor still warns `auth_leaked_password_protection` disabled; enable it in Supabase Dashboard → Auth → Password security, then re-run advisor.
- [ ] LAUNCH-005: Write support playbooks (refund/dispute decision tree, SLAs, escalation, prohibited items)
  - Priority: High
  - Owner: HUMAN
  - Verify: docs drafted under `docs-site/` + linked from `docs-site/README.md` (if present)
  - Files: `docs-site/**`
- [ ] LAUNCH-006: Fix cart badge discrepancy + verify cart counts match server truth
  - Priority: High
  - Owner: treido-frontend
  - Verify: manual repro before/after + `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` (if applicable)
  - Files: n/a
  - Notes (2026-01-30): Badge/count display now gates on `useCart().isReady` and removes clamping mismatch (`max={9}`).
- [ ] LAUNCH-007: Verify product data sanity (no test/dummy listings; categorization sane)
  - Priority: High
  - Owner: treido-backend
  - Verify: sample audit list + fix plan (data + cache invalidation)
  - Files: n/a
  - Notes (2026-01-30): Found multiple listings titled `Script Test Product` created 2025-11-24; needs removal/hiding before launch.

- [ ] [EXEC] BE-009: Validate `/api/badges/evaluate` request payload (strict schema)
  - Priority: Medium
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `app/api/badges/evaluate/route.ts`
  - Audit: `.codex/audit/2026-01-31_full_project_audit.md` (BE-003)
- [ ] [EXEC] BE-010: Expand structured log redaction keys (email/phone/address/user_id)
  - Priority: Low
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `lib/structured-log.ts`
  - Audit: `.codex/audit/2026-01-31_full_project_audit.md` (BE-006)

- [x] BACKLOG-001: Replace `components/ui/chart.tsx` arbitrary utilities + `any` types (SHADCN-002, TS-010)
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `components/ui/chart.tsx`
- [x] BACKLOG-002: Remove opacity modifiers + arbitrary transitions/rings in `components/ui` primitives (SHADCN-003/004)
  - Priority: Medium
  - Owner: treido-frontend
  - Verify: `pnpm -s styles:gate`
  - Files: `components/ui/select.tsx` · `components/ui/toggle.tsx`
- [x] BACKLOG-003: Remove `// @ts-nocheck` from `supabase/functions/ai-shopping-assistant/index.ts`
  - Priority: Medium
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` (plus Supabase deploy checks)
  - Files: `supabase/functions/ai-shopping-assistant/index.ts`
- [x] BACKLOG-004: Reduce admin revenue calc scan-all-orders to SQL aggregate (SUPABASE-007)
  - Priority: Low
  - Owner: treido-backend
  - Verify: `pnpm -s typecheck` · `pnpm -s lint`
  - Files: `lib/auth/admin.ts` (+ `supabase/migrations/*` if adding an RPC/view)

## ✅ Recently Completed

| Task | Date | Notes |
|------|------|-------|
| Stripe webhook idempotency + unique indexes | 2026-01-31 | `app/api/checkout/webhook/route.ts` · `app/api/subscriptions/webhook/route.ts` · `supabase/migrations/20260131123000_stripe_webhook_idempotency.sql` |
| Search history SECURITY DEFINER hardening | 2026-01-31 | `supabase/migrations/20260131124500_search_history_security_definer_hardening.sql` |
| Validate orders ship/track payloads | 2026-01-31 | `app/api/orders/[id]/ship/route.ts` · `app/api/orders/[id]/track/route.ts` · `lib/validation/orders.ts` |
| Client-safe product types for mobile home | 2026-01-31 | `components/mobile/mobile-home.tsx` · `lib/data/products.ts` · `lib/types/products.ts` |
| Client-safe category types for filter modal | 2026-01-31 | `components/desktop/desktop-filter-modal.tsx` · `lib/data/categories.ts` · `lib/types/categories.ts` |
| TW4 shadcn CSS token fixes | 2026-01-31 | `app/shadcn-components.css` · `app/globals.css` |
| Replace text opacity tokens | 2026-01-31 | `app/[locale]/(business)/_components/business-live-activity.tsx` · `app/[locale]/not-found.tsx` · `components/layout/sidebar/sidebar-menu-v2.tsx` |
| Replace background opacity tokens | 2026-01-31 | `components/dropdowns/notifications-dropdown.tsx` · `components/shared/design-system/design-system-client.tsx` · `app/[locale]/(sell)/_components/steps/step-details.tsx` |
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
| Supabase Phase 1 security | 2026-01-24 | See `.codex/audit/lane/supabase.md` |

## Task Writing Rules

1. Each task references an issue: `(ISSUE-####)` when applicable
2. Keep tasks small (≤ 1 day)
3. If a task changes product scope, update `.codex/project/PRD.md` + `.codex/project/FEATURES.md`
4. Every task should have an Owner (skill): pick the closest `treido-*` specialist from `docs/11-SKILLS.md`, or `HUMAN` for approval-required work.
5. Ownership convention (to avoid task churn):
   - Owners update their own tasks (notes/status) and avoid editing other owners’ tasks.
   - `treido-orchestrator` may re-triage/reassign tasks, and may move tasks between sections.
6. Weekly maintenance:
   - `treido-orchestrator` does a weekly sweep; tasks with no movement in 7+ days are marked `[STALE]` and re-triaged or de-scoped.
7. Phase tags (parallel workflow):
   - Prefix tasks with one of: `[AUDIT]`, `[PLAN]`, `[EXEC]`, `[REVIEW]`.
   - Example: `- [ ] [PLAN] [treido-frontend] Move hardcoded strings in seller flows to next-intl (ISSUE-0004)`
8. Single-writer rule (parallel workflow):
   - Only one terminal edits `TASKS.md` at a time.
   - Phase 1 audits (parallel): console output only, no `TASKS.md` edits.
   - Phase 2 planning: designated single writer consolidates into `TASKS.md`.
9. Full refactor mode: follow DEC-2026-01-29-05 (parallel Phase 1 audits → single-writer planning → round-based execute with gates).

*Last updated: 2026-01-30*

