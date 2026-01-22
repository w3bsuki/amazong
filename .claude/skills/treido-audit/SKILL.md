---
name: treido-audit
description: Audit/checklist skill for Treido (security, perf, i18n, UI consistency, docs drift). Triggers on "AUDIT:" prefix or when asked to review/scan for issues.
version: 1.0.0
---

# Treido Audit

## On Any "AUDIT:" Prompt

1. Define the audit scope (files/feature/area) and the "lane" (backend/frontend/supabase/testing/docs).
2. Run targeted scans (grep/ripgrep) and review diffs with a bias for small fixes.
3. If the scope touches Supabase, run `supabase-audit` (`SUPABASE:`).
4. If the scope touches Tailwind/theme/styling rules, run `tailwind-audit` (`TAILWIND:`).
5. Report findings in the format below; propose fixes in batches (1-3 files).

## Output Format

```markdown
## Treido Audit - {date}

### Critical (blocks release)
- [ ] Issue → File/Area → Fix

### High (next sprint)
- [ ] Issue → File/Area → Fix

### Deferred (backlog)
- [ ] Issue → File/Area → Fix
```

## Examples

### Example prompt
`AUDIT: scan seller pages for i18n and tailwind drift`

### Expected behavior
- Define scope, run targeted scans, and report findings using the output format.
- Propose fixes in small batches.

## Quick Checks (examples)

- Secrets/logs: `console.log(`, leaking headers/cookies/tokens
- i18n: user strings not in `messages/en.json` + `messages/bg.json`
- Tailwind: gradients / arbitrary values
- Backend: `select('*')`, missing field projection
