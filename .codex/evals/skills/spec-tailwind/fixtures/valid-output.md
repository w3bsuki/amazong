## TW4

### Scope
- Goal: Scan for forbidden Tailwind v4 patterns in components
- Files:
  - components/shared/product-card.tsx
  - components/layout/header.tsx
  - app/[locale]/page.tsx
- Lines: full file

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | High | components/shared/product-card.tsx:34 | Uses palette color (forbidden) | Replace with bg-muted |
| TW4-002 | High | components/shared/product-card.tsx:56 | Uses arbitrary value (forbidden) | Replace with text-xs or text-sm |
| TW4-003 | Medium | components/layout/header.tsx:23 | Uses opacity hack on token | Replace with bg-hover or bg-surface-subtle |
| TW4-004 | Low | app/[locale]/page.tsx:89 | Uses hardcoded white (breaks dark mode) | Replace with bg-background |

### Acceptance Checks
- [ ] `pnpm -s styles:gate`
- [ ] `pnpm -s lint`

### Risks
- Second finding may affect visual appearance; verify spacing after change
