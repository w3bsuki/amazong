# Hardening H03 — Automate `refactor-with-opus` Link Integrity Check (Safe-Only)

Date: 2026-02-20

## Goal

Prevent future link rot in the `refactor-with-opus/` program by adding a small verifier that checks referenced `refactor/*.md` files exist, and wiring it into `pnpm -s refactor:verify`.

## Hard Constraints

- Scripts/docs only (no runtime behavior, no UI changes).
- No DB/migrations/RLS changes.
- No auth/session logic changes.
- No payments/webhooks changes.

## Phase 1 — Audit (NO code changes)

1. Enumerate all `refactor/*.md` paths referenced by:
   - `refactor-with-opus/tasks.md`
   - `refactor-with-opus/README.md`
2. Confirm current state is clean (no missing paths).

### Audit Findings (2026-02-20)

- Current state is clean: **10** referenced `refactor/*.md` link targets exist (no missing paths).

## Phase 2 — Plan

- Add `scripts/verify-refactor-with-opus-links.mjs`:
  - Extract referenced `refactor/*.md` links from the two source files.
  - Fail with a clear message if any targets are missing.
- Add `pnpm -s refactor:links:gate` script and include it in `pnpm -s refactor:verify`.

## Phase 3 — Execute

After the batch, run:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

## Phase 4 — Report

1. Record new script + what it checks.
2. Run `pnpm -s architecture:scan`.
3. Check off **H03** in `refactor-with-opus/post-refactor-hardening.md` with date + 1-line summary.

---

## Execution (Completed 2026-02-20)

- Added `scripts/verify-refactor-with-opus-links.mjs` to validate `refactor/*.md` link targets referenced by:
  - `refactor-with-opus/tasks.md`
  - `refactor-with-opus/README.md`
- Added `refactor:links:gate` and wired it into `refactor:verify` in `package.json`.

## Verification

- `pnpm -s refactor:verify` — PASS (prints `[refactor-with-opus] OK: …`)
- `pnpm -s architecture:scan` — PASS (metrics unchanged)
