# tokens.md — Full Tailwind v4 Token Reference

> Complete semantic token map for Treido design system.

## Core Semantic Tokens

### Surface Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `bg-background` | white | near-black | Page backgrounds |
| `bg-card` | white | dark gray | Card surfaces |
| `bg-popover` | white | dark gray | Dropdown/dialog surfaces |
| `bg-muted` | soft gray | charcoal | Subtle sections, disabled bg |
| `bg-accent` | very light gray | charcoal | Hover states |
| `bg-input` | very light gray | charcoal | Form input backgrounds |

### Text Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `text-foreground` | near-black | white | Primary text |
| `text-muted-foreground` | gray | gray | Secondary/helper text |
| `text-card-foreground` | near-black | white | Text on cards |
| `text-popover-foreground` | near-black | white | Text on popovers |
| `text-accent-foreground` | near-black | white | Text on accent bg |

### Action Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `bg-primary` | Twitter blue | lighter blue | Primary CTAs |
| `text-primary-foreground` | white | dark | Text on primary bg |
| `bg-secondary` | near-black | charcoal | Secondary actions |
| `text-secondary-foreground` | white | white | Text on secondary bg |
| `bg-destructive` | red | lighter red | Danger actions |
| `text-destructive-foreground` | white | dark | Text on destructive bg |

### Status Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `bg-success` | green | lighter green | Success states |
| `text-success-foreground` | white | dark | Text on success bg |
| `bg-warning` | yellow | lighter yellow | Warning states |
| `text-warning-foreground` | dark | dark | Text on warning bg |
| `bg-error` | red | lighter red | Error states |
| `text-error-foreground` | white | dark | Text on error bg |
| `bg-info` | blue | lighter blue | Info states |
| `text-info-foreground` | white | dark | Text on info bg |

### Subtle Variants (For Backgrounds)

| Token | Usage |
|-------|-------|
| `bg-primary-subtle` | Light primary tint for highlights |
| `bg-success-subtle` | Light green for buyer protection |
| `bg-destructive-subtle` | Light red for destructive hover |

### Border & Ring

| Token | Usage |
|-------|-------|
| `border-border` | Default border color |
| `ring-ring` | Focus ring color |
| `ring-category-ring` | Category selection ring |

### Interactive States

| Token | Usage |
|-------|-------|
| `bg-selected` | Selected item background |
| `border-selected-border` | Selected item border |
| `bg-hover` | Hover state background |
| `border-hover-border` | Hover state border |
| `bg-active` | Active/pressed background |
| `bg-checked` | Checkbox/toggle checked bg |

## Spacing Tokens

### Touch Targets

| Token | Size | Class | Usage |
|-------|------|-------|-------|
| `--spacing-touch-xs` | 32px | `h-(--spacing-touch-xs)` | Minimum WCAG |
| `--spacing-touch-sm` | 36px | `h-(--spacing-touch-sm)` | Compact |
| `--spacing-touch` | 40px | `h-(--spacing-touch)` | Default |
| `--spacing-touch-md` | 44px | `h-(--spacing-touch-md)` | Apple minimum |
| `--spacing-touch-lg` | 48px | `h-(--spacing-touch-lg)` | Bottom nav |

### Layout Heights

| Token | Size | Class | Usage |
|-------|------|-------|-------|
| `--spacing-header` | 48px | `h-(--spacing-header)` | Mobile header |
| `--spacing-bottom-nav` | 48px | `h-(--spacing-bottom-nav)` | Bottom nav |
| `--spacing-button` | 44px | `h-(--spacing-button)` | Standard button |
| `--spacing-button-sm` | 36px | `h-(--spacing-button-sm)` | Compact button |
| `--spacing-button-lg` | 48px | `h-(--spacing-button-lg)` | Large button |
| `--spacing-input` | 44px | `h-(--spacing-input)` | Form inputs |
| `--spacing-search` | 44px | `h-(--spacing-search)` | Search bar |

### Icon Sizes

| Token | Size | Class | Usage |
|-------|------|-------|-------|
| `--size-icon-xs` | 20px | `size-(--size-icon-xs)` | Small inline |
| `--size-icon-sm` | 22px | `size-(--size-icon-sm)` | Compact header |
| `--size-icon` | 24px | `size-(--size-icon)` | Default |
| `--size-icon-header` | 26px | `size-(--size-icon-header)` | Header icons |
| `--size-icon-lg` | 28px | `size-(--size-icon-lg)` | Large/bold |

## Shadow Tokens

| Token | Usage |
|-------|-------|
| `shadow-2xs` | Barely visible |
| `shadow-xs` | Very subtle |
| `shadow-sm` | Card edges |
| `shadow-md` | Elevated cards |
| `shadow-lg` | Floating elements |
| `shadow-xl` | Modal/dialog |
| `shadow-2xl` | Maximum elevation |
| `shadow-card` | Product cards |
| `shadow-dropdown` | Dropdowns |
| `shadow-modal` | Modals |

## Radius Tokens

| Token | Size | Usage |
|-------|------|-------|
| `rounded-sm` | 4px | Tight corners |
| `rounded-md` | 6px | Default |
| `rounded-lg` | 8px | Cards |
| `rounded-xl` | 10px | Larger cards |
| `rounded-2xl` | 12px | Modals |
| `rounded-full` | Full | Pills, avatars |

## Transition Tokens

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-instant` | 50ms | Instant feedback |
| `--duration-fast` | 100ms | Quick interactions |
| `--duration-normal` | 200ms | Standard animations |
| `--duration-slow` | 300ms | Complex animations |

| Easing | Usage |
|--------|-------|
| `--ease-snappy` | `cubic-bezier(0.2, 0, 0, 1)` | Buttons, taps |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Page transitions |

## Badge Tokens

### Solid Badges (High Emphasis)

| Token | Color | Usage |
|-------|-------|-------|
| `bg-badge-success-solid` | Green | Success |
| `bg-badge-warning-solid` | Yellow | Warning |
| `bg-badge-critical-solid` | Red | Critical |
| `bg-badge-info-solid` | Blue | Info |
| `bg-badge-neutral-solid` | Gray | Neutral |
| `text-badge-fg-on-solid` | White | Text on any solid |

### Subtle Badges (Low Emphasis)

Use `bg-*-subtle-bg` + `text-*-subtle-fg` pairs for matching contrast.

### Condition Badges

| Token | Usage |
|-------|-------|
| `bg-badge-condition-new` | New items |
| `bg-badge-condition-likenew` | Like new |
| `bg-badge-condition-good` | Good condition |
| `bg-badge-condition-fair` | Fair condition |
| `bg-badge-condition-used` | Used |
| `bg-badge-condition-refurb` | Refurbished |

## Usage Examples

### Button with Tokens

```tsx
<Button className="
  h-(--spacing-button)
  bg-primary text-primary-foreground
  hover:bg-primary/90
  focus-visible:ring-2 ring-ring
  transition-colors duration-(--duration-fast)
">
  Add to Cart
</Button>
```

### Card with Tokens

```tsx
<Card className="
  bg-card text-card-foreground
  border border-border
  rounded-lg shadow-card
  p-4
">
  <h3 className="text-foreground font-semibold">Title</h3>
  <p className="text-muted-foreground text-sm mt-1">Description</p>
</Card>
```

### Icon Button with Touch Target

```tsx
<button className="
  size-(--spacing-touch-md)
  flex items-center justify-center
  rounded-full
  hover:bg-accent
  transition-colors
">
  <Icon className="size-(--size-icon-header)" />
</button>
```
