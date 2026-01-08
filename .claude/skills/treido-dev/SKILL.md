---
name: treido-dev
description: Treido development workflow. Triggers on "TREIDO:" prefix. Use for daily tasks, picking next item from TODO, executing small changes (1-3 files), and running verification gates.
---

# Treido Dev

## On Any "TREIDO:" Prompt

1. Read `TODO.md`
2. Pick one unchecked item (smallest viable)
3. Do it (max 3 files)
4. Run gates
5. Check it off, move to "Done Today"
6. Log what changed

## Gates

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Rules

- 1-3 files per change (max 5 if truly one behavior)
- No gradients
- No `select('*')` in hot paths
- No secrets in logs
- All strings via next-intl (en.json + bg.json)
- No arbitrary Tailwind values unless necessary

## Task Sizes

| Size | Files | Time |
|------|-------|------|
| Tiny | 1 | 5-15 min |
| Small | 2-3 | 15-45 min |
| Medium | 3-5 | 45-90 min |
| Too Big | 5+ | **Split it** |

## Docs (load when needed)

| Topic | File |
|-------|------|
| Production checklist | `docs/PRODUCTION.md` |
| Engineering rules | `docs/ENGINEERING.md` |
| Design tokens | `docs/DESIGN.md` |
| Full workflow guide | `docs/PRODUCTION-WORKFLOW-GUIDE.md` |

## Stack

Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Supabase · Stripe
