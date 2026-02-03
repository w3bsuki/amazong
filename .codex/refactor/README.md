# Refactor Workspace (WIP)

This folder is the **methodical, folder-by-folder cleanup plan** for the Treido codebase. It is intentionally verbose and checklist-driven so we can remove ~**50%** of the codebase **without changing behavior**.

Refactor overview (stable): `docs/refactor.md`
Master plan (active): `.codex/refactor/refactor.md`

## Start here

- Progress checklist: `.codex/refactor/TASKS.md`
- Refactor rules for agents + humans: `.codex/refactor/AGENTS.md`
- Target structure (diagram + rules): `.codex/refactor/STRUCTURE.md`
- How to run subagent audits + report format: `.codex/refactor/ORCHESTRATION.md`

## Stack-specific audits (placeholders + checklists)

- Next.js / App Router: `.codex/refactor/nextjs.md`
- shadcn/ui: `.codex/refactor/shadcn.md`
- Tailwind CSS v4: `.codex/refactor/tailwindcssv4.md`
- TypeScript: `.codex/refactor/typescript.md`
- Supabase: `.codex/refactor/supabase.md`

## Folder-by-folder audits (root)

Each root folder gets a dedicated `.md` file in this folder. The goal is to:
1) inventory what exists, 2) decide keep/move/delete, 3) implement a small batch, 4) verify, 5) repeat.

See `.codex/refactor/TASKS.md` for the full list.
