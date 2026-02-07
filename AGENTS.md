# AGENTS.md

Canonical Treido contract for humans and AI agents.

## Default execution mode

- Implement directly for normal tasks (UI, styling, refactoring, tests, docs).
- Main agent owns planning, decisions, and code edits.
- Do not require skill-routing chains before coding.
- Use skills only when requested or when specialist knowledge is required.
- Do not use subagents by default. Use subagents only when the user explicitly asks (e.g. `run subagents`), and keep them audit/read-only unless the user explicitly asks for delegated code edits.

## Non-negotiables (SSOT)

- No secrets or PII in logs.
- All user-facing copy via `next-intl`.
- Tailwind v4 semantic tokens only (no palette classes, gradients, arbitrary values, hardcoded colors).
- Default to Server Components; use Client Components only when required.
- Pause and request approval for DB/auth/payments/destructive operations.

## Skills policy

- Canonical skills live in `.claude/skills/*`.
- Codex compatibility lives in `.agents/skills/*` (mirror of canonical skills).
- `.codex/skills/*` and `.codex/agents/*` are legacy and not part of runtime instructions.
- Active consolidated skills:
  - `treido-styling`
  - `treido-design`
  - `treido-nextjs`
  - `treido-data`
  - `treido-payments`
  - `treido-testing`
  - `treido-a11y`

## Pointers (read when needed)

- Boundaries and output contract: `docs/AGENTS.md`
- Workflow and verification: `docs/WORKFLOW.md`
- Skill index: `docs/SKILLS.md`
- Optional specialist map (reference only): `docs/AGENT-MAP.md`

## Folder policy

Allowed AI config folders: `.claude/`, `.agents/`, `.codex/` (legacy archive only).

Do not create: `.agent`, `.cursor`, `.gemini`, `.kiro`, `.qoder`, `.qwen`, `.trae`, `.windsurf`.

---

*Last updated: 2026-02-07*
