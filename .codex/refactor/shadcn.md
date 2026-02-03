# shadcn/ui Audit + Refactor Playbook

Goal: keep UI identical while deleting duplicate primitives and enforcing a strict boundary so “UI code” stops spreading.

## Hard boundary rules

- `components/ui/*` must be **primitive-only**:
  - no fetching
  - no app routing imports
  - no “business logic”
  - minimal dependencies (Radix, CVA, utilities)
- Route or product-specific UI belongs in `components/**` (composites) or route-private `app/**/_components`.
- Tailwind v4 tokens only (no palette/gradients/arbitrary values).

## Audit checklist

### 1) Inventory primitives and duplicates

- [ ] List `components/ui/*` primitives.
- [ ] Identify duplicate primitives (e.g. multiple Button-ish components).
- [ ] Identify “near duplicates”: same API, different styling; unify variants.

### 2) Boundary violations

- [ ] Find any `components/ui/*` importing `app/**`, `lib/data/**`, or route-private modules.
- [ ] Find primitives that ship app copy directly (must be next-intl driven by callers).

### 3) Variant consistency

- [ ] Ensure variants are implemented consistently (CVA pattern).
- [ ] Remove bespoke one-off class strings where a variant should exist.

### 4) Composition layer cleanup

- [ ] Identify composites that belong outside `components/` (route-private only).
- [ ] Identify shared composites missing a “public API” module boundary (stops random imports).

## “Search patterns” (manual audit)

```powershell
# Boundary violations: ui importing app/lib/data
rg -n --glob \"components/ui/**\" \"from 'app/|from \\\"app/|from 'lib/data|from \\\"lib/data\"

# Copy inside ui primitives (common smell)
rg -n --glob \"components/ui/**\" \"Sign in|Login|Buy|Sell|Add to cart\"
```

## Subagent prompt (copy/paste)

```text
Stack audit: shadcn/ui

Scope:
- components/ui/*

Tasks:
1) Inventory primitives and identify duplicates/near-duplicates.
2) Identify boundary violations (ui importing app/*, lib/data/*, route-private modules).
3) Identify styling drift (non-token Tailwind usage).
4) Propose a consolidation plan (delete/merge) that preserves API and visuals.
5) Provide 3 smallest safe refactor batches + verification commands.
```

