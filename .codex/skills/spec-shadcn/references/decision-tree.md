# shadcn/ui Decision Tree

Quick decision framework for auditing shadcn/ui usage in Treido.

## Component Location Decision Tree

```
Where should this component live?
├── Is it a generic UI primitive (Button, Card, Input, Dialog)?
│   └── → components/ui/ (shadcn primitives)
├── Is it a reusable composite (ProductCard, PriceDisplay, UserAvatar)?
│   └── → components/shared/
├── Is it specific to one route/feature?
│   └── → app/[locale]/(group)/**/_components/
└── Is it a layout shell (header, footer, sidebar)?
    └── → components/layout/
```

## Primitive Boundary Decision Tree

```
Is this in components/ui/*?
├── Does it import from app/**?
│   └── ❌ FAIL — Primitives can't import app code
├── Does it import Supabase/Stripe clients?
│   └── ❌ FAIL — No heavy deps in primitives
├── Does it use next-intl/useTranslations?
│   └── ❌ FAIL — i18n belongs in composites, not primitives
├── Does it contain business logic?
│   └── ❌ FAIL — Move logic to components/shared/
├── Does it fetch data?
│   └── ❌ FAIL — Primitives are stateless UI only
└── Is it a pure, composable primitive?
    └── ✅ PASS
```

## Styling Decision Tree

```
How is this component styled?
├── Uses semantic tokens (bg-card, text-foreground)?
│   └── ✅ PASS
├── Uses palette colors (bg-gray-100, text-blue-600)?
│   └── ❌ FAIL → Replace with semantic tokens
├── Uses arbitrary values (bg-[#fff])?
│   └── ❌ FAIL → Use token or scale value
├── Overrides variant inline (<Button className="bg-blue-500">)?
│   └── ❌ FAIL → Use variant prop or extend component
└── Uses cn() helper for conditional classes?
    └── ✅ PASS (correct pattern)
```

## Composition Decision Tree

```
Building a feature component?
├── Start with shadcn primitives
│   ├── <Card>, <CardHeader>, <CardContent>
│   ├── <Button variant="...">
│   ├── <Input>, <Label>
│   └── <Dialog>, <Sheet>, <Drawer>
├── Compose into feature component
│   └── → components/shared/feature-name.tsx
├── Add business logic
│   └── In the composite, not the primitive
└── Add i18n
    └── In the composite, pass translated strings to primitives
```

## Variant Usage Decision Tree

```
Need a different button/badge/etc style?
├── Does a variant exist? (default, secondary, outline, ghost, destructive)
│   └── → Use the variant prop: <Button variant="outline">
├── Need a size variation?
│   └── → Use size prop: <Button size="sm">, <Button size="lg">
├── Is the variant needed in multiple places?
│   └── → Extend CVA in the primitive (components/ui/)
└── Is it a one-off style?
    └── → Use cn() with semantic tokens, don't override randomly
```

## Form Pattern Decision Tree

```
Building a form?
├── Use proper structure
│   ├── <form className="space-y-6">
│   │   ├── <div className="space-y-2">
│   │   │   ├── <Label htmlFor="...">
│   │   │   ├── <Input id="...">
│   │   │   └── optional: <p className="text-sm text-muted-foreground">
│   │   └── <Button type="submit">
├── Connect labels to inputs (id/htmlFor)
├── Use Input, not <input>
├── Use Label, not <label>
└── Use Button, not <button>
```

## Accessibility Decision Tree

```
Is this interactive component accessible?
├── Does it have proper ARIA labels?
│   └── Icon-only buttons need aria-label
├── Are focus states visible?
│   └── Should have ring-ring on focus-visible
├── Is keyboard navigation working?
│   └── Radix handles this if using shadcn primitives
├── Does it trap focus correctly (modals/dialogs)?
│   └── Radix handles this if using Dialog/Sheet
└── Is portal layering correct (z-index)?
    └── Check overlay blocks background interaction
```

## Anti-Patterns

### ❌ Business Logic in Primitives
```tsx
// Bad - components/ui/product-button.tsx
export function ProductButton({ product }) {
  const handleAddToCart = async () => { /* ... */ }  // ❌ Logic in primitive
}

// Good - components/shared/add-to-cart-button.tsx
export function AddToCartButton({ product }) {
  const handleAddToCart = async () => { /* ... */ }  // ✅ Logic in composite
  return <Button onClick={handleAddToCart}>Add to Cart</Button>
}
```

### ❌ Native Elements Instead of Primitives
```tsx
// Bad
<button className="rounded px-4 py-2">Click</button>
<input type="text" className="border rounded" />

// Good
<Button>Click</Button>
<Input type="text" />
```

### ❌ Inline Style Overrides
```tsx
// Bad - breaks theming
<Button className="bg-blue-500 hover:bg-blue-600">

// Good - use variant or semantic tokens
<Button variant="default">
```

## Severity Classification

| Pattern | Severity | Reason |
|---------|----------|--------|
| App imports in components/ui/ | Critical | Breaks primitive boundary |
| Business logic in primitives | High | Architecture violation |
| Native elements instead of shadcn | Medium | Consistency, a11y |
| Inline style overrides | Medium | Theming, maintenance |
| Missing label associations | Low | Accessibility |

## Quick Regex Checks

```bash
# Boundary violations
rg -n "from ['\"]@/app/|from ['\"]\\.{1,2}/.*app/" components/ui

# Heavy deps in primitives
rg -n "\\b(supabase|stripe|createClient)\\b" components/ui

# i18n in primitives (should be in composites)
rg -n "\\bnext-intl\\b|\\buseTranslations\\b" components/ui

# Native elements (might need shadcn)
rg -n "<button|<input |<label " components --glob "*.tsx"

# Hooks in ui/ (primitives should be mostly stateless)
rg -n "\\b(useEffect|useState|useMemo|createContext)\\b" components/ui
```
