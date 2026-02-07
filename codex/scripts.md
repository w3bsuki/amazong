# Task: Scripts & Tooling Audit

> **Read `codex/AGENTS.md` first.** It contains the project context, folder map, non-negotiables, and verification gates.

## Objective

Clean up the `scripts/` folder. Delete one-off audit/screenshot scripts that were used for past investigations and are no longer needed. Verify all `package.json` scripts reference files that still exist. Remove dead script entries. Consolidate overlapping scripts.

---

## Phase 1: Script Inventory & Classification

### 1.1 Classify Every Script

Read each file in `scripts/` and categorize it:

**ESSENTIAL (keep):**
These are build, test, and CI scripts that the project depends on daily.
- `next-build.mjs` — Custom build script (referenced by `pnpm build`)
- `run-playwright.mjs` — Playwright test runner (referenced by E2E scripts)
- `playwright-web-server.mjs` — Web server for Playwright tests
- `clean-artifacts.mjs` — Clean build artifacts
- `clear-next-dev-lock.mjs` — Development utility
- `ts-safety-gate.mjs` — TypeScript safety gate (referenced by `pnpm ts:gate`)
- `ts-safety-gate.baseline.json` — Baseline for TS gate

**SCANNING/LINTING (keep if styles:gate uses them):**
- `scan-tailwind-palette.mjs` — Palette scanner
- `scan-tailwind-arbitrary.mjs` — Arbitrary value scanner
- `scan-tailwind-semantic-tokens.mjs` — Semantic token scanner
- `scan-tailwind-token-alpha.mjs` — Token alpha scanner
- `scan-mobile-chrome-consistency.mjs` — Mobile consistency scanner

Verify each is referenced by `pnpm -s styles:scan` and `pnpm -s styles:gate`. Keep if yes.

**DOCS/AGENTS (keep if docs system is active):**
- `docs-gate.mjs` — Docs validation gate
- `sync-docs-site.mjs` — Sync docs to docs-site
- `check-docs-site.mjs` — Check docs-site
- `build-launch-readiness.mjs` — Launch readiness dashboard
- `validate-launch-readiness.mjs` — Launch readiness validation
- `sync-agent-skills.mjs` — Sync skills across agent folders
- `validate-agent-skills.mjs` — Validate agent skills
- `generate-skills-doc.mjs` — Generate skills documentation
- `seed-admin-docs.mjs` — Seed admin docs content
- `export-admin-docs.mjs` — Export admin docs

Check if these are referenced by `package.json` scripts. If referenced and functional, keep. If not referenced, delete.

**ONE-OFF AUDIT SCRIPTS (likely deletable):**
- `audit-treido.mjs` — Past audit script. Read it. If it's a one-time codebase scan, delete.
- `audit-treido-v2.mjs` — V2 of the audit. Almost certainly deletable.
- `pdp-screenshots.mjs` — Product page screenshot tool. Past audit artifact. Delete unless actively used.
- `ux-audit-screenshot.mjs` — UX audit screenshots. Past audit artifact. Delete.
- `ux-audit-snapshots.mjs` — UX audit snapshots. Past audit artifact. Delete.
- `probe-runtime.mjs` — Runtime probe. Past debugging tool. Delete unless actively used.
- `test-supabase-join.mjs` — Supabase join test. Past debugging tool. Delete.
- `create-e2e-user.mjs` — E2E user creation. Check if E2E tests reference it. If not, delete.
- `verify-e2e-login.mjs` — E2E login verification. Check if E2E tests reference it. If not, delete.

### 1.2 Audit `scripts/mcp/`

Read the contents of this subfolder. If it contains MCP (Model Context Protocol) server tooling for AI agents, evaluate:
- Is it actively used? Check for references.
- Is it development-only tooling? If so, keep or delete based on current relevance.

### 1.3 Audit `scripts/prod/`

Read the contents of this subfolder. If it contains production deployment scripts:
- Verify they're current and functional.
- Delete stale deployment scripts for deprecated infrastructure.

---

## Phase 2: `package.json` Script Audit

### 2.1 Verify Every Script References Existing Files

Read `package.json` `scripts` section and verify each script's command:

```bash
# For each script that references a file, verify it exists
node -e "const p = require('./package.json'); Object.entries(p.scripts).forEach(([k,v]) => { const m = v.match(/scripts\/[\w.-]+/g); if (m) m.forEach(f => { try { require('fs').accessSync(f); } catch { console.log('DEAD: ' + k + ' -> ' + f); } }); })"
```

Delete `package.json` script entries that reference deleted scripts.

### 2.2 Remove Redundant Scripts

Look for scripts that are aliases or near-duplicates:
- `docs:sync` vs `docs:site:sync` — These may do the same thing. Check.
- `clean:artifacts` vs `clean:next` vs `clean` — Are all three needed?
- `test:e2e` vs `test:e2e:smoke` vs `test:e2e:all` vs `test:e2e:headed` — These are legitimate test scope variants. Keep.
- `cap:build` / `cap:android` / `cap:ios` / `cap:sync` — Capacitor mobile build scripts. Check if Capacitor is actively used. If not, these are dead weight (flag for human decision — don't remove without confirmation).
- `storybook` / `storybook:build` — Verify Storybook is actively used. If all stories are deleted by `shadcn.md` task, these become dead. Flag but don't remove without confirmation.

### 2.3 Simplify Script Chains

Some scripts chain multiple commands. Verify the chains are correct:
- `test` = `pnpm test:unit && pnpm test:e2e:smoke` — Correct chain.
- `test:all` = `pnpm -s lint && pnpm -s ts:gate && pnpm -s typecheck && pnpm -s test:unit && pnpm -s test:e2e && pnpm -s test:a11y` — Correct comprehensive chain.
- `test:full` = `pnpm -s lint && pnpm -s typecheck && pnpm -s test:unit && pnpm -s test:prod` — Correct.
- `docs:check` — Complex chain. Verify all sub-commands work.

---

## Phase 3: Configuration File Audit

### 3.1 `eslint.config.mjs`

Read it. Verify:
- All referenced plugins are installed (`eslint-plugin-sonarjs`, `eslint-plugin-unicorn`, `eslint-config-next`)
- No rules reference deleted files or patterns
- Ignore patterns are minimal and correct

### 3.2 `knip.json`

Verify:
- `entry` paths reference files that exist
- `ignore` patterns reference folders that exist (e.g., `.codex/skills/**` may reference the old `.codex/` — update if deleted by `dead-code.md`)
- `ignoreDependencies` list is minimal

### 3.3 `vitest.config.ts`

Read it. Verify:
- Test patterns match the actual test file locations
- No references to deleted test files or folders

### 3.4 `playwright.config.ts`

Read it. Verify:
- Test patterns match the actual E2E test file locations
- Web server configuration is correct
- No references to deleted E2E files

### 3.5 `postcss.config.mjs`

Read it. Should be minimal for Tailwind v4:
```javascript
export default { plugins: { '@tailwindcss/postcss': {} } };
```

Remove any unnecessary PostCSS plugins.

### 3.6 `capacitor.config.ts`

Check if Capacitor is actively used. If not, flag for human decision (whether to remove Capacitor entirely).

---

## Phase 4: Docs-Site Audit

### 4.1 `docs-site/` Folder

This is a separate Next.js project for documentation. Check:
1. Does it build? `cd docs-site && pnpm build`
2. Is it actively maintained?
3. Does it have its own `node_modules/` committed? (It shouldn't.)
4. Is `.next/` committed? (It shouldn't be — check `.gitignore`.)

If the docs-site is abandoned, flag for human decision on removal. Don't delete without confirmation.

---

## Phase 5: Post-Cleanup Validation

After deleting scripts and updating `package.json`:

### 5.1 Verify All Remaining Scripts Work

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
pnpm -s knip
pnpm -s ts:gate
```

### 5.2 Verify No Broken References

```bash
grep -rn "scripts/" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.mjs" . | grep -v node_modules | grep -v .next
```

Check that no remaining code references deleted scripts.

---

## Verification

```bash
pnpm -s typecheck
pnpm -s lint
```

Run each remaining `package.json` script individually to verify it works.

---

## Completion Criteria

- No one-off audit/screenshot scripts in `scripts/` (only essential build/test/CI/scan scripts remain)
- Every `package.json` script references files that exist
- No redundant/duplicate script entries
- All configuration files (`eslint`, `knip`, `vitest`, `playwright`, `postcss`) reference valid paths
- `scripts/mcp/` and `scripts/prod/` audited and cleaned
- All gates pass
