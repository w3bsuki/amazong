---
name: treido-dev
description: Treido development workflow. Triggers on "TREIDO:" prefix. Use for executing the next task in an active .specs spec (preferred) or a small TODO item, keeping changes small (1-3 files) and running verification gates.
---

# Treido Dev

## On Any "TREIDO:" Prompt

1. Prefer spec-driven work:
   - If the prompt references `.specs/active/<spec>` or `.specs/queue/<spec>`, work from that spec's `requirements.md` + `tasks.md` + `context.md`.
   - Else if `.specs/active/` has exactly one spec folder, work from its `tasks.md`.
   - Else if `.specs/active/` has multiple spec folders, ask which spec to continue (or require a `COORD:` decision).
2. Execute the next smallest unchecked task (aim for 1-3 files).
3. Update progress:
   - Check off the task in `tasks.md`
   - Append a short session entry to `context.md` (what changed, files touched, blockers, next)
4. If there is no active spec, fall back to legacy TODO mode:
   - Read `TODO.md`, pick one unchecked item, do it (max 3 files), then check it off.
5. Run gates.

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
| Docs index | `docs/README.md` |

## Examples

### Example prompt
`TREIDO: pick the next TODO and complete it`

### Expected behavior
- Read `TODO.md`, pick one small item, and complete it within 1–3 files.
- Run the listed gates, check it off, and log what changed.

### Example prompt
`TREIDO: Work on .specs/active/p0-turbopack-crash`

### Expected behavior
- Read the spec's `requirements.md` + `tasks.md`, complete the next unchecked task in 1–3 files.
- Update `tasks.md` and `context.md`, then run the listed gates.

## Stack

Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Supabase · Stripe
