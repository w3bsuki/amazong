# Tailwind v4 Decision Tree

Quick decision framework for auditing Tailwind usage in Treido.

## Color Decision Tree

```
Is it a color utility (bg-*, text-*, border-*, ring-*)?
├── Is it a semantic token (bg-background, text-foreground)?
│   └── ✅ PASS
├── Is it a palette color (bg-gray-100, text-blue-600)?
│   └── ❌ FAIL → Replace with semantic token
├── Is it a gradient (bg-gradient-to-*, from-*, via-*, to-*)?
│   └── ❌ FAIL → Replace with solid surface token
├── Is it an arbitrary color (bg-[#...], bg-[oklch(...)])?
│   ├── Is it in color-swatches.tsx?
│   │   └── ✅ PASS (exception for product colors)
│   └── ❌ FAIL → Replace with semantic token
└── Is it an opacity hack (bg-primary/10, text-muted/50)?
    └── ❌ FAIL → Replace with dedicated state token
```

## Spacing Decision Tree

```
Is it a spacing utility (p-*, m-*, gap-*, space-*)?
├── Uses Tailwind scale (p-4, gap-6, m-2)?
│   └── ✅ PASS
├── Uses arbitrary value (p-[23px], m-[1.5rem])?
│   └── ❌ FAIL → Use nearest scale value or extend theme
└── Uses fractional (p-1.5, gap-2.5)?
    └── ✅ PASS (valid scale values)
```

## Sizing Decision Tree

```
Is it a sizing utility (w-*, h-*, min-*, max-*)?
├── Uses Tailwind scale (w-64, h-12)?
│   └── ✅ PASS
├── Uses responsive fraction (w-1/2, w-full)?
│   └── ✅ PASS
├── Uses arbitrary pixel (w-[347px], h-[60px])?
│   └── ❌ FAIL → Use scale/responsive layout (or escalate to a shared component)
└── Uses arbitrary calc (w-[calc(100%-2rem)])?
    └── ❌ FAIL → Use layout primitives; do not ship arbitrary values
```

## Typography Decision Tree

```
Is it a typography utility (text-*, font-*, leading-*)?
├── Uses scale (text-sm, text-lg, text-2xl)?
│   └── ✅ PASS
├── Uses arbitrary size (text-[13px], text-[1.125rem])?
│   └── ❌ FAIL → Use nearest scale value
├── Uses semantic color (text-foreground, text-muted-foreground)?
│   └── ✅ PASS
└── Uses palette color (text-gray-600, text-blue-500)?
    └── ❌ FAIL → Replace with semantic token
```

## Border Radius Decision Tree

```
Is it a radius utility (rounded-*)?
├── Uses scale (rounded, rounded-md, rounded-lg, rounded-full)?
│   └── ✅ PASS
└── Uses arbitrary (rounded-[10px], rounded-[50%])?
    └── ❌ FAIL → Use scale value
```

## Severity Classification

| Pattern | Severity | Reason |
|---------|----------|--------|
| Gradient utilities | Critical | Violates core rail |
| Palette colors | Critical | Breaks theming/dark mode |
| Hardcoded hex/oklch | High | Bypasses design system |
| Arbitrary values (any) | High | Forbidden pattern in Treido rails |
| Opacity on tokens | High | Drifts per theme; use state tokens |

## Quick Regex Checks

```bash
# Gradients
rg "bg-gradient-to-|\\bfrom-|\\bvia-|\\bto-" app components

# Palette colors  
rg "(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d" app components

# Arbitrary values
rg "\\[#[0-9a-fA-F]|\\[\\d+px\\]|\\[\\d+rem\\]" app components

# Opacity hacks
rg "(bg|text|border)-(primary|muted|accent)/\\d" app components
```

## Token Reference

**Surfaces**: `bg-background`, `bg-card`, `bg-surface-subtle`, `bg-surface-elevated`
**Text**: `text-foreground`, `text-muted-foreground`, `text-card-foreground`
**Borders**: `border-border`, `border-input`
**States**: `bg-hover`, `bg-active`, `bg-selected`
**Status**: `text-destructive`, `bg-success`, `bg-warning`

## Escalation Rule

If the only way to match the design is to add a new token or ship an exception:
- Escalate with 2-3 token-safe alternatives and a recommended default.
- Do not suggest `tailwind.config.*` changes (Tailwind v4 is CSS-first; tokens live in `app/globals.css`).
