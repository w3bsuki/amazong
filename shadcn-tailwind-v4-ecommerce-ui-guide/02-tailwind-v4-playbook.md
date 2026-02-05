# 02 — Tailwind CSS v4 Playbook (what changed + how to use it well)

## The big change: CSS-first configuration

Tailwind v4 shifts most configuration from `tailwind.config.*` into CSS using directives.

At minimum you’ll see:

```css
@import "tailwindcss";
```

Then you configure design tokens with:

```css
@theme {
  --color-brand-500: oklch(0.65 0.2 25);
  --radius-xl: 1rem;
}
```

Tailwind uses these **theme variables** to generate utilities like:
- `bg-brand-500`
- `rounded-xl`
- `shadow-*` (if you define `--shadow-*` vars), etc.

### When to use `@theme inline`

If your Tailwind theme variables reference other CSS variables, use `@theme inline`.

Example:

```css
:root {
  --brand: oklch(0.67 0.19 39);
}

@theme inline {
  --color-brand: var(--brand);
}
```

This matters for shadcn because shadcn keeps “raw” CSS variables like `--background`, then maps them to Tailwind’s `--color-*` namespace.

---

## Migration: upgrade safely (if you’re on v3)

Use the official upgrade tool:

```bash
npx @tailwindcss/upgrade
```

Do it in a new git branch, review the diff, and test in the browser.

Important: Tailwind v4 targets modern browsers. If you need older browser support, you may need to stay on v3 for now.

---

## Directives you should actually use in a real project

Tailwind v4 gives you directives for common extension patterns:

### `@custom-variant`

Use this for dark mode or custom themes:

```css
@custom-variant dark (&:is(.dark *));
```

Now `dark:` works when a `.dark` class exists on a parent.

You can also create theme variants:

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

### `@utility` (optional)

Create project-specific utilities that still support variants:

```css
@utility content-auto {
  content-visibility: auto;
}
```

Then use `content-auto` in class lists.

### `@layer` (still useful)

Use `@layer base` for base element defaults (body, headings) if needed.

Use `@layer components` only for complex reusable CSS classes you truly want.

---

## Tailwind v4 tips for app-like UI

### 1) Prefer semantic colors (not Tailwind palette names)

Good:
- `bg-background`
- `text-foreground`
- `border-border`
- `bg-primary text-primary-foreground`
- `bg-warning text-warning-foreground`

Bad:
- `bg-slate-50 text-slate-900` everywhere (locks you into “gray app forever”)

### 2) Define shadow + radius tokens (elevation system)

App-like UI needs a consistent elevation ladder:
- pressed (0)
- card (1)
- floating (2)
- overlay (3)

Define `--shadow-*` tokens and use `shadow-*` utilities consistently.

### 3) Use `env(safe-area-inset-*)` on mobile

Bottom nav needs safe area padding on iOS:

- `pb-[env(safe-area-inset-bottom)]`
- `pt-[env(safe-area-inset-top)]`

### 4) Keep touch targets ≥ 44px

Icon buttons need at least `size-11` (44px) or similar.

---

## Output hygiene (performance)

- Prefer responsive grid + lazy images.
- Use skeletons while loading.
- Avoid huge blurred backdrops everywhere; use blur only on sticky bars.
