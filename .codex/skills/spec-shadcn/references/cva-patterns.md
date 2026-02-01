# CVA Patterns (class-variance-authority) - Audit Guide

CVA should reduce styling drift and keep variants predictable.

## What good CVA looks like

- a small set of variants with clear meaning:
  - `variant`: intent (default/secondary/destructive/etc.)
  - `size`: touch target + spacing
- sensible defaults via `defaultVariants`
- `compoundVariants` used for the few special combinations
- variant types exported and reused (avoid stringly typed calls)

## Smells to flag

- variant explosion (many props that are actually feature-specific)
- conditional className spaghetti outside CVA
- variants that encode layout decisions rather than component semantics
- primitives using palette colors or arbitrary values inside variant strings

## Token-safe variant guidance (Treido)

- use semantic tokens for colors:
  - `bg-background`, `bg-hover`, `bg-active`, `bg-selected`
  - `text-foreground`, `text-muted-foreground`
  - `border-border`, `ring-ring`
- prefer standardized radii:
  - `rounded-md` for default controls
  - `rounded-full` for pills/chips
- ensure touch targets:
  - sizes should map to `h-11` / `h-touch` patterns (no `h-[42px]`)

## Evidence collection tips

When a CVA issue is found, cite:
- the CVA definition line(s)
- the offending variant token(s)
- one or two call sites that demonstrate the misuse

