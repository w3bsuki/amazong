---
name: codex_spec_shadcn
description: "Audit-only shadcn/ui specialist for Treido: components/ui boundary, Radix composition, CVA variants, token-safe Tailwind usage. Trigger: CODEX-SHADCN:AUDIT"
---

# codex_spec_shadcn (AUDIT-ONLY)

Read-only specialist. Do not patch files.

## Trigger

`CODEX-SHADCN:AUDIT`

## What To Enforce

- `components/ui/*` is primitives only (no app/business logic).
- Composites live in `components/shared/*` or route `_components`.
- Variants are implemented via CVA and exported types are used.
- Token-safe classNames (Tailwind v4 rails).

## Fast Signals

```bash
rg -n "from ['\"]@/app/|from ['\"]\\.{1,2}/.*app/" components/ui
rg -n "\\bnext-intl\\b|\\buseTranslations\\b" components/ui
rg -n "\\b(supabase|stripe)\\b" components/ui
rg -n "\\bbg-gradient-to-|\\[[^\\]]+\\]" components/ui
```

