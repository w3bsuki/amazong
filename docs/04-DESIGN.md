# 04-DESIGN.md — Treido Design System

> **SSOT for UI/UX + Tailwind v4 + shadcn/ui.** Premium = restraint.

| Scope | Visual design, tokens, components |
|-------|-----------------------------------|
| Audience | AI agents, developers |
| Type | Concept |
| Stack | Tailwind v4 + shadcn/ui + Radix |
| Theme | Twitter Blue (oklch) |

---

## Quick Answers

| Question | Answer |
|----------|--------|
| What color is primary? | Twitter Blue `oklch(0.65 0.17 230)` |
| What's the default radius? | `6px` (`--radius: 0.375rem`) |
| Can I use `bg-primary/10`? | **No.** Use `bg-hover` or `bg-selected` |
| Can I use `bg-gray-100`? | **No.** Use `bg-muted` |
| Where are tokens defined? | `app/globals.css` `:root` and `.dark` |
| Where are primitives? | `components/ui/*` |
| Gate command? | `pnpm -s styles:gate` |

---

## Part 1: Design Philosophy

### Premium = Restraint

**Premium feels calm. Cheap feels busy.**

- Every element must earn its place
- Spacing is a design tool, not an afterthought
- Alignment creates invisible structure users feel, not see
- Consistency builds trust. Surprise breaks it.

**Premium tells:**
- Generous whitespace
- Predictable patterns (no cognitive load)
- Quiet confidence (no shouting)
- Polished details (every pixel matters)

**Cheap tells:**
- Cramped layouts
- Inconsistent spacing
- Visual noise competing for attention
- Missing states (hover, loading, empty)

---

## Part 2: Visual Hierarchy

### The 5 Levers

| Lever | Effect | Example |
|-------|--------|---------|
| **Size** | Larger = more important | Page title > section title |
| **Weight** | Bolder = emphasis | Price > description |
| **Color** | Contrast = attention | Primary CTA > secondary |
| **Position** | Top/left = first | Key info above fold |
| **Spacing** | Isolation = importance | CTA with breathing room |

**Rule:** Pick 1-2 levers per element. Never all 5.

**Squint Test:** Blur vision. Can you identify the focal point? If not, hierarchy is broken.

---

## Part 3: Tailwind v4 Token System

### Token Architecture

```
CSS Variables (:root/.dark) → @theme inline → Tailwind Classes
     --primary              → --color-primary → bg-primary
```

| Tier | Purpose | Use |
|------|---------|-----|
| Primitive | Raw oklch values | Never directly |
| Semantic | CSS vars (`--primary`) | Via Tailwind classes |
| Component | `bg-card`, `text-muted-foreground` | Always |

### Forbidden Patterns ❌

| Pattern | Example | Fix |
|---------|---------|-----|
| Palette colors | `bg-gray-100`, `text-blue-500` | `bg-muted`, `text-primary` |
| Gradients | `bg-gradient-to-r` | Solid `bg-muted` |
| Arbitrary values | `w-[560px]`, `text-[13px]` | `w-full`, `text-sm` |
| Opacity modifiers | `bg-primary/10`, `bg-muted/30` | `bg-hover`, `bg-selected` |
| Hardcoded colors | `#ff0000`, `oklch()` in TSX | Semantic token |
| White/black | `bg-white`, `text-black` | `bg-background`, `text-foreground` |

**Exception:** Product color swatches in `components/shared/filters/color-swatches.tsx` may use hex.

### Surface Tokens

| Token | Class | Usage |
|-------|-------|-------|
| Page base | `bg-background` | Root body |
| Subtle tint | `bg-surface-subtle` | Section bands |
| Cards | `bg-card` | Content containers |
| Elevated | `bg-surface-elevated` | Sticky elements |
| Popover | `bg-popover` | Dropdowns, sheets |
| Gallery | `bg-surface-gallery` | Dark image backgrounds |

### Text Tokens

| Token | Class | Usage |
|-------|-------|-------|
| Primary | `text-foreground` | Main text |
| Secondary | `text-muted-foreground` | Supporting text |
| On cards | `text-card-foreground` | Card content |
| Brand accent | `text-primary` | Links, highlights |

### Interactive State Tokens

| State | Background | Border |
|-------|------------|--------|
| Default | `bg-background` | `border-border` |
| Hover | `bg-hover` | `border-hover-border` |
| Active | `bg-active` | — |
| Selected | `bg-selected` | `border-selected-border` |
| Focus | — | `ring-2 ring-ring` |

### Status Tokens

| Status | Background | Text |
|--------|------------|------|
| Success | `bg-success` | `text-success-foreground` |
| Warning | `bg-warning` | `text-warning-foreground` |
| Error | `bg-error` | `text-error-foreground` |
| Info | `bg-info` | `text-info-foreground` |

---

## Part 4: Spacing System

### Base Unit: 4px

| Class | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | Icon-text gaps |
| `gap-2` | 8px | Related items |
| `gap-3` | 12px | Form fields |
| `gap-4` | 16px | Card padding |
| `gap-6` | 24px | Section padding |
| `gap-8` | 32px | Major sections |

### Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `h-touch` | 40px | Standard buttons |
| `h-touch-lg` | 48px | Primary CTAs |
| `h-touch-sm` | 36px | Compact buttons |
| `--spacing-header` | 48px | Header height |
| `--spacing-bottom-nav` | 48px | Bottom nav |

### Gap vs Padding vs Margin

- **gap**: Space flex/grid children (preferred)
- **padding**: Container internal space
- **margin**: Spacing between unrelated blocks (rare)

---

## Part 5: Typography

### Type Scale

| Token | Size | Usage |
|-------|------|-------|
| `text-2xs` | 10px | Badges, timestamps |
| `text-xs` | 12px | Captions, meta |
| `text-sm` | 14px | Body text |
| `text-base` | 16px | Prominent body |
| `text-lg` | 18px | Section titles |
| `text-xl` | 20px | Page titles |
| `text-price` | 16px | Prices |

### Font Weights

| Weight | Usage |
|--------|-------|
| `font-normal` (400) | Body text |
| `font-medium` (500) | Labels, emphasis |
| `font-semibold` (600) | Headings, prices |

---

## Part 6: Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Badges, chips |
| `rounded-md` | 6px | Buttons, inputs, cards |
| `rounded-lg` | 8px | Dialogs |
| `rounded-xl` | 10px | Hero sections |
| `rounded-full` | 9999px | Avatars, pills |

---

## Part 7: shadcn/ui Components

### Component Boundaries

| Layer | Location | Purpose |
|-------|----------|---------|
| **Primitives** | `components/ui/*` | Base Radix wrappers |
| **Composites** | `components/shared/*` | Domain components |
| **Route-private** | `app/[locale]/(group)/**/_components/*` | Scoped UI |

**Forbidden in Primitives:**
- No domain logic (products, users, orders)
- No API calls
- No imports from `app/**` or `components/shared/*`

### Button System

| Variant | Usage |
|---------|-------|
| `default` | Primary CTA (Twitter blue) |
| `secondary` | Dark button |
| `outline` | Secondary action |
| `ghost` | Icon buttons, minimal |
| `destructive` | Delete, cancel |
| `deal` | Urgency CTAs (sales) |
| `link` | Inline text links |

| Size | Height | Usage |
|------|--------|-------|
| `sm` | 36px | Compact |
| `default` | 44px | Standard |
| `lg` | 48px | Touch-safe |
| `icon` | 44px | Square icon |

### Form Pattern

```tsx
<Field>
  <FieldLabel>Email</FieldLabel>
  <FieldContent>
    <Input />
    <FieldDescription>Optional help</FieldDescription>
    <FieldError>{error}</FieldError>
  </FieldContent>
</Field>
```

### Card Pattern

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
  <CardFooter>{/* Actions */}</CardFooter>
</Card>
```

### Badge System

| Variant | Usage |
|---------|-------|
| `success` | Completed, verified |
| `warning` | Pending, low stock |
| `critical` | Error, urgent |
| `condition-new` | Product condition |
| `deal` | Sale percentage |
| `shipping` | Free shipping |

---

## Part 8: Interactive States

### Required States

| State | Treatment |
|-------|-----------|
| Default | Base styling |
| Hover | `bg-hover` or subtle shift |
| Active | `bg-active`, slight press |
| Focus | `ring-2 ring-ring` offset |
| Disabled | 50% opacity |
| Loading | Spinner, maintain width |
| Selected | `bg-selected`, clear distinction |

---

## Part 8.5: App-feel (iOS-inspired) patterns

Treido keeps its **Twitter Blue** theme and calm, premium styling. “iOS feel” is about **interaction + layout**, not copying iOS visuals.

### Principles

- Preserve browsing context: deep views open “on top” (not full navigation loss).
- One clear primary action per screen.
- Touch-first sizing: primary targets feel easy to hit.
- Calm surfaces: use spacing + hierarchy, not decoration.

### Default Patterns

| Interaction | Mobile | Desktop |
|-------------|--------|---------|
| PDP / quick view | `Sheet` (bottom) | `Dialog` (modal) |
| Filters | `Sheet` | `Dialog` or right panel |
| Seller preview | `Sheet` | `Dialog` |
| Multi-step flows (sell, upgrade, edit) | `Sheet` wizard | `Dialog` wizard |

### Rules

- Prefer **URL-as-state** overlays (Next.js intercepting routes) so deep links + back button work.
- Sticky headers / bottom CTA bars should use **semantic surfaces** (`bg-surface-elevated`, `border-border`) and safe-area padding utilities from `app/utilities.css` (`pt-safe*`, `pb-safe*`).
- Press feedback is subtle: `active:bg-active` / `active:opacity-90` + `tap-highlight-transparent` (no new animations).
- Avoid “glass” via opacity modifiers (`bg-*/90`, `bg-*/10`). If a glass surface is truly needed, add a semantic token in `app/globals.css` and use it normally.

### References

- Roadmap: `docs/14-UI-UX-PLAN.md`
- Existing modal route pattern: `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx`

---

## Part 9: Accessibility

**Non-negotiable:**

| Requirement | Implementation |
|-------------|----------------|
| Focus visible | `focus-visible:ring-2` |
| Contrast | 4.5:1 text, 3:1 UI |
| Touch targets | 44px minimum |
| Labels | All inputs labeled |
| Keyboard | All actions reachable |
| Reduced motion | Respect `prefers-reduced-motion` |

---

## Part 10: Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Gradients | Solid semantic tokens |
| `bg-primary/10` | `bg-hover` or `bg-selected` |
| `bg-gray-100` | `bg-muted` |
| `w-[560px]` | Scale value or `max-w-*` |
| Border AND shadow | Choose one |
| Too many surfaces | Use spacing to group |
| Inconsistent spacing | 4px base rhythm |

---

## Quick Reference Cards

### Colors
```
BACKGROUND:  bg-background, bg-card, bg-muted, bg-surface-subtle
FOREGROUND:  text-foreground, text-muted-foreground, text-primary
STATES:      bg-hover, bg-active, bg-selected
STATUS:      bg-success, bg-warning, bg-error, bg-info
```

### Spacing
```
TIGHT:   gap-1 (4px) - icon + text
NORMAL:  gap-2 (8px) - list items
FORM:    gap-3 (12px) - form fields
CARD:    p-4 (16px) - card padding
SECTION: gap-6 (24px) - sections
PAGE:    gap-8 (32px) - major blocks
```

### Typography
```
CAPTION:  text-xs text-muted-foreground
BODY:     text-sm
LABEL:    text-sm font-medium
PRICE:    text-price font-semibold
TITLE:    text-lg font-semibold
```

### Components
```
BUTTON:   <Button variant="..." size="...">
CARD:     <Card><CardHeader/><CardContent/><CardFooter/></Card>
FORM:     <Field><FieldLabel/><FieldContent><Input/></FieldContent></Field>
BADGE:    <Badge variant="success|warning|critical|deal">
```

---

## Verification

```bash
pnpm -s styles:gate    # Check forbidden patterns
pnpm -s typecheck      # Type safety
pnpm -s lint           # ESLint
```

---

## See Also

- [Tokens SSOT](../app/globals.css)
- [Button Component](../components/ui/button.tsx)
- [PageShell](../components/shared/page-shell.tsx)
- [01-PRD.md](./01-PRD.md) — Product context
- [03-ARCHITECTURE.md](./03-ARCHITECTURE.md) — Module boundaries

---

*Last updated: 2026-02-01*
