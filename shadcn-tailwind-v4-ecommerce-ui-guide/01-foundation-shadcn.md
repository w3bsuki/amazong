# 01 — Foundation: shadcn/ui done correctly

## The point of shadcn/ui (read this first)

**shadcn/ui is not a packaged component library.**  
It’s a way to generate components into your codebase so you can own and modify them.

**Implication:** you don’t “theme” by overriding someone else’s CSS — you actually edit the component code and your tokens. This is how you get a custom, high-quality UI without fighting a black box.

---

## The workflow you should follow

### 1) Initialize once (preferred)

Use the CLI `init` command to bootstrap:

- dependencies
- `cn()` utility
- CSS variables setup
- `components.json`

Command:

```bash
pnpm dlx shadcn@latest init
# or: npx shadcn@latest init
```

You can choose:
- `--base-color` (neutral/gray/zinc/stone/slate)
- `--css-variables` (keep this **on**)

### 2) Add components incrementally

```bash
pnpm dlx shadcn@latest add button card badge sheet drawer scroll-area carousel sonner
```

**Do not** add everything blindly on day one.  
Add primitives you actually use, then build your domain components on top.

### 3) Treat `components/ui/*` as primitives only

**Rule:** UI primitives in `components/ui/*` must stay “boring” and reusable.  
Marketplace-specific UI belongs in domain folders:

- `components/app/*` (shell, header, bottom nav)
- `components/home/*` (promoted carousel, feed sections)
- `components/product/*` (product cards, price, rating)
- `components/categories/*` (categories sheet, chips)
- `components/search/*` (search input, suggestions)

This keeps refactors manageable and prevents “everything is a div soup”.

---

## Key files and why they matter

### `components.json`

This tells shadcn where to install code and how to theme.

Typical settings:
- `"style": "new-york"` (**recommended** for modern UI)
- `"tailwind.cssVariables": true` (**recommended**)
- aliases for `@/components`, `@/lib/utils`, etc.

### `lib/utils.ts` (cn helper)

You need the `cn()` helper because shadcn components rely on `clsx` + `tailwind-merge`.

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Component architecture rules (non-negotiable)

### Use CVA for variants (don’t write class soup)

- shadcn primitives typically use `class-variance-authority` (CVA).
- Your domain components should too.

Good:
- `ProductCard` has variants: `size`, `density`, `emphasis`, `layout`.

Bad:
- A `ProductCard` that is a giant `className="..."` string with 90 utilities.

### Prefer tokens > raw colors

No hard-coded hex colors in components.

- Use: `bg-background`, `text-foreground`, `border-border`
- Use: custom semantic colors you add (like `bg-warning`, `text-warning-foreground`)

### One-off styles are allowed, but controlled

Arbitrary values (`w-[372px]`, `rounded-[22px]`) are allowed **only** when:
- It’s needed for pixel-perfect UI,
- and you can’t reasonably express it using your token scale,
- and it’s documented (why it exists).

---

## shadcn v4 specifics you must respect

- New projects use Tailwind v4 + React 19.
- Components now use `data-slot` attributes for styling (useful for overrides).
- `toast` is deprecated in favor of `sonner`.
- `tailwindcss-animate` is deprecated in favor of `tw-animate-css`.

(Details are in the official shadcn Tailwind v4 doc.)
