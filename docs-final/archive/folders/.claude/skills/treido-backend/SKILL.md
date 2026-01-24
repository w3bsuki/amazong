---
name: treido-backend
description: Treido backend development (Next.js route handlers, server actions, Supabase, Stripe). Triggers on "BACKEND:" prefix or when editing app/api/**/route.ts, server actions, Supabase RLS/policies, or Stripe webhooks.
---

# Treido Backend

## On Any "BACKEND:" Prompt

1. Identify the exact entrypoint (route handler, server action, webhook) and expected request/response shape.
2. Confirm boundaries: keep React/UI out of backend logic; keep pure helpers in `lib/`.
3. Implement the smallest safe change (1-3 files).
4. If touching Supabase auth/RLS/SQL, run the `supabase-audit` skill (`SUPABASE:`) before finalizing.
5. Add/adjust tests if the repo already covers this area (unit in `__tests__/`, e2e in `e2e/`).
6. Run gates.

## Rules

- No secrets in logs (tokens, cookies, headers, env vars).
- Avoid `select('*')` in hot paths; project only needed fields.
- Prefer pure utilities in `lib/` (no React, no app imports).
- Keep route-private code within its route group (don't import across `app/[locale]/(group)/_*` boundaries).

## Gates

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:unit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Docs (load when needed)

| Topic | File |
|------|------|
| Backend guide | `docs/BACKEND.md` |
| Engineering rules | `docs/ENGINEERING.md` |
| Testing | `docs/TESTING.md` |
| Production checklist | `docs/PRODUCTION.md` |

## Examples

### Example prompt
`BACKEND: add a route handler to fetch seller payouts`

### Expected behavior
- Identify the exact entrypoint and request/response shape.
- Implement a minimal change within boundaries and add tests if needed.
- Run the listed gates.
