# AGENTS.md

Project-level router for humans and AI agents.

## Canonical Sources

- Docs SSOT: `docs/INDEX.md`
- Agent rails and boundaries: `docs/AGENTS.md`
- Workflow and gates: `docs/WORKFLOW.md`
- Skill inventory: `docs/SKILLS.md`
- Skill routing table: `docs/AGENT-MAP.md`

## Runtime State

- Active queue: `.codex/TASKS.md`
- Decisions: `.codex/DECISIONS.md`
- Shipped log: `.codex/SHIPPED.md`

## Skill Source of Truth

- Canonical authored skills: `.codex/skills/*`
- `.claude/skills/*` is a mirror target, not an independent source.

## Non-Negotiables (Minimal)

- No secrets or PII in logs.
- All user-facing copy via `next-intl`.
- Tailwind v4 semantic tokens only.
- Default to Server Components; use client components only when required.
- Pause and request approval for DB/auth/payments/destructive operations.

## Folder Policy

Allowed AI config folders in this repo:

- `.codex/`
- `.claude/`

Do not create other AI tool folders (`.agent`, `.agents`, `.cursor`, `.gemini`, `.kiro`, `.qoder`, `.qwen`, `.trae`, `.windsurf`).

## docs-site Policy

- `docs-site/` is internal browsing UI only.
- Authoring SSOT remains in `docs/**`.
- Keep generated artifacts (for example `docs-site/public/_pagefind`) out of git tracking.

---

*Last updated: 2026-02-06*
