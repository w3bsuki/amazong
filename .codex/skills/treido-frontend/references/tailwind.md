# Tailwind v4 (Treido Rails)

This is not a Tailwind manual. It encodes Treido's "no drift" rules.

## Non-Negotiables

- Tailwind v4 only.
- No gradients.
- No arbitrary values (no `[...]`).
- No hardcoded colors / palette utilities (no `bg-blue-500`, no hex).
- Use semantic tokens as defined by the project (see `docs/DESIGN.md`).

## Source Of Truth (Use The Gate)

Run:

```bash
pnpm -s styles:gate
```

For triage without failing:

```bash
pnpm -s styles:scan
pnpm -s styles:scan:palette
pnpm -s styles:scan:arbitrary
pnpm -s styles:scan:tokens
```

## How To Fix Findings (By File)

- Fix violations by file (finish one file completely) to avoid endless incremental churn.
- Replace palette colors with semantic tokens.
- Replace arbitrary sizes with existing spacing/typography tokens (or remove the one-off design decision).
- Delete gradients rather than "tuning" them (Treido rule).

## Common Smells

- `bg-gradient-*`, `from-*`, `via-*`, `to-*`
- `h-[...]`, `w-[...]`, `px-[...]`
- `text-red-500`, `bg-slate-900`, etc.

## Practical Verification

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```
