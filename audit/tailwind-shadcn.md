# Tailwind v4 + shadcn/ui Audit — 2026-01-24

## Current state snapshot

- Tailwind: `tailwindcss@4.1.18` (`package.json`)
- PostCSS: `postcss.config.mjs` + `@tailwindcss/postcss`
- shadcn/ui config: `components.json` (New York style, CSS variables, `app/globals.css`)
- Animation baseline: `tw-animate-css`

## Token / style sources (current)

- Primary:
  - `app/globals.css` (tokens, base theme, Tailwind import)
- Additional style layers (potential drift):
  - `app/legacy-vars.css`
  - `app/shadcn-components.css`
  - `app/utilities.css`

Note: these additional layers are currently pulled in via `@import` from `app/globals.css`.

## Drift scans (repo tooling)

Ran:

- `pnpm -s styles:scan`

Results:

- Palette usage: **0 files / 0 findings**
- Arbitrary values/hex/oklch: **0 files / 0 findings**
- Reports:
  - `cleanup/palette-scan-report.txt`
  - `cleanup/arbitrary-scan-report.txt`

## Findings (Phase 1)

## Tailwind Lane Phase 1 Audit — 2026-01-24

### Critical (blocks Phase 2)

- [ ] **Consolidate token sources** → multiple CSS files define token-like values which increases drift risk → Evidence: `app/globals.css`, `app/legacy-vars.css`, `app/shadcn-components.css`, `app/utilities.css` → Fix: define a single token source (prefer `app/globals.css`) and migrate the rest into utilities/components.

### High (do in Phase 2)

- [ ] **Codify “page canvas” + surface recipes** → ensure every route uses the same wrapper and spacing scale → Fix: standard `PageShell` (or equivalent) used across pages and route groups.
- [ ] **Component recipe enforcement** → stop per-page “card/badge/border/radius” freehand combos → Fix: variants + shared composites for repeated UI (product cards, badges, banners, chips).

### Deferred (Phase 3 or backlog)

- [ ] **Token diet** → reduce cognitive load by removing unused/overlapping tokens once UI is stable.
- [ ] **Extend drift scans** → optionally flag `bg-white`, `text-black`, `border-gray-*` in non-demo codepaths.

## Related audit (existing)

- `docs/AUDIT_TAILWIND_SHADCN_TWITTER_THEME_2026-01-24.md`

## Verification gates

```bash
pnpm -s styles:gate
pnpm -s typecheck
pnpm -s test:e2e:smoke
```
