# shadcn/ui — Component Reference

## DO

### OKLCH CSS variables for theming
All theme colors are CSS custom properties in OKLCH color space. Define in `:root` and `.dark`.

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.62 0.20 255);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.96 0.01 255);
  --secondary-foreground: oklch(0.22 0.02 255);
  --muted: oklch(0.97 0.005 255);
  --muted-foreground: oklch(0.52 0.02 255);
  --destructive: oklch(0.62 0.22 30);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.92 0.01 255);
  --input: oklch(0.92 0.01 255);
  --ring: oklch(0.62 0.20 255);
  --radius: 0.625rem;
}
```

### Primitives in `components/ui/`
shadcn components are copy-pasted primitives. They go in `components/ui/` and should NOT be modified for business logic.

```
components/ui/button.tsx      ← shadcn primitive
components/ui/dialog.tsx      ← shadcn primitive
components/ui/input.tsx       ← shadcn primitive
```

### Composites in `components/shared/`
Business-specific components that compose shadcn primitives go in `components/shared/`.

```tsx
// components/shared/product-card.tsx — composes ui/card + ui/badge + ui/button
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProductCard({ product }: Props) {
  return (
    <Card>
      <Badge>{product.category}</Badge>
      {/* ... */}
    </Card>
  )
}
```

### Use `cn()` for conditional classes
The `cn()` utility from `lib/utils` merges Tailwind classes safely.

```tsx
import { cn } from "@/lib/utils"

<div className={cn("rounded-lg border", isActive && "border-primary bg-accent")} />
```

### RSC-compatible by default
shadcn components are Server Components unless they need interactivity. The `"use client"` is already in components that need it (dialog, dropdown, etc.).

---

## DON'T

### Don't add business logic to `components/ui/`
These are design system primitives. If you need a `ProductCard`, make it in `components/shared/`.

### Don't override shadcn styles inline
Use theme tokens. If you need a variant, add to the CVA config in the component.

```tsx
// ❌ BAD
<Button className="bg-blue-500 hover:bg-blue-600">

// ✅ GOOD — use existing variants or add to CVA
<Button variant="default">
```

### Don't duplicate shadcn components
If a component exists in `components/ui/`, use it. Don't create `CustomButton` that reimplements Button.

### Don't use HSL tokens
Our theme uses OKLCH. Don't add `hsl(var(--primary))` patterns.

---

## OUR SETUP

- **Style:** new-york (denser, more polished)
- **Config:** `components.json` — aliases point to `@/components/ui`, `@/lib/utils`
- **Color space:** OKLCH (raw `L C H` components in variables, wrapped by Tailwind mapping)
- **Base color:** neutral
- **RSC:** `"rsc": true` in components.json — shadcn defaults to Server Components
- **Structure:** `ui/` = primitives, `shared/` = composites, `layout/` = shells
