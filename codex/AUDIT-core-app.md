# Core App Audit (app/, components/, hooks/, lib/, config/, i18n/, messages/, public/)

Date: 2026-01-19

## Scope & method
- Recursively enumerated files in the requested folders and reviewed representative high-impact files and usage references via workspace search.
- Evidence links are included for any specific findings.
- No code edits performed.

## Inventory summary (by folder)
- app/: large route surface area (pages, layouts, API routes, demo routes, backups)
- components/: UI primitives, shared components, layout/navigation, product views, mobile/desktop variants, providers
- hooks/: 12 hooks with tests for some
- lib/: 50+ utilities (auth, data, filters, utils, view-models, supabase, upload)
- config/: mega menu config + subcategory images map
- i18n/: routing + request helpers
- messages/: en.json + bg.json
- public/: 39 assets (category webp, png/jpg pairs, icons, placeholders)

## Key findings (summary)
1. **Boundary violations:** Several shared components import app-layer server actions directly, which violates layering and complicates reuse/testing. See evidence in [components/seller/seller-rate-buyer-actions.tsx](components/seller/seller-rate-buyer-actions.tsx#L6), [components/seller/follow-seller-button.tsx](components/seller/follow-seller-button.tsx#L6), [components/pricing/plans-modal.tsx](components/pricing/plans-modal.tsx#L25), [components/orders/order-status-actions.tsx](components/orders/order-status-actions.tsx#L23), [components/buyer/buyer-order-actions.tsx](components/buyer/buyer-order-actions.tsx#L23), [components/auth/post-signup-onboarding-modal.tsx](components/auth/post-signup-onboarding-modal.tsx#L34).
2. **Likely dead or archival files:** CSS backups in app/ (globals.css.old, globals.css.backup) appear unused. app/demo and app/[locale]/demo routes look like demo-only surface area that may be unused in production builds.
3. **Bloated static config/data:** The mega menu config is a very large static object (590 lines). See [config/mega-menu-config.ts](config/mega-menu-config.ts#L1). The subcategory images map is also a large static object and duplicates many Unsplash URLs. See [config/subcategory-images.ts](config/subcategory-images.ts#L1).
4. **Asset duplication in public/:** Several image pairs exist with both .png and .jpg versions but code appears to reference only .png in the mega menu config. See [config/mega-menu-config.ts](config/mega-menu-config.ts#L81) (example reference). These duplicates are candidates for pruning after confirming usage.
5. **Potential i18n drift risk:** Large surface of UI strings likely lives in messages/en.json and messages/bg.json without automated parity checks. This is a risk for missing translations.
6. **High-risk large files:** app checkout client looks large (line numbers > 900), indicating potential bloat and complexity. See [app/[locale]/(checkout)/_components/checkout-page-client.tsx](app/[locale]/(checkout)/_components/checkout-page-client.tsx#L943).

---

## Folder-by-folder findings

### app/
**Findings**
- **Backups/legacy files:** app/ contains globals.css.old and globals.css.backup, which are likely dead. app/legacy-vars.css is actively imported by [app/globals.css](app/globals.css#L11), so it is currently in use.
- **Demo routes surface:** There are multiple demo routes under app/demo and app/[locale]/demo, which introduce unused or non-production pages and duplicated component logic. This increases maintenance and routing complexity.
- **Large client bundles:** The checkout client is large (line numbers > 900), increasing risk for regressions and slow iteration. See [app/[locale]/(checkout)/_components/checkout-page-client.tsx](app/[locale]/(checkout)/_components/checkout-page-client.tsx#L943).

**Risks**
- Demo routes can mask regressions by inflating route count and complicating navigation.
- Large client components are harder to test and refactor safely.

**Recommendations**
- Confirm whether demo routes are still needed; if not, plan deletion.
- Split the checkout client into smaller composables aligned with section boundaries.

### components/
**Findings**
- **Layering violations:** Several components import app-level server actions directly (see links in Key findings). This blurs the boundary between UI and app-layer logic.
- **Duplication across mobile/desktop variants:** Multiple parallel implementations exist in components/desktop and components/mobile (e.g., product pages, category nav), which likely duplicate state logic and layout patterns.
- **Embedded asset in components/auth:** There is a static image at components/auth/image.png; assets are typically expected under public/ for routing/optimization. Verify if this is required or can be relocated.

**Risks**
- Boundary violations make components harder to reuse outside current routes and complicate testing/mocking.
- Duplicated UI patterns increase maintenance surface and risks of inconsistent behavior.

**Recommendations**
- Create thin app-level wrappers that call actions, and pass callbacks into shared components instead of direct imports.
- Introduce shared “core” product/category composables used by both desktop and mobile variants.
- Move non-code assets to public/ unless intentionally bundled.

### hooks/
**Findings**
- 12 hooks live under hooks/ with tests for many in __tests__/hooks. Coverage appears decent, but there is no evident index barrel to limit import sprawl.

**Recommendations**
- Consider adding a hooks index (if this fits current patterns) to improve discoverability.

### lib/
**Findings**
- Multiple category-related utilities exist: category-display, category-tree, category-attribute-config, filter config, etc. This is a natural duplication risk.
- Two schema files for sell form (lib/sell-form-schema-v4.ts and lib/sell/schema-v4.ts) may represent overlapping validation logic.
- Many modules include domain logic (auth, supabase, upload) that may be imported directly by UI; this should be monitored for layering.

**Recommendations**
- Consolidate category utilities into a single module or clear namespace boundaries (e.g., lib/category/*).
- Reconcile schema definitions to a single source of truth.

### config/
**Findings**
- **Mega menu config is huge and mixes text/image content with UI configuration.** See [config/mega-menu-config.ts](config/mega-menu-config.ts#L1).
- **Placeholder usage** appears in the same config. See [config/mega-menu-config.ts](config/mega-menu-config.ts#L243).
- **Subcategory image fallback map** is large and contains repeated URLs. See [config/subcategory-images.ts](config/subcategory-images.ts#L1).

**Recommendations**
- Split mega menu config into JSON data files (per category or domain group) and load them statically to reduce file churn and merge conflicts.
- Normalize duplicated URLs in subcategoryImages into shared constants, or move data to a structured dataset file.

### i18n/ & messages/
**Findings**
- i18n routing and request helpers are compact; message catalogs are likely large (en/bg). No automated parity check observed from inspection.

**Recommendations**
- Add a build-time check or a simple script to ensure key parity between en.json and bg.json.

### public/
**Findings**
- **Duplicate image pairs** exist (png + jpg of the same name). The mega menu references .png variants (see [config/mega-menu-config.ts](config/mega-menu-config.ts#L81)), which suggests jpg variants may be unused:
  - abstract-beauty.{png,jpg}
  - colorful-toy-collection.{png,jpg}
  - cozy-cabin-interior.{png,jpg}
  - diverse-fashion-collection.{png,jpg}
  - diverse-people-listening-headphones.{png,jpg}
  - modern-smartphone.{png,jpg}
  - retro-living-room-tv.{png,jpg}
  - vintage-camera-still-life.{png,jpg}
- **Placeholder assets** are used in code (placeholder.jpg and placeholder.svg), so these should remain unless a unified placeholder strategy is chosen.

**Recommendations**
- Validate usage of jpg duplicates and remove unused ones. Prefer a single format and size per asset.

---

## Boundary violations (details)
Shared components directly import app-layer actions:
- [components/seller/seller-rate-buyer-actions.tsx](components/seller/seller-rate-buyer-actions.tsx#L6)
- [components/seller/follow-seller-button.tsx](components/seller/follow-seller-button.tsx#L6)
- [components/pricing/plans-modal.tsx](components/pricing/plans-modal.tsx#L25)
- [components/orders/order-status-actions.tsx](components/orders/order-status-actions.tsx#L23)
- [components/buyer/buyer-order-actions.tsx](components/buyer/buyer-order-actions.tsx#L23)
- [components/auth/post-signup-onboarding-modal.tsx](components/auth/post-signup-onboarding-modal.tsx#L34)

**Cleanup direction:** Move action calls into route-level or feature-specific wrappers, and pass handlers into shared components via props.

---

## Cleanup & refactor plan (no code changes yet)

### Phase 1 — Safe deletions & asset cleanup
1. **Remove obsolete CSS backups** (globals.css.old, globals.css.backup) after confirming they are not referenced anywhere.
2. **Cull duplicated jpg/png assets** in public/ once usages are confirmed (keep png if that is the reference standard).
3. **Validate components/auth/image.png** usage; move to public/ or delete if unused.

### Phase 2 — Layering & boundary fixes
1. Introduce app-layer wrappers that call server actions and pass results into shared components.
2. Update shared components to accept callbacks/data via props rather than importing app actions.

### Phase 3 — Data/config modularization
1. Split mega menu config into smaller, domain-specific data modules and introduce a typed loader.
2. Normalize subcategory image mappings by extracting duplicates and using a shared constants map.

### Phase 4 — Duplication reduction
1. Identify shared layout primitives for product and category UI across mobile/desktop; build shared base components.
2. Deprecate demo pages and remove duplicated demos after confirming they are not required.

---

## High-risk areas to review first
- Large client-heavy checkout screen: [app/[locale]/(checkout)/_components/checkout-page-client.tsx](app/[locale]/(checkout)/_components/checkout-page-client.tsx#L943)
- Demo route surface across app/demo and app/[locale]/demo (risk of dead or diverged behavior)
- Mega menu config churn and duplication: [config/mega-menu-config.ts](config/mega-menu-config.ts#L1)
- Layering violations across shared components importing app actions (see list above)

---

## Notes
- All files in the requested folders were enumerated via recursive listing and considered for this audit. Specific findings focus on high-impact and high-risk areas for cleanup/refactor planning.
