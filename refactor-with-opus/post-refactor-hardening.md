# Post-Refactor Hardening (Safe-Only)

Created: 2026-02-20

> Follow-up work after `refactor-with-opus/tasks.md` Tasks #1–#10 are DONE.
> Hard constraints: **no UI/pixel/UX changes**, and **no DB/auth/payments/webhooks changes**.

## Checklist

- [x] **H01 — Test lint noise cleanup:** Reduce ESLint warning noise in `__tests__/` + `e2e/` (unused vars/imports, `unicorn/no-useless-undefined`, test-only rule disables where appropriate). **No assertion changes.** (DONE 2026-02-20 — lint warnings 213→190; gates PASS)
- [x] **H02 — Program doc integrity:** Restore `refactor-with-opus` link integrity (task files referenced by `refactor-with-opus/tasks.md` exist; README file map accurate). Docs-only. (DONE 2026-02-20 — restored missing task file link targets)
- [x] **H03 — Automate integrity check:** Add a small script to validate `refactor-with-opus` link targets and wire it into `pnpm -s refactor:verify` (docs+scripts only). (DONE 2026-02-20 — added `refactor:links:gate` to prevent link rot)
- [ ] **H04 — Config/script lint hygiene:** Fix low-risk ESLint warnings in configs/scripts (e.g. `playwright.config.ts`, `proxy.ts`, `scripts/**`) excluding any auth/payments/db-related surfaces.
- [ ] **H05 — Dead export cleanup (proven):** Remove dead exports/functions in non-sensitive shared modules **only** after `rg` proves zero usage (no Next.js magic file deletions).
- [ ] **H06 — Test stderr ergonomics:** Reduce known-benign React/Vitest stderr noise (prop warnings, expected error logs) by tightening test mocks/spies. **No assertion changes.**
- [ ] **H07 — Metrics clarity:** Document what `pnpm -s architecture:scan` metrics mean (especially `missingLoading`) to prevent confusion across sessions. Docs-only.
- [ ] **H08 — Quick verify alias:** Add `pnpm -s verify:quick` to run the core fast gates (typecheck + lint + styles:gate + test:unit). No behavior changes.
