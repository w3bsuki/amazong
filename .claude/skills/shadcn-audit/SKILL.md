---
name: shadcn-audit
description: shadcn/ui audit for this repo (components/ui primitives, Radix usage, token discipline). Triggers on "SHADCN:" prefix and shadcn-related hygiene work.
version: 1.0.0
---

# shadcn/ui Audit (Primitives + Tokens)

Use this skill to keep `components/ui/**` clean (primitives only) and ensure shadcn usage stays consistent with the design system.

## Entry Criteria (ask if missing)

- Scope: a component/folder, or “audit all components/ui usage”
- Goal: add a primitive, fix drift, or review existing primitives

## On Any "SHADCN:" Prompt

1. Load canonical rules:
   - `docs/FRONTEND.md` (boundaries)
   - `docs/DESIGN.md` (tokens + styling rails)
2. Enforce primitives-only in `components/ui/**`:
   - No feature logic, no app hooks, no data fetching, no route imports.
3. Token discipline:
   - Prefer semantic tokens (`bg-background`, `text-foreground`, `border-border`) over palette classes.
   - No gradients; no “glow” styling; no arbitrary values unless unavoidable.
4. Composition rules:
   - Composites belong in `components/shared/**` or route-private `_components/**`.
   - Prefer editing the primitive over duplicating variants elsewhere.
5. Output findings + recommended fixes in small batches (1–3 files).

## Helpful Scans (examples)

```bash
rg -n \"@/components/ui/\" app components -S
rg -n \"from '@/app/|from '@/hooks/\" components/ui -S
rg -n \"\\b(bg|text|border)-(zinc|slate|gray|red|green|blue|yellow)-\" components/ui -S
```

## Output Format

```markdown
## shadcn Audit — {date}

### Critical (must fix)
- [ ] Issue → File → Fix

### High
- [ ] Issue → File → Fix
```

## Examples

### Example prompt
`SHADCN: audit components/ui/button for token usage`

### Expected behavior
- Verify primitives-only usage in components/ui.
- Check token usage and styling rails.
- Report findings using the output format.
