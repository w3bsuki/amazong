# Phase 05 - Tooling, Docs, and Dependency Prune

## Objective

Remove dead tooling/docs/deps and keep one clean operational path.

## Context7 docs used (date + links)

- Date: 2026-02-07
- N/A (repo-internal operational cleanup)

## Checklist

- [x] Removed obsolete one-off scripts and stale artifacts.
- [x] Pruned Storybook config/scripts/dependencies and `radix-ui` package entry.
- [x] Removed stale docs references to deleted archive/guide paths.
- [x] Updated docs/tooling gates to reflect current allowed markdown zones and removed paths.
- [x] Ran full gates and recorded output in Phase 06.

## Files touched

- `package.json` (removed Storybook scripts/deps + `radix-ui`)
- `eslint.config.mjs` (removed Storybook config usage)
- `scripts/docs-gate.mjs` (allowlist updates + removed stale archive exception)
- `tsconfig.json` (removed obsolete excludes)
- `knip.json` (removed obsolete ignore entries)
- `docs/INDEX.md`
- `docs/refactor.md`
- `docs-site/content/docs-index.mdx`
- `docs-site/content/refactor.mdx`
- Deleted:
  - `.storybook/main.ts`
  - `.storybook/preview.tsx`
  - `tmp-delete-test.txt`
  - `scripts/audit-treido.mjs`
  - `scripts/audit-treido-v2.mjs`
  - `scripts/create-e2e-user.mjs`
  - `scripts/pdp-screenshots.mjs`
  - `scripts/probe-runtime.mjs`
  - `scripts/test-supabase-join.mjs`
  - `scripts/ux-audit-snapshots.mjs`
  - `scripts/verify-e2e-login.mjs`
  - `scripts/mcp/supabase-mcp.ps1`
  - `docs/archive/**`
  - `shadcn-tailwind-v4-ecommerce-ui-guide/**`
  - `storybook-static/`

## Verification output

- `pnpm -s knip` -> pass; findings now: 0 unused files, 0 unused exports
- `pnpm -s docs:check` -> pass
- `pnpm -s lint` -> pass with warnings (no errors)

## Decision log

- Preserved `.codex/` legacy archive as requested; removed only targeted stale artifacts.
- Updated docs gate to permit `codex/**` because phase tracking and master plan are maintained there.
- Kept active operational scripts (`scripts/playwright-web-server.mjs`, `scripts/clear-next-dev-lock.mjs`, `scripts/ts-safety-gate.baseline.json`, `scripts/prod/archive-junk-products.mjs`) untouched.

## Done

- [x] Phase 05 complete
