# Refactor — Index

Goal: reduce codebase size + cognitive load (target ~50%) **without behavior changes**.

## Rules

- Follow `AGENTS.md` + `docs/*` rails.
- No rewrites. Refactor in tiny batches (1–3 files).
- Prefer deleting dead code over reorganizing.
- After every batch, run gates (see `AGENTS.md`).

## Files

- `refactor/app.md` — app router audit + refactor checklist
- `refactor/app.files.md` — full `app/` inventory (generated)
- `refactor/components.md` — components audit + refactor checklist
- `refactor/components.files.md` — full `components/` inventory (generated)

## Snapshot (2026-01-28)

- `app/`: 442 files, 80,742 lines, 129 client files
- `components/`: 273 files, 40,866 lines, 162 client files
- Client components overall (`app` + `components` + `lib` + `hooks`): 300 / 793 TS/TSX files (~38%)
- Tailwind drift: palette=235, gradients=18, arbitrary=67 (reports in `cleanup/`)
- Duplication: 321 clones, 3.42% duplicated lines (`pnpm -s dupes`)
- Dead code signal: 28 unused files (`pnpm -s knip`)

## How to Iterate

1. Pick one checkbox from `refactor/app.md` or `refactor/components.md`.
2. Implement the smallest safe change (delete/merge/split) without UI/behavior changes.
3. Run: `pnpm -s typecheck` + `pnpm -s styles:gate` + `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`.
4. Mark the checkbox `[x]` and note what changed.

