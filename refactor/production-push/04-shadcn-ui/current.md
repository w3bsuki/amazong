# 04 — shadcn/ui: Current State

---

## Configuration

```json
{
  "style": "new-york",
  "rsc": true,
  "tailwind": { "baseColor": "neutral", "cssVariables": true },
  "iconLibrary": "lucide",
  "aliases": {
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "hooks": "@/hooks"
  },
  "registries": { "@shadcnblocks": "...", "@shadcn-studio": "..." }
}
```

---

## Primitive Inventory (34 components in `components/ui/`)

accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button, card, checkbox, command, dialog, drawer, dropdown-menu, hover-card, icon-button, input, label, pagination, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, slider, switch, table, tabs, textarea, toggle-group, tooltip

---

## Customization Patterns

### CVA (class-variance-authority)
All variant-driven components use CVA for type-safe variants:
```ts
const buttonVariants = cva("...", {
  variants: {
    variant: { default, destructive, outline, secondary, ghost, link, black, brand },
    size: { default, sm, lg, icon }
  }
});
```

### Treido-Specific Variants
`button.tsx` includes non-standard variants:
- `black` — dark button for CTAs
- `brand` — brand-colored button

These are Treido additions layered into the shadcn primitive.

### MarketplaceBadge
Wraps shadcn `Badge` with 30+ marketplace-specific variants:
- Condition: new, likenew, good, fair, used, refurb
- Shipping, stock, promoted, sponsored, trust
- Two-tier: SOLID + SUBTLE rendering

### CSS Overrides
Some component customizations live in `app/shadcn-components.css` using selector-based tweaks. Others are inline in TSX. Not always clear where changes should go.

---

## Pain Points

1. **Primitives have domain logic:** `button.tsx` includes `black` and `brand` variants that are Treido-specific, blurring the line between primitive and composite
2. **Override location confusion:** CSS tweaks split between `shadcn-components.css` and inline TSX — no clear rule for which approach to use
3. **`data-slot`** usage is inconsistent — some components use it for CSS targeting, others don't
4. **No documented API contract** — no doc says "these are the allowed variants/sizes for each primitive"
5. **icon-button.tsx** extends button — should this be in `ui/` or `shared/`?
