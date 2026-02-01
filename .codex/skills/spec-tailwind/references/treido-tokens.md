# Treido-Specific Tokens (Surfaces, States, Touch Targets)

This document is a practical "what token should I use" guide for audits.

SSOT:
- `.codex/project/DESIGN.md`

## Surface Hierarchy (Backgrounds)

Typical mapping:
- page canvas: `bg-background`
- muted page canvas (grids/search): `bg-surface-page` (usually via `<PageShell variant="muted">`)
- subtle section: `bg-surface-subtle`
- cards: `bg-card` + `border-border`
- elevated bars/sheets: `bg-surface-elevated`

Audit for surface drift:
- `bg-muted/...` used as "subtle surface" -> should likely be `bg-surface-subtle`
- `bg-primary/...` used for selection -> should likely be `bg-selected`

## Interactive States (Hover/Active/Selected/Focus)

Preferred state tokens:
- hover: `bg-hover` + `border-hover-border` (when border exists)
- active/pressed: `bg-active`
- selected: `bg-selected` + `border-selected-border`
- focus: `ring-2 ring-ring` (avoid palette ring colors)

Audit for:
- opacity hacks (`bg-primary/10`, `hover:bg-accent/50`)
- missing focus rings on interactive elements

## Text Tokens

Most common:
- primary text: `text-foreground`
- secondary/meta: `text-muted-foreground`
- inverse text: `text-background` when on `bg-foreground`

Audit for:
- palette text (`text-zinc-700`)
- contrast issues from incorrect surface+text pairing

## Touch Targets (Treido UX)

Treido uses tokenized touch sizes to stay WCAG-friendly and mobile-safe.

Common patterns you should prefer:
- buttons/inputs: `h-11` or token utilities like `h-touch`, `h-touch-lg`
- icon buttons: `size-touch` / `size-touch-lg`
- list items: `min-h-11` or `min-h-12` for mobile tap targets

Audit for:
- tiny interactive elements (e.g. `h-8` buttons in mobile-only UIs)
- custom one-off heights (`h-[42px]`) instead of standardized tokens/sizes

## Audit Fix Suggestions (Token-first)

When suggesting a replacement, prioritize:
1) semantic tokens (surface/state/status)
2) standard Tailwind scale utilities (spacing/typography/radius)
3) only then: propose a new token, and only if it is broadly needed (should become a planned change)

