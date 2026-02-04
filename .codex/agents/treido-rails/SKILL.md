---
name: treido-rails
description: Project guardrails and non-negotiables for Treido marketplace. Tech stack rules, file organization, security, CI/CD. Triggers on convention, rule, standard, AGENTS.md, file structure, naming, imports, exports, lint, format, commit, PR, review, security, env, secrets, approve, forbidden, required.
---

# treido-rails

> Enforce Treido project rules and conventions. Short but strict.

## CRITICAL: Non-Negotiables

### 1. No palette classes
```tsx
// ❌ FORBIDDEN
className="text-blue-500 bg-slate-100"

// ✅ REQUIRED
className="text-primary bg-muted"
```

### 2. No gradients
```tsx
// ❌ FORBIDDEN
className="bg-gradient-to-r from-blue-500 to-purple-500"

// ✅ REQUIRED
className="bg-primary"  // Solid colors only
```

### 3. No arbitrary values
```tsx
// ❌ FORBIDDEN
className="w-[237px] p-[13px] text-[15px]"

// ✅ REQUIRED
className="w-60 p-3 text-sm"  // Use scales or tokens
```

### 4. All copy via next-intl
```tsx
// ❌ FORBIDDEN
<p>Add to cart</p>

// ✅ REQUIRED
const t = useTranslations('Product');
<p>{t('addToCart')}</p>
```

### 5. UI primitives from components/ui/*
```tsx
// ❌ FORBIDDEN
<button className="btn">Click</button>

// ✅ REQUIRED
import { Button } from '@/components/ui/button';
<Button>Click</Button>
```

### 6. Server Components by default
```tsx
// ❌ FORBIDDEN (without justification)
'use client';

export default function StaticPage() {
  return <div>No interactivity needed</div>;
}

// ✅ REQUIRED: Only use 'use client' when needed
```

### 7. No root middleware.ts
```tsx
// ❌ FORBIDDEN
// middleware.ts at root

// ✅ REQUIRED
// proxy.ts (Treido's middleware pattern)
```

## CRITICAL: Approval Required

Pause and ask for explicit approval before:

1. **Database schema changes** (migrations)
2. **Auth flow modifications**
3. **Payment/checkout changes**
4. **Destructive operations** (DELETE, DROP)
5. **Environment variable changes**
6. **New dependencies** (npm packages)

## HIGH: File Organization

### App directory
```
app/
├── [locale]/           # Localized routes
│   ├── page.tsx        # Page components
│   └── layout.tsx      # Layouts
├── actions/            # Server Actions
├── api/               # API routes
└── auth/              # Auth routes (non-localized)
```

### Components directory
```
components/
├── ui/                # shadcn primitives (DO NOT EDIT)
├── shared/            # App-level composites
├── layout/            # App shells
├── navigation/        # Nav components
└── [feature]/         # Feature-specific
```

### Lib directory
```
lib/
├── supabase/          # Supabase clients
├── utils/             # Pure utilities
├── validations/       # Zod schemas
└── constants/         # App constants
```

## HIGH: Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase, `use` prefix | `useCart.ts` |
| Utilities | camelCase | `formatPrice.ts` |
| Constants | SCREAMING_SNAKE | `MAX_UPLOAD_SIZE` |
| Types | PascalCase | `Product`, `CartItem` |
| Route files | kebab-case | `product-detail/page.tsx` |

## HIGH: Import Order

```tsx
// 1. React/Next
import { useState } from 'react';
import Image from 'next/image';

// 2. Third-party
import { useTranslations } from 'next-intl';

// 3. Internal aliases
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

// 4. Relative
import { ProductCard } from './product-card';

// 5. Types
import type { Product } from '@/types';
```

## HIGH: TypeScript Rules

```tsx
// ✅ REQUIRED: Explicit return types for exports
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ REQUIRED: No `any`
function process(data: unknown) { }  // Use unknown

// ✅ REQUIRED: Use satisfies for type checking
const config = {
  theme: 'dark',
} satisfies Config;
```

## MEDIUM: Git Conventions

### Branch naming
```
feature/add-wishlist
fix/cart-total-calculation
refactor/product-card-component
docs/api-documentation
```

### Commit messages
```
feat: add wishlist functionality
fix: correct cart total calculation
refactor: simplify product card component
docs: update API documentation
chore: update dependencies
```

## MEDIUM: Security Rules

### No secrets in code
```tsx
// ❌ FORBIDDEN
const apiKey = 'sk_live_abc123';

// ✅ REQUIRED
const apiKey = process.env.API_KEY;
```

### Validate all inputs
```tsx
// ✅ REQUIRED: Zod validation
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Sanitize user content
```tsx
// ❌ FORBIDDEN
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ REQUIRED: Use sanitization or avoid
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

## LOW: Code Quality

### Run before PR
```bash
pnpm lint        # ESLint
pnpm typecheck   # TypeScript
pnpm test:unit   # Unit tests
```

### File size limits
- Components: < 300 lines
- Pages: < 200 lines
- Utils: < 100 lines

## Quick Reference

```
✗ Palette classes (blue-500, slate-100)
✗ Gradients (bg-gradient-to-*)
✗ Arbitrary values ([237px], [#abc])
✗ Hardcoded strings (user-facing)
✗ any type
✗ console.log in production
✗ Secrets in code

✓ Semantic tokens (primary, muted)
✓ next-intl for all copy
✓ shadcn/ui primitives
✓ Server Components default
✓ Type safety
✓ Zod validation
```

## Related Docs

- `docs/WORKFLOW.md` — Full workflow spec
- `AGENTS.md` — Project entry point
- `.codex/skills/treido-tailwind-v4` — Token details
