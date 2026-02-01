# Treido Audit Payload Contract (v1)

This contract exists to make **parallel, read-only audits** mergeable by a single orchestrator.

## Rules

- Output must be **Markdown** and **only** the payload section.
- Start with `## <AUDITOR_NAME>` (examples: `## FRONTEND`, `## BACKEND`, `## TW4`, `## SHADCN`, `## NEXTJS`).
- Do **not** patch files. Do **not** edit `.codex/TASKS.md`.
- Avoid secrets/PII (cookies, headers, tokens, emails, addresses).

## Template (copy/paste)

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

- **Severity**: `Critical` | `High` | `Medium` | `Low`
- **File:Line**: workspace-relative path + 1-based line number (example: `app/[locale]/page.tsx:42`)
- **IDs**: stable per audit, monotonic: `<AUDITOR>-001`, `<AUDITOR>-002`, …
- **Fix**: 1–2 short phrases, actionable and Treido-safe (prefer “replace X with token Y”, “remove Z”, “move into <folder>”)

## Mergeability checklist (for auditors)

- [ ] Exactly one top-level section starting with `##`
- [ ] Includes all required headings: Scope / Findings / Acceptance Checks / Risks
- [ ] Findings table rows reference real files
