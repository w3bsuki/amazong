# Refactor Execution Plan — 2026-01-18

This plan consolidates codex audits into an ordered, numbered execution path. Follow the steps in order.

## 1. Confirm canonical sources (keep as primary)
1. codex/final.md
2. codex/codebase-audit-2026-01-17-full.md
3. codex/supabase-audit-2026-01-17.md
4. codex/cleanup-audit-plan.md
5. codex/folder-inventory.md
6. codex/knip-report.md
7. codex/refactor/track-a-frontend-ui-report.md
8. codex/refactor/track-b-backend-data-2026-01-18.md
9. codex/refactor/track-c-infra-quality-report.md

## 2. Archive or delete redundant reports
1. codex/final_audit.md
2. codex/codebase-audit-2026-01-17.md
3. codex/codebase-audit-2026-01-17-deep.md
4. codex/production-audit-2026-01-17.md
5. codex/desktop-header-landing-audit-2026-01-17.md
6. codex/desktop-feed-audit-2026-01-17.md
7. codex/refactor/track-b-backend-data-report.md

## 3. Execute Plan B (backend correctness) — do this first
1. Fix double stock decrement triggers.
2. Resolve avatars bucket migration drift.
3. Unify validate_username definitions.
4. Review public RLS policies and category_stats exposure.
5. Enable leaked password protection.
6. Replace untrusted redirect URL construction with validated base URL helper.
7. Normalize `.ilike()` username lookups for unique constraints.

Exit criteria:
1. Inventory decrement is correct (single trigger path).
2. Supabase advisor warnings are resolved or explicitly accepted with rationale.
3. Redirects use trusted base URLs only.
4. Username lookups are deterministic.

## 4. Execute Plan A (frontend UX + i18n + duplication) — second
1. Fix category detail layout and gift-cards empty route.
2. Unify duplicate UI surfaces (mobile/desktop product pages, mobile home shells, demo routes).
3. Move hardcoded user strings to next-intl message files.
4. Remove component-to-action boundary violations.
5. Fix UI token drift (arbitrary Tailwind values, hardcoded colors, touch targets).

Exit criteria:
1. No UI routes are empty or broken in main flows.
2. Audited user-facing strings are localized.
3. Components layer no longer imports app actions directly.
4. Duplicate surfaces are unified or explicitly gated.

## 5. Execute Plan C (infra/quality/cleanup) — third
1. Remove or archive backup files, temp artifacts, generated reports.
2. Remove hardcoded credentials and sensitive logs in scripts.
3. Normalize docs-site URL references and env usage.
4. Consolidate duplicated config assets (subcategory images, docs examples).

Exit criteria:
1. No temp/backup artifacts remain in repo root.
2. No scripts log secrets or embed credentials.
3. Docs content uses env-based URLs or neutral examples.

## 6. Validation gates (run after each plan)
1. Typecheck (tsc --noEmit)
2. Lint (pnpm -s lint)
3. Unit tests (pnpm test:unit)
4. E2E smoke (REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke)
5. Build (pnpm -s build) after Plan B and Plan A completion

## 7. Final deliverables (after all plans)
1. Single executive summary: codex/final.md
2. Single codebase audit: codex/codebase-audit-2026-01-17-full.md
3. Single Supabase audit: codex/supabase-audit-2026-01-17.md
4. Single frontend plan: codex/refactor/track-a-frontend-ui-report.md
5. Single backend plan: codex/refactor/track-b-backend-data-2026-01-18.md
6. Single infra plan: codex/refactor/track-c-infra-quality-report.md

## 8. Risk register (must not miss)
1. Stock decrement trigger duplication (data corruption).
2. Avatars bucket mismatch in prod.
3. Leaked password protection disabled.
4. Untrusted redirect base URLs.
5. Public RLS exposure for stats/view.
