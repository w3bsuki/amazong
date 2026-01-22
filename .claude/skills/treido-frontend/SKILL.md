---
name: treido-frontend
description: Treido frontend development (Next.js App Router UI, React, Tailwind v4 + shadcn/ui, next-intl). Triggers on "FRONTEND:" prefix or UI/components/styling/i18n tasks.
---

# Treido Frontend (UI + UX)

## On Any "FRONTEND:" Prompt

1. Identify the exact page/component and state/data requirements.
2. Respect code boundaries:
   - `components/ui/` shadcn primitives only (no app hooks)
   - `components/common/` shared composites
   - `components/layout/` shells
   - `hooks/` reusable hooks
   - `lib/` pure utilities (no React)
3. All user-visible strings go through `next-intl` (`messages/en.json` + `messages/bg.json`).
4. Styling rails: no gradients, no arbitrary Tailwind values.
5. If changing Tailwind tokens/themes or adding custom styles, run the `tailwind-audit` skill (`TAILWIND:`) before finalizing.
6. Run gates.

## Gates

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:unit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Docs (load when needed)

| Topic | File |
|------|------|
| Frontend guide | `docs/FRONTEND.md` |
| Design tokens | `docs/DESIGN.md` |
| Styling system | `docs/styling/README.md` |
| Engineering rules | `docs/ENGINEERING.md` |

