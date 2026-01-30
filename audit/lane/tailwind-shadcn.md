# Tailwind v4 + shadcn/ui Audit — 2026-01-28

## Current state snapshot

- Tailwind: `tailwindcss@4.1.18` (`package.json`)
- PostCSS: `postcss.config.mjs` + `@tailwindcss/postcss`
- shadcn/ui config: `components.json` (New York style, CSS variables, `app/globals.css`)
- Animation baseline: removed (`tw-animate-css` no longer used)

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

Results (latest scan):

- Palette usage: **0** (PASS)
- Gradients: **0** (PASS)
- Arbitrary values: **0** (PASS)
- Missing semantic tokens: **0** (PASS)

Additional drift counters (manual grep, `app/`, `components/`, `lib/`, `hooks/`):

- `bg-muted/*` opacity usage: **186**
- `bg-primary/*` opacity usage: **132**
- `border-primary/*` opacity usage: **42**
- Legacy `brand` tokens (`bg/text/border/ring-brand*`): **0**
- Hardcoded white/black (incl `/opacity`): **34**
- Animations (`tw-animate`, `animate-in/out`): **0**
- Custom shadows (`shadow-[…]`): **0**
- Heavy shadows (`shadow-xl|shadow-2xl`): **9**

Reports (tooling):
- `cleanup/palette-scan-report.txt`
- `cleanup/arbitrary-scan-report.txt`
- `cleanup/semantic-token-scan-report.txt`

Full plan:
- `audit/TAILWIND_SHADCN_V4_AUDIT_2026-01-28.md`

## Findings (Phase 1)

## Tailwind Lane Phase 1 Audit — 2026-01-28

### Critical (blocks Phase 2)

- [ ] **Remove semantic opacity hacks** → kill `bg-muted/*`, `bg-primary/*`, `border-primary/*` across runtime UI → replace with semantic tokens (`bg-surface-subtle`, `bg-hover`, `bg-active`, `bg-selected`, `border-selected-border`)
- [x] **Remove legacy `brand` tokens** → replace with `primary` + semantic tokens
- [x] **Remove animations** → delete `tw-animate` usage in shadcn primitives and `app/shadcn-components.css`
- [x] **Remove custom shadows** → delete `shadow-[…]`
- [ ] **Downgrade heavy shadows** → replace `shadow-xl|2xl` in runtime UI

### High (do in Phase 2)

- [x] **Remove arbitrary values** → replace `*-[]` usage with theme tokens/utilities
- [ ] **Consolidate surface recipes** → stop copy/paste of `rounded-lg border bg-muted/30 p-*` patterns

### Deferred (Phase 3 or backlog)

- [ ] **Token diet** → reduce cognitive load in `app/globals.css` (dedupe/trim once stable)
- [ ] **Extend drift scans** → enforce “no semantic opacity hacks / no brand aliases / no animations” rules in CI

## Related audit (existing)

- `audit/AUDIT_TAILWIND_SHADCN_TWITTER_THEME_2026-01-24.md`

## Verification gates

```bash
pnpm -s styles:gate
pnpm -s typecheck
pnpm -s lint
pnpm -s test:e2e:smoke
```
