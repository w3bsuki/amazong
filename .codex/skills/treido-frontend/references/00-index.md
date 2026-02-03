# Treido Frontend — References Index

## Next.js 16 / App Router

- `nextjs.md` — Treido deltas + sharp edges
- `nextjs-app-router.md` — deeper patterns (RSC boundaries, routing groups, errors/loading, caching hazards)
- `decision-tree.md` — full frontend lane decision tree (AUDIT vs IMPL, escalation, boundaries)

## Tailwind v4 tokens (Treido rails)

- `tailwind.md` — the rails + how to fix `styles:gate` findings
- `tailwind-v4-tokens.md` — practical token mapping + common conversions (palette/arbitrary → semantic tokens)
- SSOT: `docs/04-DESIGN.md` (deprecated pointer: `.codex/project/DESIGN.md`)

## shadcn/ui composition

- `shadcn.md` — boundary rule + refactor heuristic
- `shadcn-composition.md` — primitives vs composites, CVA patterns, Radix composition, “no app imports” enforcement

## i18n (next-intl)

- `i18n-next-intl.md` — adding strings safely (server/client patterns, routing helpers, message hygiene)

## UI craft (Treido house style)

- `ui-craft.md` — typography, spacing, hierarchy, empty/loading/error states (Treido-specific)

## Automation scripts

- `../scripts/quick-validate.mjs` — validate the skill’s local structure (used by CI/dev, and by agents)
- `../scripts/scan.mjs` — run the “fast signals” scans used in FRONTEND AUDIT mode
