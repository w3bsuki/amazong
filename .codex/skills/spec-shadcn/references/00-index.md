# spec-shadcn references (AUDIT-ONLY)

This folder is a deep shadcn/ui + Radix audit playbook aligned with Treido boundaries.

## Read Order (Recommended)

1. `decision-tree.md` - quick decision framework for auditing (start here)
2. `primitives.md` - what belongs in `components/ui/*` vs shared/composites; boundary rules
3. `composition.md` - Radix composition, a11y, portals/overlays, focus management
4. `cva-patterns.md` - CVA patterns, variant ergonomics, and token-safe class composition

## Treido SSOT Links

- `.codex/AGENTS.md` - component boundaries (ui vs shared vs route-private)
- `.codex/project/DESIGN.md` - token meanings and UI conventions

## Audit Output Contract

Return only:
- `.codex/skills/treido-orchestrator/references/audit-payload.md`

Use auditor name `SHADCN` and IDs `SHADCN-001`, `SHADCN-002`, ...

