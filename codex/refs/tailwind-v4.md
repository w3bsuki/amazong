# Tailwind CSS v4 — Reference

## DO

### CSS-first configuration
No `tailwind.config.js`. All config lives in CSS via `@theme` and `@import`.

```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:where(.dark, .dark *));
```

### `@theme` for design tokens
Define all custom tokens in `@theme` blocks. They generate utility classes automatically.

```css
@theme {
  --font-script: "Great Vibes", cursive;
  --color-brand: oklch(0.62 0.20 255);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
/* Now usable as: font-script, text-brand, ease-snappy */
```

### Semantic token classes only
Use token-mapped utilities: `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`.

```html
<div class="bg-background text-foreground border border-border rounded-lg p-4">
  <p class="text-muted-foreground text-sm">Semantic tokens only</p>
</div>
```

### CSS variables for custom component styles
Access theme values in custom CSS via `var(--token-name)`.

```css
@layer components {
  .typography p {
    font-size: var(--text-base);
    color: var(--color-gray-700);
  }
}
```

### `@custom-variant` for custom dark mode
Class-based dark mode (not media query):

```css
@custom-variant dark (&:where(.dark, .dark *));
```

### `@variant` for variant styles in CSS
Apply Tailwind variants in custom CSS:

```css
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
}
```

---

## DON'T

### Don't use palette/color classes directly
No `bg-blue-500`, `text-gray-600`, `bg-zinc-900`. Only semantic tokens.

```html
<!-- ❌ BAD -->
<div class="bg-blue-500 text-white">
<div class="bg-gray-100 text-gray-800">

<!-- ✅ GOOD -->
<div class="bg-primary text-primary-foreground">
<div class="bg-muted text-muted-foreground">
```

### Don't use arbitrary values
No `bg-[#243c5a]`, `w-[347px]`, `text-[14px]`. Use design system tokens.

```html
<!-- ❌ BAD -->
<div class="w-[347px] text-[#333]">

<!-- ✅ GOOD -->
<div class="w-full max-w-sm text-foreground">
```

### Don't use gradients
Unless explicitly approved. No `bg-gradient-to-r from-blue-500 to-purple-600`.

### Don't create `tailwind.config.js`
v4 is CSS-first. Config belongs in `globals.css` via `@theme`.

### Don't use hex/rgb/hsl colors
Our tokens are OKLCH. Use CSS variables or semantic classes.

---

## OUR SETUP

- **Tailwind 4.1.18** — CSS-first, no config file
- **Globals:** `app/globals.css` — `@import "tailwindcss"`, `@custom-variant dark`, then OKLCH tokens
- **Color space:** OKLCH for all tokens (raw components: `L C H`)
- **Dark mode:** class-based via `@custom-variant dark (&:where(.dark, .dark *))`
- **Gate:** `pnpm -s styles:gate` — fails on palette classes, arbitrary values, gradients
- **Companion files:** `utilities.css` (custom utilities), `shadcn-components.css` (component overrides), `legacy-vars.css`
