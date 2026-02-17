# Codex Audit Workspace

Last updated: 2026-02-17

This folder is a full-codebase audit pack for Treido refactor planning. It is documentation-only and is designed to be used as progressive working memory across sessions.

## What This Contains

- `00-baseline-metrics.md`: measurable complexity baseline.
- `01-authentication-onboarding.md`: auth and onboarding audit.
- `02-main-marketplace-public-profile.md`: discovery, main feed, public profile audit.
- `03-sell-domain.md`: sell flow and listing pipeline audit.
- `04-account-chat-admin.md`: account/chat/admin audit.
- `05-checkout-payments-business-plans.md`: checkout, payments, business, plans audit.
- `06-data-lib-actions-api.md`: backend/shared data architecture audit.
- `07-design-system-styling.md`: styling system and gate script audit.
- `08-i18n-testing-quality.md`: i18n/testing/quality-gates audit.
- `09-refactor-roadmap-50pct.md`: phased execution plan targeting ~50% complexity reduction.
- `10-agent-playbook.md`: subagent orchestration workflow for future audit passes.
- `TODO.md`: prioritized execution board.

## How To Use

1. Read `00-baseline-metrics.md`.
2. Pick one domain file and implement only its P0/P1 tasks.
3. After each refactor batch, rerun the baseline commands and update metrics docs.
4. Keep `TODO.md` and `09-refactor-roadmap-50pct.md` synchronized with actual progress.

## Global Guardrails

- Preserve runtime behavior and feature parity.
- Pause and request human approval for any auth, payments/webhook, DB schema, or RLS-sensitive change.
- Maintain semantic token discipline and route-boundary rules.
- Run required checks from `AGENTS.md` after each implementation batch.
