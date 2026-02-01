# Audit Output Template (v1)

Use this template for all spec agent audit outputs.

## Template

```md
## <AUDITOR_NAME>

### Scope
- Goal: <1-2 sentence summary>
- Files:
  - <path1>
  - <path2>
- Lines: <ranges or "full file">

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| <AUDITOR>-001 | Critical | <path>:<line> | <what's wrong> | <minimal token-safe fix> |
| <AUDITOR>-002 | High | <path>:<line> | <what's wrong> | <minimal token-safe fix> |

_If no findings, include a single row: `| — | — | — | No findings | — |`_

### Acceptance Checks
- [ ] `pnpm -s typecheck`
- [ ] `pnpm -s lint`
- [ ] `pnpm -s styles:gate`
- [ ] <additional relevant checks>

### Risks
- <dependency or blocker>
- <known tradeoff>
- _If no risks: "None identified"_
```

## Conventions

### Auditor Names
- shadcn: `## SHADCN`
- tailwind: `## TW4`
- nextjs: `## NEXTJS`
- supabase: `## SUPABASE`
- frontend lane: `## FRONTEND`
- backend lane: `## BACKEND`

### Severity Levels
- **Critical**: Security issue, data loss risk, production-breaking
- **High**: Functional bug, significant UX regression
- **Medium**: Code quality, maintainability, minor UX issue
- **Low**: Style consistency, minor optimization

### Finding IDs
- Format: `<AUDITOR>-###` (e.g., `TW4-001`, `SHADCN-002`)
- Sequential, no gaps
- Stable within one audit (same finding = same ID if re-audited)

### Fix Guidelines
- Must be token-safe (no palette colors, no arbitrary values)
- Must respect boundaries (ui vs shared vs route-private)
- Keep minimal (1-2 actions, not full rewrites)
- Example: "Replace `bg-gray-100` with `bg-muted`"
