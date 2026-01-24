# Opus Boundaries — Import Rules & Violations

Strict import rules that maintain architectural integrity. Violations here cause cascading problems.

---

## The Golden Rules

### Rule 1: UI Primitives Are Islands
```typescript
// components/ui/* can ONLY import:
✅ Other components/ui/* files
✅ @radix-ui/* (shadcn dependencies)
✅ class-variance-authority, clsx, tailwind-merge
✅ lucide-react icons
✅ lib/utils.ts (cn helper only)

// components/ui/* must NEVER import:
❌ @/app/*
❌ @/hooks/*
❌ @/components/shared/*
❌ @/components/layout/*
❌ @/lib/supabase/*
❌ Any server-side code
```

**Status**: ✅ VERIFIED — No violations found via grep

---

### Rule 2: Route-Private Code Stays Private
```typescript
// _components/, _actions/, _lib/ are ONLY imported within their route group

// ✅ ALLOWED
// In app/[locale]/(sell)/sell/page.tsx:
import { SellForm } from '../_components/sell-form'

// ❌ FORBIDDEN
// In app/[locale]/(main)/search/page.tsx:
import { SellForm } from '@/app/[locale]/(sell)/_components/sell-form'
```

**Status**: ⚠️ NOT VERIFIED — Need to scan for violations

---

### Rule 3: Lib Is Pure
```typescript
// lib/* must NEVER import:
❌ @/app/*
❌ @/components/*
❌ React hooks (useState, useEffect, etc.)
❌ next/navigation, next/headers (use in server actions instead)

// lib/* can import:
✅ Other lib/* files
✅ External packages (zod, date-fns, etc.)
✅ @supabase/* clients
✅ Type definitions
```

**Status**: ✅ ASSUMED CLEAN — Core architectural rule

---

### Rule 4: Hooks Don't Fetch
```typescript
// hooks/* should NOT:
❌ Import server actions directly
❌ Call fetch() for data
❌ Import from @/app/*

// hooks/* should:
✅ Accept data via props/parameters
✅ Manage local state
✅ Return state + handlers
```

**Rationale**: Data fetching belongs in Server Components or server actions, not hooks.

---

### Rule 5: Shared Components Are Dumb
```typescript
// components/shared/* should:
✅ Receive data as props
✅ Emit events via callbacks
✅ Import from ui/*, hooks/*, lib/utils

// components/shared/* should NOT:
❌ Import server actions
❌ Fetch data internally
❌ Import route-private code
```

---

## Import Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     app/[locale]/(group)/                    │
│                      Route Components                        │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│ │ _components │  │  _actions   │  │    _lib     │          │
│ └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ can import ↓
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 components/layout/*                          │
│                 (headers, nav, sidebars)                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ can import ↓
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              components/shared/* + mobile/* + desktop/*      │
│                    (domain composites)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ can import ↓
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    components/ui/*                           │
│                   (shadcn primitives)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ can import ↓
                            ▼
┌─────────────────────────────────────────────────────────────┐
│          lib/* (utilities) + hooks/* (React hooks)          │
└─────────────────────────────────────────────────────────────┘
```

---

## Server/Client Boundary

### Server Components (default in App Router)
```typescript
// Can use:
✅ async/await
✅ Direct database queries
✅ cookies(), headers()
✅ Server actions

// Cannot use:
❌ useState, useEffect, useRef
❌ onClick, onChange handlers
❌ Browser APIs (localStorage, window)
```

### Client Components (`'use client'`)
```typescript
// Can use:
✅ useState, useEffect, useRef
✅ Event handlers
✅ Browser APIs

// Cannot use:
❌ async component functions
❌ Direct database queries
❌ cookies(), headers()
```

### The Boundary Rule
```typescript
// Server actions passed to client components:
// ✅ CORRECT
// server-component.tsx
import { deleteProduct } from '@/app/actions/products'
<ClientButton onDelete={deleteProduct} />

// client-button.tsx
'use client'
export function ClientButton({ onDelete }) {
  return <button onClick={() => onDelete(id)}>Delete</button>
}

// ❌ WRONG - importing server action in client component
'use client'
import { deleteProduct } from '@/app/actions/products' // ❌
```

---

## Violation Detection Scripts

### Check for route-private cross-imports
```bash
# Find _components imports outside their route group
grep -r "from.*/_components" --include="*.tsx" --include="*.ts" app/ | \
  grep -v "from '\.\." | \
  grep -v "from \"\.\.
```

### Check for lib importing from app
```bash
grep -r "from.*@/app" --include="*.ts" lib/
```

### Check for hooks importing from app
```bash
grep -r "from.*@/app" --include="*.ts" hooks/
```

### Check for ui importing from hooks/app
```bash
grep -r "from.*@/hooks\|from.*@/app" --include="*.tsx" components/ui/
```

---

## Known Violations to Fix

### Potential: Server actions in shared components
```
# Need to audit:
components/shared/product/product-card.tsx
components/shared/wishlist/*
```

### Potential: Cross-group _component imports
```
# Need to scan all route groups
```

---

## Boundary Enforcement Checklist

- [ ] Run `grep` for `@/app` in `components/ui/` — expect 0 results
- [ ] Run `grep` for `@/hooks` in `components/ui/` — expect 0 results
- [ ] Run `grep` for `_components` cross-group imports — expect 0 results
- [ ] Run `grep` for `@/app` in `lib/` — expect 0 results
- [ ] Audit `components/shared/` for server action imports
- [ ] Verify all `'use client'` components receive actions as props

---

## Adding New Code Checklist

When creating new files:

1. **New UI primitive** → `components/ui/` (shadcn only)
2. **New shared component** → `components/shared/{domain}/`
3. **New route-private component** → `app/[locale]/(group)/_components/`
4. **New hook** → `hooks/use-{name}.ts`
5. **New utility** → `lib/{domain}.ts` or `lib/utils/{name}.ts`
6. **New server action** → `app/actions/{domain}.ts`
7. **New data query** → `lib/data/{domain}.ts`

Always verify imports follow the hierarchy before committing.

---

## ESLint Rule Recommendations

Consider adding these rules to enforce boundaries:

```javascript
// eslint.config.mjs (not implemented yet)
{
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        // Prevent ui/ from importing app code
        {
          group: ['@/app/*'],
          message: 'components/ui cannot import from app/'
        },
        // Prevent lib/ from importing components
        {
          group: ['@/components/*'],
          message: 'lib cannot import from components/'
        }
      ]
    }]
  }
}
```

---

## Related Documentation

- Engineering rules: `docs/ENGINEERING.md`
- Architecture audit: `codex-xhigh/ARCHITECTURE-AUDIT.md`
- Next.js audit: `codex-xhigh/nextjs/audit.md`
