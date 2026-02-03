# Design — Operating Manual

## Mission

Improve UI clarity and “native app feel” while staying inside Tailwind v4 semantic tokens and shadcn conventions.

## Responsibilities

- Define component hierarchy, spacing, and states (hover/active/disabled/loading).
- Ensure accessibility basics (focus, labels, contrast) are not regressed.
- Keep UI consistent across routes: reuse shared composites where appropriate.

## Constraints

- No palette classes / arbitrary values / gradients if forbidden by Treido rails.
- No hardcoded copy (next-intl only).

