# Mobile landing-page audit (http://localhost:3000/bg)

## Snapshot
- Tailwind: v4 tokens are defined in `app/globals.css` (e.g. `--spacing-touch`, semantic colors like `bg-background`, CTA tokens like `bg-cta-trust-blue`).
- shadcn/ui: used via `components/ui/*` primitives (e.g. `Button`, `Select`, `Input`, `Badge`) and variants are in use.
- Font pipeline: Inter via `next/font` -> CSS variable -> Tailwind `--font-sans`.

## Measured mobile issues (390×844 @ dpr2)
- Tap targets: originally many UI controls were below 44×44; after fixes, the only remaining "failures" are skip links positioned off-screen (expected).
- Typography: most text is 14px/16px; there is still some 11px and 9px usage (badges/microcopy). Keep 9–11px limited to non-critical badges.

## TODO (prioritized)

### P0 — Touch targets (WCAG 2.1 AA: 44×44)
- Keep all *interactive* elements at `min-h-touch`/`min-w-touch` (or `h-touch`/`w-touch`) unless there’s a strong reason.
- Audit any remaining icon-only controls and ensure they use shadcn `Button` sizes that hit 44px (e.g. `size="icon-xl"`).

### P0 — Mobile navigation + product feed controls
- Mobile tab/pill controls: keep at `h-touch` and avoid label text smaller than `text-xs`.
- Product-card corner actions (wishlist/cart): keep 44px hit area even if icon stays 14–16px.

### P1 — Typography consistency (mobile readability)
- Set a floor for interactive labels: avoid 10px/11px on tappable controls; prefer `text-xs` (12px) or `text-sm` (14px).
- Reserve `text-2xs` (10px) and `text-[9px]` strictly for small badges (unread count, “%” bubble), not navigation labels.
- Review any `text-tiny` (11px) usage: OK for legal/helper microcopy; avoid it for primary product info.

### P1 — Content hierarchy (scanability)
- Product cards: ensure clear hierarchy (title > price > meta). Avoid excessive uppercase + wide tracking for critical info.
- Tabs + category rail: keep labels readable (12px+) and avoid truncation for short category names.

### P2 — Token discipline (Tailwind v4 best practices)
- Prefer semantic utilities backed by `@theme` tokens (`bg-background`, `text-foreground`, `h-touch`, etc.) over raw pixel utilities.
- If you need a non-standard size repeatedly, add it as a token in `app/globals.css` instead of scattering `h-[52px]` / `min-w-[14px]`.

## How to re-run the audit locally
- Run: `pnpm -s exec node scripts/mobile-audit.mjs http://localhost:3000/bg`
- Output is written to `cleanup/mobile-audit-YYYYMMDD-HHMMSS/` (screenshots + report.json).
