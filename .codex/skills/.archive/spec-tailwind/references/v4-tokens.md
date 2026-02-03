# Tailwind v4 Semantic Tokens (How Treido Uses Them)

Treido's Tailwind v4 usage is designed to keep UI consistent across:
- light/dark themes
- components (shadcn primitives and app composites)
- platforms (web + mobile wrappers)

## Token Source of Truth

- Design meanings: `.codex/project/DESIGN.md`
- Token definitions: `app/globals.css`
- Enforcement:
  - `pnpm -s styles:scan` (reports)
  - `pnpm -s styles:gate` (fails on findings)

### What counts as a "semantic token" in this repo

Color utilities should be semantic and themeable:
- `bg-<token>`
- `text-<token>`
- `border-<token>`
- `ring-<token>`
- `fill-<token>`
- `stroke-<token>`

Tokens are derived from CSS variables in `app/globals.css` and exposed to Tailwind v4 via the theme bridge.

## Audit Goals

When reviewing a component's styling, the goal is not "does it look good locally", but:
- does it use the correct semantic surface/state token
- does it avoid opacity hacks and palette colors
- does it remain valid in dark mode
- does it stay consistent with the surrounding UI patterns

## How To Validate Tokens

### 1) Existence check

If you see `bg-surface-foo` or `text-price-bar`:
- confirm `--color-surface-foo` or `--color-price-bar` exists in `app/globals.css`
- confirm it is present in both `:root` and `.dark` blocks (or otherwise intentionally derived)

### 2) Meaning check

Tokens must be used according to their meaning:
- surface tokens are for backgrounds
- interactive tokens are for hover/active/selected states
- status tokens are for success/warn/error/info indicators

If a token name is "status-ish" (e.g. `verified`, `error`) but used as a background for a generic card, that's a semantic misuse even if the color is valid.

### 3) Avoid inventing variants

Do not create variants like:
- `bg-muted/30`
- `bg-primary/10`
- `hover:bg-accent/50`

Instead, use explicit semantic tokens (`bg-hover`, `bg-active`, `bg-selected`, `bg-surface-subtle`) per `.codex/project/DESIGN.md`.

## Migration Notes (v3 -> v4)

Common v3 carry-overs to look for:
- palette utilities (`bg-slate-50`, `text-zinc-700`)
- `text-[13px]` and other bracket arbitrary values
- `bg-white`, `text-black`
- `ring-blue-500/20` etc.

Preferred migration strategy:
1) choose the semantic token matching meaning (surface/state/status)
2) keep spacing/typography utilities as standard scale values (no arbitrary values)
3) if you truly need a new semantic token, add it to `app/globals.css` and document meaning in `.codex/project/DESIGN.md` (planning required)

