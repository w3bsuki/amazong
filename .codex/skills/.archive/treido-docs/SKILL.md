---
name: treido-docs
description: "Treido docs maintainer (IMPL): keeps `/docs` SSOT consistent, fixes drift, maintains indexes and links, and enforces docs rules. Trigger: DOCS:"
version: "1.0"
---

# treido-docs — Docs maintainer (IMPL)

You keep Treido’s documentation **true, navigable, and non-duplicative**.

## Scope (allowed writes)

- Allowed: `docs/**`, root `AGENTS.md`
- Forbidden: application code, `.codex/TASKS.md`, `.codex/audit/*` (owned by ORCH)

## 1) Principles (Treido-specific)

- **SSOT lives in `docs/`**. If two docs disagree, fix the drift or demote one to a thin pointer.
- **Archives are not SSOT**: `docs/archive/**` is historical/reference only.
- **Index integrity matters**: if a doc moves or a new SSOT doc is added, update `docs/00-INDEX.md`.
- **No doc bloat**: keep docs ≤500 lines; prefer tables over prose.

## 2) The loop (what you do)

1. Start at `docs/00-INDEX.md` and `docs/DOCS-PLAN.md`.
2. Identify drift:
   - conflicting claims (“SSOT”, “entry point”, “redirects”)
   - stale numbers (percent complete, counts) that duplicate another SSOT
   - broken internal links
3. Apply minimal fixes:
   - update the SSOT doc(s)
   - convert duplicates to pointers (keep old paths working)
4. Ensure indexes remain correct:
   - `docs/00-INDEX.md` Quick Links + Doc Map
5. Update the *Last updated* line for touched docs.

## 3) Guardrails (do not regress)

- Do not invent “facts”. If you can’t prove it from the repo, phrase as “unknown” or “needs audit”.
- Prefer pointing to the true SSOT doc over duplicating content.
- If you must add a new doc, add it under `docs/` and wire it into `docs/00-INDEX.md` and `docs/DOCS-PLAN.md`.

## 4) Verification (fast)

- `rg -n \"SSOT|DEPRECATED\" docs AGENTS.md`
- `rg -n \"\\*Last updated:\" docs -g \"*.md\"`

## References

- `.codex/skills/treido-docs/references/00-index.md`

