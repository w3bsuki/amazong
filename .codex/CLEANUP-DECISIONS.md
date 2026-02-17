## 2026-02-15 — Sell Schema Path Cleanup
DECISION: Standardize sell-flow schema imports on `@/lib/sell/schema` with canonical module path `lib/sell/schema.ts`.
REASON: Remove versioned canonical-path usage and keep a stable import target.
FILES: `lib/sell/schema.ts`; `app/[locale]/(sell)/_actions/sell.ts`; `app/[locale]/(sell)/_components/ai/ai-listing-assistant.tsx`; `app/[locale]/(sell)/_components/fields/attributes-field.tsx`; `app/[locale]/(sell)/_components/fields/condition-field.tsx`; `app/[locale]/(sell)/_components/fields/photos-field.tsx`; `app/[locale]/(sell)/_components/fields/pricing-field.tsx`; `app/[locale]/(sell)/_components/fields/review-field.tsx`; `app/[locale]/(sell)/_components/index.ts`; `app/[locale]/(sell)/_components/layouts/desktop-layout.tsx`; `app/[locale]/(sell)/_components/layouts/mobile-layout.tsx`; `app/[locale]/(sell)/_components/sell-form-provider.tsx`; `app/[locale]/(sell)/_components/sell-form-unified.tsx`; `app/[locale]/(sell)/_components/ui/image-preview-modal.tsx`; `app/[locale]/(sell)/_components/ui/photo-thumbnail.tsx`.
RISK: Low — import rewires only; schema behavior unchanged.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-15 — Sidebar Menu Categories Prop Cleanup
DECISION: Remove the unused `categories` prop from `SidebarMenu` and stop forwarding it through the mobile homepage header path.
REASON: `SidebarMenu` does not consume category data and already links directly to `/categories`.
FILES: `components/layout/sidebar/sidebar-menu.tsx`; `components/layout/header/mobile/homepage-header.tsx`; `app/[locale]/_components/app-header.tsx`.
RISK: Low — unused-prop removal only; behavior unchanged.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-15 — App Actions Dead Code Cleanup
DECISION: Remove unreferenced local helpers in profile, products, and seller-feedback action modules while keeping exported behavior unchanged.
REASON: Reduce dead code and maintenance overhead after zero-callsite verification.
FILES: `app/actions/profile.ts`; `app/actions/products.ts`; `app/actions/seller-feedback.ts`.
RISK: Low — removed code was local and unreferenced.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-15 — Support Artifact and Script Cleanup
DECISION: Delete unreferenced support artifacts and legacy/manual scripts that are not package-script, CI, or runtime dependencies.
REASON: Reduce repository clutter while retaining required operational scripts.
FILES: `cleanup/` (removed); `demo-v4-mobile.png` (removed); `playwright-profile-click.png` (removed); `scripts/export-admin-docs.mjs` (removed); `scripts/generate-components-audit.mjs` (removed); `scripts/seed-admin-docs.mjs` (removed); `scripts/sync-docs-site.mjs` (removed); `scripts/ux-audit-screenshot.mjs` (removed); `scripts/prod/archive-junk-products.mjs` (removed).
RISK: Low to medium — removed files were manual utilities and would require git history to restore.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-15 — Main/Home Naming Cleanup
DECISION: Normalize active main/home modules to canonical non-versioned paths and align test/import references.
REASON: Remove `v4` naming from active paths and reduce naming churn.
FILES: `lib/home-pools.ts`; `hooks/use-home-discovery-feed.ts`; `app/[locale]/(main)/_components/mobile-home.tsx`; `app/[locale]/(main)/demo/v4/demo-home.tsx`; `app/[locale]/(main)/page.tsx`; `app/[locale]/(main)/demo/v4/page.tsx`; `__tests__/home-pools.test.ts`; `__tests__/hooks/use-home-discovery-feed.test.ts`.
RISK: Low — path and import alignment only; runtime logic unchanged.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-15 — Hooks Notification Count Query Cleanup
DECISION: Replace notification count query `select("*")` with projected `select("id")` while keeping `head: true` and exact count.
REASON: Align with hot-path query-shaping rules and avoid wildcard projection.
FILES: `hooks/use-notification-count.ts`.
RISK: Low — count semantics unchanged.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-15 — Hooks Toast Listener Cleanup
DECISION: Make the toast subscription effect stable with `[]` dependencies to avoid repeated resubscription.
REASON: Prevent redundant subscribe/unsubscribe churn and listener duplication risk.
FILES: `hooks/use-toast.ts`.
RISK: Low — lifecycle is now mount/unmount scoped.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-15 — Hooks use-is-mobile Rename Cleanup
DECISION: Rename the mobile viewport hook file to `use-is-mobile` and update all consumers and tests.
REASON: Match filename to exported hook name for consistency and discoverability.
FILES: `hooks/use-is-mobile.ts`; `__tests__/hooks/use-is-mobile.test.ts`; `app/[locale]/_components/providers/sonner.tsx`; `app/[locale]/_components/global-drawers.tsx`; `app/[locale]/_components/drawers/product-quick-view-dialog.tsx`; `app/[locale]/_components/charts/chart-area-interactive.tsx`; `app/[locale]/(account)/account/_components/account-chart.tsx`; `app/[locale]/(sell)/_components/ui/category-modal/index.tsx`; `app/[locale]/(sell)/_components/ui/brand-combobox.tsx`; `components/layout/sidebar/sidebar.tsx`; `components/mobile/drawers/product-quick-view-drawer.tsx`.
RISK: Medium-low — import-path migration only.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-15 — Hooks Export Surface Cleanup
DECISION: Remove internal-only exported hook types that have no external consumers.
REASON: Keep the exported type surface minimal and intentional.
FILES: `hooks/use-geo-welcome.ts`; `hooks/use-product-search.ts`.
RISK: Low — internal type visibility change only.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Badge Feature API Hardening
DECISION: Implement persisted `user_badges.is_featured` toggling in `PATCH /api/badges/feature/[badgeId]` while preserving existing auth and ownership checks.
REASON: Replace placeholder behavior with real featured-state updates.
FILES: `app/api/badges/feature/[badgeId]/route.ts`.
RISK: Medium-low — writes are limited to the authenticated owner's badge row, with fallback handling when `is_featured` is unavailable.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Badge Hook Toggle Payload Validation
DECISION: Validate badge-toggle API payloads at runtime in the client hook, supporting both `{ is_featured }` and `{ success, is_featured }` response shapes.
REASON: Prevent silent coercion and maintain compatibility across payload formats.
FILES: `hooks/use-badges.ts`; `__tests__/hooks/use-badges.test.ts`.
RISK: Low — client-side response handling and tests only.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Env Healthcheck Default-Off Hardening
DECISION: Gate `/api/health/env` behind explicit `ENABLE_ENV_HEALTHCHECK=true`, including in production.
REASON: Reduce accidental exposure of environment diagnostics while preserving controlled opt-in.
FILES: `app/api/health/env/route.ts`.
RISK: Low — endpoint availability is stricter by default.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.
## 2026-02-16 — Demo Route Path Consolidation
DECISION: Rename versioned demo route directories to semantic names: `v2` → `feed`, `v3` → `category-rails`, `v4` → `discovery`.
REASON: Remove version-suffixed route paths and make demo route intent explicit.
FILES: `app/[locale]/(main)/demo/feed/**`; `app/[locale]/(main)/demo/category-rails/**`; `app/[locale]/(main)/demo/discovery/**`.
RISK: Medium-low — URL paths for demo variants changed; no production route contracts or business logic changed.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.
## 2026-02-16 — Playwright Readiness Stabilization
DECISION: Add `/api/health/ready` and point Playwright readiness checks to it; make warmup route failures non-fatal with bounded retries.
REASON: Keep smoke automation resilient after locking down `/api/health/env`, and prevent long global-setup stalls from blocking runs.
FILES: `app/api/health/ready/route.ts`; `scripts/run-playwright.mjs`; `e2e/global-setup.ts`.
RISK: Low — affects test infrastructure only, not runtime business logic.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.
## 2026-02-16 — Route Mobile Dead File Cleanup
DECISION: Remove two unreferenced mobile home components under `app/[locale]/(main)/_components/mobile` after repo-wide callsite verification.
REASON: Eliminate verified dead files with no runtime imports/usage.
FILES: `app/[locale]/(main)/_components/mobile/home-section-header.tsx` (removed); `app/[locale]/(main)/_components/mobile/promoted-listings-strip.tsx` (removed).
RISK: Low — both files were unreachable; no behavior path changed.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.
SKIP: Left commented-out line in `app/api/checkout/webhook/route.ts` unchanged because webhook code is high-risk scope per cleanup guardrails.
## 2026-02-16 — lib/hooks Dead Export Cleanup
DECISION: Remove test-only or unreferenced exports/functions in owned utility and hook modules after repo-wide usage verification; keep file set intact because all `lib/**` and `hooks/**` files have active non-test usage.
REASON: Reduce dead surface area without changing runtime behavior or business logic.
FILES: `lib/currency.ts`; `lib/format-price.ts`; `lib/url-utils.ts`; `lib/ui/badge-intent.ts`; `hooks/use-toast.ts`.
RISK: Low — removed symbols had zero production callsites; retained behavior for all imported runtime APIs.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.
## 2026-02-16 — Components Dead Code and Export Cleanup
DECISION: Remove verified-unused component exports/internal code and unused icon imports in `components/**`, with no behavioral changes.
REASON: Reduce dead surface area and maintenance overhead after knip + repo-wide symbol checks confirmed zero callsites.
FILES: `components/ui/mobile-bottom-nav.tsx`; `components/ui/breadcrumb.tsx`; `components/ui/table.tsx`; `components/layout/sidebar/sidebar.tsx`; `components/shared/category/category-icons.tsx`.
RISK: Low — removals are limited to unreachable symbols/imports and non-functional refactor of a conditional.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Dead E2E Audit Spec Cleanup
DECISION: Remove stale Playwright specs that no longer represent active automated coverage: `e2e/onboarding.spec.ts`, `e2e/mobile-ux-audit.spec.ts`, and `e2e/mobile-ux-audit-detailed.spec.ts`.
REASON: `onboarding.spec.ts` is dominated by manual-placeholder skips, and the mobile UX audit specs are legacy broad-audit artifacts with route assumptions that no longer align with the current route structure.
FILES: `e2e/onboarding.spec.ts`; `e2e/mobile-ux-audit.spec.ts`; `e2e/mobile-ux-audit-detailed.spec.ts`.
RISK: Medium-low — removes obsolete test artifacts; no production runtime behavior changed.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Public Asset Dead-File Cleanup
DECISION: Remove unreferenced `public/` assets with zero repository references after whole-repo scan.
REASON: These files are dead static artifacts and increase repository noise without runtime usage.
FILES: `public/abstract-beauty.jpg`; `public/abstract-beauty.png`; `public/colorful-toy-collection.jpg`; `public/colorful-toy-collection.png`; `public/cozy-cabin-interior.jpg`; `public/cozy-cabin-interior.png`; `public/diverse-fashion-collection.jpg`; `public/diverse-fashion-collection.png`; `public/diverse-people-listening-headphones.jpg`; `public/diverse-people-listening-headphones.png`; `public/electronics-components.png`; `public/fitness-watch.jpg`; `public/gaming-setup.png`; `public/icon-light-32x32.png`; `public/modern-computer-setup.png`; `public/modern-minimalist-kitchen.png`; `public/modern-smartphone.jpg`; `public/modern-smartphone.png`; `public/office-chair.jpg`; `public/placeholder-logo.png`; `public/placeholder-logo.svg`; `public/placeholder-user.jpg`; `public/portable-speaker.png`; `public/retro-living-room-tv.jpg`; `public/retro-living-room-tv.png`; `public/smart-speaker.jpg`; `public/vintage-camera-still-life.jpg`; `public/vintage-camera-still-life.png`; `public/categories/medical-care.webp`; `public/categories/natural-wellness.webp`; `public/categories/specialty-health.webp`; `public/categories/sports-fitness.webp`; `public/categories/supplements.webp`.
RISK: Medium-low — only unreferenced static assets removed.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Stale Support Artifact Cleanup
DECISION: Remove stale support artifacts in root/`production-audit` that are not used by active docs or code, including legacy audit screenshots.
REASON: Keep launch-hardening artifacts lean and remove obsolete audit outputs.
FILES: `CODEX-PRODUCTION-PUSH.md`; `production-audit/mobile-ux-standardization.md`; `production-audit/quality-snapshot-2026-02-15.md`; `production-audit/evidence/phase4/phase4-S4.10-location-chip-iphone12.png`; `production-audit/evidence/phase4/phase4-S4.10-location-chip-pixel5.png`; `production-audit/evidence/phase4/phase4-S4.7-filter-sort-bar-iphone12.png`; `production-audit/evidence/phase4/phase4-S4.7-filter-sort-bar-pixel5.png`; `production-audit/evidence/phase4/phase4-S4.8-filter-panel-open-iphone12.png`; `production-audit/evidence/phase4/phase4-S4.8-filter-panel-open-pixel5.png`; `production-audit/evidence/phase6/phase6-category-to-pdp-navigation-iphone12.png`; `production-audit/evidence/phase6/phase6-category-to-pdp-navigation-pixel5.png`; `production-audit/evidence/phase6/phase6-S6.15-tab-bar-hidden-iphone12.png`; `production-audit/evidence/phase6/phase6-S6.15-tab-bar-hidden-pixel5.png`; `production-audit/evidence/phase6/phase6-S6.2-gallery-swipe-iphone12.png`; `production-audit/evidence/phase6/phase6-S6.2-gallery-swipe-pixel5.png`; `production-audit/evidence/phase6/phase6-S6.3-image-counter-iphone12.png`; `production-audit/evidence/phase6/phase6-S6.3-image-counter-pixel5.png`; `production-audit/evidence/phase6/phase6-S6.4-fullscreen-viewer-iphone12.png`; `production-audit/evidence/phase6/phase6-S6.4-fullscreen-viewer-pixel5.png`; `production-audit/evidence/phase7/phase7-S7.1-cart-drawer-open-iphone12.png`; `production-audit/evidence/phase7/phase7-S7.1-cart-drawer-open-pixel5.png`; `production-audit/evidence/phase7/phase7-S7.15-checkout-auth-gate-iphone12.png`; `production-audit/evidence/phase7/phase7-S7.15-checkout-auth-gate-pixel5.png`; `production-audit/evidence/phase7/phase7-S7.2-cart-drawer-items-iphone12.png`; `production-audit/evidence/phase7/phase7-S7.2-cart-drawer-items-pixel5.png`; `production-audit/evidence/phase7/phase7-S7.7-cart-badge-truth-iphone12.png`; `production-audit/evidence/phase7/phase7-S7.7-cart-badge-truth-pixel5.png`.
RISK: Low — removed files were historical support outputs and not runtime dependencies.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Legacy Vars Import Verification
DECISION: Keep `app/legacy-vars.css` in place.
REASON: File is directly imported by `app/globals.css`, and defined variables have active usage across app/component styles.
FILES: no file changes.
RISK: None — verification-only decision.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.
## 2026-02-16 — lib Unused Export Sweep (Second Pass)
DECISION: Remove additional unreferenced exports in `lib/**` identified by repo-wide `knip` analysis, including unused icon aliases and test-only helper exports.
REASON: Complete dead-export cleanup in owned paths while preserving runtime callsites.
FILES: `lib/icons/phosphor.ts`; `lib/stripe-locale.ts`; `lib/order-status.ts`; `lib/validation/auth.ts`.
RISK: Low — removed symbols had no production imports; no behavioral paths changed.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.
## 2026-02-16 — Repo-Usage Reconciliation
DECISION: Keep exports/functions that are referenced by in-repo tests and limit cleanup to symbols with zero callsites across app and tests.
REASON: Honor repo-wide usage verification while preserving non-production test contracts.
FILES: `lib/icons/phosphor.ts` (removed unused icon aliases only); `lib/currency.ts`; `lib/format-price.ts`; `lib/url-utils.ts`; `lib/ui/badge-intent.ts`; `lib/order-status.ts`; `lib/stripe-locale.ts`; `lib/validation/auth.ts`; `hooks/use-toast.ts` (restored, no intended net cleanup change).
RISK: Low — no runtime behavior changes; removed aliases had no callsites.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Empty Route Utility Folder Removal
DECISION: Remove empty `app/[locale]/_lib` directory.
REASON: Directory had no files and violated cleanup target to remove empty folders.
FILES: `app/[locale]/_lib/` (removed).
RISK: None — empty directory only.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Production Audit Folder Removal
DECISION: Remove remaining `production-audit/` documentation artifacts.
REASON: Files were non-runtime historical audit artifacts and explicitly targeted by cleanup sweep.
FILES: `production-audit/` (removed).
RISK: Low — documentation/history loss only; runtime unaffected.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Test Contract Export Restoration
DECISION: Restore utility and hook exports that were removed by an aggressive dead-export pass but are covered by active unit-test contracts.
REASON: Keep cleanup safe by preserving intentionally tested public helper APIs.
FILES: `lib/currency.ts`; `lib/format-price.ts`; `lib/order-status.ts`; `lib/stripe-locale.ts`; `lib/validation/auth.ts`; `lib/url-utils.ts`; `lib/ui/badge-intent.ts`; `hooks/use-toast.ts`.
RISK: Low — restores prior API surface without changing runtime behavior.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Knip Export Cleanup (Targeted)
DECISION: Removed verified-unused exports from the allowed cleanup files; retained `formatPriceParts` in `lib/currency.ts` because it has active runtime usage in `components/shared/product/product-price.tsx`.
REASON: Apply knip-reported dead-export cleanup without changing runtime behavior or live callsites.
FILES: `lib/currency.ts`; `lib/stripe-locale.ts`; `lib/order-status.ts`; `lib/validation/auth.ts`; `hooks/use-toast.ts`; `lib/format-price.ts`; `lib/url-utils.ts`; `lib/ui/badge-intent.ts`.
RISK: Low — changes are export-surface reductions only; remaining logic paths are unchanged.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.
## 2026-02-16 — Route Alias Consolidation (Canonical Paths)
DECISION: Remove redirect-only/duplicate alias routes and rewire callsites to canonical routes: `/search`, `/chat`, `/customer-service`, `/wishlist/shared/[token]`, and `/dashboard`.
REASON: Reduce App Router bloat, remove duplicate entry points, and keep one canonical URL per flow.
FILES: `app/[locale]/(main)/browse/page.tsx` (removed); `app/[locale]/(main)/(support)/help/page.tsx` (removed); `app/[locale]/(main)/(support)/help/loading.tsx` (removed); `app/[locale]/(main)/messages/page.tsx` (removed); `app/[locale]/(main)/wishlist/[token]/page.tsx` (removed); `app/[locale]/(main)/seller/dashboard/page.tsx` (removed); `app/[locale]/(main)/seller/dashboard/loading.tsx` (removed); `app/[locale]/(main)/seller/dashboard/error.tsx` (removed); `app/[locale]/(main)/seller/dashboard/_components/seller-dashboard-loading-skeleton.tsx` (removed); `app/[locale]/(account)/account/selling/edit/page.tsx` (removed); `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx`; `app/[locale]/(account)/account/wishlist/_components/share-wishlist-button.tsx`; `app/[locale]/(auth)/auth/error/page.tsx`; `app/[locale]/(main)/_providers/onboarding-provider.tsx`; `app/[locale]/_components/app-header.tsx`; `app/[locale]/_components/site-footer.tsx`; `app/sitemap.ts`; `e2e/seller-routes.spec.ts`; `app/api/admin/docs/seed/templates.ts`.
RISK: Medium-low — URL aliases removed; internal links/tests updated to canonical routes.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Demo-Only Component Rehoming
DECISION: Move `CategoryCirclesSimple` out of shared mobile components into route-private demo components.
REASON: Component is used only by the demo landing route and should not inflate shared mobile surface area.
FILES: `components/mobile/category-nav/category-circles-simple.tsx` (moved to `app/[locale]/(main)/demo/_components/category-circles-simple.tsx`); `app/[locale]/(main)/demo/demo-lab.tsx`; `components/mobile/category-nav/index.ts`.
RISK: Low — import path and module ownership cleanup only; runtime behavior unchanged.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Account Layout Private Component Normalization
DECISION: Move `account-layout-content.tsx` into `(account)/_components` and update its import path from layout.
REASON: Align account route group with private-folder conventions and keep route composition files colocated.
FILES: `app/[locale]/(account)/account-layout-content.tsx` (moved to `app/[locale]/(account)/_components/account-layout-content.tsx`); `app/[locale]/(account)/layout.tsx`.
RISK: Low — file move + relative import updates only.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.
## 2026-02-16 — i18n Server Locale Alignment
DECISION: Add missing `setRequestLocale(locale)` calls on account server pages and migrate remaining internal desktop promoted link to locale-aware routing.
REASON: Ensure next-intl server rendering uses the active locale consistently and remove last internal `next/link` usage in audited scope.
FILES: `app/[locale]/(account)/account/page.tsx`; `app/[locale]/(account)/account/plans/page.tsx`; `app/[locale]/(main)/_components/desktop/promoted-section.tsx`.
RISK: Low — i18n wiring updates only; no business logic changes.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — UI Toast Primitive Removal
DECISION: Remove unused `components/ui/toast.tsx` and inline required toast type contracts in `hooks/use-toast.ts`.
REASON: `components/ui/toast.tsx` had no runtime consumers and only provided types to the hook.
FILES: `components/ui/toast.tsx` (removed); `hooks/use-toast.ts`.
RISK: Low — type-source migration only; toast hook behavior unchanged.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Unused Dependency Prune
DECISION: Remove `@phosphor-icons/react` and `@radix-ui/react-toast` from dependencies.
REASON: Both packages became unused after icon and toast surface cleanup (`knip` confirmed).
FILES: `package.json`; `pnpm-lock.yaml`.
RISK: Low — dependency surface reduction only.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.

## 2026-02-16 — Cleanup Temp Artifact Removal
DECISION: Delete stray `temp-i18n.py` artifact.
REASON: Temporary file was not part of runtime or documented cleanup assets.
FILES: `temp-i18n.py` (removed).
RISK: None — temporary file only.
APPROVAL: Not required — no DB schema, auth/access control, payments/webhooks, or destructive data operations touched.
