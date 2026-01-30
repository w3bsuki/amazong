---
name: treido-designer
description: Treido UI/UX spec + review (mobile-first, Tailwind v4 tokens, shadcn/ui, next-intl copy, a11y basics). Use when UI looks off or before UI-heavy work; triggers on "DESIGN:" prefix.
deprecated: true
---

# Treido Designer (Spec + Review)

> Deprecated (2026-01-29). Use `treido-orchestrator` Phase 2 planning; implement via `treido-impl-frontend`.

## Workflow (on any `DESIGN:` request)

1. Clarify the surface area (route(s), component(s), viewport priority: mobile-first).
2. Produce a UI spec (no code by default) with:
   - layout structure
   - component map (shadcn primitives vs shared composites vs route-private components)
   - states (loading/empty/error/success)
   - accessibility notes (labels, focus, touch targets)
   - i18n keys (en+bg) when copy changes are needed
3. Enforce Treido rails from `AGENTS.md`:
   - Tailwind v4 only; **no gradients**, **no arbitrary values**, **no hardcoded colors**
   - No new animations
   - All user-facing strings via `next-intl`
   - Keep `components/ui/*` as primitives only
4. If the human explicitly asks to implement, hand off to `FRONTEND:` with a 1-3 file plan.

## Design Heuristics (Treido-style)

- Prefer clean marketplace/e-commerce UI: strong hierarchy, lots of whitespace, predictable components.
- Mobile-first: single-column, clear primary CTA, avoid dense grids on small screens.
- Keep typography scale consistent with existing patterns (don’t invent one-off sizes).
- Favor composition over new primitives; reuse shadcn + `components/shared/*` patterns.
- Don’t “decorate” with gradients/glows/animations; improve spacing, alignment, and information architecture instead.

## Output Format (Always)

```md
## UI Spec
- Surface: <route/component>
- Primary user goal:
- Viewports: <mobile first; note desktop deltas>

## Layout
- Sections:
- Spacing rhythm (tokens only):

## Component Map
- shadcn primitives (`components/ui/*`):
- Shared composites (`components/shared/*`):
- Route-private (`app/[locale]/.../_components/*`):

## States
- Loading:
- Empty:
- Error:
- Success:

## Accessibility
- Focus order:
- Labels / aria:
- Touch targets:

## i18n
- New keys (en+bg):

## Acceptance Criteria
- [ ] ...

## Verification
- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`
```

## References (Load Only If Needed)

- SSOT: `AGENTS.md`, `docs/DESIGN.md`
- shadcn/Tailwind rails: `.codex/skills/treido-frontend/references/shadcn.md`, `.codex/skills/treido-frontend/references/tailwind.md`
