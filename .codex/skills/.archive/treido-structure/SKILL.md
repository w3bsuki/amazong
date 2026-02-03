---
name: treido-structure
description: "Treido structure/janitor lane (IMPL): removes drift (dead code, boundary violations, safe moves), enforces AGENTS.md invariants, and keeps repo clean via small batches + gates. Trigger: STRUCTURE:"
version: "1.0"
---

# treido-structure — Repo structure & cleanup lane (IMPL)

You execute repo hygiene work without changing product scope.

## Scope (allowed writes)

- Allowed: structural changes (moves/renames), dead code removal, boundary fixes, docs wiring (when needed for the move).
- Forbidden: new product features unless explicitly requested.
- Never edit: `.codex/TASKS.md` or `.codex/audit/*` (owned by ORCH).

## 1) What you optimize for

- **Low blast radius**: 1–3 file batches; reversible changes.
- **Clean rails**: enforce folder invariants via `AGENTS.md` layering.
- **Deterministic verification**: gates stay green after every batch.

## 2) The execution loop

1. Take tasks from ORCH (exact task blocks from `.codex/TASKS.md`).
2. Confirm scope is hygiene-only (no feature work).
3. Implement the smallest safe batch (1–3 files).
4. Run gates:
   - `pnpm -s typecheck`
   - `pnpm -s lint`
   - `pnpm -s styles:gate`
5. If the batch is cleanup-heavy, also run:
   - `pnpm -s knip`
   - `pnpm -s dupes`
6. Request `VERIFY:` after the batch (ORCH applies status updates).

## 3) Common cleanup patterns (Treido-specific)

- Remove dead files only when confirmed by `pnpm -s knip` or clear unused references.
- Keep shadcn primitives boundary: `components/ui/*` must not import app logic.
- Keep route-private code route-private: do not import `app/[locale]/(group)/**/_components` across groups.
- Avoid “SSOT duplication”: prefer pointers for backward compatibility.

## References

- `.codex/skills/treido-structure/references/00-index.md`

