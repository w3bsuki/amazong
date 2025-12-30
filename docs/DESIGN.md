# Design System

> ⚠️ **This file has been moved!**
> 
> The complete design system documentation is now at:
> **[docs/design-system/DESIGN.md](./design-system/DESIGN.md)**

---

## Quick Links

- **[Complete Design Spec](./design-system/DESIGN.md)** — Typography, spacing, colors, components
- **[Tokens Reference](./design-system/tokens.md)** — All CSS variables
- **[UI Patterns](./design-system/patterns.md)** — Reusable patterns
- **[Screen Recipes](./design-system/recipes.md)** — Page-level guidance
- **[Audit Tasks](./design-system/AUDIT_TASKS.md)** — Current fixes needed

---

## Summary

```
Stack:        Tailwind v4 + shadcn/ui + OKLCH
Philosophy:   Dense · Flat · Fast · Trustworthy · Mobile-first
Typography:   14px body, 16-18px prices, 12px meta, 10px badges
Spacing:      gap-1.5 mobile, gap-3 desktop (4px grid)
Touch:        24px min, 32px standard, 40px max primary CTA
Radius:       2-4px sharp (never >6px on cards)
Shadows:      none default, shadow-sm hover, shadow-md modals
Motion:       none default, ≤120ms opacity/translate only
```
    <h3 className="text-sm line-clamp-2">{title}</h3>
    <p className="text-base font-semibold text-price-sale">${price}</p>
    <p className="text-xs text-muted-foreground">{meta}</p>
  </div>
</article>
```

**Grid:**
- Mobile: 2 columns, `gap-2`
- Tablet: 3-4 columns, `gap-3`
- Desktop: 4-6 columns, `gap-3`

**List row alt (mobile speed):** image `w-24`, text stack with title/price/meta, right-side pill for status or bookmark.

---

## Forms

```tsx
// Input
<Input className="h-8 text-sm" />

// Label
<Label className="text-sm font-medium" />

// Helper text
<p className="text-xs text-muted-foreground" />
```

**Mobile:** stack labels above inputs; keep helper text single line or collapse into `Tooltip`/`Accordion` for advanced fields.

**Validation:** inline, no blocking modals; errors use `text-error` with `text-xs` and 4px top margin.

---

## Accessibility (Practical)

Target **WCAG 2.2 AA** with marketplace pragmatism:

| Requirement | Implementation |
|-------------|----------------|
| Touch targets | 24px minimum (h-6), 28-32px standard |
| Contrast | 4.5:1 for text, 3:1 for UI |
| Focus | 2px ring, `ring-brand` |
| Keyboard | Tab navigation works |

**Skip:** Complex ARIA, skip links, keyboard shortcuts, live regions.

**Focus clarity:** ring visible on dark and light surfaces; avoid relying on color-only cues—use icons for status.

---

## Anti-Patterns

❌ Don't:
- Shadows heavier than `shadow-sm` on cards
- Touch targets over 36px (h-9) except heroes
- Gradients anywhere
- Rounded corners over 6px on cards
- Body text under 12px
- Color-only indicators (add icons)
- Arbitrary values (`h-[42px]`, `text-[13px]`)

✅ Do:
- Flat, solid colors
- Dense spacing (p-2, gap-2)
- Sharp corners (rounded-md max)
- Consistent 4px grid
- Semantic color tokens

---

## Motion

- Default: no animation / transition for taps; instant state changes.
- Allowed: opacity or translateY(1-2px) ≤120ms for toasts/overlays if needed for clarity.
- Disallowed: spring/bounce, long loaders, skeleton shimmer; use static placeholders.

---

## Mobile Playbook (Temu-like efficiency, cleaner visuals)

- **Above the fold:** sticky search, category chip scroller (`h-7` pills), quick filters in a bottom sheet.
- **Product density:** 2-up grid with `gap-2`; show price, shipping badge, rating count; truncate title to 2 lines.
- **Actions:** one primary CTA (Add/Save) visible; secondary actions tucked into `DropdownMenu` or long-press drawer.
- **Filters/Sort:** mobile bottom sheet with large `h-8` rows and toggles; desktop left rail with checkboxes and range inputs.
- **Detail pages:** gallery with swipe; info blocks as border-separated sections with `gap-2`; sticky add-to-cart bar.
- **States:** loading uses static gray blocks (no shimmer); errors use inline banners with retry.

---

## Desktop Scaling

- Increase white space to `p-4` on shell; keep components dense.
- Use 4–6 column grids; persist filters in left rail; add secondary column for promos/recs.
- Table/list views: `text-base` body allowed; row heights 48–56px only for data tables; otherwise 32–36px.

---

## Pattern Library (seed)

- **Page shell:** sticky top search + category tabs; optional bottom action bar on mobile.
- **Filter bar:** mobile bottom sheet, desktop horizontal bar with quick pills and advanced drawer.
- **List row:** image left (96–112px), text stack, right badges/actions.
- **Card:** border, `p-2`, `rounded-md`, image top, text stack, tertiary meta.
- **Action bar:** single primary + ghost secondary; collapse extras into menu.
- **Form section:** stacked labels, helper text `text-xs`, section dividers using `border-border`.

---

## Quick Reference

```
Buttons:    h-7 (28px) → h-8 (32px) → h-9 (36px)
Inputs:     h-8 (32px)
Icons:      size-5 (20px) → size-6 (24px)
Cards:      p-2, rounded-md, border, no shadow
Text:       text-sm (body), text-base (prices)
Spacing:    gap-2 (tight), gap-3 (standard)
```
