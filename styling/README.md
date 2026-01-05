# Treido Styling System

> **Purpose**: Single source of truth for UI styling patterns.  
> **Stack**: Tailwind CSS v4 + shadcn/ui + OKLCH color system

This folder contains the definitive styling rules for the marketplace UI.
When in doubt, reference these files before writing new component styles.

---

## Files

| File | Purpose |
|------|---------|
| [STYLE_GUIDE.md](./STYLE_GUIDE.md) | **Core styling rules** — typography, spacing, colors, components |
| [PATTERNS.md](./PATTERNS.md) | **Approved patterns** — copy-paste examples from good components |
| [ANTI_PATTERNS.md](./ANTI_PATTERNS.md) | **What NOT to do** — common mistakes and fixes |
| [REFACTOR_PLAN.md](./REFACTOR_PLAN.md) | **Cleanup tasks** — prioritized list of styling debt |

---

## Quick Reference

```
Typography:    text-sm (14px body), text-base (16px prices), text-xs (12px meta)
Spacing:       gap-2 (8px tight), gap-3 (12px standard), gap-4 (16px sections)
Touch:         h-6 (24px min), h-8 (32px standard), h-9 (36px primary CTA)
Radius:        rounded-sm (2px), rounded-md (4px max for cards)
Shadows:       shadow-none (default), shadow-sm (hover), shadow-md (modals only)
Colors:        Use semantic tokens from globals.css, never hardcode hex/oklch
```

---

## The Golden Rule

> **If a pattern exists in `components/ui/*.tsx` or a good reference component, use it.**
> **Don't invent new styling — copy from approved patterns.**

---

## Before You Style

1. Check if shadcn/ui has a component for your use case
2. Look for an existing pattern in `components/shared/` or `components/sections/`
3. Reference `globals.css` for available tokens
4. Follow the rules in `STYLE_GUIDE.md`

If nothing fits, add a new pattern to `PATTERNS.md` after review.

---

## Cleanup Workflow (Quick)

- Regenerate reports:
	- `pnpm -s exec node scripts/scan-tailwind-palette.mjs`
	- `pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs`
- Execute batches using [REFACTOR_PLAN.md](./REFACTOR_PLAN.md)
