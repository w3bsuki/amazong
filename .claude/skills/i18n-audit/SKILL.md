---
name: i18n-audit
description: next-intl audit for this repo (no hardcoded strings, locale routing correctness, messages parity). Triggers on "I18N:" prefix and i18n cleanup work.
version: 1.0.0
---

# i18n Audit (next-intl)

Use this skill to keep i18n correct and enforce repo rails: no hardcoded user-facing strings and en/bg key parity.

## Entry Criteria (ask if missing)

- Scope: route(s) / component(s) / recent diff
- Goal: add strings, fix routing, or parity cleanup

## On Any "I18N:" Prompt

1. Load canonical rules:
   - `docs/FRONTEND.md`
   - `docs/ENGINEERING.md`
2. Scan for common drift:
   - Hardcoded user strings (including `aria-*` and `sr-only`).
   - Inline locale branching (`locale === 'bg'`) instead of `next-intl`.
   - Using `next/navigation` in locale-scoped routes where `@/i18n/routing` is expected.
3. Enforce messages parity:
   - Any new key must exist in both `messages/en.json` and `messages/bg.json`.
4. Output findings with file paths and propose fixes in small batches.

## Helpful Scans (examples)

```bash
rg -n \"\\b(locale === \\\"bg\\\"|locale === 'bg')\\b\" app components -S
rg -n \"from 'next/navigation'\" app/\\[locale\\] -S
```

Key parity quick check:

```bash
node -e \"const en=require('./messages/en.json'); const bg=require('./messages/bg.json'); const ek=new Set(Object.keys(en)); const bk=new Set(Object.keys(bg)); const missBg=[...ek].filter(k=>!bk.has(k)); const missEn=[...bk].filter(k=>!ek.has(k)); console.log('missing in bg:', missBg.length); missBg.slice(0,50).forEach(k=>console.log('  -',k)); console.log('missing in en:', missEn.length); missEn.slice(0,50).forEach(k=>console.log('  -',k));\"
```

## Output Format

```markdown
## i18n Audit — {date}

### Critical (must fix)
- [ ] Issue → File → Fix

### High
- [ ] Issue → File → Fix
```

## Examples

### Example prompt
`I18N: audit the checkout page for hardcoded strings`

### Expected behavior
- Load the canonical docs, scan for hardcoded user strings, and check locale routing usage.
- Ensure new keys exist in both locale files.
- Report findings using the output format.
