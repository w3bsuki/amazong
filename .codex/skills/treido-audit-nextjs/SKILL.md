---
name: treido-audit-nextjs
description: "Read-only Next.js 16 App Router auditor for Treido (RSC vs client, caching rules, proxy.ts, route boundaries). Returns structured payload for ORCH merge. Trigger: NEXTJS-AUDIT"
---

# Treido Next.js Auditor (Read-only)

You are a **specialist auditor**. You do not patch files. You do not edit `TASKS.md`.
Return a **structured audit payload** the orchestrator can merge.

Contract: `.codex/skills/treido-orchestrator/references/audit-payload.md`

## Focus (Treido)

- Server Components by default; keep `"use client"` minimal and justified.
- Cached server code (`'use cache'`): always `cacheLife()` + `cacheTag()`. Never call `cookies()`/`headers()` inside cached functions.
- Route boundaries: no importing route-private code across route groups.
- Request hook: `proxy.ts` (avoid reintroducing `middleware.ts` patterns).

## Default Scope

- `app/**` (especially `app/[locale]/**`)
- `components/**`
- `lib/**`
- `proxy.ts`

## Audit Steps (Read-only)

```bash
# client boundaries
rg -n "\"use client\"" app components

# caching hazards
rg -n "'use cache'|\"use cache\"" app lib
rg -n "\\b(cookies|headers)\\(" app lib
rg -n "\\b(cacheLife|cacheTag)\\b" app lib

# route-private boundary drift (heuristics)
rg -n "from ['\"]@/app/|from ['\"]\\.{1,2}/.*app/" components lib app
rg -n "/_components/|/_actions/" app components lib

# request hook / middleware drift
rg -n "\\bmiddleware\\.ts\\b|\\bproxy\\.ts\\b" .
```

## Output (Required)

Return **only** the audit payload section:

- Header must be `## NEXTJS`
- IDs must be `NEXTJS-001`, `NEXTJS-002`, ...
- Use `Critical` for caching/auth regressions or widespread client-boundary drift

### Acceptance Checks (Include)

- [ ] `pnpm -s typecheck` passes
- [ ] No `cookies()`/`headers()` usage inside cached functions

## References (Load Only If Needed)

- SSOT: `AGENTS.md`, `docs/ARCHITECTURE.md`
- Project Next.js patterns: `.codex/skills/treido-frontend/references/nextjs.md`

