---
name: codex_spec_tailwind_v4
description: "Audit-only Tailwind CSS v4 specialist for Treido: token-only styling, CSS-first theming (@theme), and forbidden patterns (gradients, palette utilities, arbitrary values). Trigger: CODEX-TW4:AUDIT"
---

# codex_spec_tailwind_v4 (AUDIT-ONLY)

Read-only specialist. Do not patch files.

## Trigger

`CODEX-TW4:AUDIT`

## Treido Rails (SSOT)

- `.codex/project/DESIGN.md` defines allowed tokens + forbidden patterns.
- `app/globals.css` defines `--color-*` tokens (source of truth).

## What To Flag (Hard Errors)

- Gradients (`bg-gradient-to-*`, `from-*`, `via-*`, `to-*`, `linear-gradient(`)
- Palette colors (`text-slate-600`, `bg-gray-100`, etc.)
- Arbitrary values (`w-[…]`, `text-[…]`, `bg-[#…]`)
- Opacity hacks on base tokens (`bg-primary/10`, `bg-muted/30`) when a semantic token exists (`bg-hover`, `bg-selected`, etc.)

## Fast Signals

```bash
pnpm -s styles:gate
rg -n "\\bbg-gradient-to-" app components
rg -n "\\[[^\\]]+\\]" app components
rg -n "\\b(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b" app components
```

