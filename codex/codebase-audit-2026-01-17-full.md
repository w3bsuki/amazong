# Codebase Audit — 2026-01-17 (Full Coverage Addendum)

This report extends the existing codex audits with a folder-by-folder pass and new findings that were not fully captured before. It also documents a “perfect audit” methodology based on reputable public guidance.

## How to do a “perfect” audit (distilled)
Sources used for methodology:
- OWASP Code Review Guide: https://owasp.org/www-project-code-review-guide/
- Google Engineering Practices — Reviewer Guide: https://google.github.io/eng-practices/review/reviewer/

Key takeaways applied here:
1. **Risk-first triage**: Identify production-impacting issues before style/cleanup.
2. **Evidence-backed findings**: Every claim cites a file and concrete symptom.
3. **System boundaries**: Verify architectural rules are enforced by file placement and import direction.
4. **Security pass**: Check auth flows, redirects, secrets, external calls, and logging.
5. **UX/data integrity pass**: Look for hardcoded UX copy, locale bypass, pricing/formatting drift.
6. **Operational readiness**: Validate domains/URLs, sitemap/robots, environment safety.
7. **Actionable fixes**: Each finding has a likely fix direction.

---

## Folder-by-folder coverage map
Legend: ✅ = previously audited in codex, ➕ = new findings in this addendum

- app/ ✅➕ (account, auth, sell, profile, checkout, sitemap/robots)
- components/ ✅➕ (sidebar, locale dropdown, desktop rail)
- hooks/ ✅ (console/logging, hardcoding covered in prior audits)
- lib/ ✅➕ (URL helpers and metadata fallbacks)
- config/ ➕ (subcategory image map with external URLs)
- scripts/ ➕ (hardcoded credentials, credential logging)
- supabase/ ✅ (RLS, migrations, triggers already covered)
- docs/ ✅ (process fragmentation covered)
- docs-site/ ✅➕ (env-specific URLs and localhost references)
- public/ ✅ (duplicate assets flagged)
- e2e/ ✅ (coverage gaps covered)
- __tests__/ ✅ (coverage and exclusions covered)
- cleanup/ ✅ (artifact files covered)

---

## New findings (not fully captured in prior codex)

### 1) Account layout forces dynamic rendering
The account layout does server-side auth checks with `createClient()` and `headers()` which makes the layout dynamic and defeats static optimization for all account routes.
- Evidence: [app/[locale]/(account)/layout.tsx](app/[locale]/(account)/layout.tsx)

**Impact:** Every account page render triggers server work and can reduce caching effectiveness.

**Fix direction:** Move auth gate to middleware or route-level checks; keep layout static where possible.

---

### 2) Order detail view: hardcoded currency, carriers, and i18n bypass
The order detail client component hardcodes:
- Status labels and user-facing copy via inline `locale === "bg" ? ... : ...` branching
- Currency as BGN regardless of user preference
- Shipping carriers and tracking URLs (no localization or tokenization)
- `window.open()` without a `noopener`/`noreferrer` safeguard

Evidence:
- [app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx](app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx)

**Impact:** Locale drift, incorrect currency for non-BGN users, and potential window opener abuse.

**Fix direction:** Move strings to message catalog, wire currency formatting to shared utilities, centralize carrier data, and use safe link handling.

---

### 3) Profile pages embed hardcoded domains and external avatars
Public profile editor hardcodes `treido.eu` in multiple labels and preview strings.
- Evidence: [app/[locale]/(account)/account/profile/public-profile-editor.tsx](app/[locale]/(account)/account/profile/public-profile-editor.tsx)

Profile settings include hardcoded shipping regions and preset avatar URLs pointing to external services.
- Evidence: [app/[locale]/(account)/account/profile/profile-content.tsx](app/[locale]/(account)/account/profile/profile-content.tsx)

**Impact:** Environment drift (domain), localization gaps, external avatar privacy dependence.

**Fix direction:** Use `NEXT_PUBLIC_SITE_URL` for display strings, move region labels into messages, and consider hosting preset avatars locally or via approved CDN.

---

### 4) Sell flow uses inline bilingual strings across UI primitives
Multiple sell UI components hardcode English/Bulgarian strings via inline branches.
- Evidence:
  - [app/[locale]/(sell)/_components/ui/upload-zone.tsx](app/[locale]/(sell)/_components/ui/upload-zone.tsx)
  - [app/[locale]/(sell)/_components/ui/select-drawer.tsx](app/[locale]/(sell)/_components/ui/select-drawer.tsx)
  - [app/[locale]/(sell)/_components/ui/sell-error-boundary.tsx](app/[locale]/(sell)/_components/ui/sell-error-boundary.tsx)
  - [app/[locale]/(sell)/_components/ui/progress-header.tsx](app/[locale]/(sell)/_components/ui/progress-header.tsx)

**Impact:** i18n policy violation and inconsistent translations.

**Fix direction:** move to next-intl message files and use `useTranslations()`.

---

### 5) Demo desktop layout embeds brand string and inline labels
The demo desktop integrated layout contains inline copy and brand string outside message catalogs.
- Evidence: [app/[locale]/(main)/demo/desktop/_components/integrated-desktop-layout.tsx](app/[locale]/(main)/demo/desktop/_components/integrated-desktop-layout.tsx)

**Impact:** i18n drift and inconsistent branding management.

**Fix direction:** centralize strings in messages and use configuration for brand name.

---

### 6) Hardcoded site URLs in metadata, sitemap, and robots
Several locations default to production domain in code and metadata generation.
- Profile metadata fallback: [app/[locale]/[username]/page.tsx](app/[locale]/[username]/page.tsx)
- Sitemap base URL: [app/sitemap.ts](app/sitemap.ts)
- Robots sitemap URL: [app/robots.txt](app/robots.txt)

**Impact:** Staging/preview URLs can point to production or produce incorrect canonical links.

**Fix direction:** require `NEXT_PUBLIC_SITE_URL` and fail fast if missing in non-dev.

---

### 7) Payments/Subscriptions/Checkout hardcode localhost fallbacks
Multiple server handlers and actions fall back to `http://localhost:3000` or use `origin` headers without allowlists.
- [app/api/payments/setup/route.ts](app/api/payments/setup/route.ts)
- [app/api/subscriptions/portal/route.ts](app/api/subscriptions/portal/route.ts)
- [app/actions/payments.ts](app/actions/payments.ts)
- [app/actions/subscriptions.ts](app/actions/subscriptions.ts)
- [app/[locale]/(checkout)/_actions/checkout.ts](app/[locale]/(checkout)/_actions/checkout.ts)
- [lib/stripe-locale.ts](lib/stripe-locale.ts)
- [app/[locale]/(auth)/_actions/auth.ts](app/[locale]/(auth)/_actions/auth.ts)

**Impact:** Redirect URLs can be wrong in staging/preview and can be spoofed if headers are untrusted.

**Fix direction:** use a strict allowlist for redirect base URLs, require envs in production, and avoid deriving base URL from untrusted headers.

---

### 8) Hardcoded external images and flags in config/components
Multiple UI components and configs use external flag/image URLs:
- Flags in sidebar: [components/layout/sidebar/sidebar-menu-v2.tsx](components/layout/sidebar/sidebar-menu-v2.tsx)
- Shipping zone flags: [components/dropdowns/locale-delivery-dropdown.tsx](components/dropdowns/locale-delivery-dropdown.tsx)
- Fallback category images: [components/desktop/desktop-category-rail.tsx](components/desktop/desktop-category-rail.tsx)
- Massive unsplash map for subcategories: [config/subcategory-images.ts](config/subcategory-images.ts)
- Image normalization uses known remote hosts: [lib/normalize-image-url.ts](lib/normalize-image-url.ts)

**Impact:** External dependency risk, inconsistent caching, and potential privacy/referrer concerns.

**Fix direction:** Host assets in public/ or a controlled CDN and reference via app config.

---

### 9) URL helpers and metadata fall back to production domain
Multiple helpers use `treido.eu` as a default in `lib/` for URLs and metadata.
- [lib/url-utils.ts](lib/url-utils.ts)
- [lib/view-models/product-page.ts](lib/view-models/product-page.ts)

**Impact:** Wrong canonical URLs in non-prod environments.

**Fix direction:** Remove default production fallbacks; require envs.

---

### 10) Scripts expose hardcoded credentials and log secrets
Audit scripts contain hardcoded test credentials, and E2E helpers print emails/passwords to stdout.
- Hardcoded credentials:
  - [scripts/audit-treido.mjs](scripts/audit-treido.mjs)
  - [scripts/audit-treido-v2.mjs](scripts/audit-treido-v2.mjs)
- Passwords logged to stdout and suggested command with creds:
  - [scripts/create-e2e-user.mjs](scripts/create-e2e-user.mjs)
- Email logging:
  - [scripts/verify-e2e-login.mjs](scripts/verify-e2e-login.mjs)

**Impact:** Violates “no secrets in logs” rule and risks credential leakage.

**Fix direction:** Require env-driven credentials and mask/omit sensitive output.

---

### 11) Docs-site content hardcodes environment URLs
Docs content references localhost and treido.eu explicitly in several MDX files.
- Evidence (examples):
  - [docs-site/content/index.mdx](docs-site/content/index.mdx)
  - [docs-site/content/guides/deployment.mdx](docs-site/content/guides/deployment.mdx)
  - [docs-site/content/business/product/ux/desktop-ui-ux-audit.mdx](docs-site/content/business/product/ux/desktop-ui-ux-audit.mdx)

**Impact:** Docs drift when environments change; audit notes become stale quickly.

**Fix direction:** Use a docs-site environment config or templated variables for base URLs.

---

## Roast (strict, but accurate)
This codebase ships features faster than it ships **consistency**. You have i18n tooling but keep writing bilingual strings inline. You’ve centralized URLs but still default to production and localhost in multiple layers. The result is a system that “works on my machine” until it doesn’t, and then breaks in the exact places you can’t afford: checkout, auth redirects, and metadata.

---

## Recommended cleanup batch (safe to start)
1. Replace inline locale strings in sell and account UI with message catalog entries.
2. Centralize and require base URL envs; remove localhost defaults in server flows.
3. Move external asset URLs to managed assets (public/ or CDN).
4. Remove hardcoded credentials from scripts; mask logs.

---

## Coverage note
This addendum **does not replace** earlier codex audits; it extends them with gaps found in app/account/sell, scripts, and asset/config layers. See the existing codex reports for prior findings and priorities.
