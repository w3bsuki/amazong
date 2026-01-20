# Dependencies Audit — 2026-01-20

This audit covers: unused deps signals, upgrade pressure, and security advisories.

## Snapshot

- `package.json` counts:
  - dependencies: 57
  - devDependencies: 30
  - scripts: 44
- Outdated packages: 55 (39 deps, 16 devDeps) — full list: `codex-xhigh/logs/2026-01-20-pnpm-outdated.json`

## Security advisories (pnpm audit)

Evidence: `codex-xhigh/logs/2026-01-20-pnpm-audit.json`

- Advisories: 6
  - High: 3
  - Moderate: 2
  - Low: 1

Notable high/moderate advisories:

- `next` (high/moderate): vulnerabilities affecting Server Components / Server Actions
  - Affected: `>=16.0.0-beta.0 <16.0.9`
  - Current: `16.0.7` (affected)
  - Fix: upgrade `next` to `>=16.0.9` (recommended: latest `16.1.x`)
- `qs` (high): DoS via memory exhaustion
  - Fix: upgrade `qs` to `>=6.14.1` (likely via transitive update)
- `tar` (high): path sanitization issue
  - Fix: upgrade `tar` to `>=7.5.3` (likely via transitive update)
- `esbuild` (moderate): dev server request/response exposure
  - Fix: upgrade `esbuild` to `>=0.25.0` (via tooling deps)
- `tmp` (low): symlink write via `dir` param
  - Fix: upgrade `tmp` to `>=0.2.4`

## Unused dependencies (signals)

Evidence: `codex-xhigh/typescript/knip-2026-01-20.log`

- Knip flagged as unused:
  - `@capacitor/android`
  - `@capacitor/core`

Decision: **keep** if mobile app is planned soon, but document the intent and (optionally) add Knip ignore config so this doesn’t block future cleanup.

## Findings (prioritized)

### Critical

- [ ] Upgrade `next` to a patched version (>=16.0.9). Current `16.0.7` is in the vulnerable range per `pnpm audit`.

### High

- [ ] Apply transitive upgrades for `qs`, `tar`, `esbuild`, `tmp` (via `pnpm up` / lockfile refresh) and re-run gates.

### Medium

- [ ] Decide policy for “intentionally unused but planned” deps (Capacitor): keep + document vs remove now and re-add later.
