# TASKS.md — Active Queue (Treido)

> **Active-only.** Keep **≤15 “Ready”** tasks. Move everything else to `.codex/archive/tasks/BACKLOG.md`.

## Gates (Run After Every Batch)

Always:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Risk-based:

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

Maintenance:

```bash
pnpm -s knip
pnpm -s dupes
```

## 🔥 In Progress

| Task | Issue | Owner | Notes |
|------|-------|-------|-------|
| Structure + rails hardening batches | – | treido-orchestrator | Audit: `.codex/audit/2026-01-30_structure.md` |

## 📋 Ready (≤15)

### Skills / docs maintenance

- [ ] SKILLS-SSOT-002: Finish SSOT link migration in remaining `SKILL.md` files (use `docs/*` + `.codex/stack.yml`; keep `.codex/project/*` as pointers only)
  - Priority: Medium
  - Owner: treido-skillsmith
  - Verify: `pnpm -s validate:skills` · `rg -n \"\\.codex/project/|\\.codex/AGENTS\\.md|\\.codex/WORKFLOW\\.md\" .codex/skills/*/SKILL.md`
  - Files: `.codex/skills/treido-frontend/SKILL.md` · `.codex/skills/treido-backend/SKILL.md`
  - Audit: `.codex/audit/2026-02-02_dev-department-agent-system.md`

### Production push (blockers)

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

### ORCH cleanup

- [ ] ORCH-CLN-010: Delete knip-confirmed unused files/folders
  - Priority: High
  - Owner: treido-orchestrator
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate` · `pnpm -s knip`
  - Files: `hooks/use-grid-navigation.ts` · `hooks/use-view-toggle-shortcuts.ts` · `components/layout/desktop-shell.shared.tsx` · `components/mobile/category-context-banner.tsx` · `components/mobile/explore-banner.tsx` · `components/shared/section-header.tsx` · `lib/badges/category-badge-specs.server.ts` · `components/desktop/checkout/**` · `components/mobile/checkout/**` · `components/mobile/product/mobile-specs-tabs.tsx` · `components/shared/product/favorites-count.tsx` · `components/shared/product/mobile-accordions.tsx` · `app/[locale]/(checkout)/_components/checkout-page-client-new.tsx` · `app/[locale]/(account)/account/selling/_components/boost-dialog.tsx` · `.storybook/mocks/*.tsx`

- [ ] ORCH-AUD-013: Fix priority audit findings (NEXTJS/TW4/SHADCN)
  - Priority: Critical
  - Owner: treido-orchestrator
  - Verify: `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`
  - Files: `middleware.ts` (new) · `proxy.ts` · `next.config.ts` · `app/api/revalidate/route.ts` · `app/actions/orders.ts` · `lib/data/products.ts` · `app/[locale]/(main)/todays-deals/page.tsx` · `app/[locale]/(account)/account/sales/_components/sales-chart.tsx` · `app/utilities.css` · `app/shadcn-components.css` · `app/[locale]/(admin)/_components/admin-stats-cards.tsx` · `components/category/subcategory-tabs.tsx` · `app/[locale]/[username]/profile-client.tsx` · `components/category/category-breadcrumb-trail.tsx` · `components/shared/modal.tsx` · `components/ui/dialog.tsx` · `components/ui/drawer.tsx`

## 🧊 Parking lot / history

- Backlog (open, not “Ready”): `.codex/archive/tasks/BACKLOG.md`
- Snapshot (pre-trim): `.codex/archive/tasks/2026-02-03_TASKS_snapshot.md`
- Shipped log: `.codex/SHIPPED.md`

## Task writing rules

1. Keep `.codex/TASKS.md` active-only (≤15 Ready).
2. Each task must include Priority, Owner, Verify, and Files.
3. Pause for approval on DB/auth/payments/destructive ops (see `docs/AGENTS.md`).
4. Single-writer rule: only one terminal edits `.codex/TASKS.md` at a time.

---

*Last updated: 2026-02-03*
