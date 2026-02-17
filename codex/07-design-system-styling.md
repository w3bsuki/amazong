# Design System And Styling Audit

## Scope

- `app/globals.css`
- `app/utilities.css`
- `app/shadcn-components.css`
- `components/ui/*`
- style gate scripts in `scripts/scan-tailwind-*.mjs`
- `docs/DESIGN.md`

## Current State Summary

- Semantic token discipline exists and is actively gated.
- Styling system is robust but has high maintenance overhead from token and scanner duplication.

## Findings

## P0

- Scanner scripts (`scan-tailwind-semantic-tokens`, `scan-tailwind-token-alpha`, `scan-tailwind-palette`, `scan-tailwind-arbitrary`) duplicate file traversal and report logic.

## P1

- Token surface in `app/globals.css` is broad and hard to evolve safely as one giant block.
- Utility classes in `app/utilities.css` include repeated container/safe-area patterns that can be normalized.

## P2

- Primitive layer in `components/ui/*` appears largely clean and domain-logic-free; preserve this boundary.

## Simplification Targets

1. Build shared scanner core for style gates.
2. Modularize token files by theme/domain while preserving existing semantic names.
3. Normalize utility patterns through shared variables/mixins.

## Risks

- Token refactors can cause subtle visual regressions if class names/computed values drift.
- Scanner consolidation can accidentally weaken enforcement if parity checks are not strict.

## Verification Requirements

- `pnpm -s styles:gate`
- visual QA on home/auth/sell/account/chat critical surfaces

## Success Criteria

- Fewer duplicated scanner implementations.
- Token definitions easier to maintain with same runtime semantics.
- Zero drift in visual identity and token contracts.
