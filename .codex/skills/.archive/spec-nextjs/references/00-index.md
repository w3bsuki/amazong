# spec-nextjs references (AUDIT-ONLY)

This folder is a deep Next.js 16 App Router audit playbook tailored for Treido rails.

## Read Order (Recommended)

1. `decision-tree.md` - quick decision framework for auditing (start here)
2. `rsc-boundaries.md` - Server vs client component boundaries, server-only imports, and common leakage patterns
3. `caching.md` - Treido cached server rules (`"use cache"`, `cacheLife`, `cacheTag`, tag invalidation)
4. `routing.md` - Route groups, layouts, error/loading/not-found, config exports, middleware/proxy considerations
5. `server-actions.md` - Server actions vs route handlers, auth/session validation, and request-context hazards

## Treido SSOT Links

- `.codex/AGENTS.md` - non-negotiable rails (default RSC, cached server rules)
- `.codex/project/ARCHITECTURE.md` - caching profiles/tags, Supabase client selection matrix
- `.codex/project/FEATURES.md` - route map and launch scope

## Audit Output Contract

Return only:
- `.codex/skills/treido-orchestrator/references/audit-payload.md`

Use auditor name `NEXTJS` and IDs `NEXTJS-001`, `NEXTJS-002`, ...

