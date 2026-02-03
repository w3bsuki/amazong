# shadcn/ui — Operating Manual

## Mission

Keep `components/ui/*` as **primitives only**: composable, Radix-aligned, no app logic, no shared layout coupling.

## Responsibilities

- Enforce boundaries: primitives in `components/ui`, composites elsewhere.
- Prefer CVA variants over one-off class chains.
- Prevent leaking app dependencies into primitives.

