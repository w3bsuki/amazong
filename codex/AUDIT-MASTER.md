# Master Audit Map (2026-01-19)

## Purpose
Single index to confirm **every folder and file class** in the repo has an audit owner and a destination report. No code changes are made here.

## Audit Coverage Map (All Top-Level Folders)

| Folder | Coverage | Report |
|---|---|---|
| .claude/ | ✅ | [codex/AUDIT-infra-config.md](codex/AUDIT-infra-config.md) |
| .cursor/ | ✅ | [codex/AUDIT-infra-config.md](codex/AUDIT-infra-config.md) |
| .git/ | ✅ (repo metadata, no audit content) | [codex/AUDIT-root-misc.md](codex/AUDIT-root-misc.md) |
| .github/ | ✅ | [codex/AUDIT-infra-config.md](codex/AUDIT-infra-config.md) |
| .mcp.json | ✅ | [codex/AUDIT-infra-config.md](codex/AUDIT-infra-config.md) |
| .next/ | ✅ | [codex/AUDIT-build-artifacts.md](codex/AUDIT-build-artifacts.md) |
| .playwright-mcp/ | ✅ | [codex/AUDIT-build-artifacts.md](codex/AUDIT-build-artifacts.md) |
| .vercel/ | ✅ | [codex/AUDIT-build-artifacts.md](codex/AUDIT-build-artifacts.md) |
| .vscode/ | ✅ | [codex/AUDIT-infra-config.md](codex/AUDIT-infra-config.md) |
| __tests__/ | ✅ | [codex/AUDIT-tests-e2e.md](codex/AUDIT-tests-e2e.md) |
| app/ | ✅ | [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md) |
| cleanup/ | ✅ | [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md) |
| codex/ | ✅ (existing) | [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md) |
| components/ | ✅ | [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md) |
| config/ | ✅ | [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md) |
| docs/ | ✅ | [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md) |
| docs-site/ | ✅ | [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md) |
| e2e/ | ✅ | [codex/AUDIT-tests-e2e.md](codex/AUDIT-tests-e2e.md) |
| GPT+OPUS/ | ✅ | [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md) |
| hooks/ | ✅ | [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md) |
| i18n/ | ✅ | [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md) |
| lib/ | ✅ | [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md) |
| messages/ | ✅ | [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md) |
| node_modules/ | ✅ | [codex/AUDIT-build-artifacts.md](codex/AUDIT-build-artifacts.md) |
| public/ | ✅ | [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md) |
| prompts/ | ✅ | [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md) |
| scripts/ | ✅ | [codex/AUDIT-infra-config.md](codex/AUDIT-infra-config.md) |
| styling/ | ✅ | [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md) |
| supabase/ | ✅ | [codex/AUDIT-infra-config.md](codex/AUDIT-infra-config.md) |
| test/ | ✅ | [codex/AUDIT-tests-e2e.md](codex/AUDIT-tests-e2e.md) |
| test-results/ | ✅ | [codex/AUDIT-tests-e2e.md](codex/AUDIT-tests-e2e.md) |

## Root Files (All Top-Level Files)

Covered by [codex/AUDIT-root-misc.md](codex/AUDIT-root-misc.md) and [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md):

- All *.md/*.txt files in repo root
- All root configs: package.json, tsconfig.json, next.config.ts, eslint.config.mjs, postcss.config.mjs, playwright.config.ts, capacitor.config.ts, knip.json, vitest.config.ts, proxy.ts, next-env.d.ts, tsconfig.tsbuildinfo, pnpm-lock.yaml
- All root tasks/checklists: TODO.md, tasks.md, supabase_tasks.md, AGENT-ORCHESTRATION.md, agents.md

## Output Reports

- Core application: [codex/AUDIT-core-app.md](codex/AUDIT-core-app.md)
- Tests and E2E: [codex/AUDIT-tests-e2e.md](codex/AUDIT-tests-e2e.md)
- Docs/plans consolidation: [codex/AUDIT-docs-plans.md](codex/AUDIT-docs-plans.md)
- Infra/config/scripts: [codex/AUDIT-infra-config.md](codex/AUDIT-infra-config.md)
- Build artifacts: [codex/AUDIT-build-artifacts.md](codex/AUDIT-build-artifacts.md)
- Root misc: [codex/AUDIT-root-misc.md](codex/AUDIT-root-misc.md)

## Notes
- This map is intended as a **coverage proof**: every folder is assigned to an audit file.
- Follow-up work should reference the corresponding report to avoid drift.
