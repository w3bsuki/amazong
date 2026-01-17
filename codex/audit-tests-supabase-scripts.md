# Audit Report — tests/e2e/supabase/scripts

Scope: e2e/, __tests__/, test/, test-results/, playwright-report*, supabase/, scripts/

## Quick-win deletions (generated artifacts)
- test-results/
- playwright-report/
- playwright-report-tmp/
- playwright-report-tmp2/
- playwright-report-tmp3/
- supabase/.temp/

## Scripts inventory (verify if used)
If not referenced in package.json scripts or docs, consider deletion/archival:
- scripts/audit-treido-v2.mjs
- scripts/audit-treido.mjs
- scripts/clean-artifacts.mjs
- scripts/clear-next-dev-lock.mjs
- scripts/create-e2e-user.mjs
- scripts/probe-runtime.mjs
- scripts/run-playwright.mjs
- scripts/scan-tailwind-arbitrary.mjs
- scripts/scan-tailwind-palette.mjs
- scripts/test-supabase-join.mjs
- scripts/ts-safety-gate.mjs
- scripts/ux-audit-screenshot.mjs
- scripts/validate-agent-skills.mjs
- scripts/verify-e2e-login.mjs

## Supabase (risky deletions)
- supabase/migrations/** (do not delete without DB migration history audit)
- supabase/schema.sql (often used for snapshot; verify if used)
- supabase/seed.sql
- supabase/seed_categories.sql

## E2E / tests
- e2e/ assets and fixtures appear minimal and likely used:
  - e2e/assets/1x1.png
  - e2e/fixtures/*

## Next steps
1) Check package.json for any script references to scripts/*.mjs.
2) Decide whether to archive or delete non-runner scripts (audit, scan) after confirming no doc references.
3) Keep migrations unless a full migration-rewrite plan is approved.
4) Delete generated test outputs now (safe).
