# i18n, Testing, And Quality Gates Audit

## Scope

- `i18n/*`
- `messages/en.json`
- `messages/bg.json`
- `__tests__/*`
- `e2e/*`
- gate scripts in `scripts/*` and related package scripts

## Current State Summary

- Baseline parity checks exist for translations.
- Test and gate ecosystem is strong but has duplicated setup and sequential scan overhead.

## Findings

## P0

- Repeated fetch mock and boilerplate patterns across hook tests.
- Repeated hydration/retry patterns in E2E flows (especially auth) indicate avoidable test fragility.
- Style gate scans run as separate scripts with duplicated internals.

## P1

- Message files are large monoliths (`messages/en.json`, `messages/bg.json`) with high maintenance cost.
- Current parity checks do not inherently catch unused key sprawl or naming drift.

## P2

- Baseline-driven gates are effective but heavy for frequent localized refactors.

## Simplification Targets

1. Create shared Vitest fixtures for fetch/data setup.
2. Standardize Playwright hydration helpers in one fixture utility.
3. Introduce message key usage checks (unused/duplicate) in addition to parity.
4. Consolidate scanner/gate infrastructure where possible.

## Success Criteria

- Less per-test boilerplate.
- More stable E2E runs with fewer repeated retries.
- Better translation key hygiene without weakening parity enforcement.
- Faster, clearer quality gate maintenance.
