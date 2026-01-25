# Design Tokens v2 — Audit & Rebuild Plan

> **Goal**: Clean up `app/globals.css`, establish coherent token system, fix ad-hoc semantic colors.

---

## Current State

| Section | Lines | Status |
|---------|-------|--------|
| `:root` (light mode) | ~20-135 | ✅ Twitter theme from tweakcn |
| `.dark` (dark mode) | ~138-200 | ✅ Twitter theme from tweakcn |
| `@theme inline` | ~203-280 | ⚠️ Bridges CSS→Tailwind, some bloat |
| `@theme` (semantic) | ~283-600 | ❌ Ad-hoc, inconsistent, needs overhaul |

### Problems

1. **Semantic status colors invented without rationale**
   ```css
   --color-success: oklch(0.60 0.18 145);  /* Where did these come from? */
   --color-warning: oklch(0.75 0.16 85);
   --color-error: oklch(0.55 0.25 27);
   --color-info: oklch(0.55 0.18 250);
   ```

2. **No dark mode for semantic colors** — only shadcn core vars have `.dark` overrides

3. **Inconsistent lightness/chroma** — tokens don't follow a scale

4. **100+ marketplace tokens** — many unused or redundant

5. **No WCAG contrast validation**

---

## Proposed Token Architecture

### Tier 1: Core (from Twitter theme — don't touch)
```
--background, --foreground, --card, --popover
--primary, --secondary, --muted, --accent
--border, --input, --ring
--destructive
```

### Tier 2: Status (needs redesign)
```
--color-success / --color-success-foreground
--color-warning / --color-warning-foreground  
--color-error / --color-error-foreground
--color-info / --color-info-foreground
```

### Tier 3: Marketplace (audit for usage)
```
--color-price-* (regular, sale, original, savings)
--color-condition-* (new, likenew, good, fair)
--color-rating, --color-wishlist, --color-verified
--color-shipping-free, --color-deal
```

### Tier 4: Surfaces (keep)
```
--surface-page, --surface-subtle, --surface-elevated
--surface-gallery, --surface-overlay
```

### Tier 5: Interactive (keep)
```
--selected, --hover, --active, --checked
--focus-ring
```

---

## Action Plan

### Phase 1: Inventory (this file)
- [ ] List all tokens in `@theme` block
- [ ] Mark which are actually used (grep codebase)
- [ ] Mark which have dark mode variants
- [ ] Mark WCAG contrast status

### Phase 2: Design New Palette
- [ ] Pick coherent oklch values for status colors
- [ ] Add light/dark variants
- [ ] Validate contrast ratios
- [ ] Document rationale

### Phase 3: Migration
- [ ] Create new token definitions
- [ ] Update components incrementally
- [ ] Run visual regression tests
- [ ] Remove dead tokens

---

## Token Inventory

### Status Colors (Current)

| Token | oklch | Hue | Used? | Dark variant? | Contrast? |
|-------|-------|-----|-------|---------------|-----------|
| `--color-success` | `0.60 0.18 145` | Green | ? | ❌ | ? |
| `--color-warning` | `0.75 0.16 85` | Yellow | ? | ❌ | ? |
| `--color-error` | `0.55 0.25 27` | Red | ? | ❌ | ? |
| `--color-info` | `0.55 0.18 250` | Blue | ? | ❌ | ? |

### Marketplace Colors (Current)

| Token | Used? | Notes |
|-------|-------|-------|
| `--color-verified` | ? | |
| `--color-shipping-free` | ? | |
| `--color-rating` | ? | |
| `--color-wishlist` | ? | |
| `--color-deal` | ? | |
| `--color-price-regular` | ? | |
| `--color-price-sale` | ? | |
| `--color-price-original` | ? | |
| `--color-price-savings` | ? | |
| `--color-condition-new` | ? | |
| `--color-condition-likenew` | ? | |
| `--color-condition-good` | ? | |
| `--color-condition-fair` | ? | |

---

## Proposed New Status Colors

TBD — need to:
1. Research Twitter's actual status colors (if any)
2. Or pick from a coherent oklch scale
3. Ensure 4.5:1 contrast on both light/dark backgrounds

---

## Notes

_Add findings here as we audit..._
