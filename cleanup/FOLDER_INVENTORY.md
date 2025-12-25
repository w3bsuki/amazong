# 📦 Repo Folder Inventory (Production Cleanup)

This inventory is meant to support **production-safe cleanup**: remove bloat/artifacts first, then do code convergence + deletions with test gates.

Status legend:
- **KEEP**: required for app/runtime.
- **KEEP (Docs/Process)**: documentation or planning.
- **GENERATED / IGNORE**: should not be committed; safe to delete locally.
- **REVIEW**: keep, but verify contents and tighten structure.

---

## Top-level folders

### Source/runtime

- **KEEP** `app/`
  - Next.js App Router source (routes, layouts, server actions, API routes).
  - Cleanup-safe actions: remove truly unused routes/components **only after** grep + build + e2e smoke.

- **KEEP** `components/`
  - Shared UI/components.
  - Cleanup-safe actions: eliminate duplicates by convergence (re-exports → update imports → delete losers).

- **KEEP** `lib/`
  - Shared domain/data utilities.
  - Cleanup-safe actions: extract duplicated logic into shared modules; remove unused exports only with strong proof.

- **KEEP** `hooks/`
  - Shared hooks.

- **KEEP** `i18n/`
  - Routing + locale/i18n utilities.

- **KEEP** `messages/`
  - Locale message catalogs.

- **KEEP** `public/`
  - Static assets.

- **KEEP** `config/`
  - App configuration modules.

- **KEEP** `types/`
  - Shared types (may include generated types; treat carefully).

- **KEEP / REVIEW** `supabase/`
  - Migrations/config.
  - Cleanup-safe actions: remove old/test migrations only with full confidence; avoid rewriting migration history without a plan.

- **REVIEW** `scripts/`
  - Operational scripts and dev tooling.
  - Cleanup-safe actions: if a script is truly dead, delete; but **verify** it isn’t referenced by package scripts/CI/docs.

### Tests

- **KEEP** `e2e/`
  - Playwright end-to-end tests.

- **KEEP** `__tests__/`
  - Unit tests (Vitest/Jest-style).

- **KEEP** `test/`
  - Test setup/utilities.

- **KEEP (Docs/Process)** `testing/`
  - Testing guides and checklists.

### Planning / production docs

- **KEEP (Docs/Process)** `production/`
  - Production readiness checklists (security, cleanup, performance, deployment).

- **KEEP (Docs/Process)** `cleanup/`
  - Audit outputs and cleanup protocol.
  - Recommended: keep reports here, but do not commit huge binary artifacts.

- **KEEP (Docs/Process)** `templates/`
  - Templates for skills/docs/scripts.

### Tooling / configs

- **KEEP** `.github/`
  - GitHub configuration and workflows (CI).

- **REVIEW** `.vscode/`
  - Local editor settings/tasks. Keep minimal; no secrets.

- **REVIEW** `.cursor/`
  - Cursor/agent config. Keep minimal; no secrets.

- **REVIEW** `.vercel/`
  - Vercel metadata; usually ignored.

### Generated / artifacts (safe to delete locally)

- **GENERATED / IGNORE** `.next/`
  - Next.js build/dev output. Safe to delete; never commit.

- **GENERATED / IGNORE** `node_modules/`
  - Dependency install output. Safe to delete; never commit.

- **GENERATED / IGNORE** `test-results/`
  - Playwright output (e.g., `.last-run.json`). Safe to delete.

- **GENERATED / IGNORE** `playwright-report/` and `playwright-report-*/`
  - Playwright HTML reports. Safe to delete; extremely noisy.

- **GENERATED / IGNORE** `.playwright-mcp/`
  - Playwright-MCP screenshots and artifacts (currently very large). Safe to delete locally.
  - Recommendation: keep this **ignored**; if you want to preserve it, archive outside the repo.

---

## Immediate production-cleanup opportunities (lowest risk)

1) Ensure the ignore rules cover artifacts (they currently do for `.next/`, `.playwright-mcp/`, `playwright-report*`, `test-results/`).
2) Delete local artifact folders (does not change runtime code): `.next/`, `.playwright-mcp/`, `playwright-report-*/`, `test-results/`.
3) Keep `cleanup/*.json` reports as small text artifacts only (knip/jscpd outputs are ok; don’t add binary dumps).

---

## Notes on “folder-by-folder” review

- For runtime folders (`app/`, `components/`, `lib/`): treat cleanup as **convergence work**. Only delete once imports/usages have converged and test gates pass.
- For artifact folders: deleting them is safe, but if they’re accidentally tracked by git, use `git rm -r` once you confirm they’re not needed by CI.
