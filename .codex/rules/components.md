---
paths:
  - "components/**/*.tsx"
  - "components/**/*.ts"
---

# Component Rules (Auto-Applied)

These rules apply automatically when editing any file in `components/`.

## Location Invariants

| Folder | Contains | Forbidden |
|--------|----------|-----------|
| `components/ui/` | shadcn primitives only | App logic, data fetching, lib imports |
| `components/shared/` | Reusable composites | Route-specific logic |
| `components/layout/` | Layout shells | Business logic |

## Styling Invariants

✅ **Allowed**:
```tsx
className="bg-background text-foreground border-border"
className="hover:bg-hover focus-visible:ring-2"
```

❌ **Forbidden**:
```tsx
className="bg-gray-100"          // palette color
className="bg-gradient-to-r"     // gradient
className="w-[500px]"            // arbitrary value
className="bg-primary/10"        // opacity hack
```

## Import Invariants

```tsx
// ✅ Correct
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shared/product-card';

// ❌ Wrong
import { Button } from '@/components/ui';  // barrel import
import { getProduct } from '@/lib/data';   // data in component
```

## Server/Client Invariants

- Default to Server Components (no directive)
- Add `'use client'` only for: hooks, events, browser APIs
- Keep client components small and focused

## Verification

See `docs/WORKFLOW.md` for the standard gate checklist.
