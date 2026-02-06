---
name: treido-frontend
description: Frontend orchestrator for Treido. Use to route UI work to the right specialist (Next.js, Tailwind, shadcn/ui, design, mobile UX, accessibility, i18n).
---

# treido-frontend

Frontend orchestration skill for Treido. It chooses the minimum specialist set for safe, high-quality UI delivery.

## When to Apply

- Cross-cutting UI tasks touching component structure, styles, and interaction.
- Work that may require more than one frontend specialist.
- Planning frontend verification sequence before implementation.

## When NOT to Apply

- Backend-only tasks (queries, auth internals, payments internals).
- Skill maintenance tasks (`treido-skillsmith`).
- Pure docs maintenance tasks (`treido-docs`).

## Non-Negotiables

- Always include `treido-rails` constraints.
- Choose one primary specialist and only necessary secondaries.
- Enforce `next-intl` for user copy and Tailwind v4 token rails.
- Prefer smallest shippable batches with verification after each batch.

## Routing Matrix

| Task Type | Primary Specialist |
|-----------|--------------------|
| Layout hierarchy, state design, polish | `treido-design` or `treido-ui-ux-pro-max` |
| Mobile behavior and touch UX | `treido-mobile-ux` |
| Accessibility semantics/focus/keyboard | `treido-accessibility` |
| App Router boundaries/caching | `treido-nextjs-16` |
| Tailwind v4 token compliance | `treido-tailwind-v4` |
| shadcn primitive/composition boundaries | `treido-shadcn-ui` |
| i18n/copy locale hygiene | `treido-i18n` |

## Output Template

```md
## Specialist
- <primary skill + why>

## Plan
- <2-6 concrete steps>

## Files
- <paths>

## Verification
- <commands and expected results>
```

## References

- `docs/AGENTS.md`
- `docs/AGENT-MAP.md`
- `docs/WORKFLOW.md`
- `docs/DESIGN.md`
- `docs/ARCHITECTURE.md`
- `docs/I18N.md`
