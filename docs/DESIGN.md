# Design System — Dream Weaver Aligned

Use this file for production UI decisions. It is intentionally visual-first, not process-first.

## Source of Truth

For UI/UX tasks, read these in order:

1. `designs/ui-ux-dream-weaver/UI_UX_GUIDE.md` (visual benchmark)
2. `designs/ui-ux-dream-weaver/design.md` (condensed style philosophy)
3. This file (`docs/DESIGN.md`) for production constraints and implementation mapping

## Official Tailwind v4 + shadcn Contract

This repo should follow official mechanics, not v3 habits:

- Tailwind v4 theme values belong in CSS (`@theme` / `@theme inline`), not legacy config extension.
- shadcn should run with CSS variables enabled (`components.json` -> `cssVariables: true`).
- Dark mode should use class-based strategy and `next-themes` integration.
- Utility classes must be statically detectable by Tailwind; avoid dynamic string class generation.

Primary docs:

- Tailwind v4 theme variables: https://tailwindcss.com/docs/theme
- Tailwind class detection: https://tailwindcss.com/docs/detecting-classes-in-source-files
- Tailwind dark mode: https://tailwindcss.com/docs/dark-mode
- shadcn + Tailwind v4: https://ui.shadcn.com/docs/tailwind-v4
- shadcn theming: https://ui.shadcn.com/docs/theming
- shadcn dark mode (next-themes): https://ui.shadcn.com/docs/dark-mode/next

In this repo:

- Raw tokens: `app/styles/tokens.css`
- Tailwind bridge: `app/styles/theme-bridge.css` (`@theme inline`)
- Design scales: `app/styles/marketplace.css`
- Entry CSS: `app/globals.css`

## Dream Weaver v3 -> Production v4 Mapping

Dream Weaver examples include many v3-style arbitrary utilities (`text-[13px]`, `w-[52px]`, `h-[56px]`).
Use the same visual intent, but map to production tokens/utilities:

- `text-[13px]` -> `text-compact` (or `text-body` when needed)
- `text-[10px]` -> `text-2xs`
- `w-[52px] h-[52px]` -> `size-(--size-category-tile)`
- `h-[56px]` -> `h-(--spacing-bottom-nav)`
- raw spacing brackets -> existing spacing + marketplace size tokens

If a visual spec cannot be expressed cleanly, add/adjust a token once, then reuse it.

## Visual North Star

Treido should feel like a premium, content-first marketplace:

- Product media is the hero, not chrome.
- Flat surfaces, tight typography, minimal decorative noise.
- Monochrome base with restrained accent usage.
- Fast, direct interactions (no theatrical motion).

## Non-Negotiable Aesthetic Rules

- No gradient backgrounds, glow, blobs, or decorative hero clutter.
- No shadow-heavy cards or unnecessary borders around product tiles.
- Keep product cards information-light: `price -> title -> seller`.
- Maintain editorial portrait card imagery (`3/4`) for feed rhythm.
- Avoid noisy overlays and stacked badges.

## Shadcn Usage Policy

shadcn is primitive infrastructure, not a visual language.

- Do not ship shadcn default look-and-feel unchanged.
- Every reused primitive must be styled to Treido patterns/tokens.
- Prefer composed marketplace components over ad hoc primitive assembly.

## Production Implementation Contracts

### Product cards

- Flat card shell (`border-0`, `shadow-none`, transparent or neutral surface).
- Portrait media ratio (`3/4`) on mobile feed cards.
- Minimal text stack and small metadata.
- Wishlist/action controls should stay visually secondary.

### Header and sticky chrome

- Compact, calm, and readable with subtle containment.
- Keep icon stroke weight light and consistent.
- Preserve clear primary action hierarchy; do not over-accent navigation.

### Bottom nav (mobile)

- 5-tab structure with strong central sell affordance.
- Legible labels (`text-2xs` is acceptable in current contract).
- Active state should be obvious without adding visual noise.

### Forms (sell flow and similar)

- Flat input surfaces with consistent spacing and label treatment.
- Chip selectors should share one visual language across steps.
- Sticky submit bars should be simple and high-contrast.

## Tokens and Theming

Token source of truth:

1. `app/styles/tokens.css` (`:root` + `.dark` raw values)
2. `app/styles/theme-bridge.css` (`--color-*` mapping for utilities)
3. `app/styles/marketplace.css` (scale + component aliases)
4. `app/globals.css` (imports only)

Use semantic utilities only in components.

## What `styles:gate` Enforces

- No palette utility classes (`*-gray-*`, `*-blue-*`, etc).
- No gradients.
- No arbitrary Tailwind values in app/components.
- No raw hex/`oklch(...)` in app/components.
- No banned token-alpha hacks defined in scanner rules.

## UI Quality Checklist (Reject if Any Fail)

- UI feels content-first, not component-library-first.
- Product cards are flat and calm; media remains dominant.
- Typography hierarchy is tight and intentional, not oversized.
- No decorative visual noise.
- Key CTAs are clear, but accent usage remains restrained.
- Mobile layout is comfortably scannable at 375px width.

## Safe Workflow for UI Tasks

1. Start from Dream Weaver patterns, not generic shadcn defaults.
2. Map the pattern to existing Treido components/tokens.
3. Implement in small batches.
4. Run `pnpm -s styles:gate`.
5. If behavior changes, run core verification (`typecheck`, `lint`, `test:unit`).

## Key Files

- `designs/ui-ux-dream-weaver/UI_UX_GUIDE.md`
- `designs/ui-ux-dream-weaver/design.md`
- `app/styles/tokens.css`
- `app/styles/theme-bridge.css`
- `app/styles/marketplace.css`
- `components/shared/*`
- `components/layout/*`

*Last verified: 2026-02-26*
