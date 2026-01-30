---
name: treido-frontend
description: Treido frontend development (Next.js App Router UI, React, Tailwind v4 + shadcn/ui, next-intl). Use for pages/components/layout/styling/i18n/client boundaries; triggers on "FRONTEND:" prefix.
deprecated: true
---

# Treido Frontend

> Deprecated (2026-01-29). Use `treido-orchestrator` + `treido-impl-frontend` (and `treido-audit-*` + `treido-verify`).

## Workflow (on any `FRONTEND:` request)

1. Clarify the exact surface area (route/component) and required states (loading/empty/error/success).
2. Keep changes shippable (1-3 files); split follow-ups if bigger.
3. Default to Server Components; add `"use client"` only when required (events/state/browser APIs). Keep client boundaries small.
4. Respect Treido boundaries:
   - `components/ui/*` = shadcn primitives only
   - `components/shared/*` = reusable composites
   - `app/[locale]/(group)/**/_components/*` = route-private UI (never import across route groups)
5. All user-facing strings via `next-intl` (update both `messages/en.json` and `messages/bg.json`).
6. Tailwind v4 rails: no gradients, no arbitrary values, no palette colors / hex (tokens only).
7. Cached server code (`'use cache'`): always `cacheLife()` + `cacheTag()`; never call `cookies()`/`headers()` inside cached functions.
8. Verify.

## Verification

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Optional (when relevant):

- `pnpm -s test:unit`
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

## Handoff signal

End task completion responses with:
- `OPUS: review?` when the change is cross-boundary or risky
- `DONE (no review needed)` otherwise

## References (load only if needed)

- `.codex/skills/treido-frontend/references/nextjs.md`
- `.codex/skills/treido-frontend/references/tailwind.md`
- `.codex/skills/treido-frontend/references/shadcn.md`
- SSOT: `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`
