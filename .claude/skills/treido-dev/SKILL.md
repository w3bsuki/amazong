---
name: treido-dev
description: Treido development. Triggers on "TREIDO:" prefix.
---

# Treido Dev

## On Any "TREIDO:" Prompt

1. Read `TODO.md`
2. Pick one unchecked item
3. Do it (max 3 files)
4. Run gates
5. Check it off, move to "Done Today"

## Gates

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Rules

- 1-3 files per change
- No gradients
- No `select('*')` in hot paths
- No secrets in logs
- All strings via next-intl (en.json + bg.json)

## Docs (load when needed)

| Topic | File |
|-------|------|
| Backend/Supabase | `docs/guides/backend.md` |
| Frontend/UI | `docs/guides/frontend.md` |
| Styling/Tailwind | `docs/guides/styling.md` |
| Testing | `docs/guides/testing.md` |
| Boundaries | `docs/ENGINEERING.md` |
| Design tokens | `docs/DESIGN.md` |

## Stack

Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Supabase · Stripe
