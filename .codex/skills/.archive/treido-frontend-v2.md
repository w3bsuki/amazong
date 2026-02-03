# treido-frontend

Comprehensive frontend rules for Treido: React components, Tailwind v4 styling, shadcn/ui primitives, Next.js App Router, and internationalization.

## When to Apply

- Writing or editing React components
- Styling with Tailwind CSS
- Using shadcn/ui primitives or composites
- Adding/editing translations
- Working on routing or layouts
- Reviewing UI code for compliance

---

## Rules by Priority

### CRITICAL - Tailwind Token Rails

| Rule | Description |
|------|-------------|
| `tw-semantic-only` | Use semantic tokens: `bg-background`, `text-foreground`, `border-border` |
| `tw-no-palette` | Never use palette colors: `bg-gray-100`, `text-blue-600`, `border-zinc-200` |
| `tw-no-gradients` | Never use gradients: `bg-gradient-to-r`, `from-*`, `via-*`, `to-*` |
| `tw-no-arbitrary` | Never use arbitrary values: `w-[560px]`, `text-[13px]`, `rounded-[10px]` |
| `tw-no-opacity-hacks` | Never use opacity on tokens: `bg-primary/10`, `bg-muted/30` |
| `tw-no-hardcoded` | Never hardcode colors in TSX: `#fff`, `rgb()`, `oklch()` |

**Token SSOT:** `app/globals.css` (uses `@theme inline` bridge)

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
// Palette colors - breaks dark mode
<div className="bg-white text-gray-900 border-gray-200">

// Gradients - breaks token system
<div className="bg-gradient-to-r from-blue-500 to-purple-500">

// Arbitrary values - breaks scale consistency
<div className="w-[543px] text-[13px]">

// Opacity hacks - impossible to standardize
<button className="bg-primary/10 hover:bg-primary/20">
```

---

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
// Hardcoded strings - breaks i18n
function ProductCard() {
  return <h2>Add to Cart</h2>;
}
```

---

### HIGH - shadcn Boundaries

| Rule | Description |
|------|-------------|
| `shadcn-primitives` | `components/ui/*` contains only shadcn primitives, no app logic |
| `shadcn-no-imports` | Primitives never import from `app/`, `lib/`, or feature code |
| `shadcn-composites` | Feature wrappers go in `components/shared/*` |
| `shadcn-route-private` | Route-specific UI goes in `app/[locale]/(group)/**/_components/*` |

#### File Organization

```
components/
├── ui/           # shadcn primitives (Button, Card, Dialog)
│                 # NO app logic, NO feature imports
├── shared/       # Reusable composites (ProductCard, PageShell)
│                 # CAN import from ui/, CAN have feature logic
└── layout/       # Layout shells (Header, Footer, Sidebar)

app/[locale]/(main)/products/
└── _components/  # Route-private UI (only used in this route)
```

---

### HIGH - Server/Client Boundaries

| Rule | Description |
|------|-------------|
| `rsc-default` | Default to Server Components |
| `rsc-client-islands` | Use `'use client'` only for hooks, events, browser APIs |
| `rsc-small-islands` | Keep client components small and focused |

#### ✅ Do

```tsx
// Server Component (default) - fetches data
async function ProductPage({ id }: { id: string }) {
  const product = await getProduct(id);
  return <ProductView product={product} />;
}

// Small client island - only for interactivity
'use client';
function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

#### ❌ Don't

```tsx
// Don't make entire pages client components
'use client';
export default function ProductPage() {
  const [product, setProduct] = useState(null);
  useEffect(() => { fetchProduct().then(setProduct) }, []);
  // This could be a server component!
}
```

---

### MEDIUM - Spacing & Hierarchy

| Rule | Description |
|------|-------------|
| `spacing-scale` | Use Tailwind scale: `gap-1` (4px), `gap-2` (8px), `gap-4` (16px), etc. |
| `spacing-proximity` | Related elements closer together than unrelated elements |
| `hierarchy-restraint` | Pick 1-2 primary emphasis levers per screen (size, weight, color) |

#### ✅ Do

```tsx
<div className="grid gap-6">
  <section className="grid gap-2">
    <h2 className="text-lg font-semibold text-foreground">Billing</h2>
    <p className="text-sm text-muted-foreground">Manage your plan.</p>
  </section>
  <section className="grid gap-4">
    {/* Fields with consistent spacing */}
  </section>
</div>
```

---

### MEDIUM - Accessibility

| Rule | Description |
|------|-------------|
| `a11y-semantic-html` | Use `<button>` not `<div onClick>`, use `<header>` not `<div class="header">` |
| `a11y-labels` | Every form input needs a visible, associated `<Label>` |
| `a11y-focus-visible` | Never remove focus outlines without replacement |

---

## Common Fixes

### Fix: Palette color found

```tsx
// Before (wrong)
<div className="bg-gray-100 text-gray-900">

// After (correct)
<div className="bg-background text-foreground">
```

### Fix: Opacity hack found

```tsx
// Before (wrong)
<button className="bg-primary/10 hover:bg-primary/20">

// After (correct)
<button className="bg-surface-subtle hover:bg-hover">
```

### Fix: Hardcoded string found

```tsx
// Before (wrong)
<h2>Add to Cart</h2>

// After (correct)
const t = useTranslations('Product');
<h2>{t('addToCart')}</h2>

// Plus add to messages/en.json:
{ "Product": { "addToCart": "Add to Cart" } }

// And messages/bg.json:
{ "Product": { "addToCart": "Добави в количка" } }
```

---

## Verification

After any frontend change:

```powershell
pnpm -s typecheck      # TypeScript errors
pnpm -s lint           # ESLint issues
pnpm -s styles:gate    # Tailwind token violations
```

After UI component changes:

```powershell
pnpm -s test:unit      # Component tests
```

---

## Key Files

| Purpose | Location |
|---------|----------|
| Token definitions | `app/globals.css` |
| shadcn config | `components.json` |
| English strings | `messages/en.json` |
| Bulgarian strings | `messages/bg.json` |
| Page surface wrapper | `components/shared/page-shell.tsx` |
| Button variants | `components/ui/button.tsx` |

---

## Exception: Product Color Swatches

The **only** place hardcoded hex colors are allowed:

```
components/shared/filters/color-swatches.tsx
```

This displays actual product colors, not UI styling.
