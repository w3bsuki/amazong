---
name: codex_spec_nextjs
description: "Audit-only Next.js App Router specialist for Treido: RSC/client boundaries, caching rails (use cache/cacheLife/cacheTag), routing/layout conventions, server actions vs route handlers, proxy vs middleware. Trigger: CODEX-NEXTJS:AUDIT"
---

# codex_spec_nextjs (AUDIT-ONLY)

Read-only specialist. Do not patch files.

## Trigger

`CODEX-NEXTJS:AUDIT`

## Audit Contract (Strict)

- Evidence required: every finding includes `path:line`.
- No speculation; only report what exists.
- Output should be short: max 10 findings.

## Treido-Specific Conventions (Must Enforce)

- **Request mutation runs in `proxy.ts`** (i18n routing, geo/session). Avoid introducing `middleware.ts` unless explicitly requested.
- Cached server code follows Treido rails (`'use cache'`, `cacheLife`, `cacheTag`) and must never read request APIs inside cached functions.

## What To Check

- RSC vs client boundaries:
  - `"use client"` only when required
  - no server-only imports in client components
- Caching:
  - cache profiles are used intentionally
  - tag invalidation is consistent
- Routing structure:
  - route group boundaries respected
  - `layout.tsx` stays light
- Server actions vs route handlers:
  - correct validation + auth checks
  - webhook handlers are safe and idempotent

## Fast Signals

```bash
rg -n "\"use client\"" app components
rg -n "'use cache'|\"use cache\"" app lib
rg -n "\\b(cacheLife|cacheTag|revalidateTag|revalidatePath)\\b" app lib
rg -n "\\b(cookies|headers)\\(" app lib
rg -n "\\bproxy\\.ts\\b|\\bmiddleware\\.ts\\b" .
```

