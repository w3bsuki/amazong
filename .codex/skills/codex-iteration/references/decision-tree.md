# codex-iteration - Decision Tree (full)

This is the full decision tree for iterating on the agent skill system.

---

## Step 0 - Classify the work

- Small fix (structure/typo/false claim) -> implement directly.
- System change (new contract, new roster, multi-skill rewrite) -> write/update a proposal first, then implement in phases.

---

## Step 1 - Find SSOT and resolve conflicts

SSOT order:
1) `.codex/AGENTS.md`
2) `.codex/WORKFLOW.md`
3) `.codex/project/*` (ARCHITECTURE/DESIGN/etc.)

If a skill contradicts SSOT:
- fix the skill (not SSOT), unless SSOT is clearly outdated and a human requested changes.

---

## Step 2 - Implement in small batches

Rules:
- 1-3 files per batch when possible.
- Prefer updating existing files over adding new ones.
- Keep skills scannable; move deep content to `references/` when needed.

---

## Step 3 - Validate and sync

After every batch:
- `pnpm -s validate:skills`

When the change must be available to Codex user skills:
- `pnpm -s skills:sync`

---

## Step 4 - Finish

Definition of done:
- Validation passes.
- No false claims.
- Output contracts are consistent and usable.

