# spec-tailwind references (AUDIT-ONLY)

This folder is a deep Tailwind v4 audit playbook aligned to Treido's design system.

## Read Order (Recommended)

1. `decision-tree.md` - quick decision framework for auditing (start here)
2. `v4-tokens.md` - how semantic tokens work (where they live, how to validate)
3. `forbidden-patterns.md` - gradients/arbitrary/palette colors and how to detect them
4. `treido-tokens.md` - Treido-specific surface/interactive/touch token guidance

## Treido SSOT Links

- `.codex/project/DESIGN.md` - design system SSOT (forbidden patterns + token meanings)
- `app/globals.css` - token definitions (`--color-*`) and theme mapping

## Audit Output Contract

Return only:
- `.codex/skills/treido-orchestrator/references/audit-payload.md`

Use auditor name `TW4` and IDs `TW4-001`, `TW4-002`, ...

