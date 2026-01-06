# Phase 11: UI/UX Polish (Pre-Launch) + V2 Redesign Backlog

This repo is already live on `treido.eu`. The priority is production-grade stability and consistency.
Use this plan to:

1) ship **small, verifiable UI/UX improvements** pre-launch, and
2) capture **larger redesign work** as a V2 backlog (post-launch or behind a feature flag).

## Rails (Do Not Break)

- No rewrites. No redesigns in the production push.
- No gradients. Flat cards (`border`, `rounded-md` max), no heavy shadows.
- Avoid arbitrary Tailwind values unless necessary; prefer existing tokens/classes in `app/globals.css`.
- Every non-trivial batch must pass:
  - `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## What “Tailwind v4 + shadcn perfection” means here

**Pre-launch definition (practical):**
- Semantic tokens drive colors/spacing/typography (not hardcoded palette values).
- Consistent density (mobile `gap-2`, desktop `gap-3`), consistent radii, consistent borders.
- Predictable interactive states (hover/active/focus) and no surprising animations.
- A11y baseline: headings, labels, focus rings, touch targets.

**V2 definition (design work):**
- Product page + product card layouts can be rethought, but that is a redesign and should not be mixed into launch stabilization.

## Track A — Pre‑Launch UI/UX Polish (small batches)

### A1) Theming + tokens alignment (shadcn + Tailwind v4)
- [ ] Confirm shadcn tokens exist + are used consistently (`--background`, `--foreground`, `--primary`, etc) in `app/globals.css`.
- [ ] Remove remaining hardcoded palette usage in **high-traffic** components first.
- [ ] Prefer `bg-muted/…`, `text-muted-foreground`, `border-border`, and repo semantic tokens over `text-blue-600` etc.

Verification: typecheck + E2E smoke.

### A2) Motion policy (“clean webapp”)
- [ ] Inventory animation/motion usage (Framer Motion, `animate-*`, `transition-*`).
- [ ] For non-essential motion: remove or gate with `motion-safe:` / `prefers-reduced-motion`.
- [ ] Ensure hover/active transitions are subtle (no bounce/scale gimmicks).

### A3) Product surfaces (polish without redesign)
Focus: remove UI drift, improve clarity, keep layout intact.
- [ ] Product page: spacing, typography hierarchy, consistent buttons, consistent sections.
- [ ] Product cards: consistent image ratios, price typography, seller line, CTA states.
- [ ] Reviews block: consistent heading + spacing; no broken locale strings.

### A4) Plans page UX (no redesign)
- [ ] Alerts/toasts: consistent variants, clear copy, and no “success confetti”.
- [ ] Upgrade/downgrade flows: ensure disabled/loading states are consistent and accessible.

### A5) Forms UX baseline
- [ ] Field labels always present; errors are consistent and readable.
- [ ] Inputs have consistent heights (`h-10`/`h-12` tokens), consistent focus ring.
- [ ] “Remember me” / toggles have correct hit targets.

## Track B — V2 Redesign Backlog (post‑launch / behind feature flag)

This is where “better than eBay” lives. Keep it out of the launch push unless it’s gated.

For each item:
- Add screenshots (current + desired), and define success criteria.
- Estimate risk and split into slices.

### B1) Product page V2
- Goals: clearer hierarchy, less clutter, stronger trust signals, tighter spacing.
- Non-goals: new architectural layers, gradients, heavy shadows.

### B2) Product card V2
- Goals: scannability (price/condition/location), predictable interaction, consistent density.

### B3) Plans page V2
- Goals: clearer plan comparison, clearer upgrade path, fewer surprises.

## How we work this plan (repeatable loop)

1) Pick **one** small batch from Track A (1–3 files).
2) Implement with minimal styling/behavior changes.
3) Verify: `tsc` + `e2e:smoke` (+ targeted spec if touched flow is auth/checkout/seller).
4) Record what changed + how verified in the PR/notes.

