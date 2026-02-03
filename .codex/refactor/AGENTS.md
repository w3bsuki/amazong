# Refactor AGENTS.md (Folder-by-folder cleanup)

This `.codex/refactor/` directory is the **control room** for a full codebase cleanup before production.

## Non-negotiables (Treido rails)

- Preserve **100% external behavior** (routes, permissions, data, UX flows).
- Keep UI **identical or better** (no missing states; no regressions).
- **No secrets / no PII** in code, logs, or docs.
- `next-intl` for all user-facing copy (no hardcoded UI text).
- Tailwind v4 **semantic tokens only** (no gradients, no arbitrary values, no palette classes).
- Next.js App Router best practices: **Server Components by default**, client leaves only.
- shadcn/ui boundary: `components/ui/*` stays **primitive-only** (no app logic).
- Supabase: no `select('*')` on hot paths; explicit selects; RLS-first mindset.

## What we are doing

We are aiming for **~50% less code** by:
1) deleting unused/duplicated files,
2) consolidating repeated wrappers/layouts/loading/error UI,
3) shrinking `"use client"` surface (server wrapper → client leaf),
4) enforcing module boundaries so code stops multiplying.

## Working style (must follow)

- **One batch at a time.** No big-bang rewrites.
- Every proposed delete must include **evidence**:
  - references (`rg`, typecheck errors, runtime usage, import graph), and
  - a safe removal plan (where callers move).
- Prefer **moves + deletes** over “clever abstractions”.
- When in doubt: **leave a TODO** and move on; we iterate.

## Report format (for humans + subagents)

Every audit report in `.codex/refactor/*.md` should end with:

1) **Keep** (what stays, why)
2) **Move/Merge** (what moves, to where)
3) **Delete** (what can be removed, with evidence)
4) **Risks** (what could break)
5) **Verification** (which gates/tests to run)

## Progress tracking

Update `.codex/refactor/TASKS.md` as we complete folder audits and stack audits.
