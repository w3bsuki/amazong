# TypeScript Decision Tree

Quick decision framework for auditing TypeScript usage in Treido.

## Unsafe Pattern Detection

```
Is this an unsafe TypeScript pattern?
├── `as any` cast?
│   └── ❌ HIGH — Remove or justify with comment
├── `as unknown as T` double cast?
│   └── ❌ HIGH — Usually hides a design problem
├── @ts-ignore / @ts-nocheck?
│   └── ❌ MEDIUM — Prefer @ts-expect-error with explanation
├── @ts-expect-error without comment?
│   └── ⚠️ WARN — Add explanation of why it's needed
├── Implicit any (missing type)?
│   └── ⚠️ WARN — Add explicit type
└── `any` in exported API?
    └── ❌ HIGH — Never export any; callers lose safety
```

## JSON Parsing Decision Tree

```
Parsing JSON or external data?
├── Raw JSON.parse() without validation?
│   └── ❌ HIGH — Add zod schema validation
├── Casting parse result as T?
│   └── ❌ HIGH — Validate with zod first
├── API response without type guard?
│   └── ⚠️ WARN — Add runtime validation
├── External data (webhooks, user input)?
│   └── zod.parse() required
└── zod schema with .parse() or .safeParse()?
    └── ✅ PASS
```

## Type Boundary Safety

```
Is this a server/client boundary?
├── Client component importing server type?
│   ├── Type includes server-only deps?
│   │   └── ❌ FAIL — Create shared type or DTO
│   └── Pure type (no runtime deps)?
│       └── ✅ PASS
├── Server action returning data?
│   ├── Returns `any`?
│   │   └── ❌ HIGH — Add return type
│   └── Returns typed result?
│       └── ✅ PASS
└── Shared types in lib/types/?
    ├── Imports server-only modules?
    │   └── ❌ FAIL — Move to server-only file
    └── Pure types only?
        └── ✅ PASS
```

## Export API Quality

```
Is this an exported function?
├── Missing return type?
│   └── ⚠️ WARN — Add explicit return type for stability
├── Uses generic `object` or `Function`?
│   └── ❌ MEDIUM — Use specific types
├── Uses `Record<string, any>`?
│   └── ⚠️ WARN — Consider stricter value type
├── Discriminated union for states/variants?
│   └── ✅ PASS (preferred pattern)
└── Clear, documented interface?
    └── ✅ PASS
```

## Common Type Patterns

### Discriminated Unions (Preferred)
```typescript
// ✅ Good — clear state handling
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// ❌ Bad — unclear nullability
type Result<T> = { data: T | null; error: string | null }
```

### Zod Inference (Preferred)
```typescript
// ✅ Good — single source of truth
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
})
type Product = z.infer<typeof ProductSchema>

// ❌ Bad — duplicate definition
interface Product { id: string; name: string; price: number }
// + separate validation logic
```

### Type Guards
```typescript
// ✅ Good — runtime safety
function isProduct(data: unknown): data is Product {
  return ProductSchema.safeParse(data).success
}

// ❌ Bad — type assertion without check
const product = data as Product
```

## Severity Classification

| Pattern | Severity | Reason |
|---------|----------|--------|
| `as any` in production code | High | Bypasses type safety |
| @ts-ignore without comment | High | Hidden problems |
| Unvalidated JSON.parse | High | Runtime crash risk |
| `any` in exported API | High | Spreads unsafety |
| Missing return type on exported fn | Medium | Inference instability |
| @ts-expect-error without reason | Medium | Unclear intent |
| Generic `object` type | Low | Could be stricter |
| Record<string, any> | Low | Consider narrowing |

## Quick Regex Checks

```bash
# Direct unsafe patterns
rg -n "\bas any\b|@ts-ignore|@ts-nocheck|@ts-expect-error" app components lib --glob "*.ts" --glob "*.tsx"

# any in type positions
rg -n "\b:any\b|\bany\[\]" app components lib --glob "*.ts" --glob "*.tsx"

# JSON parsing
rg -n "\bJSON\.parse\(" app components lib

# Generic bad types
rg -n ": object\b|: Function\b|Record<string, any>" app components lib --glob "*.ts"

# Missing explicit returns on exports
rg -n "^export (async )?function \w+\([^)]*\)\s*{" app lib --glob "*.ts"
```

## Gate Commands

```bash
# Primary check
pnpm -s typecheck

# If available
pnpm -s ts:gate
```
