# Orchestration (Subagent audits)

This document defines how we run “full-audit” passes using subagents, and how we capture results in a way that leads directly to **deletions + consolidation** (not theory).

## Output contract (what every subagent must produce)

For the assigned scope (folder or stack), return a markdown report with:

- **Inventory**: key subfolders/files + what they do
- **Duplication signals**: repeated patterns/files/components (name the clusters)
- **Boundary violations**: server/client leaks, `components/ui` leaks, route-private leaks
- **Delete candidates** (highest ROI first):
  - itemized list with evidence (imports/usage/search results)
  - suggested replacement target (if any)
- **Quick wins**: 1–3 smallest safe changes we can ship first
- **Verification**: minimal commands to prove no regression

## Prompt template (folder audit)

Copy/paste and fill `<FOLDER>`:

```text
You are auditing the Treido codebase for a 50% code reduction WITHOUT behavior changes.

Scope: <FOLDER> (root folder)

Tasks:
1) Explain what belongs in this folder (ideal state).
2) Inventory current contents: list key subfolders/files and purpose.
3) Identify delete/move/merge candidates with evidence.
4) Identify boundary violations relevant to our stack (Next.js 16 App Router, RSC vs client, shadcn/ui, Tailwind v4 tokens, next-intl, Supabase patterns).
5) Propose the smallest safe refactor batch (moves/deletes only) and verification commands.

Output: a concise markdown report with sections: Inventory, Findings, Delete, Move/Merge, Risks, Verify.
```

## Prompt template (stack audit)

Copy/paste and fill `<STACK_AREA>`:

```text
You are auditing the Treido codebase for best practices and massive dedupe.

Stack area: <STACK_AREA>

Tasks:
1) List the hard rules for this stack in Treido (what is forbidden).
2) Identify the most common violation patterns and where to look for them.
3) Provide a checklist for auditing + refactoring safely.
4) Provide 3 "delete/dedupe first" refactor patterns with examples of what to search for.
5) Provide a verification checklist (commands + what to look for in output).

Output: markdown checklist + refactor playbook. No code changes.
```

## How we run this (suggested order)

1) Run stack audits first (`.codex/refactor/*.md` in this folder) so we agree on rules.
2) Then go root-folder-by-root-folder using the folder `.md` files.
3) Only after the above, do deeper subfolder splits (e.g. `app/`, `components/`, `lib/`).
