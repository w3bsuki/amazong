## SHADCN

### Scope
- Goal: Audit components/ui boundary correctness and composition patterns
- Files:
  - components/ui/button.tsx
  - components/ui/card.tsx
  - components/ui/dialog.tsx
- Lines: full file

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | High | components/ui/button.tsx:45 | Button imports from app/actions (boundary violation) | Move action import to consumer or components/shared |
| SHADCN-002 | Medium | components/ui/card.tsx:12 | Uses palette color instead of semantic token | Replace with bg-muted or bg-surface-subtle |
| SHADCN-003 | Low | components/ui/dialog.tsx:78 | Missing asChild on DialogTrigger wrapping custom button | Add asChild prop to preserve button semantics |

### Acceptance Checks
- [ ] `pnpm -s lint`
- [ ] `pnpm -s styles:gate`
- [ ] `pnpm -s typecheck`

### Risks
- First finding requires refactoring consumer components that depend on the action
