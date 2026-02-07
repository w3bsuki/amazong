# Phase 03 - Components and Styling Cleanup

## Objective

Shrink component duplication and enforce shadcn/Tailwind boundaries without UI regressions.

## Context7 docs used (date + links)

- Date: 2026-02-07
- https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/functions-and-directives.mdx
- https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/theme.mdx

## Checklist

- [ ] Enforce `components/ui/*` primitive-only contract.
- [ ] Move app-specific composites to `components/shared/*` or route-private `_components`.
- [ ] Resolve high-impact duplication clusters from `pnpm -s dupes`.
- [ ] Remove unused components found by `pnpm -s knip` after import verification.
- [ ] Rationalize Storybook file sprawl.
- [ ] Keep `styles:gate` clean.
- [ ] Run full gates and record output.

## Files touched

- Pending

## Verification output

- Pending

## Decision log

- Pending

## Done

- [ ] Phase 03 complete
