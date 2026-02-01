# Radix Composition (shadcn/ui) - Audit Guide

This guide focuses on common Radix/shadcn pitfalls that cause:
- broken keyboard navigation
- missing focus indication
- broken semantics (buttons inside links, etc.)
- z-index/portal layering bugs (especially with sheets/drawers)

## Composition Principles

### Use `asChild` to preserve semantics

If a component is conceptually a `Link` but is wrapped by a Radix primitive:
- use `asChild` so the underlying element remains an anchor

Audit for:
- `<button>` nested inside `<a>` (invalid)
- click handlers on non-interactive elements without role/tabIndex

### Focus handling

Audit for:
- interactive elements without visible focus (keyboard users)
- focus rings using palette colors (must use `ring-ring`)
- focus trapped incorrectly in dialogs/sheets

Fix patterns:
- ensure `focus-visible:ring-2 ring-ring` (or equivalent token-safe pattern)
- ensure dialog focus trap and close actions are reachable

### Portals, overlays, and stacking context

Dialogs/sheets/drawers:
- should render overlays in a portal with a predictable z-index
- should prevent background scroll and interaction intentionally (mobile especially)

Audit for:
- overlays missing or not covering viewport
- fixed elements under/over the overlay unexpectedly
- scroll bleed (background scroll while sheet open)

Fix patterns:
- use consistent overlay token (`bg-overlay-*` as defined in design tokens)
- keep z-index values standardized (avoid arbitrary z-index)

## Accessibility Signals to Check

- labels are properly associated (`<Label htmlFor>` + input id)
- `aria-describedby` for helper/error text when applicable
- icon-only buttons have `aria-label`
- dropdowns/menus are keyboard operable

## Tailwind Rails Inside UI Primitives

Audit for:
- palette classes
- arbitrary values
- gradients
- opacity hacks on base tokens

Fix patterns:
- use tokenized surfaces/states per `.codex/project/DESIGN.md`

