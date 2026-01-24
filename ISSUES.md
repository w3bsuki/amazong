# Issues (SSOT)

This is the single place we register user-reported problems and audit requests.

## Status legend

- `[ ] Open` — reported, not started
- `[~] In progress`
- `[x] Done` — verified and/or gated

## Template

```md
## ISSUE-0000 — <short title> (<YYYY-MM-DD>)

Status: [ ] Open / [~] In progress / [x] Done

Summary:
- Expected:
- Actual:

Repro (if applicable):
1.
2.

Scope:
- In scope:
- Out of scope:

Acceptance:
- [ ] <measurable requirement>

Linked tasks:
- See `TASKS.md` (search for ISSUE-0000)
```

---

## ISSUE-0001 — Consolidate docs + workflow (2026-01-23)

Status: [x] Done

Summary:
- Expected: A simple, trackable “Issues → Tasks → Verify” workflow with a small set of canonical docs.
- Actual: Documentation and audit notes are spread across many folders/files.

Acceptance:
- [x] Canonical workflow docs exist in repo root.
- [x] Legacy markdown is consolidated under `docs-final/` and root references updated.

Linked tasks:
- See `TASKS.md` (search for ISSUE-0001)

---

## ISSUE-0002 — Production finalization + codebase reduction (2026-01-23)

Status: [~] In progress

Summary:
- Expected: Production-ready app with tight gates and minimal tech debt.
- Actual: Codebase contains bloat/dead code and needs a lane-by-lane audit before release.

Scope:
- In scope:
  - Removing dead/unused code, exports, and dependencies
  - Hardening Next.js/Supabase/Stripe flows for production safety
  - Improving verification (gates + targeted Playwright coverage)
- Out of scope:
  - Major redesigns or feature rewrites

Acceptance:
- [ ] `pnpm -s test:all` passes locally (or documented, agreed exceptions).
- [ ] `pnpm -s styles:gate` passes (no gradients/arbitrary drift).
- [ ] `pnpm -s knip` has no unused files/exports/deps (or documented, intentional ignores).
- [ ] Supabase security/performance advisors are clean (or documented exceptions).
- [ ] Playwright smoke passes against staging + production after go-live.

Linked tasks:
- See `TASKS.md` (search for ISSUE-0002)
