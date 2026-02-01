# UI Craft (Treido House Style)

This is the “make it look like Treido” guide: compact marketplace UI, predictable hierarchy, no flashy motion.

SSOT tokens: `.codex/project/DESIGN.md`

## Typography hierarchy (practical)

- body: `text-sm`
- labels: `text-sm font-medium`
- meta/captions: `text-xs text-muted-foreground`
- section titles: `text-lg font-semibold`
- price emphasis: `text-base font-semibold`

Rule: prefer changing **weight** and **color** over changing font sizes.

## Spacing rhythm (4px base)

Default gaps:

- inline/icon gaps: `gap-2`
- list rows: `gap-3`
- section padding: `py-6` (mobile), `py-8` (desktop)

Rule: use fewer spacing sizes, not more.

## States (don’t skip these)

Every interactive surface should consider:

- loading (skeleton/spinner)
- empty (localized copy, next action)
- error (localized copy, safe retry)
- success (confirmation toast or inline)

## Motion

Treido rule: **no new animations**.

If a component already animates (Radix/shadcn defaults), keep it subtle and do not add new motion layers.

## A11y basics (minimum)

- visible focus ring (`ring-ring`)
- touch targets meet `h-touch-*` tokens
- icon-only buttons have labels (visually hidden text or aria-label)

