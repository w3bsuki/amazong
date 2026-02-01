# Forbidden Patterns (Treido Tailwind Rails)

Treido enforces strict styling rails to prevent drift:
- no gradients
- no palette colors
- no arbitrary values / hardcoded colors

The enforcement scripts are already wired:
- `pnpm -s styles:scan`
- `pnpm -s styles:gate`

## Gradients (Forbidden)

Flag any of:
- `bg-gradient-to-*`
- `from-*`, `via-*`, `to-*` (especially when combined in the same element)
- raw CSS gradients: `linear-gradient(`, `radial-gradient(`, `conic-gradient(`

Why:
- gradients are hard to theme and produce inconsistent contrast and accessibility

Replacement:
- use a surface token (`bg-surface-elevated`, `bg-surface-subtle`)
- use state tokens (`bg-hover`, `bg-selected`)

## Palette Colors (Forbidden)

Flag any of:
- `bg-gray-100`, `text-blue-600`, `border-zinc-200`, etc.
- `bg-white`, `text-black` (these are palette colors too; break dark mode)

Why:
- palette colors bypass the theme system and drift across the product

Replacement:
- `bg-background`, `text-foreground`, `border-border`
- or a specific semantic token (status/surface/price/etc.)

## Arbitrary Values (Forbidden)

Flag any of:
- bracket arbitrary sizing/typography: `w-[560px]`, `text-[13px]`, `rounded-[10px]`
- hardcoded colors in TS/TSX: `bg-[#1DA1F2]`, `oklch(...)`
- raw hex literals (outside the exception below)

Why:
- arbitrary values are unreviewable at scale, accumulate design debt, and often break responsive behavior

Replacement:
- use Tailwind scale utilities (`w-64`, `text-sm`, `rounded-md`, etc.)
- if the need is semantic (a new surface or status), add a token (planned change)

## Opacity Hacks on Tokens (Almost Always Forbidden)

Flag patterns like:
- `bg-primary/10`
- `bg-muted/30`
- `hover:bg-accent/50`

Why:
- opacity composition differs across browsers and surfaces and becomes inconsistent quickly

Replacement:
- use dedicated tokens (`bg-surface-subtle`, `bg-hover`, `bg-active`, `bg-selected`)

## One Exception: Product Color Swatches

Hardcoded hex colors are allowed only for representing literal product colors in UI:
- `components/shared/filters/color-swatches.tsx`

Anywhere else: treat as a violation.

## Evidence Collection Tips

For each violation, collect:
- file:line showing the className token
- context: what UI element it applies to (button, card, page background)
- suggested replacement token(s) from `.codex/project/DESIGN.md`

