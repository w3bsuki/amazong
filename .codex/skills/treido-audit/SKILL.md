---
name: treido-audit
description: Treido audit/review (security/PII, i18n/next-intl, Tailwind v4 rails, caching rules, Supabase hot paths, Stripe webhooks). Use for review/scan after changes; triggers on "AUDIT:" prefix.
deprecated: true
---

# Treido Audit (Read-Only)

> Deprecated (2026-01-29). Use `treido-orchestrator` (bundle-based) + specialist auditors `treido-audit-*`, then validate with `treido-verify`.

## Workflow (on any `AUDIT:` request)

1. Define scope (files/feature) and lanes touched (frontend/backend/supabase).
2. Review diffs first (`git diff`) and scan for rail violations:
   - secrets/PII in logs
   - hardcoded user-facing strings (missing `next-intl`)
   - Tailwind drift (gradients/arbitrary values/palette colors)
   - cached-server rule violations (`cookies()`/`headers()` inside cached functions)
   - Supabase hot paths (`select('*')`, missing projection/pagination)
   - Stripe webhooks (signature verification + idempotency)
3. Run gates:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

4. If Supabase changes are involved, confirm:
   - migrations used (no ad-hoc DDL)
   - advisors run (`security`, `performance`)
   - types regenerated
5. Output findings in the format below; propose fixes as 1-3 file batches.

## Output format

```md
## Treido Audit - YYYY-MM-DD

### Critical (blocks release)
- [ ] Issue -> file:line -> fix

### High (should fix)
- [ ] Issue -> file:line -> fix

### Notes (nice-to-have)
- [ ] Item
```

## Quick scan commands (optional)

```bash
# obvious logging risks
rg -n '\\b(console\\.log|console\\.debug|console\\.info)\\b' app components lib

# i18n drift (rough heuristic)
rg -n '\\b([A-Z][a-z]+ ){2,}' app components --glob '*.tsx'

# cached-server hazards
rg -n "'use cache'|\\b(cookies|headers)\\(" app lib --glob '*.ts' --glob '*.tsx'

# Supabase select('*')
rg -n 'select\\(\\s*\\*\\s*\\)' app lib --glob '*.ts' --glob '*.tsx'
```
