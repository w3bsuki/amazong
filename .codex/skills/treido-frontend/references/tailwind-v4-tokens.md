# Tailwind v4 Tokens (Practical Mapping)

Treido’s styling rules are intentionally strict:

- no gradients
- no arbitrary values (`[...]`)
- no palette utilities / hardcoded colors

SSOT: `.codex/project/DESIGN.md`

This doc is a pragmatic “what do I replace X with?” helper.

## Palette → semantic token mappings (common)

Text:

- `text-black`, `text-slate-900`, `text-gray-900` → `text-foreground`
- `text-slate-600`, `text-gray-500` → `text-muted-foreground`
- `text-blue-600` → `text-primary`

Background:

- `bg-white` → `bg-background`
- `bg-slate-50`, `bg-gray-50` → `bg-surface-page` or `bg-surface-subtle` (see DESIGN “Surface Hierarchy”)
- `bg-slate-100`, `bg-gray-100` → `bg-muted`

Borders:

- `border-slate-200`, `border-gray-200` → `border-border`
- `border-blue-500/20` (not allowed) → `border-selected-border` (or a semantic border token)

Hover/active:

- `hover:bg-accent/50` (not allowed) → `hover:bg-hover`
- `active:bg-accent/70` (not allowed) → `active:bg-active`

## Spacing (no arbitrary)

If you see `px-[13px]`, `gap-[10px]`, `h-[44px]`:

1. pick the nearest token from the Treido scale (4px base)
2. prefer consistency over pixel-perfection

Common:

- 8px → `2`
- 12px → `3`
- 16px → `4`
- 24px → `6`
- 32px → `8`

## Touch targets (use Treido tokens)

Prefer the custom touch tokens defined by the project:

- `h-touch-xs` / `h-touch-sm` / `h-touch` / `h-touch-lg`

Do not invent touch sizes with `h-[...]`.

## Recipes (copy/paste)

Card:

```tsx
<div className="rounded-md border border-border bg-card p-3" />
```

Muted page shell:

```tsx
<div className="min-h-dvh bg-surface-page" />
```

Pill/chip:

```tsx
<button className="h-touch-sm rounded-full border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-hover hover:text-foreground" />
```

