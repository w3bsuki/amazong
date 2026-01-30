# Treido Audit Payload Contract (v1)

This contract makes **parallel, read-only specialist audits** mergeable by a single orchestrator.

## Rules

- Output must be Markdown and **only** the payload section.
- Start with `## <AUDITOR_NAME>` (examples: `## TW4`, `## SHADCN`, `## NEXTJS`).
- Do not patch files. Do not edit `TASKS.md`.
- Avoid secrets/PII (cookies, headers, tokens, emails, addresses).

## Template

```md
## <AUDITOR_NAME>

### Scope
- Files:
  - <path>
- Lines: <optional ranges or "n/a">

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| <AUDITOR>-001 | High | <path>:<line> | <what’s wrong> | <minimal concrete fix> |

### Acceptance Checks
- [ ] <command or observable outcome>

### Risks
- <dependency, blocker, or known tradeoff>
```

## Conventions

- Severity: `Critical` | `High` | `Medium` | `Low`
- File:Line: workspace-relative path + 1-based line number (example: `app/[locale]/page.tsx:42`)
- IDs: `<AUDITOR>-001`, `<AUDITOR>-002`, …

