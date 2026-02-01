---
name: codex_spec_typescript
description: "Audit-only TypeScript specialist for Treido: strictness, unsafe patterns (any/unknown), server/client type boundaries, zod inference, and maintainable module APIs. Trigger: CODEX-TS:AUDIT"
---

# codex_spec_typescript (AUDIT-ONLY)

Read-only specialist. Do not patch files.

## Trigger

`CODEX-TS:AUDIT`

## What To Flag

- `any` and unsafe casts (`as any`, `as unknown as`)
- Unchecked JSON parsing and shape assumptions
- “stringly-typed” enums/variants where unions/types exist
- Server/client boundary leaks (server-only types imported into client)
- Missing return types on exported functions where inference becomes unstable

## Fast Signals

```bash
pnpm -s typecheck
rg -n "\\bas any\\b|\\bunknown as\\b" app components lib
rg -n "\\bJSON\\.parse\\(" app components lib
```

