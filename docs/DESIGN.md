# Design System (Production)

Goal: a clean, dense marketplace UI that is consistent, fast, and easy to maintain.

## Non-negotiables

- No redesigns during production push.
- No gradients.
- Cards are flat: `border`, `rounded-md` max; avoid heavy shadows.
- Avoid arbitrary Tailwind values (`h-[42px]`, `text-[13px]`) unless there is no token-based option.
- Prefer semantic tokens/classes already present in `app/globals.css`.

## Tokens (source of truth)

- Colors/spacing/typography tokens live in `app/globals.css` under `@theme`.
- Prefer semantic classes (examples): `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`.
- Tailwind v4 CSS var usage: `w-(--token)`, `max-h-(--token)`, etc.

## Density defaults

- Spacing: mobile `gap-2`, desktop `gap-3`.
- Touch targets: 24px minimum; prefer `h-10` for primary actions and `h-9` for compact actions.
- Typography baseline: `text-sm` body, `text-base` for prices/emphasis, `text-xs` for meta, `text-2xs` for tiny badges only.

## Interaction + motion

- Keep interactions predictable: subtle hover, clear active, visible focus ring.
- Avoid gimmicks (scale/zoom hover). If motion exists, keep it minimal and respect `prefers-reduced-motion`.

## Component boundaries (so styling stays sane)

- `components/ui/**`: primitives only (shadcn style). No feature composites, no app hooks.
- `components/common/**`: shared composites used across routes.
- `components/layout/**`: shells (header/nav/sidebars).
- Route-owned UI must live under its route group: `app/[locale]/(group)/**/_components/**`.

## Quick “good defaults”

- Card: `rounded-md border border-border bg-card p-3`
- Section spacing: `space-y-3` (desktop) / `space-y-2` (mobile)
- Muted surface: `bg-muted/50` + `text-muted-foreground` + `border-border`

## Deep references

- `styling/STYLE_GUIDE.md` (long-form patterns and examples)
- `cleanup/palette-scan-report.txt` and `cleanup/arbitrary-scan-report.txt` (drift hotspots)
