# Production Audit — 2026-01-17

## Scope
30-minute audit with 5 phases (repository scan, code smells, duplication/overengineering, production readiness, remediation plan). Focus on production blockers and highest-risk issues.

## Executive Summary (Biggest Offenders)
**Critical correctness + production blockers:**
1. **Supabase double stock decrement on checkout** — two triggers run on `order_items` insert (critical inventory correctness). Evidence: [supabase_audit.md](supabase_audit.md#L44-L120).
2. **Supabase avatars storage bucket missing** — app uses `avatars` bucket, but only `product-images` exists; upload flows will fail. Evidence: [supabase_audit.md](supabase_audit.md#L93-L140).
3. **Category detail pages broken** — duplicate footer + empty content in category detail route. Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L336-L383).
4. **Gift Cards page empty** — broken route in production. Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L336-L383).

**High-priority tech debt / UX regressions:**
1. **Duplicate DOM elements + mobile navigation on desktop** — repeated skip links/footer and mobile nav visible on desktop. Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L341-L353).
2. **Hardcoded production URLs** — defaults to `https://treido.eu` or localhost in runtime paths; risky in multi-env or staging. Evidence: [lib/url-utils.ts](lib/url-utils.ts#L68-L76), [lib/stripe-locale.ts](lib/stripe-locale.ts#L22-L31), [lib/view-models/product-page.ts](lib/view-models/product-page.ts#L189-L210).
3. **Placeholder social links** — `#` URLs are listed as production issues. Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L336-L383).

**Medium-priority cleanup:**
1. **Excess hex/arbitrary values** in shared filters and category visuals (token drift). Evidence: [cleanup/arbitrary-scan-report.txt](cleanup/arbitrary-scan-report.txt).
2. **Duplicate static assets** — 5 category images are identical (wasted bytes). Evidence: [duplicate-hashes.txt](duplicate-hashes.txt).
3. **Runtime `console.*` in hooks** — logs ship to users on failures (noise, potential data leak). Evidence: [hooks/use-category-navigation.ts](hooks/use-category-navigation.ts#L236-L324), [hooks/use-category-navigation.ts](hooks/use-category-navigation.ts#L381-L447), [hooks/use-category-counts.ts](hooks/use-category-counts.ts#L84-L101), [hooks/use-badges.ts](hooks/use-badges.ts#L36-L120).

---

## Phase 1 — Scope scan (5–10 min)
**High-level blockers from audits and production docs:**
- Supabase backend correctness/security gaps (double stock decrement, missing avatars bucket, search_path warnings, leaked password protection). Evidence: [supabase_audit.md](supabase_audit.md#L44-L170).
- Production deployment steps still manual (webhook URLs, envs). Evidence: [docs/PRODUCTION.md](docs/PRODUCTION.md#L38-L75).
- Category detail route broken (duplicate footer + empty content). Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L336-L383).

## Phase 2 — Code smells audit (5–10 min)
**Hardcoding / environment risk:**
- Hardcoded base URL fallback `https://treido.eu`. Evidence: [lib/url-utils.ts](lib/url-utils.ts#L68-L76).
- Hardcoded localhost default for Stripe return URLs. Evidence: [lib/stripe-locale.ts](lib/stripe-locale.ts#L22-L31).
- Hardcoded fallback for JSON-LD canonical URLs. Evidence: [lib/view-models/product-page.ts](lib/view-models/product-page.ts#L189-L224).
- Large hardcoded external image map (Unsplash). Evidence: [config/subcategory-images.ts](config/subcategory-images.ts#L1-L120).

**Console logging in runtime hooks (noise/PII risk):**
- Category navigation and counts error logs. Evidence: [hooks/use-category-navigation.ts](hooks/use-category-navigation.ts#L236-L324), [hooks/use-category-navigation.ts](hooks/use-category-navigation.ts#L381-L447), [hooks/use-category-counts.ts](hooks/use-category-counts.ts#L84-L101).
- Badges hook logs. Evidence: [hooks/use-badges.ts](hooks/use-badges.ts#L36-L120).

**Inline HTML injection (verify trust):**
- JSON-LD uses `dangerouslySetInnerHTML` (acceptable only if stringified trusted data). Evidence: [components/mobile/product/mobile-product-page.tsx](components/mobile/product/mobile-product-page.tsx#L166-L177), [components/shared/product/product-page-layout.tsx](components/shared/product/product-page-layout.tsx#L178-L189).

## Phase 3 — Duplication & overengineering (5–10 min)
**Duplicate assets:**
- Five category images share identical hashes (possible redundancy). Evidence: [duplicate-hashes.txt](duplicate-hashes.txt).

**Reported duplicate DOM elements & layout bugs:**
- Duplicate footers/skip links and empty content on category detail route. Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L336-L383).

**Token drift / repeated hex colors:**
- Hex-heavy shared filter components and arbitrary values. Evidence: [cleanup/arbitrary-scan-report.txt](cleanup/arbitrary-scan-report.txt).

## Phase 4 — Production readiness (5–10 min)
**Supabase blockers:**
- Double stock decrement triggers on checkout. Evidence: [supabase_audit.md](supabase_audit.md#L44-L120).
- Missing `avatars` bucket migration in remote DB. Evidence: [supabase_audit.md](supabase_audit.md#L93-L140).
- Security hardening gaps (search_path warnings + leaked password protection). Evidence: [supabase_audit.md](supabase_audit.md#L150-L180).

**App readiness blockers:**
- Category detail pages broken; gift cards empty; mobile nav shown on desktop. Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L336-L383).
- Deployment steps pending (Stripe webhook setup, production envs). Evidence: [docs/PRODUCTION.md](docs/PRODUCTION.md#L38-L75).

## Phase 5 — Production-focused remediation plan (5–10 min)
**P0 — Ship blockers**
1. Fix Supabase stock decrement by removing one trigger path (keep variant-aware one). Evidence: [supabase_audit.md](supabase_audit.md#L44-L120).
2. Apply `avatars` storage migration to production DB. Evidence: [supabase_audit.md](supabase_audit.md#L93-L140).
3. Fix category detail route layout (remove duplicate wrapper/footer, ensure products render). Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L336-L383).
4. Implement Gift Cards page content or hide route. Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L336-L383).

**P1 — UX + platform hygiene**
1. Hide mobile nav on desktop, remove duplicate DOM elements. Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L341-L353).
2. Replace `#` social links with real URLs or remove icons in production. Evidence: [docs/audit/product/desktop-ui-ux-audit.md](docs/audit/product/desktop-ui-ux-audit.md#L336-L383).
3. Remove or gate runtime `console.*` (use structured logging or silent fail). Evidence: [hooks/use-category-navigation.ts](hooks/use-category-navigation.ts#L236-L324), [hooks/use-category-counts.ts](hooks/use-category-counts.ts#L84-L101), [hooks/use-badges.ts](hooks/use-badges.ts#L36-L120).

**P2 — Config + tech debt**
1. Replace hardcoded base URLs with required envs, fail early if unset. Evidence: [lib/url-utils.ts](lib/url-utils.ts#L68-L76), [lib/stripe-locale.ts](lib/stripe-locale.ts#L22-L31), [lib/view-models/product-page.ts](lib/view-models/product-page.ts#L189-L224).
2. Consolidate duplicate category images to reduce bytes. Evidence: [duplicate-hashes.txt](duplicate-hashes.txt).
3. Reduce hex/arbitrary values; align with tokens on shared filter components. Evidence: [cleanup/arbitrary-scan-report.txt](cleanup/arbitrary-scan-report.txt).

---

## Notes
- This audit is evidence-based from existing reports and targeted code scans. For dynamic runtime verification, repeat the UI audits or run the Playwright scripts.
- Next steps: pick a P0 item and implement with 1–3 file scope + run `tsc` and `e2e:smoke` gates.
