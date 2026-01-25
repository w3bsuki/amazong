# Tailwind Lane Phase 1 Audit — 2026-01-25

Scope: `app/[locale]/(main)/demo*` pages (token usage + Tailwind v4 + shadcn/ui theming).

### Critical (blocks Phase 2)
- [ ] Hardcoded colors + neutrals (`bg-white`, `bg-neutral-*`, `text-neutral-*`, `text-black`) → `app/[locale]/(main)/demo2/page.tsx`, `app/[locale]/(main)/demo3/page.tsx`, `app/[locale]/(main)/demo/page.tsx` → Replace with tokens (`bg-background`, `text-foreground`, `bg-surface-*`) or document as “design-only” pages.
- [ ] Arbitrary values (`text-[10px]`) → `app/[locale]/(main)/demo3/page.tsx` → Replace with tokenized type scale (`text-2xs`, `text-xs`, etc).
- [ ] Dynamic Tailwind class construction (`"bg-order-" + status`) can drop styles in Tailwind scan → `app/[locale]/(main)/demo3/page.tsx` → Use an explicit mapping object so `bg-order-*` classes exist as literals.

### High (do in Phase 2)
- [ ] Inline `style={{ background: "oklch(...)" }}` and `style={{ color: "oklch(...)" }}` bypass tokens → `app/[locale]/(main)/demo2/page.tsx`, `app/[locale]/(main)/demo3/page.tsx` → Promote these into `app/globals.css` tokens (light + dark), then consume via `bg-*`, `text-*`, `border-*`.
- [ ] Prefer dedicated semantic “status surfaces” over opacity derivation where contrast matters (e.g. alerts) → `app/globals.css` + demos → Add `--color-*-bg/--color-*-border/--color-*-text` if we want to fully ban `bg-success/10`-style usage.

### Deferred (Phase 3 or backlog)
- [ ] `bg-rating` used as a background needs a matching foreground token (or avoid using rating as a surface) → `app/[locale]/(main)/demo/page.tsx` → Prefer `text-rating`/`fill-rating` on icons; if a swatch is needed, add `--color-rating-foreground`.

### Notes / Evidence
- `pnpm -s exec node scripts/scan-tailwind-palette.mjs` → palette hits in `demo2`, `demo3` (0 gradients).
- `pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs` → arbitrary hits primarily in `demo3` (`text-[10px]` etc).
- `pnpm -s exec node scripts/scan-tailwind-semantic-tokens.mjs` → “order-” token issue detected in `demo3` (likely due to dynamic class construction).

### Reference Implementation
- `/demo/codex` → `app/[locale]/(main)/demo/codex/page.tsx` (token-only UI patterns + shadcn components).
