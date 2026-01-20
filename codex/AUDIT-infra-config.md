# Infra/Config Audit (scripts/, supabase/, .github/, .vscode/, .claude/, .cursor/, root configs)

Date: 2026-01-19

## Scope
Reviewed:
- scripts/
- supabase/
- .github/, .vscode/, .claude/, .cursor/
- Root config files (package.json, tsconfig.json, next.config.ts, eslint.config.mjs, postcss.config.mjs, playwright.config.ts, capacitor.config.ts, knip.json)

## Summary
- **Unused or orphaned scripts** exist in scripts/ (not referenced by npm scripts, CI, or docs).
- **Duplicate tooling entries** exist in VS Code tasks.
- **Supabase migrations include inconsistent filename formats** that may be ignored or applied out of order.
- **Capacitor config likely mismatched** with the Next.js build output.
- **Multiple MCP configs** exist in different editor folders (potential drift).

## Findings

### 1) scripts/ — unused or orphaned scripts
**Referenced by package.json or other configs**
- [scripts/scan-tailwind-palette.mjs](scripts/scan-tailwind-palette.mjs)
- [scripts/scan-tailwind-arbitrary.mjs](scripts/scan-tailwind-arbitrary.mjs)
- [scripts/ts-safety-gate.mjs](scripts/ts-safety-gate.mjs)
- [scripts/ts-safety-gate.baseline.json](scripts/ts-safety-gate.baseline.json)
- [scripts/run-playwright.mjs](scripts/run-playwright.mjs)
- [scripts/clear-next-dev-lock.mjs](scripts/clear-next-dev-lock.mjs) (via Playwright config)
- [scripts/clean-artifacts.mjs](scripts/clean-artifacts.mjs)
- [scripts/ux-audit-screenshot.mjs](scripts/ux-audit-screenshot.mjs)
- [scripts/validate-agent-skills.mjs](scripts/validate-agent-skills.mjs)

**Likely unused (no references found in repo configs/docs)**
- [scripts/audit-treido.mjs](scripts/audit-treido.mjs)
- [scripts/audit-treido-v2.mjs](scripts/audit-treido-v2.mjs)
- [scripts/create-e2e-user.mjs](scripts/create-e2e-user.mjs)
- [scripts/probe-runtime.mjs](scripts/probe-runtime.mjs)
- [scripts/test-supabase-join.mjs](scripts/test-supabase-join.mjs)
- [scripts/verify-e2e-login.mjs](scripts/verify-e2e-login.mjs)

**Duplicate / legacy candidates**
- [scripts/audit-treido.mjs](scripts/audit-treido.mjs) and [scripts/audit-treido-v2.mjs](scripts/audit-treido-v2.mjs) are near-duplicate audits. Only v2 seems relevant; neither is referenced.

**Security note**
- Both audit scripts hardcode credentials and an external URL (treido.eu). This violates the “no secrets in logs” rule and is risky to keep in-repo.

### 2) supabase/ — migration naming inconsistencies
Files under [supabase/migrations](supabase/migrations) include **non-standard naming** (missing the full 14-digit timestamp prefix), which can cause migrations to be skipped or misordered by Supabase CLI:
- [supabase/migrations/20251124_audit_and_secure.sql](supabase/migrations/20251124_audit_and_secure.sql)
- [supabase/migrations/20251127_add_search_history.sql](supabase/migrations/20251127_add_search_history.sql)
- [supabase/migrations/20251203_complete_category_restructure.sql](supabase/migrations/20251203_complete_category_restructure.sql)

There are also **same-timestamp prefixes** with different names (e.g., multiple 20251213000000 and 20251214000001 files), which can be applied in lexicographic order and may not match intended sequencing:
- [supabase/migrations/20251213000000_chat_query_optimization.sql](supabase/migrations/20251213000000_chat_query_optimization.sql)
- [supabase/migrations/20251213000000_subscription_plans_enhanced.sql](supabase/migrations/20251213000000_subscription_plans_enhanced.sql)
- [supabase/migrations/20251214000001_blocked_users.sql](supabase/migrations/20251214000001_blocked_users.sql)
- [supabase/migrations/20251214000001_complete_fee_structure.sql](supabase/migrations/20251214000001_complete_fee_structure.sql)

**Missing Supabase CLI config**
- No supabase/config.toml was found. This limits local CLI reproducibility and suggests migrations/seeds might be managed manually.

### 3) .vscode — duplicate tasks
In [.vscode/tasks.json](.vscode/tasks.json):
- **Duplicate entries** for “Unit Tests (pnpm test:unit)” appear multiple times.
- Two similar tasks exist for killing port 3000 (one PowerShell, one pwsh). Likely only one is needed.

### 4) .claude, .cursor, .vscode — MCP config drift
- MCP config exists in multiple places:
  - [.vscode/mcp.json](.vscode/mcp.json)
  - [.cursor/mcp.json](.cursor/mcp.json)
  - [.vscode/settings.json](.vscode/settings.json) references MCP server sampling

These can drift over time (different auth input keys, different server definitions). Consider consolidating to one canonical location or documenting ownership.

### 5) Root config checks
**Capacitor**
- [capacitor.config.ts](capacitor.config.ts) uses `webDir: "out"`, but there is no `next export` or `output: 'export'` in [next.config.ts](next.config.ts), and no script produces `out/`. This likely breaks `cap:build` output expectations.
- `server.url` is hardcoded to a LAN IP (192.168.1.4), which is likely environment-specific and stale.

**Knip**
- [knip.json](knip.json) lists `middleware.entry.ts` in `entry`, but the file does not exist. This is a likely stale config entry.

**Playwright**
- [playwright.config.ts](playwright.config.ts) uses a custom webServer command and a local-baseURL latch. This is intentional, but note it differs from package `dev` script (webpack vs turbopack). Keep consistent if dev/debug depends on one or the other.

## Recommended Plan (no code changes)
1. **Prune or relocate unused scripts** in scripts/ (especially treido audit scripts). Decide whether to archive in docs/ or remove after confirming ownership.
2. **Fix Supabase migration naming** to full 14-digit timestamps and remove duplicate timestamp collisions. Add supabase/config.toml if CLI use is intended.
3. **Deduplicate VS Code tasks** by keeping a single “Unit Tests” task and one “Kill Port 3000” variant.
4. **Normalize MCP config** (document which file is source of truth).
5. **Align Capacitor build output** with Next (either add `output: 'export'` + `next export` or change `webDir`). Also move `server.url` to an env-based dev override.

---

If you want, I can follow up with a cleanup plan and concrete diffs (no changes made in this pass).
