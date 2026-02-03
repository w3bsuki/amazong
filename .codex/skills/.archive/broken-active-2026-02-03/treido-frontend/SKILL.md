---
name: treido-frontend
description: Frontend rules for Treido marketplace - React components, Tailwind v4 tokens, shadcn boundaries, i18n, Server/Client patterns.
---

# treido-frontend

UI, styling, routing, and i18n rules for Treido.

## When to Apply

- Writing or editing React components
- Styling with Tailwind CSS
- Using shadcn/ui primitives
- Adding/editing translations
- Working on routing or layouts

## Rules by Priority

### CRITICAL - Tailwind Token Rails

| Rule | Description |
|------|-------------|
| `tw-semantic-only` | Use semantic tokens: `bg-background`, `text-foreground`, `border-border` |
| `tw-no-palette` | Never palette colors: `bg-gray-100`, `text-blue-600` |
| `tw-no-gradients` | Never gradients: `bg-gradient-to-r`, `from-*`, `to-*` |
| `tw-no-arbitrary` | Never arbitrary values: `w-[560px]`, `text-[13px]` |
| `tw-no-opacity-hacks` | Never opacity on tokens: `bg-primary/10` |

**Token SSOT:** `app/globals.css`

#### ✅ Do

```tsx
<div className="bg-background text-foreground border-border">
  <p className="text-muted-foreground">Secondary text</p>
  <button className="bg-primary text-primary-foreground hover:bg-hover">
    Action
  </button>
</div>
```

#### ❌ Don't

```tsx
<div className="bg-white text-gray-900 border-gray-200">
<div className="bg-gradient-to-r from-blue-500 to-purple-500">
<div className="w-[543px] text-[13px]">
<button className="bg-primary/10 hover:bg-primary/20">
```

### CRITICAL - i18n Required

| Rule | Description |
|------|-------------|
| `i18n-no-hardcoded` | All user-facing strings must use `next-intl` |
| `i18n-both-locales` | Add keys to both `messages/en.json` and `messages/bg.json` |

#### ✅ Do

```tsx
import { useTranslations } from 'next-intl';

function ProductCard() {
  const t = useTranslations('Product');
  return <h2>{t('addToCart')}</h2>;
}
```

#### ❌ Don't

```tsx
function ProductCard() {
  return <h2>Add to Cart</h2>; // Hardcoded string
}
```

### HIGH - shadcn Boundaries

| Rule | Description |
|------|-------------|
| `shadcn-primitives` | `components/ui/*` = shadcn primitives only, no app logic |
| `shadcn-no-imports` | Primitives never import from `app/`, `lib/`, or feature code |
| `shadcn-composites` | Feature wrappers go in `components/shared/*` |
| `shadcn-route-private` | Route-specific UI in `app/[locale]/(group)/**/_components/*` |

```
components/
├── ui/           # shadcn primitives (Button, Card, Dialog)
├── shared/       # Reusable composites (ProductCard, PageShell)
└── layout/       # Layout shells (Header, Footer)

app/[locale]/(main)/products/
└── _components/  # Route-private UI
```

### HIGH - Server/Client Boundaries

| Rule | Description |
|------|-------------|
| `rsc-default` | Default to Server Components |
| `rsc-client-islands` | Use `'use client'` only for hooks, events, browser APIs |
| `rsc-small-islands` | Keep client components small and focused |

#### ✅ Do

```tsx
// Server Component (default)
async function ProductPage({ id }: { id: string }) {
  const product = await getProduct(id);
  return <ProductView product={product} />;
}

// Small client island
'use client';
function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

#### ❌ Don't

```tsx
'use client'; // Don't make entire pages client components
export default function ProductPage() {
  const [product, setProduct] = useState(null);
  useEffect(() => { fetchProduct().then(setProduct) }, []);
}
```

### MEDIUM - Spacing & Hierarchy

| Rule | Description |
|------|-------------|
| `spacing-scale` | Use Tailwind scale: `gap-1`, `gap-2`, `gap-4`, etc. |
| `spacing-proximity` | Related elements closer than unrelated |
| `hierarchy-restraint` | 1-2 emphasis levers per screen (size, weight, color) |

### MEDIUM - Accessibility

| Rule | Description |
|------|-------------|
| `a11y-semantic-html` | Use `<button>` not `<div onClick>` |
| `a11y-labels` | Every input needs associated `<Label>` |
| `a11y-focus-visible` | Never remove focus outlines without replacement |

## Common Fixes

### Palette color → Semantic token
```tsx
// Before
<div className="bg-gray-100 text-gray-900">
// After
<div className="bg-background text-foreground">
```

### Opacity hack → Surface token
```tsx
// Before
<button className="bg-primary/10">
// After
<button className="bg-surface-subtle">
```

### Hardcoded string → i18n
```tsx
// Before
<h2>Add to Cart</h2>
// After
const t = useTranslations('Product');
<h2>{t('addToCart')}</h2>
```

## Verification

```powershell
pnpm -s typecheck      # TypeScript
pnpm -s lint           # ESLint
pnpm -s styles:gate    # Tailwind token violations
pnpm -s test:unit      # After UI changes
```

## Key Files

| Purpose | Location |
|---------|----------|
| Token definitions | `app/globals.css` |
| shadcn config | `components.json` |
| English strings | `messages/en.json` |
| Bulgarian strings | `messages/bg.json` |

## Exception

**Only** place hardcoded hex colors allowed: `components/shared/filters/color-swatches.tsx` (product color display, not UI styling).
