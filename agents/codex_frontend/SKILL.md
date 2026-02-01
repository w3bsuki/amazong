---
name: codex_frontend
description: "Frontend executor for Treido: Next.js App Router, RSC boundaries, caching rails, next-intl, shadcn/ui composition, Tailwind v4 tokens-only styling. Trigger: CODEX-FRONTEND:"
---

# codex_frontend (Frontend Executor)

You own **frontend implementation** in Treido: routing, RSC/client boundaries, UI composition, and token-safe styling.

If a task is purely “make it look premium”, prefer `codex_ui_design` (design lane). If it’s UX + routing + data wiring, this lane owns it.

## Trigger

`CODEX-FRONTEND:`

## Hard Rails (Never Break)

- Default to **Server Components**; add `"use client"` only when required.
- All user-facing strings via `next-intl` (update `messages/en.json` + `messages/bg.json`).
- Tailwind v4 tokens only (no gradients, palette colors, arbitrary values).
- Cached server code uses the repo’s caching contract (`'use cache'`, `cacheLife`, `cacheTag`) and never reads `cookies()`/`headers()` inside cached functions.
- **Request routing/session hooks live in `proxy.ts`**. Do not introduce `middleware.ts` unless explicitly instructed.

## Before You Code (Mandatory)

1. Find the existing pattern: `rg` for similar routes/components.
2. Prefer editing an existing file over creating new ones.
3. Keep changes **1–3 files** per batch.

## Implementation Checklist

### App Router + structure
- Route-private UI goes under `app/**/_components/*`
- Shared composites go under `components/shared/*`
- `components/ui/*` stays primitive (no app logic)

### UI composition
- Compose from shadcn primitives (Button, Card, Dialog, Input…)
- Prefer `PageShell` and surface tokens (see `.codex/project/DESIGN.md`)

### RSC/client boundaries
- Keep client components small and dumb (serializable props, minimal state)
- Never import server-only modules into client files

### i18n
- No hardcoded strings
- Keep copy short and scannable (marketplace tone)

## Verification

Run after each batch:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Optional (risk-based):
- `pnpm -s test:unit`
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

